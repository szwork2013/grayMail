
//  <% if(RegExp("/[\u4e00-\u9fa5]/"))

// 添加测试数据
function randomNumber( total ){
  return Math.floor(Math.random()*total);
};

function randomName( counters , opts){
        var name_tpl , 
            result = [],
            default_tpl = ["燃" , "烧2" , "群称群称" , "名称", "老鼠", "团队" ,"很长常常的阿萨德就是"];
            opts = opts || {};
            if(counters === undefined ){
                counters = 1;
            }
            if(opts.names){
              name_tpl  = opts.names ;
            }else{
              name_tpl = default_tpl ;
            }
            for( var i = 0 ; i < counters ; ++i ){
              result.push(name_tpl[Math.floor(Math.random()*name_tpl.length)] + name_tpl[Math.floor(Math.random()*name_tpl.length)]);
            }
          return result;
        }; 

function buildGroupData( num ){
    var names = randomName( num );
    var groupNumber = 10001;
    var result = [] ;
    var totalMsgCount , readCount;
    for( var i = 0 ; i < num ; ++i ){
        totalMsgCount = Math.floor( Math.random() * 99 );
        readCount = Math.floor( Math.random() * totalMsgCount );
        result.push({
                "groupNumber": ++groupNumber,
                "groupName": names[i],
                "imageUrl": "GFL234-123dsf3-123xcgdfg2-123123",
                "groupDescription": names[i],
                "createTime": "2014-05-31 13: 45: 25",
                "modifyTime": "2014-05-31 13: 45: 25",
                "totalUserCount": Math.floor( Math.random() * 99 ) ,
                "totalMsgCount": totalMsgCount,
                "status": "0",
                "readCount": readCount
            })
    }
    return result;
}
/**
 * 构造虚拟用户
 * @return {[type]} [description]
 */
var getUserData = (function(){
  var u_id = 1 ,
      u_name = randomName(10 , {
        names : ["Jim", "Green" , "小", "刘" , "mingj" , "Jakj","赵","李","金" , "J" ,"M" , "3" , "5a" , "b"] ,
        reset : true
      }),
      u_data = [];
      for(var i = 0 ; i < u_name.length ; ++i ){
        u_data.push({
          userName : u_name[i] ,
          userId : u_id ++ ,
          userEmail : u_name[i] + "@xxx.com"
          // imageUrl:"http://placehold.it/50"
        });
      }
  return function(){
      return u_data[Math.floor(Math.random()*u_data.length)];
  };
})();

var getGroupData = (function(){
  var groups = buildGroupData(50) ;
  return function(){
    return groups[Math.floor(Math.random()*groups.length)];
  };

})();


var getMessageContent = (function(){
  var content = "Models are the heart of any JavaScript application,\
             containing the interactive data as well as a large \
             part of the logic surrounding it: conversions, validations, \
             computed properties, and access control. You extend Backbone.\
             Model with your domain-specific methods, and Model provides a\
              basic set of functionality for managing changes.The following \
              is a contrived example, but it demonstrates defining a model \
              with a custom method, setting an attribute, and firing an event\
               keyed to changes in that specific attribute. After running this code once, \
               sidebar will be available in your browser's console, so you can play around\
               1、我的日历内，剔除生日提醒的活动,\
                2、我的日历内，分拆出“订阅日历”下的活动，单独作为页签展现，与WEB侧保持一；,\
                3、列表视图增加查看往前20条记录的活动的功能；,\
                4、创建活动页面，符合手机侧的方式进行简化。时间可精确到分钟；,\
                5、新增农历时间提醒的设置\
                with it.".split(",");
  return function() {
     return content[Math.floor( Math.random() * content.length )];
  };
})();

function getTimeStamp(){
    return 1373010310 + randomNumber(999) * 10e8;
}

function getTimeFormat( formatStr ){
  var formatFn = {
    "YYYY" : "getFullYear" ,
    "MM" : "getMonth" ,
    "DD" : "getDay" ,
    "hh" : "getHours" ,
    "mm" : "getMinutes" ,
    "ss" : "getSeconds" ,
    "ms" : "getMilliseconds"
  };
  var time = new Date() , p ;
      time.setTime(1373010310 + randomNumber(999) * 10e8);
      for( p in formatFn ){
        if( formatFn.hasOwnProperty(p) ){
          var timeResult = time[formatFn[p]]();
          if( p === "MM"){
            timeResult += 1;
          }
          formatStr = formatStr.replace( p , timeResult );
        }
      }
    return formatStr ;
}

