var path = require('path');
var fs = require('fs');
//var path = __dirname.replace


var htmlPath = path.resolve("../html/");

console.log(htmlPath)

var files = fs.readdirSync(htmlPath);


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
    var list = [];
    text = text.replace(reg, function (matchText, $1) {
        var fileName = path.basename($1);
        list.push($1);
    });

    if (list.length > 0) {
        var fileName = path.basename(htmlPath);
        text = text.replace("</head>", "<script>top.loadScript(\"" + fileName + ".pack.js\",document)</script></head>");
        createBuildXml(fileName, list);
    }

    return text;
}


function createBuildXml(htmlName,list) {
    var xml = "";
    xml += '<?xml version="1.0"?>';
    xml += '<project name="build_pack" default="m139.core.pack">';
    xml += '<!-- 如果配置文件不在当前目录，修改此变量即可 -->';
    xml += '<property file="pack.conf" />';
    xml += '<!-- 打包m139.core.pack.js -->';
    xml += '<target name="' + htmlName + '.pack.js">';
    xml += '<concat destfile="./m139.core.pack.js" encoding="utf8" outputencoding="utf8" fixlastline="yes">';
    xml += '     <!-- 有依赖的需要在最前面定义，其它可以不按顺序 -->';
    xml += '    <fileset dir="${basePath}">';
    for (var i = 0; i < list.length; i++) {
        xml += '<include name="**/' + list[i] +'"/>';
    }
    xml += '    </fileset>';
    xml += '</concat>';
    xml += '</target>';
    xml += '</project>';

    fs.writeFileSync(xml, __dirname + "/pack.conf/" + htmlName + ".pack.xml", "utf8");
}