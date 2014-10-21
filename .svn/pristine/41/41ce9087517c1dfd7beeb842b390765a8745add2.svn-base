(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.GroupMail.View.NoGroup', superClass.extend(
    {
        el: "#member-no-group-container",
        template: '<div class="p_relative emptyGroup"> \
            <h3>高效沟通的利器——群邮件</h3> \
        <p class="fz_12 c_666 empty_sub">使用群邮件，更好地进行 项目讨论、小组会议、流程沟通····</p> \
    <div class="ta_c" style="padding-top: 330px"> \
        <a href="javascript:;" class="btnSetG" hidefocus=""><span>新建群组</span></a> \
        </div> \
    </div>',
        events: {
            "click .btnSetG": "createTeam"
        },
        initialize: function (options) {
            //this.model = options.model;
            //this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
           
        },
        createTeam: function() {
            //群成员列表引导用户新建群组按键事件
            top.BH("gom_null_create_rightgroup");
            $Addr.trigger('redirect', { key: 'addr_team_create' });
        },
		render : function(){
		    $(this.el).html(_.template(this.template));
		},
		// 初始化模型层数据
		getDataSource : function(callback){
		
		}
    }));
})(jQuery, _, M139);

