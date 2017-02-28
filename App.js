Ext.define('MySharedData', {
    singleton: true,

    printHtml: '',
});

Ext.define('PrintApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    theStore: undefined, // app level references to the store and grid for easy access in various methods
    theGrid: undefined,
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
        'ActualStartDate',
        'ActualEndDate',
        'PlannedStartDate',
        'PlannedEndDate',
        'Release',
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
                listeners: {
                    add: function () {
                        console.log('Added Panel');
                    },
                    scope: me
                },
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
                            console.log('Added Combo');
                            me._kickoff();
                        },
                        scope: me
                    }
                },
                /* {
                    xtype: 'rallysearchfield',
                    itemId: 'search-field', // we'll use this item ID later to get the users' selection
                    fieldLabel: 'Select',
                    labelAlign: 'left',
                    id: 'search-field',
                    width: 300,
                    margin: '7 5 5 20',

                    listeners: {
                        add: function () {
                            console.log('Added Search');
                        },
                        scope: me
                    }
                    
                }, */{



                    xtype: 'button',
                    text: 'Print Results',
                    margin: '5 5 5 20',
                    handler: this._getPrint,
                    listeners: {
                        add: function () {
                            console.log('Added Button');
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
                listeners: {
                    add: function () {
                        console.log('Added Target');
                    },
                    scope: me
                },
                flex: 1
            }]
        });
        layout.myHtml = 'Searching...';
        this.add(layout);
    },

    _kickoff: function () {
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
            console.log('Reloading Store');
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
        var html = '<div id="cards">';
        for (var x = 0; x < myData.length; x++) {
            html += Ext.create('App.card')._build(x, myData.length, myData[x]);
        }
        html += '</div>';
        Ext.fly('myTarget').update(html);
        MySharedData.printHtml = html;
        html = '';
        myData = '';
        console.log('END');
    },
    _getPrint: function () {
        var printHtml = null;
        printHtml += Ext.create('App.card')._print(MySharedData.printHtml);
        return printHtml;
    }
});