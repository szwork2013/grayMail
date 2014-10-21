/**
 * 群邮件中的邀请加入群组信息需要加载的JS
 */
;(function () {
    var groupMailInviteInfo = {
        inviteLink : $("#groupMailInviteOp", document)
    };

    function initEvents () {
        groupMailInviteInfo.inviteLink.unbind("click").bind("click", function () {
            top.BH && top.BH('gom_mail_add_group');
            top.$App && top.$App.show('teamNotify');
            return false;
        });
    }

    function init() {
        show();
        initEvents();
    }

    function show() {
        var element = groupMailInviteInfo.inviteLink;
        element[0].style.display = 'block';
        $(element).css("cursor", "pointer");
    }

    init();
})();