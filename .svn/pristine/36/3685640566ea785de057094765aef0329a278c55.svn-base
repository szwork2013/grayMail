/**
 * @fileOverview 定义弱密码规则检查组件
 */

(function (jQuery, _, M139) {
    var $ = jQuery;

    //密码强度
    var StrongLevel = {
        WEAK: 1,
        MIDDLE: 2,
        HIGH: 3
    };
    //字符类型：数字、小写字母、大写字母、特殊字符
    var CharType = {
        NUMBER: 1,
        LOWERLETTER: 2,
        UPPERLETTER: 4,
        Spechars: 8
    };

    //密码错误类型
    var PasswordError = {
        Empty:"1",//"密码不能为空",
        Length_Less:"2",// "密码必须为6-30位",
        Length_More:"3", //"密码必须为6-30位",
        AllNumber: "4",//"密码不能为纯数字",//已经去掉了
        Spechars:"5",//"密码不支持_~@#$^以外的特殊符号",
        SimpleString:"6",//"密码不能有太多字符串联",
        MoreSimpleString:"7",//"密码不能为字符串联块",
        UnsafeList: "8", //"密码不能为用户帐号
        AllNumberMinLength:"9" //纯数字密码必须为8-30位
    };

    /**
     *@namespace
     *@name M2012.Settings.PasswordCheck
     */
    M139.namespace("M2012.Settings.PasswordCheck",
       /**
        *@lends M2012.Settings.PasswordCheck
        */
        {
            /**
             *判断密码强度等级：强、中、弱、不合法（分别对应3,2,1,0）
             *@param {String} pwd 要检查的密码
             *@inner
             *@returns {Number} 返回密码的等级0表示不合法，3表示强
             */
            getStrongLevel: function (pwd) {
                if (pwd.length < 6) return StrongLevel.WEAK;

                var modes = this.countCharMode(pwd);

                //弱
                //6-8位,且仅包含数字,字母,特殊符号中的1种
                //6-8位,且仅包含数字,字母,特殊符号中的2种
                //9-30位,且仅包含数字,字母,特殊符号中的1种
                if (pwd.length <= 8 && modes <= 2) {
                    return StrongLevel.WEAK;
                } else if (pwd.length > 8 && modes == 1) {
                    return StrongLevel.WEAK;
                }

                //中
                //6-8位,且仅包含数字,字母,特殊符号中的3种
                //9-30位,且仅包含数字,字母,特殊符号中的2种
                if (pwd.length <= 8 && modes >= 3) {
                    return StrongLevel.MIDDLE;
                } else if (pwd.length > 8 && modes == 2) {
                    return StrongLevel.MIDDLE;
                }
                //强
                //9-30位,且仅包含数字,字母,特殊符号中的3种
                if (pwd.length > 8 && modes >= 3) {
                    return StrongLevel.HIGH;
                }

                return StrongLevel.WEAK;
            },
            /**
             *测试某个字符是属于哪一类
             *@inner
             */
            getCharMode: function (c) {
                if (/^\d$/.test(c)) return CharType.NUMBER;
                if (/^[A-Z]$/.test(c)) return CharType.UPPERLETTER;
                if (/^[a-z]$/.test(c)) return CharType.LOWERLETTER;
                return CharType.Spechars;
            },
            /*
             *用位运算计算出当前密码当中一共有多少种模式
             *@inner
             */
            countCharMode: function (str) {
                var mode = 0;
                for (var i = 0; i < str.length; i++) {
                    var c = str.charAt(i);
                    mode |= this.getCharMode(c);
                }
                return mode.toString(2).match(/1/g).length;
            },
            /**
             *判断字符串是否为简单组合：234,111,aaa,abc
             *@inner
             */
            isSimpleString: function (str) {
                //相同串
                function same(s) {
                    var reg = new RegExp("^" + s.charAt(0).replace(/([^a-zA-Z0-9])/, "\\$1") + "+$");
                    return reg.test(s);
                }
                //连续串
                function continuous(s) {
                    if (!window._cacheCharsList) {
                        var s1 = "abcdefghijklmnopqrstuvwxyz";
                        var s2 = s1.toUpperCase();
                        var s3 = "0123456789";
                        var s4 = "9876543210";
                        var s5 = "zyxwvutsrqponmlkjihgfedcba";
                        var s6 = s5.toUpperCase();
                        var s7 = "$#";
                        var s8 = "#$";
                        window._cacheCharsList = [s1, s2, s3, s4, s5, s6, s7, s8];
                    }
                    var list = window._cacheCharsList;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].indexOf(s) >= 0) return true;
                    }
                    return false;
                }
                if (same(str)) return true;
                if (continuous(str)) return true;
                return false;
            },
            /**
             *检查密码的安全性
             *@param {String} pwd 要检查的密码
             *@param {Array} disList 密码不允许的值（通常是该用户的手机号、别名）
             *@returns {Object} 返回的结果
             返回值：
             .success表示是否成功，
             .strongLevel表示密码等级，
             errorCode和errorMsg分别表示密码不允许的原因
             */
            checkPassword: function (pwd, disList) {
                var This = this;
                if (typeof pwd != "string") {
                    throw "checkPassword密码必须为字符串";
                }
                var min = 6;
                var max = 30;
                var errorCode = 0;
                var len = pwd.length;
                if (len == 0) {//为空
                    errorCode = PasswordError.Empty;
                } else if (len < min) {//太短
                    errorCode = PasswordError.Length_Less;
                } else if (len > max) {//太长
                    errorCode = PasswordError.Length_More;
                } else if (/[^A-Za-z0-9_~@#$\^]/.test(pwd)) {//包含特殊字符
                    errorCode = PasswordError.Spechars;
                } else if (isError6()) {
                    errorCode = PasswordError.SimpleString;
                } else if (isError7()) {
                    errorCode = PasswordError.MoreSimpleString;
                } else if (isError8()) {
                    errorCode = PasswordError.UnsafeList;
                } else if (isError9()) {
                    errorCode = PasswordError.AllNumberMinLength;
                }
                if (errorCode == 0) {
                    return { success: true, errorCode:0, strongLevel: This.getStrongLevel(pwd) };
                } else {
                    var errorMsg = {
                        "1": "密码不能为空",
                        "2": "密码必须为6-30位",
                        "3": "密码必须为6-30位",
                        "4": "密码不能为纯数字",//已经去掉了
                        "5": "密码不支持_~@#$^以外的特殊符号",
                        "6": "密码不能有太多字符串联",
                        "7": "密码不能为字符串联块",
                        "8": "密码不能为手机帐号",
                        "9": "纯数字密码必须为8-30位"//新增纯数字密码长度要求
                    }
                    return { success: false, errorCode: errorCode, errorMsg: errorMsg[errorCode], strongLevel: This.getStrongLevel(pwd) };
                }
                function isError6() {
                    return This.isSimpleString(pwd.substring(1)) ||
                        This.isSimpleString(pwd.substring(0, pwd.length - 1));
                }
                function isError7() {
                    for (var i = 1; i < pwd.length; i++) {
                        var strBegin = pwd.substring(0, i);
                        if (This.isSimpleString(strBegin)) {
                            var strEnd = pwd.substring(i, pwd.length);
                            if (This.isSimpleString(strEnd)) {
                                return true;
                            }
                        }
                    }
                    return false;
                }
                function isError8() {
                    if (!disList) return false;
                    for (var i = 0; i < disList.length; i++) {
                        var uid = disList[i];
                        if (uid == pwd) return true;
                    }
                }
                function isError9() {
                    var strNumber = pwd.replace(/[^0-9]/gi, "");
                    var minLength = 8;//新增，纯数字密码长度要求为8位及以上
                    if (strNumber.length == pwd.length) {
                        return pwd.length < minLength;
                    } else {
                        return false;
                    }
                }
            }
        });
})(jQuery, _, M139);