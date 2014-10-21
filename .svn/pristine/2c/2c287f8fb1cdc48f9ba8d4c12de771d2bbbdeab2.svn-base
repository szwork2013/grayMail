$(function(){
    module("M139.Dom");
    test("common test", function () {
        ok(M139.Dom.isHide,"M139.Dom.isHide");
        ok(M139.Dom.containElement,"M139.Dom.containElement");
        ok(M139.Dom.findParent,"M139.Dom.findParent");
        ok(M139.Dom.isRemove,"M139.Dom.isRemove");

        //hide
        var isHide_1 = M139.Dom.isHide(document.body);
        equal(false,isHide_1,"isHide document.body");
        var jDDD = $("<div id='ddd' style='display:none'><p id='ddd_sub'></p></div>").appendTo(document.body);
        var isHide_2 = M139.Dom.isHide(jDDD[0]);
        equal(true,isHide_2,"isHide :hidden");

        var isHide_3 = M139.Dom.isHide($("#ddd_sub")[0]);
        equal(false, isHide_3 ,"isHide parent:hidden");

        var isHide_4 = M139.Dom.isHide($("#ddd_sub")[0],true);
        equal(true, isHide_4,"isHide parent:hidden:true");

        //containElement
        var isContainElement = $D.containElement(jDDD[0],$("#ddd_sub")[0]);
        var isContainElementFalse = M139.Dom.containElement($("#ddd_sub")[0],jDDD[0]);
        equal(true, isContainElement,"containElement true");
        equal(false, isContainElementFalse,"containElement false");

        //findParent
        var findParent = $D.findParent($("#ddd_sub")[0],"div");
        equal(jDDD[0], findParent,"findParent");

        //remove
        jDDD.remove();
        var isRemove = M139.Dom.isRemove(jDDD[0]);
        equal(true, isRemove,"isRemove");

    });
});