(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Product.BirthdayWish.View', superClass.extend(
    {

        el: "body",
        template: "",

        initialize: function (options) {
            this.model = new M2012.Product.BirthdayWish.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },


        initEvents: function () {

            var self = this;

            //右上角关闭按钮
            $("#closeWishWindow").click(function () {
                self.model.close();
            });

            //地址栏联想
            self.richInput = M2012.UI.RichInput.create({
                container: document.getElementById('toContainerInner'),
                maxSend: top.$User.getMaxSend(),
                preventAssociate: true,
                type: "email",
                //height:60,
                errorfun: function () {}
            });
            self.richInput.render();

            //通讯录
            $('#contacts').bind('click', function () {
                var items = self.richInput.getValidationItems(self.richInput);
                var view = top.M2012.UI.Dialog.AddressBook.create({
                    filter: "email",
                    items: items
                });
                view.on("select", function (e) {
                    self.richInput.insertItem(e.value.join(";"));
                    //清空
                });
            });
            $('#toContainerInner').click(function () {
                $(this).next().remove();

            });

            $("#sendbtn").click(function () {
                top.BH('birthdayWish_send');

                $('#toContainerInner').next().remove();

                if (self.richInput.getErrorText()) {
                    var wrongTips = self.model.tips.wrongAddress;
                    $('#toContainer').append(wrongTips);
                    //$('#toContainerInner').next().delay(2000).remove();
                    //self.richInput.showEmptyTips("请正确填写收件人的邮箱地址");
                    return;
                }


                var address = self.getValidationItems(self.richInput);
                if (address.length == 0) {
                    var emptyTips = self.model.tips.emptyAddress;
                    $('#toContainer').append(emptyTips);
                    //self.richInput.showEmptyTips("请填写收件人");
                    return;
                }

                

                address = address.join(',')
                
                self.model.set({'param':
                    {
                        //to: self.model.getUserName(),
                        email: address,
                        content: self.model.getSendBody(),
                        subject: self.model.getSendTitle(),
                        showOneRcpt: 1,
                        callback: self.model.sendCallback

                    }
                })

                var mailInfo = self.model.get('param');
                self.model.sendMail(mailInfo);
                //self.close();
            });

            $("#otherWish").focus(function () {
                $(this).removeClass('gray');
                if ($(this).val() == '愿望不怕多，全部写来告诉TA') {
                    $(this).val('');
                    self.model.set({ 'otherWish': true });
                }
            }).blur(function () {
                $(this).addClass('gray');
                if ($(this).val() == '') {
                    $(this).val('愿望不怕多，全部写来告诉TA');
                }
            });

            this.model.getUserName();
            var hasName = this.model.get('hasName');

            if (hasName) {
                $('#customName').hide();
            } else {
                $('#customName').focus(function () {
                    $(this).removeClass('gray').attr('value','');
                });
            };
                



        },



        

        
        
        getValidationItems: function (richInput) {
            var items = richInput.getItems();
            var result = [];
            for (var i = 0; i < items.length; i++) {
                if (!items[i].error) {
                    result.push(items[i].allText);
                }
            }
            return result;
        }


    }));
    
    $(function () {

        window.birthdayWish = new M2012.Product.BirthdayWish.View();

        birthdayWish.initEvents();
    });
    
})(jQuery, _, M139);

