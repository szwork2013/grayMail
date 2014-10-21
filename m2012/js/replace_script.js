var path = require('path');
var fs = require('fs');
//var path = __dirname.replace


var htmlPath = path.resolve("../html/set");

console.log(htmlPath)

var files = fs.readdirSync(htmlPath);


files.forEach(function (value) {
    if (/[-_a-z]+\.html$/i.test(value)) {
        var file = htmlPath + "//" + value;
        var newText = removeScriptJS(file);
        fs.writeFileSync(file,newText,"utf8");
    }
});


/**
 *干掉指定html文件里的指定js引用
 */
function removeScriptJS(htmlPath) {
    var text = fs.readFileSync(htmlPath).toString("utf8");
    var reg = /<script[^>]+?src=.([^"']+).[\s\S]+?<\/script>/ig;
    var list = [];
    text = text.replace(reg, function (matchText, $1) {
        var fileName = path.basename($1);
        list.push(fileName);
        return "";
    });

    if (list.length > 0) {
        var fileName = path.basename(htmlPath);
        text = text.replace("</head>", "<script>top.loadScript(\"" + fileName + ".pack.js\",document)</script></head>");
        createBuildXml(fileName, list);
    }

    return text;
}


function createBuildXml(htmlName,list) {
    var xml = [];
    xml.push('<?xml version="1.0"?>');
    xml.push('<project name="build_pack" default="packFile">');
    xml.push('<target name="packFile">');
    xml.push('<concat destfile="./' + htmlName +'.pack.js" encoding="utf8" outputencoding="utf8" fixlastline="yes">');
    for (var i = 0; i < list.length; i++) {
        xml.push('<fileset dir="./" includes="**/' + list[i] + '"/>');
    }
    xml.push('</concat>');
    xml.push('</target>');
    xml.push('</project>');
    xml = xml.join("\r\n");
    fs.writeFileSync(__dirname + "/" + htmlName + ".pack.js.xml", xml, "utf-8");
}