$(document).ready(function(){

    //�����б�ĸ߶�
    $('.menu-cont').height($(window).height() - 142);
    
    //��ͼƬ�ӻ���ַ
    $("#table_list img").each(function(){
        var img = $(this);
        var alt = img.attr('alt');
        img.attr('src', resourcePath + alt);
        img.attr('alt', 'ȺͼƬ');
    });
    //�����ӵ�ַ��sid
    var a_id = $('#a_InviteUserList');
    a_id.attr('href', a_id.attr('href') + "?Sid=" + top.UserData.ssoSid + "&rn=" + Math.random());
    a_id = $('#mailList');
    a_id.attr('href', a_id.attr('href') + "?Sid=" + top.UserData.ssoSid + "&rn=" + Math.random());
    
    var row = 0;
    var Exit_Logout = 0; //1��ʾ���˳�����ע��
    var Forbit = 0; //1��ʾ������
    var Is_open_mail_inform = $('.clertN');
    $('#table_list tr').each(function(){
		Exit_Logout=0;
        //���Ⱥ���û����ȥ��
        var name_a = $(this).find('.name > a')[0];
        name_a.title = $.trim(name_a.title).replace("Ⱥ���:��", "���޼��");
        
        Is_open_mail_inform.show();
        var groupNumber = $.trim($(this).find('.head-img > div').html());
        //Ⱥ��Ա�� ��
        var add_div = $(this).find('.add > div');
        var oper_div = $(this).find('.oper > div');
        var add_div_val = $.trim(add_div.html());
        var add_div_val_array = add_div_val.split(",");
        
        var notice_div = $(this).find('.notice > div');
        var notice_div_val = $.trim(notice_div.eq(0).html());
        var notice_div_val_array = notice_div_val.split(",");
        //update
        if (add_div_val_array.length == 4) {
            if ((add_div_val_array[1] & 16) == 16) {
                Exit_Logout = 1;
                Forbit = 0;
                add_div.html("��ע��");
                oper_div.html("<a href='javascript:Del_Exit_Logout(" + groupNumber + ");void(0);'>ɾ��</a>");
            }
            else 
                if ((add_div_val_array[1] & 64) == 64) {
                    Forbit = 1;
                    add_div.html("������");
					if (add_div_val_array[2] == 1) {
						Exit_Logout = 1;
					}
                }
                else 
                    if (add_div_val_array[2] == 1) {
                        Exit_Logout = 1;
                        Forbit = 0;
                        add_div.html("���˳�");
                        oper_div.html("<a href=\"javascript:OpenJoinWin(" + groupNumber + "); void (0);\">�������Ⱥ</a>|<a href='javascript:Del_Exit_Logout(" + groupNumber + ");void(0);'>ɾ��</a>");
                    }
                    else {
                        Exit_Logout = 0;
                        Forbit = 0;
                        if (notice_div_val_array.length == 5) {
                            var adminState = notice_div_val_array[3];
                            if (adminState == "0") {
                                add_div.html("<a href='GroupUserList.aspx?gn=" + groupNumber + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random() + "'>" + add_div_val_array[0] + "��</a>");
                            }
                            else {
                                //Ⱥ��Ա��
                                var g_Num = "<a href='SetManager.aspx?gn=" + groupNumber + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random() + "'>" + add_div_val_array[0] + "��</a>";
                                var app_Num = ""; //������Ա��
                                if (add_div_val_array[3] != "0") {
                                    app_Num = "<a href='ApplicantJoin.aspx?gn=" + groupNumber + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random() + "'>(" + add_div_val_array[3] + ")</a>";
                                }
                                var title = "������" + add_div_val_array[0] + "����Ա��" + add_div_val_array[3] + "��δ��������룩";
                                add_div[0].title = title;
                                
                                add_div.html(g_Num + app_Num);
                            }
                        }
                    }
        }
        
        if (Exit_Logout == 0) {
            if (notice_div_val_array.length == 5) {
                if ((notice_div_val_array[0] & 2) != 2) {
                    notice_div.eq(0).html("<a href='javascript:SetMailMsg(" + groupNumber + ",2," + row + ");void(0);'>����</a>");
                }
                else {
                    notice_div.eq(0).html("<span>" + notice_div_val_array[1] + "-" + notice_div_val_array[2] + "��</span><a href='javascript:SetMailMsg(" + groupNumber + ",3," + row + ");void(0);'>�޸�</a>|<a href='javascript:Btn_Save(" + groupNumber + ",0," + row + ");void(0);'>�ر�</a>");
                }
                
                var adminState = notice_div_val_array[3];
                var adminhtml = '';
                if (adminState == "0") {
                    name_a.href = "EditGroupNickName.aspx?gn=" + groupNumber + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random();
                    adminhtml = "<a href='EditGroupNickName.aspx?gn=" + groupNumber + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random() + "'>�鿴</a>";
                }
                else {
                    name_a.href = "EditGroup.aspx?gn=" + groupNumber + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random();
                    adminhtml = "<a href='EditGroup.aspx?gn=" + groupNumber + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random() + "'>�������</a>";
                }
                //����
                var show_invite = '';
                if (notice_div_val_array[4] != "0" && adminState != "0") {
                    show_invite = "<a href='AddUserGroup.aspx?gn=" + groupNumber + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random() + "'>�����Ա</a>|";
                }
                //ע�� �˳�
                var show_Logout = '';
                if (adminState == "2") {
                    show_Logout = "<a href='LogoutGroup.aspx?gn=" + groupNumber + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random() + "'>ע��</a>|";
                }
                else {
                    show_Logout = "<a href='javascript:Logout(" + groupNumber + ");void(0);'>�˳�</a>|";
                }
                
                if ((notice_div_val_array[0] & 1) != 1) {
                    oper_div.html(show_invite + "<a href='javascript:Set_mail(" + groupNumber + ",1," + row + "," + adminState + ");void(0);'>����</a>|" + show_Logout + adminhtml);
                }
                else {
                    oper_div.html(show_invite + "<a href='javascript:Set_mail(" + groupNumber + ",0," + row + "," + adminState + ");void(0);'>����</a>|" + show_Logout + adminhtml);
                }
            }
        }
        else {
            notice_div.eq(0).html('');
        }
        if (Forbit == 1) {
            notice_div.eq(0).html('');
            var adminState = notice_div_val_array[3];
            var adminhtml = '';
            if (adminState == "0" || adminState == "1") {
                name_a.href = "EditGroupNickName.aspx?gn=" + groupNumber + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random();
                adminhtml = "<a href='EditGroupNickName.aspx?gn=" + groupNumber + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random() + "'>�鿴</a>";
            }
            else {
                name_a.href = "EditGroup.aspx?gn=" + groupNumber + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random();
                adminhtml = "<a href='EditGroup.aspx?gn=" + groupNumber + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random() + "'>�������</a>";
            }
            

            //ע�� �˳�
            var show_Logout = '';
            if (adminState == "2") {
                show_Logout = "<a href='LogoutGroup.aspx?gn=" + groupNumber + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random() + "'>ע��</a>|";
            }
            else {
                if (Exit_Logout == 0) 
                    show_Logout = "<a href='javascript:Logout(" + groupNumber + ");void(0);'>�˳�</a>|";
            }
            
            if ((notice_div_val_array[0] & 1) != 1) {
                oper_div.html(show_Logout + adminhtml);
            }
            else {
                oper_div.html(show_Logout + adminhtml);
            }
        }
        
        row++;
    });
    
    $('.container').show();
});

