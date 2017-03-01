Ext.define('MySharedData', {
    singleton: true,
    printHtml: '',
    supportArray: [],
    // Needs automating!
    portfolioType: ['PortfolioItem/BUStrategi""cObjectives',
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
        'c_OrderBookNumberOBN'
    ],
    launch: function () {
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
                }, {
                    xtype: 'button',
                    text: 'Print Results',
                    margin: '5 5 5 20',
                    handler: this._getPrint,
                    listeners: {
                        add: function () {
                            console.log('Added Button');
                            console.log('Print Trigger @ Button');

                        },
                        scope: me
                    }
                }, {
                    xtype: 'button',
                    text: 'Support',
                    margin: '5 5 5 20',
                    handler: this._getPrint,
                    listeners: {
                        afterrender: function (v) {
                            v.el.on('click', function () {
                                var email = new gEpros._emailer(MySharedData.supportArray, xData1, xData2, xData3, xData4);
                                console.log('Email Trigger @ Button');
                            });
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
        this._loadData();
        console.log(Ext.fly('myTarget'));
    },
    _getFilters: function (value) {
        var theFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'PortfolioItemType',
            operation: '=',
            value: value
        });
        return theFilter;
    },
    _loadData: function () {
        var me = this;
        var selectedItem = Ext.getCmp('portfolio-combobox').getRecord().get('_ref');
        var myFilter = this._getFilters(selectedItem);
        if (me.theStore) {
            me.theStore.setFilter(myFilter);
            me.theStore.load();
            console.log('Reloading Store');
        } else {
            me.theStore = Ext.create('Rally.data.wsapi.Store', { // create theStore on the App (via this) so the code above can test for it's existence!
                model: 'PortfolioItem',
                autoLoad: true, // <----- Don't forget to set this to true! heh
                filters: myFilter,
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
        MySharedData.supportArray = myData;
        var html = '<div id="cards">';
        for (var x = 0; x < myData.length; x++) {
            html += Ext.create('App.Card')._build(x, myData.length, myData[x], this.theType);
        }
        html += '</div>';
        Ext.fly('myTarget').update(html);
        MySharedData.printHtml = html;
    },
    _getPrint: function () {
        var printHtml = null;
        printHtml += Ext.create('App.Card')._print(MySharedData.printHtml);
        return printHtml;
    }

});