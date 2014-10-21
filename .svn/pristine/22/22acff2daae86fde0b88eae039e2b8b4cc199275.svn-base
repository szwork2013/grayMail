/**
    * @fileOverview 定义设置页验证安全锁密码View层的文件.
*/
/**
    *@namespace 
    *设置页验证安全锁密码View层
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.VerifyLock.View', superClass.extend(
        /**
        *@lends M2012.Settings.VerifyLock.View.prototype
        */
    {
        el: "",
        initialize: function () {
            this.model = new M2012.Settings.Model.VerifyLock.VerifyModel();
            var self = this;
            this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function () {
            return superClass.prototype.render.apply(this, arguments);
        },
        initEvents: function () {
            var self = this;
            $("#doOk").click(function () {
                self.model.setFolderPass(function (dataSource) {

                    alert(dataSource["code"]);

                })
            })
        }
    })
    );

    verifyView = new M2012.Settings.VerifyLock.View();
})(jQuery, _, M139);
