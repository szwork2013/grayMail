var path = require('path');
var fs = require('fs');
//var path = __dirname.replace


var htmlPath = path.resolve("../m2012/html/");

var files = fs.readdirSync(htmlPath);



files.forEach(function (value) {
    if (/[-_a-z]+\.html$/i.test(value)) {
        var file = htmlPath + "//" + value;
        var jsList = getScriptJS(file);
        console.log("----------");
        console.log(value);
        console.log(jsList.join("\r\n"));
        console.log("----------");
    }
});


/**
 *����htmlҳ�������õ�js�ļ��б�
 */
function getScriptJS(htmlPath) {
    var text = fs.readFileSync(htmlPath).toString("utf8");
    var reg = /<script[^>]+?src=.([^"']+)"/;
    var files = [];
    //todo �ȸɵ�ע�����
    text.replace(reg, function (matchText, $1) {
        files.push($1);
    });
    return files;
}