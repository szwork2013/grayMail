/**
 * @fileOverview 定义通讯录地址本对话框
 */

 (function(jQuery,_,M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Dialog.AddressBook";

    M139.namespace(namespace,superClass.extend(
    /**@lends M2012.UI.Dialog.AddressBook.prototype*/
    {
       /** 定义通讯录地址本组件代码
        *@constructs M2012.UI.Dialog.AddressBook
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {String} options.filter 地址本类型:email|mobile|fax|mixed
        *@param {String} options.receiverText 显示接收人标题（默认为"接收人")
        *@param {String} options.dialogTitle 对话框标题（默认为"从联系人添加");
        *@param {Boolean} options.getDetail 是否返回object类型的联系人数据
        *@param {Boolean} options.showLastAndCloseContacts 是否显示最近联系人、紧密联系人（默认值为true)
        *@param {Boolean} options.showVIPGroup 是否显示最近联系人、紧密联系人（默认值为true)
        *@example
        */
        initialize: function (options) {
            this.filter = options.filter;
            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        template:['<div class="addFormContact">',
             '<table>',
                 '<tbody><tr>',
                     '<td width="193">联系人(<var class="Label_ContactsLength"></var>)</td>',
                     '<td width="36"></td>',
                     '<td width="195"><var class="Label_ReceiverText"></var></td>',
                 '</tr>',
                 '<tr>',
                     '<td>',
                     '<div class="addFcLeft p_relative AddressBookContainer">',
                     '</div>',
                     '</td>',
                     '<td class="ta_c"><i class="i_addjt"></i></td>',
                     '<td>',
                         '<div style="width:221px;" class="menuPop addFcRight">',
                             /*
                             '<a href="#" class="lia">',
                                 '<i class="i_del"></i>',
                                 '<span>18688959302 sdfsdffffffffffffffffffffffffffffffff</span>',
                             '</a>',
                             */
                         '</div>',
                     '</td>',
                 '</tr>',
             '</tbody></table>',
         '</div>'].join(""),

        /**构建dom函数*/
        render:function(){
            var This = this;
            var options = this.options;

            this.dialog = $Msg.showHTML(this.template,function(){
                This.onSelect();
            },function(){
                This.onCancel();
            },{
                width:"500px",
                buttons:["确定","取消"],
                dialogTitle:options.dialogTitle || "从联系人添加"
            });

            this.addressBook = new M2012.UI.Widget.Contacts.View({
                container: this.dialog.$(".AddressBookContainer")[0],
                showLastAndCloseContacts: options.showLastAndCloseContacts,
                showVIPGroup: options.showVIPGroup,
                showSelfAddr:options.showSelfAddr,
                maxCount: options.maxCount,
                selectMode:true,
                filter:this.filter,
				isAddVip:options.isAddVip,
                comefrom:options.comefrom
            }).render().on("additem", function (e) {
                if (e.isGroup) {
                    var list = e.value;
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        This.onAddItem(item.name, item.addr,item.serialId);
                    }
                } else {
                    This.onAddItem(e.name, e.addr,e.serialId);
                }
            }).on("removeitem",function(e){
                This.onRemoveItem(e.addr,e.serialId);
            }).on("additemmax", function (e) {
                This.trigger("additemmax");
            });

            this.on("print",function(){
                //初始化组件的时候，有可能用户已经添加了部分联系人
                if(options.items){
                    this.addressBook.addSelectedItems(options.items);
                }
            });

            this.setElement(this.dialog.el);

            this.setTips({
                contactsLength:this.addressBook.model.getContacts().length,
                receiverText:options.receiverText || "接收人"
            });

            this.initEvent();

            return superClass.prototype.render.apply(this, arguments);
        },
        selectedTemplate: ['<a hidefocus="1" data-contactsid ="{serialId}"  data-addr="{addr}" href="javascript:;" class="lia">',
            '<i class="i_del"></i>',
            '<span>{sendText}</span>',
        '</a>'].join(""),
        initEvent:function(e){
            var This = this;
            this.$(".addFcRight").click(function(e){
                if(e.target.className == "i_del"){
                   
					var addr = e.target.parentNode.getAttribute("data-addr");
					if(This.options.isAddVip){
						addr = e.target.parentNode.getAttribute("data-contactsid");
					}
					This.addressBook.removeSelectedAddr(addr);
                }
            });
        },
        onAddItem:function(name,addr,serialId){
            var sendText = this.filter == "email" ? M139.Text.Email.getSendText(name,addr) :
                M139.Text.Mobile.getSendText(name,addr);
            var html = M139.Text.format(this.selectedTemplate,{
                addr:M139.Text.Html.encode(addr),
                sendText:M139.Text.Html.encode(sendText),
                serialId:M139.Text.Html.encode(serialId)
            });
            $(".addFcRight").append(html);
        },
        onRemoveItem:function(addr,serialId){
           if(!this.options.isAddVip){
				this.$("a[data-addr='"+addr+"']").remove();
			}else{
				this.$("a[data-contactsid='"+serialId+"']").remove();
			}
        },
        setTips:function(options){
            this.$(".Label_ContactsLength").html(options.contactsLength);
            this.$(".Label_ReceiverText").html(options.receiverText);
        },
        onSelect:function(){
            var items = this.addressBook.getSelectedItems();
            //默认返回的是["",""]，如果是getDetail返回[{},{}],可以有serialId等参数
            if (this.options.getDetail !== true) {
                for (var i = 0; i < items.length; i++) {
                    items[i] = items[i].value;
                }
            }
            this.trigger("select",{
                value:items
            });
        },
        onCancel:function(){
            this.trigger("cancel");
        }
    }));


     //扩展静态函数
    $.extend(M2012.UI.Dialog.AddressBook,
    /**@lends M2012.UI.Dialog.AddressBook*/
    {
        /**
        *创建实例
        *@param {Object} options 参数集
        *@example
        */
        create: function (options) {
            var view = new M2012.UI.Dialog.AddressBook(options).render();
            return view;
        }
    });
 })(jQuery,_,M139);