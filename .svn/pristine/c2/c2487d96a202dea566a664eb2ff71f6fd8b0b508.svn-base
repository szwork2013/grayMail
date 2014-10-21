(function(j, i) {
  function d() {
  }
  d.expando = "MiniQuery" + String(Math.random()).replace(/\D/g, "");
  d.extend = function(a, b) {
    for(var c in b) {
      a[c] = b[c]
    }
    return a
  };
  d.use = function(a, b) {
    if(!j[a] || b) {
      j[a] = d
    }else {
      var c = j[a], e;
      for(e in d) {
        e in c || (c[e] = d[e])
      }
    }
  };
  d.Object = function(a) {
    return new d.Object.prototype.init(a)
  };
  d.Object.extend = function() {
    var a = arguments.length;
    if(a == 0) {
      return null
    }
    var b = arguments[0];
    if(a == 1) {
      return b
    }
    for(var c = 1;c < a;c++) {
      var e = arguments[c];
      if(e instanceof Array || Object.prototype.toString.call(e) == "[object Array]") {
        for(var f = 0, d = e.length;f < d;f++) {
          b[f] = e[f]
        }
      }else {
        for(var h in e) {
          b[h] = e[h]
        }
      }
    }
    return b
  };
  d.Object.toString = function(a, b, c) {
    var b = b || "=", c = c || "&", e = [], f;
    for(f in a) {
      e.push(f + b + a[f])
    }
    return e.join(c)
  };
  d.Object.extend(d.Object, {clone:function(a) {
    if(a === null || a === i) {
      return a
    }
    var b = typeof a, c = {string:String, number:Number, "boolean":Boolean};
    if(c[b]) {
      return new c[b](a)
    }
    var b = {}, e;
    for(e in a) {
      switch(c = a[e], typeof c) {
        case "string":
        ;
        case "number":
        ;
        case "boolean":
        ;
        case "function":
          b[e] = c;
          break;
        case "object":
          b[e] = arguments.callee(c);
          break;
        default:
          b[e] = i
      }
    }
    return b
  }, each:function(a, b, c) {
    var e = arguments.callee, f;
    for(f in a) {
      var d = a[f];
      if(c === !0 && d && typeof d == "object") {
        e(d, b, c)
      }else {
        if(b(f, d) === !1) {
          break
        }
      }
    }
  }, getType:function(a) {
    return a === null ? "null" : a === i ? "undefined" : typeof a == "string" ? "string" : typeof a == "number" ? "number" : typeof a == "boolean" ? "boolean" : Object.prototype.toString.call(a).slice(8, -1)
  }, isArray:function(a, b) {
    return b === !0 ? a instanceof Array : a instanceof Array || d.Object.getType(a) == "Array"
  }, isBuiltinType:function(a) {
    for(var b = [String, Number, Boolean, Array, Date, RegExp, Function], c = 0, e = b.length;c < e;c++) {
      if(a instanceof b[c]) {
        return!0
      }
    }
    return!1
  }, isEmpty:function(a) {
    for(var b in a) {
      return!1
    }
    return!0
  }, isPlain:function(a) {
    if(!a || typeof a != "object" || a.nodeType || d.Object.isWindow(a)) {
      return!1
    }
    try {
      if(a.constructor && !Object.prototype.hasOwnProperty.call(a, "constructor") && !Object.prototype.hasOwnProperty.call(a.constructor.prototype, "isPrototypeOf")) {
        return!1
      }
    }catch(b) {
      return!1
    }
    for(var c in a) {
    }
    return c === i || Object.prototype.hasOwnProperty.call(a, c)
  }, isValueType:function(a) {
    return/^(string|number|boolean)$/g.test(typeof a)
  }, isWindow:function(a) {
    return a && typeof a == "object" && "setInterval" in a
  }, isWrappedType:function(a) {
    for(var b = [String, Number, Boolean], c = 0, e = b.length;c < e;c++) {
      if(a instanceof b[c]) {
        return!0
      }
    }
    return!1
  }, map:function(a, b, c) {
    var e = arguments.callee, d = {}, g;
    for(g in a) {
      var h = a[g];
      d[g] = c && h && typeof h == "object" ? e(h, b, c) : b(g, h)
    }
    return d
  }, namespace:function(a, b, c) {
    function e(a, b, c) {
      for(var b = b.split("."), e = b.length, f = e - 1, g = 0;g < e;g++) {
        var o = b[g];
        g < f ? (a[o] = a[o] || {}, a = a[o]) : (c === i && (c = {}), a[o] ? (d.Object.extend(a[o], c), c = a[o]) : a[o] = c)
      }
      return c
    }
    if(typeof b == "string") {
      var f = a;
      return e(f, b, c)
    }
    if(typeof a == "string") {
      return f = j, e(f, a, b)
    }
    if(d.Object.isPlain(b) && c === i) {
      var g = a, f = j;
      d.Object.each(b, function(a, b) {
        if(typeof b != "string") {
          throw Error("当指定第二个参数为键值对映射表时，值必须为 string 类型");
        }
        e(f, b, g[a])
      });
      return f
    }
    if(d.Object.isArray(c)) {
      return f = a, g = b, d.Array.each(c, function(a) {
        f[a] = g[a]
      }), f
    }
  }, parseJson:function(a) {
    if(typeof a !== "string" || !a) {
      return null
    }
    a = d.String.trim(a);
    if(j.JSON && j.JSON.parse) {
      return j.JSON.parse(a)
    }
    a = a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "");
    if(!/^[\],:{}\s]*$/.test(a)) {
      throw Error("非法的 JSON 数据: " + a);
    }
    return(new Function("return " + a))()
  }, parseQueryString:function(a, b, c) {
    if(!a || typeof a != "string") {
      return{}
    }
    for(var e = arguments.callee, f = c ? unescape : decodeURIComponent, g = !b, h = d.String.toValue, l = {}, k = a.split("&"), n = 0, m = k.length;n < m;n++) {
      var i = k[n].split("=");
      if(i.length > 1) {
        var o = f(i[0]), i = f(i[1]), i = g && i.indexOf("=") > 0 ? e(i) : h(i);
        l[o] = i
      }
    }
    return l
  }, remove:function(a, b) {
    var c = d.Object.extend({}, a);
    if(typeof b == "string") {
      delete c[b]
    }else {
      for(var e = 0, f = b.length;e < f;e++) {
        delete c[b[e]]
      }
    }
    return c
  }, replaceValues:function(a, b, c) {
    for(var e in a) {
      var d = a[e];
      switch(typeof d) {
        case "string":
        ;
        case "number":
        ;
        case "boolean":
          for(var g in b) {
            if(e == g) {
              a[e] = b[g];
              break
            }
          }
          break;
        case "object":
          !c && arguments.callee(d, b)
      }
    }
    return a
  }, toArray:function(a, b, c) {
    var e = arguments.callee;
    if(!b) {
      var d = [], g;
      for(g in a) {
        var h = a[g];
        c === !0 && h && typeof h == "object" && (h = e(h, b, c));
        d.push(h)
      }
      return d
    }
    if(b instanceof Array) {
      d = [];
      e = 0;
      for(g = b.length;e < g;e++) {
        h = a[b[e]], d.push(h)
      }
      return d
    }
    if(b === !0) {
      d = [];
      for(g in a) {
        h = a[g], c === !0 && h && typeof h == "object" && (h = e(h, b, c)), d.push([g, h])
      }
      return d
    }
    if(typeof b == "function") {
      d = [];
      for(g in a) {
        if(h = a[g], h = c === !0 && h && typeof h == "object" ? e(h, b, c) : b(g, h), h !== null) {
          if(h === i) {
            break
          }
          d.push(h)
        }
      }
      return d
    }
  }, toJSON:function(a) {
    if(a == null) {
      return String(a)
    }
    switch(typeof a) {
      case "string":
        return'"' + a + '"';
      case "number":
      ;
      case "boolean":
        return a;
      case "function":
        return a.toString()
    }
    if(a instanceof String || a instanceof Number || a instanceof Boolean || a instanceof Date) {
      return arguments.callee(a.valueOf())
    }
    if(a instanceof RegExp) {
      return arguments.callee(a.toString())
    }
    if(d.Object.isArray(a)) {
      for(var b = [], c = 0, e = a.length;c < e;c++) {
        b.push(arguments.callee(a[c]))
      }
      return"[" + b.join(", ") + "]"
    }
    b = [];
    for(c in a) {
      b.push('"' + c + '": ' + arguments.callee(a[c]))
    }
    return"{ " + b.join(", ") + " }"
  }, toQueryString:function(a, b) {
    if(a == null) {
      return String(a)
    }
    switch(typeof a) {
      case "string":
      ;
      case "number":
      ;
      case "boolean":
        return a
    }
    if(a instanceof String || a instanceof Number || a instanceof Boolean || a instanceof Date) {
      return a.valueOf()
    }
    if(d.Object.isArray(a)) {
      return"[" + a.join(", ") + "]"
    }
    var c = arguments.callee, e = b ? escape : encodeURIComponent, f = [], g;
    for(g in a) {
      f.push(e(g) + "=" + e(c(a[g])))
    }
    return f.join("&")
  }, trim:function(a, b) {
    var c = arguments.callee, e = d.Object.extend({}, a), f;
    for(f in e) {
      var g = e[f];
      g == null ? delete e[f] : b === !0 && typeof g == "object" && (g = d.Object.extend({}, g), e[f] = c(g, b))
    }
    return e
  }});
  d.Object.prototype = {constructor:d.Object, value:{}, init:function(a) {
    this.value = Object(a)
  }, valueOf:function() {
    return this.value
  }, clone:function() {
    return d.Object.clone(this.value)
  }, each:function(a, b) {
    d.Object.each(this.value, a, b);
    return this
  }, extend:function() {
    var a = [this.value], a = a.concat(Array.prototype.slice.call(arguments, 0));
    this.value = d.Object.extend.apply(null, a);
    return this
  }, getType:function() {
    return d.Object.getType(this.value)
  }, isArray:function(a) {
    return d.Object.isArray(this.value, a)
  }, isBuiltinType:function() {
    return d.Object.isBuiltinType(this.value)
  }, isEmpty:function() {
    return d.Object.isEmpty(this.value)
  }, isPlain:function() {
    return d.Object.isPlain(this.value)
  }, isValueType:function() {
    return d.Object.isValueType(this.value)
  }, isWindow:function() {
    return d.Object.isWindow(this.value)
  }, isWrappedType:function() {
    return d.Object.isWrappedType(this.value)
  }, map:function(a, b) {
    this.value = d.Object.map(this.value, a, b);
    return this
  }, namespace:function(a, b) {
    this.value = d.Object.namespace(this.value, a, b);
    return this
  }, parseJson:function(a) {
    this.value = d.Object.parseJson(a);
    return this
  }, parseQueryString:function(a, b, c) {
    this.value = d.Object.parseQueryString(a, b, c);
    return this
  }, remove:function(a) {
    this.value = d.Object.remove(this.value, a);
    return this
  }, replaceValues:function(a, b) {
    this.value = d.Object.replaceValues(this.value, a, b);
    return this
  }, toArray:function(a, b) {
    return d.Object.toArray(this.value, a, b)
  }, toJSON:function() {
    return d.Object.toJSON(this.value)
  }, toQueryString:function(a) {
    return d.Object.toQueryString(this.value, a)
  }, toString:function(a, b) {
    return d.Object.toString(this.value, a, b)
  }, trim:function(a) {
    this.value = d.Object.trim(this.value, a);
    return this
  }};
  d.Object.prototype.init.prototype = d.Object.prototype;
  d.Array = function(a) {
    return new d.Array.prototype.init(a)
  };
  d.extend(d.Array, {each:function(a, b, c) {
    var e = a.length;
    if(c === !0) {
      for(c = e;c--;) {
        if(b(a[c], c) === !1) {
          break
        }
      }
    }else {
      for(c = 0;c < e;c++) {
        if(b(a[c], c) === !1) {
          break
        }
      }
    }
    return a
  }, parse:function(a, b) {
    if(a instanceof Array) {
      return a
    }
    var c = [];
    if(b === !0) {
      for(var e in a) {
        e !== "length" && c.push(a[e])
      }
      return c
    }
    if(!a || !a.length) {
      return[]
    }
    try {
      c = Array.prototype.slice.call(a, 0)
    }catch(d) {
      e = 0;
      for(var g = a.length;e < g;e++) {
        c.push(a[e])
      }
    }
    return c
  }, toObject:function(a, b) {
    if(!a || !d.Object.isArray(a)) {
      return null
    }
    var c = {};
    if(b === i) {
      var e = a.length;
      c.length = e;
      for(var f = 0;f < e;f++) {
        c[f] = a[f]
      }
      return c
    }
    if(d.Object.isArray(b)) {
      e = b.length;
      for(f = 0;f < e;f++) {
        var g = b[f], h = a[f];
        c[g] = h
      }
      c.length = e;
      return c
    }
    if(d.Object.isPlain(b)) {
      e = 0;
      for(g in b) {
        c[g] = a[b[g]], e++
      }
      c.length = e;
      return c
    }
    if(typeof b == "function") {
      e = a.length;
      for(f = 0;f < e;f++) {
        if(h = b(a[f], f), h instanceof Array) {
          g = h[0], h = h[1], c[g] = h
        }else {
          if(d.Object.isPlain(h)) {
            for(g in h) {
              c[g] = h[g];
              break
            }
          }else {
            throw Error("处理函数 maps 返回结果的格式不可识别");
          }
        }
      }
      c.length = e
    }
    return c
  }, map:function(a, b) {
    for(var c = [], e = 0, d = a.length;e < d;e++) {
      var g = b(a[e], e);
      if(g !== null) {
        if(g === i) {
          break
        }
        c.push(g)
      }
    }
    return c
  }, grep:function(a, b) {
    for(var c = [], e = 0, d = a.length;e < d;e++) {
      var g = a[e];
      b(g, e) === !0 && c.push(g)
    }
    return c
  }, indexOf:function(a, b) {
    if(typeof a.indexOf == "function") {
      return a.indexOf(b)
    }
    for(var c = 0, e = a.length;c < e;c++) {
      if(a[c] === b) {
        return c
      }
    }
    return-1
  }, contains:function(a, b) {
    return d.Array.indexOf(a, b) > -1
  }, remove:function(a, b) {
    return d.Array.map(a, function(a) {
      return b === a ? null : a
    })
  }, removeAt:function(a, b) {
    return b < 0 || b >= a.length ? a.slice(0) : d.Array.map(a, function(a, e) {
      return b === e ? null : a
    })
  }, reverse:function(a) {
    for(var b = [], c = a.length - 1;c >= 0;c--) {
      b.push(a[c])
    }
    return b
  }, merge:function() {
    for(var a = [], b = 0, c = arguments.length;b < c;b++) {
      var e = arguments[b];
      e !== i && (a = a.concat(e))
    }
    return a
  }, mergeUnique:function() {
    for(var a = [], b = arguments.length, c = d.Array.contains, e = 0;e < b;e++) {
      for(var f = arguments[e], g = f.length, h = 0;h < g;h++) {
        c(a, f[h]) || a.push(f[h])
      }
    }
    return a
  }, unique:function(a) {
    return d.Array.mergeUnique(a)
  }, toggle:function(a, b) {
    if(d.Array.contains(a, b)) {
      return d.Array.remove(a, b)
    }else {
      var c = a.slice(0);
      c.push(b);
      return c
    }
  }, find:function(a, b, c) {
    return d.Array.findIndex(a, b, c) > -1
  }, findIndex:function(a, b, c) {
    for(var c = c || 0, e = a.length;c < e;c++) {
      if(b(a[c], c) === !0) {
        return c
      }
    }
    return-1
  }, findItem:function(a, b, c) {
    for(var c = c || 0, e = a.length;c < e;c++) {
      var d = a[c];
      if(b(d, c) === !0) {
        return d
      }
    }
    return null
  }, random:function(a) {
    for(var a = a.slice(0), b = 0, c = a.length;b < c;b++) {
      var e = parseInt(Math.random() * b), d = a[b];
      a[b] = a[e];
      a[e] = d
    }
    return a
  }, randomItem:function(a) {
    var b = a.length;
    if(b < 1) {
      return i
    }
    b = d.Math.randomInt(0, b - 1);
    return a[b]
  }, get:function(a, b) {
    var c = a.length;
    if(b >= 0 && b < c) {
      return a[b]
    }
    c = b + c;
    if(b < 0 && c >= 0) {
      return a[c]
    }
    if(b == null) {
      return a.slice(0)
    }
  }, trim:function(a) {
    return d.Array.map(a, function(a) {
      return a == null ? null : a
    })
  }, group:function(a, b, c) {
    var e = d.Array.slide(a, b, b);
    c === !0 && (e[e.length - 1] = a.slice(-b));
    return e
  }, slide:function(a, b, c) {
    if(b >= a.length) {
      return[a]
    }
    for(var c = c || 1, e = [], d = 0, g = a.length;d < g;d += c) {
      var h = d + b;
      e.push(a.slice(d, h));
      if(h >= g) {
        break
      }
    }
    return e
  }, circleSlice:function(a, b, c) {
    var b = a.slice(b, b + c), e = [];
    c -= b.length;
    c > 0 && (e = a.slice(0, c));
    return b.concat(e)
  }, circleSlide:function(a, b, c) {
    if(a.length < b) {
      return[a]
    }
    for(var c = c || 1, e = [], f = d.Array.circleSlice, g = 0, h = a.length;g < h;g += c) {
      e.push(f(a, g, b))
    }
    return e
  }, sum:function(a, b, c) {
    for(var e = 0, d = c !== i, g = 0, h = a.length;g < h;g++) {
      var l = d ? a[g][c] : a[g];
      if(isNaN(l)) {
        if(b !== !0) {
          throw Error("第 " + g + " 个元素的值为 NaN");
        }
      }else {
        e += Number(l)
      }
    }
    return e
  }, max:function(a, b, c) {
    for(var e = 0, d = c !== i, g = 0, h = a.length;g < h;g++) {
      var l = d ? a[g][c] : a[g];
      if(isNaN(l)) {
        if(b !== !0) {
          throw Error("第 " + g + " 个元素的值为 NaN");
        }
      }else {
        l = Number(l), l > e && (e = l)
      }
    }
    return e
  }, hasItem:function(a) {
    return d.Object.isArray(a) && a.length > 0
  }, reduceDimension:function(a, b) {
    for(var b = b || 1, c = a, e = Array.prototype.concat, d = 0;d < b;d++) {
      c = e.apply([], c)
    }
    return c
  }, descartes:function(a, b) {
    function c(a, b, c) {
      for(var e = [], d = 0, g = a.length;d < g;d++) {
        for(var f = 0, i = b.length;f < i;f++) {
          var j = [];
          c ? (j = j.concat(a[d]), j.push(b[f])) : (j[0] = a[d], j[1] = b[f]);
          e.push(j)
        }
      }
      return e
    }
    for(var e = c(a, b), d = 2, g = arguments.length;d < g;d++) {
      e = c(e, arguments[d], !0)
    }
    return e
  }, divideDescartes:function(a, b) {
    for(var c = a.length, e = [], d = 0, g = b.length;d < g;d++) {
      var h = b[d];
      c /= h;
      for(var l = [], k = 0;k < h;k++) {
        l.push(a[k * c][d])
      }
      e[d] = l
    }
    return e
  }, transpose:function(a) {
    for(var b = [], c = a.length, e = 1, d = 0;d < e;d++) {
      for(var g = [], h = 0;h < c;h++) {
        if(a[h].length > e) {
          e = a[h].length
        }
        g.push(a[h][d])
      }
      b[d] = g
    }
    return b
  }, intersection:function(a, b) {
    function c(a, b) {
      for(var c = [], e = 0, g = a.length;e < g;e++) {
        for(var f = a[e], i = 0, j = b.length;i < j;i++) {
          if(f === b[i]) {
            c.push(f);
            break
          }
        }
      }
      return d.Array.unique(c)
    }
    for(var e = a, f = 1, g = arguments.length;f < g;f++) {
      e = c(e, arguments[f])
    }
    return e
  }, isEqual:function(a, b, c) {
    if(!(a instanceof Array) || !(b instanceof Array) || a.length != b.length) {
      return!1
    }
    for(var c = c || function(a, b) {
      return a === b
    }, e = 0, d = a.length;e < d;e++) {
      if(!c(a[e], b[e])) {
        return!1
      }
    }
    return!0
  }, isContained:function(a, b) {
    return d.Array.intersection(a, b).length == a.length
  }, padLeft:function(a, b, c) {
    b -= a.length;
    if(b <= 0) {
      return a.slice(-b)
    }
    for(var e = [], d = 0;d < b;d++) {
      e.push(c)
    }
    return e = e.concat(a)
  }, padRight:function(a, b, c) {
    var e = b - a.length;
    if(e <= 0) {
      return a.slice(0, b)
    }
    a = a.slice(0);
    for(b = 0;b < e;b++) {
      a.push(c)
    }
    return a
  }, pad:function(a, b, c) {
    if(a == b) {
      return[]
    }
    var c = Math.abs(c || 1), e = [];
    if(a < b) {
      for(;a < b;a += c) {
        e.push(a)
      }
    }else {
      for(;a > b;a -= c) {
        e.push(a)
      }
    }
    return e
  }, aggregate:function(a, b, c) {
    for(var e = typeof b == "string", d = typeof c == "function", g = {}, h = 0, l = a.length;h < l;h++) {
      var k = a[h], n = e ? k[b] : b(k, h);
      g[n] || (g[n] = []);
      var m = k;
      if(d) {
        m = c(k, h);
        if(m === null) {
          continue
        }
        if(m === i) {
          break
        }
      }
      g[n].push(m)
    }
    return g
  }});
  d.Array.prototype = {constructor:d.Array, value:[], init:function(a) {
    this.value = d.Array.parse(a)
  }, toString:function(a) {
    a = a === i ? "" : a;
    return this.value.join(a)
  }, valueOf:function() {
    return this.value
  }, each:function(a, b) {
    d.Array.each(this.value, a, b);
    return this
  }, toObject:function(a) {
    return d.Array.toObject(this.value, a)
  }, map:function(a) {
    this.value = d.Array.map(this.value, a);
    return this
  }, grep:function(a) {
    this.value = d.Array.grep(this.value, a);
    return this
  }, indexOf:function(a) {
    return d.Array.indexOf(this.value, a)
  }, contains:function(a) {
    return d.Array.contains(this.value, a)
  }, remove:function(a) {
    this.value = d.Array.remove(this.value, a);
    return this
  }, removeAt:function(a) {
    this.value = d.Array.removeAt(this.value, a);
    return this
  }, reverse:function() {
    this.value = d.Array.reverse(this.value);
    return this
  }, merge:function() {
    var a = [this.value], a = a.concat(Array.prototype.slice.call(arguments, 0));
    this.value = d.Array.merge.apply(null, a);
    return this
  }, mergeUnique:function() {
    var a = [this.value], a = a.concat(Array.prototype.slice.call(arguments, 0));
    this.value = d.Array.mergeUnique.apply(null, a);
    return this
  }, unique:function() {
    this.value = d.Array.unique(this.value);
    return this
  }, toggle:function(a) {
    this.value = d.Array.toggle(this.value, a);
    return this
  }, find:function(a, b) {
    return d.Array.find(this.value, a, b)
  }, findIndex:function(a, b) {
    return d.Array.findIndex(this.value, a, b)
  }, findItem:function(a, b) {
    return d.Array.findItem(this.value, a, b)
  }, random:function() {
    this.value = d.Array.random(this.value);
    return this
  }, randomItem:function() {
    return d.Array.randomItem(this.value)
  }, get:function(a) {
    return d.Array.get(this.value, a)
  }, trim:function() {
    this.value = d.Array.trim(this.value);
    return this
  }, group:function(a, b) {
    this.value = d.Array.group(this.value, a, b);
    return this
  }, slide:function(a, b) {
    this.value = d.Array.slide(this.value, a, b);
    return this
  }, circleSlice:function(a, b) {
    this.value = d.Array.circleSlice(this.value, a, b);
    return this
  }, circleSlide:function(a, b) {
    return d.Array.circleSlide(this.value, a, b)
  }, sum:function(a, b) {
    return d.Array.sum(this.value, a, b)
  }, max:function(a, b) {
    return d.Array.max(this.value, a, b)
  }, hasItem:function() {
    return d.Array.hasItem(this.value)
  }, reduceDimension:function(a) {
    this.value = d.Array.reduceDimension(this.value, a);
    return this
  }, descartes:function() {
    var a = d.Array.parse(arguments), a = [this.value].concat(a);
    this.value = d.Array.descartes.apply(null, a);
    return this
  }, divideDescartes:function(a) {
    this.value = d.Array.divideDescartes(this.value, a);
    return this
  }, transpose:function() {
    this.value = d.Array.transpose(this.value);
    return this
  }, intersection:function() {
    var a = d.Array.parse(arguments), a = [this.value].concat(a);
    this.value = d.Array.intersection.apply(null, a);
    return this
  }, isEqual:function(a, b) {
    return d.Array.isEqual(this.value, a, b)
  }, isContained:function(a) {
    return d.Array.isContained(this.value, a)
  }, padLeft:function(a, b) {
    this.value = d.Array.padLeft(this.value, a, b);
    return this
  }, padRight:function(a, b) {
    this.value = d.Array.padRight(this.value, a, b);
    return this
  }, pad:function(a, b, c) {
    this.value = d.Array.pad(a, b, c);
    return this
  }};
  d.Array.prototype.init.prototype = d.Array.prototype;
  d.String = function(a) {
    if(arguments.length > 1) {
      var b = Array.prototype.slice.call(arguments, 1);
      return d.String.format(a, b)
    }
    return new d.String.prototype.init(a)
  };
  d.extend(d.String, {format:function(a, b, c) {
    var e = arguments.callee;
    if(d.Array.hasItem(b)) {
      if(d.Array.hasItem(c)) {
        for(var e = b, f = c, g = a, h = 0, l = f.length;h < l;h++) {
          var k = e[0] + "" + h + e[1], g = d.String.replaceAll(g, k, f[h])
        }
        return g
      }
      if(typeof c == "object") {
        e = b;
        h = c;
        g = a;
        for(f in h) {
          k = e[0] + f + e[1], g = d.String.replaceAll(g, k, h[f])
        }
        return g
      }
      if(c === i) {
        return e = ["{", "}"], d.String.format(a, e, b)
      }
      g = Array.prototype.slice.call(arguments, 2);
      return e(a, b, g)
    }else {
      if(typeof b == "object") {
        return e(a, ["{", "}"], b)
      }
      g = Array.prototype.slice.call(arguments, 1);
      return e(a, ["{", "}"], g)
    }
  }, formatQueryString:function(a, b, c) {
    if(!b) {
      return a
    }
    if(a.indexOf("?") < 0) {
      return b = d.Object.trim(b), a + "?" + d.Object.toQueryString(b)
    }
    var e = a.split("?"), a = e[0], e = d.Object.parseQueryString(e[1]), b = d.Object.extend(e, b);
    d.Object.trim(b);
    return a + "?" + d.Object.toQueryString(b, c)
  }, replaceAll:function(a, b, c) {
    return a.split(b).join(c)
  }, replaceBetween:function(a, b, c, d) {
    var f = a.indexOf(b);
    if(f < 0) {
      return a
    }
    b = a.indexOf(c);
    if(b < 0) {
      return a
    }
    f = a.slice(0, f);
    a = a.slice(b + c.length);
    return f + d + a
  }, removeAll:function(a, b) {
    return d.String.replaceAll(a, b, "")
  }, trim:function(a) {
    return a.replace(/(^\s*)|(\s*$)/g, "")
  }, trimStart:function(a) {
    return a.replace(/(^\s*)/g, "")
  }, trimEnd:function(a) {
    return a.replace(/(\s*$)/g, "")
  }, split:function(a, b) {
    function c(a, b, e) {
      e--;
      return d.Array.map(a, function(a) {
        return e == 0 ? String(a).split(b) : c(a, b, e)
      })
    }
    for(var e = String(a).split(b[0]), f = 1, g = b.length;f < g;f++) {
      e = c(e, b[f], f)
    }
    return e
  }, startsWith:function(a, b, c) {
    return c ? a.substring(0, b.length).toUpperCase() === b.toString().toUpperCase() : a.indexOf(b) == 0
  }, endsWith:function(a, b, c) {
    var d = a.length, f = d - b.length;
    return c ? a.substring(f, d).toUpperCase() === b.toString().toUpperCase() : a.lastIndexOf(b) == f
  }, contains:function(a, b) {
    return a.indexOf(b) > -1
  }, padLeft:function(a, b, c) {
    var a = String(a), d = a.length;
    if(b <= d) {
      return a.substr(-b)
    }
    var f = [];
    f.length = b - d + 1;
    return f.join(c || " ") + a
  }, padRight:function(a, b, c) {
    var a = String(a), d = a.length;
    if(d >= b) {
      return a.substring(0, b)
    }
    var f = [];
    f.length = b - d + 1;
    return a + f.join(c || " ")
  }, toCamelCase:function(a) {
    return a.replace(/^-ms-/, "ms-").replace(/-([a-z]|[0-9])/ig, function(a, c) {
      return c.toString().toUpperCase()
    })
  }, toHyphenate:function(a) {
    return a.replace(/[A-Z]/g, function(a) {
      return"-" + a.charAt(0).toLowerCase()
    })
  }, between:function(a, b, c) {
    var d = a.indexOf(b);
    if(d < 0) {
      return""
    }
    d += b.length;
    b = a.indexOf(c, d);
    return b < 0 ? "" : a.substr(d, b - d)
  }, toUtf8:function(a) {
    var b = [];
    d.Array.each(a.split(""), function(a) {
      a = a.charCodeAt(0);
      a < 128 ? b.push(a) : (a < 2048 ? b.push((a & 1984) >> 6 | 192) : (b.push((a & 61440) >> 12 | 224), b.push((a & 4032) >> 6 | 128)), b.push(a & 63 | 128))
    });
    return"%" + d.Array.map(b, function(a) {
      return a.toString(16)
    }).join("%")
  }, toValue:function(a) {
    if(typeof a != "string") {
      return a
    }
    var b = {0:0, 1:1, "true":!0, "false":!1, "null":null, undefined:i, NaN:NaN};
    return a in b ? b[a] : a
  }, slide:function(a, b, c) {
    a = String(a).split("");
    return d.Array(a).slide(b, c).map(function(a) {
      return a.join("")
    }).valueOf()
  }, segment:function(a, b) {
    return d.String.slide(a, b, b)
  }});
  d.String.prototype = {constructor:d.String, value:"", init:function(a) {
    this.value = String(a)
  }, toString:function() {
    return this.value
  }, valueOf:function() {
    return this.value
  }, format:function(a, b) {
    this.value = d.String.format(this.value, a, b);
    return this
  }, formatQueryString:function(a, b) {
    this.value = d.String.formatQueryString(this.value, a, b);
    return this
  }, replaceAll:function(a, b) {
    this.value = d.String.replaceAll(this.value, a, b);
    return this
  }, replaceBetween:function(a, b, c) {
    this.value = d.String.replaceBetween(this.value, a, b, c);
    return this
  }, removeAll:function(a) {
    this.value = d.String.replaceAll(this.value, a, "");
    return this
  }, trim:function() {
    this.value = d.String.trim(this.value);
    return this
  }, trimStart:function() {
    this.value = d.String.trimStart(this.value);
    return this
  }, trimEnd:function() {
    this.value = d.String.trimEnd(this.value);
    return this
  }, split:function(a) {
    return d.String.split(this.value, a)
  }, startsWith:function(a, b) {
    return d.String.startsWith(this.value, a, b)
  }, endsWith:function(a, b) {
    return d.String.endsWith(this.value, a, b)
  }, contains:function(a) {
    return d.String.contains(this.value, a)
  }, padLeft:function(a, b) {
    this.value = d.String.padLeft(this.value, a, b);
    return this
  }, padRight:function(a, b) {
    this.value = d.String.padRight(this.value, a, b);
    return this
  }, toCamelCase:function() {
    this.value = d.String.toCamelCase(this.value);
    return this
  }, toHyphenate:function() {
    this.value = d.String.toHyphenate(this.value);
    return this
  }, between:function(a, b) {
    this.value = d.String.between(this.value, a, b);
    return this
  }, toUtf8:function() {
    this.value = d.String.toUtf8(this.value);
    return this
  }, toValue:function() {
    return d.String.toValue(this.value)
  }, slide:function(a, b) {
    return d.String.slide(this.value, a, b)
  }, segment:function(a) {
    return d.String.segment(this.value, a, a)
  }};
  d.String.prototype.init.prototype = d.String.prototype;
  d.Boolean = function(a) {
    return new d.Boolean.prototype.init(a)
  };
  d.extend(d.Boolean, {parse:function(a) {
    return!a ? !1 : typeof a == "string" || a instanceof String ? !/^(false|null|undefined|0|NaN)$/g.test(a) : !0
  }, toInt:function(a) {
    return d.Boolean.parse(a) ? 1 : 0
  }, reverse:function(a) {
    return!d.Boolean.parse(a)
  }, random:function() {
    return!!Math.floor(Math.random() * 2)
  }});
  d.Boolean.prototype = {constructor:d.Boolean, value:!1, init:function(a) {
    this.value = d.Boolean.parse(a)
  }, valueOf:function() {
    return this.value
  }, toString:function() {
    return this.value.toString()
  }, toInt:function() {
    return this.value ? 1 : 0
  }, reverse:function() {
    this.value = !this.value;
    return this
  }, random:function() {
    this.value = d.Boolean.random()
  }};
  d.Boolean.prototype.init.prototype = d.Boolean.prototype;
  d.Function = function(a) {
    return new d.Function.prototype.init(a)
  };
  d.extend(d.Function, {empty:function() {
  }, bind:function(a, b) {
    var c = Array.prototype.slice.call(arguments, 2);
    return function() {
      var d = Array.prototype.slice.call(arguments, 0), d = c.concat(d);
      b.apply(a, d)
    }
  }, setInterval:function(a, b, c) {
    var d = arguments.callee;
    a["__MiniQuery.Funcion.setInterval.count__"] = (a["__MiniQuery.Funcion.setInterval.count__"] || 0) + 1;
    var f = setTimeout(function() {
      a(a["__MiniQuery.Funcion.setInterval.count__"]) === null ? clearTimeout(f) : (c === i || a["__MiniQuery.Funcion.setInterval.count__"] < c) && d(a, b, c)
    }, b)
  }});
  d.Function.prototype = {constructor:d.Function, value:null, init:function(a) {
    if(typeof a != "function") {
      throw Error("参数 fn 必须是一个函数");
    }
    this.value = a
  }, valueOf:function() {
    return this.value
  }, bind:function(a) {
    var b = [a, this.value], b = b.concat(Array.prototype.slice.call(arguments, 1));
    this.value = d.Function.bind.apply(null, b);
    return this
  }, setInterval:function(a, b) {
    var c = this.value;
    d.Function.setInterval(function(a) {
      c(a)
    }, a, b);
    return this
  }};
  d.Function.prototype.init.prototype = d.Function.prototype;
  d.Date = function(a) {
    return new d.Date.prototype.init(a)
  };
  d.Date.toString = function(a, b) {
    typeof a == "string" && (b = a, a = new Date);
    return d.Date.format(a, b)
  };
  d.extend(d.Date, {now:function() {
    return new Date
  }, parse:function(a) {
    function b(a) {
      var b = a.indexOf(".") > 0 ? "." : a.indexOf("-") > 0 ? "-" : a.indexOf("/") > 0 ? "/" : a.indexOf("_") > 0 ? "_" : null;
      if(!b) {
        throw Error("无法识别的日期格式：" + a);
      }
      a = a.split(b);
      return{yyyy:a[0], MM:a[1] || 0, dd:a[2] || 1}
    }
    function c(a) {
      var b = a.indexOf(":") > 0 ? ":" : null;
      if(!b) {
        throw Error("无法识别的时间格式0：" + a);
      }
      a = a.split(b);
      return{HH:a[0] || 0, mm:a[1] || 0, ss:a[2] || 0}
    }
    if(a instanceof Date) {
      if(isNaN(a.getTime())) {
        throw Error("参数是非法的日期实例");
      }
      return a
    }
    if(typeof a != "string") {
      throw Error("不支持该类型的参数：" + typeof a);
    }
    var d = new Date(a);
    if(!isNaN(d.getTime())) {
      return d
    }
    var f = a.split(" ");
    if(!f[0]) {
      throw Error("无法识别的格式1：" + a);
    }
    d = f[0].indexOf(":") > 0 ? null : f[0];
    f = f[0].indexOf(":") > 0 ? f[0] : f[1] || null;
    if(d || f) {
      if(d && f) {
        return a = b(d), f = c(f), new Date(a.yyyy, a.MM - 1, a.dd, f.HH, f.mm, f.ss)
      }
      if(d) {
        return a = b(d), new Date(a.yyyy, a.MM - 1, a.dd)
      }
      if(f) {
        return a = new Date, f = c(f), new Date(a.getFullYear(), a.getMonth(), a.getDate(), f.HH, f.mm, f.ss)
      }
    }
    throw Error("无法识别的格式2：" + a);
  }, format:function(a, b) {
    var c = a.getFullYear(), e = a.getMonth() + 1, f = a.getDate(), g = a.getHours(), h = a.getMinutes(), l = a.getSeconds(), k = function(a, b) {
      return d.String.padLeft(a, b, "0")
    }, n = g <= 12, c = {yyyy:k(c, 4), yy:String(c).substr(-2), MM:k(e, 2), M:e, dddd:"星期" + "日一二三四五六".charAt(a.getDay()), dd:k(f, 2), d:f, HH:k(g, 2), H:g, hh:k(n ? g : g - 12, 2), h:n ? g : g - 12, mm:k(h, 2), m:h, ss:k(l, 2), s:l, tt:n ? "AM" : "PM", t:n ? "A" : "P", TT:n ? "上午" : "下午", T:n ? "上" : "下"}, e = b, i;
    for(i in c) {
      e = d.String.replaceAll(e, i, c[i])
    }
    return e
  }, addYear:function(a, b) {
    a instanceof Date || (b = a, a = new Date);
    var c = a.getFullYear(), d = new Date(a);
    d.setFullYear(c + b);
    return d
  }, addMonth:function(a, b) {
    a instanceof Date || (b = a, a = new Date);
    var c = a.getMonth();
    b += c;
    var c = b % 12, e = d.Date.addYear(a, Math.floor(b / 12));
    e.setMonth(c);
    return e
  }, getFromServer:function(a, b) {
    if(typeof a == "function" && b === i) {
      b = a, a = j.location.href
    }
    var c = d.XHR.create();
    c.onreadystatechange = function() {
      if(c.readyState == 4 && c.status == "200") {
        var a = new Date(Date.parse(c.getResponseHeader("Date")));
        b && b(a)
      }
    };
    c.open("GET", a, !0);
    c.send(null)
  }});
  d.Date.prototype = {constructor:d.Date, value:new Date, init:function(a) {
    this.value = a === i ? new Date : d.Date.parse(a)
  }, valueOf:function() {
    return this.value
  }, toString:function(a) {
    return d.Date.format(this.value, a)
  }, format:function(a) {
    return d.Date.format(this.value, a)
  }};
  d.Date.prototype.init.prototype = d.Date.prototype;
  d.Math = {randomInt:function(a, b) {
    if(a === i && b === i) {
      return Number(String(Math.random()).replace(".", "").replace(/^0*/g, ""))
    }else {
      b === i && (b = a, a = 0)
    }
    var c;
    return Math.floor(Math.random() * (b - a + 1) + a)
  }, slide:function(a, b, c) {
    a += c || 1;
    return a >= 0 ? a % b : (b - Math.abs(a) % b) % b
  }, next:function(a, b) {
    return d.Math.slide(a, b, 1)
  }, previous:function(a, b) {
    return d.Math.slide(a, b, -1)
  }, parseInt:function(a) {
    return parseInt(a, 10)
  }};
  d.Queue = function() {
    function a(b) {
      return new a.prototype.init(b)
    }
    a.prototype = {constructor:a, init:function(a) {
      for(var a = a ? a.slice(0) : this.list, c = [], d = 0, f = a.length;d < f;d++) {
        c[d] = function(d) {
          return function() {
            a[d](c[d + 1])
          }
        }(d)
      }
      c.push(this.noop);
      this.list = a;
      this.queue = c
    }, noop:function() {
    }, size:function() {
      return this.list.length
    }, run:function() {
      this.queue[0]();
      return this
    }, push:function(a) {
      var c = this.queue, d = c.length - 1;
      c[d] = function(d) {
        return function() {
          a(c[d + 1])
        }
      }(d);
      c.push(this.noop);
      this.queue = c;
      this.list.push(a);
      return this
    }, shift:function() {
      this.list.shift()(this.noop);
      this.init();
      return this
    }, pop:function() {
      this.list.pop()(this.noop);
      this.queue.length -= 2;
      this.queue.push(this.noop);
      return this
    }};
    a.prototype.init.prototype = a.prototype;
    return a
  }();
  d.PageCache = function() {
    function a(b, c, d) {
      return new a.prototype.init(b, c, d)
    }
    a.prototype = {constructor:a, key:null, cacheWindow:j, hasDone:!1, init:function(a, c, e) {
      this.key = a;
      if(c !== i) {
        if(!d.Object.isWindow(c)) {
          throw Error("指定的 cacheWindow 参数不是一个真正的 window 对象");
        }
        this.cacheWindow = c
      }
      this.cacheWindow["__MiniQuery.PageCache__"] || (this.cacheWindow["__MiniQuery.PageCache__"] = {});
      e !== i && (this.get() || this.set(e))
    }, get:function() {
      return this.cacheWindow["__MiniQuery.PageCache__"][this.key]
    }, set:function(a) {
      this.cacheWindow["__MiniQuery.PageCache__"][this.key] = a;
      return this
    }, clear:function() {
      this.hasDone = !1;
      this.cacheWindow["__MiniQuery.PageCache__"][this.key] = i;
      return this
    }, ready:function(a, c) {
      var d = this, f = d.get();
      if(f !== i) {
        return c && c(f), this
      }
      a && a(function(a, b) {
        a === i ? d.clear() : (b === !0 ? d.clear() : d.set(a), c && c(a))
      });
      return this
    }};
    a.prototype.init.prototype = a.prototype;
    return a
  }();
  d.XHR = {create:function() {
    var a = j.XMLHttpRequest ? function() {
      return new XMLHttpRequest
    } : j.ActiveXObject ? function() {
      var a = arguments.callee;
      if(!a.version) {
        for(var c = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"], d = 0, f = c.length;d < f;d++) {
          try {
            var g = new ActiveXObject(c[d]);
            a.version = c[d];
            return g
          }catch(h) {
          }
        }
      }
      return new ActiveXObject(a.version)
    } : function() {
      throw Error("没有可用的 XHR 对象");
    };
    d.XHR.create = a;
    return a()
  }, Headers:{toObject:function(a) {
    for(var b = {}, a = a.getAllResponseHeaders().split("\n"), c = 0, d = a.length;c < d;c++) {
      var f = a[c].split(": ");
      f.length < 2 || (b[f[0]] = f[1])
    }
    return b
  }, set:function(a, b, c) {
    if(typeof b == "string" && c !== i) {
      a.setRequestHeader(b, String(c))
    }else {
      if(typeof b == "object" && c === i) {
        var d = b;
        for(b in d) {
          c = d[b], typeof c == "function" && (c = c()), a.setRequestHeader(b, String(c))
        }
      }
    }
  }}};
  d.XML = function(a) {
    function b() {
      var a = arguments.callee;
      if(!a.version) {
        for(var b = ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument"], c = 0, d = b.length;c < d;c++) {
          try {
            var e = new ActiveXObject(b[c]);
            a.version = b[c];
            return e
          }catch(f) {
          }
        }
      }
      return new ActiveXObject(a.version)
    }
    function c(b, c) {
      var d = {}, e = a.Array.parse(b.attributes);
      a.Array.each(e, function(b) {
        b.specified && (d[b.name] = c && b.value.indexOf("=") > 0 ? a.Object.parseQueryString(b.value) : b.value)
      });
      return d
    }
    function e(a) {
      var c = null, d = document.implementation;
      if(j.DOMParser) {
        if(c = (new DOMParser).parseFromString(a, "text/xml"), a = c.getElementsByTagName("parsererror"), a.length > 0) {
          throw Error("XML 解析错误: " + a[0].textContent);
        }
      }else {
        if(d.hasFeature("LS", "3.0")) {
          c = d.createLSParser(d.MODE_SYNCHRONOUS, null), d = d.createInput(), d.stringData = a, c = c.parse(d)
        }else {
          if(c = b(), c.loadXML(a), c.parseError.errorCode != 0) {
            throw Error("XML 解析错误: " + c.parseError.reason);
          }
        }
      }
      if(!c) {
        throw Error("没有可用的 XML 解析器");
      }
      return c
    }
    function f(b, c) {
      var e = arguments.callee;
      if(!c) {
        for(c in b) {
          return e(b[c], c)
        }
        throw Error("参数 obj 中不包含任何成员");
      }
      var f = [], i = [], m;
      for(m in b) {
        if(d.Object.isArray(b[m])) {
          a.Array.each(b[m], function(a) {
            i.push(e(a, m))
          })
        }else {
          var j = typeof b[m];
          if(j == "string" || j == "number" || j == "boolean") {
            j = String(b[m]).replace(/"/g, '\\"'), f.push(a.String.format('{0}="{1}"', m, j))
          }else {
            throw Error("非法数据类型的属性值: " + m);
          }
        }
      }
      return a.String.format("<{name} {attributes}>{children}</{name}>", {name:c, attributes:f.join(" "), children:i.join(" \r\n")})
    }
    return{parse:function(a) {
      var b = "";
      typeof a == "string" ? b = a : typeof a == "object" && a && (b = f(a));
      if(!b) {
        throw Error("非法的参数 data");
      }
      return e(b)
    }, toString:function(a) {
      return!a || typeof a != "object" ? "" : a.nodeName ? j.XMLSerializer ? (new XMLSerializer).serializeToString(a) : document.implementation.hasFeature("LS", "3.0") ? document.implementation.createLSSerializer().writeToString(a) : a.xml : f(a)
    }, toObject:function(a, b) {
      var f = d, k = arguments.callee;
      if(typeof a == "string") {
        return f = e(a), k(f, b)
      }
      if(a && a.documentElement) {
        var f = a, i = {};
        i[f.documentElement.nodeName] = k(f.documentElement, b);
        return i
      }
      if(!a || !a.nodeName) {
        throw Error("参数 node 错误：非法的 XML 节点");
      }
      var i = c(a, b), j = f.Array.parse(a.childNodes);
      if(j.length == 1) {
        var p = j[0];
        if(p.nodeType == 3) {
          return i.value = p.nodeValue, i
        }
      }
      f.Array(j).grep(function(a) {
        return a.nodeType === 1
      }).each(function(a) {
        var b = a.nodeName;
        i[b] || (i[b] = []);
        i[b].push(k(a))
      });
      return i
    }}
  }(d);
  d.XML.DataTypeXML = function(a) {
    function b(b, c) {
      if(c == null) {
        return""
      }
      var d = typeof c, e = f[d];
      if(d != "object") {
        return e ? a.String.format(e, {key:b, value:c.toString()}) : ""
      }
      var i = arguments.callee;
      if(a.Object.isArray(c)) {
        return a.String.format(f.Array, {key:b, value:a.Array.map(c, function(a, b) {
          return i(b, a)
        }).join("")})
      }
      d = a.Object.getType(c);
      return(e = f[d]) ? a.String.format(e, {key:b, value:c.toString()}) : a.String.format(f.object, {key:b, value:a.Object.isPlain(c) ? a.Object.toArray(c, function(a, b) {
        return i(a, b)
      }).join("") : c.toString()})
    }
    function c(b, c) {
      var d = arguments.callee, e = {};
      ({string:function() {
        a.Array.each(c, function(a) {
          e[a.name] = a.value.toString()
        })
      }, "int":function() {
        a.Array.each(c, function(a) {
          e[a.name] = Number(a.value)
        })
      }, bool:function() {
        a.Array.each(c, function(b) {
          e[b.name] = a.Boolean.parse(b.value)
        })
      }, "function":function() {
        a.Array.each(c, function(a) {
          var b = new Function("return " + a.value);
          e[a.name] = b()
        })
      }, date:function() {
        a.Array.each(c, function(b) {
          e[b.name] = a.Date.parse(b.value)
        })
      }, array:function() {
        a.Array.each(c, function(b) {
          e[b.name] = [];
          a.Object.each(b, function(c, f) {
            if(c == "name") {
              return!0
            }
            var g = d(c, f);
            a.Object.extend(e[b.name], g)
          })
        })
      }, object:function() {
        a.Array.each(c, function(b) {
          e[b.name] = {};
          a.Object.each(b, function(c, f) {
            if(c == "name") {
              return!0
            }
            var g = d(c, f);
            a.Object.extend(e[b.name], g)
          })
        })
      }})[b]();
      return e
    }
    var d = {string:'<string name="{key}">{value}</string>', number:'<int name="{key}">{value}</int>', "boolean":'<bool name="{key}">{value}</bool>', "function":'<function name="{key}">{value}</function>', object:'<object name="{key}">{value}</object>', Array:'<array name="{key}">{value}</array>', Date:'<date name="{key}">{value}</date>', root:"<object>{value}</object>"}, f = null;
    return{toString:function(c, h) {
      f = a.Object.extend({}, d, h);
      return a.String.format(f.root, {value:a.Object.toArray(c, function(a, c) {
        return b(a, c)
      }).join("")})
    }, toObject:function(b) {
      var b = a.XML.toObject(b), d;
      for(d in b) {
        b = b[d];
        break
      }
      var e = {};
      a.Object.each(b, function(b, d) {
        var f = c(b, d);
        a.Object.extend(e, f)
      });
      return e
    }}
  }(d);
  d.CssClass = function(a) {
    return new d.CssClass.prototype.init(a)
  };
  d.extend(d.CssClass, {get:function(a) {
    var b = "";
    a.className ? b = a.className : typeof a == "string" && (b = a);
    return d.Array(b.split(" ")).unique().map(function(a) {
      return a == "" ? null : a
    }).valueOf()
  }, contains:function(a, b) {
    var c = this.get(a);
    return d.Array.contains(c, b)
  }, add:function(a, b) {
    var c = this.get(a), e = d.Object.isArray(b) ? b : this.get(b), c = d.Array.mergeUnique(c, e);
    a.className = c.join(" ");
    return this
  }, remove:function(a, b) {
    var c = this.get(a), e = d.Object.isArray(b) ? b : this.get(b);
    d.Array.each(e, function(a) {
      c = d.Array.remove(c, a)
    });
    a.className = c.join(" ");
    return this
  }, toggle:function(a, b) {
    var c = this.get(a), e = d.Object.isArray(b) ? b : this.get(b);
    d.Array.each(e, function(a) {
      c = d.Array.toggle(c, a)
    });
    a.className = c.join(" ");
    return this
  }});
  d.CssClass.prototype = {constructor:d.CssClass, value:null, init:function(a) {
    this.value = a
  }, toString:function() {
    return this.get().join(" ")
  }, valueOf:function() {
    return this.get()
  }, get:function() {
    return d.CssClass.get(this.value)
  }, contains:function(a) {
    return d.CssClass.contains(this.value, a)
  }, add:function(a) {
    d.CssClass.add(this.value, a);
    return this
  }, remove:function(a) {
    d.CssClass.remove(this.value, a);
    return this
  }, toggle:function(a) {
    d.CssClass.toggle(this.value, a);
    return this
  }};
  d.CssClass.prototype.init.prototype = d.CssClass.prototype;
  d.Script = {load:function(a, b, c) {
    if(d.Array.hasItem(a)) {
      var e = arguments.callee, f = 0;
      (function() {
        var d = arguments.callee;
        e(a[f], b, function() {
          f++;
          f < a.length ? d() : c && c()
        })
      })()
    }else {
      var g = document.getElementsByTagName("head")[0], h = document.createElement("script");
      h.type = "text/javascript";
      typeof b == "function" && (c = b, b = null);
      if(b) {
        h.charset = b
      }
      h.readyState ? h.onreadystatechange = function() {
        if(h.readyState == "loaded" || h.readyState == "complete") {
          h.onreadystatechange = null, g.removeChild(h), c && c()
        }
      } : h.onload = function() {
        g.removeChild(h);
        c && c()
      };
      h.src = a;
      g.appendChild(h)
    }
  }, insert:function(a, b) {
    var c = document.createElement("script");
    c.type = "text/javascript";
    if(b !== i) {
      c.id = b
    }
    try {
      c.appendChild(document.createTextNode(a))
    }catch(d) {
      c.text = a
    }
    document.getElementsByTagName("head")[0].appendChild(c)
  }, write:function(a, b) {
    var c = d;
    document.write(c.String.format('<script type="text/javascript" src="{src}" {charsetProperty} ><\/script>', {src:a, charsetProperty:b ? c.String.format('charset="{0}"', b) : ""}))
  }};
  d.Style = function() {
    var a, b;
    return{getComputed:function(a, b) {
      var f = d.String.toCamelCase(b), g = a.currentStyle || document.defaultView.getComputedStyle(a, null);
      return g ? g[f] : null
    }, getDefault:function(c, e) {
      var f = arguments.callee;
      f[c] || (f[c] = {});
      if(!f[c][e]) {
        if(!a) {
          a = document.createElement("iframe"), a.frameBorder = a.width = a.height = 0
        }
        document.body.appendChild(a);
        if(!b || !a.createElement) {
          b = (a.contentWindow || a.contentDocument).document, b.write((document.compatMode === "CSS1Compat" ? "<!doctype html>" : "") + "<html><body>"), b.close()
        }
        var g = b.createElement(c);
        b.body.appendChild(g);
        f[c][e] = d.Style.getComputed(g, e);
        document.body.removeChild(a)
      }
      return f[c][e]
    }, load:function(a, b) {
      var d = document.createElement("link");
      d.rel = "stylesheet";
      d.type = "text/css";
      d.href = a;
      if(b !== i) {
        d.id = b
      }
      document.getElementsByTagName("head")[0].appendChild(d)
    }, insert:function(a, b) {
      var d = document.createElement("style");
      d.type = "text/css";
      if(b !== i) {
        d.id = b
      }
      try {
        d.appendChild(document.createTextNode(a))
      }catch(g) {
        d.styleSheet.cssText = a
      }
      document.getElementsByTagName("head")[0].appendChild(d)
    }, write:function(a) {
      document.write('<link rel="stylesheet" rev="stylesheet" href="' + a + '" type="text/css" media="screen" />')
    }, addRule:function(a, b, d, g) {
      if(a.insertRule) {
        a.inertRule(b + "{" + d + "}", g)
      }else {
        if(a.addRule) {
          a.addRule(b, d, g)
        }else {
          throw Error("无法插入样式规则!");
        }
      }
    }, removeRule:function(a, b) {
      if(a.deleteRule) {
        a.deleteRule(b)
      }else {
        if(a.romveRule) {
          a.removeRule(b)
        }else {
          throw Error("无法删除样式规则!");
        }
      }
    }}
  }();
  d.DOM = {contains:function(a, b) {
    var c = typeof a.contains == "function" ? function(a, b) {
      return a.contains(b)
    } : typeof a.compareDocumentPosition == "function" ? function(a, b) {
      return!!(a.compareDocumentPosition(b) & 16)
    } : function(a, b) {
      var c = b.parentNode;
      do {
        if(c === a) {
          return!0
        }
        c = c.parentNode
      }while(c !== null);
      return!1
    };
    d.DOM.contains = c;
    return c(a, b)
  }, getInnerText:function(a) {
    var b = typeof a.textContent == "string" ? function(a) {
      return a.textContent
    } : function(a) {
      return a.innerText
    };
    d.DOM.getInnerText = b;
    return b(a)
  }, setInnerText:function(a, b) {
    var c = typeof a.textContent == "string" ? function(a, b) {
      a.textContent = b
    } : function(a, b) {
      a.innerText = b
    };
    d.DOM.setInnerText = c;
    c(a, b)
  }, isVisible:function(a) {
    var b = null;
    if(document.defaultView) {
      b = document.defaultView.getComputedStyle(a, null)
    }else {
      if(a.currentStyle) {
        b = a.currentStyle
      }else {
        throw Error("未能判断!");
      }
    }
    return b.display == "none" || b.visible == "false" ? !1 : a.parentNode && a.parentNode.tagName.toLowerCase() != "html" ? arguments.callee(a.parentNode) : !0
  }, show:function(a) {
    if(document.defaultView) {
      var b = document.defaultView.getComputedStyle(a, null);
      if(b.display == "none") {
        a.style.display = "inline"
      }
      if(b.visible == "false") {
        a.style.visible = "true"
      }
    }else {
      if(a.currentStyle) {
        if(a.currentStyle.display == "none") {
          a.style.display = "inline"
        }
        if(a.currentStyle.visible == "false") {
          a.style.visible = "true"
        }
      }
    }
    a.parentNode && a.parentNode.tagName.toLowerCase() != "html" && arguments.callee(a.parentNode)
  }};
  d.Data = function() {
    function a(a) {
      if(!a || !a.nodeName) {
        return!1
      }
      var b = e[a.nodeName.toLowerCase()];
      return b ? !(b === !0 || a.getAttribute("classid") !== b) : !0
    }
    var b = {}, c = 0, e = {embed:!0, object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000", applet:!0};
    return{set:function(e, g, h) {
      if(!a(e)) {
        throw Error("无法在该节点上缓存数据!");
      }
      var i = d.expando, k = e[i];
      k || (k = ++c, e[i] = k);
      b[k] || (b[k] = {});
      d.Object.isValueType(g) ? b[k][String(g)] = h : b[k] = g
    }, get:function(a, c) {
      var e = a[d.expando];
      return c === i ? b[e] || null : b[e] ? b[e][c] : null
    }, remove:function(a, c) {
      var e = a[d.expando];
      b[e] && (c === i ? b[e] = null : delete b[e][c])
    }, acceptData:a}
  }();
  d.Event = function() {
    var a = function() {
      var a = "__EventList__" + String(Math.random()).replace(".", "");
      return{add:function(c, e, f) {
        var g = d.Data.get(c, a) || {};
        g[e] || (g[e] = []);
        g[e].push(f);
        d.Data.set(c, a, g)
      }, remove:function(c, e, f) {
        (c = d.Data.get(c, a)) && c[e] && d.Array.remove(c[e], f)
      }, clear:function(c, e) {
        var f = d.Data.get(c, a);
        f && f[e] && (f[e] = [])
      }, get:function(c, e) {
        var f = d.Data.get(c, a);
        return e === i ? f : f ? f[e] : []
      }}
    }();
    return{bind:function(b, c, e, f, g) {
      if(c && typeof c == "object" && e === i && f === i) {
        var h = arguments.callee;
        d.Object.each(c, function(a, c) {
          h(b, a, c, f, g)
        })
      }else {
        var j = function(a) {
          a = d.Event.getEvent(a);
          if(!a.stopPropagation) {
            a.stopPropagation = function() {
              a.cancelBubble = !0
            }
          }
          if(!a.preventDefault) {
            a.preventDefault = function() {
              a.returnValue = !1
            }
          }
          f = [a].concat(f || []);
          e.apply(b, f) === !1 && d.Event.stop(a);
          g && d.Event.unbind(b, c, e)
        };
        a.add(b, c, e);
        e[d.expando] = j;
        b.addEventListener ? b.addEventListener(c, j, !1) : b.attachEvent ? b.attachEvent("on" + c, j) : b["on" + c] = j
      }
    }, unbind:function(b, c, e) {
      a.remove(b, c, e);
      b.removeEventListener ? b.removeEventListener(c, e[d.expando], !1) : b.detachEvent ? b.detachEvent("on" + c, e[d.expando]) : b["on" + c] = null
    }, clear:function(b, c) {
      var e = a.get(b, c);
      d.Array.each(e, function(a) {
        d.Event.unbind(b, c, a)
      })
    }, clearAll:function(b) {
      var c = a.get(b), e;
      for(e in c) {
        d.Event.clear(b, e)
      }
    }, triggerHandler:function(b, c, e) {
      var f, c = a.get(b, c);
      d.Array.each(c, function(a) {
        f = a.apply(b, e)
      });
      return f
    }, getEvent:function(a) {
      return a || j.event
    }, getTarget:function(a) {
      return a.target || a.srcElement
    }, preventDefault:function(a) {
      a.preventDefault ? a.preventDefault() : a.returnValue = !1
    }, stopPropagation:function(a) {
      a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0
    }, stop:function(a) {
      d.Event.stopPropagation(a);
      d.Event.preventDefault(a)
    }, getRelatedTarget:function(a) {
      return a.relatedTarget || a.toElement || a.fromElement || null
    }, getButton:function(a) {
      return document.implementation.hasFeature("MouseEvents", "2.0") ? a.button : [0, 0, 2, 0, 1, 0, 2, 0][a.button]
    }, getWheelDelta:function(a) {
      return a.wheelDelta || -a.detail * 40
    }, ready:function() {
      function a() {
        if(!d) {
          d = !0;
          for(var c = 0, g = f.length;c < g;c++) {
            f[c].apply(document)
          }
          f = null;
          document.removeEventListener ? document.removeEventListener("DOMContentLoaded", a, !1) : document.detachEvent && document.detachEvent("onreadystatechange", a)
        }
      }
      function c() {
        try {
          document.documentElement.doScroll("left")
        }catch(d) {
          setTimeout(c, 1);
          return
        }
        a()
      }
      var d = !1, f = [];
      if(document.readyState === "complete") {
        return setTimeout(a, 1)
      }
      if(document.addEventListener) {
        document.addEventListener("DOMContentLoaded", a, !1), j.addEventListener("load", a, !1)
      }else {
        if(document.attachEvent) {
          document.attachEvent("onreadystatechange", a);
          j.attachEvent("onload", a);
          var g = !1;
          try {
            g = j.frameElement == null
          }catch(h) {
          }
          g && document.documentElement.doScroll && c()
        }
      }
      return function(a) {
        d ? a.call(document) : f.push(a)
      }
    }()}
  }();
  d.Cookie = function() {
    return new d.Cookie.prototype.init
  };
  d.extend(d.Cookie, {set:function() {
  }, get:function(a, b, c) {
    c = d.Cookie.parse(c || document.cookie);
    if(a === i) {
      return c
    }
    a = c[a];
    return!a || b === i ? a : a[b]
  }, remove:function() {
  }, toObject:function(a) {
    var b = arguments.callee, c = b[a];
    if(c) {
      return c
    }
    var c = {}, e = d;
    e.Array(a.split(";")).map(function(a) {
      var b = a.indexOf("="), c = a.substring(0, b), a = a.substring(b + 1);
      a.indexOf("=") > 0 && (a = e.Object.parseQueryString(a, !1));
      return[c, a]
    }).each(function(a) {
      c[a[0]] = a[1]
    });
    return b[a] = c
  }});
  d.Plugin = {has:function(a) {
    for(var b = !1, a = a.toLowerCase(), c = navigator.plugins, d = 0, f = c.length;d < f;d++) {
      if(c[d].name.toLowerCase().indexOf(a) >= 0) {
        b = !0;
        break
      }
    }
    if(!b) {
      try {
        new ActiveXObject(a), b = !0
      }catch(g) {
        b = !1
      }
    }
    return b
  }, hasFlash:function() {
    var a = d.Plugin.has("Flash");
    a || (a = d.Plugin.has("ShockwaveFlash.ShockwaveFlash"));
    return a
  }, hasQuickTime:function() {
    var a = d.Plugin.has("QuickTime");
    a || (a = d.Plugin.has("QuickTime.QuickTime"));
    return a
  }};
  j.MiniQuery = d
})(window);

