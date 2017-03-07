Ext.define('App.Info', {
    theMarkup: null,
    debugShow: true,
    _build: function (style,startString,data,endString) {
        this._showDebug('===== @Info Happy Birthday!');
        this._showDebug('@Info Class Saying Hi! - I build the output HTML for displaying the info bar');
        this._showDebug('=====');
        var output;
        if(style==='header'){
            output = '<p style="font-size:25px;font-weight:bolder;margin:0;padding:0"><span style="color:#00AEEF;">'+startString+' </span><span style="color:black;">'+data+' '+endString+'</span></p>';
        }
        if(style==='paragraph'){
            output = '<p>'+startString+' '+data+' '+endString+'</p>';
        }
        return output;
    },

    _showDebug: function (msg){
        if(this.debugShow===true){
            console.log(msg);
        }
    },
});
    