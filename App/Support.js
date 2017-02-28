Ext.define('app.Version', {

    constructor: function (object) {
        console.log('c Version');
        var me = this;
        var gProps = app.Runtime; // shorten global property string
        var gEpros = app.Emailer; // shorten global property string
        var items = [{
            xtype: 'container',
            itemId: 'conatiner_version',
            id: 'conatiner_version',
            layout: 'vbox',
            height: 120,
            style: {
                borderColor: '#000000',
                background: gProps.Pcolour_LighBlue, //'#FF6600',
                borderStyle: 'solid',
                borderWidth: '1px',
                padding: '10px',
                overflow: 'visible',
                color: gProps.Pcolour_White,
            },
            items: [{
                    xtype: 'container',
                    itemId: 'creatVersion_HTML',
                    id: 'creatVersion_HTML',
                    html: '<div>Version: ' + gProps.Pversion + ' :::: Relese Date: ' + gProps.PreleaseDate + '</div><div>Owner: ' + gProps.Powner + '</div><div>Description: ' + gProps.Pdescription + '</div>',
                    bodyStyle: 'overflow:visible;background:inherit;position:relative;border: none;color:' + gProps.Pcolour_White,
                    flex: 1,
                    width: 2000,
                },
                {
                    xtype: 'button',
                    itemId: 'creatVersion_Button',
                    id: 'creatVersion_Button',
                    text: 'Contact Support',
                    bodyStyle: 'position:relativ;background:' + gProps.Pcolour_GreyBlue + ';border: none;color:' + gProps.Pcolour_White,

                    listeners: {
                        afterrender: function (v) {
                            v.el.on('click', function () {
                                var email = new gEpros._emailer();
                                console.log('f click', gEpros);
                            });
                        },
                    }
                }
            ],
            Scope: this,
        }];
        console.log('c Version: ',items);
        return items;
    },
});