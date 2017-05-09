Ext.define('App.Card', {
    theMarkup: null,
    _build: function (cardNum, totalCards, data) {
        var myRelease, myQRWP, myOBN, myColour, myNode, myParentIDName, myEstimate, myName, myOwner, myId;

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
            myOBN = this._shortenString(data.raw.c_OrderBookNumberOBN, 50);
        } else {
            myOBN = this._checkMissing(data.raw._type, 'OBN');
        }
        //========================================================================================================================================================================
        //
        // COLOUR
        //
        if (data.raw.DisplayColor) {
            myColour = data.raw.DisplayColor;
        } else {
            myColour = "#000000";
        }
        //========================================================================================================================================================================
        //
        // PROJECT
        //
        if (data.raw.Project) {
            myNode = this._shortenString(data.raw.Project.Name, 30);
        } else {
            myNode = "No Node Assigned";
        }
        //========================================================================================================================================================================
        //
        // RELEASE
        //
        if (data.raw.Release === undefined || !data.raw.Release) {
            myRelease = this._checkMissing(data.raw._type, 'Release');
        } else {
            myRelease = this._shortenString(data.raw.Release.Name, 25);
        }
        //========================================================================================================================================================================
        //
        // QRWP
        //
        if (data.raw.c_QRWP === undefined || !data.raw.c_QRWP) {
            myQRWP = this._checkMissing(data.raw._type, 'QRWP');
        } else {
            myQRWP = this._shortenString(data.raw.c_QRWP, 26);
        }
        //========================================================================================================================================================================
        //
        // PARENT
        //
        if (data.raw.Parent) {
            myParentIDName = this._shortenString('['+data.raw.Parent.FormattedID+'] '+data.raw.Parent.Name, 75);
        } else {
            myParentIDName = this._checkMissing(data.raw._type, 'Parent');
        }
        //========================================================================================================================================================================
        //
        // ESTIMATE
        //
        if (data.raw.PreliminaryEstimate) {
            myEstimate = data.raw.PreliminaryEstimate.Name;
        } else if (data.raw.PlanEstimate) {
            myEstimate = data.raw.PlanEstimate;
        } else if (data.raw.Estimate) {
            myEstimate = data.raw.Estimate;
        } else {
            myEstimate = "Not Sized";
        }
        //========================================================================================================================================================================
        //
        // NAME
        //
        if (data.raw._refObjectName) {
            myName = this._shortenString(data.raw._refObjectName, 84);
        } else {
            myName = 'No Name';

        }
        //========================================================================================================================================================================
        //
        // OWNER
        //
        if (data.raw.Owner) {
            myOwner = this._shortenString(data.raw.Owner._refObjectName, 50);
        } else {
            myOwner = 'No Owner';

        }
        myId = data.raw.FormattedID;
        // NASTY HACK FOR ExtJS (Inline CSS builds) //
        var font = 'font-family: verdana, Geneva, sans-serif;';
        var css_Font______PUID = font + 'font-size:18px;';
        var css_Font_Px_Copy_L = font + 'font-size:12px;';
        var css_Font_Px_Copy_M = font + 'font-size:11px;';
        var css_Padding_5 = 'padding:5px;';
        var css_Bold = 'font-weight:bold;';
        var css_NORM = 'font-weight:normal;';
        var css_Text_Align_L = 'text-align:left;';
        var css_Div_Height_PUID = 'height:33px;';
        var css_Div_Height_Name = 'height:55px;';
        var css_Div_Height_Prnt = 'height:55px;';
        var css_Div_Height_Node = 'height:55px;';
        var css_Div_Height_Rele = 'height:23px;';
        var css_Div_Height_QRWP = 'height:23px;';
        var css_Div_Height__OBN = 'height:23px;';
        var css_Div_Height_Size = 'height:23px;';
        var css_Div_Height_Owne = 'height:23px;';
        var css_Div_Height_Colo = 'height:30px;';
        var css_Border_Dashed_B = 'border-bottom: 1px dashed grey;';
        var css_Border_solid__B = 'border-bottom: 1px solid black;';
        var css_Border____Blank = 'border: none;'; //<-- Not needed but keeps the formatting clean below
        var css_Start = ' style="';
        var css_End = '"';
        var colour_Background_Darken = Ext.create('App.Tools')._shadeBlendConvert(data.raw.DisplayColor, -60);
        var colour_Background = 'background: repeating-linear-gradient(  -45deg,  ' + data.raw.DisplayColor + ',' + data.raw.DisplayColor + ' 10px,  ' + colour_Background_Darken + ' 10px,  ' + colour_Background_Darken + ' 20px)';
        var css_Cut_Outs = css_Start + 'border: 1px dashed #00AEEF; padding: 10px;position: relative;float: left;page-break-inside: avoid' + css_End;
        var css_Card_Con = css_Start + 'border: 1px solid #000;width: 250px; white-space: normal;color: black;background-color: #fff;'+ css_End;
        // Main CSS Content
        var css_Row_PUID = css_Div_Height_PUID + css_Border_solid__B + css_Text_Align_L + css_Font______PUID + css_Bold + css_Padding_5;
        var css_Row_Name = css_Div_Height_Name + css_Border_Dashed_B + css_Text_Align_L + css_Font_Px_Copy_L + css_NORM + css_Padding_5;
        var css_Row_Prnt = css_Div_Height_Prnt + css_Border_Dashed_B + css_Text_Align_L + css_Font_Px_Copy_M + css_NORM + css_Padding_5;
        var css_Row_Node = css_Div_Height_Node + css_Border_Dashed_B + css_Text_Align_L + css_Font_Px_Copy_M + css_NORM + css_Padding_5;
        var css_Row_Rele = css_Div_Height_Rele + css_Border_Dashed_B + css_Text_Align_L + css_Font_Px_Copy_M + css_NORM + css_Padding_5;
        var css_Row_QRWP = css_Div_Height_QRWP + css_Border_Dashed_B + css_Text_Align_L + css_Font_Px_Copy_M + css_NORM + css_Padding_5;
        var css_Row__OBN = css_Div_Height__OBN + css_Border_Dashed_B + css_Text_Align_L + css_Font_Px_Copy_M + css_NORM + css_Padding_5;
        var css_Row_Size = css_Div_Height_Size + css_Border_Dashed_B + css_Text_Align_L + css_Font_Px_Copy_M + css_NORM + css_Padding_5;
        var css_Row_Owne = css_Div_Height_Owne + css_Border_solid__B + css_Text_Align_L + css_Font_Px_Copy_M + css_NORM + css_Padding_5;
        var css_Row_Colo = css_Div_Height_Colo + css_Border____Blank + colour_Background;
        var cssClearBoth = css_Start + 'clear:both' + css_End;
        var theMarkup =
            '<div class="css_Cut_Outs" ' + css_Cut_Outs + '>' +
            '<div class="css_Card_Con" ' + css_Card_Con + '>' +
            this._add_Div_Detail('css_Row_PUID', 'css_Row_PUID', css_Row_PUID, '#145FAC', 'UID', myId) +
            this._add_Div_Detail('css_Row_Name', 'css_Row_Name', css_Row_Name, '#145FAC', 'Name', myName) +
            this._add_Div_Detail('css_Row_Prnt', 'css_Row_Prnt', css_Row_Prnt, '#145FAC', 'Parent', myParentIDName) +
           // this._add_Div_Detail('css_Row_Node', 'css_Row_Node', css_Row_Node, '#145FAC', 'Node', myNode) +
           // this._add_Div_Detail('css_Row_Rele', 'css_Row_Rele', css_Row_Rele, '#145FAC', 'Release', myRelease) +
           // this._add_Div_Detail('css_Row_QRWP', 'css_Row_QRWP', css_Row_QRWP, '#145FAC', 'QRWP', myQRWP) +
           // this._add_Div_Detail('css_Row__OBN', 'css_Row__OBN', css_Row__OBN, '#145FAC', 'OBN', myOBN) +
           // this._add_Div_Detail('css_Row_Size', 'css_Row_Size', css_Row_Size, '#145FAC', 'Size', myEstimate) +
           // this._add_Div_Detail('css_Row_Owne', 'css_Row_Owne', css_Row_Owne, '#145FAC', 'Owner', myOwner) +
            this._add_Div_Detail('css_Row_Colo', 'css_Row_Colo', css_Row_Colo, '', '') +
            '</div>' +
            '</div>';
        // Printing Layout Shaper 2 x 2 cards
        if (Math.ceil((cardNum + 1) % 4) === 0) {
            theMarkup = theMarkup + '<div class=pb></div>';
        } else if (cardNum === totalCards - 1) {
            theMarkup = theMarkup + '<div class=cb ' + cssClearBoth + '>&nbsp;</div>';
        }
        return theMarkup;
    },
    _add_Div_Detail: function (div_Class, div_Id, div_Style, heading_Colour, div_Heading, div_Content) {
        var content,output;
        if (div_Heading === '' || div_Content === '') {
            // Must be an empty div
            content = '&nbsp;';
        } else {
            // Normal
            content = '<span style="color:' + heading_Colour + '">' + div_Heading + ':</span> ' + div_Content;
        }
        var output = '<div class="' + div_Class + '" id="' + div_Id + '" style="' + div_Style + '">'+content+'</div>';
        return output;
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
        return false;
    },
    // Fits our text into the diaplay panel take the string and the length you want to cut by then adds ... if the string breaches the limit
    _shortenString: function (string, stringLength) {
        var output;
        if (string.length > stringLength) {
            output = string.substring(stringLength, length) + ' ...';
        } else {
            output = string;
        }
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
        return output;
    }
});