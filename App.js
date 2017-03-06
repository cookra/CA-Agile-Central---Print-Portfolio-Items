Ext.define('MySharedData', {
    singleton: true,
    printHtml: '',
    supportArray: [],
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
        var gEpros = App.Emailer; // shorten global property string
        var gRpros = App.Runtime; // shorten global property string
        var layout = Ext.create('Ext.container.Container', {
            layout: 'fit',
            align: 'stretch',
            height: '100%',
            layoutConfig: {
                align: 'stretch',
            },
            items: [{
                    xtype: 'panel',
                    border: false,
                    layout: 'hbox',
                    html: '',
                    id: 'myHeader',
                    itemId: 'header',
                    listeners: {
                        add: function () {
                            console.log('@ Launch Added Panel');
                        },
                        scope: me
                    },
                    items: [{
                            xtype: 'rallyusersearchcombobox',
                            storeConfig: {
                                model: 'PortfolioItem'
                            },
                            fieldLabel: 'Filter by Owner:',
                            project: this.getContext().getProject(),
                            //value: Rally.util.Ref.getRelativeUri(this.getContext().getUser()),
                            itemId: 'user-combobox', // we'll use this item ID later to get the users' selection
                            labelAlign: 'right',
                            id: 'user-combobox',
                            // multiSelect: true, // <------------explore this
                            margin: '5 5 5 5',
                            //emptyText: 'All Users',
                            noEntryText: '-- All --',
                            //noEntryValue: 'All',
                            listeners: {
                                select: function (aa, bb, cc) {
                                    console.log('@ Launch  XXXXXXXXXXXXXXXX Added Search Combobox sending [', aa, ' ', bb, ' ', cc, ']');
                                    me._kickoff('user');
                                },
                                load: function (store) {
                                    store.add({
                                        name: 'Dummy'
                                    });
                                },
                                scope: me
                            }
                        }, {
                            xtype: 'rallyportfolioitemtypecombobox',
                            itemId: 'portfolio-combobox', // we'll use this item ID later to get the users' selection
                            fieldLabel: 'Select',
                            labelAlign: 'left',
                            id: 'portfolio-combobox',
                            margin: '5 5 5 5',
                            listeners: {
                                select: function () {
                                    console.log('@ Launch Added Portfolio Combobox');
                                    me._kickoff('user');
                                },
                                scope: me
                            }
                        }, {
                            xtype: 'rallysearchcombobox',
                            storeConfig: {
                                model: 'PortfolioItem'
                            },
                            itemId: 'search-combobox', // we'll use this item ID later to get the users' selection
                            fieldLabel: 'Search',
                            labelAlign: 'right',
                            id: 'search-combobox',
                            width: 300,
                            margin: '5 5 5 5',
                            listeners: {
                                specialkey: function (field, e) {
                                    // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                                    // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                                    if (e.getKey() === e.ENTER) {
                                        me._kickoff('search');
                                    }
                                },
                                select: function (aa, bb, cc) {
                                    console.log('@ Launch  XXXXXXXXXXXXXXXX Added Search Combobox sending [', aa, ' ', bb, ' ', cc, ']');
                                    me._kickoff('search');
                                },
                                scope: me
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Print Results',
                            margin: '5 5 5 20',
                            handler: this._getPrint,
                            listeners: {
                                add: function () {
                                    console.log('@ Launch Added Print Button');
                                },
                                scope: me
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Support',
                            margin: '5 5 5 20',
                            listeners: {
                                afterrender: function (v) {
                                    v.el.on('click', function () {
                                        var email = new gEpros._emailer(MySharedData.supportArray, xData1, xData2, xData3, xData4);
                                        console.log('@ Launch Added Support Button');
                                    });
                                },
                                scope: me
                            }
                        }
                    ],
                },
                {
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
                        add: function () {
                            console.log('@ Launch Added Content Box');
                        },
                        scope: me
                    },
                    flex: 1
                }
            ]
        });
        this.add(layout);
    },
    _kickoff: function (type) {
        this._loadData(type);
        //console.log('@ _kickoff going to _loadData');
    },
    _getFilters: function (type) {
        var theFilter, selectedItem;
        if (type === 'item' || type === 'user') {
/*
            selectedItem = Ext.getCmp('portfolio-combobox').getRecord().get('_ref');
            theFilter = Ext.create('Rally.data.wsapi.Filter', {
                property: 'PortfolioItemType',
                operation: '=',
                value: selectedItem,
            });
*/
            var folioType = this.down('rallyportfolioitemtypecombobox');
            var folioFilter = Ext.create('Rally.data.wsapi.Filter', {
                property: 'PortfolioItemType',
                operation: '=',
                value: folioType.getValue(),
            });
            var userItem = this.down('rallyusersearchcombobox');
            var userFilter = Ext.create('Rally.data.wsapi.Filter', {
                property: 'owner',
                value: userItem.getValue(),
            });
            theFilter = folioFilter.and(userFilter);
            console.log('ITEM');
        }
        if (type === 'search') {
            selectedItem = Ext.getCmp('search-combobox').getRecord().get('Name');
            theFilter = Ext.create('Rally.data.wsapi.Filter', {
                property: 'Name',
                operation: '=',
                value: selectedItem,
            });
            console.log('SEARCH');
        }
        if (type === 'user') {
            if (this.down('rallyusersearchcombobox').getValue() === null) {
                folioType = this.down('rallyportfolioitemtypecombobox');
                folioFilter = Ext.create('Rally.data.wsapi.Filter', {
                property: 'PortfolioItemType',
                operation: '=',
                value: folioType.getValue(),
            });
            theFilter = folioFilter;
            console.log('no user');
            } else {
                var folioType = this.down('rallyportfolioitemtypecombobox');
                var folioFilter = Ext.create('Rally.data.wsapi.Filter', {
                    property: 'PortfolioItemType',
                    operation: '=',
                    value: folioType.getValue(),
                });
                var userItem = this.down('rallyusersearchcombobox');
                var userFilter = Ext.create('Rally.data.wsapi.Filter', {
                    property: 'owner',
                    value: userItem.getValue(),
                });
                theFilter = folioFilter.and(userFilter);
            }
        }
        //console.log('@ _getFilters Switch [', type, '] returning [', theFilter, ' ', theFilter.operation, ' ', theFilter.value, '] to _loadData');
        return theFilter;
    },
    _loadData: function (type) {
        //console.log('@ _loadData working the store magic..');
        this._mask("Going deep, searching...");
        var me = this;
        var myFilter = this._getFilters(type);
        //console.log('@ _loadData Exposed Filter [', myFilter, ']');
        if (me.theStore) {
            me.theStore.setFilter(myFilter);
            me.theStore.load();
       //console.log('@ _loadData We have been here already, using load() to fetch new data');
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
                     //   console.log('@ _loadData load() fired going to _createResults ', myData);

                    },
                    scope: me // This tells the wsapi data store to forward pass along the app-level context into ALL listener functions
                },
                fetch: this.theFetch // Look in the WSAPI docs online to see all fields available!
            });
            //console.log('@ _loadData New store request');

        }
    },
    _createResults: function (myData) {
        //console.log('@ _createResults Building HTML based on [myData] passed by the store');
        MySharedData.supportArray = myData;
        var html = '<div id="cards">';
        for (var x = 0; x < myData.length; x++) {
            html += Ext.create('App.Card')._build(x, myData.length, myData[x], this.theType);
        }
        html += '</div>';
        Ext.fly('myTarget').update(html);
        this._unmask();
        MySharedData.printHtml = html;
    },
    _getPrint: function () {
        //console.log('@ _getPrint Print requested');
        var printHtml = null;
        printHtml += Ext.create('App.Card')._print(MySharedData.printHtml);
        return printHtml;
    },
    _mask: function (message) {
        //console.log('@ _mask We are loading the store, show the spinner');
        //this.logger.log("Mask: ", message);
        if (this.sparkler) {
            this.sparkler.destroy();
        }
        this.sparkler = new Ext.LoadMask(this, {
            msg: message
        });
        this.sparkler.show();
        //Ext.fly('myTarget').update(this.sparkler.show());
    },
    _unmask: function () {
        //console.log('@ _unmask We have the data so destroy the spinner');
        if (this.sparkler) {
            this.sparkler.hide();
        }
    },
});