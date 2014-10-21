/**和笔记-- 记事列表
*  总括：
*  1:记事列表渲染
*  注：用repeater生成Dom并append的时候不能再进行渲染，因为记事标题或内容会出现script等Xss内容。
*  2:记事列表高亮事件
*  3:记事列表行点击事件
*/
M139.namespace("M2012.Note.View.ListView", Backbone.View.extend({
    el: "body",
    template: "",
    events: {
        "click .notli": "rowClick",
        "click #btn_search": "searchNote"
    },
    initialize: function(options) {
        this.model = options.model;
        this.initEvents();
    },
    initEvents:function(){
        var self = this;
        //加载记事列表数据
        self.model.on("reloadListData", function(args) {
            var reload = args.reload;
            self.render(reload, function() {
                if(args.callback) {
                   args.callback();
                }
            });
        });
        $('#tip_search a').click(function(){
            $(this).parent('#tip_search').hide();
            $('#tb_search').val('').trigger('blur');
            self.model.set({
              searchResult:null,
              showFirstNote:0
            });
            self.render(false);

        });

        //为搜索功能绑定键盘功能
        $("#tb_search").bind({
            keyup: function(e) {
                var _self = $(this);
                var key = e.keyCode;
                switch(key){
                    case 13:    //回车键   
                    self.model.searchNote($("#tb_search").val());
                    break;
                    case 18:    //Alt键 
                    break;
                    case 46:   //delete键
                    var val = _self.val();
                    if(val) _self.val(val.substring(0,val.length-1));  //模拟退格
                    break;
                    default:
                }
            }
        });

        //找到需要变化的li节点       
        function findParentList(obj) {
            var el = obj;
            var clz = el.attr("class");
            if(clz && clz.indexOf("notli") > -1 && clz.indexOf("notlititle") == -1) {
              return el;
            } else if(clz && clz.indexOf("notli") > -1 && clz.indexOf("notlititle") == -1) {
              return false;
            }
            el = el.parent();
            return arguments.callee(el);
        }
        //记事行的高亮效果
        $("#div_notelist").bind({
            mouseover: function(e) {
              var self = $(this);
              var target      = e.target;
              var collection  = self.find(".notli");
              var listDom     = findParentList($(target));
              var index       = collection.index(listDom);
              if(index > -1) {
                var isActived = (listDom.attr("locked") == "true");
                if(!isActived) {
                  listDom.addClass("hover");
                }
              }
            },
            mouseout: function(e) {
                var self = $(this);
                var target      = e.target;
                var collection  = self.find(".notli");
                var listDom     = findParentList($(target));
                var index       = collection.index(listDom);
                if(index > -1) {
                  var isActived = (listDom.attr("locked") == "true");
                  if(!isActived) {
                    listDom.removeClass("hover");
                  }
                }
            },
            click: function(e) {
                var _self = $(this);
                var target      = e.target;
                var collection  = _self.find(".notli");
                var listDom = findParentList($(target));
                var index = collection.index(listDom);
                if(index > -1) {
                    var isActived = (listDom.attr("locked") == "true");
                    if(!isActived) {
                        _self.find(".notli").removeClass("on").removeAttr("locked"); //重置
                        listDom.addClass("on").attr("locked", "true").removeClass('hover');
                    }
                }
            
                if (collection.length > 1) {
                    var nexindex = index == collection.length - 1 ? 0 : index;
                    self.model.set('nextIndex', nexindex);
                } else {
                    self.model.set('nextIndex', -1);
                }
            }
        });
    },
    //行点击事件
    rowClick: function(e) {
        BH('note_rowclick');
        var self = this;
        var target      = e.target || e.srcElement;
        var noteId      = $(target).attr("noteId") || $(target).parents("[noteId]").attr("noteId");
        var noteDetail    = this.model._getNoteDetail({noteId:noteId,callback:function(noteInfo){
            //编辑信息量，判断是否在编辑，用于判断自动保存
            var isEditing   = self.model.get("autoSave");   

            var setCollection = {       
                contentType: noteInfo['noteType'] || "TEXT", //设置内容类型 用于判断欢迎页面的HTML
                rowClick: true,           //重要  设置row点击事件 不与新建有冲突
                noteId: noteId,           //必须在noteId改变之前先赋值contentId
                noteInfo:noteInfo,
                autoSave: false
            }
            self.model.set(setCollection);
            self.model.trigger("autoSave", 0);
        }});
    },
    searchNote: function(e) {
        BH('note_search');
        var self = this;        
        var value = $("#tb_search").val();
        if($.trim(value) == ""){
          $("#tb_search").val('');
          return;
        } if (value == "搜索'和笔记'") {
            return
        }
        this.model._searchNote(value);
    },
    render: function(reload, callback) {
        var self = this;
        if(!reload) { //用本地数据刷新
          var data = this.model.get("searchResult");
          if(!data){
            data = this.model.get("noteListData");
            $('#tip_search').hide();
          }else{
            self.model.set('showFirstNote',0)
          }
          this.model.set("searchResult",null);
          dataBind(data);
          this.model.set("searchResult", null);
        } else {      //重新加载
            $('#tip_search').hide();
            this.model._getNoteList(function(dataSource) {
            dataBind(dataSource);            
            M139.UI.TipMessage.hide();
          });
        }
      /**
      *组装list Html进行渲染
      */
      function dataBind(dataSource) {
          var templateStr = $("#template_notelist").val();
          //排序是修改时间还是创建时间
          templateStr = templateStr.replace(/orderSet/, self.model.get("order"))
          var rp          = new Repeater(templateStr);
          var filterHtml  = ""; //过滤处理展示Html
          self.repeater   = rp;
          rp.model        = self.model;
          rp.view         = self;
          rp.Functions    = self.model.renderFunctions;
          var html        = rp.DataBind(dataSource); //数据源绑定后即直接生成dom             
          $("#div_notelist")[0].innerHTML = html;
          if(callback) {
              callback();
          }
          if (self.model.get('showFirstNote') == 0) {
              $('.notlist .notli').eq(0).trigger("click"); //jquery 的 trigger方法
              self.model.set({ 'showFirstNote': 1 });
          }
      }
    }
}) //end of extend
); //end of namespace