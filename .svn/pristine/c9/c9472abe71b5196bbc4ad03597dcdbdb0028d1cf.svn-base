/**
我的账单中心tips弹窗
 */
M139.core.namespace("M139.UI.bill", Backbone.View.extend({
    initialize: function () {
		var self = this;
        setTimeout(function(){
			self.render();
		},10000);
    },
    render: function () {
		var self = this;
		var flagBill = top.$App.getUserCustomInfo(31); //类似于"20131118"这样的东西
		var lastMonth = new Date().getMonth(); //上个月的月份
		//新加的
		var da = new Date();
		var year = da.getFullYear();
		var month = da.getMonth();
		var day = da.getDate();
		var todaySdate  = '' + year + ( month < 10 ? ('0' + month) : month ) + (day < 10 ? ('0' + day) : day);
		
		//flagBill = "20131118"; //测试用
		var toyear = flagBill && parseInt(flagBill.slice(0,4));
		var tomonth = flagBill && parseInt(flagBill.slice(4,6)); //接口取的月份
		var today = flagBill && parseInt(flagBill.slice(6,8));
		//如果设置过值且显示过了，且三天内显示了才不显示，其他的情况都要显示
		if($Date.getDaysPass(new Date(toyear, tomonth,today), new Date(year, month, day)) < 3){
			return;
		}
	//	self.getBillCount(function(t){
			if(this.getBillCount() > 0){
				$App.getView("mailbox").model.getFreshUnreadBill(function(mail){
				//	console.log(mail);
					
					if(mail){
						var fl1 = !!(mail["from"].indexOf("10086") > -1);
						var fl2 = !!(mail["subject"].indexOf(lastMonth+"月") > -1);
						var fl3 = !!(mail["subject"].indexOf("话费账单") > -1);
						
						if(mail && fl1 && fl2 && fl3) {
							var parms = {};
							parms["title"] = mail["subject"];
							parms["mid"] = mail["mid"];
							var html = "";
							html = $T.Utils.format(self._template,{
								title: parms["title"],
								js : "top.$App.readMail('"+parms["mid"]+"')"
							});
							$BTips.addTask({
								width: 350,
								title: "您有1封新账单",
								content: html,
								bhClose: 'billClose',
								bhShow: 'billPopNum'
							});
							top.$App.setUserCustomInfoNew({31:todaySdate});
							//点标题都要上报日志，没有做相应的扩展，只能进行繁琐的jQuery查找
							$("#billAccount8").parents(".boxIframeMain").prev(".boxIframeTitle").find("span").click(function(){
								top.BH("billTitle");
							});
						}
					}
				});
			}
	//	});
    },
    getBillCount: function (callback) {
		return top.$App.getView("folder").model.get("newBillCount");
		/*异步的话不需要监听了，现在改为延迟弹窗
		$App.getView('folder').model.on('ProcessCompleted', function(i){
		//	console.log('文件夹好了', this.get('newBillCount'));
			callback && callback(this.get('newBillCount'))
		});*/
    },
    _template: ['<div class="imgInfo imgInfo-rb chrom-tips-rb" id="billAccount8">',
                    '<p class="mt_10">发件人：10086</p>',
                    '<p class="mt_10">主题：<a bh="billContent" href="javascript:{js};" class="c_666">{title}</a></p>',
                    '<p class="mt_10 mb_5 clearfix">',
                        '<a href="javascript:top.$App.showMailbox(8);" bh="billList" class="fr">查看账单详情<span class="f_st">&gt;&gt;</span></a>',
                    '</p>',
                '</div>'].join("")
	})
);

$(function () {
	try{
		var mybills = new M139.UI.bill();
	}catch(e){

	}
});