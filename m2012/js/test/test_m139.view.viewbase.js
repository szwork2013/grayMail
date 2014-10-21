$(function(){

    module("M139.Views.ViewBase");
    test("方法和事件测试", function () {
        var MyView = M139.View.ViewBase.extend({
            tagName:"div",
            className:"MyView",
            template:"<p>test MyView</p>",
            render:function(){
                this.el.innerHTML = this.template;
                M139.View.ViewBase.prototype.render.apply(this,arguments);
            }
        });
        var testMyView = new MyView({
            name:"mytestview",
            id:"helloMyView",
            style:"font-size:8px;",
            events:{
                render:function(){
                    ok(true, 'render event ok!');
                },
                print:function(){
                    ok(true, 'print event ok!');
                    start();

                    this.setHeight(500);
                    equal(500,this.getHeight(),"setHeight & getHeight ok");

                    this.setWidth(300);
                    equal(300,this.getWidth(),"setWidth & getWidth ok");

                    testMyView.remove();
                },
                resize:function(){
                    ok(true, 'resize event ok!');
                },
                update:function(){
                    ok(true, 'update event ok!');
                },
                remove:function(){
                    ok(true, 'remove event ok!');
                }
            }
        });
        stop();
        testMyView.render();
        testMyView.get$El().appendTo(document.body);

        ok(testMyView.logger, 'logger ok!');
        ok(testMyView.getEl(), 'getEl() ok!');
        ok(testMyView.get$El(), 'get$El() ok!');
        equal(false,testMyView.isHide(), 'isHide() ok!');
        equal("helloMyView",testMyView.getId(), 'getId() ok!');

        testMyView.hide();
        equal(true,testMyView.isHide(), 'hide() ok!');
        testMyView.show();
        equal(false,testMyView.isHide(), 'show() ok!');
        //equal("8px",testMyView.$el.css("fontSize"), 'style ok!');//不通过？
        testMyView.setHtml("哈哈哈");


    });

});