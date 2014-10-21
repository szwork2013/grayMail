/**
 * @fileOverview 定义彩云文件列表视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Disk.View.Music', superClass.extend(
	/**
	 *@lends M2012.Disk.View.Music.prototype
	 */
	{
		el : "body",
		name : "M2012.Disk.View.Music",
		logger : new top.M139.Logger({
			name : "M2012.Disk.View.Music"
		}),
		events : {
		},
		initialize : function(options) {
			this.model = options.model;
			this.initEvents();
			return superClass.prototype.initialize.apply(this, arguments);
		},
		initEvents : function(){
        	var self = this;
        },
        render : function(){
        	var self = this;
        	self.loadPlayer(true, function(){
        		self.addRootMusic();
        	});
            BH({key : "diskv2_musicplayer"});
        },
        
        // 加载播放器
	    loadPlayer: function(isRefresh, loadpageCallback) {
	    	var self = this;
	        if (isRefresh) {
	            //DiskTool.tabFixPlayer(false);
	            top.$("#playerframe").parent().remove();
	        }
	        if (top.$("#playerframe").length == 0) {
	            top.MusicPlayerLoadpageCallback = loadpageCallback;
	            top.$("<div style='position:absolute;z-index:999;top:24px;right:7px;'><iframe id='playerframe' src='"
	                + "/m2012/html/disk/disk_musicplayer.html' style='width:212px;height:21px;' scrolling='no' frameborder='0'></iframe></div>")
	            .appendTo(top.document.body);
	            //DiskTool.tabFixPlayer(true);
	            self.fixPlayer();
	        }
	    },
	    
	    // 调整播放器的样式
	    fixPlayer : function(){
	    	top.$("#playerframe").parent('div').css({top : '15px', right : '273px'}).hide();
	    },
	    
	    /**
	    * 添加音乐到播放器
	    * list [{FileId:xx,Name:yy}]
	    */
	    appendMusic : function(list, isPlay) {
	    	var self = this;
	    	
	        if (window.top.MusicPlayer) {
	            window.top.MusicPlayer.appendSongList(list, isPlay);
	        } else {
	            self.loadPlayer(true, function() {
	                if (window.top.MusicPlayer) {
	                    window.top.MusicPlayer.appendSongList(list, isPlay);
	                }
	            });
	        }
	    },
	    
	    //获取所有的歌曲信息
        play : function() {
        	var self = this;
            if (!$.browser.msie) {
                top.$Msg.alert(self.model.tipWords.NO_Play);
            }

            function getMusics(fids){
            	var musics = [];
            	for(var i = 0,len = fids.length;i < len;i++){
            		var fileObj = self.model.getFileById(fids[i]);
            		musics.push({FileId: fileObj['id'], Name: fileObj['name']});
            	}
            	return musics;
            }
            
            var allMusic = [];
            var selectedDirIds = self.model.get('selectedDirIds');
            var selectedFids = self.model.get('selectedFids');
            if(selectedDirIds.length > 0){
            	self.model.getDirFiles(function(result){
            		var responseData = result.responseData;
            		// todo
            		if(responseData && responseData.code == 'S_OK'){
                        var files = result.responseData["var"]['files'];
                        for(var i = 0,len = files.length;i < len;i++){
                        	allMusic.push({FileId: files[i]['id'], Name: files[i]['name']});
                        }
	    			}else{
                        self.logger.error("download returnData error", "[disk:fileList]", result);
                    }
            		if(selectedFids.length > 0){
            			allMusic = allMusic.concat(getMusics(selectedFids));
            		}
            		self.appendMusic(allMusic);
            	}, {dirid : selectedDirIds[0], dirType : self.model.dirTypes['MUSIC']});
            }else{
            	allMusic = getMusics(selectedFids);
            	self.appendMusic(allMusic);
            }
        },
        
        // 添加我的音乐根目录下的音乐文件
        addRootMusic : function(){
        	var self = this;
        	self.model.getDirFiles(function(result){
        		var responseData = result.responseData;
        		if(responseData && responseData.code == 'S_OK'){
                    var files = result.responseData["var"]['files'];
                    var allMusic = [];
                    for(var i = 0,len = files.length;i < len;i++){
                    	var fileObj = files[i];
                    	if(fileObj['type'] === self.model.dirTypes['FILE']){
                    		allMusic.push({FileId: fileObj['id'], Name: fileObj['name']});
                    	}
                    }
                    self.appendMusic(allMusic, 'noPlay');
    			}else{
                    self.logger.error("download returnData error", "[disk:fileList]", result);
                }
        	}, {dirid : 30, dirType : self.model.dirTypes['MUSIC']});
        }
	}));
})(jQuery, _, M139);
