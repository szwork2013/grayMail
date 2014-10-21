/**
 *左键弹出组件
 */
;(function ($, _, M139, top) {
    var MenuMgr = M2012.Calendar.View.MenuMgr;
    var superClass = M139.View.ViewBase;
    //var superClass = M139.Model.ModelBase;
    var _class = "M2012.Calendar.View.PopMenu";
    var $CUtils = M2012.Calendar.CommonAPI.Utils;
    M139.namespace(_class, superClass.extend({
        _item: ['<li class="{checkClass}" index="{index}">',
            '<a href="javascript:void(0);" index="{index}" isMore="{isMore}" name="{cid}">',
            '<span isMore="{isMore}" index="{index}" class="text" name ="{cid}">{iconHtml}',
            '<span isMore="{isMore}" index="{index}" class="tagText"  name="{cid}" >{text}</span>',
            '</span>{iconMore}',
            '</a>',
            '</li>'].join(''),
        _iconHtml:'<span name="{id}" index="{index}" style="background-color:{bgColor};" class="ad-tagt" ><i index="{index}" class="duig"></i></span>',
        _createItmeHtml:'<span class="ad-tagt"><i class="{scheduleIcon}"></i></span>',
        _lineHtml:'<li class="line"></li>',
        _iconMore:'<i class="i_triangle_h" id="{cid}_more"></i>',
        _template : [ '<div class="menuPop shadow menuPop-sd"  id="{cid}_remindPopMenu" style="z-index:10001;display:none;width:{width};height:{height};{overflow}">',
            '<ul>{items}</ul>',
            '</div>'].join(""),
        initialize: function (options) {

            //元素Id、方便回传
            this.docElementId = options.docElement || null;

            this.docElement = typeof this.docElementId == 'string' ? document.getElementById(this.docElementId) : this.docElementId;

            //数据源
            this.dataSource = options.dataSource || [];

            //回调函数
            this.callback = options.callback || null;

            //长与宽度
            this.width = options.width || '200px';
            this.height = options.height || "";
            this.direction = options.direction || 'auto'; //用于强制显示的方向，提供down和up参数
            this.overflow = options.noflow ? "" : "overflow-y:auto;";
	        this.isHasItemIcon = options.isHasItemIcon || false;

            this.render(this.dataSource);
            this.initEvents();

            MenuMgr.r(this.cid, this);
        },

        render: function (data) {
            var menuItemArray = this.buildMenuItems(data);
            var template = $T.Utils.format(this._template, {
                cid: this.cid, items: menuItemArray.join(""),
                width: this.width, height: this.height, overflow: this.overflow
            });

            $(template).appendTo(document.body);

            this.popEl = $("#" + this.cid + '_remindPopMenu');
        },

        rebuild: function(data) {
            this.dataSource = data;
            var menuItemArray = this.buildMenuItems(data);
            this.popEl.find('ul').html(menuItemArray.join(''));
        },

        buildMenuItems: function (data) {
            var len = data.length;
            var tplCurr,
                buff = [],
                param = {},
                iconHtml = null,
                iconMoreHtml = null,
                tplItem = this._item,
                tplLine = this._lineHtml;

            for (var i = 0 ; i < len; i++) {
                param = $.extend({
                    id: this.cid + "_" + i
                }, data[i]);

                if (param.isSplit) {//分隔线
                    tplCurr = tplLine;
                } else {
                    tplCurr = tplItem;
                }

                if (param.bgColor) {
                    iconHtml = $T.Utils.format(this._iconHtml, {
                        index: i,
                        id: param.id,
                        bgColor: param.bgColor
                    });
                }else if(this.isHasItemIcon){
                    iconHtml = $T.Utils.format(this._createItmeHtml,{
                        scheduleIcon:param.scheduleIcon
                    });
                } else {
                    iconHtml = "";
                }
                iconMoreHtml = param.isMore ? this._iconMore : "";
                iconMoreHtml = $T.Utils.format(iconMoreHtml, { cid: this.cid });
                buff.push($T.Utils.format(tplCurr, $.extend(param, {
                    iconHtml: iconHtml,
                    iconMore: iconMoreHtml,
                    index: i,
                    checkClass: (param.isCheck ? 'sel' : ''),
                    cid: this.cid
                })));
                param = {};
            }

            return buff;
        },

        setDocElementId: function (docElementId) {
            this.docElementId = docElementId;
        },

        getCheckedItems: function () {

            var lis = $(".sel", this.popEl), index = 0;
            var dataSource = [];
            for (var i = 0, len = lis.length; i < len; i++) {

                index = $(lis[i]).attr('index');
                dataSource.push(this.dataSource[index]);
            }
            return dataSource;
        },
        /**
		 * 查看显示位置与浏览器高度，确定向下或向上显示
		 */
        show: function (options) {

            options = options || {};
            isClosed = options.isClosed;
            //关闭其它菜单
            if (!isClosed) {
                MenuMgr.closeExcept(this.cid);
            }
            //点击其它区域关闭菜单
            $CUtils.$Event.stopBubble();
            var left = 0, xtop = 0;
            if (options.left && options.top) {
                left = options.left;
                top = options.top;
            } else {
                //显示当前
                var offset = $(this.docElement).offset();
                xtop = offset.top + $(this.docElement).height() + 1;
                var menuHeight = $(this.popEl).height();
                var menuWidth = $(this.popEl).width();
                left = offset.left + "px";
                var clientWidth = $(document.body).width();
                if (menuWidth < offset.left && offset.left + menuWidth > clientWidth) {
                    left = offset.left - (menuWidth - $(this.docElement).width() - 10); //10px 做微调
                }

                var clientHeight = window.document.body.clientHeight
                //if(menuHeight + xtop > clientHeight){
                //	xtop = xtop - menuHeight - $(this.docElement).height()-10;
                //}

                var xreverse = xtop - menuHeight - $(this.docElement).height() - 10;
                //显示方向,暂时仅提供down和up选项
                var direction = options.direction || this.direction;
                switch (direction) {
                    case 'down':
                        break;
                    case 'up':
                        xtop = xreverse;
                        break;
                    default:
                        if (menuHeight + xtop > clientHeight) {
                            xtop = xreverse;
                        }
                        break;
                }

                xtop += 'px';
                if (!window.ISOPEN_CAIYUN) {
                    var outEl = top.$('#calendar');		//这里不加top无法找到该元素
                    var totalHeight = outEl && outEl.height();
                    var popElH;
                    if(outEl && parseInt(xtop)+menuHeight > totalHeight){   //高度没有超过限制的就不需要加滚动条了
                        popElH = (totalHeight-parseInt(xtop) - 65)+'px';
                        this.popEl.css({ left: left, top: xtop, height:popElH,'overflow-y':'scroll'}).show();
                    }else{
                        this.popEl.css({ left: left, top: xtop}).show();
                    }
                }else{
                    var defaultH = 400; //定义出现滚动条时的高度
                    if(parseInt(xtop)+menuHeight > defaultH){
                        this.popEl.css({ left: left, top: xtop, height:defaultH+'px','overflow-y':'scroll'}).show();
                    }else{
                        this.popEl.css({ left: left, top: xtop, height:'auto'}).show();
                    }
                }


            }

        },
        destroy: function () {

            this.hide();

        },
        setPosition: function (obj) {

            this.popEl.css({ left: obj.left, top: obj.top });
        },

        hide: function () {

            this.popEl.hide();
        },

        /**
		 * 获取数据项
		 */
        getItemDataByIndex: function (index) {


            return this.dataSource[index];

        },

        renderChild: function (el) {

            var index = el.attr("index");
            var id = el.attr("name") + "_more";
            var children = this.getModel().get('children') || [];
            var child = new M2012.Calendar.View.PopMenu({
                docElement: $("#" + id),
                dataSource: this.dataSource[index]['dataSource'],
                noflow: true,
                callback: this.callback.bind(this),
                height: 'auto',
                width: '200px'
            });
            el.attr('cid', child.cid);
            el.attr('render', true);
            children.push({ cid: child.cid, instance: child });
            this.getModel().set('children', children);
        },
        getChild: function (cid) {
            var children = this.getModel().get('children') || [];
            for (var i = 0; i < children.length; i++) {
                if (children[i].cid == cid) {
                    return children[i];
                }
            }
            return null;
        },
        hideAllChild: function () {

            var children = this.getModel().get('children') || [];
            for (var i = 0; i < children.length; i++) {
                children[i].instance.hide();
            }

        },
        getModel : function () {
            if (!this.model) {
                this.model = new Backbone.Model();
            }
            return this.model;
        },
        unbind: function () {
            $(this.docElement).unbind("click");
        },
        initEvents: function () {

            var self = this;

            $(this.docElement).bind('click', function () {
                // 暂时按周月年提醒中使用到该JS
                self.show();
            }).hover(function() {
            },function() {
            });

            $(this.popEl).bind('click', function (e) {

                var index = $(e.target).attr('index');
                var isMore = $(e.target).attr('isMore');

                var data = self.getItemDataByIndex(index);


                if (self.callback) {
                    self.callback(data, self.docElementId, $("ul>li", this)[index]);
                }
                $CUtils.$Event.stopBubble();
                if (data && !data.clickNoHide) { //ul也会有click事件
                    if (!isMore) {
                        self.hide();
                    }
                }


            });

            $(this.popEl).bind('mouseover', function (e) {
                var target = $(e.target);
                var isMore = target.attr('isMore');
                var isRender = target.attr('render');
                var children = self.getModel().get('children') || [];
                if (isMore) {

                    if (!isRender) {
                        self.renderChild(target);
                    }
                    //显示
                    var cid = target.attr('cid');
                    var child = self.getChild(cid);
                    child && child.instance.show({ isClosed: true });

                } else {//隐藏显示的菜单

                    self.hideAllChild();


                }




            });

            $(document).bind('click', function () {
                self.hide();
            });

            $(this.popEl).hover(function() {
            },function(e) {
                self.hide();
            });
        }

    }));
})(jQuery, _, M139, window._top || window.top);