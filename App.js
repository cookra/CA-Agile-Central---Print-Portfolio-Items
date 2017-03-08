Ext.define('MySharedData', {
    singleton: true,
    printHtml: '',
    supportArray: [],
    infoString: '',
    // Needs automating!
    portfolioType: [
        'PortfolioItem/BUStrategicObjectives',
        'PortfolioItem/STPortfolioObjectives',
        'PortfolioItem/PortfolioEpic',
        'PortfolioItem/BusinessOutcome',
        'PortfolioItem/Feature',
    ], // Portfolio Types
});

Ext.define('PrintApp', {
    extend: 'Rally.app.App',
    theStore: undefined, // app level references to the store and grid for easy access in various methods
    printHtml: null,
    theFetch: ['FormattedID',
        'Name',
        'Project',
        'Owner',
        'Size',
        'DisplayColor',
        'State',
        'PreliminaryEstimate',
        'Parent',
        'Release',
        'c_QRWP',
        '_type',
        'PortfolioItemType',
        '_refObjectName',
        'c_OrderBookNumberOBN'
    ],
    launch: function () {
        console.log('\033[2J');
        var me = this;
        var xData1 = this.getContext().getUser();
        var xData2 = this.getContext().getProject();
        var xData3 = this.getContext().getWorkspace();
        var xData4 = this.getContext().getSubscription();
        //========================================================================================================================================================================
        //
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //
        // CONTAINER
        //    
        var layout = Ext.create('Ext.container.Container', {
            layout: 'fit',
            align: 'stretch',
            height: '100%',
            layoutConfig: {
                align: 'stretch',
            },
            items: [{
                //========================================================================================================================================================================
                //
                //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                //
                // HEADER
                //                
                xtype: 'panel',
                border: false,
                layout: 'hbox',
                html: '',
                id: 'myHeader',
                itemId: 'header',
                width: '100%',
                items: [{
                    //========================================================================================================================================================================
                    //
                    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //
                    // FILTER GROUP LEFT (WORK TOGETHER)
                    //    
                    xtype: 'panel',
                    layout: 'hbox',
                    //title: 'These work together',
                    id: 'panel_Filter_Multi',
                    itemId: 'panel_Filter_Multi',
                    margin: '10 5 5 0',
                    bodyPadding: 10,
                    cls: 'mainPageGroupPanel',
                    items: [{
                        //========================================================================================================================================================================
                        //
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //
                        // USER SEARCH
                        //   
                        xtype: 'rallyusersearchcombobox',
                        storeConfig: {
                            model: 'PortfolioItem'
                        },
                        fieldLabel: 'Team Member:',
                        project: this.getContext().getProject(),
                        //value: Rally.util.Ref.getRelativeUri(this.getContext().getUser()),
                        itemId: 'user-combobox', // we'll use this item ID later to get the users' selection
                        //labelAlign: 'right',
                        id: 'user-combobox',
                        // multiSelect: true, // <------------explore this
                        margin: '0 5 0 0',
                        //emptyText: 'All Users',
                        noEntryText: '-- All --',
                        //noEntryValue: 'All',
                        defaultSelectionPosition: 'first',
                        listeners: {
                            select: function () {
                                this._mask('myInfoPanel');
                                me._kickoff('User');
                            },
                            scope: me
                        }
                    }, {
                        //========================================================================================================================================================================
                        //
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //
                        // PORTFOLIO ITEM
                        //   
                        xtype: 'rallyportfolioitemtypecombobox',
                        itemId: 'portfolio-combobox', // we'll use this item ID later to get the users' selection
                        fieldLabel: 'Select',
                        labelAlign: 'left',
                        id: 'portfolio-combobox',
                        margin: '0 5 0 0',
                        listeners: {
                            select: function () {
                                console.log('a');
                                this._mask('myInfoPanel');
                                me._kickoff('User');
                            },
                            scope: me
                        }
                    }, ]
                }, {
                    //========================================================================================================================================================================
                    //
                    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //
                    // FILTER GROUP RIGHT (STANDALONE)
                    //   
                    xtype: 'panel',
                    layout: 'hbox',
                    //title: 'Standalone',
                    id: 'panel_Filter_Single',
                    itemId: 'panel_Filter_Single',
                    margin: '10 5 5 10',
                    bodyPadding: 10,
                    items: [{
                        //========================================================================================================================================================================
                        //
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //
                        // SEARCH field
                        //
                        xtype: 'rallysearchcombobox',
                        storeConfig: {
                            model: 'PortfolioItem'
                        },
                        itemId: 'search-combobox', // we'll use this item ID later to get the users' selection
                        fieldLabel: 'Search',
                        labelAlign: 'left',
                        width: 350,
                        id: 'search-combobox',
                        margin: '0 5 0 0',
                        listeners: {
                            specialkey: function (field, e) {
                                if (e.getKey() === e.ENTER) {
                                    this._mask('myInfoPanel');
                                    me._kickoff('Search');
                                }
                            },
                            select: function () {
                                this._mask('myInfoPanel');
                                me._kickoff('Search');
                            },
                            scope: me
                        }
                    }]
                }, {
                    //========================================================================================================================================================================
                    //
                    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    //
                    // ACTIONS
                    //  
                    xtype: 'panel',
                    layout: 'hbox',
                    //title: 'Actions',
                    id: 'panel_Filter_Actions',
                    itemId: 'panel_Filter_Actions',
                    margin: '10 5 5 10',
                    bodyPadding: 10,
                    items: [{
                        //========================================================================================================================================================================
                        //
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //
                        // PRINT BUTTON
                        //
                        xtype: 'button',
                        text: 'Print Results',
                        margin: '0 5 0 5',
                        handler: this._getPrint,
                        style: {
                            background: '#00AEEF'
                        },
                    }, {
                        //========================================================================================================================================================================
                        //
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //
                        // FLEX 1
                        //
                        xtype: 'component',
                    }, {
                        //========================================================================================================================================================================
                        //
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        //
                        // SUPPORT BUTTON
                        //
                        xtype: 'button',
                        text: 'Support',
                        margin: '0 5 0 5',
                        style: {
                            background: 'red'
                        },
                        listeners: {
                            afterrender: function (v) {
                                v.el.on('click', function () {
                                    Ext.create('App.Emailer')._emailer(MySharedData.supportArray, xData1, xData2, xData3, xData4);
                                });
                            },
                            scope: me
                        }
                    }]
                }],
            }, {
                xtype: 'container',
                layout: 'fit',
                align: 'stretch',
                height: '100%',
                layoutConfig: {
                    align: 'stretch',
                },
                items: [{
                    xtype: 'box',
                    id: 'myInfoPanel',
                    autoScroll: true,
                    margin: '10 5 5 10',
                    height: 40,
                    width: '100%',

                    autoEl: {
                        tag: 'div',
                        cls: 'myInfoPanel',
                        html: '',

                    },
                    listeners: {
                        afterrender: function () {
                        },
                        scope: me
                    },
                    flex: 1,
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
                    listeners: {
                        afterrender: function () {

                        },
                        scope: me
                    },
                    flex: 1
                }]
            }, ]
        });
        this.add(layout);
    },
    _kickoff: function (type) {
        this._loadData(type);
    },
    _getFilters: function (t) {
        var theFilter, p, pp, folioFilter, userFilter;
        if (t === 'Search') {
            p = Ext.getCmp('search-combobox').getRecord().get('Name');
            theFilter = Ext.create('Rally.data.wsapi.Filter', {
                property: 'Name',
                operation: '=',
                value: p,
            });
        }
        if (t === 'User') {
            if (this.down('rallyusersearchcombobox').getValue() === null) {
                p = this.down('rallyportfolioitemtypecombobox');
                folioFilter = Ext.create('Rally.data.wsapi.Filter', {
                    property: 'PortfolioItemType',
                    operation: '=',
                    value: p.getValue(),
                });
                theFilter = folioFilter;
            } else {
                p = this.down('rallyportfolioitemtypecombobox');
                folioFilter = Ext.create('Rally.data.wsapi.Filter', {
                    property: 'PortfolioItemType',
                    operation: '=',
                    value: p.getValue(),
                });
                pp = this.down('rallyusersearchcombobox');
                userFilter = Ext.create('Rally.data.wsapi.Filter', {
                    property: 'owner',
                    value: pp.getValue(),
                });
                theFilter = folioFilter.and(userFilter);
            }
        }
        p = undefined;
        pp = undefined;
        return theFilter;
    },
    _loadData: function (type) {
        var me = this;
        var myFilter = this._getFilters(type);
        if (me.theStore) {
            me.theStore.setFilter(myFilter);
            me.theStore.load();
        } else {
            me.theStore = Ext.create('Rally.data.wsapi.Store', { // create theStore on the App (via this) so the code above can test for it's existence!
                model: 'PortfolioItem',
                autoLoad: true, // <----- Don't forget to set this to true! heh
                filters: myFilter,
                limit: Infinity,
                type: 'PortfolioItem',
                listeners: {
                    load: function (myStore, myData) {
                        me._createResults(myData); // if we did NOT pass scope:this below, this line would be incorrectly trying to call _createGrid() on the store which does not exist.
                    },
                    scope: me // This tells the wsapi data store to forward pass along the app-level context into ALL listener functions
                },
                fetch: this.theFetch // Look in the WSAPI docs online to see all fields available!
            });

        }
    },
    _createResults: function (myData) {
        var itemType;
        MySharedData.supportArray = myData;
        var html = '<div id="cards">';
        for (var x = 0; x < myData.length; x++) {
            html += Ext.create('App.Card')._build(x, myData.length, myData[x]);
            itemType = myData[x].raw._type;
        }
        html += '</div>';
        Ext.fly('myTarget').update(html);
        this._unmask();
        MySharedData.infoString += Ext.fly('myInfoPanel').update(Ext.create('App.Info')._build('header', '<style="color:blue;">Found</style> ', x, ' Portfolio items that match your search criteria'));
        MySharedData.printHtml = html;
    },
    _getPrint: function () {
        var printHtml = null;
        printHtml += Ext.create('App.Card')._print(MySharedData.printHtml);
        return printHtml;
    },
    _mask: function (target) {
        Ext.fly('myInfoPanel').update(Ext.create('App.Loader')._build('bar'));
        //Ext.fly('myTarget').update(Ext.create('App.Loader')._build('wave'));
    },
    _unmask: function () {
        if (this.sparkler) {
            this.sparkler = null;
            //this.sparkler.destroy();
        }
    },
});