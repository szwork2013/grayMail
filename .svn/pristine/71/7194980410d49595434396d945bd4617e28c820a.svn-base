M139.core.requireJS(["M139.HttpClient"],function(){
    var httpClient = new M139.HttpClient({
        name:"mytestClient"
    });
    httpClient.request({
        method:"post",
        data:"a=1",
        url:"/s?func=listMessage",
        headers:{
            "Content-Type":"text/javascript"
        }
    }).on("response",function(e){
        console.dir(e);
        console.dir(e.getHeaders());
    });
});