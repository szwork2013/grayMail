/**
 * 页面跳转类，默认调用无样式
 * <pre>示例：<br>
 * PageTurnner(10,1);
 * </pre>
 * @param {int} pageCount 必选参数，总页数。
 * @param {int} pageIndex 必选参数，当前页。
 * @retrun {无返回值}
 */
function PageTurnner(pageCount, pageIndex) {
    var thePageTurnner = this;
    this.pageIndex = pageIndex;

    this.fristPage = function() {
        this.turnPage(1);
    };
    this.lastPage = function() {
        this.turnPage(pageCount);
    };
    this.nextPage = function() {
        this.turnPage(thePageTurnner.pageIndex + 1);
    };
    this.previousPage = function() {
        this.turnPage(thePageTurnner.pageIndex - 1);
    };
    this.turnPage = function(index) {
        if (index < 1 || index > pageCount || index == this.pageIndex) return;
        this.pageIndex = index;
        this.callPageChangeHandler(index);
    };
    this.pageChangeHandlers = [];
    this.addPageChangeListener = function(handler) {
        this.pageChangeHandlers.push(handler);
    };
    this.callPageChangeHandler = function(pageIndex) {
        for (var i = 0; i < this.pageChangeHandlers.length; i++) {
            this.pageChangeHandlers[i](pageIndex);
        }
    };
}
/**
 * 创建带有样式的页面跳转组件
 * <pre>示例：<br>
 * <br>PageTurnner.createStyleNew(10,1,"containerId",function(){doing...});
 * </pre>
 * @param {int} pageCount 必选参数，总页数。
 * @param {int} pageIndex 必选参数，当前页。
 * @param {Object} containerId 必选参数，跳转组件容器.ID或DOM对象。
 * @param {function} callback 必选参数，回调函数。
 * @return {无返回值}
 */
PageTurnner.createStyleNew = function(pageCount, pageIndex, containerId, callback) {
    var container = Utils.isString(containerId) ? document.getElementById("containerId") : containerId;
    var obj = $("#ulPageTurner").css("marginTop","-5px");	
    if (obj.length == 0) {
        obj = $("<ul class='toolBar139_main' id='ulPageTurner' style='float:right;margin-right:10px; margin-top:-5px;'></ul>").appendTo(container.parentNode.parentNode);
    }
    obj.html("");
    btnPrevious = SimpleMenuButton.create({
    	text:"上一页",
    	click:function(){
    		thePageTurnner.previousPage(); 
    		return false;
    	}
    });
    btnNext = SimpleMenuButton.create({
    	text:"下一页",
    	click:function(){
    		thePageTurnner.nextPage(); 
    		return false;
    	}
    });
    //第x页
    var pageMenuItem = [];
    var renderPages = Math.min(pageCount, 300);
    for (var i = 1; i <= renderPages; i++) {
    	pageMenuItem.push({
    		text:i + "/" + pageCount + "页",
    		data:i
    	});
    }
    btnTurnPage = SimpleMenuButton.create({
    	text:"$page$",
    	menu:pageMenuItem,
		css : true,
    	itemClick:function(data){
    		thePageTurnner.turnPage(parseInt(data));
    	}
    });
    $(btnTurnPage).find("ul").css("left","-50px");
    obj.append(btnPrevious);
    obj.append(btnNext);
    obj.append(btnTurnPage);
    
    var thePageTurnner = new PageTurnner(pageCount, pageIndex);
    SimpleMenuButton.changeButtonText(btnTurnPage,pageIndex + "/" + pageCount + "页");
    thePageTurnner.addPageChangeListener(
        function(index) {
        	SimpleMenuButton.changeButtonText(btnTurnPage,index + "/" + pageCount + "页");
        }
    );
    thePageTurnner.addPageChangeListener(disabledButton);
    thePageTurnner.addPageChangeListener(callback);
    disabledButton(pageIndex);
    function disabledButton(index) {
        setLinkDisabled(btnPrevious, false);
        setLinkDisabled(btnNext, false);
        if (index == 1) {
            setLinkDisabled(btnPrevious, true);
        }
        if (index == pageCount) {
            setLinkDisabled(btnNext, true);
        }
    }
    function setLinkDisabled(link, value) {
        if (value) {
            link.style.display = "none";
        } else {
            link.style.display = "";
        }
    }
}
/**
 * 创建页面跳转组件，可选是否创建样式。
 * <pre>示例：<br>
 * <br>PageTurnner.createStyle(10,1,"containerId",function(){doing...},true);
 * </pre>
 * @param {int} pageCount 必选参数，总页数。
 * @param {int} pageIndex 必选参数，当前页。
 * @param {Object} containerId 必选参数，跳转组件容器.ID或DOM对象。
 * @param {function} callback 必选参数，跳转组件容器.ID或DOM对象。
 * @param {Boolean} newStyle 可选参数，是否创建样式。如：newStyle==true则返回调用createStyleNew函数来创建组件。
 * @return {无返回值}
 */
