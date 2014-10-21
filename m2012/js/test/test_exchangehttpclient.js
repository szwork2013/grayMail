M139.core.requireJS(["M139.ExchangeHttpClient"],function(){
    //注册一个转换http request报文的处理对象
    M139.ExchangeHttpClient.registerExchangeDataType({
        dataType:"ObjectToXML",
        exchangeData:function(data){
            return "<object></object>";
        },
        exchangeHeader:function(headers){
            if(!headers)headers={};
            headers["Content-Type"] = "application/xml";
            return headers;
        }
    });
    //注册一个转换http response报文的处理对象
    M139.ExchangeHttpClient.registerExchangeDataType({
        dataType:"JSONToObject",
        exchangeData:function(responseText){
            var obj = null;
            try{
                obj = eval("("+responseText+")");
            }catch(e){}
            return obj;
        }
    });

    var httpClient = new M139.ExchangeHttpClient({
        name:"mytestClient"
    });

    httpClient.request({
        method:"post",
        data:{
            name:"Lily",
            age:28
        },
        requestDataType:"ObjectToXML",
        responseDataType:"JSONToObject",
        url:"/s?func=listMessage"
    }).on("response",function(e){
        console.dir(e);
        console.dir(e.getHeaders());
    });
});