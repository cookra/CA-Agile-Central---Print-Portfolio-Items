Ext.define('App.Loader', {
    _build: function () {
        console.log('@ Loader Class Saying Hi! - I shape and setoy the loading bars');
        var output;
        var gProp = App.Runtime;
        var colour_Array = gProp.PrallyColours_10;
        var colour_Norm = colour_Array[Math.floor((Math.random() * 10))];
        var Colour_Dark = Ext.create('App.Tools')._shadeBlendConvert(colour_Norm,-30);
        var html = 'style="background-image: repeating-linear-gradient(      -45deg,      #' + colour_Norm + ',      #' + colour_Norm + ' 11px,      ' + Colour_Dark + ' 10px,      ' + Colour_Dark + ' 20px")';
        output = '<div class="loader" ' + html + '></div>';
        console.log(output);
        return output;
    }
});