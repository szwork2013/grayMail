/*!
 * jQuery Color Animations v@VERSION
 * https://github.com/jquery/jquery-color
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: @DATE
 */
(function( jQuery, undefined ) {

	var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",

	// plusequals test for += 100 -= 100
	rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
	// a set of RE's that can match strings and generate color tuples.
	stringParsers = [{
			re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
			parse: function( execResult ) {
				return [
					execResult[ 1 ],
					execResult[ 2 ],
					execResult[ 3 ],
					execResult[ 4 ]
				];
			}
		}, {
			re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
			parse: function( execResult ) {
				return [
					execResult[ 1 ] * 2.55,
					execResult[ 2 ] * 2.55,
					execResult[ 3 ] * 2.55,
					execResult[ 4 ]
				];
			}
		}, {
			// this regex ignores A-F because it's compared against an already lowercased string
			re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
			parse: function( execResult ) {
				return [
					parseInt( execResult[ 1 ], 16 ),
					parseInt( execResult[ 2 ], 16 ),
					parseInt( execResult[ 3 ], 16 )
				];
			}
		}, {
			// this regex ignores A-F because it's compared against an already lowercased string
			re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
			parse: function( execResult ) {
				return [
					parseInt( execResult[ 1 ] + execResult[ 1 ], 16 ),
					parseInt( execResult[ 2 ] + execResult[ 2 ], 16 ),
					parseInt( execResult[ 3 ] + execResult[ 3 ], 16 )
				];
			}
		}, {
			re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
			space: "hsla",
			parse: function( execResult ) {
				return [
					execResult[ 1 ],
					execResult[ 2 ] / 100,
					execResult[ 3 ] / 100,
					execResult[ 4 ]
				];
			}
		}],

	// jQuery.Color( )
	color = jQuery.Color = function( color, green, blue, alpha ) {
		return new jQuery.Color.fn.parse( color, green, blue, alpha );
	},
	spaces = {
		rgba: {
			props: {
				red: {
					idx: 0,
					type: "byte"
				},
				green: {
					idx: 1,
					type: "byte"
				},
				blue: {
					idx: 2,
					type: "byte"
				}
			}
		},

		hsla: {
			props: {
				hue: {
					idx: 0,
					type: "degrees"
				},
				saturation: {
					idx: 1,
					type: "percent"
				},
				lightness: {
					idx: 2,
					type: "percent"
				}
			}
		}
	},
	propTypes = {
		"byte": {
			floor: true,
			max: 255
		},
		"percent": {
			max: 1
		},
		"degrees": {
			mod: 360,
			floor: true
		}
	},
	support = color.support = {},

	// element for support tests
	supportElem = jQuery( "<p>" )[ 0 ],

	// colors = jQuery.Color.names
	colors,

	// local aliases of functions called often
	each = jQuery.each;

// determine rgba support immediately
supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
support.rgba = supportElem.style.backgroundColor.indexOf( "rgba" ) > -1;

// define cache name and alpha properties
// for rgba and hsla spaces
each( spaces, function( spaceName, space ) {
	space.cache = "_" + spaceName;
	space.props.alpha = {
		idx: 3,
		type: "percent",
		def: 1
	};
});

function clamp( value, prop, allowEmpty ) {
	var type = propTypes[ prop.type ] || {};

	if ( value == null ) {
		return (allowEmpty || !prop.def) ? null : prop.def;
	}

	// ~~ is an short way of doing floor for positive numbers
	value = type.floor ? ~~value : parseFloat( value );

	// IE will pass in empty strings as value for alpha,
	// which will hit this case
	if ( isNaN( value ) ) {
		return prop.def;
	}

	if ( type.mod ) {
		// we add mod before modding to make sure that negatives values
		// get converted properly: -10 -> 350
		return (value + type.mod) % type.mod;
	}

	// for now all property types without mod have min and max
	return 0 > value ? 0 : type.max < value ? type.max : value;
}

function stringParse( string ) {
	var inst = color(),
		rgba = inst._rgba = [];

	string = string.toLowerCase();

	each( stringParsers, function( i, parser ) {
		var parsed,
			match = parser.re.exec( string ),
			values = match && parser.parse( match ),
			spaceName = parser.space || "rgba";

		if ( values ) {
			parsed = inst[ spaceName ]( values );

			// if this was an rgba parse the assignment might happen twice
			// oh well....
			inst[ spaces[ spaceName ].cache ] = parsed[ spaces[ spaceName ].cache ];
			rgba = inst._rgba = parsed._rgba;

			// exit each( stringParsers ) here because we matched
			return false;
		}
	});

	// Found a stringParser that handled it
	if ( rgba.length ) {

		// if this came from a parsed string, force "transparent" when alpha is 0
		// chrome, (and maybe others) return "transparent" as rgba(0,0,0,0)
		if ( rgba.join() === "0,0,0,0" ) {
			jQuery.extend( rgba, colors.transparent );
		}
		return inst;
	}

	// named colors
	return colors[ string ];
}

color.fn = jQuery.extend( color.prototype, {
	parse: function( red, green, blue, alpha ) {
		if ( red === undefined ) {
			this._rgba = [ null, null, null, null ];
			return this;
		}
		if ( red.jquery || red.nodeType ) {
			red = jQuery( red ).css( green );
			green = undefined;
		}

		var inst = this,
			type = jQuery.type( red ),
			rgba = this._rgba = [];

		// more than 1 argument specified - assume ( red, green, blue, alpha )
		if ( green !== undefined ) {
			red = [ red, green, blue, alpha ];
			type = "array";
		}

		if ( type === "string" ) {
			return this.parse( stringParse( red ) || colors._default );
		}

		if ( type === "array" ) {
			each( spaces.rgba.props, function( key, prop ) {
				rgba[ prop.idx ] = clamp( red[ prop.idx ], prop );
			});
			return this;
		}

		if ( type === "object" ) {
			if ( red instanceof color ) {
				each( spaces, function( spaceName, space ) {
					if ( red[ space.cache ] ) {
						inst[ space.cache ] = red[ space.cache ].slice();
					}
				});
			} else {
				each( spaces, function( spaceName, space ) {
					var cache = space.cache;
					each( space.props, function( key, prop ) {

						// if the cache doesn't exist, and we know how to convert
						if ( !inst[ cache ] && space.to ) {

							// if the value was null, we don't need to copy it
							// if the key was alpha, we don't need to copy it either
							if ( key === "alpha" || red[ key ] == null ) {
								return;
							}
							inst[ cache ] = space.to( inst._rgba );
						}

						// this is the only case where we allow nulls for ALL properties.
						// call clamp with alwaysAllowEmpty
						inst[ cache ][ prop.idx ] = clamp( red[ key ], prop, true );
					});

					// everything defined but alpha?
					if ( inst[ cache ] && jQuery.inArray( null, inst[ cache ].slice( 0, 3 ) ) < 0 ) {
						// use the default of 1
						inst[ cache ][ 3 ] = 1;
						if ( space.from ) {
							inst._rgba = space.from( inst[ cache ] );
						}
					}
				});
			}
			return this;
		}
	},
	is: function( compare ) {
		var is = color( compare ),
			same = true,
			inst = this;

		each( spaces, function( _, space ) {
			var localCache,
				isCache = is[ space.cache ];
			if (isCache) {
				localCache = inst[ space.cache ] || space.to && space.to( inst._rgba ) || [];
				each( space.props, function( _, prop ) {
					if ( isCache[ prop.idx ] != null ) {
						same = ( isCache[ prop.idx ] === localCache[ prop.idx ] );
						return same;
					}
				});
			}
			return same;
		});
		return same;
	},
	_space: function() {
		var used = [],
			inst = this;
		each( spaces, function( spaceName, space ) {
			if ( inst[ space.cache ] ) {
				used.push( spaceName );
			}
		});
		return used.pop();
	},
	transition: function( other, distance ) {
		var end = color( other ),
			spaceName = end._space(),
			space = spaces[ spaceName ],
			startColor = this.alpha() === 0 ? color( "transparent" ) : this,
			start = startColor[ space.cache ] || space.to( startColor._rgba ),
			result = start.slice();

		end = end[ space.cache ];
		each( space.props, function( key, prop ) {
			var index = prop.idx,
				startValue = start[ index ],
				endValue = end[ index ],
				type = propTypes[ prop.type ] || {};

			// if null, don't override start value
			if ( endValue === null ) {
				return;
			}
			// if null - use end
			if ( startValue === null ) {
				result[ index ] = endValue;
			} else {
				if ( type.mod ) {
					if ( endValue - startValue > type.mod / 2 ) {
						startValue += type.mod;
					} else if ( startValue - endValue > type.mod / 2 ) {
						startValue -= type.mod;
					}
				}
				result[ index ] = clamp( ( endValue - startValue ) * distance + startValue, prop );
			}
		});
		return this[ spaceName ]( result );
	},
	blend: function( opaque ) {
		// if we are already opaque - return ourself
		if ( this._rgba[ 3 ] === 1 ) {
			return this;
		}

		var rgb = this._rgba.slice(),
			a = rgb.pop(),
			blend = color( opaque )._rgba;

		return color( jQuery.map( rgb, function( v, i ) {
			return ( 1 - a ) * blend[ i ] + a * v;
		}));
	},
	toRgbaString: function() {
		var prefix = "rgba(",
			rgba = jQuery.map( this._rgba, function( v, i ) {
				return v == null ? ( i > 2 ? 1 : 0 ) : v;
			});

		if ( rgba[ 3 ] === 1 ) {
			rgba.pop();
			prefix = "rgb(";
		}

		return prefix + rgba.join() + ")";
	},
	toHslaString: function() {
		var prefix = "hsla(",
			hsla = jQuery.map( this.hsla(), function( v, i ) {
				if ( v == null ) {
					v = i > 2 ? 1 : 0;
				}

				// catch 1 and 2
				if ( i && i < 3 ) {
					v = Math.round( v * 100 ) + "%";
				}
				return v;
			});

		if ( hsla[ 3 ] === 1 ) {
			hsla.pop();
			prefix = "hsl(";
		}
		return prefix + hsla.join() + ")";
	},
	toHexString: function( includeAlpha ) {
		var rgba = this._rgba.slice(),
			alpha = rgba.pop();

		if ( includeAlpha ) {
			rgba.push( ~~( alpha * 255 ) );
		}

		return "#" + jQuery.map( rgba, function( v ) {

			// default to 0 when nulls exist
			v = ( v || 0 ).toString( 16 );
			return v.length === 1 ? "0" + v : v;
		}).join("");
	},
	toString: function() {
		return this._rgba[ 3 ] === 0 ? "transparent" : this.toRgbaString();
	}
});
color.fn.parse.prototype = color.fn;

// hsla conversions adapted from:
// https://code.google.com/p/maashaack/source/browse/packages/graphics/trunk/src/graphics/colors/HUE2RGB.as?r=5021

function hue2rgb( p, q, h ) {
	h = ( h + 1 ) % 1;
	if ( h * 6 < 1 ) {
		return p + (q - p) * h * 6;
	}
	if ( h * 2 < 1) {
		return q;
	}
	if ( h * 3 < 2 ) {
		return p + (q - p) * ((2/3) - h) * 6;
	}
	return p;
}

spaces.hsla.to = function ( rgba ) {
	if ( rgba[ 0 ] == null || rgba[ 1 ] == null || rgba[ 2 ] == null ) {
		return [ null, null, null, rgba[ 3 ] ];
	}
	var r = rgba[ 0 ] / 255,
		g = rgba[ 1 ] / 255,
		b = rgba[ 2 ] / 255,
		a = rgba[ 3 ],
		max = Math.max( r, g, b ),
		min = Math.min( r, g, b ),
		diff = max - min,
		add = max + min,
		l = add * 0.5,
		h, s;

	if ( min === max ) {
		h = 0;
	} else if ( r === max ) {
		h = ( 60 * ( g - b ) / diff ) + 360;
	} else if ( g === max ) {
		h = ( 60 * ( b - r ) / diff ) + 120;
	} else {
		h = ( 60 * ( r - g ) / diff ) + 240;
	}

	// chroma (diff) == 0 means greyscale which, by definition, saturation = 0%
	// otherwise, saturation is based on the ratio of chroma (diff) to lightness (add)
	if ( diff === 0 ) {
		s = 0;
	} else if ( l <= 0.5 ) {
		s = diff / add;
	} else {
		s = diff / ( 2 - add );
	}
	return [ Math.round(h) % 360, s, l, a == null ? 1 : a ];
};

spaces.hsla.from = function ( hsla ) {
	if ( hsla[ 0 ] == null || hsla[ 1 ] == null || hsla[ 2 ] == null ) {
		return [ null, null, null, hsla[ 3 ] ];
	}
	var h = hsla[ 0 ] / 360,
		s = hsla[ 1 ],
		l = hsla[ 2 ],
		a = hsla[ 3 ],
		q = l <= 0.5 ? l * ( 1 + s ) : l + s - l * s,
		p = 2 * l - q;

	return [
		Math.round( hue2rgb( p, q, h + ( 1 / 3 ) ) * 255 ),
		Math.round( hue2rgb( p, q, h ) * 255 ),
		Math.round( hue2rgb( p, q, h - ( 1 / 3 ) ) * 255 ),
		a
	];
};


each( spaces, function( spaceName, space ) {
	var props = space.props,
		cache = space.cache,
		to = space.to,
		from = space.from;

	// makes rgba() and hsla()
	color.fn[ spaceName ] = function( value ) {

		// generate a cache for this space if it doesn't exist
		if ( to && !this[ cache ] ) {
			this[ cache ] = to( this._rgba );
		}
		if ( value === undefined ) {
			return this[ cache ].slice();
		}

		var ret,
			type = jQuery.type( value ),
			arr = ( type === "array" || type === "object" ) ? value : arguments,
			local = this[ cache ].slice();

		each( props, function( key, prop ) {
			var val = arr[ type === "object" ? key : prop.idx ];
			if ( val == null ) {
				val = local[ prop.idx ];
			}
			local[ prop.idx ] = clamp( val, prop );
		});

		if ( from ) {
			ret = color( from( local ) );
			ret[ cache ] = local;
			return ret;
		} else {
			return color( local );
		}
	};

	// makes red() green() blue() alpha() hue() saturation() lightness()
	each( props, function( key, prop ) {
		// alpha is included in more than one space
		if ( color.fn[ key ] ) {
			return;
		}
		color.fn[ key ] = function( value ) {
			var vtype = jQuery.type( value ),
				fn = ( key === "alpha" ? ( this._hsla ? "hsla" : "rgba" ) : spaceName ),
				local = this[ fn ](),
				cur = local[ prop.idx ],
				match;

			if ( vtype === "undefined" ) {
				return cur;
			}

			if ( vtype === "function" ) {
				value = value.call( this, cur );
				vtype = jQuery.type( value );
			}
			if ( value == null && prop.empty ) {
				return this;
			}
			if ( vtype === "string" ) {
				match = rplusequals.exec( value );
				if ( match ) {
					value = cur + parseFloat( match[ 2 ] ) * ( match[ 1 ] === "+" ? 1 : -1 );
				}
			}
			local[ prop.idx ] = value;
			return this[ fn ]( local );
		};
	});
});

// add cssHook and .fx.step function for each named hook.
// accept a space separated string of properties
color.hook = function( hook ) {
	var hooks = hook.split( " " );
	each( hooks, function( i, hook ) {
		jQuery.cssHooks[ hook ] = {
			set: function( elem, value ) {
				var parsed, curElem,
					backgroundColor = "";

				if ( jQuery.type( value ) !== "string" || ( parsed = stringParse( value ) ) ) {
					value = color( parsed || value );
					if ( !support.rgba && value._rgba[ 3 ] !== 1 ) {
						curElem = hook === "backgroundColor" ? elem.parentNode : elem;
						while (
							(backgroundColor === "" || backgroundColor === "transparent") &&
							curElem && curElem.style
						) {
							try {
								backgroundColor = jQuery.css( curElem, "backgroundColor" );
								curElem = curElem.parentNode;
							} catch ( e ) {
							}
						}

						value = value.blend( backgroundColor && backgroundColor !== "transparent" ?
							backgroundColor :
							"_default" );
					}

					value = value.toRgbaString();
				}
				try {
					elem.style[ hook ] = value;
				} catch( e ) {
					// wrapped to prevent IE from throwing errors on "invalid" values like 'auto' or 'inherit'
				}
			}
		};
		jQuery.fx.step[ hook ] = function( fx ) {
			if ( !fx.colorInit ) {
				fx.start = color( fx.elem, hook );
				fx.end = color( fx.end );
				fx.colorInit = true;
			}
			jQuery.cssHooks[ hook ].set( fx.elem, fx.start.transition( fx.end, fx.pos ) );
		};
	});

};

color.hook( stepHooks );

jQuery.cssHooks.borderColor = {
	expand: function( value ) {
		var expanded = {};

		each( [ "Top", "Right", "Bottom", "Left" ], function( i, part ) {
			expanded[ "border" + part + "Color" ] = value;
		});
		return expanded;
	}
};

// Basic color names only.
// Usage of any of the other color names requires adding yourself or including
// jquery.color.svg-names.js.
colors = jQuery.Color.names = {
	// 4.1. Basic color keywords
	aqua: "#00ffff",
	black: "#000000",
	blue: "#0000ff",
	fuchsia: "#ff00ff",
	gray: "#808080",
	green: "#008000",
	lime: "#00ff00",
	maroon: "#800000",
	navy: "#000080",
	olive: "#808000",
	purple: "#800080",
	red: "#ff0000",
	silver: "#c0c0c0",
	teal: "#008080",
	white: "#ffffff",
	yellow: "#ffff00",

	// 4.2.3. "transparent" color keyword
	transparent: [ null, null, null, 0 ],

	_default: "#ffffff"
};

})( jQuery );

