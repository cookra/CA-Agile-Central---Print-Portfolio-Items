<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<!-- Copyright (c) 2011  Rally Software Development Corp.  All rights reserved -->
<!-- Version 20160802-1 R Cook & A Watson - PMC APM -->
<html>
<head>
    <title>Print Feature Cards</title>
    <meta name="Name" content="App: Print Feature Cards"/>
    <meta name="Version" content="2013.11.04"/>
    <meta name="Vendor" content="Rally Software"/>
    <script type="text/javascript" src="https://rally1.rallydev.com/apps/1.32/sdk.js"></script>
    <script type="text/javascript">
    var MAX_NAME_LEN = 115;
        var APP_TYPE = "Feature";
        var CARD_TYPE = "stories";

        function PrintStoryCards(rallyDataSource) {

            function displayCards(results) {
              var myColour, estimate, loginName, ownerClass, storyId, taskId, description,
              i, name, theMarkup, data, userTable, ownerText, myParentID,
              myParentIDName, myNode, parentClass, estimateClass, myRelease, releaseClass;

                userTable = buildUserTable(results.users);

                data = results[CARD_TYPE];

                for (i = 0; i < data.raw.length; i++) {
                  console.log(i);
                  parentClass = "";
                  estimateClass = "";
					// dont show epics
                	if ((data[i].Children != null) && (data[i].Children.length > 0))
                		continue;
                    name = data[i].Name;
                    if (name.length > MAX_NAME_LEN) {
                        name = name.substring(0, MAX_NAME_LEN);
                        name += "...";
                    }

                    loginName = data[i].Owner;
                    if (typeof loginName === 'undefined' || loginName === null) {
                        ownerClass = "NoOwner";
                        ownerText = "No Owner";
                    } else {
                        ownerClass = loginName.UserName.replace(/[@|\.]/g,"");
                        ownerText = makeOwnerText(loginName, userTable);
                    }

                    if (CARD_TYPE === 'stories') {
                        storyId = data[i].FormattedID;
                        taskId = "";
                    } else {
                        storyId = data[i].WorkProduct.FormattedID;
                        taskId = results.tasks[i].FormattedID;
                    }

                    if(data[i].Release === undefined || data[i].Release === null){
                        myRelease = "No Release";
                        releaseClass = 'style="background:#ffd1d1"';
                    } else {
                        myRelease = data[i].Release.Name;
                    }

                    if(data[i].DisplayColor === null){
                      myColour = "#ff6600";
                    } else {
                      myColour = data[i].DisplayColor;
                    }

                    if(data[i].Project === null){
                      myNode = "No Team Assigned";
                    } else {
                      myNode = data[i].Project.Name;
                    }

                    if(data[i].Parent === null){
                      myParentID = "No Parent";
                      parentClass = 'style="background:#ffd1d1"';
                    } else {
                      myParentID = data[i].Parent.FormattedID;
                      myParentIDName = data[i].Parent.Name;

                    }

              			if (data[i].PreliminaryEstimate) {
              				estimate = data[i].PreliminaryEstimate.Name;
              			}
                    else if (data[i].PlanEstimate) {
                        estimate = data[i].PlanEstimate;
                    } else if (data[i].Estimate) {
                        estimate = data[i].Estimate;

                    } else {
                        estimateClass = 'style="background:#ffd1d1"';
                        estimate = "Not Estimated";
                    }

                    // description = data[i].Description.slice(0,240);
                    description = data[i].Description.slice(0,1024);

                    theMarkup = createMarkup(i, data.raw.length, name, ownerText, ownerClass, description,
                      storyId, taskId, estimate, myParentID, myParentIDName, myColour, myNode,
                      parentClass, estimateClass, myRelease, releaseClass);

                    dojo.byId("cards").innerHTML += theMarkup;
                }

                ownerPopulate(results);
            }

            function buildUserTable(userData) {
                var table = {};
                for (var i = 0; i < userdata.raw.length; i++) {
                    table[userData[i].LoginName] = userData[i].DisplayName;
                }
                return table;
            }

            function makeOwnerText(loginName, userTable) {
                if (typeof userTable[loginName] === 'undefined' || userTable[loginName] === '') {
                    return loginName._refObjectName.split('@');
                } else {
                    return userTable[loginName];
                }
            }

            function createMarkup(cardNum, totalCards, name, ownerText, ownerClass, description,
              storyId, taskId, estimate, myParentID,myParentIDName, myColour, myNode,
              parentClass, estimateClass, myRelease, releaseClass) {                var theMarkup, id;
                if (CARD_TYPE === 'stories') {
                    id = storyId;
                } else {
                    id = taskId + ':' + storyId;
                }

                theMarkup =
                '<div class="crop-marks">'+
                '<div class="artifact">' +
                '<div class="row_id">'+id+'</div>'+
                '<div class="row_parent" '+parentClass+'><span style="color:#ff6600">Parent:</span> '+myParentID+'<br/>'+myParentIDName+'</div>'+
                '<div class="row_name">'+name+'</div>'+
                '<div class="row_normal" '+estimateClass+'><span style="color:#ff6600">T-Shirt Size:</span> '+estimate+'</div>'+
                '<div class="row_normal"><span style="color:#ff6600">Node:</span> '+myNode+'</div>'+
                '<div class="row_normal" '+releaseClass+'><span style="color:#ff6600">Release:</span> '+myRelease+'</div>'+
                '<div class="row_normal_last"><span style="color:#ff6600">Owner:</span> '+ownerText+'</div>'+
                '<div class="row_colour" style="background:'+myColour+' !important">&nbsp;</div>'+
                '</div>'+
                '</div>'

                if (Math.ceil((cardNum + 1) % 4) === 0) {
                    theMarkup = theMarkup + '<div class=pb></div>';
                } else if (cardNum === totalCards - 1) {
                    theMarkup = theMarkup + '<div class=cb>&nbsp;</div>';
                }

                return theMarkup;
            }

            function ownerPopulate(results) {
                for (i = 0; i < results.users.length; i++) {
                    var ownerName = results.users[i].UserName.replace(/[@|\.]/g, "");
                    var ownerImage = rally.sdk.util.Ref.getUserImage(results.users[i], 40);
                    dojo.forEach(dojo.query("."+ownerName), function(ownerNode) {
                        ownerNode.innerHTML = "<IMG SRC='" + ownerImage + "'/>";
                    });
                }
            }

            function runQuery() {
                console.log("Release:",iterationDropdown.getSelectedName(), iterationDropdown.getSelectedName()==="");
                dojo.empty(dojo.byId("cards"));
                var queryArray = [];

                var query = "";

				//Print features instead of stories.
                query = "(PortfolioItemType.Ordinal = 1)";

                console.log("level dropdown",levelDropdown);

                var selectedRelease = iterationDropdown.getSelectedName();
                var level = levelDropdown.getSelectedItem().value;
                console.log("selectedRelease",selectedRelease,level);

                //query = "((PortfolioItemType.Ordinal = " + level + ") and " +
                    ( selectedRelease === "" ? "(Release = null)"
                            : "(Release.Name = " + "\"" + selectedRelease + "\")" ) +
                    ")";
                console.log("query",query);


                queryArray[0] = {
                    key: CARD_TYPE,
                    type: 'PortfolioItem',
                    query: query,
                    fetch: 'Name,Release,Iteration,Owner,FormattedID,Parent,PlanEstimate,ObjectID,Description,UserName,Children,PreliminaryEstimate,DisplayColor,Project',
                    order: 'Rank'
                };
                queryArray[1] = {
                    key: 'users',
                    type: 'users',
                    fetch: 'UserName,ObjectID,DisplayName'
                };
                rallyDataSource.setApiVersion("1.43");
                rallyDataSource.findAll(queryArray, displayCards);
            }

            function getStyleSheet() {
                var styleSheet;
                dojo.forEach(dojo.query('style'), function(s) {
                    if(s.title == 'printCards'){
                        styleSheet = s;
                    }
                });
                return styleSheet.innerHTML;
            }

            function printPop() {
                var title, options, printWindow, doc, cardMarkup;

                title = CARD_TYPE.slice(0, 1).toUpperCase() + CARD_TYPE.slice(1);
                options = "toolbar=1,menubar=1,scrollbars=yes,scrolling=yes,resizable=yes,width=1000,height=500";
                printWindow = window.open('', title, options);
                doc = printWindow.document;

                cardMarkup = dojo.byId("printSection").innerHTML;

                doc.write('<html><head><title>Print Feature</title>');
                doc.write('<style>');
                doc.write(getStyleSheet());
                doc.write('</style>');
                doc.write('</head><body class="landscape">');
                doc.write(cardMarkup);
                doc.write('</body></html>');
                doc.close();

                printWindow.print();
                return false;
            }

            function onDataRetrieved(a, eventArgs) {
			    //Add an "All" option
			    var all = {};
			    all[eventArgs.displayValueProperty] = "Unscheduled";
			    all[eventArgs.valueProperty] = "Unscheduled";

			    eventArgs.items.unshift(all);
			}

            this.display = function(){

                levelDropdown = new rally.sdk.ui.basic.Dropdown( {
                    label: "Hierarchy Level:",
                    showLabel : true,
                    items : [
                        { label : "0", value : "0"},
                        { label : "1", value : "1"},
                        { label : "2", value : "2"}
                    ],
                    defaultValue : "0"
                });

                levelDropdown.display("levelDropdown");

                // iterationDropdown = new rally.sdk.ui.IterationDropdown({}, rallyDataSource);
                iterationDropdown = new rally.sdk.ui.ReleaseDropdown({}, rallyDataSource);
                iterationDropdown.addEventListener("onDataRetrieved",    onDataRetrieved);
                iterationDropdown.display("iterationDropdown", runQuery);

                var config = {
                    text: "Print " + APP_TYPE + " Cards",
                    value: "myValue"
                };
                var button = new rally.sdk.ui.basic.Button(config);
                button.display("buttonDiv", printPop);
            };
        }

    </script>
 	<style type="text/css" title="printCards">
        /* PLEASE LEAVE THIS STYLESHEET INLINE SINCE TITLE IS NECESSARY */
        @media print {
                body { 
                  -webkit-print-color-adjust: exact; 
                }
                #interface {
                    display: none;
                }

                .artifact{
                  page-break-inside:avoid;
                    /* page-break-before: always; */
                    /* clear: both; */
                }
            }







            #buttonDiv,
            #iterationDropdown {
                display:inline;
            }

            #interface, #printSection {

                margin: 20px;
            }

            #interface {
                position: absolute;
                top : 5px;
            }

            html {
              background-color: #fff;
              color: #000;
              font: 14pt / 1.26 Arial, Helvetica, sans-serif;
              margin: 0;
              padding: 0;
            }

            body {
              background-color: #fff;
              margin: 0;
              padding: 0;
            }

            .cb {
              clear:both;
            }

            .crop-marks{
              border:2px dashed #cccccc;
              padding:10px;
              position: relative;
              float: left;

            }
            .artifact {
              background-color: #fff;
              border: 3px solid #000;
              width: 260px;
              white-space: normal;
            }

            .row_id {
              border-bottom: 1px dashed black;
              text-align: left;
              width:250px;
              font: bold 20px Genova, sans-serif;
              padding: 5px;
            }
            .row_owner {
              height:40px;
              border-bottom: 1px dashed black;
              width:250px;
              padding: 0 5px;

            }
            .row_owner_a{
              float: right;
              height:40px;
            }
            .row_owner_b{
              float: right;
              font: bold 15pt / 1.26 Genova, sans-serif;
              margin-right: 0.3em;
              margin-top: 0.3em;
            }

            .row_name {
              height:90px;
              border-bottom: 1px dashed black;
              text-align: left;
              width:250px;
              font: 15px Genova, sans-serif;
              padding: 5px;
            }
            .row_parent {
              border-bottom: 1px dashed black;
              text-align: right;
              width:250px;
              font: bold 12px Genova, sans-serif;
              padding: 5px;
              height:35px;
            }

            .row_normal {
              border-bottom: 1px dashed black;
              text-align: right;
              width:250px;
              font: bold 12px Genova, sans-serif;
              padding: 5px;
            }
            .row_normal_last {
              text-align: right;
              width:250px;
              font: bold 12px Genova, sans-serif;
              padding: 5px;
            }
            .row_colour {
              border-top: 3px solid black;
              height:30px;
              width:260px;
            }

    </style>
    <script type="text/javascript">

        function onLoad() {
            rally.sdk.ui.AppHeader.setHelpTopic("/display/rlyhlp/Print+Card+App");
            var rallyDataSource = new rally.sdk.data.raw.RallyDataSource('__WORKSPACE_OID__',
                                                                    '__PROJECT_OID__',
                                                                    '__PROJECT_SCOPING_UP__',
                                                                    '__PROJECT_SCOPING_DOWN__');
            var printStoryCards = new PrintStoryCards(rallyDataSource);
            printStoryCards.display(dojo.body());
        }

        rally.addOnLoad(onLoad);

    </script>
</head>
<body>
    <div style="float:right" id="help"></div>
    <div id="interface">
        <div id="levelDropdown"></div>
        <div id="iterationDropdown"></div>
        <div id="buttonDiv"></div>
    </div>
    <div id="printSection">
        <div id="cards"></div>
        <!-- <div id="iterationDropdown">IGNORE THIS DROPDOWN/UNUSED:<P></div> -->
    </div>
</body>
</html>