function buildMessageData( data ){
  var result = [],
      messageId = 0 ;
  for(var i = 0 ; i < data.length ; ++i ){
    var messageArr = [] , rMsgLength = Math.ceil(Math.random()*200 );
    for(var j = 0 ; j < rMsgLength ; ++ j ){
      messageArr.push({
                        "messageId" : ++messageId , 
                        "createDate" : getTimeFormat("YYYY-MM-DD hh:mm:ss"), 
                        "content" : getMessageContent(),
                        "contentThum" : getMessageContent(),
                        "replyTotalCount":5, 
                        "user":getUserData(),
                        "reply": [{
                           "messageId": randomNumber(rMsgLength), 
                           "parentId": "333",
                           "contentThum" : getMessageContent(),
                           "createDate": getTimeFormat("YYYY-MM-DD hh:mm:ss"),
                           "content": getMessageContent(), 
                           "user": getUserData()
                          }]
                    });
    }
    var totalMsgCount , readCount;
    totalMsgCount = messageArr.length;
    readCount = Math.floor( Math.random() * totalMsgCount );
    result.push({
        "code": "S_OK",
        "summary": "",
        "var": {
          "curPage":1,
          "totalRecord":messageArr.length, 
          "groupNumber": data[i].groupNumber,
          "groupName": data[i].groupName,
          "totalMsgCount": totalMsgCount,
          "status": "0",
          "unreadCount": readCount,
          "message" : messageArr
        }      
    });
    data[i].totalMsgCount = totalMsgCount;
    data[i].unreadCount = readCount;

  }
  return result ;
}


var gData = buildGroupData(50);

var mData = buildMessageData(gData);

$Mock.add({
    url: "gom:queryGroupList", //请求的服务接口名称，也可使用正则表达式
    responseTime : 100, //网络延时模拟值
    /*data : {//用来匹配请求参数(POST DATA)
        command : 1
    },*/
    response : function( request ) {//一个回调声明，可用于动态变更响应数据
      if( request.data._timer ){
        var responseData = this.responseText,
            key = randomNumber(gData.length);
          responseData.totalMsgCount;
        var modifiedData = gData[key];
        var modifiedMsgData = mData[key];
          try{
              var m_counters = randomNumber(5);
              modifiedData.totalMsgCount += m_counters;
              modifiedMsgData["var"].totalMsgCount = modifiedData.totalMsgCount;
              for(var i = 0 ; i < m_counters ; ++ i ){
                modifiedMsgData["var"].message.push({
                        "messageId":"123", 
                        "createDate":1373010310, 
                        "content":getMessageContent(), 
                        "replyTotalCount":5, 
                        "user":getUserData()
                    });
              }
            }catch(e){

            }
        }
      },
    responseText: {
        "code": "S_OK",
        "summary": "",
        "var": gData
    }

});

for(var k = 0 ; k < mData.length ; ++ k ){
  (function( order ) {
    $Mock.add({
      url: "gom:queryMessageList", 
      responseTime: 100,
      data : {
        groupNumber : mData[k]["var"].groupNumber
      },
      response : function( setings , xhr ){
        var request = setings.data;
        var pageIndex = request.pageIndex;
        var responseData = xhr.responseText;
        var totalPage = Math.ceil(responseData["var"].message.length / request.pageSize),
            counter = totalPage < pageIndex ? totalPage : pageIndex;
            responseData["var"].message = responseData["var"].message.slice( (counter - 1) * request.pageSize , counter * request.pageSize );
            responseData["var"].curPage = counter;
            gData[order].readCount = gData[order].totalMsgCount;
            // responseData.readCount = responseData.totalMsgCount;
      } ,
      responseText : mData[order]
  });
  })( k );
}

  /**
   * 群组邀请记录查询
   * @param  {[type]} settings     ){                } [description]
   * @param  {[type]} responseText :             {                         }  } [description]
   * @return {[type]}              [description]
   */
var buildRecord = (function(){
   var rId = 0;
  return function( counter ){
      var result = [] ; 
      for(var i = 0 ; i < counter ; ++ i ){
        var user = getUserData();
        var group = getGroupData();
        result.push({
                  "recordId": ++rId,
                  "inviterId": user["userId"],
                  "inviterName": user["userName"],
                  "groupNumber": group["groupNumber"],
                  "groupName": group["groupName"],
                  "imageUrl": "GFL234-123dsf3-123xcgdfg2-123123",
                  "groupDescription": group["groupDescription"],
                  "status": randomNumber(3),
                  "createTime": "2014-05-31 13: 45: 25",
                  "modifyTime": "2014-06-03 15: 40: 25"
                });
      }
      return result ;
    }
  })();


