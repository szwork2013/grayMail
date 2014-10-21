M139.namespace("M2012.Folder.View", {
AddTag:Backbone.View.extend({
el:".boxIframeMain",
template:[ '<ul class="form">',
         '<li class="formLine">',
           '<label class="label">标签名称：</label>',
           '<div class="element p_relative">',
             '<div class="setTag">',
 			  '<input id="tb_tagname" type="" value="" maxLength="16" class="iText">',
 			  '<div class="mailThemeBg" id="btn_colorselect">',
 				'<span class="tagMin tagOrange"><span class="tagBody"></span></span><i class="i_triangle_d"></i>',
 			  '</div>',
 			'</div>',
 			'<div class="mb_5" id="div_filterContact">',
               '<input type="checkbox" id="chk_filter" value="" class="mr_5">',
               '<label for="chk_filter">给指定联系人的邮件贴标签</label>',
               '<input type="text" class="iText" placeholder="如sample@139.com" id="tb_address" style="display:none">',
             '</div><div id="contactSelector" style="display:none">您可以选择通讯录中的联系人</div>',
           '</div>',
         '</li>',
       '</ul>'].join(""),
events:{
"click #btn_colorselect":"showColorTable"
},
initialize: function(options){
   var self=this;
   
   this.model = options.model;
   if (options.comefrom) { this.comefrom = options.comefrom; }
   if (options.mid) {
       this.midForMove = options.mid;//创建成功后自动标记
   }
   this.selectedColor = 3;
   
},
createContactSelector: function () {
    var self = this;
    if (!this.contactSelector) { //保持单例
        this.contactSelector = new M2012.UI.Widget.Contacts.View({
            container: document.getElementById("contactSelector"),
            showCreateAddr:false,
            showSelfAddr: false,
            showAddGroup:false,
            filter: "email"
        }).render().on("select", function (e) {
            if (e.isGroup) { //添加整组
                //alert(JSON.stringify(e.value));
            } else {
			//要求可以添加多个
				var email = $Email.getEmail(e.value);
				var emailhad = $("#tb_address").val();
				var emailAtLast = "";
				if(!emailhad){
					emailAtLast = email;
				}else if(emailhad && emailhad.indexOf(email) > -1){
					emailAtLast = emailhad;
				}else{
					emailAtLast = emailhad + ";" + email;
				}
				$("#tb_address").val(emailAtLast);                
            }
        });

       
    }
    setTimeout(function () {
        self.dialog.setMiddle();
    }, 100);
},
render:function (){
	var self=this;
	
	this.dialog=$Msg.showHTML(this.template,function(e){self.addTag(e)},{
		dialogTitle:"新建标签",
        buttons:["确定","取消"]

	});

    this.el=$(".boxIframeMain");
    $("#btn_colorselect").click(function(e){
    	self.showColorTable(this);
    });

    $(this.el).find("#chk_filter").click(function () {
        if ($(this).attr("checked")) {
            $(self.el).find("#tb_address").show();
            $(self.el).find("#contactSelector").show();
            self.createContactSelector();
        } else {
            $(self.el).find("#tb_address").hide();
            $(self.el).find("#contactSelector").hide();
            self.dialog.setMiddle();
        }
    });

    if (this.comefrom == "autoFilterTag") {
        $(this.el).find("#div_filterContact").hide();
    }
    
},
showColorTable:function(target){
	var self=this;
	var items=[];
	var colorArr=this.model.getAllColor();
	$(colorArr).each(function(i,n){
	    var html = ['<span class="tagMin" style="border-color:', n, '"><span class="tagBody" style="border-color:',n,';background-color:', n, '"></span></span>'].join("");
		items.push({html:html,value:i});
	});
	M2012.UI.PopMenu.create({
	    //width:300,
            items:items,
            onItemClick: function (item) {
                self.selectedColor = item.value;
            	
            	var selectedColor=self.model.getColor(item.value);
          		$(target).find(".tagBody").css("background-color",selectedColor);
            },
            template :[ '<div class="menuPop shadow show creatTagpop" style="top:0;left:0;z-index:9100">',
       '<ul>',
       '</ul>',
    '</div>'].join(""),
        maxHeight:"120px",
            left:($(target).offset().left)+"px",
            top:($(target).offset().top+20)+"px"
    });

},
addTag: function () {
    var self = this;

	var tagName = $("#tb_tagname").val();
	var error = this.model.checkTagName(tagName);//标签名合法性检测
	var from = null;
	//标签与文件夹，发件人可以添加多个！
			function isAllEmail(str){
				var tmpArr = str.split(";");
				for(var i =0, t=tmpArr.length; i< t; i++){
					if(!$Email.getEmail(tmpArr[i])){
						return false;
						break;
					}
				}
				return true;
			}
	if ($(this.el).find("#chk_filter").attr("checked")) {
	    from = $(this.el).find("#tb_address").val();
	//    from = $Email.getEmail(from);
	    if (from == "" || !isAllEmail(from)) {
	        error = "邮箱地址不正确，邮箱地址如果为多个，请用分号隔开。";
	    }
	}
	if (error) {
	    $Msg.alert(error);

	    e.cancel = true;
	    return false;
	}
	this.model.addTag(tagName, self.selectedColor, from, function (info) {


	    if (self.midForMove) { //添加成功后转移邮件到该文件夹
	        $App.trigger("mailCommand", {
	            command: "tag", labelId: info.fid,
	            mids: self.midForMove
	        });
	    }

	    $App.trigger("addTagComplete", {
	        comefrom: self.comefrom,
	        info: info, name: tagName
	    });

	    BH("left_addTag_ok");
	});
}

})
});