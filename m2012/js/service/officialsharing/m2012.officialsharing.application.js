﻿/**
 * @fileOverview 定义彩云页面App对象
 */
(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	var superClass = M139.PageApplication;
	M139.namespace("M2012.Officialsharing.Application", superClass.extend(
	/**@lends M2012.MainApplication.prototype*/
	{
		/**
		 *彩云页App对象
		 *@constructs M2012.Disk.Application
		 *@extends M139.PageApplication
		 *@param {Object} options 初始化参数集
		 *@example
		 */
		initialize : function(options) {
			superClass.prototype.initialize.apply(this, arguments);
		},
		defaults : {
			/**@field*/
			name : "M2012.Disk.Application"
		},
		/**主函数入口*/
		run : function() {
			var diskModel = new M2012.Officialsharing.Model();
			var options = {
				model : diskModel
			};
			mainView = new M2012.Officialsharing.View.Main(options);
			mainView.initEvents();
			mainView.render();
			BH({key : "diskv2_load"});
			BH({key : "officialsharing_onload"});
		}
	}));
	$diskApp = new M2012.Officialsharing.Application();
	$diskApp.run();
})(jQuery, Backbone, _, M139);