﻿/**
 * @fileOverview 向下兼容，老版本的一些配置变量的读写
 *包括UserData、FF、Utils
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var win;
    var vm = M139.namespace("M2012.MatrixVM", Backbone.Model.extend(
     /**
        *@lends M2012.MatrixVM.prototype
        */
    {
        /** 封装向下兼容对象实例，比如：UserData、FF、Utils等对象，使一些老的代码可以正常工作
        *@constructs M2012.MatrixVM
        *@param {Object} options 初始化参数集
        *@example
        */
        initialize: function (options) {
            options = options || {};
            win = options.window || window;
        },
        start: function () {//运行入口
            this.createRequestByScript();
            this.createFloatingFrame();
            this.createPathConfig();
            this.createUtils();
            this.createLoadScript();
            this.createUserData();
            this.createGlobalVariable();
            this.createLinksShow();
            this.createModuleManager();
            this.createMailTool();
            this.createWaitPanel();
            this.createValidate();
            
        },

        /**创建老版本的FloatingFrame对象*/
        createFloatingFrame: function () {
            win.FF = window.FloatingFrame = FF;
            return FF;
        },
        /*创建resourcePath,siteConfig中的路径配置*/
        createPathConfig:function(){
            win.rmResourcePath = (top.getDomain("resource") || "") + "/rm/richmail";
            win.resourcePath = win.rmResourcePath.replace("richmail", "coremail");

            win.SiteConfig.ucDomain = getDomain("webmail");
            win.ucDomain = getDomain("webmail");
            win.SiteConfig.smsMiddleware = getDomain("rebuildDomain") + "/sms/";
            win.SiteConfig.mmsMiddleware = getDomain("rebuildDomain") + "/mms/";
            win.SiteConfig.largeAttachRebuildUrl = getDomain("rebuildDomain") + "/disk/";
            win.SiteConfig.disk = getDomain("rebuildDomain") + "/disk/netdisk";
            
            
        },
        createUtils:function(){
            //loadScript("m2011.utilscontrols.pack.js");
            
            win.Utils = {
                PageisTimeOut: function () {
                    return false;
                },
                waitForReady: function (query, callback) {
                    return M139.Timing.waitForReady(query, callback);
                },
                loadSkinCss: function (path, doc, prefix, dir) {
                    var version = "", skinFolder= "css", alt = "/";

                    //获取2.0皮肤映射的1.0值,给内嵌的老页面用
                    path = (top.$User.getSkinNameMatrix && top.$User.getSkinNameMatrix()) || 'skin_shibo';

                    if (/new_/.test(path)) {
                        skinFolder = "theme" + alt + path.match(/skin_(\w+)$/)[1];
                        path = path.replace("new_", "");
                    }

                    if (prefix) {
                        path = path.replace("skin", prefix + "_skin");
                    }

                    if (!doc) {
                        doc = document;
                    }

                    //加清皮肤样式缓存的版本号
                    if (top.SiteConfig && top.SiteConfig.skinCSSCacheVersion) {
                        version = "?v=" + top.SiteConfig.skinCSSCacheVersion;
                    }

                    var linkHref = top.rmResourcePath + alt + skinFolder + alt + path + ".css" + version;
                    if (dir) {
                        linkHref = dir + path + ".css" + version;
                    }

                    var links = doc.getElementsByTagName("link");
                    for (var i = 0; i < links.length; i++) {
                        var l = links[i];

                        if (!l.href) {
                            l.href = linkHref + version;
                            return;
                        }
                    }
                },
                queryString: function (param, url) {
                    return $Url.queryString(param, url);
                },
                queryStringNon: function(param, url) {
                    for(var url = url || location.search, url = url.split(/&|\?/), e = null, c = 0; c < url.length; c++) {
                    var g = url[c].split("=");
                    if(g[0] == param) {
                    e = g[1];
                    break;
                     }
                     }
                     return e;
                },
                openControlDownload : function(removeUploadproxy) {
                    //var win = window.open(getDomain("webmail") + "/LargeAttachments/html/control139.htm");
                    //setTimeout(function() { win.focus(); }, 0);
                    top.$App.show("smallTool");
					//top.addBehavior("文件快递-客户端下载");
                },

                UI: {
                    selectSender: function (id, isAddPop, doc) {
                        var from = $Url.queryString("from");
                        if (typeof (doc) == "undefined")
                            doc = document;

                        if (typeof (isAddPop) == "undefined")
                            isAddPop = false;

                        var selFrom = doc.getElementById(id);
                        UserData = window.top.UserData;
                        var mailAccount = top.$User.getDefaultSender();

                        var trueName = top.$User.getTrueName();
                        var arr = top.$User.getAccountListArray();
                        if(mailAccount)addItem(mailAccount);
                        for (var i = 0; i < arr.length; i++) {
                            var mail = arr[i];
                            if (mailAccount != mail) addItem(mail);
                        }

                        //添加代收账号地址  
                        if (isAddPop) {
                            $(top.$App.getPopList()).each(function () {
                                for (var i = 0; i < selFrom.options.length; i++) {
                                    if (this == selFrom[i].value) return;
                                }
                                addItem(this.email);
                            })
                        }
                        selFrom.options.add(new Option("发信设置", "0"));

                        //发件人地址下拉框切换事件
                        var selFromOnChange = function (id) {
                            var selFrom = doc.getElementById(id);
                            if (selFrom.value == "0") {
                                selFrom[0].selected = true;
                                top.$App.show("account");
                                top.addBehavior("写信页_别名设置");
                            }
                            selFrom = null;
                        }

                        selFrom.onchange = function () { selFromOnChange(id) };

                        function addItem(addr) {
                            addr = addr.trim();
                            var text = trueName ? '"{0}"<{1}>'.format(trueName.replace(/"|\\/g, ""), addr) : addr; //发件人姓名替换双引号和末尾的斜杠
                            var item = new Option(text, addr);
                            selFrom.options.add(item);
                            item.innerHTML = item.innerHTML.replace(/\&amp\;#/ig, "&#");
                            if (item.value == from) item.selected = true;
                        }

                    }
                },
                parseSingleEmail: function (text) {
                    text = text.trim();
                    var result = {};
                    var reg = /^([\s\S]*?)<([^>]+)>$/;
                    if (text.indexOf("<") == -1) {
                        result.addr = text;
                        result.name = text.split("@")[0];
                        result.all = text;
                    } else {
                        var match = text.match(reg);
                        if (match) {
                            result.name = match[1].trim().replace(/^"|"$/g, "");
                            result.addr = match[2];
                            //姓名特殊处理,某些客户端发信,姓名会多带一些引号或斜杠
                            result.name = result.name.replace(/\\["']/g, "").replace(/^["']+|["']+$/g, "");
                            result.all = "\"" + result.name.replace(/"/g, "") + "\"<" + result.addr + ">";
                        } else {
                            result.addr = text;
                            result.name = text;
                            result.all = text;
                        }
                    }
                    if (result.addr) {
                        result.addr = result.addr.encode();
                    }
                    return result;

                },
                parseEmail : function (text){
				    var reg=/(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}|(?:"[^"]*")?\s?<[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}>)\s*(?=;|,|，|；|$)/gi;
				    var regName=/^"([^"]+)"|^([^<]+)</;
				    var regAddr=/<?([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})>?/i;
				    var matches=text.match(reg);
				    var result=[];
				    if(matches){
				        for(var i=0,len=matches.length;i<len;i++){
				            var item={};
				            item.all=matches[i];
				            var m=matches[i].match(regName);
				            if(m)item.name=m[1];
				            m=matches[i].match(regAddr);
				            if(m)item.addr=m[1];
				            if(item.addr){
				                item.account=item.addr.split("@")[0];
				                item.domain=item.addr.split("@")[1];
				                if(!item.name)item.name=item.account;
				                result.push(item);
				            }
				        }
				    }
				    return result;
				}
            };
            win.getXmlDoc = function (xml) {
                return M139.Text.Xml.parseXML(xml);
            }
            //解析xml报文 通讯录用到
            win.xml2json = function(xmlNode,xml2jsonConfig){
                if(typeof xmlNode =="string"){
                    try{
                        var xmldom=getXmlDoc(xmlNode);
                        xmlNode=xmldom.documentElement;
                    } catch (ex) {
                    }
                }
                var config=xml2jsonConfig[xmlNode.tagName];
                if(!config){
                    return document.all?xmlNode.text:xmlNode.textContent;
                }else if(config.type=="simple"){
                    return xml2json_SimpleObject(xmlNode);
                }else if(config.type=="rich"){
                    return xml2json_RichObject(xmlNode,config);
                }else if(config.type=="array"){
                    return xml2json_Array(xmlNode);
                }else{
                    return null;
                }
                function xml2json_RichObject(xmlNode,config){
                    var result={};
                    var arrayElement=config.arrayElement;
                    if(arrayElement){
                        var arrayList=result[arrayElement]=[];
                    }
                    for(var i=0,childs=xmlNode.childNodes,len=childs.length;i<len;i++){
                        var child=childs[i];
                        if(child.nodeType==1){
                            if(child.tagName==config.arrayElement){
                                arrayList.push(xml2json(child,xml2jsonConfig));
                            }else{
                                result[child.tagName]=xml2json(child,xml2jsonConfig);
                            }
                        }
                    }
                    return result;
                }
                function xml2json_SimpleObject(xmlNode){
                    var result={};
                    for(var i=0,children=xmlNode.childNodes,len=children.length;i<len;i++){
                        var child=children[i];
                        if(child.nodeType==1){
                            result[child.tagName]=document.all?child.text:child.textContent;
                        }
                    }
                    return result;
                }
                function xml2json_Array(xmlNode){
                    var result=[];
                    for(var i=0,children=xmlNode.childNodes,len=children.length;i<len;i++){
                        var child=children[i];
                        if(child.nodeType==1){
                            result.push(xml2json(child,xml2jsonConfig));
                        }
                    }
                    return result;
                }
            }
            win.json2xml = function(obj) {
                var list = [];
                for (var p in obj) {
                    list.push("<");
                    list.push(p);
                    list.push(">");
                    list.push(encodeXML(obj[p]));
                    list.push("</");
                    list.push(p);
                    list.push(">");
                }
                return list.join("");
            }
            if (!String.format) {
                String.format = function (template,param) {
                    return M139.Text.Utils.format(template, param);
                }
            }
        },
        createLoadScript:function(){
            win.loadScriptM2011=function(key, _doc, charset, root) {
                var path = null;
                var scriptList = [
                    { "name": "jquery.js", "version": "20120302" },
                    { "name": "utils_controls.js", "version": "20121229" },
                    { "name": "framework.js", "version": "20121221" },
                    { "name": "common_option.js", "version": "20121123" },
                    { "name": "utils.js", "version": "20120302" },
                    { "name": "compose_2010_pack.js", "version": "20121227" },
                    { "name": "folderview.js", "version": "20121122" },
                    { "name": "welcome.js", "version": "20130104" }
                ];
                for (var i = 0; i < scriptList.length; i++) {
                    if (scriptList[i]["name"] == key) {
                        path = top.rmResourcePath + "/js/" + key + "?v=" + scriptList[i]["version"];
                        break;
                    }
                }
                function getResourceHost() {
                    return rmResourcePath.match(/^(http:\/\/)?([^\/]+)/i)[0];
                }
                if (path == null) {
                    var _root = root || "/rm/richmail/js/";
                    path = getResourceHost() + _root + key;
                }

                if (path.indexOf("utils_controls.js") > -1) {
                    return top.loadScript(getResourceHost() + "/m2012/js/packs/m2011.utilscontrols.pack.js", _doc, charset);
                } else if (path.indexOf("AddressBook.js") > -1) {
                    return top.loadScript(getResourceHost() + "/m2012/js/matrixvm/page/m2011.page.AddressBook.js", _doc);
                } else if (path.indexOf("RichInputBox.js") > -1) {
                    return top.loadScript(getResourceHost() + "/m2012/js/matrixvm/page/m2011.page.RichInputBox.js", _doc);
                }

                (_doc || document).write("<script charset=\"" + (charset || "gb2312") + "\" type=\"text/javascript\" src=\"" + path + "\"></" + "script>");
            }
            win.loadScripts = function (arr, _doc) {
                
                    for (var i = 0; i < arr.length; i++) {
                        win.loadScriptM2011(arr[i], _doc);
                    }
                
            }
            win.loadRes = function (w) {
                if (!w || !w.RES_FILES) return;
                function getResourceHost() {
                    return rmResourcePath.match(/^(http:\/\/)?([^\/]+)/i)[0];
                }
                var resList = w.RES_FILES;
                for (var i = 0; i < resList.length; i++) {
                    if (resList[i].js) {
                        var path = resList[i].js;
                        if (path.indexOf("utils_controls.js") > -1) {
                            top.loadScript(getResourceHost() + "/m2012/js/packs/m2011.utilscontrols.pack.js", w.document);
                        } else if (path.indexOf("jquery.js") > -1) { //群邮件继续使用旧版jquery，避免兼容问题
                            top.loadScript(rmResourcePath + "/js/jquery.js", w.document);
                        } else { //偷梁换柱，群邮件js文件映射到新版目录
                            path = path.replace("/groupmail/js/", "/groupmail/m2011.groupmail.");
                            top.loadScript(path.replace("/$base$", m2012ResourceDomain + "/m2012/js/service"), w.document, resList[i].charset || "gb2312");
                            //top.loadScript(path.replace("/$base$", getResourceHost() + "/rm"), w.document, resList[i].charset || "gb2312");
                        }
                    } else if (resList[i].css) {
                        var path = resList[i].css;
                        top.loadCSS(path.replace("/$base$", getResourceHost() + "/rm"),w.document);
                    }
                }
                if(w.location.href && w.location.href.indexOf('ComposeGroupmail') > -1){
                	// add by tkh 群邮件引入大附件model层m2012.ui.largeattach.model.js
	                try{
		                top.loadScript(m2012ResourceDomain+'/m2012/js/lib/underscore.js', w.document, "uft-8");
		                top.loadScript(m2012ResourceDomain+'/m2012/js/lib/backbone.js', w.document, "uft-8");
		                top.loadScript(m2012ResourceDomain+'/m2012/js/packs/m139.core.pack.js', w.document, "uft-8");
		                top.loadScript(m2012ResourceDomain+'/m2012/js/ui/largeattach/m2012.ui.largeattach.model.js', w.document, "uft-8");
	                } catch (e) { }
                }
                w.RES_FILES = null;//清理
            }
        },
        createGlobalVariable: function () {
            var _this = this;
            win.coremailDomain = $App.getMailDomain();
            win.addrDomain = "/addrsvr";
            win.mailDomain = $App.getMailDomain();
            win.isRichmail = true;
            win.stylePath = "/m";
            win.wmsvrPath = "/s";
            win.wmsvrPath2 = "http://" + location.host + "/RmWeb";

            win.Main = {
                closeCurrentModule: function () {
                    $App.closeTab();
                }
            }
            win.Main.setReplyMMSData = function ($){
                if($){
                    top["replyMMSData"]={content:"string"==typeof $.content&&$.content||"",receivers:_.isArray($.receivers)&&$.receivers||[],subject:"string"==typeof $.subject&&$.subject||""};
                }
            }

            /*win.Utils={
                UI:{
                    selectSender: function () {
                        return "发件人";
                    }
                }
            }
            */
            win.behaviorClick = function (target, window) {
                top.M139.Logger.behaviorClick(target, window);
            }
            win.addBehavior = function (behaviorKey, thingId) {
                top.M139.Logger.logBehavior({
                    key: behaviorKey,
                    thingId: thingId
                });
            }
            win.addBehaviorExt = function (param) {
                if (param && param.actionId) {
                    top.M139.Logger.logBehavior({
                        thingId: param.thingId || 0,
                        actionId: param.actionId,
                        moduleId: param.moduleId || 0,
                        actionType: param.actionType,
                        pageId: 24
                    });
                }
            }
            win.ScriptErrorLog = function () {

            }
            win.MailTool = {
                getAccount: function (email) {
                    return $Email.getAccount(email);
                },
                getAddr: function (email) {
                    return $Email.getEmail(email);
                }
            }
            win.encodeXML = function (text) {
                return $Xml.encode(text);
            }
            win.FilePreview = {
                isRelease: function () { return true; },
                checkFile: function (fileName, fileSize) {
                    if (fileSize && fileSize > 1024 * 1024 * 20) {
                        return -1;
                    }
                    //var reg = /\.(?:doc|docx|xls|xlsx|ppt|pptx|pdf|txt|html|htm|jpg|jpeg|jpe|jfif|gif|png|bmp|tif|tiff|ico|)$/i;
                    var reg = /\.(?:doc|docx|xls|xlsx|ppt|pptx|pdf|txt|jpg|jpeg|jpe|jfif|gif|png|bmp|ico|)$/i; //临时屏蔽html文件的预览功能
                    var reg2 = /\.(?:rar|zip|7z)$/i;
                    if (reg.test(fileName)) {
                        return 1;
                    } else if (reg2.test(fileName)) {
                        return 2;
                    } else {
                        return -1;
                    }
                },
                getUrl: function (p) {
                    var previewUrl = "/m2012/html/onlinepreview/online_preview.html?fi={fileName}&mo={uid}&dl={downloadUrl}&sid={sid}&id={contextId}&rnd={rnd}&src={type}";
                    previewUrl += "&skin={skin}";
                    previewUrl += "&resourcePath={resourcePath}";
                    previewUrl += "&diskservice={diskService}";
                    previewUrl += "&filesize={fileSize}";
                    previewUrl += "&disk={disk}";
                    previewUrl = $T.Utils.format(previewUrl, {
                        uid: top.M139.Text.Mobile.remove86(top.uid),
                        sid: top.UserData.ssoSid,
                        rnd: Math.random(),
                        skin: window.top.UserConfig.skinPath,
                        resourcePath: encodeURIComponent(top.rmResourcePath),
                        diskService: encodeURIComponent(top.SiteConfig.diskInterface),
                        type: p.type || "",
                        fileName: encodeURIComponent(p.fileName),
                        downloadUrl: encodeURIComponent(p.downloadUrl),
                        contextId: p.contextId || "",
                        fileSize: p.fileSize || "",
                        disk: top.SiteConfig.disk
                    });
                    return previewUrl;

                }
            }; 
            win.GetDiskArgs=function() {
                return top.diskSelectorArgs;
            }
            win.OpenDisk=function(args) {
                //{sid:””, businessWindow:window, callback :function(){}, restype :1, selectMode :0, width :500,height:500}
                if (!args) { args = {}; }
                top.diskSelectorArgs = args;

                var url = SiteConfig["disk"] + "/html/selectdisk.html?sid=" + $App.getSid() + "&restype=" + (args.restype ? args.restype : 1);

                top.FF.open("彩云", url, 484, 405, true);


            }
            var self = this;
            win.GlobalEvent = {
                add: function (key, func) {
                    self.on(key, func);
                },
                broadcast: function (key, args) {
                    self.trigger(key, args);
                }
            }
            win.ReadMailInfo = {
                getDownloadAttachUrl: function (file) {
                    var temp = "/view.do?func=attach:download&mid={0}&offset={1}&size={2}&name={3}&encoding={6}&sid={4}&type={5}";
                    return top.wmsvrPath2 + temp.format(file.mid, file.fileOffSet, file.fileSize, encodeURIComponent(file.fileName), file.sid, file.type,file.encoding);
                }
            }

            if (_this.createContacts) _this.createContacts();
            
            win.reloadAddr = function() {
                $App.trigger("change:contact_maindata");
            };

            win.namedVarToXML = function (name, obj, prefix) {

                function getDataType (obj) {
                    return Object.prototype.toString.call(obj).replace(/^\[object (\w+)\]$/, "$1");
                };
                function getVarType(obj, stringValue) {
                    if (obj == null) {
                        return "null";
                    }
                    var type = getDataType(obj);
                    if (type == "Number") {
                        var s = stringValue ? stringValue : obj.toString();
                        if (s.indexOf(".") == -1) {
                            if (obj >= -2 * 1024 * 1024 * 1024 & obj < 2 * 1024 * 1024 * 1024) {
                                return "int";
                            } else {
                                if (!isNaN(obj)) {
                                    return "long";
                                }
                            }
                        }
                        return "int";
                    } else {
                        return type.toLowerCase();
                    }
                }
                function tagXML(dataType, name, val) {
                    var s = "<" + dataType;
                    if (name) {
                        s += " name=\"" + textXML(name) + "\"";
                    }
                    if (val) {
                        s += ">" + val;
                        if (val.charAt(val.length - 1) == ">") {
                            s += "\n";
                        }
                        return s + "</" + dataType + ">";
                    } else {
                        return s + " />";
                    }
                }
                function textXML(s) {
                    s = s.replace(/[\x00-\x08\x0b\x0e-\x1f]/g, "");
                    return s;
                }

                if (obj == null) {
                    return prefix + tagXML("null", name);
                }
                //var type = obj.constructor;
                var type = getDataType(obj);
                if (type == "String") {
                    var xml = textXML(obj);
                    try {
                        xml = M139.Text.Xml.encode(xml);
                    } catch (e) { }
                    return prefix + tagXML("string", name, xml);
                } else {
                    if (type == "Object") {
                        if (obj.nodeType) {
                            top.FloatingFrame.alert(UtilsMessage["UtilsInvalidError"].format(Object.inspect(obj)));
                            return "";
                        }
                        var s = "";
                        for (var i in obj) {
                            s += namedVarToXML(i, obj[i], prefix + "  ");
                        }
                        return prefix + tagXML("object", name, s + prefix);
                    } else {
                        if (type == "Array") {
                            var s = "";
                            for (var i = 0; i < obj.length; i++) {
                                s += namedVarToXML(null, obj[i], prefix + "  ");
                            }
                            return prefix + tagXML("array", name, s + prefix);
                        } else {
                            if (type == "Boolean" || type == "Number") {
                                var s = obj.toString();
                                return prefix + tagXML(getVarType(obj, s), name, s);
                            } else {
                                if (type == "Date") {
                                    var s = "" + obj.getFullYear() + "-" + (obj.getMonth() + 1) + "-" + obj.getDate();
                                    if (obj.getHours() > 0 || obj.getMinutes() > 0 || obj.getSeconds() > 0) {
                                        s += " " + obj.getHours() + ":" + obj.getMinutes() + ":" + obj.getSeconds();
                                    }
                                    return prefix + tagXML(getVarType(obj, s), name, s);
                                } else {
                                    top.FloatingFrame.alert(UtilsMessage["UtilsInvalidError"].format(Object.inspect(obj)));
                                    return "";
                                }
                            }
                        }
                    }
                }

            }
            win.UtilsMessage = {
                AddcontactEmptyError: "分组名称不能为空。",
                AddcontactSpecialError: "组名中不能包含特殊字符。",
                AddcontactSuccess: "添加成功!",
                AddsendcontactsAddError: "添加失败",
                AddsendcontactsAddSuccess: "添加成功!",
                AddsendcontactsNotice: "正在添加联系人...",
                AddsendcontactsOneError: "请至少选中一行!",
                AddsendcontactsTeamError: "请输入组名",
                ChecksecretfolderpwdError: "密码错误",
                Folder_smsError: "短信验证码输入错误，请重新输入!",
                Folder_smsNoError: "您还未获取短信验证码，请点击上方的按钮获取。",
                Folder_smsNotice: "正在获取短信验证码",
                FoldermanageError: "排序操作失败！",
                ForwardEmptyError: "邮箱地址不能为空",
                ForwardOneError: "很抱歉，只能转发到一个邮箱地址。",
                ForwardRightError: "请输入正确的邮箱地址（例：example@139.com）",
                ForwardSelfError: "转发用户不能填写自己的邮箱地址",
                PopfolderFullError: "邮箱容量将满,请及时清理",
                PopfolderFulledError: "邮箱容量已满, 请清理过期邮件",
                UtilsDebugError: "调试器错误",
                UtilsInvalidError: "Passing invalid object: {0}",
                UtilsNoloadError: "数据未加载成功，可能的原因是登录超时了。",
                UtilsRequestError: "请求出错:",
                UtilsScreenError: "截屏功能仅能在IE浏览器下使用",
                UtilsScreenInstallConfirm: "使用截屏功能必须安装139邮箱控件,是否安装?",
                UtilsTimeoutError: " <b>登录超时，可能由于以下原因：</b><br/>1、您同时使用多个帐号或多次登录邮箱<br/>2、您的网络链接长时间断开<br/>3、当前页面闲置太久",
                UtilsUpdateConfirm: "您安装的上传控件已经不能使用,是否更新?",
                UtilsUpgradeConfirm: "当前的截屏控件需要升级才可继续使用",
                UtilsUploadConfirm: "上传文件必须安装139邮箱控件,是否安装?",
                vipNoPermissionNotice: "VIP{0}{2}为{0}元版{1}邮箱专属{2}。<br/>立即升级，重新登录后即可使用。"
            };

            win.frameworkMessage = {
                AddsendcontactsTeamError: "请输入新分组名称",
                EditorFaceError: "纯文本模式无法使用表情!",
                EditorImgError: "纯文本模式无法插入图片!",
                EditorWordsError: "请先选择要加入链接的文字。",
                FetionAliasError: "对不起，设置邮箱别名后才能绑定飞信，请先设置邮箱别名",
                FetionAlreadyError: "您已绑定飞信",
                FetionBindConfirm: "系统将自动绑定飞信服务，是否继续?",
                FetionBindFeiError: "绑定失败，请重试",
                FetionLoading: "正在加载中......",
                FetionLoading2Confirm: "您已成功绑定飞信，现在可以直接用邮箱使用飞信.\r\n{0},继续登录飞信吗?",
                FetionLoadingConfirm: "您已成功绑定飞信，现在可以直接用邮箱使用飞信.继续登录飞信吗?",
                FetionLoginError: "您已经取消绑定飞信，请绑定飞信后登录",
                FetionNoOpenConfirm: "您的飞信服务还没有开通，现在是否注册？",
                FetionProofError: "获取凭证失败，请稍后再试",
                FetionTryLoading: "资源正在加载中，请稍后再试",
                FolderAddedError: "添加文件夹失败，请重试",
                FolderAlreadyError: "文件夹&nbsp;<b>{0}</b>&nbsp;已存在！",
                FolderCheckError: "已向服务器提交代收命令，请稍后检查您的代收文件夹。",
                FolderClearConfirm: "您确定要清空吗?",
                FolderCustomizeError: "自定义文件夹个数不能超过{0}个",
                FolderDelConfirm: "确定要删除该文件夹吗",
                FolderNameEmptyError: "文件夹名称不能为空",
                FolderNameOverError: "文件夹名字不能超过16个字母或者8个汉字！",
                FolderPopError: "POP代理正在执行中，请等待执行完毕",
                FolderSpecialError: "文件夹中不能包含特殊字符！",
                FolderWaiError: "正在为您代收邮件，请稍候......",
                GroupExists: "组名重复是否仍要添加？",
                LinksUnFunctionError: "该功能暂时无法使用",
                MailServerExistError: "对不起，文件夹名称已存在",
                MailServerLoginError: "对不起，登录超时，请重新登录。",
                MailboxAlreadyError: "您所选择的邮件已在当前文件夹中，请重新选择",
                MailboxBatchError: "您刚才有新邮件到达，请重新确认后再进行本项操作",
                MailboxDelConfirm: "系统提示：彻底删除此邮件后将无法取回，您确定要彻底删除吗？",
                MailboxDelsConfirm: "如果彻底删除，这{0}封邮件将无法找回，您确定吗？",
                MailboxExportMail: "仅支持导出200M以内的邮件",
                MailboxKeyError: "请输入关键字",
                MailboxMoveConfirm: "要转移的邮件包含已置顶邮件，转移后将不再置顶。您确定要转移吗？",
                MailboxSelError: "请选择邮件",
                MailboxSpamConfirm: "所选邮件将被移动到垃圾邮件夹。通过举报垃圾邮件，可以协助我们更有效的抵制垃圾邮件，感谢您！",
                MailboxTopError: "最多只能置顶10封邮件",
                MainConfigError: "配置文件未加载",
                MainSearchText: "邮件全文搜索...",
                MainWapSuccess: "139邮箱WAP访问地址已经发送到您的手机，请查收",
                Main_extDownConfirm: "尊敬的139用户，您好，请下载pushemail",
                ReadmailAttachSuccess: "附件：{0}保存成功，请到手机彩云我的文件柜查看。",
                ReadmailContentError: "请输入要回复的内容",
                ReadmailDelSuccess: "邮件已经删除!",
                ReadmailDiskError: "对不起，您尚未开通彩云服务。",
                ReadmailFilterError: "添加失败，您添加的过滤器数量已达到最大上限",
                ReadmailLoadError: "加载失败,请重试",
                ReadmailMailError: "请输入要回复的邮件地址",
                ReadmailReceiptConfirm: "对方要求发送已读回执,是否发送?<br />             <label for='chkShowReturnReceipt'>            <input id='chkShowReturnReceipt' onclick='window.chkShowReturnReceiptValue=this.checked' type='checkbox' />            以后都按本次操作            </label>",
                ReadmailReduktionSuccess: "操作成功，邮件已被还原到收件箱中。",
                ReadmailRejectionSuccess: "设置主题拒收成功",
                ReadmailReplySuccess: "回复成功",
                ReadmailRightMailError: "请输入正确的邮件地址:",
                ReadmailSelReceiveError: "请至少选择一个收件人",
                ReadmailTryAgainError: "服务器忙，请稍后重试",
                ReadmailWithdraw1Error: "撤回失败,邮件不存在",
                ReadmailWithdraw2Error: "撤回失败,此邮件不支持召回",
                ReadmailWithdraw3Error: "撤回失败,该邮件已超过撤回期限",
                SimpleframeSendConfirm: "确定不发送此明信片吗？",
                SysBusyTryAgainError: "系统繁忙，请稍后重试!",
                TablabelError: "Tab Init Error",
                TablabelExistError: "fTabLabelExist",
                TablabelNoTabError: "Tab 不存在",
                addContacting: "保存联系人中……",
                addFolderPageLoadError: "邮件地址格式有误，请重新填写！",
                addGroupTitle: "请输入新分组名称",
                addNotAllowed: "不支持添加自己为VIP联系人。",
                changeTagColorParamsError: "参数错误，改变标签颜色失败！",
                checkPswEnterPwdFormValid: "请输入密码！",
                checkPswNotOnlyNumFormValid: "密码不能是纯数字组合！",
                checkPswNotSeriesFormValid: "密码不能是字符串联，如aaaaaa、ABCDEF、FEDCBA！",
                checkPswNotSpecialCharFormValid: "密码中包含不合法字符，可支持字母、数字、及_~@#$^符号！",
                checkPswPwdLengthFormValid: "密码须由6位至16位字符或数字组成！",
                checkSelectSongsError: "请选择歌曲再播放！",
                delConfirmMsg: "确定取消“VIP联系人”？<br>其邮件将同时取消“VIP邮件”标记。",
                delContactEventConfirm: "确定要删除该联系人？",
                editGroupListSuc: "{0}已加为VIP联系人，其邮件已自动标记为“VIP邮件”。",
                error_contactOverlimit: '保存联系人失败，联系人数量已达上限。你可以<a href="javascript:(function(){top.FF.close();top.Links.show(\'addr\');})();">管理通讯录&gt;&gt;</a>',
                error_contactReachlimit: '保存联系人部分成功，联系人数量超出上限部分未保存，你可以<a href="javascript:(function(){top.FF.close();top.Links.show(\'addr\');})();">管理通讯录&gt;&gt;</a>',
                error_contactRepeat: "保存联系人失败，联系人已存在。",
                exportMailLongTime: "文件夹邮件较多，导出邮件可能需要较长的时间。",
                folderManageDelFolderlConfig: "确定要删除该文件夹吗？",
                folderManagePageClearFolderConfirm: "您确定要清空吗？",
                folderManageReNameTitle1: "重命名",
                folderManageReNameTitle2: "请输入文件夹名称",
                folderviewClearFolderFilled: "邮箱容量已满, 请清理过期邮件！",
                folderviewClearFolderFull: "邮箱容量将满,请及时清理！",
                folderviewDeleteFolderConfirm: "确定要删除该文件夹吗？",
                folderviewdelegateConfirm: "删除代收邮箱将同时删除此文件夹内所有的邮件，是否继续删除？",
                groupLimit: "分组联系人总数已达上限，不能添加。",
                markTagIsRepateError: '"{0}" 已经标记过  "{1}" 标签了',
                markTagNoSelectMailError: "请选择邮件",
                modContactError: "修改联系人失败，请稍后再试。",
                modContactSuccess: "修改联系人成功",
                modifySecretFolderPwdPageComparePwdFormValid: "两次密码输入不一致，请重新输入！",
                modifySecretFolderPwdPageEnterNewPwdFormValid: "请输入新密码！",
                modifySecretFolderPwdPageEnterOldPwdFormValid: "请输入旧密码！",
                modifySecretFolderPwdPageModifyError: "修改失败，请稍后再试",
                modifySecretFolderPwdPageOldPwdError: "旧密码错误！",
                modifySecretFolderPwdPageSetLockPwdSuccess: "安全锁密码修改成功！",
                opClear: "您已清空VIP联系人，其邮件同时取消“VIP邮件”标记。",
                opSuc: "操作成功。",
                operatingTagError: "操作失败，请稍后再试。",
                searchKeyWordIsEmptyError: "请输入要搜索的内容",
                searchPageFormatDateError: "日期格式有误！",
                secretFolderFolderNotFould: "找不到指定的文件夹",
                secretFolderPwdInvalid: "密码不正确或者密码不符合规则",
                secretFolderSetPageLockAreaFormValid: "请选择加锁范围！",
                secretFolderSetPageMaxFolderError: "设置安全锁的文件夹个数超出最大限制，最大只可以设置{0}个！",
                secretFolderSetPagePwdError: "密码错误！",
                secretFolderSetPagePwdFormValid: "两次密码输入不一致，请重新输入！",
                secretFolderSetPageSetError: "设置失败，请稍后再试！",
                secretFolderSetPageSetLockError: "设置失败，请稍后再试！",
                secretFolderSetPageSetLockSuccess: "安全锁设置成功！",
                showColorPickerParamsError: "参数错误，打开颜色盘失败！",
                sysBusy: "系统繁忙，操作失败。",
                sysError: "系统繁忙，请稍后再试!",
                tagManageDelFolderlConfig: "确定删除标签“{0}”吗？ 删除后相关邮件也将会移除此标签（邮件不会被删除）",
                tagManageReNameTitle1: "重命名",
                tagManageReNameTitle2: "请输入标签名称",
                tagMenuSelectError: "选择标签菜单或选择邮件出错，请稍后再试。",
                tagNameEmptyError: "标签名称不能为空！",
                tagNameOverError: "标签名字不能超过25个字母或汉字！",
                tagNameRepateError: "{0} 已经存在！",
                tagNameSpecialError: "标签名称中不能包含特殊字符！",
                tagOverflow: "很抱歉，每封邮件最多只能贴{0}张标签。",
                tearTagParamsError: "参数错误，撕掉标签操作失败！",
                userFolderPageBindDataClearEventConfirm: "您确定要清空吗？",
                vipContactsMax: "VIP联系人已达上限{0}个，不能添加。{1}",
                addVipSuc: "“{0}”已加为“VIP联系人”，其邮件已自动标记为“VIP邮件”。",
                cancelVipText: "确定取消“VIP联系人”？<br/>其邮件将同时取消“VIP邮件”标记。",
                waitPannelAddFolder: "正在添加文件夹...",
                waitPannelAddTagName: "正在添加标签...",
                waitPannelClearFolder: "正在清空文件夹...",
                waitPannelDelete: "正在删除...",
                waitPannelLoad: "数据加载中...",
                waitPannelModifyPwd: "正在修改安全锁密码...",
                waitPannelReName: "正在重命名文件夹...",
                waitPannelReTagName: "正在重命名标签...",
                waitPannelSetLockSuccess: "正在设置安全锁...",
                warn_contactEmailToolong: "电子邮箱地址太长了",
                warn_contactIllegalEmail: "电子邮箱地址格式不正确，请重新输入!",
                warn_contactMobileError: "手机号码格式不正确，请重新输入",
                warn_contactMobileToolong: "手机号码太长了",
                warn_contactNameToolong: "联系人姓名太长了",
                warn_contactNamenotfound: "请输入联系人姓名",
                zw: ""
            };
        },
        /**创建老版本的UserData对象*/
        createUserData: function () {
            win.UserData = {};

            try {
                userdata = $.extend({}, top.$App.getConfig("UserData"));
                $App.on("userAttrsLoad", function (args) {
                    win.trueName = $User.getTrueName();
                    if (win.UserData) { //可能userData尚未加载
                        win.UserData.userName = $User.getTrueName();
                    }

                    win.UserAttrs = $App.getConfig("UserAttrs");
                })
                $App.on("userDataLoad", function (args) {

                    win.UserData = $.extend({}, args);

                    win.uid = args.UID;
                    win.sid = $App.getSid();
                    win.UserData.ssoSid = win.sid;
                    win.UserData.ServerDateTime = new Date();//暂无服务器时间
                       
                    win.UserData.userNumber = win.uid;
                    if (win.trueName) {
                        win.UserData.userName = win.trueName;
                    }

                    var tempArr = [];
                    var list = win.UserData.uidList
                    for (var elem in list) {
                        if (list[elem].name) {
                            tempArr.push(list[elem].name.replace(/@.+/, ""));
                        }
                    }
                    win.UserData.uidList = tempArr;//替换回旧的uidList;

                    win.UserConfig = { "skinPath": "skin_shibo" };
                    
                    try {
                        //修复ps套餐特权的问题
                        var vip = top.$User.getServiceItem();
                        if (vip == "0016") {
                            args.vipInfo.MAIL_2000008 = "1";
                        } else if (vip == "0017") {
                            args.vipInfo.MAIL_2000008 = "2";
                        } else {
                            args.vipInfo.MAIL_2000008 = "0";
                        }
                        args.vipInfo.serviceitem = top.$User.getServiceItem();
                    } catch (e) { }


                });
                return userdata;
            } catch(e) {
            }

            if (top.UserData) {
                userdata = top.UserData;
            }

            win.UserData = userdata;//对UserData的写操作无法同步
            return win.UserData;
        },

        /**创建老版本的UserData对象*/
        createRequestByScript: function () {
            var _utils = {
                requestByScript: function(option, callback) {
                    try {
                        top.M139.core.utilCreateScriptTag.apply(top.M139.core, arguments);
                        return;
                    } catch (e) {
                    }
                    
                    var _src = top.getResourceHost() + "/m2012/js/packs/" + option.src;
                    top.Utils.requestByScript(option.id, _src, callback, option.charset)
                }
            };

            return _utils;
        },

        /**创建老版本的Links对象，实现Links.show*/
        createLinksShow: function () {
            /*win.Links = {
                show: function (name, params) {

                }
            }*/
            win.LinksConfig = win.LinkConfig; //兼容旧版
            win.Links = {

                old:{ //由于没有重构，要跳到1.0的
                    "migrate":"migrate", //一键搬家
                    "syncsetting":"syncsetting", //手机同步邮箱
                    "videomail":"videomail", //视频邮件
                    "invite":"invite", //邀请好友
                    "invitebymail":"invitebymail" //发邮件邀请好友
                },

                map:{ //创建links.show与$App.show的映射关系
                        "upgradeGuide": "mobile",
                        "partner": "mobile",
                        "uecLab":"uecLab",
                        //"setPrivate": "account",
                        "shequ139": "shequ",
                        "orderinfo": "mobile",
                        "mobileGame": "mobileGame",
                        "mnote": "note",
                        "shareAddr": "addrshare",
                        "shareAddrInput": "addrshareinput",
                        "dingyuezhongxin": "googSubscription", // update by tkh 云邮局的tabid统一改为：googSubscription
                        "urlReplace": "urlReplace",
                        "addrinputhome": "addrinputhome",
                        "addroutput": "addroutput",
                        "addr":"addrhome",
                        "addcalendar": "addcalendar",
			            "mobiSyncMail": "syncguide",
                        "syncGuide": "syncguide",
                        "addrImport": "addrImport",
                        "homemail": "googSubscription",
                        "addredit": "addrEdit",
                        "billmanager": "billManager",
                        "disk": "diskDev",
                        "mailnotify": "notice",
                        "tagsuser": "tags",
                        "accountManage": "account",
                        "antivirus": "spam_antivirusArea",
                        "baseData": "account",
                        "addMyCalendar": "addcalendar",
                        "popagent": "popmail", //06-24
                        "blacklist": "spam",
                        "optionindex": "account",
                        "password":"account_accountSafe",
                        "autoreply":"preference_replySet",
                        "autoforward":"preference_forwardSet",
                        "mailnotifyTips":"preference_onlinetips",
                        "filter":"type",
                        "changenumber":"account_accountSafe",
                        "folderall":"tags",
                        "folderpop":"popmail",
                        "inputAddr":"addrinputhome",
                        "inputAddrI":"addrMcloudImport",
                        "secretfolderpwd":"account_secSafe",
                        "addrWhoAddMe": "addrWhoAddMe",
                        "addrvipgroup":"addrvipgroup",
                        "setPrivacy": "setPrivate",
                        "notice":"notice",
                        "calendar_search": "calendar_search",
			"calendar_square":"calendar_square",
                        "calendar_manage":"calendar_manage"
                    },

                show: function (key, options) {
                    var map = this.map; //map放出来，方便判断
/*
if(SiteConfig.selfSearchRelease){
map["selfSearch"]="selfSearch";
}
*/
                    //urlreplace处理
                    //如：&urlReplace=/inner/reader/index?c=17302
                    if(options && /urlreplace/gi.test(options)) {
                        var getObj = window.LinkConfig[key];
                        var newUrl = ''; 
                        var param = '';
                        var urlReplaceObj = {};
                        if (options.indexOf("http://") == -1 && options.indexOf("https://") == -1) {
                            param = options.split('=')[0] + '=';
                            options = options.replace(param,'');
                            newUrl = getDomain(key) + options;
                        }
                        options = newUrl;
                        urlReplaceObj.group = getObj.group;
                        urlReplaceObj.title = getObj.title;
                        urlReplaceObj.url = options;
                        key = 'urlReplace';                       
                        window.LinkConfig[key] = urlReplaceObj;
                        options = null;
                    }

                    if (map[key]) {
                        $App.show(map[key], options);
                        return; 
                    }

                    if (options && options.indexOf('&') > -1) {
                        options = '?from=jumpto' + options;
                        var obj = $Url.getQueryObj(options);
                        //console.log(obj);
                        $App.jumpTo(key, obj);
                    } else {
                        //console.log(key);
                        $App.jumpTo(key);
                    }
                },
                showUrl: function (url, tabTitle) { //暂时跳到旧版读信

                    if (!_.isEmpty(url)) {
                        url = $.trim(url);
                    }

                    if (!_.isEmpty(tabTitle)) {
                        tabTitle = $.trim(tabTitle);
                    }

                    if (!_.isEmpty(url) && !_.isEmpty(tabTitle)) {
                        return $App.showUrl(url, tabTitle);
                    }

                    var jumpToKey = {
                        partid: top.$User.getPartid(),
                        source: 'jumpto',
                        mid: top.$App.getCurrMailMid()
                    };

                    $App.jumpTo('15', jumpToKey);
                }
            }
        },
        createMailTool: function () {
            $App.on("userAttrsLoad", function () {
                win.FM = { folderList: $App.getConfig("FolderList") };
            });
            
            win.MB = {
                show: function (fid) {
                    $App.showMailbox(fid);
                },
                showBillManager: function () {
                    $App.showMailbox(8);
                },                
                subscribeTab: function (key, isOpenFolder) { // add by tkh 是否打开'我的订阅'文件夹
                    if (key && $.inArray(key, ['myMag', 'myCollect', 'googSubscription'])>=0) {
                        $App.show(key);
                        return;
                    }
                    $App.showMailbox(9, isOpenFolder);
                }
            };
            win.CM = {
                show: function (options) {
                    // update by tkh 通过inputData传递参数到写信页，支持传递大文本。如邮件正文。
                    $App.show("compose",null,{inputData:options});
                },
                sendMail: function (sendMailInfo, categroy) {
                    var letter = {
                        to: sendMailInfo.to ? sendMailInfo.to.join(";") : "",
                        cc: sendMailInfo.cc ? sendMailInfo.cc.join(";") : "",
                        bcc: sendMailInfo.bcc ? sendMailInfo.bcc.join(";") : "",
                        showOneRcpt: (sendMailInfo.singleSend || sendMailInfo.showOneRcpt) ? 1 : 0,
                        isHtml: sendMailInfo.isHtml ? 1 : 0,
                        subject: sendMailInfo.subject,
                        content: sendMailInfo.content,
                        priority: sendMailInfo.priority || 3,
                        requestReadReceipt: sendMailInfo.sendReceipt ? 1 : 0,
                        saveSentCopy: sendMailInfo.saveToSendBox === false ? 0 : 1,
                        inlineResources: 0,
                        scheduleDate: 0,
                        normalizeRfc822: 0
                    };
                    var categroyList = {
                        compose: "103000000",
                        sms: "105000000",
                        contact: "109000000",
                        greetingCard: "102000000",
                        postCard: "101000000"
                    }
                    if (categroy == undefined) {
                        categroy = "compose";
                    }

                    //是否定时邮件
                    if (sendMailInfo.timeset && _.isDate(sendMailInfo.timeset)) {
                        letter.scheduleDate = parseInt(sendMailInfo.timeset.getTime() / 1000);
                    }
                    //设置发信帐号
                    (function getAccount(ac) {
                        //login|alias|number|fetion|default
                        if (!ac) ac = {};
                        if (_.isString(ac)) {
                            letter.account = ac;
                        } else if (_.isObject(ac)) {
                            ac.id = ac.id || "default";
                            var acSettings = {
                                "default": getDefaultId(),
                                "login": getLoginId(),
                                "alias": getAlisaId(),
                                "number": getNumberId(),
                                "fetion": getFetionId()
                            };
                            if (!top.$Email.isEmail(ac.id)) {
                                ac.id = acSettings[ac.id];
                            }
                            ac.name = (ac.name == null) ? getDefaultName() : ac.name;
                            letter.account = "\"{0}\"<{1}>".format(ac.name, ac.id);
                        }

                        function getDefaultId() {
                            return $User.getDefaultSender();
                        }
                        function getLoginId() {
                            return $User.getDefaultSender();
                        }
                        function getAlisaId() {
                            return $User.getAliasName();
                        }
                        function getFetionId() {
                            return $User.getDefaultSender();
                        }
                        function getNumberId() {
                            return $User.getUid() + "@" + mailDomain;
                        }
                        function getDefaultName() {
                            return $User.getTrueName();
                        }
                    })(sendMailInfo.account);
                    if (!M139.Text.Email.isEmailAddr(letter.account)) {
                        //return doError("ParamError", "account参数异常");
                    }
                    if (sendMailInfo.headers) {
                        letter.headers = {};
                        if (sendMailInfo.headers.subjectColor) {
                            //主题颜色
                            letter.headers["X-RM-FontColor"] = sendMailInfo.headers.subjectColor;
                        }
                        var sn = sendMailInfo.headers.smsNotify;
                        if (sn !== undefined) {
                            letter.headers["X-RM-SmsNotify"] = sn;
                        }
                    }
                    var requestXml = {
                        attrs: letter,
                        action: "deliver",
                        returnInfo: 1
                    };
                    if (sendMailInfo.loadingMsg) {
                        WaitPannel.show(sendMailInfo.loadingMsg);
                    }
                    var categroyId = categroyList[categroy];
                    if (!categroyId) {
                        categroyId = categroy;
                    }
                    top.M139.RichMail.API.call("mbox:compose&comefrom=5&categroyId=" + categroyId, requestXml, function (e) {
                        WaitPannel.hide();
                        var result = e.responseData;
                        if (sendMailInfo.callback) {
                            sendMailInfo.callback(result);
                            return;
                        }
                        if (result['code'] == 'S_OK') {
                            doSuccess(result['var']);
                        } else {
                            //后面要把所有错误类型整理出来
                            if (result["code"] == "FA_INVALID_DATE") {
                                doError("DateError", "定时发送的时间不能比当前的时间早", result["code"]);
                            } else {
                                doError("Unknown", "发送失败", result["code"]);
                            }
                        }
                    });
                    function doSuccess(mid) {
                        if (sendMailInfo.onsuccess) {
                            sendMailInfo.onsuccess({ mid: mid });
                        }
                    }
                    function doError(errorCode, errorMsg, code) {
                        if (sendMailInfo.onerror) {
                            sendMailInfo.onerror({ errorCode: errorCode, errorMsg: errorMsg, code: code });
                        }
                    }
                }
            }
        },
        createModuleManager: function() {
            win.MM = {
                show: function (name, params) {
                },
                activeModule:function(name){
                    top.$App.closeTab(name);
                },
				setTitle: function(title){
					top.$App.setTitle(title);
				},
                close: function (name, params) {
                    try {
                        top.$App.closeTab(name);
                        return;
                    } catch (ex) {
                    }

                    var _params = params || {};

                    if (_params.exec == "back") {
                        top.MM.goBack();
                    } else if (_params.exec == "closeAll") {
                        top.MM.closeAll();
                    } else {
                        top.MM.close(name);
                    }

                }
            };
            return win.MM;
        },

        /**创建老的加载中对象*/
        createWaitPanel: function () {
            win.WaitPannel = {
                show: function (msg, option) {
                    try {
                        top.M139.UI.TipMessage.show(msg, option);
                        return;
                    } catch (ex) {
                    }

                    if (top.WaitPannel) {
                        if (option) {
                            if (option.delay) {
                                top.FF.alert(msg);
                                setTimeout(function(){
                                    top.FF.close();
                                }, option.delay);
                                return;
                            }
                        }

                        top.WaitPannel.show(msg);
                    }
                },
                hide: function () {
                    try {
                        top.M139.UI.TipMessage.hide();
                        return;
                    } catch (ex) {
                    }

                    if (top.WaitPannel) {
                        top.WaitPannel.hide();
                    }
                }
            }
            return win.WaitPannel;
        },
        createValidate: function() {
    win.Validate = {
        config: {
				//3位是考虑到短号集群网。
				"mobile":{
					message:"手机格式不正确，请输入3-20位数字",
					//regex:/^\d{3,20}$/
					regex:/^[\(\)\-\d]{3,20}$/
				},
				"email":{
					message:"邮箱格式不正确。应如zhangsan@139.com，长度6-90位",
					regex:new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$","i")
				},
				"phone":{
					message:"电话号码格式不正确，请输入3-30位数字、-",
					regex:/^[\-\d]{3,30}$/
				},
				"fax":{
					message:"传真号码话格式不正确，请输入3-30位数字、-",
					regex:/^[\-\d]{3,30}$/
				},
				"zipcode" :{
					message:"邮编格式不正确，请输入3-10位字母、数字、-或空格",
					regex:/^[\ \-\w]{3,10}$/
				},
				"otherim" :{
					message:"飞信号格式不正确，请输入6-10位数字",
					regex:/^\d{6,10}$/
				},
				"qq" :{
					message:"QQ格式不正确，请输入5-11位数字",
					regex:/^\d{5,11}$/
				}
        },
        test: function(key, value) {
            var obj = Validate.config[key];
            if(!obj) {
                throw "找不到的正则:" + key;
            }
            if(obj.regex.test(value)) {
                return true;
            } else {
                this.error = obj.message;
                return false;
            }
        },
        testBirthday: function(value) {

            var isDate = false;
            if(!value) return false;
            var r = value.match(/(\d{4})\-(\d{2})\-(\d{2})/);
            if(r) {
                try {
                    var t = [Number(r[1]), Number(r[2]) - 1, Number(r[3])];
                    var n = new Date();
                    if(t[0] > 0 && t[0] <= n.getFullYear() && t[1] > -1 && t[1] < 12 && t[2] > 0 && t[2] < 32) {
                        var d = new Date(t[0], t[1], t[2]);
                        if(d < n) {
                            isDate = (d.getFullYear() == t[0] && (d.getMonth()) == t[1] && d.getDate() == t[2]);
                        }
                    }
                } catch(ex) {}
            }
            return isDate;
        }
    }
}
    }));
    jQuery.extend(M2012.MatrixVM,
    /**@lends M2012.MatrixVM*/
    {
        /**在使用了老版本对象接口的情况下给予日志提示，描述使用新版本的方法*/
        tip: function (oldFunc, newWay) {

        }
    });
    //对话框组件
    var FF = {
        alert: function (msg, callback) {
            try {
                this.current = top.$Msg.alert(msg, { onclose: callback, isHtml: true, icon:"warn" });
                return this.current;
            } catch(e) {
            
            }
        
            if (top.FF && top.FF.alert) {top.FF.alert(msg)}
        },
        prompt: function (title, msg, defaultValue, callback, maxLength) {
            this.current = $Msg.prompt(msg, callback, {
                dialogTitle: title,
                defaultValue: defaultValue,
                maxLength: maxLength,
                isHtml: true
            });
            return this.current;
        },
        setHeight: function (height) {
            $Msg.getCurrent().setHeight(height);
            $Msg.getCurrent().resetHeight();
        },
        setWidth: function (height) {
            $Msg.getCurrent().setWidth(height);
        },
        close: function () {
            $Msg.getCurrent().close();
        },
        confirm: function (message, callback, cancelCallback, isYesAndNo) {
            var op = {
                icon:"warn",
                isHtml:true
            };
            if (isYesAndNo) {
                op.buttons = [" 是 ", " 否 "];
            }
            this.current = $Msg.confirm(message, callback, cancelCallback, op);
            return this.current;
        },
        show: function (html, title, width, height, fixSize, onclosed, eventHandlers) {
            this.current = $Msg.showHTML(html, {
                dialogTitle: title,
                width: width,
                height: height,
                onclick: onclosed
            });
            return this.current;
        },
        open: function (title, src, width, height, fixSize, miniIcon, hideIcon, hideTitle) {
            this.current = $Msg.open({
                url: src,
                dialogTitle: title,
                width: width,
                height: height,
                //onclick: onclosed,
                hideTitleBar: hideTitle
            });
            return this.current;
        },
        minimize: function () {
            $Msg.getCurrent().minisize();
        }
    };

})(jQuery, _, M139);

