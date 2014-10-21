/**
 * [web sdk]
 * version 1.0
 * @param  {[type]} win [description]
 * @param  {[type]} doc [description]
 * @return {[type]}     [description]
 * 
 * 对外提供的3个配置参数:
 * 
 * @setStartTime:
 * 
 * 设置起始记录时间(可选)
 * 在页面首部 head中引入如下类型代码，将统计到此文档加载完成至文档对象加载完成时间:
 * @example
 *
	<script type="text/javascript">
    	var _udata = _udata||[];
    	_udata.push( [ "setStartTime" , new Date() ] );
	</script>
 *
 * 假如没有插入此值，依然会统计.文档加载完成至页面元素加载完成直接的时延
 * 这个值是去除页面文档加载完成时间的值，相对时间将小于引入代码时间
 * 
 * @setAccount:
 *  
 * 设置用户账户(可选)
 * @example
 * 
 * 		_udata.push( [ "setAccount" , "xxxx@139.com" ] );
 * 调用此值后，会在此域当次会话(直到用户关闭浏览器后)中的所有行为采集里带上这个值a:"xxxx@139.com" 
 * 
 * @setAutoPageView:
 *设置是否自动采集PV(可选)
 * @example
 *
	<script type="text/javascript">
    	var _udata = _udata||[];
    	_udata.push( [ "setStartTime" , new Date() ] );
    	_udata.push( [ "setAutoPageView" , false ] );
	</script>
 *
 *  这个配置值需要在脚本加载前配置，与时间设置放到一起。否则将失效
 * 
 * 两个接口函数:
 * @sendPageInfo:
 * 手动发送PV统计
 * @example
 * 	_udata.push( [ "sendPageView" ] );
 * 
 * @sendEvent
 * 发送自定义事件
 *  _udata.push( [ "sendEvent" , "eventName" , "label"  ] ); //这句应该是错的
 *  _udata.sendEvent(eventName,label); //内部修改了_udata对象.用来发送自定义事件
 * 
 * @setAutoCollectClick:
 * 是否自动收集点击事件并上报(注,仅收集a标签的点击,包括a标签内的元素), 初始化传入有效
 * _udata.push(['setAutoCollectClick',true]);
 *  
 * @sendClick:
 * 发送点击事件(如果点击的标签不是A,则可以通过此自定义方法快速上报)
 * 此方法为埋点方法,不可在初始化时调用
 * _udata.sendClick(e); 
 * 
 */
