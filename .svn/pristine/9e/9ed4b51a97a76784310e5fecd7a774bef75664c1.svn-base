/**
* @fileOverview 联系人视图层.
* @namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.AddressBook', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "body",
        name : "addressBook",
        events: {
        	"click #thContactFrame" : "showContactFrame"
        },
        initialize: function (options) {
        	this.model = options.model;
        	this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render : function(pageType, dataSet){
        	var self = this;
		    new M2012.UI.Widget.Contacts.View({
		        container: document.getElementById("divAddressList"),
		        filter: "email",
		        width: "auto"
		    }).on("select",function(e){
                var addr = e.isGroup ? e.value.join(";") : e.value;
		        var richInputManager = self.model.addrInputManager;
		        richInputManager.addMailToCurrentRichInput(addr).focus();
		    });
        },
        /**
         * 显示通讯录
         */
        showContactFrame : function() {
        	BH({key : "compose_addressbook"});
        	
			$("#divAddressList").addClass('show');
			$("#divLetterPaper").removeClass('show');
            $("#thContactFrame").addClass('on');
            $("#thLetterPaperFrame").removeClass('on');
		},
        initEvents : function (){
        }
    }));
})(jQuery, _, M139);

