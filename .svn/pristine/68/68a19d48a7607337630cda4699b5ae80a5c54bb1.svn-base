/*
 * 将HTML页面中的<script>脚本做语法压缩
 */
var fs = require("fs");
var spawn = require('child_process').spawn;

var argvs = {
    //输入输出文件必须都是utf-8编码
    "--input": "",//这个参数需要全路径输入多个文件
    "--output": ""//这个参数输出合并后的文件名
};

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

function getFileName(full) {
    return full.match(/[^\/]+$/)[0];
}
function getPathName(full) {
    return full.replace(/[^\/]+$/, "");
}

function checkFileExist(fileList) {
    var count = 0;
    fileList.forEach(function (file) {
        try{
            var s = fs.statSync(file);
        } catch (e) {
            console.log("no exist file:" + file);
        }
        if (s) {
            count++;
        }
    });
    if (count == fileList.length) {
        return true;
    } else {
        return false;
    }
}

function concatFile(inputFile, outFile) {
    inputFile = inputFile.split(",");

    if (!checkFileExist(inputFile)) {
        return;
    }


    var outDir = getPathName(outFile);

    try {
        //创建输出文件夹
        fs.mkdirSync(outDir, 0766);
    } catch (e) { }

    var contents = [];

    inputFile.forEach(function (file) {
        var c = fs.readFileSync(file, "utf-8");
        contents.push(c);
    });
    contents = contents.join("\r\n");

    fs.writeFileSync(outFile, contents, "utf-8");
}



function mkdir(p, mode) {
    var dirs = p.split(/[\\\/]/);
    var path = '';
    dirs.forEach(function (s) {
        path += (s + "/");
        try {
            fs.mkdirSync(path, mode || 0766);
            console.log("create dir:" + outDir);
        }
        catch (e) {
        }
    });
}