(function (win, doc, $) {

    var PROTOCOL = (("https:" == doc.location.protocol) ? " https://" : " http://"),
        URL = PROTOCOL + "appmail.mail.10086.cn/mw2/weather/statis.png?", // 发送请求接口
        // JS_URL =  PROTOCOL + "www.mylab.com/cgi-bin/jsonp.py?" ,
        // jsonp方式发送则需要此变量，同时放开下面sendJsonp方法
        UACCOUNT = 'udata_account',
        APPID = "web", //应用ID (标准版,酷版等等), (@id@), web, wap, ipad???
        AUTO = true, //@type {[boolean]} true | false 是否自动采集
        UID = "udata_lt_" + APPID, // 前端初始化控制cookie键值
        C = "", //服务端与COOKIE对应的验证串, @checkStr@
        ACCOUNT,
        USESSION = "udata_s_" + APPID, //前端会话cookie键值
        AUTO_COLLECT = false, //是否自动收集上报点击事件
        JS_VERSION = "1.0"; //js版本号

    var config = {
        _st: new Date(),
        setStartTime: function (d) {
            this._st = d;
        },
        getStartTime: function () {
            return this._st.getTime();
        },
        setAutoPageView: function (arg) {
            AUTO = arg;
        },
        setAccount: function (arg) {
            ACCOUNT = arg;
            if (hmt) {
                hmt.cookieHandle.setCookie("udata_account_" + APPID, arg);
            }
        },
        setAutoCollectClick: function (args) {
            AUTO_COLLECT = !!args;
        }
    };

    if (win._udata) {
        for (var i = 0 ; i < win._udata.length ;) {
            if (config[win._udata[i][0]]) {
                config[win._udata[i][0]](win._udata[i][1]);
                win._udata.splice(i, i + 1);
            } else {
                ++i;
            }
        }
    }

    var begin = new Date().getTime(); //起始时间
    var ms = null; //页面加载时间

    /**
     * [getGuidGenerator GUID生成器]
     * @return {[string]} [description]
     */
    function getGuidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    var Util = {
        EventHandler: {
            addEvent: (function (doc) {
                if (doc.addEventListener) {
                    return function (el, type, handler) {
                        return el.addEventListener(type, handler);
                    };
                }
                if (doc.attachEvent) {
                    return function (el, type, handler) {
                        return el.attachEvent("on" + type, handler);
                    }
                }
            })(doc)
        },
        Dom: {
            /**
             * 需要监听自动上报的元素标签,目前只监听了A标签
             */
            listenDomTypes: {
                "a": true //暂时只监听A标签的点击
            },
            /**
             * 获取点击对象的唯一ID
             * 获取顺序: id>name>data-eid
             * 如果以上顺序获取失败,则获取parentNode对象,并重新根据上面的逻辑获取,直到获取成功
             * 如果遍历到body后仍未能获取得到,则返回空字符串
             */
            getSelector: function (elem, selector) {
                if (!elem) return ''; //容错

                var key = elem.getAttribute('id') || elem.getAttribute('name') || elem.getAttribute('data-eid');

                selector = selector || []; //容错

                if (key) {
                    key = elem.nodeName + '#' + key;
                    if (selector.length > 0) {
                        key += ' ' + selector.join('>');
                    }
                    return key; //DIV#logout
                } else {
                    if (elem == document.body) {
                        key = document.body.nodeName;
                        //遍历到当前页面的最顶层了
                        if (selector.length > 0) {
                            key += ' ' + selector.join('>');
                        }
                        return key; //body div>div>p>span>img
                    }

                    selector.unshift(elem.nodeName); //元素结构压入数组
                    return Util.Dom.getSelector(elem.parentNode, selector);
                }
            },
            /**
             * 点击的元素是否为监听的标签类型
             */
            isListenDomType: function (elem) {
                if (!elem) return false; //容错

                var nodeName = elem.nodeName;

                if (this.listenDomTypes[nodeName.toLowerCase()]) {
                    return true; //只监听a标签的点击,其他的都需要主动上报
                }

                if (nodeName != document.body.nodeName) {
                    return Util.Dom.isListenDomType(elem.parentNode);
                }

                return false;
            }
        },
        Event: {
            /**
             * 是否已经上报过
             */
            isReported: function (e) {
                if (!e) return false;
                return e._analyzed || (e.originalEvent && e.originalEvent._analyzed);
            },
            /**
             * 标记为已上报,同一事件不再上报,以免重复
             */
            markAsReported: function (e) {
                if (!e) return;

                e._analyzed = true;
                e.originalEvent = e.originalEvent || {}; //兼容jq
                e.originalEvent._analyzed = true;
            }
        }
    };

    var hmt = {
        /**
	     * [setArgs description]
	     * @param {[type]} params [description]
	     * u uid 用户唯一标识
	     * a ACCOUNT  用户账户
	     * h 窗体高度
	     * w 窗体宽度
	     * ct 时间戳
	     * f 接口代号 : 1{初始化接口} , 2{自动采集页面行为接口} , 3{自定义事件接口}
	     */
        request: {
            /**
             * [setArgs 设置查询参数]
             * @param {[object]} params [description]
             */
            setArgs: function (params) {
                var result = "", p;
                for (p in params) {
                    if (params.hasOwnProperty(p)) {
                        result += encodeURIComponent(p) + "=" + encodeURIComponent(params[p]) + "&";
                    }
                }
                result += 'rnd=' + Math.random();
                this.args = result;
                //this.args = result.slice(0, -1);
            },
            /**
             * [send 单向通信发送]
             * @param  {[object]} params [description]
             */
            send: function (params) {
                if (params) {
                    this.setArgs(params);
                }
                var img = new Image();
                img.src = URL + this.args;
                img.style.height = "0px";
                doc.body.appendChild(img);
                img.onerror = function () {
                    doc.body.removeChild(img);
                };
                img.onload = function () {
                    doc.body.removeChild(img);
                };
            },
            /**
             * [sendJsonp JSONP方式请求发送]
             * @param  {[object]} params [description]
             
            sendJsonp : function( params ){
                if(params){
                    this.setArgs( params );
                }
                var sc = doc.createElement("SCRIPT");
                sc.src = JS_URL + this.args;
                doc.body.appendChild( sc );
                sc.onload = function(){
                    doc.body.removeChild( sc );
                }
            },*/
            /**
             * [sendEvent 发送自定义事件,对外提供的接口函数]
             * @param  {[string]} eventName [事件名称 et]
             * @param  {[string]} label     [事件标签 lv]
             */
            sendEvent: function (eventName, label) {
                var lv = label;
                if (arguments.length < 2) {
                    return;
                }

                //支持接收对象
                if (typeof label == 'object') {
                    lv = '';
                    for (var key in label) {
                        lv += key + '=' + label[key] + '&';
                    }
                    lv = lv.slice(0, -1);
                }

                this.sendBase({
                    et: eventName || "",
                    lv: lv || "",
                    f: 3,
                    cp: doc.location.href
                });
            },
            /**
             * [sendBase 发送必须参数]
             * @param  {[object]} params [description]
             */
            sendBase: function (params) {
                var u_size = UserAgent.getSize();

                var sessionId = hmt.cookieHandle.getCookie(USESSION);
                if (!sessionId) {
                    //bugfix: 某浏览器未初始化直接进入到了f=2的步骤
                    if (win.navigator.cookieEnabled) {
                        hmt.cookieHandle.setCookie(USESSION, getGuidGenerator());
                    } else {
                        //禁用了Cookie , 停止上报
                        return;
                    }

                    sessionId = hmt.cookieHandle.getCookie(USESSION);
                }

                var default_params = {
                    h: u_size.height,
                    w: u_size.width,
                    ct: new Date().getTime(),
                    si: APPID,
                    cu: doc.location.host,
                    v: JS_VERSION,
                    s: sessionId,
                    f: 1,
                    c: C
                };
                if (ACCOUNT) {
                    default_params.a = ACCOUNT;
                }
                for (var p in params) {
                    if (params.hasOwnProperty(p)) {
                        default_params[p] = params[p];
                    }
                }
                this.send(default_params);
            }
        },
        cookieHandle: {
            getCookie: function (name) {
                name = encodeURIComponent(name);
                var k = doc.cookie.split(";"),
                    l = k.length,
                    i = 0;
                for (i ; i < l ; ++i) {
                    if (k[i] && (k[i].split("=")[0].replace(/\s/g, "") === name)) {
                        return decodeURIComponent(k[i].split("=")[1]);
                    }
                }
                return null;
            },
            setCookie: function (name, val, expires) {
                if (expires) {
                    exp = "expires=" + expires.toGMTString() + ";";
                } else {
                    exp = "";
                }
                doc.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(val) + ";path=/;" + exp;
            }
        }
    };

    /**
	 * 
	 */
    if (ACCOUNT) {
        hmt.cookieHandle.setCookie("udata_account_" + APPID, ACCOUNT);
    } else {
        ACCOUNT = hmt.cookieHandle.getCookie("udata_account_" + APPID);
    }

    /**
	 * [UserAgent 用户代理对象]
	 * @type {Object}
	 * @getSize [获取客户端窗体宽高]
	 */
    var UserAgent = {
        getSize: function () {
            var pageWidth = win.innerWidth,
				pageHeight = win.innerHeight;

            if (typeof pageWidth !== "number") {
                if (doc.compatMode === "CSS1Compat") {
                    pageWidth = doc.documentElement.clientWidth;
                    pageHeight = doc.documentElement.clientHeight;
                } else {
                    pageWidth = doc.body.clientWidth;
                    pageHeight = doc.body.clientHeight;
                }
            }
            return {
                width: pageWidth,
                height: pageHeight
            };
        },

        getScreenSize: function () {
            var screen = win.screen || {};
            return {
                width: screen.width || 0,
                height: screen.height || 0
            }
        }
    };

    /**
	 * [Progress 流程对象]
	 * @type {Object}
	 * 
	 * @initApp 初始化流程
	 *
	 * @autoCollection 自动化收集流程
	 * 
	 */
    var Progress = {
        initApp: function () {
            var dd = new Date();
            if (!hmt.cookieHandle.getCookie(USESSION)) {
                hmt.cookieHandle.setCookie(USESSION, getGuidGenerator());
            }

            //udata_account由前端输出......理解错需求了么?
            if (!hmt.cookieHandle.getCookie(UACCOUNT)) {
                var expires = new Date();
                expires.setFullYear(expires.getFullYear() + 1); //udata_account有效期为一年,用于标记独立用户
                hmt.cookieHandle.setCookie(UACCOUNT, getGuidGenerator(), expires);
            }

            if (!hmt.cookieHandle.getCookie(UID)) {
                var d = new Date(),
				 	//u_size = UserAgent.getSize(),
                    s_size = UserAgent.getScreenSize(),
                    lv = "scr=" + s_size.width + 'x' + s_size.height; //第一次,上报分辨率
                d.setHours(24);
                d.setMinutes(0);
                d.setSeconds(0);
                hmt.cookieHandle.setCookie(UID, getGuidGenerator(), d);
                /**
                 * [初始化终端信息采集]
                 * @type {String}
                 */
                hmt.request.sendBase({
                    lv: lv, //第一次提交屏幕分辨率
                    f: 1
                });
            }
        },
        autoCollection: function (params) {
            if (!params) {
                params = {};
            }
            /**
			 * [params description]
			 * @st {[type]} 1自动上报 | 2主动上报
			 */
            if (typeof params === "string") {
                var start = config.getStartTime();
                params = {
                    cp: params,
                    st: 2,
                    t: new Date().getTime() - start
                };
            } else {
                params.st = 1;
            }

            hmt.request.sendBase({
                cp: params.cp || doc.location.href,
                fp: params.fp || doc.referrer,
                t: params.t || ms,
                st: params.st,
                f: 2
            });
        }
    };

    /**
	 * [进入页面当DOM渲染完成，立即发送初始化检测]
	 * @return {[type]} [description]
	 * 
	 */
    var init_data = win._udata;

    Util.EventHandler.addEvent(doc, "readystatechange", (function () {
        var called = false;
        return function () {
            if (!called) {
                called = true;
                /**
				 * 页面初始化信息采集
				 */

                if (win.navigator.cookieEnabled) {
                    Progress.initApp();
                }

                /**
				 * 自定义事件接口提供
				 */
                win._udata = {};
                /**
				 * [SendEvent 事件发送]
				 * @param {[type]} eventName [description]
				 * @param {[type]} label     [description]
				 */
                win._udata.sendEvent = function (eventName, label) {
                    hmt.request.sendEvent(eventName, label);
                };

                /**
                 * 发送自定义的点击事件
                 */
                win._udata.sendClick = function (e) {
                    if (Util.Event.isReported(e)) return; //发送过了(比如命中了自动上报规则)

                    win._udata.sendEvent('ck', {
                        el: Util.Dom.getSelector(e.target || e.srcElement),
                        cx: e.clientX, //坐标
                        cy: e.clientY
                    });

                    Util.Event.markAsReported(e);
                }
                /**
				 * [sendAuto 手动操作自动收集流程]
				 * 注:当需要手动发送自动收集流程时，需要设置值 @AUTO 为 false
				 * @param  {[type]} cp [当前页]
				 * @param  {[type]} fp [来源页]
				 * @return {[type]}    [description]
				 */
                win._udata.sendPageInfo = function (params) {
                    if (!AUTO) {
                        Progress.autoCollection(params);
                    }
                    if (params === "sender") {
                        Progress.autoCollection(this);
                    }
                };
                /**
				 * [push description]
				 * @return {[type]} [description]
				 */
                win._udata.push = function (arr) {
                    if (arr instanceof Array) {
                        var fn = arr.splice(0, 1);
                    }
                    if (!this[fn]) {
                        return;
                    }
                    this[fn](arr[0], arr[1]);
                };

                /**
				win._udata._fetch = function(){
					var ifs = doc.getElementsByTagName("IFRAME") ,
						frs = doc.getElementsByTagName("FRAME"),
						i = 0 ;

						for(;i < ifs.length ; ++i ){
							if( !ifs[i].contentWindow.__udata_sub__ ){
								ifs[i].contentWindow.__udata_sub__ = true;
								ifs[i].contentWindow._udata._sendSelf();
							}
						} 
						for( i = 0 ; i < frs.length ; ++ i ){
							if( !frs[i].contentWindow.__udata_sub__ ){
								frs[i].contentWindow.__udata_sub__ = true;
								frs[i].contentWindow._udata._sendSelf();
							}							
						}
				};
				win._udata._sendSelf = function(){
					win.top._udata.SendPageInfo.apply({ cp : doc.location.href , fp : doc.referrer , t : ms },["sender"]);
				};
				**/
            }
        }
    })());

    Util.EventHandler.addEvent(win, "load", function () {
        var end = new Date().getTime();
        var start = config.getStartTime();
        ms = end - start;
        if (!win.navigator.cookieEnabled) {
            return;
        }
        /**
         * 自动采集信息部分
         */
        if (AUTO) {
            Progress.autoCollection();
        }

        if (init_data) {
            var k = 0;
            for (; k < init_data.length ; ++k) {
                win._udata.push(init_data[k]);
            }
        }
    });

    /**
     * 上报用户点击的事件
     * 主要目的在于统计用户的行为,以及产品活跃
     */
    if (AUTO_COLLECT && win.navigator.cookieEnabled) { //自动收集点击事件
        Util.EventHandler.addEvent(doc, 'click', function (e) {
            try{
                //只上报监听了的元素,如果阻止了冒泡.那没办法...
                if (Util.Dom.isListenDomType(e.target || e.srcElement)) {
                    //发送过了(比如命中了自动上报规则)
                    if (Util.Event.isReported(e)) return;

                    win._udata.sendEvent('ck', {
                        el: Util.Dom.getSelector(e.target || e.srcElement),
                        cx: e.clientX, //坐标
                        cy: e.clientY
                    });

                    Util.Event.markAsReported(e);
                }
            } catch (e) {

            }
        });
    }

})(window, document, window.jQuery);


