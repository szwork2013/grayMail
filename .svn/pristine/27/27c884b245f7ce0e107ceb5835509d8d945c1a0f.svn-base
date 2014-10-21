/**
* @fileOverview 信纸成功页视图层--主视图
* @namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Success.Aliasname', superClass.extend(
    {
        elModule: $("#randomModule"),
        aliasNameTemple:['<strong class="writeOk_box_title">别名发信，保护号码隐私</strong>',
                        '<ul class="writeOk_box_ul clearfix">',
                            '<li class="clearfix">',
                                '<span class="writeOk_label">别名：</span>',
                                '<div class="writeOk_element">',
                                    '<p>',
                                        '<input type="text" name="" maxlength="15" class="iText gray" first="true" value="例如：zhangsan">',
                                        '<span class="c_666">@139.com</span>',
                                    '</p>',
                                    '<p class="writeOk_element_p">以字母开头，5-15个字符</p>',
                                    '<p class="clearfix writeOk_element_btn"><a class="btnSetG" href="javascript:;"  id="saveName"><span>确 定</span></a><span class="gray">*别名保存后不可修改删除</span></p>',
                                '</div>',
                            '</li>',
                        '</ul>'].join(""),
        aliasNameSucTemple:[ '<div class="writeOk_boxOther clearfix">',
                    '<i class="i_ok_min"></i>',
                    '<div class="writeOk_boxOther_right">',
                        '<strong>设置成功</strong>',
                        '<p id="okName">别名发信地址：{name}</p>',
                    '</div>',
                    '</div>'].join(""),
        aliasNameFailTemple:[ '<div class="writeOk_boxOther clearfix">',
                    '<i class="i_warn_min"></i>',
                    '<div class="writeOk_boxOther_right">',
                        '<strong>网页君开小差啦，保存不成功</strong>',
                        '<p class="mt_10"><a href="javascript:;" class="btnSetG"><span>重新保存</span></a></p>',
                    '</div>',
                    '</div>'].join(""),
        initialize: function () {
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        }, 
        render:function(){ //别名设置          
            var self = this;  
            var aliasSet = self.elModule.html(self.aliasNameTemple).show();
            var input = aliasSet.find('input'),
                saveName = aliasSet.find('#saveName');

            //事件绑定--输入验证
            input.bind({
                "keyup":function(){
                    self._clientCheckAlias(input.val());
                },
                "click":function(){
                    if($(this).attr('first')){
                        $(this).val('').attr('first','');
                    }
                }
            });

            saveName.bind({
                "click":function(){
                    top.addBehaviorExt({ actionId: 105286, thingId:0});
                    var name = input.val();
                    if(self._clientCheckAlias(name)){
                        self._setAliasName(name);
                    }
                }
            })
        },
        _clientCheckAlias: function (alias) {
            var text = "", 
                self = this,
                deaults = '例如：zhangsan';
            
            var aliasSet = self.elModule;
            var rightTips = "以字母开头，5-15个字符";
            var tips = aliasSet.find('.writeOk_element_p');
            
            var flag = false;
            if ($.trim(alias) == "" || alias == deaults) {
                text = "请输入别名帐号"
            }else if (/\s/.test(alias) || /[^A-Za-z0-9_\-\.]/.test(alias)) {  //其他字符
                text = "别名支持字符范围：0~9,a~z,“.”,“_”,“-”";
            }else if (/^[^A-Za-z]\w*/.test(alias)) {
                text = "必须以英文字母开头"; //开头非字母
            }else if(alias.length<5){
                text = "别名帐号为5-15个字符，以英文字母开头";
            }else{  //满足条件
                flag = true;
            }
            if(text){
                tips.html(text).addClass('red');
            }else{
                tips.html(rightTips).removeClass('red');
            }
            return flag;
        },
        _serverCheckAlias:function(name,callback){
            var self = this;
            M139.RichMail.API.call("user:checkAliasAction", { "alias": name }, function (response) {
                if (response && response.responseData && response.responseData.code) {
                    var res = response.responseData;
                    var code = res['code'];
                    if (code == "S_OK") {
                        callback(name);
                    } else if (code == "S_FALSE") {
                        top.$Msg.alert("登录超时，请重新登录", { delay: 3000 });
                    } else{
                        var msg = res.msg || res["var"].msg || "系统繁忙，请稍后再试。";
                        self.elModule.find('.writeOk_element_p').html(msg).addClass('red'); 
                        self.elModule.find('input:text').focus();
                    }
                }
            });
        },
        _setAliasName:function(name){
            var self = this;
            var aliasSet = self.elModule;
            self._serverCheckAlias(name,function(){
                M139.RichMail.API.call("user:updateAliasAction", { "alias": name }, function (response) {
                    if (response && response.responseData) {
                        if (response.responseData.code == 'S_OK') {
                            top.$App.trigger("userAttrChange");
                            var html = $T.format(self.aliasNameSucTemple,{name:name+'@139.com'});
                            aliasSet.html(html);
                        } else {
                            aliasSet.html(self.aliasNameFailTemple).find('a').click(function(){
                                self.render();
                            });
                        }
                    }
                });
            });
        }
    }));
})(jQuery, _, M139);