var groupInventData = buildRecord(50);

  $Mock.add({
    url : "gom:queryInvitedRecord" ,
    responseTime : 100 ,
    response : function( settings ){
      var query = settings.data ;
      var pageIndex = query.pageIndex ,
          pageSize = query.pageSize ;
      var response = this.responseText ; 
          response.curPage = query.pageIndex;
          response["var"] = groupInventData.slice( (pageIndex - 1)*pageSize , pageIndex*pageSize );
    },
    responseText : {
        "code": "S_OK",
        "summary": "",
        "curPage" : 1 ,
        "totalRecord" : groupInventData.length 
          }
   });

$Mock.add({
  url : "gom:invitationHandle" ,
  responseTime : 100 ,
  response : function( settings ){
      var query = settings.data ;
      var rid = query.recordId ,
          act = query.actionId ;
          _.find( groupInventData , function( item ){
            if( item["recordId"] === rid ){
              item["status"] = (act == 1) ? 2 : 3 ;
              return true ;
            }
          });
          console.log("come here ************>");
          this.responseText["code"] = "S_OK";
          this.responseText["summary"] = "成功加入群";
  },
  responseText : {
        "code": "S_OK",
        "summary": "成功加入群"
  }
});

$Mock.add({
  url : "gom:queryMessage" ,
  responseTime: 100, 
  response : function( settings ){
    console.log("params data");
    console.dir(settings.data );
    var group ;
    _.find( mData , function( obj , order ){
      if( parseInt( obj["var"]["groupNumber"],10 ) === parseInt(settings.data.groupNumber , 10 ) ){
        group = obj;
        return true;
      }
    } );
    console.log("%c here " , "color:red");
    console.dir( group );
    var messages = group["var"]["message"] ;
    _.find( messages , function( obj ){

    } );
  },
  responseText : {
                  "messageId" : 1 , 
                  "createDate" : 1373010310, 
                  "content" : getMessageContent(),
                  "contentThum" : getMessageContent(),
                  "replyTotalCount":5, 
                  "user":getUserData(),
                  "reply": [{
                     "messageId": 12, 
                     "parentId": "333",
                     "contentThum" : getMessageContent(),
                     "createDate": 1373010310,
                     "content": getMessageContent(), 
                     "user": getUserData()
                    }]
      }
});

$Mock.add({
  url : "gom:getGroupInfo" ,
  responseTime: 100 , 
  response : function(){},
  responseText : {
      "code": "S_OK",
      "summary": "",
      "var": [
          {
              "groupNumber": "10001",
              "groupName": "燃烧军团",
        "owner": "张三",
              "imageUrl": "GFL234-123dsf3-123xcgdfg2-123123",
              "groupDescription": "群简介",
              "createTime": "2014-05-31 13: 45: 25",
              "modifyTime": "2014-05-31 13: 45: 25",
              "totalUserCount": "16",
              "totalMsgCount": "125"
          }
      ]
  }
});
// {
//     "code": "S_OK",
//     "summary": "",
//     "var": [
//         {
//             "groupNumber": "10001",
//             "groupName": "燃烧军团",
//       "owner": "张三",
//             "imageUrl": "GFL234-123dsf3-123xcgdfg2-123123",
//             "groupDescription": "群简介",
//             "createTime": "2014-05-31 13: 45: 25",
//             "modifyTime": "2014-05-31 13: 45: 25",
//             "totalUserCount": "16",
//             "totalMsgCount": "125"
//         }
//     ]
// }

//----------------------------------------华丽的分割线-----------------------------------------
$Mock.add({
    url: "gom:queryMessageList", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    data : {//用来匹配请求参数(POST DATA)
        groupNumber : 10001
    },
    response: function (settings) {//一个回调声明，可用于动态变更响应数据
    },
    responseText: {
        "code": "S_OK",
        "summary": "",
        "var": 
           {
                "curPage":1,
                "totalRecord":0, 
                "groupNumber": 3434,
                "groupName": "燃烧军团",
                "totalMsgCount": "125",
                "status": "0",
                "readCount": "120",
                "message": [
                    {
                        "messageId":"123", 
                        "createDate":1373010310, 
                        "content":"musicffffffffffffffffffffffffffffffffff", 
                        "replyTotalCount":5, 
                        "user":{
                            "userName":"xxxxxxxxxxdd", 
                            "userId":"13245" 
                        },
                        "reply": [{
                            "parentId":123,
                            "messageId": "111",
                            "createDate": 1373010310,
                            "content": "musicffffffffffffffffffffffffffffffffff",
                            "user": {
                                "userName": "xxxxxxxxxxdd",
                                "userId": "13245"
                            }
                        }
                        ]

                    },
                    {
                        "messageId": "123",
                        "createDate": 1373010310,
                        "content": "ssssssssssssssss",
                        "replyTotalCount": 5,
                        "user": {
                            "userName": "xxxxxxxxxxdd",
                            "userId": "13245"
                        },
                        "reply": [{
                            "parentId": 123,
                            "messageId": "111",
                            "createDate": 1373010310,
                            "content": "ddfdf",
                            "user": {
                                "userName": "xxxxxxxxxxdd",
                                "userId": "13245"
                            }
                        }
                        ]

                    },
                        {
                            "messageId": "123",
                            "createDate": 1373010310,
                            "content": "yyyyyyyyyyyyyyyyyyyyyyy",
                            "replyTotalCount": 5,
                            "user": {
                                "userName": "xxxxxxxxxxdd",
                                "userId": "13245"
                            },
                            "reply": [{
                                "parentId": 123,
                                "messageId": "111",
                                "createDate": 1373010310,
                                "content": "musicffffffffffffffffffffffffffffffffff",
                                "user": {
                                    "userName": "xxxxxxxxxxdd",
                                    "userId": "13245"
                                }
                            }
                            ]

                        }   
                ]
            }
            
        
    }

});

