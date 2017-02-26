Ext.define('app.Layout', {
    constructor: function () {
        console.log('Added Viewport');
        var viewport = Ext.create('Ext.container.Viewport', {
            layout: 'border',
            id: 'nutts',                 
            items: [{
                    region: 'north',
                    xtype: 'panel',
                    itemId: 'north',
                    id: 'viewPortnorth',
                    height: 40,
                    minHeight: 40,
                }, {
                    region: 'center',
                    xtype: 'container',
                    itemId: 'center',
                    id: 'viewPortCenter',
                    autoScroll: true,
                    
                    listeners: {
                        afterrender: function(){
                            console.log('loaded');
                        }
                    }
                },
                {
                    region: 'south',
                    xtype: 'panel',
                    itemId: 'south',
                    id: 'viewPortSouth',
                    height: 120,
                    minHeight: 120,
                }
            ]
        });
        return viewport;
    },

});