/**
 * @
 */
(function (jQuery, Backbone, _, M139) {
    var $ = jQuery;
    M139.namespace("M2012.FileExpress.Success.Model", Backbone.Model.extend({
        defaults: {
            sendType: "", //发送类型
            fileList: [], //已选文件
            dataSource: {}
        },
        initialize: function (options) {
            var pageApp = new M139.PageApplication({ name: 'success' });
            this.set("dataSource", pageApp.inputData);
            this.initevent();
            console.log(this.get("dataSource"));
        },
        initevent: function(){
            var t = document.getElementById("divSaveSendContacts").innerHTML;
            if(t.length !=""){
                document.getElementById("divSaveSendContacts").style.display = "block";
            }
        },
        //获取文件个数
        getNumOfFile : function(){
            return this.get("dataSource").files2.length;
        },
        //获取得到的邮箱列表
        getListMailArray : function(){
            return this.get("dataSource").input2.emails;
        },
        //获取得到的手机号码列表
        getListMobileArray: function(){
            return this.get("dataSource").input2.mobiles;
        },
        //获取文件总大小
        getTotalFileSize: function () {
            var data = this.get("dataSource").files2;
            var total = 0;
            $.each(data,function(i){
				var row = this;
				var fileSize = row.fileSize || row["size"] || row["file"]["fileSize"];
                total += parseInt(fileSize);
            });
            return $T.Utils.getFileSizeText(total);
        }
    }));
})(jQuery, Backbone, _, M139);
