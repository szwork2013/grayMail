/**
* @fileOverview 列表页工具栏历史邮件分类功能
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 列表页工具栏历史邮件分类
    */   
         
    M139.namespace('M2012.ClassifyMail.View', superClass.extend({

        /**
        *@lends M2012.ClassifyMail.View.prototype
        */

        el:"",

        events:{},

        template:{
            simpleContainer:[


             
            '<div class="boxIframeMain">',
            '<fieldset class="boxIframeText create-rule" >',
           ' <ul class="form " style="padding-bottom:0px;">',
               ' <li class="formLine" style="padding-left:16px;">联系人后续邮件，将放入对应文件夹，方便快速查找！<a href="#" title="收信时，对邮件进行自动分类，轻松管理联系人的邮件。"><i class="i_wenhao"></i></a></li>',
                 '<li class="formLine pl_15 pr_15 pt_5">',
                    '<div class="text-warp noLine">',
                      ' <label><strong><span style="float:left;">联系人：</span></strong></label>',
                       '<span class="check-input" ><strong>文件夹：</strong></span>',
                    '</div>',
                '</li>',
                '</ul>',
                '<ul class="form " style="padding:0px; overflow-y:auto; position:relative; max-height:199px;">',
                '{0}',
                '</ul>',
                '<ul class="form " style="padding-bottom:0px;">',
                '<li class="formLine pl_20 pr_20 pt_5"><label class="pt_10 pb_10" style="display:block; border-top:1px #cccccc dotted;text-align:right;"><input type="checkbox" class="mr_5" id="historyfilter" value="">对历史邮件也执行此规则</label></li>',
            '</ul>',
        '</fieldset>',
        '<div class="boxIframeBtn"><span class="bibText"><a href="#" id="btn_showfilter">进入收信规则详细设置</a> </span><span class="bibBtn"> <a href="javascript:void(0)" class="btnSure" bh="top10classify_onclick"><span>确 定</span></a>&nbsp;<a href="javascript:void(0)" class="btnNormal"><span>取 消</span></a> </span></div>',
        '</div>'
            
           ].join(''),
           noneItem:[
           '<fieldset class="boxIframeText">',
               '<div class="norTips">',
                    '<span class="norTipsIco"><i class="i_warn"></i></span>',
                    '<dl class="norTipsContent">',
                    '<dt class="norTipsLine"></dt>',
                    '<dd class="norTipsLine">你的收件人过于零散，暂时没有推荐的收信规则</dd>',
                    '</dl>',
                    '</div>',
        '</fieldset>',
        '<div class="boxIframeBtn"><span class="bibText"><a href="javascript:" id="btn_showfilter">进入收信规则详细设置</a> </span><span class="bibBtn"> <a href="javascript:void(0)" class="btnNormal" ><span>确 定</span></a>&nbsp;<a href="javascript:void(0)" class="btnNormal"><span>取 消</span></a> </span></div>'

           ].join(''),
           
           simpleItem:[ '<li class="formLine pl_15 pr_15 pt_5">',
                            '<div class="text-warp">',
                               '<label><span style="float:left;"><input type="checkbox" id="{itemid}" class="mr_5" value="{from}">{itemvalue}&lt{from}&gt</span></label>',
                               '<span class="check-input" style="width:165px;height:25px;line-height:25px;display:block;float:right;"><input type="text" id="{itemname}" class="iText" style="width:158px;" value="{itemvalue}"></span>',
                            '</div>',
                        '</li>'
                       ].join(''),
           
           sucessDialog:['请到“我的文件夹”下查看联系人的邮件。'].join(""),  
            
           failDialog:['您可以在”设置&nbsp;&gt;&nbsp;<a href="javascript:;" >收信规则</a>“中重新建立创建收信规则。'].join(""),            
           
           sendMailSucessItem:[
                '<p style="text-indent:2em;letter-spacing:1px;line-height:26px">{0}',
                    '<span style="color:#666666">(来邮{1}封)</span>',
                    '成功分类到：{2}文件夹',
                '</p>'].join(''),
           
           sendMailSucess:[ 
           '<p style="font-weight:bold;letter-spacing:1px;line-height:26px">尊敬的{0}：</p>',
           '<p style="text-indent:2em;letter-spacing:1px;line-height:26px">您在{1}执行了历史邮件分类操作。</p>',
           '<p style="text-indent:2em;letter-spacing:1px;line-height:26px;font-weight:bold">分类结果：</p>',
           '{2}',
           '<p style="text-indent:2em;letter-spacing:1px;line-height:26px">感谢您使用中国移动139邮箱！</p>',
           '<p style="text-indent:35em;letter-spacing:1px;line-height:26px">中国移动139邮箱</p>'].join(""),
           
           sendMailFail:[
           '<p style="font-weight:bold;letter-spacing:1px;line-height:26px">尊敬的{0}：</p>',
           '<p style="text-indent:2em;letter-spacing:1px;line-height:26px">您在{1}执行了历史邮件分类操作失败。</p>',
           '<p style="text-indent:2em;letter-spacing:1px;line-height:26px;">',
                '您可以在“设置>',
                '<a href="javascript:;" id="139Command_LinksShow" rel="filter" >收信规则</a>',
                '”中对分类失败的邮件重新分类。',
           '</p>',
           '<p style="text-indent:2em;letter-spacing:1px;line-height:26px">感谢您使用中国移动139邮箱！</p>',
           '<p style="text-indent:35em;letter-spacing:1px;line-height:26px">中国移动139邮箱</p>'].join("")
      
        },
        historyfilterTag: false,//是否对历史邮件分类
        tipWords : {
            SUCCEED : "规则创建成功。",
            FAILED: "遇到异常，规则创建失败，请重试。",
            NOSELECT: "请至少勾选一个联系人。"
        },

        initialize: function(){
            var self = this;
            this.model = new M2012.ClassifyMail.Model();
            self.userName = $App.getConfig("UserAttrs").trueName || $User.getLoginName();
            self.render();        
            return superClass.prototype.initialize.apply(this, arguments);
        },
      
        
        /**
        * 验证文件夹数组，判断是否已存在，返回新的文件夹数组
        * @param {array} folders 
        */
        checkFolders:function(folders){
            var newFolders = []; 
            for(var i = 0; i < folders.length; i++){
                if($App.getFolderByFolderName(folders[i])==undefined){
                    newFolders.push(folders[i]);
                }     
            }        
            return newFolders;
        },
        
        /**
        * 提交邮件分类
        * 步骤：
        * 1.验证文件夹 
        * 2.创建文件夹（是否已存在） 
        * 3.历史邮件分类  
        * 4.创建分类规则(是否勾选）
        * 5.发邮件通知用户 
        */
        submitSortMail:function(){
            var self = this;
            var checkedItem = []; 
            var sendMailOptions = [];
            self.filterNum = 0; //分类邮件数

            //1.验证选择的文件夹
            var folders = []; 
            var checkedSelect = $(self.el).find("input[type=checkbox][id!=historyfilter]:checked");
            
            if(checkedSelect.length < 1){
                 //$Msg.alert(self.model.tips.noselect);
                 top.M139.UI.TipMessage.show(self.tipWords['NOSELECT'], {className:"msgOrange", delay: 1000 });
                 return;
            }
            
            checkedSelect.each(function(){
                if($(this).attr("id")!='createfilter'){ 
                    var inputIndex = $(this).attr("id").split("_")[1];
                    var inputVal = $(self.el).find("#itemname_"+inputIndex).val();
                    if (inputVal == "") {
                        top.M139.UI.TipMessage.show("文件夹名不能为空",{className:"msgOrange", delay: 1000 });
                    };
                    if($App.getFolderByFolderName(inputVal)==undefined && !$App.checkFolderName(inputVal)){ //如果已存在的是通过的
                        folders = [];
                        checkedItem = [];
                        return false;
                    }           
                    checkedItem.push($(this).attr("id")); //item_{i}
                    folders.push(inputVal);
                }    
            })
            
            if(checkedItem.length == 0){return} //验证不通过
            if ($(self.el).find("input[type=checkbox][id=historyfilter]").attr("checked")) {
                self.historyfilterTag = true ;
            };

            //2.批量创建文件夹
            var newFolders = self.checkFolders($.unique(folders));
                self.addfilterFlag = true;
            if( newFolders.length > 0){
                $App.addFolders(newFolders,function(result){
                    callback();  
                });
            }else{ //不用创建文件夹                
                callback();
            }
            
            //3.回调函数（处理4,5）
            function callback(){
                var filterOptions = [];
                var addFilterOptions = [];
                var filterFlag = false;
                var to = $App.getAccountWithLocalDomain(self.userName);
                
                if(self.itemListData.length > 0){
                    $.each(self.itemListData,function(index,val){
                        if($.inArray(val.itemid, checkedItem) > -1){ //只处理选中的
                            var folderName = $("#" + val.itemname).val();
                            var folderId = '';
                            if($App.getFolderByFolderName(folderName)){
                                folderId = $App.getFolderByFolderName(folderName).fid;
                            }; 
                            self.filterNum += val.itemnumber;
                            var filterOption = {
                                recursiveFlag:0,
                                conditionsRelation:1,
                                folderId:1,
                                fromType:1,
                                from:val.from,
                                fromRelation:0,
                                toRelation:0,
                                toType:1,
                                to:to,
                                dealType:2,
                                moveToFolder:folderId
                                };
                                
                            var sendMailOption = {
                                from:val.from,
                                total:val.itemnumber,
                                folderName:folderName
                            };
                                            
                            var addFilterOption = {
                                onOff:0,
                                dealHistoryMail:(self.historyfilterTag ? 2 : 0),
                                folderId:1,
                                opType: "add", 
                                ignoreCase: 1, 
                                forwardBakup: 1, 
                                conditionsRelation:1,
                                name: "cx", 
                                fromType: 1, 
                                dealType: 2, 
                                moveToFolder: folderId, 
                                from: val.from, 
                                filterId: -1,
                                fromRelation:0,
                                toRelation:0,
                                sortId:1
                            }
                            self.addfilterFlag && addFilterOptions.push(addFilterOption);        
                            sendMailOptions.push(sendMailOption);
                            folderId!='' && filterOptions.push(filterOption);
                        }  
                    }) //each
                    self.model.set('addFilterItems',addFilterOptions);                        
                    self.model.set('filterItems',filterOptions);
                    //M139.UI.TipMessage.showMiddleTip("邮件正在分类中，请稍后...");
                    self.closeDialog(); //关闭对话框
                    if (self.historyfilterTag) {
                        setTimeout(function(){
                                            self.model.filterHistory(function(data){
                                                if(data.responseData.code && data.responseData.code === 'S_OK'){ 
                                                    self.sendMail('sucess',sendMailOptions);
                                                    self.showSucessDialog(self.filterNum);
                                                    $App.trigger("reloadFolder", {reload: true });
                                                    $App.trigger("showMailbox");
                                                    $App.trigger('reloadMailFilter',{reload:true}); //更新设置页
                                                    BH('mailbox_history_ok');
                                                    top.M139.UI.TipMessage.show(self.tipWords['SUCCEED'], { delay: 1000 });                                       
                                                }else{
                                                    self.sendMail('fail');
                                                    self.showFailDialog();
                                                    top.M139.UI.TipMessage.show(self.tipWords['FAILED'], {className:"msgRed", delay: 1000 }); 
                                                }
                                                M139.UI.TipMessage.hideMiddleTip();
                                            });                    
                                        },1000); 
                    } else {
                        self.model.set('filterItems',null)
                        setTimeout(function(){
                                            self.model.filterHistory(function(data){
                                                if(data.responseData.code && data.responseData.code === 'S_OK'){ 
                                                    self.showSucessDialog(self.filterNum);
                                                    $App.trigger("reloadFolder", {reload: true });
                                                    $App.trigger("showMailbox");
                                                    $App.trigger('reloadMailFilter',{reload:true}); //更新设置页
                                                    top.M139.UI.TipMessage.show(self.tipWords['SUCCEED'], { delay: 1000 });                                       
                                                }else{
                                                    self.showFailDialog(); 
                                                    top.M139.UI.TipMessage.show(self.tipWords['FAILED'], { className:"msgRed", delay: 1000 });
                                                }
                                                M139.UI.TipMessage.hideMiddleTip();
                                            });                    
                                        },1000); 
                    }
                }     
            }
            
        },
        
        /**
        * 分类邮件成功提示框
        * @param {number} total 邮件分类成功数量
        */
        showSucessDialog:function(total){
          
            var html = $T.Utils.format(this.template.sucessDialog,[total])
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
            var html = this.template.failDialog;
            $Msg.alert(html,{
                title:'收信规则创建失败',
                dialogTitle:'收信规则创建失败',
                icon:'fail', 
                isHtml:true
            });      
        },
        
        /**
        * 关闭对话框
        */
        closeDialog:function(){
            this.model.get("dialog").close();
        },
        
        
        /**
        * 发送邮件通知用户
        * @param {string} type 发送类型：sucess,fail
        * @param {object} data 发送数据：data.from - 发件人，data.total - 总数，data.folderName - 文件夹
        */
        sendMail:function(type,data){
            var self = this;
            var sendDate = $Date.format("yyyy年MM月dd日 hh点mm分", $Date.getServerTime());
            
            if(type == 'sucess'){
                var itemData = [];
                var itemtemp = self.template.sendMailSucessItem;
                for(var i = 0; i < data.length; i++){
                    itemData.push($T.Utils.format(itemtemp,[data[i].from,data[i].total,data[i].folderName]));
                }
                var sucesstemp = self.template.sendMailSucess;
                var html = $T.Utils.format(sucesstemp,[self.userName,sendDate,itemData.join('')]); //
                $App.mailToMe({
                    subject:'历史邮件分类成功',
                    content:html
                });
            }else{
                var failtemp = self.template.sendMailFail;
                var html = $T.Utils.format(failtemp,[self.userName,sendDate,failtemp]);
                $App.mailToMe({
                    subject:'历史邮件分类失败',
                    content:html
                });
            }
        
        },
        cleanMail:function(from) {
            var sysMail="10086@139.com"
            var cmpostReg=/cmpost/

            if (from.match(cmpostReg) || from == sysMail || from == "") {
                return false;
            } else {
                return true;
            }
        },
        
        render:function(){
            var self = this;
            var itemtemp = self.template.simpleItem;
            var itemData = [];
            var reg = /"|'|^|&|!|%|^|&|!|#|\/|\\/g;
            self.itemListData = []; //存放来源数据
            self.model.getItemListData(function(result){
                if(result && result.length > 0 ){
                    for(var i = 0; i< result.length ; i++){
                        var itemvalue = result[i].name || $Email.getAccount(result[i].from) || result[i].from.match(/[a-z0-9]*/i)[0];
                        itemvalue = itemvalue.replace(reg,'');
                        itemvalue = $T.Utils.htmlEncode($.trim(itemvalue));
                        
                        var formatObj = {
                            itemid:"item_" + i,
		                    itemname:"itemname_" + i,
		                    from:result[i].from,
		                    itemnumber:result[i].total,
		           		    itemvalue:itemvalue
                        };
                        if (self.cleanMail(result[i].from)) {
                            if ((itemvalue.length + result[i].from.length)>25) {
                                formatObj.from = result[i].from.substr(0,22-itemvalue.length)+"...";

                            };
                                result[i].total > 10 && self.itemListData.length < 10 && self.itemListData.push(formatObj);
                                result[i].total > 10 && itemData.length < 10 && itemData.push($T.Utils.format(itemtemp,formatObj)); 
                            }
                    }
                }
                //console.log(self.itemListData);
                if (itemData.length == 0) {
                     $(self.el).html(self.template.noneItem);
                     $("span.DL_DialogTitle").text("温馨提示"); 
                    }else{
                       $(self.el).html($T.Utils.format(self.template.simpleContainer,[itemData.join('')])); 
                    }
                
               
                self.fixTop();
                M139.UI.TipMessage.hide();
                $("#btn_showfilter").click(function () {
                    $App.show("createType");
                    self.closeDialog();
                });
            })

        },

        //调整对话框位置
        fixTop:function(){
            var self = this;
            var dialog = $(self.el).parent().parent().parent();
            var top = dialog.css('top').replace('px','');
            var height = $(self.el).height();
            var fixtop = parseInt(top) - height/2;
            if(fixtop > 0){
                dialog.css('top',fixtop + 'px');
            }
        },        
        
        initEvents: function(){
            var self = this;        
            //确定
            $(self.el).find("a.btnSure").live('click',function(){
                self.submitSortMail();
            })
            //取消
            $(self.el).find("a.btnNormal").live('click',function(){
                self.closeDialog();
            })
        }
        
    }));
    
})(jQuery, _, M139);    

