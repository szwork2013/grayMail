$(function(){
    module("M139.PageApplication");


    test("members", function () {
        ok(M139.PageApplication,"M139.PageApplication");
        var pageApp = new M139.PageApplication({
            name:"myTestApp"
        });
        var data = {name:"Lily",age:18}
        var storageId = pageApp.setStorage(data);
        var new_data = pageApp.getStorage(storageId);
        deepEqual(data,new_data,"setStorage,getStorage");
        
    });


    test("await test '&'", function () {
        ok(M139.PageApplication,"M139.PageApplication");
        var pageApp = new M139.PageApplication({
            name:"myTestApp"
        });
        stop();
        var count = 0;
        pageApp.await("initdataload & editorload",function(){
            equal(count,3,"await with '&' ok");
            start();
        });
        setTimeout(function(){
            count += 1;
            pageApp.makeReady("initdataload",{data:[]});
        },100);
        setTimeout(function(){
            count += 2;
            pageApp.makeReady("editorload",{data:[]});
        },200);

    });

    test("await test '|'", function () {
        var pageApp = new M139.PageApplication({
            name:"myTestApp2"
        });
        stop();
        var count = 0;
        pageApp.await("initdataload | editorload",function(){
            equal(count,1,"await with '|' ok");
            start();
        });
        setTimeout(function(){
            count += 1;
            pageApp.makeReady("initdataload",{data:[]});
        },100);
        setTimeout(function(){
            count += 2;
            pageApp.makeReady("editorload",{data:[]});
        },200);

    });

    test("await test ','", function () {
        var pageApp = new M139.PageApplication({
            name:"myTestApp3"
        });
        stop();
        var count = 0;
        pageApp.await("initdataload , editorload",function(){
            if(count == 1){
                count += 1;
            }else{
                equal(count,4,"await with ',' ok");
                start();
            }
        });
        setTimeout(function(){
            count += 1;
            pageApp.makeReady("initdataload",{data:[]});
        },100);
        setTimeout(function(){
            count += 2;
            pageApp.makeReady("editorload",{data:[]});
        },200);
    });
});