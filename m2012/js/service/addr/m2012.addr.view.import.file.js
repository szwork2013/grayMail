/**
 * 导出联系人到本地文件向导
 * @param {Object} $
 * @param {Object} _
 * @param {Object} M
 */
(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Import.File.ExportGuide";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        el : "#exportFileExplanation",

        initialize : function() {
            return superClass.prototype.initialize.apply(this, arguments);
        },

        events : {
            "click li" : "clickNav",
            "click #btnDownloadTemplate" : "dowmloadTemplateFile"
        },

        /**
         * 切换向导tab页签
         * @param {Object} ev
         */
        clickNav : function(ev) {
            var $target = $(ev.target);
            $target.closest("ul").find("li").removeClass("on");
            $target.closest("li").addClass("on");

            $("div.export-guide-detail").addClass("force-hide");
            var showId = $target.closest("li").attr("id").substring(1);
            $("#" + showId).removeClass("force-hide");
        },

        /**
         * 下载模板文件
         */
        dowmloadTemplateFile : function() {
            window.open(top.getDomain("webmail") + "/addr/matrix/input/txl-address.csv");
        }
    }));

    $(function() {
        new M2012.Addr.View.Import.File.ExportGuide();
    });

})(jQuery, _, M139);

/**
 * 页面跳转
 * @param {Object} $
 * @param {Object} _
 * @param {Object} M
 */
(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Import.File.AppNav";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        el : "body",

        initialize : function() {
            return superClass.prototype.initialize.apply(this, arguments);
        },

        events : {
            "click .to-addr-home" : "toAddrHome"
        },

        /**
         * 返回到通讯录首页
         * @param {Object} ev
         */
        toAddrHome : function(ev) {
            var view = this;
            if (FORM_SUBMITTING) {
                var msg = PageMsg2['warn_whencancel'];
                // var msg = 'testmsg';
                top.$Msg.confirm(msg, function() {
                    view.backToAddrHone();
                }, null, null, {
                    isHtml : true
                });
            } else {
                view.backToAddrHone();
            }

            top.BH('addr_importFile_cancel');
            return false;
        },

        backToAddrHone : function() {
            if (window.ImportAction) {
                window.ImportAction.set("cancelImport", true);
            }

            //返回
            setTimeout(function() {
                if(top.$Addr){                
                    var master = top.$Addr;
                    master.trigger(master.EVENTS.LOAD_MAIN);
                }else{
					top.$('#addr').attr({'src': 'addr_v2/addr_index.html'});
				}
            }, 0xff);
        },

        toImportFileHome : function(ev) {
            setTimeout(function() {
                window.location.assign("addr_import_file.html?sid=" + top.$App.getSid());
            }, 0xff);
            return false;
        }
    }));

    $(function() {
        new M2012.Addr.View.Import.File.AppNav();
    });

})(jQuery, _, M139);

/**
 * 导入本地文件表单
 * @param {Object} $
 * @param {Object} _
 * @param {Object} M
 */
