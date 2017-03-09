Ext.define('App.Info', {
    _build: function (style,startString,data,endString) {
        var output;
        if(style==='header'){
            output = '<p style="font-size:25px;font-weight:bolder;margin:0;padding:0"><span style="color:#00AEEF;">'+startString+' </span><span style="color:black;">'+data+' '+endString+'</span></p>';
        }
        if(style==='paragraph'){
            output = '<p>'+startString+' '+data+' '+endString+'</p>';
        }
        return output;
    },
});
    