﻿/**
 * @fileOverview 定义弹出菜单组件
 */

 (function (jQuery,_,M139){
 var $ = jQuery;
 var superClass = M139.View.ViewBase;
M139.namespace("M2012.UI.PopMenu",superClass.extend(
 /**
  *@lends M2012.UI.PopMenu.prototype
  */
{
    /** 弹出菜单组件
    *@constructs M2012.UI.PopMenu
    *@extends M139.View.ViewBase
    *@param {Object} options 初始化参数集
    *@param {String} options.template 组件的html代码
    *@param {Array} options.itemsContainerPath 定义子项的容器路径
    *@param {Array} options.items 定义子项内容
    *@param {String} options.itemsPath 定义子项节点路径
    *@param {String} options.itemsTemplate 定义子项html模板
    *@param {String} options.itemsContentPath 定义内dock容显示的位置
    *@param {String} options.splitLineTemplate 定义分割线的html模板
    *@param {String} options.subMenuIconTemplate 子菜单箭头图标
    *@param {String} options.subMenuIconInsertPath 子菜单箭头插入的位置
    *@param {String} options.subMenuInsertPath 定义子菜单插入的父元素的位置
    *@param {Number} options.scrollCount 定义最多到几个菜单项的时候出现滚动条，默认为15
    *@param {Number} options.maxHeight 定义菜单最多到多少像素高的时候出现垂直滚动条，默认240
    *@example
    */
    initialize: function (options) {
        var customClass = options.customClass || "";
        var customStyle = options.customStyle || "";
        options.template = options.template.replace("{customClass}", customClass);
        options.template = options.template.replace("{customStyle}", customStyle);
        var $el = jQuery(options.template);
        this.setElement($el);
        return superClass.prototype.initialize.apply(this, arguments);
    },
    name: "M2012.UI.PopMenu",
    /**构建dom函数*/
    render:function(){
        var This = this;
        var options = this.options;
        var items = options.items;

        var itemContainer = options.itemsContainerPath ? this.$el.find(options.itemsContainerPath):this.$el;
        var itemCount = 0;

        if (options.selectMode) {
            this.$el.addClass(options.selectModeClass);
        }

        for(var i=0;i<items.length;i++){
            var item = items[i];
            if(item.isLine){
                itemContainer.append(options.splitLineTemplate);
            }else{
                var node = jQuery(options.itemsTemplate).appendTo(itemContainer);

                if(item.text){
                    node.find(options.itemsContentPath).text(item.text);
                } else if (item.html) {
                    if (item.highlight == false) { //非高亮状态，不生成a:hover样式
                        node.html(item.html);
                    } else {
                        node.find(options.itemsContentPath).html(item.html);
                    }
                }

                if (options.selectMode) {
                    node.find(options.subMenuIconInsertPath).prepend(options.selectIconTemplate);
                }

                if(item.items && item.items.length){
                    //插入有子菜单的右箭头
                    node.find(options.subMenuIconInsertPath).append(options.subMenuIconTemplate);
                    node.attr("submenu","1");
                }
                node.attr("index",i);
                itemCount ++ ;
            }
        }

        this.on("print",function(){
            //判断是否要出滚动条
            if(itemCount > (options.scrollCount || 15) || this.getHeight() > options.maxHeight){
                this.$el.css({
                    "overflow-x":"hidden",
                    "overflow-y":"scroll",
                    "height":(options.maxHeight || 310)
                });
            }
            //处理溢出界面
            if (this.options.parentMenu) {
                var offset = this.$el.offset();
                var bottom = offset.top + M139.Dom.getElementHeight(this.$el);
                var moreTop = bottom - $(document.body).height()+10;
                if (moreTop > 0) {
                    this.$el.css("top", -moreTop + "px");
                }
            }
        });

        this.$el.find(options.itemsPath).mouseover(function(){
            This.onMenuItemMouseOver(this);
        }).click(function (e) {
            var obj = e.target;
            var isThisMenu = M139.Dom.containElement(This.el, obj);
            //子菜单的容器在菜单项里，这里要排除子菜单的点击
            if (isThisMenu) {
                This.$el.find("ul div *").each(function () {
                    if (this == obj) {
                        isThisMenu = false;
                    }
                });
            }
            if (isThisMenu) {
                This.onMenuItemClick(this);
            }

            e.stopPropagation();
            if ($.browser.msie && $.browser.version <= 7) { // update by tkh IE67 阻止浏览器的默认行为，解决bug：回复转发打开空白写信页
                e.preventDefault();
            }
        });

		if(options.hideInsteadOfRemove) {
	        this.on("itemclick", function () {
	            this.hide();
	        });
		} else {
	        this.on("itemclick", function () {
	            this.remove();
	        });
        }

        return superClass.prototype.render.apply(this, arguments);
    },
    /**@inner*/
    getItemByNode:function(node){
        return this.options.items[node.getAttribute("index")];
    },
    /**@inner*/
    onMenuItemClick:function(node){
        var index = node.getAttribute("index");
        if(!index) return;
        index = index | 0;
        var item = this.getItemByNode(node);
        if (jQuery.isFunction(item.onClick)) {
            item.onClick(item);
        }
        if (jQuery.isFunction(this.options.onItemClick)) {
            this.options.onItemClick(item, index);
        }
        this.trigger("itemclick", item, index);
    },

    /**移除菜单*/
    remove:function(){
        this.removeSubMenu();
        superClass.prototype.remove.apply(this,arguments);
    },

    selectItem:function(index){
	    var options = this.options;
        this.$(options.itemsPath).removeClass(options.selectedClass).eq(index).addClass(options.selectedClass);
    },

    /**
     *鼠标移动到菜单项上面，需要显示子菜单
     *@inner
     */
    onMenuItemMouseOver: function (node) {
        var This = this;
        if (node.getAttribute("submenu")) {
            var item = this.getItemByNode(node);
            this.trigger("itemMouseOver", item);
            //创建子菜单
            if (item.menu && this.subMenu == item.menu) {
                return;
            } else {
                var op = jQuery.extend({}, this.options);
                op.items = item.items;
                op.parentMenu = this;
                
                var left = op.width ?  parseInt(op.width) : 150;
                var _top = -5;

                if (op.width2) { op.width = op.width2;} //二级菜单支持独立宽度
                item.menu = new M2012.UI.PopMenu(op);
                /*
                if (menu.$el.height() + top > $(document.body).height()) {
                    options.top = top - menu.$el.height();
                }
                if (menu.$el.width() + left > $(document.body).width()) {
                    options.left = left - menu.$el.width();
                }*/


                this.trigger("subItemCreate", item);
                var $el = item.menu.render().get$El();
                var offset = this.$el.offset();
                if (offset.left > $(document.body).width() / 2) {
                    left = -$el.width();
                }

                $el.appendTo(node).css({
                    left: left+"px",
                    top: _top+"px"
                });

                item.menu.on("remove", function () {
                    item.menu = null;
                }).on("itemclick", function () {
                    This.remove();
                });
            }
            //一个菜单只能同时显示一个子菜单
            this.removeSubMenu();
            this.subMenu = item.menu;
        } else {
            this.removeSubMenu();
        }
    },

    show: function(){
	    var This = this;
        $D.bindAutoHide({
            stopEvent:true,
            action:"click",
            element:this.el,
            callback: function(){This.hide()}
        });
	    superClass.prototype.show.apply(this, arguments);
    },

    hide: function(){
	    $D.unBindAutoHide({element: this.el});
	    superClass.prototype.hide.apply(this, arguments);
    },
    
    /**
     *移除子菜单
     *@inner
     */
    removeSubMenu:function(){
        if(this.subMenu){
            try {
                this.subMenu.remove();
                this.subMenu = null;
            }catch(e){}
        }
    }
}
));

var DefaultMenuStyle = {
    template: ['<div class="menuPop shadow {customClass}" style="top:0;left:0;z-index:9001;{customStyle}">',
       '<ul>',
       '</ul>',
    '</div>'].join(""),
    splitLineTemplate:'<li class="line"></li>',
    itemsContainerPath:"ul",
    itemsPath:"ul > li",
    itemsTemplate: '<li><a href="javascript:;"><span class="text"></span></a></li>',
    itemsContentPath: 'a > span',
    subMenuIconTemplate: '<i class="i_triangle_h"></i>',
    selectModeClass: "menuPops",
    selectedClass: "cur",
    selectIconTemplate: '<i class="i_b_right"></i>',
    subMenuIconInsertPath:'a'
};


jQuery.extend(M2012.UI.PopMenu,
 /**
  *@lends M2012.UI.PopMenu
  */
{
    /**
    *使用常规的样式创建一个菜单实例
    *@param {Object} options 参数集合
    *@param {Array} options.items 菜单项列表
    *@param {HTMLElement} options.container 可选参数，父元素，默认是添加到body中
    *@param {String} options.top 坐标
    *@param {String} options.left 坐标
    *@example
    M2012.UI.PopMenu.create({
        items:[
            {
                text:"标已读",
                onClick:function(){
                    alert("标已读");
                }
            },
            {
                text:"标未读",
                onClick:function(){}
            },
            {
                isLine:true
            },
            {
                text:"标签",
                items:[
                    {
                        html:'&lt;span class=&quot;tagMin&quot;&gt;&lt;span class=&quot;tagBody&quot; style=&quot;background-color:#369;&quot;&gt;&lt;/span&gt;&lt;/span&gt; &lt;span class=&quot;tagText&quot;&gt;标签1&lt;/span&gt;',
                        onClick:function(){}
                    },
                    {
                        html:'&lt;span class=&quot;tagMin&quot;&gt;&lt;span class=&quot;tagBody&quot; style=&quot;background-color:#F60;&quot;&gt;&lt;/span&gt;&lt;/span&gt; &lt;span class=&quot;tagText&quot;&gt;标签2&lt;/span&gt;',
                        onClick:function(){}
                    }
                ]
            },
        ],
        onItemClick:function(item){
            alert("子项点击");
        }
    });
    */
    create:function(options){
        if(!options || !options.items){
            throw "M2012.UI.PopMenu.create:参数非法";
        }
        options = _.defaults(options,DefaultMenuStyle);
        var menu = new M2012.UI.PopMenu(options);
        menu.render().$el.appendTo(options.container || document.body).css("visibility","hidden");
        if (options.dockElement) {
            setTimeout(function () {
                M139.Dom.dockElement(options.dockElement, menu.$el, { direction: options.direction, dx: options.dx, dy: options.dy });
                menu.$el.css("visibility", "");
            }, 0);
        } else {
            var top = parseInt(options.top);
            var left = parseInt(options.left);
            if (menu.$el.height() + top > $(document.body).height()) {
                options.top = top - menu.$el.height();
            }
            if (menu.$el.width() + left > $(document.body).width()) {
                options.left = left - menu.$el.width();
            }
            menu.$el.css({
                left: options.left || 0,
                top: options.top || 0
            });
            menu.$el.css("visibility", "");
        }

        //点击页面其它地方自动隐藏
        $D.bindAutoHide({
            stopEvent:true,
            action:"click",
            element:menu.el,
            callback: options.hideInsteadOfRemove ? function(){menu.hide()} : function(){menu.remove()}
        });

        return menu;
    },
    /**当点击时自动创建菜单
    */
    createWhenClick: function (options,createCallback) {
        if (!options || !options.target) {
            throw "必须包含options.target，表示被点击的元素";
        }
        $(options.target).click(function (e) {
            if (!options.dockElement) {
                options.dockElement = $(options.target);
            }
            var menu = M2012.UI.PopMenu.create(options);
            if (createCallback) {
                createCallback(menu);
            }
        });
            
        
    },


    bindAutoHide:function(options){
        return $D.bindAutoHide(options);
    },

    unBindAutoHide: function (options) {
        return $D.unBindAutoHide(options);
    }
    
});

})(jQuery,_,M139);
﻿/**
 * @fileOverview 定义下拉框组件，仿原生的select控件
 */

