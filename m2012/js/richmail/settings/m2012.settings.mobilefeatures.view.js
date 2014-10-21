/**
    * @fileOverview 定义设置页移动特色（邮箱伴侣和套餐）
      @code by Arway 12-10-18 
*/
/**
 *@namespace
 *设置页移动特色View层
 *由于是iframe页，很多直接引用top获取变量，减少代码量
 */

(function(jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.Mobilefeatures.View', superClass.extend(
    /**
     *@lends M2012.Settings.Mobilefeatures.View.prototype
     */
    {
        el: "body",
        events: { "click #btn_open": "mailParternOpen" },
        initialize: function() {
            this.model = new M2012.Settings.Mobilefeatures.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        template: {
        	// 适用旧套餐详情接口的模板
            tableForOldApi: ['<table class="mobileF-tb">', '<tbody><tr>', '<th width="100">项目</th>', '<th width="200">', '<div class="p_relative" id="item0">免费版<span class="fw_n">(无升级)</span><i class="i_tc1"></i>{0015_changeurl}', '</div>', '</th>', '<th width="200">', '<div class="p_relative" id="item1">5元版<span class="fw_n">(升级50%)</span><i class="i_tc2"></i>{0016_changeurl}</div>', '</th>', '<th width="200">', '<div class="p_relative" id="item2">20元版<span class="fw_n">(升级200%)</span><i class="i_tc3"></i>{0017_changeurl}</div>', '</th>', '{specialfix_th}', '</tr>', '<tr>', '<td>功能费</td>', '<td>{0015_price}</td>', '<td>{0016_price}</td>', '<td>{0017_price}</td>', '{special_price}', '</tr>', '<tr>', '<td>容量</td>', '<td>{0015_volume}</td>', '<td>{0016_volume}</td>', '<td>{0017_volume}</td>', '{special_volume}', '</tr>', '<tr>', '<td>附件</td>', '<td>{0015_attachSize}</td>', '<td>{0016_attachSize}</td>', '<td>{0017_attachSize}</td>', '{special_attachSize}', '</tr>', '<tr>', '<td>邮件到达提醒</td>', '<td>{0015_notifyFee}</td>', '<td>{0016_notifyFee}</td>', '<td>{0017_notifyFee}</td>', '{special_notifyFee}', '</tr>', '<tr>', '<td>自写短信</td>', '<td>{0015_freeSms}</td>', '<td>{0016_freeSms}</td>', '<td>{0017_freeSms}</td>', '{special_freeSms}', '</tr>', '<tr>', '<td>自写彩信</td>', '<td>{0015_freeMms}</td>', '<td>{0016_freeMms}</td>', '<td>{0017_freeMms}</td>', '{special_freeMms}', '</tr>', '<tr>', '<td>群发邮件人数</td>', '<td>{0015_maxRecipients}</td>', '<td>{0016_maxRecipients}</td>', '<td>{0017_maxRecipients}</td>', '{special_maxRecipients}', '</tr>', '<tr>', '<td>彩云网盘容量</td>', '<td>{0015_diskVolume}</td>', '<td>{0016_diskVolume}</td>', '<td>{0017_diskVolume}</td>', '{special_diskVolume}', '</tr>', '<tr>', '<td>彩云网盘单个文件大小</td>', '<td>{0015_diskSingleFileSize}</td>', '<td>{0016_diskSingleFileSize}</td>', '<td>{0017_diskSingleFileSize}</td>', '{special_diskSingleFileSize}', '</tr>', '<tr>', '<td>文件快递容量</td>', '<td>{0015_largeattachVolume}</td>', '<td>{0016_largeattachVolume}</td>', '<td>{0017_largeattachVolume}</td>', '{special_largeattachVolume}', '</tr>', '<tr>', '<td>文件快递保存天数</td>', '<td>{0015_largeattachExpire}</td>', '<td>{0016_largeattachExpire}</td>', '<td>{0017_largeattachExpire}</td>', '{special_largeattachExpire}', '</tr>', '<tr>', '<td>视频邮件</td>', '<td>{0015_videomailRecordLimit}</td>', '<td>{0016_videomailRecordLimit}</td>', '<td>{0017_videomailRecordLimit}</td>', '{special_videomailRecordLimit}', '</tr>', '<tr>', '<td>信纸</td>', '<td>{0015_letterPapper}</td>', '<td>{0016_letterPapper}</td>', '<td>{0017_letterPapper}</td>', '{special_letterPapper}', '</tr>', '<tr>', '<td>皮肤</td>', '<td>{0015_skin}</td>', '<td>{0016_skin}</td>', '<td>{0017_skin}</td>', '{special_skin}', '</tr>', '<tr>', '<td>贺卡</td>', '<td>{0015_greetingCard}</td>', '<td>{0016_greetingCard}</td>', '<td>{0017_greetingCard}</td>', '{special_greetingCard}', '</tr>', '<tr>', '<td>明信片</td>', '<td>{0015_postcard}</td>', '<td>{0016_postcard}</td>', '<td>{0017_postcard}</td>', '{special_postcard}', '</tr>', '<tr>', '<td><a id="btn_pushemail" href="javascript:top.appView.show(\'pushemail\')">139邮箱手机客户端 详情</a></td>', '<td>{0015_pushemail}</td>', '<td>{0016_pushemail}</td>', '<td>{0017_pushemail}</td>', '{special_pushemail}', '</tr>', '<tr style="display:none">', '<td style="" rowspan="{specialfix_rowspan}">变更</td>', '<td {0015_tdattr} >', '</td>', '<td {0016_tdattr} >', '</td>', '<td {0017_tdattr}>', '</td>', '{specialfix_change}', '</tr>', '<tr>', '<td style="border-bottom:none;" class="td_0015">变更为<span class="col5Fa">免费版</span></td>', '<td style="border-bottom:none;" class="td_0016">变更为<span class="col5Fa">5</span>元版</td>', '<td style="border-bottom:none;" class="td_0017">变更为<span class="col5Fa">20</span>元版</td>', '{specialfix_empty}', '</tr>', '<tr>', '<td style="border-top:none;" class="td_0015">发<strong>KTYX</strong>到<strong>10086</strong></td>', '<td style="border-top:none;" class="td_0016">发<strong>KTYX5</strong>到<strong>10086</strong></td>', '<td style="border-top:none;" class="td_0017">发<strong>KTYX20</strong>到<strong>10086</strong></td>', '{specialfix_empty2}', '</tr>', '</tbody></table>'].join(""),
			// 适用新套餐详情接口的模板，但是屏蔽别名个数
			deprecatedAliasCount: [ '<table class="mobileF-tb">',
			 			'<tbody>',
			 				'<tr>',
			 					'<th width="100">项目</th><th width="200">',
			 					'<div class="p_relative" id="item0">',
			 						'免费版<span class="fw_n">(无升级)</span><i class="i_tc1"></i>{0015_changeurl}',
			 					'</div></th><th width="200">',
			 					'<div class="p_relative" id="item1">',
			 						'5元版<span class="fw_n">(升级50%)</span><i class="i_tc2"></i>{0016_changeurl}',
			 					'</div></th><th width="200">',
			 					'<div class="p_relative" id="item2">',
			 						'20元版<span class="fw_n">(升级200%)</span><i class="i_tc3"></i>{0017_changeurl}',
			 					'</div></th>{specialfix_th}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>功能费</td><td>{0015_price}</td><td>{0016_price}</td><td>{0017_price}</td>{special_price}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>别名设置</td><td>{0015_aliasLength}</td><td>{0016_aliasLength}</td><td>{0017_aliasLength}</td>{special_aliasLength}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>容量</td><td>{0015_volume}</td><td>{0016_volume}</td><td>{0017_volume}</td>{special_volume}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>超大附件</td><td>{0015_attachSize}</td><td>{0016_attachSize}</td><td>{0017_attachSize}</td>{special_attachSize}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>邮件到达提醒</td><td>{0015_notifyFee}</td><td>{0016_notifyFee}</td><td>{0017_notifyFee}</td>{special_notifyFee}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>自写短信</td><td>{0015_freeSms}</td><td>{0016_freeSms}</td><td>{0017_freeSms}</td>{special_freeSms}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>自写彩信</td><td>{0015_freeMms}</td><td>{0016_freeMms}</td><td>{0017_freeMms}</td>{special_freeMms}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>单次邮件群发人数</td><td>{0015_maxRecipients}</td><td>{0016_maxRecipients}</td><td>{0017_maxRecipients}</td>{special_maxRecipients}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>单次自写短信群发人数</td><td>{0015_maxSmsRecipients}</td><td>{0016_maxSmsRecipients}</td><td>{0017_maxSmsRecipients}</td>{special_maxSmsRecipients}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>单次自写彩信群发人数</td><td>{0015_maxMmsRecipients}</td><td>{0016_maxMmsRecipients}</td><td>{0017_maxMmsRecipients}</td>{special_maxMmsRecipients}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>日封顶（短信、彩信）</td><td>{0015_maxSmsDayLimit}</td><td>{0016_maxSmsDayLimit}</td><td>{0017_maxSmsDayLimit}</td>{special_maxSmsDayLimit}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>月封顶（短信、彩信）</td><td>{0015_maxSmsMonthLimit}</td><td>{0016_maxSmsMonthLimit}</td><td>{0017_maxSmsMonthLimit}</td>{special_maxSmsMonthLimit}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>通讯录条数</td><td>{0015_maxContactCount}</td><td>{0016_maxContactCount}</td><td>{0017_maxContactCount}</td>{special_maxContactCount}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>彩云网盘容量</td><td>{0015_diskVolume}</td><td>{0016_diskVolume}</td><td>{0017_diskVolume}</td>{special_diskVolume}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>彩云网盘单个文件大小</td><td>{0015_diskSingleFileSize}</td><td>{0016_diskSingleFileSize}</td><td>{0017_diskSingleFileSize}</td>{special_diskSingleFileSize}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>彩云网盘分享人数</td><td>{0015_diskShareCount}</td><td>{0016_diskShareCount}</td><td>{0017_diskShareCount}</td>{special_diskShareCount}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>文件快递容量</td><td>{0015_largeattachVolume}</td><td>{0016_largeattachVolume}</td><td>{0017_largeattachVolume}</td>{special_largeattachVolume}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>文件快递发送单次文件数</td><td>{0015_largeattachMaxFileCount}</td><td>{0016_largeattachMaxFileCount}</td><td>{0017_largeattachMaxFileCount}</td>{special_largeattachMaxFileCount}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>文件快递保存天数</td><td>{0015_largeattachExpire}</td><td>{0016_largeattachExpire}</td><td>{0017_largeattachExpire}</td>{special_largeattachExpire}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>视频邮件</td><td>{0015_videomailRecordLimit}</td><td>{0016_videomailRecordLimit}</td><td>{0017_videomailRecordLimit}</td>{special_videomailRecordLimit}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>信纸</td><td>{0015_letterPapper}</td><td>{0016_letterPapper}</td><td>{0017_letterPapper}</td>{special_letterPapper}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>贺卡</td><td>{0015_greetingCard}</td><td>{0016_greetingCard}</td><td>{0017_greetingCard}</td>{special_greetingCard}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>明信片</td><td>{0015_postcard}</td><td>{0016_postcard}</td><td>{0017_postcard}</td>{special_postcard}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>皮肤</td><td>{0015_skin}</td><td>{0016_skin}</td><td>{0017_skin}</td>{special_skin}',
			 				'</tr>',
			 				'<tr>',
			 					'<td><a id="btn_pushemail" href="javascript:top.appView.show(\'pushemail\')">139邮箱手机客户端 详情</a></td><td>{0015_pushemail}</td><td>{0016_pushemail}</td><td>{0017_pushemail}</td>{special_pushemail}',
			 				'</tr>',
			 				'<tr style="display:none">',
			 					'<td style="" rowspan="{specialfix_rowspan}">变更</td><td {0015_tdattr} ></td><td {0016_tdattr} ></td><td {0017_tdattr}></td>{specialfix_change}',
			 				'</tr>',
			 				'<tr>',
			 					'<td style="border-bottom:none;" class="td_0015">变更为<span class="col5Fa">免费版</span></td><td style="border-bottom:none;" class="td_0016">变更为<span class="col5Fa">5</span>元版</td><td style="border-bottom:none;" class="td_0017">变更为<span class="col5Fa">20</span>元版</td>{specialfix_empty}',
			 				'</tr>',
			 				'<tr>',
			 					'<td style="border-top:none;" class="td_0015">发<strong>KTYX</strong>到<strong>10086</strong></td><td style="border-top:none;" class="td_0016">发<strong>KTYX5</strong>到<strong>10086</strong></td><td style="border-top:none;" class="td_0017">发<strong>KTYX20</strong>到<strong>10086</strong></td>{specialfix_empty2}',
			 				'</tr>',
			 			'</tbody>',
			 		'</table>'].join(""),
			 		// 适用新套餐详情接口的模板，但是屏蔽别名个数，别名长度
			 		deprecatedAlias: [ '<table class="mobileF-tb">',
			 			'<tbody>',
			 				'<tr>',
			 					'<th width="100">项目</th><th width="200">',
			 					'<div class="p_relative" id="item0">',
			 						'免费版<span class="fw_n">(无升级)</span><i class="i_tc1"></i>{0015_changeurl}',
			 					'</div></th><th width="200">',
			 					'<div class="p_relative" id="item1">',
			 						'5元版<span class="fw_n">(升级50%)</span><i class="i_tc2"></i>{0016_changeurl}',
			 					'</div></th><th width="200">',
			 					'<div class="p_relative" id="item2">',
			 						'20元版<span class="fw_n">(升级200%)</span><i class="i_tc3"></i>{0017_changeurl}',
			 					'</div></th>{specialfix_th}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>功能费</td><td>{0015_price}</td><td>{0016_price}</td><td>{0017_price}</td>{special_price}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>容量</td><td>{0015_volume}</td><td>{0016_volume}</td><td>{0017_volume}</td>{special_volume}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>超大附件</td><td>{0015_attachSize}</td><td>{0016_attachSize}</td><td>{0017_attachSize}</td>{special_attachSize}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>邮件到达提醒</td><td>{0015_notifyFee}</td><td>{0016_notifyFee}</td><td>{0017_notifyFee}</td>{special_notifyFee}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>自写短信</td><td>{0015_freeSms}</td><td>{0016_freeSms}</td><td>{0017_freeSms}</td>{special_freeSms}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>自写彩信</td><td>{0015_freeMms}</td><td>{0016_freeMms}</td><td>{0017_freeMms}</td>{special_freeMms}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>单次邮件群发人数</td><td>{0015_maxRecipients}</td><td>{0016_maxRecipients}</td><td>{0017_maxRecipients}</td>{special_maxRecipients}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>单次自写短信群发人数</td><td>{0015_maxSmsRecipients}</td><td>{0016_maxSmsRecipients}</td><td>{0017_maxSmsRecipients}</td>{special_maxSmsRecipients}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>单次自写彩信群发人数</td><td>{0015_maxMmsRecipients}</td><td>{0016_maxMmsRecipients}</td><td>{0017_maxMmsRecipients}</td>{special_maxMmsRecipients}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>日封顶（短信、彩信）</td><td>{0015_maxSmsDayLimit}</td><td>{0016_maxSmsDayLimit}</td><td>{0017_maxSmsDayLimit}</td>{special_maxSmsDayLimit}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>月封顶（短信、彩信）</td><td>{0015_maxSmsMonthLimit}</td><td>{0016_maxSmsMonthLimit}</td><td>{0017_maxSmsMonthLimit}</td>{special_maxSmsMonthLimit}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>通讯录条数</td><td>{0015_maxContactCount}</td><td>{0016_maxContactCount}</td><td>{0017_maxContactCount}</td>{special_maxContactCount}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>彩云网盘容量</td><td>{0015_diskVolume}</td><td>{0016_diskVolume}</td><td>{0017_diskVolume}</td>{special_diskVolume}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>彩云网盘单个文件大小</td><td>{0015_diskSingleFileSize}</td><td>{0016_diskSingleFileSize}</td><td>{0017_diskSingleFileSize}</td>{special_diskSingleFileSize}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>彩云网盘共享人数</td><td>{0015_diskShareCount}</td><td>{0016_diskShareCount}</td><td>{0017_diskShareCount}</td>{special_diskShareCount}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>文件快递容量</td><td>{0015_largeattachVolume}</td><td>{0016_largeattachVolume}</td><td>{0017_largeattachVolume}</td>{special_largeattachVolume}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>文件快递发送单次文件数</td><td>{0015_largeattachMaxFileCount}</td><td>{0016_largeattachMaxFileCount}</td><td>{0017_largeattachMaxFileCount}</td>{special_largeattachMaxFileCount}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>文件快递保存天数</td><td>{0015_largeattachExpire}</td><td>{0016_largeattachExpire}</td><td>{0017_largeattachExpire}</td>{special_largeattachExpire}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>视频邮件</td><td>{0015_videomailRecordLimit}</td><td>{0016_videomailRecordLimit}</td><td>{0017_videomailRecordLimit}</td>{special_videomailRecordLimit}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>信纸</td><td>{0015_letterPapper}</td><td>{0016_letterPapper}</td><td>{0017_letterPapper}</td>{special_letterPapper}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>贺卡</td><td>{0015_greetingCard}</td><td>{0016_greetingCard}</td><td>{0017_greetingCard}</td>{special_greetingCard}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>明信片</td><td>{0015_postcard}</td><td>{0016_postcard}</td><td>{0017_postcard}</td>{special_postcard}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>皮肤</td><td>{0015_skin}</td><td>{0016_skin}</td><td>{0017_skin}</td>{special_skin}',
			 				'</tr>',
			 				'<tr>',
			 					'<td><a id="btn_pushemail" href="javascript:top.appView.show(\'pushemail\')">139邮箱手机客户端 详情</a></td><td>{0015_pushemail}</td><td>{0016_pushemail}</td><td>{0017_pushemail}</td>{special_pushemail}',
			 				'</tr>',
			 				'<tr style="display:none">',
			 					'<td style="" rowspan="{specialfix_rowspan}">变更</td><td {0015_tdattr} ></td><td {0016_tdattr} ></td><td {0017_tdattr}></td>{specialfix_change}',
			 				'</tr>',
			 				'<tr>',
			 					'<td style="border-bottom:none;" class="td_0015">变更为<span class="col5Fa">免费版</span></td><td style="border-bottom:none;" class="td_0016">变更为<span class="col5Fa">5</span>元版</td><td style="border-bottom:none;" class="td_0017">变更为<span class="col5Fa">20</span>元版</td>{specialfix_empty}',
			 				'</tr>',
			 				'<tr>',
			 					'<td style="border-top:none;" class="td_0015">发<strong>KTYX</strong>到<strong>10086</strong></td><td style="border-top:none;" class="td_0016">发<strong>KTYX5</strong>到<strong>10086</strong></td><td style="border-top:none;" class="td_0017">发<strong>KTYX20</strong>到<strong>10086</strong></td>{specialfix_empty2}',
			 				'</tr>',
			 			'</tbody>',
			 		'</table>'].join(""),

			deprecatedAliasDecrease: [ '<table class="mobileF-tb">',
			 			'<tbody>',
			 				'<tr>',
			 					'<th width="100">项目</th><th width="200">',
			 					'<div class="p_relative" id="item0">',
			 						'免费版<span class="fw_n">(无升级)</span><i class="i_tc1"></i>{0015_changeurl}',
			 					'</div></th><th width="200">',
			 					'<div class="p_relative" id="item1">',
			 						'5元版<span class="fw_n">(升级50%)</span><i class="i_tc2"></i>{0016_changeurl}',
			 					'</div></th><th width="200">',
			 					'<div class="p_relative" id="item2">',
			 						'20元版<span class="fw_n">(升级200%)</span><i class="i_tc3"></i>{0017_changeurl}',
			 					'</div></th>{specialfix_th}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>邮箱容量</td><td>{0015_volume}</td><td>{0016_volume}</td><td>{0017_volume}</td>{special_volume}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>彩云网盘容量</td><td>{0015_diskVolume}</td><td>{0016_diskVolume}</td><td>{0017_diskVolume}</td>{special_diskVolume}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>暂存柜容量</td><td>{0015_largeattachVolume}</td><td>{0016_largeattachVolume}</td><td>{0017_largeattachVolume}</td>{special_largeattachVolume}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>超大附件</td><td>{0015_attachSize}</td><td>{0016_attachSize}</td><td>{0017_attachSize}</td>{special_attachSize}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>单次邮件群发人数</td><td>{0015_maxRecipients}</td><td>{0016_maxRecipients}</td><td>{0017_maxRecipients}</td>{special_maxRecipients}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>自写短信</td><td>{0015_freeSms}</td><td>{0016_freeSms}</td><td>{0017_freeSms}</td>{special_freeSms}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>自写彩信</td><td>{0015_freeMms}</td><td>{0016_freeMms}</td><td>{0017_freeMms}</td>{special_freeMms}',
			 				'</tr>',	 				
			 				'<tr>',
			 					'<td>通讯录条数</td><td>{0015_maxContactCount}</td><td>{0016_maxContactCount}</td><td>{0017_maxContactCount}</td>{special_maxContactCount}',
			 				'</tr>',
			 				'<tr>',
			 					'<td>彩云网盘单个文件大小</td><td>{0015_diskSingleFileSize}</td><td>{0016_diskSingleFileSize}</td><td>{0017_diskSingleFileSize}</td>{special_diskSingleFileSize}',
			 				'</tr>',
			 				'<tr style="display:none">',
			 					'<td style="" rowspan="{specialfix_rowspan}">变更</td><td {0015_tdattr} ></td><td {0016_tdattr} ></td><td {0017_tdattr}></td>{specialfix_change}',
			 				'</tr>',
			 				'<tr>',
			 					'<td style="border-bottom:none;" class="td_0015">变更为<span class="col5Fa">免费版</span></td><td style="border-bottom:none;" class="td_0016">变更为<span class="col5Fa">5</span>元版</td><td style="border-bottom:none;" class="td_0017">变更为<span class="col5Fa">20</span>元版</td>{specialfix_empty}',
			 				'</tr>',
			 				'<tr>',
			 					'<td style="border-top:none;" class="td_0015">发<strong>KTYX</strong>到<strong>10086</strong></td><td style="border-top:none;" class="td_0016">发<strong>KTYX5</strong>到<strong>10086</strong></td><td style="border-top:none;" class="td_0017">发<strong>KTYX20</strong>到<strong>10086</strong></td>{specialfix_empty2}',
			 				'</tr>',
			 			'</tbody>',
			 		'</table>'].join(""),
              
            //     tr:'<tr>{0}</tr>',
            //   td:'<td {1}>{0}</td>',
            // th:'<th {1}>{0}</th>',
            parnerContainer: ['<h3 class="mobileF-h3">邮箱伴侣</h3>', '<div>', '<div class="tips mailBl">', '<div class="tips-text" id="partnerinfo">', '{0}', '</div>', '<div class="tipsBottom diamond"></div>', '</div>', '<div class="mailBl-bot clearfix" id="parnerstatus">', '{1}', '</div>', '</div>'].join(""),
            partnerFalse: [ '<div class="mailBl-left">',
             '<a href="javascript:" id="btn_open" class="btnSet"><span>立即开通</span></a>',
             '<p class="mailBl-title">享受服务超值升级！ </p>',
             '资费：<b class="col5Fa">{0}</b> 元/月',
             '<p class="mailBl-zx">短信开通：编辑短信 <span>B</span> 到 <span>{1}</span>',
         '</div>'].join(""),
            partnerTrue: [ '<div class="mailBl-left">',
             '<span class="abo">资费：<b class="col5Fa">{0}</b> 元/月</span>',
             '<p class="fz_14">您的邮箱伴侣：<b class="col5Fa">已经开通</b>  </p>',
             '尊享服务超值升级！',
             '<p class="mailBl-zx">短信注销：编辑短信 <span>ZXB</span> 到 <span>{1}</span> ,即可注销</p>',
         '</div>'].join(""),
            partnerTips: [ '<ul class="mailBlList">',
             '<li>',
                 '<i class="i_mbl_cx"></i>',
                 '<p>',
                     '<strong>短信</strong><br/>',
                     '<em>+{sms}条</em>',
                 '</p>',
             '</li>',
                '<li>',
                 '<i class="i_mbl_dx"></i>',
                 '<p>',
                     '<strong>彩信</strong><br/>',
                     '<em>+{mms}条</em>',
                 '</p>',
             '</li>',
             '<li>',
                 '<i class="i_mbl_wp"></i>',
                 '<p>',
                     '<strong>彩云网盘</strong><br/>',
                     '<em>+{disk}G</em>',
                 '</p>',
             '</li>',
             '<li id="li_fax">',
                 '<i class="i_mbl_cz"></i>',
                 '<p>',
                     '<strong>传真</strong><br>',
                     '<em>+<b>10</b>张(同城)</em>',
                 '</p>',
             '</li>',
            
         '</ul>'].join(""),
		 partnerTipsHebei: [ '<ul class="mailBlList">',
             '<li>',
                 '<i class="i_mbl_cx"></i>',
                 '<p>',
                     '<strong>短信</strong><br/>',
                     '<em>+{sms}条</em>',
                 '</p>',
             '</li>',
             '<li id="li_fax">',
                 '<i class="i_mbl_dy"></i>',
                 '<p>',
                     '<strong id="reading">特供杂志</strong><br>',
                     '<em>+{reading}本</em>',
                 '</p>',
             '</li>',
            '<li id="li_fax">',
                 '<i class="i_mbl_cz"></i>',
                 '<p>',
                     '<strong>彩信</strong><br>',
                     '<em>+{mms}条</em>',
                 '</p>',
             '</li>',
			 '<li id="li_fax">',
                 '<i class="i_mbl_txl"></i>',
                 '<p>',
                     '<strong>通讯录条数</strong><br>',
                     '<em>+{contactAddition}条</em>',
                 '</p>',
             '</li>',
         '</ul>'].join(""),
            packageTips: ['<div class="tips mobileF-tips" style="width:130px">', '<div class="tips-text fw_n" id="mypackage">', '您在使用：{0}<i class="{1}"></i>', '</div>', '<div class="tipsBottom diamond"></div>', '</div>'].join(""),
            cancelPackage: ['注销套餐：发送 {0} 到 10086,或 <a href="javascript:top.$App.jumpTo(\'orderinfo\');">点击注销</a>'].join("")
        },

        /** 是否支持邮箱伴侣 */
        isShowPartner: function () {
            //return false;
            var code = top.$User.getProvCode();
            //邮箱伴侣暂时支持[辽宁,贵州,广东]
            return code == 1 || code == 10 || code == 7 || code == 14;
        },
        mailParternOpen: function () {
            var self = this;
            //window.location.href = "mailpartern_open.html?sid=" + top.$App.getSid();
            var provCode = top.$User.getProvCode();
            var data = { Enable: 1, comefrom: "web" }; // 1 - 开通  0 - 取消
            if (provCode == 10) { //贵州

                self.model.openMailPartern(data, function (result) {
                    if (result == "S_OK") { //开通成功
                        top.$Msg.alert("您将会收到一条确认开通邮箱伴侣的短信，按提示回复成功后即刻开通");
                        top.BH("partner_open_gz");
                        window.location.href = window.location.href;//刷新
                    } else {
                        top.$Msg.alert("开通失败(" + result + ")");
                    }
                });
                

            } else if (provCode == 7) { //辽宁
                top.$Msg.confirm("确认您将开通邮箱伴侣增值包", function () {
                    self.model.openMailPartern(data, function (result) {
                        if (result == "S_OK") { //开通成功
                            top.$Msg.alert("您已成功开通邮箱伴侣");
                            top.BH("partner_open_ln");
                            window.location.href = window.location.href;//刷新
                        }  else {
                            top.$Msg.alert("开通失败(" + result + ")");
                        }
                    });
                   
                });

            }
        },
        /**
         * 邮箱伴侣信息输出，暂时支持[辽宁,贵州,广东] provCode == 1 || provCode == 10 || provCode == 7
         */
        showParnerInfo: function() {
            var self = this;
            var provCode = top.$User.getProvCode();
            if (this.isShowPartner()) { //邮箱伴侣暂时支持[辽宁,贵州,广东,河北]
                top.BH("partner_entry");
                self.model.getMailPatterInfo(function (data) {

                    var d = data;
                    var statusHtml = '';
                    var status = d.currentEnable;
                    var partnerTips = self.template["partnerTips"];
                    if(provCode == 14){
                    	partnerTips = self.template["partnerTipsHebei"];
                    }
                    var addtionalHtml = top.$T.Utils.format(partnerTips, {
                        sms: d.smsAddition,
                        mms:  d.mmsAddition,
                        disk:  d.diskAddition ,
                        fax:  d.faxAddition,
                        contactAddition: d.contactAddition,
                        reading: d.readingAddition
                    });

                    var isOpen = (status == '1');
                    if (isOpen) { //已开通
                        statusHtml = self.template["partnerTrue"];
                    } else { //未开通
                        statusHtml = self.template["partnerFalse"];
                    }
                    var smsPort = "106586839";//短信端口
                    if (provCode == 7 || provCode == 10) { //辽宁贵州是10658139
                        smsPort = "10658139";
                    }
                    statusHtml = top.$T.Utils.format(statusHtml, [d.fee, smsPort]);
                    var html = ["<h3 class=\"mobileF-h3\">邮箱伴侣</h3><div class=\"mailBl\">",
                        statusHtml, addtionalHtml, "</div>"].join("");

                    $('#mobiletc').before(html);
                    if (provCode == 1) { //广东不显示开通
                        $("#btn_open").hide();
                        var str = isOpen ? "<b  style='color:green'>已经开通</b>" : "<b style='color:red'>未开通</b>";
                        $(".fz_14").html("您的邮箱伴侣：" + str);
                        //$(".mailBl-title")[0].className = "fz_14";
                       
                    } else if(provCode == 14){ //河北省份
                    	$('#btn_open').hide();
                    	if(isOpen){
	                    	var replaceStr = '<a style="color: blue; font-weight: normal;" href="javascript:top.appView.showSubscribe(true)"></a>'
	                    	$('#reading').wrap(replaceStr).css('color','blue');
	                    }


                    }else{
                        //其它省份隐藏传真
                        $("#li_fax").children().hide();
                    }
                });
            }
        },


        /**
         * 套餐信息输出
         */
        showMealInfo: function() {
            var self = this;
            var td = self.template.td;
            var th = self.template.th;
            var tr = self.template.tr;

            self.model.getMealInfo(function(data) {

                var mealObj = self.model.get('mealobj');
                var myMeal = data['serviceItem'];
                var servieName = data['serviceName'];
                var mealArray = ['0015', '0016', '0017'];
                var currentMeal = ''//'您正在使用:' + servieName;
                
                //广东用户免费版兼容
                if(myMeal == '0010') {
                    myMeal = '0015';
                }

                //特别套餐处理[上海，浙江，云南，北京，山东]
                var specialMeal = false;
                if($.inArray(myMeal, mealArray) == -1) {
                    specialMeal = true;
                }

                //判断当前套餐提示层 
                var mealTipsData = {
                    '0015': {
                        id: '#item0',
                        style: 'i_tc1',
                        cancelsms: 'QXYX'
                    },
                    '0016': {
                        id: '#item1',
                        style: 'i_tc2',
                        cancelsms: 'QXYX5'
                    },
                    '0017': {
                        id: '#item2',
                        style: 'i_tc3',
                        cancelsms: 'QXYX20'
                    }
                };
                if(specialMeal) {
                    mealTipsData[myMeal] = {
                        id: '#item3',
                        style: 'i_tc4',
                        cancelsms: ''
                    };
                }
                //console.log(mealTipsData);               
                //获取变更按钮


                function getChangeBtn(special, myMeal, formatobj) {
                    var changeTextArray = {
                        '0015': ['', '立即升级', '立即升级'],
                        '0016': ['变更为免费版', '', '立即升级'],
                        '0017': ['变更为免费版', '变更为5元版', ''],
                        'special': ['变更为免费版', '变更为5元版', '变更为20元版']
                    };

                    function getchangeUrl(id,changebh,changetext){
                        if (changetext != '') {
                            var temp = '<a href="{changeurl}" bh="{changebh}" class="btnSure" target="_blank"><span>{changetext}</span></a>';
                            //var temp = '<a href="{changeurl}" bh="{changebh}" class="btnNormal" target="_blank"><span>{changetext}</span></a>';

                            if (/变更为\S+版/.test(changetext)) {
                                temp = '<a href="{changeurl}" bh="{changebh}" class="btn_not" target="_blank"><span>{changetext}</span></a>';
                            }
                            var changeurl = '/m2012/html/set/feature_meal_upgrade1.html?sid=' + top.$App.getSid() + '&to=' + id; 
                            return  top.$T.format(temp,{
                                changeurl:changeurl,
                                changebh:changebh,
                                changetext:changetext
                            });
                        }else{
                            return currentMeal;
                        }
                    } 

                    var changeUrlArray = {
                        '0015': [getchangeUrl(''), getchangeUrl('0016'), getchangeUrl('0017')],
                        '0016': [getchangeUrl('0015'), getchangeUrl(''), getchangeUrl('0017')],
                        '0017': [getchangeUrl('0015'), getchangeUrl('0016'), getchangeUrl('')],
                        'special': [getchangeUrl('0015'), getchangeUrl('0016'), getchangeUrl('0017')]
                    };

                    var changeBhArray = {
                        '0015': ["mobile_cancel0", "mobile_change5", "mobile_change20"],
                        '0016': ["mobile_change0", "mobile_cancel5", "mobile_change20"],
                        '0017': ["mobile_change0", "mobile_change5", "mobile_cancel20"],
                        'special': ["mobile_change0", "mobile_change5", "mobile_change20"]
                    };

                    var text;
                    if(special) {
                        text = changeTextArray['special'];
                    } else {
                        text = changeTextArray[myMeal];
                    }
                    formatobj['0015_change'] = text[0];
                    formatobj['0016_change'] = text[1];
                    formatobj['0017_change'] = text[2];

                    var url;
                    var bh;
                    if(special) {
                        url = changeUrlArray['special'];
                        bh = changeBhArray['special'];
                    } else {
                        url = changeUrlArray[myMeal];
                        bh = changeBhArray[myMeal];
                    }

                    formatobj['0015_changeurl'] = getchangeUrl('0015',bh[0],text[0]);
                    formatobj['0016_changeurl'] = getchangeUrl('0016',bh[1],text[1]);
                    formatobj['0017_changeurl'] = getchangeUrl('0017',bh[2],text[2]);
                    
                    formatobj['0015_changebh'] = bh[0];
                    formatobj['0016_changebh'] = bh[1];
                    formatobj['0017_changebh'] = bh[2];

                    //套餐表格属性
                    function gettdattr(id){
                        if(id == myMeal){
                            return ' style="text-align:center;" rowspan="3" ';
                        }else{
                            return ' style="border-bottom:none;text-align:center;" ';
                        }
                    }

                    formatobj['0015_tdattr'] = gettdattr('0015');
                    formatobj['0016_tdattr'] = gettdattr('0016');
                    formatobj['0017_tdattr'] = gettdattr('0017');

                    return formatobj;
                }

                //绑定套餐数据
                var formatobj = {};
                if(!specialMeal) {
                    formatobj = getChangeBtn(false, myMeal, formatobj);
                } else {
                    formatobj = getChangeBtn(true, myMeal, formatobj);
                }

                //特别套餐特别处理
                if(specialMeal) {
                    mealArray.push(myMeal);
                    formatobj['specialfix_rowspan'] = '4';
                    formatobj['specialfix_empty'] = '<td style="border-bottom:none"></td>';
                    formatobj['specialfix_empty2'] = '<td style="border-top:none"></td>';
                    formatobj['specialfix_th'] = '<th><div class="p_relative" id="item3">' + data['serviceName'] + '</div></th>';
                    formatobj['specialfix_change'] = '<td style="border-bottom:none;text-align:center;"></td>';
                } else {
                    formatobj['specialfix_rowspan'] = '3';
                }

                for(var i = 0; i < mealArray.length; i++) {
                	console.log(data[mealArray[i]]);
                    if(data[mealArray[i]]) {
                        for(var j in data[mealArray[i]]) {
                            if(specialMeal && mealArray[i] == myMeal) {
                                formatobj[mealArray[i] + '_' + j] = '<td>' + data[mealArray[i]][j] + '</td>'; //特别套餐处理
                            } else {
                                formatobj[mealArray[i] + '_' + j] = data[mealArray[i]][j];
                            }
                        }
                    }
                }
                // console.log(formatobj);
                //输出html update by tkh
                var temp = self.template.tableForOldApi;
                if(top.SiteConfig.mealUpgradeOld){
                	temp = self.template.tableForOldApi;
                }
                if(top.SiteConfig.mealUpgradeAliasCount){
                	temp = self.template.deprecatedAliasCount;
                }
                if(top.SiteConfig.mealUpgradeAlias){
                	//temp = self.template.deprecatedAlias;
                	temp = self.template.deprecatedAliasDecrease
                }
                
                if(specialMeal) {
                    temp = temp.replace(/special_/gi, myMeal + '_');
                }
                
                //前端把邮箱容量都改成“自动翻倍”
                if(top.SiteConfig.volumeSetByUs){
	                formatobj['0015_volume'] = '自动翻倍';
	                formatobj['0016_volume'] = '自动翻倍';
	                formatobj['0017_volume'] = '自动翻倍';
	            }

                var _table = $T.Utils.format(temp, formatobj);
                _table += '<a href="javascript:void(0)" style="line-height:30px" onclick="top.$App.showOrderinfo()">查看更多</a>'
                $("#mobiletc h3").after(_table);
                var mealTips = $T.Utils.format(self.template.packageTips, [servieName, mealTipsData[myMeal].style]);
                $(mealTipsData[myMeal].id).append(mealTips);

                /** 隐藏注销套餐信息 
                if(!specialMeal) {
                    var cancelInfo = $T.Utils.format(self.template.cancelPackage, [mealTipsData[myMeal].cancelsms]);
                    $('#cancel').html(cancelInfo);
                } */

                //处理注销单元
                $('.td_' + myMeal).remove();
                //$('.td_' + myMeal).html('');
                //$('.td_' + myMeal + ':eq(0)').css('text-align','center').html('--');
							//暂时去掉套餐底部的变更信息（短信发送方式）
							var trs = $("table.mobileF-tb").find("tr");
							trs.eq(trs.length-1).hide();
							trs.eq(trs.length-2).hide();
							trs.eq(trs.length-3).find("td").attr("style","").attr("rowspan","");
            })

        },

        render: function() {
            var self = this;
            //var status = false; //判断是否开通邮箱伴侣
            this.showParnerInfo();
            self.showMealInfo();
            top.BH('meal_page_load');
        }
    })

    );

    $(function() {
        //top.M139.Timing.waitForReady('top.$App.getConfig("UserData")',function(){
        if($('.mobileF-tb').length == 0) {
            var mobilefeaturesView = new M2012.Settings.Mobilefeatures.View();
            mobilefeaturesView.render();
        }
        //});
    })

})(jQuery, _, M139);