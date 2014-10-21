
(function ($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.Cluster.View.Edit";

    M.namespace(_class, superClass.extend({
        name: _class,
        el: "body",

        /**群组名称长度限制*/
        ClusterNameMaxLength: 50,
        /**群组最大成员数*/
        ClusterMaxRemember: 50,

        elements:{
            TextClusterName: "#txtClusterName",
            AddrViewContaienr: "#addrContainer",
            BtnClearSelected: "#aClearSelected",
            LabelSelectedCount: "#lblSelectedCount"
        },

        events:{
            "click #goBack": "onGoBackClick",
            "click #aClearSelected": "onClearSelectedClick",
            "click #btnSubmit": "onSubmitClick",
            "click #btnCancel": "onCancelClick"
        },

        selectedTemplate: ['<a hidefocus="1" data-contactsid ="{serialId}"  data-addr="{addr}" href="javascript:;" class="lia">',
            '<i class="i_del"></i>',
            '<span>{sendText}</span>',
        '</a>'].join(""),

        /**
         *@param {Object} options 参数集合
         *@param {Object} options.clusterId 群组id,如果包含此属性, 说明为编辑群组模式(否则为新建模式)
         */
        initialize: function (options) {
            this.model = new M2012.Addr.Cluster.Model.Edit();

            if (options && options.clusterId) {
                this.model.set("clusterId", options.clusterId);
            }

            return superClass.prototype.initialize.apply(this, arguments);
        },


        render: function () {
            var self = this;
            $(this.elements.TextClusterName).attr("maxlength", this.ClusterNameMaxLength);

            this.renderAddrView();

            this.initEvent();

            if (this.model.get("clusterId")) {
                this.initEditView();
            }

            return superClass.prototype.render.apply(this, arguments);
        },
        
        /**
         *点击返回
         */
        onGoBackClick:function(){
            alert('goback');
        },

        /**
         *清空已选
         */
        onClearSelectedClick: function(){
            var self = this;
            var items = this.addressBook.getSelectedItems();
            $.each(items, function (index, item) {
                self.addressBook.removeSelectedAddr(item.addr);
            });
        },

        /**点击保存*/
        onSubmitClick: function () {
            var clusterId = this.model.get("clusterId");
            var inputs = this.getInputs();
            if (inputs.name == "") {
                this.showTips("#divClusterEmptyTips");
                $(this.elements.TextClusterName).focus();
            } else if (inputs.items.length < 3) {
                top.$Msg.alert("群组成员必须不少于3人");
            } else {
                if (clusterId) {
                    this.model.updateCluster({
                        name: inputs.name,
                        email: top.$User.getDefaultSender(),
                        items: inputs.items
                    });
                }else{
                    this.model.addCluster({
                        name: inputs.name,
                        email: top.$User.getDefaultSender(),
                        items: inputs.items
                    });
                }
            }
        },

        /**点击取消*/
        onCancelClick: function(){
            
        },

        /**
         *创建通讯录组件
         */
        renderAddrView: function () {
            var self = this;
            this.addressBook = new M2012.UI.Widget.Contacts.View({
                container: $(this.elements.AddrViewContaienr),
                filter: "email",
                selectMode: true,
                showSelfAddr:false,
                showCreateAddr:false,
                showAddGroup:true,
                showLastAndCloseContacts:true,
                maxCount: this.ClusterMaxRemember
            }).render().on("select", function (e) {
                if (e.isGroup) {
                    alert(e.value.length);
                } else {
                    alert(e.value);
                }
            }).on("additem", function (e) {
                if (e.isGroup) {
                    var list = e.value;
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        self.onAddItem(item.name, item.addr, item.serialId);
                    }
                } else {
                    self.onAddItem(e.name, e.addr, e.serialId);
                }
                self.renderSelectedCount();
            }).on("removeitem", function (e) {
                self.onRemoveItem(e.addr, e.serialId);
                self.renderSelectedCount();
            }).on("additemmax", function (e) {
                self.onAddItemMax();
                self.trigger("additemmax");
            });
        },

        /**
         *编辑群组模式, 初始化加载当前组信息
         */
        initEditView: function () {
            var self = this;
            this.model.queryCluster(this.model.get("clusterId"), function (result) {
                if (result.ResultCode == "0") {
                    //render cluster name
                    $(self.elements.TextClusterName).val(result.ClusterName);
                    if (!_.isArray(result.Members)) {
                        result.Members = [result.Members];
                    }
                    var items = [];
                    $(result.Members).each(function () {
                        items.push(M139.Text.Email.getSendText(this.Name, this.Mail));
                    });
                    self.addressBook.addSelectedItems(items);
                } else {
                    //TODO show error
                }
            });
        },

        initEvent:function(e){
            var self = this;
            this.$(".addFcRight").click(function(e){
                if(e.target.className == "i_del"){
                    var addr = e.target.parentNode.getAttribute("data-addr");
                    if (self.options.isAddVip) {
                        addr = e.target.parentNode.getAttribute("data-contactsid");
                    }
                    self.addressBook.removeSelectedAddr(addr);
                }
            });
        },
        onAddItem: function (name, addr, serialId) {
            var sendText = M139.Text.Email.getSendText(name, addr);
            var html = M139.Text.format(this.selectedTemplate, {
                addr: M139.Text.Html.encode(addr),
                sendText: M139.Text.Html.encode(sendText),
                serialId: M139.Text.Html.encode(serialId)
            });
            $(".addFcRight").append(html);
        },
        onRemoveItem: function (addr, serialId) {
            if (!this.options.isAddVip) {
                this.$("a[data-addr='" + addr + "']").remove();
            } else {
                this.$("a[data-contactsid='" + serialId + "']").remove();
            }
        },
        /**
         *触发上限, 做提示
         */
        onAddItemMax: function () {
            this.showTips("#divClusterMememberMaxTips");
        },
        /**
         *显示提示文本
         */
        showTips: function (el) {
            clearTimeout(this[el + "timer"]);
            var $el = $(el).show();
            this[el + "timer"] = setTimeout(function () {
                $el.hide();
            }, 3000);
            M139.Dom.flashElement($el);
        },

        renderSelectedCount: function(){
            $(this.elements.LabelSelectedCount).html("已选中(" + this.getInputs().items.length + ")");
        },

        getInputs: function () {
            var name = $.trim($(this.elements.TextClusterName).val());
            var items = this.addressBook.getSelectedItems();
            return {
                name: name,
                items: items
            };
        }
    }));

    $(function () {
        var cid = M139.Text.Url.queryString("id");
        var view = new M2012.Addr.Cluster.View.Edit({
            clusterId: cid
        });
        view.render();
    });
})(jQuery, _, M139);
