/**
 * @fileOverview 定义配置依赖项.
 */
(function (jQuery, M139) {
    var $ = jQuery;

    M139.ConfigManager = Backbone.Model.extend(
     /**
        *@lends M139.ConfigManager.prototype
        */
    {
        /** 配置处理类，实例化后为$Config
        *@constructs M139.ConfigManager
        */
        initialize: function () {
            this._configs = {};
        },
        /**
        *批量添加配置数据
        *@param {String} configName 一组配置的名称
        *@param {Object} configSet 一组配置值，{key:value}的形式
        *@example
        $Config.registerConfig("SiteConfig",{
            "Site1":"http://images.139cm.com",
            "Site2":"http://www.baidu.com"
        });
        */
        registerConfig: function (configName, configSet) {
            var This = this;
            if (configSet instanceof Array) {   //数组
                this._configs[configName] = configSet;
            } else {
                $.each(configSet, function (key, value) {
                    This.setConfig(configName, key, value);
                });
                this.trigger("register", {
                    configName: configName,
                    configValue: configSet
                });
            }
        },
        /**
        *添加配置数据
        *@param {String} configName 一组配置的名称
        *@param {String} key 配置名
        *@param {String|Number} value 配置值，最好不要传对象，虽然没有禁止
        *@example
        $Config.setConfig("SiteConfig","Site1","http://images.139cm.com");
        */
        setConfig: function (configName, key, value) {
            var configSet = this._configs[configName];
            if (!configSet) {
                configSet = this._configs[configName] = {};
            }
            configSet[key] = value;
            /**配置更新事件
                * @name M139.ConfigManager#update
                * @event
                * @param {Object} e 事件参数
                * @param {String} e.configName 变动的配置集合名
                * @param {String} e.key 变动的配置键
                * @param {String|Number} e.value 变动的配置值
                * @example
                $Config.on("update",function(e){
                });
            */
            this.trigger("update", {
                configName: configName,
                key: key,
                value: value
            });
        },
        /**
        *读取配置数据
        *@param {String} configName 一组配置的名称
        *@param {String} key 配置名
        *@example
        $Config.getConfig("SiteConfig","Site1");
        */
        getConfig: function (configName, key) {
            if (arguments.length == 1) {
                return this._configs[configName];
            } else {
                return this._configs[configName] && this._configs[configName][key];
            }
        },
        /**
        *在控制台打印当前托管的所有配置值
        */
        showAll: function () {
            try {
                console.log(M139.JSON.stringify(this._configs, "", "    "));
            } catch (e) { }
        }
    });
    //定义缩写
    window.$Config = new M139.ConfigManager();

})(jQuery, M139);