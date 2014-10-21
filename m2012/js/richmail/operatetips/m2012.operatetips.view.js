/**
 * @fileOverview 运营tips
 */

(function(jQuery, Backbone, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace("M2012.OperateTips.View", superClass.extend({

        initialize: function(options) {
            this.model = new M2012.OperateTips.Model();
            superClass.prototype.initialize.apply(this, arguments);

        },

        /** tips配置 */
        tipsConfig: {
            width: 250 //宽度
        },

        /** 方向样式 */
        directionClass: {
            top: 'tipsTopArrow',
            left: 'tipsLeftArrow',
            right: 'tipsRightArrow',
            bottom: 'tipsBottomArrow'
        },

        /** 模版 */
        /*
        template: {
            tips: ['<div id="caixuntips_{id}" class="tips yellow-tips" style="{style}">', '<a href="javascript:" class="yellow-tips-close" name="popup_close"><i class="i_u_close"></i></a>', '<div class="tips-text">{content}</div>', '<div class="{directionClass} diamond" style="{directionStyle}"></div>', '</div>'].join(""),
            icoContent: ['<div class="imgInfo">', '<i class="imgLink {ico}"></i>', '{content}', '</div>'].join("")
        },*/

        template: {
            tips:['<div id="caixuntips_{id}" class="tipsLayer" style="{style}">',
                '<div class="tipsLayerMain">',
                '{content}',
                '</div>',      
                '<i class="i-tipsLayerArrow {directionClass}" style="{directionStyle}"></i>',
                '<a href="javascript:;" class="closeTipsLayerBtn yellow-tips-close" title="关闭"><i class="i-closeTipsLayer"></i></a>',
                '</div>'].join(''),
            icoContent: ['<i class="{ico}"></i>', '{content}'].join("")
        },

        /** 计算tips显示位置 
         * @param {object} obj tips数据对象
         */
        getPositionObj: function(obj) {
            var self = this;
            var posTop = 0;
            var posLeft = 0;
            var elem = obj.elem;
            var tipsWidth = self.tipsConfig.width;
            var direction = obj.direction; //箭头方向
            switch(direction) {
            case 'top':
                posTop = elem.offset().top + elem.height() + 5;
                if(self.isSlopOver(obj)) { //越界
                    posLeft = elem.offset().left - tipsWidth + 20;
                } else {
                    posLeft = elem.offset().left + 20;
                }
                break;
            case 'left':
                posTop = elem.offset().top - 5;
                posLeft = elem.offset().left + elem.width() + 10;
                break;
            case 'bottom':
                posTop = elem.offset().top - 75;
                if(self.isSlopOver(obj)) { //越界
                    posLeft = elem.offset().left - tipsWidth;
                } else {
                    posLeft = elem.offset().left + 20;
                }
                break;
            case 'right':
                posTop = elem.offset().top - 5;
                posLeft = elem.offset().left - tipsWidth;
                break;
            default:
                break;
            }
            return {
                top: +(posTop + obj.adjustTop),
                left: +(posLeft + obj.adjustLeft)
            };

        },

        /** 判断tips是否越界 
         * @param {object} obj tips数据对象
         */
        isSlopOver: function(obj) {
            var self = this;
            var elem = $('#' + obj.elementId, obj.doc);
            var tipsWidth = self.tipsConfig.width;
            var direction = obj.direction;
            if(elem[0]) {
                var bodyWidth = $('body', obj.doc).width();
                if((direction == 'top' || direction == 'bottom') && elem.offset().left + tipsWidth > bodyWidth) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },

        /** 调整箭头样式 
         * @param {object} obj tips数据对象
         */
        getDirectionStyle: function(obj) {
            var self = this;
            var style = '';
            if(self.isSlopOver(obj)) { //若越界则调整为相反方向显示
                if(obj.direction == 'top' || obj.direction == 'bottom') {
                    style = 'left:auto;right:10px;';
                }
            }
            return style;
        },

        /** 获取元素位置样式 
         * @param {object} obj tips数据对象
         */
        getPositionStyle: function(obj) {
            var self = this;
            var elem = $('#' + obj.elementId, obj.doc);
			
			//新增列表页不固定ID元素,根据元素name属性定位，如<a name='name_mailtask'>任务邮件</a>
			if(obj.elementId.indexOf('name_') > -1){
				var elemname = obj.elementId.replace('name_','');
				var scrollContainer = $('#div_maillist'); //可以补充其他固定ID滚动区域
				elem = $('a[name="' + elemname + '"]:eq(0),div[name="' + elemname + '"]:eq(0)', obj.doc);
				if(scrollContainer.find(elem)){
					if(scrollContainer.scrollTop() > 80){elem = []}
				}				
			}

			//写信页特殊处理，没有固定ID
			if(obj.elementId === 'compose'){
				try{
					var composeIframe = $.grep($("iframe[id^=compose]"),function(val,i){
						return $App.getCurrentTab().name === val.id;
					});
					elem = composeIframe[0] && $('#' + obj.elementId, composeIframe[0].contentWindow.document);
				}catch(e){}
			}
			
            if(elem[0]) {
                var posObj = self.getPositionObj({
                    elem: elem,
                    elementId: obj.elementId,
                    direction: obj.direction,
                    adjustLeft: obj.adjustLeft,
                    adjustTop: obj.adjustTop
                });
				
				if( isNaN(posObj.left) || isNaN(posObj.top) ){
					return 'display:none';
				}else if( posObj.left > $('body',obj.doc).width() || posObj.top > $('body',obj.doc).height()){
					return 'display:none';
				}else if(posObj.left < 30 || posObj.top < 30) { //元素隐藏状态
                    return 'display:none';
                } else {
                    return $T.Utils.format('z-index:9000;left:{0}px;top:{1}px;', [posObj.left, posObj.top]);
                }
            } else {
                return 'display:none';
            }
        },

        /** 渲染单个tips 
         * @param {object} data tips数据对象
         * @param {object} doc 所在页面document
         */
        render: function(data, doc) {
            // 先移除现存的tips，避免数据问题（如果存在多个tips则新的tips会被覆盖）
            $('#caixuntips_' + data.positionId, doc).remove();
            var self = this;
            var temp = self.template.tips;
            var icotemp = self.template.icoContent;
            var content = data.content;
            if(self.getImgIco(data) != '') {
                content = $T.Utils.format(icotemp, {
                    ico: self.getImgIco(data),
                    content: content
                });
            }
			
			var direction = $(content).attr('direction') || $(content).find('div[direction]').attr('direction');
			var left = $(content).attr('left') || $(content).find('div[left]').attr('left');
			var top = $(content).attr('top') || $(content).find('div[top]').attr('top');
			direction = direction || 'top';
			return $T.Utils.format(temp, {
                id: data.positionId,
                directionClass: self.directionClass[direction],
                directionStyle: self.getDirectionStyle({
                    elementId: data.elementId,
                    doc: doc,
                    direction: direction
                }),
                content: content,
                style: self.getPositionStyle({
                    elementId: data.elementId,
                    doc: doc,
                    direction: direction,
                    adjustLeft: 0 | (left || 0),
                    adjustTop: 0 | (top ||  0)
                })
            });
        },

        /** 行为统计 
            key="tips_remind0"  desc="tips_功能提醒类0" 
            key="tips_remind1"  desc="tips_功能提醒类1" 
            key="tips_remind2"  desc="tips_功能提醒类2"
            key="tips_setting0"  desc="tips_功能设置类0"
            key="tips_setting1"  desc="tips_功能设置类1" 
            key="tips_setting2"  desc="tips_功能设置类2" 
            key="tips_guide0"  desc="tips_功能引导类0"
            key="tips_guide1"  desc="tips_功能引导类1" 
            key="tips_guide2"  desc="tips_功能引导类2"    
        */
        addBehavior:function(type,key){
            var self = this;
            var behaviorKey;
            if(type){
                behaviorKey = 'tips_' + [0,'remind','setting','guide'][type];                
            }
            if(key){
                behaviorKey += key;
            }
            top.BH(behaviorKey);
        },

        /** 关闭tips 
         * @param {string} tipsid id值
         * @param {object} doc 所在页面文档
         */
        closeTips: function(obj) {
            var self = this;
            var type = obj.type;
            var tipsContainer = $('#caixuntips_' + obj.tipsid, obj.doc);

            function removeTips(){
                self.model.closeRequest(obj.tipsid);
                tipsContainer.remove();

                //删除相关内存数据
                var adLinks = self.model.getTipsData();
                // PNS和智能运营对接数据没有保存，不用做处理
                if (!adLinks) return;
                $.each(adLinks, function(n, val){
                    if (val) {
                        var id = val.positionId || val.id;
                        if (id === obj.tipsid) {
                            adLinks.splice(n,1);
                            return;
                        }
                    }
                });
            }

            //右上角关闭
            tipsContainer.find('a.yellow-tips-close').unbind('click').click(function() {
                removeTips();
                self.addBehavior(type,2);

                // 针对具体每一条消息的统计
                var closeid = tipsContainer.find('a[closeid]').attr('closeid'); 
                closeid && top.BH({actionId:8000, thingId:closeid});
            });

            //其他关闭
            tipsContainer.find('.tipsLayerMainInner a').unbind('click').click(function(){
                removeTips();
                self.addBehavior(type,1);
                self.defineTipsEvent(obj.operate); //定制事件

                // 针对具体每一条消息的统计
                var thingid = tipsContainer.find('a[thingid]').attr('thingid'); 
                thingid && top.BH({actionId:8000, thingId:thingid});
            });
			
        },

        /** 产品定制的tips 
        * 如：点击tips跳到某个页面达到某种状态
        */
        defineTipsEvent:function(operate){
            var self = this;
            //operate = 1; //测试用
            var action = {
                            '0' : function(){
                                return;
                            },
                            '1' : function(){ //邮件到达通知设置开启过滤
                                $App.show("notice");
                                top.M139.Timing.waitForReady('top.$("#notice").contents()', function () { 
                                    setTimeout(function(){
                                        $('#notice').contents().find('#majorswitch input:eq(0)').click();
                                    },1000);  
                                });
                            }
                        };
            //action[operate] && action[operate]();
        },

        /** tips自适应 
         * @param {object} obj tips数据对象
         * 由于页面有缩放拖动等行为，造成tips位置会变动，所以要采用计时器显示tips。
         */
        tipsResize: function(obj) {
            var self = this;
            var tipsContainer = $('#caixuntips_' + obj.tipsid, obj.doc);
            var tipsText = tipsContainer.find('.tips-text > div');
			if(tipsContainer.find('div[direction]')){
				tipsText = tipsContainer.find('div[direction]');
			}
            var scrollContainer = $('#sidebar', obj.doc); //滚动容器，若有其他滚动条容器在这里添加
            var elem = $('#' + obj.elementId, obj.doc);
            var timer = M139.Timing.setInterval('operatetips', function() {
                if(tipsContainer[0]) {
                    var style = self.getPositionStyle({
                        elementId: obj.elementId,
                        doc: obj.doc,
                        direction: tipsText.attr('direction') || 'top',
                        adjustLeft: tipsText.attr('left') ? parseInt(tipsText.attr('left')) : 0,
                        adjustTop: tipsText.attr('top') ? parseInt(tipsText.attr('top')) : 0
                    });
				
                    //首页特殊容器tips处理，如在滚动容器内  
                    if(scrollContainer.find('#' + obj.elementId)[0]) {
                        if(elem.offset().top + 15 < scrollContainer.offset().top) {
                            tipsContainer.hide();
                        } else if(elem.offset().top + 15 > scrollContainer.offset().top + scrollContainer.height()) {
                            tipsContainer.hide();
                        } else {
                            tipsContainer.attr('style', style);
                        }
                    } else {
                        tipsContainer.attr('style', style);
                    }
                } else {
                    M139.Timing.clearInterval(timer);
                }
            }, 1000);

            self.closeTips({
                tipsid:obj.tipsid, 
                doc:obj.doc,
                type:obj.type
            }); //点击关闭事件                         
        },

        /** 获取tips自定义图标 */
        getImgIco: function(item) {
            var self = this;
            var ico = '';
            //数据对应样式
            var data = {
                '1': 'i_t_ok',
                '2': 'i_t_del',
                '3': 'i_t_garbage',
                '4': 'i_t_light',
                '5': 'i_t_link',
                '6': 'i_t_warn'
            };
            if(item && item.imageurl) {
                var url = item.imageurl;
                try {
                    var index = url.split("tips/")[1].split(".")[0];
                    if(data[index]) {
                        ico = data[index]
                    };
                } catch(e) {}
            }
            return ico;
        },


        /** tips展示 */
        showTips: function(tipsList) {
            var self = this;
			var timer = {};

            function showIframeTips(itemdata, tipsObj){
                var iframe = $('#' + itemdata.pageUrl)[0];
                if(iframe) { //内嵌页只弹一次
                    var iframedoc = iframe.contentWindow.document;

                    // 已经找到tips所在的iframe，将tips所对应的计时器给干掉
                    clearInterval(timer[itemdata.positionId]);

                    $('body', iframedoc).append(self.render(itemdata, iframedoc));
                    tipsObj.doc = iframedoc;
                    self.tipsResize(tipsObj);
                }
            }

            $.each(tipsList, function(n, val) {
                var itemdata = val;
                var tipsObj = {
                    tipsid: itemdata.positionId,
                    elementId: itemdata.elementId,
                    type: itemdata.type,
                    operate: itemdata.operate,
                    doc: document
                };

                if(itemdata.pageUrl == 'index') { //主页
                    $('body').append(self.render(itemdata, document));
                    self.tipsResize(tipsObj);
                } else { //iframe页
					
					if(itemdata.pageUrl == 'welcome'){
						showIframeTips(itemdata, tipsObj);
					}else{
						timer[itemdata.positionId] = setInterval(function(){
							showIframeTips(itemdata, tipsObj);
						},3000);
					}
                }
            });

        },

        /**绑定事件处理
         *@inner
         **/
        initEvents: function() {
            //tips显示
            var self = this;

            // NewAdLink来源于欢迎页的统一位置广告位 web_061 代表运营tips的位置编号
            var tipsData = self.model.getTipsData();
            //数据用于测试
            /*tipsData = [
                {id:"114",pageurl:"index",imageurl:"/images/tips/1.png",elementid:"li_star",type:"3",operate:"0",content:"<div style=\"FONT-SIZE: 12px\">重要邮件，点亮星标，方便查找。 <br></div><a style=\"FLOAT: right\" href=\"javascript:MB.search({flags:{starFlag:1},title:\'星标邮件\'});\">体验一下</a>"},
                {id:"115",pageurl:"index",imageurl:"/images/tips/2.png",elementid:"recommend",type:"3",operate:"0",content:"<div style=\"FONT-SIZE: 12px\">推荐业务内容</div>"},
                {id:"116",pageurl:"welcome",imageurl:"/images/tips/6.png",elementid:"shequLink",type:"3",operate:"0",content:"<div direction='top' style=\"FONT-SIZE: 12px\">欢迎页同窗内容。<br></div>"}
            ];*/

            if(tipsData) {
                this.showTips(tipsData);
            }

            $App.on('tipstest', function(response) { //用于自测试tips
                self.showTips(response.tipsdata);
            });

            /** 浏览器命令行测试代码(方便产品自测)：
            var tipstestdata = [{
            content: '<div>用139邮箱接收移动账单，方便又快捷。</div><a href="$App.jumpTo(\'sms\');">马上开通账单投递功能</a>', //tips内容
            elementid: "mms_link", //对应页面id
            id: "0", //测试的tipsid
            imageurl: "/images/tips/1.png", // tips显示图片  如： /images/tips/1.png
            operate: "5", //产品定制类型
            pageurl: "index", //所属页面
            type: "2"}];  //可以添加多条数据，格式：{ content:'',....},{ content:'',.... }
            if(top.operatetipsview){$App.trigger('tipstest',{tipsdata:tipstestdata})}else{M139.core.utilCreateScriptTag({id:"operatetips",src:"operatetips.pack.js",charset:"utf-8"},function(){$App.trigger('tipstest',{tipsdata:tipstestdata})})}
           */
        }

    }));

})(jQuery, Backbone, _, M139);
