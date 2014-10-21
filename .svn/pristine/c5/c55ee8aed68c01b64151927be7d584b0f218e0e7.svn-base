/**
* @fileOverview 写信成功页视图层--添加好友到通信录.
* @namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Success.Addgroup', superClass.extend({
    	elModule : $("#randomModule"),

		templateContainer:['<strong class="writeOk_box_title">添加到分组 <span>( 写信时选择分组为收件人，轻松发给组内所有人 )</span></strong>',
			'<div class="writeOk_box_addrBas" style="height:165px;">{list}</div>',
			'<div class="writeOk_box_btn writeOk_box_btnNot clearfix">',
				'<a class="btnSetG" href="javascript:;" id="saveGroup"><span>保 存</span></a>',
			'</div>'].join(""),

		templateItem:[ '<div key="{key}" class="addrBase addrBaseNew btnNormal_write">',
			'<a class="addrBase_con" title="{email}" style="cursor:default" href="javascript:;">{name}</a>',
			'<a class="addrBase_close" title="删除" href="javascript:;">x</a>',
		'</div>'].join(""),

		templateSave:['<strong class="writeOk_box_title">已添加联系人到分组</strong>',
			'<ul class="writeOk_box_ul writeOk_box_ul_one clearfix">',
				'<li class="clearfix">',
					'<span class="writeOk_label">分组名称：</span>',
					'<div class="writeOk_element">',
						'<p>',
							'<input type="text" first="true"  maxlength="16" value="{value}" class="iText gray" name="" style="width:240px;">',
						'</p>',
						'<p class="writeOk_element_p">最多16个字符</p>',
						'<p class="clearfix writeOk_element_btn"><a href="javascript:;" class="btnSetG"><span>保 存</span></a></p>',
					'</div>',
				'</li>',
			'</ul>'].join(""),

		templateSuccess:[ '<div class="writeOk_boxOther clearfix">',
				'<i class="i_ok_min"></i>',
				'<div class="writeOk_boxOther_right">',
					'<strong>保存成功</strong>',
					'<p>{name}</p>',
				'</div>',
			'</div>'].join(""),

		templateFailed:[ '<div class="writeOk_boxOther clearfix">',
			'<i class="i_warn_min"></i>',
			'<div class="writeOk_boxOther_right">',
				'<strong>网页君开小差啦，保存不成功</strong>',
				'<p class="mt_10"><a class="btnSetG" href="javascript:;"><span>重新保存</span></a></p>',
			'</div>',
		'</div>'].join(""),

		initialize : function() {
			BH('wOk_addgroup_show');
			this.render();
		},

		//将通信录数组转化为hash表
		hashList:function(){
			var list = this.model.get('list');
			var i=0,len=list.length
			var obj = {};
			for(;i<len; i++){
				obj[i] = list[i];
			}
			this.list = obj;
			this._length = len;
		},

		// 渲染附件附件列表
		render: function(){
			var list, listStr = "";
			this.hashList();
			list = this.list;
			
			for(var i in list){
				listStr += $T.format(this.templateItem,{
					key:i,
					email:list[i].FamilyEmail,
					name:list[i].AddrFirstName
				});
			}
			container = $T.format(this.templateContainer,{list:listStr});
			this.elModule.html(container).show();		
			this.setHeight();			
			this.eventInit();		
		},

		setHeight:function(){
			var len = this._length;
			var height = Math.ceil(len/4) * 33 + 10;
			var _height = height>165?'165px':(height+'px');
			this.elModule.find('.writeOk_box_addrBas').css('height',_height);
		},

		eventInit:function(){
			var self = this;

			//处理姓名点击删除事件
			self.elModule.find('a.addrBase_close').click(function(){
				var div = $(this).parent('div[key]').remove();
				var key = 0 | div.attr('key');
				var len = --self._length;
				var a = [];
				self.list[key] = null;

				if(len==1){
					self.elModule.find('div[key]')
					    .addClass('btnNormal_writeNo')
					    .removeClass('btnNormal_write')
					    .find('a.addrBase_close').remove();
				}

			    self.setHeight();			
			});

			//添加联系人到分组
			self.elModule.find('#saveGroup').click(function(){
				BH('wOk_addgroup_save');
				self.setGroup();
			})
		},

		setGroup: function () {
			var self = this;
			var serialId = [];
			var names = [];
			var list = self.list

			for(var i in list){
				var item = list[i];
				if(!item){continue}
				var name = item.AddrFirstName || item.name || item.lowerName || '';
				names.push(name);
				serialId.push(item.SerialId);
			}		

			self.serialIds = serialId;
			value = names.join('、');
			value = value.length>16?(value.slice(0,13) + '...'):value;
			var html = $T.format(self.templateSave,{value:value});

			self.elModule.html(html).find('a').click(function(){
				BH('wOk_addgroup_savename');
				var value = self.elModule.find('input').val();
				var valid = self.isValid(value);
				if(valid){
					self.model.set('groupName',value);
					self.saveGroup(value);
				}
			});

			self.elModule.find('input').val(value).focus(function(){
				var first = $(this).attr('first');
				if(first){
				    $(this).val('').attr('first','');
				}
			}); 

			self.elModule.find('input').one('focus',function(){
				BH('wOk_addgroup_edite');
			})

	    },

	    saveGroup:function(name){
	    	var self = this;
	    	var option = {
				groupName: name,
				serialId: self.serialIds
	    	}

			top.Contacts.editGroupList(option,function(e) {
	            if(e.ResultCode == '0'){
	            	groupId = e.GroupInfo[0].GroupId;
	            	self.sucRender();

                    //更新通讯录
	            	var param = {
                        "groupName": option.groupName,
                        "serialId": option.serialId.join(","),
                        "groupId": groupId
                    }
	            	top.Contacts.updateCache("AddGroup", param);
                    top.Contacts.updateCache("CopyContactsToGroup", param);
	            }else{
	            	self.renderFailSave();
	            }
	        });       
	    },

	    isValid:function(value){
	    	var self = this;
	    	if($.trim(value) == ''){
	    		self.warnTips('请输入组名');	    		
	    		return false;
	    	}else if(top.Contacts.isExistsGroupName($.trim(value))){
	    		self.warnTips('分组名重复，请重新输入');	
	    		return false
	    	}
	    	return true;
	    },


	    warnTips:function(text){
	    	var p = this.elModule.find('p.writeOk_element_p').text(text).addClass('red');
    		setTimeout(function(){
    			p.text('最多输入16个字符').removeClass('red');
    		},3000);
	    },

	    sucRender:function(){
	    	BH('wOk_addgroup_suc');
	    	var self = this;
	    	var name = '分组名称：' + this.model.get('groupName');
	    	var html = $T.format(self.templateSuccess,{name:name});
	    	self.elModule.html(html);
	    },

	    renderFailSave:function(){
	    	var self = this;
	    	self.elModule.html(self.templateFailed).find('a').click(function(){
	    		self.render();
	    	});
	    },

	    renderSuccess:function(name){
	    	var el = self.el
	    	$(el).html(self.templateSuccess);
	    	$(el).find('input').val(self.requstBody.groupName);
	    	$(el).find('#editGroup').click(function(){
	    		var val = $(el).find('input').val();
	    		if($.trim(val) == ''){
	    			top.$Msg.alert('请输入组名');
	    		}else{
	    			top.Contacts.editGroupList(self.requstBody,function(e) {
			            if(e.ResultCode == '0'){
			            	self.requstBody.groupId = e.GroupInfo[0].GroupId;
			            	self.renderSuccess(self.requstBody.groupName)
			            }else{
			            	self.renderFailSave();
			            }
			        });   
	    		};
	    	});
	    }    
    }));
})(jQuery, _, M139);

