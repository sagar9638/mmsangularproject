var chart;
let argsOut;

var editForm = function () {
    this.nodeId = null;
};

editForm.prototype.init = function (obj) {
    var that = this;
    this.obj = obj;
    this.editForm = document.getElementById("editForm");
    this.nameInput = document.getElementById("name");
    this.titleInput = document.getElementById("title");
    this.cancelButton = document.getElementById("cancel");
    this.saveButton = document.getElementById("save");
};

editForm.prototype.show = function (nodeId) {
        this.hide();
    this.nodeId = nodeId;
    var left = document.body.offsetWidth / 2 - 150;
     var node = chart.get(nodeId);
};

editForm.prototype.hide = function (showldUpdateTheNode) {
};


function myfunction(params1, Id) {
    var nodes = params1;
    chart = null;

    OrgChart.templates.rony.field_number_children = '<circle cx="60" cy="110" r="15" fill="#F57C00"></circle><text fill="#ffffff" x="60" y="115" text-anchor="middle">{val}</text>';

    chart = new OrgChart(document.getElementById(Id), {
        template: "rony",
        collapse: {
            level: 3
        },
        // menu: {
        //     pdf: { text: "Export PDF" },
        //     png: { text: "Export PNG" },
        //     svg: { text: "Export SVG" },
        //     csv: { text: "Export CSV" }
        // },
        // nodeMenu: {
        //     call: {
        //         onClick: callHandler
        //     }
            
        // },
        nodeMenu:{
            edit: {text:"Edit"},
            call: {
                onClick: callHandler,
                doubleClick: callHandler
            }
          
        },
        editUI: new editForm(),
        nodeBinding: {
            field_0: "name",
            field_1: "title",
            img_0: "img",
            field_number_children: function (sender, node) {
                var args = {
                    count: 0
                };
                iterate(sender, node, args);
                return args.count + 1;
            }
        }
    });


    var iterate = function (c, n, args) {
        args.count += n.childrenIds.length;
        for (var i = 0; i < n.childrenIds.length; i++) {
            var node = c.getNode(n.childrenIds[i]);
            iterate(c, node, args);
        }
    }
    chart.on('click', function (sender, args) {
        argsOut = null;
        // console.log('nodes',nodes);
        // let GetIdValue = nodes.filter(function (e) {
        //      e.id == args.node.id ;
        // });
        // console.log('args',args);
        // console.log('GetIdValue',GetIdValue);
        argsOut = args;
    });

    chart.load(nodes);
}

function callHandler() {
    let TempVal = null;
    if (argsOut != null && argsOut != "" && argsOut != undefined) {
        TempVal = argsOut;
        argsOut = null;
    }
    return TempVal;
}

function myfunction1(params1, Id) {
    var nodes = params1;
    chart = null;
    OrgChart.templates.rony.field_number_children = '<circle cx="60" cy="110" r="15" fill="#F57C00"></circle><text fill="#ffffff" x="60" y="115" text-anchor="middle">{val}</text>';

    chart = new OrgChart(document.getElementById(Id), {
        template: "rony",
        collapse: {
            level: 3
        },
        // menu: {
        //     pdf: { text: "Export PDF" },
        //     png: { text: "Export PNG" },
        //     svg: { text: "Export SVG" },
        //     csv: { text: "Export CSV" }
        // },
        nodeMenu:{
            edit: {text:"Edit"},
            call: {
                doubleClick: callHandler
                //mouseDragLeave: callHandler
            }
          
        },
        editUI: new editForm(),
        nodeBinding: {
            field_0: "name",
            field_1: "title",
            img_0: "img",
            field_number_children: function (sender, node) {
                var args = {
                    count: 0
                };
                iterate(sender, node, args);
                return args.count + 1;
            }
        }
    });


    var iterate = function (c, n, args) {
        args.count += n.childrenIds.length;
        for (var i = 0; i < n.childrenIds.length; i++) {
            var node = c.getNode(n.childrenIds[i]);
            iterate(c, node, args);
        }
    }
    chart.on('click', function (sender, args) {
        argsOut = null;
        // console.log('nodes',nodes);
        // let GetIdValue = nodes.filter(function (e) {
        //      e.id == args.node.id ;
        // });
        // console.log('args',args);
        // console.log('GetIdValue',GetIdValue);
        argsOut = args;
    });

    chart.load(nodes);
}




