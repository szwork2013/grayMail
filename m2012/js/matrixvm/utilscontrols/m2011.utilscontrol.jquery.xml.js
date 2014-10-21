if (window.$) {
	/**
	 * 以get方式请求服务器得到xml格式的数据
	 * <pre>示例：<br>
	 * <br>$.loadXML('page.jsp',jsonData,fun);
	 * </pre>
	 * @param {string} _url 必选参数，请求地址。
	 * @param {Object} _data 可选参数，请求数据。
	 * @param {function} _callback 必选参数，回调函数。
	 * @return {无返回值}
	 */
	$.loadXML = function(_url, _data, _callback){
		$.ajax({
			type: "get",
			url: _url,
			data: _data,
			async: true,
			dataType: "html",
			success: function(xml){
				var retObj = parseXML(xml);
				_callback(retObj);
			}
		});
		
	}
	/**
	 * 以post方式请求服务器
	 * @param {string} _url 必选参数，请求地址。
	 * @param {Object} form 可选参数，请求数据。
	 * @param {Object} _callback 必选参数，回调函数。
	 * @return {无返回值}
	 */
	$.postForm = function(_url, form, _callback){
		var formData = getForm(form);
		$.post(_url, formData, _callback, null);
	}
}
/**
 * 加载xml，反加xml对象
 * <pre>示例：<br>
 * <br>parseXML(xmlstr);
 * </pre>
 * @param {string} xml 必选参数，xml字符串。
 * @return {xml对象}
 */
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
/**
 * 检验退出
 * <pre>示例：<br>
 * <br>checkLogout('default.html')
 * </pre>
 * @param {string} page 必选参数，页面名称。
 * @return {true||null}
 */
function checkLogout(page){
	if(page.indexOf("登录超时")>0 || page.indexOf("重新登录")>0){
		window.top.document.write(page);
		window.top.document.close();
		return true;
	}else if(page.indexOf("非法请求")>0){
		//alert("您似乎闲置太久，请刷新页面或重新登录");
		//return true;
	}
}
/**
 * xml转换数组
 * <pre>示例：<br>
 * <br>xml2array(xmlDoc);
 * </pre>
 * @param {string} xmlDoc 必选参数，xml字符串。
 * @return {Array}
 */
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
					var arr_row=new Array();//存放datarow
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

/**
 * 提交到隐藏iframe请求
 * <pre>示例：<br>
 * <br>postByFrame('page.jsp',jsonData,fun);
 * </pre>
 * @param {string} url 必选参数，请求地址。
 * @param {Object} data 可选参数，请求数据。
 * @param {function} callback 必选参数，回调函数。
 * @return {无返回值}
 */
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

/**
 * 获取表单数据，目前只支持text hidden checkbox
 * <pre>示例：<br>
 * <br>getForm(window.document.form);
 * </pre>
 * @param {Object} form 必选参数，当前表单对象。
 * @return{Object}
 */
function getForm(form){
var arr=form.getElementsByTagName("input");
var arr2=form.getElementsByTagName("textarea");
var formData=new Object;
formData=getTagValue(formData,arr);
formData=getTagValue(formData,arr2);
return formData;
};

/**
 * 得到每组表单集合的值
 * <pre>示例：<br>
 * <br>getTagValue(formData,window.document.form.getElementsByTagName("input"));
 * </pre>
 * @param {Object} formData 必选参数，表单数据对象。
 * @param {Object} arr 必选参数，表单元素对象数组，如：input,textarea。
 * @return{Object}
 */
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