(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Import.File.ImportForm";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        el : "#importFileContactsForm",

        logger : new M139.Logger({ name: _class }),

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
            this.renderGroups();
        },

        events : {
            "change #selectImportGroup" : "changeImportGroup",
            "click #submitContacts" : "importContacts",
            "click #newImportGroup" : "inputNewGroupName",
            "click #File1": "fileChange",
            "click input[name='groupBy']": "groupBy",
            "click input[name='repeat']": 'repeatType'
        },

        /**
         * 初始化组列表
         */
        renderGroups : function() {
            var selGroup, item;

            selGroup = document.getElementById("selectImportGroup");
            selGroup.options.length = 0;
            item = new Option("所有联系人", "1");
            selGroup.options.add(item);

            // 判断租的数量是否超过上限
            if (this.isGroupAddable()) {
                item = new Option("新建组...", "2");
                selGroup.options.add(item);
            }

            // 添加现有组
            var groups = top.Contacts.data.groups;
            if (groups) {
                item = $.map(groups, function(i) {
                    return new Option(i.GroupName, i.GroupId);
                });

                $.each(item, function(n, i) {
                    selGroup.options.add(i);
                });
            }

            selGroup.selectedIndex = 0;
        },

        /**
         * 改变导入组名
         * @param {Object} ev
         */
        changeImportGroup : function(ev) {
            var $el = $(ev.target);
            if (this.isCreateNewGroup()) {
                $("#newImportGroup").show().focus();
                top.BH('addr_importFile_newGroup');
            } else {
                $("#newImportGroup").hide();
            }
            $("input[name=groupBy]").eq(1).prop("checked", true);
        },

        inputNewGroupName : function() {
            $("input[name=groupBy]").eq(1).prop("checked", true);
        },
        fileChange: function(){
            this.hideTip();
            top.BH('addr_importFile_selectFile');
        },
        groupBy: function(ev){
            if($(ev.target).val() == "0"){
                top.BH('addr_importFile_reserveGroup');
            }else{
                top.BH('addr_importFile_assignGroup');
            }
        },
        repeatType: function(ev){            
           if($(ev.target).val() == "1"){
                top.BH('addr_importFile_skip');
            }else{
                top.BH('addr_importFile_replace');
            } 
        },

        /**
         * 提交“导入”本地文件
         * @param {Object} ev
         */
        importContacts : function(ev) {
            this.logger.debug("import file contacts submitted");

            if (FORM_SUBMITTING) {
                return;
            }

            if (!this.validateForm()) {
                return false;
            }

            top.WaitPannel.show(PageMsg['info_importing']);

            var repeatType = $("input[name=repeat]:checked").val();
            var groupBy = $("input[name=groupBy]:checked").val();
            var $selectGroup = $('#selectImportGroup');
            var groupName = null;
            var groupType = null;

            // 指定分组
            if (groupBy == 1) {
                //保留原分组
                var Original = 0;
                //不处理分组
                var Ignore = 1;
                //归入新分组
                var NewGroup = 2;
                //指定现有组
                var Specify = 3;

                if (this.isCreateNewGroup()) {// 创建新组
                    groupType = NewGroup;
                    groupName = $("#newImportGroup").val();
                } else if (this.isSelectAllContacts()) {// 所有联系人
                    groupType = Ignore;
                } else {// 指定组
                    groupType = Specify;
                    // groupName = $("#selectImportGroup").val();
                    groupName = $("#selectImportGroup").find("option:selected").text();
                }
            } else {
                groupType = Original;
            }

            var baseModel = new M2012.Addr.Model.Import.File.Base();
            var addrhost = baseModel.getHost();
            var sid = baseModel.getSid();
            var urlParams = {
                complete : "parent.onFileContactsImported",
                sid : sid,
                rnd : Math.random()
            };
            var action = top.$Url.makeUrl(addrhost + "/AddFileContacts", urlParams);

            var form = this.el;

            if (null != groupName) {
                form.GroupName.value = groupName;
            }
            form.GroupType.value = groupType;
            form.repeat.value = repeatType;
            form.action = action;

            form.submit();
            FORM_SUBMITTING = true;

            top.BH('addr_importFile_import');
        },

        validateForm : function() {
            var Contacts = top.Contacts;
            var FF = top.FloatingFrame;
            //判断联系人的总数是否达到上限 getMaxContactLimit 联系人上限人数2012.06.25
            if (Contacts.getContactsCount() >= tipMaxLimit) {
                if (tipMaxLimit == 3000) {
                    FF.alert(PageMsg['error_overlimit'].format(tipMaxLimit));
                }
                else {
                    FF.alert("联系人数量已达上限{0}".format(tipMaxLimit));
                }
                return false;
            }

            // 判断文件是否存在
            var fileValue = document.getElementById("File1").value;
            if (fileValue.length == 0) {
                this.showTip(PageMsg['warn_nofile'], $('#File1'));
                return false;
            }

            // 判断文件后缀名是否为vcf或者csv
            var ext = fileValue.match(/\.(.+)/i)[1] || "";
            ext = ext.toLowerCase();
            if (!/(vcf)|(csv)/.test(ext)) {
                FF.alert(PageMsg['warn_unknownType']);
                return false;
            }

            // 新建组时，判断新建组名是否存在
            var newGroup = $("#selGroup").val() == "2";
            var newImportGroup = $("#newImportGroup").val();
            if (this.isCreateNewGroup() && newImportGroup == "") {
                FF.alert(PageMsg['warn_nogroupname'], function() {
                    $("#newImportGroup").focus();
                });
                return false;
            }

            return true;
        },

        isCreateNewGroup : function() {
            return this.isGroupAddable() && $('#selectImportGroup')[0].selectedIndex == 1;
        },

        isSelectAllContacts : function() {
            return $('#selectImportGroup')[0].selectedIndex == 0;
        },

        isGroupAddable : function() {
            var groups = top.Contacts.data.groups;
            var groupsNum = 0;
            if (groups) {
                groupsNum = groups.length;
            }
            var groupsNumLimit = 50;
            return groupsNum < groupsNumLimit;
        },
        showTip: function(text, dom){
            var height = 28;
            var offset = dom.offset();
            var sTop = offset.top - height;

            $('#tipContent').text(text);
            $('#tipWrap').show().css({left: offset.left, top: sTop});
        },
        hideTip: function(){
            $('#tipWrap').hide();
        }
    }));

    $(function() {
        new M2012.Addr.View.Import.File.ImportForm();
    });

})(jQuery, _, M139);
