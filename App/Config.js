Ext.define('App.Config', {
    config: {
        // Versioning
        Pversion: 'v5.2b',
        PappID: 'AC Print Portfolio Items',
        Powner: 'Richard Cook',
        PreleaseDate: '2017-03-09: 00:24 GMT',
        Pdescription: 'Print Portfolio Items',
        // Git Repo Details
        PrepoAddress: 'not shared',
        // Emailer Contact Details
        pEmailSupportMessage: '*** [AC Print Portfolio Items] Custom Application AC Support Request',
        pEmailSupportAddress: 'richard.cook@barclaycard.co.uk',
        pEmailerMessage: '========== Please add your comments above this line ==========',
        // Rally Colours
        PrallyColours_10: ['#0096DB', '#004A9D', '#FF3C00', '#FF8D00', '#FFDC00', '#6F7376', '#FFF', '#FF0069', '#41006E', '#00710C'],
        // Barclays Colours
        PbarclaysColours_5: ['#145FAC', '#437EA0', '#00AEEF', '#FFF', '#FFA000'],
        // Bits we need
        pInfoHtml: '',
        pCardHtml: '',
        pStoreData: '',
        // Needs automating!
        portfolioType: [
            'PortfolioItem/BUStrategicObjectives',
            'PortfolioItem/STPortfolioObjectives',
            'PortfolioItem/PortfolioEpic',
            'PortfolioItem/BusinessOutcome',
            'PortfolioItem/Feature',
        ], // Portfolio Types
    },
    constructor: function (config) {
        this.initConfig(config);
    },
});