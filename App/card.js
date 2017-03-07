Ext.define('App.Card', {
    theMarkup: null,
    debugShow: false,
    _build: function (cardNum, totalCards, data) {
        this._showDebug('===== @Card Happy Birthday!');
        this._showDebug('@Card Class Saying Hi! - I build the output HTML for displaying and printing');
        this._showDebug('=====');
        var myRelease, myQRWP, myOBN, myColour, myNode, myParentID, myParentIDName, myEstimate, myName, myOwner, myId;


        // @Scenario 1: Strategic Objective ######################################################################
        // No OBN
        // No Release
        // No Parent
        // No QRWP
        // @Scenario 2: Portfolio Objective ######################################################################
        // No OBN
        // No Release
        // No QRWP
        // @Scenario 2: Portfolio Epic
        // MUST HAVE OBN !!! (Cost Allocation) ######################################################################
        // No Release
        // No QRWP
        // @Scenario 3: Business Outcome ######################################################################
        // No OBN
        // @Scenario 4: Feature
        // No OBN



        //========================================================================================================================================================================
        //
        // OBN
        //
        if (data.raw.c_OrderBookNumberOBN) {
            this._showDebug('@Card Filter [ OBN ] > (found) sending to _shortenString ', data.raw.c_OrderBookNumberOBN);
            myOBN = this._shortenString(data.raw.c_OrderBookNumberOBN, 50, data.raw._type, 'OBN');
        } else {
            this._showDebug('@Card Filter [ OBN ] > (not found) checking if needed with this item _checkMissing ');
            myOBN = this._checkMissing(data.raw._type, 'OBN');
        }
        //========================================================================================================================================================================
        //
        // COLOUR
        //
        if (data.raw.DisplayColor) {
            this._showDebug('@Card Filter [ Colour ] > (found) ', data.raw.DisplayColor);
            myColour = data.raw.DisplayColor;
        } else {
            this._showDebug('@Card Filter [ Colour ] > (not found) NOT POSSIBLE!!! Colour set to #ff6600');
            this._showDebug('=====');
            myColour = "#ff6600";
        }
        //========================================================================================================================================================================
        //
        // PROJECT
        //
        if (data.raw.Project) {
            this._showDebug('@Card Filter [ Project ] > (found) sending to _shortenString ', data.raw.Project.Name);
            myNode = this._shortenString(data.raw.Project.Name, 30, data.raw._type, 'Project');
        } else {
            this._showDebug('@Card Filter [ Project ] > (not found) NOT POSSIBLE!!! No Node Assigned');
            myNode = "No Node Assigned";
        }
        //========================================================================================================================================================================
        //
        // RELEASE
        //
        if (data.raw.Release === undefined || !data.raw.Release) {
            this._showDebug('@Card Filter [ Release ] > (not found) cheking if needed with this item _checkMissing');
            myRelease = this._checkMissing(data.raw._type, 'Release');
        } else {
            this._showDebug('@Card Filter [ Release ] > (found) sending to _shortenString ', data.raw.Release);
            myRelease = this._shortenString(data.raw.Release.Name, 25, data.raw._type, 'Release');
        }
        //========================================================================================================================================================================
        //
        // QRWP
        //
        if (data.raw.c_QRWP === undefined || !data.raw.c_QRWP) {
            this._showDebug('@Card Filter [ QRWP ] > (not found) cheking if needed with this item _checkMissing');
            myQRWP = this._checkMissing(data.raw._type, 'QRWP');
        } else {
            this._showDebug('@Card Filter [ QRWP ] > (found) sending to _shortenString ', data.raw.c_QRWP);
            myQRWP = this._shortenString(data.raw.c_QRWP, 26, data.raw._type, 'QRWP');
        }
        //========================================================================================================================================================================
        //
        // PARENT
        //
        if (data.raw.Parent) {
            this._showDebug('@Card Filter [ Parent ] > (found) sending to _shortenString ', data.raw.Parent.FormattedID, ' ', data.raw.Parent.Name);
            myParentID = 'Parent: ' + data.raw.Parent.FormattedID;
            myParentIDName = this._shortenString(data.raw.Parent.Name, 50, data.raw._type, 'Parent');
        } else {
            this._showDebug('@Card Filter [ Parent ] > (not found) sending to _checkMissing');
            myParentIDName = "";
            myParentID = this._checkMissing(data.raw._type, 'Parent');
        }
        //========================================================================================================================================================================
        //
        // ESTIMATE
        //
        if (data.raw.PreliminaryEstimate) {
            this._showDebug('@Card Filter [ Estimate ] > (found) A sending to _shortenString ', data.raw.PreliminaryEstimate.Name);
            myEstimate = data.raw.PreliminaryEstimate.Name;
        } else if (data.raw.PlanEstimate) {
            this._showDebug('@Card Filter [ Estimate ] > (found) B sending to _shortenString ', data.raw.PreliminaryEstimate.Name);
            myEstimate = data.raw.PlanEstimate;
        } else if (data.raw.Estimate) {
            this._showDebug('@Card Filter [ Estimate ] > (found) C sending to _shortenString ', data.raw.PreliminaryEstimate.Name);
            myEstimate = data.raw.Estimate;
        } else {
            this._showDebug('@Card Filter [ Estimate ] > (Not Found) Not Sized');
            this._showDebug('=====');
            myEstimate = "Not Sized";
        }
        //========================================================================================================================================================================
        //
        // NAME
        //
        if (data.raw._refObjectName) {
            this._showDebug('@Card Filter [ Name ] > (found) sending to _shortenString ', data.raw._refObjectName);
            myName = this._shortenString(data.raw._refObjectName, 135, data.raw._type, 'Name');
        } else {
            this._showDebug('@Card Filter [ Name ] > (Not Found) NOT POSSIBLE!!! No Name');
            myName = 'No Name';

        }
        //========================================================================================================================================================================
        //
        // OWNER
        //
        if (data.raw.Owner) {
            this._showDebug('@Card Filter [ Owner ] > (found) sending to _shortenString ', data.raw.Owner._refObjectName);
            myOwner = this._shortenString(data.raw.Owner._refObjectName, 50, data.raw._type, 'Owner');
        } else {
            this._showDebug('@Card Filter [ Owner ] > (Not Found) No Owner');
            myOwner = 'No Owner';

        }
        myId = data.raw.FormattedID;
        // NASTY HACK FOR ExtJS (Inline CSS builds) //
        var font = 'font-family: verdana, Geneva, sans-serif ';
        var font______PUID = font + '20px;';
        var font_Px_Copy_L = font + '15px;';
        var font_Px_Copy_M = font + '12px;';
        var fontStyle_Padding_5 = 'padding:5px;';
        var fontStyle_Bold = 'font-weight:bold;';
        var text_align_L = 'text-align:left;';
        var div_Height_PUID = 'height:30px;';
        var div_Height_Name = 'height:90px;';
        var div_Height_Prnt = 'height:55px;';
        var div_Height_Node = 'height:40px;';
        var div_Height_Rele = 'height:30px;';
        var div_Height_QRWP = 'height:30px;';
        var div_Height__OBN = 'height:30px;';
        var div_Height_Size = 'height:30px;';
        var div_Height_Owne = 'height:30px;';
        var div_Height_Colo = 'height:30px;';
        var border_dashed_B = 'border-bottom: 1px dashed black;';
        var border_dashed_L = '';
        var cssStyleTag_Start = ' style="';
        var cssStyleTag_End = '"';


/*

        var cssCropmarks = cssStyleTag_Start + 'border: 1px dashed #00AEEF;padding: 10px;position: relative;float: left' + cssStyleTag_End;
        var cssArtifacts = cssStyleTag_Start + 'border: 1px solid #000;width: 100%;white-space: normal;color: black;background-color: #fff;page-break-inside: avoid' + cssStyleTag_End;
        var cssRow_Id = cssStyleTag_Start + 'border-bottom: 1px solid black;text-align: left;width: 250px;'+font+'font-size:'+fontSize+'px;font-style:'+fontStyle+'padding: 5px;' + cssStyleTag_End;
        var cssRow_Name = cssStyleTag_Start + 'height: 90px;border-bottom: 1px dashed #00AEEF;text-align: left;width: 250px;font: bolder 15px Genova, sans-serif;padding: 5px;' + cssStyleTag_End;
        var cssRow_Parent = cssStyleTag_Start + 'border-bottom: 1px dashed #00AEEF;text-align: right;width: 250px;font: bold 12px Genova, sans-serif;padding: 5px;height: 70px;' + cssStyleTag_End;
        var cssRow_Large = cssStyleTag_Start + 'border-bottom: 1px dashed #00AEEF;text-align: right;width: 250px;font: bold 12px Genova, sans-serif;padding: 5px;height:30px;' + cssStyleTag_End;
        var cssRow_Normal = cssStyleTag_Start + 'border-bottom: 1px dashed #00AEEF;text-align: right;width: 250px;font: bold 12px Genova, sans-serif;padding: 5px;' + cssStyleTag_End;
        var cssRow_Normal_Last = cssStyleTag_Start + 'text-align: right;width: 250px;font: bold 12px Genova, sans-serif;padding: 5px;' + cssStyleTag_End;
        var cssRow_Colour = cssStyleTag_Start + '!important;border-top: 1px solid black;height: 30px;width: 100%;background:' + data.raw.DisplayColor + cssStyleTag_End;
        var cssClearBoth = cssStyleTag_Start + 'clear:both' + cssStyleTag_End;
        */
        var cssCropmarks = cssStyleTag_Start + 'border: 1px dashed #00AEEF; padding: 10px;position: relative;float: left' + cssStyleTag_End;
        var cssArtifacts = cssStyleTag_Start + 'border: 1px solid #000;width: 250px; white-space: normal;color: black;background-color: #fff;page-break-inside: avoid' + cssStyleTag_End;
        
        var cssRow_PUID = cssStyleTag_Start + div_Height_PUID + border_dashed_B + text_align_L + font______PUID + fontStyle_Bold + fontStyle_Padding_5 + cssStyleTag_End;
        var cssRow_Name = cssStyleTag_Start + div_Height_Name + border_dashed_B + text_align_L + font_Px_Copy_L + fontStyle_Bold + fontStyle_Padding_5 + cssStyleTag_End;
        var cssRow_Prnt = cssStyleTag_Start + div_Height_Prnt + border_dashed_B + text_align_L + font_Px_Copy_M + fontStyle_Bold + fontStyle_Padding_5 + cssStyleTag_End;
        var cssRow_Node = cssStyleTag_Start + div_Height_Node + border_dashed_B + text_align_L + font_Px_Copy_M + fontStyle_Bold + fontStyle_Padding_5 + cssStyleTag_End;
        var cssRow_Rele = cssStyleTag_Start + div_Height_Rele + border_dashed_B + text_align_L + font_Px_Copy_M + fontStyle_Bold + fontStyle_Padding_5 + cssStyleTag_End;
        var cssRow_QRWP = cssStyleTag_Start + div_Height_QRWP + border_dashed_B + text_align_L + font_Px_Copy_M + fontStyle_Bold + fontStyle_Padding_5 + cssStyleTag_End;
        var cssRow__OBN = cssStyleTag_Start + div_Height__OBN + border_dashed_B + text_align_L + font_Px_Copy_M + fontStyle_Bold + fontStyle_Padding_5 + cssStyleTag_End;
        var cssRow_Owne = cssStyleTag_Start + div_Height_Owne + border_dashed_B + text_align_L + font_Px_Copy_M + fontStyle_Bold + fontStyle_Padding_5 + cssStyleTag_End;
        var cssRow_Size = cssStyleTag_Start + div_Height_Size + border_dashed_B + text_align_L + font_Px_Copy_M + fontStyle_Bold + fontStyle_Padding_5 + cssStyleTag_End;
        var cssRow_Colo = cssStyleTag_Start + div_Height_Colo + border_dashed_L + text_align_L + font_Px_Copy_M + fontStyle_Bold + fontStyle_Padding_5 + 'background:' + data.raw.DisplayColor + cssStyleTag_End;
        var cssClearBoth = cssStyleTag_Start + 'clear:both' + cssStyleTag_End;
        var theMarkup =
            '<div class="crop-marks" ' + cssCropmarks + '>' +
            '<div class="artifact" ' + cssArtifacts + '>' +
            '<div class="cssRow_PUID" ' + cssRow_PUID + '>' + myId + '</div>' +
            '<div class="cssRow_Name" ' + cssRow_Name + '><span style="color:#145FAC">Name:</span> ' + myName + '</div>' +
            '<div class="cssRow_Prnt" ' + cssRow_Prnt + '><span style="color:#145FAC">Parent:</span> ' + myParentID + '<br/>' + myParentIDName + '</div>' +
            '<div class="cssRow_Node" ' + cssRow_Node + '><span style="color:#145FAC">Node:</span> ' + myNode + '</div>' +
            '<div class="cssRow_Rele" ' + cssRow_Rele + '><span style="color:#145FAC">Release:</span> ' + myRelease + '</div>' +
            '<div class="cssRow_QRWP" ' + cssRow_QRWP + '><span style="color:#145FAC">QRWP:</span> ' + myQRWP + '</div>' +
            '<div class="cssRow__OBN" ' + cssRow__OBN + '><span style="color:#145FAC">OBN:</span> ' + myOBN + '</div>' +
            '<div class="cssRow_Size" ' + cssRow_Size + '><span style="color:#145FAC">T-Shirt Size:</span> ' + myEstimate + '</div>' +
            '<div class="cssRow_Owne" ' + cssRow_Owne + '><span style="color:#145FAC">Owner:</span> ' + myOwner + '</div>' +
            '<div class="cssRow_Colo" ' + cssRow_Colo + '>&nbsp;</div>' +
            '</div>' +
            '</div>';
        // Printing Layout Shaper 2 x 2 cards
        if (Math.ceil((cardNum + 1) % 4) === 0) {
            theMarkup = theMarkup + '<div class=pb></div>';
        } else if (cardNum === totalCards - 1) {
            theMarkup = theMarkup + '<div class=cb ' + cssClearBoth + '>&nbsp;</div>';
        }
        this._showDebug('===== @Card Ending !!!');
        return theMarkup;
    },
    _print: function (data) {
        var title, options, printWindow, doc;
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
        this._showDebug('@Card _Print Fired');
        return false;
    },
    // Fits our text into the diaplay panel take the string and the length you want to cut by then adds ... if the string breaches the limit
    _shortenString: function (string, stringLength, type, name) {
        //this._showDebug('_shortenString:', string, stringLength);
        var output, result;
        if (string.length > stringLength) {
            output = string.substring(stringLength, length) + ' ...';
            result = string + '***** [ Trimmed ] *****';
        } else {
            output = string;
        }
        if (string.length <= stringLength) {
            result = '***** [ No Change ] *****';
        }
        //this._showDebug('@Card Filter [', name, '] @ _shortenString', string, ' MaxChar: ', stringLength, ' Result: ', result);
        this._showDebug('=====');
        return output;
    },
    _checkMissing: function (portfolioType, item) {
        var output, f1, f2, f3, f4, f5;
        f1 = MySharedData.portfolioType[0];
        f2 = MySharedData.portfolioType[1];
        f3 = MySharedData.portfolioType[2];
        f4 = MySharedData.portfolioType[3];
        f5 = MySharedData.portfolioType[4];
        // Strategic Objective
        if (portfolioType === f1) {
            if (item === 'OBN') {
                output = 'Portfolio Epic Only';
            }
            if (item === 'Release') {
                output = 'Not Required';
            }
            if (item === 'QRWP') {
                output = 'Not Required';
            }
            if (item === 'Parent') {
                output = 'Top Level';
            }
        }
        // Portfolio Objective
        if (portfolioType === f2) {
            if (item === 'OBN') {
                output = 'Portfolio Epic Only';
            }
            if (item === 'Release') {
                output = 'Not Required';
            }
            if (item === 'QRWP') {
                output = 'Not Required';
            }
            if (item === 'Parent') {
                output = 'Missing';
            }
        }
        //Portfolio Epic
        if (portfolioType === f3) {
            if (item === 'OBN') {
                output = 'Missing';
            }
            if (item === 'Release') {
                output = 'Not Required';
            }
            if (item === 'QRWP') {
                output = 'Not Required';
            }
            if (item === 'Parent') {
                output = 'Missing';
            }
        }
        // Business Outcome
        if (portfolioType === f4) {
            if (item === 'OBN') {
                output = 'Portfolio Epic Only';
            }
            if (item === 'Release') {
                output = 'Not Assigned';
            }
            if (item === 'QRWP') {
                output = 'Missing';
            }
            if (item === 'Parent') {
                output = 'Missing';
            }
        }
        // Feature
        if (portfolioType === f5) {
            if (item === 'OBN') {
                output = 'Portfolio Epic Only';
            }
            if (item === 'Release') {
                output = 'Not Assigned';
            }
            if (item === 'QRWP') {
                output = 'Not Required';
            }
            if (item === 'Parent') {
                output = 'Missing';
            }
        }
        //this._showDebug('@Card Filter [', item, '] < @ _checkMissing Type: ', portfolioType, ' Filter Output: ', output);
        this._showDebug('=====');
        return output;
    },
    _showDebug: function (msg) {
        if (this.debugShow === true) {
            console.log(msg);
        }
    }
});