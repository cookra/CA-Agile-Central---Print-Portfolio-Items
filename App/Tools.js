Ext.define('App.Tools', {
    _shadeBlendConvert: function (color, percent) {
        var R = parseInt(color.substring(1, 3), 16);
        var G = parseInt(color.substring(3, 5), 16);
        var B = parseInt(color.substring(5, 7), 16);
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;
        var RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
        var GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
        var BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));
        return "#" + RR + GG + BB;
    },
    _common_Array_Outputter: function (array) {
        var character_Return = '\r\n';
        var l = array.length;
        var output = '';
        var padSize = String(l).length;
        for (var x = 0; x < l; x++) {
            output += '[#' + this._number_Pad(x, padSize) + '] ' + array[x] + character_Return;
        }        
        console.log(output);
        array = undefined;
        return output;
    },
    _number_Pad: function (num, size) {
        return Array(Math.max(size - String(num).length + 1, 0)).join(0) + num;
    }
});