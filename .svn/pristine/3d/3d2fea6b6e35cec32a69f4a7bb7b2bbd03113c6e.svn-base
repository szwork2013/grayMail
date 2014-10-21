$(function () {
    module("基础模块");
    test("类库完整性验证", function () {
        ok(M139, 'M139命名空间加载');
        ok(M139, 'M139模块加载');
        ok(M139.requireJS, 'M139.requireJS方法存在');

        ok(M139.Logger, 'M139.Logger模块加载');
        ok(M139.HttpClient, 'M139.HttpClient模块加载');
        ok(M139.ExchangeHttpClient, 'M139.ExchangeHttpClient模块加载');
        ok(M139.View.ViewBase, 'M139.View.ViewBase模块加载');

        /*这里是测试异步代码，用stop() 再start()*/
        stop();
        M139.registerJS("M139.Plugin.Flash","plugin/m139.plugin.flash.js");
        //异步
        M139.requireJS(["M139.Plugin.Flash"],function(){
            ok(M139.Plugin.Flash, 'M139.Plugin.Flash 异步模块加载');
            start();
        });
    });
});