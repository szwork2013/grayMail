/**
 * @fileOverview 定义写信页App对象
 */
(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	var superClass = M139.PageApplication;
	M139.namespace("M2012.Fileexpress.Cabinet.Application", superClass.extend(
	/**@lends M2012.MainApplication.prototype*/
	{
		/**
		 *暂存柜页App对象
		 *@constructs M2012.Fileexpress.Cabinet.Application
		 *@extends M139.PageApplication
		 *@param {Object} options 初始化参数集
		 *@example
		 */
		initialize : function(options) {
			superClass.prototype.initialize.apply(this, arguments);
		},
		defaults : {
			/**@field*/
			name : "M2012.Fileexpress.Cabinet.Application"
		},
		/**主函数入口*/
		run : function() {
			var cabinetModel = new M2012.Fileexpress.Cabinet.Model();
			var options = {
				model : cabinetModel
			};
			mainView = new M2012.Fileexpress.Cabinet.View.Main(options);
			mainView.initEvents();
			mainView.render();
			
			BH({key : "fileexpress_cabinet_loadsuc"});
		}
	}));
	$cabinetApp = new M2012.Fileexpress.Cabinet.Application();
	$cabinetApp.run();
})(jQuery, Backbone, _, M139);
