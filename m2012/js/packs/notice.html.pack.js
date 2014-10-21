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

/**
 * 通过模板绑定生成列表型界面，实现类似于asp.net的数据绑定，模板列机制。
 * 调用方式非常简单，一般只需要两行代码，只需要模板字符串和数据源就可以工作
 * 模板语法也非常简单，只有4个关键字
 * <!--item start--> 列表开始标记
 * <!--item end--> 列表结束标记
 * $变量名：输出数据源中当前行中的字段值到当前位置
 * @函数名：通过自定义函数生成html片段，输出到当前位置，自定义函数在this.Functions中定义
 * 
 * 行绑定事件：
 * ItemDataBound在生成每行数据的html之后会触发，可以对生成的html做二次处理，完成一些更复杂的逻辑
 * 
 * 注意所有的更改都要在DataBind之前完成
 * 
 * @example
 * repeater有两种使用方式：1.指定dom元素，生成后直接渲染dom 2.只传入模板字符串和数据源，返回生成的html代码，不操作dom
 * 方式一:
 * 第1步，在dom元素中声明模板
 * <div id="repeater1">
    	<table>
    		<tr><td>标题</td><td>发件人</td><td>发送日期</td></tr>
			<!--item start-->
			<tr name="item"><td><a href="#">$index</a>-@getTitle(subject,from)</td><td>$from</td><td>$sentDate</td></tr>
			<!--item end-->
    	</table>
    </div>
    第2步，获取数据源（json数据格式）
    var dataSource=[{
'id':'43:1tbiKwH1mEKNltb5qAAAsZ',
'from':'"铁喜光" <tiexg@139.com>',
'subject':'邮件主题',
'sentDate':new Date()
}]);
第3步，实例化repeater，调用DataBind方法
 var rp=new Repeater(document.getElementById("repeater1")); //传入dom元素，dom元素即做为容器又做为模板字符串
 rp.DataBind(dataSource); //数据源绑定后即直接生成dom
 
 方式二:(适用于不在html页面中声明模板的情况)
不同的只有第3步
var templateStr=document.getElementById("repeater1").innerHTML;
var rp=new Repeater(templateStr);//传入模板字符
var htmlStr=rp.DataBind(dataSource); //生成字符串，不操作dom
 
 *
 */

function Repeater(container,options){	
	this.HtmlTemplate=null;
	this.HeaderTemplate=null;
	this.FooterTemplate=null;
	this.ItemTemplate; 
	this.EmptyTemplate="暂无数据"
	this.SeparateTemplate;
	this.Functions=null;
	this.DataSource=null;
	this.ItemContainer;
	this.ItemDataBound=null;
	this.RenderMode=0;	//0，同步渲染，界面一次性组装，1.异步渲染，50毫秒生成一行
	this.RenderCallback=null;	//异步渲染模式用到的，行渲染回调函数
	this.Element=null;	
	this.Instance=null;
	this.DataRow=null;	//当前行数据
	
	var self=this; 
	if (typeof(container) != undefined) {
		if (typeof(container) == "string") {
			this.HtmlTemplate = container;	//直接传入html模板字符串
		}
		else {
			this.Element = container;
		}
		//n=findChild(obj,"name","item");
	}
	function getOptions(){	//初始化参数
			for(elem in options){
				if(elem){
					this[elem]=options[elem];
				}
			}
	}
	getOptions();
		
	this.DataBind = function(datasource) {
		if(!datasource || datasource.length==0){
			this.Render([]);
			return ;
		}
		var self=this;
	    this.DataSource=datasource;
	    if(this.DataSource.constructor!=Array){
	    	this.DataSource=[this.DataSource];//如果是object,转化为数组
	    }
	    if (this.HtmlTemplate == null) {
	        this.HtmlTemplate = this.Element.innerHTML;
	    }
	    //this.ItemTemplate=this.HtmlTemplate.match(/(<!--item\s+start-->)([\r\n\w\W]+)(<!--item\s+end-->)/ig)[0];
	    var re = /(<!--item\s+start-->)([\r\n\w\W]+)(<!--item\s+end-->)/i;
	    //re.exec(this.HtmlTemplate);
	    var match = this.HtmlTemplate.match(re);
	    this.ItemTemplateOrign = match[0];
	    this.ItemTemplate = match[2];

	    if(this.HtmlTemplate.indexOf("section")>=0){
	    	var sectionMatch=this.HtmlTemplate.match(/(<!--section start-->)([\w\W]+?)(<!--item start-->)([\w\W]+?)(<!--item end-->)([\w\W]+?)(<!--section end-->)/i);
	    	this.sectionStart=sectionMatch[2];
	    	this.sectionEnd=sectionMatch[6];

	    	//this.sectionStart=
	    }
	    
	    
	    reg1 = /\$[\w\.]+\s?/ig; //替换变量的正则
	    reg2 = /\@(\w+)\s?(\((.*?)\))?/ig; //替换函数的正则
	    //reg2 = /\@(\w+)\s?\((.*?)\)/ig; //替换函数的正则
	    var result = new Array(); //每一行的html会push到result数组中
	    this.prevSectionName=""; //前一分组名称
	    for (var i = 0; i < this.DataSource.length; i++) {
	        var dataRow = this.DataSource[i];
	        dataRow["index"] = i;//追加索引
	        this.DataRow = dataRow; //设置当前行数据
	        var row = this.ItemTemplate;

	        row = row.replace(reg2, function($0, $1, $2,$3) { //替换函数
	            var name = $1.trim();
	            var paramList =[];
	            if($3){ paramList= $3.split(",");} //非空检测，如果有参数
	           
	            var param = new Array();
	            for (var i = 0; i < paramList.length; i++) {
	                param.push(dataRow[paramList[i]]);
	            }
	            if (self.Functions[name]) {
	                //return self.Functions[name](param);
	                var context = self;
	                if (self.Instance) {
	                    self.Instance.DataRow = dataRow;
	                    context = self.Instance;
	                }
	                return self.Functions[name].apply(context, param);

	            }


	        });
	        row = row.replace(reg1, function($0) { //替换变量
	            m = $0.substr(1).trim();
				if(dataRow[m]!=undefined){
					//一级变量
					return dataRow[m]; 
				}else{
					if(m.indexOf(".")>=0){// //多级变量
						var arr=m.split(".");
						var temp=dataRow;//多级变量暂存器
						for(var i=0;i<arr.length;i++){
							if(temp[arr[i]]!=undefined){
								temp=temp[arr[i]]
							}else{//变量不存在
								return "";
							}
							
						}
						return temp;
					}
					return "";
				}
	            

	        });
	        
	        var sectionName="";
	       	if(self.Functions && self.Functions["getSectionName"]){
	       		sectionName=self.Functions["getSectionName"].call(self, self.DataRow );
	       	}
	       	
       		if(this.sectionStart && sectionName!=this.prevSectionName){//分组名改变，生成新分组
				if(i==0){//第一行记录
					this.prevSectionName=sectionName;
					this.firstSectionName=sectionName;//暂存第一个sections名称，最后整体替换时用
				}else{
					result.push(this.sectionEnd); //因为htmltemplate一开始已经包含了第一个section的start标记，所以每行总是先追加end+内容+start
					result.push(this.sectionStart.replace("@getSectionName",sectionName));
					this.prevSectionName=sectionName;
				}
				
      			
       		}
	       	
	        if(this.HtmlTemplate.indexOf("<!--display")>=0){//模板中包含显示标记才执行，避免多余的执行
	        	row=row.replace(/(<!--display\s+start-->)(\W+<\w+[^>]+display:none[\w\W]+?)(<!--display end-->)/ig,"");//移除不显示的html
	        }
				
	        var itemArgs = {	//事件参数
	            index: i,
	            sectionName:sectionName,
	            data: dataRow,
	            html: row
	        };
	        if (this.ItemDataBound) {	//是否设置了行绑定事件
	            var itemRet = this.ItemDataBound(itemArgs);
	            if (itemRet) {
	                row = itemRet;
	            }
	        }
	        result.push(row);
	        
	       	
	    }
	    
	    return this.Render(result);
	};

	/***
	 * 将行数据join成一个字符串，替换item模板,header模板,footer模板.
	 */
	this.Render = function(result) {
        var str = result.join("");
        //因为jscript 5.5以上 String.prototype.replace(pattern, replacement)
        //如果pattern是正则表达式, replacement参数中的$&表示表达式中匹配的字符串
        //例: replace(/\d/g, "$&cm") 就表示将每一个数字追加上cm。
        //这样下面的对html的replace，就会在str出现 $& 的位置插入完整的ItemTemplateOrign
        //所以需要做$的转义 $$ 表示一个 $，测试时可以发邮件标题为 $<b>$ test</b> 来重现
        if ('0'.replace('0',"$&")==='0'){
            str = str.replace(/\$/ig,"$$$$");
        }

        var html = "";
        if (this.HtmlTemplate) {
        	if(this.firstSectionName){
        		html=this.HtmlTemplate.replace("@getSectionName",this.firstSectionName);
        	}else{
        		html=this.HtmlTemplate;
        	}
            html = html.replace(this.ItemTemplateOrign, str);
        } else {
            //html = this.ItemTemplate.replace(this.ItemTemplateOrign, str);
        }
        if (this.HeaderTemplate)
            html = this.HeaderTemplate + html;
        if (this.FooterTemplate) {
            html = html + this.FooterTemplate;
        }
        if(html==""){
			html=this.EmptyTemplate;
		
        }
        
        if(this.Element){
         	this.Element.innerHTML = html;
         	this.Element.style.display="";
        }

        return html;
	    
	}		
}
String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    }



﻿/**创建浮动的popup容器
 * icon支持的样式 i_ok对号，i_warn叹号 
 * @example
 * 			
 * var popup=M139.UI.Popup.create({
	target:document.getElementById("btn_popup"),
	icon:"i_ok",
	buttons:[{text:"确定",cssClass:"btnRed",click:function(){alert("ok");popup.close();}},
		{text:"取消",click:function(){alert("cancel");popup.close();}}
	],
	content:"hello"
	}
	);

	popup.render();
 */
M139.core.namespace("M139.UI.Popup", Backbone.View.extend({
    initialize: function (options) {

        this.target = options.target;//目标元素
        this.icon = null; //图标的样式名，
        this.buttons = null;//按钮集合，如[{text:"确定",click:function(){},class:"cssName"}]
        this.contentElement = null;//无素的el

        options.mainClass = options.mainClass || "tips delmailTips"; //顶层容器的样式
        options.containerClass = options.containerClass || "norTips"; //容器的样式
        options.contentClass = options.contentClass || "norTipsContent"; //内容的样式
        
        this.width = options.width;
        
        this.options = options;
    },
    render: function () {
        var self = this;
        var options = this.options;
        if (this.contentElement != null) { //避免重复调用
            return;
        }
        function getOffset() {
            var offset = $(self.target).offset();
            //console.log(offset);
            //console.log($(self.target).position());
            /*
			$(self.target).parents().each(function(){
				var t=$(this);
				if(t.css("position")=="absolute"){
					offset.top-=t.offset().top;
					offset.left-=t.offset().left;
				}
			});*/
            return offset;
        }
        function getHeight() {
            return self.height || $(self.contentElement).height()
        }

        function getWidth() {
            if (($.browser.msie && $.browser.version < 7) && !self.width) {
                self.width = 220;//IE6加默认宽度
            }
            return self.width || $(self.contentElement).width()
        }

        function getPosition(arrow) { //根据taget获取坐标
            var pos = getOffset();
            var height = $(self.target).height();

            try {
                $(self.contentElement).width(getWidth());//宽度自适应
            } catch (ex) { //避免iframe跨域报错

            }
            var left = pos.left;
            var x = parseInt(getOffset().left) + parseInt(getWidth());
            var w;
            if (x > $(window).width()) { //x座标超出屏幕区域,从右向左
                left = $(self.target).offset().left + $(self.target).width() - getWidth()-5; //重置内容栏的x坐标

                w = $(self.contentElement).width() - $(self.target).width() / 2 ;

            } else {
                w = $(self.target).width() / 2;
            }

            w -= 3;

            $(self.contentElement).find("[name=popup_arrow]").css("left", w + "px"); //重设箭头的x坐标		

            //return "top:"+(pos.top+height+10)+"px;left:"+(pos.left)+"px;width:235px;";	
            if (arrow == "down") { //向上指的箭头 down
                self.contentElement.css({
                    top: (pos.top + height + 10) + "px",
                    left: left + "px"
                });
            } else {//向下指的箭头 up
                /*self.contentElement.css({top:(pos.top+height-10-getHeight()-$(self.target).height())+"px",
					left:left+"px"});*/
                var t = ($(self.target).offset().top - getHeight()) - 10;

                self.contentElement.css({
                    top: t + "px",
                    left: left + "px"
                });
            }

        }

        function getArrowDirection() {//根据taget获取小箭头的方向
            // warning：此处需要先执行getOffset().top
            // ie11（默认ie9模式）下，首次执行getOffset()获取不到值
            console.log(getOffset())
            var y = getOffset().top + getHeight();
            if (y > $(window).height()) { //y座标超出屏幕区域

                //return "tipsBottom";
                return "up";
            } else {
                //return "tipsTop";
                return "down";
            }


        }
        function getIcon() { //获取图标的html
            if (self.options && self.options.icon) {
                return '<span class="norTipsIco"><i class="' + self.options.icon + '"></i></span>';
            } else {
                return "";
            }

        }
        function getButtons() {//获取按钮的html
            var b = options.buttons;
            if (b) {
                var result = ['<div name="buttons" class="delmailTipsBtn">'];
                for (var i = 0; i < b.length; i++) {
                    var className = b[i]["cssClass"] ? b[i]["cssClass"] : "btnNormal";
                    result = result.concat(['<a href="javascript:void(0)" class="', className, '"><span>', b[i]["text"], '</span></a>']);

                }
                result.push("</div>");
                return result.join("");
            } else {
                return "";
            }
            //return '<div class="delmailTipsBtn"><a href="javascript:void(0)" class="btnRed"><span>删 除</span></a><a href="javascript:void(0)" class="btnNormal"><span>取 消</span></a></div>';
        }
        function getArrowPosition() {//获取小箭头x轴的坐标
            //var w=$(self.target).width();
            //return "left:"+(w/2)+"px";
        }

        var html = ['<div id="popup_', options.name, '" style="z-index:1001" class="',options.mainClass,'"> <a href="javascript:" class="delmailTipsClose" name="popup_close">',
            options.noClose ? '' : '<i class="i_u_close"></i>',
   '</a><div class="tips-text">',
     '<div class="', options.containerClass,
     '" style="', options.height ? "height:" + options.height : "px",
     '"> ', getIcon(),
       '<div class="', options.contentClass, '">',
       options.content,
       '</div>',
     '</div>',
     getButtons(),
   '</div>',
   '<div class="diamond" name="popup_arrow" style="', getArrowPosition(), '"></div>',
 '</div>'].join("");

        this.contentElement = $(html); //先创建dom，是获取dom的引用
        $(document.body).append(this.contentElement);
        //this.contentElement=$("#"+elementId);
        var direction = options.direction || getArrowDirection();
        var arrowClass = direction == "up" ? "tipsBottom" : "tipsTop";

        this.contentElement.find("[name=popup_arrow]").addClass(arrowClass);//必须要生成dom计算高度后才能知道箭头方向
        this.contentElement.find("[name=popup_close]").click(function (e) { //关闭按钮点击事件
            //加一个关闭按钮的回调，要怨就怨产品去
            if (options && options.closeClick) {
                if (typeof options.closeClick == 'function')
                    options.closeClick();
            }

            self.trigger("close", {event: e, source: "popup_close"});
            self.close();
        });
        getPosition(direction);//内容容器及箭头重定位
        $(this.options.buttons).each(function (idx) { //底部按钮集点击事件
            //var click=this["click"];
            self.contentElement.find("div[name=buttons] a").eq(idx).click(this["click"]);
        });
        if (options.autoHide) {
            $D.bindAutoHide({
                action: "click",
                stopEvent: true,
                element: this.contentElement.get(0),
                callback: function (data) {
                    self.trigger("close", data);
                    if (!data.cancel) {
                        self.close();
                    }
                }
            });
        }

    },
    close: function () { //关闭popup
        try {
            M139.Dom.fixIEFocus();
        } catch (ex) { }
        if (this.contentElement) {
            this.contentElement.remove();
        }
        this.contentElement = null;//释放指针
    }
}));

jQuery.extend(M139.UI.Popup,{ //扩展原型增加工厂方法
	popupList:{},
	create:function(options){ //工厂模式＋单例，创建一个popup实例
		var name=options.name || "tips"+Math.random();
		options.name = name;
		if(!this.popupList[name] || this.popupList[name].contentElement==null){ //是否创建过，每个name只创建一个实例
			this.popupList[name]=new M139.UI.Popup(options);
			this.currentPopup=this.popupList[name];
		}
		return this.popupList[name];
	},
	close:function(name){
		var instance=this.currentPopup;
		if(name){
			instance=this.popupList[name];
		}
        if(instance){
		   instance.close();
        }

	}
	  
});

