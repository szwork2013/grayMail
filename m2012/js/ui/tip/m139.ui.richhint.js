

    M139.core.namespace("M2012.UI.RichHint",
         Backbone.View.extend({
             histList: {},
             hintEl: null,
             register: function (target, titleHtml) {
                 var overTarget = false;
                 var overHint = false;
                 var T = this;
                 function createHint(sender) {
                     if ($(target).is(":visible")) { //target必须是可见的，未被销毁的

                         if (!T.hintEl) {//创建hint的dom,确保单例
                             T.hintEl = $("<div class='remarkTips shadow'></div>");

                             $(document.body).append(T.hintEl);
                         }
                         T.hintEl.unbind();//清除所有事件
                         T.hintEl.hide();//先不展示
                         if (_.isFunction(titleHtml)) {
                             T.hintEl.html(titleHtml(sender));
                         } else {
                             T.hintEl.html(titleHtml);
                         }



                         var offset = $(sender).offset();

                         offset.top = offset.top + $(sender).height() + 8;
                         T.hintEl.css({
                             "position": "absolute",
                             "left": offset.left + "px",
                             "top": offset.top + "px"
                         });//绝对定位
             
                         var showArgs = { sender: sender, el: T.hintEl, isShow: true };
                         T.trigger("show", showArgs);
                         if (showArgs.isShow) { //是否显示，在事件监听中可以禁止显示
                             T.hintEl.show();
                         } else {
                             T.hintEl.html("");
                             T.hintEl.hide();
                             return;
                         }

                         T.hintEl.hover(function () {
                             overHint = true;
                         }, function () {
                             overHint = false;
                             checkForDispear();
                         });
                         T.hintEl.click(function () {
                             
                             checkForDispear();
                         });
                     }
                 }
                 function initTarget() {

                     $(target).hover(function () { //target的划过时，停留500毫秒再创建hint
                         overTarget = true;
                         var sender = $(this);
                         setTimeout(function () {
                             //1.必须有一个over才创建，避免移出后，由于延时执行创建导致的死灰复燃.
                             //2.target必须是可见的，未被销毁的
                             if ($(target).is(":visible") && (overTarget || overHint)) {
                                 createHint(sender);
                             }
                         }, 1000);
                     }, function () {
                         overTarget = false;
                         checkForDispear();
                     });

                 }
                 function checkForDispear() {
                     setTimeout(function () {
                         if (!overTarget && !overHint) {
                             if (T.hintEl) {
                                 T.hintEl.html("");
                                 T.hintEl.hide();
                             }

                         }
                     }, 200);
                 }

                 initTarget();
             }

         })
    );

    (function (){
        $Hint = M2012.UI.RichHint.prototype;
    })();
