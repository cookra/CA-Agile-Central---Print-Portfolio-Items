Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    logger: new Rally.technicalservices.Logger(),
    items: [
        {xtype:'container',itemId:'message_box'},
        {xtype:'container',itemId:'display_box', margin: 5},
        {xtype:'tsinfolink'}
    ],
    launch: function() {
        if (typeof(this.getAppId()) == 'undefined' ) {
            // not inside Rally
            this._showExternalSettingsDialog(this.getSettingsFields());
        } else {
            this._getData();
        }
    },
    _getData: function() {
        this.down('#message_box').update();
    
        this._getPortfolioItemNames().then({
            scope: this,
            success: function(pi_paths) {
                if ( pi_paths.length > 0 ) {
                    this._getPITreeStore(pi_paths);
                }
            },
            failure: function(error) {
                this.down('#message_box').update(error);
            }
        });
    },
    _getPortfolioItemNames:function() {
        var deferred = Ext.create('Deft.Deferred');

        this.calculate_story_field_name = this.getSetting('calculate_story_field_name');
        this.calculate_defect_field_name = this.getSetting('calculate_defect_field_name');
        this.calculate_original_field_name = this.getSetting('calculate_original_field_name');
        this.include_defects = this.getSetting('include_defects');
        
        if ( this._needsSettings() ) {
            deferred.reject("Select 'Edit App Settings' from the gear menu to configure fields to use for calculations");
        } else {
            Ext.create('Rally.data.wsapi.Store',{
                model:'TypeDefinition',
                filters: [{property:'TypePath',operator:'contains',value:'PortfolioItem/'}],
                sorters: [{property:'Ordinal',direction:'Desc'}],
                autoLoad: true,
                listeners: {
                    scope: this,
                    load: function(store,records){
                        var pi_names = [];
                        Ext.Array.each(records,function(record){
                            pi_names.push(Ext.util.Format.lowercase(record.get('TypePath')));
                        });
                        deferred.resolve(pi_names);
                    }
                }
            });
        }
        return deferred.promise;
    },
    _needsSettings: function() {
        if ( typeof(this.calculate_story_field_name) == 'undefined' ) {
            this.logger.log("Missing field on story" ) ;
            return true;
        }
        if ( typeof(this.calculate_defect_field_name) == 'undefined' ) {
            this.logger.log("Missing field on defect");
            return true;
        } 
        if ( typeof(this.calculate_original_field_name) == 'undefined' ) {
            this.logger.log("Missing original value field");
            return true;
        } 
        return false;
  
    },
    _mask: function(message){
        this.logger.log("Mask: ", message);
        if ( this.sparkler ) { this.sparkler.destroy(); }
        this.sparkler = new Ext.LoadMask(this, {msg:message});  
        this.sparkler.show();
    },
    _unmask: function() {
        if ( this.sparkler ) { this.sparkler.hide(); }
    },
    _getFieldsToFetch: function() {
        var fields_to_fetch =  ['FormattedID','Name', 'State','Children',this.calculate_original_field_name,'PlannedStartDate','PlannedEndDate'];
        
        var additional_fields = this.getSetting('additional_fields_for_pis');
        if ( typeof(additional_fields) == "string" ) {
            additional_fields = additional_fields.split(',');
        }
        
        Ext.Array.each(additional_fields, function(field) {
            
            if ( typeof(field) == 'object' ) {
                fields_to_fetch.push(field.get('name'));
            } else {
                fields_to_fetch.push(field);
            }
        });
        return fields_to_fetch;
    },
    _getPITreeStore: function(pi_paths) {
        var me = this;
        this.logger.log("_getPITreeStore",pi_paths);
        this._mask("Gathering Portfolio Item data...");
        
        Ext.create('Rally.data.wsapi.Store', {
            model: pi_paths[0],
            autoLoad: true,
            listeners: {
                scope: this,
                load: function(store, top_pis, success) {
                    var top_pi_hashes = [];
                    var promises = [];
                    Ext.Array.each(top_pis,function(top_pi){
                        var pi_data = top_pi.getData();
                        pi_data.__original_value = top_pi.get(me.calculate_original_field_name);
                        pi_data.leaf = true;
                        if ( top_pi.get('Children') && top_pi.get('Children').Count > 0 ) {
                            pi_data.leaf = false;
                            pi_data.expanded = false;
                            pi_data.__is_top_pi = true;
                            promises.push( me._getChildren(pi_data,pi_paths) );
                        }
                        top_pi_hashes.push(pi_data);
                    });
                    
                    
                    // extend the model to add additional fields
                    var additional_fields = this.getSetting('additional_fields_for_pis');
                    if ( typeof(additional_fields) == "string" ) {
                        additional_fields = additional_fields.split(',');
                    }
                    
                    var fields = [];
                    Ext.Array.each(additional_fields, function(field) {
                        
                        if ( typeof(field) == 'object' ) {
                            fields.push(field.get('name'));
                        } else {
                            fields.push(field);
                        }
                    });
                        
                    var model = {
                        extend: 'TSTreeModel',
                        fields: fields
                    };
                    
                    Ext.define('TSTreeModelWithAdditions', model);
                    
                    Deft.Promise.all(promises).then({
                        scope: this,
                        success: function(node_hashes){
                            this._mask("Structuring Data into Tree...");
                            var tree_store = Ext.create('Ext.data.TreeStore',{
                                model: TSTreeModelWithAdditions,
                                root: {
                                    expanded: false,
                                    children: top_pi_hashes
                                }
                            });
                            this._addTreeGrid(tree_store);
                        },
                        failure:function (error) {
                            alert(error);
                        }
                    });
                    
                }
            },
            fetch:me._getFieldsToFetch()
        });
    },
    _getChildren:function(node_hash,pi_paths) {
        var deferred = Ext.create('Deft.Deferred');
        var me = this;
        this._mask("Gathering Descendant Information...");
        Ext.create('Rally.data.wsapi.Store',{
            model: this._getChildModelForItem(node_hash,pi_paths),
            filters: [
                this._getChildFilterForItem(node_hash,pi_paths)
            ],
            fetch: ['FormattedID','Name','DirectChildrenCount','Children','AcceptedDate','ScheduleState','Defects',me.calculate_story_field_name],
            context: { project: null },
            autoLoad: true,
            listeners: {
                scope: this,
                load: function(store, records) {
                    var child_hashes = [];
                    var promises = [];
                    var total_rollup = 0;
                    Ext.Array.each(records,function(record){
                        var record_data = record.getData();
                        record_data.leaf = true;

                        if ( record.get('Children') && record.get('Children').Count > 0 ) {
                            record_data.leaf = false;
                            record_data.expanded = false;
                            promises.push( me._getChildren(record_data,pi_paths) );
                        } else if ( record.get('DirectChildrenCount') && record.get('DirectChildrenCount') > 0)  {
                            record_data.leaf = false;
                            record_data.expanded = false;
                            promises.push( me._getChildren(record_data,pi_paths) );
                        }
                        
                        if ( me.include_defects && record.get('Defects') && record.get('Defects').Count > 0 ) {
                            record_data.leaf = false;
                            promises.push( me._getDefects(record_data) );
                        }
                        
                        // set value for calculating field
                        record_data.__rollup = record.get(me.calculate_story_field_name);
                        if ( me._isAccepted(record_data) ) {
                            record_data.__accepted_rollup = record.get(me.calculate_story_field_name);
                        }
                        child_hashes.push(record_data);
                    });
                    
                    if ( !node_hash.children ) {
                        node_hash.children = [];
                    }
                    node_hash.children = Ext.Array.push(node_hash.children,child_hashes);
                    
                    if ( promises.length > 0 ) {
                        Deft.Promise.all(promises).then({
                            scope: this,
                            success: function(records){
                                node_hash.__rollup = this._calculateRollup(node_hash,child_hashes,'__rollup');
                                node_hash.__accepted_rollup = this._calculateRollup(node_hash,child_hashes,'__accepted_rollup');
                                deferred.resolve(node_hash);
                            },
                            failure: function(error) {
                                deferred.reject(error);
                            }
                        });
                    } else {
                        node_hash.__rollup = this._calculateRollup(node_hash,child_hashes,'__rollup');
                        node_hash.__accepted_rollup = this._calculateRollup(node_hash,child_hashes,'__accepted_rollup');
                        deferred.resolve();
                    }
                }
            }
        });
        return deferred.promise;
    },
    _getDefects:function(node_hash) {
        var deferred = Ext.create('Deft.Deferred');
        var me = this;
        Ext.create('Rally.data.wsapi.Store',{
            model: 'Defect',
            filters: [
                this._getDefectFilterForItem(node_hash)
            ],
            fetch: ['FormattedID','Name','AcceptedDate','State', me.calculate_defect_field_name],
            context: { project: null },
            autoLoad: true,
            listeners: {
                scope: this,
                load: function(store, records) {
                    var total_rollup = 0;
                    var child_hashes = [];
                    Ext.Array.each(records,function(record){
                        var record_data = record.getData();
                        record_data.leaf = true;
                        
                        // set value for calculating field
                        record_data.__rollup = record.get(me.calculate_defect_field_name);
                        me.logger.log("DEFECT ", me.calculate_defect_field_name, record);
                        if ( me._isAccepted(record_data) && me._isClosed(record_data )) {
                            record_data.__accepted_rollup = record.get(me.calculate_defect_field_name);
                        }
                        child_hashes.push(record_data);
                    });
                    if ( !node_hash.children ) {
                        node_hash.children = [];
                    }
                    node_hash.children = Ext.Array.push(node_hash.children,child_hashes);
                    
                    node_hash.__rollup = this._calculateRollup(node_hash,child_hashes,'__rollup');
                    node_hash.__accepted_rollup = this._calculateRollup(node_hash,child_hashes,'__accepted_rollup');
                    deferred.resolve();
                }
            }
        });
        return deferred.promise;
    },
    _isClosed: function(record_data) {
        var closed = false; 
        if ( record_data.AcceptedDate !== null && record_data.State === "Closed" ) {
            closed = true;
        }
        return closed;
    },
    _isAccepted: function(record_data) {
        var accepted = false; 
        if ( record_data.AcceptedDate !== null ) {
            accepted = true;
        }
        return accepted;
    },
    _calculateRollup: function(node_hash,child_hashes,field_name) {
        var me = this;
        this._mask("Calculating Rollup...");
        // roll up the data
        var total_rollup = 0;
        /*
         * when a story has only defects, it might be that we want to add its 
         * value to the defects' values
         * but when the defect has children and defects, we want only the children+defects
         */
        var original_value = node_hash[field_name] || 0;
        var has_child_stories = false;
        this.logger.log("calculating rollup for ", node_hash.FormattedID, node_hash);
        Ext.Array.each(child_hashes,function(child){
            var rollup_value = child[field_name] || 0;
            me.logger.log(" ----- ", rollup_value);
            total_rollup += rollup_value;
            if ( child._type === "hierarchicalrequirement" ) {
                has_child_stories = true;
            }
        });
        
        if ( !has_child_stories ) {
            total_rollup += original_value;
        }
        
        return total_rollup;
    },
    _getColumns: function() {
        var me = this;
        
        var name_renderer = function(value,meta_data,record) {
            return me._nameRenderer(value,meta_data,record);
        }
        
        var columns = [
            {
                xtype: 'treecolumn',
                text: ' ',
                dataIndex: 'FormattedID',
                itemId: 'tree_column',
                renderer: name_renderer,
                width: this.getSetting('tree_column') || 200
            },
            {
                dataIndex: '__original_value',
                text: TSGlobals.original_pert_header,
                itemId:'original_pert_column',
                width: this.getSetting('original_pert_column') || 100,
                menuDisabled: true
            },
            {
                dataIndex: '__progress_by_original',
                text: TSGlobals.progress_by_original_header,
                itemId: 'progress_by_original_column',
                width: this.getSetting('progress_by_original_column') || 100,
                renderer: function(value,meta_data,record) {
                    if ( record.get('__is_top_pi') ) {
                        return Ext.create('Rally.technicalservices.ProgressBarTemplate',{
                            numeratorField: '__accepted_rollup',
                            denominatorField: '__original_value',
                            percentDoneName: '__original_value'
                        }).apply(record.getData());
                    } else {
                        return "";
                    }
                    
                },
                menuDisabled: true
            },
            {
                dataIndex: '__progress_by_rollup',
                text: TSGlobals.progress_by_rollup_header,
                itemId: 'progress_rollup_column',
                width: this.getSetting('progress_rollup_column') || 100,
                renderer: function(value,meta_data,record) {
                    return Ext.create('Rally.technicalservices.ProgressBarTemplate',{
                        numeratorField: '__accepted_rollup',
                        denominatorField: '__rollup',
                        percentDoneName: '__rollup'
                    }).apply(record.getData());
                    
                },
                menuDisabled: true
            },
            {
                dataIndex: '__rollup',
                text: TSGlobals.total_rollup_header,
                itemId:'total_rollup_column',
                width: this.getSetting('total_rollup_column') || 100,
                renderer: Ext.util.Format.numberRenderer('0.00'),
                menuDisabled: true
            },
            {
                dataIndex: '__accepted_rollup',
                text: TSGlobals.pert_completed_header,
                itemId:'pert_completed_column',
                width: this.getSetting('pert_completed_column') || 100,
                renderer: Ext.util.Format.numberRenderer('0.00'),
                menuDisabled: true
            },
            {
                dataIndex: '__calculated_remaining',
                text: TSGlobals.pert_remaining_header,
                itemId:'pert_remaining_column',
                width: this.getSetting('pert_remaining_column') || 100,
                renderer: function(value,meta_data,record){
                    return Ext.util.Format.number(value, '0.00');
                },
                menuDisabled: true
            },
            {
                dataIndex: '__calculated_delta',
                text: TSGlobals.delta_header,
                itemId:'delta_column',
                width: this.getSetting('delta_column') || 100,
                renderer: function(value,meta_data,record){
                    return Ext.util.Format.number(value, '0.00');
                },
                menuDisabled: true
            }];
        
        var additional_fields = this.getSetting('additional_fields_for_pis');
        if ( typeof(additional_fields) == "string" ) {
            additional_fields = additional_fields.split(',');
        }
        Ext.Array.each( additional_fields, function(additional_field){
            var column_header = additional_field;
            var column_index = additional_field;
            
            if ( typeof(additional_field) == 'object' ) {
                column_header = additional_field.get('displayName');
                column_index = additional_field.get('name');
            } 
            var additional_column = {
                dataIndex: column_index,
                text: column_header,
                itemId:column_index + '_column',
                width: me.getSetting(column_index + '_column') || 100,
                menuDisabled: true
            };
            columns.push(additional_column);
        });
        me.logger.log("Making Columns ", columns);
        return columns;
    },
    _addTreeGrid: function(tree_store) {
        this.logger.log("creating TreeGrid");
        var me = this;
        this._unmask();
        
        var pi_tree = this.down('#display_box').add({
            xtype:'treepanel',
            store: tree_store,
            cls: 'rally-grid',
            rootVisible: false,
            enableColumnMove: false,
            listeners: {
                scope: this,
                columnresize: this._saveColumnSizes
            },
            columns: this._getColumns()
        });
    },
    _saveColumnSizes: function(header_container,column,width){
        this.logger.log("change column size", header_container,column.itemId, width);
        var settings = {};
        settings[column.itemId] = width;
        
        this.updateSettingsValues({
            settings: settings
        });
    },
    _nameRenderer: function(value,meta_data,record) {
        var me = this;
        return value + ": " + record.get('Name');
    },
    _getChildModelForItem: function(node_hash,pi_paths){
        var parent_model = Ext.util.Format.lowercase(node_hash._type);
        var child_type = "PortfolioItem";
        
        if ( Ext.Array.indexOf(pi_paths,parent_model) == pi_paths.length - 1 ) {
            child_type = 'HierarchicalRequirement';
        } else if (Ext.Array.indexOf(pi_paths,parent_model) == - 1)  {
            child_type = 'HierarchicalRequirement';
        }
        
        return child_type;
    },
    _getChildFilterForItem: function(node_hash,pi_paths){
        var parent_model = Ext.util.Format.lowercase(node_hash._type);
        var child_filter = { property:'Parent.ObjectID', value: node_hash.ObjectID };
        
        if ( Ext.Array.indexOf(pi_paths,parent_model) == pi_paths.length - 1 ) {
            child_filter = { property:'PortfolioItem.ObjectID', value: node_hash.ObjectID };
        }
        
        return child_filter;
    },
    _getDefectFilterForItem: function(node_hash){
        var child_filter = { property:'Requirement.ObjectID', value: node_hash.ObjectID };
        
        return child_filter;
    },
    getSettingsFields: function() {
        var _chooseOnlyNumberFields = function(field){
            var should_show_field = true;
            var forbidden_fields = ['FormattedID','ObjectID'];
            if ( field.hidden ) {
                should_show_field = false;
            }
            if ( field.attributeDefinition ) {
                var type = field.attributeDefinition.AttributeType;
                if ( type != "QUANTITY" && type != "INTEGER" && type != "DECIMAL"  ) {
                    should_show_field = false;
                }
                if ( Ext.Array.indexOf(forbidden_fields,field.name) > -1 ) {
                    should_show_field = false;
                }
            } else {
                should_show_field = false;
            }
            return should_show_field;
        };
        
        var _ignoreTextFields = function(field){
            var should_show_field = true;
            var forbidden_fields = ['FormattedID','ObjectID','DragAndDropRank','Name'];
            if ( field.hidden ) {
                should_show_field = false;
            }
            if ( field.attributeDefinition ) {
                var type = field.attributeDefinition.AttributeType;
                if ( type == "TEXT" || type == "OBJECT" || type == "COLLECTION" ) {
                    should_show_field = false;
                }
                if ( Ext.Array.indexOf(forbidden_fields,field.name) > -1 ) {
                    should_show_field = false;
                }
            } else {
                should_show_field = false;
            }
            return should_show_field;
        };
        return [
            {
                name: 'calculate_original_field_name',
                xtype: 'rallyfieldcombobox',
                model: 'PortfolioItem',
                fieldLabel: 'Original PERT Field',
                _isNotHidden: _chooseOnlyNumberFields,
                width: 300,
                labelWidth: 150,
                readyEvent: 'ready' //event fired to signify readiness
            },
            {
                name: 'calculate_story_field_name',
                xtype: 'rallyfieldcombobox',
                model: 'HierarchicalRequirement',
                fieldLabel: 'Story PERT Field',
                width: 300,
                labelWidth: 150,
                _isNotHidden: _chooseOnlyNumberFields,
                readyEvent: 'ready' //event fired to signify readiness
            },
            {
                name: 'calculate_defect_field_name',
                xtype: 'rallyfieldcombobox',
                model: 'Defect',
                fieldLabel: 'Defect PERT Field',
                width: 300,
                labelWidth: 150,
                _isNotHidden: _chooseOnlyNumberFields,
                readyEvent: 'ready' //event fired to signify readiness
            },
            {
                name: 'include_defects',
                xtype: 'rallycheckboxfield',
                fieldLabel: 'Show Defects',
                width: 300,
                labelWidth: 150,
                value: true,
                readEvent: 'ready'
            },
            {
                name: 'additional_fields_for_pis',
                xtype: 'rallyfieldpicker',
                modelTypes: ['PortfolioItem'],
                fieldLabel: 'Additional fields for Portfolio Items:',
                _shouldShowField: _ignoreTextFields,
                width: 300,
                alwaysExpanded: false,
                autoExpand: true,
                labelWidth: 150,
                listeners: {
                    ready: function(picker){ picker.collapse(); }
                },
                readyEvent: 'ready' //event fired to signify readiness
            }
        ];
    },
    // ONLY FOR RUNNING EXTERNALLY
    _showExternalSettingsDialog: function(fields){
        var me = this;
        if ( this.settings_dialog ) { this.settings_dialog.destroy(); }
        this.settings_dialog = Ext.create('Rally.ui.dialog.Dialog', {
             autoShow: false,
             draggable: true,
             width: 400,
             title: 'Settings',
             buttons: [{ 
                text: 'OK',
                handler: function(cmp){
                    var settings = {};
                    Ext.Array.each(fields,function(field){
                        settings[field.name] = cmp.up('rallydialog').down('[name="' + field.name + '"]').getValue();
                    });
                    me.settings = settings;
                    cmp.up('rallydialog').destroy();
                    me._getData();
                }
            }],
             items: [
                {xtype:'container',html: "&nbsp;", padding: 5, margin: 5},
                {xtype:'container',itemId:'field_box', padding: 5, margin: 5}]
         });
         Ext.Array.each(fields,function(field){
            me.settings_dialog.down('#field_box').add(field);
         });
         this.settings_dialog.show();
    },
    /*
     * Override so that the settings box fits (shows the buttons)
     */
