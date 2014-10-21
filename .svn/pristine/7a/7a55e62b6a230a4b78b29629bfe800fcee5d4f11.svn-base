/**
 * @fileOverview 定义Model基类.
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    /**
   *@namespace
   */
    M139.Model = {};
    var superClass = Backbone.Model;
    M139.Model.ModelBase = superClass.extend(
    /**
    *@lends M139.Model.ModelBase.prototype
    */
    {
        /**
        *规范化的Model的基类,主要为了统一常用事件、方法的命名
        *它规定实例化的参数必须是Object类型，事件参数必须是Object类型，类必须有name属性
        *@constructs M139.Model.ModelBase
        *@require M139.Logger
        *@param {Object} options 参数集合
        *@example
        */
        initialize: function (options) {

            var name = this.name || this.get("name");

            /**
             *日志对象
             *@filed
             *@type {M139.Logger}
            */
            this.logger = new M139.Logger({ name: name || "ModelBase" });

            if (name == null) {
                throw "继承自ModelBase的类型缺少name属性";
            }
            if (options && !_.isObject(options)) {
                throw "继承自ModelBase的类型初始化参数必须为Object类型";
            }
        },

        /**
         *覆盖基类的trigger方法，对事件参数给予约束，data必须是Object类型
         */
        trigger: function (eventName, data) {
            if (typeof data == "undefined") {
                data = {};
            }
            if (!_.isObject(data)) {
                throw this.get("name") + ".trigger(" + eventName + ")" + "方法必须使用Object数据参数";
            }
            return superClass.prototype.trigger.apply(this, arguments);
        }

    });

})(jQuery, _, M139);