//----------------------------------------华丽的分割线-----------------------------------------


$Mock.add({
    url: "gom:queryMessageList", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    data : {//用来匹配请求参数(POST DATA)
        groupNumber : 10002
    },
    response: function (settings) {//一个回调声明，可用于动态变更响应数据
    },
    responseText: {
        "code": "S_OK",
        "summary": "",
        "var": 
           {
                "curPage":1,
                "totalRecord":0, 
                "groupNumber": 3434,
                "groupName": "燃烧军团",
                "totalMsgCount": "125",
                "status": "0",
                "readCount": "120",
                "message": [
                    {
                        "messageId":"123", 
                        "createDate":1373010310, 
                        "content":"图样图森破", 
                        "replyTotalCount":5, 
                        "user":{
                            "imageUrl":" sfsfsfsdfsdfsdf",
                            "userName":"xxxxxxxxxxdd", 
                            "userId":"13245" 
                        },
                        "reply": [{
                            "parentId":123,
                            "messageId": "111",
                            "createDate": 1373010310,
                            "content": "musicffffffffffffffffffffffffffffffffff",
                            "user": {
                                "userName": "xxxxxxxxxxdd",
                                "userId": "13245"
                            }
                        }
                        ]

                    },
                    {
                        "messageId": "123",
                        "createDate": 1373010310,
                        "content": "ssssssssssssssss",
                        "replyTotalCount": 5,
                        "user": {
                            "userName": "xxxxxxxxxxdd",
                            "userId": "13245"
                        },
                        "reply": [{
                            "parentId": 123,
                            "messageId": "111",
                            "createDate": 1373010310,
                            "content": "ddfdf",
                            "user": {
                                "userName": "xxxxxxxxxxdd",
                                "userId": "13245"
                            }
                        }
                        ]

                    },
                        {
                            "messageId": "123",
                            "createDate": 1373010310,
                            "content": "to young to simple",
                            "replyTotalCount": 5,
                            "user": {
                                "userName": "xxxxxxxxxxdd",
                                "userId": "13245"
                            },
                            "reply": [{
                                "parentId": 123,
                                "messageId": "111",
                                "createDate": 1373010310,
                                "content": "musicffffffffffffffffffffffffffffffffff",
                                "user": {
                                    "userName": "xxxxxxxxxxdd",
                                    "userId": "13245"
                                }
                            }
                            ]

                        }

                
                 
                    
                ]
            }
            
        
    }

});

//----------------------------------------华丽的分割线-----------------------------------------



$Mock.add({
    url: "gom:queryMessage", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    /*data : {//用来匹配请求参数(POST DATA)
        command : 1
    },*/
    response: function (settings) {//一个回调声明，可用于动态变更响应数据
    },
    responseText: {
        "code": "S_OK",
        "summary": "",
        "var":
           {
               
               "message": [
                   {
                       "messageId": "123",
                       "createDate": 1373010310,
                       "content": "musicffffffffffffffffffffffffffffffffff",
                       "replyTotalCount": 5,
                       "user": {
                           "userName": "xxxxxxxxxxdd",
                           "userId": "13245"
                       },
                       "reply": [{
                           "messageId": "111",
                           "createDate": 1373010310,
                           "content": "musicffffffffffffffffffffffffffffffffff",
                           "user": {
                               "userName": "xxxxxxxxxxdd",
                               "userId": "13245"
                           }
                       }]

                   },
                   {
                       "messageId": "124",
                       "createDate": 1373010310,
                       "content": "dddddddddddddddddddddddd",
                       "replyTotalCount": 100,
                       "user": {
                           "userName": "xxxxxxxxxxdd",
                           "userId": "13245"
                       },
                       "reply": [{
                           "messageId": "222",
                           "createDate": 1373010310,
                           "content": "musicffffffffffffffffffffffffffffffffff",
                           "user": {
                               "userName": "xxxxxxxxxxdd",
                               "userId": "13245"
                           }
                       }]

                   },
                   {
                       "messageId": "125",
                       "createDate": 1373010310,
                       "content": "eeeeeeeeeeeeeeeee",
                       "replyTotalCount": 100,
                       "user": {
                           "userName": "xxxxxxxxxxdd",
                           "userId": "13245"
                       },
                       "reply": [{
                           "messageId": "333",
                           "createDate": 1373010310,
                           "content": "musicffffffffffffffffffffffffffffffffff",
                           "user": {
                               "userName": "xxxxxxxxxxdd",
                               "userId": "13245"
                           }
                       }]

                   },
                   {
                       "messageId": "126",
                       "createDate": 1373010310,
                       "content": "777777777777777777777777",
                       "replyTotalCount": 100,
                       "user": {
                           "userName": "xxxxxxxxxxdd",
                           "userId": "13245"
                       },
                       "reply": [{
                           "messageId": "444",
                           "createDate": 1373010310,
                           "content": "musicffffffffffffffffffffffffffffffffff",
                           "user": {
                               "userName": "xxxxxxxxxxdd",
                               "userId": "13245"
                           }
                       }]

                   }
               ]
           }


    }

});

