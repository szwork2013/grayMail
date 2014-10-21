/**
* 打印页面功能
*/
var ccitem = '<tr><td class="tdLeft">抄&nbsp;&nbsp;送：</td><td>{0}</td></tr>';
var temp = [
		 '<div class="printMail">',
         '<p class="unprint">',
             '<a href="javascript:window.print();">打 印</a>&nbsp;&nbsp;',
             '<a href="javascript:window.close();">关 闭</a>',
         '</p>',
         '<p><img alt="139邮箱" style="margin:5px" id="logo" src="/m2012/images/global/pic_139logo.gif" /></p>',
         '<hr />',
         '<table>',
             '<tbody>',
             '<tr><td colspan="2"><h3>{title} &nbsp; &nbsp; {time}</h3></td></tr>',
             '<tr><td class="tdLeft">发件人：</td><td>{from}</td></tr>',
             '<tr><td class="tdLeft">收件人：</td><td>{to}</td></tr>',
             '{cc}',
            '</tbody>',
         '</table>',
         '<hr />',
         '<div>',
         '{content}',
         '</div>',
     '</div>'].join("");     
     
var $W = window.opener;
var mid = $W.$T.Url.queryString("mid",location.href);
var data = $W.M139.PageApplication.getTopApp().print[mid];
try{
    var title = $W.$T.Utils.htmlEncode(data.subject);
    var time = $W.$Date.format("yyyy-MM-dd hh:mm:ss",new Date(data.sendDate * 1000));
    var from = $W.$T.Utils.htmlEncode(data.account);
    var to = $W.$T.Utils.htmlEncode(data.to);
    var cc = data.cc ? $W.$T.Utils.format(ccitem,[$W.$T.Utils.htmlEncode(data.cc)]) : '';
    var content = data.html.content;
    var html = $W.$T.Utils.format(temp,{title:title,time:time,from:from,to:to,cc:cc,content:content});
    document.write(html);
}catch(e){}
