(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.FileExpress.Send.View.FileList', superClass.extend(
    {
        el: "body",
        template: ['<ul class="attrlistUl">',
				   		'<!--item start-->',
						'<li fileId="@getFileId()">',
							'<i class="@getFileIconClass()"></i>',
							'<span>@getShortFileName()</span>',
							'<span class="ml_5 gray">(@getFileSize())</span>',
							'<a href="javascript:void(0)" fid="@getFileId()" class="ml_5" name="btn_del">取消</a>',
						'</li>',
						'<!--item end-->',
					'</ul>'].join(''),
        events: {
        },
        initialize: function (options) {
            this.model = options.model;
            return superClass.prototype.initialize.apply(this, arguments);       
        },
		//删除标签，并在数据源中删除
        initEvents: function () {
			var self=this;
			$("[name=btn_del]").click(function(){
                  var li=$(this).parents("li");
                  var fileId=li.attr("fileId");
                  self.model.deleteFile(fileId);
                  li.remove();
                  self.otherBind();
			});
			$("#clearall").click(function(){
				self.model.deleteFileAll();
				$("ul.attrlistUl").find("li").remove();		
				self.otherBind();
			});
        },
		//Repeater组件的一部分
		renderFunctions: {
			getFileId : function() {
				var row = this.DataRow;
				return row.fid || row.businessId || row.id+'';
			},
			getFileName : function() {
				var row = this.DataRow;
				return row.fileName || row.filename || row.name;
			},
			getShortFileName : function() {
				var row = this.DataRow;
				var name = row.fileName || row.filename || row.name;
				var point = name.lastIndexOf(".");
				if(point == -1 || name.length - point > 5){
					return name.substring(0, 45) + "…";
				}
				var tmp = name.replace(/^(.{45}).*(\.[^.]+)$/, "$1…$2");
				return $T.Html.encode(tmp);
			},
            getFileSize : function() {
				var row = this.DataRow;
				var fileSize = row.fileSize || row["size"] || row["file"]["fileSize"];
				return $T.Utils.getFileSizeText(fileSize);
			},
            getFileIconClass: function () {
                var row = this.DataRow;
                var fileName = row.fileName || row.filename || row.name;
                return $T.Utils.getFileIcoClass(0, fileName);
            }
		},
		//数据绑定
		dataBind: function(){
			var self = this;
			var data1 = this.getDataSource();
			self.repeater = new Repeater(self.template);			
		    self.repeater.Functions = self.renderFunctions;
		    var array1 = (data1 == null?[]:data1.fileList);
			var data=_.toArray(array1); //跨页传递
		    var html = self.repeater.DataBind(data);
			$(".writeattrlist").html(html);
			
		},
		//文件总数，文件大小，文件超出提醒
		otherBind: function(){
			var self = this;
			var total = self.model.getTotalFileSize();
            $("#total_size").html(total);

            var num = self.model.getNumOfFile();
            $("#total_num").html(num);
            self.model.promptDelAfterTen();
		//移动到model了,上面的方法即为调用
        //    var promptDelAfterTen = self.model.promptDelAfterTen();
        //    $("#promptDelAfterTen").html(promptDelAfterTen);
		},
        render: function () {
			this.dataBind();
			this.initEvents();//绑定数据事件
			this.otherBind();
        },
        // 初始化模型层数据
        getDataSource: function (callback) {
			// 返回model的数据
			return this.model.get("dataSource");
        }
    }));
})(jQuery, _, M139);