(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace("M2012.UI.DropMenu", superClass.extend(
		/**
		 *@lends M2012.UI.DropMenu.prototype
		 */
		{
			/** 下拉框组件
			 *@constructs M2012.UI.DropMenu
			 *@extends M139.View.ViewBase
			 *@param {Object} options 初始化参数集
			 *@param {String} options.template 组件的html代码
			 *@param {String} options.contentPath 定义子项的容器路径
			 *@param {Number} options.selectedIndex 初始化下标（选中的项）
			 *@example
			 */
			initialize: function(options) {
				var $el = $(options.template);
				this.setElement($el);
				return superClass.prototype.initialize.apply(this, arguments);
			},
			name: "M2012.UI.DropMenu",

			/**构建dom函数*/
			render: function() {
				var This = this;
				var options = this.options;

				if (options.contentPath) {
					var initText = options.defaultText || "";
					if (typeof options.selectedIndex == "number") {
						initText = options.menuItems[options.selectedIndex].text || options.menuItems[options.selectedIndex].html;
						this.selectedIndex = options.selectedIndex;
					}
					this.setText(initText);
				}

				/*防止事件重复绑定*/
				this.$el.off('click').on("click", function() {
					if (This.quiet) {
						return;
					}
					This.showMenu();
				});

				return superClass.prototype.render.apply(this, arguments);
			},

			defaults: {
				selectedIndex: -1
			},

			/**@inner*/
			setText: function(text) {
				this.$el.find(this.options.contentPath).html(text);
			},

			disable: function() {
				this.quiet = true;
			},

			enable: function() {
				this.quiet = false;
			},

			/**@inner*/
			showMenu: function() {
				var This = this;
				var menu = this.menu;
				var options = this.options;

				if (menu === undefined) {
					var menuOptions = {
						onItemClick: function(item, index) {
							This.onMenuItemClick(item, index);
						},
						container: document.body,	// todo 很搓
						items: options.menuItems,
						dockElement: this.$el,
						width: this.getWidth(),
						maxHeight: options.maxHeight,
						customClass: options.customClass,
						selectMode: options.selectMode,
						hideInsteadOfRemove: true
					};
					this.menu = M2012.UI.PopMenu.create(menuOptions);
					this.menu.on("subItemCreate", function(item) {
						This.trigger("subItemCreate", item);
					});
					This.trigger("menuCreate", this.menu);
				} else {
					menu.isHide() ? menu.show() : menu.hide();
				}
			},

			/**inner*/
			onMenuItemClick: function(item, index) {
				this.setText(item.text || item.html);
				this.selectedIndex = index;
				/**
				 *选中值发生变化
				 *@event
				 *@name M2012.UI.DropMenu#change
				 *@param {Object} item 原来的menuItem数据
				 *@param {Number} index 选中的下标
				 */
				this.trigger("change", item, index);
			},
			/**
			 *得到选中的值
			 *@returns {Object}
			 */
			getSelectedItem: function() {
				return this.options.menuItems[this.selectedIndex] || null;
			},
			/***
			设置当前选中项
			*/
			setSelectedIndex: function(idx) {
				this.selectedIndex = idx;
				this.options.selectedIndex = idx;
				var item = this.getSelectedItem();
				this.setText(item.text || item.html);
			},
			setSelectedText: function(text) {
				this.setSelectedValue(text, "text");
			},
			setSelectedValue: function(val, type) {
				for (var i = 0; i < this.options.menuItems.length; i++) {
					if (this.options.menuItems[i].value == val || (type == "text" && this.options.menuItems[i].text == val)) {
						this.setSelectedIndex(i);
						return;
					}
				}
			},
			/**
			* 获取数量
			*/
			getCount: function() {
				return this.options.menuItems.length;
			},
			/**
			* 在指定的位置添加一项，默认在尾部追加
			*/
			addItem: function(item, position) {
				if (position == undefined) {
					this.options.menuItems.push(item);
				} else {
					this.options.menuItems.splice(position, 0, item);
				}
				this.render();
			}
		}
	));

	var DefaultStyle = {
		template: [
			'<div class="dropDown">',
			'<div class="dropDownA" href="javascript:void(0)"><i class="i_triangle_d"></i></div>',
			'<div class="dropDownText"></div>',
			'</div>'
		].join(""),
		contentPath: ".dropDownText",
		dropButtonPath: ".dropDownA"
	};


	jQuery.extend(M2012.UI.DropMenu,
		/**
		 *@lends M2012.UI.DropMenu
		 */
		{
			/**
			*使用常规的样式创建一个菜单实例
			*@param {Object} options 参数集合
			*@param {String} options.defaultText 初始化时按钮的默认文本（如果有selectedIndex属性，则此属性无效）
			*@param {Array} options.menuItems 菜单项列表
			*@param {Number} options.selectedIndex 初始化下标
			*@param {HTMLElement} options.container 按钮的容器
			*@example
			var dropMenu = M2012.UI.DropMenu.create({
			    defaultText:"默认文本",
			    //selectedIndex:1,
			    menuItems:[
			        {
			            text:"选项一",
			            myData:1
			        },
			        {
			            text:"选项二",
			            myData:2
			        }
			    ],
			    container:$("div")
			});
			dropMenu.on("change",function(item){
			    alert(item.myData);
			});

			alert(dropMenu.getSelectedItem());//如果默认没有选中值，则返回null
			*/
			create: function(options) {
				if (!options || !options.container) {
					throw "M2012.UI.DropMenu.create:参数非法";
				}
				options = _.defaults(options, DefaultStyle);
				var button = new M2012.UI.DropMenu(options);
				options.container.html(button.render().$el);

				return button;
			}
		});

})(jQuery, _, M139);

