$(function(){
    module("M139.Text");
    test("members", function () {
        ok(M139.Text.Email,"M139.Text.Email");
        ok(M139.Text.Mobile,"M139.Text.Mobile");
        ok(M139.Text.Xml,"M139.Text.Xml");
        ok(M139.Text.Html,"M139.Text.Html");
        ok(M139.Text.Utils,"M139.Text.Utils");
        ok(M139.Text.Url,"M139.Text.Url");
        ok(M139.Text.Cookie,"M139.Text.Cookie");
    });

    test("M139.Text.Email", function () {
        var result = $Email.compare("lifula@139.com","李福拉<lifula@139.com>");
        ok(result,"compare");

        var addrText = "李福拉<lifula@139.com>"
        var account = $Email.getAccount(addrText);
        equal(account,"lifula","getAccount");

        var domain = $Email.getDomain(addrText);
        equal(domain,"139.com","getDomain");

        var email = $Email.getEmail(addrText);
        equal(email,"lifula@139.com","getEmail");

        var name = $Email.getName(addrText);
        equal(name,"李福拉","getName");

        var sendText = $Email.getSendText("李福拉","lifula@139.com");
        equal(sendText,'"李福拉"<lifula@139.com>',"getSendText");

        var isEmail_true = $Email.isEmail("lifula@139.com");
        var isEmail_false = $Email.isEmail("lifula@139.");
        equal(isEmail_true,true,"isEmail_true");
        equal(isEmail_false,false,"isEmail_false");

        var isEmailAddr = $Email.isEmailAddr(addrText);
        equal(isEmailAddr,true,"isEmailAddr");

        var splitList = $Email.splitAddr("lifula@139.com;李福拉<lifl@richinfo.cn>");
        equal(splitList.length,2,"splitAddr 1");
        equal(splitList[0],"lifula@139.com","splitAddr 2");
        equal(splitList[1],"李福拉<lifl@richinfo.cn>","splitAddr 3");


    });

    test("M139.Text.Mobile", function () {
        var result = $Mobile.compare("15889394143","李福拉<8615889394143>");
        equal(result,true,"compare");

        var addrText = "李福拉<15889394143>";
        var name = "李福拉";
        var number = "15889394143";
        var getNumber = $Mobile.getNumber(addrText);
        equal(getNumber,number,"getNumber");

        var getName = $Mobile.getName(addrText);
        equal(getName,name,"getName");

        var isMobile = $Mobile.isMobile(number);
        equal(isMobile,true,"isMobile");

        var isMobileAddr = $Mobile.isMobileAddr(addrText);
        equal(isMobileAddr,true,"isMobileAddr 移动号");

        var isMobileAddr_2 = $Mobile.isMobileAddr("18911111111");
        equal(isMobileAddr_2,true,"isMobileAddr 非移动号");
        
        var isChinaMobileAddr_true = $Mobile.isChinaMobileAddr(addrText);
        equal(isChinaMobileAddr_true,true,"isChinaMobileAddr 移动号");

        var isChinaMobileAddr_false = $Mobile.isChinaMobileAddr("18911111111");
        equal(isChinaMobileAddr_false,false,"isChinaMobileAddr 非移动号");

    });



    test("M139.Text.Encoding", function () {
        var text = "呵呵";
        var ec1 = escape(text);
        var ec2 = encodeURIComponent(text);
        equal(M139.Text.Encoding.tryDecode(ec1), text, "tryDecode escape " + text);
        equal(M139.Text.Encoding.tryDecode(ec2), text, "tryDecode encodeURIComponent" + text);


        var text = "en12doasd912dj0amdajd01m-~!2`!@+%25_";
        var ec1 = escape(text);
        var ec2 = encodeURIComponent(text);
        equal(M139.Text.Encoding.tryDecode(ec1), text, "tryDecode escape " + text);
        equal(M139.Text.Encoding.tryDecode(ec2), text, "tryDecode encodeURIComponent" + text);
    });
});