function SetMailMsg(gno, oper, row){
    if (oper == 3) {
        top.addBehaviorExt({
            thingId: 4,
            actionId: 10704,
            moduleId: 14
        });
    }
    var div = $('#table_list tr').eq(row).find('.notice > div');
    div.eq(0).hide();
    div.eq(1).html("�ֻ�����ʱ�䣺" + Select('startTime' + row, 0) + "��-" + Select('endTime' + row, 1) + "��<input name='btn_save' type='button' onclick='Btn_Save(" + gno + "," + oper + "," + row + ")' value='����'/> " +
    "<input name='btn_cancel' type='button' onclick='Cancel(" +
    row +
    ")' value='ȡ��' />");
    div.eq(1).show();
    $(".menu-cont").width($(".menu-tb").width());
}

//���� �ܾ�
function Set_mail(gno, oper, row, adminState){
    if (oper == 1) {
        top.addBehaviorExt({
            thingId: 1,
            actionId: 10704,
            moduleId: 14
        });
    }
    var div = $('#table_list tr').eq(row).find('.oper > div');
    var postData = "t=2&gn=" + gno + "&o=" + oper;
    $.ajax({
        type: "POST",
        cache: false,
        url: "/GroupMail/GroupMailAPI/GroupManager.ashx?sid=" + top.UserData.ssoSid + "&rd=" + Math.random(),
        data: postData,
        success: function(msg){
            if (msg == "0") {
                var adminhtml = '';
                if (adminState == "0") {
                    adminhtml = "<a href='EditGroupNickName.aspx?gn=" + gno + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random() + "'>�鿴</a>";
                }
                else {
                    adminhtml = "<a href='EditGroup.aspx?gn=" + gno + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random() + "'>�������</a>";
                }
                //����
                var notice_div = $('#table_list tr').eq(row).find('.notice > div');
                var notice_div_val = $.trim(notice_div.eq(0).html());
                var notice_div_val_array = notice_div_val.split(",");
                var show_invite = '';
                if (notice_div_val_array[4] != "0" && adminState != "0") {
                    show_invite = "<a href='AddUserGroup.aspx?gn=" + gno + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random() + "'>�����Ա</a>|";
                }
                //ע�� �˳�
                var show_Logout = '';
                if (adminState == "2") {
                    show_Logout = "<a href='LogoutGroup.aspx?gn=" + gno + "&sid=" + top.UserData.ssoSid + "&rn=" + Math.random() + "'>ע��</a>|";
                }
                else {
                    show_Logout = "<a href='javascript:Logout(" + gno + ");void(0);'>�˳�</a>|";
                }
                if (oper == 0) {
                    div.html(show_invite + "<a href='javascript:Set_mail(" + gno + ",1," + row + "," + adminState + ");void(0);'>����</a>|" + show_Logout + adminhtml);
                }
                else {
                    div.html(show_invite + "<a href='javascript:Set_mail(" + gno + ",0," + row + "," + adminState + ");void(0);'>����</a>|" + show_Logout + adminhtml);
                }
            }
            else 
                if (msg == "999") {
                    Tool.invalidAction();
                    window.location.reload();
                }
                else {
                    top.FloatingFrame.alert(msg);
                    window.location.reload();
                }
        },
        error: function(msg){
            top.FloatingFrame.alert(frameworkMessage.optFail);
            window.location.reload();
        }
    });
    $(".menu-cont").width($(".menu-tb").width());
}

