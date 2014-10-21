
;(function() {
	var nav = null;

	var options;

	function getOptions(){

		if(options) {
			return options;
		}

		options = {
			template: ['<div id="setNavcontainer" class="inAside">',
				'<div class="subList subListSet">',
					'<ul class="big subListScrollLast">',
						'<li>',
							'<a class="groupToggleShow" hidefocus="" href="javascript:;"><i name="i_unfold" class="triangle t_blackDown"></i><span class="fz_14">邮件</span></a>',
							'<ul class="small" style="display: block;">{basicItems}</ul>',
						'</li>',
					'</ul>',
					'<ul id="subListOthers" class="big"><li class="bottomLi"></li>{otherItems}</ul>',
				'</div>',
			'</div>'].join(""),
			items: {
				basicItems: {
					//  class="nav-item" 必须
					itemTemplate: '<li class="nav-item"><a href="javascript:;" bh="{bh}"><span class="otheMail">{title}</span></a></li>',
					data: [
						{title: "常规设置", key: "preference", bh: "set_nav_preference"},
						{title: "帐户设置", key: "account", bh: "set_nav_account"},
						{title: "文件夹与标签", key: "tags", bh: "set_nav_tags"},
						{title: "代收邮箱", key: "popmail", bh: "set_nav_pop"},
						{title: "收信规则", key: "type_new", bh: "classifymailnormal_onclick"},
						{title: "手机通知", key: "notice", bh: "set_nav_notice"},
						{title: "邮箱安全", key: "spam", bh: "set_nav_spam"},
						{title: "邮箱套餐", key: "mobile", bh: "set_nav_mobile"}
					]
				},
				otherItems: {
					itemTemplate: '<li class="nav-item"><a href="javascript:;" bh="{bh}"><span class="fz_14">{title}</span></a></li>',
					data: [
						{title: "通讯录", key: "set_addr", bh: "set_addr_load"},
						{title: "日历", key: "set_calendar", bh: "set_calendar_load"},
						{title: "彩云网盘", key: "set_disk", bh: "set_disk_load"},
						{title: "云邮局", key: "set_mpost", bh: "set_mpost_load"}
					]
				}
			},
			onTabChange: function(data) {
			},
			container: "#mainContentBox"
		};
		
		if ($User.isNotChinaMobileUser()) {
			options.items.basicItems.data.pop();	// 无邮箱套餐
		}

		if ($User.isInternetUser()) {
			options.items.basicItems.data.splice(4, 1);	// 无手机通知
		}
		return options;
	}

	function onOpenPage(args) {
		var index, items;
		var config = FrameModel.getLinkByKey(args.name);
		if(!config || config.group !== "setting") {
			return;		// don't care
		}
		nav && nav.switchItem(args.name);
	}

	function onCloseTab(args){
		var config = FrameModel.getLinkByKey(args.name);
		if(config && config.group === "setting"){
			nav && nav.hide();
			$App.off("closeTab", onCloseTab);
		}
	}

	$(function(){
		$App.on("showPage", onOpenPage);
		$App.on("closeTab", onCloseTab);

		$App.on("showTab", function(args){
			if(!args || args.group !== "setting") {
				nav && nav.hide();
				return;		// don't care
			}
			//console.log("setting tab opened.");
			top.BH({key: "setting_load"});
			if($("#setNavcontainer").length === 0){
				nav = new M139.UI.TabNav(getOptions()).render();	// 新开页
			}
			nav && nav.show();
		});
	});
})();
