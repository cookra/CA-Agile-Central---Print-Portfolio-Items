Ext.define('app.Layout', {
    constructor: function () {
        console.log('Added Viewport');
        var viewport = Ext.create('Ext.container.Viewport', {
                layout: 'border', 

            items: [{
                region: 'north',
                xtype: 'panel',
                itemId: 'north',
                id: 'viewPortnorth',
                height: 40,
                minHeight: 40,
            }, {
                region: 'center',
                xtype: 'panel',
                itemId: 'center',
                id: 'viewPortCenter',
                autoScroll: true,


            }, {
                region: 'south',
                xtype: 'panel',
                itemId: 'south',
                id: 'viewPortSouth',
                height: 120,
                minHeight: 120,
            }]
        });
        return viewport;
    },

});