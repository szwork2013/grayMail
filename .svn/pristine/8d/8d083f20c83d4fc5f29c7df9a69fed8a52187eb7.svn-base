;(function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase;
    var _class = "M2012.Calendar.Model.Weather";

    M139.namespace(_class, superClass.extend({

        name: _class,

        EVENTS: {
            LOAD_WEATHER_ERROR: "获取天气信息失败，请稍后再试！"
        },

        logger: new M139.Logger({ name: _class }),

        defaults: {
            master: null
        },
        initialize: function (args) {

            args = args || {};
            this.master = args.master;

        },

        //获取天气预报信息
        getDefaultWeather: function (fnSuccess, fnError) {

            var self = this;
            self.master.trigger(self.master.EVENTS.REQUIRE_API, {

                success: function (api) {

                    api.getDefaultWeather({
                        data: {},
                        success: function (result) {
                            if (result.code == "S_OK") {
                                fnSuccess && fnSuccess(result["var"]);

                            } else {
                                var msg = self.EVENTS.LOAD_WEATHER_ERROR;

                                fnError && fnError(msg);
                                self.logger.error(msg, result);
                            }
                        },
                        error: function (e) {

                            fnError && fnError(self.EVENTS.LOAD_WEATHER_ERROR);
                        }
                    });
                }

            });
        
        }
    }));


})(jQuery, _, M139, window._top || window.top);