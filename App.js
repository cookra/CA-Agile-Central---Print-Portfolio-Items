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
    'c_OrderBookNumberOBN'],
    items: [ // pre-define the general layout of the app; the skeleton (ie. header, content, footer)
        {
            xtype: 'container', // this container lets us control the layout of the pulldowns; they'll be added below
            itemId: 'pulldown-container',
            margin: '5 5 5 5',
            layout: {
                type: 'hbox', // 'horizontal' layout
                align: 'stretch'
            }
        }
    ],
    launch: function () {
        this._addFetchType();

    },

    onModelRetrieved: function (model) {
        this.model = model;
        this.createDefect();
    },



    _addFetchType: function () {
        var me = this;
        var iterComboBox = Ext.create('Rally.ui.combobox.PortfolioItemTypeComboBox', {
            itemId: 'portfolio-combobox', // we'll use this item ID later to get the users' selection
            fieldLabel: 'Select',
            labelAlign: 'left',
            width: 300,
            defaultSelectionPosition: 'first',
            listeners: {
                ready: function () {
                    me._loadData(1); // initialization flow: next, load severities
                    console.log(' Ready ', iterComboBox);
                },
                select: function () {
                    me._loadData(2); // user interactivity: when they choose a value, (re)load the data
                    console.log(' Change ', iterComboBox);
                },
                scope: me
            },
        });
        this.down('#pulldown-container').add(iterComboBox); // add the iteration list to the pulldown container so it lays out horiz, not the app!
    },



    _getFilters: function (value) {
        var theFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'PortfolioItemType',
            operation: '=',
            value: value
        });
        console.log('Filter');
        return theFilter;
    },
    _loadData: function (myX) {
        console.log('f _loadData', myX);
        var me = this;
        var selectedItem = this.down('#portfolio-combobox').getRecord().get('_ref'); // the _ref is unique, unlike the iteration name that can change; lets query on it instead!
        var myFilter = this._getFilters(selectedItem);
        console.log(myFilter);
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
                            me._createGrid(myStore); // if we did NOT pass scope:this below, this line would be incorrectly trying to call _createGrid() on the store which does not exist.
                        }
                    },
                    scope: me // This tells the wsapi data store to forward pass along the app-level context into ALL listener functions
                },
                fetch: this.theFetch // Look in the WSAPI docs online to see all fields available!
            });
        }
    },
    _createGrid: function (mytheStore) {
        var me = this;
        me.theGrid = Ext.create('Rally.ui.grid.Grid', {
            store: mytheStore,
            columnCfgs: this.theFetch
        });
        me.add(me.theGrid); // add the grid Component to the app-level Container (by doing this.add, it uses the app container)
    }


});