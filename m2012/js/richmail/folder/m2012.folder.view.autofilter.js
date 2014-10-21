M139.namespace("M2012.Folder.View", {
    //$App.trigger("mailCommand",{command:"autoFilter",email:"aaa@139.com"})
    AutoFilter: Backbone.View.extend({
        el: ".boxIframeMain",
        template: [
        '<ul class="form " style="padding-bottom:0px;">',
                
                '<li class="formLine pl_20" id="tips_autofilter"></li>',
                '<li class="formLine">',
                               '<label class="label " style="text-align:left;padding-left:26px;width:auto;"><input type="radio" class="mr_5" value="folder" id="folder" name="actionType"><span class="formlineText">移动到</span>',
                                '</label>',
                                 '<div class="" style="float:left;">',
                                    '<div class="dropDown dropDown-sortnew" id="dropdown_autofilterFolder" style="">',
                                            
                                     '</div>',
                                '</div> ',                         
                '</li>',
                '<li class="formLine">',
                               ' <label class="label " style="text-align:left;padding-left:26px;width:auto;"><input type="radio" class="mr_5" value="tag" id="tag" name="actionType"><span class="formlineText">标记为</span>',
                                '</label>',
                                 '<div class="" style="float:left;">',
                                    '<div class="dropDown dropDown-sortnew" id="dropdown_autofilterTag" style="">',
                                     '</div>',
                                '</div> ',                         
                '</li>',
                '<li class="formLine">',
                               ' <label class="label " style="text-align:left;padding-left:26px;width:auto;"><input type="radio" class="mr_5" value="del" name="actionType" id = "del"><span class="formlineText">直接删除邮件</span>',
                                '</label>',
                                                         
                '</li>',

                '<li class="formLine pl_20 pr_20 pt_5"><label for="history_autofilter" class="pt_10 pb_10" style="display:block; border-top:1px #cccccc dotted;text-align:right;"><input type="checkbox" class="mr_5" id="history_autofilter" value="">对历史邮件也执行此规则</label></li>',
            '</ul>', 
             '<div class="boxIframeBtn"><span class="bibText"><a id="btn_showfilter" href="javascript:">进入收信规则详细设置</a> </span><span class="bibBtn"> <a href="javascript:void(0)" class="btnSure" id="classifySure" bh="privateclassify_onclick"><span>确 定</span></a>&nbsp;<a href="javascript:void(0)" class="btnNormal" id="classifyCencel"><span>取 消</span></a> </span></div>',             
        '</div>'
             ].join(""),
       simpleItem:[ '<li class="formLine pl_15 pr_15 pt_5">',
                            '<div class="text-warp">',
                               '<label><input type="checkbox" id="{itemid}" class="mr_5" value="{from}">{itemvalue}&lt{from}&gt </label>',
                               '<span class="check-input" style="width:165px;height:25px;line-height:25px;display:block;float:right;"><input type="text" id="{itemname}" class="iText" style="width:158px;" value="{itemvalue}"></span>',
                            '</div>',
                        '</li>'
                       ].join(''),
           
        sucessDialog:['系统将按您设定的规则处理该联系人的邮件。'].join(""),  
            
        failDialog:['您可以在”设置&nbsp;&gt;&nbsp;<a href="javascript:;" >收信规则</a>“中重新建立创建收信规则。'].join(""), 
        events: {
            //"click #btn_colorselect": "showColorTable"
        },
        dropMenu:[],
        initialize: function (options) {
            var self = this;

            this.model = options.model;
            this.actionType = options.actionType;
            this.email = options.email || "";
            this.fromname = options.name;
            


            $App.on("addTagComplete", function (args) {
                if (args && args.info && args.comefrom == "autoFilterTag") { //添加标签成功后，给dropmenu添加一行
                    //self.addFilter(args.info.fid);
                    var tagItemHtml = ['<span class="text"><span class="tagMin tagOrange"><span class="tagBody" style="background-color:',
                    $App.getTagColor(args.info["folderColor"]),
                    , '"></span></span><span class="tagText">',
                    args.info["name"], '</span></span>'].join("");
                    var len = self.dropMenu[0].getCount();
                    self.dropMenu[0].addItem({ html: tagItemHtml, labelId: args.info.fid }, len - 1);
                    self.dropMenu[0].setSelectedIndex(len - 1);
                } 
            });
            $App.on("addFolderComplete", function (args) { //添加文件夹成功后，给dropmenu添加一行
                if (args && args.info && args.comefrom == "autoFilter") {
                    var len = self.dropMenu[1].getCount();
                    self.dropMenu[1].addItem({ text: args.info.name, data: args.info.fid }, len - 1);
                    self.dropMenu[1].setSelectedIndex(len - 1);
                }
            });
            //todo add off
        },
        addFilter: function () {
            var self = this; 
            if ($("input#folder").prop("checked")) {
                var i = 1
            } else if ($("input#tag").prop("checked")) {
                var i = 0
            } else if ($("input#del").prop("checked")) {
                var  delFid= 4;
            };
            var item = (this.dropMenu[i]&&this.dropMenu[i].getSelectedItem()) || {};
            var fid = delFid || item.data || item.labelId;
            var dealHistory = $("#history_autofilter").attr("checked") ? 2 : 0;// 取值范围0:只对即时邮件处理 1:只对历史邮件处理，  2: 对即时邮件和历史邮件都进行处理)
            this.model.addFilterToFolderTag(fid,this.email,dealHistory,function(res) {
                if (res.code && res.code === 'S_OK') {
                    M139.UI.TipMessage.show("收信规则创建成功", { delay: 3000 });
                    
                        self.showSucessDialog();
                        $App.trigger("reloadFolder");
                        $App.trigger("showMailbox");
                        
                    }else{
                        M139.UI.TipMessage.show("遇到异常，规则创建失败，请重试", { className:"msgRed",delay: 3000 });

                    
                }
            });
        },
        render: function () {
            var self = this;
            var title = "快速创建收信规则" ;
            var dialog=$Msg.showHTML(this.template, function () { self.addFilter() }, {
                dialogTitle: title

            });
            $("#tips_autofilter").html('以后收到<span class="green ml_5 mr_5">'+this.fromname+'&lt '+this.email+'&gt  </span>的邮件时：<a href="#" title="收信时，对邮件进行自动分类，轻松管理联系人的邮件。"><i class="i_wenhao"></i></a>');
            $("#btn_showfilter").click(function () {
                $App.show("createType");
                dialog.close();
            });
            this.renderDropdown();
            $("[name=actionType]").click(function() {
                if (!$("#history_autofilter").prop("checked")) {
                    $("#history_autofilter").attr("checked",true);
                };
            })

            //$(this.el).find("#dropdown_autofilter");
             $("#classifySure").click(function() {
                if (!$("input#folder").prop("checked") && !$("input#tag").prop("checked") && !$("input#del").prop("checked")) {
                    top.M139.UI.TipMessage.show("请选择一项操作",{className:"msgOrange", delay: 1000 });
                    return;
                }else{
                    self.addFilter()
                    dialog.close();
                }
                

            } );
             $("#classifyCencel").click(function() {
                dialog.close()
             } );

        },
        /**
        * 分类邮件成功提示框
        * @param {number} total 邮件分类成功数量
        */
        showSucessDialog:function(){
          
            var html = this.sucessDialog
            $Msg.alert(html,{
                title:'收信规则创建成功',
                dialogTitle:'创建收信规则',
                icon:'ok', 
                isHtml:true
            });
        },
        
        /**
        * 分类邮件失败提示框
        */
        showFailDialog:function(){
            var html = this.failDialog;
            $Msg.alert(html,{
                title:'收信规则创建失败',
                dialogTitle:'收信规则创建失败',
                icon:'fail', 
                isHtml:true
            });      
        },
        renderDropdown: function () {
            var self = this;
                var menuItems = this.model.getFolderDropItems({ showAdd: true });
                this.dropMenu[1] = M2012.UI.DropMenu.create({
                    //defaultText: "全部邮件",
                    selectedIndex: 0,
                    menuItems: menuItems,
                    container: $("#dropdown_autofilterFolder"),
                    width: "150px"
                });
                this.dropMenu[1].on("change", function (item) {
                    //alert(item.data);
                    if (item.data == -2) {
                        $App.trigger("mailCommand", {
                            command: "addFolder",
                            comefrom: "autoFilter" //来源
                        });
                    }
                });
                var tagItems = $App.getView("folder").model.getTagItem({ showAdd: true });

                this.dropMenu[0] = M2012.UI.DropMenu.create({
                    defaultText: "不限",
                    selectedIndex: 0,
                    menuItems: tagItems,
                    container: $("#dropdown_autofilterTag"),
                    width: "150px"
                });
                this.dropMenu[0].on("change", function (item) {
                    var labelId = item.labelId;
                    //alert(labelId);
                    if (item.labelId == -2) {
                        $App.trigger("mailCommand", {
                            command: "addTag",
                            comefrom: "autoFilterTag"//来源 
                        });
                    }
                });
            

        }
      

    })
});