var TabPageModel = Backbone.Model.extend({
	/**
	 * 
	 */
    initialize: function(options){
    	//console.debug(options)
		if(options){
		
			this.container=options.container;
			//this.container=c;
			//alert("hello");
			
			this.toolbar=document.createElement("div");
			this.toolbar.id="main_toolbar";
			$(this.toolbar).addClass('bgMargin');
			this.toolbar.style.display="none";
			this.container.appendChild(this.toolbar);
		}
	},
    moduleConfig :{	//模块配置，用于工厂模式创建相应的模块
    //welcome:{moduleClass:window.Welcome,groupType:1},//欢迎页
    simpleframe: { model: "SimpleIframeModel", view:"SimpleIframeView" }, //大小通吃的框架页
    readmail: { model: "ReadModel", view:"ReadView"  }, //读邮件
    mailbox: { model: "MailboxModel", view:"MailboxView" }, //收件箱
    compose: { model: "ComposeModel", view:"ComposeView"} //写邮件
	},
    pages: {}, //标签页集合，用于遍历
	TabpageModel:[],	//模块列表
	moduleCount:0,
	prevModule:null,//上一模块
	defaults:{  //默认数据
	    currentModule:null,//当前模块
	    container:null,
	    moduleConfig:{},//模块配置
	    prevModule:null,//上一个模块
		maxTab: 5,//最大限制5个固定标签
		maxTabsNum: 25, //所有标签最大值为25个，打开第26个标签时关闭第25个
		myapptabs: ['addr', 'calendar', 'googSubscription'], //固定标签取消时显示在特色应用
		initTabsData: ['welcome', 'mailbox_1', 'addr', 'calendar', 'diskDev', 'googSubscription'], //移动用户默认固定标签(首页， 邮件， 通讯录，日历， 彩云网盘， 云邮局），不可关闭
		initInternetUserTabsData: ['mailbox_1', 'addr', 'diskDev', 'googSubscription'], //非移动用户默认固定标签(邮件， 通讯录，彩云网盘， 云邮局），不可关闭
		channelState:{},
		selected: []
	},
	topFixTabObj: {
	    'welcome': '首页',
	    'mailbox_1': '邮件',
	    'addr': '通讯录',
	    'calendar': '日历',
	    'diskDev': '彩云网盘',
	    'googSubscription': '云邮局'
	},
	
	/**
	 * 创建module,module是实体数据{name:"模块名",
	 * isload:false //是否加载过
	 * type:"mailbox" //表示模块类型，如mailbox,welcome,readmail
	 * title:"" 表示模块标题
	 * element:null 模块容器dom
	 */
	createModule:function (module){
	    if (module.mutiple) { // 多实例
	        module.orignName = module.name;
	        var key = Math.random();
	        if (module.data && module.data.key) {
	            key = module.data.key;
	        }
	        module.name = module.name + "_" + key;
	    }
			//module.type=module.name;
		if(!module.group){  module.group=module.name;};
		if(!module.title){module.title=module.name;};
		
		var existModule = this.getModule(module.name);
		if(existModule){//已存在则直接返回
			
			//  add by tkh 已存在覆盖  module.data.inputData 的属性后再返回 
			try{
				if(existModule.data.inputData){
					_.extend(existModule.data.inputData, module.data.inputData);
				}
			}catch(e){
				console.log('Function:createModule 覆盖inputData属性时报错。');
			}
			
		    return existModule;
		}
		
		if(!module.data){
			module.data=new Object();
		}

		//从模块配置表获取模块处理类
		//module.model=this.moduleConfig["model"];	
		//module.view=this.moduleConfig["view"];
		
		//为模块创建div容器
		var divContent = document.createElement("div");
		if (module["deactive"]) {
		    divContent.innerHTML = "";
		} else {
		    divContent.className = "gload";
		    divContent.innerHTML = "<span class='gloadbg'></span>";
		}

		//divContent.style.display="none";
		this.container.appendChild(divContent);
		

		module.element = divContent;	//模块的容器元素,主要方便做切换显示隐藏
		module.view.el = divContent; //设置当前view的el
		
		
		this.pages[module.name]=module;//加入模块队列
		//this.createTab(module.name);
		return module;
	},
	//将模块从内存中清除
	deleteModule:function(moduleName){
		var m=this.pages[moduleName];
		//m.element.parentNode.removeChild(m.element); //移除此元素 ，对于收件箱会出状况，先留着@_@
	    delete this.pages[moduleName];
	},
	existModule:function(name){
		if(this.getModule(name)){
			return true;
		}else{
			return false;
		}
	},
	//得到模块
	getModule: function(module){
		if (typeof(module) == "string") {
			return this.pages[module];
		}else{
			return this.pages[module.name];
		}
		
	},
	getCurrent: function () {
	    var name = this.get("currentModule");
	    if (name) {
	        return this.getModule(name);
	    } else {
	        return null;
	    }
	},
	/**
	 * 显示模块，如果不存在则创建
	 */
	showModule:function(moduleName){
		var module=this.getModule(moduleName);
		if(!module){
		    module = this.getModule("welcome"); //容错
		}
	    if(this.prevModule!=null && this.prevModule!=module){
    
		    this.prevModule.element.style.display="none";    //隐藏上一个模块
		}
		module.element.style.display="";
		module.view.el=module.element;//设置当前view的el
	    //获取模块正文区域
		if (module.view && module.view.render) {
		    var isRendered = module.isRendered ? true : false;//当前模块是否已经显示过
            
			var result = module.view.render(isRendered); //执行当前模块的render
			module.isRendered=true;//表示已显示过

		}
		//获取工具栏，工具栏是所有标签页共用的
		if (module.view && module.view.getToolbar) {
			if(module.group!=this.prevModule.group){ //非常重要：如果是同一分组的不需要重新生成toolbar，避免页面刷新，避免递归导致的死循环
				var tb=module.view.getToolbar();
				if(typeof(tb)=="string"){
					this.toolbar.innerHTML=tb;
				}else if(this.toolbar.childNodes.length==0){ //如果生成过，避免重复生成
					this.toolbar.appendChild(tb);
				}
				
				this.toolbar.style.display="";
			}
			
		}else{
			this.toolbar.style.display="none";
		}
		
		
		this.prevModule=module;
		return module;
	},
	
	/** 获取初始化固定标签 */
	getInitTabsData:function(){
		return $User.isChinaMobileUser() ? this.get('initTabsData') : this.get('initInternetUserTabsData');
	},
	
	/** 设置固定标签 */
	setFixedTabsData:function(options,callback){ //保存值只能是string类型
		$App.setCustomAttrs('fixedtabs', options, callback);
	},
	
	/** 获取固定标签 */
	getFixedTabsData:function(){ //这里需要判断是否设置过,主要获取时间问题，可能数据还未加载
		var fixedtabs = null;
		/*if(this.hasSetFixedTabs()){
			var fixedtabs = $App.getCustomAttrs('fixedtabs');
			fixedtabs = fixedtabs.split(",");
		}else{*/
			fixedtabs = this.getInitTabsData();
		// }
		return fixedtabs;
	},
	
	/** 标记设置过固定标签 */
	markSetFixedTabs:function(callback){
		if(!this.hasSetFixedTabs()){
			$App.setCustomAttrs('hasSetFixedTabs', "1", callback);
		}
	},
	saveChannelState: function (channelName,name) {
	     
	    var channelState = this.get("channelState");
	    if (!channelName || channelName == "groupMail") {//群邮件特殊处理
	        channelName = "mail";
	    }
	    channelState[channelName] = { current: name };
	},
	
	/** 是否设置过固定标签 */
	hasSetFixedTabs:function(){
		return $App.getCustomAttrs('hasSetFixedTabs');
	}
	
});
﻿TabPageView =Backbone.View.extend({
    initialize: function(options){
        var model=new TabPageModel(options);
        this.model=model;
        this.el=options.container;
        var self = this;
        model.on("change:currentModule", function (model, val, group) {
            if (val != null) { //为了触发onchange，先设为null再设为null再设为目标值，所以会触发两次
                var currentModule = val;      //找到当前模块，执行当前模块的render
                try {
                    this.showModule(currentModule);
                    self.activeTab(currentModule);
                    self.renderChannel(currentModule);
                    // 控制标签管理菜单显示隐藏
                    if ($App.getView('tabpage').tab.count > 5) {
                        $('#tabsMenuIco').show();
                    } else {
                        $('#tabsMenuIco').hide();
                    }
                    // 【云邮寄模块】需要隐藏下拉三角、语音输入
                    $App.getView('top').setSearchBox(currentModule);
                    // 切换模块时改变搜索框的默认提示语
                    $App.getView('top').switchSearchBoxTips();
                    // 除欢迎页和邮件列表，其他模块的高度有调整，需要触发iframe变化
                    if ($('#' + currentModule).length) {
                        $('#' + currentModule).resize();
                    } else if (typeof group == 'string') {
                        $('#' + group).resize()
                    }

                    /*
                     * 子模块支持透明皮肤
                     */
                    var moduleName = $App.getCurrentTab().name;
                    var module = {
                        'addr': true,
                        'calendar': true,
                        'diskDev': true,
                        'googSubscription': true
                    }
                    var allowMailbox = function (name) {
                        var layout = $App.getMailboxView().model.get('layout');
                        return (name === 'mailbox_1' || name.indexOf('mailsub_') > -1) && layout === 'list';
                    }

                    // 欢迎页、收件箱透明化处理
                    // 欢迎页透明化处理需要2步：1-容器div_main背景透明化；2-iframe内引用皮肤样式
                    if (moduleName === 'welcome' || allowMailbox(moduleName)) {
                        $('#div_main').addClass('TransparentBg');
                    } else {
                        $('#div_main').removeClass('TransparentBg');
                    }

                    // 子模块透明化处理
                    // 1-移除容器div_main背景色；2-iframe内引用皮肤样式；3-调整左样式边栏（云邮局除外，因为云邮局iframe的高度没有变化）
                    if (module[moduleName]) {
                        $('#div_main').addClass('mainIframeBg_noBg');

                        if (moduleName !== 'googSubscription') {
                            $('#skinBgSub').addClass('skin_not');
                        } else {
                            $('#skinBgSub').removeClass('skin_not');
                        }
                    } else {
                        $('#div_main').removeClass('mainIframeBg_noBg');
                        $('#skinBgSub').removeClass('skin_not');
                    }

                    $App.onResize();
                } catch (ex) {
                    console.error(ex.message);
                }
                
                this.lastModule = currentModule;
                $App.closeWriteOkPage();
            }

        });
	
        this.tab=new TabLabel(document.getElementById("divTab"),this);
        this.tab.call = [this.onTabDelete, this.onTabActive, this.onTabClose];

        this.watchScrollbar();
	
    },
    el:null,//声明自己的容器
    template: "",
    orignTabs:null,
    events: {
        // "click .itemTitle":"changeTitle"
    },
    render:function (){
        var self=this;
    
        var currentModule = this.model.get("currentModule");
        if (currentModule) {
            this.activeTab(currentModule);
        }
    
   
    },
    setTitle:function(title,moduleName){
        //title=title.encode();
        if(!moduleName){
            moduleName=this.model.get("currentModule");
        }
        this.tab.title(moduleName,title);
        this.model.getModule(moduleName).title=title;
	
    },
    getVisibleCount: function () {
        return $("#divTab ul").find("li[tabid]:visible").length;
    },
    renderCloseAllButton: function () {
        var self = this;

	
    },

    /** 标签管理按钮 */
    renderMenuListButton:function(){
        var self = this;
        if($("#tabsMenuIco")[0]){
		
            return;
        }
        //setTimeout(function () {//异步执行
        $("#divTab ul").append('<li id="tabsMenuIco" class="noAll" tabindex="0"><a href="javascript:;" class="closeAll" title="点击查看更多"></a></li>');
        //},0);
    },
    //激活tab,会重复执行，以后优化
    //激活tab,会重复执行，以后优化
    activeTab: function (moduleName) {
        //alert("active:"+moduleName);
        if (this.tab.exist(moduleName)) {
            this.tab.active(moduleName);
        } else {	//如果tab不存在则创建
            this.createTab(moduleName);
        }
        try {
            $App.trigger("showTab", this.model.getModule(moduleName));
        } catch (ex) {
            //避免showtab事件中有异常，影响整个标签页切换
        }

    },
    replace:function(tabOld,tabNew){
        this.tab.replace(tabOld, tabNew);
    },
    //关闭指定标签页
    close:function(tabName){
        if(!tabName){
            tabName=this.model.get("currentModule");
        }
        this.tab.close(tabName);
    },
    //关闭全部标签页
    closeAllTab:function(){
        for (elem in this.model.pages) {
            if (elem != "welcome") {
                this.close(elem);
            }
        }
    },
    resize:function(){
        this.tab.size();
    },
    fixFlashRemove: function (tabName) {
        // 控制标签显示隐藏
        if ($.browser.msie && (tabName.indexOf("compose") >= 0 || tabName == "account"
                   || tabName == "mms" || tabName == "postcard") || tabName == "greetingcard" || tabName=="activityInvite"
                   || tabName == "quicklyShare" || tabName == "diskDev") { //特殊处理销毁flash时引发的异常__flash__removeCallback
            var module = this.model.getModule(tabName);
            if (module) {
                var elem = module.element;
                if($(elem).find("iframe")[0]){ //有些iframe还未打开
                    var flash = $("object", $(elem).find("iframe")[0].contentWindow.document);
                    if (flash.attr("classid") == "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000") {
                        flash.remove();
                    }
                }
            }
        
        }
    },
    //关闭当前标签页时触发的事件
    onCloseTab:function(tabName){
        var module = this.model.getModule(tabName);
        if (module) {
            this.fixFlashRemove(tabName);
            var elem = module.element;
            this.model.deleteModule(tabName);
            var iframe = $(elem).find("iframe");
            if (iframe.length > 0) {//释放iframe内存
                var frm = iframe.get(0);
                
                if (tabName.indexOf("compose_") >= 0) {
                    var childFrm = $("iframe", frm.contentWindow.document);
                    $(childFrm).each(function (i,n) {
                        n.src="about:blank";
                        $(n).remove();
                    });
                    
                }
                /*try {
                    frm.contentWindow.document.write('');
                    frm.contentWindow.document.clear();
                } catch (e) { };*/
                frm.src = "about:blank";
                frm.parentNode.removeChild(frm);
            }
            $(elem).remove(); //关闭标签时，清空dom内容回收内存
 
        
        

        }
	
        //    this.renderCloseAllButton();
        //this.renderMenuListButton(); //关闭时不用再调用了，因为是固定显示的
	
        /*var module;
            if(moduleName){
                module=this.modules[moduleName];
            }else{
                module=this.currentModule;
            }
            
            module.close=true;
            module.element.style.display="none";
            if (module.group != this.prevModule.group) {
                if(module==MM.currentModule){	//关闭的模块当前处于激活状态
                    //this.showModule(this.prevModule.name);
                }
                
            }
            return true;*/
    },
    clearTabCache:function(tabName){
        for (elem in this.model.pages) {
            var current = this.model.pages[elem];
            if (current.name.indexOf(tabName) >= 0) {
                current.isRendered = false;
            }
        }
    },
    createOrignTabs: function (orignTabs, view, isHeaderTab) {
        for (var i = 0; i < orignTabs.length; i++) {
            var key = orignTabs[i];
            if (key == "mailbox_1") {
                this.model.createModule({ view: $App.getView("mailbox"), name: "mailbox_1", title: "收件箱", group: "mailbox", deactive: true });
                this.createTab(key, true, isHeaderTab);
            } else {
                var link = window.LinkConfig[key];
                var obj = { name: key, view: view, title: link["title"], group: link["group"], mutiple: link["mutiple"], deactive: true }
                this.model.createModule(obj);
                this.createTab(key, true, isHeaderTab);
            }
        }

    },
    watchScrollbar: function () {
        if (($.browser.msie && $.browser.version < 8) || !$.browser.msie) {//只有IE8以上浏览器存在滚动条复位问题
            return;
        }
        var watchList = ["#sidebar", "#div_maillist", "#readmail_container", "#covMailSummaryList"]
        M139.Timing.setInterval("watchScrollbar", function () {
            for (var i = 0; i < watchList.length; i++) {
                var elems = $(watchList[i]);
                if (elems.length > 0) {
                    elems.each(function (i, n) {
                        if (!n.getAttribute("hasWatched")) {
                            console.log("start watch........",n);
                            M139.Timing.watchElementScroll(n);
                            n.setAttribute("hasWatched",true);
                        }

                    });
               
                }
            }
        },1000);
    },
channelOptions: {},
showChannel:function(channelName){
	
	// add by tkh 点击云邮局频道，如果有‘红点’触发更新消息状态的事件
	if(top.$App.pushMpostMsg){
		top.$App.trigger('updateMpostMsgStatus');
	}
	
	// add by tkh 邮箱顶层保留现场之后进入云邮局页面不会刷新，触发云邮局内部的事件刷新数据
	if(channelName === 'subscribe'){
		top.$App.trigger('renderMpostMailnotify');
	}
	
    var targetTab = "mail";
    if (this.channelOptions[channelName]) {
        targetTab=this.channelOptions[channelName].defaultTab;
    }
    var state=this.model.get("channelState");
    if (state[channelName] && state[channelName].current) {
        targetTab = state[channelName].current;
        if (this.tab.exist(targetTab)) {
            $App.activeTab(targetTab);
        } else { //容错，标签可能被自动关闭 
            if (this.channelOptions[channelName] && this.channelOptions[channelName].defaultTab) {
                $App.show(this.channelOptions[channelName].defaultTab);
            } else {
                $App.showMailbox(1);
            }
        }
    } else {    //未打开过该频道
        if (targetTab == "mail") { //邮件频道不用 app.show打开，要特殊处理下
            $App.showMailbox(1);
        } else {
            $App.show(targetTab);
        }
    }

},
registerChannel: function (name, options) {
    //renderFunc = (options && options.renderFunc) || "none";
    this.channelOptions[name] = options;

},
renderChannel: function (name) {
    var self = this;
    var folderLeft = $("#sub");
    function showMainFolder(show, remainWidth) {
        if (show) {
            $("#leftOther").hide();
            !$App.isNewWinCompose() && folderLeft.show();
            $("#main").css("left", "200px");
            var fv = $App.getView("folder");
            if (fv) {
                fv.resizeSideBar();//隐藏再显示后滚动条会重置，重设滚动条高度
            }
        } else {
            $("#leftOther").show();
            !$App.isNewWinCompose() && folderLeft.hide();
            var left = remainWidth ? "200px" : "0px";
            $("#main").css("left", left);
        }
    }
    function setTabVisible(channel) {
        // 控制顶部导航模块选中样式
        $("#toFixTabs [class=on]").removeClass();
        $("#toFixTabs [channel="+channel+"]").addClass("on");
        
        // 通讯录、日历、网盘模块高度需要调整
        /*
        if (channel == 'addr' || channel == 'calendar' || channel == 'disk') {
            $('#main').addClass('main_not');
            $('#divTab').addClass('mainTop_not');
        } else {
            $('#main').removeClass('main_not');
            $('#divTab').removeClass('mainTop_not');
        }*/

        var op = self.channelOptions[channel];
        if (op && op.withinMail) { //在邮件频道显示
            $("#toFixTabs [channel=mail]").addClass("on");
        }
        if (op && op.hideTab) {
            $("#divTab ul").hide();
            $('#main').addClass('main_not');
            $('#divTab').addClass('mainTop_not');
        } else {
            $("#divTab ul").show();
            $('#main').removeClass('main_not');
            $('#divTab').removeClass('mainTop_not');
        }
        for (elem in self.tab.tabs) {
            var t = self.tab.tabs[elem];
            var m = self.model.getModule(elem);
            if (!m) continue;

            var currentOp = self.channelOptions[m.group] ? self.channelOptions[m.group]:self.channelOptions[m.channel];//循环取频道设置
            if (channel == "mail" || (op && op.withinMail)) { //邮件模块
                if (currentOp) {//隐藏其它频道的标签
                    if (currentOp.hideTab == false) {
                        $(t).show();
                    } else {
                        $(t).hide();
                    }
                } else {
                    $(t).show();
                }
            } else if (channel == 'welcome' || channel == 'subscribe' || channel == "note") { // 为在欢迎页显示“收件箱”入口做的特殊处理
                channel = channel == 'welcome' ? 'mailbox' : channel;
                if (m.group == channel || m.channel == channel) {
                    $(t).show();
                } else {
                    $(t).hide();
                }
            } else {//其它的全隐藏。
                $(t).hide();
            }

        }
        // 调整tablabel数目为显示标签的数目
        self.tab.count = $('#divTab li:visible').not('#tabsMenuIco').length;
        if (self.prevChannel && self.prevChannel != channel) {//切换频道时因为时序问题，无法判断当前频道有几个标签，所以要再次调用resize。prevChannel是为了提高性能减少重复计算
            self.tab.size();
        }
        
        self.prevChannel = channel;
    }
    var module = this.model.getModule(name);
    var channelName = module.channel || module.group;//取模块的group或channel作为channel名称 
    
    if (this.channelOptions[channelName]) {
        this.model.saveChannelState(channelName,name);
        var leftNav = this.channelOptions[channelName].leftNav;
        if (leftNav == "none") { //iframe全部内容实现，不需要顶层的左侧导航
            showMainFolder(false);
            setTabVisible(channelName);
        } else if (leftNav == "mail") { //共用邮件channel的左侧导航
            showMainFolder(true, true);
            setTabVisible(channelName);
        } else {    //由top窗口创建左侧导航,目前暂未使用，未来预留
            showMainFolder(false, true);
            if (folderLeft.prev().attr("class") == "sub") {//已创建过
                folderLeft.prev().html(leftNav());
            } else {
                folderLeft.before("<div class=\"sub\" id=\"leftOther\">" + leftNav() + "</div>");
            }
        }

    } else {
        var visibleChannel = (name == "welcome" ? "welcome" : "mail");
        this.model.saveChannelState(visibleChannel,name);
        showMainFolder(true);

        setTabVisible(visibleChannel);
    }
},
//达到最大标签数处理,打开第26个标签时关闭第25个
maxTabHandler:function(){
    var maxTabsNum = this.model.get('maxTabsNum') || 23; //26 = 25 + 管理标签
    var lastTab;
    var lastTabId;
    this.tabContainer = this.tabContainer || $('#divTab ul');
    var $visibleTabs = this.tabContainer.find('li:visible').not('#tabsMenuIco');
    if( $visibleTabs.length >= maxTabsNum){
        lastTab = this.tabContainer[0].lastChild.previousSibling; //最后一个标签页
        lastTabId = lastTab.getAttribute('tabid');
        lastTabId && $App.closeTab(lastTabId);
    }
},

createTab: function (tabName, deactivate, isHeaderTab) {
    var mod = this.tab.exist(tabName);
    if (mod) {
        //this.tab.active(tabName);
        return;
    }

    try{
        this.maxTabHandler();        
    }catch(e){
        console.log(e);
    }


	var title=this.model.pages[tabName].title;
    var t = {
        name: tabName,
        text: title,
        group: this.model.pages[tabName].group
    };
    if (tabName == "welcome") {
        t.close = true;
    }	
    this.tab.add(t, deactivate, isHeaderTab);
},
//tab标签页点击叉号时触发，用于清除当前模块
onTabDelete:function(tabName){
	//因为同分组的tab替换时也会触发onTabDelete，所以只有未分组的module，才能直接删除模块
	/*var module=this.model.getModule(tabName);
    if(module.group==module.name){	//未分组的module
    	this.model.deleteModule(tabName);
    }else{	//分组的module，不做处理
    	
    }*/
    return ;
},
onTabActive:function(tabName){
//返回true表示激活tab成功
    this.model.set("currentModule",tabName);//设置当前模块，重要
    //this.model.showModule(tabName);
    return true;
},
onTabClose: function (name) { 
    var args = { cancel: false, name: name };
    try{
        $App.trigger("closeTab", args);
    } catch (ex) { }


    if (!args.cancel) { 
        this.onCloseTab(name);
        return true;
    } else {//取消关闭
        return false;
    }
}

});
﻿;(function () {
    var FrameModel = Backbone.Model.extend({
        /**
        * 
        */
        initialize: function (options) {
            if (!window.LinkConfig) {	//只执行一次，避免子类重复执行
                window.LinkConfig = {	//模块配置，用于工厂模式创建相应的模块
                    welcome: { url: "welcome_v2.html", site: "", title: "首页", tab: "welcome",group:"welcome"},
                    compose: { url: "compose.html", site: "", title: "写信", mutiple: true },
                    activityInvite: { url: "activityinvite/invite.html", site: "", title: "会议邀请", mutiple: false },
                    account:             {group: "setting", title: "设置", url: "set/account.html", site: "", tab: "account" },
                    account_setname:     {group: "setting", title: "设置", url: "set/account.html?bubble=txtSenderName", site: "", tab: "account" },
                    account_accountSafe: {group: "setting", title: "设置", url: "set/account.html?anchor=accountSafe", site: "", tab: "account" },
                    account_secSafe:     {group: "setting", title: "设置", url: "set/account.html?anchor=secSafe", site: "", tab: "account" },
                    account_areaSign:    {group: "setting", title: "设置", url: "set/account.html?anchor=areaSign", site: "", tab: "account" },
                    account_userInfo:    {group: "setting", title: "设置", url: "set/account.html?anchor=userInfo", site: "", tab: "account" },
                    accountLock:         {group: "setting", title: "设置", url: "set/account_lock.html", site: "", tab: "account" },
                    lockForget:          {group: "setting", title: "设置", url: "set/account_lock_verifycode.html", site: "", tab: "account" },
                    editLockPass:        {group: "setting", title: "设置", url: "set/mobile.html", site: "", tab: "account" },
                    preference:          {group: "setting", title: "设置", url: "set/preference.html", site: "", tab: "preference" },
                    preference_replySet: {group: "setting", title: "设置", url: "set/preference.html?anchor=replySet", site: "", tab: "preference" },
                    preference_forwardSet: {group: "setting", title: "设置", url: "set/preference.html?anchor=forwardSet", site: "", tab: "preference" },
                    preference_autoDelSet: {group: "setting", title: "设置", url: "set/preference.html?anchor=clearFolders", site: "", tab: "preference" },
                    preference_onlinetips: {group: "setting", title: "设置", url: "set/preference.html?anchor=onlinetips", site: "", tab: "preference" },
                    preference_clientSend: {group: "setting", title: "设置", url: "set/preference.html?anchor=clientSend", site: "", tab: "preference" },
                    preference_popReceiveMail: {group: "setting", title: "设置", url: "set/preference.html?anchor=popReceiveMail", site: "", tab: "preference" },
                    preference_autoSavaContact: {group: "setting", title: "设置", url: "set/preference.html?anchor=autoSavaContact", site: "", tab: "preference" },
                    popmail:    {group: "setting", title: "设置", url: "set/pop.html", site: "", tab: "popmail" },
                    addpop:     {group: "setting", title: "设置", url: "set/add_pop.html", site: "", tab: "popmail" },
                    addpopok:   {group: "setting", title: "设置", url: "set/add_pop_ok.html", site: "", tab: "popmail" },
                    type:       {group: "setting", title: "设置", url: "set/sort.html", site: "", tab: "type_new" },
                    type_new:   {group: "setting", title: "设置", url: "set/sort_new.html", site: "", tab: "type_new" },
                    createType: {group: "setting", title: "设置", url: "set/create_sort.html", site: "", tab: "type_new" },
                    tags:              {group: "setting", title: "设置", url: "set/tags.html", site: "", tab: "tags" },
                    tags_customerTags: {group: "setting", title: "设置", url: "set/tags.html?anchor=forwardSet", site: "", tab: "tags" },
                    tags_systemFolder: {group: "setting", title: "设置", url: "set/tags.html?anchor=systemFolder", site: "", tab: "tags" },
                    spam:               {group: "setting", title: "设置", url: "set/spam.html", site: "", tab: "spam" },
                    spam_whiteListArea: {group: "setting", title: "设置", url: "set/spam.html?anchor=forwardSet", site: "", tab: "spam" },
                    spam_spamMailArea:  {group: "setting", title: "设置", url: "set/spam.html?anchor=spamMailArea", site: "", tab: "spam" },
                    spam_antivirusArea: {group: "setting", title: "设置", url: "set/spam.html?anchor=antivirusArea", site: "", tab: "spam" },
                    mobile:          {group: "setting", title: "设置", url: "set/mobile.html", site: "", tab: "mobile" },
                    partner:         {group: "setting", title: "设置", url: "set/mobile.html", site: "", tab: "mobile" }, //兼容旧版，多写一个key
                    notice: {group: "setting", title: "设置", url: "set/notice.html", site: "", tab: "notice" },
                    set_addr: {group: "setting", title: "设置", url: "set_v2/set_addr.html", site: "", tab: "settingsaddr" },
                    set_calendar: {group: "setting", title: "设置", url: "set_v2/set_calendar.html", site: "", tab: "settingscalendar" },
                    set_disk: {group: "setting", title: "设置", url: "set_v2/set_disk.html", site: "", tab: "settingsdisk" },
                    set_mpost: {group: "setting", title: "设置", url: "/mpost2014/html/columnmanager.html?sid=" + top.sid, site: "", tab: "settingsmpost" },

                    pushEmail: { url: "/pushmail/default.aspx", site: "webmail", title: "pushEmail", tab: "pushemail" }, //pushemail地址
                    G3Phone: { url: top.SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url=" + encodeURIComponent("http://auth.weibo.10086.cn/sso/139mailframe.php?a=g3&environment=2&partId=1&path=&skin=shibo&sid=") + "&comeFrom=weibo&sid=" + top.sid, title: "G3通话", tab: "G3Phone" },
                    fetion: { url: "http://i2.feixin.10086.cn/home/indexpart", site: "", title: "飞信同窗", tab: "fetion" },
                    shequ: { url: top.SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url=" + encodeURIComponent("http://auth.weibo.10086.cn/sso/139mailframe.php?sid=") + "&comeFrom=weibo&sid=" + top.sid, comefrom: "weibo", title: "移动微博", group: "移动微博", tab: "shequ" },
                    cancelPackage: { url: "/userconfig/matrix/MailUpgrade.aspx?page=MailUpgrade.aspx", site: "webmail", title: "套餐信息", tab: "cancelpackage" },
                    syncguide: { url: "/rm/richmail/page/sync_guide_inner.html", site: "", title: "手机同步邮箱", tab: "syncguide" },
                    pay139: { url: top.SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url=" + encodeURIComponent(domainList.global.pay139+"&sid=") + "&comeFrom=weibo&sid=" + top.sid, site: "", title: "手机支付", tab: "pay139" },
                    note: { url: "note/note.html", site: "", title: "和笔记", tab: "note" },
					heyuedu: { url: top.SiteConfig.ssoInterface + "/GetUserByKeyEncrypt?url="+ encodeURIComponent("http://read.10086.cn/email139/index?Sid=") +"&comeFrom=weibo&sid=" + top.sid, comeFrom:"weibo", site: "", title: "和阅读", tab: "heyuedu" },
                    sms: { url: "sms/sms_send.html", group: "sms", title: "发短信", homeUrl: "sms_send.html" },
                    mms: { url: "mms/mmsRedirect.html", group: "mms", title: "发彩信" },
                    diskDevOld: { url: "disk/disk_jump.html", site: "", group: "disk", title: "彩云网盘", homeUrl: "disk_default.html" },
                    diskDev: { url: "disk_v2/disk2.html", site: "", group: "disk", title: "彩云", homeUrl: "disk_v2/disk2.html" },// update by tkh 重构彩云
                    diskShare: { url: "disk_v2/disk_share.html", site: "", group: "disk", title: "彩云网盘", homeUrl: "disk_v2/disk_share.html" },// update by chenzhuo 移植彩云共享功能
                    greetingcard: { url: "card/card_sendcard.html", site: "", title: "贺卡" },
                    card_success: { url: "card/card_success.html", site: "", title: "贺卡" },
                    quicklyShareOld: { url: "largeattach/largeattach_welcome.html", site: "", title: "文件快递" },
                    quicklyShare: { url: "fileexpress/cabinet.html", site: "", group: "disk", title: "彩云网盘" },// update by tkh 重构文件快递默认打开暂存柜页面
                    postcard: { url: "/Card/PostCard/Default.aspx", group: "postcard", site: "webmail", title: "明信片", homeUrl: "Default.aspx" },
                    attachlist: { url: "mailattach/mailattach_attachlist.html", site: "", group: "disk", title: "彩云网盘" },
                    calendar: { url: "calendar_v2/cal_index.html", homeUrl: "cal_index.html", title: "日历", group: "calendar" },
                    addMyCalendar: { url: "calendar_v2/mod/cal_mod_schedule_v1.html", homeUrl: "cal_index.html", title: "添加活动", group: "calendar" },
					vipEmpty: { url: "mail/vipmail_empty.html", site: "", title: "VIP邮件" },
                    clientPc: { url: getDomain("rebuildDomain") + "/disk/netdisk/wp.html?jsres=http%3A//images.139cm.com/rm/newnetdisk4//&res=http://images.139cm.com/rm/richmail&isrm=1", site: "", title: "pc客户端", target: "_blank"},
                    smallTool: { url: "/m2012/html/control139.htm", site: "", title: "pc客户端/小工具", target: "_blank" },
                    smallToolSetup: { url: "/m2012/controlupdate/mail139_tool_setup.exe", site: "", title: "小工具安装", target: "_blank" },
                    pcClientSetup: { url: "/m2012/html/disk_v2/wp.html", site: "", title: "pc客户端", target: "_blank" },
					health: { url: "health.html", group: "health", title: "邮箱健康度"},

                    //用户中心
					userCenter: { url: " http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201204A1&flag=6", site: "", title: "用户中心" },
					voiceSetting: { url: "/m2012/html/voiceMail/redirect.html", site: "", title: "语音信箱" },


                    //通讯录块
                    addrvipgroup:     { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?v=20120620&homeRoute=10100", site: "" },
                    addrhome:         { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html", site: "" },
                    addrinputhome:    { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_import_clone", site: "" },
                    addroutput:       { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_export", site: "" },
                    addrWhoAddMe:     { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_whoaddme", site: "" },
                    addrWhoWantAddMe: { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_request", site: "" },
                    updateContact:    { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_update", site: "" },
                    addrshare:        { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr/addr_share_home.html?check=1", site: "" },
                    addrshareinput:   { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "/addr/matrix/share/ShareAddrInput.aspx", site: "webmail" },
                    addrbaseData:     { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_info_basic", site: "" },
                    dyContactUpdate:  { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "/addr/matrix/updatecontactinfo.htm", site: "webmail" },
                    addrImport:       { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_import_pim", site: "" },
                    addrImportFile: { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_import_file", site: "" },
                    addrMcloudImport: { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_import_pim", site: "" },
                    addrAdd:         { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_add_contacts", site: "" },
					addrEdit:         { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_editContact", site: "" },
                    addrMyVCard:      { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr/addr_businesscard.html?type=mybusinesscard&pageId=0", site: "" },
                    addr:             { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html", site: "" },
                    setPrivate:       { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_setprivacy", site: "" },
                    baseData:         { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_info_basic", site: "" },
                    teamCreate: { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_team_create", site: "" },
                    teamNotify: { group: "addr", tab: "addr", title: "通讯录", homeUrl: "addr_index.html", url: "addr_v2/addr_index.html?homeRoute=10200&redirect=addr_team_notify", site: "" },
                    syncGuide:        { url: "/rm/richmail/page/sync_guide_inner.html", site: "", title: "手机同步邮箱", tab: "syncguide" },

                    groupMail: { url: "/m2012/html/groupmail/list.html",site: "", title: "群邮件", group: "groupMail"  },
                    writeGroupMail: { url: "/m2012/html/groupmail/list.html?redirect=writeGroupMail", site: "", title: "群邮件", group: "groupMail" },
                    //groupMail: { url: "GroupMail/groupEmailList.htm", site: "webmail", title: "群邮件" },
                    groupMailWrite: { url: "GroupMail/GroupMail/ComposeGroupmail.aspx?action=write", site: "webmail", group: "groupMailCompose", title: "写群邮件" },
                    groupMailSetting: { url: "/GroupMail/GroupOper/GroupManager.aspx", site: "webmail", group: "groupMail", title: "群邮件", refresh: true },
                    groupMailFindGroup: { url: "/GroupMail/GroupOper/FindGroup.aspx", site: "webmail", group: "groupMail", title: "群邮件", refresh: true },
                    groupMailCreateGroup: { url: "/GroupMail/GroupOper/CreateGroup.aspx", site: "webmail", group: "groupMail", title: "群邮件", refresh: true },
                    groupMailAddGroupUser: { url: "/GroupMail/GroupOper/AddUserGroup.aspx", site: "webmail", group: "groupMail", title: "群邮件", refresh: true },
                    groupMailEditGroup: { url: "/GroupMail/GroupOper/EditGroupNickName.aspx", site: "webmail", group: "groupMail", title: "群邮件", refresh: true },

                    myrings: { url: "set/myrings.html", site: "", title: "咪咕音乐" },
                    billManager: { url: "bill/billmanager.htm", site: "", group: "mailsub_0", title: "服务邮件" },
                    billLife: { url: "/handler/bill/goto.ashx?lc=main", site: "billLife", group: "mailsub_0", title: "服务邮件" },
                    billLifeNew: { url: "/handler/bill/goto.ashx", site: "billLife", group: "mailsub_0", title: "服务邮件" },
                    billLifeSsoIndex: { url: "/handler/bill/goto.ashx?lc=main&provcode=0&areacode=0&from=1&fromtype=1 ", site: "billLife", group: "mailsub_0", title: "账单生活" },
                    billLifeSsoWater: { url: "/handler/bill/goto.ashx?lc=pay.waterselect&provcode=0&areacode=0&from=1&fromtype=1 ", site: "billLife", group: "mailsub_0", title: "账单生活" },
                    billLifeSsoElectric: { url: "/handler/bill/goto.ashx?lc=pay.electricselect&provcode=0&areacode=0&from=1&fromtype=1 ", site: "billLife", group: "mailsub_0", title: "账单生活" },
                    billLifeSsoGass: { url: "/handler/bill/goto.ashx?lc=pay.gasselect&provcode=0&areacode=0&from=1&fromtype=1 ", site: "billLife", group: "mailsub_0", title: "账单生活" },
                    billLifeTraffic: { url: "/handler/bill/goto.ashx?lc=pay.trafficselect&provcode=0&areacode=0&from=1&fromtype=1", site: "billLife", group: "mailsub_0", title: "账单生活" },
                    //uecLab: { url: "/LabsServlet.do", site: "uec", title: "实验室" },
                    uecLab: { url: "uec/lab.html", title: "实验室" },
                    selfSearch: { url: 'set/selfsearch.html', title: '自助查询' },

                    fax: { url: "fax/sso.aspx?style=3&id=2", site: "webmail", title: "收发传真" },
                    pushemail: { url: "/pushmail/default.aspx", site: "webmail", title: "手机客户端" },
                    smsnotify: { url: "sms/notifyfriends.html", group: "sms", title: "短信提醒" },
                    mobileGame: { url: "http://g.10086.cn/s/139qr/", group: "mobileGame", title: "手机游戏" },

                    // 主题运营活动
                    earth2013: { url: "topicality/earth2013/indexearth.html", site: "", title: "地球一小时" },
                    addcalendar: { url: "calendar/calendar_editcalendar.html", homeUrl: "calendar_view.html", title: "日历", group: "calendar" },

                    //每月任务
                    //myTask: { url: "taskmain/taskmain.html", site: "", title: "我的任务" },

                    myTask: { url: 'http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201306B1', site: "", title: "我的积分任务" },
                    sportLottery: { url: "http://3g.weicai.com/139mail/index.php", type: "sso", comefrom: "weibo" },
                    
                    changeSkin: {url: "changeskin.html", site: "", title: "换皮肤"}, // add by tkh 设置皮肤
                    

                    //邮箱营业厅
                    mailHall: { url: "hall/index.html", site: "", title: "邮箱营业厅" },//邮箱营业厅

                    //年终“邮”
                    lottery: { url: top.getDomain('lotteryRequest') + '/setting/s?func=setting:examineUserStatus&versionID=1', site: "", title: "开箱邮礼" },
                    //lotteryDetail: { url: 'https://happy.mail.10086.cn/web/act/cn/fuli/Rule.aspx', site: "", title: "活动详情" },//年终“邮”
                    //lotteryDetail: { url: 'http://happy.mail.10086.cn/web/act/cn/lottery/detail.aspx', site: "", title: "活动详情" },//年终“邮”
                    //lotteryad: { url: 'http://happy.mail.10086.cn/web/act/cn/lottery/index.aspx', site: "", title: "马上邮奖" },//年终“邮”
                    blueSky: { url: 'http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201403A1', site: "", title: "蓝天自造" },
                    billCharge: { url: top.SiteConfig.billChargeUrl, site: "", title: "邮箱营业厅" },
                    colorfulEgg: { url: 'http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201403D1', site: '', title: '生日彩蛋' },
                    smartLife: { url: top.getDomain('happyMailUrl') + '/api/sso/ssoformail.ashx?to=CN201407B1', site: "", title: "拥抱智能生活" },
                    nothing: {} //结尾
                };
                //window.LinksConfig = window.LinkConfig; //兼容旧版
                if (!domainList["global"]["billLife"]) {
                    domainList["global"]["billLife"] = "http://bill.mail.10086.cn";
                }
                this.addSubscribeLinks();
                this.fixlinks();//提供新开关动态修改链接入口
            }

        },
        modules: [], //模块列表
        defaults: {  //默认数据
            currentLink: null, //当前模块
            container: null
        },
        /***
        * 通过key值获取links配置
        */
        getLinkByKey: function (key) {
            return window.LinkConfig[key];
        },
        /***
        * 通过model取到当前的标签页id，再取到相应的links配置
        */

        getLink: function (moduleModel) {

            var currentModuleName = moduleModel.get("currentModule"); //模块管理model

            var key = currentModuleName;
            var module = moduleModel.getModule(currentModuleName);
            if (module.orignName) { //多实例，name已经加了guid，取orignName
                key = module.orignName;
            }
            var config = window.LinkConfig[key]; //为了适应写信页多实例，不能直接取module.name，而是取分组名称
            if (module.view && module.view.inputData && module.view.inputData.categroyId) {
                config.categroyId = module.view.inputData.categroyId;
            }
            return config;
            //alert(config.url);
        },

        /**
        * 创建module,module是实体数据{name:"模块名",
        * isload:false //是否加载过
        * type:"mailbox" //表示模块类型，如mailbox,welcome,readmail
        * title:"" 表示模块标题
        * element:null 模块容器dom
        */
        addLink: function (key, data) {
            window.LinkConfig[key] = data;
        },

        /** 添加我的订阅相关页面连接 */
        addSubscribeLinks: function () {
            //var host = getDomain('dingyuezhongxin'); // update by tkh
            var host = "http://" + top.location.host;
            var homemailhost = getDomain('homemail');
            this.addLink('goodMag', { url: host + "/inner/magazine_list_main.action", group: "subscribe", title: "云邮局" });
            this.addLink('googSubscription', { url: host + "/mpost2014/html/mpost.html", group: "subscribe", title: "云邮局" }); // 云邮局主页面
            this.addLink('mpostOnlineService', { url: host + "/mpost2014/html/onlineservice.html", channel: "subscribe", mutiple:true,refresh:true,title: "云邮局" }); // 云邮局在线服务（新页签）
            this.addLink('mpostOnlineRead', { url: host + "/mpost2014/html/mymagazine.html", group: "subscribe", title: "云邮局" }); // 云邮局在线阅读
            this.addLink('myMag', { url: host + "/inner/magazine_list_main.action", group: "subscribe", title: "云邮局" });
            this.addLink('myCollect', { url: host + "/inner/show_favorite.action", group: "subscribe", title: "云邮局" });
            this.addLink('myCloudSubscribe', { url: host + "/inner/mysubscribe.action", group: "subscribe", title: "云邮局" }); // add by tkh 新版精品订阅‘我的订阅’
            this.addLink('setSubscription', { url: host + "/inner/to_subscribe_manager.action", group: "subscribe", title: "云邮局" });
            this.addLink('myBookshelf', { url: host + "/inner/magazine_list_main.action", group: "subscribe", title: "云邮局" });
            this.addLink('dingyuezhongxin', { url: host + "/mpost2014/html/mpost.html", group: "subscribe", title: "云邮局" });
            this.addLink('dingyueDownload', { url: "http://jpdyapp.mail.10086.cn/?21", group: "subscribe", title: "云邮局" });

        },
        fixlinks :function(){
        	
            if(top.SiteConfig.calendarRemind){//修改日程提醒
           	
           	    if(top.SiteConfig.isLoadingCalendarRemind){
           	    	
           	    	this.addLink('calendar',{ url: "calendar_reminder/loading.html", homeUrl: "month.html", title: "日历", group: "calendar" });
           	    	
           	    }else{
           	    	
           	    	this.addLink('calendar',{ url: "calendar_v2/cal_index.html", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('createCalendar', { url: "calendar_v2/cal_index.html?redirect=addlabel", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('addcalendar', { url: "calendar_v2/cal_index.html?redirect=addact", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('addBirthcalendar', { url: "calendar_v2/cal_index.html?redirect=addbirthact", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('calendar_act_view', { url: "calendar_v2/cal_index.html?redirect=actview", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('calendar_msg', { url: "calendar_v2/cal_index.html?redirect=msg", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('calendar_search', { url: "calendar_v2/cal_index.html?redirect=search", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('calendar_square', { url: "calendar_v2/cal_index.html?redirect=discovery", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	this.addLink('calendar_manage', { url: "calendar_v2/cal_index.html?redirect=labelmgr", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
                    this.addLink('calendar_viewlabel', { url: "calendar_v2/cal_index.html?redirect=viewlabel", homeUrl: "cal_index.html", title: "日历", group: "calendar" });
           	    	var lstSpecial = [{labelId:6,name:'birth',page:'list_system.html'},{labelId:1,name:'appointment',page:'list_system.html'},{labelId:2,name:'pay',page:'list_system.html'},
           	    					{labelId:3,name:'special',page:'list_system.html'},{labelId:5,name:'sport',page:'list_system.html'},{name:'baby',page:'list_baby.html'}
           	    				  ];
           	    	var item = null ,url = null , homeUrl = null;
           	    	for(var i = 0 ;i < lstSpecial.length; i++){
           	    		
           	    		item = lstSpecial[i];
           	    		homeUrl = item.page;
           	    		url = "calendar_v2/" + item.page;
           	    		if(item.labelId){
           	    			
           	    			url +=  ("?labelId=" + item.labelId);
           	    		}
           	    		
           	    		this.addLink('specialCalendar_'+item.name,{url: url,homeUrl: homeUrl,title: "日历",group: "calendar"});
           	    	}
           	    }
           		
           	
           }
            if (SiteConfig.m2012NodeServerRelease) {
                LinkConfig.welcome.url = "/m2012server/welcome";
            }
        }

    }, {
	    getLinkByKey: function (key) {
            return window.LinkConfig[key];
        }
    });

    window.FrameModel = FrameModel;

})();
var FrameView = Backbone.View.extend({
    initialize: function (options) {
        this.parentView = options.parent;
        this.model = new FrameModel();
        this.param = options.param;//页面参数（如果有的话）
        this.url = options.url;//如果传递url直接打开，可以不需要配置
        this.html = options.html;//如果传递html直接可以不通过iframe创建标签页
        this.title = options.title;//如果传递url直接打开，可以不需要配置
        this.inputData = options.inputData;
        var self = this;
        $(window).resize(function () {
            self.onResize();
        });

    },
    render: function (isRendered) {//isRendered:表示是否显示过，用于强制刷新
        var self = this;
        var pm = this.parentView.model; //父view的model，即模块管理类
        var currentModule = pm.get("currentModule");//当前模块
        var config = this.model.getLink(pm);//获取链接配置

        var errorTip = ['<div class="bodyerror ErrorTips" style="display:none">',
 		    '<img src="../images/global/smile.png" width="73" height="72">',
 		    '<p>没加载出来，再试一次吧</p>',
 		    '<a class="btnTb" href="javascript:"><span class="p_relative">重新加载</span></a>',
 	    '</div><div class="gtips NoCompleteTips" style="display:none">',
            '<span class="ml_5">由于网络原因，当前页面未完全加载，是否<a class="Retry" style="text-decoration: underline;" href="javascript:">重新加载</a>？</span>',
            '<a href="javascript:" class="i_u_close Close"></a>',
        '</div>'].join("");


        if (config) { //有配置
            //this.el=pm.getModule(currentModule).element;//显示容器
            this.parentView.setTitle(pm.getModule(currentModule).title || config.title); //设置标题 

            if ($(this.el).html() == "" || !isRendered || config.refresh) {   //没有创建过，或需要强制刷新时才重新加载
                var prefix = config.url.indexOf("?") >= 0 ? "&" : "?";//是问号还是&符号
                var url = config.url ;
                if (!config.clearSid) { //有不需要sid的情况
                    url = url + prefix + "sid=" + sid;
                }
                if (config.categroyId) {
                    url += '&categroyId=' + config.categroyId;
                }
                if (config.site) {
                    url = getDomain(config.site) + "/" + url;
                }
                if (this.param) {
                    if (typeof (this.param) == "string") {
                        if (this.param.indexOf("urlReplace") >= 0) {
                            url = this.param.match("urlReplace=(.+)")[1];
                            var m_domain = config.url.match(/http:\/\/.+?\//);
                            if (m_domain) {
                                url = m_domain + url;
                            }
                        } else {
                            url = url + this.param
                        }
                    } else {
                        url = M139.Text.Url.makeUrl(url, this.param);
                    }
                }

                if (this.inputData) {
                    url = $App.inputDataToUrl(url, this.inputData);
                }

                var id = currentModule;
                if (config.tab) {
                    id = config.tab;
                }
                $(this.el).html("<iframe scrolling=\"auto\" class=\"main-iframe\" name=\"ifbg\" frameborder=\"no\" width=\"100%\" id=\"" + id + "\" src=\"" + url + "\" allowtransparency=\"true\"></iframe>" + errorTip);
            }
        } else if (this.url) {
            this.parentView.setTitle(this.title); //设置标题
            $(this.el).html("<iframe scrolling=\"auto\" class=\"main-iframe\" name=\"ifbg\" frameborder=\"no\" width=\"100%\" src=\"" + this.url + "\" allowtransparency=\"true\"></iframe>" + errorTip);
        } else if (this.html) {
            this.parentView.setTitle(this.title); //设置标题
            $(this.el).html(this.html);
        }
        this.onResize();

        if (!isRendered) {
            setTimeout(function () {
                self.watchIframeStatus(pm.getModule(currentModule));
            }, 0);
        }
    },
    /**
     * 获取工具栏，此函数由tabpageView自动调用。
     */
    onResize: function () {

        if (this.el) {
            try {
                var iframe = this.el.childNodes[0];
                var currentModule = $App.getCurrentTab && $App.getCurrentTab() && $App.getCurrentTab().name;
                // 切换到其他模块会触发欢迎页iframe高度的改变
                // 欢迎页iframe高度变化会影响$App.getBodyHeight()取值
                if (iframe.id == 'welcome' && currentModule != 'welcome') {
                    return;
                }
                $iframe = $(iframe);
                var height = $(document.body).height() - $("#div_main").offset().top;
                $iframe.height(height - 4);//减去多余4像素
                //console.log(iframe.id)
                if ($.browser.msie && $.browser.version < 8) {
                    // 针对ie67的优化
                    
                    var idAttr = iframe.id; // add by tkh 与网盘一样，云邮局的页签不需要设置宽度
                    if ((idAttr && idAttr.indexOf('mpostOnlineService') !== -1) ||
                        idAttr === 'googSubscription' ||
                        idAttr == "diskDev" ||
                        idAttr == "calendar" || idAttr == "createCalendar" || idAttr == "addcalendar" || idAttr.toLowerCase().indexOf("calendar_") > -1 ||
                        idAttr == "addr" ||
                        idAttr === 'jpdy_topic_1'||
                        idAttr == "billCharge") {
                        return; 
                    }
                    
                    if ($App.isNewWinCompose()) {
                        // 不操作
                    } else {
                        $iframe.width($(document.body).width() - 214);
                    }
                }

            } catch (e) { }
        }
    },

    getIframe: function(){
        return this.el.firstChild || null;
    },

    /**
     *设置标题栏左侧图标状态
     *@param status {string} loading|error|hide
     */
    setTabStatus: function (status) {
        //console.log("setTabStatus:" + status);
        var iframe = this.getIframe();
        if (iframe.id) {
            $App.getView("tabpage").tab.setStateIcon(iframe.id, status);
        }
        
        this.model.set("tabStatus", status);
    },

    getTabStatus: function(){
        return this.model.get("tabStatus");
    },

    /**
     *根据iframe的状态显示如loading图标
     */
    watchIframeStatus: function (module) {
        if (!SiteConfig.labelIframeLoadingRelease) {
            return;
        }
        if ($B.is.ie && $B.getVersion() < 9) {
            return;
        }
        var self = this;
        var iframe = this.getIframe();
        if (!iframe || iframe.id == "welcome") return;
        setTimeout(function () {
            checkFinish("settimeout");//防止类似ie11超快加载，来不及捕获onload
        }, 100);
        setTimeout(function () {
            if (self.getTabStatus()=="error") {
                module.isRendered = false;
            }
        }, 10000);
        var win = iframe.contentWindow;
        iframe.onload = function () {//bind load会触发2次
            checkFinish("onload");
        };
        if (isLocalPage()) {
            $Timing.waitForReady(function () {
                return win.document.domain === document.domain
            }, function () {
                $(win.document).ready(checkFinish);
            });
        }
        function isLocalPage() {
            //要确保非本域iframe 不检查同域（如飞信，微博等）
            var url = iframe.src;
            if (/^\/|http:\/\/(appmail\d+|rm|app|smsrebuild\d+|subscribe\d+|html5)\.mail\./.test(url) && url.indexOf('/m2012') > -1) {
                if (url.indexOf("inner/reader/index") >= 0 || url.indexOf("voiceMail") >= 0) {//云邮局的页面没加domain，特殊处理下
                    return false;
                }
                return true;
            } else {
                return false;
            }
        }
        function checkFinish(type) {
            var notCompleteTimer;
            if (isLocalPage()) {
                //定制的页面要检查对象可用而不是脚本有可访问性
                if ($Iframe.isAccessAble(iframe)) {
                    //html页中的健康检查代码
                    if (win.LoadStatusCheck) {
                        notCompleteTimer = setTimeout(showNotCompleteTip, 3000);
                        $Timing.waitForReady(function () {
                            return win.LoadStatusCheck.isComplete() && self.checkIframeHealth(iframe);
                        }, function () {
                            clearTimeout(notCompleteTimer);
                            showOK();
                        });
                    } else {
                        if (self.checkIframeHealth(iframe)) {
                            showOK();
                        } else {
                            setTimeout(function () {
                                if (self.checkIframeHealth(iframe)) {
                                    showOK();
                                } else {
                                    showNotCompleteTip();
                                }
                            }, 3000);
                        }
                    }
                } else {
                    if (type == "onload") {
                        showError();
                    }
                }
            } else {
                //非同域名无法检测页面完成性
                showOK();
            }
        }
        function showOK() {
            self.setTabStatus("hide");
            $(self.el).find("div.ErrorTips,div.NoCompleteTips").hide();
            iframe.style.visibility = "";
        }
        function showError() {
            self.setTabStatus("error");
            $(self.el).find("div.ErrorTips").show().find("a").click(function () {
                $(this).unbind("click");
                reload();
            });
            iframe.style.visibility = "hidden";
            $App.trigger("httperror", {
                loadResourceError: true
            });
        }
        function showNotCompleteTip(){
            self.setTabStatus("error");
            var container = $(self.el).find("div.NoCompleteTips").show();
            container.find("a.Retry").click(function () {
                $(this).unbind("click");
                reload();
            });
            container.find("a.Close").click(function () {
                container.hide();
            });
            iframe.style.visibility = "";
            $App.trigger("httperror", {
                loadResourceError: true
            });
            if (self.iframeErrorLog) {
                M139.Logger.sendClientLog(self.iframeErrorLog);
            }
        }
        function reload() {
            iframe.src = iframe.src;
            $(self.el).find("div.ErrorTips,div.NoCompleteTips").hide();
        }
    },
    /**
     *检测iframe里的js和css加载正常
     */
    checkIframeHealth: function (iframe) {
        var self = this;
        var result = true;
        //高级浏览器才支持script onload,在index.html中loadScript的时候加的
        if (($B.is.ie && $B.getVersion() >= 9) || !!window.FormData) {
            (function () {
                var scripts = iframe.contentWindow.document.getElementsByTagName("script");
                for (var i = 0; i < scripts.length; i++) {
                    var js = scripts[i];
                    if (js.getAttribute("jsonload") === "0") {
                        result = false;
                        self.iframeErrorLog = { level: "ERROR", name: "JSLoadError", url: js.src };
                        return;
                    }
                }
                //windows下的safari，以及低版本的chrome和firefox不支持 css文件的onload事件，会产生误判 
                if (($B.is.chrome && $B.getVersion() < 25) || ($B.is.safari) || ($B.is.firefox && $B.getVersion() < 25)) {
                    return;
                }
                var links = iframe.contentWindow.document.getElementsByTagName("link");
                for (var i = 0; i < links.length; i++) {
                    var css = links[i];
                    if (css.parentNode && css.parentNode.tagName !== "HEAD") continue;
                    if (css.getAttribute("cssonload") === "0") {
                        result = false;
                        self.iframeErrorLog = { level: "ERROR", name: "CSSLoadError", url: css.href };
                        return;
                    }
                }
            })();
        }
        return result;
    }
});
﻿String.prototype.trim = function(){
	return this.replace(/^\s+|\s+$/g, "");
}

function TabLabel(container,context){
    this.win = window;
    this.doc = this.win.document;
    this.context=context;  //modelview的引用，避免依赖
    //this.id = "divTab";
	var ul=document.createElement("ul");
	//ul.className="tab";
	
	ul.innerHTML = '<li id="tabsMenuIco" class="noAll" tabindex="0" style="display:none"><a href="javascript:;" hidefocus="true" class="closeAll" title="点击查看更多"></a></li>';

	container.innerHTML="";
	container.appendChild(ul);
    this.main = ul;
    this.cur = null;
    this.tabs = [];
    this.group = [];
    this.count = 0;
    this.width = -1;
    this.max = 124;
    this.min = 90;
	this.playerWidth=0;
    this.history = [];
    this.call = [];
    this.init();
    //拖动初始化
    //DropAbledTabLabel.init(this);
}

TabLabel.prototype.init=fTabLabelInit;
TabLabel.prototype.add=fTabLabelAdd;
TabLabel.prototype.exist=fTabLabelExist;
TabLabel.prototype.del=fTabLabelDel;
TabLabel.prototype.active=fTabLabelActive;
TabLabel.prototype.title=fTabLabelTitle;
TabLabel.prototype.close=fTabLabelClose;
TabLabel.prototype.change=fTabLabelChange;
TabLabel.prototype.replace=fTabLabelReplace;
TabLabel.prototype.size=fTabLabelSize;
TabLabel.prototype.update=fTabLabelUpdate;
TabLabel.prototype.showPlayer = fTabLabelShowPlayer;
TabLabel.prototype.setStateIcon = fTabLabelSetStateIcon;

function fTabLabelSetStateIcon(id, state) {
    var classes = {
        "loading": "error-loading",
        "error": "error-tab",
        "cluster": "i_m_rss",
	    "uploading": "write-loading"
    }
    var el = this.tabs[id] && this.tabs[id].firstChild;
    if (el && el.tagName == "I") {
        if (state == "hide") {
            el.style.display = "none";
        } else {
            el.className = classes[state];
            if (state == "cluster") {
                $(el).css({ left: "3px", top: "9px" });
            }
            el.style.display = "";
        }
    }
}
function fTabLabelShowPlayer(show){
	if(show){
		this.playerWidth=240;
		
	}else{
		this.playerWidth=0;
	}
	if(top.MM){
		top.MM.resize();
		top.MM.onShow();
	}
	
	
	
}
function fTabLabelInit(){
    try {
        //this.main = this.doc.getElementById(this.id);
        var w = 720; // 208 130
        //this.main.style.width  = w+30+"px";    
        this.width = w; 
    } 
    catch (e) {
        alert(frameworkMessage.TablabelError, e);
    }
}


function specialTreatments(ao,tab,_this) {
    /* 标签的特殊处理 */

    //#region 日历calendar
    if (ao.name == "calendar") {
        var key = "calendar_version";
        var oldVer = $Cookie.get(key) || "",
            newVer = top.SiteConfig[key] || "";
        if (!!newVer && oldVer != newVer) {
            //有更新
            $(tab).append('<i class="i_newsL" key="' + key + '" value="' + newVer + '"></i>');
        }
    }
    //#endregion
}

function fTabLabelAdd(ao, deactivate, isHeaderTab) {
    var v = this;
    var win = this.win;
    var id = ao.name;
    var tab, dvl, dvm, dvr, a;
	//ao.text=Utils.htmlEncode(ao.text);
	tab = this.doc.createElement('li');
	tab.setAttribute("tabid", id);
    tab.setAttribute("role","tab");
    tab.setAttribute("tabindex","0");

	var text = $T.Html.encode(ao.text);
	var orignTabsData = this.context.model.getFixedTabsData();
	
	function noClose(){ //是否可以关闭

		//特殊业务，移动用户固定标签收件箱可以关闭，非移动用户不能关闭
	    if (id === 'welcome' || id === 'mailbox_1' || $.inArray(id, orignTabsData) > -1) {
			return true;
		}
	}
	//如果是云邮件，加图标
//	if(id == "googSubscription"){
//		icon2 = '<i class="i_m_rss"></i>';
//	}
    if (noClose()) {
        tab.className = deactivate ? "" : "on";
        tab.setAttribute("aria-selected", deactivate ? "false" : "true");
	    tab.innerHTML = "<i style='display:none;' class=\"error-loading\"></i><span>" + text + "</span>";
        
    }else{
        tab.className = deactivate?"":"on";
        tab.setAttribute("aria-selected", deactivate ? "false" : "true");
	    tab.innerHTML = "<i style='display:none;' class=\"error-loading\"></i>\
            <span>"+text+"</span>\
            <a href=\"javascript:;\" class=\"i_close\" title=\"关闭\"></a>";
    }

	tab.onmousedown = function (e) {
	    e = e || window.event;
	    var target = e.target || e.srcElement;
	    if (target.tagName == "A") return;
        var id = this.getAttribute("tabid");
        if (v.exist(id) == v.cur) {
            return;
        }
		
        v.active(id);
    }
  
	ao.text = ao.text || "";
    tab.title = ao.text;//.stripTags();
	
	if (!ao.close) {
	    var a_close = tab.getElementsByTagName("a")[0];
		tab.ondblclick = function(){
            if (a_close) {
                $(a_close).trigger("click");
            }
    	};
		if (a_close) {
		    a_close.onclick = function (e) {
		        //var id = this.parentNode.parentNode.getAttribute("tabid"); //找到标签上保存的模块id
		         var id = this.parentNode.getAttribute("tabid");
				//延迟移除 否则无法触发document的click事件
				_delTab(id);
		    };
		}
	}
	
	
	
	//删除固定标签
	var delTabId = 'delOrignTab_' + id;
	$App.off(delTabId).on(delTabId ,function(){
		var flag = true;
		if(id === 'welcome'){
			flag = false;
		}
		if(id.indexOf("mailbox_") > -1 && !$User.isChinaMobileUser()){
			flag = false;
		}
		
		flag && _delTab(id);
		console.log(id);
	});
	
	function _delTab(id){
		setTimeout(function () {
			if (v.call[2].call(v.context, id)) {
				v.del(id);
			}
		}, 0);
	}

	/** 
	* 插入标签有两种情况：
	* 1、普通在尾部插入节点 
	* 2、固定标签设置时在头部插入节点 
	*/
    if(!isHeaderTab){
		$('#tabsMenuIco').before(tab);
	}else{
		$(this.main).find('li:eq(0)').after(tab); //固定标签显示,这里无问题
	}
	$('#tabsMenuList').hide(); //隐藏下拉菜单

	this.tabs[id] = tab;
    if (!deactivate) {
        this.active(id);
    }
    this.count++;
    this.size();
	
	//特殊切换
	var replaceReg = /myMag|myCollect|googSubscription|myCloudSubscribe/i;
	if(replaceReg.test(ao.name)){
		ao.group = "subscribe";
		ao.name = "精品订阅";
	}
	
    if (ao.group) { //存在分组的情况，进行替换
		
        var group = this.group[ao.group];
        if (group && group != id && this.exist(group)) {
        	this.call[2].call(this.context, group);
            this.replace(group, id);
        }
        this.group[ao.group] = id;
    }
    //扩展标签页支持拖拽
    //DropAbledTabLabel.bindItemBehavior(tab);

    //标签的特殊处理
    specialTreatments(ao, tab, this);
}

//这个对象让标签页支持拖动
var DropAbledTabLabel = {
	//绑定容器
	init:function(tabObj){
		this.tabObj = tabObj;
		var ul = tabObj.main;
		this.majia_ul = ul.cloneNode(false);
		this.majia_ul.style.position = "absolute";
		this.jMajia_ul = $(this.majia_ul);
		ul.parentNode.appendChild(this.majia_ul);
	},
	//处理标签页行为
	bindItemBehavior:function(li){
		var This = this;
		$(li).mousedown(function(e){
			if(e.target.tagName=="A")return;
			This.onMouseDown(this,e);
	    });
	},
	onMouseDown:function(sender,e){
		var This = this;
		//将马甲ul清空
    	this.majia_ul.innerHTML = "";
    	//复制被点击的标签页元素li并添加到马甲ul中
    	var node = sender.cloneNode(true);
    	this.majia_ul.appendChild(node);
    	//$(node).find("p").html("哈哈哈哈");
    	
    	//复制被点击的li的x坐标
    	//因为ul是相对父元素定位的，所以left要减去父元素的left
    	var parentLeft = $(this.tabObj.main).offset().left;
    	var startLeft = $(sender).offset().left-parentLeft;
    	$(this.majia_ul).css("left",startLeft);
    	
    	this.majia_ul.style.visibility = "hidden";
    	this.current_li = sender;
    	
    	//鼠标移动的拖动效果
    	var startX = e.clientX;
    	var lastX = e.clientX;
    	$(document).mousemove(onMouseMove);
    	$(document).mouseup(onMouseUp);
    	GlobalDomEvent.on("mouseup",onGlobalMouseUp);
    	function clearEvents(){
    		$(document).unbind("mousemove",onMouseMove).unbind("mouseup",onMouseUp);
    		GlobalDomEvent.un("mouseup",onGlobalMouseUp)
    	}
    	function onGlobalMouseUp(e){
    		clearEvents();
    		This.moveEnd();
    	}
    	function onMouseUp(e){
    		clearEvents();
    		This.moveEnd();
    	}
    	function onMouseMove(e){
    		//当开始拖动的时候，隐藏被点击的li，显示马甲li
    		sender.style.visibility = "hidden";
    		This.majia_ul.style.visibility = "";
    		var newX = e.clientX;
    		//x轴平移
    		This.jMajia_ul.css("left",parseInt(This.majia_ul.style.left) + newX - lastX);
    		lastX = newX;
    		Utils.stopEvent(e);
    		This.testTabResort();
    		
    		if($.browser.msie && e.clientY<10){
    			clearEvents();
        		This.moveEnd();
    		}
    		
    		return false;
    	}
	},
	moveEnd:function(){
		this.majia_ul.innerHTML = "";
		//恢复被隐藏的li
		if(this.current_li)this.current_li.style.visibility = "";
	},
	//测试标签页是否重新排序
	testTabResort:function(){
		var changeX = this.jMajia_ul.offset().left - $(this.current_li).offset().left;
		//console.log("changeX:"+changeX);
		var count = Math.round(changeX / $(this.current_li).width());//可优化性能
		//console.log("count:"+count);
		if(count==0)return;
		if(count>0){
			var obj = this.current_li;
			for(var i=0;i<count && obj.nextSibling;i++){
				obj = obj.nextSibling;
			}
			$(obj).after(this.current_li);
		}else{
			count = -count;
			var obj = this.current_li;
			for(var i=0;i<count && obj.previousSibling;i++){
				obj = obj.previousSibling;
			}
			$(obj).before(this.current_li);
		}
	}
}


function fTabLabelExist(id){
    var tab = this.tabs[id];
    if (tab && tab.nodeType && tab.getAttribute("tabid")) {
        return tab;
    }
    return null;
}

function fTabLabelDel(id){
    var tab = this.exist(id);
    if (!tab) {
        //ch("Tab Del Error", null);
        return;
    }
    if (this.cur == tab) {
        this.cur = null;
    }
    this.main.removeChild(tab);
    delete this.tabs[id];
    this.count--;
    this.size();
    if (this.call[0]) {
        this.call[0].call(this.context,id);
    }
    this.update(id, false);
    if (!this.cur && this.history.length) {
        tab = this.history[this.history.length - 1];
        this.history.length--;
        if (tab == "welcome") { tab = "mailbox_1";}
        this.active(tab);
    }   
    // 控制标签管理菜单显示隐藏
    if ($App.getView('tabpage').tab.count > 5) {
        $('#tabsMenuIco').show();
    } else {
        $('#tabsMenuIco').hide();
    }
}

function fTabLabelActive(id,raiseEvent){

    var tab = this.exist(id);
    if (!tab) {
        //ch("Tab Active Error", null);
		//alert(frameworkMessage.TablabelNoTabError);
        return;
    }
    if (this.call[1]) {
        if (!this.call[1].call(this.context,id)) { //执行modelview.onActive
            return false;
        }
    }    
    if (this.cur) {    
        setActive(this.cur, false);
    }
    this.cur = tab;
    setActive(tab, true);
    this.update(id, true);
	
    function setActive(tab, visible)
    {
        if (visible)	//获得焦点
        {
            var id = tab.getAttribute("tabid");
            tab.className = "on";
            tab.setAttribute("aria-selected","true");
        
            if (id == "welcome")            
            { 
				tab.className = "home on";
            }else{
                tab.className = "on";
            }
        }
        else	//失去焦点
        {
            var id1 = tab.getAttribute("tabid");
            if (id1 == "welcome")
            {
				tab.className = "home";
    
            }else{
				tab.className = "";
            }
			tab.setAttribute("aria-selected","false");
            
        }
    }
}

function fTabLabelTitle(id, title){
    var tab = this.exist(id);
    if (!tab) {
        //ch("Tab Title Error", null);
        return;
    }
    var txt = tab.getElementsByTagName("span")[0];

    if (title) {
        txt.innerHTML = $T.Html.encode(title);
        tab.title = title;//.stripTags();
    }
    else {
        var t = $T.Html.decode(txt.innerHTML);
        return t;//.stripTags();
    }
}

function fTabLabelClose(id){
    var tab = this.exist(id);
    if (tab) {
        $(tab).find(".i_close").trigger("click");
       
    }
    else {
        //ch("Tab Close Error", null);
    }
}

function fTabLabelChange(id, title, name){
    var tab = this.exist(id);
    if (!tab) {
        //ch("Tab Change Error", null);
        return;
    }
    if (title) {
        this.title(id, title);
    }
    delete this.tabs[id];
    tab.setAttribute("tabid", name);
    this.tabs[name] = tab;
    var i, l = this.history.length;
    for (i = 0; i < l; i++) {
        if (this.history[i] == id) {
            this.history[i] = name;
            break;
        }
    }
}

function fTabLabelReplace(oldId, newId){
    var tab = this.exist(oldId) && this.exist(newId);
    if (!tab) {
        //ch("Tab Replace Error", null);
        return;
    }
    var title = this.title(newId);
    this.cur = this.exist(oldId);
    this.del(newId);
    this.change(oldId, title, newId);
    this.active(newId);
}

function fTabLabelSize(w){
    var tab, i, k = 7;
    if (w) {
        this.width = w;
    }else{
        var searchBarWidth=30; //275=搜索栏+关闭全部按钮的宽度
        this.width = $D.getWinWidth() - searchBarWidth - this.max;//210=左侧 文件夹的宽度
    }
    if ((this.count - 1) * this.max > this.width) {
        this.min =Math.floor(this.width/(this.count - 1));
        //this.min = Math.floor((this.width - this.count * k) / this.count);
    }
    else {
        this.min = this.max;
    }
    for (i in this.tabs) {
        tab = this.exist(i);
        if (tab){
            //tab.style.width=this.min-21+"px";
            var m= $(tab).text() == '收件箱' ? (this.max - 33) : (this.min-33); //33=标签页左右两边之和
            if(m<0.5){m=0;} //最小宽度为0，标签再多的话会溢出显示区域，无解
            //if(tab.getAttribute("tabid")!="welcome"){
                tab.style.width=m+"px";
            //}
        
        }
    }
}

function fTabLabelUpdate(id, flag){
    var i, l = this.history.length;
    var t, a = [];
    for (i = 0; i < l; i++) {
        t = this.history[i];
        if (t != id) {
            a[a.length] = t;
        }
    }
    if (flag) {
        a[a.length] = id;
    }
    this.history = a;
}

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
﻿(function ($, _, M139) {

    M139.namespace('M2012.Settings.Model.Notice', Backbone.Model.extend({
        defaults: {
            lastAddr:"",
            noticeType: 0, //0，每次发送；1，不发送；2，异常时发送；
            lastLogin: ""
        },
        func: {
            getNotice: "user:getLoginNotify",
            setNotice: "user:setLoginNotify"
        },
        initialize: function () {
            
        },
        getSettings:function(callback){
            var This = this;
            M139.RichMail.API.call(This.func.getNotice, {}, function (response) {
                var respData = response.responseData;
                if (callback && respData) {
                    callback(respData);
                }
            });
        },

        hasChange: function() {
            return this.get("noticeType") != this.get("lastNoticeType");
        },

        update: function (callback) {
            var This = this;

            if (!This.hasChange()) {
                return;
            }

            var data = { configValue: This.get("noticeType").toString() };
            M139.RichMail.API.call(This.func.setNotice, data, function (response) {
                var respData = response.responseData;
                if (callback && respData) {
                    var result = "FA_DEFAULT";

                    if (respData.code == "S_OK") {
                        result = "S_UPDATE";
                        This.set({
                            "lastNoticeType": This.get("noticeType")
                        });

                    } else if (result.code == "S_FALSE") {
                        result = "FA_TIMEOUT";

                    }

                    callback(result);
                }
            });
        }
    })
    );
})(jQuery, _, M139);
﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.View.Notice', superClass.extend({
        messages: {
            FA_DEFAULT: "系统繁忙，请稍后重试",
            FA_GET_DATA: "获取数据用户设置失败",
            FA_UPDATE: "更新失败，请重试",
            FA_TIMEOUT: "登录超时，请重新登录",
            S_UPDATE: "您的设置已保存"
        },
        initialize: function () {
            
            var _this = this;
            _this.cancel = $("#btnCancel");
            _this.cancel.on("click", function () {
                _this.MM.close("notice", { exec: "back" });
            });
        
            _this.radio = $("#loginNotice :radio");

            if (top.$User) {
                if (top.$User.isNotChinaMobileUser()) {
                    _this.disable();
                    return;
                }
            } else {
                if (',81,82,83,84,'.indexOf("," + top.UserData.provCode + ",") > -1) {
                    _this.disable();
                    return;
                }
            }

            _this.model = new M2012.Settings.Model.Notice();
            _this.lastLogin = $("#lastLogin");
            _this.submit = $("#btnSubmit");

            _this.render();
        },
        WaitPanel: (new M2012.MatrixVM()).createWaitPanel(),
        MM: (new M2012.MatrixVM()).createModuleManager(),
        render: function () {
            var This = this;
            var model = This.model;
            var messages = This.messages;

            top.BH({key: "notify_load"});

            This.radio.on("click", function () {
                var val = This.radio.filter(":checked").val();
                model.set("noticeType", val);
            })

            model.on("change", function () {
                var val = model.get("noticeType");
                This.radio.removeAttr("checked");
                This.radio.filter("[value=" + val + "]").attr("checked", true); //标记选中

                var lastTime = model.get("lastLogin");
                This.lastLogin.html(lastTime);
            });

            //暂时写在这里，等邮件到达通知等全部完成之后，修改到主View中实现
            This.submit.on("click", function () {
				if(top.$User && !top.$User.isNotChinaMobileUser() || ',81,82,83,84,'.indexOf("," + top.UserData.provCode + ",") == -1) {//edit by zsx
                    This.update();
                }  
            });

            model.getSettings(function (result) {
                //获取设置并赋值
                var data = result["var"];
                if (result.code == "S_OK" && data) {
                    model.set({
                        "lastAddr": data.lastLoginAddr,
                        "noticeType": data.notifyType,
                        "lastLogin": data.lastLoginDate,
                        "lastNoticeType": data.notifyType
                    });
                }
                else if (result.code == "S_FALSE") {

                    //取消事件绑定
                    This.submit.off("click");
                    model.off("change");
                }
                else {
                    This.WaitPanel.show(messages.FA_GET_DATA, { delay: 2000 });
                }
            });
        },

        update: function () {
            var This = this;
            This.model.update(function (result) {
                var messages = This.messages;
                var tip = messages[result];
                This.WaitPanel.show(tip, { delay: 2000 });
            });
        }

        ,disable: function() {
            this.radio.attr("disabled", "disabled");
            $(".setArea:eq(0)").hide();
        }
    })
    );

    $(function () {
        var noticeView = new M2012.Settings.View.Notice();
    });
})(jQuery, _, M139);
﻿(function ($, _, M) {

    M139.namespace('M2012.Settings.Model.MailNotice', Backbone.Model.extend({

        logger: new M.Logger({ name: "setting.mailnotice.model" }),

        RANGE_LIMIT: 5,

        FROMTYPES: {
            NOCONTACT: 0, //不在通讯录
            CONTACT: 1, //在通讯录
            SOMEONE: 2 //指定的人（即例外情况）
        },

        getExceptLimit: function () {
            var exceptLimit = 50; //最多可添加的例外条数
            return exceptLimit;
        },

        initialize: function () {
            var _this = this;

            _this.on("fetch", _this.fetch);
            _this.on("save", _this.save);

            //主开关操作
            _this.on("majorenable_rendering", _this.onMajorSwitchRendering);
            _this.on("change:majorswitch", _this.onMajorSwitchChange);

            //主补发操作
            _this.on("majorsupply_rendering", _this.onMajorSupplyRendering);
            _this.on("change:majorsupply", _this.onMajorSupplyChange);
            
            // add by tkh 订阅邮件开关
            _this.on("mpostnotice_rendering", _this.onMpostNoticeRendering);
            _this.on("change:mpostnotice", _this.onMpostNoticeChange);

            //主接收方式
            _this.on("notifytype_rendering", _this.onNotifyTypeRendering);
            _this.on("noticetypechange", _this.onNoticeTypeChange);
            _this.on("noticeTypeChanged", _this.onNoticeTypeChanged);

            //主时段操作
            _this.on("majortimerange_rendering", _this.onMajorRangeListing);
            _this.on("TimeRangeExpanding", _this.onMajorRangeDetailing);
            _this.on("MajorRangeAdding", _this.onMajorRangeAdding);
            _this.on("MajorTimespanRemoving", _this.onMajorRangeRemoving);
            _this.on("MajorRangeModifing", _this.onMajorRangeModifing);

            //例外情况
            _this.on("exceptlist_rendering", _this.onExceptlistRendering);
            _this.on("exceptdetailrendering", _this.onExceptDetailRendering);
            _this.on("exceptmodifying", _this.onExceptModifying);
            _this.on("exceptdeleting", _this.onExceptRemoving);
            _this.on("exceptadding", _this.onExceptAdding);
            _this.on("exceptadded", _this.onExceptAdded);
            _this.on("emailadding", _this.onEmailSelecting);
        },

        //#region //{ 主开关与补发开关模块

        /**
        * 当呈现主开关时，计算需要给出的数据
        * @param {Function} onrender 绘制回调函数
        */
        onMajorSwitchRendering: function (onrender) {
            var _this = this;
            var from = _this.FROMTYPES;
            var data = _this.get("mailNotify");

            var totalenable = $.grep(data, function (i) {
                return (i.fromtype == from.NOCONTACT || i.fromtype == from.CONTACT) && i.enable;
            }).length >= 2;

            onrender(totalenable);
        },

        /**
        * 修改主开关时，更新数据源
        * @param {Object} model 本Model
        * @param {Object} value 新的值
        */
        onMajorSwitchChange: function (model, value) {
            model.logger.debug("onMajorSwitchChange", value, typeof value);
            var from = model.FROMTYPES;
            var data = model.get("mailNotify");

            $.each(data, function (i, n) {
                if (n.fromtype === from.CONTACT || n.fromtype === from.NOCONTACT) {
                    n.enable = value;
                }
            });

            model.set("mailNotify", data);
        },

        /**
        * 当呈现补发标志时，计算需要给出的数据
        * @param {Function} onrender 绘制回调函数
        */
        onMajorSupplyRendering: function (onrender) {
            var _this = this;
            var from = _this.FROMTYPES;
            var data = _this.get("mailNotify");

            var totalsupply = $.grep(data, function (i) {
                return (i.fromtype == from.NOCONTACT || i.fromtype == from.CONTACT);
            });

            from = true;
            $.each(totalsupply, function (n, i) {
                from = from && i.supply;
            });
            totalsupply = from;

            onrender(totalsupply);
        },

        /**
        * 修改补发标志时，更新数据源
        * @param {Object} model 本Model
        * @param {Object} value 新的值
        */
        onMajorSupplyChange: function (model, value) {
            model.logger.debug("onMajorSupplyChange", value, typeof value);
            var from = model.FROMTYPES;
            var data = model.get("mailNotify");

            $.each(data, function (i, n) {
                if (n.fromtype === from.CONTACT || n.fromtype === from.NOCONTACT) {
                    n.supply = value;
                }
            });

            model.set("mailNotify", data);
        },
        
        /**
        * 当呈现订阅邮件投递状态时，计算需要给出的数据
        * @author tkh
        * @param {Function} onrender 绘制回调函数
        */
        onMpostNoticeRendering : function (onrender) {
            var _this = this;
            var from = _this.FROMTYPES;
            var data = _this.get("mailNotify");

            var totalsupply = $.grep(data, function (i) {
                return (i.fromtype == from.NOCONTACT || i.fromtype == from.CONTACT);
            });

            from = true;
            $.each(totalsupply, function (n, i) {
                from = from && i.syncDy;
            });
            totalsupply = from;

            onrender(totalsupply);
        },
        
        /**
        * 修改订阅邮件投递状态时，更新数据源
        * @author tkh
        * @param {Object} model 本Model
        * @param {Object} value 新的值
        */
        onMpostNoticeChange : function (model, value) {
            model.logger.debug("onMpostNoticeChange", value, typeof value);
            var from = model.FROMTYPES;
            var data = model.get("mailNotify");

            $.each(data, function (i, n) {
                if (n.fromtype === from.CONTACT || n.fromtype === from.NOCONTACT) {
                    n.syncDy = value;
                }
            });

            model.set("mailNotify", data);
        },

        //#endregion //} 主开关与补发开关模块结束

        //#region //{ 主接收方式模块

        /**
        * 当呈现在主接收方式时，计算需要给出的数据
        * @param {Number} fromtype 需要给出邮件来源分类的编码
        * @param {Function} onrender 绘制回调函数
        */
        onNotifyTypeRendering: function (fromtype, onrender) {
            var _this = this;
            var from = _this.FROMTYPES;
            var data = _this.get("mailNotify");

            data = $.grep(data, function (i) {
                return i.fromtype == fromtype;
            });

            if (data.length > 0) {
                data = data[0];
                onrender(data.notifytype);
            }

            _this.onNoticeTypeChanged();
        },

        /**
        * 点击更换主接收方式时，更新数据源
        * @param {Object} args 参数表
        */
        onNoticeTypeChange: function (args) {
            var data = this.get("mailNotify");
            var from = this.FROMTYPES;

            for (var i = data.length; i--; ) {
                if (data[i].fromtype === args.type) {
                    data[i].notifytype = args.value;
                    break;
                }
            }

            this.logger.debug("noticeTypeChanged", args, data);
            this.trigger("noticeTypeChanged", data);
        },

        /**
        * 更换主接收方式后，通知视图开启或关闭时段
        * @param {Object} data 最新的数据
        */
        onNoticeTypeChanged: function () {
            var data = this.get("mailNotify");
            var from = this.FROMTYPES;

            var list = $.grep(data, function (i) {
                return i.fromtype === from.NOCONTACT || i.fromtype === from.CONTACT;
            });

            var every = true;
            $.each(list, function () {
                every = every && this.notifytype === 0;
            });

            this.trigger("noticeTypeClosed", every);
        },

        //#endregion //} 主接收方式模块结束

        //#region //{ 主时段操作模块

        /**
        * 当呈现主时段列表时，计算需要给出的数据
        * @param {Function} onrender 绘制回调函数
        */
        onMajorRangeListing: function (onrender) {
            var _this = this;
            var from = _this.FROMTYPES;
            var data = _this.get("mailNotify");

            data = $.grep(data, function (i) {
                return i.fromtype == from.CONTACT;
            });

            if (data.length > 0) {
                data = data[0];

                var viewData = {
                    timerange: data.timerange,
                    lockdelete: data.timerange.length < 2,
                    lockadd: data.timerange.length >= _this.RANGE_LIMIT
                };

                onrender(viewData);
            }
        },

        /**
        * 当呈现某个主时段详情时，计算需要给出的数据
        * @param {Object} args 参数表
        */
        onMajorRangeDetailing: function (args) {
            var _this = this, data, from, row, tid;

            data = _this.get("mailNotify");
            from = _this.FROMTYPES;
            tid = args.tid;

            _this.logger.debug("onMajorRangeDetailing|tid=", tid);

            for (var i = data.length; i--; ) {
                for (var j = data[i].timerange.length; j--; ) {
                    if (data[i].timerange[j].tid === tid) {
                        row = $.extend({}, data[i].timerange[j]);
                        break;
                    }
                }
                if (row) { break; }
            }

            row.weekDiscription = _this._getWeekRange(row);
            row.timeDiscription = _this._getTime(row);

            data = row.weekday.split(",");
            row.weekday = $.map(data, function (i) { return Number(i); });

            if ($.isFunction(args.success)) {
                args.success(row);
            }
        },

        /**
        * 增加一个主时段
        * @param {Object} args 参数表
        */
        onMajorRangeAdding: function (args) {
            var _this, from, data, value, range, i, needlock;

            _this = this;
            needlock = false;
            from = _this.FROMTYPES;
            data = _this.get("mailNotify");
            value = args.value;

            _this.logger.debug("onMajorTimespanSaving", args);

            //取出（联系人与非联系人）的下标
            var targetIndex = [];
            for (i = data.length; i--; ) {
                if (data[i].fromtype === from.CONTACT || data[i].fromtype === from.NOCONTACT) {
                    targetIndex.push(i);
                }
            }

            //无数据时报异常
            if (targetIndex.length == 0) {
                if (args.success) args.success({ code: "ER_NODATA", "range": null, "needlock": needlock });
                return;
            }

            range = data[targetIndex[0]].timerange;
            //判断是否已达到最大时段数
            if (range.length + 1 >= _this.RANGE_LIMIT) {
                needlock = true;
            }

            //判断时段是否重复
            for (i = range.length; i--; ) {
                if (_this._rangecompare(range[i], value)) {
                    if (args.success) args.success({ code: "ER_EXISTS", "range": range[i], "needlock": needlock });
                    return;
                }
            }

            //添加时段
            for (i = targetIndex.length; i--; ) {
                var maxrangeid = _this._maxId($.map(data[targetIndex[i]].timerange, function (j) {
                    return _this._tid(j.tid).rangeindex;
                }));
                _this.logger.debug("maxrangeid", maxrangeid);

                range = {
                    "tid": _this._tid(data[targetIndex[i]].fromtype, targetIndex[i], maxrangeid + 1), //fromtype, notifyindex, rangeindex
                    "begin": value.begin,
                    "end": value.end,
                    "weekday": value.weekday
                };
                range.discription = _this.getTimeRange(range);

                data[targetIndex[i]].timerange.push(range);
            }

            _this.trigger("save", function (rs) {
                if (args.success) {
                    args.success({ code: "S_OK", "range": range, "needlock": needlock });
                }
            });
        },

        /**
        * 删除一个主时段
        * @param {Object} args 参数表
        */
        onMajorRangeRemoving: function (args) {
            var _this, from, data, tid, hasRange, needlock, canAdd;

            _this = this;
            from = _this.FROMTYPES;
            tid = _this._tid(args.tid);
            data = _this.get("mailNotify");

            _this.logger.debug("onMajorRangeRemoving", args);

            for (var i = data.length; i--; ) {
                if (data[i].fromtype == from.SOMEONE) {
                    continue;
                }

                for (var j = data[i].timerange.length; j--; ) {
                    if (tid.rangeindex == _this._tid(data[i].timerange[j].tid).rangeindex) {
                        data[i].timerange.splice(j, 1);
                        break;
                    }
                }
            }

            hasRange = $.grep(data, function (i) {
                return i.fromtype === from.CONTACT;
            })[0].timerange;

            needlock = false;
            if (hasRange.length < 2) {
                needlock = true;
            }

            canAdd = false;
            if (hasRange.length < _this.RANGE_LIMIT) {
                canAdd = true;
            }

            _this.trigger("save", function (rs) {
                if (args.success) {
                    args.success({ code: rs.code, "tid": args.tid, "needlock": needlock, "canAdd": canAdd });
                }
            }, true);
        },

        /**
        * 修改一个主时段
        * @param {Object} args 参数表
        */
        onMajorRangeModifing: function (args) {
            var _this, from, data, value, tid, range;

            _this = this;
            from = _this.FROMTYPES;
            data = _this.get("mailNotify");
            value = args.value;
            tid = _this._tid(value.tid);

            _this.logger.debug("onMajorRangeModifing", args);

            //取出（联系人与非联系人）的下标
            var targetIndex = [];
            for (i = data.length; i--; ) {
                if (data[i].fromtype === from.CONTACT || data[i].fromtype === from.NOCONTACT) {
                    targetIndex.push(i);
                }
            }

            //无数据时报异常
            if (targetIndex.length == 0) {
                if (args.success) args.success({ code: "ER_NODATA", "range": null });
                return;
            }

            range = data[targetIndex[0]].timerange;
            //判断是否已达到最大时段数
            if (range.length + 1 >= _this.RANGE_LIMIT) {
                needlock = true;
            }

            //判断时段是否重复
            for (i = range.length; i--; ) {
                if (_this._rangecompare(range[i], value) && range[i].tid != value.tid) {
                    if (args.success) args.success({ code: "ER_EXISTS", "range": range[i] });
                    return;
                }
            }

            //修改时段
            for (i = targetIndex.length; i--; ) {
                for (var j = data[targetIndex[i]].timerange.length; j--; ) {
                    if (tid.rangeindex == _this._tid(data[targetIndex[i]].timerange[j].tid).rangeindex) {
                        range = {
                            "tid": value.tid,
                            "begin": value.begin,
                            "end": value.end,
                            "weekday": value.weekday
                        };
                        range.discription = _this.getTimeRange(range);

                        data[targetIndex[i]].timerange[j] = range;
                        break;
                    }
                }
            }

            _this.trigger("save", function (rs) {
                if (args.success) {
                    args.success({ code: rs.code, "range": range });
                }
            });
        },

        //#endregion //} 主时段操作模块结束

        //#region //{ 例外情况操作模块

        /**
        * 当呈现例外情况列表时，计算需要给出的数据
        * @param {Function} args 参数表
        */
        onExceptlistRendering: function (args) {
            var _this = this;
            var from = _this.FROMTYPES;
            var data = _this.get("mailNotify");
            var pageIndex = _this.get("exceptPage");
            var PAGESIZE = 20;
            if (typeof (pageIndex) == "undefined") {
                pageIndex = 0;
            }

            data = $.grep(data, function (i) {
                return i.fromtype == from.SOMEONE;
            });

            var pagecount = Math.ceil(data.length * 1.0 / PAGESIZE);

            var pagecmd = args.pagecmd;

            if (pagecmd === "next") {
                pageIndex++;
                _this.set({ exceptPage: pageIndex });

            } else if (pagecmd === "last") {
                pageIndex = pagecount - 1;
                _this.set({ exceptPage: pageIndex });

            } else if (pagecmd === "first") {
                _this.set({ exceptPage: 0 });

            } else if (pagecmd === "current") {

            }

            if (pageIndex + 1 > pagecount) {
                //可能是删除例外情况，导致已经翻到最后一页时，页码超出总页数
                pageIndex = pagecount - 1;
            }

            var showmore = false;
            if (pageIndex + 1 < pagecount) {
                showmore = true;
            }

            var excepts = data.slice(0, (pageIndex + 1) * PAGESIZE);
            var viewdata = { "exceptlist": excepts, "pagecount": pagecount, "showmore": showmore };

            args.success(viewdata);
        },

        /**
        * 显示例外详细设置时，计算需要给出的数据
        * @param {Object} args 需要给出的参数
        */
        onExceptDetailRendering: function (args) {
            var _this, data, notifyid;

            _this = this;
            data = _this.get("mailNotify");
            notifyid = args.notifyid;

            _this.logger.debug("show except detail", args, data);

            var value = {};

            for (var i = data.length; i--; ) {
                if (data[i].notifyid === notifyid) {
                    $.extend(value, data[i]);
                }
            }

            var result = {
                "value": value
            };

            if ($.isFunction(args.success)) {
                args.success(result);
            }
        },

        /**
        * 添加邮件地址时，对比数据源是否已有该地址
        * @param {Object} args 需要给出的参数
        */
        onEmailSelecting: function (args) {
            var _this, from, data, list, existMap, i, repeatId;

            _this = this;
            from = _this.FROMTYPES;
            data = _this.get("mailNotify");
            list = args.emaillist;

            _this.logger.debug("onExceptSelecting", args, data);

            existMap = {};
            for (i = data.length; i--; ) {
                for (var j = data[i].emaillist.length; j--; ) {
                    existMap[data[i].emaillist[j]] = data[i].notifyid;
                }
            }

            repeatId = [];
            for (i = list.length; i--; ) {
                for (var j in existMap) {
                    if ($Email.compare(j, list[i])) {
                        repeatId.push(existMap[j]);
                    }
                }
            }

            for (i = list.length; i--; ) {
                for (var j in existMap) {
                    if (/^@.*/.test(list[i]) && list[i] == j) {
                        repeatId.push(existMap[j]);
                    }
                }
            }

            if (repeatId.length > 0) {
                if ($.isFunction(args.error)) {
                    args.error(repeatId);
                }
            } else {
                if ($.isFunction(args.success)) {
                    args.success(repeatId);
                }
            }
        },

        /**
        * 修改某个例外情况的详细设置
        * @param {Object} args 需要给出的参数
        */
        onExceptModifying: function (args) {
            var _this = this;
            var value = args.value;
            var data = _this.get("mailNotify");

            var param = $.extend({}, args.value);

            M.RichMail.API.call("user:modifyMailNotifyExcp", param, function (response) {
                _this.logger.debug("except notify saved", "model.mailnotice.js", 106, response);
                var rs = response.responseData;

                if (rs) {
                    if (rs.code === "S_FALSE") {
                        _this.trigger("sessiontimeout", rs.summary);
                    } else if (rs.code === "S_OK") {
                        if ($.isFunction(args.success)) {
                            args.success({ "success": true, "code": rs.code });
                        }

                        for (var i = data.length; i--; ) {
                            if (data[i].notifyid == value.notifyid) {
                                data[i] = param;
                                break;
                            }
                        }

                        return;
                    }
                }

                if ($.isFunction(args.success)) {
                    args.success({ "success": false, "code": rs.code });
                }
            });
        },

        /**
        * 添加例外情况，并更新数据源
        * @param {Object} args 需要给出的参数
        */
        onExceptAdding: function (args) {
            var _this, data, value, from, tid, hasRange, limit, i, m;

            _this = this;
            data = this.get("mailNotify");
            from = this.FROMTYPES;
            limit = _this.getExceptLimit();
            value = args.value;
            m = 0;

            _this.logger.debug("onExceptAdding", args, data);

            for (var i = data.length; i--; ) {
                if (data[i].fromtype === from.SOMEONE) {
                    m++
                }
            }

            if (m + value.emaillist.length > limit) {
                //不可再添加
                if ($.isFunction(args.success)) {
                    args.success({ "success": false, "code": "ER_OVERFLOW" });
                    return;
                }
            }

            _this.trigger("save", function (rs) { });

            _this.on("fetchsuccess", function (rs) {
                if ($.isFunction(args.success)) {
                    args.success({ "success": true });
                }
            });

            var param = $.extend({}, args.value);
            param.timerange = [param.timerange];

            M.RichMail.API.call("user:addMailNotifyExcp", param, function (response) {
                _this.logger.debug("mailnotify saved", "model.mailnotice.js", 592, response);
                var rs = response.responseData;

                if (rs) {
                    if (rs.code === "S_FALSE") {
                        _this.trigger("sessiontimeout", rs.summary);
                    } else if (rs.code === "S_OK") {
                        _this.trigger("fetch");
                    } else {
                        if ($.isFunction(args.success)) {
                            args.success({ "success": false, "code": rs.code });
                        }
                    }
                }
            });
        },

        /**
        * 添加例外情况后，计算出新添加的数据行
        * @param {Object} args 需要给出的参数
        */
        onExceptAdded: function (args) {
            var _this, data, value, from, i;

            _this = this;
            data = this.get("mailNotify");
            from = this.FROMTYPES;
            value = args.value;

            var hash = {};
            for (i = value.length; i--; ) {
                hash[value[i]] = true;
            }

            var list = $.grep(data, function (i, n) {
                return !!hash[i.emaillist[0]];
            });

            args.success(list);
        },

        /**
        * 删除例外设置时，更新数据源
        * @param {Object} args 需要给出的参数
        */
        onExceptRemoving: function (args) {
            var _this, data, notifyid;

            _this = this;
            data = _this.get("mailNotify");
            notifyid = args.notifyid;

            _this.logger.debug("onExceptRemoving", args, data);

            for (var i = data.length; i--; ) {
                if (data[i].notifyid === notifyid) {
                    data.splice(i, 1);
                    break;
                }
            }

            var param = { "notifyid": args.notifyid };

            _this.trigger("deleting");
            M.RichMail.API.call("user:delMailNotifyExcp", param, function (response) {
                _this.trigger("deleted");
                var rs = response.responseData;
                if (rs && rs.code === "S_OK") {
                    if ($.isFunction(args.success)) {
                        args.success(rs);
                    }
                    return;
                }

                if ($.isFunction(args.error)) {
                    args.error(rs);
                }
                _this.logger.error("remove mailnotify errored", "model.mailnotice.js", 565, response);
            });
        },

        //#endregion //} 例外模块结束

        //#region //{ 数据源操作模块

        /**
        * 格式化中间件数据
        * @param {Object} data
        * @param {Object} onread
        */
        readNotify: function (data, onread) {
            var _this = this;

            $.each(data, function (notifyindex, m) {
            	if(typeof m.syncDy === 'undefined'){ // add by tkh
            		m.syncDy = true;
            	}
            	
                $.each(m.timerange, function (rangeindex, n) {
                    n.discription = _this.getTimeRange(n);
                    n.tid = _this._tid(m.fromtype, notifyindex, rangeindex);
                })
            });

            _this.set("mailNotify", data);

            if ($.isFunction(onread)) {
                onread(data);
            }
        },

        /**
        * 从服务端拉取数据
        * @param {Object} evtHnd
        */
        fetch: function (evtHnd) {
            var _this = this;
            _this.trigger("fetching");

            M.RichMail.API.call("user:getMailNotify", {}, function (response) {
                _this.trigger("fetched");

                if (response.responseData) {
                    if (response.responseData.code === "S_OK") {
                        _this.readNotify(response.responseData["var"], function (rs) {
                            _this.trigger("fetchsuccess", rs);
                        })
                    } else {
                        _this.trigger("fetcherrored", response);
                        _this.logger.error("read mailnotify error", "model.mailnotice.js", 663, response);
                    }
                } else {
                    _this.trigger("fetcherrored", response);
                    _this.logger.error("read mailnotify failed", "model.mailnotice.js", 667, response);
                }
            }, function (error) {
                _this.trigger("fetcherrored", error);
                _this.logger.error("read mailnotify failed", "model.mailnotice.js", 671, error);
            });

            $RM.getAttrs({}, function (response) {
                if (response.code === "S_OK") {
                    response = response["var"];
                    if (response && response["_custom_SmsNotify"]) {
                        _this.set({ popnotify: Number(response["_custom_SmsNotify"]) });
                        _this.trigger("fetched:popnotify", response["_custom_SmsNotify"]);
                    }
                }
            });

        },

        save: function (callback, isdelete) {
            var _this, from, data, value, hasRange, needlock;
            _this = this;
            data = this.get("mailNotify");
            if (isdelete) {
                _this.trigger("deleting");
            } else {
                _this.trigger("saving", data);
            }

            M.RichMail.API.call("user:updateMailNotify", { "mailnotify": data }, function (response) {
                if (isdelete) {
                    _this.trigger("deleted");
                } else {
                    _this.trigger("saved", data);
                }
                _this.logger.debug("mailnotify saved", "model.mailnotice.js", 684, response);

                if (response.responseData) {
                    if (response.responseData.code === "S_FALSE") {
                        _this.trigger("sessiontimeout", response.responseData.summary);
                    }

                    if ($.isFunction(callback)) {
                        callback(response.responseData);
                    }
                    
                    // add by tkh 刷新顶层变量  
	                top.$App.initMainInfoData();
                }
            });

            var popnotify = _this.get("popnotify");
            if (typeof (popnotify) === "undefined") {
                popnotify = 0;
            }

            var param = {
                attrs: {
                    _custom_SmsNotify: Number(popnotify)
                }
            }

            $RM.setAttrs(param, function (response) {
                _this.logger.debug("popnotify saved", "model.mailnotice.js", 783, response);
            });
        },

        //#endregion //} 数据源同步模块

        //#region //{ 时段辅助模块

        _tid: function (tid) {
            if (arguments.length > 1) {
                return (function (fromtype, notifyindex, rangeindex) {
                    return ["tid", fromtype, notifyindex, rangeindex].join("_");
                }).apply(this, arguments);
            }

            tid = tid.split("_");
            return { "fromtype": parseInt(tid[1]), "notifyindex": parseInt(tid[2]), "rangeindex": parseInt(tid[3]) };
        },

        _maxId: function (array) {
            return array.sort(function (a, b) { return b - a })[0];
        },

        _rangecompare: function (range1, range2) {
            return range1.begin === range2.begin && range1.end === range2.end && range1.weekday === range2.weekday;
        },

        _weekmsg: ["每天", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],

        getTimeRange: function (timeRange) {
            return this._getWeekRange(timeRange) + "，" + this._getTime(timeRange); //每天，8:00~21:00
        },

        _getWeekRange: function (timeRange) {
            var weekDay = this._weekmsg;
            var result = "1234567";

            var week = timeRange.weekday || timeRange;

            var arrWeek = week.split(',');


            if (week && typeof (week) == "string") {
                week = week.replace(/[^\d]/g, "");

                if (week == result) { //每天
                    week = [];
                    result = weekDay[0];
                } else if (week.length >= 3 && result.indexOf(week) > -1) {
                    //表示有三个连续星期几
                    result = weekDay[arrWeek[0]] + "至" + weekDay[arrWeek[arrWeek.length - 1]];
                    week = "";
                } else {
                    result = [];
                    for (var i = 0; i < arrWeek.length; i++) {
                        var index = arrWeek[i];
                        result.push(weekDay[index]);
                    }
                    result = result.join("，");
                }
            }
            return result; //转化成可读的日期格式
        },

        _getTime: function (timeRange) {
            var desc = ":00 ~ " + timeRange.end + ":00";
            if (typeof (timeRange.begin) == "undefined") {
                desc = timeRange.start + desc;
            } else {
                desc = timeRange.begin + desc;
            }
            return desc;
        }

        //#endregion //} 时段辅助模块结束

    })
    )
})(jQuery, _, M139);
﻿/**
*邮件到达通知主View
*/
(function ($, _, M) {
    var superClass = M139.View.ViewBase;

    M139.namespace('M2012.Settings.View.MailNotice', superClass.extend({
        logger: new M.Logger({ name: "setting.mailnotice.view" }),

        messages: {
            UNKNOW: "获取数据失败",
            SESSIONTIMEOUT: "太久没操作，请重新登录",
            updateLevel: '短信邮件为5元版与20元版邮箱专属功能。立即升级，重新登录即可使用。'
        },

        FROMTYPES: {
            NOCONTACT: 0, //不在通讯录
            CONTACT: 1, //在通讯录
            SOMEONE: 2 //指定的人（即例外情况）
        },

        el: "body",
        name: "MailNotice",
        expandSpan: [],
        events: {
            "click .j_modTimeSpan": "showTimeSpanPanel",
            "click .j_delTimeSpan": "removeMajorTimeRange",
            "click #btnAddMajorRange": "showRangeAddtionPanel"
        },

        initialize: function () {
            var _this = this;

            if (top.$User) {
                if (top.$User.isInternetUser()) {
                    top.$User.showMobileLimitAlert();
                    top.$App.closeTab("notice");
                    return;
                }
            } else if (',83,84,'.indexOf("," + top.UserData.provCode + ",") > -1) {
                top.FF.alert("尊敬的用户：您暂时无法使用本功能。如需使用完整功能，请使用中国移动手机开通139邮箱。");
                top.MM.goBack();
                return;
            }

            _this.submit = $("#btnSubmit");
            _this.cancel = $("#btnCancel");
            _this.btnAddMajorRange = $("#btnAddMajorRange");
            _this.majorRangeTable = $("table#MajorTimeRange");
            _this.model = new M2012.Settings.Model.MailNotice();
            _this.viewNotice = new M2012.Settings.View.Notice();
            _this.viewExcept = new M2012.Settings.View.ExceptNotice({ model: _this.model });
            $(".j_disablepanel").hide();

            var model = _this.model;

            model.on("sessiontimeout", function (summary) {
                _this.onsessionout(summary);
            });

            model.on("userLevelError", function (data) {
                _this.render(data);
                _this.userLevelError(data);
            });

            model.on("fetching", function () {
                _this.onfetching();
            });

            model.on("fetched", function (rs) {
                _this.onfetched(rs);
            });

            model.on("fetcherrored", function (rs) {
                _this.onfetcherrored(rs);
            });

            model.on("fetchsuccess", function (rs) {
                _this.render(rs);
            });

            model.on("fetched:popnotify", function (rs) {
                _this.renderPopNotify(rs);
            });

            model.on("saving", function (data) {
                _this.onsaving(data);
            });

            model.on("saved", function () {
                _this.onsaved();
            });

            model.on("deleting", function (data) {
                _this.ondeleting(data);
            });

            model.on("deleted", function () {
                _this.ondeleted();
            });

            model.on("noticeTypeClosed", function (closed) {
                _this.onNoticeTypeClosed(closed);
            });

            model.fetch();
        },

        /**
        * 呈现添加整体时段设置面板
        * @param {EventArgs} e jQuery事件对象
        */
        showRangeAddtionPanel: function (e) {
            var _this = this;
            var tid = "tid_addtion";

            if (_this.expandSpan[tid]) { return; }

            var panel = $("#majorRangeField");
            panel.parent().removeClass("hide");

            var majortable = _this.majorRangeTable;

            var rangePicker = new M2012.Settings.View.TimeRangeSelector({
                container: panel, value: { tid: tid }
            });

            rangePicker.on("cancel", function () {
                _this.logger.debug("Major Timespan Add canceled");
                panel.parent().addClass("hide");
                delete _this.expandSpan[tid];
            })

            rangePicker.on("submit", function (args) {
                _this.logger.debug("Major Timespan Add submited", args);
				var notifyTypeMenuContact = $("#notifyTypeMenuContact").text();
				var notifyTypeMenuNoContact = $("#notifyTypeMenuNoContact").text();
				var ServiceItem = '';
				if(top.$User){
					ServiceItem = top.$User.getServiceItem();
				}else{
					ServiceItem = top.UserData.serviceItem;
				}
				if((notifyTypeMenuContact == "短信邮件" || notifyTypeMenuNoContact =="短信邮件") && (ServiceItem == '0010' || ServiceItem == '0015')){
					var confirm = top.$User? top.$Msg.confirm : top.FF.confirm;
					confirm(_this.messages.updateLevel,
                        function () {
                            if (top.$User) { top.$App.show("mobile") } else { top.Links.show('orderinfo') };
                        });
						return;
				}
                var param = args.value;

                _this.model.trigger("MajorRangeAdding", { "value": param, "success": function (rs) {
                    _this.logger.debug("MajorTimespanSaved", rs);

                    if (rs.code === "S_OK") {
                        if (_this.expandSpan[tid]) {
                            delete _this.expandSpan[tid];
                        }

                        args.success();
                        panel.parent().addClass("hide");

                        if (rs.needlock) {
                            _this.btnAddMajorRange.hide();

                            if (_this.btnAddMajorRange.next().is("span:contains('添加')")) {
                                _this.btnAddMajorRange.next().show();
                            } else {
                                _this.btnAddMajorRange.after($("<span class='gray'>添加</span>"));
                            }
                        }

                        $(".j_delTimeSpan").removeClass("hide");

                        var row = $(_this.TEMPL_RANGE(rs.range)).hide();

                        majortable.append(row);
                        row.fadeIn("slow", function () {
                            row.removeAttr("style");
                        });
                    } else if (rs.code == "ER_EXISTS") {
                        _this.WaitPanel.show("已存在同样的时间段，请修改", { delay: 2000 });
                        majortable.find("tr#major_range_" + rs.range.tid)
                        .css({ backgroundColor: "#fe9" })
                        .animate({ backgroundColor: "#fff" }, 1000);
                    }

                }
                });
            })

            _this.expandSpan[tid] = true;
            _this.logger.debug("RangeAddtionPanel expanding", e);
        },

        /**
        * 呈现修改整体时段设置面板
        * @param {EventArgs} e jQuery事件对象
        */
        showTimeSpanPanel: function (e) {
            var tid, row, _this, panel, majortable;
            _this = this;
            majortable = _this.majorRangeTable;

            tid = $(e.currentTarget).data("tid");
            if (_this.expandSpan[tid]) {
                return;
            }

            row = majortable.find("tr#major_range_" + tid);

            panel = $('<tr><td colspan="2" style="padding-left:0;"></td></tr>');

            _this.model.trigger("TimeRangeExpanding", { "tid": tid, "success": function (rs) {
                _this.logger.debug("renderTimeRangeExpanding", rs);

                var rangePicker = new M2012.Settings.View.TimeRangeSelector({
                    container: panel.children(), value: { tid: tid, begin: rs.begin, end: rs.end, weekday: rs.weekday.join() }
                });

                rangePicker.on("cancel", function () {
                    _this.logger.debug("Major Timespan modify canceled");
                    delete _this.expandSpan[tid];
                    panel.remove();
                });

                rangePicker.on("submit", function (args) {
                    _this.logger.debug("Major Timespan modify submited", args);

                    var param = args.value;

                    _this.model.trigger("MajorRangeModifing", { "value": param, "success": function (rs) {
                        _this.logger.debug("MajorTimespanSaved", rs);

                        if (rs.code === "S_OK") {
                            args.success();
                            panel.remove();
                            $(row).find("#desc_" + rs.range.tid).text(rs.range.discription);
                            delete _this.expandSpan[tid];
                        } else if (rs.code == "ER_EXISTS") {
                            _this.WaitPanel.show("已存在同样的时间段，请修改", { delay: 2000 });
                            majortable.find("tr#major_range_" + rs.range.tid)
                            .css({ backgroundColor: "#fe9" })
                            .animate({ backgroundColor: "#fff" }, 1000);
                        }
                    }
                    });
                });

                panel.insertAfter(row);
            }
            });

            _this.expandSpan[tid] = true;
        },

        removeMajorTimeRange: function (e) {
            var _this = this;
            var tid = $(e.target).data("tid");

            _this.logger.debug("MajorTimeRange removing", tid);

            var row = _this.majorRangeTable.find("tr#major_range_" + tid);

            _this.model.trigger("MajorTimespanRemoving", { "tid": tid, "success": function (rs) {
                _this.logger.debug("renderMajorTimespanRemoved", rs);
                if (rs.code === "S_OK") {

                    var panel = row;
                    if (_this.expandSpan[tid]) {
                        delete _this.expandSpan[tid];
                        panel = row.next("tr").andSelf(); //移除修改时段面板
                    }

                    panel.fadeOut(function () {
                        if (panel) panel.remove();
                        panel = null;
                    });

                    if (rs.needlock) {
                        $(".j_delTimeSpan").addClass("hide");
                    }

                    if (rs.canAdd) {
                        _this.btnAddMajorRange.next("span").remove();
                        _this.btnAddMajorRange.show();
                    }
                }
            }
            });
        },

        WaitPanel: (new M2012.MatrixVM()).createWaitPanel(),

        userLevelError: function (data) {
            var self = this;
            if (top.SiteConfig.mailNotice) {
                if (top.$User) {
                    var userLevel = top.$User.getUserLevel();
                    var provcode = top.$User.getProvCode();
                    var confirmJson = {
                        name: "updateLevel",
                        dialogTitle: "系统提示",
                        icon: "warn"
                    }
                    var confirm = top.$Msg.confirm;
                }
                else {
                    var userLevel = top.UserData.serviceItem;
                    var provcode = top.UserData.provCode;
                    var confirmJson = true;
                    var confirm = top.FF.confirm;
                }
                if ((userLevel == "0010" && provcode == "1") || userLevel == "0015" || userLevel == "0005") {
                    var notifySatus = $.grep(data, function (n, i) {
                        return n.notifytype == 4; //免费用户更改成长短信
                    });
                    console.log(notifySatus.length)
                    if (notifySatus.length > 0) {
                        var msgAlert = confirm(
                        self.messages.updateLevel,
                        function () {
                            if (top.$User) { top.$App.show("mobile") } else { top.Links.show('orderinfo') };
                        },
                        function () {
                            self.model.trigger("fetch");
                        },
                        confirmJson);
                        self.isbusy = false;
                        self.model.set({ userLevelError: true });
                    } else {
                        self.isbusy = false;
                        self.model.set({ userLevelError: false });
                    }
                }
            }
        },

        onfetcherrored: function () {
            this.WaitPanel.hide();
            var tip = this.messages["UNKNOW"];

            if (top.$Msg) {
                top.$Msg.alert(tip);
            } else if (top.Utils && $.isFunction(top.Utils.showTimeoutDialog)) {
                top.Utils.showTimeoutDialog(true)
            }

            //禁用页面可操作元素
            $(".j_disablepanel").hide();
            $(":radio, :checkbox").attr("disabled", true);
            this.submit.unbind("click");
        },

        onsessionout: function () {
            var tip = this.messages["SESSIONTIMEOUT"];
            top.$Msg.alert(tip);
            this.isbusy = false;
        },

        onfetching: function () {
            this.WaitPanel.show("正在加载中...");
        },

        onsaving: function (data) {
            this.WaitPanel.show("正在保存...");
        },

        onfetched: function () {
            this.WaitPanel.hide();
        },

        onsaved: function () {
            this.WaitPanel.hide();
            this.WaitPanel.show("您的设置已保存", { delay: 2000 });
            this.isbusy = false;
        },

        ondeleting: function () {
            this.WaitPanel.show("正在删除...");
        },

        ondeleted: function () {
            this.WaitPanel.hide();
            this.WaitPanel.show("已删除", { delay: 2000 });
            this.isbusy = false;
        },

        onNoticeTypeClosed: function (closed) {
            if (closed) {
                $("#MajorTimeRangePanel").hide();
                if (top.BH) { top.BH("set_notice_type_delete"); }
            } else {
                this.model.trigger("majorenable_rendering", function (enable) {
                    if (enable) {
                        $("#MajorTimeRangePanel").show();
                    }
                });
                if (top.BH) { top.BH("set_notice_type_modify"); }
            }
        },

        render: function (data) {
            var _this = this;
            var model = _this.model;
            var messages = _this.messages;
            var from = _this.FROMTYPES;
            console.log(data)
            _this.logger.debug("mailnotice.view.render", data);

            model.trigger("majorenable_rendering", function (enable) {
                var panel = $("#majorswitch");
                panel.find(":radio[value=" + (enable ? "open" : "close") + "]")
                .attr("checked", "checked");

                if (enable) {
                    $(".j_disablepanel,#li_conversation").show();
                } else {
                    $(".j_disablepanel,#li_conversation").hide();
                }
            });

            $("#majorswitch :radio").click(function (e) {
                var rdo = e.target;
                _this.model.set({ majorswitch: rdo.value == "open" });

                if (rdo.value == "close") {
                    $(".j_disablepanel,#li_conversation").hide();
                    $("#popnotice").removeAttr("checked");
                    $("#popnotice").attr("disabled", "disabled");
                    _this.model.set({ "popnotify": 0 });
                } else {
                    $(".j_disablepanel,#li_conversation").show();
                    $("#popnotice").removeAttr("disabled");
                }
            });

            _this.model.on("change:majorswitch", function (model, isOpened) {
                if (!isOpened) {
                    //显示，是否要添加例外对话框
                    var tipName = "tipOtherExcept"; //单例
                    _this.popup = M139.UI.Popup.create({
                        name: tipName,
                        target: $("#majorswitch :radio")[1],
                        icon: "i_fail",
                        width: 240,
                        buttons: [
                        {
                            text: "添加例外情况",
                            cssClass: "btnSure",
                            click: function () {
                                $("#majorswitch :radio[value='open']").trigger("click");
                                $("#addExceptLink").trigger("click");
                                window.scrollTo(0, $("#addExceptLink").offset().top - 125);
                            }
                        },
                        {
                            text: "关闭邮件到达通知",
                            click: function () {
                                _this.popup.close();
                                _this.popup = false;
                                _this.model.trigger("save");
                            }
                        }
                        ],
                        content: "添加例外情况可只提醒您需要的通知<br>确定关闭所有邮件到达通知吗？"
                    });

                    //直接点 X 关闭
                    _this.popup.on("close", function (args) {
                        if (args.source === "popup_close") {
                            _this.popup = false;
                            _this.model.trigger("save");
                        }
                    });

                    _this.popup.render();
                } else {
                    if (_this.popup) {
                        _this.popup.close();
                    }
                }
            });

            //主要的通知下发方式
            (function (container1, container2) {

                _this.menu1 = new M2012.Settings.View.NotifyMenu({
                    container: container1,
					acceptNotice : true
                });

                _this.menu2 = new M2012.Settings.View.NotifyMenu({
                    container: container2,
					acceptNotice : true
                });

                _this.menu1.on("change", function (value) {
                    model.trigger("noticetypechange", { "type": from.CONTACT, "value": value });
                });

                _this.menu2.on("change", function (value) {
                    model.trigger("noticetypechange", { "type": from.NOCONTACT, "value": value });
                });

                model.trigger("notifytype_rendering", from.CONTACT, function (noticeType) {
                    _this.menu1.model.set({ value: noticeType });
                });

                model.trigger("notifytype_rendering", from.NOCONTACT, function (noticeType) {
                    _this.menu2.model.set({ value: noticeType });
                });

                //主开关开启时，如果通讯录内外均不接收通知，则均改为普通短信
                model.on("change:majorswitch", function (_model, isOpened) {
                    if (!isOpened) {
                        return;
                    }

                    var onAllClosed = function (allClosed) {
                        _model.off("noticeTypeClosed", onAllClosed);

                        if (!allClosed) {
                            return;
                        }

                        var NORMAL_SMS = 1;
                        _this.menu1.model.set({ value: NORMAL_SMS });
                        _this.menu2.model.set({ value: NORMAL_SMS });
                    };

                    _model.on("noticeTypeClosed", onAllClosed);
                    _model.trigger("noticeTypeChanged");
                });

            })($("#notifyTypeMenuContact"), $("#notifyTypeMenuNoContact"));

            //补发选项
            (function (_model, chkSupply) {
                var checked = "checked";
                _model.trigger("majorsupply_rendering", function (issupply) {
                    if (issupply) {
                        chkSupply.attr(checked, checked);
                    } else {
                        chkSupply.removeAttr(checked);
                    }
                });

                chkSupply.click(function () {
                    _model.set({ majorsupply: chkSupply.is(":checked") });
                });
            })(model, $("#mailnotice_supply"));
            
            // add by tkh 订阅邮件选项
            (function (_model, chkMpostnotice) {
                var checked = "checked";
                _model.trigger("mpostnotice_rendering", function (issyncDy) {
                    if (typeof issyncDy === 'undefined' || issyncDy) {
                        chkMpostnotice.attr(checked, checked);
                    } else {
                        chkMpostnotice.removeAttr(checked);
                    }
                });

                chkMpostnotice.click(function () {
                    _model.set({ mpostnotice : chkMpostnotice.is(":checked") });
                    
                    if(chkMpostnotice.is(":checked") && top.BH){
                    	top.BH("set_notice_mpostsubmail");
                    }
                });
            })(model, $("#mpostnotice"));

            //短信聚合显示,added by tiexg 
            (function initConversation() {
                $(data).each(function (i, n) {//data是接口返回的报文，初始化单选框的值
                    if (n["msgConverge"]) {
                        $("#div_conversation input[type=radio]").eq(1).attr("checked","1");
                    }
                });
                $("#div_conversation input[type=radio]").change(function () {
                    var val = $("#div_conversation input[type=radio]:checked").val();
                    var msgConverge=val=="open"?true:false;
                    $(data).each(function (i, n) {  //单选框改变时修改data变量，点击保存时data会直接组报文调用updateNotify接口
                        n["msgConverge"] = msgConverge;
                    });
                });
                var img = $(".mailTipArrived");
                $("#div_conversation label").hover(function () {    //tips图片鼠标交互
                    img.show();
                    if ($(this).attr("name") == "c1") {
                        img.css("top", "0px").find("img").attr("src", "/m2012/images/201312/yjddtz_02.png");
                    } else {
                        img.css("top", "20px").find("img").attr("src", "/m2012/images/201312/yjddtz_01.png");
                    }
                }, function () {
                    img.hide();
                });
            })();
             

            //主要时段
            (function (_table) {
                var on = "on", cmd = ".j_cmd", flag = "major_range_", ROW = "TR";

                _table.mouseover(function (e) {
                    var tr = _this._parent(e.target, ROW);
                    if (tr) {
                        tr = $(tr);
                        if (!tr.hasClass(on) && (tr.attr("id") || "").indexOf(flag) > -1) {
                            $(tr).addClass(on).find(cmd).show();
                        }
                    }
                });

                _table.mouseout(function (e) {
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

                model.trigger("majortimerange_rendering", function (result) {
                    var type = from.CONTACT;
                    var buff = [];
                    var ranges = result.timerange;

                    for (var i = 0; i < ranges.length; i++) {
                        buff.push(_this.TEMPL_RANGE(ranges[i]));
                    }

                    _table.html(buff.join(""));

                    if (result.lockdelete) {
                        $(".j_delTimeSpan").addClass("hide");
                    }

                    if (result.lockadd && _this.btnAddMajorRange.is(":visible")) {
                        _this.btnAddMajorRange.hide();
                        _this.btnAddMajorRange.after($("<span class='gray'>添加</span>"));
                    }
                });

            })(_this.majorRangeTable);

            _this.submit.unbind("click").bind("click", function () {
                if (top.SiteConfig.mailNotice) {
                    _this.model.trigger("userLevelError", data);
                    if (_this.model.get("userLevelError")) {
                        return
                    }
                }
                if (_this.isbusy) {
                    return;
                }
				if(top.$User && !top.$User.isNotChinaMobileUser() || ',81,82,83,84,'.indexOf("," + top.UserData.provCode + ",") == -1){ //edit by zsx
					_this.viewNotice.update();
				}
                
                _this.isbusy = true;
                _this.model.trigger("save", data);
            });
        },

        renderPopNotify: function (isOpened) {
            var _this = this;
            var chkPnotice = $("#popnotice");
            if (isOpened == "1") {
                chkPnotice.attr("checked", "checked");
            } else {
                chkPnotice.removeAttr("checked");
            }

            chkPnotice.click(function () {
                if (!!chkPnotice.attr("checked")) {
                    _this.model.set({ "popnotify": 1 });
                } else {
                    _this.model.set({ "popnotify": 0 });
                }
            });

            _this.logger.debug("popnotice:", isOpened);
        },

        showFailure: function (dom, msg) {
            var tipName = "tipNoticeFailure"; //单例
            var popup = M139.UI.Popup.create({
                name: tipName,
                target: dom[0],
                icon: "i_fail",
                width: 300,
                buttons: [
                {
                    text: "确定",
                    click: function () {
                        popup.close();
                    }
                }],
                content: msg
            });
            popup.render();

            //错误提示5秒后自动隐藏
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(function () {
                try {
                    this.timer = null;
                    popup.close();
                }
                catch (e) { }
            }, 5000);
        },

        _parent: function (el, tagName) {
            tagName = tagName.toUpperCase();
            var _el = el;
            for (var i = 0xFF; i--; ) {
                if (_el == null || "#document" === _el.nodeName) {
                    return false;
                } else if (_el.nodeName === tagName) {
                    break;
                } else {
                    _el = _el.parentNode;
                }
            }
            return _el;
        },

        update: function () {
            var This = this;
            This.model.update(function (result) {
                //更新
                var messages = This.messages;
                var tip = messages.FA_DEFAULT; //设置为默认错误
                var data = result["var"];
                if (result.code == "S_OK") {
                    tip = messages.S_UPDATE;
                } else if (result.code == "S_FALSE") {
                    tip = message.SESSIONTIMEOUT;
                }

                top.M139.UI.TipMessage.show(tip, { delay: 2000 });
            });
        },

        // 视图模板 //{

        TEMPL_RANGE: _.template([
            '<tr id="major_range_<%= tid %>" data-tid="<%= tid %>">',
                '<td id="desc_<%= tid %>"><%= discription %></td>',
                '<td class="td1">',
                    '<a class="j_delTimeSpan j_cmd" data-cmd="delete" data-tid="<%= tid %>" href="javascript:void(0)" style="display:none" bh="set_notice_range_delete">删除</a>',
                    '<span class="j_delTimeSpan j_cmd" style="display:none"> | </span>',
                    '<a class="j_modTimeSpan j_cmd" data-cmd="modify" data-tid="<%= tid %>" href="javascript:void(0)" style="display:none" bh="set_notice_range_modify">修改</a>',
                '</td>',
            '</tr>'].join('')),

        TEMPLATE_TIME_PANEL: ['<tr data-tid="{tid}"><td colspan="2" style="padding-left:0;">',
        '<ul class="form nofitimeset-form j_panel_range_{tid}">',
        '<li class="formLine">',
        '<label class="label">时段：</label>',
        '<div class="element">',
        '<div><input id="timefield" type="text" class="iText" data-value=\'{"start":8,"end":22}\' value="8:00 ~ 22:00" readonly /></div>',
        '<div></div>',
        '</div>',
        '</li>',
        '<li class="formLine">',
        '<label class="label">日期：</label>',
        '<div class="element">',
        '<div data-tid="{tid}" class="weekdiscription">每天</div>',
        '<div>',
        '<ul class="sundaysel">',
        '<li data-day="7"><a href="javascript:void(0)">周日</a></li>',
        '<li data-day="1"><a href="javascript:void(0)">周一</a></li>',
        '<li data-day="2"><a href="javascript:void(0)">周二</a></li>',
        '<li data-day="3"><a href="javascript:void(0)">周三</a></li>',
        '<li data-day="4"><a href="javascript:void(0)">周四</a></li>',
        '<li data-day="5"><a href="javascript:void(0)">周五</a></li>',
        '<li data-day="6"><a href="javascript:void(0)">周六</a></li>',
        '</ul>',
        '</div>',
        '</div>',
        '</li>',
        '</ul>',
        '<div class="tips-btn">',
        '<a data-tid="{tid}" class="btnNormal j_modifyMajorRange" href="javascript:void(0)"><span>确 定</span></a> <a data-tid="{tid}" class="btnNormal j_modTimeSpanCanel" href="javascript:void(0)"><span>取 消</span></a>',
        '</div>',
        '</td></tr>'].join(""),

        TEMPLATE_ADDTIME_PANEL: ['<tr><td style="padding-left:0;">',
        '<ul class="form nofitimeset-form j_panel_range_{tid}">',
        '<li class="formLine">',
        '<label class="label">时段：</label>',
        '<div class="element">',
        '<div><input id="timefield" type="text" class="iText" data-value=\'{"start":8,"end":22}\' value="8:00 ~ 22:00" readonly /></div>',
        '<div></div>',
        '</div>',
        '</li>',
        '<li class="formLine">',
        '<label class="label">日期：</label>',
        '<div class="element">',
        '<div data-tid="{tid}" class="weekdiscription">每天</div>',
        '<div>',
        '<ul class="sundaysel">',
        '<li data-day="7"><a href="javascript:void(0)">周日</a></li>',
        '<li data-day="1"><a href="javascript:void(0)">周一</a></li>',
        '<li data-day="2"><a href="javascript:void(0)">周二</a></li>',
        '<li data-day="3"><a href="javascript:void(0)">周三</a></li>',
        '<li data-day="4"><a href="javascript:void(0)">周四</a></li>',
        '<li data-day="5"><a href="javascript:void(0)">周五</a></li>',
        '<li data-day="6"><a href="javascript:void(0)">周六</a></li>',
        '</ul>',
        '</div>',
        '</div>',
        '</li>',
        '</ul>',
        '<div class="tips-btn">',
        '<a data-tid="{tid}" class="btnNormal j_addMajorRangeSave" href="javascript:void(0)"><span>确 定</span></a> <a data-tid="{tid}" class="btnNormal j_modTimeSpanCanel" href="javascript:void(0)"><span>取 消</span></a>',
        '</div>',
        '</td></tr>'].join("")

        //}

    })
);

    $(function () {
        new M2012.Settings.View.MailNotice();
    });

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
﻿/**
*添加例外的View
*/

(function ($, _, M) {

    
    var matrixVM = new M2012.MatrixVM();

    var superClass = M.View.ViewBase;
    M.namespace('M2012.Settings.View.ExceptNotice', superClass.extend({
        name: "M2012.Settings.View.ExceptNotice",

        message: {
            warn_except_overflow: "最多只能添加$limit$个例外情况",
            error_except_addfailed: "添加例外情况出错",
            updateLevel: '短信邮件为5元版与20元版邮箱专属功能。立即升级，重新登录即可使用。'
        },
        template: {},

        initialize: function (option) {
            var _this = this;

            _this.model = option.model || new M2012.Settings.Model.MailNotice();

            _this.table = $("#listExcept");

            var panel = $("#addExcept");
            _this.exceptDiv = panel;
            _this.richExcept = panel.find("input#richExcept");

            _this.notifyMenu = new M2012.Settings.View.NotifyMenu({
               // container: panel.find("#notifyType"), showClose: false， 去掉，不然少一项目
			   container: panel.find("#notifyType")
            });

            //按钮
            _this.lnkAdd = $("#addExceptLink");
            _this.lnkClose = $("#closeExcept");
            _this.lnkRecent = $("#recentExcept");
            _this.lnkContact = $("#contactExcept, #inputcontactExcept");

            _this.pnlRange = $("#addExceptRangeModify");
            _this.btnAdd = panel.find("a#btnAddExcept");
            _this.btnCancel = panel.find("a#btnCancelExcept");
            _this.result = $("#exceptResult");
            _this.rangepanel = $("#addExceptRangePanel");

            _this.rdoEnable = panel.find("#exceptEnable");
            _this.rdoDisable = panel.find("#exceptDisable");

            _this.initEvents();

            _this.template["recentmail"] = _.template($('#recentmail_template').html());
            _this.template["exceptlist"] = _.template($('#exceptlist_template').html());

            _this.model.on("fetchsuccess", function (rs) {
                _this.flush({ pagecmd: "first" });
            });
        },

        render: function () {
            this._reset();
            this._show();
        },

        _parent: function (el, tagName) {
            tagName = tagName.toUpperCase();
            var _el = el;
            for (var i = 0xFF; i--; ) {
                if (_el == null || "#document" === _el.nodeName) {
                    return false;
                } else if (_el.nodeName === tagName) {
                    break;
                } else {
                    _el = _el.parentNode;
                }
            }
            return _el;
        },

        WaitPanel: matrixVM.createWaitPanel(),
        FF: matrixVM.createFloatingFrame(),

        initEvents: function () {
            var _this = this;
            var model = _this.model;

            /* 按钮点击事件 */
            _this.lnkAdd.on("click", function () { _this.showPanel() });
            _this.lnkClose.on("click", function () { _this._reset(); _this._hide() });

            _this.lnkRecent.on("click", function () { _this.showRecent() });
            _this.lnkContact.on("click", function () { _this.showContact() });

            _this.btnAdd.on("click", function () { _this.onSubmit() });
            _this.btnCancel.on("click", function () { _this._reset(); _this._hide() });

            _this.rdoDisable.on("click", function () { _this.hideField() });
            _this.rdoEnable.on("click", function () { _this.showField() });

            _this.pnlRange.find("A").on("click", function () { _this.showModifyTime() });

            _this.table.on("click", function (e) { _this.onCommand(e) });

            var ROW = "TR";
            _this.table.mouseover(function (e) {
                var tr = _this._parent(e.target, ROW);
                if (tr) {
                    tr = $(tr);
                    if (!tr.hasClass("on")) {
                        $(tr).addClass("on").find(".hide").removeClass("hide");
                    }
                }
            });

            _this.table.mouseout(function (e) {
                var tr1 = _this._parent(e.target, ROW);
                if (tr1 && tr1.tagName === ROW) {
                    if (e.toElement != null) { //e.toElement == null 窗口切换失焦
                        var tr2 = _this._parent(e.toElement, ROW);
                        if (tr2 && tr1.id == tr2.id) {
                            return;
                        }
                    }

                    $(tr1).removeClass("on").find("a").addClass("hide");
                }
            });
        },

        //选不接收时，屏蔽接收方式与接收时间
        hideField: function () {
            this.notifyMenu.close();
            this.exceptDiv.find(".j_disablefield").hide();
        },

        //选接收时，展开接收方式与接收时间
        showField: function () {
            this.notifyMenu.reset();
            this.exceptDiv.find(".j_disablefield").show();
        },

        require: matrixVM.createRequestByScript(),

        //最近收信对话框
        showRecent: function () {
            var _this = this;

            if (!top.appView) {
                var dialog1 = top.FF.open("最近收信", "options_notice_recentmail.htm", 420, 300, true, "", false, false);

                var ifr = dialog1.jContainer.find("iframe")[0];
                ifr.onsuccess = function (addr) {
                    _this.onMailSelect(addr, _this);
                    dialog1.close();
                };

                return;
            }

            _this.require.requestByScript({
                id: "recentmail",
                src: "notice_ext.pack.js",
                charset: "utf-8"
            }, function () {

                var dialog = new top.M2012.UI.Dialog.RecentMail({ "template": _this.template.recentmail });
                dialog.on("success", function (addr) {
                    _this.onMailSelect(addr, _this);
                });
                dialog.trigger("print");
            });
        },

        //联系人选择对话框
        showContact: function () {
            var _this = this;
            var emailList = $.trim(_this.richExcept.val());
            if (emailList.length > 0) {
                emailList = M.Text.Email.splitAddr(emailList);
            } else {
                emailList = [];
            }

            if (!top.appView) {
                top.Utils.openAddressWindow({
                    receiverTitle: "发件人",
                    selectedList: emailList,
                    callback: function (addrs) { _this.onContactSelect(addrs, _this) }
                });
                return;
            }

            var contactView = top.M2012.UI.Dialog.
                AddressBook.create({
                    filter: "email",
                    items: emailList
                });

            contactView.on("select", function (addrs) {
                addrs = addrs.value.join(",");
                addrs = $Email.splitAddr(addrs);
                _this.onContactSelect(addrs, _this);
            });
        },

        onContactSelect: function (addrs, context) {
            addrs = $.map(addrs, function (i) { return $Email.getEmail(i) });
            addrs = M.unique(addrs, function (a, b) { return $Email.compare(a, b) });
            context.richExcept.val(addrs);
        },

        onMailSelect: function (addr, context) {
            var oldValue = context.richExcept.val();
            if (oldValue.length > 0) {
                addr.push(oldValue);
            }
            var lists = addr.join(",");

            lists = $Email.splitAddr(lists);
            lists = $.map(lists, function (i) { return $Email.getEmail(i) });
            lists = M.unique(lists, function (a, b) { return $Email.compare(a, b) });

            context.richExcept.val(lists);
        },

        //修改时间段
        showModifyTime: function () {
            var _this = this;
            var model = _this.model;

            var oldValue = _this.pnlRange.data("range");
            window.console && console.log("showModifyTime...", oldValue);

            _this.pnlRange.hide();
            var panel = _this.rangepanel.parent().removeClass("hide");

            var rangePicker = new M2012.Settings.View.TimeRangeSelector({
                container: _this.rangepanel, value: oldValue, type: "modify"
            });

            rangePicker.on("cancel", function () {
                panel.addClass("hide");
                _this.pnlRange.show();
            });

            rangePicker.on("submit", function (args) {
                var value = args.value;

                window.console && console.log("range changed", args);
                panel.addClass("hide");
                args.success();

                _this.pnlRange.data("range", value)
                    .show().find("span").text(value.discription);
            });
        },

        //点添加链接时，显示填写面板
        showPanel: function () {
            var div = this.exceptDiv;
            if (div.hasClass("hide")) {
                div.removeClass("hide");
                this.render();
                window.document.body.scrollTop += 125; //表单区域一半的高度，这样用户感觉是居中展开的，不会太突兀。
            }
        },

        //显示例外表格
        showExcepttable: function (args) {
            var _this = this;
            var data = args.viewdata;
            if (data.exceptlist.length == 0) {
                _this.table.hide();
                return;
            }

            _this.table.html(_this.template.exceptlist(data));
            if ($.isFunction(args.success)) {
                args.success(_this.table);
            } else {
                _this.table.show();
            }
        },
        //显示单个例外详细设置
        showDetail: function (args) {
            var _this = this;
            var model = _this.model;

            model.trigger("exceptdetailrendering", { "notifyid": args.nid, "success": function (result) {
                window.console && console.log("detail model filtered", args, result);

                if (!top.appView) {
                    var dialog1 = top.FF.open("详细设置", "options_notice_detail.htm", 560, 430, true, "", false, false);
                    var defaultText = result.value.notifytype == 1 ? "短信到达通知" : "彩信到达通知";
                    var ifr = dialog1.jContainer.find("iframe")[0];
                    ifr.value = result.value;
                    ifr.onsuccess = function (value) {
                        _this.onSaveDetail(value, dialog1, defaultText);
                    };
                    ifr.oncancel = function () {
                        dialog1.close();
                    };
                    return;
                }

                top.M139.core.utilCreateScriptTag({
                    id: "detailform",
                    src: "notice_ext.pack.js?v=" + Math.random(),
                    charset: "utf-8"
                }, function () {
                    var dialog = new top.M2012.UI.Dialog.ExceptNotify({
                        value: result.value, limit: model.RANGE_LIMIT,model:_this.model
                    });
                    dialog.on("success", function (view, value) {
                        _this.onSaveDetail(value, dialog);
                    });
                    dialog.on("cancel", function () { 
                        
                    });
                    dialog.trigger("print");
                })
            }
            });
        },

        onSaveDetail: function (value, dialog, defaultText) {
            var _this = this;
            var model = _this.model;
            var text = {sms: "短信到达通知",mms: "彩信到达通知"}
            var type = {sms: 1, mms: 2}
            if (!top.appView) {
                var el = $(dialog.jContainer).find("iframe").contents().find(".dropDownText");
            } else {
                var el = dialog.$el.find(".dropDownText");
            }
            if (el.text() == text.sms) {
                value.notifytype = type.sms;
            }
            if (el.text() == text.mms) {
                value.notifytype = type.mms;
            }
			// add by zhangsixie.例外情况，接受方式不接受的时候，把enable设置为false没用，需要把接受方式设置为O。
			if(!value["enable"]){
				value["notifytype"] = 0;
			}
            model.trigger("exceptmodifying", { "value": value, "success": function (result) {
                if (result.code == "1011") {
                    top.FF.confirm(
                    _this.message.updateLevel,
                        function () {
                            top.Links.show('orderinfo');
                            dialog.close();
                        },
                        function () {
                            el.text(defaultText);
                        },
                        true
                    );
                    return
                }
                if (!result.success) {
                    _this.FF.alert("修改失败");
                    return false;
                }
                if (!top.appView) { dialog.close(); }

                //更新原来所在的行的数据显示
                var row = _this.table.find("#nid_" + value.notifyid);

                if (!top.SiteConfig.mailNotice) {
                    var arr = ["不接收通知", "普通短信", "彩信", "wap链接", "长短信", "免提短信"];
                } else {
                    var arr = ["不接收通知", "短信到达通知", "彩信到达通知", "wap链接", "短信邮件", "免提短信"];
                }
                row.find(".j_notifytype").text(
                    arr[value.notifytype]
                );

                var desc = value.timerange[0].discription + (value.timerange.length > 1 ? "等" : "") + (value.supply ? "；补发" : "");
                if (!value.enable) {
                    desc = "";
                }

                row.find(".j_discription").text(desc);
            }
            });
        },

        //点确定按钮时，校验并提交
        onSubmit: function () {
            var _this = this;
            var model = _this.model;

            if (_this.busy) {
                return;
            }

            var error = [];
            var addr = _this.richExcept.val();
			addr = M139.Text.Html.encode(addr);//编码 edit by zsx
            var enableRecevie = _this.exceptDiv.find(":radio:checked").val() == "1";
            var supply = _this.exceptDiv.find(":checkbox").is(":checked");
            var notifyType = _this.notifyMenu.selectedValue();
            var range = _this.pnlRange.data("range");
            if (_this.exceptDiv.find(".dropDownText").text() == "短信到达通知") {
                notifyType = 1;
            }
            if (top.SiteConfig.mailNotice) {
                if (top.$User) {
                    var userLevel = top.$User.getUserLevel();
                    var provcode = top.$User.getProvCode();
                    var confirmJson = {
                        name: "updateLevel",
                        dialogTitle: "系统提示",
                        icon: "warn"
                    }
                    var confirm = top.$Msg.confirm;
                }
                else {
                    var userLevel = top.UserData.serviceItem;
                    var provcode = top.UserData.provCode;
                    var confirmJson = true;
                    var confirm = top.FF.confirm;
                }
                if ((userLevel == "0010" && provcode == "1") || userLevel == "0015" || userLevel == "0005") {
                    if (notifyType == 4) {
                        var msgAlert = confirm(
                        this.message.updateLevel,
                        function () {
                            if (top.$User) { top.$App.show("mobile") } else { top.Links.show('orderinfo') };
                        },
                        function () {
                            _this.exceptDiv.find(".dropDownText").text("短信到达通知");
                        },
                        confirmJson);
                        return;
                    }
                }
            }
            //TOFIX：这里要兼容只有邮件域的情况
            addr = M.Text.Email.parse(addr);
            error = addr.error;
            if (addr.success) {
                if (addr.emails.length > 0) {
                    addr.emails = $.map(addr.emails, function (i) {
                        return M.Text.Email.getEmail(i);
                    });
                } else {
                    addr.success = false;
                }
            } else {
                addr = _this.richExcept.val();
				addr = M139.Text.Html.encode(addr); //编码 edit by zsx
                addr = $Email.splitAddr(addr);
                var temp = [];
                error = [];

                $.each(addr, function (i, n) {
                    n = $.trim(n);
                    if (n.length === 0) return;

                    if (_this.isDomain(n) || $Email.isEmail(n)) {
                        temp.push(n);
                    } else {
                        error.push(n);
                    }
                });
                error = error.join(', ');

                if (temp.length > 0) {
                    addr = { success: true, emails: temp };
                    if (_this.isDomain(error)) { error = false; }
                } else {
                    addr = { success: false, emails: null };
                }
            }

            if (!addr.success || error) {
                $D.flashElement(_this.richExcept)
                if (error.length > 0) {
                    _this.FF.alert("Email地址 " + error + " 有误，请输入正确的邮件地址（如：example@139.com）或域（如：@139.com）");
                }
                return;
            }

            //点确定添加时，仍需要过一道去除重复。
            addr.emails = M139.unique(addr.emails, function (a, b) {
                if ($Email.compare(a, b)) {
                    return true;
                } else if (a.indexOf("@") === 0 && b.indexOf("@") === 0) {
                    return a.toLowerCase() === b.toLowerCase();
                }
                return false;
            });

            model.trigger("emailadding", {
                "emaillist": addr.emails,
                "success": function (repeatId) {
                    _this.busy = true;
                    model.trigger("exceptadding", {
                        "value": {
                            emaillist: addr.emails,
                            timerange: range,
                            enable: enableRecevie,
                            notifytype: notifyType,
                            fromtype: 2,
                            supply: supply
                        },
                        "success": function (result) {
                            _this.WaitPanel.hide();
                            _this.busy = false;

                            if (result.success) {
                                _this._reset();
                                _this._hide();

                                _this.flush({ pagecmd: "first", success: function (_table) {
                                    //TODO: 高亮前几行
                                    model.trigger("exceptadded", { value: addr.emails, success: function (list) {
                                        var ids = "";
                                        $.each(list, function () { ids += ",#nid_" + this.notifyid });
                                        ids = ids.substring(1);
                                        var rows = _table.find(ids);
                                        rows.hide();
                                        _table.show();
                                        rows.fadeIn('slow');
                                    }
                                    });
                                }
                                })
                            } else {

                                if (result.code == "ER_OVERFLOW") {
                                    var limit = model.getExceptLimit();
                                    var message = _this.message.warn_except_overflow.replace("$limit$", limit);
                                    var popup = M139.UI.Popup.create({
                                        name: "except_overflow",
                                        target: _this.btnAdd,
                                        icon: "i_fail",
                                        width: 300,
                                        buttons: [
                                            {
                                                text: "确定",
                                                click: function () {
                                                    popup.close();
                                                }
                                            }],
                                        content: message
                                    });
                                    popup.render();

                                } else {
                                    _this.FF.alert(_this.message.error_except_addfailed);
                                }
                            }
                        }
                    });
                },
                "error": function (repeatId) {
                    //TODO: 要找到重复所在的页码，并闪烁所在的行
                    _this.WaitPanel.show("已添加过该联系人", { delay: 2000 });
                    _this.flush({ pagecmd: "last" });

                    setTimeout(function () {
                        var first = _this.table.find("#nid_" + repeatId[0]);
                        var scrollDisc = first.offset().top + 110 - document.documentElement.clientHeight;
                        if (scrollDisc > document.body.scrollTop) {
                            document.body.scrollTop = scrollDisc;
                        }

                        $.each(repeatId, function () {
                            _this.table.find("#nid_" + this)
                                .css({ backgroundColor: "#fe9" })
                                .animate({ backgroundColor: "#fff" }, 1500);
                        });
                    }, 400);

                }
            });
        },

        /**
        * 例个表格中的点击事件
        * @param {EventArgs} e jQuery事件对象
        */
        onCommand: function (e) {
            if (e.target.tagName != "A") {
                return;
            }

            var _this = this;
            var link = $(e.target);
            var cmd = link.data("cmd");
            var nid = link.data("nid");
            var page = link.data("pageIndex");

            _this.cmdHandler["onexcept" + cmd]({
                "nid": nid, "page": page
            }, _this);
        },

        cmdHandler: {
            onexceptdelete: function (args, context) {
                var model = context.model;
                model.trigger("exceptdeleting", {
                    "notifyid": args.nid,
                    "success": function (result) {
                        $("#nid_" + args.nid).fadeOut("fast", function () {
                            context.flush({ pagecmd: "current" })
                        });
                    },
                    "error": function (result) {
                        top.$Msg.alert("删除失败");
                    }
                });
            },
            onexceptmodify: function (args, context) {
                context.showDetail(args);
            },
            onexceptmore: function (args, context) {
                context.flush({ pagecmd: "next" })
            }
        },

        _reset: function () {
            var _this = this;

            _this.richExcept.val("");
            _this.notifyMenu.reset();
            _this.exceptDiv.find(".j_disablefield").show();
            _this.rdoEnable.attr('checked', 'checked');

            var range = {
                "weekday": "1,2,3,4,5,6,7",
                "begin": 8,
                "end": 22
            };
            range.discription = _this.model.getTimeRange(range);

            _this.pnlRange.data("range", range);
            _this.pnlRange.find("span").text(range.discription);
        },

        _show: function () {
            this.exceptDiv.removeClass("hide").addClass("show");
        },

        _hide: function () {
            this.exceptDiv.removeClass("show").addClass("hide");
        },

        flush: function (args) {
            var _this = this;
            _this.model.trigger("exceptlist_rendering", {
                "pagecmd": args.pagecmd,
                "success": function (viewdata) {
                    _this.showExcepttable({ "viewdata": viewdata, "success": args.success });
                }
            });
        },

        regDomain: /^@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
        isDomain: function (str) {
            return this.regDomain.test(str);
        }

    })
    );

})(jQuery, _, M139);