﻿﻿/**
 * @fileOverview 定义选择器组件（包括选择时间、日历等）
 */
 (function (jQuery,_,M139){
 var $ = jQuery;
 var superClass = M139.View.ViewBase;
M139.namespace("M2012.UI.Picker.PickerBase",superClass.extend(
 /**
  *@lends M2012.UI.Picker.PickerBase.prototype
  */
{
    /** 弹出菜单组件
    *@constructs M2012.UI.Picker.PickerBase
    *@extends M139.View.ViewBase
    *@param {Object} options 初始化参数集
    *@param {String} options.template 组件的html代码
    *@param {HTMLElement} options.container 可选参数，容器，表示该控件是静止的
    *@param {HTMLElement} options.bindInput 可选参数，挂载的文本框
    *@example
    */
    initialize: function (options) {
        options = options || {};
        var $el = jQuery(options.template||this.template);
        this.setElement($el);

        //绑定文本框获得焦点事件
        this.bindHostEvent();

        return superClass.prototype.initialize.apply(this, arguments);
    },
    name: "M2012.UI.Picker.PickerBase",

    render:function(){
        //使render只执行一次
        this.render = function(){
            return this;
        }
        this.$el.appendTo(this.options.container || document.body);
        
        return superClass.prototype.render.apply(this, arguments);
    },

    /**
     *@param {Object} options 参数集
     *@param {HTMLElement} options.dockElement 可选参数，根据什么元素定位（缺省是以文本框定位）
     *@param {Number} options.top 可选参数定位坐标
     *@param {Number} options.left 可选参数定位坐标
     */
    show:function(options){
        options = options || {};
        var dockElement = options.dockElement || this.options.bindInput;

        if(dockElement){
            var param= {
                margin:10
            };
            if(options.dx){param.dx=options.dx;param.dy=options.dy;}
            M139.Dom.dockElement(dockElement, this.el,param);
        }else if(options.x && options.y){
            this.$el.css({
                top:options.y,
                left:options.x
            });
        }
        this.$el.css("z-index","9999");
        return superClass.prototype.show.apply(this, arguments);
    },

    hide:function(){
        M2012.UI.PopMenu.unBindAutoHide({
            action:"click",
            element:this.el
        });
        return superClass.prototype.hide.apply(this, arguments);
    },

    /**
     *绑定文本框获得焦点后显示控件
     *@inner
     */
    bindHostEvent:function(){
        if(!this.options.bindInput){
            return;
        }
        var This = this;

        this.$el.click(function (e) {
            M139.Event.stopEvent(e);
        });

        $(this.options.bindInput).click(function(){
            This.render().show(This.options);

            M2012.UI.PopMenu.bindAutoHide({
                action:"click",
                element:This.el,
                stopEvent:true,
                callback:function(){
                    This.hide();
                }
            });
        });
    },

    /**子类中调用，当选择值发生变化后，主动调用onSelect，会触发select事件*/
    onSelect:function(value,index){
        if(value === undefined){
            if(this.getValue){
                value = this.getValue();
            }else if(this.getSelectedValue){
                value = this.getSelectedValue();
            }
        }
        /**选择值发生变更的时候触发
        * @name M2012.UI.Picker.PickerBase#select
        * @event
        * @param {Object} e 事件参数
        * @example
        picker.on("select",function(e){
            e.value
        });
        */
        this.trigger("select",{value:value,index:index});
    }
}
));


})(jQuery,_,M139);
﻿/**
 * @fileOverview 定义时间选择范围组件
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M2012.UI.Picker.PickerBase;
    M139.namespace("M2012.UI.Picker.TimeRange", superClass.extend(
     /**
      *@lends M2012.UI.Picker.TimeRange.prototype
      */
    {
        /** 范围选择组件
        *@constructs M2012.UI.Picker.TimeRange
        *@extends M2012.UI.Picker.PickerBase
        *@param {Object} options 初始化参数集
        *@param {Boolean} options.isArea 是只选择一个时间，还是选择一个时间区域
        *@param {Number} options.minArea 最小时间间隔（默认是1小时）
        *@param {Boolean} options.showMinutes 是否支持选分钟
        *@param {Object} options.value 初始化值
        *@param {Object} options.container 如果是静态控件，指定一个父容器
        *@param {Object} options.bindInput 如果是外挂，指定一个绑定的文本框
        *@example

        //绑定文本框，选择范围
        var timeRange = new M2012.UI.Picker.TimeRange({
            bindInput:document.getElementById("myInput"),
            isArea:true,
            value:{
                start:1,
                end:10
            }
        });

        //静态显示的控件
        var time2 = new M2012.UI.Picker.TimeRange({
            container:document.getElementById("divContainer"),
            value:10
        }).render();
        */
        initialize: function (options) {
            options = options || {};

            this.isArea = options.isArea;
            this.minArea = options.minArea || this.minArea;

            this.showMinutes = options.showMinutes;

            //选分钟 1像素=5分钟
            if(options.showMinutes){
                this.Step = 1;
            }

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: "M2012.UI.Picker.TimeRange",

        TotalWidth: 288,
        Step: 12,
        minArea: 1,

        events:{
            "click": "onRulerClick" //点击标尺
        },

        template:['<div style="position: absolute;background:white"><div class="tControl" style="width:287px;">	',
 	    '<ul class="tC-ul">',
 		    '<li style="left:0;"></li>',
 		    '<li style="left:24px;"></li>',
 		    '<li style="left:48px;"></li>',
 		    '<li style="left:72px;"></li>',
 		    '<li style="left:94px;"></li>',
 		    '<li style="left:120px;"></li>	',
 		    '<li style="left:144px;"></li>	',
 		    '<li style="left:168px;"></li>	',
 		    '<li style="left:192px;"></li>	',
 		    '<li style="left:216px;"></li>	',
 		    '<li style="left:240px;"></li>	',
 		    '<li style="left:264px;"></li>	',
 	    '</ul>',
 	    '<div class="tC-h">',
 	    '</div>',
 	    '<div class="tC-l"></div>',
 	    '<div class="tC-r"></div>',
 	    '<div class="tC-num" style="left:25px;margin-left:7px">',
                     '<em class="a1">15:00</em>',
                     '<span></span>',
          '</div>',
 	     '<div class="tC-width" style="width:50px;left:48px;margin-left:-7px"></div>',
 	     '<div class="tC-num" style="left:80px;margin-left:7px">',
                     '<em class="a2">15:00</em>',
                     '<span></span>',
          '</div>',
 	     '<div class="tc-text">',
 		    '<span class="a3">24:00</span><span class="a1">0:00</span><span class="a2">12:00</span>',
 	     '</div>',
      '</div></div>'].join(""),

        /**构建dom函数*/
        render: function () {
            var This = this;

            /**
            *左边的游标
            *@field
            *@type {jQuery}
            */
            this.startFlag = this.$(".tC-num:eq(0)");

            /**
            *右边的游标
            *@field
            *@type {jQuery}
            */
            this.endFlag = this.$(".tC-num:eq(1)");

            //中间的选择区域元素
            this.selectAreaElement = this.$(".tC-width");

            this.on("print", function () {
                this.initEvent();
            });

            return superClass.prototype.render.apply(this, arguments);
        },

        /**@inner*/
        initEvent: function () {
            var This = this;

            M139.Dom.setDragAble(this.startFlag[0], {
                lockY: 1,
                onDragMove: function () {
                    var startLeft = parseInt(This.startFlag.css("left"));
                    if (startLeft > This.TotalWidth) {
                        This.startFlag.css("left",This.TotalWidth);
                    }


                    if(This.isArea){
                        //结束时间不能与开始时间重叠
                        var endLeft = parseInt(This.endFlag.css("left"));
                        if(startLeft > endLeft - This.minArea * This.Step){
                            This.setStartValue(This.getEndValue() - 1);
                        }
                    }

                    This.setStartValue(This.getStartValue());
                },
                onDragEnd: function () {
                    This.setStartValue(This.getStartValue());
                }
            });

            if (this.isArea) {
                M139.Dom.setDragAble(this.endFlag[0], {
                    lockY: 1,
                    onDragMove: function () {
                        var endLeft = parseInt(This.endFlag.css("left"));
                        var startLeft = parseInt(This.startFlag.css("left"));
                        var minLeft = startLeft + (This.minArea * This.Step);

                        if (endLeft > This.TotalWidth) {
                            This.setEndValue(24);
                        } else if (endLeft < minLeft) {
                            //结束时间不能与开始时间重叠
                            This.setEndValue(This.getStartValue() + This.minArea);
                        }
                        This.setEndValue(This.getEndValue());
                    },
                    onDragEnd: function () {
                        This.setEndValue(This.getEndValue());
                    }
                });
            } else {
                this.startFlag.find(".a1").removeClass("a1");
                this.endFlag.hide();
                this.selectAreaElement.hide();
            }

            this.initValue();
        },

        /**@inner*/
        initValue: function () {
            var initValue = this.options.value;
            if (this.isArea) {
                this.setStartValue(initValue.start);
                this.setEndValue(initValue.end);
            } else {

                this.setStartValue();
            }
        },

        /**@inner*/
        updateArea:function(){
            //修改“范围”元素的宽度、坐标
            this.selectAreaElement.css({
                left: parseInt(this.startFlag.css("left")) + 20,
                width: (this.getEndValue() - this.getStartValue()) * this.Step + "px"
            });
        },

        /**@inner*/
        updateStartValueText: function (value) {
            if(this.showMinutes){
                //1像素=5分钟
                var text = Math.floor(value / 12) + ":" + (value % 12) * 5;
                //补0
                text = text.replace(/^(\d{1}):/,"0$1:").replace(/:(\d{1})$/,":0$1");
            }else{
                var text = value + ":00"
            }
            this.startFlag.find("em").text(text);
            this.updateArea();
        },
        /**@inner*/
        updateEndValueText: function (text) {
            this.endFlag.find("em").text(text + ":00");
            this.updateArea();
        },

        /**设置开始游标的值*/
        setStartValue: function (value) {
            value = value || 0;
            this.startFlag.css("left", value * this.Step + "px");
            this.updateStartValueText(value);

            this.onSelect();
        },
        /**设置结束游标的值*/
        setEndValue: function (value) {
            this.endFlag.css("left", value * this.Step + "px");
            this.updateEndValueText(value);

            this.onSelect();
        },

        /**
         *@inner
         *根据偏移的像素获得选取值
         */
        utilGetValueByPx: function (left) {
            var v = parseInt(left);
            v = Math.round(v / this.Step);
            return v;
        },

        /**获取开始游标的值
         *@returns {Number}
         */
        getStartValue: function () {
            var left = this.startFlag.css("left");
            var value = this.utilGetValueByPx(left);
            return value;
        },

        /**获取结束游标的值
         *@returns {Number}
         */
        getEndValue: function () {
            return this.utilGetValueByPx(this.endFlag.css("left"));
        },

        /**
         *@inner
         获取当前选取的值
         */
        getSelectedValue: function () {
            if (this.isArea) {
                var value = {
                    start: this.getStartValue(),
                    end: this.getEndValue()
                };
            } else {
                var value = this.getStartValue();
            }

            return value;
        },

        /**
         *获取最终选取的值
         */
        getValue:function(){
            var value = this.getSelectedValue();
            if(this.showMinutes){
                var h = Math.floor(value / 12);
                var m = (value % 12) * 5;
                var time = new Date();
                time.setMinutes(m);
                time.setHours(h);
                return time;
            }else{
                return value;
            }
        },

        /**
         *实现点击标尺后游标自动选过去
         *@inner*/
        onRulerClick:function(e){
            var x = e.pageX - this.$el.offset().left;
            var value = Math.max(0,x - 10);
            value = Math.min(value,this.TotalWidth);
            value = this.utilGetValueByPx(value);
            if(this.isArea){
                var sel = this.getSelectedValue();
                if(value <= sel.start){
                    this.setStartValue(value);
                }else if(value >= sel.end){
                    this.setEndValue(value);
                }else if(value - sel.start > sel.end - value){
                    this.setEndValue(value);
                }else{
                    this.setStartValue(value);
                }
            }else{
                this.setStartValue(value);
            }
        }
    }
    ));


})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义星期选择控件
 */