//----------------------------------------华丽的分割线-----------------------------------------

$Mock.add({
    url: "gom:getGomUser", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    data : {//用来匹配请求参数(POST DATA)
        groupNumber : 10001
    },
    response: function (settings) {//一个回调声明，可用于动态变更响应数据
    },
    responseText: {
        "code": "S_OK",
        "summary": "",
        "var": {
            "users":
            [
                    {
                        "userId": 210001,
                        "name": "花样",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 210002,
                        "name": "年华",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 210003,
                        "name": "hello",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 210004,
                        "name": "jack",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 210005,
                        "name": "josh",
                        "email": "josh@139.com",
                        "mobile": "13513516880",
                        "gomName": "彩讯服务端",
                        "owner": "1"
                    }
            ]
        }


    }

});

//----------------------------------------华丽的分割线-----------------------------------------

$Mock.add({
    url: "gom:getGomUser", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    data: {//用来匹配请求参数(POST DATA)
        groupNumber: 10002
    },
    response: function (settings) {//一个回调声明，可用于动态变更响应数据
    },
    responseText: {
        "code": "S_OK",
        "summary": "",
        "var": {
            "users":
            [
                    {
                        "userId": 310001,
                        "name": "枫之",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310002,
                        "name": "物语",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310003,
                        "name": "天涯",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 210004,
                        "name": "yyyyyyyy",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310005,
                        "name": "eeeeeeeeeeeee",
                        "email": "josh@139.com",
                        "mobile": "13513516880",
                        "gomName": "彩讯服务端",
                        "owner": "1"
                    }
            ]
        }


    }

});

$Mock.add({
    url: "gom:getGomUser", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    data: {//用来匹配请求参数(POST DATA)
        groupNumber: 10003
    },
    response: function (settings) {//一个回调声明，可用于动态变更响应数据
    },
    responseText: {
        "code": "S_OK",
        "summary": "",
        "var": {
            "users":
            [
                    {
                        "userId": 310001,
                        "name": "枫之33333",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310002,
                        "name": "物语333333333",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310003,
                        "name": "天涯3333333333",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 210004,
                        "name": "yyyyyyyy33333333",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310005,
                        "name": "eeeeeeeeeeeee3333333333",
                        "email": "josh@139.com",
                        "mobile": "13513516880",
                        "gomName": "彩讯服务端",
                        "owner": "1"
                    }
            ]
        }


    }

});

$Mock.add({
    url: "gom:getGomUser", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    data: {//用来匹配请求参数(POST DATA)
        groupNumber: 10004
    },
    response: function (settings) {//一个回调声明，可用于动态变更响应数据
    },
    responseText: {
        "code": "S_OK",
        "summary": "",
        "var": {
            "users":
            [
                    {
                        "userId": 310001,
                        "name": "xiaoyao",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310002,
                        "name": "zhoutest",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310003,
                        "name": "周test1234567890123",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 210004,
                        "name": "霍去病v",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310005,
                        "name": "eeeeeeeeeeeee3333333333",
                        "email": "josh@139.com",
                        "mobile": "13513516880",
                        "gomName": "随便",
                        "owner": "1"
                    },
					{
                        "userId": 310006,
                        "name": "zhoukeq",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "来个什么好玩的",
                        "owner": "0"
                    },
                    {
                        "userId": 310007,
                        "name": "lililili",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "分组",
                        "owner": "0"
                    },
                    {
                        "userId": 310008,
                        "name": "hcyt",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "前端开发室",
                        "owner": "0"
                    },
                    {
                        "userId": 210009,
                        "name": "彩云楼月",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "产品策划部",
                        "owner": "0"
                    },
                    {
                        "userId": 310010,
                        "name": "二百斤",
                        "email": "josh@139.com",
                        "mobile": "13513516880",
                        "gomName": "五月十六日bug",
                        "owner": "1"
                    }
            ]
        }


    }

});

