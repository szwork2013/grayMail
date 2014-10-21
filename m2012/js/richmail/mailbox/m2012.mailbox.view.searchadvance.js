M139.namespace("M2012.Mailbox.View", {
SearchAdvance :Backbone.View.extend({
el:"body",
events:{
    "click #btn_search":"startSearch",
    "click #btn_cancel":"close",
    "click #tb_forgotpassword":"forgotPassword",
    "paste #tb_attachName":"attachNameChange",
    "keyup #tb_attachName":"attachNameChange"
},
initialize: function(options){
   //alert("hello");
   var self=this;
   this.model=null;
   this.initEvents();
   
},
initEvents:function(){
	var self=this;
	$("#tb_subject").focus();
},
initDropMenu:function(){
	/*
	 <ul class="add_lay" id="timeScopeDDL" style="display: block; "> 
					<li class=""><a href="javascript:;" vid="-1">不限</a></li>
					<li class=""><a href="javascript:;" vid="D0,1">一天内</a></li>
					<li class=""><a href="javascript:;" vid="D0,3">三天内</a></li>
					<li><a href="javascript:;" vid="W0,1">一周内</a></li>
					<li><a href="javascript:;" vid="W0,2">二周内</a></li>
					<li><a href="javascript:;" vid="M0,1">一月内</a></li>
					<li><a href="javascript:;" vid="M0,3">三月内</a></li>
					<li><a href="javascript:;" vid="M0,6">六月内</a></li>
					<li><a href="javascript:;" vid="Y0,1">一年内</a></li>
				</ul>
				*/
	 this.dropMenu_date = M2012.UI.DropMenu.create({
            defaultText:"不限",
            selectedIndex: 0,
            maxHeight: 150,
            menuItems:[
                {text:"不限",data:-1},
                {text:"一天内",data:"D0,1"},
                {text:"三天内",data:"D0,3"},
                {text:"一周内",data:"W0,1"},
                {text:"二周内",data:"W0,2"},
                {text:"一月内",data:"M0,1"},
                {text:"三月内",data:"M0,3"},
                {text:"六月内",data:"M0,6"},
                {text:"一年内",data:"Y0,1"}
               
            ],
            container:$("#drop_date")
        });
        this.dropMenu_date.on("change",function(item){
            //alert(item.data);
        });
        
        this.dropMenu_read = M2012.UI.DropMenu.create({
            defaultText:"不限",
            selectedIndex: 0,
            menuItems:[
                {text:"不限",data:"-1"},
                {text:"已读",data:"0"},
                {text:"未读",data:"1"}
            ],
            container:$("#drop_read")
        });
        this.dropMenu_read.on("change",function(item){
            //alert(item.data);
        });


        
      /*
      function getFolderItems(key){
      	  var folderList=$App.getFolders(key);
	      var itemsFolder=[];
	      $(folderList).each(function (idx,folderItem){
	      	itemsFolder.push({text:folderItem["name"],data:folderItem["fid"]});
	      });
	      return itemsFolder;
      }
      var folderMain=[{text:"全部文件夹",data:0},{isLine:true}].concat(getFolderItems("system"));
      var folderCustom=getFolderItems("custom");
      var folderPop=getFolderItems("pop");

	  folderMain.push( {isLine:true});
	  folderMain=folderMain.concat(folderCustom);
	  folderMain.push( {isLine:true});
	  folderMain=folderMain.concat(folderPop);*/
	  
	  var folderMain=$App.getView("folder").model.getFolderDropItems({ showAll: true });
        this.dropMenu_folder= M2012.UI.DropMenu.create({
            defaultText:"全部邮件",
            selectedIndex:0,
            menuItems:folderMain,
            container:$("#drop_folder")
        });
        this.dropMenu_folder.on("change",function(item){
            if(item.lock && item.lock ==1){
                $("#li_lock").show();
            }else{
                $("#li_lock").hide().val("");
            }
        });

               
        var tagItems = $App.getView("folder").model.getTagItem({ showNoLimit: true });

        this.dropMenu_tag = M2012.UI.DropMenu.create({
            defaultText: "不限",
            selectedIndex: 0,
            menuItems: tagItems,
			maxHeight: 240,
            container: $("#drop_tag")
        });
        this.dropMenu_tag.on("change", function (item) {
            var labelId = item.labelId;
            //alert(labelId);
        });

},
render: function () {
    if (!this.isFullSearch()) {
        $("#li_content").hide();
        $("#li_attachName").hide();
    }
    if (!top.$User.isChinaMobileUser()) {
        $("#tb_forgotpassword").hide();
    }
    this.initDropMenu();
},
forgotPassword:function(){
    top.appView.show('lockForget');
    this.close();
    return false;
},
attachNameChange:function(){
	setTimeout(function(){ //因为粘贴时文本框尚未赋值，需要延时执行。
		$("#chk_attach").attr("checked",$("#tb_attachName").val()!="");
	},50)
},
close:function(){
	top.M139.UI.Popup.close();
},
getDateByCode : function(code){
        var myDate = new Date(new Date());//new Date();
        var codes = code.split(",");
        switch (codes[0]) {
            case "D0":
                myDate.setDate(myDate.getDate() - parseInt(codes[1]));
                break;
            case "W0":
                myDate.setDate(myDate.getDate() - parseInt(codes[1]) * 7);
                break;
            case "M0":
                myDate.setMonth(myDate.getMonth() - parseInt(codes[1]));
                break;
            case "Y0":
                myDate.setFullYear(myDate.getFullYear() - parseInt(codes[1]));
                break;
        }
        return Math.round((myDate) / 1000);
        //return myDate.format("yyyy-MM-dd");
},
isFullSearch: function () {
    var userAttrs = parent.$App.getConfig("UserAttrs");
    return userAttrs.fts_flag == 1 ? true : false;
},
//构造搜索条件进行搜索
startSearch:function(){
	var options={
		fid:this.dropMenu_folder.getSelectedItem().data,
		flags:{},
        recursive:1,
        isSearch:1,
        isFullSearch:0, //高级搜索，精确搜索结果，取交集 and  传0
        condictions:[]
	};
	
	function addCondiction(id,field){
		if($(id).val()!=""){
			options.condictions.push(
				{field:field,
				operator:"contains",
				value:$(id).val()
				});
		}
	}
	
	addCondiction("#tb_subject","subject");
	addCondiction("#tb_from","from");
	addCondiction("#tb_to","to");
	addCondiction("#tb_content","content");
	addCondiction("#tb_attachName","attachName");
	
	var labelId = this.dropMenu_tag.getSelectedItem().labelId;
	if (labelId >= 0) { //是否选择了标签
	    options.label = [labelId];
	}
	var selectedDate=this.dropMenu_date.getSelectedItem().data;
	if(selectedDate!="-1"){ //按日期搜索
		options.condictions.push(
				{field:"receiveDate",
				operator:">",
				value:this.getDateByCode(selectedDate)
				});
		options.condictions.push(
				{field:"receiveDate",
				operator:"<",
				value:Math.round(Number(new Date())/1000) //当前时间
				});
	}

    if($("#chk_attach").attr("checked")){ //是否包含附件
	    options.flags.attached=1;
    }
    var readFlag = Number(this.dropMenu_read.getSelectedItem().data);//是否未读
    if(readFlag!=-1){
        options.flags.read = readFlag;
        options.condictions.push({
            read: readFlag
        });
    }
    if($("#tb_password").val() != ""){
        options.folderPass = $("#tb_password").val();
    }
    top.$App.getView("mailbox").model.set("setting", "iamadvance");//高级搜索的时候把搜索配置传递下去
    top.$App.getView("mailbox_other").model.set("showSearchclassify",true);
    $App.searchMail(options);
    this.close();
}

})
});

var $App= top.$App;
var view = new M2012.Mailbox.View.SearchAdvance();
view.render();