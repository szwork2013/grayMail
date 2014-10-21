M139.namespace("M2012.Mailbox.View", {
    SearchClassify : Backbone.View.extend({
        el:"",
        template:"",
        events:{
            //"click #search_switchon" : "toggleSearchclassify"
        },
        createInstance: function (options) {
            if (!$App.getView("searchclassify")) {
                $App.registerView("searchclassify", new M2012.Mailbox.View.SearchClassify(options));
            }
            var view = $App.getView("searchclassify");
            if (options.el) {
                view.el = options.el;
            }
            return view;
        },
        initialize: function(options){
           var self = this;
           this.firstLoaded = true; //首次加载
           this.model = options.model;
		   this.searchDefaultSetting = $App.getCustomAttrs("searchDefaultSetting");
        },
        initstats: function(){
            var stats = this.searchStats = this.model.get("searchStats");
            var statsdata = {
                from : stats.fromStats,
                fid : stats.folders,
                during: stats.during,
                attached : [
                    {name: '带附件', attached: 1, count: stats.attachMessageCount},
                    {name: '不带附件', attached: 2, count: stats.messageCount - stats.attachMessageCount}
                ]
            }
			var layoutStatus = this.model.get("layout");
			// console.log(layoutStatus);
			//这两种布局的空模板不能被右侧的窗口挡住
			if(layoutStatus == "list" || layoutStatus == "top" ){
				var noindexbodyWidth = $(".noindexbody.noindexbodyS").width();
				$(".noindexbody.noindexbodyS").width(noindexbodyWidth - 210);
			}
            return stats.messageCount > 0 ? statsdata : {}; //搜索的邮件只有一封命中邮件时，不显示逼近式搜索。
        },
        renderContainer:function(){
            var self = this;
        //    this.mainEl = $("<div style='height:100%; overflow-y:auto;'></div>")
        //    $(this.el).append(this.mainEl);
            this.headEl = $("<div class='searchFilterTitle'><a href='javascript:void(0)' id='setItDefault' class='fr'>设置默认</a>搜索范围</div>");
        //    $(this.mainEl).append(this.headEl);
		//	$(this.el).append(this.headEl);
            this.contentEl = $("<div class='searchFilterList'></div>");
			//添加默认设置
			var defaultSettings = ['<div class="search-end-sel">',
										'<ul class="li-sel" id="searchRangeUl">',
											'<li><input type="radio" name="searchRange" rel="from" id="from" /><label for="from">发件人</label></li>',
											'<li><input type="radio" name="searchRange" rel="subject" id="subject" /><label for="subject">主题</label></li>',
											'<li><input type="radio" name="searchRange" rel="to_from" id="to_from" /><label for="to_from">收件人+发件人</label></li>',
											'<li><input type="radio" name="searchRange" rel="subject_content" id="subject_content" /><label for="subject_content">主题+正文</label></li>',
											'<li><input type="radio" name="searchRange" rel="all" id="all" /><label for="all">全文检索</label></li>',
											'<li><a href="javascript:" id="open_all" bh="open_search_all_result">开通全文检索</a></li>',
										'</ul>',
									'</div>'].join('');
			this.classifyTemplate = $('<div class="earch-end-text"></div>');
			this.contentEl.append(this.headEl);
			this.contentEl.append(defaultSettings);
			this.contentEl.append(this.classifyTemplate);
            $(this.el).html(this.contentEl); //改为html，否则取消的时候再生产了一遍
        //    this.switchEl = $('<a id="search_switchon" title="隐藏分类搜索" href="javascript:void(0)" class="switchOn"><i class="i_triangle_h"></i></a>');
			this.switchEl = ['<a href="javascript:void(0)" class="switchOn" title="收起"></a>',
								'<a href="javascript:void(0)" class="switchOff" title="展开"></a>'];
            $(this.el).append(this.switchEl.join(""));
        //    this.switchEl.click(function(){
        //        self.toggleSearchclassify(this);
        //    });暂时未做，补上的时候添加
		//	首次进行搜索、进入搜索结果页时，出现tips引导
		var position = $("#setItDefault").offset();
		var guideHTML = ['<div id="guideHTML" class="tips write-tips EmptyTips" style="position: absolute; z-index:999; padding:5px 20px 5px 5px ;width: 180px; left: -11',
                    //     position.left - 138,
	                     'px;top: 26',
                    //     position.top - 45,
                         'px">',
                         '<div class="tips-text EmptyTipsContent">',
                         '设置默认搜索范围，高效搜索邮件',
                         '</div>',
                         '<div class="tipsTop diamond" style="left: 180px;"></div>',
                         '<a style="position:absolute; cursor:pointer; text-decoration:none; font-size:10px;color:#000; right:5px; top:0px; ">x</a>',
                      '</div>'].join('');
			var default2 = $App.getCustomAttrs("searchDefaultSetting");
			var fl = "from,subject,to_from,subject_content,all".indexOf(default2) > -1 && default2 != "";
			if(!fl && $("#guideHTML").length == 0 && top.$App.getCustomAttrs("closeGuideTips") != "1"){
				$("#div_searchclassify").append(guideHTML);//不能插入到body，否则点击其他链接，无法消除
			}
		//	var div_mail = $("#div_mail");
			var guideHTMLShowFlage = true;
			$("#guideHTML a").click(function(){
				$("#guideHTML").hide();
				//关闭后记住曾经关闭的状态
				top.$App.setCustomAttrs("closeGuideTips","1");
				guideHTMLShowFlage = false;
		//		div_mail.unbind("scroll");
			});
			//tips位置大小变了，滑动的时候不要求自动变化了
			/*
			div_mail.bind("scroll",function(){
				if(guideHTMLShowFlage && top.$App.getCustomAttrs("closeGuideTips") != "1"){
					if(div_mail.scrollTop() == 0){
						$("#guideHTML").show();
					}else{
						$("#guideHTML").hide();
					}
				}
			});
			*/
			var div_searchclassify = $("#div_searchclassify");
			var switchOn = $(".switchOn");
			var switchOff = $(".switchOff");
		//	switchOff.hide();
			switchOn.click(function(){
			//	switchOn.hide();
				//提示语的处理
				$("#guideHTML").hide();
				guideHTMLShowFlage = false;
			//	div_mail.unbind("scroll");
			//不要用动画	
			//	searchFilter.animate({right: "-200px"}, function(){
			//		switchOff.css("right","200px").show();
			//	});
			//	searchFilter.hide();
				div_searchclassify.addClass("searchFilter-off");
			//	switchOff.css("right","200px").show();
			});
			switchOff.click(function(){
			//	switchOff.hide();
			//	searchFilter.animate({right: 1},function(){
			//		switchOn.show();
			//	});
			//	searchFilter.show();
			//	switchOn.show();
				div_searchclassify.removeClass("searchFilter-off");
			});
			//没开通全文索引的时候隐藏
			if ($App.getConfig("UserAttrs") && $App.getConfig("UserAttrs").fts_flag == 0){
				$("#searchRangeUl input[rel='all']").parent("li").hide();
				$("#searchRangeUl input[rel='subject_content']").parent("li").hide();
				$("#searchRangeUl a#open_all").parent("li").click(function() {
                    //$App.setAttrs({fts_flag:1});
                    //$App.getConfig("UserAttrs").fts_flag = 1;
                   $RM.setAttrs({attrs: {fts_flag:1}}, function (result) {
                       if (result["code"] == "S_OK") {
                        	BH("open_search_all_succeed")
		                    var dialog = $Msg.confirm(
		                                        "全文检索开通成功，刷新页面生效",
		                                        function () {
		                                            location.reload();
		                                        },
		                                        {
		                                            title:"",
		                                            dialogTitle:'系统通知',
		                                            icon:"ok",
		                                            buttons:["立即刷新"]
		                                        }
		                    )
                    	} else {
                    		top.M139.UI.TipMessage.show("全文检索开通失败",{className:"msgRed", delay: 1000 });
                    	}
                   });
                })
			}  else {
				$("#searchRangeUl a#open_all").parent("li").hide()
			}
			//默认的渲染
			var setting = self.model.get("setting");
			if("from,subject,to_from,subject_content,op_all".indexOf(setting) > -1){
				$("#searchRangeUl input[rel='" + setting + "']").attr("checked","checked");
			}else if(setting == "iamadvance"){
				//do nothing 高级搜索而来的时候，不选择任何
			}else{
				$("#searchRangeUl input[rel='" + self.searchDefaultSetting + "']").attr("checked","checked");
			}
			//默认值的点击
			$("#searchRangeUl").click(function(e){
				if(e.target.nodeName.toUpperCase() === "INPUT"){
					top.$App.getView("mailbox_other").model.set("showSearchclassify",true);
					var rel = $(e.target).attr("rel");
					if(rel == "from"){
						top.$App.getView("mailbox").model.set("searchIsComeformDefault", "");//此时的选择发件人为搜索，转换标志，防止搜了主题
					}
					self.model.set("setting",rel);
					var searchOptions = self.model.get("searchOptions");
					var keyword = searchOptions["condictions"][0]["value"];
					delete searchOptions["condictions"];
					searchOptions["condictions"] = addCondiction(keyword, rel);
					console.log(searchOptions);
					$App.searchMail(searchOptions);
				//	console.log(self.model.get("searchOptions"));
					
				}
			});
			function addCondiction(keyword, field) {
                var options = keyword;
				var field = field.split("_");
				var condictions = [];
				if(field[0] !== "all"){
					for(var i = 0; i < field.length; i++){
						condictions.push({
							field: field[i],
							operator: "contains",
							value: keyword
						});
					}
				}else{
					condictions.push({
						field: "content",
						operator: "contains",
						value: keyword
					}, {
						field: "attachName",
						operator: "contains",
						value: keyword
					},{
						field: "subject",
						operator: "contains",
						value: keyword
					}, {
						field: "from",
						operator: "contains",
						value: keyword
					}, {
						field: "to",
						operator: "contains",
						value: keyword
					});
				}
                //if (keyword != '') {
                //    options = {condictions: condictions};
                //    if (field == 'attachName') {
                //        options.flags = { attached: 1 };
                //    }
                //}
                return condictions;
            }
			//弹窗的内容模板
			var defaultSettings2 = [
				'<div class="search-end-open">',
				'<p>请选择默认搜索范围：</p>',
				'<div class="search-end-sel">',
				'<ul class="li-sel" id="searchRangeUl2">',
					'<li><input type="radio" name="searchRange2" value="from" id="from2" /><label for="from2">发件人<span class="c_009900">(推荐)</span></label></li>',
					'<li><input type="radio" name="searchRange2" value="subject" id="subject2" /><label for="subject2">主题</label></li>',
					'<li><input type="radio" name="searchRange2" value="to_from" id="to_from2" /><label for="to_from2">收件人+发件人</label></li>',
					'<li><input type="radio" name="searchRange2" value="subject_content" id="subject_content2" /><label for="subject_content2">主题+正文</label></li>',
					'<li><input type="radio" name="searchRange2" value="all" id="all2" /><label for="all2">全文检索</label></li>',
				'</ul>',
				'</div>',
				'</div>'];
			//没开通全文索引的时候删除掉全文检索
			if ($App.getConfig("UserAttrs") && $App.getConfig("UserAttrs").fts_flag == 0){
				defaultSettings2.splice(7,2);
			}
			//click
			$("#setItDefault").click(function(){
				//统计代码
				BH('search_default_click');
				//打开的时候，如果有默认值，填充默认值，否则选择推荐的"发件人"为默认值
				var $defaultSettings2 = $(defaultSettings2.join(""));
				var searchDefaultSetting = $App.getCustomAttrs("searchDefaultSetting");
				
				if("from,subject,to_from,subject_content,all".indexOf(searchDefaultSetting) > -1 && searchDefaultSetting != ""){
					$defaultSettings2.find("input[value='"+ searchDefaultSetting +"']").attr("checked", "checked");
				}else{
					$defaultSettings2.find("input[value='from']").attr("checked", "checked");
				}
				//弹出设置对话框
				top.$Msg.showHTML($defaultSettings2[0],
				function(){
					var defaultSettingValue = $("#searchRangeUl2 input:checked").val();
					if("from,subject,to_from,subject_content,all".indexOf(defaultSettingValue) > -1){
						top.$App.setCustomAttrs("searchDefaultSetting", defaultSettingValue);
						$("#guideHTML").hide();
						BH('search_default_setSuccessfully');
					}
				},
				function()
				{
					console.log("do nothing!");
				},
				{
					dialogTitle:'设置默认搜索范围',
					buttons:['确定','取消'],
					width: 350
				});
			});
        },
        render:function (){
            this.renderContainer();
            var stats = this.initstats();
            var model = this.model;
        //    var el = this.contentEl;
			var el = this.classifyTemplate;
        //    this.headEl.html('<h2 class="fl mr_5">分类搜索</h2><strong class="fw-n">('+ this.searchStats.messageCount +')</strong></div>');
            
            
            
        //    if(stats.from && stats.from.length > 0 && (!selected || !selected.from)){ //按发件人
			if(stats.from && stats.from.length > 0){
                var fromoptions = {model: model, el: el, title: '发件人/收件人', data: stats.from, key: 'from', type: 'from'};
                this.searchclassifyfrom = new M2012.Mailbox.View.SearchClassifyItem(fromoptions);
                this.searchclassifyfrom.render();
            }
        //    if(stats.fid && stats.fid.length > 0 &&  (!selected || !selected.fid)){ //按文件夹
			if(stats.fid && stats.fid.length > 0){
                var fidoptions = {model: model, el: el, title: '文件夹', data: stats.fid, key: 'folderName', type: 'fid'};
                this.searchclassifyfid = new M2012.Mailbox.View.SearchClassifyItem(fidoptions);
                this.searchclassifyfid.render();
            }
        //    if(stats.during && stats.during.length > 0 && (!selected || !selected.during)){ //按时间范围
			if(stats.during && stats.during.length > 0){
                var duringoptions = {model: model, el: el, title: '时间范围', data: stats.during, key: 'name', type: 'during'};
                this.searchclassifydate = new M2012.Mailbox.View.SearchClassifyItem(duringoptions);
                this.searchclassifydate.render();
            }
        //    if(stats.attached && stats.attached.length > 0 && (!selected || !selected.attached)){ //是否带有附件
			if(stats.attached && stats.attached.length > 0){
                var attachoptions = {model: model, el: el, title: '是否包含附件', data: stats.attached, key: 'name', type: 'attached'};
                this.searchclassifyattach = new M2012.Mailbox.View.SearchClassifyItem(attachoptions);
                this.searchclassifyattach.render();
            }
			var selected = this.model.get("selected");
            if(selected){
               var selectedoptions = {model: model, el: el};
                this.searchclassifychoosed = new M2012.Mailbox.View.SearchClassifyChoosed(selectedoptions);
                this.searchclassifychoosed.render();
            }
        },
        toggleSearchclassify : function(el){
            var parent = $(this.el).parent();
            if(parent.hasClass('searchListoff')){
                parent.removeClass('searchListoff');
                $(el).attr('title','隐藏分类搜索');
            }else{
                parent.addClass('searchListoff');
                $(el).attr('title','展开分类搜索');
            }
            BH('top_searchToggle');
        }
    })
});