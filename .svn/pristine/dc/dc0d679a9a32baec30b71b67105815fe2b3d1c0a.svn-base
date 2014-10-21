/*
 * 根据文件md5值生成版本号
 */
var fs = require("fs");
var crypto = require("crypto"); //用来做MD5 和 Base64

var argvs = {
    //输入输出文件必须都是utf-8编码
    "--csspath": ""//css的目录
};

process.argv.forEach(function (item) {
    for (var p in argvs) {
        if (item.indexOf(p + "=") == 0) {
            argvs[p] = item.split("=")[1];
        }
    }
});

console.log(argvs);

argvs["--csspath"] = argvs["--csspath"].replace(/\//g, "\\");

var ResultMap = {};
//debugger
//argvs["--csspath"] = "D:\\Work\\SVN\\Mail139_M2012(rebuild2012)\\trunk\\src\\m2012\\css";
//检查路径并开始替换
if (fs.existsSync(argvs["--csspath"])) {
    replaceDir(argvs["--csspath"]);
} else {
    console.log(argvs["--csspath"]);
    throw new Error("Get File MD5 Fail，input css path not exist");
}

function getImageFileMD5(basePath, imgFileName) {
    
    var imageFilePath = getImageFilePath(basePath, imgFileName).trim();
    try {
        if (!fs.existsSync(imageFilePath)) {
            //文件不存在？？？
            console.log("==>>>create css inline-images MD5, but the file is not exists:" + imageFilePath);
            return "";
        }
        if (!ResultMap[imageFilePath]) {
            ResultMap[imageFilePath] = getFileMD5(imageFilePath);
        } 
        var md5 = ResultMap[imageFilePath];
    } catch (e) {
        throw new Error("Get File MD5 Fail:" + imageFilePath) + "\r\n" + e.toString();
    }
    console.log("Get File MD5:" + imageFilePath);
    return md5;
}

function getImageFilePath(basePath, imgPath) {
    //url(../../images/global/global.png)
    var fullPath = basePath.replace(/\\[^\\]+$/, "") + "\\" + imgPath.replace(/\//g, "\\");
    while (1) {
        var reg = /\w+\\..\\/;
        if (reg.test(fullPath)) {
            //替换掉相对路径
            fullPath = fullPath.replace(reg, "");
        } else {
            break;
        }
    }
    return fullPath;
}

function replaceCSSFile(path) {
    var content = fs.readFileSync(path).toString();
    content = content.replace(/url\("?([^\)"]+)"?\)/g, function ($0, $1) {
        if ($1.indexOf("http://") > -1 || $1.indexOf("/") == 0) {
            return $0;
        } else {
            var imgFileName = $1.replace(/\?[\s\S]*$/, "").trim();
            var md5 = getImageFileMD5(path, imgFileName);
            return "url(" + imgFileName + "?v=" + encodeURIComponent(md5) + ")";
        }
    });
    fs.writeFileSync(path, content);
}

function replaceDir(path) {
    var files = fs.readdirSync(path);
    files.forEach(function (file) {
        var fullPath = path + "\\" + file;
        var stat = fs.statSync(fullPath);
        if (stat.isFile() && /\.css$/.test(file)) {
            replaceCSSFile(fullPath);
        } else if (stat.isDirectory()) {
            replaceDir(fullPath);
        }
    });
}

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

function getFileName(full) {
    return full.match(/[^\/\\]+$/)[0];
}
