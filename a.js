// R Cook
// v1.0.1
// 2017-02-21
// Template script to load a viewport with 5 panels

Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function () {
        console.log('f launch');
        var me = this; // <- Personal preference but I like me rather than this;)
        me._createLayout();
    },
    _createLayout: function () {
        console.log('f _createLayout');
        var me = this;
        var x = 0;
        // We are build ing this layout 
        // |""""""""|""""""""""""""""""""""""""""|""""""""|
        // | West   | North                      | East   |
        // |        |""""""""""""""""""""""""""""|        |
        // |        | Center                     |        |
        // |        |""""""""""""""""""""""""""""|        |
        // |        | South                      |        |
        // |""""""""|""""""""""""""""""""""""""""|""""""""|
        this.viewport = Ext.create('Ext.container.Viewport', {
            extend: 'Ext.app.Controller',
            layout: 'border',
            items: [{
                region: 'north',
                xtype: 'panel',
                itemId: 'north',
                id: 'viewPortnorth',
                height: 40,
                minHeight: 40,
                html: 'north',
            },{
                region: 'south',
                xtype: 'panel',
                itemId: 'south',
                id: 'viewPortSouth',
                height: 120,
                minHeight: 120,
                html: 'South',
            }, {
                region: 'center',
                xtype: 'panel',
                itemId: 'center',
                id: 'viewPortCenter',
                html: 'Center',
            }, ],
            listeners: {
                beforerender: function () {
                    // Triggers before the parent viewport loads
                    console.log('Viewport Loading');
                },
                afterrender: function () {
                    // Triggers after the viewport & all of its panels have loaded
                    console.log('Viewport Rendered');
                },
                add: function () {
                    // Counts in our viewports regions as they load
                    x++;
                    console.log('Viewport Rendering [ #',x,']');
                }
            },
            scope: me
        });
        x = null;
        console.log('finished');
    },
});