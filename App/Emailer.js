Ext.define('App.Emailer', {
    _emailer: function (application_Output_Array, context_User, context_Project, context_Workspace) {
        var string, subject;
        subject = Ext.create('App.Config').pEmailSupportMessage;
        string = '\r\n';
        string += '\r\n';
        string += '\r\n';
        string += Ext.create('App.Config').pEmailerMessage;
        string += '\r\n';
        string += Ext.create('App.System')._this_Application_Details();
        string += Ext.create('App.System')._user_Vars();
        string += Ext.create('App.System')._user_Rally_Vars(context_User, context_Project, context_Workspace);
        string += Ext.create('App.System')._this_Application_Output(application_Output_Array);
        console.log(string);
        string = encodeURIComponent(string);
        window.location = 'mailto:' + Ext.create('App.Config').pEmailSupportAddress + '?subject=' + subject + '&body=' + string;
    },
});