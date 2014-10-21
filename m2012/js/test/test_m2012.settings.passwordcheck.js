$(function(){
    module("M2012.Settings.PasswordCheck");

    test("M2012.Settings.PasswordCheck", function () {
        ok(M2012.Settings.PasswordCheck,"M2012.Settings.PasswordCheck");
        ok(M2012.Settings.PasswordCheck.checkPassword,"M2012.Settings.PasswordCheck.checkPassword");
        

        //密码错误类型
        var PasswordError = {
            Empty:"1",//"密码不能为空",
            Length_Less:"2",// "密码必须为6-30位",
            Length_More:"3", //"密码必须为6-30位",
            AllNumber: "4",//"密码不能为纯数字",//已经去掉了
            Spechars:"5",//"密码不支持_~@#$^以外的特殊符号",
            SimpleString:"6",//"密码不能有太多字符串联",
            MoreSimpleString:"7",//"密码不能为字符串联块",
            UnsafeList:"8" //"密码不能为用户帐号
        };
        
        var getCode = function(pwd,disList){
            return M2012.Settings.PasswordCheck.checkPassword(pwd,disList).errorCode;
        }
        var getStrongLevel = function(pwd,disList){
            return M2012.Settings.PasswordCheck.checkPassword(pwd,disList).strongLevel;
        }
        
        equal(getCode(""),PasswordError.Empty,"识别密码不能为空");
        equal(getCode("asdqw"),PasswordError.Length_Less,"识别密码太短");
        equal(getCode("123456789012345678901234567890m"),PasswordError.Length_More,"识别密码太长");
        //equal(getCode("12312313213213"),PasswordError.AllNumber,"识别密码纯数字");
        equal(getCode("/asd/asd/1"),PasswordError.Spechars,"识别密码不支持_~@#$^以外的特殊符号");
        equal(getCode("12345678"),PasswordError.SimpleString,"识别简单串联");
        equal(getCode("123abc"),PasswordError.MoreSimpleString,"识别2个串联");
        equal(getCode("lifula",["lifula"]),PasswordError.UnsafeList,"识别密码为账号");

        equal(getStrongLevel("19831126"),1,"密码弱");
        equal(getStrongLevel("a19831126"),2,"密码中");
        equal(getStrongLevel("a_b_c12345"),3,"密码强");
    });
});