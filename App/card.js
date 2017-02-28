Ext.define('App.card', {
    theMarkup: null,
    _build: function (cardNum, totalCards, data) {
        // Validators
        if (data.raw.Release === undefined || !data.raw.Release) {
            myRelease = "No Release";
        } else {
            myRelease = data.raw.Release.Name;
        }
        if (!data.raw.c_QRWP) {
            var myQRWP = "No QRWP";
        } else {
            var myQRWP = data.raw.Project.c_QRWP;
        }
        if (!data.raw.c_OBN) {
            var myOBN = "No OBN";
        } else {
            var myOBN = data.raw.Project.c_OBN;
        }
        if (!data.raw.DisplayColor) {
            var myColour = "#ff6600";
        } else {
            var myColour = data.raw.DisplayColor;
        }
        if (!data.raw.Project) {
            var myNode = "No Team Assigned";
        } else {
            var myNode = data.raw.Project.Name;
        }
        if (data.raw.Owner._refObjectName=== undefined || !data.raw.Owner._refObjectName) {
            var myOwner = "No Owner Assigned";
        } else {
            var myOwner = data.raw.Owner._refObjectName;
        }
        if (!data.raw.Parent) {
            console.log('-');
            var myParentID = "Top Level / Missing?";
            var myParentIDName = "";
        } else {
            console.log('+');
            var myParentID = 'Parent: ' + data.raw.Parent.FormattedID;
            var myParentIDName = data.raw.Parent.Name;

        }
        if (data.raw.PreliminaryEstimate) {
            var myEstimate = data.raw.PreliminaryEstimate.Name;
        } else if (data.raw.PlanEstimate) {
            var myEstimate = data.raw.PlanEstimate;
        } else if (data.raw.Estimate) {
            var myEstimate = data.raw.Estimate;
        } else {
            var myEstimate = "Not Sized";
        }
        // No validation needed as these are constant across all levels of the portfolio
        var myId = data.raw.FormattedID;
        var myName = data.raw._refObjectName;
        // NASTY HACK FOR ExtJS (Inline CSS builds) //
        var cssStyleTag_Start = ' style="';
        var cssStyleTag_End = '"';
        var cssCropmarks = cssStyleTag_Start + 'border: 2px dashed #cccccc;padding: 10px;position: relative;float: left' + cssStyleTag_End;
        var cssArtifacts = cssStyleTag_Start + 'border: 3px solid #000;width: 260px;white-space: normal;color: black;background-color: #fff;page-break-inside: avoid' + cssStyleTag_End;
        var cssRow_Id = cssStyleTag_Start + 'border-bottom: 1px dashed black;text-align: left;width: 250px;font: bold 20px Genova, sans-serif;padding: 5px;' + cssStyleTag_End;
        var cssRow_Parent = cssStyleTag_Start + 'border-bottom: 1px dashed black;text-align: right;width: 250px;font: bold 12px Genova, sans-serif;padding: 5px;height: 70px;' + cssStyleTag_End;
        var cssRow_Name = cssStyleTag_Start + 'height: 90px;border-bottom: 1px dashed black;text-align: left;width: 250px;font: 15px Genova, sans-serif;padding: 5px;' + cssStyleTag_End;
        var cssRow_Normal = cssStyleTag_Start + 'border-bottom: 1px dashed black;text-align: right;width: 250px;font: bold 12px Genova, sans-serif;padding: 5px;' + cssStyleTag_End;
        var cssRow_Normal_Last = cssStyleTag_Start + 'text-align: right;width: 250px;font: bold 12px Genova, sans-serif;padding: 5px;' + cssStyleTag_End;
        var cssRow_Colour = cssStyleTag_Start + '!important;border-top: 3px solid black;height: 30px;width: 100%;background:'+data.raw.DisplayColor+ cssStyleTag_End;
        var cssClearBoth = cssStyleTag_Start + 'clear:both' + cssStyleTag_End;
        var theMarkup =
            '<div class="crop-marks" ' + cssCropmarks + '>' +
            '<div class="artifact" ' + cssArtifacts + '>' +
            '<div class="row_id" ' + cssRow_Id + '>' + myId + '</div>' +
            '<div class="row_parent" ' + cssRow_Parent + '><span style="color:#ff6600">Parent:</span> ' + myParentID + '<br/>' + myParentIDName + '</div>' +
            '<div class="row_name" ' + cssRow_Name + '><span style="color:#ff6600">Name:</span> ' + myName + '</div>' +
            '<div class="row_normal" ' + cssRow_Normal + '><span style="color:#ff6600">T-Shirt Size:</span> ' + myEstimate + '</div>' +
            '<div class="row_normal" ' + cssRow_Normal + '><span style="color:#ff6600">Node:</span> ' + myNode + '</div>' +
            '<div class="row_normal" ' + cssRow_Normal + '><span style="color:#ff6600">Release:</span> ' + myRelease + '</div>' +
            '<div class="row_normal" ' + cssRow_Normal + '><span style="color:#ff6600">QRWP:</span> ' + myQRWP + '</div>' +
            '<div class="row_normal" ' + cssRow_Normal + '><span style="color:#ff6600">OBN (PE Only):</span> ' + myOBN + '</div>' +
            '<div class="row_normal_last" ' + cssRow_Normal_Last + '><span style="color:#ff6600">Owner:</span> ' + myOwner + '</div>' +
            '<div class="row_colour" ' + cssRow_Colour + '>&nbsp;</div>' +
            '</div>' +
            '</div>';
        // Printing Layout Shaper 2 x 2 cards
        if (Math.ceil((cardNum + 1) % 4) === 0) {
            theMarkup = theMarkup + '<div class=pb></div>';
        } else if (cardNum === totalCards - 1) {
            theMarkup = theMarkup + '<div class=cb '+cssClearBoth+'>&nbsp;</div>';
        }
        return theMarkup;
    },
    _print: function (data) {
        var title, options, printWindow, doc, cardMarkup;
        title = 'Print Cards';
        options = "toolbar=0,menubar=0,scrollbars=yes,scrolling=yes,resizable=yes,width=1000,height=500";
        printWindow = window.open('', title, options);
        doc = printWindow.document;
        doc.write('<html><head><title>Print Feature</title>');
        doc.write('</head><body class="landscape" style="-webkit-print-color-adjust: exact;">');
        doc.write(data);
        doc.write('</body></html>');
        doc.close();
        printWindow.print();
        return false;
    },
});