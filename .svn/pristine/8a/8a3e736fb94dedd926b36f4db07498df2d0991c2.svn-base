var DiskConf = {
	interFace: {
		getAllDiskInfo: "", //获取彩云事件信息
		createFolder: "/middlewaredisk/disk?func=disk:addDirectory", //新建文件夹
		formatDirInfo: ""//新建文件夹时下拉框文件夹树
	},
	"serverPath": "/ServiceApi/DiskServices.ashx",
	"diskPhotoListPageSize": 24, //相册页大小
	"diskDirLevel": 5,
	"albumDirName": "我的相册",
	"albumDirID": 20,
	"musicDirName": "我的音乐",
	"musicDirID": 30,
	"rootDirName": "彩云网盘",
	"diskRootDirID": 10, //根目录ID
    MaxUploadFileNameLength:80,//最长文件名
	isOk: "S_OK", //服务端执行返回标识
	isError: "S_ERROR",
	isException: "FS_UNKNOWN",
	deveInterIp: "http://smsrebuild1.mail.10086.cn/disk/",//中间件对应的接口地址
	proxyInterIp: "http://smsrebuild1.mail.10086.cn/disk/netdisk/"//中间件对象的目录
};
if(top.SiteConfig && top.SiteConfig.netDiskRebuildUrl) {
	DiskConf.proxyInterIp = top.SiteConfig.netDiskRebuildUrl + "/";
	DiskConf.deveInterIp = DiskConf.proxyInterIp.replace("netdisk/", "");
} else {
	if(Utils.getCookie("cookiepartid") == 1) {
		DiskConf.proxyInterIp = "http://smsrebuild0.mail.10086.cn/disk/netdisk/";
		DiskConf.deveInterIp = "http://smsrebuild0.mail.10086.cn/disk/";
	} 
}
