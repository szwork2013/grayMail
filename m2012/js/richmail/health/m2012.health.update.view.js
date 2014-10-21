(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    /**
     * @namespace
     * 我的应用
     */

    M139.namespace('M2012.Health.Update.View', superClass.extend({
        initialize: function(){
            this.model = new M2012.Health.Update.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        id : 'updateTab',
        len : 4,
        template: {
            'title': _.template('<% if(num == 0){ %><p class="c_008e11 fz_16 mt_15">邮箱君的设置已是最佳状态，不需要优化</p>' +
                '<% }else{ %><p class="c_999">发现<var class="c_ff5907"> <%= num %> </var>个可优化选项</p>' +
                '<p class="mt_15"><a hidefocus="1" class="btnG" href="javascript:updateView.oneClick();" title="" id="bottomSend" bh="health_oneclick"><span>立即优化</span></a></p> <% }%>'),
            'result_ok': _.template('<p class="c_008e11 fz_16 mt_15">一键优化完成！共完成<%= num %>个可优化项</p>'),
            'result_error': _.template('<p class="c_008e11 fz_16 mt_10">已完成<var><%= num %></var>个可优化项，' +
                '<span class="c_de0202"><var><%= err %></var>个失败</span>' +
                '<a hidefocus="1" class="btnG ml_15" href="javascript:updateView.oneClick();;" title="" bh="health_oneclick"><span>重新优化</span></a></p>')
        },
        content: function(){
            if( $('#updateTab .mtMain').length != 0)return;
            var self = this,
                model = self.model.attributes;
            var text = [
                    {
                        'name' : '联系人设置',
                        'rid' : 'contact',
                        'op' : [{'id': 'autoSaveContact', 'text': '邮件、短信发送成功后，是否自动保存联系人', 'bh': 'health_autosavecontact', '2' : ['未保存', '建议保存']}]
                    },{
                        'name' : '手机通知',
                        'rid' : 'mobile',
                        'op' : [
                            {'id': 'loginNotify', 'text' : '登录短信通知', 'bh': 'health_loginnotify', '0' : ['每次都发送', '建议异常时发送'] , '1' : ['不发送', '建议异常时发送']},
                            {'id' : 'mailNotify', 'text' : '邮件到达通知', 'bh': 'health_mailnotify', '0': ['未开启', '建议开启']}
                        ]
                    },{
                        'name' : '手机登录设置',
                        'rid' : 'addr',
                        'op' : [{'id' : 'loginDirectly', 'text' : '通过移动GPRS、3G、4G网络访问139邮箱手机版本时', 'bh': 'health_logindirectly', '2' : ['输入密码登录', '建议免密码直接登录']}]
                    },{
                        'name': '客户端收发邮件设置',
                        'rid' : 'proxy',
                        'op' : [{'id' : 'POPReaded', 'text' : '使用POP方式收邮件时，未读邮件状态是否自动标记为已读', 'bh': 'health_POPreaded', '0' : ['未读邮件自动标记为已读', '建议未读邮件状态不变']}]
                    }],
                tpl_th = _.template(['<table class="mtMain" rid="<%= rid %>"><thead><tr><th width="150" class="fz_14">',
                    '<%= name %></th><th width="210" class="fw_n">共<%= num %>项</th>',
                    '<th width="" class="ta_r" colspan="2"><a href="javascript:;" class="mr_10 cArare"><i class="i-mtUp"></i></a></th></tr></thead></table>'].join('')),
                tpl_tr = _.template(['<tr class="current"><td width="17"><input type="checkbox" name="" id="<%= id %>" checked="" /></td>',
                    '<td class="pl_5"><label for="<%= id %>"><%= text %></label></td>',
                    '<td width="20%"><%= explain[0] %></td><td width="20%"><%= explain[1] %></td>',
                    '<td width="85" class="ta_r"><a id="btn_<%= id %>" href="javascript:;" bh="<%= bh %>" class="btnNormal mr_10"><span>优化</span></a></td></tr>'].join(''));
            self.len = 6;
            for(var i in model){
                var index = {'autoSaveContact': 0, 'loginNotify': 1, 'mailNotify': 1, 'loginDirectly' : 2 , 'POPReaded' : 3}[i],
                    temp = text[index];
                if(model[i][0] == 1){
                    continue;
                }
                self.len--;
                if(temp == null || temp.op.length == 1){
                    temp = null;
                }else{
                    temp.op[0] = temp.op[i == 'loginNotify' ? 1 : 0];
                    temp.op.length = 1;
                }
                text[index] = temp;
            }
            //console.log('new text',text);

            var ret = '', ex = '';

            for(var j = 0; j < text.length; j++){
                if(text[j] != null){
                    text[j].num = text[j].op.length;
                    ret += tpl_th(text[j]);
                    ret += '<table class="mtMain" rid="' + text[j]['rid'] + '"><tbody>';
                    for(var k = 0; k < text[j].op.length; k++){
                        //console.log(text[j].op[k], model, model[text[j].op[k].id]);
                        ex = text[j].op[k][model[text[j].op[k].id][1]];
                        text[j].op[k].explain = ex;
                        ret += tpl_tr(text[j].op[k]);
                    }
                    ret += '</tbody></<table>';
                }
            }
            return ret;
        },
        render: function(){
            var self = this;
            $('#updateTab .mailTestingBox_table').remove('.mtMain').append(self.content());
            $('#updateTab .mailTestingBox_head dd').eq(0).addClass('none');
            $('#updateTab .mailTestingBox_head dd').eq(1).html(self.template.title({'num' : self.len})).removeClass('none');
            $('#updateTab .mailTestingBox_head .stateImg').removeClass('i-mtGreenYhing').addClass('i-mtGreen');
            if(self.len == 0){
                $('#updateTab .mailTestingBox_table').addClass('none');
            }else{
                $('#updateTab .mailTestingBox_table').removeClass('none');
                $('#updateTab th a').on('click',function(){
                    var rid  = $(this).parents('.mtMain').attr('rid');
                    $('.mtMain[rid=' + rid + ']').eq(1).toggle();
                }).toggle(function(){
                    $(this).find('i').removeClass().addClass('i-mtDown');
                },function(){
                    $(this).find('i').removeClass().addClass('i-mtUp');
                });
                $('#allTest').on('click',function(){
                    if($(this).attr('checked') == 'checked'){
                        $('input').not('#allTest').attr('checked', 'checked');
                    }else{
                        $('input').not('#allTest').attr('checked', false);
                    }
                }).attr('checked', 'checked');
                $('#updateTab .mailTestingBox_table a').on('click', function(){
                    var id = $(this).attr('id');
                    id = id.substring(4);
                    M139.RichMail.API.call("healthy:oneClickUpdate", {updateKey: id},function(data){
                        var msg = data.responseData;
                        if(msg['code'] == "S_OK"){
                            var para = {};
                            para[id] = msg['var'][id];
                            self.updateOp(para);
                        }
                    });
                });
            }
        },
        checking: function(){
            var self = this,
                recommend = {
                    "autoSaveContact":"1",
                    "loginNotify":"2",
                    "mailNotify":"9",
                    "loginDirectly":"1",
                    "POPReaded":"1"
                };
            $('#updateTab .percentageEd').css('width', '0%');
            $('#updateTab .mailTestingBox_head dd').eq(1).addClass('none');
            $('#updateTab .mailTestingBox_head dd').eq(0).removeClass('none');
            $('#updateTab .mailTestingBox_head .stateImg').addClass('i-mtGreenYhing').removeClass('i-mtGreen');
            $("#updateTab .percentageEd").animate({
                width: "60%"
            }, 600 );
            function isOp(data){
                var temp = 0;
                for(var i in data){
                    temp = data[i] != recommend[i] ? 1 : 0;
                    self.model.set(i, [temp, data[i]]);
                }
            }
            M139.RichMail.API.call("healthy:getOneClickUpdateInfo", {},function(data){
                var msg = data.responseData;
                if(msg['code'] == "S_OK"){
                    $("#updateTab .percentageEd").animate({
                        width: "100%"
                    },500 );
                    isOp(msg['var']);
                    self.render();
                }
            });
        },
        oneClick: function(){
            var self = this,
                oChecked = $('td :checkbox:checked'),
                para = [];
            for(var i = 0; i < oChecked.length; i++){
                para[i] = oChecked.eq(i).attr('id');
            }
            if(para.length == 0 && ($('#updateTab .i-mtErrow').length == 0 || ($('#updateTab .i-mtErrow').length != 0 && $('#allTest:checked').length == 0) )){
                top.$Msg.alert(
                    '请勾选优化项',
                    function () {return false;},
                    {
                        dialogTitle: '提示',
                        icon: "warn"
                    }
                );
                return;
            }
            if(para.length == 0){
                var oAId = $('#updateTab .i-mtErrow').parents('tr').find('a').attr('id');
                oAId = oAId.substring(4);
                para = [oAId];
            }
            M139.RichMail.API.call("healthy:oneClickUpdate", {updateKey: para.join(',')},function(data){
                var msg = data.responseData;
                if(msg['code'] == "S_OK"){
                    self.updateOp(msg['var']);
                }
            });
        },
        updateOp: function(options){
            var num = 0, err = 0 ,oTr;
            for(var i in options){
                oTr = $('#' + i).parents('tr');
                if(options[i] == 'S_OK'){
                    oTr.find('td').eq(0).addClass('ta_r').html('<i class="i-mtOk"></i>');
                    oTr.find('td').eq(4).html('<span class="c_008e11 mr_10">已优化</span>');
                    oTr.removeClass();
                    if(i == 'POPReaded'){
                        top.$App.getConfig("UserAttrs").unallow_pop3_change_mail_state = 1;
                    }else if(i == 'loginDirectly'){
                        top.$App.getConfig('UserData').mainUserConfig["checkloginway"] && (top.$App.getConfig('UserData').mainUserConfig["checkloginway"][0] = '1');
                    }else if(i == 'autoSaveContact'){
                        top.$App.setUserCustomInfoNew({ '9': 1, "readAutoSave": top.$App.getUserCustomInfo("readAutoSave")});
                    }
                }else if(options[i] == 'S_ERROR'){
                    err++;
                    oTr.find('td').eq(0).addClass('ta_r').html('<i class="i-mtErrow"></i>');
                    oTr.find('a').eq(0).html('<span>重新优化</span>');
                    oTr.removeClass().addClass('mtErrow');
                }
            }
            if($('#updateTab .i-mtOk').length != 0 || $('#updateTab .i-mtErrow').length != 0){
                num = $('#updateTab .i-mtOk').length;
                err = $('#updateTab .i-mtErrow').length
                if(err == 0){
                    $('#updateTab .mailTestingBox_head dd').eq(1).html(this.template.result_ok({'num' : num}));
                }else{
                    $('#updateTab .mailTestingBox_head dd').eq(1).html(this.template.result_error({'num' : num, 'err' : err}));
                }
            }
        },
        unload:function(){
            $('#updateTab .mtMain').remove();
            $('#updateTab .percentageEd').css('width', '0%');
        }
    }));
    $(function () {
        window.updateView = new M2012.Health.Update.View();
    });
})(jQuery, _, M139);