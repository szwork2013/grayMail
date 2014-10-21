/**
 * @fileOverview 定义通讯录富文本框的插件
 */

(function (jQuery, _, M139) {
	var $ = jQuery;
	var namespace = "M2012.UI.RichInput.Plugin";
	M139.namespace(namespace,
	/**@lends M2012.UI.RichInput.Plugin */
	{
		AddrSuggest: function (richInput, maxItem) {
			M2012.Contacts.getModel().requireData(function () {
				richInput.addrSuggest = new M2012.UI.Suggest.AddrSuggest({
					textbox: richInput.textbox,
					filter: richInput.type,
					maxItem: maxItem
				}).on("select", function () {
					richInput.createItemFromTextBox();
				});
			});
		}
	});
})(jQuery, _, M139);