//{
//    week: [
//        { index: 7, checked: true, text: "周日" },
//        { index: 1, checked: true, text: "周一" },
//        { index: 2, checked: true, text: "周二" },
//        { index: 3, checked: true, text: "周三" },
//        { index: 4, checked: true, text: "周四" },
//        { index: 5, checked: true, text: "周五" },
//        { index: 6, checked: true, text: "周六" }
//    ]
//}

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M2012.UI.Picker.PickerBase;
    M139.namespace("M2012.UI.Picker.Weekday", superClass.extend(
     /**
      *@lends M2012.UI.Picker.Weekday.prototype
      */
    {
        /** 星期几选择组件
        *@constructs M2012.UI.Picker.Weekday
        *@extends M2012.UI.Picker.PickerBase
        *@param {Object} options 初始化参数集
        *@param {Date} options.value 初始化值
        *@param {jQueryDOM} option.container 如果是静态控件，指定一个父容器
        *@example
        */
        initialize: function (option) {
            option = option || {};

            var _this = this;
            _this.model = new Backbone.Model();
            _this.container = option.container || $("body");
            _this.setElement(_this.container);
            _this.event();

            _this.model.set({range: (option.value || _this._default)});

            //return superClass.prototype.initialize.apply(this, arguments);
        },

        name: "M2012.UI.Picker.Weekday",

        _default: [1,2,3,4,5,6,7],
        _idx: [7,1,2,3,4,5,6],
        _chs: "日一二三四五六".split(''),
        _weekmsg: ["每天", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],

        template: _.template([
                        '<ul class="sundaysel">',
                            '<% _.each(week, function(day) { %>',
                                '<li data-day="<%= day.index %>" class="<%= day.checked ? \'on\' : \'\' %>"><a href="javascript:void(0)"><%= day.text %></a></li>',
                            '<% }); %>',
                        '</ul>'].join('')),

        data: function(value, onsuccess) {
            var _this = this;
            var idx = _this._idx.concat(), chs = _this._chs.concat();

            while(idx.length){ chs.push({index:idx.shift(), checked: true, text: "周" + chs.shift()}) }

            $.each(chs, function(i,n){
                n.checked = ($.inArray(n.index, value) > -1)
            });

            return { "week": chs};
        },

        event: function() {
            var _this = this;
            var container = _this.container;
            var model = _this.model;

            model.bind("change:range", function(model, range){
                _this.render(_this.data(range));
            });

            model.on("rended", function(){
                container.find(".sundaysel li").click(function(e) {
                    var bar = $(e.currentTarget); //li
                    var day = bar.data("day");

                    var value = [].concat(model.get("range"));
                    var index = $.inArray(day, value);

                    if (index > -1) {
                        if (value.length == 1) {
                            return; //保留最后一个
                        }

                        value.splice(index, 1);
                    } else {
                        value.push(day);
                    }

                    value.sort();
                    _this.trigger("select", value);
                    model.set({range: value});
                });
            });
        },

        render: function(data) {
            var _this = this;
            _this.container.html(_this.template(data));
            _this.model.trigger("rended");
        },

        getSelection: function() {
            return this.model.get('range');
        }
    }
    ));


    M139.namespace("M2012.UI.Picker.Week", superClass.extend(
     /**
      *@lends M2012.UI.Picker.Week.prototype
      */
    {
        /** 星期几选择组件
        *@constructs M2012.UI.Picker.Week
        *@extends M2012.UI.Picker.PickerBase
        *@param {Object} options 初始化参数集
        *@param {Date} options.value 初始化值
        *@param {jQueryDOM} option.container 如果是静态控件，指定一个父容器
        *@example
        */
        initialize: function (option) {
            option = option || {};

            if (option.value) {
                option.value = $.map(option.value.split(','), function(i){ return Number(i) });
            }

            var _this = this;
            _this.value = option.value || _this._default;
            _this.container = option.container || $("body");
            _this.render();
            _this.event();

            return superClass.prototype.initialize.apply(this, arguments);
        },

        name: "M2012.UI.Picker.Week",

        _default: [1,2,3,4,5,6,7],

        _weekmsg: ["每天", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],

        template: [
                //'<div class="element">',
                    '<div id="disc"></div>',
                    '<div id="weekfield"></div>'
                //,'</div>'
                ].join(''),

        event: function() {
            var _this = this;
            var discField = _this.container.find("#disc");

            _this.weekdayPicker.on("select", function(value){
                _this.value = value;
                discField.text(_this._getWeekRange(value));
            })
        },

        render: function() {
            var _this = this;
            var container = _this.container;

            container.html(_this.template);

            var field = container.find("#weekfield");
            _this.weekdayPicker = new M2012.UI.Picker.Weekday({
                container: field,
                value: _this.value
            });

            var discription = _this._getWeekRange(_this.value);
            container.find("#disc").text(discription);
        },

        getSelection: function() {
            var _this = this;
            var value = _this.value;
            var discription = _this._getWeekRange(value);

            return { "value": value.join(','), "discription": discription };
        },

        /**
         * @inner 转化成可读的日期格式
         * @param {Array} week
         */
        _getWeekRange: function(week) {
        
            var weekStr = week.join('');
            var weekDay = this._weekmsg;
            var result = "1234567";

            if (weekStr == result) { //每天
                result = weekDay[0];

            //表示有三个连续星期几
            } else if (weekStr.length >= 3 && result.indexOf(weekStr) > -1) {
                result = weekDay[week[0]] + "至" + weekDay[week[week.length - 1]];

            } else {
                result = [];
                for (var i = 0; i < week.length; i++) {
                    var index = week[i];
                    result.push(weekDay[index]);
                }
                result = result.join("，");
            }

            return result;
        }
    }
    ));

})(jQuery, _, M139);
﻿/**
*时间选择器，单纯的时间区间以及星期选择，通过方法获取设置的json
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.Settings.View.TimeRangeSelector";
    M139.namespace(namespace, superClass.extend({

        initialize: function (options) {
            if (!options || !options.container) {
                throw namespace + "参数错误！";
            }

            this.container = options.container || $("body");
            this.setElement(this.container);
            this.type = options.type;
            this.model = new Backbone.Model();
            this.initEvents();

            var value = $.extend({}, this._default);
            value = $.extend(value, options.value);

            this.model.set({range: value});

            //sample:
            //options = {
            //    container: $("body"),
            //    type: "modify",
            //    value: { tid: "tid_0_1_1", begin: 8, end: 22, weekday: "1,2,3,4" }
            //}
        },

        _default: {
            "begin": 8,
            "end": 22,
            "weekday": "1,2,3,4,5,6,7"
        },

        initEvents: function () {
            var _this = this;
            var model = _this.model;
            var container = _this.container;

            model.bind("change:range", function(model, range){
                var viewData = _this.data(range);
                _this.render(viewData);
            });

            _this.on("rended", function(){
                var domObj = {
                    timefield: container.find("#timefield"),
                    weekfield: container.find("#weekfield"),
                    btnOk: container.find("#btnOk"),
                    btnCancel: container.find("#btnCancel")
                };

                var range = model.get("range");

                var weekPicker = new M2012.UI.Picker.Week({
                    container: domObj.weekfield,
                    value: range.weekday
                });

                var timePicker = new M2012.UI.Picker.TimeRange({
                    bindInput: domObj.timefield,
                    isArea: true,
                    value: {
                        start: range.begin,
                        end: range.end
                    }
                });

                timePicker.on("show", function(range){
                    if (top.$D) {
                        timePicker.$el.css("z-index", top.$D.getNextZIndex()+1);
                    }
                });

                timePicker.on("select", function(range){
                    domObj.timefield.val(_this._getTime(range.value));
                    domObj.timefield.data("value", range.value)
                });

                domObj.btnOk.click(function(){

                    var weekObj = weekPicker.getSelection();
                    var time = domObj.timefield.data("value");

                    if (typeof(time) !== "object") {
                        time = M139.JSON.tryEval(time); //for ie6,7
                    }

                    var range = model.get("range");
                    range.weekday = weekObj.value;
                    range.begin = time.start;
                    range.end = time.end;
                    range.discription = weekObj.discription + "，" + _this._getTime(range);

                    _this.trigger("submit", { "value": range, "success": function(){
                        container.trigger("click");
                        container.empty();
                    } });
                });

                domObj.btnCancel.click(function(){
                    container.trigger("click");
                    container.empty();
                    _this.trigger("cancel");
                });
            });
        },

        data: function(range) {
            var viewData = {
                "tid": range.tid || "addtion",
                "begin": range.begin,
                "end": range.end, 
                "discription": this._getTime(range),
                "button": {
                    "text": false,
                    "_class": false
                }
            };

            if (this.type === "modify") {
                viewData.button.text = "修 改";
                viewData.button._class = "tips-btn2 mb_10";
            }

            return viewData;
        },

        render: function (viewData) {
            var _this = this;
            _this.container.html(_this.template(viewData));
            _this.trigger("rended");
        },

        _getTime: function(timeRange) {
            var desc = ":00 ~ " + timeRange.end + ":00";
            if (typeof(timeRange.begin) == "undefined") {
                desc = timeRange.start + desc;
            } else {
                desc = timeRange.begin + desc;
            }
            return desc;
        },

        // template //{
        template: _.template([
                '<ul id="j_panel_range_<%= tid %>" class="form nofitimeset-form">',
                    '<li class="formLine">',
                        '<label class="label">时段：</label>',
                        '<div class="element">',
                            '<div><input id="timefield" type="text" class="iText time-iText" data-value=\'{"start":<%= begin %>,"end":<%= end %>}\' value="<%= discription %>" readonly /></div>',
                        '</div>',
                    '</li>',
                    '<li class="formLine">',
                        '<label class="label">日期：</label>',
                        '<div id="weekfield" class="element"></div>',
                    '</li>',
                '</ul>',
                '<div class="<%= button._class ? button._class : \'tips-btn\' %>">',
                    '<a id="btnOk" data-tid="<%= tid %>" class="btnNormal" href="javascript:void(0)"><span><%= button.text ? button.text : \'确 定\' %></span></a> ',
                    '<a id="btnCancel" data-tid="<%= tid %>" class="btnNormal" href="javascript:void(0)"><span>取 消</span></a>',
                '</div>'].join(""))
        //}

    })
    );
})(jQuery, _, M139);
﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace("M2012.Settings.View.NotifyMenu", superClass.extend({
        typeArr: function () {
            if (!top.SiteConfig.mailNotice) {
                var arr = [
                { notifyText: "普通短信", value: 1, hasItem: true, notifyTip: "显示70字", notifyImg: "../../images/module/set/type1.png", img: "type1.png", notifyClass: "" },
                { notifyText: "wap链接", value: 3, hasItem: true, notifyTip: "不支持iPhone", notifyImg: "../../images/module/set/type2.png", img: "type2.png", notifyClass: "" },
                { notifyText: "长短信", value: 4, hasItem: true, notifyTip: "显示350字", notifyImg: "../../images/module/set/type3.png", img: "type3.png", notifyClass: "" },
                { notifyText: "彩信", value: 2, hasItem: true, notifyTip: "支持查看2万字", notifyImg: "../../images/module/set/type4.png", img: "type4.png", notifyClass: "" },
                { notifyText: "免提短信", value: 5, hasItem: true, notifyTip: "直接显示70字", notifyImg: "../../images/module/set/type5.png", img: "type5.png", notifyClass: "" }
            //    { notifyText: "", isLine: true },
            //    { notifyText: "不接收通知", value: 0, hasItem: false }
                //0.关闭通知 1.普通短信  2.彩信 3.wap链接 4.长短信 5.免提短信 9:以“通讯录设置”为准
            ]
            }
            else {
                var arr = [
                { notifyText: "短信到达通知", value: 1, hasItem: true, notifyTip: "显示140字", notifyImg: "../../images/module/set/type3.png", img: "type3.png", notifyClass: "" },
                { notifyText: "短信邮件", value: 4, hasItem: true, notifyTip: "显示350字<br/>收费用户专享", notifyImg: "../../images/module/set/type3.png", img: "type3.png", notifyClass: "" },
                { notifyText: "彩信到达通知", value: 2, hasItem: true, notifyTip: "支持查看2万字", notifyImg: "../../images/module/set/type4.png", img: "type4.png", notifyClass: "" },
                { notifyText: "免提短信", value: 5, hasItem: true, notifyTip: "直接显示短信（最多70字），需手动保存", notifyImg: "../../images/module/set/type5.png", img: "type5.png", notifyClass: "" }
            //    { notifyText: "", isLine: true },
			//	{ notifyText: "不接收通知", value: 0, hasItem: false }
                //0.关闭通知 1.普通短信  2.彩信 3.wap链接 4.短信邮件 5.免提短信 9:以“通讯录设置”为准
            ]
            }
			if(this.bAcceptNotice){
				arr = arr.concat({ notifyText: "", isLine: true },{ notifyText: "不接收通知", value: 0, hasItem: false });
			}
            return arr;
        },
        templete: {
            defaultText: !top.SiteConfig.mailNotice ? "普通短信" : "短信到达通知",
            typeInfo: [],
            previewHtml: _.template([
                        '<div id="notifyDemo" class="tips notifyTypeTips">',
                            '<div class="tips-text">',
                                '<img src="<%= notifyImg %>" width="150" height="194" alt="到达通知的显示效果" />',
                                '<p><%= notifyTip %></p>',
                            '</div>',
                                '<div class="tipsLeft diamond <%= notifyClass %>">',
                                '</div>',
                            '</div>',
                        '</div>'].join(""))
        },

        PROVINCE: {
            GuangDong: 1,
            YunNan: 2
        },

        UserData: (new M2012.MatrixVM()).createUserData(),

        initialize: function (options) {
            var _this = this;
			_this.bAcceptNotice = options.acceptNotice;
            _this.templete.typeInfo = _this.typeArr();
            _this.model = new Backbone.Model();
            _this.container = options.container || $("body");

            if (typeof (options.showClose) === "boolean") {
                _this.model.set({ showClose: options.showClose });
            } else {
                _this.model.set({ showClose: true });
            }

            if (options.root) {
                var infos = _this.templete.typeInfo;
                for (var i = infos.length; i--; ) {
                    if (infos[i].notifyImg) {
                        infos[i].notifyImg = options.root + "/m2012/images/module/set/" + infos[i].img;
                    }
                }
            }

            _this.reduce(_this);

            _this.menuItems = this._createMenuItems();
            _this.initEvents();

            _this.model.bind('change:value', function (model, value) {
                var infos = _this.templete.typeInfo;
                for (var i = infos.length; i--; ) {
                    if (infos[i].value == value) {
                        _this.model.set({
                            text: infos[i].notifyText,
                            value: infos[i].value
                        });
                        _this.menu.setText(infos[i].notifyText);
                        _this.trigger("change", value);
                        break;
                    }
                }
            });

            _this.render();
        },

        render: function () {
            return superClass.prototype.initialize.apply(this, arguments);
        },

        initEvents: function () {
            var _this = this;
            var model = _this.model;

            _this.menu = M2012.UI.DropMenu.create({
                container: _this.container,
                defaultText: _this.templete.defaultText,
                menuItems: _this.menuItems,
                customClass: "notifyTypePop"
            });

            _this.menu.$el.addClass("dropDown-notify");

            _this.menu.on("change", function (item) {
                model.set({
                    text: item.text,
                    value: item.value
                });

                _this.trigger("change", model.get("value"));
            });

            _this.menu.on("subItemCreate", function (item) {
                $(item.menu.el).removeClass();
                $(item.menu.el).html(item.items[0].html);
            });
        },
        selectedValue: function () {
            return this.model.get("value");
        },
        selectedText: function () {
            return this.model.get("text");
        },
        reset: function () {
            var _this = this;
            _this.menu.enable();
            _this.menu.$el.css("color", "")
            _this.model.set({ value: 1 });
        },

        close: function () {
            var _this = this;
            _this.disable();
            _this.model.set({ value: 0 });
        },

        disable: function () {
            this.menu.disable();
            this.menu.$el.css("color", "#999")
        },

        _createMenuItems: function () {
            var _this = this;
            var typeInfo = _this.templete.typeInfo;
            var previewHtml = _this.templete.previewHtml;

            var showClose = _this.model.get("showClose");
            if (!showClose) {
                typeInfo = typeInfo.slice(0, 5);
            }

            var menuItems = [];
            for (var i = 0; i < typeInfo.length; i++) {
                var item = typeInfo[i];
                var subItem = {};
                if (item.isLine) {
                    subItem = { isLine: true };
                } else {
                    subItem = {
                        text: item.notifyText,
                        value: item.value
                    };

                    if (item.hasItem) {
                        var preview = previewHtml(item);
                        subItem = $.extend(subItem, {
                            items: [{
                                html: preview,
                                showHtml: true
                            }]
                        });
                    }
                }
                menuItems.push(subItem);
            }
            return menuItems;
        },

        reduce: function (_this) {

            var _reduceMenu = function () {
                for (var i = _this.templete.typeInfo.length; i--; ) {
                    if (',3,2,5,'.indexOf(_this.templete.typeInfo[i].value) > -1) {
                        _this.templete.typeInfo.splice(i, 1);
                    }
                }
            };

            var provCode = (function () {
                var _prov = false;

                if (_this.UserData) {
                    _prov = _this.UserData.provCode
                }

                if (!_prov) {
                    _prov = (top.$User ? top.$User.getProvCode() : (top.UserData ? top.UserData.provCode : "1")) || "1";
                }

                return _prov;
            })();

            if (_this.PROVINCE.GuangDong != provCode) {
                _this.templete.typeInfo[2].notifyTip = "支持查看2万字，0.3元/条"; 
            }

            if (_this.PROVINCE.YunNan == provCode) {
                _this.templete.typeInfo[2].notifyTip = "赠送100条/月，超过0.3元/条"; 
            }

            if (top.$User) {
                if (top.$User.isNotChinaMobileUser()) {
                    _reduceMenu();
                }
            } else {
                if (',81,82,83,84,'.indexOf(("," + provCode + ",")) > -1) {
                    _reduceMenu();
                    return;
                }
            }

        }


    })
    );

})(jQuery, _, M139);
﻿
(function ($, _, M) {
    var superClass = M.View.ViewBase;
    var namespace = "M2011.UI.Dialog.RecentMail";

    M.namespace(namespace, superClass.extend(
    /**@lends M2011.UI.Dialog.RecentMail.prototype*/
    {
        /** 定义最近收到的邮件对话框
         *@constructs M2012.UI.Dialog.RecentMail
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.template 模板
         *@example
         */
        initialize: function (options) {
            var _this = this;
            _this.model = new Backbone.Model();
            _this.template = options.template;
            _this.$el = options.container;
            _this.btnOk = _this.$el.find(".YesButton");

            _this.initEvent();
            return superClass.prototype.initialize.apply(_this, arguments);
        },

        name: namespace,
        
        template: "",

        /**构建dom函数*/
        render: function () {
            var _this = this;
            var data = _this.model.get("data");

            //去重
            data = M.unique(data, function(a,b){
                return $Email.compare(a.from, b.from);
            });

            var count = 0, buff = [];
            for (var m=data.length, i=0; i<m; i++) {
                if (!data[i].flags.top && data[i].from.length > 0 && data[i].subject.length > 0) {
                    buff.push({
                        "mid": data[i].mid,
                        "from": $T.Html.encode(data[i].from),
                        "subject": $T.Html.encode(data[i].subject)
                    });
                    count++;
                }
                if (count >=20) {
                    break;
                }
            }

            data = { maillist: buff };
            var html = _this.template(data);

            _this.$el.find("#recentmaillist").html(html);
            _this.btnOk.click(function(e){
                _this.onYesClick(e);
            });
            _this.$el.find(".CancelButton").click(function(){
                _this.trigger("cancel");
            });

            (function(el, btn){
                var disabled = "c_666";
                btn.addClass(disabled);
                el.click(function(e){
                    if (e.target.type != "checkbox") {
                        return;
                    }

                    var chks = el.find(":checked");
                    if (chks.length > 0) {
                        btn.removeClass(disabled);
                    } else {
                        btn.addClass(disabled);
                    }
                });
            })(_this.$el, _this.btnOk);

        },

        /** 获取原始数据
         *  注意 1、剔除置顶邮件；2、关闭会话模式
         *@param {Object} options 初始化参数集
         *@example
         */
        requestInitData: function () {
            var This = this;

            top.MS.getMailList(1, 1, 100, "date", "1", function(list){
                if (!list) {
                    parent.FF.close();
                    This.trigger("cancel");
                    parent.FF.alert("加载失败，请稍后重试", { ico: "warn" });
                    return false;
                }

                This.onInitDataLoad(list);
            });
        },

        onInitDataLoad: function (json) {
            if (json) { this.model.set("data", json); }
            this.trigger("initdataload");
        },

        initEvent: function (e) {
            this.on("initdataload", function () {
                this.render();
            }).on("print", function () {
                this.requestInitData();
            }).on("cancel", function(){
                parent.FF.close();
            });
        },

        onYesClick: function (e) {
            var _this = this;
            if (_this.btnOk.hasClass("c_666")) {
                return;
            }

            var mid = {}, mail = _this.model.get("data");

            $.each(mail, function(n,i) {
                mid[i.mid] = i.from;
            });

            mail = mid;

            mid = _this.$el.find(":checked");
            mid = $.makeArray(mid);
            mid = $.map(mid, function(i){
                return mail[i.value];
            });

            mid = $.unique(mid);

            _this.trigger("success", mid);
        }

    }));
})(jQuery, _, M139);
﻿
(function ($, _, M) {
    var superClass = M.View.ViewBase;
    var namespace = "M2011.UI.Dialog.ExceptNotify";

    /**@lends M2012.UI.Dialog.ExceptNotify.prototype*/
    M.namespace(namespace, superClass.extend({

        name: namespace,

        /** 定义最近收到的邮件对话框
         *@constructs M2012.UI.Dialog.ExceptNotify
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.template 模板
         *@example
         */
        initialize: function (options) {
            this.value = options.value;
            this.limit = options.limit || 5;
            this.el = options.container;
            this.template = options.template;
            this.initEvent(options);
            return superClass.prototype.initialize.apply(this, arguments);
        },

        render: function (options) {
            var _this = this;
            var value = _this.value;

            var viewData = $.extend({
                email: value.emaillist[0],
                ranglimit: _this.limit
            }, value);
            
            _this.el.html(_this.template.detail(viewData));
            
            options.btnOk.click(function(){
                _this.actionHandler.onsave(0, _this);
            });

            options.btnCancel.click(function(){
                _this.trigger("cancel");
            });

            _this.trigger("rendered", viewData);
        },

        initEvent: function (options) {
            var _this = this;

            _this.on("print", function () {
                _this.render(options);
            });

            renderHandler = _this.renderHandler;

            _this.on("rendered", function (viewData) {
                renderHandler.showTypeMenu(viewData, _this);
                renderHandler.showRangeAction(viewData, _this);
                renderHandler.showNotifySwitch(viewData, _this);
            });

            _this.on("modifyed", function() {
                renderHandler.showButton(_this);
            });
        },

        renderHandler: {

            /** 显示类型菜单
             *@param {Object} viewData 视图数据
             *@param {this} context 传递this
             */
            showTypeMenu: function(viewData, context) {
                var _parent = context.el;
                var typefield = _parent.find("#typefield");

                var menu = new M2012.Settings.View.NotifyMenu({
                    container: typefield, showClose: false, root: top.getResourceHost()
                });

                menu.on("change", function(value){
                    context.dataHandler.modifytype({
                        "value": value,
                        "success": function(rs) {}
                    }, context);
                });

                if (viewData.notifytype === 0) {
                    viewData.notifytype = 1;
                }

                menu.model.set({value: viewData.notifytype});
            },

            /** 显示是否接收
             *@param {Object} viewData 视图数据
             *@param {this} context 传递this
             */
            showNotifySwitch: function(viewData, context) {
                var _parent = context.el;
                var rdoSwitch = _parent.find("#notifyswitch :radio");

                rdoSwitch.click(function(e){
                    if (e.target.value == "open") {
                        _parent.find(".j_disablefield").show();
                    } else {
                        _parent.find(".j_disablefield").hide();
                    }
                });
            },

            /** 时段表格当前行显示操作项
             *@param {Object} viewData 视图数据
             *@param {this} context 传递this
             */
            showRangeAction: function(viewData, context) {
                var on = "on", cmd = ".j_cmd", flag = "range_row_", ROW = "TR";
                var _this = this;
                var _parent = context.el;
                var rangetable = _parent.find(".setnotifytb");

                rangetable.mouseover(function(e){
                    var tr = _this._parent(e.target, ROW);
                    if (tr) {
                        tr = $(tr);
                        if (!tr.hasClass(on) && (tr.attr("class") || "").indexOf(flag) > -1) {
                            $(tr).addClass(on).find(cmd).show();
                        }
                    }
                });

                rangetable.mouseout(function(e){
                    var tr1 = _this._parent(e.target, ROW);
                    if (tr1 && tr1.tagName === ROW) {
                        if (e.toElement != null) { //e.toElement == null 窗口切换失焦
                            var tr2 = _this._parent(e.toElement, ROW);
                            if (tr2 && tr1 == tr2) {
                                return;
                            }
                        }

                       $(tr1).removeClass(on).find(cmd).hide();
                    }
                });

                rangetable.click(function(e){
                    var link = $(e.target);

                    var cmd = link.data("cmd");
                    if (!cmd) {
                        return;
                    }

                    var tid = link.data("tid");
                    var page = link.data("pageIndex");

                    context.actionHandler["on" + cmd]({
                        "tid": tid, "value": viewData, "page": page, "event": e
                    }, context);

                });
            },

            /** 时段只有一行时，隐藏删除功能
             *@param {this} context 传递this
             */
            showButton: function(context) {
                var dialog = context.$el;
                var value = context.value;
                var range = value.timerange;
                if (range.length < 2) {
                    dialog.find("span.j_cmd").addClass("hide");
                }
            },

            _parent: function (el, tagName) {
                tagName = tagName.toUpperCase();
                var _el = el;
                for(var i=0xFF; i--; ) {
                    if (_el == null || "#document" === _el.nodeName) {
                        return false;
                    } else if (_el.nodeName === tagName) {
                        break;
                    } else {
                        _el = _el.parentNode;
                    }
                }
                return _el;
            }
        },

        actionHandler: {

            /** 时段表格当前行显示操作项
             *@param {Object} args 事件参数
             *@param {this} context 传递this
             */
            onadd: function(args, context) {
                var id = "tr.range_row_addtion";
                var panel = $(context.template.range);
                var dialog = context.el;
                var toolbar = dialog.find(id)

                var rangePicker = new M2012.Settings.View.TimeRangeSelector({
                    container: panel.children()
                });

                rangePicker.$el.find("#btnOk span").text("添 加");

                rangePicker.on("cancel", function(){
                    toolbar.removeClass("hide");
                    panel.remove();
                });

                rangePicker.on("submit", function(_args){
                    window.console && console.log("range changed", _args);

                    var value = _args.value;

                    var tid = context.dataHandler.existrange(value, context);
                    if (tid) {
                        top.FF.alert("已存在同样的时间段，请修改", { delay:2000 });

                        dialog.find(".range_row_" + tid)
                            .css({backgroundColor:"#fe9"})
                            .animate({backgroundColor: "#fff"}, 1000);

                        return;
                    }

                    context.dataHandler.addrange({"value": value, "success": function(result){
                        _args.success();
                        toolbar.removeClass("hide");
                        panel.remove();
                        $.extend(result, value);
                        var viewData = result;

                        $(context.template.row(viewData)).insertAfter(toolbar.prev());

                        dialog.find(".j_cmd").filter(".hide").removeClass("hide");

                        if (result.lockadd) {
                            dialog.find(".range_row_addtion").addClass("hide");
                        }

                    }}, context);
                });

                toolbar.addClass("hide");
                panel.insertAfter(toolbar);
            },

            /** 时段表格当前行显示操作项
             *@param {Object} args 事件参数
             *@param {this} context 传递this
             */
            onremove: function(args, context) {
                var id = "tr.range_row_" + args.tid;
                var dialog = context.el;
                var rangetable = dialog.find(".setnotifytb");
                var toolbar = rangetable.find(id)

                context.dataHandler.removerange({
                    "tid": args.tid,
                    "success": function(rs) {
                        toolbar.fadeOut(666, function(){
                            toolbar.remove();
                        });

                        if (rs.lockdelete) {
                            rangetable.find("span.j_cmd").addClass("hide");
                        }

                        if (rs.showadd) {
                            rangetable.find(".range_row_addtion").removeClass("hide");
                        }
                    }
                }, context);
            },

            /** 展开时段修改面板
             *@param {Object} args 事件参数
             *@param {this} context 传递this
             */
            onmodify: function(args, context) {

                var id = "tr.range_row_" + args.tid;
                var dialog = context.el;
                var toolbar = dialog.find(id)
                var btnAction = toolbar.find(".j_cmd");
                var panel = $(context.template.range);
                var oldValue = context.dataHandler.readrange(args, context);

                var rangePicker = new M2012.Settings.View.TimeRangeSelector({
                    container: panel.children(), value: oldValue
                });

                rangePicker.on("cancel", function(){
                    btnAction.removeClass("hide");
                    panel.remove();
                    context.trigger("modifyed");
                });

                rangePicker.on("submit", function(_args){
                    window.console && console.log("range changed", _args);

                    var value = _args.value;

                    var tid = context.dataHandler.existrange(value, context);
                    if (tid && tid !== args.tid) {
                        top.FF.alert("已存在同样的时间段，请修改", { delay:2000 });

                        dialog.find(".range_row_" + tid)
                            .css({backgroundColor:"#fe9"})
                            .animate({backgroundColor: "#fff"}, 1000);

                        return;
                    }

                    dialog.find("#range_desc_" + args.tid).text(value.discription);
                    _args.success();

                    btnAction.removeClass("hide");
                    panel.remove();

                    context.dataHandler.modifyrange(value, context);
                    context.trigger("modifyed");
                });

                btnAction.addClass("hide");
                panel.insertAfter(toolbar);
            },

            /** 点确定按钮保存操作
             *@param {Object} args 事件参数
             *@param {this} context 传递this
             */
            onsave: function(args, context) {

                var dialog = context.el;
                var value = context.value;

                var opened = dialog.find("#notifyswitch :radio:checked").val() == "open";
                value.enable = opened;

                if (!opened) {
                    context.value.notifytype = 0;
                }

                var supply = (dialog.find(":checkbox").attr("checked") == "checked");
                value.supply = supply;

                context.trigger("success", context, value);
            },

            /** 点取消按钮保存操作
             *@param {Object} args 事件参数
             *@param {this} context 传递this
             */
            oncancel: function(args, context) {
                context.trigger("cancel", context);
            }

        },

        dataHandler: {

            /** 添加新时段
             *@param {Object} args 事件参数
             *@param {this} context 传递this
             */
            addrange: function(args, context) {
                var model = this.model;
                var value = args.value;
                var timerange = context.value.timerange;

                var dh = this;
                var tid = dh._tid(timerange[0].tid);

                var maxrangeid = this._maxId($.map(timerange, function(j){
                    return dh._tid(j.tid).rangeindex;
                }));

                tid = dh._tid(tid.notifyindex, maxrangeid + 1), //notifyindex, rangeindex
                value.tid = tid;
                timerange.push(value);

                window.console && console.log("range added:", value, timerange);

                args.success({ lockadd: timerange.length >= context.limit});
            },

            /** 读取指定时段
             *@param {Object} args 事件参数
             *@param {this} context 传递this
             */
            readrange: function(args, context) {
                var value = {};
                var timerange = context.value.timerange;
                for (var i = 0; i < timerange.length; i++) {
                    if (timerange[i].tid == args.tid) {
                        $.extend(value, timerange[i]);
                        break;
                    }
                }
                return value;
            },

            /** 修改指定时段
             *@param {Object} args 事件参数
             *@param {this} context 传递this
             */
            modifyrange: function(args, context) {
                var timerange = context.value.timerange;
                for (var i = 0; i < timerange.length; i++) {
                    if (timerange[i].tid == args.tid) {
                        $.extend(timerange[i], args)
                        break;
                    }
                }
            },

            /** 删除指定时段
             *@param {Object} args 事件参数
             *@param {this} context 传递this
             */
            removerange: function(args, context) {
                var timerange = context.value.timerange;
                for (var i = timerange.length; i--; ) {
                    if (timerange[i].tid == args.tid) {
                        timerange.splice(i, 1);
                        break;
                    }
                }
                args.success({ lockdelete: timerange.length < 2, showadd: timerange.length <= context.limit });
            },

            /** 是否存在给定时段
             *@param {Object} args 事件参数
             *@param {this} context 传递this
             */
            existrange: function(args, context) {
                var timerange = context.value.timerange;
                for (var i = 0; i < timerange.length; i++) {
                    if (this._comparerange(timerange[i], args)) {
                        return timerange[i].tid;
                        break;
                    }
                }
                return false;
            },

            /** 修改提醒方式
             *@param {Object} args 事件参数
             *@param {this} context 传递this
             */
            modifytype: function(args, context) {
                context.value.notifytype = args.value;
                args.success({ "success": true, "value": context.value });
            },

            _comparerange: function(range1, range2) {
                return range1.begin === range2.begin && range1.end === range2.end && range1.weekday === range2.weekday;
            },

            _tid: function(tid) {
                if (arguments.length > 1) {
                    return (function(notifyindex, rangeindex){
                        return ["tid", 2, notifyindex, rangeindex].join("_");
                    }).apply(this, arguments);
                }

                tid = tid.split("_");
                return { "fromtype": parseInt(tid[1]), "notifyindex": parseInt(tid[2]), "rangeindex": parseInt(tid[3]) };
            },

            _maxId: function(array) {
                return array.sort(function(a,b){return b-a})[0];
            }
        }

    }));

})(jQuery, _, M139);

