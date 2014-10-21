/**
* @fileOverview 实现设置页的显示，点链接跳到相应的设置页面，设置页8个tab选项的切换和相应iframe的关联。
*/


(function (jQuery, _, M139) {

    /**
    *@namespace 
    *实现设置页的显示，点链接跳到相应的设置页面，设置页8个tab选项的切换和相应iframe的关联。
    */
    M139.namespace("M2012.Settings.Main.Model", Backbone.Model.extend(
    /**
    *@lends SetModel.prototype
    */
    {
        defaults: {
            tabid: ""
        },
        getSid: function () {
            var sid = $T.Url.queryString("sid");
            return sid;
        },
        linkData: function () {
            var sid = setModel.getSid();
            var data = {//同一选项卡下的设置页group设成一样的
                account: { url: "set/account.html?sid=" + sid, site: "", title: "设置", group: "setting", setgroup: "setting" },
                sign: { url: "set/account.html?sid=" + sid+"#jumpToSign", site: "", title: "设置", group: "setting", setgroup: "setting" },
                editLockPass: { url: "set/mobile.html?sid=" + sid, site: "", title: "设置", group: "setting", setgroup: "setting" },
                preference: { url: "set/preference.html?sid=" + sid, site: "", title: "设置", group: "setting", setgroup: "preference" },
                popmail: { url: "set/pop.html?sid=" + sid, site: "", title: "设置", group: "setting", setgroup: "popmail" },
                addpop: { url: "set/add_pop.html?sid=" + sid, site: "", title: "设置", group: "setting", setgroup: "popmail" },
                addpopok: { url: "set/add_pop_ok.html?sid=" + sid, site: "", title: "设置", group: "setting", setgroup: "popmail" },
                type: { url: "set/sort.html?sid=" + sid, site: "", title: "设置", group: "setting", setgroup: "type" },
                createType: { url: "set/create_sort.html?&type=normal&sid=" + sid, site: "", title: "设置", group: "setting", setgroup: "type" },
                tags: { url: "set/tags.html?sid=" + sid, site: "", title: "设置", group: "setting", setgroup: "tags" },
                notice: { url: "set/notice.html?sid=" + sid, site: "", title: "设置", group: "setting", setgroup: "notice" },
                spam: { url: "set/spam.html?sid=" + sid, site: "", title: "设置", group: "setting", setgroup: "spam" },
                mobile: { url: "set/mobile.html?sid=" + sid, site: "", title: "设置", group: "setting", setgroup: "mobile" }
            }
            return data;
        }

    })
    );
    setModel = new M2012.Settings.Main.Model();

})(jQuery, _, M139);


