Ext.define('App.Runtime', {
    singleton: true,
    config: {
        // Versioning
        Pversion: 'v2.0.0',
        PappID: 'AC Print Portfolio Items',
        Powner: 'Richard Cook',
        PreleaseDate: '2017-02-28 : 17:07',
        Pdescription: 'Print Portfolio Items',
        // Git Repo Details
        PrepoAddress: 'not shared',
        // Emailer Contact Details
        //

    },
    constructor: function (config) {
        console.log('c config.Runtime f constructor');
        var me = this;
        me.initConfig(config);
    },
});