/**   
* @fileOverview 
* 读信主要事务处理，主要涉及监听读信内容输出、标记、标签、备注同步等等
*/
    
    $(function(){

	
		//读信回调函数表达式
        window['readMailReady'] = function (win) {
			var args = arguments;
			var mid;
			
			if(args.length === 3 && args[1] === "json"){
				//渲染信头
				$App.trigger('letterInfoReady',args[2]);
				
				if( args[2] && args[2].omid ){
					mid = args[2].omid;
				}
				
				//二次验证读信加载
				if($App.getLayout()==='list' && mid && !$App.isSessionMid(mid)){
					setTimeout(function(){
						$App.trigger('letterInfoReady_' + mid, args[2]);
						//处理普通附件上传，添加到页面中
					},1500)
				}
			}
			
			if(args.length === 2 && args[1] === "domready"){
				//读信输出完毕
				$App.trigger('letterDomReady',args[0]);
			}
		    try {
		        win.alert = function () {
		            setTimeout(function () {
		                var content = (win.document.documentElement || win.document.body).innerHTML;
		                var index = content.indexOf("alert");
		                if (index > -1) {
		                    index = Math.max(0, index - 50);
		                    content = content.substr(index, 100);
		                }
		                M139.Logger.sendClientLog({
		                    level: "ERROR",
		                    name: "ReadMailXSS",
		                    account: win.letterInfo && win.letterInfo.account,
		                    subject: win.letterInfo && win.letterInfo.subject,
		                    url: win.location.href,
		                    content: encodeURIComponent(content)
		                });
		            }, 2000); 
		        };
		    } catch (e) { }
		};
		
        function validatetab(mids){
            $.each(mids,function(n){
                $App.validateTab("readmail_" + mids[n]);
            })
        }
        
        //监听mailCommand,所有读信邮件操作逻辑处理[删除、移动、彻底删除等等]
        $App.on("readmailControl", function (args) { 
		    
		    var readMailTab = $App.getCurrentTab().name.indexOf('readmail')>-1 ? true : false; //当前页是否读信
			
		    if(args){
		        var command = args.command;
		        var mids = args.mids;
		        
		        //移动、删除和彻底删除处理
		        if(command == 'move' || command == 'delete' ){
		            
                    /*
		            try{
                        for(var i = 0; i < mids.length; i++){
                            $App.closeTab('readmail_' + mids[i])                                                            
                        }                        
                    }catch(e){}
                    */

                    //读信页删除第一封会话邮件
                    if(args.sessionIds && args.sessionIds.length > 0 && /readmail/gi.test($App.getCurrentTab().name)){
                        //$App.close();
                    }
   		        }
		   
                //批量读信刷新处理[标记，标签，备注,星标]
                var commands = ['mark','tag'];
                var types = ['starFlag', 'priority', 'read'];
                var refresh = false;
                var sessionId;
                if(mids){
                    args = args.args;
                    if(command == 'mark' && $.inArray(args.type,types)>-1){     
                        if(readMailTab){
                            if( args.sessionIds && args.sessionIds[0] ) { sessionId = args.sessionIds[0] }
                            args.type == 'starFlag' && $App.trigger('markstar',{mid: mids[0],sessionId:sessionId, value:args.value});
                            args.type == 'priority' && $App.trigger('mailimportant',{mid: mids[0],sessionId:sessionId, value:args.value});
                            args.type == 'read' && $App.trigger('mailread',{mid: mids[0],sessionId:sessionId, value:args.value});
                        }else{
                            refresh=true;
                        }
                    }

                    if(command == 'tag' && readMailTab){
                        $App.trigger('mailtagschange', {mids: mids, labelId:args.labelId});
                    }

                    if(command == 'tag' && !readMailTab){ 
                        refresh = true;
                    }
                    if(refresh){
                        validatetab(mids);
                    }
                }
		    }
		    
		    //备注编辑框处理
		    $('#listremark').remove();
		    
		});

        //列表页操作时通知读信刷新,可以再细化下
        $App.on("readMaiDataChange",function (args){
            var command,
                mids,
                map = {
                    "mark":true,
                    "tag":true
                };
            if(args){
                command = args.command;
                mids = args.mids;
            }    
            if( command && map[command] && mids){
                validatetab(mids);
            }
        });

		
		//读信处理
		$App.on('readmail',function (args){
		    //分栏读信 
		    if(args.type && args.type == 'split'){
		        args.mid && $App.closeTab('readmail_' + args.mid);
		    }
		});
		
		//删除标签
		$App.on("removeTag",function(e){
            if(e.mids){
                validatetab(e.mids);
            }
        });
        
        //普通读信标记重要和取消重要
        $App.on("mailimportant",function(e){
           try{
                var readMailCon = $('#readmail_' + e.mid);
                if(readMailCon.find(".i_exc").length==0 && e.value == 1){
                    readMailCon.find('h2').prepend('<i class="i_exc mr_5"></i>');        
                }
                if(e.value == 5){
                    readMailCon.find('.i_exc').remove();        
                }
           }catch(e){}
        });
        
		
		try{
			$App.on("showTab", function (m) {
				var mid;
				if( m.name.indexOf('readmail_') > -1){
					mid = $App.getCurrMailMid();
					$App.trigger('mailResize',{mid:mid});	
				}
			});
		}catch(e){}
});
    
