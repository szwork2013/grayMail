;
(function($, _, M) {

    var superClass = M.Model.ModelBase;

    /**
     * 通讯录-拖拽 的模型
     * @type {string}
     * @private
     */
    var _class = "M2012.Addr.Model.Dragdrop";
    M.namespace(_class, M.Model.ModelBase.extend({

        name : _class,

        defaults : {
            message : "", // 拖拽显示的消息
            status : 0 // 0 初始化 1 拖动目标已命中 2 拖动目标已未命中 3 拖动中
        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
        },

        initStatus : function() {
            this.set("status", 0);
        },

        isInitStatus : function() {
            return this.get("status") == 0;
        },

        setTargetHit : function() {
            this.set("status", 1);
        },

        isTargetHit : function() {
            return this.get("status") == 1;
        },

        setTargetMiss : function() {
            this.set("status", 2);
        },

        isTargetMiss : function() {
            return this.get("status") == 2;
        },

        setMoving : function() {
            this.set("status", 3);
        },

        isMoving : function() {
            return this.get("status") == 3;
        }
    }));

})(jQuery, _, M139);
