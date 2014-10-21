/**
 * 图片缩放编辑菜单类
 * <pre>示例：<br>
 * <br>ImgEditorMenu.init(el,pDoc,ImgDoc,ImgEditorMenuBarHtml,options);
 * </pre>
 *@param {obj} el 控制的对象
 *@param {obj} pDoc  控件放置的父对象
 *@param {obj} ImgDoc 图片所在的父对象
 *@param {string} ImgEditorMenuBarHtml  控件html
 *@param {obj} options 可选 控件的配置
 */
ImgEditorMenu = {};

//显示
ImgEditorMenu.show = function(){
    var that = this;
    clearTimeout(that.hideTimer);
    that.slider.attr('title' , that.sliderTitle).css({ 'width':that.sliderLen , 'left':that.sliderLeft });
    that.setOffset();
    that.element.show();
}

//计算浮层的位置
ImgEditorMenu.setOffset = function(){
    var that = this;

    var offset            = that.controlEl.offset();
    var elLeft            = offset.left;
    var elTop             = offset.top;

    var ImgDocScrollLeft  = that.ImgDoc.scrollLeft();
    var ImgDocScrollTop   = that.ImgDoc.scrollTop();

    elLeft                = (elLeft - ImgDocScrollLeft) < 0 ? 0 : (elLeft - ImgDocScrollLeft);
    elTop                 = (elTop - ImgDocScrollTop) < 0 ? 0 : (elTop - ImgDocScrollTop);

    elLeft                = elLeft + that.options.left;
    elTop                 = elTop + that.options.top;

    var pDocScrollLeft    = that.pDoc.scrollLeft();
    var pDocScrollTop     = that.pDoc.scrollTop();

    that.left             = pDocScrollLeft > elLeft ? pDocScrollLeft : elLeft;
    that.top              = pDocScrollTop > elTop ? pDocScrollTop : elTop;
    
    that.element.css({ 'left':that.left , 'top':that.top });
}

//隐藏浮层
ImgEditorMenu.hide = function(delay){
    var that = this;
    if(that.element){
        if(delay){
            that.hideTimer = setTimeout(function(){
                if(that.element){
                    that.element.hide();
                    that.remove();
                }
            },300)
        }else{
            that.element.hide();
            that.remove();
        }
    }
}

//移除浮层
ImgEditorMenu.remove = function(){
    this.element.remove();
    delete this.element;
}

//点击
ImgEditorMenu.click = function(e) {
    var func = e.target.getAttribute("func");
    if (func && ImgEditorMenu[func]) {
        ImgEditorMenu[func](e);
        return false;
    }
}
//点击放大按钮
ImgEditorMenu.zoomout = function(){
    var that = this;
    that.zoomCur--;
    that.zoomCur = that.zoomCur < that.zoomMin ? that.zoomMin : that.zoomCur;
    that.zoommove();
}
//点击缩小按钮
ImgEditorMenu.zoomin = function(){
    var that = this;
    that.zoomCur++;
    that.zoomCur = that.zoomCur > that.zoomMax ? that.zoomMax : that.zoomCur;
    that.zoommove();
}
//1:1 原始尺寸
ImgEditorMenu.zoomratio = function(e){
    var that = this;
    that.zoomCur = that.zoomMax/2;
    $(e.target).removeClass('menubaRatio').addClass('menubarall').attr('title','最佳尺寸').attr('func','zoombarall');
    that.zoommove();
}
//zoombarall 最佳尺寸
ImgEditorMenu.zoombarall = function(e){
    var that = this;
    var bestSize = that.ImgDoc.width();
    var imgW = that.controlElW;
    that.zoomCur = (bestSize/imgW/that.scale)*100;
    that.zoomCur = Math.round(that.zoomCur * 10)/10; //精确到小数点后1位
    that.zoomCur = that.zoomCur > that.zoomMax ? that.zoomMax : that.zoomCur;
    $(e.target).removeClass('menubarall').addClass('menubaRatio').attr('title','原始尺寸').attr('func','zoomratio');
    that.zoommove();
}

ImgEditorMenu.zoommove = function(){
    var that = this;
    that.sliderTitle = that.zoomCur * that.scale + '%';
    that.sliderLeft = (that.zoomCur - that.zoomMin) * that.mark + that.sliderLeftMin;
    that.slider.attr('title',that.sliderTitle).css({'left':that.sliderLeft});
    that.controlEl.attr('sliderTitle',that.sliderTitle).attr('sliderLeft',that.sliderLeft);
    that.controlEl.css({ 'width' : that.zoomCur * that.scale * that.controlElW/100 , 'height': that.zoomCur * that.scale * that.controlElH/100 });
    that.setOffset();
}

ImgEditorMenu.mousedown = function(e){
    var that = ImgEditorMenu;
    var id = e.target.id;
    if(id && id == 'zoomhandle'){
        that.moveStart = true;
        that.startX = e.clientX;
    }
}

