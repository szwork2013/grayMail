///<reference path="../../ts/index.d.ts" />

module M139{
    export module Component{
        export module MediaPlayer{
            export function create(options:IPlayerSetting): Player{
                var mp = new Player(options);
                return mp;
            }
            export interface IPlayerSetting{
                type: string;
                sources: any;
                height: any;
                width: any;
                preload: boolean;
                autoplay: boolean;
                poster?: string;
                container: HTMLElement;
                basePath: string;
            }
            export class Player{
                type: string;
                sources: any[];
                height: any;
                width: any;
                preload: boolean;
                container: HTMLElement;
                poster: string;
                onready: Function;
                autoplay: boolean;
                basePath: string;

                constructor(options: IPlayerSetting) {
                    for (var p in options) {
                        this[p] = options[p];
                    }
                    this.createIframe();
                }
                private iframe: HTMLIFrameElement;
                private frameWin: Window;
                play() {

                }
                pause() {

                }
                private createIframe() {
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
                    iframe.style.width = this.width +"px";
                    iframe.style.height = this.height + "px";
                    iframe.src = url;

                    this.container.appendChild(iframe);
                    this.iframe = iframe;
                    this.frameWin = iframe.contentWindow;
                }
            }


            export module Utils{
                export function queryUrl(key: string): string{
                    var url = location.href;
                    var reg = new RegExp('[?&#]' + key + '=([^&#]*)');
                    var match = url.match(reg);
                    if (match) {
                        try {
                            return decodeURIComponent(match[1]);
                        } catch (e) {
                        }
                    }
                    return "";
                }
                export function getParamsFromUrl() {
                    var height = queryUrl("height");
                    var width = queryUrl("width");
                    var preload = queryUrl("preload") == "true";
                    var autoplay = queryUrl("autoplay") == "true";
                    var sources: any;
                    var poster: string;
                    if (queryUrl("type") == "video"){
                        var sourcesItems = queryUrl("sources").split(",");
                        poster = queryUrl("poster");
                        sources = [];
                        for (var i = 0; i < sourcesItems.length; i++){
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
            }

            export function testAudio() {
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
            export function testVideo() {
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

        }
    }
}