$Mock.add({
    url: "gom:getGomUser", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    data: {//用来匹配请求参数(POST DATA)
        groupNumber: 10005
    },
    response: function (settings) {//一个回调声明，可用于动态变更响应数据
    },
    responseText: {
        "code": "S_OK",
        "summary": "",
        "var": {
            "users":
            [
                    {
                        "userId": 310001,
                        "name": "123123123",
                        "email": "13800138000@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310002,
                        "name": "adqwrqe",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310003,
                        "name": "asd;ohfuw",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 210004,
                        "name": "asdq1fzz",
                        "email": "jack@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310005,
                        "name": "ooooooooooooooo",
                        "email": "josh@139.com",
                        "mobile": "13513516880",
                        "gomName": "彩讯服务端",
                        "owner": "1"
                    }
            ]
        }


    }

});

$Mock.add({
    url: "gom:getGomUser", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    data: {//用来匹配请求参数(POST DATA)
        groupNumber: 10006
    },
    response: function (settings) {//一个回调声明，可用于动态变更响应数据
    },
    responseText: {
        "code": "S_OK",
        "summary": "",
        "var": {
            "users":
            [
                    {
                        "userId": 310001,
                        "name": "xiaoming_123",
                        "email": "xiaoming_123@139.com",
                        "mobile": "1380041300",
                        "gomName": "彩讯服务端",
                        "owner": "1"
                    },
                    {
                        "userId": 310002,
                        "name": "小金",
                        "email": "xiaojin@139.com",
                        "mobile": "15826345812",
                        "gomName": "彩讯服务端asdawq",
                        "owner": "0"
                    },
                    {
                        "userId": 310003,
                        "name": "小刘",
                        "email": "xiaoliu@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 210004,
                        "name": "kkkkkk123pal",
                        "email": "kkkkkk123pal@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310005,
                        "name": "xxx123lasd",
                        "email": "xxx123lasd@139.com",
                        "mobile": "13513516880",
                        "gomName": "彩讯服务端",
                        "owner": "1"
                    }
            ]
        }


    }

});

//----------------------------------------华丽的分割线-----------------------------------------

$Mock.add({
    url: "gom:queryInvitedRecord", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    /*data : {//用来匹配请求参数(POST DATA)
        command : 1
    },*/
    response: function (settings) {//一个回调声明，可用于动态变更响应数据
    },
    responseText: {
        "code": "S_OK",
        "summary": "",
        "var": [
        {
            "recordId": "10001",
            "inviterId": "1000012",
            "inviterName": "张三",
            "groupNumber": "10001",
            "groupName": "燃烧军团",
            "imageUrl": "GFL234-123dsf3-123xcgdfg2-123123",
            "groupDescription": "群简介",
            "status": "1",
            "createTime": "2014-05-31 13: 45: 25",
            "modifyTime": "2014-06-03 15: 40: 25"
        },
		{
		    "recordId": "10001",
		    "inviterId": "1000012",
		    "inviterName": "张三",
		    "groupNumber": "10001",
		    "groupName": "燃烧军团",
		    "imageUrl": "GFL234-123dsf3-123xcgdfg2-123123",
		    "groupDescription": "群简介",
		    "status": "1",
		    "createTime": "2014-05-31 13: 45: 25",
		    "modifyTime": "2014-06-03 15: 40: 25"
		},
        {
            "recordId": "10001",
            "inviterId": "1000012",
            "inviterName": "李四",
            "groupNumber": "10002",
            "groupName": "hello,group",
            "imageUrl": "GFL234-123dsf3-123xcgdfg2-123123",
            "groupDescription": "群简介",
            "status": "1",
            "createTime": "2014-05-31 13: 45: 25",
            "modifyTime": "2014-06-03 15: 40: 25"
        }
        ]

    }

});

$Mock.add({
    url: "gom:createGom", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    /*data : {//用来匹配请求参数(POST DATA)
        command : 1
    },*/
    response: function (settings) {//一个回调声明，可用于动态变更响应数据

    },
    responseText: {
        "code": "S_OK",
        "summary": "成功创建群组",
        "var": {
            "groupNumber": "10001",
            "groupName": "燃烧军团",
            "imageUrl": "GFL234-123dsf3-123xcgdfg2-123123",
            "groupDescription": "群简介",
            "createTime": "2014-05-31 13: 45: 25",
            "modifyTime": "2014-05-31 13: 45: 25",
            "totalUserCount": "1",
            "totalMsgCount": "1",
            "status": "0"
        }

    }

});

