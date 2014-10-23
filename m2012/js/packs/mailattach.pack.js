/**
 * @fileOverview 彩云网盘附件夹页面模型层
 */
(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	M139.namespace("M2012.Mailattach.Model", Backbone.Model.extend({
		defaults : {
			pageSize : 30,	//每页显示文件数
			pageIndex : 1,	//当前页
			attachTotal: 0, // 总附件数
			fileList : [],	// 当前分页文件列表
			cacheList: [],	// 分页总缓存
			selectedList: [],
			sortType : '', // 排序类型
			sortIndex : -1 // 当前排序状态  1 升序 -1 降序
		},

		name : 'M2012.Attach.Model',
		callApi : M139.RichMail.API.call,
		
		initialize : function(options) {
		},

		listAttaches: function() {
			this.callApi("mbox:forwardAttachs", {
				attachments: attachments
			}, callback);
		},

		forwardAttach: function(attachments, callback) {
			//var rid = Math.random();
			this.callApi("mbox:forwardAttachs", {
				attachments: attachments
			}, callback);
		},

		// 获取总页数
		getPageCount : function() {
			var messageCount = this.get('attachTotal');
			var result = Math.ceil(messageCount / this.get("pageSize"));
			if(result <= 0) {
				result = 1;
			};//最小页数为1
			return result;
		},

		// 添加惟一键，映射列表数据。
		cacheData: function(result){
			var item;
			var list = result["var"];
			for(var i=0,len=list.length; i<len; i++){
				item = list[i];
				item.uid = item.mid + "_" + item.attachOffset;
			}
			this.set({
				"fileList": list,
				"attachTotal": (result["total"] | 0)
			});
			this.mergeToCache();
		},

		addToList: function(uid){
			var list = this.get("selectedList");
			if(typeof uid === "string"){
				if($.inArray(uid, list) === -1){
					list.push(uid);
				}
				// $.isArray(uid)居然不可靠，跨页面了？
			} else if(uid.length){
				for(var i=0, len=uid.length; i<len; i++){
					if($.inArray(uid[i], list) === -1){
						list.push(uid[i]);
					}
				}
			}
		},

		removeFromList: function(uid){
			var list = this.get("selectedList");
			if(typeof uid === "string"){
				index = $.inArray(uid, list);
				if(index !== -1){
					list.splice(index, 1);
				}
			} else if(uid.length){
				for(var i=0, len=uid.length; i<len; i++){
					index = $.inArray(uid[i], list);
					if(index !== -1){
						list.splice(index, 1);
					}
				}
			}
		},

		getItemById: function(uid){
			if(!uid){
				return null;
			}
			var list = this.get('cacheList');
			
			for(var i=0,len=list.length; i<len; i++) {
				if(list[i].uid == uid){
					return list[i];
				}
			}
			return null;
		},

		// todo: 优化
		mergeToCache: function(uid){
			var cacheList = this.get('cacheList');
			var list = this.get('fileList');
			var addList = [];
			var ret;
			
			for(var i=0,len=list.length; i<len; i++) {
				uid = list[i].uid;
				ret = _.find(cacheList, function(item){
						return item.uid == uid;
					});
				if(!ret) {
					addList.push(list[i]);
				}
			}

			this.set('cacheList', cacheList.concat(addList));
		}
	}));
})(jQuery, Backbone, _, M139);



