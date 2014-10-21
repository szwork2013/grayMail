var path = require('path');
var fs = require('fs');
//var path = __dirname.replace


var htmlPath = path.resolve("../m2012/html/set");

var files = fs.readdirSync(htmlPath);

//m2012.ui.common.pack.js
var removeList = [
    "m2012.ui.dialogbase.js",
    "m2012.ui.popmenu.js",
    "m2012.ui.menubutton.js",
    "m2012.ui.dropmenu.js",
    "m139.ui.popup.js",
    "m139.ui.repeater.js",
    "m139.ui.tabpage.js",
    "m139.ui.richhint.js",
    "m139.ui.tipmessage.js",
    "m2012.ui.pageturning.js"
];

files.forEach(function (value) {
    if (/[-_a-z]+\.html$/i.test(value)) {
        var file = htmlPath + "//" + value;
        var newText = removeScriptJS(file, removeList);
        fs.writeFileSync(file,newText,"utf8");
    }
});


/**
 *干掉指定html文件里的指定js引用
 */
function removeScriptJS(htmlPath, removeList) {
    var text = fs.readFileSync(htmlPath).toString("utf8");
    var reg = /<script[^>]+?src=.([^"']+).[\s\S]+?<\/script>/ig;
    var count = 0;
    text = text.replace(reg, function (matchText, $1) {
        var fileName = path.basename($1);
        if (removeList.indexOf(fileName) > -1) {
            console.log(fileName);
            count++;
            return "";
        } else {
            return matchText;
        }
    });

    if (count > 0) {
        text = text.replace("</head>", "<script>top.loadScript(\"m2012.ui.common.pack.js\",document)</script></head>")
    }

    return text;
}