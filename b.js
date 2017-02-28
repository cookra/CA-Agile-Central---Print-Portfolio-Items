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
        var theVersion = Ext.create('App.version');
        console.log(Ext.create('App.version'));
        var me = this;
        var layout = Ext.create('Ext.container.Container', {

            layout: 'fit',
            align: 'stretch',
            height: '100%',
            layoutConfig: {
                align: 'stretch',
            },
            items: [{
                xtype: 'panel',
                width: 300,
                border: false,
                layout: 'hbox',
                html: '',
                id: 'myHeader',
                itemId: 'header',
                items: [{
                    xtype: 'rallyportfolioitemtypecombobox',
                    itemId: 'portfolio-combobox', // we'll use this item ID later to get the users' selection
                    fieldLabel: 'Select',
                    labelAlign: 'left',
                    id: 'portfolio-combobox',
                    width: 300,
                    margin: '5 5 5 5',
                    listeners: {
                        select: function () {
                            //me._loadData(this.win.down('center')); // user interactivity: when they choose a value, (re)load the data
                            // console.log(' Change ', iterComboBox);
                            me._test();
                        },
                        scope: me
                    },
                }, {
                    xtype: 'rallysearchfield',
                    itemId: 'search-field', // we'll use this item ID later to get the users' selection
                    fieldLabel: 'Select',
                    labelAlign: 'left',
                    id: 'search-field',
                    width: 300,
                    margin: '7 5 5 20',

                    listeners: {
                        click: function () {
                            //me._loadData(this.win.down('center')); // user interactivity: when they choose a value, (re)load the data
                            // console.log(' Change ', iterComboBox);
                            //me._test();
                            console.log('boom');
                        },
                        scope: me
                    }
                }],
            }, {
                xtype: 'box',
                id: 'myTarget',
                autoScroll: true,
                margin: '10 5 5 10',
                width: '100%',
                style: {
                    borderTop: '1'
                },
                autoEl: {
                    tag: 'div',
                    cls: 'myContent',
                    html: '',
                },
                flex: 1
            }]
        });
        var win = Ext.create('Ext.container.Container', {
            x: 0,
            y: 0,
            width: '100%',
            height: '100%',
            minWidth: 300,
            minHeight: 60,
            layout: 'fit',
            listeners: {
                afterrender: function () {
                    console.log('Loaded Window');
                }
            }
        });
        this.add(layout);
        //win.show();
        //layout.body.update('sdasdfasdasdfasdfasd');
        //this._addFetchType();
    },

    _test: function () {
        var myHtml = 'Searching...';
        //console.log(Ext.fly('myTarget').update(myHtml));
        this._loadData();
        //this.win
        console.log(Ext.fly('myTarget'));
        //this.
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
        var me = this;
        var selectedItem = Ext.getCmp('portfolio-combobox').getRecord().get('_ref');
        //var selectedItem = this.down('#portfolio-combobox').getRecord().get('_ref'); // the _ref is unique, unlike the iteration name that can change; lets query on it instead!
        var myFilter = this._getFilters(selectedItem);
        // if store exists, just load new data
        if (me.theStore) {
            me.theStore.setFilter(myFilter);
            me.theStore.load();
            console.log('Store');
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
                            console.log(myData);
                            me._createResults(myData); // if we did NOT pass scope:this below, this line would be incorrectly trying to call _createGrid() on the store which does not exist.
                        }
                    },
                    scope: me // This tells the wsapi data store to forward pass along the app-level context into ALL listener functions
                },
                fetch: this.theFetch // Look in the WSAPI docs online to see all fields available!
            });
        }
    },
    _createResults: function (myData) {
        html = '<div>';
        for (var x = 0; x < myData.length; x++) {
            //console.log('loop');
            html += '<div>' + myData[x].raw._refObjectName + '</div>';
        }
        html += '</div>';
        //this.add(html);
        Ext.fly('myTarget').update(html);
        //Ext.fly('myTarget').setHeight('auto');
    },

    _container: function (html) {
        var viewport = Ext.create('Ext.container.Viewport', {
            items: [{
                region: 'center',
                xtype: 'container',
                itemId: 'center',
                id: 'xxx',
                width: '100%',
                autoScroll: true,
                html: html,
                style: {
                    color: 'black'
                }
            }, ]
        });
        return viewport;
    },
});