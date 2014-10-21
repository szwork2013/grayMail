/**
 * @fileOverview 定义输入收件人地址域名纠错组件
 */

(function(jQuery, Backbone, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    /***/
    M139.namespace("M2012.UI.Suggest.InputCorrect", superClass.extend(
    /**@lends M2012.UI.Suggest.InputCorrect.prototype */
    {
        /**
         *输入收件人地址域名纠错组件
         *@constructs M2012.UI.Suggest.InputCorrect
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {M2012.UI.RichInput.View} options.richInputBox 地址输入框组件
         *@example
         */
        initialize : function(options) {
            if(!options || !options.richInputBox) {
                console.log('创建收件人地址域名纠错组件需要传入地址输入框组件实例！');
            }
            this.richInputBox = options.richInputBox;
            this.jContainer = options.richInputBox.jAddrDomainTipsContainer;
			
            this.response = {
                isSuccess : true,
                requestDomain : '',
                suggestions : {}
            };
            this.responseCache = [];
            // 缓存响应结果
            this.domainsStr = '';
            // 请求参数：domain
            this.domainsStrCache = [];
            this.isWaiting = false;
            
            superClass.prototype.initialize.apply(this, arguments);
        },
		suggesDomainTemplate:"",
		callApi: M139.RichMail.API.call,
        render : function() {
            var self = this;
			if(self.timeout){
				clearTimeout(self.timeout);
			}
			self.timeout = setTimeout(function() {
				var domains = self.richInputBox.getInputBoxItemsDomain();
				domains = domains.ASC();
				self.domainsStr = domains.join(',');
				var response = self.getResponse(self.domainsStr);
				if(response && response.isSuccess) {
					self.callback(response);
				}else if(domains.length > 0) {
					self.domainsStrCache.push(self.domainsStr);
					if(!self.isWaiting){
						self.isWaiting = true;
						self.callApi("mbox:checkDomain",{domain:domains},function(response){
							self.successHandler(response.responseData);
						},{error: self.error});
					}
				}else{
					self.jContainer.hide();
				}
			}, 50);
			
        },
        /**
         *根据请求参数requestDomain获得缓存中保存的响应
         *@param requestDomain 请求参数
         *@inner
         */
        getResponse : function(requestDomain) {
			if(!requestDomain) {
				return;
			}
			var self = this;
			var responses = self.responseCache;
			for(var i = 0, rLen = responses.length; i < rLen; i++) {
				var response = responses[i];
				if(response.requestDomain == requestDomain) {
					return response;
				}
			}
        },
        /**
         *请求接口成功后回调改函数
         *@param responseObj 响应数据对象
         *@inner
         */
        successHandler : function(responseObj) {
            var self = this;
            self.isWaiting = false;
			if(responseObj && responseObj['var'] && responseObj['var'].suggestions) {
                self.response.isSuccess = true;
                self.response.requestDomain = self.domainsStr;
                self.response.suggestions = responseObj['var'].suggestions;
                self.responseCache.push(self.response);
                self.callback(self.response);
            }
        },
        /**
         *请求接口成功后回调函数将调用该函数
         *@param response 组装后的响应数据对象
         *@inner
         */
        callback : function(response) {
            var self = this;
			if(response.isSuccess) {
			    var html = '<p class="gray">我们发现您输入的地址可能有误，请修改：</p>';
				var domainHtml = [],i=0;
				var suggestions = response.suggestions;
				for(var domain in suggestions){
					i++;
					var sugDomains = suggestions[domain];
					self.richInputBox.showErrorDomain(domain);
					domainHtml.push(self.getDomainHtml(domain,sugDomains));
				}
				if(i>0) {
					html += domainHtml.join('');
					this.jContainer.html(html).show();
					this.bindClickEvent();
				}else{
					this.jContainer.hide();
				}
			}
        },
		bindClickEvent:function(){
			var self = this;
			self.jContainer.unbind('click').bind('click', function(event) {
				var jEle = $(event.target);
				if(jEle[0].nodeName.toLowerCase() == 'a'){
					var rel = jEle.attr("rel");
					if(rel == "domain") {
						var domain = jEle.attr('domain');
						var errorDomain = jEle.parent().attr('domain');
						self.richInputBox.changItemDomain(errorDomain,domain);
						jEle.parent().remove();
						if(self.jContainer.find('p').length == 1){
							self.jContainer.hide();
						}
						top.BH('compose_emaildomain_correct');
					}
				}
			});
		},
		getDomainHtml : function(errDomain,sugDomains){
			var html = '<p domain="{errDomain}">{errDomain} → {sugDomainHtml}</p>';
			var sugDomainHtml = [];
			for(var i=0; i<sugDomains.length; i++){
				if(i>0) sugDomainHtml.push('，');
				sugDomainHtml.push('<a href="javascript:;" hidefocus="1" rel="domain" domain='+ sugDomains[i] +'>'+ sugDomains[i] +'</a>');
			}
			return $T.format(html,{errDomain:errDomain,sugDomainHtml:sugDomainHtml.join('')});
		},
        /**
         *请求接口失败后的回调函数
         *@inner
         */
        error : function() {
            this.isWaiting = false;
        }
    }));
})(jQuery, Backbone, _, M139);
