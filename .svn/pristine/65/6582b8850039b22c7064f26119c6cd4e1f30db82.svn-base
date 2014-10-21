//create by zhangsixue 飞信转发视图包裹层
(function (jQuery, Backbone, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace("M2012.ReadMail.Fetion.View", superClass.extend({

			initialize : function () {
				var self = this;
				this.model = new M2012.ReadMail.Fetion.Model();
				this.model.selectedList.length = 0;//初始化的时候清楚已经选中的数据
				this.showAll = false; //收起和显示的时候，设置标志。onShouqi
				this.model.getFetionFriends(function(){
					if(self.model.flagCode == 1){
						top.$User.iAmNotFetion = 1;//第二次的时候判断，为1的时候不属于飞信用户
						top.$Msg.alert(self.model.tipWords.NO_TFETION_USER);
						return;
					}else if(self.model.flagCode == 2){
						top.$User.iAmNotFetion = 2;//第二次的时候判断，为2的时候绑定失败
						top.$Msg.alert(self.model.tipWords.BIND_FAIL);
						return;
					}
					self.render();
				});
				
				return superClass.prototype.initialize.apply(this, arguments);
			},
			template : {
				selected : '<a href="javascript:;">{name}<i friendFetionNo="{friendFetionNo}" class="i_deletePson" style="display: inline-block;"></i></a>',
				container : ['<div class="feibarTips" id="feibarTips" style="width:246px;">',
								'<div class="feibarTitle">',
									'<a href="javascript:;" class="i_closeFei" id="closeFei"></a>',
									'<span class="i_fei fl"></span>',
									'<dl>',
										'<dt class="c_333">选择飞信好友</dt>',
										'<dd class="c_999">该封邮件将发送到好友的飞信</dd>',
									'</dl>',
								'</div>',
								'<div class="feibarBody" style="">',
									'<div class="feibarContact">',
										'<div class="contactsP" id="contactsP"></div>',
										'<p><span id="forFlash">您选择了<span>（<span id="numChoosed">0</span>/20）</span>位好友</span><a href="javascript:;" id="shouqi" class="ml_5">全部<i class="i_down"></i></a></p>',
									'</div>',
									'<div>',
										'<ul class="feibar_address sweb" id="feibar_address" style="height: 225px;">',
											/*'<li><a href="#" class=""><i class="i_downDot"></i>未分组的好友</a></li>',
											'<li>',
												'<a href="#" class=""><i class="i_rightDot"></i>我的好友</a>',
												'<ul class="second_menuFeiBar">',
													'<li><a href="#">红枫叶</a></li>',
													'<li class="check"><a href="#" class="add_addr">添加</a><a href="#">红枫叶</a></li>',
													'<li><a href="#">红枫叶</a></li>',
													'<li><a href="#">红枫叶</a></li>',
													'<li class="check"><a href="#" class="add_addr c_999">已添加</a><a href="#">红枫叶</a></li>',
													'<li><a href="#">红枫叶</a></li>',
												'</ul>',
											'</li>',*/
										'</ul>',
									'</div>',
								'</div>',
								'<div class="feiBotmBar clearfix">',
									'<span class="fr"><a style="margin-right: 5px;" href="javascript:;" class="btnTb" flg="1" id="sureAndNext"><span>确 定</span></a></span>',
								'</div>',
							'</div>'].join(""),
				sendHTMLtemplate: ['<div class="boxIframeText">',
											'<div class="" style="padding:5px 15px;">',
												'<dl class="scheduleRightBottomTips" style="line-height:25px;">',
													'<dd style="display:none;"><span>发件人：</span>{sendAccount}</dd>',
													'<dd style="display:none;"><span>主  题：</span>{sendTitle}</dd>',
													'<dd style="display:none;"><span>时  间：</span>{sendTime}</dd>',
													'<dd class="mt_5"><span style="display: none;">信件内容：</span>',
														'<div class="c_666" id="iamthemain">',
														'{sendContent}',
														'<a style="padding-left:5px;" href="javascript:;" id="showAll">查看全部</a>',
														'</div>',
														'<textarea id="editContent" style="width: 500px; height: 125px;">{editContent}</textarea>',
													'</dd>',
												'</dl>',
											'</div>',
											'<div style="padding: 10px; background: #f5f5f5; color:#666; border-top: 1px solid #dadada; ">',
												'<p>提示：<span id="numMaxTips">飞信接收上限为2000字，已输入<span id="currentNum">{currentNum}</span>字。</span></p>',
												'<p style="margin-left:35px;">好友不在线时，短信接收上限500字。</p>',
											'</div>',
								/*	'</div>',
									'<div class="boxIframeBtn">',
											'<span class="bibText gray"></span>',
											'<span class="bibBtn">',
												'<a href="javascript:void(0)" class="btnSure"><span>接 受</span></a> <a href="javascript:void(0)" class="btnNormal"><span>拒 绝</span></a>',
											'</span>',*/
									'</div>'].join("")

			},
			render : function () {
				var self = this;
				var cssjson = {top : 200,left : 300,"z-index" : 5002,position : "absolute"};
				self.el = $(this.template.container).appendTo(document.body).css(cssjson);
				self.setElement(self.el);
				var zIndex = self.$el.css("z-index") - 1;
				self.mask = M2012.ReadMail.Fetion.View.showMask({zIndex : zIndex}); //遮罩
				
				var group = new M2012.ReadMail.Fetion.Group({
						"model" : self.model,
						"container" : $("#feibar_address")
					}).on("select", function () {
						self.renderSelected();
						self.$contactsPHeight = self.$contactsP.height(); //每次点击的时候重新计算高度
						self.setHeight();
				});
				$D.setDragAble(self.$el[0], {
					handleElement: self.$el.find(".feibarTitle")[0]
				});
				self.$contactsP = self.$el.find("#contactsP");
				if(self.$contactsP.height() > 60){
					self.$contactsP.height(60);
					$("#shouqi").show();
				}else{
					$("#shouqi").hide();
				}
				this.initEvents();
			},
			setHeight : function(){
				if(this.showAll){
					//添加和删除的时候高度不用理，自己控制
					this.$contactsP.height("auto");
				}else{
					//如果高度大于56,则显示为56
					if(this.$contactsP.height() >= 56){
						this.$contactsP.height(56);
					}else{
						this.$contactsP.height("auto");
					}	
				}
				var has = true;
				var offset = this.$contactsP.offset();
				var left1 = offset.left;
				var right1 = left1 + this.$contactsP.width();
				var top1 = offset.top;
				var bottom1 = top1 + this.$contactsP.height();
				var obj={
					left: left1,
					right:right1,
					top:top1,
					bottom:bottom1
				};
				has = inBounds($("#contactsP").find("a").last(),obj);
				//高度小于56或者等于56且无香蕉
				if(this.$contactsP.height() < 56 || (this.$contactsP.height() == 56 && has)){
					//隐藏 交换按钮
					//height去掉
					$("#shouqi").hide();
					this.$contactsP.height("auto");
				}else{
					//显示 交换按钮
					$("#shouqi").show();
				}
				
				function inBounds(elem, bounds) {
					if (elem.top && elem.left) {
						var position = elem;
					} else {
						var position = $(elem).offset();
					}
					if (position.left >= bounds.left && position.top >= bounds.top
						&& position.left  <= bounds.right && position.top  <= bounds.bottom) {
						return true;
					} else {
						return false;
					}
				}
			},
			events : {
				"click #closeFei" : "onCloseFei",
				"click #shouqi" : "onShouqi",
				"click #sureAndNext" : "onSureAndNext"
			},
			initEvents : function () {
				var self = this;
				self.$contactsP.undelegate("click").delegate("i", "click", function (e) {
					var friendFetionNo = $(this).attr("friendFetionNo");
					var c = self.model.getContactsById(friendFetionNo);
					$("li[friendFetionNo='" + friendFetionNo + "']").removeClass();
					self.model.removeSelectedItem(c);
					self.renderSelected();
					self.model.setTheNumChoosed();
					self.setHeight();
				//	if(self.showFlag){//非折叠的时候，点击删除，才重新计算高度
					//	self.$contactsPHeight = self.$contactsP.height(); //每次点击的时候重新计算高度	
				//		$("#fiveMore").show();
				//	}else{ //折叠的时候，先还原高度，再计算总高度(供展示折叠用)，再隐藏部分高度（当前状态）
					//	self.$contactsP.height("auto");
					//	self.$contactsPHeight = self.$contactsP.height();
					//	self.$contactsP.height(self.hei);
				//		$("#fiveMore").hide();
				//	}
					
				});
			},
			onCloseFei : function(){
				//关闭的时候，因为为单例，所有的需要初始化
				this.model.selectedList.length = 0;
				this.showAll = false;
				$("#shouqi").hide();
				$("#contactsP").height(0);
				this.$el.hide();
				this.mask.hide();
				this.renderSelected();
				this.model.setTheNumChoosed();
				$("#shouqi").html("全部<i class=\"i_down\"></i>");
				$("#feibar_address").find("i").removeClass("i_rightDot").end().find("ul").hide();
				$("li[friendFetionNo]").removeClass();
			},
			onShouqi : function(e){
				if(this.model.selectedList.length == 0){
					return; //什么也没选中的话，点击不做处理
				}
				var _this = $(e.currentTarget);
				if(_this.text() == "全部"){
					_this.html("收起<i class=\"i_up\"></i>");
					this.showAll = true;
				}else{
					_this.html("全部<i class=\"i_down\"></i>");
					this.showAll = false;
				}
				this.hei = $("#five").height() + 11;
				this.setHeight();
		//		if(this.showFlag){
				//	this.$contactsP.animate({height: this.hei});
				//	this.showFlag = false;
		//			$("#fiveMore").show();
		//		}else{
				//	this.$contactsP.animate({height: this.$contactsPHeight});
				//	this.showFlag = true;
		//			$("#fiveMore").hide();
		//		}
				
			},
			onSureAndNext: function(){
				var self = this;
				if(self.model.selectedList.length == 0){
					top.$Msg.alert(self.model.tipWords.AT_LEAST_ONE_USER);
					return;
				}
				this.model.getCurrentMailContent2(function(e){
					self.model.emailDetails = {
						sendAccount :$Email.getName(e["account"]),
						sendTitle : e["subject"],
						sendTime : $Date.format("yyyy-MM-dd hh:mm:ss", new Date(e["sendDate"] * 1000)),
						sendContent : e["text"]["content"]
					};
					if($("#sureAndNext").attr("flg") == "1"){
						self.getSendHtmlTemplate();
					}
					$("#sureAndNext").attr("flg", 0);
				});
			},
			getSendHtmlTemplate: function(){
				var self = this; 
				var emailDetails = self.model.emailDetails;
			//	var title_subjet_time_LENGTH = emailDetails["sendAccount"].length + emailDetails["sendTitle"].length + emailDetails["sendTime"].length + 4 * 4;
				var title_subjet_time_LENGTH = 0;
				var sendContent = "发件人：" + emailDetails["sendAccount"] + " / 主 题：" + emailDetails["sendTitle"] + " / 时 间：" + emailDetails["sendTime"] + " / <br/>正文：" + emailDetails["sendContent"];
				var sendContent = sendContent.replace(/\r|\n|^\s|\s$/ig, "").replace(/\s+/ig," ").replace(/^\s|\s$/ig, "");
				var show200Char = sendContent.substr(0,250);
				var show2000Char = sendContent.substr(0,2000 - title_subjet_time_LENGTH);
				var thisHtml = M139.Text.Utils.format(self.template.sendHTMLtemplate,{
					sendAccount : emailDetails["sendAccount"],
					sendTitle : emailDetails["sendTitle"],
					sendTime : emailDetails["sendTime"],
					sendContent : show200Char,
					editContent : show2000Char.replace("<br/>", ""),
					currentNum : show2000Char.length
				});
				self.diag = top.$Msg.showHTML(
					thisHtml,
					function(){
						
						self.model.emailDetails.sendContent = $("#editContent").val();
						top.M139.UI.TipMessage.show(self.model.tipWords.SENDING);
						self.model.sendMailToFetio(function(result){
							if(result.responseData && result.responseData.code == 'S_OK'){
							//	top.$Msg.alert("发送成功");
								self.onCloseFei(); //成功才关闭
								top.M139.UI.TipMessage.show(self.model.tipWords.SEND_SUCCESS, {delay : 2000})
							}else{
								top.M139.UI.TipMessage.hide();
								top.$Msg.confirm(self.model.tipWords.SEND_FAIL, 
									function(){
										self.getSendHtmlTemplate();
									},function(){
										self.onCloseFei(); //关闭2个弹窗
										self.diag.close();
									},
									{"buttons": ["重试", "取消"]});
							}
						
						});
					},
					function(){
					//	$("#sureAndNext").attr("flg", 1);
						self.diag.close();
					//	self.model.selectedList.length = 0;
					//	self.showAll = false;
					//	self.model.setTheNumChoosed();
					//	$("#shouqi").hide();
					//	$("#contactsP").height(0);
					},
					{
						dialogTitle:"转发给飞信好友",
						width: 530,
						buttons:["确定","取消"]
					}
				).on("close",function(){
					$("#sureAndNext").attr("flg", 1);
				});
				
				$("#iamthemain").css({"width": 500,"height" : 125, "overflow-x" : "hidden","overflow-y":"auto"});
				$("#iamthemain").click(iamthemain);
				if(show2000Char.length <= 250){
					$("#showAll").hide();
				}else{
				//	$("#iamthemain").unbind("click");//大于200的时候不能不展开就编辑
				}
				$("#editContent").hide();
				$("#showAll").click(function(e){
					$("#iamthemain").html(show2000Char);
					$(this).hide();
					$("#iamthemain").click(iamthemain);
					$("#currentNum").html(show2000Char.length - title_subjet_time_LENGTH);
					e.stopPropagation();
				});
				
					function iamthemain(){
						$("#iamthemain").remove();
						var $editContent = $("#editContent");
						$editContent.show();
						$("#currentNum").html(show2000Char.length);
						M139.Timing.watchInputChange($editContent[0], function () {
							var currentContent = $editContent.val();
							$("#currentNum").html(currentContent.length);
							if($editContent.val().length > 2000 - title_subjet_time_LENGTH){
							//	top.$Msg.alert(self.model.tipWords.MAX_2000_CHARSET);
								M139.Dom.flashElement(document.getElementById("numMaxTips"));
								$editContent.val(currentContent.substr(0,2000 - title_subjet_time_LENGTH));
								$("#currentNum").html(currentContent.length);
								return false;
							}
						});
					}
			},
			renderSelected: function(){
				var html = this.bulidSelected();
			//	this.$el.find("#contactsP").html(html).height("auto"); //渲染的时候初始化高度
				this.$el.find("#contactsP").html(html);
			},
			bulidSelected : function () {
				var selectedList = this.model.selectedList;
				var length = selectedList.length;
				//前5个和后面的要不同的包裹
				var html = "<span id='five'>";
				styleDis = this.showFlag ? "" : "display:none;";
				for (var i = 0; i < length; i++) {
					var friendName = selectedList[i]["friendName"] == "" ? selectedList[i]["friendFetionNo"] : selectedList[i]["friendName"];
					html += this.template.selected.replace("{name}", friendName).replace("{friendFetionNo}", selectedList[i]["friendFetionNo"]);
					if( i == 4){
						html += "</span><span id='fiveMore'>";
					}
				}
				if(length < 5){
					html += "</span>";
				}
				if(length >= 5){
					html +="</span>";
				}
				return html;
			}
		}));
		
		$.extend(M2012.ReadMail.Fetion.View,{
			//单例
			create: function(){
				//第二次点击的时候执行，状态判断和数据读取在一个接口里面。
				if(top.$User.iAmNotFetion && top.$User.iAmNotFetion == 1){
					top.$Msg.alert("您不是飞信用户，无法使用此功能");
					return;
				}else if(top.$User.iAmNotFetion && top.$User.iAmNotFetion == 2){
					top.$Msg.alert("由于网络超时，请刷新后重试");
					return;
				}
				if(!this.fetionView){
					this.fetionView = new M2012.ReadMail.Fetion.View();
				}
				this.fetionView.mask && this.fetionView.mask.show();//第二次的时候，遮罩层要显示
				this.fetionView.$el.show();
				return;
			},
			//复制M2012.UI.DialogBasede的方法，如果用M2012.UI.DialogBase.showMask，后面再用M2012.UI.DialogBase弹窗，再次弹打开飞信面板，遮罩层会串，会找错遮罩层，
			masks: [],
			
			showMask: function (options) {
				var mask;
				options = options || {};
				var zIndex = options.zIndex;
				var opacity = options.opacity || 0.5;
				for (var i = 0; i < this.masks.length; i++) {
					if (this.masks[i].css("display") == "none") {
						mask = this.masks[i];
						break;
					}
				}
				if (!mask) {
					mask = createMask();
					this.masks.push(mask);
				}
				mask.css("z-index", zIndex);
				mask.css("opacity", opacity);
				mask.show();
				function createMask() {
					var el = $("<div class='layer_mask' style='overflow:hidden'></div>");
					if ($B.is.ie) {
						//ie6增加iframe 遮住<select>
						el.append("<iframe frameBorder='0' style='width:100%;height:100%;'></iframe>");
					}
					el.appendTo(document.body);
					return el;
				}
				return mask;
			}
		});
})(jQuery, Backbone, _, M139);
