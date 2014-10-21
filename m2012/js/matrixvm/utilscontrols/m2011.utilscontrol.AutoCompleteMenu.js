/**
 * 自动完成菜单类
 * <pre>示例：<br>
 * <br>AutoCompleteMenu(document.getElementById("inputText"),inputCallback(),itemClickHandler());
 * </pre>
 * @param {Object} host 必选参数，宿主对象，如：文本框。
 * @param {Object} inputCallback 必选参数，输入框改变回调函数。
 * @param {Object} itemClickHandler 必选参数，搜索出的下拉列表点击回调函数。
 * @return {无返回值}
 */
function AutoCompleteMenu(host,inputCallback,itemClickHandler) 
{
    var This = this;
    var key = {
        up: 38,
        down: 40,
        enter: 13,
        space: 32,
        tab: 9,
        left: 37,
        right: 39
    };
    var isIE9 = top.$.browser.msie && top.$.browser.version > 8;
    var isShow = false;
    var doc = host.ownerDocument;
    var itemFocusColor = "#3399FE";
    var menuCSSText = "position:absolute;z-index:101;display:none;border:1px solid #99ba9f;height:200px;overflow:auto;overflow-x:hidden;background:white";
    var itemCSSText = "width:100%;line-height:20px;text-indent:3px;cursor:pointer;display:block;";
    var bgIframe = doc.createElement("iframe");
    with (bgIframe.style) {
        position = "absolute";
        zIndex = 100;
        display = "none";
    }
    var items = [];
    var container = doc.createElement("div");
    container.onclick = function(e) {
        Utils.stopEvent(e);
    }
    container.onmousedown = function(e) {
        Utils.stopEvent(e);
    }
    if (document.all) {
        $(document).click(hide);
    }
    function clear() {
        items.length = 0;
        container.innerHTML = "";
    }
    this.addItem = function(value, title) {
        if (typeof value == "object") {
            var span = value;
        } else {
            var span = doc.createElement("span");
            span.value = value;
            span.innerHTML = title;
        }
        if (document.all) {
            span.style.cssText = itemCSSText;
        } else {
            span.setAttribute("style", itemCSSText);
        }

        span.onmousedown = function() {
            itemClickHandler(this);
            hide();
            var key = host.getAttribute("setvaluehandler");
            if (key && window[key]) {
                window[key]();
            }
        }
        span.onmouseover = function() { selectItem(this); }
        span.menu = this;
        span.selected = false;
        items.push(span);
        container.appendChild(span);
    }
    function getSelectedItem() {
        var index = getSelectedIndex();
        if (index >= 0) return items[index];
        return null;
    }
    function getSelectedIndex() {
        for (var i = 0; i < items.length; i++) {
            if (items[i].selected) return i;
        }
        return -1;
    }
    //设置选中行
    function selectItem(item) {
        var last = getSelectedItem();
        if (last != null) blurItem(last);
        item.selected = true;
        item.style.backgroundColor = itemFocusColor;
        item.style.color = "white";
        menuScroll(item, container); //如果选中的项被遮挡的话则滚动滚动条
        function menuScroll(element, container) {
            var elementView = {
                //top:      element.offsetTop,这样写ff居然跟ie的值不一样
                top: getSelectedIndex() * element.offsetHeight,
                bottom: element.offsetTop + element.offsetHeight
            };
            var containerView = {
                top: container.scrollTop,
                bottom: container.scrollTop + container.offsetHeight
            };
            if (containerView.top > elementView.top) {
                container.scrollTop -= containerView.top - elementView.top;

            } else if (containerView.bottom < elementView.bottom) {
                container.scrollTop += elementView.bottom - containerView.bottom;
            }
        }
    }
    //子项失去焦点
    function blurItem(item) {
        item.selected = false;
        item.style.backgroundColor = "";
        item.style.color = "";
    }
    function show() {
        if (isShow) return;
        if (container.parentNode != doc.body) {
            doc.body.appendChild(container);
            doc.body.appendChild(bgIframe);
        }
        with (container.style) {
            //Utils.offsetHost(host, container);
            display = "block";
            width = Math.max(host.offsetWidth,400) + "px";
            Utils.offsetHost(host, container);  //为了能获取到container的宽度，放置此
            if (items.length < 7) {
                height = items[0].offsetHeight * items.length + 10 + "px";
            } else {
                height = items[0].offsetHeight * 7 + "px";
            }
        }
        var showBGIframe = false;
        if(document.all && !isIE9)showBGIframe = true;
        if(navigator.userAgent.indexOf("Chrome")>0){
            showBGIframe = true;
        }
        with (bgIframe.style) {
            left = container.style.left;
            top = container.style.top;
            width = Math.max(0, container.offsetWidth - 3) + "px";
            height = Math.max(0,container.offsetHeight - 3) + "px";
            if (showBGIframe) display = "";
        }
        selectItem(items[0]); //显示的时候选中第一项
        isShow = true;
    }
    function hide() {
        if (!isShow) return;
        container.style.display = "none";
        bgIframe.style.display = "none";
        clear();
        isShow = false;
    }
    if (document.all) {
        container.style.cssText = menuCSSText;
        host.attachEvent("onkeyup", host_onkeyup);
        host.attachEvent("onblur", host_onblur);
        host.attachEvent("onkeydown", host_onkeydown);
    } else {
        container.setAttribute("style", menuCSSText);
        host.addEventListener("keyup", host_onkeyup, true);
        host.addEventListener("blur", host_onblur, true);
        host.addEventListener("keydown", host_onkeydown, true);
    }
    //优化使用输入法无法捕获输入事件时，用计时器监听
    var listenTextChangeTimer = setInterval(function(){
        try{
            if(host.value && host.getAttribute("last_handler_value") != host.value){
                host_onkeyup({});
            }
        }catch(e){
            clearInterval(listenTextChangeTimer);
        }
    },1000);

    function host_onkeyup(evt) {
        switch ((evt || event).keyCode) {
            case key.enter:
            case key.up:
            case key.down:
            case key.left:
            case key.right: return;
        }
        hide();

        host.setAttribute("last_handler_value",host.value);

        inputCallback(This, evt || event);
        if (items.length > 0) show();
    }
    function host_onblur() {
        if (!document.all) hide();
    }
    function host_onkeydown(evt) {
        evt = evt || event;
        switch (evt.keyCode) {
            case key.space:
            case key.tab:
            case key.enter: doEnter(); break;
            case key.up: doUp(); break;
            case key.down: doDown(); break;
            case key.right:
            case key.left: hide(); break;
            default: return;
        }
        function doEnter() {
            var item = getSelectedItem();
            if (item != null) item.onmousedown();
            if (evt.keyCode == key.enter) {
                Utils.stopEvent(evt);
            }
        }
        function doUp() {
            var index = getSelectedIndex();
            if (index >= 0) {
                index--;
                index = index < 0 ? index + items.length : index;
                selectItem(items[index]);
            }
        }
        function doDown() {
            var index = getSelectedIndex();
            if (index >= 0) {
                index = (index + 1) % items.length;
                selectItem(items[index]);
            }
        }
    }
}