$Mock.add({
    url: "gom:updateGom", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    /*data : {//用来匹配请求参数(POST DATA)
        command : 1
    },*/
    response: function (settings) {//一个回调声明，可用于动态变更响应数据

    },
    responseText: {
        "code": "S_OK",
        "summary": "成功编辑群组"
    }

});

$Mock.add({
    url: "gom:getUserList", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    data : {//用来匹配请求参数(POST DATA)
        groupNumber: 10005,
		pageSize: 5,
		pageIndex: 1
    },
    response: function (settings) {//一个回调声明，可用于动态变更响应数据

    },
    responseText: {
        "code": "S_OK",
        "summary": "成员获取成功",
        "pageCount": 1,
        "records": 30,
        "pageSize": 50,
        "isOwner": 1,
        "gomName": "燃烧军团",
        "var": {
            "users": [{
                "userId": 210001,
                "name": "jack",
                "email": "13480151648@139.com",
                "mobile": "13513516890",
                "gomName": "彩讯服务端",
                "owner": "0"
            }, {
                "userId": 210002,
                "name": "josh",
                "email": "13502886601@139.com",
                "mobile": "13513516880",
                "gomName": "彩讯服务端",
                "owner": "1"
            },
            {
                "userId": 210003,
                "name": "jack",
                "email": "13723714910@139.com",
                "mobile": "13513516890",
                "gomName": "彩讯服务端",
                "owner": "0"
            }, {
                "userId": 210004,
                "name": "josh",
                "email": "15994840894@139.com",
                "mobile": "13513516880",
                "gomName": "彩讯服务端",
                "owner": "1"
            }]
        }
    }

});

$Mock.add({
    url: "gom:getUserList", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    data: {//用来匹配请求参数(POST DATA)
        groupNumber: 10006,
		pageSize: 5,
		pageIndex: 1
    },
    response: function (settings) {//一个回调声明，可用于动态变更响应数据
    },
    responseText: {
        "code": "S_OK",
        "summary": "",
        "var": {
            "users":
            [
                    {
                        "userId": 310001,
                        "name": "xiaoming_123",
                        "email": "xiaoming_123@139.com",
                        "mobile": "1380041300",
                        "gomName": "彩讯服务端",
                        "owner": "1"
                    },
                    {
                        "userId": 310002,
                        "name": "小金",
                        "email": "xiaojin@139.com",
                        "mobile": "15826345812",
                        "gomName": "彩讯服务端asdawq",
                        "owner": "0"
                    },
                    {
                        "userId": 310003,
                        "name": "小刘",
                        "email": "xiaoliu@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 210004,
                        "name": "kkkkkk123pal",
                        "email": "kkkkkk123pal@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310005,
                        "name": "xxx123lasd",
                        "email": "xxx123lasd@139.com",
                        "mobile": "13513516880",
                        "gomName": "彩讯服务端",
                        "owner": "1"
                    }
            ]
        }


    }

});

$Mock.add({
    url: "gom:getUserList", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    data: {//用来匹配请求参数(POST DATA)
        groupNumber: 10004,
		pageSize: 5,
		pageIndex: 1
    },
    response: function (settings) {//一个回调声明，可用于动态变更响应数据
    },
    responseText: {
        "code": "S_OK",
        "summary": "",
        "var": {
            "users":
            [
                    {
                        "userId": 310001,
                        "name": "李启明",
                        "email": "xiaoming_123@139.com",
                        "mobile": "1380041300",
                        "gomName": "彩讯服务端",
                        "owner": "1"
                    },
                    {
                        "userId": 310002,
                        "name": "小金",
                        "email": "xiaojin@139.com",
                        "mobile": "15826345812",
                        "gomName": "彩讯服务端asdawq",
                        "owner": "0"
                    },
                    {
                        "userId": 310003,
                        "name": "小刘",
                        "email": "xiaoliu@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 210004,
                        "name": "kkkkkk123pal",
                        "email": "kkkkkk123pal@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310005,
                        "name": "xxx123lasd",
                        "email": "xxx123lasd@139.com",
                        "mobile": "13513516880",
                        "gomName": "彩讯服务端",
                        "owner": "1"
                    }
            ]
        }


    }

});

