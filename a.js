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
    items: [ // pre-define the general layout of the app; the skeleton (ie. header, content, footer)
        {
            xtype: 'container', // this container lets us control the layout of the pulldowns; they'll be added below
            itemId: 'pulldown-container',
            layout: {
                type: 'hbox', // 'horizontal' layout
                align: 'stretch'
            }
        }
    ],

    launch: function () {
        var me = this;
        me._loadIterations();
    },
    _loadIterations: function () {
        var me = this;
        var iterComboBox = Ext.create('Rally.ui.combobox.PortfolioItemTypeComboBox', {
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
                    //me._test();
                    me._loadData();
                },
                scope: me
            }
        });
        this.down('#pulldown-container').add(iterComboBox);

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
        this._container(html);
        //Ext.fly('myTarget').update(html);
        //Ext.fly('myTarget').setHeight('auto');
    },

    _container: function (html) {
        console.log(html);
        var viewport = Ext.create('Ext.container.Viewport', {
            layout: {
                type: 'absolute',
            },
            style: {
                background: 'transparent',
            },
            items: [{
                region: 'center',
                y: 100,
                id: 'myTarget',
                autoScroll: true,
                autoEl: {
                    tag: 'div',
                    cls: 'title-bar',
                    height: '100%',
                    html: html,
                },
                style: {
                    color: 'blue'
                }
            }, ]
        });
        return viewport;
    },
});