AutoCompleteMenu.createAddrMenu_compose = function(host, userAllEmailText) {}
AutoCompleteMenu.createAddrMenu = function(host, userAllEmailText, dataSource, splitLetter) {
    if (typeof userAllEmailText == "undefined") {
        userAllEmailText = true;
    }
    splitLetter = splitLetter || ";";
    var getMailReg = /^([^@]+)@(.+)$/
    var getInput = /(?:[;,；，]|^)\s*([^;,；，\s]+)$/;
    function autoLinkMan(menu) {
        var match = host.value.match(getInput);
        if (!match) return false;
        var txt = match[1].trim().toLowerCase();
        if (txt == "") return false;
        try {
            if (Utils.isChinaMobileNumber(txt) && txt.length == 11) {
                host.value = host.value.replace(/([;,；，]|^)\s*([^;,；，\s]+)$/, "$1" + txt + "@139.com;");
                return;
            }
        } catch (e) { }
        var inputLength = txt.length;
        var items = top.M2012.Contacts.getModel().getInputMatch({
            keyword: txt,
            filter: "email"
        });
        for (var i = 0; i < items.length; i++) {
            var matchInfo = items[i];
            var obj = matchInfo.info;
            var value = userAllEmailText ? "\"" + obj.name.replace(/\"/g, "") + "\"<" + obj.addr + ">" : obj.addr;
            var addrText = "";
            if (matchInfo.matchAttr == "addr") {
                matchText = obj.addr.substring(matchInfo.matchIndex, matchInfo.matchIndex + inputLength);
                addrText = obj.addr.replace(matchText, "[b]" + matchText + "[/b]");
                addrText = "\"" + obj.name.replace(/\"/g, "") + "\"<" + addrText + ">";
                addrText = addrText.encode().replace("[b]", "<span style='font-weight:bold'>").replace("[/b]", "</span>");
            } else if (matchInfo.matchAttr == "name") {
                matchText = obj.name.substring(matchInfo.matchIndex, matchInfo.matchIndex + inputLength);
                addrText = obj.name.replace(matchText, "[b]" + matchText + "[/b]");
                addrText = "\"" + addrText.replace(/\"/g, "") + "\"<" + obj.addr + ">";
                addrText = addrText.encode().replace("[b]", "<span style='font-weight:bold'>").replace("[/b]", "</span>");
            } else {
                addrText = "\"" + obj.name.replace(/\"/g, "") + "\"<" + obj.addr + ">";
                addrText = addrText.encode();
            }
            menu.addItem(value, addrText);
        }
    }
    if(!host.getAttribute("backspacedeleteoff")){
        $(host).keydown(function(e) {
            if (e.keyCode == 8 && !e.ctrlKey && !e.shiftKey) {
                var p = getTextBoxPos(this);
                if (!p || p.start != p.end || p.start == 0 || p.start < this.value.length) return;
                var lastValue = this.value;
                var deleteChar = lastValue.charAt(p.start - 1);
                if (/[;,；，>]/.test(deleteChar)) {
                    var leftText = lastValue.substring(0, p.start);
                    var rightText = lastValue.substring(p.start, lastValue.length);
                    var cutLeft = leftText.replace(/(^|[;,；，])[^;,；，]+[;,；，>]$/, "$1$1");
                    this.value = cutLeft + rightText;
                }
            }
        });
    }
    function isRepeat(arr, item) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (item.id && item.id == arr[i].id) return true;
        }
        return false;
    }
    function linkManItemClickHandler(item) {
        host.value = host.getAttribute('last_handler_value');
        host.value = host.value.replace(/；/g, ";").replace(/，/g, ",");
        host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value + splitLetter);
    }
    init();
    function init() {
        new AutoCompleteMenu(host, autoLinkMan, linkManItemClickHandler);
    }
}

function getTextBoxPos(textBox) {
    var start = 0;
    var end = 0;
    if (typeof (textBox.selectionStart) == "number") {
        start = textBox.selectionStart;
        end = textBox.selectionEnd;
    }
    else if (document.selection) {
        textBox.focus();
        var workRange = document.selection.createRange();
        var selectLen = workRange.text.length;
        if (selectLen > 0) return null;
        textBox.select();
        var allRange = document.selection.createRange();
        workRange.setEndPoint("StartToStart", allRange);
        var len = workRange.text.length;
        workRange.collapse(false);
        workRange.select();
        start = len;
        end = start + selectLen;
    }
    return { start: start, end: end };
}

/**
 * 创建产生后后缀的工菜单
 * <pre>示例：<br>
 * <br>AutoCompleteMenu.createPostfix(document.getElementById("inputText"));
 * </pre>
 * @param {Object} host 必选参数，文本框。
 * @return{无返回值}
 */

AutoCompleteMenu.createPostfix = function(host) {
    new AutoCompleteMenu(
		host,
		function(menu) {
		    var arr = ["@sina.com", "@sohu.com", "@21cn.com", "@tom.com", "@yahoo.com.cn", "@yahoo.cn"];
		    var txt = host.value;
		    if ($.trim(txt) == "") return;
		    var match = txt.match(/\w+(@[\w.]*)/);
		    for (var i = 0; i < arr.length; i++) {
		        if (match) {
		            if (arr[i].indexOf(match[1]) == 0 && arr[i] != match[1]) {
		                var value = txt.match(/^([^@]*)@/)[1];
		                menu.addItem(value + arr[i], value + arr[i]);
		            }
		        } else {
		            menu.addItem(txt + arr[i], txt + arr[i]);
		        }
		    }
		},
		function(item) {
		    host.value = item.value;
		}
	)
}

/**
 * 包装自动完成菜单实例,从集合中找出联系人然后显示手机菜单
 * <pre>示例：<br>
 * <br>AutoCompleteMenu.createPhoneNumberMenuFromLinkManList(document.getElementById("inputText"),"张三",["张三","李四"])
 * @param {Object} host 必选参数，文本框。
 * @param {string} withAddrName 必选参数，联系人。
 * @param {Object} data 必选参数，联系人集合。
 * @return {自动完成菜单实例}
 */

AutoCompleteMenu.createPhoneNumberMenuFromLinkManList = function (host, withAddrName, data) {
    var regMatchPhoneNumber = /(?:^|[;,])\s*([^;,]+)$/;
    var randomName = "randomName" + Math.random();//生成一个用于缓存数据的随机变量名
    function textChanged(menu) {
        var match = host.value.match(regMatchPhoneNumber);
        var inputNumber = "";
        if (match) {
            inputNumber = match[1].toLowerCase();
        } else {
            return false;
        }
        var matchedCount = 0;

        var items = top.M2012.Contacts.getModel().getInputMatch({
            keyword: inputNumber,
            filter: "mobile"
        });

        var mapForRep = {}; //用来排除重复的哈希表

        for (var i = 0, j = items.length; i < j; i++) {
            var theinfo = items[i].info;

            var num = theinfo.addr.replace(/\D/g, "");
            var pname = theinfo.name.replace(/[<>"']/g, "");
            var nameIndex;

            if (num.indexOf(inputNumber) >= 0) {
                var str = num.replace(inputNumber, "<span style='color:Red'>" + inputNumber + "</span>")
                if (pname) str = "\"" + pname + "\"<" + str + ">";
                if (withAddrName) {
                    addMenuItem("\"" + pname + "\"<" + num + ">", str, num);
                } else {
                    addMenuItem(num, str, num);
                }
            } else if ((nameIndex = pname.toLowerCase().indexOf(inputNumber)) >= 0) {
                var _inputNumber = pname.substring(nameIndex, nameIndex + inputNumber.length);
                var str = pname.replace(_inputNumber, "<span style='color:Red'>" + _inputNumber + "</span>")
                if (pname) str = "\"" + str + "\"<" + num + ">";
                if (withAddrName) {
                    addMenuItem("\"" + pname + "\"<" + num + ">", str, num);
                } else {
                    addMenuItem(num, str, num);
                }
            } else if ((theinfo.quanpin && theinfo.quanpin.indexOf(inputNumber) >= 0) || (theinfo.jianpin && theinfo.jianpin.indexOf(inputNumber) >= 0)) {
                var str = "\"" + pname + "\"<" + num + ">";
                if (withAddrName) {
                    addMenuItem(str, str, num);
                } else {
                    addMenuItem(num, str, num);
                }
            }
            if (matchedCount >= 50) break;
        }
        function addMenuItem(value, text, number) {
            if (!mapForRep[number]) {
                menu.addItem(value, text);
                matchedCount++;
                mapForRep[number] = true;
            }
        }
        return !(matchedCount == 0);
    }
    function itemClick(item) {
        host.value = host.getAttribute('last_handler_value');
        host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value + ",");
    }

    new AutoCompleteMenu(host, textChanged, itemClick, withAddrName);

}

/**
 * 包装自动完成菜单实例,根据输入手机号码显示搜索菜单
 * <pre>示例：<br>
 * <br>AutoCompleteMenu.createPhoneNumberMenuForSearchByMobile(document.getElementById("inputText"));
 * </pre>
 * @param {Object} host 必选参数，文本框。
 * @return{自动完成菜单实例}
 */

AutoCompleteMenu.createPhoneNumberMenuForSearchByMobile = function(host) {
    var regMatchPhoneNumber = /(?:^|[;,])\s*(\d+)$/;
    function textChanged(menu) {
        var match = host.value.match(regMatchPhoneNumber);
        var inputNumber = "";
        if (match) {
            inputNumber = match[1];
        } else {
            return false;
        }
        var matchedCount = 0;
        for (var i = 0, j = LinkManList.length; i < j; i++) {
            if (!LinkManList[i].addr) continue;
            var num = LinkManList[i].addr.toString();
            var pname = LinkManList[i].name;
            if (host.value.indexOf(num) >= 0) continue;
            if (num.indexOf(inputNumber) == 0) {
                var str = num.replace(inputNumber, "<span style='color:Red'>" + inputNumber + "</span>")
                if (pname) str = "(" + pname + ")" + str;
                menu.addItem(num, str);
                matchedCount++;
            }
            if (matchedCount >= 50) break;
        }
        return !(matchedCount == 0);
    }
    function itemClick(item) {
        host.value = host.getAttribute('last_handler_value');
        host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value);
    }
    new AutoCompleteMenu(host, textChanged, itemClick);
}

/**
 * 包装自动完成菜单实例,根据输入提示手机号码集合显示搜索菜单
 * <pre>示例：<br>
 * <br>AutoCompleteMenu.createPhoneNumberMenu(document.getElementById("inputText"),手机1,手机2,手机3);
 * </pre>
 * @param {Object} host 必选参数，文本框。
 * @param {array} numbers 必选参数，手机号码数组。
 * @return {自动完成菜单实例}
 */

AutoCompleteMenu.createPhoneNumberMenu = function(host,numbers) {
    var regMatchPhoneNumber = /(?:^|[;,])\s*(\d+)$/;
    function textChanged(menu) {
        var match = host.value.match(regMatchPhoneNumber);
        var inputNumber = "";
        if (match) {
            inputNumber = match[1];
        } else {
            return false;
        }
        var matchedCount = 0;
        for (var i = 0, j = numbers.length; i < j; i++) {
            if (!numbers[i].number) continue;
            var num = numbers[i].number.toString();
            if (host.value.indexOf(num) >= 0) continue;
            if (num.indexOf(inputNumber) == 0) {
                var str = num.replace(inputNumber, "<span style='color:Red'>" + inputNumber + "</span>")
                if (numbers[i].name) str = "(" + numbers[i].name + ")" + str;
                menu.addItem(num, str);
                matchedCount++;
            }
            if (matchedCount >= 50) break;
        }
        return !(matchedCount == 0);
    }
    function itemClick(item) {
        host.value = host.getAttribute('last_handler_value');
        host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value + ",");
    }
    new AutoCompleteMenu(host, textChanged, itemClick);
}
