$(function(){
    module("M139.Browser.is");

    var chromeUA = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.47 Safari/536.11";
    var IE9UA = "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; Tablet PC 2.0; .NET4.0E)";
    
    test("with Chrome UA：" + chromeUA, function () {
        $B.init(chromeUA);
        var is = $B.is;
        equal(true,is.chrome,"chrome==true");
        equal(false,is.firefox,"firefox==false");
        equal(false,is.opera,"opera==false");
        equal(false,is.ie,"ie==false");
        equal(false,is.safari,"safari==false");
        equal(true,is.windows,"windows==true");
    });

    test("with IE9 UA：" + IE9UA, function () {
        $B.init(IE9UA);
        var is = $B.is;
        equal(false,is.chrome,"chrome==false");
        equal(false,is.firefox,"firefox==false");
        equal(false,is.opera,"opera==false");
        equal(true,is.ie,"ie==true");
        equal(false,is.safari,"safari==false");
        equal(true,is.windows,"windows==true");

        //还原 避免影响其它测试结果
        $B.init();
    });
    
});