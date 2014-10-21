///<reference path="../../ts/index.d.ts" />
var M139;
(function (M139) {
    (function (Component) {
        (function (MediaPlayer) {
            function create(options) {
                var mp = new Player(options);
                return mp;
            }
            MediaPlayer.create = create;

            var Player = (function () {
                function Player(options) {
                    for (var p in options) {
                        this[p] = options[p];
                    }
                    this.createIframe();
                }
                Player.prototype.play = function () {
                };
                Player.prototype.pause = function () {
                };
                Player.prototype.createIframe = function () {
                    var iframe = document.createElement("iframe");
                    iframe.setAttribute("frameBorder", "0");
                    iframe.setAttribute("scrolling", "no");
                    if (this.type == "audio") {
                        var url = (this.basePath || "") + 'audiojs/audioplayer.html?';
                    } else if (this.type == "video") {
                        var url = (this.basePath || "") + 'videojs/videoplayer.html?';
                    }
                    url += "&type=" + this.type;
                    url += "&preload=" + this.preload;
                    if (this.autoplay) {
                        url += "&autoplay=" + this.autoplay;
                    }

                    if (this.type == "video") {
                        var sources = [];
                        for (var i = 0; i < this.sources.length; i++) {
                            var item = this.sources[i];
                            sources.push(item.type + "|" + item.src);
                        }
                        url += "&sources=" + encodeURIComponent(sources.join(","));
                    } else {
                        url += "&sources=" + encodeURIComponent(this.sources.join(","));
                    }
                    url += "&height=" + this.height;
                    url += "&width=" + this.width;
                    if (this.poster) {
                        url += "&poster=" + this.poster;
                    }
                    iframe.style.width = this.width + "px";
                    iframe.style.height = this.height + "px";
                    iframe.src = url;

                    this.container.appendChild(iframe);
                    this.iframe = iframe;
                    this.frameWin = iframe.contentWindow;
                };
                return Player;
            })();
            MediaPlayer.Player = Player;

            (function (Utils) {
                function queryUrl(key) {
                    var url = location.href;
                    var reg = new RegExp('[?&#]' + key + '=([^&#]*)');
                    var match = url.match(reg);
                    if (match) {
                        try  {
                            return decodeURIComponent(match[1]);
                        } catch (e) {
                        }
                    }
                    return "";
                }
                Utils.queryUrl = queryUrl;
                function getParamsFromUrl() {
                    var height = queryUrl("height");
                    var width = queryUrl("width");
                    var preload = queryUrl("preload") == "true";
                    var autoplay = queryUrl("autoplay") == "true";
                    var sources;
                    var poster;
                    if (queryUrl("type") == "video") {
                        var sourcesItems = queryUrl("sources").split(",");
                        poster = queryUrl("poster");
                        sources = [];
                        for (var i = 0; i < sourcesItems.length; i++) {
                            sources[i] = {
                                type: sourcesItems[i].split("|")[0],
                                src: sourcesItems[i].split("|")[1]
                            };
                        }
                    } else {
                        sources = queryUrl("sources");
                    }
                    if (autoplay) {
                        preload = false;
                    }

                    //TODO check url safe
                    return {
                        height: parseInt(height),
                        width: parseInt(width),
                        preload: preload,
                        sources: sources,
                        poster: poster,
                        autoplay: autoplay
                    };
                }
                Utils.getParamsFromUrl = getParamsFromUrl;
            })(MediaPlayer.Utils || (MediaPlayer.Utils = {}));
            var Utils = MediaPlayer.Utils;

            function testAudio() {
                var source = ['Tank-IfILoveYou.mp3'];
                var mp = new Player({
                    type: "audio",
                    sources: source,
                    height: 60,
                    width: 460,
                    preload: false,
                    autoplay: false,
                    container: document.body
                });
            }
            MediaPlayer.testAudio = testAudio;
            function testVideo() {
                var videoSource = [
                    { type: "video/mp4", src: "video/oceans-clip.mp4" },
                    { type: "video/webm", src: "video/oceans-clip.webm" },
                    { type: "video/ogg", src: "video/oceans-clip.ogv" }
                ];
                var mp = new Player({
                    type: "video",
                    sources: videoSource,
                    poster: "oceans-clip.png",
                    height: 400,
                    width: 600,
                    preload: false,
                    autoplay: false,
                    container: document.body
                });
            }
            MediaPlayer.testVideo = testVideo;
        })(Component.MediaPlayer || (Component.MediaPlayer = {}));
        var MediaPlayer = Component.MediaPlayer;
    })(M139.Component || (M139.Component = {}));
    var Component = M139.Component;
})(M139 || (M139 = {}));
