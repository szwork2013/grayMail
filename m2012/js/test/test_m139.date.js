$(function(){
    module("M139.Date");
    test("方法测试", function () {
        var dateString = "2012-06-09 11:12:9";
        var dateObj = new Date(2012,5,9,11,12,9);
        

        var parse = $Date.parse(dateString);
        equal(parse.getTime(),dateObj.getTime(),"parse");

        var format = $Date.format("yyyy-MM-dd hh:mm:s",dateObj);
        equal(format,dateString,"format");

        var getHelloString = $Date.getHelloString(dateObj);
        equal(getHelloString,"中午","getHelloString");

        var now = new Date();
        var ahour = new Date(now);
        ahour.setHours(now.getHours() - 3);
        var getFriendlyString = $Date.getFriendlyString(ahour,now);
        equal(getFriendlyString,"3小时前","getFriendlyString");

        var threeDaysLater = new Date(now);
        threeDaysLater.setDate(now.getDate() + 3);
        var getDaysPass = $Date.getDaysPass(now,threeDaysLater);
        equal(getDaysPass,"3","getDaysPass");

    });
});