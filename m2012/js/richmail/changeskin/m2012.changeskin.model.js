/**
 * @fileOverview 换皮肤模型
 */
 (function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    M139.namespace("M2012.ChangeSkin.Model",Backbone.Model.extend({
    	defaults : {
    		curSkinName : top.$User.getSkinName()
    	},
    	skinTypes : {
    		FREE : 'free',
    		VIP5 : 'vip5',
    		VIP20 : 'vip20'
    	},
    	skins : [
                { name : 'skin_lightblue', thumbnail : '../images/skin/skin/lightblue.jpg', text : '默认皮肤', type : 'free'},
    			{ name : 'skin_red', thumbnail : '../images/skin/skin/red.jpg', text : '和色系', type : 'free'},
				
    			{ name : 'skin_mstar', thumbnail : '../images/skin/skin/mstar.jpg', text : '移动星空', type : 'free'},
    			{ name : 'skin_sunset', thumbnail : '../images/skin/skin/sunset.jpg', text : '日落', type : 'free'},
    			{ name : 'skin_paint', thumbnail : '../images/skin/skin/paint.jpg', text : '国画', type : 'free'},
    			{ name : 'skin_spring', thumbnail : '../images/skin/skin/spring.jpg', text : '春', type : 'free'},
                { name : 'skin_summer', thumbnail : '../images/skin/skin/summer.jpg', text : '夏', type : 'free'},
                { name : 'skin_autumn', thumbnail : '../images/skin/skin/autumn.jpg', text : '秋', type : 'free'},
                { name : 'skin_winter', thumbnail : '../images/skin/skin/winter.jpg', text : '冬', type : 'free'},
                { name : 'skin_sunflower', thumbnail : '../images/skin/skin/sunflower.jpg', text : '向日葵', type : 'free'},
    			{ name : 'skin_rose', thumbnail : '../images/skin/skin/rose.jpg', text : '红玫瑰', type : 'free'},
    			{ name : 'skin_flowers', thumbnail : '../images/skin/skin/flowers.jpg', text : '春季花海', type : 'free'},
    			{ name : 'skin_brocade', thumbnail : '../images/skin/skin/brocade.jpg', text : '繁华似锦', type : 'free'},	
				{ name : 'skin_newyear', thumbnail : '../images/skin/skin/newyear.jpg', text : '祥云贺年', type : 'free'},	
				{ name : 'skin_dew', thumbnail : '../images/skin/skin/dew.jpg', text : '绿叶露珠', type : 'free'},	
				{ name : 'skin_cherry', thumbnail : '../images/skin/skin/cherry.jpg', text : '轻舞樱花', type : 'free'},	
				{ name : 'skin_warm', thumbnail : '../images/skin/skin/warm.jpg', text : '温馨暖阳', type : 'free'},	
				{ name : 'skin_lithe', thumbnail : '../images/skin/skin/lithe.jpg', text : '蓝色轻盈', type : 'free'},	
				{ name : 'skin_night', thumbnail : '../images/skin/skin/night.jpg', text : '晚安问候', type : 'free'},	
				{ name : 'skin_morning', thumbnail : '../images/skin/skin/morning.jpg', text : '早安天鹅', type : 'free'},	
                { name : 'skin_child', thumbnail : '../images/skin/skin/child.jpg', text : '儿童', type : 'free'},
                { name : 'skin_woman', thumbnail : '../images/skin/skin/woman.jpg', text : '女性', type : 'free'},  
                { name : 'skin_claritBamboo', thumbnail : '../images/skin/skin/claritBamboo.jpg', text : '草绿', type : 'free', bgImg: '../images/skin/claritBamboo/skinBody.jpg'}, 
                { name : 'skin_claritBrown', thumbnail : '../images/skin/skin/claritBrown.jpg', text : '暖棕', type : 'free', bgImg: '../images/skin/claritBrown/skinBody.jpg'},
                { name : 'skin_claritGreen', thumbnail : '../images/skin/skin/claritGreen.jpg', text : '浅绿', type : 'free', bgImg: '../images/skin/claritGreen/skinBody.jpg'},
                { name : 'skin_claritPurple', thumbnail : '../images/skin/skin/claritPurple.jpg', text : '淡紫', type : 'free', bgImg: '../images/skin/claritPurple/skinBody.jpg'},
                { name : 'skin_claritRed', thumbnail : '../images/skin/skin/claritRed.jpg', text : '粉红', type : 'free', bgImg: '../images/skin/claritRed/skinBody.jpg'},
               
                { name : 'skin_claritFlower', thumbnail : '../images/skin/skin/claritFlower.jpg', text : '花与海', type : 'free'},
                { name : 'skin_claritForest', thumbnail : '../images/skin/skin/claritForest.jpg', text : '清新绿', type : 'free'}, 
                { name : 'skin_claritSunset', thumbnail : '../images/skin/skin/claritSunset.jpg', text : '心晴天空', type : 'free'},
                { name : 'skin_claritGreeng', thumbnail : '../images/skin/skin/claritGreeng.jpg', text : '绿地', type : 'free'},
                { name : 'skin_claritRoad', thumbnail : '../images/skin/skin/claritRoad.jpg', text : '斑斓', type : 'free'},
                { name : 'skin_claritOnRoad', thumbnail : '../images/skin/skin/claritOnRoad.jpg', text : '远路', type : 'free'},
                

				{ name: 'skin_pink', thumbnail: '../images/skin/skin/pink.jpg', text: '粉红牡丹', level: top.$User.getVipStr("5,20"), type: "vip5" },
    			{ name: 'skin_golf', thumbnail: '../images/skin/skin/golf.jpg', text: '高尔夫', level: top.$User.getVipStr("5,20"), type: "vip5" },
    			{ name: 'skin_light', thumbnail: '../images/skin/skin/light.jpg', text: '流光溢彩', level: top.$User.getVipStr("5,20"), type: "vip5" },
    			{ name: 'skin_star', thumbnail: '../images/skin/skin/star.jpg', text: '星际迷航', level: top.$User.getVipStr("5,20"), type: "vip5" },
    			{ name: 'skin_cat', thumbnail: '../images/skin/skin/cat.jpg', text: '招财进宝', level: top.$User.getVipStr("5,20"), type: "vip5" },
                { name: 'skin_bluesky', thumbnail: '../images/skin/skin/bluesky.jpg', text: '蓝天自造', type: "free" }
    	],
    	tipWords : {
        	NO_PERMISSION : "VIP{2}为{0}元版{1}邮箱特供{2}。立即升级，重新登录后即可使用。",
        	CHANGE_SUC : '皮肤设置成功！',
        	CHANGE_FAI : '皮肤设置失败！'
        },
        logger : new top.M139.Logger({
			name : "M2012.ChangeSkin.Model"
		}),
        /** 
        *换皮肤所需公共代码
        *@constructs M2012.ChangeSkin.Model
        *@param {Object} options 初始化参数集
        *@example
        */
        initialize : function(options){
        },
        // 调接口保存用户设置的皮肤
        setSkin : function(options){
            var self = this;
            $Cookie.set({
                name: "SkinPath2",
                value: options.value,
                domain: "mail." + document.domain
            });
            top.$App.changeSkin(options.value);
            top.$App.setUserConfigInfo("SkinPath2", options.value, function (response) {
                result = response.responseData;
        		if(result && result.code === 'S_OK'){
        		    top.M139.UI.TipMessage.show(self.tipWords['CHANGE_SUC'], { delay: 1000 });
				}else{
					self.logger.error("setAttrs setAttrs error", "[setAttrs]", result);
					
					top.M139.UI.TipMessage.show(self.tipWords['CHANGE_FAI'], {delay : 1000});
					self.set('curSkinName', top.$User.getSkinName());
				}
        	});
        	top.MusicBox.changeSkin();	// 播放器同步换肤
        },
        renderFunctions : {
			getClass : function() {
				var row = this.DataRow;
                //return row.type === 'free'?'':row.type;
                return row.type === 'free'?'':'vip';
			}
		},	
        // 根据名称获取皮肤对象
        getSkinByName : function(name){
        	if(typeof name != 'string'){
        		return
        	}
        	var self = this;
        	var skin = {};
        	$(self.skins).each(function(i){
        		if(this.name == name){
        			skin = this;
        			return false;
        		}
        	});
        	return skin;
        },
        // 获取免费皮肤
        getFreeSkins : function(){
        	var self = this;
        	return self.getSkinsByType(self.skinTypes['FREE']);
        },
        // 获取付费皮肤
        getVipSkins : function(){
        	var self = this;
        	return self.getSkinsByType(self.skinTypes['VIP5']).concat(self.getSkinsByType(self.skinTypes['VIP20']));
        },
        // 获取免费皮肤
        getSkinsByType : function(type){
        	if(typeof type != 'string'){
        		return;
        	}
        	var self = this;
        	var skins = [];
        	$(self.skins).each(function(i){
        		if(this.type == type){
        			skins.push(this);
        		}
        	});
        	return skins;
        },
		// 判断用户是否有权限使用指定皮肤
		isPermission : function(skinObj){
			var self = this;
			if(!skinObj){
				console.log('请传入皮肤对象！function isPermission');
				return false;
			}
			if(skinObj.type == self.skinTypes['FREE']){
				return true;
			}else{
				var userLevel = top.$User.getUserLevel();
				var skinLevel = skinObj.level;
				return skinLevel.indexOf(userLevel) == -1?false:true;
			}
		},
		/**
		 * 得到提示语
		 * @param {string} level 等级字符，形式同getVipStr返回值相同中。
		 * @return {string} 提示语
		 */
        getTipWords : function(level){
        	var self = this;
        	var tipMsg = self.tipWords['NO_PERMISSION'];
            switch (level) {
                case top.$User.levelEnum.vip5 + "," + top.$User.levelEnum.vip20:
                    return top.$T.format(tipMsg, ["5", "、20元版", "皮肤"]);
                case top.$User.levelEnum.vip20:
                    return top.$T.format(tipMsg, ["20", "", "皮肤"]);
				default :
					return top.$T.format(tipMsg, ["5", "、20元版", "皮肤"]);
            }
        },
        showTipWords : function(skinLevel){
        	var self = this;
			var errorMsg = self.getTipWords(skinLevel);
			var tipDialog = top.$Msg.confirm(
		        errorMsg,
		        function(){
		        	top.$App.showOrderinfo();
		        	//top.$App.trigger('loadSkin');
		        	self.set('curSkinName', top.$User.getSkinName());
		        },
		        function(){
		        	//top.$App.trigger('loadSkin');
		        	self.set('curSkinName', top.$User.getSkinName());
		        },
		        {
		        	isHtml:true,
		            buttons:["确定","取消"],
		            title:""
		        }
		    );
		    tipDialog.on('close', function(data){// data 格式  {event : e}
		    	self.set('curSkinName', top.$User.getSkinName());
		    });
        }
    }));
})(jQuery,Backbone,_,M139);
