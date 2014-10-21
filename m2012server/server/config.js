var Configs = {
	"rd139cm":"./conf/rd139cm.js",
    "10086rd":"./conf/10086rd.js",
    "10086ts": "./conf/10086ts.js",
    "10086":"./conf/10086.js"
}

var line = "10086";
//��ǰ�Ƿ�Ҷ���
var isGrayLine = true;


module.exports = require(Configs[line]);

//�Ҷ����������־·��
if (isGrayLine) {
    module.exports.LOG_PATH = '/home/logs/m2012server';
}

var isLocal = require('os').platform().indexOf("win") > -1;
if (isLocal) {
    //����Ĭ������fiddlerģʽ
    module.exports.fiddlerMode = 1;
    if (line == "10086") {
        module.exports.BalanceList = null;
    }
}

if (isLocal || line !== "10086") {
    module.exports.devMode = true;
}