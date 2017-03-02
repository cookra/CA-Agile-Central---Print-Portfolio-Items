Ext.define('App.Runtime', {
    singleton: true,
    config: {
        // Versioning
        Pversion: 'v2.1b',
        PappID: 'AC Print Portfolio Items',
        Powner: 'Richard Cook',
        PreleaseDate: '2017-03-02 : 21:34',
        Pdescription: 'Print Portfolio Items',
        // Git Repo Details
        PrepoAddress: 'not shared',
        // Emailer Contact Details
        //

    },
    constructor: function (config) {
        console.log('Runtime Class Saying Hi! - I hold details about this App - Version, Owner, ID etc..');
        var me = this;
        me.initConfig(config);
    },
});