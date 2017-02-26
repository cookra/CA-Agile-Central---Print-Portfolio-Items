Ext.define('PrintApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    theStore: undefined, // app level references to the store and grid for easy access in various methods
    theGrid: undefined,
    theFetch: ['FormattedID',
        'Name',
        'Project',
        'Owner',
        'Size',
        'DisplayColor',
        'State',
        'PreliminaryEstimate',
        'Parent',
        'ActualStartDate',
        'ActualEndDate',
        'PlannedStartDate',
        'PlannedEndDate',
        'c_QRWP',
        'PortfolioItemType',
        'c_OrderBookNumberOBN'
    ],
    launch: function () {
        var me = this;
        me._createLayout();
    },

    _createLayout: function () {
        var me = this;
        var theLayout = Ext.create({
            xclass: 'app.Layout',
            renderTo: Ext.getBody().dom

        });
        var viewport = me.add(theLayout);
        this._addFetchType(viewport);
    },



    _addFetchType: function (viewport) {
        console.log(viewport);
        var me = this;
        var iterComboBox = Ext.create('Rally.ui.combobox.PortfolioItemTypeComboBox', {
            itemId: 'portfolio-combobox', // we'll use this item ID later to get the users' selection
            fieldLabel: 'Select',
            labelAlign: 'left',
            width: 300,
            listeners: {
                select: function () {
                    me._loadData(viewport); // user interactivity: when they choose a value, (re)load the data
                    // console.log(' Change ', iterComboBox);
                },
                scope: me
            },
        });
        viewport.getComponent('north').add(iterComboBox);
        //console.log(me.viewport);
        //me.viewport.add(iterComboBox);
        //me.down('north').add('d'); // add the iteration list to the pulldown container so it lays out horiz, not the app!
    },



    _getFilters: function (value) {
        var theFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'PortfolioItemType',
            operation: '=',
            value: value
        });
        return theFilter;
    },
    _loadData: function (viewport) {
        console.log('Store');
        var me = this;
        var selectedItem = this.down('#portfolio-combobox').getRecord().get('_ref'); // the _ref is unique, unlike the iteration name that can change; lets query on it instead!
        var myFilter = this._getFilters(selectedItem);
        // if store exists, just load new data
        if (me.theStore) {
            me.theStore.setFilter(myFilter);
            me.theStore.load();
            // create store
        } else {
            me.theStore = Ext.create('Rally.data.wsapi.Store', { // create theStore on the App (via this) so the code above can test for it's existence!
                model: 'PortfolioItem',
                autoLoad: true, // <----- Don't forget to set this to true! heh
                filters: myFilter,
                type: 'PortfolioItem',
                listeners: {
                    load: function (myStore, myData, success) {
                        if (!me.theGrid) { // only create a grid if it does NOT already exist
                            //console.log(myData);
                            me._createResults(myData, viewport); // if we did NOT pass scope:this below, this line would be incorrectly trying to call _createGrid() on the store which does not exist.
                        }
                    },
                    scope: me // This tells the wsapi data store to forward pass along the app-level context into ALL listener functions
                },
                fetch: this.theFetch // Look in the WSAPI docs online to see all fields available!
            });
        }
    },
    _createResults: function (myData, viewport) {
        console.log('vp');
        var html = '<div>';
        for (var x = 0; x < myData.length; x++) {
            //console.log('loop');
            html += '<div>' + myData[x].raw._refObjectName + '</div>';
        }
        html += '</div>';

        //viewport.update({copy: html});
        //var centerRegion = viewport.getComponent(1);
        //centerRegion.removeAll();
        //centerRegion.
        viewport.down('#center').add(this._container(html));

        console.log('>>>>>', viewport.down('#center').add(this._container()));

    },

    _container: function (html) {
        console.log('Added Viewport');
        var viewport = Ext.create('Ext.container.Viewport', {
            layout: 'border',

            items: [{
                    region: 'center',
                    xtype: 'panel',
                    itemId: 'center',
                    id: 'xxx',
                    autoScroll: true,
                    html: html,
                },
            ]
        });
        return viewport;
    },




});