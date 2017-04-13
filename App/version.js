Ext.define('App.Version', {
    constructor: function () {
        var theVersion = Ext.getVersion().version;
        return theVersion;
    }
});