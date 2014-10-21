(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Welcome.Main.View', superClass.extend(
    {
        el: "body",
        template:"",
        events: {
        },
        initialize: function (options) {
            this.model = new M2012.Welcome.Model();
            //TODO
            //if (!top.$App.onUserDataComplete) {
            top.$App.onUserDataComplete = function (callback) {
                setTimeout(function () {
                    callback();
                },2000)
            }
            //}


            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents: function () {
            this.bindWindowResize();
            this.bindBottomLink();
            this._BH();
            try{
                if (inlinedQueryUserInfoJSON.UserInfo[0] && inlinedQueryUserInfoJSON.UserInfo[0].b8) {
                    top.UserData.imgUrl = inlinedQueryUserInfoJSON.UserInfo[0].b8;

                }
            } catch (e) {
            }

            $('#volumeCapacity').hover(
                function(){
                    var pWidth = 164;
                    var vWidth = $('#volumeUsed').show().width();
                    var vleft = $('#volumeCapacity').position().left;
                    var differ = pWidth - vWidth;
                    if(differ>vleft){
                        $('#volumeUsed').css({
                            right:(differ-vleft+10)+'px'
                        });
                    }
                    var uLeft = $('#volumeUsed').position().left
                    $('#volumeUsed .tipsBottom').css({
                        'left':(vleft-uLeft + 5)+'px'
                    })
                },
                function(){$('#volumeUsed').hide()}
            );
        },

        _BH: function () {
            top.BH('welcome_load'); //欢迎页加载
            $('#otherUnRead a').click(function () {
                var fid = $(this).attr('fid');
                switch (fid) {
                    case "1":  //收件箱
                        top.BH('welcome_mailbox');
                    case "9":  //订阅邮件
                        top.BH('welcome_subscribe');
                }
            })

        },

        initSubView: function () {
            var self = this;
            this.userMainView = new M2012.Welcome.UserMain.View({ model: this.model });
            this.userMainView.render();
            
            top.M139.Timing.waitForReady("top.Contacts.data.map",function(){
                self.dynamicView = new M2012.Welcome.DynamicInfo.View({ model: self.model });
                self.dynamicView.render();
            });

            this.adView = new M2012.Welcome.AD.View({ model: this.model });
            this.adView.render();

            $("#btn_customTab").click(function () {
                new M2012.Welcome.CustomTab.View({model:self.model}).render();
            });

        },


        reloadProd: function () {
            this.dynamicView.dyinfoModel.getDynamicData(this.dynamicView.birthModel, this.dynamicView.showAllData);
        },

        render: function () {
            var self = this;

            this.initEvents();
            
            //top.$App.onUserDataComplete(function () {
            self.initSubView();
            //});


            this.userInfoRender();
            this.linkScore();
            this.telCharge();
            this.setVolume();
            this.msgBoxHot();
        },

        msgBoxHot:function(){
            var num = $('#unreadBox').find('var').text();
            var loginTime = top.M139.Text.Utils.getDateTimeFromCGUID(top.$Url.queryString('cguid'));
            var passtime = (new Date()) - loginTime;
            var lockNum = 0;
            $(top.$App.getFolders()).each(function(i,n){
                if(top.$App.getView("folder").model.isLock(n.fid)){
                    lockNum += top.$App.getFolderById(n.fid).stats.unreadMessageCount;
                }
            });
            num -=lockNum;
            if(passtime<10*1000 && num>0 ){
                top.$Evocation.msgBoxHot.show();
            }else{
                top.$Evocation.msgBoxHot.setStatus();
            }
        },

        setVolume:function(){
            var prov = top.$User.getProvCode();
            if(prov == 1){
                return;
            }
            var self = this;
            var mailCapacity = inlinedGetInfoSetJSON['var'].mailCapacity;
            var tSize = mailCapacity.totalSize * 1024;
            var uSize = mailCapacity.messageSize * 1024;
            if(mailCapacity.totalSize != 0){
                var percent = (100 * uSize / tSize).toFixed(2) + '%';
                var totalSize = self.getFileSizeText(tSize);
                var useSize = self.getFileSizeText(uSize);
                var text = '已使用(<b>'+useSize+'，'+percent+'</b>)';
                $('#volumeCapacity').text(totalSize);
                $('#volumeUsed').find('.tips-text').html(text);
            }            
        },

        getFileSizeText : function (fileSize, options) {
            var unit = "B";
            if (!options) {
                options = {};
            }
            if (options.byteChar) {
                unit = options.byteChar; //用"字节"或者"Bytes"替代z最小单位"B"
                if (options.maxUnit == "B")
                    options.maxUnit = unit;
            }
            var maxUnit = options.maxUnit || "G";
            if (unit != maxUnit && fileSize >= 1024) {
                unit = "K";
                fileSize = fileSize / 1024;
                if (unit != maxUnit && fileSize >= 1024) {
                    unit = "M";
                    fileSize = fileSize / 1024;

                    //debugger
                    if (unit != maxUnit && fileSize >= 1024) {
                        unit = "G";
                        fileSize = fileSize / 1024;
                    }
                }
                fileSize = Math.ceil(fileSize * 100) / 100;
            }
            if (options.comma) {
                var reg = /(\d)(\d{3})($|\.)/;
                fileSize = fileSize.toString();
                while (reg.test(fileSize)) {
                    fileSize = fileSize.replace(reg, "$1,$2$3");
                }
            }
            return fileSize + unit;
        },

        //右上角查询话费 add by QZJ
        telCharge: function () {
            if (top.SiteConfig.closeTelCharge) { return;}
            var prv = top.$User.getProvCode();
            if(!top.SiteConfig.billAllowProvince[prv]){return ;}

            var self = this;
            var ul = $('#li_score').parent('ul');
            ul.children().eq(1).hide();
            var telCharge = ['<li class="">话费余额：',
                '<span class="callsInquiry">',
                    '<a id="chargeQuery" href="javascript:void(0);" class="btnNormal mr_10"><span>查询</span></a>',
                    '<span id="chargeFail" class="c_ff8157 hide" style="margin-right:5px">查询失败</span> ',
                    '<span id="chargeNum" class="mr_10 hide"><strong class="c_ff8157"></strong> 元</span>',
                    '<span id="chargeLoading" class="hide"><img src="../m2012/images/global/load.gif" width="16" height="16" style="vertical-align:middle; margin-right:5px"></span>',
                '</span>',
                '<a id="chargeDateil" href="javascript:;" class="c_457fbd">明细</a></li>'].join('');

            var telDOM = ul.append(telCharge).find('#telCharge');

            //余额查询
            $('#chargeQuery').click(function () {
                self._telChargeQuery();
            })

            self._telChargeQuery();


            //明细查询
            $('#chargeDateil').click(function () {
                top.BH('telChargequery');
                top.$App.show("googSubscription");
                top.$App.show("mpostOnlineService", null, {
                    title : '邮箱营业厅',
                    key : '38159',
                    inputData : {
                        urlParams : {
                            oct : 'main',
                            oac : 'index'   
                        },
                        key : '38159',
                        columnId : '38159',
                        columnName : '邮箱营业厅'
                    }
                });

                try{
                    top.M139.RichMail.API.call(top.getDomain('image') + "subscribe/inner/bis/subscribe?sid=" + top.sid, '{"comeFrom":503,"columnId":38159}'); //自动订阅
                } catch (e) {
                    console.log(e);
                }
            })
        },

        _telChargeQuery: function (callback) {
            $('#chargeLoading').removeClass('hide');
            $('#chargeQuery').addClass('hide');
            top.BH('telChargeHistory');
            var billCharge = top.$App.get('billCharge');
            if (billCharge && typeof billCharge.balance == 'string' && billCharge.balance!='null') {
                $('#chargeLoading').addClass('hide');
                $('#chargeNum').removeClass('hide').find('strong').text(billCharge.balance);
            } else {
                top.M139.RichMail.API.call("mailoffice:getTipsinfo", {}, function (result) {
                    $('#chargeLoading').addClass('hide'); 
                    var resp = result.responseData;
                    if (resp && resp.code === "S_OK" && typeof resp['var']['balance'] == 'string' && resp['var']['balance'] != 'null') {
                        setTimeout(function(){
                            top.$App.set({'billCharge': resp['var']});
                            top.$App.trigger({'billChargeLoad': resp['var']});
                            $('#chargeNum').removeClass('hide').find('strong').text(resp['var'].balance);
                        },0)
                    } else {
                        $('#chargeFail').removeClass('hide');
                        setTimeout(function () {
                            $('#chargeFail').addClass('hide');
                            $('#chargeQuery').removeClass('hide');
                        }, 2 * 1000);

                    }
                }, { method: "GET" });
            }
        },



        //右上角积分换大奖
        linkScore: function () {
            var dom = $('#scoreExchange');
            var url = 'http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201204A1&flag=';
            var links = [
                { flag: '15&sid=' + top.sid, Class: 'i_make_money', name: '换好礼' },
                { flag: '16&sid=' + top.sid, Class: 'i_soff', name: '抽大奖' },
                { flag: '17&sid=' + top.sid, Class: 'i_present', name: '赢大礼' }];
            var item = links[parseInt(Math.random() * 100) % links.length];
            $('#scoreExchange')[0].href = url+item.flag;
        },

        //个人信息区tab
        userInfoRender: function(){
            var self = this;

            this.model.createTabs({
                tabs: "#ul_userinfo>li",
                currentClass: "current",
                contents: ".welcomeTabList",
                change: function (content, index) {
                    var name = self.model.get("userInfoTab")[index].name;
                    top.BH('wel_' + name);

                    if (name == "checkIn") {
                        if (self.model.get("stateLoad").checkIn) return;

                        var checkInIframe = '<iframe id="checkInIframe" scrolling="no" frameborder="no" width="100%" height="75" src="{url}"></iframe>';
                        $(content).html(M139.Text.Utils.format(checkInIframe, {url: self.model.get("checkInUrl") + top.sid}));
                        self.model.get("stateLoad").checkIn = true;
                    } else if (name == "weather") {
                        if (self.model.get("stateLoad").weather) return;

                        M139.core.utilCreateScriptTag({
                            id: "weatherWrap",
                            src: "/m2012/js/packs/welcome_weather.html.pack.js",
                            charset: "utf-8"
                        }, function(){
                            self.weatherView = new M2012.Welcome.Weather.View({model: self.model});
                            self.weatherView.render();
                        });
                        self.model.get("stateLoad").weather = true;
                    }
                }
            });

            var isFlipping = false;
            function flipAnimate(target, start, step) {
                isFlipping = true;
                var i = start;
                var count = 0;
                var timer = setInterval(function () {
                    if (count > 7) {
                        console.log("clearInterval:" + count);
                        isFlipping = false;
                        clearInterval(timer);
                        count = 0;
                    }
                    else {
                        target.className = "img_" + i;
                        i += step;
                    }
                    count++;
                }, 30);
              
            }

            var flipEl = $('<a href="javascript:top.addBehaviorExt({ actionId:8000 , thingId: 3264});top.$App.show(\'blueSky\')" id="imgBox" class="img_1"></a>');
            if (top.SiteConfig.showCornerPic) {
                $(".welcomeBox").append(flipEl);
            }
            flipEl.hover(function () {
                if (!isFlipping) {
                    console.log("over" + isFlipping);
                    flipAnimate(this, 0, 1);
                }
            }, function () {
                if (!isFlipping) {
                    console.log("out" + isFlipping);
                    flipAnimate(this, 8, -1);
                }
            });
            
        },
        
        bindWindowResize: function(){
            /////IE9以下浏览器当欢迎页窗口小于1000px时，侧边框隐藏
            //全部控制，不分浏览器了
            var self = this;
            if (true || $.browser.msie && $.browser.version < 9.0) {
                self.resizeEvent();
                $(window).bind("resize", function(){
                    self.resizeEvent();
                })
            }
        },
        
        resizeEvent: function () {
            var aside = $(".welcomeAside");
            var main = $(".welcomeMain");
            var list = $('.operations_title');
            var bodyWidth = $("body").width();

            if (bodyWidth > 830) {
                list.removeClass('operations_title1024');
                main.css({ "margin-right": "279px" })
                aside.show();
            } else if (bodyWidth > 770) {
                list.addClass('operations_title1024');
                aside.show();
                main.css({ "margin-right": "279px" })
            } else if (bodyWidth > 580) {
                list.removeClass('operations_title1024');
                aside.hide();
                main.css({ "margin-right": "2px" });
            } else{
                list.addClass('operations_title1024');
                aside.hide();
                main.css({ "margin-right": "20px" });
            }

            /*
            if (bodyWidth < 500) {
                list.addClass('operations_title1024');
                aside.hide();
                main.css({ "margin-right": "20px" });
            } else if (bodyWidth < 750) {
                list.addClass('operations_title1024');
                aside.show();
            } else {
                $('.operations_title').removeClass('operations_title1024');
                aside.show();
                main.css({ "margin-right": "279px" });
            }*/

        },

        bindBottomLink: function(){
            //跳去标准版1.0
            $("#btn_old").attr("href", "http://" + top.window.location.host
            + "/main.htm?func=global:execTemp&sid=" + top.$App.getSid()).click(function() {
                var MATRIX_10 = 10;
                top.M139.RichMail.API.call("user:setUserConfigInfo", {
                    configTag: "LoginVersion",
                    configValue: MATRIX_10,
                    type: "int"
                }, function (result) {});
            });

            //基础版
            var simpleStyleIndex="6";
            $("#btn_base").attr("href",getBaseUrl(simpleStyleIndex));

            function getBaseUrl(style) {
                //跳转url
                var url = "",
                //分区id
                    partId = "",
                //跳转基础版域名
                    loginDomain = "",
                //域
                    dm = document.domain;
                //rm只有基础版，不用判断

                loginDomain = top.domainList.global.mail || ''; //SiteConfig['loginDomain']||"";
                if (loginDomain) {
                    url = loginDomain + '/login/switchto.aspx?sid=' + top.$App.getSid() + '&v=3';
                }
                return url;
            }
        },
		// 初始化模型层数据
		getDataSource : function(callback){
		
		}
    }));
})(jQuery, _, M139);

