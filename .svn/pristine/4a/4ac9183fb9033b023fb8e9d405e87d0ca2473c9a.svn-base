/** 新窗口读信 */
var temp = [ '<div class="readMail">',
                                 '<div class="hTitle">',
                                     '<h2 style="{color}">{title}</h2>',
                                 '</div>',
                             '</div>',
                             '<div class="readMailInfo">',
                                '{item}',
                             '</div>',
                             '<div class="mialContent" >',
                                 '<div class="mailText">',
                                     '<div id="contentText" rel="14">',
                                     '{content}',
                                     '</div>',
                                 '</div>',
                             '</div>'].join("");
var messyCodeTips = [ '<div class="newytips">',
 			'<p>如果您的邮件内容出现乱码，可能是因为邮件内容中包含了一些不被支持的特殊字符。</p>',
 			'<p>',
 				'您可以通过以下方式改变编码进行查看： 点击浏览器的“<strong>查看</strong>',
 				'” --&gt; <strong>编码</strong> --&gt;',
 				'<strong>unicode或简体中文</strong>',
 				'（其他语言编码亦可）。',
 				'<a href="http://help.mail.10086.cn/statichtml/0/Content/672.html" target="_blank">查看详情</a>',
 			'</p>',
 		'</div>'].join("");
var dateTemp = ['<div class="rMList">',
                    '<span class="rMl">时　间：</span>',
                    '<div class="rMr">{0}</div>',
                '</div>'].join('');    
                
var attachTemp = ['<div class="rMList">',
                      '<span class="rMl">附　件：</span>',
                      '<div class="rMr convattrlist">',
                      '{0}',
                      '</div>',
                  '</div>'].join('');                                         

    var $W = window.opener;
    var mid = $W.$T.Url.queryString("mid",location.href);
	var messycode = $W.$T.Url.queryString("messycode",location.href);
    var returnObj = $W.$App.readMail(mid,true,0);
    returnObj.view.getNewWinData(function(response){
        responseHtml(response);
    });
    
//获取正文内容
function getContent(mid){
    var thismid = "mid_" + mid;
    var url = "/m2012/html/newwinreadmailcontent.html?d={0}#mid={1}";
    var thisurl = $W.$T.Utils.format(url, [$W.top.$App.getSid().substring(0, 20), mid]);
    var iframe = "<iframe name='{1}' rel='' id='{1}' src='{0}' frameborder='0' height='240' style='width:100%'></iframe>";    
    var thisCode = $W.$T.Utils.format(iframe,[thisurl, thismid]);
    return thisCode;
}

//正文输出
function responseHtml(data){
    var D = data;
    var dataSource = data.dataSource;
    var from = D.fromHtml;
    var attachHtml = '<div id=\"hideAttach\" style=\"display:none\">' + D.attachHtml + '</div>';
    var getDate = $W.$Date.format("yyyy-MM-dd hh:mm:ss",new Date(dataSource.sendDate * 1000));                  
    var dateHtml = $W.$T.Utils.format(dateTemp,[getDate]);
    var to = D.toHtml || '';
    var cc = D.ccHtml || '';
    var bcc = D.bccHtml || '';
    var content = dataSource.html.content || '';
    var html = $W.$T.Utils.format(temp,{
        color:D.titleColor,
        title:$W.$T.Utils.htmlEncode(dataSource.subject),
        item:[from,to,cc,bcc,dateHtml,attachHtml].join(''),
        content:getContent(mid)
    });
	
	
	//乱码提示
	if(messycode){
		html = messyCodeTips + html;
	}
	
    $('#leftbox').html(html);
    document.title = dataSource.subject;//设置新窗口读信标题
    
    //高度自适应
    var thisiframe = $('iframe')[0];
    $W.M139.Timing.watchIframeHeight(thisiframe,300);

    //附件处理，兼容会话邮件，没有存彩云,存彩云
    var attachCon = $('#hideAttach',document);
    if(attachCon.length>0 && attachCon.html()!=''){
        var split;
        var spanHtml = '';
        var newAttachHtml = '';
        attachCon.find('.convattrlist > div').each(function(n){
            var html = $(this).html();
            $(this).html(html.split(' | ')[0]);
        });
        attachCon.find('ul li span').each(function(n,val){
		//	var imgIco = $(this).parent().find('i.i_m_bmp,i.i_m_jpeg,i.i_m_jpg,i.i_m_png,i.i_m_gif,i.i_m_tif');
			var imgIco = $(this).parent().find("i[oldclass*='i_m_bmp'],i[oldclass*='i_m_jpeg'],i[oldclass*='i_m_jpg'],i[oldclass*='i_m_png'],i[oldclass='i_m_gif'],i[oldclass='i_m_tif']");
			split = $(this).html().split(' | ');
			try{
				if(imgIco[0] || /readmail_savedisk/i.test(split[1])){
					spanHtml = split[0];
				}else{
					spanHtml = split[0] + ' | ' + split[1];
				}
			}catch(e){}
			$(this).parent().find('a[data-mcloudid]').remove();
            $(this).html(spanHtml);      
        });

        newAttachHtml = attachCon.find('.convattrlist').html();
		newAttachHtml = $W.$T.Utils.format(attachTemp,[newAttachHtml]);
        attachCon.after(newAttachHtml);
			var listUp = $("i[id='listUp']");
			var listDown = $("i[id='listDown']");
			listUp.click(function(){
				var self = this;
				$(self).hide();
				$(self).closest("div").next().slideUp();
				listDown.show();
			});
			listDown.click(function(){
				var self = this;
				$(self).hide();
				$(self).closest("div").next().slideDown();
				listUp.show();
			});
    }    
}

//窗口自适应
function winonresize(){
    var contentBox = $W.$('#leftbox',document);
    var containerH = $W.$("body",document).height() - contentBox.offset().top;
    containerH = Math.max(200,containerH); 
    contentBox.height(containerH);
}

winonresize();

$(function(){
    $(window).resize(function(){
        winonresize();
    });
}) 
