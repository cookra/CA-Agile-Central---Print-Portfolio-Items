Ext.define('App.Emailer', {
    singleton: true,
    constructor: function () {
        console.log('Config added: c Email');
    },
    _emailer: function (coreData, xData1, xData2, xData3, xData4) {
        var gProp = App.Runtime;
        var PcontactSubject = 'REF: AC APP ';
        var PcontactMessage = '=========== Please leave your message above this line ==========';
        var PcontactEmail = 'richard.cook@barclaycard.co.uk';
        // User Vars
        var yourapp = '> Browser Web App Name > ' + navigator.appName;
        var yourappalt = '> Browser User Agent > ' + navigator.userAgent;
        var yourversion = '> Browser Version > ' + navigator.appVersion;
        var yourappcodename = '> Browser Code Name > ' + navigator.appCodeName;
        var yourplatform = '> Platform > ' + navigator.platform;
        var youroscpu = '> OS CPU > ' + navigator.oscpu;
        var yourcookie = '> Cookie Enabled > ' + navigator.cookieEnabled;
        var outwinw = '> Owidth > ' + window.outerWidth;
        var outwinh = '> Oheight > ' + window.outerHeight;
        var inwinw = '> Iwidth > ' + window.innerWidth;
        var inwinh = '> Iheight > ' + window.innerHeight;
        var uri = '> Base URI > ' + document.getElementsByTagName('script')[0].baseURI;
        var src = '> SRC > ' + document.getElementsByTagName('script')[0].src;
        var localname = '> LocalName > ' + document.getElementsByTagName('script')[0].localName;
        var type = '> Type > ' + document.getElementsByTagName('script')[0].type;
        var userData = [
            yourapp,
            yourappalt,
            yourversion,
            yourappcodename,
            yourplatform,
            youroscpu,
            yourcookie,
            outwinw,
            outwinh,
            inwinw,
            inwinh,
            uri,
            src,
            localname,
            type
        ];
        // Tools
        var charReturn = '\r\n';
        // Emailer
        var subject = PcontactSubject + ' [ App : ' + gProp.PappID + ' ] : [ version : ' + gProp.Pversion + ' ]';
        var message = PcontactMessage;
        var report = '';
        console.log('xData1 Array = ', xData1);
        console.log('xData2 Array = ', xData2);
        console.log('xData3 Array = ', xData3);
        console.log('xData4 Array = ', xData4);

        report += charReturn + charReturn;
        report += 'Environment Report > ' + charReturn;
        report += '> Sencha ExtJS Version > ' + Ext.getVersion().version + charReturn + charReturn;
        report += 'Agile Central Report > ' + charReturn;
        report += '> AC User Username > ' + xData1.UserName+ charReturn;
        report += '> AC User Name > ' + xData1._refObjectName+ charReturn;
        report += '> AC User UUID > ' + xData1._refObjectUUID+ charReturn; 
        report += '> AC User Role > ' + xData1.Role+ charReturn;
        report += '> AC User Loc > ' + xData1._ref+ charReturn;
        report += '> AC User ObjectID > ' + xData1.ObjectID+ charReturn;
        report += '> AC User Default LPage > ' + xData1.LandingPage+ charReturn;
        //report += '> AC User Default Node > ' + xData1.UserProfile.DefaultProject.Name+ charReturn;
        //report += '> AC User Default Workapace > ' + xData1.UserProfile.DefaultWorkspace.Name+ charReturn;
        report += '> AC Application Node > ' + xData2.Name+ charReturn;
        report += '> AC Application Node UUID > ' + xData2._refObjectUUID+ charReturn;
        report += '> AC Application Workspace > ' + xData3.Name+ charReturn;
        report += '> AC Application Workspace UUID > ' + xData3._refObjectUUID+ charReturn;
        report += '> AC Subscription Sub Modules > ' + xData4.Modules+ charReturn;  
        report += '> AC Subscription UUID > ' + xData4._refObjectUUID+ charReturn; 
        report += '> AC Subscription Name > ' + xData4._refObjectName+ charReturn+ charReturn;   

        report += 'Build Details ' + charReturn;
        report += '> ReleaseDate > ' + gProp.PreleaseDate + charReturn;
        report += '> Owner > ' + gProp.Powner + charReturn;
        report += '> Version > ' + gProp.Pversion + charReturn;
        report += '> Description > ' + gProp.Pdescription + charReturn;
        report += '> App ID > ' + gProp.PappID + charReturn + charReturn;

        report += 'Application Report Found ' + coreData.length + ' items' + charReturn;
        for (var i = 0; i < coreData.length; i++) {
            report += '> ',coreData[i].raw.FormattedID + ' : ';
            report += coreData[i].raw.Name + ' : ';
            report += coreData[i].raw._ref + charReturn;
        }
        report += charReturn;
        report += 'System Report Found ' + userData.length + ' items'+charReturn;
        for (var x = 0; x < userData.length; x++) {
            report += userData[x] + charReturn;
        }
        report = encodeURIComponent(report);
        return window.location = 'mailto:' + PcontactEmail + '?subject=' + subject + '&body=' + message + report;
    },
});