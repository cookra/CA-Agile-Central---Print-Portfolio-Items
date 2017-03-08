Ext.define('App.Runtime', {
    singleton: true,
    config: {
        // Versioning
        Pversion: 'v4.2b',
        PappID: 'AC Print Portfolio Items',
        Powner: 'Richard Cook',
        PreleaseDate: '2017-03-08 : 10:30',
        Pdescription: 'Print Portfolio Items',
        // Git Repo Details
        PrepoAddress: 'not shared',
        // Emailer Contact Details
        PsupportEmail: 'richard.cook@barclaycard.co.uk',
        // Rally Colours
        PrallyColours_10: ['#0096DB','#004A9D','#FF3C00','#FF8D00','#FFDC00','#6F7376','#FFF','#FF0069','#41006E','#00710C'],
        // Barclays Colours
        PbarclaysColours_5: ['#145FAC','#437EA0','#00AEEF','#FFF','#FFA000'],
        // Barclaycard Colors
    },
    constructor: function (config) {
        this.initConfig(config);
    },
});