//    showSettings: function(options) {        
//        this._appSettings = Ext.create('Rally.app.AppSettings', Ext.apply({
//            fields: this.getSettingsFields(),
//            settings: this.getSettings(),
//            defaultSettings: this.getDefaultSettings(),
//            context: this.getContext(),
//            settingsScope: this.settingsScope,
//            autoScroll: true
//        }, options));
//        
//        this._appSettings.on('cancel', this._hideSettings, this);
//        this._appSettings.on('save', this._onSettingsSaved, this);
//
//        this.hide();
//        this.up().add(this._appSettings);
//
//        return this._appSettings;
//    },
    showSettings: function(options) {      
        this._appSettings = Ext.create('Rally.app.AppSettings', Ext.apply({
            fields: this.getSettingsFields(),
            settings: this.getSettings(),
            defaultSettings: this.getDefaultSettings(),
            context: this.getContext(),
            settingsScope: this.settingsScope,
            autoScroll: true,
            scope:this
        }, options));
        
        this._appSettings.on('cancel', this._hideSettings, this);
        this._appSettings.on('save', this._onSettingsSaved, this);
        this._appSettings.on('afterlayout', this.resizeIframe, this);
    
        this.hide();
        this.up().add(this._appSettings);
        
        return this._appSettings;
    },
    resizeIframe: function() {
        var iframeContentHeight = 400;    
        var container = window.frameElement.parentElement;
        if (container != parent.document.body) {
            container.style.height = iframeContentHeight + 'px';
        }
        window.frameElement.style.height = iframeContentHeight + 'px';
        return;
    }
});