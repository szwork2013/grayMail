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
             '<tr><td colspan="2"><h3>{title}</h3></td></tr>',
            '</tbody>',
         '</table>',
         '<hr />',
         '<div>',
         '{content}',
         '</div>',
     '</div>'].join("");     
     
var $W = window.opener;
var noteID = $W.$T.Url.queryString("noteID", location.href);
var noteInfo = $W.colorCloudNoteview.model.get('noteInfo');
var title = noteInfo.title;
var content = noteInfo.content;
try{
    var title = $W.$T.Utils.htmlEncode(title);
    var content = content;
    var html = $W.$T.Utils.format(temp,{title:title,content:content});
    document.write(html);
}catch(e){}
