/*
*
*和笔记mainView
*总括：
*事件：1.记事列表区域和记事编辑区域大小自适应绑定 2.分割栏拖转事件绑定 3.排序选项下拉菜单绑定 
*渲染：所有输入框以及富文本输入框的 placeholder 采用label浮层处理，并将该label绑定当前表单聚焦事件。
*
*/

M139.namespace("M2012.Note.View.Main", Backbone.View.extend({
    el: "",
    template: "",
    events: {
        //"click .mtitle":"subjectClick"
    },
    initialize: function () {
        var self = this;
        self.model = new M2012.Note.Model();
        self.initEvents();
    },
    initEvents: function () {
        var self = this;

		BH("note_page_load");

        //和笔记自适应绑定
        setTimeout(adaption, 100);
        $(window).resize(function () {
            adaption();
        });
        function adaption() {
            var totalWidth = $(document.body).width(),
                totalHeight = $(document.body).height(),
                rightEditArea = $('#mnote_htmlEdiorContainer .eidt-body');
            leftList = $('#div_notelist');
            if (rightEditArea) {
                rightEditArea.height(totalHeight - 140);
                leftList.height(totalHeight - 106)
            }
        };

        //关闭记事页 监听记事编辑
        if (top.$App) {
            top.$('#divTab li[tabid=mailbox_1]').show()
            top.$App.on("closeTab", function (args) {
                if (args.name && args.name.indexOf('note') > -1)
                    return oncloseBind(args);
            });
        } else {
            window.onModuleClose = function () {
                return oncloseBind();
            }
        }

        //关闭Tab标签时提示。
        function oncloseBind(args) {
            var isEditing = self.model.get("autoSave");
            if (isEditing) {
                self.model.trigger("autoSave", 0);  //重置TIME
                self.model.set("autoSave", false);
                var isClose = confirm("关闭笔记页，未保存的内容将会丢失，是否关闭？");
                if (!isClose) {
                    self.model.trigger("autoSave", 1); //触发自动保存
                    self.model.set("autoSave", true);
                    if (args) {
                        args.cancel = true;
                        return;
                    } else {
                        return false;
                    }
                } else {
                    return true
                }
            }
        }

        //初始化按钮状态
        $("#tb_search").bind({
            focus:function(){
                _self = $(this);
                var value = _self.attr('placeholder1');
                if (_self.hasClass('gray') && value == _self.val()) {
                    _self.removeClass('gray').val(''); 
                }
            },
            blur:function(){
                _self = $(this);
                if ($.trim(_self.val()) == "") {
                    var value = _self.attr('placeholder1');
                    _self.val(value).addClass('gray');
                }
            }
        })

        //排序点击事件
        $('#btn_order').click(function () {
            BH('note_sort');
            var html = self.getOrderHtml();
            $('#oderSet').html(html).show().find('li').click(function () {
                $('#oderSet i').prop('class','');
                var desc = self.model.get('desc') ? 0 : 1;
                var type = $(this).attr('type');
                $(this).find('i').addClass(self.descClass[desc]);
                self.model.set({ order: type, desc: desc });
                self.model.sortData(true);
            });
            return false;
        });
    },

    descClass:['i_c_upB', 'i_c_downB'],

    getOrderHtml: function () {
        var order = this.model.get("order"),
            desc = this.model.get("desc");
        var template = '<li class="cur" type="@type"><a href="javascript:;"><i class="@class"></i><span class="text">@text</span></a></li>';
        var item = ['createTime', 'updateTime'], descClass = this.descClass, text = { createTime: '创建时间', updateTime: '修改时间' };
        var i = 0; len = item.length, str = '';
        for (; i < len; i++) {
            var iClass = order == item[i] ? descClass[desc] : '';
            str += template.replace(/@text/, text[item[i]])
                .replace(/@class/, iClass)
                .replace(/@type/, item[i]);
        }
        return '<ul>' + str + '</ul>';
    },
    render: function (isRendered) {
        var self = this;
        this.listView = new M2012.Note.View.ListView({ model: this.model });
        this.listView.render(true);
        this.editView = new M2012.Note.View.EditView({ model: this.model });
        this.editView.render();
    }
}) //end of extend
); //end of namespace

$(function () { //main函数入口
    colorCloudNoteview = new M2012.Note.View.Main();
    colorCloudNoteview.render();
});