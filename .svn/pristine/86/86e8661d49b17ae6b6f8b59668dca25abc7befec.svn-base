/*
 * 根据文件md5值生成版本号
 */
var fs = require("fs");
var crypto = require("crypto"); //用来做MD5 和 Base64

var argvs = {
    //输入输出文件必须都是utf-8编码
    "--output": ""//这个参数指定输出的配置文件，可以是以逗号隔开的多个文件
};

process.argv.forEach(function (item) {
    for (var p in argvs) {
        if (item.indexOf(p + "=") == 0) {
            argvs[p] = item.split("=")[1];
        }
    }
});

var filePath = process.argv[process.argv.length - 1];

var md5 = getFileMD5(filePath);
md5 = encodeURIComponent(md5);
var fileName = getFileName(filePath);

var configFiles = argvs["--output"].split(",");
//预计会有研发线、测试线、生产线3个配置文件
configFiles.forEach(function (confFile) {
    writeConfigJSON(confFile, fileName, md5);
});

function getMD5(data) {
    var hash = crypto.createHash("md5");
    hash.update(data);    
    var md5Base64 = hash.digest("base64");
    return md5Base64;
}
function getFileMD5(file) {
    var data = fs.readFileSync(file);
    return getMD5(data);
}


function writeConfigJSON(confFile,sourceFileName,md5) {
    var reg = /\/\/<fileConfig>([\s\S]+?)<\/fileConfig>/;
    var text = fs.readFileSync(confFile).toString();
    var m = text.match(reg);
    var isReplace = false;
    if (m) {
        isReplace = true;
    }

    if (isReplace) {
        try {
            var Config_FileVersion;
            eval(m[1]);
            if (!Config_FileVersion) {
                throw "goto catch";
            }
        } catch (e) {
            throw "eval <fileConfig> js error from" + confFile + "\r\n+++++\r\n" + m[1];
        }
    } else {
        Config_FileVersion = {};
    }
    Config_FileVersion["defaults"] = new Date().toISOString();
    //替换资源文件版本号
    Config_FileVersion[sourceFileName] = md5;

    var newConfString = "//<fileConfig>\r\nvar Config_FileVersion = " + JSON.stringify(Config_FileVersion, "", 4) + "\r\n//</fileConfig>";

    if (isReplace) {
        text = text.replace(reg, newConfString);
    } else {
        text += "\r\n\r\n" + newConfString;
    }

    fs.writeFileSync(confFile, text);
    console.log("get file version " + sourceFileName + ":" + md5);
    /*
    //<fileConfig>
    var Config_FileVersion = {
        "defaults": "20130605_randomnum",//默认全部资源版本号
        "index.html.pack.js": "asdasdasdas_1",//单独文件版本号，视自动化构建配置而定 md5_手动修改版本号数字
        "compose.html.pack.js": "czxcascasca_1"
    }
    //</fileConfig>
    */
}

function getFileName(full) {
    return full.match(/[^\/\\]+$/)[0];
}

/*
process.argv.forEach(function (item) {
    for(var p in argvs){
        if (item.indexOf(p + "=") == 0) {
            argvs[p] = item.split("=")[1];
        }
    }
});

if (!argvs["--input"] || !argvs["--output"]) {
    console.log("no input argvs：--input --output");
} else {
    concatFile(argvs["--input"], argvs["--output"]);
}
*/