$Mock.add({
    url: "gom:getUserList", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    data: {//用来匹配请求参数(POST DATA)
        groupNumber: 10003,
		pageSize: 5,
		pageIndex: 1
    },
    response: function (settings) {//一个回调声明，可用于动态变更响应数据
    },
    responseText: {
        "code": "S_OK",
        "summary": "",
        "var": {
            "users":
            [
                    {
                        "userId": 310001,
                        "name": "zhangsanfeng",
                        "email": "xiaoming_123@139.com",
                        "mobile": "1380041300",
                        "gomName": "彩讯服务端",
                        "owner": "1"
                    },
                    {
                        "userId": 310002,
                        "name": "小金",
                        "email": "xiaojin@139.com",
                        "mobile": "15826345812",
                        "gomName": "彩讯服务端asdawq",
                        "owner": "0"
                    },
                    {
                        "userId": 310003,
                        "name": "小刘",
                        "email": "xiaoliu@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 210004,
                        "name": "kkkkkk123pal",
                        "email": "kkkkkk123pal@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310005,
                        "name": "xxx123lasd",
                        "email": "xxx123lasd@139.com",
                        "mobile": "13513516880",
                        "gomName": "彩讯服务端",
                        "owner": "1"
                    }
            ]
        }


    }

});

$Mock.add({
    url: "gom:getUserList", //请求的服务接口名称，也可使用正则表达式
    responseTime: 100, //网络延时模拟值
    data: {//用来匹配请求参数(POST DATA)
        groupNumber: 10002,
		pageSize: 5,
		pageIndex: 1
    },
    response: function (settings) {//一个回调声明，可用于动态变更响应数据
    },
    responseText: {
        "code": "S_OK",
        "summary": "",
        "var": {
            "users":
            [
                    {
                        "userId": 310001,
                        "name": "xdddddddd",
                        "email": "xiaoming_123@139.com",
                        "mobile": "1380041300",
                        "gomName": "彩讯服务端",
                        "owner": "1"
                    },
                    {
                        "userId": 310002,
                        "name": "caonima",
                        "email": "xiaojin@139.com",
                        "mobile": "15826345812",
                        "gomName": "彩讯服务端asdawq",
                        "owner": "0"
                    },
                    {
                        "userId": 310003,
                        "name": "小刘+++",
                        "email": "xiaoliu@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 210004,
                        "name": "kkkkkk123pal123",
                        "email": "kkkkkk123pal@139.com",
                        "mobile": "13513516890",
                        "gomName": "彩讯服务端",
                        "owner": "0"
                    },
                    {
                        "userId": 310005,
                        "name": "kapa",
                        "email": "xxx123lasd@139.com",
                        "mobile": "13513516880",
                        "gomName": "彩讯服务端",
                        "owner": "1"
                    }
            ]
        }


    }

});

//---------------------------------我是分割线----------------------------------------
//群相册列表
$Mock.add({
    url: "gom:photoGallery",
    responseTime: 100, 
    //data: {
    //    groupNumber: 10001,
    //    point: 5
    //},
    response: function () {

    },
    responseText: {
        "code": "S_OK",
        "summary": "成功",
        "var": 
            [
                    {
                        "timePoint": "20:08",
                        "userName": "xdddddddd",
                        "count": 3,
                        "userId": 1000110,
                        "photos": [
                            {
                                "imgId": 11,
                                "imgUrl": "../../images/201312/bank2.jpg"
                            },
                            {
                                "imgId": 12,
                                "imgUrl": "../../images/201312/bank2.jpg"
                            },
                            {
                                "imgId": 13,
                                "imgUrl": "../../images/201312/bank2.jpg"
                            }
                        ]
                    },
                    {
                        "timePoint": "16:08",
                        "userName": "shayleelol",
                        "count": 3,
                        "userId": 110110,
                        "photos": [
                            {
                                "imgId": 14,
                                "imgUrl": "../../images/201312/bank2.jpg"
                            },
                            {
                                "imgId": 15,
                                "imgUrl": "../../images/201312/bank2.jpg"
                            },
                            {
                                "imgId": 16,
                                "imgUrl": "../../images/201312/bank2.jpg"
                            }
                        ]
                    },
                    {
                        "timePoint": "14:08",
                        "userName": "hehe",
                        "count": 3,
                        "userId": 220220,
                        "photos": [
                            {
                                "imgId": 17,
                                "imgUrl": "../../images/201312/bank2.jpg"
                            },
                            {
                                "imgId": 18,
                                "imgUrl": "../../images/201312/bank2.jpg"
                            },
                            {
                                "imgId": 19,
                                "imgUrl": "../../images/201312/bank2.jpg"
                            }
                        ]
                    }
            ]
        }

});

//--------------------------------我是华丽的分割线-----------------------------------
//获取群相册容量接口
$Mock.add({
    url: "gom:spaceSize",
    responseTime: 100,
    //data: {
    //    groupNumber: 10001,
    //    point: 5
    //},
    response: function () {

    },
    responseText: {
        "code": "S_OK",
        "summary": "成功",
        "var": {
            "totalSize": 1073741824,
            "surplusSize": 104857600,
            "totalCount": 9
        }       
    }

});
