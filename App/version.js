Ext.define('App.Version', {
    constructor: function () {
        console.log('Version Class Saying Hi! - I output the Ext JS version');
        var theVersion = Ext.getVersion().version;
        return theVersion;
    }
});