/**
* @fileOverview 附件夹主视图层.
* @namespace 
*/
(function (jQuery, _, M139, Backbone) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Mailattach.View.Main', superClass.extend(
	/**
	*@lends M2012.Mailattach.View.prototype
	*/
	{
		el: "body",
		template: [
			'<!--[if lt ie 8]><div style="+zoom:1;"><![endif]-->',
			'<table cellpadding="0" cellspacing="0" class="listHead listTable newShareTable" role="grid">',
			'<tbody>',
			'<!--item start-->',
			'<tr uid="$uid">',
                // todo: inArray
                '<td class="wh1 t-check">',
                    '<input mid="$mid" fid="$fid" filetype="1" type="checkbox">',
                '</td>',
                '<td class="t-name">',
					'<div class="fl p_relative">',
						'<a href="javascript:void(0)" class="i-file-smalIcion @getFileIconClass(attachName)"></a>',
					'</div>',
                    '<a hidefocus="true" href="javascript:void(0)" class="attchName file-name" title="@HTMLEnCode(attachName)">',
                        '<span name="nameContainer">',
                            '<em fsize="0" filetype="1" name="fname">@getShortName(attachName, 32)</em>',
                        '</span>',
                    '</a>',
                    '<a hidefocus="1" href="@getDown(mid,attachOffset,attachSize,attachName,encode)" class="lkdl nosel" style="display:none;" onclick=\"top.addBehavior(\'attach_download\')\">下载</a>',
                    /*'<div class="attachment" mid="$mid" fid="$fid">',
                        '<a hidefocus="1" href="javascript:void(0)" class="lkfa nosel">转发</a><span style=""> | </span>',
                        '<a hidefocus="1" href="javascript:void(0)" class="lksd nosel">存彩云</a>',
                    '</div>',*/
                '</td>',
				'<td style="width:30%;">',
					'<p class="gray">@getEmailAddr(from)</p>',
					'<a href="javascript:void(0)" class="textexp mailLink" mid="$mid" fid="$fid" title="@HTMLEnCode(subject)">@getSubject(subject, 20)</a>',
				'</td>',
                '<td class="wh3 gray" style="text-align: center;">@getDate(sendDate)</td>',
                '<td class="wh4 gray" style="text-align: center;">@getSize(attachRealSize)</td>',
            '</tr>',
			'<!--item end-->',
			'</tbody>',
			'</table>',
			'<!--[if lt ie 8]></div><![endif]-->'
		].join(""),

		templatePic: [
			'<ul class="listView clearfix" role="group" style="margin-top:14px;">',
				'<!--item start-->',
				'<li uid="$uid" class="listItem" data-attachname="@HTMLEnCode(attachName)" data-attachsize="@getSize(attachRealSize)" data-sender="@getEmailAddr(from)">',
				    '<p class="chackPbar"><input type="checkbox" class="checkView"></p>',
				    '<a href="javascript:void(0)" class="viewPic"><img src="@getThumbImagePath(attachName)" width="65" height="65"></a>',
				    '<div class="viewIntroduce">',
				        '<a href="javascript:void(0)" class="file-name">',
				            '<span class="itemName">',
				                '<em>@getShortName(attachName, 15)</em>',
				            '</span>',
				            '<span class="itemSuffix">@getExtendName(attachName)</span>',
				        '</a>',
				        '<a href="@getDown(mid,attachOffset,attachSize,attachName,encode)" class="lkdl nosel" style="display:none;" onclick=\"top.addBehavior(\'attach_download\')\">下载</a>',
						/*'<p class="lista">',
							'<a href="@getDown(mid,attachOffset,attachSize,attachName,encode)" class="lkdl nosel" onclick=\"top.addBehavior(\'attach_download\')\">下载</a>',
							'<span class="line"> | </span>',
							'<a href="javascript:void(0)" class="lkfa nosel">转发</a>',
							'<span class="line"> | </span>',
							'<a href="javascript:void(0)" class="lksd nosel">存彩云</a>',
						'</p>',
                        '<p class="gray">@getSize(attachRealSize)</p>',*/
                    '</div>',
                '</li>',
				'<!--item end-->',
			'</ul>'
		].join(""),

		templateEmpty: ['<div class="imgInfo addr-imgInfo ta_c"><dl>',
					'<dt><img src="/m2012/images/module/networkDisk/appendix.jpg"></dt>',
					'<dd><p class="fz_14">暂无附件</p></dd>',
					'<dd><p>收到的邮件附件会出现在这里哦！</p></dd>',
					'</dl></div>'].join(""),
		
		hoverTipsTemplate : ['<div class="imgInfo" style="overflow: hidden;">',
								'<p>文件名称：{fileName}</p>',
								'<p>文件大小：{fileSize}</p>',
								'<p>发件人：{emailAddr}</p>',
							'</div>'].join(""),

		name : "M2012.Mailattach.View.Main",
		mode: "list",

		imagePath : '../../images/module/FileExtract/',
		imageExts : "jpg/gif/png/ico/jfif/tiff/tif/bmp/jpeg/jpe", // 图片类拓展名

		events: {
			"click #selectAll" : "allOrNone",
			"click #cleanSelected" : "clearSelect",
			"click #listMode" : "listMode",
			"click #iconMode" : "iconMode",
			"click #sortDock": "showSortMenu",
			"click #downloadAttaches" : "batchDownload",
			"click #forwardAttaches" : "forwardAttaches",
			"click #saveToDiskBatch" : "saveToDiskBatch",
			"click .mailLink" : "readMail",
			"click .lksd" : "onSaveToDiskLinkClick",
			"click .viewPic, .file-name": "onItemClick",
			"click .lkfa" : "onForwardAttachLinkClick",
			"click #fileList" : "onSelect",
			"contextmenu #fileList" : "onContextMenu",
			"mouseover .listItem" : "onItemHover",
			"mouseout .listItem" : "onItemOut",
			"mouseover .listTable tr" : "onListItemHover",
			"mouseout .listTable tr" : "onListItemOut"
		},

		// 排序依据映射
		sortMaps: {"FILE_NAME":"name", "MAIL_NAME":"subject", "FILE_TIME":"receiveDate", "FILE_SIZE":"size", "FILE_TYPE":"attachSuffix"},

		filterExtra: {},

		Param: {
			start: 0,
			total: 10,
			order: "receiveDate",
			desc: 1,
			stat: 1,
			isSearch: 1
		},

		file_reg: /[\\\/:*?"<>|]/g,

		initialize: function (options) {
			var self = this;
			this.model = options.model;
			var rp = this.repeater = new Repeater(this.template);
			var reg = this.file_reg;
			
			if(this.mode == "list"){
				//$(".td3,.td4,.td5").show();
				$(".diskTableList").show();
			} else {
				//$(".td3,.td4,.td5").hide();
				$(".diskTableList").hide();
			}
			//rp.HeaderTemplate = this.HeaderTemplate;
			//rp.HtmlTemplate = this.template;
			//rp.FooterTemplate = this.FooterTemplate;
			//rp.DataSource = data["var"];
			rp.Functions = {
				getSize : function (size) {
					//return top.Utils.getDisplaySize(size);
					return $T.Utils.getFileSizeText(size);
				},
				getDate : function (d, rec) {
					return M139.Date.getFriendlyString(d, rec);
				},

				getShortName : function(fileName, max){	// 不带拓展名
					var shortName = "";
					var len = fileName.length;
					var point = fileName.lastIndexOf(".");

					if(point != -1){
						fileName = fileName.substring(0, point);
					}
					if(len > max){
						shortName = $T.Html.encode(fileName.substring(0, max));
					}else{
						shortName = $T.Html.encode(fileName);
					}

					if(self.keyword){
						shortName = shortName.replace(self.keyword, "<font style='color:OrangeRed;font-weight:bold;'>"+self.keyword+"</font>");
					}
					return (len > max ? (shortName + "…") : shortName);
				},
				getSubject: function(subject, max){
					if(subject.length > max){
						subject = subject.substring(0, max) + "…";
					}
					return subject;
				},
				getExtendName : function(fileName){	// 仅返回拓展名
					var idx = fileName.lastIndexOf('.');
					if(idx == -1){
						return '';
					}
					return $T.Html.encode(fileName.substr(idx).toLowerCase());
				},
				//下载
				getDown : function (mid, attachOffset, attachRealSize, attachName, encode) {
					return top.ReadMailInfo.getDownloadAttachUrl({
						mid: mid,
						fileOffSet: attachOffset,
						fileSize: attachRealSize,
						fileName: attachName.replace(reg, "_"),
						sid: top.sid,
						type: 'attach',
						"encoding": encode
					});
				},

				getEmailAddr : function (from) {
					var addr = from;
					var myregexp = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/ig;
					var match = from.match(myregexp);
					if (match != null) {
						addr = match[0]
					}
					if (top.Contacts.getNameByAddr(addr) != "") {
						addr = top.Contacts.getNameByAddr(addr)
					}
					return addr;
				},
				getFileIconClass : function (fileName) {
					return $T.Utils.getFileIcoClass2(0, fileName);
				},
				/*
				getPicClass : function(attachName){
					var extName = $T.Url.getFileExtName(attachName);
					var isImage = "jpg/gif/png/ico/jfif/tiff/tif/bmp/jpeg/jpe".indexOf(extName) >= 0;
					return isImage ? "viewPic" : "viewPicN";
				},
				*/
				// 根据文件名获取文件缩略图路径
				getThumbImagePath : function(fileName){
					var extName = $T.Url.getFileExtName(fileName);

					if(!extName){
						return ;
					}
					var base = '../../images/module/FileExtract/';
					var key;

					var map = {
						"doc.png" : "/doc/docx/wps/",
						"html.png" : "/htm/html/asp/php/jsp/",
						"ppt.png" : "/ppt/pptx/",
						"xls.png" : "/xls/xlsx/",
						"zip.png" : "/rar/zip/7z/gz/tar/lzma/",
						"mp3.png" : "/mp3/wma/wav/mod/ogg/midi/",
						"rmvb.png" : "/flv/rmvb/rm/avi/wmv/mov/3gp/mp4/",
						"dvd.png" : "/vcd/dvd/cd/",
						"cd.png" : "/iso/gho/img/wim/hfs/",
						"fla.png" : "/fla/swf/swc/as/",
						"ai.png" : "/ai/",
						"pdf.png" : "/pdf/",
						"exe.png" : "/exe/msi/",
						"txt.png" : "/txt/log/ini/csv//",
						"load1.gif" : "/jpg/gif/png/ico/jfif/tiff/tif/bmp/jpeg/jpe/",
						"psd.png" : "/psd/",
						"eml.png" : "/eml/",
						"default.png" : "/"
					};

					extName = "/" + extName + "/";

					for(key in map){
						if(map[key].indexOf(extName) != -1 && map.hasOwnProperty(key)){
							return base + (key === "other" ? extName : key);
						}
					}

					return base + 'default.png';
				},

				HTMLEnCode: function (str) {
					var s = "";
					if (str.length == 0)
						return "";
					s = str.replace(/&/g, "&amp;");
					s = s.replace(/</g, "&lt;");
					s = s.replace(/>/g, "&gt;");
					s = s.replace(/	/g, "&nbsp;");
					s = s.replace(/\'/g, "&#39;");
					s = s.replace(/\"/g, "&quot;");
					s = s.replace(/\n/g, "<br>");
					return s;
				},
				paramEnCode: function (str) {
					return (str && (function () {
						var s = "";
						s = str.replace(/&/g, "&amp;");
						s = s.replace(/</g, "&lt;");
						s = s.replace(/>/g, "&gt;");
						s = s.replace(/	/g, "&nbsp;");
						s = s.replace(/\'/g, "“");
						s = s.replace(/\"/g, "“");
						s = s.replace(/\n/g, "<br>");
						return s;
					})()) || "";
				}
			};

			// filterType: 0、其它 1、图片 2、多媒体 3、文档
			var menuItems = [
				{
                    text: "全部",
                    onClick: function(){self.filter("");}
                },
				{
                    text: "文档",
                    onClick: function(){self.filter("3");}
                },
				{
                    text: "图片",
                    onClick: function(){self.filter("1");}
                },
                //{
                //    text: "音乐",
                //    onClick: function(){self.filter("4");}
               // },
                {
                    text: "多媒体",
                    onClick: function(){self.filter("2");}
                }
            ];

			var menu = M2012.UI.MenuButton.create({
				//selectMode: true,
				text: "筛选",
				container:$(".toolBarUl"),
				leftSibling:false,
				rightSibling:false,
				menuItems: menuItems,
				customStyle: "width: 90px"/*,
				onItemClick: function(item, index){
					menu.lastSelectedIndex = index;
				},
				onClick: function(){
					menu.showMenu();
					if(menu.menu){
						menu.menu.selectItem(menu.lastSelectedIndex|0);	// 默认为0
					}
				},
				onClickBefore: function(){
					menu.showMenu();
					menu.menu.selectItem(menu.lastSelectedIndex|0);	// 默认为0
				}*/
			});

			this.initEvents();

			return superClass.prototype.initialize.apply(this, arguments);
		},

		initEvents : function(){
			var self = this;
			
			this.model.on("change:attachTotal", function(model, total){
				var prevTotal = self.model.previous("attachTotal");
				var pageSize = self.model.get("pageSize");
				var currPageCount = Math.ceil(total / pageSize);
				var prevPageCount = Math.ceil(prevTotal / pageSize);
				if(currPageCount != prevPageCount){
					self.createPager();
				}
				$("#attaCount").html(total);
			});

			// 绑定表头单击排序、排序菜单单击事件
			$("#sortMenu li, .listHead th").click(function (e) {
				var newSortType = $(this).attr("rel");
				var oldSortType = self.model.get('sortType');
				if(!newSortType) return ;

				if(newSortType === oldSortType){
					self.model.set('sortIndex', -self.model.get('sortIndex'));
				} else {
					self.model.set('sortType', newSortType);
				}

				$("#sortMenu").hide();
                // todo: no thingid(para 2)
				top.addBehavior("attach_sort");
			});

			this.model.on("change:sortType", function(model, type){	// 排序类型
				var map = self.sortMaps;
				var oldSortType = self.model.previous('sortType');
				self.sort({order:map[type]});
				self.dataBind();

				// todo: renderTableHeaderMenu()
				$(".listHead th[rel='"+oldSortType+"']").find("i").removeClass();
				//console.log(".listHead th[rel='"+type+"']");
				$(".listHead th[rel='"+type+"']").find("i").addClass(self.model.get('sortIndex') == 1 ? "i_th1" : "i_th0");
				self.renderSortMenu();	// 重新渲染排序菜单
			});
			self.model.on("change:sortIndex", function(model, sortIndex){	// 排序方式 升序或者降序
				self.sort({desc: sortIndex===-1});
				self.dataBind();

				// todo: renderTabelHeaderMenu()
				var sortType = self.model.get('sortType');
				var arrow = $(".listHead th[rel='"+sortType+"']").find("i");
				if(sortIndex == 1){
					arrow.removeClass("i_th0").addClass("i_th1");
				} else {
					arrow.removeClass("i_th1").addClass("i_th0");
				}
				self.renderSortMenu();
			});

			self.model.on("change:pageIndex", function(model, pageIndex){
				//self.renderSortMenu();
				self.getAttachList(null, function (data) {
					self.dataBind(data["var"]);
					//self.resizeFileListHeight();
				});
			});

			$(window).resize(function(){
				_.throttle(self.resizeFileListHeight(), 400);
			});
		},

		render : function(){
			var self = this;
			var kwd = $Url.queryString("keyword", location.href);

			//todo:与老标准版的行为id有重复？
			top.addBehavior("attach_enter");

            if(kwd){
				this.search(kwd);
				return ;
			}

			this.getAttachList(null, function (data) {
				//console.log(data);
				//self.model.set("sortType", "FILE_TIME");
				self.dataBind();
				if(self.mode == "list"){
					$(".listHead th[rel='"+self.model.get('sortType')+"']").find("i").addClass(self.model.get('sortIndex') == 1 ? "i_th1" : "i_th0");
				}
				self.renderSortMenu();	// 重新渲染排序菜单

				self.createPager();
			});
		},

		onListItemHover: function(e){
			$(e.currentTarget).addClass("listViewHover");
		},

		onListItemOut: function(e){
			$(e.currentTarget).removeClass("listViewHover");
		},

		onItemHover: function(e){
			var item = this.getTargetItem(e.target);
			var offset = item.offset();
			var tipsLayer = $("#tipsLayer");
			var infoText = $T.Utils.format(this.hoverTipsTemplate, {
								fileName : $T.Html.encode(item.attr("data-attachname")),
								fileSize : item.attr("data-attachsize"),
								emailAddr : $T.Html.encode(item.attr("data-sender"))
							});

			$(e.currentTarget).addClass("listViewHover");
			tipsLayer.find(".tips-text").html(infoText);
			var tipsHeight = tipsLayer.height() + 15;

			// 210 -> 列表项的高度(112) + 提示层高度(65)
			if(offset.top + 130 + tipsHeight > $(window).height()){	// 上方Tips
				tipsLayer.css({top:offset.top - tipsHeight, left: offset.left}).show();
				if(this.tipPos !== "top"){
					this.tipPos = "top";
					tipsLayer.find(".diamond").addClass("tipsBottom").removeClass("tipsTop").css("background","");
				}
			}else{	// 下方Tips
				tipsLayer.css({top:offset.top + 117, left: offset.left}).show();
				if(this.tipPos !== "bottom"){
					this.tipPos = "bottom";
					tipsLayer.find(".diamond").addClass("tipsTop").removeClass("tipsBottom").css("background","");
				}
			}
		},

		onItemOut: function(e){
			$("#tipsLayer").hide();
			$(e.currentTarget).removeClass("listViewHover");
		},

		/* simple context menu */
		Menu: Backbone.View.extend({
			$el: $('<div id="ctxMenu"></div>'),

			initialize: function(options){
				var cssOptions = {position:"absolute", zIndex: 9001};
				if(options.width){
					cssOptions.width = (options.width|0) + "px";
				}
				if(options.top){
					cssOptions.top = (options.top|0) + "px";
				}
				if(options.left){
					cssOptions.left = (options.left|0) + "px";
				}
				this.$el.css(cssOptions).hide().addClass("menuPop shadow").appendTo(document.body);
				this.options = options || {};
			},
			render: function(){
				var itemsTemplate = this.options.itemsTemplate;
				var items = this.options.items;
				var itemsHtml = "<ul>";
				for(var i=0,len=items.length; i< len; i++){
					itemsHtml += $T.format(itemsTemplate, items[i]);
				}
				itemsHtml += "</ul>";

				this.$el.html(itemsHtml);
				this.initEvents();
				return this;
			},
			initEvents: function(){
				var self = this;
				this.$el.on("click", function(e){
					var target = e.target;
					var index = $(target).closest("li[rel='menu']").index();
					self.options.items[index].onClick();
					self.$el.hide();
				});
			},
			reBindItems: function(items){
				this.options.items = items;
			},
			show: function(pos){
				this.$el.css({top: pos.y+"px", left: pos.x+"px"}).show();
				this.delayAutoHide(500);
			},
			remove: function(){
				this.$el.remove();
			},
			hide: function(){
				this.$el.hide();
			},
			bindAutoHide: function (delay) {
				var self = this;
				self.$el.mouseenter(function () {
					clearTimeout(self.timerId);
					self.isOverMenu = true;
				}).mouseleave(function () {
					self.isOverMenu = false;
					self.timerId = setTimeout(function () {
						self.hide();
					}, delay);
				});
				return this;
			},
			delayAutoHide: function(delay) {
				var self = this;
				
				clearTimeout(self.timerId);
				// todo 很搓，直接右键就触发mousemove了
				// 延时为了跳过右键导致的mousemove事件
				// 必须引用该timerId，以避免窜入下一次操作
				self.timerId = setTimeout(function(){
					$(document).one("mousemove", function(e){
						self.timerId = setTimeout(function () {
							if(self.isOverMenu !== true) {
								self.hide();
							}
						}, delay);
					});
				}, 100);
			}
		}),

		onContextMenu: function(e){
			var self = this;
			var item, jTarget, targetItem, cbx;

			e.preventDefault();

			self.menuInst && self.menuInst.hide();

			jTarget = $(e.target);
			item = self.getTargetItemData(e.target);

			if(!item){	// 空白处右键
				this.clearSelect();
				return false;
			}
			
			if(this.mode === "list") {
				targetItem = jTarget.closest("tr[uid]");
			} else {
				targetItem = jTarget.closest("li[uid]");
			}

			cbx = targetItem.find("input:checkbox");

			if(!cbx.attr("checked")){
				// 取消所有选择和分页数据缓存，再缓存当前分页数据
				this.clearSelect();
				this.model.set("selectedList", [item.uid]);

				cbx.attr("checked", true);

				targetItem.addClass("listViewChecked");

				this.renderSelectCount();
			}

			var menuItems = [{
					text : "打开",
					icon : "i-cOpen",
					onClick : function(){
						targetItem.find(".file-name")[0].click();
					}
				}, {
					text : "下载",
					icon : "i-cDown",
					onClick : function(){
						if(isMultiSelect()){
							self.batchDownload();
						} else {
							if(self.mode === "list") {
								targetItem.find("a.lkdl")[0].click();
							} else {
								targetItem.find("a.lkdl")[0].click();
							}
						}
					}
				}, {
					text : "转发",
					icon : "i-cSendmail",
					onClick : function(){
						isMultiSelect() ? self.forwardAttaches() : self.forwardAttach(item);
					}
				}, {
					text : "存彩云网盘",
					icon : "i-cColrDisk",
					onClick : function(){
						isMultiSelect() ? self.saveToDiskBatch() : self.saveToDisk(item);
					}
				}
			];

			function isMultiSelect(){
				return (self.model.get("selectedList").length > 1);
			}

			if(this.menuInst == undefined){
				this.menuInst = new this.Menu({
					width : 150,
					items : menuItems,
					itemsTemplate: '<li rel="menu"><a href="javascript:;"><span class="text"><i class="icon {icon}"></i>{text}</span></a></li>'
				}).bindAutoHide(500).render();
			}

			if(isMultiSelect()){
				this.menuInst.$("li:first-child").hide();
			} else {
				this.menuInst.$("li:first-child").show();
			}
			this.menuInst.reBindItems(menuItems);
			// warn: 360先show出来菜单层，才触发contextmenu事件
			// 这里要加个偏移(还至少3px...)，否则无法禁止止右键菜单
			this.menuInst.show({x:e.clientX+3, y:e.clientY+3});
			// 或者：
			/*setTimeout(function(){
				self.menuInst.show({x:e.clientX, y:e.clientY});
			}, 10);*/

			return false;
		},

		// 下载或者预览
		onItemClick: function(e){
			e.stopPropagation();

			var item = this.getTargetItemData(e.currentTarget);
			var link = $(e.currentTarget).closest("a");

			var extName = $T.Url.getFileExtName(item.attachName);
			var isImage = this.imageExts.indexOf(extName) >= 0;
			var reg = this.file_reg;

			if(isImage){
				top.addBehavior("attach_preview");
				this.imgPreview(item.imgIndex);
				return ;
			}

			var url = top.ReadMailInfo.getDownloadAttachUrl({
				mid: item.mid,
				fileOffSet: item.attachOffset,
				fileSize: item.attachSize,
				fileName: item.attachName.replace(reg, "_"),
				sid: top.sid,
				type: 'attach',
				encoding: item.encode
			});
			
			if (top.FilePreview.isRelease()) {
				if (top.FilePreview.checkFile(item.attachName, item.attachSize) > 0) {
					var p = {};
					p.fileName = item.attachName;
					p.fileSize = item.attachSize;
					p.type = "email"; // 调用的项目，email为基础邮箱，disk为彩云
					p.contextId = item.mid; // 上下文id，如果是邮件附件，这个就是mid,如果是彩云文件，则是文件id，这个参数应该是预览的时候创建存放的文件夹用的？
					// 二次编码，或者%20替换为%2B都行
					p.downloadUrl = encodeURIComponent(url);
					//p.downloadUrl = url.replace(/%20/g, "%2B");
					//console.log(JSON.stringify(p));
					url = top.FilePreview.getUrl(p);
					link.attr("target", "_blank");
				}
			}

			link.attr("href", url);
			//return false;	// 将导致无法预览
		},

		imgPreview: function (index) {
			var arr = [];
			var options = {
				start: 1,
				total: 50,
				order: "receiveDate",
				desc: 1,
				stat: 1,
				isSearch: 1,
				filter: {
					attachType: 1
				}
			};

			this.previewed = true;		// 预览后服务端会缓存结果，切换分页时导致错误。

			M139.RichMail.API.call("attach:listAttachments", options, function (result) {

				var previewImg = [];
				var imgs;

				if(result && result.responseData) {
					imgs = result.responseData["var"];
				} else {
					imgs = self.getImageItems();	// 请求失败，还可以预览当前分页内的图片
				}

				for (var i = 0, len = imgs.length; i < len; i++) {
					var item = imgs[i];
					var thumbnailURL = top.wmsvrPath2 + "/mail?func=mbox:getThumbnail&sid={0}&mid={1}&size={2}&offset={3}&name={4}&type={5}&encoding=1".format(top.sid, item.mid, item.attachSize, item.attachOffset, item.attachName, item.attachType);
					var presentURL = "/view.do?func=attach:download&mid={0}&offset={1}&size={2}&name={3}&encoding={6}&sid={4}&type={5}";
					presentURL = top.wmsvrPath2 + presentURL.format(item.mid, item.attachOffset, item.attachSize, encodeURIComponent(item.attachName), top.sid, item.attachType, item.encode);
					previewImg.push({
						thumbnailURL: thumbnailURL,
						bigthumbnailURL: presentURL,
						presentURL: presentURL,
						fileName: item.attachName,
						attachOffset: item.attachOffset
					});
				}

				if (index != "" || index == 0) {
					if (typeof (top.focusImagesView) != "undefined") {
						top.focusImagesView.render({ data: previewImg, index: parseInt(index) });
					} else {
						top.M139.registerJS("M2012.OnlinePreview.FocusImages.View", "packs/focusimages.html.pack.js?v=" + Math.random());
						top.M139.requireJS(['M2012.OnlinePreview.FocusImages.View'], function () {
							top.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
							top.focusImagesView.render({ data: previewImg, index: parseInt(index) });
						});
					}
				}
			});
		},

		onSaveToDiskLinkClick: function(e){
			e.stopPropagation();
			var item = this.getTargetItemData(e.target);
			this.saveToDisk(item);
		},

		saveToDisk: function (item) {
			var reg = this.file_reg;

			var url = top.ReadMailInfo.getDownloadAttachUrl({
				mid: item.mid,
				fileOffSet: item.attachOffset,
				fileSize: item.attachSize,
				fileName: item.attachName.replace(reg, "_"),
				sid: top.UserData.ssoSid,
				type: (item.type ? item.type : "attach"),
				encoding: item.encode
			});

			var saveToDiskview = new top.M2012.UI.Dialog.SaveToDisk({
				fileSize: item.attachRealSize,
				fileName: item.attachName,
				downloadUrl: url,
				saveToMcloud: null
			});
			saveToDiskview.render().off("success").on("success", function () {
				//存彩云成功记日志
				top.addBehavior("attach_savedisk");
			});
		},

		saveToDiskBatch: function (e) {
			var reg = this.file_reg;
			var attaches = [];
			var self = this;
			var selected = this.model.get("selectedList");
			var sid = top.UserData.ssoSid;

			if(selected.length == 0){
				top.$Msg.alert("请选择附件。");
				return ;
			}

			$.each(selected, function(i, uid){
				var item = self.model.getItemById(uid);
				var url = top.ReadMailInfo.getDownloadAttachUrl({
					mid: item.mid,
					fileOffSet: item.attachOffset,
					fileSize: item.attachSize,
					fileName: item.attachName.replace(reg, "_"),
					sid: sid,
					type: "attach",
					encoding: item.encode
				});
				attaches.push({
					fileSize: item.attachRealSize,
					fileName: item.attachName,
					url: url
				});
			});
			
			this.renameConflict(attaches);

			var saveToDiskview = new top.M2012.UI.Dialog.SaveToDisk({
				Attachinfos: attaches
			});

			saveToDiskview.render().off("success").on("success", function () {
				//存彩云成功记日志
				top.addBehavior("attach_savedisk");
			});
		},

		onForwardAttachLinkClick: function(e){
			e.stopPropagation();
			var item = this.getTargetItemData(e.target);
			this.forwardAttach(item);
		},

		getSelectedAttachListData: function(){
			var self = this;
			var selected = this.model.get("selectedList");
			var dataList = [];
			var totalSize = 0;
			//var reg = this.file_reg;

			if(selected.length <= 0){
				return {"list": [], "totalSize": 0};
			}

			$.each(selected, function(i, uid){
				var item = self.model.getItemById(uid);
				// todo: 有问题？
				if(item){
					dataList.push({
						fileId: item.mid,
						fileName: encodeURIComponent(item.attachName),
						fileRealSize: item.attachRealSize,
						fileSize: item.attachSize,
						fileOffSet: item.attachOffset,
						encoding: item.encode
					});
					totalSize += item.attachRealSize;
				}
			});

			return {"list": dataList, "totalSize": totalSize};
		},

		// 解决附件重名问题
		renameConflict: function(list){
			var repeat, fname, idx;

			list.sort(function(a, b){
				return a.fileName.localeCompare(b.fileName);
			});

			for(var i=0, len=list.length; i<len-1; i++){
				repeat = 1;
				fname = list[i].fileName;
				idx = fname.lastIndexOf('.');
				if(idx < 0) idx = fname.length;
				while(i+repeat < len && fname == list[i+repeat].fileName){
					list[i+repeat].fileName = fname.substr(0, idx) + '(' + repeat + ')' + fname.substr(idx);
					repeat++;
				}
			}
		},

		// 获取弹窗发信附件html片段
		getPopupAttachHtml: function(fileItem){
			var itemTemp, fileName, suffix, data;
			if(!fileItem) return "";
			itemTemp = '<li rel="largeAttach" objId="{objId}" filetype="i_attachmentS"><i class="i_attachmentS"></i>\
				<span class="ml_5">{prefix}<span class="gray">{suffix}</span></span>\
				<span class="gray ml_5">({fileSizeText})<span class="tiquma pl_5 black" style="display:none;"></span></span>\
				<a hideFocus="1" class="ml_5" href="javascript:void(0)" removeLargeAttach="{objId}">删除</a></li>';
			fileName = fileItem.fileName;
			suffix = $T.Url.getFileExtName(fileName).toLowerCase();

			data = {
				objId : fileItem.fileId,
				prefix: fileName.slice(0, -suffix.length),
				suffix: suffix,
				fileSizeText: M139.Text.Utils.getFileSizeText(fileItem.fileSize)
			};
			return top.$T.Utils.format(itemTemp, data);
		},

		forwardAttach: function(item) {

			var self = this;
			var data = {
				fileId: item.mid,
				fileName: encodeURIComponent(item.attachName),
				type: "attach",
				fileRealSize: item.attachRealSize,
				fileSize: item.attachSize,
				fileOffSet: item.attachOffset,
				encoding: item.encode
			};

			/*top.FORWARDATTACHS = {
				attachments: [data]
			};*/

			this.model.forwardAttach([data], function(res){
				//top.$App.show('compose', {type:"forwardAttachs"});
				if(res.responseData.code === "S_OK"){
					var attachments = res.responseData["var"].attachments;
					var item = attachments.length > 0 ? attachments[0] : null;
					var htmlStr = self.getPopupAttachHtml(item);

					top.$Evocation.create({
						type : "compose",
						subject : decodeURIComponent(item.fileName),
						content : "",
						whereFrom : "attach",
						diskContent : htmlStr,
						attachContentJSON : attachments,
						attachmentsid : res.responseData["var"]["id"]
					});
				}else{
					console.log("fail");
				}
				
				top.addBehavior("attach_forward");
			});
		},

		forwardAttaches: function() {

			var self = this;
			var data = this.getSelectedAttachListData();
			var dataList = data.list;

			if(dataList.length == 0){
				top.$Msg.alert("请选择附件。");
				return ;
			} else if(data.totalSize > 1024 * 1024 * 50){
				$Msg.alert("附件总数据量大小超限（50M），请减少附件后重试");
				return ;
			}

			for(var i=0, len=dataList.length; i<len; i++){
				dataList[i].type = "attach";
			}

			this.renameConflict(dataList);

			/*top.FORWARDATTACHS = {
				attachments: dataList
			};*/

			this.model.forwardAttach(dataList, function(res){
				var attachments, htmlStr = '', item;
				if(res.responseData.code === "S_OK"){
					attachments = res.responseData["var"].attachments;
					for(var i = 0, len = attachments.length; i < len; i++){
						item = attachments[i];
						htmlStr += self.getPopupAttachHtml(item);
					}
					top.$Evocation.create({
						type : "compose",
						subject : decodeURIComponent(item.fileName),
						content : "",
						whereFrom : "attach",
						diskContent : htmlStr,
						attachContentJSON : attachments,
						attachmentsid : res.responseData["var"]["id"]
					});
				}else{
					console.log("fail");
				}
				
				top.addBehavior("attach_forward");
			});
		},

		batchDownload: function(){
			var self = this;
			var data, dataList;
			var selected = this.model.get("selectedList");


			if(selected.length == 0){
				top.$Msg.alert("请选择附件。");
				return ;
			} else if(selected.length == 1){
				$("#fileList").find("[uid='"+selected[0]+"'] a.lkdl")[0].click();
				return ;
			}

			//targetItem.find("a.lkdl")[0].click();
			
			data = this.getSelectedAttachListData();
			dataList = data.list;

			this.renameConflict(dataList);

			top.addBehavior("attach_download");
			var router = M139.HttpRouter, api = "attach:autoPack";
			router.addRouter("webapp", [api]);
			//console.log(router.getUrl(api));

			this.ajaxForm({
				url: router.getUrl(api),
				data: M139.Text.Xml.obj2xml({attachments: dataList})
			});
		},
        // todo: move to model
		ajaxForm : function(options) {
			var body = document.body,
				form = document.getElementById("downloadForm"),
				o = options,
				input = form.postData;

			form.method = "post";
			form.action = o.url;

			if (form.encoding) {
				form.setAttribute("encoding", "multipart/form-data");
			}
			form.setAttribute("enctype", "multipart/form-data");
			input.value = o.data;
			form.submit();
			input.value = "";

			top.M139.UI.TipMessage.hide();
		},

		listMode: function(){
			this.mode = "list";
			$("#listMode i").attr('class', 'i_view');
			$('#iconMode i').attr('class', 'i_list_checked');
			$(".td3,.td4,.td5").show();
			$(".diskTableList").show();
			this.dataBind();
			top.addBehavior("attach_list_mode");
		},

		iconMode: function(){
			this.mode = "icon";
			$("#listMode i").attr('class', 'i_view_checked');
			$('#iconMode i').attr('class', 'i_list');
			$(".td3,.td4,.td5").hide();
			$(".diskTableList").hide();
			this.dataBind();
			top.addBehavior("attach_icon_mode");
		},

		getImageItems: function(){
			var list = this.model.get("fileList");
			var imgArr = [];
			var imgReg = /(?:\.jpg|\.gif|\.png|\.ico|\.jfif|\.tiff|\.tif|\.bmp|\.jpeg|\.jpe)$/i;

			$.each(list, function(i, item){
				if(imgReg.test(item.attachName)) {
					imgArr.push(item);
				}
			});

			return imgArr;
		},

		// 图片列表显示缩略图
		showThumb : function(imgs){
			var failImagePath = this.imagePath + 'fail2.png';

			$.each(imgs, function(i, item){
				var imgUrl = top.wmsvrPath2 + "/mail?func=mbox:getThumbnail&sid={0}&mid={1}&size={2}&offset={3}&name={4}&type={5}&encoding=1".format(top.sid, item.mid, item.attachSize, item.attachOffset, item.attachName, item.attachType);
				$("li[uid='"+item.uid+"']").find("img").attr("src", imgUrl);
			});
			$("li[uid] img").error(function(){
				this.src = failImagePath;
			})/*.load(function(){	// 360上有时不会触发？
				$(this).attr({width:65, height:65});
			})*/;
		},

		createPager : function() {
			var self = this;
			var pagerContainer = $("#filelist_pager");
			pagerContainer.html("");
			// 先清除
			var pageCount = this.model.getPageCount();

			// 生成分页
			this.pager = M2012.UI.PageTurning.create({
				styleTemplate : 2,
				container : pagerContainer,
				pageIndex : 1,
				maxPageButtonShow : 5,
				pageCount : pageCount
			});
			this.pager.on("pagechange", function(index) {
				self.model.set("pageIndex", index);
			});
		},

		// 根据排序类型渲染排序菜单
		renderSortMenu: function(){
			var self = this;
			var sortType = self.model.get('sortType');
			var jSortType = $("#sortMenu li[rel="+sortType+"]");

			// 原class为cur，暂时失效屏蔽UI问题
			$("#sortMenu li.curr").removeClass('curr').find('em').remove('.downRinking');
			
			var sortState = self.model.get('sortIndex') == 1?'↑':'↓';
			jSortType.addClass('curr').find('span').append('<em class="downRinking">'+sortState+'</em>');
		},

		showSortMenu : function(event){
			var jSortMenu = $("#sortMenu");
			//jSortMenu.css({width : 125});
			
			jSortMenu.show();
			M139.Dom.bindAutoHide({
				action: "click",
				element: jSortMenu[0],
				stopEvent: true,
				callback: function () {
					jSortMenu.hide();
					M139.Dom.unBindAutoHide({ action: "click", element: jSortMenu[0] });
				}
			});
			//top.$Event.stopEvent(event);
			event.stopPropagation();
		},

		//获取列表
		getAttachList: function (param, callback) {
			var self = this;
			var pageIndex = this.model.get("pageIndex") - 1;
			var pageSize = this.model.get("pageSize");

			if (!param) {
				param = this.Param;
				//首页才需要重新获取；其他都在原有结果查询
				param.start = pageIndex * pageSize + 1;
				param.total = pageSize;

				if (param.start == 1 || this.previewed) {
					param.isSearch = 1;
				}
				else {
					param.isSearch = 1;	// 后端bug: 0表示利用上次查询的缓存，问题是，间隔较长的时间后，缓存清空，服务器会返回空...
				}
			}
			else {
				param.start = pageIndex * pageSize + 1;
				param.total = pageSize;
			}
			//按顺序输入;不按顺序输入，输出会有问题		
			var orderPropertyNames = ["start", "total", "order", "desc", "stat", "fid", "isSearch", "filter"];
			var copy = {};
			$.each(orderPropertyNames, function () {
				if (param[this] != null) {
					copy[this] = param[this];
				}
			});

			M139.RichMail.API.call("attach:listAttachments", copy, function (result) {
				var data = {};
				top.WaitPannel.hide();
				if(result) {
					data = result.responseData;
				}
				self.model.cacheData(data);
				
				if (typeof callback === "function") {
					callback.call(this, data);
				} else {
					//$("#attaTitle").show();
					$("#searchTitle").hide();
					self.dataBind(data["var"]);
				}
				self.resizeFileListHeight();
			});
			top.WaitPannel.show("正在加载中...", {delay:10000});
		},

		// 动态设置 fileList 高度避免出现两根滚动条
		resizeFileListHeight : function(){
			var list = $("#fileList");
			var iframeHeight = top.$("#diskDev").height();
			var listTop =  list.offset().top;
			list.height(iframeHeight - listTop);
		},

		dataBind: function(list){
			var rp = this.repeater;
			var mode = this.mode;
			var kwd = $Url.queryString("keyword");

			$("#tipsLayer").hide();		// 有时未捕获到失焦事件导致tips仍显示

			if(kwd){
				this.keyword = kwd;
			} else {
				delete this.keyword;
			}

			rp.HtmlTemplate = (mode === "list") ? this.template : this.templatePic;
			if(!list){
				list = this.model.get("fileList");
			}

			if (list && list.length > 0) {
				$(".toolBar").show();
				$("#fileList").html(rp.DataBind(list));
			} else if(list.length === 0){
				if(this.Param.filter){
					var type = ["其它", "图片", "多媒体", "文档"][this.Param.filter.attachType|0];
					var html = '<div style="font-size: 16px;text-align:center;position:relative;top:45%;">暂无' + type + '类型的附件！</div>';
					$("#fileList").html(html);
				} else {
					$(".toolBar").hide();
					$("#fileList").html( this.templateEmpty );
				}
			}
			this.renderSelected();

			var imgs = this.getImageItems();

			if(mode=="icon") {
				this.showThumb(imgs);	// 显示图片缩略图
			}
			
			// 给图片类型标记索引（预览时需要）
			$.each(imgs, function(i, item){
				item.imgIndex = i;
			});
		},

		search: function(kwd){

			var self = this;
			this.clearSelect();
			this.model.set("cacheList", []);

			if (!this.Param.filter) {
				this.Param.filter = {};
			}
			if ($.trim(kwd) == "") {
				delete this.Param.filter.attachName;
			} else {
				//this.Param.filter.attachName = kwd;
				this.Param.filter = {"attachName": kwd};
			}

			if(this.model.get("pageIndex") != 1){
				this.model.set("pageIndex", 1);
			} else {
				self.getAttachList(null, function (data) {
					//$("#attaTitle").hide();
					$("#searchTitle").find("span").html(data["total"]).end().show();
					self.dataBind(data["var"]);
				});
			}
			
			top.addBehavior("attach_search");
		},

		readMail: function(e){
			e.stopPropagation();
			var target = $(e.currentTarget);
			var mid = target.attr("mid");
			var fid = target.attr("fid");
			top.$App.readMail(mid, false, fid);
		},

		//排序
		sort: function (arg) {
			if (typeof arg === "object") {
				arg.order && (this.Param.order = arg.order);
				if(typeof arg.desc === "boolean"){
					this.Param.desc = arg.desc ? 1 : 0;
				}
				//获取最新
				this.Param.isSearch = 1;
				this.getAttachList(this.Param);
			}
		},

		filter: function(type){
			var paramFilter = this.Param.filter;

			this.model.set("pageIndex", 1);	// 重置到第一页

			if(paramFilter){
				if(type == ""){
					delete paramFilter.attachType;
				} else {
					paramFilter.attachType = type;
				}
			} else {
				if(type == ""){
					delete this.Param.filter;
				} else {
					this.Param.filter = {attachType: type};
				}
			}
			top.addBehavior("attach_filter_type");
			this.getAttachList(null);
		},

		// 点击选择/取消选择某个项
		onSelect: function(e){
			var target = $(e.target);
			var isCbx, parent, isSelected;

			// 预览/下载操作，返回，并停止冒泡（已经预览过，设置了href）
			if(target.hasClass("attchName") && target.attr("target") == "_blank"){
				e.stopPropagation();
				return ;
			}

			if(target.closest(".nosel").length > 0) return ;	// 点击链接不触发选择

			isCbx = target.is('input[type="checkbox"]');
			parent = this.getTargetItem(e.target);

			if(parent.length == 0) return ;

			// todo
			JCheckBox = isCbx ? target : parent.find('input[type="checkbox"]');

			if(JCheckBox.length === 0) return ;

			isSelected = JCheckBox.attr('checked');

			// note：如果是checkbox就不需要手动切换选择（包含在默认行为中了）
			if(! isCbx){
				JCheckBox.attr('checked', ! isSelected);
				isSelected = ! isSelected;
			}

			if(isSelected) {
				this.model.addToList(parent.attr("uid"));
				parent.addClass("listViewChecked");
			} else {
				this.model.removeFromList(parent.attr("uid"));
				parent.removeClass("listViewChecked");
			}

			this.renderSelectCount();
		},

		// 翻页，更改排序，或切换视图模式后，需要重新渲染选择项
		renderSelected: function(){
			var list = this.model.get("selectedList");
			var mode, jList;
			mode = this.mode;
			jList = (mode === "list") ? $("tr[uid]") : $("li[uid]");

			jList = jList.filter(function(){
				return -1 !== $.inArray($(this).attr("uid"), list);
			});
			if(mode === "icon"){
				jList.addClass("listViewChecked").find("input:checkbox").attr("checked", true);
			}else{
				jList.find('input[type="checkbox"]').attr("checked", true);
			}
			this.renderSelectCount();
		},

		// 渲染用户选中文件数量
		renderSelectCount : function(curPageSelectedCount){
			var curPageCount = this.model.get("fileList").length;
			var allSelectedCount = this.model.get("selectedList").length;
			var selectedCount = curPageSelectedCount || this.getItemList().find('input:checked').length;

			if(allSelectedCount > 0){
				$("#selectCount b:eq(0)").text(allSelectedCount);
				$("#fileName").hide();
				$("#selectCount").show();
			}else{
				$("#selectCount").hide();
				$("#fileName").show();
			}

			if(selectedCount === curPageCount && curPageCount > 0){
				$("#selectAll").attr('checked', true);
			}else{
				$("#selectAll").attr('checked', false);
			}
		},

		allOrNone: function(event){
			event.stopPropagation();
			if($("#selectAll").attr('checked')){
				this.selectAll();
			}else{
				this.selectNone();
			}
		},

		selectAll: function(){
			var list = this.getItemList();
			list.addClass("listViewChecked");
			list.find("input:checkbox").attr('checked', true);
			this.model.addToList(this.getAllUids());
			this.renderSelectCount(list.length);
		},

		selectNone: function(){
			var list = this.getItemList();
			list.removeClass("listViewChecked");
			list.find("input:checkbox").attr('checked', false);
			this.model.removeFromList(this.getAllUids());
			this.renderSelectCount();
		},

		// 清空选择（所有分页）
		clearSelect: function(){
			this.model.set("selectedList", []);
			// 只要清空了所有选择，就可以重置缓存列表
			this.model.set("cacheList", this.model.get("fileList"));

			var list = this.getItemList();
			list.removeClass("listViewChecked");
			list.find("input:checkbox").attr('checked', false);

			//todo this.renderSelectCount(0);
			$("#selectCount").hide();
			$("#fileName").show();
			$("#selectAll").attr('checked', false);
		},

		getTargetItemData: function(target){
			var uid = this.getTargetItem(target).attr("uid");
			return this.model.getItemById(uid);
		},

		getTargetItem: function(target){
			if(this.mode === "list") {
				return $(target).closest("tr[uid]");
			} else {
				return $(target).closest("li[uid]");
			}
		},

		getItemList: function(){
			if(this.mode === "list"){
				return $(".listTable tr[uid]");
			} else {
				return $(".listItem[uid]");
			}
		},

		getAllUids: function(){
			return this.getItemList().map(function(){
				return this.getAttribute("uid");
			});
		}
	}));
})(jQuery, _, M139, Backbone);

