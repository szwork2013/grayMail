/**
 * 彩云侧兼容
 * 将一些公共的变量通过此JS来实现差异化处理,最终实现兼容彩云
 */
(function () {
    function getSid() { var B = location.search; B = B.split(/&|\?/); var $ = null; for (var D = 0; D < B.length; D++) { var C = B[D], A = C.split("="); if (A[0].toLowerCase() == "sid") { $ = A[1]; break } } if (!$) { var _ = new Date(); $ = [_.getFullYear(), (_.getMonth() > 9 ? "" : "0") + (_.getMonth() + 1), (_.getDate() > 9 ? "" : "0") + _.getDate(), (_.getHours() > 9 ? "" : "0") + _.getHours()].join("") } return $ }

    window.srcPath = "";
    var caiyunExtObj = {
        /**
         * 加载js脚本资源文件
        **/
        loadScript: function (src, doc, options) {
            doc = doc || document;
            options = options || {};
            var charset = options.charset || "utf-8";
            var onload = options.onload;
            if (src) {
                src += ((src.indexOf("?") == -1) ? "?" : "&") + "sid=" + getSid();
            }
            if (src && src.indexOf("/") == -1) {
                src = "http://" + location.hostname + window.srcPath + "/m2012/js/packs/" + src;
            }
            var tag = "<script src=" + src + " charset=" + charset + " type='text/javascript'><" + "/script>";
            doc.write(tag);
            if (onload) {
                if (window.addEventListener) {
                    window.addEventListener("load", onload, false);
                    return;
                }
                window.attachEvent("onload", onload);
            }
        },
        /**
         * 异步下载js并添加到文档头中
         * @param {String} args.src        //要加载的js地址(此处指定为/m2012/js/packs/目录下)
         * @param {String} args.charset    //脚本的编码类型默认uft-8
         * @param {String} args.id         //脚本元素的ID号
         * @param {Object} onload          //脚本加载完成后的处理函数
         * @param {Boolean} args.isResolve //是否需要解析js脚本（如果是的情况下则通过AJAX下载js内容后做处理再附加到文档头中）        
        **/
        loadScriptAsync: function (args, onload) {
            args = args || {};
            var src = "http://" + location.hostname + window.srcPath + args.src;
            var headerEl = document.getElementsByTagName("HEAD")[0];
            var scriptEl = document.createElement("script");

            scriptEl.type = "text/javascript";
            scriptEl.charset = args.charset || "utf-8";

            if (args.id) {
                scriptEl.id = args.id;
            }

            if (args.isResolve) {
                jQuery.get(src, { sid: getSid() }, function (text) {
                    text = text || "";
                    //日历中的代码只要出现window.top就会跨域
                    //此处将代码中的 window.top和top. 替换成成window._top以解决问题
                    text = text.replace(/\bwindow\.top\b/gm, "window._top")
                        .replace(/\btop\./gm, "_top.");
                    scriptEl.text = text;
                    headerEl.appendChild(scriptEl);
                    onload && onload();
                }, "text");
            } else {
                src += (src.indexOf("?") > -1 ? "&" : "?") + "sid=" + getSid();
                scriptEl.src = src;
                headerEl.appendChild(scriptEl);
                onload && onload();
            }
        },    
        /**
         * 加载css资源文件
        **/
        loadCSS: function (path, _doc) {
            if (typeof path == "string") {
                path = [path];
            }
            for (var i = 0; i < path.length; i++) {
                var item = path[i];
                if (item.indexOf("http://") == -1) {
                    item = "/m2012/css/" + item;
                }
                item += (item.indexOf("?" == -1) ? "?v=" : "&sid=") + getSid();

                if (item.indexOf('skin_') != -1) {
                    (_doc || document).write('<link id="skinLink" rel="stylesheet" href="' + item + '" type="text/css" />');
                    return;
                }
                (_doc || document).write('<link rel="stylesheet" href="' + item + '" type="text/css" />');
            }
        }
    };

    //给window附加适配数据
    for (var key in caiyunExtObj) {
        window[key] = caiyunExtObj[key];
    }
    //加载配置文件
    document.write('<script type="text/javascript" src="/m2012/conf/config.' + document.domain + '.js?sid=' + getSid() + '"></' + 'script>');

})();