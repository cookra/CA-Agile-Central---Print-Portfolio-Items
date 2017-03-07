Ext.define('App.Runtime', {
    singleton: true,
    config: {
        // Versioning
        Pversion: 'v4.0b',
        PappID: 'AC Print Portfolio Items',
        Powner: 'Richard Cook',
        PreleaseDate: '2017-03-07 : 13:27',
        Pdescription: 'Print Portfolio Items',
        // Git Repo Details
        PrepoAddress: 'not shared',
        // Emailer Contact Details
        //
        // Rally Colours
        PrallyColours_10: ['0096DB','004A9D','FF3C00','FF8D00','FFDC00','6F7376','ffffff','FF0069','41006E','00710C'],
        // Barclays Colours
        PbarclaysColours_5: ['145FAC','437EA0','00AEEF','FFFFFF','FFA000'],
        // Barclaycard Colors

    },
    constructor: function (config) {
        console.log('Runtime Class Saying Hi! - I hold details about this App - Version, Owner, ID etc..');
        var me = this;
        me.initConfig(config);
    },
});