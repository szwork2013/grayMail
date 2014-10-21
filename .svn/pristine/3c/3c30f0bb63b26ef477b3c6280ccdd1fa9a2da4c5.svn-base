;(function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var currentClass = "M2012.Calendar.View.Component";

    M139.namespace(currentClass, superClass.extend({

        initialize: function (options) {
            this.wrapinput = null;
            this.isEdit = options.isEdit || 1,//1编辑 -1只读
            this.render();
        },

        /**
         * 初始化界面
         */
        render: function () {
            var template = $T.Utils.format(this._template, {
                cid: this.cid,
                title: this.title,
                titleName: this.titleName
            });

            $(template).appendTo(this.wrap);
            this.kepElements();

            this.initEvents();
        },
        /**
         * 添加事件
         */
        initEvents: function () {

        },


        /**
         * 保存dom节点
         */
        kepElements: function () {

        },
        /**
         * 更新数据
         * @param val
         */
        setData: function (val) {

            this.obj = val;
        },
        /**
         * 绑定数据
         * @param obj
         */
        bindData: function (obj) {
            this.setData(obj);
            this.oldVal = obj;
        },
        isChanged: function () {

            return this.oldVal !== this.getData()
        },
        setReadOnly: function () {
            $("#" + this.cid + '_ControlReadEl').show();
        },
        /**
         * 验证
         */
        validate: function () {

        },
        getMessage: function () {

            this.trigger('message');

            return this.message;
        },
        setMessage: function (message) {
            this.message = message;
        },
        /**
         * 获取数据
         * @return {*}
         */
        getData: function () {
            return this.obj;
        },
        /**
         * 获取模板
         * @return {String}
         */
        getTemplate: function () {
            return "";
        },
        /**
         * 显示
         */
        show: function () {
        },
        /**
         * 隐藏
         */
        hide: function () {
        },
        _requireTemplate: '<span class="red f_st" title="必填项" >*</span>',
        _template: ''
    }));

})(jQuery, _, M139, window._top || window.top);