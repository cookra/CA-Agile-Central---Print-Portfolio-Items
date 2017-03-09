Ext.define('App.Loader', {
    _build               : function (type) {
        var output;
        var colour_Array = Ext.create('App.Config').PrallyColours_10;
        var colour_Norm  = colour_Array[Math.floor((Math.random() * 10))];
        var Colour_Dark  = Ext.create('App.Tools')._shadeBlendConvert(colour_Norm, -30);
        switch (type) {
            case 'bar'   : 
                var html = 'style= "background-image: repeating-linear-gradient(-45deg,' + colour_Norm + ',' + colour_Norm + ' 11px,' + Colour_Dark + ' 10px,' + Colour_Dark + ' 20px")';
                output   = '<div class = "bar" ' + html + '></div>';
                break;
            case 'wave'  : 
                output   = '<div class = "loader">Loading...</div>';
                break;
        }
        return output;
    }
});
