$(function(){
    module("M139.ConfigManager");
    test("members", function () {
        var conf = new M139.ConfigManager();
        var configs = {
            key1:"value1",
            key2:"value2"
        };
        conf.registerConfig("SiteConfig",configs);

        equal(configs.key1,conf.getConfig("SiteConfig","key1"),"getConfig");

        var changeKey = "key2";
        var changeValue = "value2____2";
        var updateEvent;
        conf.on("update",function(e){
            updateEvent = e;
        });
        //设置值以后检查是否正确
        conf.setConfig("SiteConfig",changeKey,changeValue);
        equal(changeValue,conf.getConfig("SiteConfig","key2"),"setConfig");
        //检查update事件是否能工作
        equal("SiteConfig",updateEvent.configName,"update configName key");
        equal(changeKey,updateEvent.key,"update check key");
        equal(changeValue,updateEvent.value,"update check value");
    });
});