function Btn_Save(gno, oper, row){
    var div = $('#table_list tr').eq(row).find('.notice > div');
    div.eq(0).show();
    div.eq(1).hide();
    var begintime = 0;
    var endtime = 1;
    if (oper == 2 || oper == 3) {
        begintime = $('#startTime' + row).val();
        endtime = $('#endTime' + row).val();
    }
    
    if (!CheckTime(begintime, endtime)) {
        top.FloatingFrame.alert(frameworkMessage.startTime);
        return false;
    }
    if (oper == 0) {
        top.addBehaviorExt({
            thingId: 2,
            actionId: 10704,
            moduleId: 14
        });
    }
    
    var postData = "t=1&gn=" + gno + "&o=" + oper + "&bt=" + begintime + "&et=" + endtime;
    $.ajax({
        type: "POST",
        cache: false,
        url: "/GroupMail/GroupMailAPI/GroupManager.ashx?sid=" + top.UserData.ssoSid + "&rd=" + Math.random(),
        data: postData,
        success: function(msg){
            if (msg == "0") {
                if (oper == 0) {
                    //�ر�
                    div.eq(0).html("<a href='javascript:SetMailMsg(" + gno + ",2," + row + ");void(0);'>����</a>");
                    div.eq(1).hide();
                }
                else 
                    if (oper == 3 || oper == 2) {
                        //�������޸�
                        div.eq(0).html("<span>" + begintime + "-" + endtime + "��</span><a href='javascript:SetMailMsg(" + gno + ",3," + row + ");void(0);'>�޸�</a>|<a href='javascript:Btn_Save(" + gno + ",0," + row + ");void(0);'>�ر�</a>");
                    }
            }
            else 
                if (msg == "999") {
                    Tool.invalidAction();
                    window.location.reload();
                }
                else {
                    top.FloatingFrame.alert(msg);
                    window.location.reload();
                }
        },
        error: function(msg){
            top.FloatingFrame.alert(frameworkMessage.optFail);
            window.location.reload();
        }
    });
}