PageTurnner.createStyle = function(pageCount, pageIndex, containerId, callback, newStyle) {
    if(newStyle)return PageTurnner.createStyleNew(pageCount, pageIndex, containerId, callback);

    var thePageTurnner = new PageTurnner(pageCount, pageIndex);
    var btnNext = createLink("下一页");
    var btnPrevious = createLink("上一页");
    var btnFrist = createLink("首页");
    var btnLast = createLink("末页");
    function createLink(text) {
        var a = document.createElement("a");
        a.innerHTML = text;
        a.href = "javascript:void(0)";
        return a;
    }
    btnFrist.onclick = function() { thePageTurnner.fristPage(); this.blur(); return false; };
    btnPrevious.onclick = function() { thePageTurnner.previousPage(); this.blur(); return false; };
    btnNext.onclick = function() { thePageTurnner.nextPage(); this.blur(); return false; };
    btnLast.onclick = function() { thePageTurnner.lastPage(); this.blur(); return false; };
    var select = document.createElement("select");
    for (var i = 1; i <= pageCount; i++) {
        var item = new Option(i.toString() + "/" + pageCount + "页", i);
        select.options.add(item);
        if (i == pageIndex) {
            item.selected = true;
        }
    }
    select.onchange = function() { thePageTurnner.turnPage(this.selectedIndex + 1); };
    thePageTurnner.addPageChangeListener(
        function(index) {
            select.options[index - 1].selected = true;
        }
    );
    setLinkDisabled(btnFrist, true);
    setLinkDisabled(btnPrevious, true);
    thePageTurnner.addPageChangeListener(disabledButton);
    thePageTurnner.addPageChangeListener(callback);
    var container;
    if (typeof (containerId) == "string") {
        container = document.getElementById(containerId);
    } else {
        container = containerId;
    }
    //container.appendChild(document.createTextNode("[ "));
    container.appendChild(btnPrevious);
    container.appendChild(document.createTextNode(" "));
    container.appendChild(btnNext);
    container.appendChild(document.createTextNode(" "));
    container.appendChild(select);

    disabledButton(pageIndex);
    function disabledButton(index) {
        setLinkDisabled(btnFrist, false);
        setLinkDisabled(btnPrevious, false);
        setLinkDisabled(btnNext, false);
        setLinkDisabled(btnLast, false);
        if (index == 1) {
            setLinkDisabled(btnFrist, true);
            setLinkDisabled(btnPrevious, true);
        }
        if (index == pageCount) {
            setLinkDisabled(btnNext, true);
            setLinkDisabled(btnLast, true);
        }
    }
    function setLinkDisabled(link, value) {
        if (value) {
            //link.style.color="silver";
            link.style.display = "none";
        } else {
            //link.style.color="";
            link.style.display = "";
        }
    }
};