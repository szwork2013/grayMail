if (ADDR_I18N) {
    var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].home;
}

var filter={
    uncompleted:"",
    firstNameWord:"",
    groupId:"",
    keyword:"",
    pageIndex:0,
    pageSize:20,
	sortType:"",
	emailOrder:1,
	nameOrder:-1,
	mobileOrder:1,
	needSort:false, //点击 通讯录列表 -姓名-邮箱-手机排序
    setDefault:function()//设置默认
    {
        filter.uncompleted="";
        filter.firstNameWord="";
        filter.groupId="";
        filter.keyword="";
    },
    setFilter:function(f){
        for(var p in f){
            filter[p]=f[p];
        }
    },
    sort:function(item){
	   //排序代码先保留
       /* var data=top.Contacts.data;
        var contacts=data.contacts;
        if(!data.sortOrder)data.sortOrder=1;
        data.sortOrder=-data.sortOrder;
        var index=data.sortOrder; 
        switch(item){
            case "name":{ 
				var chIndex = 0, digitIndex = 0,enIndex = 0,partIndex =0 ,sortBymobileName =[],sortByChName = [],sortByEnName =[],proteSign=[],noName=[];
				var chineseReg =  /^[\u4E00-\u9FA5]+$/, englishReg = /^[A-Za-z]+$/, digitalReg = /^[0-9]+$/;
				for(var i = 0; i<contacts.length;i++){
					if(chineseReg.test(contacts[i].name.charAt(0))){      //中文开头的姓名
						sortByChName.push(contacts[i]);
					}else if(englishReg.test(contacts[i].name.charAt(0))){ //英文开头的姓名
						sortByEnName.push(contacts[i]);
					} else if(digitalReg.test(contacts[i].name.charAt(0))){ //数字开头的姓名
						sortBymobileName.push(contacts[i]);
					}else if(!contacts[i].Quanpin){                        //姓名为空--历史数据中存在姓名为空
						noName.push(contacts[i]);							
						
					}else{												   //特殊字符开头的姓名	
						proteSign.push(contacts[i]);
					}
				}
				
				sortByChName.sort(function(a,b){ return a.Quanpin.localeCompare(b.Quanpin)});
				sortByEnName.sort(function(a,b){ return a.Quanpin.localeCompare(b.Quanpin)});
				sortBymobileName.sort(function(a,b){ return a.Quanpin.localeCompare(b.Quanpin)});
				proteSign.sort(function(a,b){return a.Quanpin.localeCompare(b.Quanpin)});
				
				var sortedContacts = [];
					sortedContacts = sortByChName;
					sortedContacts = sortedContacts.concat(sortByEnName);
					sortedContacts = sortedContacts.concat(sortBymobileName);
					sortedContacts = sortedContacts.concat(proteSign);
					sortedContacts = index>0? sortedContacts : sortedContacts.reverse();
				top.Contacts.data.contacts  = sortedContacts.concat(noName); //没有姓名的永远排最后
				
				break;
            }
            case "email":{
				contacts.sort(function(a,b){
					if(!a.getFirstEmail() && b.getFirstEmail()) return 1;
					if(a.getFirstEmail() && !b.getFirstEmail()) return -1;
					if(!a.getFirstEmail() && !b.getFirstEmail()) return 0;
					return a.getFirstEmail().localeCompare(b.getFirstEmail())*index;  //index很重 取反？？？节省了if判断
				});
				
				var breakIndex = 0,sortBymobile =[],sortByName =[];
				for(var i = 0; i<contacts.length;i++){
					if(contacts[i].getFirstEmail() == ""){
						breakIndex = i;
						break;
					}
				}
				
				if(breakIndex>0){
					sortBymobile = contacts.slice(0,breakIndex);
					sortByName = contacts.slice(breakIndex,contacts.length);
					sortByName.sort(function(a,b){ return b.name.localeCompare(a.name)});
					var sortedContacts = sortBymobile.concat(sortByName);
					top.Contacts.data.contacts  = sortedContacts;
				}
                break;
            }
            case "mobile":{
				contacts.sort(function(a,b){
					if(!a.getFirstMobile() && b.getFirstMobile()) return 1;
					if(a.getFirstMobile() && !b.getFirstMobile()) return -1;
					if(!a.getFirstMobile() && !b.getFirstMobile()) return 0;
					return a.getFirstMobile().localeCompare(b.getFirstMobile())*index;  //index很重 取反？？？节省了if判断
				});
				
				var breakIndex = 0,sortBymobile =[],sortByName =[];
				for(var i = 0; i<contacts.length;i++){
					if(contacts[i].getFirstMobile() == ""){
						breakIndex = i;
						break;
					}
				}
				
				if(breakIndex>0){
					sortBymobile = contacts.slice(0,breakIndex);
					sortByName = contacts.slice(breakIndex,contacts.length);
					sortByName.sort(function(a,b){ return b.name.localeCompare(a.name)});
					var sortedContacts = sortBymobile.concat(sortByName);
					top.Contacts.data.contacts  = sortedContacts;
				}

                //return a.getFirstMobile().localeCompare(b.getFirstMobile())*index;
               break;
            }
        }*/
		this.sortType = item;
		this.pageIndex = 0;
		this.needSort = true;
		View.changeView("Sort");
   }
};