function Logout(groupNumber){
    top.FF.confirm(frameworkMessage.m_logout_group, function(){
        var postData = "t=logout&gn=" + groupNumber;
        $.ajax({
            type: "POST",
            cache: false,
            url: "/GroupMail/GroupMailAPI/GroupManager.ashx?sid=" + top.UserData.ssoSid + "&rd=" + Math.random(),
            data: postData,
            success: function(msg){
                if (msg == "0") {
                    top.FloatingFrame.alert(frameworkMessage.optSucess);
                    window.location.reload();
                }
                else 
                    if (msg == "999") {
                        Tool.invalidAction();
                        window.location.reload();
                    }
                    else {
                        top.FloatingFrame.alert(msg);
                        window.location.reload();
                    }
            },
            error: function(msg){
                top.FloatingFrame.alert(frameworkMessage.optFail);
                //window.location.reload();
            }
        });
    }, function(){
        return false;
    });
}

//ɾ���˳���Ⱥ��ע����Ⱥ
function Del_Exit_Logout(gno){
    top.addBehaviorExt({
        thingId: 5,
        actionId: 10704,
        moduleId: 14
    });
    top.FF.confirm(frameworkMessage.deleteGroup, function(){
        var postData = "t=3&gn=" + gno;
        $.ajax({
            type: "POST",
            cache: false,
            url: "/GroupMail/GroupMailAPI/GroupManager.ashx?sid=" + top.UserData.ssoSid + "&rd=" + Math.random(),
            data: postData,
            success: function(msg){
                if (msg == "0") {
                    top.FloatingFrame.alert(frameworkMessage.optSucess);
                    window.location.reload();
                }
                else 
                    if (msg == "999") {
                        Tool.invalidAction();
                        window.location.reload();
                    }
                    else {
                        top.FloatingFrame.alert(msg);
                        window.location.reload();
                    }
            },
            error: function(msg){
                top.FloatingFrame.alert(frameworkMessage.optFail);
                window.location.reload();
            }
        });
    }, function(){
        return false;
    });
}

function Cancel(row){
    var div = $('#table_list tr').eq(row).find('.notice > div');
    div.eq(0).show();
    div.eq(1).hide();
}

function Select(id, s){
    var option0 = "<option value='0'>0</option>";
    var option24 = "<option value='24'>24</option>";
    var selected8 = "selected='selected'";
    var selected20 = "selected='selected'";
    if (s == 0) {
        option24 = "";
        selected20 = "";
    }
    else {
        option0 = "";
        selected8 = "";
    }
    return "<select name='select' id=" + id + ">" + option0 + "<option value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option>" +
    "<option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option " +
    selected8 +
    " value='8'>8</option><option value='9'>9</option><option value='10'>10</option>" +
    "<option value='11'>11</option><option value='12'>12</option><option value='13'>13</option><option value='14'>14</option><option value='15'>15</option><option value='16'>16</option>" +
    "<option value='17'>17</option><option value='18'>18</option><option value='19'>19</option><option " +
    selected20 +
    " value='20'>20</option><option value='21'>21</option><option value='22'>22</option><option value='23'>23</option>" +
    option24 +
    "</select>";
}