ImgEditorMenu.mouseover = function(e){
    var that = ImgEditorMenu;
    clearTimeout(that.hideTimer);
}

ImgEditorMenu.mousemove = function(e){
    var that = ImgEditorMenu;
    if(that.moveStart){
        that.moveX = e.clientX - that.startX;
        that.startX = e.clientX;
        that.move();
    }
}

ImgEditorMenu.mouseup = function(e){
    var that = ImgEditorMenu;
    if(that.moveStart){
        that.moveX = e.clientX - that.startX;
        that.startX = e.clientX;
        that.moveStart = false;
        that.move();
    }
}

ImgEditorMenu.mouseout = function(e){
    var that = ImgEditorMenu;
    if(that.moveStart && (e.clientY < that.top || e.clientY > that.top + that.height)){
        that.moveStart = false;
        that.move();
    }
    that.hide(true);
}

ImgEditorMenu.move = function(){
    var that = this;
    that.sliderLeft = that.sliderLeft + that.moveX;
    if(that.sliderLeft < that.sliderLeftMin){
        that.sliderLeft = that.sliderLeftMin;
    }else if(that.sliderLeft > that.sliderLeftMax){
        that.sliderLeft = that.sliderLeftMax;
    }
    var scaleNum =(that.sliderLeft - that.sliderLeftMin + that.mark ) * that.scalePerPx;
    that.zoomCur = scaleNum/that.scale;
    that.sliderTitle =  scaleNum + '%';
    that.slider.attr('title',that.sliderTitle).css({'left':that.sliderLeft});
    if(!that.moveStart){
        that.controlEl.attr('sliderTitle',that.sliderTitle).attr('sliderLeft',that.sliderLeft);
        that.controlEl.css({'width' : scaleNum * that.controlElW/100, 'height': scaleNum * that.controlElH/100});
        that.setOffset();
    }
}

//删除图片
ImgEditorMenu.del = function(){
    this.hide();
    this.controlEl.remove();
}


ImgEditorMenu.init = function(el,pDoc,ImgDoc,ImgEditorMenuBarHtml,options){
    var that = this;
    that.options = {
        zoomMin: 1,  //最小缩放比例 25%
        zoomMax: 8,  //最大缩放比例 200%
        scale: 25, //
        mark: 10,
        sliderLen: 10,
        top: 0,
        left: 0,
        minWidth: 400,  //图片显示缩放条的最小值
        minHeight: 300
    }
    
    for(i in options) that.options[i] = options[i];

    that.moveStart = false;
    
    that.controlEl     = el;
    that.pDoc          = pDoc;
    that.ImgDoc        = ImgDoc;
    
    that.zoomMax       = that.options.zoomMax;
    that.zoomMin       = that.options.zoomMin;
    that.mark          = that.options.mark;
    that.scale         = that.options.scale;
    that.sliderLen     = that.options.sliderLen;
    
    that.minWidth      = that.options.minWidth;
    that.minHeight     = that.options.minHeight;
    
    that.zoom          = that.zoomMax - that.zoomMin;
    that.slideLen      = that.zoom * that.mark;
    that.scalePerPx    = that.scale / that.mark;
    that.sliderLeftMin = -that.sliderLen/2;
    that.sliderLeftMax = that.slideLen + that.sliderLeftMin;

    that.sliderTitle   = el.attr('sliderTitle') || '100%';                                      //默认为100%
    that.scaleCur      = parseFloat(that.sliderTitle);
    that.scaleCur      = isNaN(that.scaleCur)? 100 : that.scaleCur;
    that.zoomCur       = that.scaleCur/that.scale;
    var sliderLeft     = el.attr('sliderLeft')/1;
    sliderLeft         = isNaN(sliderLeft) ? null : sliderLeft;
    that.sliderLeft    = sliderLeft || (that.zoomCur - that.zoomMin) * that.mark + that.sliderLeftMin;  //滑块位置
    
    that.controlElW    = el.width()/that.scaleCur*100; //原图大小
    that.controlElH    = el.height()/that.scaleCur*100;
    
    if (!that.element || !pDoc.find('div#divImgEditorMenuBar')) {
        pDoc.append(ImgEditorMenuBarHtml);   //用appendTo，IE6下报错
        that.element = $(pDoc.find('div#divImgEditorMenuBar'));
        that.height = that.element.outerHeight(true);
        that.width  = that.element.outerWidth(true);
        that.slider = that.element.find('a#zoomhandle');
        that.slider.parent().width(that.slideLen);
        
        //连写，ie上有的事件响应不了，故分开写
        that.element.click(that.click);
        that.element.mouseover(that.mouseover);
        that.element.mousedown(that.mousedown);
        that.element.mousemove(that.mousemove);
        that.element.mouseup(that.mouseup);
        that.element.mouseout(that.mouseout);
    }
    if(that.controlElW < that.minWidth || that.controlElH < that.minHeight) return;   // 若图片不够大，则不显示
    that.show();
}