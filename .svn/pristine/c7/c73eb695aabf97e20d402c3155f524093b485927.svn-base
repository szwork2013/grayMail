var fs = require("fs");


//把js文件拷贝到这个目录下
var templateDir = __dirname + "\\doc_template\\";

//删除所有旧文件
mkdir(templateDir);
var oldFiles = fs.readdirSync(templateDir);
for(var i=0;i<oldFiles.length;i++){
    var oldFilePath = templateDir + "\\" + oldFiles[i];
    var oldFileStat = fs.statSync(oldFilePath);
    if(oldFileStat.isFile()){
        fs.unlinkSync(oldFilePath);
        console.log("delete old pack file：" + oldFilePath);
    }
}


var sourcePath = [
    "..\\m2012\\js\\core",
    "..\\m2012\\js\\app",
    "..\\m2012\\js\\plugin",
    "..\\m2012\\js\\testing",
    "..\\m2012\\js\\ui\\dialog",
    "..\\m2012\\js\\ui\\menu",
    "..\\m2012\\js\\ui\\picker",
    "..\\m2012\\js\\ui\\widget",
    "..\\m2012\\js\\ui\\widget\\contacts",
    "..\\m2012\\js\\ui\\editor",
    "..\\m2012\\js\\ui\\richinput",
    "..\\m2012\\js\\matrixvm",
    "..\\m2012\\js\\contacts"
];

sourcePath.forEach(function(path){
    var files = fs.readdirSync(path);

    for(var i=0;i<files.length;i++){
        var srcFile = files[i];
        if(/\.js$/.test(srcFile)){
            var targetName = srcFile;
            copyFile(path + "\\" + srcFile, templateDir + targetName);
        }
    }
});


var baseCommand = "java -jar jsrun.jar " + __dirname + "\\app\\run.js -a -t=templates\\Codeview1.2 "+templateDir;


var child = require("child_process").spawn("java",["-jar","jsrun.jar",__dirname + "\\app\\run.js","-a","-t=templates\\Codeview1.2",templateDir]);
child.stdout.setEncoding('utf8');
child.stdout.on('data', function (data) {
  console.log(data.toString('utf8'));
});
child.stderr.setEncoding('utf8');
child.stderr.on('data', function (data) {
    console.log(data.toString('utf8'));
});
child.on("exit",function(){
    console.log("5秒后退出...");
    setTimeout(function(){},5000);
});
function copyFile(sourceFile,targetFile,callback){
	var data = fs.readFileSync(sourceFile,"utf8");
	fs.writeFileSync(targetFile,data);
};

function mkdir(p, mode) {
	var dirs = p.split(/[\\\/]/);
	var path = '';
	dirs.forEach(function(s) {
		path += (s + "/");
		try {
			fs.mkdirSync(path, mode||0766);
		}
		catch (e) {
		}
	});
}