//t =0���� t=1�ر�
function Set_all_mail_inform(oper){
    var begintime = "0";
    var endtime = "1";
    if (oper == 0) {
        begintime = $("#txt_Begin_Time").val();
        endtime = $("#txt_End_Time").val();
        if (!CheckTime(begintime, endtime)) {
            top.FloatingFrame.alert(frameworkMessage.startTime);
            return false;
        }
    }
    if (oper == 1) {
        top.addBehaviorExt({
            thingId: 3,
            actionId: 10704,
            moduleId: 14
        });
    }
    var groupNumberList = '';
    $('#table_list tr').each(function(){
        groupNumberList = groupNumberList + $.trim($(this).find('.head-img > div').html()) + ",";
    });
    
    var postData = "t=" + 4 + "&o=" + oper + "&gnlist=" + groupNumberList + "&bt=" + begintime + "&et=" + endtime;
    $.ajax({
        type: "POST",
        cache: false,
        url: "/GroupMail/GroupMailAPI/GroupManager.ashx?sid=" + top.UserData.ssoSid + "&rd=" + Math.random(),
        data: postData,
        success: function(msg){
            if (msg == "0") {
                var a_open_mail_inform = $('#a_open_mail_inform');
                top.FloatingFrame.alert(frameworkMessage.optSucess);
                window.location.reload();
            }
            else 
                if (msg == "999") {
                    Tool.invalidAction();
                    window.location.reload();
                }
                else {
                    top.FloatingFrame.alert(msg);
                }
        },
        error: function(msg){
            top.FloatingFrame.alert(frameworkMessage.optFail);
            window.location.reload();
        }
    });
}

function Show_Set_All_Mail(){
    var span = $('#span_Set_all_Mail');
    span.html(">>�ֻ�����ʱ�䣺" + Select('txt_Begin_Time', 0) + "��-" + Select('txt_End_Time', 1) + "��<input name='btn_save' type='button' onclick='Set_all_mail_inform(0)' value='����'/> " +
    "<input name='btn_cancel' type='button' value='ȡ��' onclick='Hide_Set_All_Mail()' />");
    span.show();
}

function Hide_Set_All_Mail(){
    $('#span_Set_all_Mail').hide();
}

function CheckTime(Start_Time, End_Time){
    var s_time = parseInt(Start_Time);
    var e_time = parseInt(End_Time);
    if (s_time < e_time) {
        return true;
    }
    else {
        return false;
    }
}

function OpenJoinWin(parm){
    var postData = "t=" + 5;
    $.ajax({
        type: "POST",
        cache: false,
        url: "/GroupMail/GroupMailAPI/GroupManager.ashx?sid=" + top.UserData.ssoSid + "&rd=" + Math.random(),
        data: postData,
        success: function(msg){
            if (msg == "0") {
                top.FloatingFrame.open('�������Ⱥ', 'http://' + location.host + '/GroupMail/GroupOper/JoinPage.aspx?gn=' + parm + "&sid=" + top.UserData.ssoSid + "&rd=" + Math.random(), 420, 320, true, false, false, false);
            }
            else 
                if (msg.indexOf("999") != -1) {
                    Tool.invalidAction();
                    window.location.reload();
                }
                else {
                    top.FloatingFrame.alert(frameworkMessage.joinGroup.fromat(msg));
                }
        },
        error: function(msg){
            top.FloatingFrame.alert(frameworkMessage.optFail);
            window.location.reload();
        }
    });
}


