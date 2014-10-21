M139.namespace("M2012.ReadMail.View", {
    ConversationSetting: Backbone.View.extend({
        el:"body",
        events:{

        },
        template: [ '<div class="alias-set-box">',
                         '<div class="boxIframeText ">',
                             '<dl class="form">',
                                 '<dt class="formLine pl_20 fw_b">会话邮件排序：</dt>',
                                 '<dd class="formLine pl_30" bh="cMail_toolbar_sort_new2old">',
                                     '<input type="radio" id="covMail_set_sort_asc" name="covMail_set_sort" value="1">',
                                     '<label for="covMail_set_sort_asc">按邮件从新到旧排序</label>',
                                 '</dd>',
                                 '<dd class="formLine pl_30" bh="cMail_toolbar_sort_old2new">',
                                     '<input type="radio" id="covMail_set_sort_desc" name="covMail_set_sort" value="0">',
                                     '<label for="covMail_set_sort_desc">按邮件从旧到新排序</label>',
                                 '</dd>',
                             '</dl>',
                             '<dl class="form pt_0">',
                                 '<dt class="formLine pl_20 fw_b">进入会话邮件后：</dt>',
                                 '<dd class="formLine pl_30" bh="cMail_toolbar_unexpand">',
                                     '<input type="radio" id="covMail_set_expand_none" name="covMail_set_expand" value="0">',
                                     '<label for="covMail_set_expand_none">不展开任何邮件</label>',
                                 '</dd>',
                                 '<dd class="formLine pl_30" bh="cMail_toolbar_expand">',
                                     '<input type="radio" id="covMail_set_expand_latest" name="covMail_set_expand" value="1">',
                                     '<label for="covMail_set_expand_latest">展开最新一封邮件</label>',
                                 '</dd>',
                             '</dl>',
                         '</div>',
                 '</div>'].join(""),

        initialize: function(options){
           if (options.el) {
               this.setElement(options.el);
           }
        },
        render:function(){
            var self = this;
            var popup=M139.UI.Popup.create({
                        name:"covMail_set",
                        target:$(self.el).find("#btn_setting")[0],//document.getElementById("btn_setting"),
                        buttons: [{ 
                                    text: "确定", 
                                    cssClass: "btnSure", 
                                    click: function () { self.saveSetting(); BH('cMail_toolbar_set_confirm'); } 
                                  },
                                  {
                                    text:"取消",
                                    click:function(){popup.close();BH('cMail_toolbar_set_cancel');}
                                  }],
                        content: this.template,
                        autoHide:true
                    });
            this.popup=popup;        
            popup.render();
            
            var covMaiSet = $App.getUserCustomInfo('covsetting') || '10';
            var sort = covMaiSet.slice(0, 1);
            var expand = covMaiSet.slice(1, 2);
            var len = $('[name=covMail_set_sort][value='+sort+']').length
            $('[name=covMail_set_sort][value='+sort+']').attr('checked', true);
            $('[name=covMail_set_expand][value='+expand+']').attr('checked', true);

            popup.on("close", function (args) {            
                if ($(args.event.target).parents(".menuPop").length > 0) {
                    args.cancel = true;
                }            
            });
        },

        saveSetting: function() {
            var sort = $('[name=covMail_set_sort]:checked').val();
            var expand = $('[name=covMail_set_expand]:checked').val();
            $App.setUserCustomInfoNew({covsetting: ''+sort+expand}, function(){
                $App.trigger('changeCovMailSetting');
                BH(sort == 1 ? 'cMail_toolbar_sort_new2old_bh' : 'cMail_toolbar_sort_old2new_bh');
                BH(expand == 1 ? 'cMail_toolbar_expand_bh' : 'cMail_toolbar_unexpand_bh');
            });
            this.popup.close();
        }
    })
});