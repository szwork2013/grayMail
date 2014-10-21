var AdvSearch = {
    //提示语
    Messages: {
        MAXKeyWord: "最大长度30字节（15个汉字）"
    },
    Ajax: {
        getUserInfo: function() {
            if (!window["cacheUid"]) {
                window["cacheUid"] = Utils.queryString("sid", window.parent.location.href)
            }
            return window["cacheUid"];
        },
        getAllDirectory: function() {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) return;
            //取得main层目录信息数据
            if (DiskTool.getDiskWindow().parent.dirInfo) {
                var dirData = DiskTool.getDiskWindow().parent.dirInfo.dirs;
            }
            if (dirData) {
                var select = $("#docPosition");
                select.empty();
                var selectedIndex = 0;
                var pid = Utils.queryString("pid", window.location.href);
                if (pid == null || pid == "") {
                    selectedIndex = 0;
                }
                var domSelect = select[0];
                //添加我的彩云的option
                var opMain = new Option(DiskConf.rootDirName, DiskConf.diskRootDirID);
                domSelect.options.add(opMain);
                //添加用户文件夹的option
                for (var i = 0, len = dirData.length; i < len; i++) {
                    var single = dirData[i];
                    var strHtml = "";
                    var space = jQuery.browser.msie ? "　" : "&nbsp;&nbsp;&nbsp;";
                    for (var j = 0; j < single.dirlevel; j++) {
                        strHtml += space;
                    }
                    strHtml += "|--" + single.dirname;
                    var op = new Option(strHtml, single.dirid);
                    if (!jQuery.browser.msie) {
                        op.innerHTML = strHtml;
                    }
                    if (selectedIndex == 0 && single.dirid == pid) {
                        selectedIndex = i;
                        op.selected = true;
                    }
                    domSelect.options.add(op);
                }
                //添加我的相册和我的音乐
                var opMusic = new Option(DiskConf.musicDirName, DiskConf.musicDirID);
                //opMusic.innerHTML = DiskConf.musicDirName
                domSelect.options.add(opMusic);

                var opPhoto = new Option(DiskConf.albumDirName, DiskConf.albumDirID);
               // opPhoto.innerHTML = DiskConf.albumDirName
                domSelect.options.add(opPhoto);

                domSelect.selectedIndex = selectedIndex;
            }
        }
    },
    __clickAnchor: function(id, action) {
        $.getById(id).click(function(e) {
            if (action) {
                action();
            }
            e.preventDefault();
        });
    }
}
var Toolbar = {
    initial: function() {
        //Id跟函数之间的映射
        var map = {
            "aBack": "back"
        };
        $.each(map, function(name, val) {
            $.getById(name).click(function(e) {
                if (!this.disabled) {
                    Toolbar[val]();
                }
                e.preventDefault();
            });
        });
    },
    //返回上一层
    back: function() {
        window.history.go(-1);
    }
}
$(function() {
    DiskTool.useWait();
    Toolbar.initial();
    AddListenScroll();
    AdvSearch.Ajax.getAllDirectory();

    //开始时间与结束时间
    var sDpc = new datePickCtl("s");
    var eDpc = new datePickCtl("e");

    var getChecked = function(id) {
        return $.getById(id, true).checked;
    }
    var getSelected = function(id) {
        var select = $.getById(id, true);
        return select.options[select.selectedIndex];
    }
    var getRadioValue = function(groupName) {
        return $(":radio:checked[name='" + groupName + "']");
    }
    var formatDateString = function(year, month, day) {
        return "{0}-{1}-{2}".format(year, month, day);
    }

    //获取开始时间和结束时间
    var getStartDateAndEndDate = function() {
        var groupName = "uploadDate";
        var result = ["", ""];
        var index = parseInt(getRadioValue(groupName).val());
        if (index == null || index == 0) {
            return result;
        }
        var now = "";
        switch (index) {
            case 1: //1周
            case 2: //1月
            case 3:
                {//1年
                    //标记类型
                    result[0] = index;
                    break;
                }
            case 4:
                {
                    //指定范围
                    result[0] = sDpc.getString();
                    result[1] = eDpc.getString();
                    break;
                }
        }
        return result;
    };

    //获取文件大小限制
    var getLimitAndIslow = function() {
        var group = "size";
        var result = [0, false];
        var index = parseInt(getRadioValue(group).val());
        if (index == null || index == 0) {
            return result;
        }
        var now = "";
        switch (index) {
            case 1:
                {
                    result = [100 * 1024, false];
                    break;
                }
            case 2:
                {
                    result = [100 * 1024, true];
                    break;
                }
            case 3:
                {
                    result = [1024 * 1024, false];
                    break;
                }
            case 4:
                {
                    result = [1024 * 1024, true];
                    break;
                }
            case 5:
                {
                    var sizeTextBox = $(".size-range>:text");
                    result[0] = parseInt(sizeTextBox.val());
                    if (isNaN(result[0])) {
                        result[0] = 0;
                    } else if (sizeTextBox.attr("rel") == "KB") {
                        result[0] *= 1024; //原来B改为KB
                    }
                    result[1] = $(".size-range>select")[0].selectedIndex == 0;
                }
        }
        return result;
    }
    //上传时间
    var radioUploadDate = function(val) {
        if (val == "4") {
            sDpc.enable();
            eDpc.enable();
        } else {
            sDpc.disable();
            eDpc.disable();
        }
    }
    $(":radio[name='uploadDate']").click(function() {
        var val = this.value;
        radioUploadDate(val);
    });
    radioUploadDate(getRadioValue("uploadDate").val());

    //文件大小
    var radioSize = function(val) {
        if (val == "5") {
            $(".size-range>:text,.size-range>select").removeAttr("disabled");
        } else {
            $(".size-range>:text,.size-range>select").attr("disabled", true);
        }
    }
    $(":radio[name='size']").click(function() {
        var val = this.value;
        radioSize(val);
    });
    radioSize(getRadioValue("size").val());

    //文件类型
    var cbDocType = $("#trDoctype>td>ul>li>:checkbox");
    var radioType = function(val) {
        if (val == "1") {
            cbDocType.removeAttr("disabled");
        } else {
            cbDocType.attr("disabled", true);
        }
    }
    $(":radio[name='doctype']").click(function() {
        radioType(this.value);
    });
    radioType(getRadioValue("doctype").val());

    $("#btnSearch").click(function() {
        var keyword = $.trim($("#txtKey").val());
        var len = DiskTool.len(keyword);
        if (len > 30) {
            DiskTool.FF.alert(AdvSearch.Messages.MAXKeyWord);
            return false;
        }
        var selectPos = $.getById("docPosition", true);
        var sAnde = getStartDateAndEndDate();
        if (sAnde[0] != "" && sAnde[1] != "" && (sDpc.getDate() - eDpc.getDate()) > 0) {
            DiskTool.FF.alert("开始时间不能大于结束时间");
            return false;
        }
        var limit = getLimitAndIslow();
        var ftype = [];
        if (getRadioValue("doctype").val() != "0") {
            ftype = $("#trDoctype>td>ul>li>:checkbox:checked").map(function() {
                return this.value;
            });
            ftype = $.makeArray(ftype).join(",");
        }
        var para = {
            "sid": AdvSearch.Ajax.getUserInfo(),
            "searchtype": 2,
            "keyword": keyword,
            "matchcase"   : getChecked("cbMatchCase") ? 1 : 0,
            "directoryid": selectPos.options[selectPos.selectedIndex].value,
            "includechild": getChecked("cbInclude"),
            "startdate": sAnde[0],
            "enddate": sAnde[1],
            "limit": limit[0],
            "upperorlower": limit[1],
            "filetype": ftype
        };
        //组合搜索Url
        url = DiskTool.appendParaToUrl(DiskTool.replace(window.location.href, "adv-search", "search"), para);
        //跳转
        window.location.href = url;
    });
    $("#btnBack").click(function() {
        window.location.href = "disk_default.html";
    });
});
//日期选择器
var datePickCtl = function(prefix) {
    var temp = this;
    this.y = $("#{0}Year".format(prefix)).data("dpc", this).empty();
    this.m = $("#{0}Month".format(prefix)).data("dpc", this).empty();
    this.d = $("#{0}Day".format(prefix)).data("dpc", this).empty();
    this.disable = function() {
        temp.y.attr("disabled", true);
        temp.m.attr("disabled", true);
        temp.d.attr("disabled", true);
    };
    this.enable = function() {
        temp.y.removeAttr("disabled");
        temp.m.removeAttr("disabled");
        temp.d.removeAttr("disabled");
    }

    this.getValue = function(ctl) {
        return $(ctl).val();
    }
    this.getYear = function() {
        return parseInt(temp.getValue(temp.y));
    }
    this.getMonth = function() {
        return parseInt(temp.getValue(temp.m));
    }
    this.getDay = function() {
        return parseInt(temp.getValue(temp.d));
    }
    this.getString = function() {
        return "{0}-{1}-{2}".format(temp.getYear(), temp.getMonth(), temp.getDay());
    }
    this.getDate = function() {
        return new Date(temp.getYear(), temp.getMonth() - 1, temp.getDay());
    }
    this.now = new Date();

    //初始化
    //------加载年
    var tempYear = this.now.getFullYear();
    for (var i = tempYear; i >= 1900; i--) {
        var op = $("<option value='" + i + "'>" + i + "</option>");
        if (i == tempYear) {
            op[0].selected = true;
        }
        this.y.append(op);
    }
    //------加载月
    var tempMonth = this.now.getMonth() + 1;
    for (var i = 1; i <= 12; i++) {
        var op = $("<option value='" + i + "'>" + i + "</option>");
        if (i == tempMonth) {
            op[0].selected = true;
        }
        this.m.append(op);
    }
    //------加载日
    var loadDay = function(dCtl, year, month, initialDay) {
        dCtl.empty();
        var day = 30;
        switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                {
                    day = 31;
                    break;
                }
            case 2:
                {
                    day = (year % 4 == 0 ? 29 : 28);
                    break;
                }
        }
        for (var i = 1; i <= day; i++) {
            var op = $("<option value='" + i + "'>" + i + "</option>");
            if (initialDay && initialDay == i) {
                op[0].selected = true;
            }
            dCtl.append(op);
        }
    }
    loadDay(this.d, this.now.getYear(), tempMonth, this.now.getDate());
    //-----注册控件事件
    this.y.change(function() {
        var dpc = $(this).data("dpc");
        //加载日
        loadDay(dpc.d, dpc.getYear(), 1);
        dpc.m[0].selectedIndex = 0;
        dpc.d[0].selectedIndex = 0;
    });

    this.m.change(function() {
        var dpc = $(this).data("dpc");
        //加载日
        loadDay(dpc.d, dpc.getYear(), dpc.getMonth());
        dpc.d[0].selectedIndex = 0;
    });
}
DiskTool.cResizeWrapper();