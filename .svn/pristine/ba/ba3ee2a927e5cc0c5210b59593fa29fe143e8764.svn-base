/**
 * @fileOverview 定义选择文件组件
 */
(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	var superClass = M139.PageApplication;
	M139.namespace("M2012.UI.SelectFile.Application", superClass.extend(
	/**@lends M2012.UI.SelectFile.Application.prototype*/
	{
		/**
		 *选择文件App对象
		 *@constructs M2012.UI.SelectFile.Application
		 *@extends M139.PageApplication
		 *@param {Object} options 初始化参数集
		 *@example
		 */
		initialize : function(options) {
			superClass.prototype.initialize.apply(this, arguments);
		},
		defaults : {
			/**@field*/
			name : "M2012.UI.SelectFile.Application"
		},
		/**主函数入口*/
		run : function() {
			selectFileModel = new M2012.UI.SelectFile.Model();
		    selectFileView = new M2012.UI.SelectFile.View.Main({model : selectFileModel});
		    selectFileView.initEvents();
			selectFileView.render();
		}
	}));
	$selectFileApp2 = new M2012.UI.SelectFile.Application();
	$selectFileApp2.run();
})(jQuery, Backbone, _, M139);
