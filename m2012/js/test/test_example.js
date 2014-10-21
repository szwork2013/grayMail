$(function () {
    module("范例");
    test("例子", function () {
        ok(true, 'true is true');
        equal(1,1,"1 equal 1");

        /*这里是测试异步代码，用stop() 再start()*/
        stop();
        var sum = 100;
        setTimeout(function(){
            sum += 100;
            equal(sum,200,"异步的哟");
            start();
        },100);
    });
});