$.loadXML = function (_url,_data,_callback){
	$.ajax({
          type:"get",
          url:_url,
		  data:_data,
        async:true,
          dataType:"html",
        success:function(xml){
			var retObj=parseXML(xml);
			_callback(retObj);
		}});

}
function parseXML(xml){
		var oXmlDom,oXmlElement;
			/*去除非法的xml注释部分
			 *当xml包含头部声明时<?xml version="1.0" encoding="UTF-8"?>需要下面这行代码
			 *xml = xml.replace(/\<\!\-\-[\s\S]+\-\-\>/,"");*/	
			//xml=xml.replace(/＜/ig,"<").replace(/＞/ig,">");//为适应coremail模板我不得不把尖括号<>转换为全角字符，在这里要替换回来成为xml格式
			xml=xml.replace(/[^\]]\]><!--a-->/ig,"]]><!--a-->");//解决coremail截断字符的bug
			
			if(jQuery.browser.msie){
				//var oXmlDom = new ActiveXObject("Microsoft.XMLDOM");
				var oXmlDom = new ActiveXObject("MSXML.DOMDocument")
				oXmlDom.loadXML(xml);
			}else{	//firefox,opera,safari
				//xml = xml.replace(/\<\!\-\-\sCoreMail[\s\S]+?\-\-\>/,"");
				//xml="<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n"+xml;
				//xml=xml.replace(/[\u001b-\u001f]/ig,"-");//替换打印字符
				var oParser = new DOMParser();
				var oXmlDom = oParser.parseFromString(xml,"text/xml");
			}
			oXmlElement= oXmlDom.documentElement;
			if(oXmlElement!=null){
				var retObj;
				if(oXmlElement.nodeName=="parsererror" || oXmlElement.nodeName=="html"){
					retObj=new Object;
					retObj.error=xml;
					if(checkLogout(xml)){return null};
				}else{
					retObj=xml2array(oXmlElement);
				}
				return retObj;
			}else{
				var retObj=new Object;
				retObj.error=xml;
				if(checkLogout(xml)){return null};
				return retObj;
			}
}
function checkLogout(page){
	if(page.indexOf("登录超时")>0 || page.indexOf("重新登录")>0 || page.indexOf("非法请求")>0){
		window.top.document.write(page);
		window.top.document.close();
		return true;
	}
}
function xml2array(xmlDoc){
	var resultObj=new Array();	//dataset
	for(var i=0; i<xmlDoc.childNodes.length; i++) {
		var tableNode=xmlDoc.childNodes[i];
		if(tableNode.nodeName.charAt(0)  != "#" ){
			var arr=new Array();	//用于存放datatable
			resultObj[tableNode.nodeName]=arr;
			for(var j=0; j<tableNode.childNodes.length; j++) {
				var rowNode=tableNode.childNodes[j];	
				if(rowNode.nodeName.charAt(0)  != "#" ){
					var arr_row=new Array();	//存放datarow
					arr.push(arr_row);
					for(var k=0; k<rowNode.childNodes.length; k++) {
						var colNode=rowNode.childNodes[k];
						if(colNode.nodeName.charAt(0)  != "#" ){
							if(colNode.childNodes.length>0){
								var secName=colNode.childNodes[0].nodeName;
								var colValue;
								if(secName=="#text" || secName=="#cdata-section"){
									colValue=colNode.childNodes[0].nodeValue;
									arr_row[colNode.nodeName]=colValue;
								}else if(secName="#comment"){
									colValue=colNode.childNodes[0].nodeValue.replace(/\[CDATA\[/ig,"").replace(/\]\]/ig,"")
									arr_row[colNode.nodeName]=colValue;
								}
							}else{
								arr_row[colNode.nodeName]=null;
							}
							
						}
					}
				}
			}
			
		}
	}
	return resultObj;
}

function postByFrame(url,data,callback){
    var form=$("<form method='post' action='{0}' target='iframe_post'></form>".format(url)).appendTo(document.body);
    var iframe=$("#iframe_post");
    if(iframe.length==0){
	    iframe=$("<iframe style='display:none' name='iframe_post' id='iframe_post'></iframe>").appendTo(document.body);
	}
	for(var elem in data){
		var obj=document.createElement("input");
		obj.name=elem;
		obj.type="hidden";
		obj.value=data[elem];
		form.append(obj)
	}
	iframe.load(doCallback);
	try{
	    form[0].submit();//可能出现"拒绝访问"
	}catch(e){
	    iframe.unbind("load",doCallback);
	    iframe.load(function(){
	        iframe.unbind("load",arguments.callee);
	        iframe.load(doCallback);
	        form[0].submit();
	    });
	    iframe.attr("src",top.stylePath+"/empty.htm");
	}
	function doCallback(){
	    iframe.unbind("load",arguments.callee);
	    var response="";
	    try{
	        //目标页未必是同域的
	        response=iframe[0].contentWindow.document.documentElement.innerHTML;
	    }catch(e){}
	    if(callback)callback(response);
	    form.remove();
	}
}


$.postForm = function (_url,form,_callback){
	var formData=getForm(form);
	$.post(_url,formData,_callback,null);
}

//获取表单数据，目前只支持text hidden checkbox
function getForm(form){
var arr=form.getElementsByTagName("input");
var arr2=form.getElementsByTagName("textarea");
var formData=new Object;
formData=getTagValue(formData,arr);
formData=getTagValue(formData,arr2);
return formData;
};
function getTagValue(formData,arr){
	for(elem in arr){
		var obj=arr[elem];
		if(obj.tagName==undefined){
			continue;
		}
		
		if(obj.tagName.toLowerCase()=="input"){
			var key=obj.name;
			if(obj.type=="text" ||  obj.type=="hidden"){
				formData[key]=obj.value;
			}else if(obj.type=="checkbox"){
				if(obj.checked){
					formData[key]=obj.value;
				}
			}
		}else if(obj.tagName.toLowerCase()=="textarea"){
			formData[key]=obj.value;
		}
	}
	return formData;

}