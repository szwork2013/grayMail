$(function(){
    module("M139.JSON");

    test("parse & stringify & tryEval", function () {
        ok(M139.JSON.parse,"M139.JSON.parse");
        ok(M139.JSON.tryEval,"M139.JSON.tryEval");
        ok(M139.JSON.stringify,"M139.JSON.stringify");
        //parse
        var json = '{"name":"Lily","age":17}';
        var obj = M139.JSON.parse(json);
        equal("Lily",obj.name,"parse string");
        equal(17,obj.age,"parse number");

        //stringify
        equal(M139.JSON.stringify(obj),json,"stringify");

        //tryEval
        var json_not_format = '{name:"Lily",age:17}';
        var obj = M139.JSON.tryEval(json);
        equal("Lily",obj.name,"tryEval string");
        equal(17,obj.age,"tryEval number");

    });
});