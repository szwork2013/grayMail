(function(s, p) {
  function E(a) {
    var c = X[a] = {}, b, k, a = a.split(/\s+/);
    for(b = 0, k = a.length;b < k;b++) {
      c[a[b]] = !0
    }
    return c
  }
  function H(a, c, h) {
    if(h === p && a.nodeType === 1) {
      if(h = "data-" + c.replace(f, "-$1").toLowerCase(), h = a.getAttribute(h), typeof h === "string") {
        try {
          h = h === "true" ? !0 : h === "false" ? !1 : h === "null" ? null : b.isNumeric(h) ? +h : e.test(h) ? b.parseJSON(h) : h
        }catch(k) {
        }
        b.data(a, c, h)
      }else {
        h = p
      }
    }
    return h
  }
  function v(a) {
    for(var c in a) {
      if(!(c === "data" && b.isEmptyObject(a[c])) && c !== "toJSON") {
        return!1
      }
    }
    return!0
  }
  function O(a, c, h) {
    var k = c + "defer", d = c + "queue", e = c + "mark", i = b._data(a, k);
    i && (h === "queue" || !b._data(a, d)) && (h === "mark" || !b._data(a, e)) && setTimeout(function() {
      !b._data(a, d) && !b._data(a, e) && (b.removeData(a, k, !0), i.fire())
    }, 0)
  }
  function r() {
    return!1
  }
  function m() {
    return!0
  }
  function x(a, c, h) {
    c = c || 0;
    if(b.isFunction(c)) {
      return b.grep(a, function(a, b) {
        return!!c.call(a, b, a) === h
      })
    }else {
      if(c.nodeType) {
        return b.grep(a, function(a) {
          return a === c === h
        })
      }else {
        if(typeof c === "string") {
          var k = b.grep(a, function(a) {
            return a.nodeType === 1
          });
          if(cb.test(c)) {
            return b.filter(c, k, !h)
          }else {
            c = b.filter(c, k)
          }
        }
      }
    }
    return b.grep(a, function(a) {
      return b.inArray(a, c) >= 0 === h
    })
  }
  function Y(a) {
    var c = Ca.split("|"), a = a.createDocumentFragment();
    if(a.createElement) {
      for(;c.length;) {
        a.createElement(c.pop())
      }
    }
    return a
  }
  function J(a, c) {
    if(c.nodeType === 1 && b.hasData(a)) {
      var h, k, d;
      k = b._data(a);
      var e = b._data(c, k), i = k.events;
      if(i) {
        for(h in delete e.handle, e.events = {}, i) {
          for(k = 0, d = i[h].length;k < d;k++) {
            b.event.add(c, h, i[h][k])
          }
        }
      }
      if(e.data) {
        e.data = b.extend({}, e.data)
      }
    }
  }
  function W(a, c) {
    var h;
    if(c.nodeType === 1) {
      c.clearAttributes && c.clearAttributes();
      c.mergeAttributes && c.mergeAttributes(a);
      h = c.nodeName.toLowerCase();
      if(h === "object") {
        c.outerHTML = a.outerHTML
      }else {
        if(h === "input" && (a.type === "checkbox" || a.type === "radio")) {
          if(a.checked) {
            c.defaultChecked = c.checked = a.checked
          }
          if(c.value !== a.value) {
            c.value = a.value
          }
        }else {
          if(h === "option") {
            c.selected = a.defaultSelected
          }else {
            if(h === "input" || h === "textarea") {
              c.defaultValue = a.defaultValue
            }else {
              if(h === "script" && c.text !== a.text) {
                c.text = a.text
              }
            }
          }
        }
      }
      c.removeAttribute(b.expando);
      c.removeAttribute("_submit_attached");
      c.removeAttribute("_change_attached")
    }
  }
  function B(a) {
    return typeof a.getElementsByTagName !== "undefined" ? a.getElementsByTagName("*") : typeof a.querySelectorAll !== "undefined" ? a.querySelectorAll("*") : []
  }
  function Z(a) {
    if(a.type === "checkbox" || a.type === "radio") {
      a.defaultChecked = a.checked
    }
  }
  function R(a) {
    var c = (a.nodeName || "").toLowerCase();
    c === "input" ? Z(a) : c !== "script" && typeof a.getElementsByTagName !== "undefined" && b.grep(a.getElementsByTagName("input"), Z)
  }
  function $(a, c, h) {
    var k = c === "width" ? a.offsetWidth : a.offsetHeight, d = c === "width" ? 1 : 0;
    if(k > 0) {
      if(h !== "border") {
        for(;d < 4;d += 2) {
          h || (k -= parseFloat(b.css(a, "padding" + aa[d])) || 0), h === "margin" ? k += parseFloat(b.css(a, h + aa[d])) || 0 : k -= parseFloat(b.css(a, "border" + aa[d] + "Width")) || 0
        }
      }
      return k + "px"
    }
    k = ia(a, c);
    if(k < 0 || k == null) {
      k = a.style[c]
    }
    if(sa.test(k)) {
      return k
    }
    k = parseFloat(k) || 0;
    if(h) {
      for(;d < 4;d += 2) {
        k += parseFloat(b.css(a, "padding" + aa[d])) || 0, h !== "padding" && (k += parseFloat(b.css(a, "border" + aa[d] + "Width")) || 0), h === "margin" && (k += parseFloat(b.css(a, h + aa[d])) || 0)
      }
    }
    return k + "px"
  }
  function ba(a) {
    return function(c, h) {
      var u;
      typeof c !== "string" && (h = c, c = "*");
      if(b.isFunction(h)) {
        for(var k = c.toLowerCase().split(Da), d = 0, e = k.length, i, C;d < e;d++) {
          i = k[d], (C = /^\+/.test(i)) && (i = i.substr(1) || "*"), u = a[i] = a[i] || [], i = u, i[C ? "unshift" : "push"](h)
        }
      }
    }
  }
  function S(a, c, b, k, d, e) {
    d = d || c.dataTypes[0];
    e = e || {};
    e[d] = !0;
    for(var d = a[d], i = 0, C = d ? d.length : 0, f = a === ta, g;i < C && (f || !g);i++) {
      g = d[i](c, b, k), typeof g === "string" && (!f || e[g] ? g = p : (c.dataTypes.unshift(g), g = S(a, c, b, k, g, e)))
    }
    if((f || !g) && !e["*"]) {
      g = S(a, c, b, k, "*", e)
    }
    return g
  }
  function ca(a, c) {
    var h, k, d = b.ajaxSettings.flatOptions || {};
    for(h in c) {
      c[h] !== p && ((d[h] ? a : k || (k = {}))[h] = c[h])
    }
    k && b.extend(!0, a, k)
  }
  function da(a, c, h, k) {
    if(b.isArray(c)) {
      b.each(c, function(c, b) {
        h || db.test(a) ? k(a, b) : da(a + "[" + (typeof b === "object" ? c : "") + "]", b, h, k)
      })
    }else {
      if(!h && b.type(c) === "object") {
        for(var d in c) {
          da(a + "[" + d + "]", c[d], h, k)
        }
      }else {
        k(a, c)
      }
    }
  }
  function T() {
    try {
      return new s.XMLHttpRequest
    }catch(a) {
    }
  }
  function l() {
    setTimeout(z, 0);
    return oa = b.now()
  }
  function z() {
    oa = p
  }
  function P(a, c) {
    var h = {};
    b.each(pa.concat.apply([], pa.slice(0, c)), function() {
      h[this] = a
    });
    return h
  }
  function ea(a) {
    if(!ua[a]) {
      var c = n.body, h = b("<" + a + ">").appendTo(c), k = h.css("display");
      h.remove();
      if(k === "none" || k === "") {
        if(!F) {
          F = n.createElement("iframe"), F.frameBorder = F.width = F.height = 0
        }
        c.appendChild(F);
        if(!ja || !F.createElement) {
          ja = (F.contentWindow || F.contentDocument).document, ja.write((b.support.boxModel ? "<!doctype html>" : "") + "<html><body>"), ja.close()
        }
        h = ja.createElement(a);
        ja.body.appendChild(h);
        k = b.css(h, "display");
        c.removeChild(F)
      }
      ua[a] = k
    }
    return ua[a]
  }
  function K(a) {
    return b.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1
  }
  var n = s.document, U = s.navigator, fa = s.location, b = function() {
    function a() {
      if(!c.isReady) {
        try {
          n.documentElement.doScroll("left")
        }catch(b) {
          setTimeout(a, 1);
          return
        }
        c.ready()
      }
    }
    var c = function(a, b) {
      return new c.fn.init(a, b, d)
    }, b = s.jQuery, k = s.$, d, e = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, i = /\S/, C = /^\s+/, f = /\s+$/, g = /^<(\w+)\s*\/?>(?:<\/\1>)?$/, j = /^[\],:{}\s]*$/, l = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, t = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, o = /(?:^|:|,)(?:\s*\[)+/g, m = /(webkit)[ \/]([\w.]+)/, q = /(opera)(?:.*version)?[ \/]([\w.]+)/, r = /(msie) ([\w.]+)/, D = /(mozilla)(?:.*? rv:([\w.]+))?/, y = /-([a-z]|[0-9])/ig, x = /^-ms-/, w = function(a, c) {
      return(c + "").toUpperCase()
    }, v = U.userAgent, L, ka, eb = Object.prototype.toString, va = Object.prototype.hasOwnProperty, wa = Array.prototype.push, na = Array.prototype.slice, Fa = String.prototype.trim, Ga = Array.prototype.indexOf, Ha = {};
    c.fn = c.prototype = {constructor:c, init:function(a, b, h) {
      var k;
      if(!a) {
        return this
      }
      if(a.nodeType) {
        return this.context = this[0] = a, this.length = 1, this
      }
      if(a === "body" && !b && n.body) {
        return this.context = n, this[0] = n.body, this.selector = a, this.length = 1, this
      }
      if(typeof a === "string") {
        if((k = a.charAt(0) === "<" && a.charAt(a.length - 1) === ">" && a.length >= 3 ? [null, a, null] : e.exec(a)) && (k[1] || !b)) {
          if(k[1]) {
            return h = (b = b instanceof c ? b[0] : b) ? b.ownerDocument || b : n, (a = g.exec(a)) ? c.isPlainObject(b) ? (a = [n.createElement(a[1])], c.fn.attr.call(a, b, !0)) : a = [h.createElement(a[1])] : (a = c.buildFragment([k[1]], [h]), a = (a.cacheable ? c.clone(a.fragment) : a.fragment).childNodes), c.merge(this, a)
          }else {
            if((b = n.getElementById(k[2])) && b.parentNode) {
              if(b.id !== k[2]) {
                return h.find(a)
              }
              this.length = 1;
              this[0] = b
            }
            this.context = n;
            this.selector = a;
            return this
          }
        }else {
          return!b || b.jquery ? (b || h).find(a) : this.constructor(b).find(a)
        }
      }else {
        if(c.isFunction(a)) {
          return h.ready(a)
        }
      }
      if(a.selector !== p) {
        this.selector = a.selector, this.context = a.context
      }
      return c.makeArray(a, this)
    }, selector:"", jquery:"1.7.2", length:0, size:function() {
      return this.length
    }, toArray:function() {
      return na.call(this, 0)
    }, get:function(a) {
      return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a]
    }, pushStack:function(a, b, h) {
      var k = this.constructor();
      c.isArray(a) ? wa.apply(k, a) : c.merge(k, a);
      k.prevObject = this;
      k.context = this.context;
      if(b === "find") {
        k.selector = this.selector + (this.selector ? " " : "") + h
      }else {
        if(b) {
          k.selector = this.selector + "." + b + "(" + h + ")"
        }
      }
      return k
    }, each:function(a, b) {
      return c.each(this, a, b)
    }, ready:function(a) {
      c.bindReady();
      L.add(a);
      return this
    }, eq:function(a) {
      a = +a;
      return a === -1 ? this.slice(a) : this.slice(a, a + 1)
    }, first:function() {
      return this.eq(0)
    }, last:function() {
      return this.eq(-1)
    }, slice:function() {
      return this.pushStack(na.apply(this, arguments), "slice", na.call(arguments).join(","))
    }, map:function(a) {
      return this.pushStack(c.map(this, function(c, b) {
        return a.call(c, b, c)
      }))
    }, end:function() {
      return this.prevObject || this.constructor(null)
    }, push:wa, sort:[].sort, splice:[].splice};
    c.fn.init.prototype = c.fn;
    c.extend = c.fn.extend = function() {
      var a, b, h, k, d, u = arguments[0] || {}, e = 1, i = arguments.length, L = !1;
      typeof u === "boolean" && (L = u, u = arguments[1] || {}, e = 2);
      typeof u !== "object" && !c.isFunction(u) && (u = {});
      i === e && (u = this, --e);
      for(;e < i;e++) {
        if((a = arguments[e]) != null) {
          for(b in a) {
            h = u[b], k = a[b], u !== k && (L && k && (c.isPlainObject(k) || (d = c.isArray(k))) ? (d ? (d = !1, h = h && c.isArray(h) ? h : []) : h = h && c.isPlainObject(h) ? h : {}, u[b] = c.extend(L, h, k)) : k !== p && (u[b] = k))
          }
        }
      }
      return u
    };
    c.extend({noConflict:function(a) {
      if(s.$ === c) {
        s.$ = k
      }
      if(a && s.jQuery === c) {
        s.jQuery = b
      }
      return c
    }, isReady:!1, readyWait:1, holdReady:function(a) {
      a ? c.readyWait++ : c.ready(!0)
    }, ready:function(a) {
      if(a === !0 && !--c.readyWait || a !== !0 && !c.isReady) {
        if(!n.body) {
          return setTimeout(c.ready, 1)
        }
        c.isReady = !0;
        a !== !0 && --c.readyWait > 0 || (L.fireWith(n, [c]), c.fn.trigger && c(n).trigger("ready").off("ready"))
      }
    }, bindReady:function() {
      if(!L) {
        L = c.Callbacks("once memory");
        if(n.readyState === "complete") {
          return setTimeout(c.ready, 1)
        }
        if(n.addEventListener) {
          n.addEventListener("DOMContentLoaded", ka, !1), s.addEventListener("load", c.ready, !1)
        }else {
          if(n.attachEvent) {
            n.attachEvent("onreadystatechange", ka);
            s.attachEvent("onload", c.ready);
            var b = !1;
            try {
              b = s.frameElement == null
            }catch(h) {
            }
            n.documentElement.doScroll && b && a()
          }
        }
      }
    }, isFunction:function(a) {
      return c.type(a) === "function"
    }, isArray:Array.isArray || function(a) {
      return c.type(a) === "array"
    }, isWindow:function(a) {
      return a != null && a == a.window
    }, isNumeric:function(a) {
      return!isNaN(parseFloat(a)) && isFinite(a)
    }, type:function(a) {
      return a == null ? String(a) : Ha[eb.call(a)] || "object"
    }, isPlainObject:function(a) {
      if(!a || c.type(a) !== "object" || a.nodeType || c.isWindow(a)) {
        return!1
      }
      try {
        if(a.constructor && !va.call(a, "constructor") && !va.call(a.constructor.prototype, "isPrototypeOf")) {
          return!1
        }
      }catch(b) {
        return!1
      }
      for(var h in a) {
      }
      return h === p || va.call(a, h)
    }, isEmptyObject:function(a) {
      for(var c in a) {
        return!1
      }
      return!0
    }, error:function(a) {
      throw Error(a);
    }, parseJSON:function(a) {
      if(typeof a !== "string" || !a) {
        return null
      }
      a = c.trim(a);
      if(s.JSON && s.JSON.parse) {
        return s.JSON.parse(a)
      }
      if(j.test(a.replace(l, "@").replace(t, "]").replace(o, ""))) {
        return(new Function("return " + a))()
      }
      c.error("Invalid JSON: " + a)
    }, parseXML:function(a) {
      if(typeof a !== "string" || !a) {
        return null
      }
      var b, h;
      try {
        s.DOMParser ? (h = new DOMParser, b = h.parseFromString(a, "text/xml")) : (b = new ActiveXObject("Microsoft.XMLDOM"), b.async = "false", b.loadXML(a))
      }catch(k) {
        b = p
      }
      (!b || !b.documentElement || b.getElementsByTagName("parsererror").length) && c.error("Invalid XML: " + a);
      return b
    }, noop:function() {
    }, globalEval:function(a) {
      a && i.test(a) && (s.execScript || function(a) {
        s.eval.call(s, a)
      })(a)
    }, camelCase:function(a) {
      return a.replace(x, "ms-").replace(y, w)
    }, nodeName:function(a, c) {
      return a.nodeName && a.nodeName.toUpperCase() === c.toUpperCase()
    }, each:function(a, b, h) {
      var k, d = 0, u = a.length, e = u === p || c.isFunction(a);
      if(h) {
        if(e) {
          for(k in a) {
            if(b.apply(a[k], h) === !1) {
              break
            }
          }
        }else {
          for(;d < u;) {
            if(b.apply(a[d++], h) === !1) {
              break
            }
          }
        }
      }else {
        if(e) {
          for(k in a) {
            if(b.call(a[k], k, a[k]) === !1) {
              break
            }
          }
        }else {
          for(;d < u;) {
            if(b.call(a[d], d, a[d++]) === !1) {
              break
            }
          }
        }
      }
      return a
    }, trim:Fa ? function(a) {
      return a == null ? "" : Fa.call(a)
    } : function(a) {
      return a == null ? "" : a.toString().replace(C, "").replace(f, "")
    }, makeArray:function(a, b) {
      var h = b || [];
      if(a != null) {
        var k = c.type(a);
        a.length == null || k === "string" || k === "function" || k === "regexp" || c.isWindow(a) ? wa.call(h, a) : c.merge(h, a)
      }
      return h
    }, inArray:function(a, c, b) {
      var h;
      if(c) {
        if(Ga) {
          return Ga.call(c, a, b)
        }
        h = c.length;
        for(b = b ? b < 0 ? Math.max(0, h + b) : b : 0;b < h;b++) {
          if(b in c && c[b] === a) {
            return b
          }
        }
      }
      return-1
    }, merge:function(a, c) {
      var b = a.length, h = 0;
      if(typeof c.length === "number") {
        for(var k = c.length;h < k;h++) {
          a[b++] = c[h]
        }
      }else {
        for(;c[h] !== p;) {
          a[b++] = c[h++]
        }
      }
      a.length = b;
      return a
    }, grep:function(a, c, b) {
      for(var h = [], k, b = !!b, d = 0, u = a.length;d < u;d++) {
        k = !!c(a[d], d), b !== k && h.push(a[d])
      }
      return h
    }, map:function(a, b, h) {
      var k, d, u = [], e = 0, i = a.length;
      if(a instanceof c || i !== p && typeof i === "number" && (i > 0 && a[0] && a[i - 1] || i === 0 || c.isArray(a))) {
        for(;e < i;e++) {
          k = b(a[e], e, h), k != null && (u[u.length] = k)
        }
      }else {
        for(d in a) {
          k = b(a[d], d, h), k != null && (u[u.length] = k)
        }
      }
      return u.concat.apply([], u)
    }, guid:1, proxy:function(a, b) {
      if(typeof b === "string") {
        var h = a[b], b = a, a = h
      }
      if(!c.isFunction(a)) {
        return p
      }
      var k = na.call(arguments, 2), h = function() {
        return a.apply(b, k.concat(na.call(arguments)))
      };
      h.guid = a.guid = a.guid || h.guid || c.guid++;
      return h
    }, access:function(a, b, h, k, d, u, e) {
      var i, L = h == null, I = 0, C = a.length;
      if(h && typeof h === "object") {
        for(I in h) {
          c.access(a, b, I, h[I], 1, u, k)
        }
        d = 1
      }else {
        if(k !== p) {
          i = e === p && c.isFunction(k);
          L && (i ? (i = b, b = function(a, b, h) {
            return i.call(c(a), h)
          }) : (b.call(a, k), b = null));
          if(b) {
            for(;I < C;I++) {
              b(a[I], h, i ? k.call(a[I], I, b(a[I], h)) : k, e)
            }
          }
          d = 1
        }
      }
      return d ? a : L ? b.call(a) : C ? b(a[0], h) : u
    }, now:function() {
      return(new Date).getTime()
    }, uaMatch:function(a) {
      a = a.toLowerCase();
      a = m.exec(a) || q.exec(a) || r.exec(a) || a.indexOf("compatible") < 0 && D.exec(a) || [];
      return{browser:a[1] || "", version:a[2] || "0"}
    }, sub:function() {
      function a(c, b) {
        return new a.fn.init(c, b)
      }
      c.extend(!0, a, this);
      a.superclass = this;
      a.fn = a.prototype = this();
      a.fn.constructor = a;
      a.sub = this.sub;
      a.fn.init = function(h, k) {
        k && k instanceof c && !(k instanceof a) && (k = a(k));
        return c.fn.init.call(this, h, k, b)
      };
      a.fn.init.prototype = a.fn;
      var b = a(n);
      return a
    }, browser:{}});
    c.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(a, c) {
      Ha["[object " + c + "]"] = c.toLowerCase()
    });
    v = c.uaMatch(v);
    if(v.browser) {
      c.browser[v.browser] = !0, c.browser.version = v.version
    }
    if(c.browser.webkit) {
      c.browser.safari = !0
    }
    i.test(" ") && (C = /^[\s\xA0]+/, f = /[\s\xA0]+$/);
    d = c(n);
    n.addEventListener ? ka = function() {
      n.removeEventListener("DOMContentLoaded", ka, !1);
      c.ready()
    } : n.attachEvent && (ka = function() {
      n.readyState === "complete" && (n.detachEvent("onreadystatechange", ka), c.ready())
    });
    return c
  }(), X = {};
  b.Callbacks = function(a) {
    var a = a ? X[a] || E(a) : {}, c = [], h = [], k, d, e, i, C, f, g = function(h) {
      var k, d, u, e;
      for(k = 0, d = h.length;k < d;k++) {
        u = h[k], e = b.type(u), e === "array" ? g(u) : e === "function" && (!a.unique || !l.has(u)) && c.push(u)
      }
    }, j = function(b, g) {
      g = g || [];
      k = !a.memory || [b, g];
      e = d = !0;
      f = i || 0;
      i = 0;
      for(C = c.length;c && f < C;f++) {
        if(c[f].apply(b, g) === !1 && a.stopOnFalse) {
          k = !0;
          break
        }
      }
      e = !1;
      c && (a.once ? k === !0 ? l.disable() : c = [] : h && h.length && (k = h.shift(), l.fireWith(k[0], k[1])))
    }, l = {add:function() {
      if(c) {
        var a = c.length;
        g(arguments);
        e ? C = c.length : k && k !== !0 && (i = a, j(k[0], k[1]))
      }
      return this
    }, remove:function() {
      if(c) {
        for(var b = arguments, h = 0, k = b.length;h < k;h++) {
          for(var d = 0;d < c.length;d++) {
            if(b[h] === c[d] && (e && d <= C && (C--, d <= f && f--), c.splice(d--, 1), a.unique)) {
              break
            }
          }
        }
      }
      return this
    }, has:function(a) {
      if(c) {
        for(var b = 0, h = c.length;b < h;b++) {
          if(a === c[b]) {
            return!0
          }
        }
      }
      return!1
    }, empty:function() {
      c = [];
      return this
    }, disable:function() {
      c = h = k = p;
      return this
    }, disabled:function() {
      return!c
    }, lock:function() {
      h = p;
      (!k || k === !0) && l.disable();
      return this
    }, locked:function() {
      return!h
    }, fireWith:function(c, b) {
      h && (e ? a.once || h.push([c, b]) : (!a.once || !k) && j(c, b));
      return this
    }, fire:function() {
      l.fireWith(this, arguments);
      return this
    }, fired:function() {
      return!!d
    }};
    return l
  };
  var M = [].slice;
  b.extend({Deferred:function(a) {
    var c = b.Callbacks("once memory"), h = b.Callbacks("once memory"), k = b.Callbacks("memory"), d = "pending", e = {resolve:c, reject:h, notify:k}, i = {done:c.add, fail:h.add, progress:k.add, state:function() {
      return d
    }, isResolved:c.fired, isRejected:h.fired, then:function(a, c, b) {
      f.done(a).fail(c).progress(b);
      return this
    }, always:function() {
      f.done.apply(f, arguments).fail.apply(f, arguments);
      return this
    }, pipe:function(a, c, h) {
      return b.Deferred(function(k) {
        b.each({done:[a, "resolve"], fail:[c, "reject"], progress:[h, "notify"]}, function(a, c) {
          var h = c[0], d = c[1], u;
          if(b.isFunction(h)) {
            f[a](function() {
              if((u = h.apply(this, arguments)) && b.isFunction(u.promise)) {
                u.promise().then(k.resolve, k.reject, k.notify)
              }else {
                k[d + "With"](this === f ? k : this, [u])
              }
            })
          }else {
            f[a](k[d])
          }
        })
      }).promise()
    }, promise:function(a) {
      if(a == null) {
        a = i
      }else {
        for(var c in i) {
          a[c] = i[c]
        }
      }
      return a
    }}, f = i.promise({}), g;
    for(g in e) {
      f[g] = e[g].fire, f[g + "With"] = e[g].fireWith
    }
    f.done(function() {
      d = "resolved"
    }, h.disable, k.lock).fail(function() {
      d = "rejected"
    }, c.disable, k.lock);
    a && a.call(f, f);
    return f
  }, when:function(a) {
    function c(a) {
      return function(c) {
        k[a] = arguments.length > 1 ? M.call(arguments, 0) : c;
        --f || g.resolveWith(g, k)
      }
    }
    function h(a) {
      return function(c) {
        i[a] = arguments.length > 1 ? M.call(arguments, 0) : c;
        g.notifyWith(j, i)
      }
    }
    var k = M.call(arguments, 0), d = 0, e = k.length, i = Array(e), f = e, g = e <= 1 && a && b.isFunction(a.promise) ? a : b.Deferred(), j = g.promise();
    if(e > 1) {
      for(;d < e;d++) {
        k[d] && k[d].promise && b.isFunction(k[d].promise) ? k[d].promise().then(c(d), g.reject, h(d)) : --f
      }
      f || g.resolveWith(g, k)
    }else {
      g !== a && g.resolveWith(g, e ? [a] : [])
    }
    return j
  }});
  b.support = function() {
    var a, c, h, k, d, e, i, f, g = n.createElement("div");
    g.setAttribute("className", "t");
    g.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";
    c = g.getElementsByTagName("*");
    h = g.getElementsByTagName("a")[0];
    if(!c || !c.length || !h) {
      return{}
    }
    k = n.createElement("select");
    d = k.appendChild(n.createElement("option"));
    c = g.getElementsByTagName("input")[0];
    a = {leadingWhitespace:g.firstChild.nodeType === 3, tbody:!g.getElementsByTagName("tbody").length, htmlSerialize:!!g.getElementsByTagName("link").length, style:/top/.test(h.getAttribute("style")), hrefNormalized:h.getAttribute("href") === "/a", opacity:/^0.55/.test(h.style.opacity), cssFloat:!!h.style.cssFloat, checkOn:c.value === "on", optSelected:d.selected, getSetAttribute:g.className !== "t", enctype:!!n.createElement("form").enctype, html5Clone:n.createElement("nav").cloneNode(!0).outerHTML !== 
    "<:nav></:nav>", submitBubbles:!0, changeBubbles:!0, focusinBubbles:!1, deleteExpando:!0, noCloneEvent:!0, inlineBlockNeedsLayout:!1, shrinkWrapBlocks:!1, reliableMarginRight:!0, pixelMargin:!0};
    b.boxModel = a.boxModel = n.compatMode === "CSS1Compat";
    c.checked = !0;
    a.noCloneChecked = c.cloneNode(!0).checked;
    k.disabled = !0;
    a.optDisabled = !d.disabled;
    try {
      delete g.test
    }catch(j) {
      a.deleteExpando = !1
    }
    !g.addEventListener && g.attachEvent && g.fireEvent && (g.attachEvent("onclick", function() {
      a.noCloneEvent = !1
    }), g.cloneNode(!0).fireEvent("onclick"));
    c = n.createElement("input");
    c.value = "t";
    c.setAttribute("type", "radio");
    a.radioValue = c.value === "t";
    c.setAttribute("checked", "checked");
    c.setAttribute("name", "t");
    g.appendChild(c);
    h = n.createDocumentFragment();
    h.appendChild(g.lastChild);
    a.checkClone = h.cloneNode(!0).cloneNode(!0).lastChild.checked;
    a.appendChecked = c.checked;
    h.removeChild(c);
    h.appendChild(g);
    if(g.attachEvent) {
      for(i in{submit:1, change:1, focusin:1}) {
        c = "on" + i, f = c in g, f || (g.setAttribute(c, "return;"), f = typeof g[c] === "function"), a[i + "Bubbles"] = f
      }
    }
    h.removeChild(g);
    h = k = d = g = c = null;
    b(function() {
      var c, h, k, d, u = n.getElementsByTagName("body")[0];
      if(u) {
        c = n.createElement("div");
        c.style.cssText = "padding:0;margin:0;border:0;visibility:hidden;width:0;height:0;position:static;top:0;margin-top:1px";
        u.insertBefore(c, u.firstChild);
        g = n.createElement("div");
        c.appendChild(g);
        g.innerHTML = "<table><tr><td style='padding:0;margin:0;border:0;display:none'></td><td>t</td></tr></table>";
        e = g.getElementsByTagName("td");
        f = e[0].offsetHeight === 0;
        e[0].style.display = "";
        e[1].style.display = "none";
        a.reliableHiddenOffsets = f && e[0].offsetHeight === 0;
        if(s.getComputedStyle) {
          g.innerHTML = "", h = n.createElement("div"), h.style.width = "0", h.style.marginRight = "0", g.style.width = "2px", g.appendChild(h), a.reliableMarginRight = (parseInt((s.getComputedStyle(h, null) || {marginRight:0}).marginRight, 10) || 0) === 0
        }
        if(typeof g.style.zoom !== "undefined") {
          g.innerHTML = "", g.style.width = g.style.padding = "1px", g.style.border = 0, g.style.overflow = "hidden", g.style.display = "inline", g.style.zoom = 1, a.inlineBlockNeedsLayout = g.offsetWidth === 3, g.style.display = "block", g.style.overflow = "visible", g.innerHTML = "<div style='width:5px;'></div>", a.shrinkWrapBlocks = g.offsetWidth !== 3
        }
        g.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;padding:0;margin:0;border:0;visibility:hidden;";
        g.innerHTML = "<div style='position:absolute;top:0;left:0;width:1px;height:1px;padding:0;margin:0;border:5px solid #000;display:block;'><div style='padding:0;margin:0;border:0;display:block;overflow:hidden;'></div></div><table style='position:absolute;top:0;left:0;width:1px;height:1px;padding:0;margin:0;border:5px solid #000;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
        h = g.firstChild;
        k = h.firstChild;
        d = {doesNotAddBorder:k.offsetTop !== 5, doesAddBorderForTableAndCells:h.nextSibling.firstChild.firstChild.offsetTop === 5};
        k.style.position = "fixed";
        k.style.top = "20px";
        d.fixedPosition = k.offsetTop === 20 || k.offsetTop === 15;
        k.style.position = k.style.top = "";
        h.style.overflow = "hidden";
        h.style.position = "relative";
        d.subtractsBorderForOverflowNotVisible = k.offsetTop === -5;
        d.doesNotIncludeMarginInBodyOffset = u.offsetTop !== 1;
        if(s.getComputedStyle) {
          g.style.marginTop = "1%", a.pixelMargin = (s.getComputedStyle(g, null) || {marginTop:0}).marginTop !== "1%"
        }
        if(typeof c.style.zoom !== "undefined") {
          c.style.zoom = 1
        }
        u.removeChild(c);
        g = null;
        b.extend(a, d)
      }
    });
    return a
  }();
  var e = /^(?:\{.*\}|\[.*\])$/, f = /([A-Z])/g;
  b.extend({cache:{}, uuid:0, expando:"jQuery" + (b.fn.jquery + Math.random()).replace(/\D/g, ""), noData:{embed:!0, object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000", applet:!0}, hasData:function(a) {
    a = a.nodeType ? b.cache[a[b.expando]] : a[b.expando];
    return!!a && !v(a)
  }, data:function(a, c, h, k) {
    if(b.acceptData(a)) {
      var d;
      d = b.expando;
      var e = typeof c === "string", i = a.nodeType, g = i ? b.cache : a, f = i ? a[d] : a[d] && d, j = c === "events";
      if(f && g[f] && (j || k || g[f].data) || !(e && h === p)) {
        f || (i ? a[d] = f = ++b.uuid : f = d);
        if(!g[f] && (g[f] = {}, !i)) {
          g[f].toJSON = b.noop
        }
        if(typeof c === "object" || typeof c === "function") {
          k ? g[f] = b.extend(g[f], c) : g[f].data = b.extend(g[f].data, c)
        }
        d = a = g[f];
        if(!k) {
          if(!a.data) {
            a.data = {}
          }
          a = a.data
        }
        h !== p && (a[b.camelCase(c)] = h);
        if(j && !a[c]) {
          return d.events
        }
        e ? (h = a[c], h == null && (h = a[b.camelCase(c)])) : h = a;
        return h
      }
    }
  }, removeData:function(a, c, h) {
    if(b.acceptData(a)) {
      var k, d, e, i = b.expando, g = a.nodeType, f = g ? b.cache : a, j = g ? a[i] : i;
      if(f[j]) {
        if(c && (k = h ? f[j] : f[j].data)) {
          b.isArray(c) || (c in k ? c = [c] : (c = b.camelCase(c), c = c in k ? [c] : c.split(" ")));
          for(d = 0, e = c.length;d < e;d++) {
            delete k[c[d]]
          }
          if(!(h ? v : b.isEmptyObject)(k)) {
            return
          }
        }
        if(!h && (delete f[j].data, !v(f[j]))) {
          return
        }
        b.support.deleteExpando || !f.setInterval ? delete f[j] : f[j] = null;
        g && (b.support.deleteExpando ? delete a[i] : a.removeAttribute ? a.removeAttribute(i) : a[i] = null)
      }
    }
  }, _data:function(a, c, h) {
    return b.data(a, c, h, !0)
  }, acceptData:function(a) {
    if(a.nodeName) {
      var c = b.noData[a.nodeName.toLowerCase()];
      if(c) {
        return!(c === !0 || a.getAttribute("classid") !== c)
      }
    }
    return!0
  }});
  b.fn.extend({data:function(a, c) {
    var h, k, d, e, i, g = this[0], f = 0, j = null;
    if(a === p) {
      if(this.length && (j = b.data(g), g.nodeType === 1 && !b._data(g, "parsedAttrs"))) {
        d = g.attributes;
        for(i = d.length;f < i;f++) {
          e = d[f].name, e.indexOf("data-") === 0 && (e = b.camelCase(e.substring(5)), H(g, e, j[e]))
        }
        b._data(g, "parsedAttrs", !0)
      }
      return j
    }
    if(typeof a === "object") {
      return this.each(function() {
        b.data(this, a)
      })
    }
    h = a.split(".", 2);
    h[1] = h[1] ? "." + h[1] : "";
    k = h[1] + "!";
    return b.access(this, function(c) {
      if(c === p) {
        return j = this.triggerHandler("getData" + k, [h[0]]), j === p && g && (j = b.data(g, a), j = H(g, a, j)), j === p && h[1] ? this.data(h[0]) : j
      }
      h[1] = c;
      this.each(function() {
        var d = b(this);
        d.triggerHandler("setData" + k, h);
        b.data(this, a, c);
        d.triggerHandler("changeData" + k, h)
      })
    }, null, c, arguments.length > 1, null, !1)
  }, removeData:function(a) {
    return this.each(function() {
      b.removeData(this, a)
    })
  }});
  b.extend({_mark:function(a, c) {
    a && (c = (c || "fx") + "mark", b._data(a, c, (b._data(a, c) || 0) + 1))
  }, _unmark:function(a, c, h) {
    a !== !0 && (h = c, c = a, a = !1);
    if(c) {
      var h = h || "fx", k = h + "mark";
      (a = a ? 0 : (b._data(c, k) || 1) - 1) ? b._data(c, k, a) : (b.removeData(c, k, !0), O(c, h, "mark"))
    }
  }, queue:function(a, c, h) {
    var k;
    if(a) {
      return c = (c || "fx") + "queue", k = b._data(a, c), h && (!k || b.isArray(h) ? k = b._data(a, c, b.makeArray(h)) : k.push(h)), k || []
    }
  }, dequeue:function(a, c) {
    var c = c || "fx", h = b.queue(a, c), k = h.shift(), d = {};
    k === "inprogress" && (k = h.shift());
    k && (c === "fx" && h.unshift("inprogress"), b._data(a, c + ".run", d), k.call(a, function() {
      b.dequeue(a, c)
    }, d));
    h.length || (b.removeData(a, c + "queue " + c + ".run", !0), O(a, c, "queue"))
  }});
  b.fn.extend({queue:function(a, c) {
    var h = 2;
    typeof a !== "string" && (c = a, a = "fx", h--);
    return arguments.length < h ? b.queue(this[0], a) : c === p ? this : this.each(function() {
      var h = b.queue(this, a, c);
      a === "fx" && h[0] !== "inprogress" && b.dequeue(this, a)
    })
  }, dequeue:function(a) {
    return this.each(function() {
      b.dequeue(this, a)
    })
  }, delay:function(a, c) {
    a = b.fx ? b.fx.speeds[a] || a : a;
    return this.queue(c || "fx", function(c, b) {
      var d = setTimeout(c, a);
      b.stop = function() {
        clearTimeout(d)
      }
    })
  }, clearQueue:function(a) {
    return this.queue(a || "fx", [])
  }, promise:function(a, c) {
    function h() {
      --i || k.resolveWith(d, [d])
    }
    typeof a !== "string" && (c = a, a = p);
    for(var a = a || "fx", k = b.Deferred(), d = this, e = d.length, i = 1, g = a + "defer", f = a + "queue", j = a + "mark", l;e--;) {
      if(l = b.data(d[e], g, p, !0) || (b.data(d[e], f, p, !0) || b.data(d[e], j, p, !0)) && b.data(d[e], g, b.Callbacks("once memory"), !0)) {
        i++, l.add(h)
      }
    }
    h();
    return k.promise(c)
  }});
  var j = /[\n\t\r]/g, d = /\s+/, i = /\r/g, g = /^(?:button|input)$/i, t = /^(?:button|input|object|select|textarea)$/i, o = /^a(?:rea)?$/i, q = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, D = b.support.getSetAttribute, y, Ia, Ja;
  b.fn.extend({attr:function(a, c) {
    return b.access(this, b.attr, a, c, arguments.length > 1)
  }, removeAttr:function(a) {
    return this.each(function() {
      b.removeAttr(this, a)
    })
  }, prop:function(a, c) {
    return b.access(this, b.prop, a, c, arguments.length > 1)
  }, removeProp:function(a) {
    a = b.propFix[a] || a;
    return this.each(function() {
      try {
        this[a] = p, delete this[a]
      }catch(c) {
      }
    })
  }, addClass:function(a) {
    var c, h, k, e, i, g, f;
    if(b.isFunction(a)) {
      return this.each(function(c) {
        b(this).addClass(a.call(this, c, this.className))
      })
    }
    if(a && typeof a === "string") {
      c = a.split(d);
      for(h = 0, k = this.length;h < k;h++) {
        if(e = this[h], e.nodeType === 1) {
          if(!e.className && c.length === 1) {
            e.className = a
          }else {
            i = " " + e.className + " ";
            for(g = 0, f = c.length;g < f;g++) {
              ~i.indexOf(" " + c[g] + " ") || (i += c[g] + " ")
            }
            e.className = b.trim(i)
          }
        }
      }
    }
    return this
  }, removeClass:function(a) {
    var c, h, k, e, i, g, f;
    if(b.isFunction(a)) {
      return this.each(function(c) {
        b(this).removeClass(a.call(this, c, this.className))
      })
    }
    if(a && typeof a === "string" || a === p) {
      c = (a || "").split(d);
      for(h = 0, k = this.length;h < k;h++) {
        if(e = this[h], e.nodeType === 1 && e.className) {
          if(a) {
            i = (" " + e.className + " ").replace(j, " ");
            for(g = 0, f = c.length;g < f;g++) {
              i = i.replace(" " + c[g] + " ", " ")
            }
            e.className = b.trim(i)
          }else {
            e.className = ""
          }
        }
      }
    }
    return this
  }, toggleClass:function(a, c) {
    var h = typeof a, k = typeof c === "boolean";
    return b.isFunction(a) ? this.each(function(h) {
      b(this).toggleClass(a.call(this, h, this.className, c), c)
    }) : this.each(function() {
      if(h === "string") {
        for(var e, i = 0, g = b(this), f = c, j = a.split(d);e = j[i++];) {
          f = k ? f : !g.hasClass(e), g[f ? "addClass" : "removeClass"](e)
        }
      }else {
        if(h === "undefined" || h === "boolean") {
          this.className && b._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : b._data(this, "__className__") || ""
        }
      }
    })
  }, hasClass:function(a) {
    for(var a = " " + a + " ", c = 0, b = this.length;c < b;c++) {
      if(this[c].nodeType === 1 && (" " + this[c].className + " ").replace(j, " ").indexOf(a) > -1) {
        return!0
      }
    }
    return!1
  }, val:function(a) {
    var c, h, k, d = this[0];
    if(arguments.length) {
      return k = b.isFunction(a), this.each(function(h) {
        var d = b(this);
        if(this.nodeType === 1 && (h = k ? a.call(this, h, d.val()) : a, h == null ? h = "" : typeof h === "number" ? h += "" : b.isArray(h) && (h = b.map(h, function(a) {
          return a == null ? "" : a + ""
        })), c = b.valHooks[this.type] || b.valHooks[this.nodeName.toLowerCase()], !c || !("set" in c) || c.set(this, h, "value") === p)) {
          this.value = h
        }
      })
    }else {
      if(d) {
        if((c = b.valHooks[d.type] || b.valHooks[d.nodeName.toLowerCase()]) && "get" in c && (h = c.get(d, "value")) !== p) {
          return h
        }
        h = d.value;
        return typeof h === "string" ? h.replace(i, "") : h == null ? "" : h
      }
    }
  }});
  b.extend({valHooks:{option:{get:function(a) {
    var c = a.attributes.value;
    return!c || c.specified ? a.value : a.text
  }}, select:{get:function(a) {
    var c, h, k = a.selectedIndex, d = [], e = a.options, i = a.type === "select-one";
    if(k < 0) {
      return null
    }
    a = i ? k : 0;
    for(h = i ? k + 1 : e.length;a < h;a++) {
      if(c = e[a], c.selected && (b.support.optDisabled ? !c.disabled : c.getAttribute("disabled") === null) && (!c.parentNode.disabled || !b.nodeName(c.parentNode, "optgroup"))) {
        c = b(c).val();
        if(i) {
          return c
        }
        d.push(c)
      }
    }
    return i && !d.length && e.length ? b(e[k]).val() : d
  }, set:function(a, c) {
    var h = b.makeArray(c);
    b(a).find("option").each(function() {
      this.selected = b.inArray(b(this).val(), h) >= 0
    });
    if(!h.length) {
      a.selectedIndex = -1
    }
    return h
  }}}, attrFn:{val:!0, css:!0, html:!0, text:!0, data:!0, width:!0, height:!0, offset:!0}, attr:function(a, c, h, k) {
    var d, e, i = a.nodeType;
    if(a && !(i === 3 || i === 8 || i === 2)) {
      if(k && c in b.attrFn) {
        return b(a)[c](h)
      }
      if(typeof a.getAttribute === "undefined") {
        return b.prop(a, c, h)
      }
      if(k = i !== 1 || !b.isXMLDoc(a)) {
        c = c.toLowerCase(), e = b.attrHooks[c] || (q.test(c) ? Ia : y)
      }
      if(h !== p) {
        if(h === null) {
          b.removeAttr(a, c)
        }else {
          return e && "set" in e && k && (d = e.set(a, h, c)) !== p ? d : (a.setAttribute(c, "" + h), h)
        }
      }else {
        return e && "get" in e && k && (d = e.get(a, c)) !== null ? d : (d = a.getAttribute(c), d === null ? p : d)
      }
    }
  }, removeAttr:function(a, c) {
    var h, k, e, i, g, f = 0;
    if(c && a.nodeType === 1) {
      k = c.toLowerCase().split(d);
      for(i = k.length;f < i;f++) {
        if(e = k[f]) {
          h = b.propFix[e] || e, (g = q.test(e)) || b.attr(a, e, ""), a.removeAttribute(D ? e : h), g && h in a && (a[h] = !1)
        }
      }
    }
  }, attrHooks:{type:{set:function(a, c) {
    if(g.test(a.nodeName) && a.parentNode) {
      b.error("type property can't be changed")
    }else {
      if(!b.support.radioValue && c === "radio" && b.nodeName(a, "input")) {
        var h = a.value;
        a.setAttribute("type", c);
        if(h) {
          a.value = h
        }
        return c
      }
    }
  }}, value:{get:function(a, c) {
    return y && b.nodeName(a, "button") ? y.get(a, c) : c in a ? a.value : null
  }, set:function(a, c, h) {
    if(y && b.nodeName(a, "button")) {
      return y.set(a, c, h)
    }
    a.value = c
  }}}, propFix:{tabindex:"tabIndex", readonly:"readOnly", "for":"htmlFor", "class":"className", maxlength:"maxLength", cellspacing:"cellSpacing", cellpadding:"cellPadding", rowspan:"rowSpan", colspan:"colSpan", usemap:"useMap", frameborder:"frameBorder", contenteditable:"contentEditable"}, prop:function(a, c, h) {
    var d, e, i = a.nodeType;
    if(a && !(i === 3 || i === 8 || i === 2)) {
      if(i !== 1 || !b.isXMLDoc(a)) {
        c = b.propFix[c] || c, e = b.propHooks[c]
      }
      return h !== p ? e && "set" in e && (d = e.set(a, h, c)) !== p ? d : a[c] = h : e && "get" in e && (d = e.get(a, c)) !== null ? d : a[c]
    }
  }, propHooks:{tabIndex:{get:function(a) {
    var c = a.getAttributeNode("tabindex");
    return c && c.specified ? parseInt(c.value, 10) : t.test(a.nodeName) || o.test(a.nodeName) && a.href ? 0 : p
  }}}});
  b.attrHooks.tabindex = b.propHooks.tabIndex;
  Ia = {get:function(a, c) {
    var h, d = b.prop(a, c);
    return d === !0 || typeof d !== "boolean" && (h = a.getAttributeNode(c)) && h.nodeValue !== !1 ? c.toLowerCase() : p
  }, set:function(a, c, h) {
    c === !1 ? b.removeAttr(a, h) : (c = b.propFix[h] || h, c in a && (a[c] = !0), a.setAttribute(h, h.toLowerCase()));
    return h
  }};
  if(!D) {
    Ja = {name:!0, id:!0, coords:!0}, y = b.valHooks.button = {get:function(a, c) {
      var b;
      return(b = a.getAttributeNode(c)) && (Ja[c] ? b.nodeValue !== "" : b.specified) ? b.nodeValue : p
    }, set:function(a, c, b) {
      var d = a.getAttributeNode(b);
      d || (d = n.createAttribute(b), a.setAttributeNode(d));
      return d.nodeValue = c + ""
    }}, b.attrHooks.tabindex.set = y.set, b.each(["width", "height"], function(a, c) {
      b.attrHooks[c] = b.extend(b.attrHooks[c], {set:function(a, b) {
        if(b === "") {
          return a.setAttribute(c, "auto"), b
        }
      }})
    }), b.attrHooks.contenteditable = {get:y.get, set:function(a, c, b) {
      c === "" && (c = "false");
      y.set(a, c, b)
    }}
  }
  b.support.hrefNormalized || b.each(["href", "src", "width", "height"], function(a, c) {
    b.attrHooks[c] = b.extend(b.attrHooks[c], {get:function(a) {
      a = a.getAttribute(c, 2);
      return a === null ? p : a
    }})
  });
  if(!b.support.style) {
    b.attrHooks.style = {get:function(a) {
      return a.style.cssText.toLowerCase() || p
    }, set:function(a, c) {
      return a.style.cssText = "" + c
    }}
  }
  if(!b.support.optSelected) {
    b.propHooks.selected = b.extend(b.propHooks.selected, {get:function() {
      return null
    }})
  }
  if(!b.support.enctype) {
    b.propFix.enctype = "encoding"
  }
  b.support.checkOn || b.each(["radio", "checkbox"], function() {
    b.valHooks[this] = {get:function(a) {
      return a.getAttribute("value") === null ? "on" : a.value
    }}
  });
  b.each(["radio", "checkbox"], function() {
    b.valHooks[this] = b.extend(b.valHooks[this], {set:function(a, c) {
      if(b.isArray(c)) {
        return a.checked = b.inArray(b(a).val(), c) >= 0
      }
    }})
  });
  var xa = /^(?:textarea|input|select)$/i, Ka = /^([^\.]*)?(?:\.(.+))?$/, fb = /(?:^|\s)hover(\.\S+)?\b/, gb = /^key/, hb = /^(?:mouse|contextmenu)|click/, La = /^(?:focusinfocus|focusoutblur)$/, ib = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/, jb = function(a) {
    if(a = ib.exec(a)) {
      a[1] = (a[1] || "").toLowerCase(), a[3] = a[3] && RegExp("(?:^|\\s)" + a[3] + "(?:\\s|$)")
    }
    return a
  }, Ma = function(a) {
    return b.event.special.hover ? a : a.replace(fb, "mouseenter$1 mouseleave$1")
  };
  b.event = {add:function(a, c, h, d, e) {
    var i, g, f, j, l, t, o, m, q;
    if(!(a.nodeType === 3 || a.nodeType === 8 || !c || !h || !(i = b._data(a)))) {
      if(h.handler) {
        o = h, h = o.handler, e = o.selector
      }
      if(!h.guid) {
        h.guid = b.guid++
      }
      f = i.events;
      if(!f) {
        i.events = f = {}
      }
      g = i.handle;
      if(!g) {
        i.handle = g = function(a) {
          return typeof b !== "undefined" && (!a || b.event.triggered !== a.type) ? b.event.dispatch.apply(g.elem, arguments) : p
        }, g.elem = a
      }
      c = b.trim(Ma(c)).split(" ");
      for(i = 0;i < c.length;i++) {
        j = Ka.exec(c[i]) || [];
        l = j[1];
        t = (j[2] || "").split(".").sort();
        q = b.event.special[l] || {};
        l = (e ? q.delegateType : q.bindType) || l;
        q = b.event.special[l] || {};
        j = b.extend({type:l, origType:j[1], data:d, handler:h, guid:h.guid, selector:e, quick:e && jb(e), namespace:t.join(".")}, o);
        m = f[l];
        if(!m && (m = f[l] = [], m.delegateCount = 0, !q.setup || q.setup.call(a, d, t, g) === !1)) {
          a.addEventListener ? a.addEventListener(l, g, !1) : a.attachEvent && a.attachEvent("on" + l, g)
        }
        if(q.add && (q.add.call(a, j), !j.handler.guid)) {
          j.handler.guid = h.guid
        }
        e ? m.splice(m.delegateCount++, 0, j) : m.push(j);
        b.event.global[l] = !0
      }
      a = null
    }
  }, global:{}, remove:function(a, c, h, d, e) {
    var i = b.hasData(a) && b._data(a), g, f, j, l, t, o, m, q, p, n;
    if(i && (m = i.events)) {
      c = b.trim(Ma(c || "")).split(" ");
      for(g = 0;g < c.length;g++) {
        if(f = Ka.exec(c[g]) || [], j = l = f[1], f = f[2], j) {
          q = b.event.special[j] || {};
          j = (d ? q.delegateType : q.bindType) || j;
          p = m[j] || [];
          t = p.length;
          f = f ? RegExp("(^|\\.)" + f.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
          for(o = 0;o < p.length;o++) {
            if(n = p[o], (e || l === n.origType) && (!h || h.guid === n.guid) && (!f || f.test(n.namespace)) && (!d || d === n.selector || d === "**" && n.selector)) {
              p.splice(o--, 1), n.selector && p.delegateCount--, q.remove && q.remove.call(a, n)
            }
          }
          p.length === 0 && t !== p.length && ((!q.teardown || q.teardown.call(a, f) === !1) && b.removeEvent(a, j, i.handle), delete m[j])
        }else {
          for(j in m) {
            b.event.remove(a, j + c[g], h, d, !0)
          }
        }
      }
      if(b.isEmptyObject(m)) {
        if(c = i.handle) {
          c.elem = null
        }
        b.removeData(a, ["events", "handle"], !0)
      }
    }
  }, customEvent:{getData:!0, setData:!0, changeData:!0}, trigger:function(a, c, h, d) {
    if(!h || !(h.nodeType === 3 || h.nodeType === 8)) {
      var e = a.type || a, i = [], g, f, j, l, t;
      if(!La.test(e + b.event.triggered) && (e.indexOf("!") >= 0 && (e = e.slice(0, -1), g = !0), e.indexOf(".") >= 0 && (i = e.split("."), e = i.shift(), i.sort()), h && !b.event.customEvent[e] || b.event.global[e])) {
        if(a = typeof a === "object" ? a[b.expando] ? a : new b.Event(e, a) : new b.Event(e), a.type = e, a.isTrigger = !0, a.exclusive = g, a.namespace = i.join("."), a.namespace_re = a.namespace ? RegExp("(^|\\.)" + i.join("\\.(?:.*\\.)?") + "(\\.|$)") : null, g = e.indexOf(":") < 0 ? "on" + e : "", h) {
          a.result = p;
          if(!a.target) {
            a.target = h
          }
          c = c != null ? b.makeArray(c) : [];
          c.unshift(a);
          j = b.event.special[e] || {};
          if(!(j.trigger && j.trigger.apply(h, c) === !1)) {
            t = [[h, j.bindType || e]];
            if(!d && !j.noBubble && !b.isWindow(h)) {
              l = j.delegateType || e;
              i = La.test(l + e) ? h : h.parentNode;
              for(f = null;i;i = i.parentNode) {
                t.push([i, l]), f = i
              }
              f && f === h.ownerDocument && t.push([f.defaultView || f.parentWindow || s, l])
            }
            for(f = 0;f < t.length && !a.isPropagationStopped();f++) {
              i = t[f][0], a.type = t[f][1], (l = (b._data(i, "events") || {})[a.type] && b._data(i, "handle")) && l.apply(i, c), (l = g && i[g]) && b.acceptData(i) && l.apply(i, c) === !1 && a.preventDefault()
            }
            a.type = e;
            if(!d && !a.isDefaultPrevented() && (!j._default || j._default.apply(h.ownerDocument, c) === !1) && !(e === "click" && b.nodeName(h, "a")) && b.acceptData(h)) {
              if(g && h[e] && (e !== "focus" && e !== "blur" || a.target.offsetWidth !== 0) && !b.isWindow(h)) {
                (f = h[g]) && (h[g] = null), b.event.triggered = e, h[e](), b.event.triggered = p, f && (h[g] = f)
              }
            }
            return a.result
          }
        }else {
          for(f in h = b.cache, h) {
            h[f].events && h[f].events[e] && b.event.trigger(a, c, h[f].handle.elem, !0)
          }
        }
      }
    }
  }, dispatch:function(a) {
    var a = b.event.fix(a || s.event), c = (b._data(this, "events") || {})[a.type] || [], h = c.delegateCount, d = [].slice.call(arguments, 0), e = !a.exclusive && !a.namespace, i = b.event.special[a.type] || {}, g = [], f, j, l, t, o, m, q;
    d[0] = a;
    a.delegateTarget = this;
    if(!(i.preDispatch && i.preDispatch.call(this, a) === !1)) {
      if(h && !(a.button && a.type === "click")) {
        l = b(this);
        l.context = this.ownerDocument || this;
        for(j = a.target;j != this;j = j.parentNode || this) {
          if(j.disabled !== !0) {
            o = {};
            m = [];
            l[0] = j;
            for(f = 0;f < h;f++) {
              t = c[f];
              q = t.selector;
              if(o[q] === p) {
                var n = o, r = q, D;
                if(t.quick) {
                  D = t.quick;
                  var y = j.attributes || {};
                  D = (!D[1] || j.nodeName.toLowerCase() === D[1]) && (!D[2] || (y.id || {}).value === D[2]) && (!D[3] || D[3].test((y["class"] || {}).value))
                }else {
                  D = l.is(q)
                }
                n[r] = D
              }
              o[q] && m.push(t)
            }
            m.length && g.push({elem:j, matches:m})
          }
        }
      }
      c.length > h && g.push({elem:this, matches:c.slice(h)});
      for(f = 0;f < g.length && !a.isPropagationStopped();f++) {
        h = g[f];
        a.currentTarget = h.elem;
        for(c = 0;c < h.matches.length && !a.isImmediatePropagationStopped();c++) {
          if(t = h.matches[c], e || !a.namespace && !t.namespace || a.namespace_re && a.namespace_re.test(t.namespace)) {
            if(a.data = t.data, a.handleObj = t, t = ((b.event.special[t.origType] || {}).handle || t.handler).apply(h.elem, d), t !== p) {
              a.result = t, t === !1 && (a.preventDefault(), a.stopPropagation())
            }
          }
        }
      }
      i.postDispatch && i.postDispatch.call(this, a);
      return a.result
    }
  }, props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "), fixHooks:{}, keyHooks:{props:"char charCode key keyCode".split(" "), filter:function(a, c) {
    if(a.which == null) {
      a.which = c.charCode != null ? c.charCode : c.keyCode
    }
    return a
  }}, mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "), filter:function(a, c) {
    var b, d, e = c.button, i = c.fromElement;
    if(a.pageX == null && c.clientX != null) {
      b = a.target.ownerDocument || n, d = b.documentElement, b = b.body, a.pageX = c.clientX + (d && d.scrollLeft || b && b.scrollLeft || 0) - (d && d.clientLeft || b && b.clientLeft || 0), a.pageY = c.clientY + (d && d.scrollTop || b && b.scrollTop || 0) - (d && d.clientTop || b && b.clientTop || 0)
    }
    if(!a.relatedTarget && i) {
      a.relatedTarget = i === a.target ? c.toElement : i
    }
    if(!a.which && e !== p) {
      a.which = e & 1 ? 1 : e & 2 ? 3 : e & 4 ? 2 : 0
    }
    return a
  }}, fix:function(a) {
    if(a[b.expando]) {
      return a
    }
    var c, h, d = a, e = b.event.fixHooks[a.type] || {}, i = e.props ? this.props.concat(e.props) : this.props, a = b.Event(d);
    for(c = i.length;c;) {
      h = i[--c], a[h] = d[h]
    }
    if(!a.target) {
      a.target = d.srcElement || n
    }
    if(a.target.nodeType === 3) {
      a.target = a.target.parentNode
    }
    if(a.metaKey === p) {
      a.metaKey = a.ctrlKey
    }
    return e.filter ? e.filter(a, d) : a
  }, special:{ready:{setup:b.bindReady}, load:{noBubble:!0}, focus:{delegateType:"focusin"}, blur:{delegateType:"focusout"}, beforeunload:{setup:function(a, c, h) {
    if(b.isWindow(this)) {
      this.onbeforeunload = h
    }
  }, teardown:function(a, c) {
    if(this.onbeforeunload === c) {
      this.onbeforeunload = null
    }
  }}}, simulate:function(a, c, h, d) {
    a = b.extend(new b.Event, h, {type:a, isSimulated:!0, originalEvent:{}});
    d ? b.event.trigger(a, null, c) : b.event.dispatch.call(c, a);
    a.isDefaultPrevented() && h.preventDefault()
  }};
  b.event.handle = b.event.dispatch;
  b.removeEvent = n.removeEventListener ? function(a, c, b) {
    a.removeEventListener && a.removeEventListener(c, b, !1)
  } : function(a, c, b) {
    a.detachEvent && a.detachEvent("on" + c, b)
  };
  b.Event = function(a, c) {
    if(!(this instanceof b.Event)) {
      return new b.Event(a, c)
    }
    a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? m : r) : this.type = a;
    c && b.extend(this, c);
    this.timeStamp = a && a.timeStamp || b.now();
    this[b.expando] = !0
  };
  b.Event.prototype = {preventDefault:function() {
    this.isDefaultPrevented = m;
    var a = this.originalEvent;
    if(a) {
      a.preventDefault ? a.preventDefault() : a.returnValue = !1
    }
  }, stopPropagation:function() {
    this.isPropagationStopped = m;
    var a = this.originalEvent;
    if(a) {
      a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0
    }
  }, stopImmediatePropagation:function() {
    this.isImmediatePropagationStopped = m;
    this.stopPropagation()
  }, isDefaultPrevented:r, isPropagationStopped:r, isImmediatePropagationStopped:r};
  b.each({mouseenter:"mouseover", mouseleave:"mouseout"}, function(a, c) {
    b.event.special[a] = {delegateType:c, bindType:c, handle:function(a) {
      var d = a.relatedTarget, e = a.handleObj, i;
      if(!d || d !== this && !b.contains(this, d)) {
        a.type = e.origType, i = e.handler.apply(this, arguments), a.type = c
      }
      return i
    }}
  });
  if(!b.support.submitBubbles) {
    b.event.special.submit = {setup:function() {
      if(b.nodeName(this, "form")) {
        return!1
      }
      b.event.add(this, "click._submit keypress._submit", function(a) {
        a = a.target;
        if((a = b.nodeName(a, "input") || b.nodeName(a, "button") ? a.form : p) && !a._submit_attached) {
          b.event.add(a, "submit._submit", function(a) {
            a._submit_bubble = !0
          }), a._submit_attached = !0
        }
      })
    }, postDispatch:function(a) {
      a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && b.event.simulate("submit", this.parentNode, a, !0))
    }, teardown:function() {
      if(b.nodeName(this, "form")) {
        return!1
      }
      b.event.remove(this, "._submit")
    }}
  }
  if(!b.support.changeBubbles) {
    b.event.special.change = {setup:function() {
      if(xa.test(this.nodeName)) {
        if(this.type === "checkbox" || this.type === "radio") {
          b.event.add(this, "propertychange._change", function(a) {
            if(a.originalEvent.propertyName === "checked") {
              this._just_changed = !0
            }
          }), b.event.add(this, "click._change", function(a) {
            if(this._just_changed && !a.isTrigger) {
              this._just_changed = !1, b.event.simulate("change", this, a, !0)
            }
          })
        }
        return!1
      }
      b.event.add(this, "beforeactivate._change", function(a) {
        a = a.target;
        if(xa.test(a.nodeName) && !a._change_attached) {
          b.event.add(a, "change._change", function(a) {
            this.parentNode && !a.isSimulated && !a.isTrigger && b.event.simulate("change", this.parentNode, a, !0)
          }), a._change_attached = !0
        }
      })
    }, handle:function(a) {
      var c = a.target;
      if(this !== c || a.isSimulated || a.isTrigger || c.type !== "radio" && c.type !== "checkbox") {
        return a.handleObj.handler.apply(this, arguments)
      }
    }, teardown:function() {
      b.event.remove(this, "._change");
      return xa.test(this.nodeName)
    }}
  }
  b.support.focusinBubbles || b.each({focus:"focusin", blur:"focusout"}, function(a, c) {
    var h = 0, d = function(a) {
      b.event.simulate(c, a.target, b.event.fix(a), !0)
    };
    b.event.special[c] = {setup:function() {
      h++ === 0 && n.addEventListener(a, d, !0)
    }, teardown:function() {
      --h === 0 && n.removeEventListener(a, d, !0)
    }}
  });
  b.fn.extend({on:function(a, c, h, d, e) {
    var i, g;
    if(typeof a === "object") {
      typeof c !== "string" && (h = h || c, c = p);
      for(g in a) {
        this.on(g, c, h, a[g], e)
      }
      return this
    }
    h == null && d == null ? (d = c, h = c = p) : d == null && (typeof c === "string" ? (d = h, h = p) : (d = h, h = c, c = p));
    if(d === !1) {
      d = r
    }else {
      if(!d) {
        return this
      }
    }
    if(e === 1) {
      i = d, d = function(a) {
        b().off(a);
        return i.apply(this, arguments)
      }, d.guid = i.guid || (i.guid = b.guid++)
    }
    return this.each(function() {
      b.event.add(this, a, d, h, c)
    })
  }, one:function(a, c, b, d) {
    return this.on(a, c, b, d, 1)
  }, off:function(a, c, d) {
    if(a && a.preventDefault && a.handleObj) {
      var k = a.handleObj;
      b(a.delegateTarget).off(k.namespace ? k.origType + "." + k.namespace : k.origType, k.selector, k.handler);
      return this
    }
    if(typeof a === "object") {
      for(k in a) {
        this.off(k, c, a[k])
      }
      return this
    }
    if(c === !1 || typeof c === "function") {
      d = c, c = p
    }
    d === !1 && (d = r);
    return this.each(function() {
      b.event.remove(this, a, d, c)
    })
  }, bind:function(a, c, b) {
    return this.on(a, null, c, b)
  }, unbind:function(a, c) {
    return this.off(a, null, c)
  }, live:function(a, c, d) {
    b(this.context).on(a, this.selector, c, d);
    return this
  }, die:function(a, c) {
    b(this.context).off(a, this.selector || "**", c);
    return this
  }, delegate:function(a, c, b, d) {
    return this.on(c, a, b, d)
  }, undelegate:function(a, c, b) {
    return arguments.length == 1 ? this.off(a, "**") : this.off(c, a, b)
  }, trigger:function(a, c) {
    return this.each(function() {
      b.event.trigger(a, c, this)
    })
  }, triggerHandler:function(a, c) {
    if(this[0]) {
      return b.event.trigger(a, c, this[0], !0)
    }
  }, toggle:function(a) {
    var c = arguments, d = a.guid || b.guid++, k = 0, e = function(d) {
      var h = (b._data(this, "lastToggle" + a.guid) || 0) % k;
      b._data(this, "lastToggle" + a.guid, h + 1);
      d.preventDefault();
      return c[h].apply(this, arguments) || !1
    };
    for(e.guid = d;k < c.length;) {
      c[k++].guid = d
    }
    return this.click(e)
  }, hover:function(a, c) {
    return this.mouseenter(a).mouseleave(c || a)
  }});
  b.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, c) {
    b.fn[c] = function(a, b) {
      b == null && (b = a, a = null);
      return arguments.length > 0 ? this.on(c, null, a, b) : this.trigger(c)
    };
    b.attrFn && (b.attrFn[c] = !0);
    if(gb.test(c)) {
      b.event.fixHooks[c] = b.event.keyHooks
    }
    if(hb.test(c)) {
      b.event.fixHooks[c] = b.event.mouseHooks
    }
  });
  (function() {
    function a(a, c, b, d, h, e) {
      for(var h = 0, i = d.length;h < i;h++) {
        var g = d[h];
        if(g) {
          for(var f = !1, g = g[a];g;) {
            if(g[k] === b) {
              f = d[g.sizset];
              break
            }
            if(g.nodeType === 1 && !e) {
              g[k] = b, g.sizset = h
            }
            if(g.nodeName.toLowerCase() === c) {
              f = g;
              break
            }
            g = g[a]
          }
          d[h] = f
        }
      }
    }
    function c(a, c, b, d, h, e) {
      for(var h = 0, i = d.length;h < i;h++) {
        var g = d[h];
        if(g) {
          for(var f = !1, g = g[a];g;) {
            if(g[k] === b) {
              f = d[g.sizset];
              break
            }
            if(g.nodeType === 1) {
              if(!e) {
                g[k] = b, g.sizset = h
              }
              if(typeof c !== "string") {
                if(g === c) {
                  f = !0;
                  break
                }
              }else {
                if(o.filter(c, [g]).length > 0) {
                  f = g;
                  break
                }
              }
            }
            g = g[a]
          }
          d[h] = f
        }
      }
    }
    var d = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, k = "sizcache" + (Math.random() + "").replace(".", ""), e = 0, i = Object.prototype.toString, g = !1, f = !0, j = /\\/g, l = /\r\n/g, t = /\W/;
    [0, 0].sort(function() {
      f = !1;
      return 0
    });
    var o = function(a, c, b, k) {
      var b = b || [], e = c = c || n;
      if(c.nodeType !== 1 && c.nodeType !== 9) {
        return[]
      }
      if(!a || typeof a !== "string") {
        return b
      }
      var g, f, j, u, l, t = !0, C = o.isXML(c), A = [], m = a;
      do {
        if(d.exec(""), g = d.exec(m)) {
          if(m = g[3], A.push(g[1]), g[2]) {
            u = g[3];
            break
          }
        }
      }while(g);
      if(A.length > 1 && r.exec(a)) {
        if(A.length === 2 && q.relative[A[0]]) {
          f = z(A[0] + A[1], c, k)
        }else {
          for(f = q.relative[A[0]] ? [c] : o(A.shift(), c);A.length;) {
            a = A.shift(), q.relative[a] && (a += A.shift()), f = z(a, f, k)
          }
        }
      }else {
        if(!k && A.length > 1 && c.nodeType === 9 && !C && q.match.ID.test(A[0]) && !q.match.ID.test(A[A.length - 1]) && (g = o.find(A.shift(), c, C), c = g.expr ? o.filter(g.expr, g.set)[0] : g.set[0]), c) {
          g = k ? {expr:A.pop(), set:y(k)} : o.find(A.pop(), A.length === 1 && (A[0] === "~" || A[0] === "+") && c.parentNode ? c.parentNode : c, C);
          f = g.expr ? o.filter(g.expr, g.set) : g.set;
          for(A.length > 0 ? j = y(f) : t = !1;A.length;) {
            g = l = A.pop(), q.relative[l] ? g = A.pop() : l = "", g == null && (g = c), q.relative[l](j, g, C)
          }
        }else {
          j = []
        }
      }
      j || (j = f);
      j || o.error(l || a);
      if(i.call(j) === "[object Array]") {
        if(t) {
          if(c && c.nodeType === 1) {
            for(a = 0;j[a] != null;a++) {
              j[a] && (j[a] === !0 || j[a].nodeType === 1 && o.contains(c, j[a])) && b.push(f[a])
            }
          }else {
            for(a = 0;j[a] != null;a++) {
              j[a] && j[a].nodeType === 1 && b.push(f[a])
            }
          }
        }else {
          b.push.apply(b, j)
        }
      }else {
        y(j, b)
      }
      u && (o(u, e, b, k), o.uniqueSort(b));
      return b
    };
    o.uniqueSort = function(a) {
      if(x && (g = f, a.sort(x), g)) {
        for(var c = 1;c < a.length;c++) {
          a[c] === a[c - 1] && a.splice(c--, 1)
        }
      }
      return a
    };
    o.matches = function(a, c) {
      return o(a, null, null, c)
    };
    o.matchesSelector = function(a, c) {
      return o(c, null, null, [a]).length > 0
    };
    o.find = function(a, c, b) {
      var d, h, k, e, i, g;
      if(!a) {
        return[]
      }
      for(h = 0, k = q.order.length;h < k;h++) {
        if(i = q.order[h], e = q.leftMatch[i].exec(a)) {
          if(g = e[1], e.splice(1, 1), g.substr(g.length - 1) !== "\\" && (e[1] = (e[1] || "").replace(j, ""), d = q.find[i](e, c, b), d != null)) {
            a = a.replace(q.match[i], "");
            break
          }
        }
      }
      d || (d = typeof c.getElementsByTagName !== "undefined" ? c.getElementsByTagName("*") : []);
      return{set:d, expr:a}
    };
    o.filter = function(a, c, b, d) {
      for(var h, k, e, i, g, f, j, u, l = a, t = [], I = c, A = c && c[0] && o.isXML(c[0]);a && c.length;) {
        for(e in q.filter) {
          if((h = q.leftMatch[e].exec(a)) != null && h[2]) {
            if(f = q.filter[e], g = h[1], k = !1, h.splice(1, 1), g.substr(g.length - 1) !== "\\") {
              I === t && (t = []);
              if(q.preFilter[e]) {
                if(h = q.preFilter[e](h, I, b, t, d, A)) {
                  if(h === !0) {
                    continue
                  }
                }else {
                  k = i = !0
                }
              }
              if(h) {
                for(j = 0;(g = I[j]) != null;j++) {
                  g && (i = f(g, h, j, I), u = d ^ i, b && i != null ? u ? k = !0 : I[j] = !1 : u && (t.push(g), k = !0))
                }
              }
              if(i !== p) {
                b || (I = t);
                a = a.replace(q.match[e], "");
                if(!k) {
                  return[]
                }
                break
              }
            }
          }
        }
        if(a === l) {
          if(k == null) {
            o.error(a)
          }else {
            break
          }
        }
        l = a
      }
      return I
    };
    o.error = function(a) {
      throw Error("Syntax error, unrecognized expression: " + a);
    };
    var m = o.getText = function(a) {
      var c, b;
      c = a.nodeType;
      var d = "";
      if(c) {
        if(c === 1 || c === 9 || c === 11) {
          if(typeof a.textContent === "string") {
            return a.textContent
          }else {
            if(typeof a.innerText === "string") {
              return a.innerText.replace(l, "")
            }else {
              for(a = a.firstChild;a;a = a.nextSibling) {
                d += m(a)
              }
            }
          }
        }else {
          if(c === 3 || c === 4) {
            return a.nodeValue
          }
        }
      }else {
        for(c = 0;b = a[c];c++) {
          b.nodeType !== 8 && (d += m(b))
        }
      }
      return d
    }, q = o.selectors = {order:["ID", "NAME", "TAG"], match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/, CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/, NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/, ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/, TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/, CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/, POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/, 
    PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/}, leftMatch:{}, attrMap:{"class":"className", "for":"htmlFor"}, attrHandle:{href:function(a) {
      return a.getAttribute("href")
    }, type:function(a) {
      return a.getAttribute("type")
    }}, relative:{"+":function(a, c) {
      var b = typeof c === "string", d = b && !t.test(c), b = b && !d;
      d && (c = c.toLowerCase());
      for(var d = 0, h = a.length, k;d < h;d++) {
        if(k = a[d]) {
          for(;(k = k.previousSibling) && k.nodeType !== 1;) {
          }
          a[d] = b || k && k.nodeName.toLowerCase() === c ? k || !1 : k === c
        }
      }
      b && o.filter(c, a, !0)
    }, ">":function(a, c) {
      var b, d = typeof c === "string", h = 0, k = a.length;
      if(d && !t.test(c)) {
        for(c = c.toLowerCase();h < k;h++) {
          if(b = a[h]) {
            b = b.parentNode, a[h] = b.nodeName.toLowerCase() === c ? b : !1
          }
        }
      }else {
        for(;h < k;h++) {
          (b = a[h]) && (a[h] = d ? b.parentNode : b.parentNode === c)
        }
        d && o.filter(c, a, !0)
      }
    }, "":function(b, d, h) {
      var k, i = e++, g = c;
      typeof d === "string" && !t.test(d) && (k = d = d.toLowerCase(), g = a);
      g("parentNode", d, i, b, k, h)
    }, "~":function(b, d, h) {
      var k, i = e++, g = c;
      typeof d === "string" && !t.test(d) && (k = d = d.toLowerCase(), g = a);
      g("previousSibling", d, i, b, k, h)
    }}, find:{ID:function(a, c, b) {
      if(typeof c.getElementById !== "undefined" && !b) {
        return(a = c.getElementById(a[1])) && a.parentNode ? [a] : []
      }
    }, NAME:function(a, c) {
      if(typeof c.getElementsByName !== "undefined") {
        for(var b = [], d = c.getElementsByName(a[1]), h = 0, k = d.length;h < k;h++) {
          d[h].getAttribute("name") === a[1] && b.push(d[h])
        }
        return b.length === 0 ? null : b
      }
    }, TAG:function(a, c) {
      if(typeof c.getElementsByTagName !== "undefined") {
        return c.getElementsByTagName(a[1])
      }
    }}, preFilter:{CLASS:function(a, c, b, d, h, k) {
      a = " " + a[1].replace(j, "") + " ";
      if(k) {
        return a
      }
      for(var k = 0, e;(e = c[k]) != null;k++) {
        e && (h ^ (e.className && (" " + e.className + " ").replace(/[\t\n\r]/g, " ").indexOf(a) >= 0) ? b || d.push(e) : b && (c[k] = !1))
      }
      return!1
    }, ID:function(a) {
      return a[1].replace(j, "")
    }, TAG:function(a) {
      return a[1].replace(j, "").toLowerCase()
    }, CHILD:function(a) {
      if(a[1] === "nth") {
        a[2] || o.error(a[0]);
        a[2] = a[2].replace(/^\+|\s*/g, "");
        var c = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2] === "even" && "2n" || a[2] === "odd" && "2n+1" || !/\D/.test(a[2]) && "0n+" + a[2] || a[2]);
        a[2] = c[1] + (c[2] || 1) - 0;
        a[3] = c[3] - 0
      }else {
        a[2] && o.error(a[0])
      }
      a[0] = e++;
      return a
    }, ATTR:function(a, c, b, d, h, k) {
      c = a[1] = a[1].replace(j, "");
      !k && q.attrMap[c] && (a[1] = q.attrMap[c]);
      a[4] = (a[4] || a[5] || "").replace(j, "");
      a[2] === "~=" && (a[4] = " " + a[4] + " ");
      return a
    }, PSEUDO:function(a, c, b, k, e) {
      if(a[1] === "not") {
        if((d.exec(a[3]) || "").length > 1 || /^\w/.test(a[3])) {
          a[3] = o(a[3], null, null, c)
        }else {
          return a = o.filter(a[3], c, b, 1 ^ e), b || k.push.apply(k, a), !1
        }
      }else {
        if(q.match.POS.test(a[0]) || q.match.CHILD.test(a[0])) {
          return!0
        }
      }
      return a
    }, POS:function(a) {
      a.unshift(!0);
      return a
    }}, filters:{enabled:function(a) {
      return a.disabled === !1 && a.type !== "hidden"
    }, disabled:function(a) {
      return a.disabled === !0
    }, checked:function(a) {
      return a.checked === !0
    }, selected:function(a) {
      return a.selected === !0
    }, parent:function(a) {
      return!!a.firstChild
    }, empty:function(a) {
      return!a.firstChild
    }, has:function(a, c, b) {
      return!!o(b[3], a).length
    }, header:function(a) {
      return/h\d/i.test(a.nodeName)
    }, text:function(a) {
      var c = a.getAttribute("type"), b = a.type;
      return a.nodeName.toLowerCase() === "input" && "text" === b && (c === b || c === null)
    }, radio:function(a) {
      return a.nodeName.toLowerCase() === "input" && "radio" === a.type
    }, checkbox:function(a) {
      return a.nodeName.toLowerCase() === "input" && "checkbox" === a.type
    }, file:function(a) {
      return a.nodeName.toLowerCase() === "input" && "file" === a.type
    }, password:function(a) {
      return a.nodeName.toLowerCase() === "input" && "password" === a.type
    }, submit:function(a) {
      var c = a.nodeName.toLowerCase();
      return(c === "input" || c === "button") && "submit" === a.type
    }, image:function(a) {
      return a.nodeName.toLowerCase() === "input" && "image" === a.type
    }, reset:function(a) {
      var c = a.nodeName.toLowerCase();
      return(c === "input" || c === "button") && "reset" === a.type
    }, button:function(a) {
      var c = a.nodeName.toLowerCase();
      return c === "input" && "button" === a.type || c === "button"
    }, input:function(a) {
      return/input|select|textarea|button/i.test(a.nodeName)
    }, focus:function(a) {
      return a === a.ownerDocument.activeElement
    }}, setFilters:{first:function(a, c) {
      return c === 0
    }, last:function(a, c, b, d) {
      return c === d.length - 1
    }, even:function(a, c) {
      return c % 2 === 0
    }, odd:function(a, c) {
      return c % 2 === 1
    }, lt:function(a, c, b) {
      return c < b[3] - 0
    }, gt:function(a, c, b) {
      return c > b[3] - 0
    }, nth:function(a, c, b) {
      return b[3] - 0 === c
    }, eq:function(a, c, b) {
      return b[3] - 0 === c
    }}, filter:{PSEUDO:function(a, c, b, d) {
      var h = c[1], k = q.filters[h];
      if(k) {
        return k(a, b, c, d)
      }else {
        if(h === "contains") {
          return(a.textContent || a.innerText || m([a]) || "").indexOf(c[3]) >= 0
        }else {
          if(h === "not") {
            c = c[3];
            b = 0;
            for(d = c.length;b < d;b++) {
              if(c[b] === a) {
                return!1
              }
            }
            return!0
          }else {
            o.error(h)
          }
        }
      }
    }, CHILD:function(a, c) {
      var b, d, h, e, i, g;
      b = c[1];
      g = a;
      switch(b) {
        case "only":
        ;
        case "first":
          for(;g = g.previousSibling;) {
            if(g.nodeType === 1) {
              return!1
            }
          }
          if(b === "first") {
            return!0
          }
          g = a;
        case "last":
          for(;g = g.nextSibling;) {
            if(g.nodeType === 1) {
              return!1
            }
          }
          return!0;
        case "nth":
          b = c[2];
          d = c[3];
          if(b === 1 && d === 0) {
            return!0
          }
          h = c[0];
          if((e = a.parentNode) && (e[k] !== h || !a.nodeIndex)) {
            i = 0;
            for(g = e.firstChild;g;g = g.nextSibling) {
              if(g.nodeType === 1) {
                g.nodeIndex = ++i
              }
            }
            e[k] = h
          }
          g = a.nodeIndex - d;
          return b === 0 ? g === 0 : g % b === 0 && g / b >= 0
      }
    }, ID:function(a, c) {
      return a.nodeType === 1 && a.getAttribute("id") === c
    }, TAG:function(a, c) {
      return c === "*" && a.nodeType === 1 || !!a.nodeName && a.nodeName.toLowerCase() === c
    }, CLASS:function(a, c) {
      return(" " + (a.className || a.getAttribute("class")) + " ").indexOf(c) > -1
    }, ATTR:function(a, c) {
      var b = c[1], b = o.attr ? o.attr(a, b) : q.attrHandle[b] ? q.attrHandle[b](a) : a[b] != null ? a[b] : a.getAttribute(b), d = b + "", h = c[2], k = c[4];
      return b == null ? h === "!=" : !h && o.attr ? b != null : h === "=" ? d === k : h === "*=" ? d.indexOf(k) >= 0 : h === "~=" ? (" " + d + " ").indexOf(k) >= 0 : !k ? d && b !== !1 : h === "!=" ? d !== k : h === "^=" ? d.indexOf(k) === 0 : h === "$=" ? d.substr(d.length - k.length) === k : h === "|=" ? d === k || d.substr(0, k.length + 1) === k + "-" : !1
    }, POS:function(a, c, b, d) {
      var h = q.setFilters[c[2]];
      if(h) {
        return h(a, b, c, d)
      }
    }}}, r = q.match.POS, D = function(a, c) {
      return"\\" + (c - 0 + 1)
    }, s;
    for(s in q.match) {
      q.match[s] = RegExp(q.match[s].source + /(?![^\[]*\])(?![^\(]*\))/.source), q.leftMatch[s] = RegExp(/(^(?:.|\r|\n)*?)/.source + q.match[s].source.replace(/\\(\d+)/g, D))
    }
    q.match.globalPOS = r;
    var y = function(a, c) {
      a = Array.prototype.slice.call(a, 0);
      return c ? (c.push.apply(c, a), c) : a
    };
    try {
      Array.prototype.slice.call(n.documentElement.childNodes, 0)
    }catch(v) {
      y = function(a, c) {
        var b = 0, d = c || [];
        if(i.call(a) === "[object Array]") {
          Array.prototype.push.apply(d, a)
        }else {
          if(typeof a.length === "number") {
            for(var h = a.length;b < h;b++) {
              d.push(a[b])
            }
          }else {
            for(;a[b];b++) {
              d.push(a[b])
            }
          }
        }
        return d
      }
    }
    var x, w;
    n.documentElement.compareDocumentPosition ? x = function(a, c) {
      return a === c ? (g = !0, 0) : !a.compareDocumentPosition || !c.compareDocumentPosition ? a.compareDocumentPosition ? -1 : 1 : a.compareDocumentPosition(c) & 4 ? -1 : 1
    } : (x = function(a, c) {
      if(a === c) {
        return g = !0, 0
      }else {
        if(a.sourceIndex && c.sourceIndex) {
          return a.sourceIndex - c.sourceIndex
        }
      }
      var b, d, h = [], k = [];
      b = a.parentNode;
      d = c.parentNode;
      var e = b;
      if(b === d) {
        return w(a, c)
      }else {
        if(b) {
          if(!d) {
            return 1
          }
        }else {
          return-1
        }
      }
      for(;e;) {
        h.unshift(e), e = e.parentNode
      }
      for(e = d;e;) {
        k.unshift(e), e = e.parentNode
      }
      b = h.length;
      d = k.length;
      for(e = 0;e < b && e < d;e++) {
        if(h[e] !== k[e]) {
          return w(h[e], k[e])
        }
      }
      return e === b ? w(a, k[e], -1) : w(h[e], c, 1)
    }, w = function(a, c, b) {
      if(a === c) {
        return b
      }
      for(a = a.nextSibling;a;) {
        if(a === c) {
          return-1
        }
        a = a.nextSibling
      }
      return 1
    });
    (function() {
      var a = n.createElement("div"), c = "script" + (new Date).getTime(), b = n.documentElement;
      a.innerHTML = "<a name='" + c + "'/>";
      b.insertBefore(a, b.firstChild);
      if(n.getElementById(c)) {
        q.find.ID = function(a, c, b) {
          if(typeof c.getElementById !== "undefined" && !b) {
            return(c = c.getElementById(a[1])) ? c.id === a[1] || typeof c.getAttributeNode !== "undefined" && c.getAttributeNode("id").nodeValue === a[1] ? [c] : p : []
          }
        }, q.filter.ID = function(a, c) {
          var b = typeof a.getAttributeNode !== "undefined" && a.getAttributeNode("id");
          return a.nodeType === 1 && b && b.nodeValue === c
        }
      }
      b.removeChild(a);
      b = a = null
    })();
    (function() {
      var a = n.createElement("div");
      a.appendChild(n.createComment(""));
      if(a.getElementsByTagName("*").length > 0) {
        q.find.TAG = function(a, c) {
          var b = c.getElementsByTagName(a[1]);
          if(a[1] === "*") {
            for(var d = [], h = 0;b[h];h++) {
              b[h].nodeType === 1 && d.push(b[h])
            }
            b = d
          }
          return b
        }
      }
      a.innerHTML = "<a href='#'></a>";
      if(a.firstChild && typeof a.firstChild.getAttribute !== "undefined" && a.firstChild.getAttribute("href") !== "#") {
        q.attrHandle.href = function(a) {
          return a.getAttribute("href", 2)
        }
      }
      a = null
    })();
    n.querySelectorAll && function() {
      var a = o, c = n.createElement("div");
      c.innerHTML = "<p class='TEST'></p>";
      if(!(c.querySelectorAll && c.querySelectorAll(".TEST").length === 0)) {
        o = function(c, b, d, h) {
          b = b || n;
          if(!h && !o.isXML(b)) {
            var k = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(c);
            if(k && (b.nodeType === 1 || b.nodeType === 9)) {
              if(k[1]) {
                return y(b.getElementsByTagName(c), d)
              }else {
                if(k[2] && q.find.CLASS && b.getElementsByClassName) {
                  return y(b.getElementsByClassName(k[2]), d)
                }
              }
            }
            if(b.nodeType === 9) {
              if(c === "body" && b.body) {
                return y([b.body], d)
              }else {
                if(k && k[3]) {
                  var e = b.getElementById(k[3]);
                  if(e && e.parentNode) {
                    if(e.id === k[3]) {
                      return y([e], d)
                    }
                  }else {
                    return y([], d)
                  }
                }
              }
              try {
                return y(b.querySelectorAll(c), d)
              }catch(i) {
              }
            }else {
              if(b.nodeType === 1 && b.nodeName.toLowerCase() !== "object") {
                var k = b, g = (e = b.getAttribute("id")) || "__sizzle__", f = b.parentNode, j = /^\s*[+~]/.test(c);
                e ? g = g.replace(/'/g, "\\$&") : b.setAttribute("id", g);
                if(j && f) {
                  b = b.parentNode
                }
                try {
                  if(!j || f) {
                    return y(b.querySelectorAll("[id='" + g + "'] " + c), d)
                  }
                }catch(u) {
                }finally {
                  e || k.removeAttribute("id")
                }
              }
            }
          }
          return a(c, b, d, h)
        };
        for(var b in a) {
          o[b] = a[b]
        }
        c = null
      }
    }();
    (function() {
      var a = n.documentElement, c = a.matchesSelector || a.mozMatchesSelector || a.webkitMatchesSelector || a.msMatchesSelector;
      if(c) {
        var b = !c.call(n.createElement("div"), "div"), d = !1;
        try {
          c.call(n.documentElement, "[test!='']:sizzle")
        }catch(h) {
          d = !0
        }
        o.matchesSelector = function(a, h) {
          h = h.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
          if(!o.isXML(a)) {
            try {
              if(d || !q.match.PSEUDO.test(h) && !/!=/.test(h)) {
                var k = c.call(a, h);
                if(k || !b || a.document && a.document.nodeType !== 11) {
                  return k
                }
              }
            }catch(e) {
            }
          }
          return o(h, null, null, [a]).length > 0
        }
      }
    })();
    (function() {
      var a = n.createElement("div");
      a.innerHTML = "<div class='test e'></div><div class='test'></div>";
      if(a.getElementsByClassName && a.getElementsByClassName("e").length !== 0 && (a.lastChild.className = "e", a.getElementsByClassName("e").length !== 1)) {
        q.order.splice(1, 0, "CLASS"), q.find.CLASS = function(a, c, b) {
          if(typeof c.getElementsByClassName !== "undefined" && !b) {
            return c.getElementsByClassName(a[1])
          }
        }, a = null
      }
    })();
    o.contains = n.documentElement.contains ? function(a, c) {
      return a !== c && (a.contains ? a.contains(c) : !0)
    } : n.documentElement.compareDocumentPosition ? function(a, c) {
      return!!(a.compareDocumentPosition(c) & 16)
    } : function() {
      return!1
    };
    o.isXML = function(a) {
      return(a = (a ? a.ownerDocument || a : 0).documentElement) ? a.nodeName !== "HTML" : !1
    };
    var z = function(a, c, b) {
      for(var d, h = [], k = "", c = c.nodeType ? [c] : c;d = q.match.PSEUDO.exec(a);) {
        k += d[0], a = a.replace(q.match.PSEUDO, "")
      }
      a = q.relative[a] ? a + "*" : a;
      d = 0;
      for(var e = c.length;d < e;d++) {
        o(a, c[d], h, b)
      }
      return o.filter(k, h)
    };
    o.attr = b.attr;
    o.selectors.attrMap = {};
    b.find = o;
    b.expr = o.selectors;
    b.expr[":"] = b.expr.filters;
    b.unique = o.uniqueSort;
    b.text = o.getText;
    b.isXMLDoc = o.isXML;
    b.contains = o.contains
  })();
  var kb = /Until$/, lb = /^(?:parents|prevUntil|prevAll)/, mb = /,/, cb = /^.[^:#\[\.,]*$/, nb = Array.prototype.slice, Na = b.expr.match.globalPOS, ob = {children:!0, contents:!0, next:!0, prev:!0};
  b.fn.extend({find:function(a) {
    var c = this, d, k;
    if(typeof a !== "string") {
      return b(a).filter(function() {
        for(d = 0, k = c.length;d < k;d++) {
          if(b.contains(c[d], this)) {
            return!0
          }
        }
      })
    }
    var e = this.pushStack("", "find", a), i, g, f;
    for(d = 0, k = this.length;d < k;d++) {
      if(i = e.length, b.find(a, this[d], e), d > 0) {
        for(g = i;g < e.length;g++) {
          for(f = 0;f < i;f++) {
            if(e[f] === e[g]) {
              e.splice(g--, 1);
              break
            }
          }
        }
      }
    }
    return e
  }, has:function(a) {
    var c = b(a);
    return this.filter(function() {
      for(var a = 0, d = c.length;a < d;a++) {
        if(b.contains(this, c[a])) {
          return!0
        }
      }
    })
  }, not:function(a) {
    return this.pushStack(x(this, a, !1), "not", a)
  }, filter:function(a) {
    return this.pushStack(x(this, a, !0), "filter", a)
  }, is:function(a) {
    return!!a && (typeof a === "string" ? Na.test(a) ? b(a, this.context).index(this[0]) >= 0 : b.filter(a, this).length > 0 : this.filter(a).length > 0)
  }, closest:function(a, c) {
    var d = [], k, e, i = this[0];
    if(b.isArray(a)) {
      for(e = 1;i && i.ownerDocument && i !== c;) {
        for(k = 0;k < a.length;k++) {
          b(i).is(a[k]) && d.push({selector:a[k], elem:i, level:e})
        }
        i = i.parentNode;
        e++
      }
      return d
    }
    var g = Na.test(a) || typeof a !== "string" ? b(a, c || this.context) : 0;
    for(k = 0, e = this.length;k < e;k++) {
      for(i = this[k];i;) {
        if(g ? g.index(i) > -1 : b.find.matchesSelector(i, a)) {
          d.push(i);
          break
        }else {
          if(i = i.parentNode, !i || !i.ownerDocument || i === c || i.nodeType === 11) {
            break
          }
        }
      }
    }
    d = d.length > 1 ? b.unique(d) : d;
    return this.pushStack(d, "closest", a)
  }, index:function(a) {
    return!a ? this[0] && this[0].parentNode ? this.prevAll().length : -1 : typeof a === "string" ? b.inArray(this[0], b(a)) : b.inArray(a.jquery ? a[0] : a, this)
  }, add:function(a, c) {
    var d = typeof a === "string" ? b(a, c) : b.makeArray(a && a.nodeType ? [a] : a), k = b.merge(this.get(), d);
    return this.pushStack(!d[0] || !d[0].parentNode || d[0].parentNode.nodeType === 11 || !k[0] || !k[0].parentNode || k[0].parentNode.nodeType === 11 ? k : b.unique(k))
  }, andSelf:function() {
    return this.add(this.prevObject)
  }});
  b.each({parent:function(a) {
    return(a = a.parentNode) && a.nodeType !== 11 ? a : null
  }, parents:function(a) {
    return b.dir(a, "parentNode")
  }, parentsUntil:function(a, c, d) {
    return b.dir(a, "parentNode", d)
  }, next:function(a) {
    return b.nth(a, 2, "nextSibling")
  }, prev:function(a) {
    return b.nth(a, 2, "previousSibling")
  }, nextAll:function(a) {
    return b.dir(a, "nextSibling")
  }, prevAll:function(a) {
    return b.dir(a, "previousSibling")
  }, nextUntil:function(a, c, d) {
    return b.dir(a, "nextSibling", d)
  }, prevUntil:function(a, c, d) {
    return b.dir(a, "previousSibling", d)
  }, siblings:function(a) {
    return b.sibling((a.parentNode || {}).firstChild, a)
  }, children:function(a) {
    return b.sibling(a.firstChild)
  }, contents:function(a) {
    return b.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : b.makeArray(a.childNodes)
  }}, function(a, c) {
    b.fn[a] = function(d, k) {
      var e = b.map(this, c, d);
      kb.test(a) || (k = d);
      k && typeof k === "string" && (e = b.filter(k, e));
      e = this.length > 1 && !ob[a] ? b.unique(e) : e;
      if((this.length > 1 || mb.test(k)) && lb.test(a)) {
        e = e.reverse()
      }
      return this.pushStack(e, a, nb.call(arguments).join(","))
    }
  });
  b.extend({filter:function(a, c, d) {
    d && (a = ":not(" + a + ")");
    return c.length === 1 ? b.find.matchesSelector(c[0], a) ? [c[0]] : [] : b.find.matches(a, c)
  }, dir:function(a, c, d) {
    for(var k = [], a = a[c];a && a.nodeType !== 9 && (d === p || a.nodeType !== 1 || !b(a).is(d));) {
      a.nodeType === 1 && k.push(a), a = a[c]
    }
    return k
  }, nth:function(a, c, b) {
    for(var c = c || 1, d = 0;a;a = a[b]) {
      if(a.nodeType === 1 && ++d === c) {
        break
      }
    }
    return a
  }, sibling:function(a, c) {
    for(var b = [];a;a = a.nextSibling) {
      a.nodeType === 1 && a !== c && b.push(a)
    }
    return b
  }});
  var Ca = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", pb = / jQuery\d+="(?:\d+|null)"/g, ya = /^\s+/, Oa = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, Pa = /<([\w:]+)/, qb = /<tbody/i, rb = /<|&#?\w+;/, sb = /<(?:script|style)/i, tb = /<(?:script|object|embed|option|style)/i, Qa = RegExp("<(?:" + Ca + ")[\\s/>]", "i"), Ra = /checked\s*(?:[^=]|=\s*.checked.)/i, 
  Sa = /\/(java|ecma)script/i, ub = /^\s*<!(?:\[CDATA\[|\-\-)/, N = {option:[1, "<select multiple='multiple'>", "</select>"], legend:[1, "<fieldset>", "</fieldset>"], thead:[1, "<table>", "</table>"], tr:[2, "<table><tbody>", "</tbody></table>"], td:[3, "<table><tbody><tr>", "</tr></tbody></table>"], col:[2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"], area:[1, "<map>", "</map>"], _default:[0, "", ""]}, za = Y(n);
  N.optgroup = N.option;
  N.tbody = N.tfoot = N.colgroup = N.caption = N.thead;
  N.th = N.td;
  if(!b.support.htmlSerialize) {
    N._default = [1, "div<div>", "</div>"]
  }
  b.fn.extend({text:function(a) {
    return b.access(this, function(a) {
      return a === p ? b.text(this) : this.empty().append((this[0] && this[0].ownerDocument || n).createTextNode(a))
    }, null, a, arguments.length)
  }, wrapAll:function(a) {
    if(b.isFunction(a)) {
      return this.each(function(c) {
        b(this).wrapAll(a.call(this, c))
      })
    }
    if(this[0]) {
      var c = b(a, this[0].ownerDocument).eq(0).clone(!0);
      this[0].parentNode && c.insertBefore(this[0]);
      c.map(function() {
        for(var a = this;a.firstChild && a.firstChild.nodeType === 1;) {
          a = a.firstChild
        }
        return a
      }).append(this)
    }
    return this
  }, wrapInner:function(a) {
    return b.isFunction(a) ? this.each(function(c) {
      b(this).wrapInner(a.call(this, c))
    }) : this.each(function() {
      var c = b(this), d = c.contents();
      d.length ? d.wrapAll(a) : c.append(a)
    })
  }, wrap:function(a) {
    var c = b.isFunction(a);
    return this.each(function(d) {
      b(this).wrapAll(c ? a.call(this, d) : a)
    })
  }, unwrap:function() {
    return this.parent().each(function() {
      b.nodeName(this, "body") || b(this).replaceWith(this.childNodes)
    }).end()
  }, append:function() {
    return this.domManip(arguments, !0, function(a) {
      this.nodeType === 1 && this.appendChild(a)
    })
  }, prepend:function() {
    return this.domManip(arguments, !0, function(a) {
      this.nodeType === 1 && this.insertBefore(a, this.firstChild)
    })
  }, before:function() {
    if(this[0] && this[0].parentNode) {
      return this.domManip(arguments, !1, function(a) {
        this.parentNode.insertBefore(a, this)
      })
    }else {
      if(arguments.length) {
        var a = b.clean(arguments);
        a.push.apply(a, this.toArray());
        return this.pushStack(a, "before", arguments)
      }
    }
  }, after:function() {
    if(this[0] && this[0].parentNode) {
      return this.domManip(arguments, !1, function(a) {
        this.parentNode.insertBefore(a, this.nextSibling)
      })
    }else {
      if(arguments.length) {
        var a = this.pushStack(this, "after", arguments);
        a.push.apply(a, b.clean(arguments));
        return a
      }
    }
  }, remove:function(a, c) {
    for(var d = 0, k;(k = this[d]) != null;d++) {
      if(!a || b.filter(a, [k]).length) {
        !c && k.nodeType === 1 && (b.cleanData(k.getElementsByTagName("*")), b.cleanData([k])), k.parentNode && k.parentNode.removeChild(k)
      }
    }
    return this
  }, empty:function() {
    for(var a = 0, c;(c = this[a]) != null;a++) {
      for(c.nodeType === 1 && b.cleanData(c.getElementsByTagName("*"));c.firstChild;) {
        c.removeChild(c.firstChild)
      }
    }
    return this
  }, clone:function(a, c) {
    a = a == null ? !1 : a;
    c = c == null ? a : c;
    return this.map(function() {
      return b.clone(this, a, c)
    })
  }, html:function(a) {
    return b.access(this, function(a) {
      var d = this[0] || {}, k = 0, e = this.length;
      if(a === p) {
        return d.nodeType === 1 ? d.innerHTML.replace(pb, "") : null
      }
      if(typeof a === "string" && !sb.test(a) && (b.support.leadingWhitespace || !ya.test(a)) && !N[(Pa.exec(a) || ["", ""])[1].toLowerCase()]) {
        a = a.replace(Oa, "<$1></$2>");
        try {
          for(;k < e;k++) {
            if(d = this[k] || {}, d.nodeType === 1) {
              b.cleanData(d.getElementsByTagName("*")), d.innerHTML = a
            }
          }
          d = 0
        }catch(i) {
        }
      }
      d && this.empty().append(a)
    }, null, a, arguments.length)
  }, replaceWith:function(a) {
    if(this[0] && this[0].parentNode) {
      if(b.isFunction(a)) {
        return this.each(function(c) {
          var d = b(this), k = d.html();
          d.replaceWith(a.call(this, c, k))
        })
      }
      typeof a !== "string" && (a = b(a).detach());
      return this.each(function() {
        var c = this.nextSibling, d = this.parentNode;
        b(this).remove();
        c ? b(c).before(a) : b(d).append(a)
      })
    }else {
      return this.length ? this.pushStack(b(b.isFunction(a) ? a() : a), "replaceWith", a) : this
    }
  }, detach:function(a) {
    return this.remove(a, !0)
  }, domManip:function(a, c, d) {
    var k, e, i, g = a[0], f = [];
    if(!b.support.checkClone && arguments.length === 3 && typeof g === "string" && Ra.test(g)) {
      return this.each(function() {
        b(this).domManip(a, c, d, !0)
      })
    }
    if(b.isFunction(g)) {
      return this.each(function(k) {
        var e = b(this);
        a[0] = g.call(this, k, c ? e.html() : p);
        e.domManip(a, c, d)
      })
    }
    if(this[0]) {
      k = g && g.parentNode;
      k = b.support.parentNode && k && k.nodeType === 11 && k.childNodes.length === this.length ? {fragment:k} : b.buildFragment(a, this, f);
      i = k.fragment;
      if(e = i.childNodes.length === 1 ? i = i.firstChild : i.firstChild) {
        c = c && b.nodeName(e, "tr");
        e = 0;
        for(var j = this.length, l = j - 1;e < j;e++) {
          d.call(c ? b.nodeName(this[e], "table") ? this[e].getElementsByTagName("tbody")[0] || this[e].appendChild(this[e].ownerDocument.createElement("tbody")) : this[e] : this[e], k.cacheable || j > 1 && e < l ? b.clone(i, !0, !0) : i)
        }
      }
      f.length && b.each(f, function(a, c) {
        c.src ? b.ajax({type:"GET", global:!1, url:c.src, async:!1, dataType:"script"}) : b.globalEval((c.text || c.textContent || c.innerHTML || "").replace(ub, "/*$0*/"));
        c.parentNode && c.parentNode.removeChild(c)
      })
    }
    return this
  }});
  b.buildFragment = function(a, c, d) {
    var k, e, i, g, f = a[0];
    c && c[0] && (g = c[0].ownerDocument || c[0]);
    g.createDocumentFragment || (g = n);
    if(a.length === 1 && typeof f === "string" && f.length < 512 && g === n && f.charAt(0) === "<" && !tb.test(f) && (b.support.checkClone || !Ra.test(f)) && (b.support.html5Clone || !Qa.test(f))) {
      e = !0, (i = b.fragments[f]) && i !== 1 && (k = i)
    }
    k || (k = g.createDocumentFragment(), b.clean(a, g, k, d));
    e && (b.fragments[f] = i ? k : 1);
    return{fragment:k, cacheable:e}
  };
  b.fragments = {};
  b.each({appendTo:"append", prependTo:"prepend", insertBefore:"before", insertAfter:"after", replaceAll:"replaceWith"}, function(a, c) {
    b.fn[a] = function(d) {
      var e = [], d = b(d), i = this.length === 1 && this[0].parentNode;
      if(i && i.nodeType === 11 && i.childNodes.length === 1 && d.length === 1) {
        return d[c](this[0]), this
      }else {
        for(var i = 0, g = d.length;i < g;i++) {
          var f = (i > 0 ? this.clone(!0) : this).get();
          b(d[i])[c](f);
          e = e.concat(f)
        }
        return this.pushStack(e, a, d.selector)
      }
    }
  });
  b.extend({clone:function(a, c, d) {
    var e, i, g;
    b.support.html5Clone || b.isXMLDoc(a) || !Qa.test("<" + a.nodeName + ">") ? e = a.cloneNode(!0) : (e = n.createElement("div"), za.appendChild(e), e.innerHTML = a.outerHTML, e = e.firstChild);
    var f = e;
    if((!b.support.noCloneEvent || !b.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !b.isXMLDoc(a)) {
      W(a, f);
      e = B(a);
      i = B(f);
      for(g = 0;e[g];++g) {
        i[g] && W(e[g], i[g])
      }
    }
    if(c && (J(a, f), d)) {
      e = B(a);
      i = B(f);
      for(g = 0;e[g];++g) {
        J(e[g], i[g])
      }
    }
    return f
  }, clean:function(a, c, d, e) {
    var i, g = [], c = c || n;
    typeof c.createElement === "undefined" && (c = c.ownerDocument || c[0] && c[0].ownerDocument || n);
    for(var f = 0, j;(j = a[f]) != null;f++) {
      if(typeof j === "number" && (j += ""), j) {
        if(typeof j === "string") {
          if(rb.test(j)) {
            j = j.replace(Oa, "<$1></$2>");
            i = (Pa.exec(j) || ["", ""])[1].toLowerCase();
            var l = N[i] || N._default, t = l[0], o = c.createElement("div"), q = za.childNodes;
            c === n ? za.appendChild(o) : Y(c).appendChild(o);
            for(o.innerHTML = l[1] + j + l[2];t--;) {
              o = o.lastChild
            }
            if(!b.support.tbody) {
              t = qb.test(j);
              l = i === "table" && !t ? o.firstChild && o.firstChild.childNodes : l[1] === "<table>" && !t ? o.childNodes : [];
              for(i = l.length - 1;i >= 0;--i) {
                b.nodeName(l[i], "tbody") && !l[i].childNodes.length && l[i].parentNode.removeChild(l[i])
              }
            }
            !b.support.leadingWhitespace && ya.test(j) && o.insertBefore(c.createTextNode(ya.exec(j)[0]), o.firstChild);
            j = o.childNodes;
            o && (o.parentNode.removeChild(o), q.length > 0 && (o = q[q.length - 1]) && o.parentNode && o.parentNode.removeChild(o))
          }else {
            j = c.createTextNode(j)
          }
        }
        var m;
        if(!b.support.appendChecked) {
          if(j[0] && typeof(m = j.length) === "number") {
            for(i = 0;i < m;i++) {
              R(j[i])
            }
          }else {
            R(j)
          }
        }
        j.nodeType ? g.push(j) : g = b.merge(g, j)
      }
    }
    if(d) {
      a = function(a) {
        return!a.type || Sa.test(a.type)
      };
      for(f = 0;g[f];f++) {
        c = g[f], e && b.nodeName(c, "script") && (!c.type || Sa.test(c.type)) ? e.push(c.parentNode ? c.parentNode.removeChild(c) : c) : (c.nodeType === 1 && (j = b.grep(c.getElementsByTagName("script"), a), g.splice.apply(g, [f + 1, 0].concat(j))), d.appendChild(c))
      }
    }
    return g
  }, cleanData:function(a) {
    for(var c, d, e = b.cache, i = b.event.special, g = b.support.deleteExpando, f = 0, j;(j = a[f]) != null;f++) {
      if(!j.nodeName || !b.noData[j.nodeName.toLowerCase()]) {
        if(d = j[b.expando]) {
          if((c = e[d]) && c.events) {
            for(var l in c.events) {
              i[l] ? b.event.remove(j, l) : b.removeEvent(j, l, c.handle)
            }
            if(c.handle) {
              c.handle.elem = null
            }
          }
          g ? delete j[b.expando] : j.removeAttribute && j.removeAttribute(b.expando);
          delete e[d]
        }
      }
    }
  }});
  var Aa = /alpha\([^)]*\)/i, vb = /opacity=([^)]*)/, wb = /([A-Z]|^ms)/g, xb = /^[\-+]?(?:\d*\.)?\d+$/i, sa = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i, yb = /^([\-+])=([\-+.\de]+)/, zb = /^margin/, Ab = {position:"absolute", visibility:"hidden", display:"block"}, aa = ["Top", "Right", "Bottom", "Left"], ia, Ta, Ua;
  b.fn.css = function(a, c) {
    return b.access(this, function(a, c, d) {
      return d !== p ? b.style(a, c, d) : b.css(a, c)
    }, a, c, arguments.length > 1)
  };
  b.extend({cssHooks:{opacity:{get:function(a, c) {
    if(c) {
      var b = ia(a, "opacity");
      return b === "" ? "1" : b
    }else {
      return a.style.opacity
    }
  }}}, cssNumber:{fillOpacity:!0, fontWeight:!0, lineHeight:!0, opacity:!0, orphans:!0, widows:!0, zIndex:!0, zoom:!0}, cssProps:{"float":b.support.cssFloat ? "cssFloat" : "styleFloat"}, style:function(a, c, d, e) {
    if(a && !(a.nodeType === 3 || a.nodeType === 8 || !a.style)) {
      var i, g = b.camelCase(c), f = a.style, j = b.cssHooks[g], c = b.cssProps[g] || g;
      if(d !== p) {
        e = typeof d;
        if(e === "string" && (i = yb.exec(d))) {
          d = +(i[1] + 1) * +i[2] + parseFloat(b.css(a, c)), e = "number"
        }
        if(!(d == null || e === "number" && isNaN(d))) {
          if(e === "number" && !b.cssNumber[g] && (d += "px"), !j || !("set" in j) || (d = j.set(a, d)) !== p) {
            try {
              f[c] = d
            }catch(l) {
            }
          }
        }
      }else {
        return j && "get" in j && (i = j.get(a, !1, e)) !== p ? i : f[c]
      }
    }
  }, css:function(a, c, d) {
    var e, i, c = b.camelCase(c);
    i = b.cssHooks[c];
    c = b.cssProps[c] || c;
    c === "cssFloat" && (c = "float");
    if(i && "get" in i && (e = i.get(a, !0, d)) !== p) {
      return e
    }else {
      if(ia) {
        return ia(a, c)
      }
    }
  }, swap:function(a, c, b) {
    var d = {}, e;
    for(e in c) {
      d[e] = a.style[e], a.style[e] = c[e]
    }
    b = b.call(a);
    for(e in c) {
      a.style[e] = d[e]
    }
    return b
  }});
  b.curCSS = b.css;
  n.defaultView && n.defaultView.getComputedStyle && (Ta = function(a, c) {
    var d, e, i, g = a.style, c = c.replace(wb, "-$1").toLowerCase();
    if((e = a.ownerDocument.defaultView) && (i = e.getComputedStyle(a, null))) {
      d = i.getPropertyValue(c), d === "" && !b.contains(a.ownerDocument.documentElement, a) && (d = b.style(a, c))
    }
    if(!b.support.pixelMargin && i && zb.test(c) && sa.test(d)) {
      e = g.width, g.width = d, d = i.width, g.width = e
    }
    return d
  });
  n.documentElement.currentStyle && (Ua = function(a, c) {
    var b, d, e = a.currentStyle && a.currentStyle[c], i = a.style;
    if(e == null && i && (b = i[c])) {
      e = b
    }
    if(sa.test(e)) {
      b = i.left;
      if(d = a.runtimeStyle && a.runtimeStyle.left) {
        a.runtimeStyle.left = a.currentStyle.left
      }
      i.left = c === "fontSize" ? "1em" : e;
      e = i.pixelLeft + "px";
      i.left = b;
      if(d) {
        a.runtimeStyle.left = d
      }
    }
    return e === "" ? "auto" : e
  });
  ia = Ta || Ua;
  b.each(["height", "width"], function(a, c) {
    b.cssHooks[c] = {get:function(a, d, e) {
      if(d) {
        return a.offsetWidth !== 0 ? $(a, c, e) : b.swap(a, Ab, function() {
          return $(a, c, e)
        })
      }
    }, set:function(a, c) {
      return xb.test(c) ? c + "px" : c
    }}
  });
  if(!b.support.opacity) {
    b.cssHooks.opacity = {get:function(a, c) {
      return vb.test((c && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : c ? "1" : ""
    }, set:function(a, c) {
      var d = a.style, e = a.currentStyle, i = b.isNumeric(c) ? "alpha(opacity=" + c * 100 + ")" : "", g = e && e.filter || d.filter || "";
      d.zoom = 1;
      if(c >= 1 && b.trim(g.replace(Aa, "")) === "" && (d.removeAttribute("filter"), e && !e.filter)) {
        return
      }
      d.filter = Aa.test(g) ? g.replace(Aa, i) : g + " " + i
    }}
  }
  b(function() {
    if(!b.support.reliableMarginRight) {
      b.cssHooks.marginRight = {get:function(a, c) {
        return b.swap(a, {display:"inline-block"}, function() {
          return c ? ia(a, "margin-right") : a.style.marginRight
        })
      }}
    }
  });
  if(b.expr && b.expr.filters) {
    b.expr.filters.hidden = function(a) {
      var c = a.offsetHeight;
      return a.offsetWidth === 0 && c === 0 || !b.support.reliableHiddenOffsets && (a.style && a.style.display || b.css(a, "display")) === "none"
    }, b.expr.filters.visible = function(a) {
      return!b.expr.filters.hidden(a)
    }
  }
  b.each({margin:"", padding:"", border:"Width"}, function(a, c) {
    b.cssHooks[a + c] = {expand:function(b) {
      for(var d = typeof b === "string" ? b.split(" ") : [b], e = {}, b = 0;b < 4;b++) {
        e[a + aa[b] + c] = d[b] || d[b - 2] || d[0]
      }
      return e
    }}
  });
  var Bb = /%20/g, db = /\[\]$/, Va = /\r?\n/g, Cb = /#.*$/, Db = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, Eb = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, Fb = /^(?:GET|HEAD)$/, Gb = /^\/\//, Wa = /\?/, Hb = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, Ib = /^(?:select|textarea)/i, Da = /\s+/, Jb = /([?&])_=[^&]*/, Xa = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/, Ya = b.fn.load, ta = {}, Za = {}, ga, ha, $a = ["*/"] + 
  ["*"];
  try {
    ga = fa.href
  }catch(Pb) {
    ga = n.createElement("a"), ga.href = "", ga = ga.href
  }
  ha = Xa.exec(ga.toLowerCase()) || [];
  b.fn.extend({load:function(a, c, d) {
    if(typeof a !== "string" && Ya) {
      return Ya.apply(this, arguments)
    }else {
      if(!this.length) {
        return this
      }
    }
    var e = a.indexOf(" ");
    if(e >= 0) {
      var i = a.slice(e, a.length), a = a.slice(0, e)
    }
    e = "GET";
    c && (b.isFunction(c) ? (d = c, c = p) : typeof c === "object" && (c = b.param(c, b.ajaxSettings.traditional), e = "POST"));
    var g = this;
    b.ajax({url:a, type:e, dataType:"html", data:c, complete:function(a, c, e) {
      e = a.responseText;
      a.isResolved() && (a.done(function(a) {
        e = a
      }), g.html(i ? b("<div>").append(e.replace(Hb, "")).find(i) : e));
      d && g.each(d, [e, c, a])
    }});
    return this
  }, serialize:function() {
    return b.param(this.serializeArray())
  }, serializeArray:function() {
    return this.map(function() {
      return this.elements ? b.makeArray(this.elements) : this
    }).filter(function() {
      return this.name && !this.disabled && (this.checked || Ib.test(this.nodeName) || Eb.test(this.type))
    }).map(function(a, c) {
      var d = b(this).val();
      return d == null ? null : b.isArray(d) ? b.map(d, function(a) {
        return{name:c.name, value:a.replace(Va, "\r\n")}
      }) : {name:c.name, value:d.replace(Va, "\r\n")}
    }).get()
  }});
  b.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(a, c) {
    b.fn[c] = function(a) {
      return this.on(c, a)
    }
  });
  b.each(["get", "post"], function(a, c) {
    b[c] = function(a, d, e, i) {
      b.isFunction(d) && (i = i || e, e = d, d = p);
      return b.ajax({type:c, url:a, data:d, success:e, dataType:i})
    }
  });
  b.extend({getScript:function(a, c) {
    return b.get(a, p, c, "script")
  }, getJSON:function(a, c, d) {
    return b.get(a, c, d, "json")
  }, ajaxSetup:function(a, c) {
    c ? ca(a, b.ajaxSettings) : (c = a, a = b.ajaxSettings);
    ca(a, c);
    return a
  }, ajaxSettings:{url:ga, isLocal:/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/.test(ha[1]), global:!0, type:"GET", contentType:"application/x-www-form-urlencoded; charset=UTF-8", processData:!0, async:!0, accepts:{xml:"application/xml, text/xml", html:"text/html", text:"text/plain", json:"application/json, text/javascript", "*":$a}, contents:{xml:/xml/, html:/html/, json:/json/}, responseFields:{xml:"responseXML", text:"responseText"}, converters:{"* text":s.String, "text html":!0, 
  "text json":b.parseJSON, "text xml":b.parseXML}, flatOptions:{context:!0, url:!0}}, ajaxPrefilter:ba(ta), ajaxTransport:ba(Za), ajax:function(a, c) {
    function d(a, c, h, t) {
      if(y !== 2) {
        y = 2;
        D && clearTimeout(D);
        r = p;
        m = t || "";
        w.readyState = a > 0 ? 4 : 0;
        var q, n, s, t = c;
        if(h) {
          var v = e, Ea = w, z = v.contents, V = v.dataTypes, L = v.responseFields, Q, G, B, K;
          for(G in L) {
            G in h && (Ea[L[G]] = h[G])
          }
          for(;V[0] === "*";) {
            V.shift(), Q === p && (Q = v.mimeType || Ea.getResponseHeader("content-type"))
          }
          if(Q) {
            for(G in z) {
              if(z[G] && z[G].test(Q)) {
                V.unshift(G);
                break
              }
            }
          }
          if(V[0] in h) {
            B = V[0]
          }else {
            for(G in h) {
              if(!V[0] || v.converters[G + " " + V[0]]) {
                B = G;
                break
              }
              K || (K = G)
            }
            B = B || K
          }
          B ? (B !== V[0] && V.unshift(B), h = h[B]) : h = void 0
        }else {
          h = p
        }
        if(a >= 200 && a < 300 || a === 304) {
          if(e.ifModified) {
            if(Q = w.getResponseHeader("Last-Modified")) {
              b.lastModified[o] = Q
            }
            if(Q = w.getResponseHeader("Etag")) {
              b.etag[o] = Q
            }
          }
          if(a === 304) {
            t = "notmodified", q = !0
          }else {
            try {
              Q = e;
              Q.dataFilter && (h = Q.dataFilter(h, Q.dataType));
              var N = Q.dataTypes;
              G = {};
              var ma, M, S = N.length, P, E = N[0], J, R, F, H, O;
              for(ma = 1;ma < S;ma++) {
                if(ma === 1) {
                  for(M in Q.converters) {
                    typeof M === "string" && (G[M.toLowerCase()] = Q.converters[M])
                  }
                }
                J = E;
                E = N[ma];
                if(E === "*") {
                  E = J
                }else {
                  if(J !== "*" && J !== E) {
                    R = J + " " + E;
                    F = G[R] || G["* " + E];
                    if(!F) {
                      for(H in O = p, G) {
                        if(P = H.split(" "), P[0] === J || P[0] === "*") {
                          if(O = G[P[1] + " " + E]) {
                            H = G[H];
                            H === !0 ? F = O : O === !0 && (F = H);
                            break
                          }
                        }
                      }
                    }
                    !F && !O && b.error("No conversion from " + R.replace(" ", " to "));
                    F !== !0 && (h = F ? F(h) : O(H(h)))
                  }
                }
              }
              n = h;
              t = "success";
              q = !0
            }catch(T) {
              t = "parsererror", s = T
            }
          }
        }else {
          if(s = t, !t || a) {
            t = "error", a < 0 && (a = 0)
          }
        }
        w.status = a;
        w.statusText = "" + (c || t);
        q ? f.resolveWith(i, [n, t, w]) : f.rejectWith(i, [w, t, s]);
        w.statusCode(l);
        l = p;
        x && g.trigger("ajax" + (q ? "Success" : "Error"), [w, e, q ? n : s]);
        j.fireWith(i, [w, t]);
        x && (g.trigger("ajaxComplete", [w, e]), --b.active || b.event.trigger("ajaxStop"))
      }
    }
    typeof a === "object" && (c = a, a = p);
    var c = c || {}, e = b.ajaxSetup({}, c), i = e.context || e, g = i !== e && (i.nodeType || i instanceof b) ? b(i) : b.event, f = b.Deferred(), j = b.Callbacks("once memory"), l = e.statusCode || {}, o, t = {}, q = {}, m, n, r, D, s, y = 0, x, v, w = {readyState:0, setRequestHeader:function(a, c) {
      if(!y) {
        var b = a.toLowerCase(), a = q[b] = q[b] || a;
        t[a] = c
      }
      return this
    }, getAllResponseHeaders:function() {
      return y === 2 ? m : null
    }, getResponseHeader:function(a) {
      var c;
      if(y === 2) {
        if(!n) {
          for(n = {};c = Db.exec(m);) {
            n[c[1].toLowerCase()] = c[2]
          }
        }
        c = n[a.toLowerCase()]
      }
      return c === p ? null : c
    }, overrideMimeType:function(a) {
      if(!y) {
        e.mimeType = a
      }
      return this
    }, abort:function(a) {
      a = a || "abort";
      r && r.abort(a);
      d(0, a);
      return this
    }};
    f.promise(w);
    w.success = w.done;
    w.error = w.fail;
    w.complete = j.add;
    w.statusCode = function(a) {
      if(a) {
        var c;
        if(y < 2) {
          for(c in a) {
            l[c] = [l[c], a[c]]
          }
        }else {
          c = a[w.status], w.then(c, c)
        }
      }
      return this
    };
    e.url = ((a || e.url) + "").replace(Cb, "").replace(Gb, ha[1] + "//");
    e.dataTypes = b.trim(e.dataType || "*").toLowerCase().split(Da);
    if(e.crossDomain == null) {
      s = Xa.exec(e.url.toLowerCase()), e.crossDomain = !(!s || !(s[1] != ha[1] || s[2] != ha[2] || (s[3] || (s[1] === "http:" ? 80 : 443)) != (ha[3] || (ha[1] === "http:" ? 80 : 443))))
    }
    if(e.data && e.processData && typeof e.data !== "string") {
      e.data = b.param(e.data, e.traditional)
    }
    S(ta, e, c, w);
    if(y === 2) {
      return!1
    }
    x = e.global;
    e.type = e.type.toUpperCase();
    e.hasContent = !Fb.test(e.type);
    x && b.active++ === 0 && b.event.trigger("ajaxStart");
    if(!e.hasContent && (e.data && (e.url += (Wa.test(e.url) ? "&" : "?") + e.data, delete e.data), o = e.url, e.cache === !1)) {
      s = b.now();
      var z = e.url.replace(Jb, "$1_=" + s);
      e.url = z + (z === e.url ? (Wa.test(e.url) ? "&" : "?") + "_=" + s : "")
    }
    (e.data && e.hasContent && e.contentType !== !1 || c.contentType) && w.setRequestHeader("Content-Type", e.contentType);
    e.ifModified && (o = o || e.url, b.lastModified[o] && w.setRequestHeader("If-Modified-Since", b.lastModified[o]), b.etag[o] && w.setRequestHeader("If-None-Match", b.etag[o]));
    w.setRequestHeader("Accept", e.dataTypes[0] && e.accepts[e.dataTypes[0]] ? e.accepts[e.dataTypes[0]] + (e.dataTypes[0] !== "*" ? ", " + $a + "; q=0.01" : "") : e.accepts["*"]);
    for(v in e.headers) {
      w.setRequestHeader(v, e.headers[v])
    }
    if(e.beforeSend && (e.beforeSend.call(i, w, e) === !1 || y === 2)) {
      return w.abort(), !1
    }
    for(v in{success:1, error:1, complete:1}) {
      w[v](e[v])
    }
    if(r = S(Za, e, c, w)) {
      w.readyState = 1;
      x && g.trigger("ajaxSend", [w, e]);
      e.async && e.timeout > 0 && (D = setTimeout(function() {
        w.abort("timeout")
      }, e.timeout));
      try {
        y = 1, r.send(t, d)
      }catch(L) {
        if(y < 2) {
          d(-1, L)
        }else {
          throw L;
        }
      }
    }else {
      d(-1, "No Transport")
    }
    return w
  }, param:function(a, c) {
    var d = [], e = function(a, c) {
      c = b.isFunction(c) ? c() : c;
      d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(c)
    };
    if(c === p) {
      c = b.ajaxSettings.traditional
    }
    if(b.isArray(a) || a.jquery && !b.isPlainObject(a)) {
      b.each(a, function() {
        e(this.name, this.value)
      })
    }else {
      for(var i in a) {
        da(i, a[i], c, e)
      }
    }
    return d.join("&").replace(Bb, "+")
  }});
  b.extend({active:0, lastModified:{}, etag:{}});
  var Kb = b.now(), qa = /(\=)\?(&|$)|\?\?/i;
  b.ajaxSetup({jsonp:"callback", jsonpCallback:function() {
    return b.expando + "_" + Kb++
  }});
  b.ajaxPrefilter("json jsonp", function(a, c, d) {
    c = typeof a.data === "string" && /^application\/x\-www\-form\-urlencoded/.test(a.contentType);
    if(a.dataTypes[0] === "jsonp" || a.jsonp !== !1 && (qa.test(a.url) || c && qa.test(a.data))) {
      var e, i = a.jsonpCallback = b.isFunction(a.jsonpCallback) ? a.jsonpCallback() : a.jsonpCallback, g = s[i], f = a.url, j = a.data, l = "$1" + i + "$2";
      a.jsonp !== !1 && (f = f.replace(qa, l), a.url === f && (c && (j = j.replace(qa, l)), a.data === j && (f += (/\?/.test(f) ? "&" : "?") + a.jsonp + "=" + i)));
      a.url = f;
      a.data = j;
      s[i] = function(a) {
        e = [a]
      };
      d.always(function() {
        s[i] = g;
        if(e && b.isFunction(g)) {
          s[i](e[0])
        }
      });
      a.converters["script json"] = function() {
        e || b.error(i + " was not called");
        return e[0]
      };
      a.dataTypes[0] = "json";
      return"script"
    }
  });
  b.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"}, contents:{script:/javascript|ecmascript/}, converters:{"text script":function(a) {
    b.globalEval(a);
    return a
  }}});
  b.ajaxPrefilter("script", function(a) {
    if(a.cache === p) {
      a.cache = !1
    }
    if(a.crossDomain) {
      a.type = "GET", a.global = !1
    }
  });
  b.ajaxTransport("script", function(a) {
    if(a.crossDomain) {
      var c, b = n.head || n.getElementsByTagName("head")[0] || n.documentElement;
      return{send:function(d, e) {
        c = n.createElement("script");
        c.async = "async";
        if(a.scriptCharset) {
          c.charset = a.scriptCharset
        }
        c.src = a.url;
        c.onload = c.onreadystatechange = function(a, d) {
          if(d || !c.readyState || /loaded|complete/.test(c.readyState)) {
            c.onload = c.onreadystatechange = null, b && c.parentNode && b.removeChild(c), c = p, d || e(200, "success")
          }
        };
        b.insertBefore(c, b.firstChild)
      }, abort:function() {
        if(c) {
          c.onload(0, 1)
        }
      }}
    }
  });
  var Ba = s.ActiveXObject ? function() {
    for(var a in la) {
      la[a](0, 1)
    }
  } : !1, Lb = 0, la;
  b.ajaxSettings.xhr = s.ActiveXObject ? function() {
    var a;
    if(!(a = !this.isLocal && T())) {
      a: {
        try {
          a = new s.ActiveXObject("Microsoft.XMLHTTP");
          break a
        }catch(c) {
        }
        a = void 0
      }
    }
    return a
  } : T;
  (function(a) {
    b.extend(b.support, {ajax:!!a, cors:!!a && "withCredentials" in a})
  })(b.ajaxSettings.xhr());
  b.support.ajax && b.ajaxTransport(function(a) {
    if(!a.crossDomain || b.support.cors) {
      var c;
      return{send:function(d, e) {
        var i = a.xhr(), g, f;
        a.username ? i.open(a.type, a.url, a.async, a.username, a.password) : i.open(a.type, a.url, a.async);
        if(a.xhrFields) {
          for(f in a.xhrFields) {
            i[f] = a.xhrFields[f]
          }
        }
        a.mimeType && i.overrideMimeType && i.overrideMimeType(a.mimeType);
        !a.crossDomain && !d["X-Requested-With"] && (d["X-Requested-With"] = "XMLHttpRequest");
        try {
          for(f in d) {
            i.setRequestHeader(f, d[f])
          }
        }catch(j) {
        }
        i.send(a.hasContent && a.data || null);
        c = function(d, h) {
          var f, j, l, o, t;
          try {
            if(c && (h || i.readyState === 4)) {
              c = p;
              if(g) {
                i.onreadystatechange = b.noop, Ba && delete la[g]
              }
              if(h) {
                i.readyState !== 4 && i.abort()
              }else {
                f = i.status;
                l = i.getAllResponseHeaders();
                o = {};
                if((t = i.responseXML) && t.documentElement) {
                  o.xml = t
                }
                try {
                  o.text = i.responseText
                }catch(q) {
                }
                try {
                  j = i.statusText
                }catch(m) {
                  j = ""
                }
                !f && a.isLocal && !a.crossDomain ? f = o.text ? 200 : 404 : f === 1223 && (f = 204)
              }
            }
          }catch(n) {
            h || e(-1, n)
          }
          o && e(f, j, o, l)
        };
        !a.async || i.readyState === 4 ? c() : (g = ++Lb, Ba && (la || (la = {}, b(s).unload(Ba)), la[g] = c), i.onreadystatechange = c)
      }, abort:function() {
        c && c(0, 1)
      }}
    }
  });
  var ua = {}, F, ja, Mb = /^(?:toggle|show|hide)$/, Nb = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i, ra, pa = [["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"], ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"], ["opacity"]], oa;
  b.fn.extend({show:function(a, c, d) {
    if(a || a === 0) {
      return this.animate(P("show", 3), a, c, d)
    }else {
      for(var d = 0, e = this.length;d < e;d++) {
        if(a = this[d], a.style) {
          c = a.style.display;
          if(!b._data(a, "olddisplay") && c === "none") {
            c = a.style.display = ""
          }
          (c === "" && b.css(a, "display") === "none" || !b.contains(a.ownerDocument.documentElement, a)) && b._data(a, "olddisplay", ea(a.nodeName))
        }
      }
      for(d = 0;d < e;d++) {
        if(a = this[d], a.style && (c = a.style.display, c === "" || c === "none")) {
          a.style.display = b._data(a, "olddisplay") || ""
        }
      }
      return this
    }
  }, hide:function(a, c, d) {
    if(a || a === 0) {
      return this.animate(P("hide", 3), a, c, d)
    }else {
      for(var d = 0, e = this.length;d < e;d++) {
        a = this[d], a.style && (c = b.css(a, "display"), c !== "none" && !b._data(a, "olddisplay") && b._data(a, "olddisplay", c))
      }
      for(d = 0;d < e;d++) {
        if(this[d].style) {
          this[d].style.display = "none"
        }
      }
      return this
    }
  }, _toggle:b.fn.toggle, toggle:function(a, c, d) {
    var e = typeof a === "boolean";
    b.isFunction(a) && b.isFunction(c) ? this._toggle.apply(this, arguments) : a == null || e ? this.each(function() {
      var c = e ? a : b(this).is(":hidden");
      b(this)[c ? "show" : "hide"]()
    }) : this.animate(P("toggle", 3), a, c, d);
    return this
  }, fadeTo:function(a, c, b, d) {
    return this.filter(":hidden").css("opacity", 0).show().end().animate({opacity:c}, a, b, d)
  }, animate:function(a, c, d, e) {
    function i() {
      var u;
      g.queue === !1 && b._mark(this);
      var c = b.extend({}, g), d = this.nodeType === 1, e = d && b(this).is(":hidden"), h, k, f, j, l;
      c.animatedProperties = {};
      for(f in a) {
        if(h = b.camelCase(f), f !== h && (a[h] = a[f], delete a[f]), (k = b.cssHooks[h]) && "expand" in k) {
          for(f in j = k.expand(a[h]), delete a[h], j) {
            f in a || (a[f] = j[f])
          }
        }
      }
      for(h in a) {
        k = a[h];
        b.isArray(k) ? (c.animatedProperties[h] = k[1], u = a[h] = k[0], k = u) : c.animatedProperties[h] = c.specialEasing && c.specialEasing[h] || c.easing || "swing";
        if(k === "hide" && e || k === "show" && !e) {
          return c.complete.call(this)
        }
        if(d && (h === "height" || h === "width")) {
          if(c.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY], b.css(this, "display") === "inline" && b.css(this, "float") === "none") {
            !b.support.inlineBlockNeedsLayout || ea(this.nodeName) === "inline" ? this.style.display = "inline-block" : this.style.zoom = 1
          }
        }
      }
      if(c.overflow != null) {
        this.style.overflow = "hidden"
      }
      for(f in a) {
        if(d = new b.fx(this, c, f), k = a[f], Mb.test(k)) {
          if(h = b._data(this, "toggle" + f) || (k === "toggle" ? e ? "show" : "hide" : 0)) {
            b._data(this, "toggle" + f, h === "show" ? "hide" : "show"), d[h]()
          }else {
            d[k]()
          }
        }else {
          h = Nb.exec(k), j = d.cur(), h ? (k = parseFloat(h[2]), l = h[3] || (b.cssNumber[f] ? "" : "px"), l !== "px" && (b.style(this, f, (k || 1) + l), j *= (k || 1) / d.cur(), b.style(this, f, j + l)), h[1] && (k = (h[1] === "-=" ? -1 : 1) * k + j), d.custom(j, k, l)) : d.custom(j, k, "")
        }
      }
      return!0
    }
    var g = b.speed(c, d, e);
    if(b.isEmptyObject(a)) {
      return this.each(g.complete, [!1])
    }
    a = b.extend({}, a);
    return g.queue === !1 ? this.each(i) : this.queue(g.queue, i)
  }, stop:function(a, c, d) {
    typeof a !== "string" && (d = c, c = a, a = p);
    c && a !== !1 && this.queue(a || "fx", []);
    return this.each(function() {
      function c(a, e, i) {
        e = e[i];
        b.removeData(a, i, !0);
        e.stop(d)
      }
      var e, i = !1, g = b.timers, f = b._data(this);
      d || b._unmark(!0, this);
      if(a == null) {
        for(e in f) {
          f[e] && f[e].stop && e.indexOf(".run") === e.length - 4 && c(this, f, e)
        }
      }else {
        f[e = a + ".run"] && f[e].stop && c(this, f, e)
      }
      for(e = g.length;e--;) {
        if(g[e].elem === this && (a == null || g[e].queue === a)) {
          if(d) {
            g[e](!0)
          }else {
            g[e].saveState()
          }
          i = !0;
          g.splice(e, 1)
        }
      }
      (!d || !i) && b.dequeue(this, a)
    })
  }});
  b.each({slideDown:P("show", 1), slideUp:P("hide", 1), slideToggle:P("toggle", 1), fadeIn:{opacity:"show"}, fadeOut:{opacity:"hide"}, fadeToggle:{opacity:"toggle"}}, function(a, c) {
    b.fn[a] = function(a, b, d) {
      return this.animate(c, a, b, d)
    }
  });
  b.extend({speed:function(a, c, d) {
    var e = a && typeof a === "object" ? b.extend({}, a) : {complete:d || !d && c || b.isFunction(a) && a, duration:a, easing:d && c || c && !b.isFunction(c) && c};
    e.duration = b.fx.off ? 0 : typeof e.duration === "number" ? e.duration : e.duration in b.fx.speeds ? b.fx.speeds[e.duration] : b.fx.speeds._default;
    if(e.queue == null || e.queue === !0) {
      e.queue = "fx"
    }
    e.old = e.complete;
    e.complete = function(a) {
      b.isFunction(e.old) && e.old.call(this);
      e.queue ? b.dequeue(this, e.queue) : a !== !1 && b._unmark(this)
    };
    return e
  }, easing:{linear:function(a) {
    return a
  }, swing:function(a) {
    return-Math.cos(a * Math.PI) / 2 + 0.5
  }}, timers:[], fx:function(a, c, b) {
    this.options = c;
    this.elem = a;
    this.prop = b;
    c.orig = c.orig || {}
  }});
  b.fx.prototype = {update:function() {
    this.options.step && this.options.step.call(this.elem, this.now, this);
    (b.fx.step[this.prop] || b.fx.step._default)(this)
  }, cur:function() {
    if(this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) {
      return this.elem[this.prop]
    }
    var a, c = b.css(this.elem, this.prop);
    return isNaN(a = parseFloat(c)) ? !c || c === "auto" ? 0 : c : a
  }, custom:function(a, c, d) {
    function e(a) {
      return i.step(a)
    }
    var i = this, g = b.fx;
    this.startTime = oa || l();
    this.end = c;
    this.now = this.start = a;
    this.pos = this.state = 0;
    this.unit = d || this.unit || (b.cssNumber[this.prop] ? "" : "px");
    e.queue = this.options.queue;
    e.elem = this.elem;
    e.saveState = function() {
      b._data(i.elem, "fxshow" + i.prop) === p && (i.options.hide ? b._data(i.elem, "fxshow" + i.prop, i.start) : i.options.show && b._data(i.elem, "fxshow" + i.prop, i.end))
    };
    e() && b.timers.push(e) && !ra && (ra = setInterval(g.tick, g.interval))
  }, show:function() {
    var a = b._data(this.elem, "fxshow" + this.prop);
    this.options.orig[this.prop] = a || b.style(this.elem, this.prop);
    this.options.show = !0;
    a !== p ? this.custom(this.cur(), a) : this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());
    b(this.elem).show()
  }, hide:function() {
    this.options.orig[this.prop] = b._data(this.elem, "fxshow" + this.prop) || b.style(this.elem, this.prop);
    this.options.hide = !0;
    this.custom(this.cur(), 0)
  }, step:function(a) {
    var c, d = oa || l(), e = !0, i = this.elem, g = this.options;
    if(a || d >= g.duration + this.startTime) {
      this.now = this.end;
      this.pos = this.state = 1;
      this.update();
      g.animatedProperties[this.prop] = !0;
      for(c in g.animatedProperties) {
        g.animatedProperties[c] !== !0 && (e = !1)
      }
      if(e) {
        g.overflow != null && !b.support.shrinkWrapBlocks && b.each(["", "X", "Y"], function(a, c) {
          i.style["overflow" + c] = g.overflow[a]
        });
        g.hide && b(i).hide();
        if(g.hide || g.show) {
          for(c in g.animatedProperties) {
            b.style(i, c, g.orig[c]), b.removeData(i, "fxshow" + c, !0), b.removeData(i, "toggle" + c, !0)
          }
        }
        if(a = g.complete) {
          g.complete = !1, a.call(i)
        }
      }
      return!1
    }else {
      g.duration == Infinity ? this.now = d : (a = d - this.startTime, this.state = a / g.duration, this.pos = b.easing[g.animatedProperties[this.prop]](this.state, a, 0, 1, g.duration), this.now = this.start + (this.end - this.start) * this.pos), this.update()
    }
    return!0
  }};
  b.extend(b.fx, {tick:function() {
    for(var a, c = b.timers, d = 0;d < c.length;d++) {
      a = c[d], !a() && c[d] === a && c.splice(d--, 1)
    }
    c.length || b.fx.stop()
  }, interval:13, stop:function() {
    clearInterval(ra);
    ra = null
  }, speeds:{slow:600, fast:200, _default:400}, step:{opacity:function(a) {
    b.style(a.elem, "opacity", a.now)
  }, _default:function(a) {
    a.elem.style && a.elem.style[a.prop] != null ? a.elem.style[a.prop] = a.now + a.unit : a.elem[a.prop] = a.now
  }}});
  b.each(pa.concat.apply([], pa), function(a, c) {
    c.indexOf("margin") && (b.fx.step[c] = function(a) {
      b.style(a.elem, c, Math.max(0, a.now) + a.unit)
    })
  });
  if(b.expr && b.expr.filters) {
    b.expr.filters.animated = function(a) {
      return b.grep(b.timers, function(c) {
        return a === c.elem
      }).length
    }
  }
  var ab, Ob = /^t(?:able|d|h)$/i, bb = /^(?:body|html)$/i;
  ab = "getBoundingClientRect" in n.documentElement ? function(a, c, d, e) {
    try {
      e = a.getBoundingClientRect()
    }catch(i) {
    }
    if(!e || !b.contains(d, a)) {
      return e ? {top:e.top, left:e.left} : {top:0, left:0}
    }
    a = c.body;
    c = K(c);
    return{top:e.top + (c.pageYOffset || b.support.boxModel && d.scrollTop || a.scrollTop) - (d.clientTop || a.clientTop || 0), left:e.left + (c.pageXOffset || b.support.boxModel && d.scrollLeft || a.scrollLeft) - (d.clientLeft || a.clientLeft || 0)}
  } : function(a, c, d) {
    var e, i = a.offsetParent, g = c.body;
    e = (c = c.defaultView) ? c.getComputedStyle(a, null) : a.currentStyle;
    for(var f = a.offsetTop, j = a.offsetLeft;(a = a.parentNode) && a !== g && a !== d;) {
      if(b.support.fixedPosition && e.position === "fixed") {
        break
      }
      e = c ? c.getComputedStyle(a, null) : a.currentStyle;
      f -= a.scrollTop;
      j -= a.scrollLeft;
      if(a === i) {
        f += a.offsetTop;
        j += a.offsetLeft;
        if(b.support.doesNotAddBorder && (!b.support.doesAddBorderForTableAndCells || !Ob.test(a.nodeName))) {
          f += parseFloat(e.borderTopWidth) || 0, j += parseFloat(e.borderLeftWidth) || 0
        }
        i = a.offsetParent
      }
      b.support.subtractsBorderForOverflowNotVisible && e.overflow !== "visible" && (f += parseFloat(e.borderTopWidth) || 0, j += parseFloat(e.borderLeftWidth) || 0)
    }
    if(e.position === "relative" || e.position === "static") {
      f += g.offsetTop, j += g.offsetLeft
    }
    b.support.fixedPosition && e.position === "fixed" && (f += Math.max(d.scrollTop, g.scrollTop), j += Math.max(d.scrollLeft, g.scrollLeft));
    return{top:f, left:j}
  };
  b.fn.offset = function(a) {
    if(arguments.length) {
      return a === p ? this : this.each(function(c) {
        b.offset.setOffset(this, a, c)
      })
    }
    var c = this[0], d = c && c.ownerDocument;
    return!d ? null : c === d.body ? b.offset.bodyOffset(c) : ab(c, d, d.documentElement)
  };
  b.offset = {bodyOffset:function(a) {
    var c = a.offsetTop, d = a.offsetLeft;
    b.support.doesNotIncludeMarginInBodyOffset && (c += parseFloat(b.css(a, "marginTop")) || 0, d += parseFloat(b.css(a, "marginLeft")) || 0);
    return{top:c, left:d}
  }, setOffset:function(a, c, d) {
    var e = b.css(a, "position");
    if(e === "static") {
      a.style.position = "relative"
    }
    var i = b(a), g = i.offset(), f = b.css(a, "top"), j = b.css(a, "left"), l = {}, o = {};
    (e === "absolute" || e === "fixed") && b.inArray("auto", [f, j]) > -1 ? (o = i.position(), e = o.top, j = o.left) : (e = parseFloat(f) || 0, j = parseFloat(j) || 0);
    b.isFunction(c) && (c = c.call(a, d, g));
    if(c.top != null) {
      l.top = c.top - g.top + e
    }
    if(c.left != null) {
      l.left = c.left - g.left + j
    }
    "using" in c ? c.using.call(a, l) : i.css(l)
  }};
  b.fn.extend({position:function() {
    if(!this[0]) {
      return null
    }
    var a = this[0], c = this.offsetParent(), d = this.offset(), e = bb.test(c[0].nodeName) ? {top:0, left:0} : c.offset();
    d.top -= parseFloat(b.css(a, "marginTop")) || 0;
    d.left -= parseFloat(b.css(a, "marginLeft")) || 0;
    e.top += parseFloat(b.css(c[0], "borderTopWidth")) || 0;
    e.left += parseFloat(b.css(c[0], "borderLeftWidth")) || 0;
    return{top:d.top - e.top, left:d.left - e.left}
  }, offsetParent:function() {
    return this.map(function() {
      for(var a = this.offsetParent || n.body;a && !bb.test(a.nodeName) && b.css(a, "position") === "static";) {
        a = a.offsetParent
      }
      return a
    })
  }});
  b.each({scrollLeft:"pageXOffset", scrollTop:"pageYOffset"}, function(a, c) {
    var d = /Y/.test(c);
    b.fn[a] = function(e) {
      return b.access(this, function(a, e, i) {
        var g = K(a);
        if(i === p) {
          return g ? c in g ? g[c] : b.support.boxModel && g.document.documentElement[e] || g.document.body[e] : a[e]
        }
        g ? g.scrollTo(!d ? i : b(g).scrollLeft(), d ? i : b(g).scrollTop()) : a[e] = i
      }, a, e, arguments.length, null)
    }
  });
  b.each({Height:"height", Width:"width"}, function(a, c) {
    var d = "client" + a, e = "scroll" + a, i = "offset" + a;
    b.fn["inner" + a] = function() {
      var a = this[0];
      return a ? a.style ? parseFloat(b.css(a, c, "padding")) : this[c]() : null
    };
    b.fn["outer" + a] = function(a) {
      var d = this[0];
      return d ? d.style ? parseFloat(b.css(d, c, a ? "margin" : "border")) : this[c]() : null
    };
    b.fn[c] = function(a) {
      return b.access(this, function(a, c, g) {
        if(b.isWindow(a)) {
          return c = a.document, a = c.documentElement[d], b.support.boxModel && a || c.body && c.body[d] || a
        }
        if(a.nodeType === 9) {
          return c = a.documentElement, c[d] >= c[e] ? c[d] : Math.max(a.body[e], c[e], a.body[i], c[i])
        }
        if(g === p) {
          return a = b.css(a, c), c = parseFloat(a), b.isNumeric(c) ? c : a
        }
        b(a).css(c, g)
      }, c, a, arguments.length, null)
    }
  });
  s.jQuery = s.$ = b;
  typeof define === "function" && define.amd && define.amd.jQuery && define("jquery", [], function() {
    return b
  })
})(window);
(function() {
  function s(d, b, e) {
    if(d === b) {
      return d !== 0 || 1 / d == 1 / b
    }
    if(d == null || b == null) {
      return d === b
    }
    if(d._chain) {
      d = d._wrapped
    }
    if(b._chain) {
      b = b._wrapped
    }
    if(d.isEqual && l.isFunction(d.isEqual)) {
      return d.isEqual(b)
    }
    if(b.isEqual && l.isFunction(b.isEqual)) {
      return b.isEqual(d)
    }
    var f = x.call(d);
    if(f != x.call(b)) {
      return!1
    }
    switch(f) {
      case "[object String]":
        return d == String(b);
      case "[object Number]":
        return d != +d ? b != +b : d == 0 ? 1 / d == 1 / b : d == +b;
      case "[object Date]":
      ;
      case "[object Boolean]":
        return+d == +b;
      case "[object RegExp]":
        return d.source == b.source && d.global == b.global && d.multiline == b.multiline && d.ignoreCase == b.ignoreCase
    }
    if(typeof d != "object" || typeof b != "object") {
      return!1
    }
    for(var j = e.length;j--;) {
      if(e[j] == d) {
        return!0
      }
    }
    e.push(d);
    var j = 0, q = !0;
    if(f == "[object Array]") {
      if(j = d.length, q = j == b.length) {
        for(;j--;) {
          if(!(q = j in d == j in b && s(d[j], b[j], e))) {
            break
          }
        }
      }
    }else {
      if("constructor" in d != "constructor" in b || d.constructor != b.constructor) {
        return!1
      }
      for(var m in d) {
        if(l.has(d, m) && (j++, !(q = l.has(b, m) && s(d[m], b[m], e)))) {
          break
        }
      }
      if(q) {
        for(m in b) {
          if(l.has(b, m) && !j--) {
            break
          }
        }
        q = !j
      }
    }
    e.pop();
    return q
  }
  var p = this, E = p._, H = {}, v = Array.prototype, O = Object.prototype, r = v.slice, m = v.unshift, x = O.toString, Y = O.hasOwnProperty, J = v.forEach, W = v.map, B = v.reduce, Z = v.reduceRight, R = v.filter, $ = v.every, ba = v.some, S = v.indexOf, ca = v.lastIndexOf, O = Array.isArray, da = Object.keys, T = Function.prototype.bind, l = function(b) {
    return new e(b)
  };
  if(typeof exports !== "undefined") {
    if(typeof module !== "undefined" && module.exports) {
      exports = module.exports = l
    }
    exports._ = l
  }else {
    p._ = l
  }
  l.VERSION = "1.3.3";
  var z = l.each = l.forEach = function(b, e, g) {
    if(b != null) {
      if(J && b.forEach === J) {
        b.forEach(e, g)
      }else {
        if(b.length === +b.length) {
          for(var f = 0, j = b.length;f < j;f++) {
            if(f in b && e.call(g, b[f], f, b) === H) {
              break
            }
          }
        }else {
          for(f in b) {
            if(l.has(b, f) && e.call(g, b[f], f, b) === H) {
              break
            }
          }
        }
      }
    }
  };
  l.map = l.collect = function(b, e, g) {
    var f = [];
    if(b == null) {
      return f
    }
    if(W && b.map === W) {
      return b.map(e, g)
    }
    z(b, function(b, d, j) {
      f[f.length] = e.call(g, b, d, j)
    });
    if(b.length === +b.length) {
      f.length = b.length
    }
    return f
  };
  l.reduce = l.foldl = l.inject = function(b, e, g, f) {
    var j = arguments.length > 2;
    b == null && (b = []);
    if(B && b.reduce === B) {
      return f && (e = l.bind(e, f)), j ? b.reduce(e, g) : b.reduce(e)
    }
    z(b, function(b, d, l) {
      j ? g = e.call(f, g, b, d, l) : (g = b, j = !0)
    });
    if(!j) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    return g
  };
  l.reduceRight = l.foldr = function(b, e, g, f) {
    var j = arguments.length > 2;
    b == null && (b = []);
    if(Z && b.reduceRight === Z) {
      return f && (e = l.bind(e, f)), j ? b.reduceRight(e, g) : b.reduceRight(e)
    }
    var q = l.toArray(b).reverse();
    f && !j && (e = l.bind(e, f));
    return j ? l.reduce(q, e, g, f) : l.reduce(q, e)
  };
  l.find = l.detect = function(b, e, g) {
    var f;
    P(b, function(b, d, j) {
      if(e.call(g, b, d, j)) {
        return f = b, !0
      }
    });
    return f
  };
  l.filter = l.select = function(b, e, g) {
    var f = [];
    if(b == null) {
      return f
    }
    if(R && b.filter === R) {
      return b.filter(e, g)
    }
    z(b, function(b, d, j) {
      e.call(g, b, d, j) && (f[f.length] = b)
    });
    return f
  };
  l.reject = function(b, e, g) {
    var f = [];
    if(b == null) {
      return f
    }
    z(b, function(b, d, j) {
      e.call(g, b, d, j) || (f[f.length] = b)
    });
    return f
  };
  l.every = l.all = function(b, e, g) {
    var f = !0;
    if(b == null) {
      return f
    }
    if($ && b.every === $) {
      return b.every(e, g)
    }
    z(b, function(b, d, j) {
      if(!(f = f && e.call(g, b, d, j))) {
        return H
      }
    });
    return!!f
  };
  var P = l.some = l.any = function(b, e, g) {
    e || (e = l.identity);
    var f = !1;
    if(b == null) {
      return f
    }
    if(ba && b.some === ba) {
      return b.some(e, g)
    }
    z(b, function(b, d, j) {
      if(f || (f = e.call(g, b, d, j))) {
        return H
      }
    });
    return!!f
  };
  l.include = l.contains = function(b, e) {
    var g = !1;
    if(b == null) {
      return g
    }
    return S && b.indexOf === S ? b.indexOf(e) != -1 : g = P(b, function(b) {
      return b === e
    })
  };
  l.invoke = function(b, e) {
    var g = r.call(arguments, 2);
    return l.map(b, function(b) {
      return(l.isFunction(e) ? e || b : b[e]).apply(b, g)
    })
  };
  l.pluck = function(b, e) {
    return l.map(b, function(b) {
      return b[e]
    })
  };
  l.max = function(b, e, g) {
    if(!e && l.isArray(b) && b[0] === +b[0]) {
      return Math.max.apply(Math, b)
    }
    if(!e && l.isEmpty(b)) {
      return-Infinity
    }
    var f = {computed:-Infinity};
    z(b, function(b, d, j) {
      d = e ? e.call(g, b, d, j) : b;
      d >= f.computed && (f = {value:b, computed:d})
    });
    return f.value
  };
  l.min = function(b, e, g) {
    if(!e && l.isArray(b) && b[0] === +b[0]) {
      return Math.min.apply(Math, b)
    }
    if(!e && l.isEmpty(b)) {
      return Infinity
    }
    var f = {computed:Infinity};
    z(b, function(b, d, j) {
      d = e ? e.call(g, b, d, j) : b;
      d < f.computed && (f = {value:b, computed:d})
    });
    return f.value
  };
  l.shuffle = function(b) {
    var e = [], g;
    z(b, function(b, d) {
      g = Math.floor(Math.random() * (d + 1));
      e[d] = e[g];
      e[g] = b
    });
    return e
  };
  l.sortBy = function(b, e, g) {
    var f = l.isFunction(e) ? e : function(b) {
      return b[e]
    };
    return l.pluck(l.map(b, function(b, d, e) {
      return{value:b, criteria:f.call(g, b, d, e)}
    }).sort(function(b, d) {
      var e = b.criteria, g = d.criteria;
      return e === void 0 ? 1 : g === void 0 ? -1 : e < g ? -1 : e > g ? 1 : 0
    }), "value")
  };
  l.groupBy = function(b, e) {
    var g = {}, f = l.isFunction(e) ? e : function(b) {
      return b[e]
    };
    z(b, function(b, d) {
      var e = f(b, d);
      (g[e] || (g[e] = [])).push(b)
    });
    return g
  };
  l.sortedIndex = function(b, e, g) {
    g || (g = l.identity);
    for(var f = 0, j = b.length;f < j;) {
      var q = f + j >> 1;
      g(b[q]) < g(e) ? f = q + 1 : j = q
    }
    return f
  };
  l.toArray = function(b) {
    return!b ? [] : l.isArray(b) ? r.call(b) : l.isArguments(b) ? r.call(b) : b.toArray && l.isFunction(b.toArray) ? b.toArray() : l.values(b)
  };
  l.size = function(b) {
    return l.isArray(b) ? b.length : l.keys(b).length
  };
  l.first = l.head = l.take = function(b, e, g) {
    return e != null && !g ? r.call(b, 0, e) : b[0]
  };
  l.initial = function(b, e, g) {
    return r.call(b, 0, b.length - (e == null || g ? 1 : e))
  };
  l.last = function(b, e, g) {
    return e != null && !g ? r.call(b, Math.max(b.length - e, 0)) : b[b.length - 1]
  };
  l.rest = l.tail = function(b, e, g) {
    return r.call(b, e == null || g ? 1 : e)
  };
  l.compact = function(b) {
    return l.filter(b, function(b) {
      return!!b
    })
  };
  l.flatten = function(b, e) {
    return l.reduce(b, function(b, d) {
      if(l.isArray(d)) {
        return b.concat(e ? d : l.flatten(d))
      }
      b[b.length] = d;
      return b
    }, [])
  };
  l.without = function(b) {
    return l.difference(b, r.call(arguments, 1))
  };
  l.uniq = l.unique = function(b, e, g) {
    var g = g ? l.map(b, g) : b, f = [];
    b.length < 3 && (e = !0);
    l.reduce(g, function(g, j, m) {
      if(e ? l.last(g) !== j || !g.length : !l.include(g, j)) {
        g.push(j), f.push(b[m])
      }
      return g
    }, []);
    return f
  };
  l.union = function() {
    return l.uniq(l.flatten(arguments, !0))
  };
  l.intersection = l.intersect = function(b) {
    var e = r.call(arguments, 1);
    return l.filter(l.uniq(b), function(b) {
      return l.every(e, function(e) {
        return l.indexOf(e, b) >= 0
      })
    })
  };
  l.difference = function(b) {
    var e = l.flatten(r.call(arguments, 1), !0);
    return l.filter(b, function(b) {
      return!l.include(e, b)
    })
  };
  l.zip = function() {
    for(var b = r.call(arguments), e = l.max(l.pluck(b, "length")), g = Array(e), f = 0;f < e;f++) {
      g[f] = l.pluck(b, "" + f)
    }
    return g
  };
  l.indexOf = function(b, e, g) {
    if(b == null) {
      return-1
    }
    var f;
    if(g) {
      return g = l.sortedIndex(b, e), b[g] === e ? g : -1
    }
    if(S && b.indexOf === S) {
      return b.indexOf(e)
    }
    for(g = 0, f = b.length;g < f;g++) {
      if(g in b && b[g] === e) {
        return g
      }
    }
    return-1
  };
  l.lastIndexOf = function(b, e) {
    if(b == null) {
      return-1
    }
    if(ca && b.lastIndexOf === ca) {
      return b.lastIndexOf(e)
    }
    for(var g = b.length;g--;) {
      if(g in b && b[g] === e) {
        return g
      }
    }
    return-1
  };
  l.range = function(b, e, g) {
    arguments.length <= 1 && (e = b || 0, b = 0);
    for(var g = arguments[2] || 1, f = Math.max(Math.ceil((e - b) / g), 0), j = 0, l = Array(f);j < f;) {
      l[j++] = b, b += g
    }
    return l
  };
  var ea = function() {
  };
  l.bind = function(b, e) {
    var g, f;
    if(b.bind === T && T) {
      return T.apply(b, r.call(arguments, 1))
    }
    if(!l.isFunction(b)) {
      throw new TypeError;
    }
    f = r.call(arguments, 2);
    return g = function() {
      if(!(this instanceof g)) {
        return b.apply(e, f.concat(r.call(arguments)))
      }
      ea.prototype = b.prototype;
      var j = new ea, l = b.apply(j, f.concat(r.call(arguments)));
      return Object(l) === l ? l : j
    }
  };
  l.bindAll = function(b) {
    var e = r.call(arguments, 1);
    e.length == 0 && (e = l.functions(b));
    z(e, function(e) {
      b[e] = l.bind(b[e], b)
    });
    return b
  };
  l.memoize = function(b, e) {
    var g = {};
    e || (e = l.identity);
    return function() {
      var f = e.apply(this, arguments);
      return l.has(g, f) ? g[f] : g[f] = b.apply(this, arguments)
    }
  };
  l.delay = function(b, e) {
    var g = r.call(arguments, 2);
    return setTimeout(function() {
      return b.apply(null, g)
    }, e)
  };
  l.defer = function(b) {
    return l.delay.apply(l, [b, 1].concat(r.call(arguments, 1)))
  };
  l.throttle = function(b, e) {
    var g, f, j, m, n, p, r = l.debounce(function() {
      n = m = !1
    }, e);
    return function() {
      g = this;
      f = arguments;
      var l;
      j || (j = setTimeout(function() {
        j = null;
        n && b.apply(g, f);
        r()
      }, e));
      m ? n = !0 : p = b.apply(g, f);
      r();
      m = !0;
      return p
    }
  };
  l.debounce = function(b, e, g) {
    var f;
    return function() {
      var j = this, l = arguments;
      g && !f && b.apply(j, l);
      clearTimeout(f);
      f = setTimeout(function() {
        f = null;
        g || b.apply(j, l)
      }, e)
    }
  };
  l.once = function(b) {
    var e = !1, g;
    return function() {
      if(e) {
        return g
      }
      e = !0;
      return g = b.apply(this, arguments)
    }
  };
  l.wrap = function(b, e) {
    return function() {
      var g = [b].concat(r.call(arguments, 0));
      return e.apply(this, g)
    }
  };
  l.compose = function() {
    var b = arguments;
    return function() {
      for(var e = arguments, g = b.length - 1;g >= 0;g--) {
        e = [b[g].apply(this, e)]
      }
      return e[0]
    }
  };
  l.after = function(b, e) {
    return b <= 0 ? e() : function() {
      if(--b < 1) {
        return e.apply(this, arguments)
      }
    }
  };
  l.keys = da || function(b) {
    if(b !== Object(b)) {
      throw new TypeError("Invalid object");
    }
    var e = [], g;
    for(g in b) {
      l.has(b, g) && (e[e.length] = g)
    }
    return e
  };
  l.values = function(b) {
    return l.map(b, l.identity)
  };
  l.functions = l.methods = function(b) {
    var e = [], g;
    for(g in b) {
      l.isFunction(b[g]) && e.push(g)
    }
    return e.sort()
  };
  l.extend = function(b) {
    z(r.call(arguments, 1), function(e) {
      for(var g in e) {
        b[g] = e[g]
      }
    });
    return b
  };
  l.pick = function(b) {
    var e = {};
    z(l.flatten(r.call(arguments, 1)), function(g) {
      g in b && (e[g] = b[g])
    });
    return e
  };
  l.defaults = function(b) {
    z(r.call(arguments, 1), function(e) {
      for(var g in e) {
        b[g] == null && (b[g] = e[g])
      }
    });
    return b
  };
  l.clone = function(b) {
    return!l.isObject(b) ? b : l.isArray(b) ? b.slice() : l.extend({}, b)
  };
  l.tap = function(b, e) {
    e(b);
    return b
  };
  l.isEqual = function(b, e) {
    return s(b, e, [])
  };
  l.isEmpty = function(b) {
    if(b == null) {
      return!0
    }
    if(l.isArray(b) || l.isString(b)) {
      return b.length === 0
    }
    for(var e in b) {
      if(l.has(b, e)) {
        return!1
      }
    }
    return!0
  };
  l.isElement = function(b) {
    return!!(b && b.nodeType == 1)
  };
  l.isArray = O || function(b) {
    return x.call(b) == "[object Array]"
  };
  l.isObject = function(b) {
    return b === Object(b)
  };
  l.isArguments = function(b) {
    return x.call(b) == "[object Arguments]"
  };
  if(!l.isArguments(arguments)) {
    l.isArguments = function(b) {
      return!(!b || !l.has(b, "callee"))
    }
  }
  l.isFunction = function(b) {
    return x.call(b) == "[object Function]"
  };
  l.isString = function(b) {
    return x.call(b) == "[object String]"
  };
  l.isNumber = function(b) {
    return x.call(b) == "[object Number]"
  };
  l.isFinite = function(b) {
    return l.isNumber(b) && isFinite(b)
  };
  l.isNaN = function(b) {
    return b !== b
  };
  l.isBoolean = function(b) {
    return b === !0 || b === !1 || x.call(b) == "[object Boolean]"
  };
  l.isDate = function(b) {
    return x.call(b) == "[object Date]"
  };
  l.isRegExp = function(b) {
    return x.call(b) == "[object RegExp]"
  };
  l.isNull = function(b) {
    return b === null
  };
  l.isUndefined = function(b) {
    return b === void 0
  };
  l.has = function(b, e) {
    return Y.call(b, e)
  };
  l.noConflict = function() {
    p._ = E;
    return this
  };
  l.identity = function(b) {
    return b
  };
  l.times = function(b, e, g) {
    for(var f = 0;f < b;f++) {
      e.call(g, f)
    }
  };
  l.escape = function(b) {
    return("" + b).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;")
  };
  l.result = function(b, e) {
    if(b == null) {
      return null
    }
    var f = b[e];
    return l.isFunction(f) ? f.call(b) : f
  };
  l.mixin = function(b) {
    z(l.functions(b), function(e) {
      j(e, l[e] = b[e])
    })
  };
  var K = 0;
  l.uniqueId = function(b) {
    var e = K++;
    return b ? b + e : e
  };
  l.templateSettings = {evaluate:/<%([\s\S]+?)%>/g, interpolate:/<%=([\s\S]+?)%>/g, escape:/<%-([\s\S]+?)%>/g};
  var n = /.^/, U = {"\\":"\\", "'":"'", r:"\r", n:"\n", t:"\t", u2028:"\u2028", u2029:"\u2029"}, fa;
  for(fa in U) {
    U[U[fa]] = fa
  }
  var b = /\\|'|\r|\n|\t|\u2028|\u2029/g, X = /\\(\\|'|r|n|t|u2028|u2029)/g, M = function(b) {
    return b.replace(X, function(b, e) {
      return U[e]
    })
  };
  l.template = function(e, f, g) {
    g = l.defaults(g || {}, l.templateSettings);
    e = "__p+='" + e.replace(b, function(b) {
      return"\\" + U[b]
    }).replace(g.escape || n, function(b, e) {
      return"'+\n_.escape(" + M(e) + ")+\n'"
    }).replace(g.interpolate || n, function(b, e) {
      return"'+\n(" + M(e) + ")+\n'"
    }).replace(g.evaluate || n, function(b, e) {
      return"';\n" + M(e) + "\n;__p+='"
    }) + "';\n";
    g.variable || (e = "with(obj||{}){\n" + e + "}\n");
    var e = "var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + e + "return __p;\n", j = new Function(g.variable || "obj", "_", e);
    if(f) {
      return j(f, l)
    }
    f = function(b) {
      return j.call(this, b, l)
    };
    f.source = "function(" + (g.variable || "obj") + "){\n" + e + "}";
    return f
  };
  l.chain = function(b) {
    return l(b).chain()
  };
  var e = function(b) {
    this._wrapped = b
  };
  l.prototype = e.prototype;
  var f = function(b, e) {
    return e ? l(b).chain() : b
  }, j = function(b, i) {
    e.prototype[b] = function() {
      var b = r.call(arguments);
      m.call(b, this._wrapped);
      return f(i.apply(l, b), this._chain)
    }
  };
  l.mixin(l);
  z("pop,push,reverse,shift,sort,splice,unshift".split(","), function(b) {
    var i = v[b];
    e.prototype[b] = function() {
      var e = this._wrapped;
      i.apply(e, arguments);
      var j = e.length;
      (b == "shift" || b == "splice") && j === 0 && delete e[0];
      return f(e, this._chain)
    }
  });
  z(["concat", "join", "slice"], function(b) {
    var i = v[b];
    e.prototype[b] = function() {
      return f(i.apply(this._wrapped, arguments), this._chain)
    }
  });
  e.prototype.chain = function() {
    this._chain = !0;
    return this
  };
  e.prototype.value = function() {
    return this._wrapped
  }
}).call(this);
(function() {
  var s = this, p = s.Backbone, E = [], H = E.push, v = E.slice, O = E.splice, r;
  r = typeof exports !== "undefined" ? exports : s.Backbone = {};
  r.VERSION = "1.0.0";
  var m = s._;
  !m && typeof require !== "undefined" && (m = require("underscore"));
  r.$ = s.jQuery || s.Zepto || s.ender || s.$;
  r.noConflict = function() {
    s.Backbone = p;
    return this
  };
  r.emulateHTTP = !1;
  r.emulateJSON = !1;
  var x = r.Events = {on:function(b, f, j) {
    if(!J(this, "on", b, [f, j]) || !f) {
      return this
    }
    this._events || (this._events = {});
    (this._events[b] || (this._events[b] = [])).push({callback:f, context:j, ctx:j || this});
    return this
  }, once:function(b, f, j) {
    if(!J(this, "once", b, [f, j]) || !f) {
      return this
    }
    var d = this, i = m.once(function() {
      d.off(b, i);
      f.apply(this, arguments)
    });
    i._callback = f;
    return this.on(b, i, j)
  }, off:function(b, f, j) {
    var d, i, g, l, o, q, n, p;
    if(!this._events || !J(this, "off", b, [f, j])) {
      return this
    }
    if(!b && !f && !j) {
      return this._events = {}, this
    }
    l = b ? [b] : m.keys(this._events);
    for(o = 0, q = l.length;o < q;o++) {
      if(b = l[o], g = this._events[b]) {
        this._events[b] = d = [];
        if(f || j) {
          for(n = 0, p = g.length;n < p;n++) {
            i = g[n], (f && f !== i.callback && f !== i.callback._callback || j && j !== i.context) && d.push(i)
          }
        }
        d.length || delete this._events[b]
      }
    }
    return this
  }, trigger:function(b) {
    if(!this._events) {
      return this
    }
    var f = v.call(arguments, 1);
    if(!J(this, "trigger", b, f)) {
      return this
    }
    var j = this._events[b], d = this._events.all;
    j && W(j, f);
    d && W(d, arguments);
    return this
  }, stopListening:function(b, f, j) {
    var d = this._listeners;
    if(!d) {
      return this
    }
    var i = !f && !j;
    typeof f === "object" && (j = this);
    b && ((d = {})[b._listenerId] = b);
    for(var g in d) {
      d[g].off(f, j, this), i && delete this._listeners[g]
    }
    return this
  }}, Y = /\s+/, J = function(b, f, j, d) {
    if(!j) {
      return!0
    }
    if(typeof j === "object") {
      for(var i in j) {
        b[f].apply(b, [i, j[i]].concat(d))
      }
      return!1
    }
    if(Y.test(j)) {
      j = j.split(Y);
      i = 0;
      for(var g = j.length;i < g;i++) {
        b[f].apply(b, [j[i]].concat(d))
      }
      return!1
    }
    return!0
  }, W = function(b, f) {
    var j, d = -1, i = b.length, g = f[0], l = f[1], m = f[2];
    switch(f.length) {
      case 0:
        for(;++d < i;) {
          (j = b[d]).callback.call(j.ctx)
        }
        break;
      case 1:
        for(;++d < i;) {
          (j = b[d]).callback.call(j.ctx, g)
        }
        break;
      case 2:
        for(;++d < i;) {
          (j = b[d]).callback.call(j.ctx, g, l)
        }
        break;
      case 3:
        for(;++d < i;) {
          (j = b[d]).callback.call(j.ctx, g, l, m)
        }
        break;
      default:
        for(;++d < i;) {
          (j = b[d]).callback.apply(j.ctx, f)
        }
    }
  };
  m.each({listenTo:"on", listenToOnce:"once"}, function(b, f) {
    x[f] = function(f, d, i) {
      var g = this._listeners || (this._listeners = {}), l = f._listenerId || (f._listenerId = m.uniqueId("l"));
      g[l] = f;
      typeof d === "object" && (i = this);
      f[b](d, i, this);
      return this
    }
  });
  x.bind = x.on;
  x.unbind = x.off;
  m.extend(r, x);
  var B = r.Model = function(b, f) {
    var j, d = b || {};
    f || (f = {});
    this.cid = m.uniqueId("c");
    this.attributes = {};
    m.extend(this, m.pick(f, Z));
    f.parse && (d = this.parse(d, f) || {});
    if(j = m.result(this, "defaults")) {
      d = m.defaults({}, d, j)
    }
    this.set(d, f);
    this.changed = {};
    this.initialize.apply(this, arguments)
  }, Z = ["url", "urlRoot", "collection"];
  m.extend(B.prototype, x, {changed:null, validationError:null, idAttribute:"id", initialize:function() {
  }, toJSON:function() {
    return m.clone(this.attributes)
  }, sync:function() {
    return r.sync.apply(this, arguments)
  }, get:function(b) {
    return this.attributes[b]
  }, escape:function(b) {
    return m.escape(this.get(b))
  }, has:function(b) {
    return this.get(b) != null
  }, set:function(b, f, j) {
    var d, i, g, l, o, q, n;
    if(b == null) {
      return this
    }
    typeof b === "object" ? (i = b, j = f) : (i = {})[b] = f;
    j || (j = {});
    if(!this._validate(i, j)) {
      return!1
    }
    g = j.unset;
    l = j.silent;
    b = [];
    o = this._changing;
    this._changing = !0;
    if(!o) {
      this._previousAttributes = m.clone(this.attributes), this.changed = {}
    }
    n = this.attributes;
    q = this._previousAttributes;
    if(this.idAttribute in i) {
      this.id = i[this.idAttribute]
    }
    for(d in i) {
      f = i[d], m.isEqual(n[d], f) || b.push(d), m.isEqual(q[d], f) ? delete this.changed[d] : this.changed[d] = f, g ? delete n[d] : n[d] = f
    }
    if(!l) {
      if(b.length) {
        this._pending = !0
      }
      f = 0;
      for(d = b.length;f < d;f++) {
        this.trigger("change:" + b[f], this, n[b[f]], j)
      }
    }
    if(o) {
      return this
    }
    if(!l) {
      for(;this._pending;) {
        this._pending = !1, this.trigger("change", this, j)
      }
    }
    this._changing = this._pending = !1;
    return this
  }, unset:function(b, f) {
    return this.set(b, void 0, m.extend({}, f, {unset:!0}))
  }, clear:function(b) {
    var f = {}, j;
    for(j in this.attributes) {
      f[j] = void 0
    }
    return this.set(f, m.extend({}, b, {unset:!0}))
  }, hasChanged:function(b) {
    return b == null ? !m.isEmpty(this.changed) : m.has(this.changed, b)
  }, changedAttributes:function(b) {
    if(!b) {
      return this.hasChanged() ? m.clone(this.changed) : !1
    }
    var f, j = !1, d = this._changing ? this._previousAttributes : this.attributes, i;
    for(i in b) {
      if(!m.isEqual(d[i], f = b[i])) {
        (j || (j = {}))[i] = f
      }
    }
    return j
  }, previous:function(b) {
    return b == null || !this._previousAttributes ? null : this._previousAttributes[b]
  }, previousAttributes:function() {
    return m.clone(this._previousAttributes)
  }, fetch:function(b) {
    b = b ? m.clone(b) : {};
    if(b.parse === void 0) {
      b.parse = !0
    }
    var f = this, j = b.success;
    b.success = function(d) {
      if(!f.set(f.parse(d, b), b)) {
        return!1
      }
      j && j(f, d, b);
      f.trigger("sync", f, d, b)
    };
    M(this, b);
    return this.sync("read", this, b)
  }, save:function(b, f, j) {
    var d, i = this.attributes;
    b == null || typeof b === "object" ? (d = b, j = f) : (d = {})[b] = f;
    if(d && (!j || !j.wait) && !this.set(d, j)) {
      return!1
    }
    j = m.extend({validate:!0}, j);
    if(!this._validate(d, j)) {
      return!1
    }
    if(d && j.wait) {
      this.attributes = m.extend({}, i, d)
    }
    if(j.parse === void 0) {
      j.parse = !0
    }
    var g = this, l = j.success;
    j.success = function(b) {
      g.attributes = i;
      var e = g.parse(b, j);
      j.wait && (e = m.extend(d || {}, e));
      if(m.isObject(e) && !g.set(e, j)) {
        return!1
      }
      l && l(g, b, j);
      g.trigger("sync", g, b, j)
    };
    M(this, j);
    b = this.isNew() ? "create" : j.patch ? "patch" : "update";
    if(b === "patch") {
      j.attrs = d
    }
    b = this.sync(b, this, j);
    if(d && j.wait) {
      this.attributes = i
    }
    return b
  }, destroy:function(b) {
    var b = b ? m.clone(b) : {}, f = this, j = b.success, d = function() {
      f.trigger("destroy", f, f.collection, b)
    };
    b.success = function(g) {
      (b.wait || f.isNew()) && d();
      j && j(f, g, b);
      f.isNew() || f.trigger("sync", f, g, b)
    };
    if(this.isNew()) {
      return b.success(), !1
    }
    M(this, b);
    var i = this.sync("delete", this, b);
    b.wait || d();
    return i
  }, url:function() {
    var b = m.result(this, "urlRoot") || m.result(this.collection, "url") || X();
    return this.isNew() ? b : b + (b.charAt(b.length - 1) === "/" ? "" : "/") + encodeURIComponent(this.id)
  }, parse:function(b) {
    return b
  }, clone:function() {
    return new this.constructor(this.attributes)
  }, isNew:function() {
    return this.id == null
  }, isValid:function(b) {
    return this._validate({}, m.extend(b || {}, {validate:!0}))
  }, _validate:function(b, f) {
    if(!f.validate || !this.validate) {
      return!0
    }
    var b = m.extend({}, this.attributes, b), j = this.validationError = this.validate(b, f) || null;
    if(!j) {
      return!0
    }
    this.trigger("invalid", this, j, m.extend(f || {}, {validationError:j}));
    return!1
  }});
  m.each("keys,values,pairs,invert,pick,omit".split(","), function(b) {
    B.prototype[b] = function() {
      var f = v.call(arguments);
      f.unshift(this.attributes);
      return m[b].apply(m, f)
    }
  });
  var R = r.Collection = function(b, f) {
    f || (f = {});
    if(f.url) {
      this.url = f.url
    }
    if(f.model) {
      this.model = f.model
    }
    if(f.comparator !== void 0) {
      this.comparator = f.comparator
    }
    this._reset();
    this.initialize.apply(this, arguments);
    b && this.reset(b, m.extend({silent:!0}, f))
  }, $ = {add:!0, remove:!0, merge:!0}, ba = {add:!0, merge:!1, remove:!1};
  m.extend(R.prototype, x, {model:B, initialize:function() {
  }, toJSON:function(b) {
    return this.map(function(f) {
      return f.toJSON(b)
    })
  }, sync:function() {
    return r.sync.apply(this, arguments)
  }, add:function(b, f) {
    return this.set(b, m.defaults(f || {}, ba))
  }, remove:function(b, f) {
    b = m.isArray(b) ? b.slice() : [b];
    f || (f = {});
    var j, d, i, g;
    for(j = 0, d = b.length;j < d;j++) {
      if(g = this.get(b[j])) {
        delete this._byId[g.id];
        delete this._byId[g.cid];
        i = this.indexOf(g);
        this.models.splice(i, 1);
        this.length--;
        if(!f.silent) {
          f.index = i, g.trigger("remove", g, this, f)
        }
        this._removeReference(g)
      }
    }
    return this
  }, set:function(b, f) {
    f = m.defaults(f || {}, $);
    f.parse && (b = this.parse(b, f));
    m.isArray(b) || (b = b ? [b] : []);
    var j, d, i, g, l, o = f.at, n = this.comparator && o == null && f.sort !== !1, p = m.isString(this.comparator) ? this.comparator : null, r = [], s = [], v = {};
    for(j = 0, d = b.length;j < d;j++) {
      if(i = this._prepareModel(b[j], f)) {
        (g = this.get(i)) ? (f.remove && (v[g.cid] = !0), f.merge && (g.set(i.attributes, f), n && !l && g.hasChanged(p) && (l = !0))) : f.add && (r.push(i), i.on("all", this._onModelEvent, this), this._byId[i.cid] = i, i.id != null && (this._byId[i.id] = i))
      }
    }
    if(f.remove) {
      for(j = 0, d = this.length;j < d;++j) {
        v[(i = this.models[j]).cid] || s.push(i)
      }
      s.length && this.remove(s, f)
    }
    r.length && (n && (l = !0), this.length += r.length, o != null ? O.apply(this.models, [o, 0].concat(r)) : H.apply(this.models, r));
    l && this.sort({silent:!0});
    if(f.silent) {
      return this
    }
    for(j = 0, d = r.length;j < d;j++) {
      (i = r[j]).trigger("add", i, this, f)
    }
    l && this.trigger("sort", this, f);
    return this
  }, reset:function(b, f) {
    f || (f = {});
    for(var j = 0, d = this.models.length;j < d;j++) {
      this._removeReference(this.models[j])
    }
    f.previousModels = this.models;
    this._reset();
    this.add(b, m.extend({silent:!0}, f));
    f.silent || this.trigger("reset", this, f);
    return this
  }, push:function(b, f) {
    b = this._prepareModel(b, f);
    this.add(b, m.extend({at:this.length}, f));
    return b
  }, pop:function(b) {
    var f = this.at(this.length - 1);
    this.remove(f, b);
    return f
  }, unshift:function(b, f) {
    b = this._prepareModel(b, f);
    this.add(b, m.extend({at:0}, f));
    return b
  }, shift:function(b) {
    var f = this.at(0);
    this.remove(f, b);
    return f
  }, slice:function(b, f) {
    return this.models.slice(b, f)
  }, get:function(b) {
    return b == null ? void 0 : this._byId[b.id != null ? b.id : b.cid || b]
  }, at:function(b) {
    return this.models[b]
  }, where:function(b, f) {
    return m.isEmpty(b) ? f ? void 0 : [] : this[f ? "find" : "filter"](function(f) {
      for(var d in b) {
        if(b[d] !== f.get(d)) {
          return!1
        }
      }
      return!0
    })
  }, findWhere:function(b) {
    return this.where(b, !0)
  }, sort:function(b) {
    if(!this.comparator) {
      throw Error("Cannot sort a set without a comparator");
    }
    b || (b = {});
    m.isString(this.comparator) || this.comparator.length === 1 ? this.models = this.sortBy(this.comparator, this) : this.models.sort(m.bind(this.comparator, this));
    b.silent || this.trigger("sort", this, b);
    return this
  }, sortedIndex:function(b, f, j) {
    f || (f = this.comparator);
    var d = m.isFunction(f) ? f : function(b) {
      return b.get(f)
    };
    return m.sortedIndex(this.models, b, d, j)
  }, pluck:function(b) {
    return m.invoke(this.models, "get", b)
  }, fetch:function(b) {
    b = b ? m.clone(b) : {};
    if(b.parse === void 0) {
      b.parse = !0
    }
    var f = b.success, j = this;
    b.success = function(d) {
      j[b.reset ? "reset" : "set"](d, b);
      f && f(j, d, b);
      j.trigger("sync", j, d, b)
    };
    M(this, b);
    return this.sync("read", this, b)
  }, create:function(b, f) {
    f = f ? m.clone(f) : {};
    if(!(b = this._prepareModel(b, f))) {
      return!1
    }
    f.wait || this.add(b, f);
    var j = this, d = f.success;
    f.success = function(i) {
      f.wait && j.add(b, f);
      d && d(b, i, f)
    };
    b.save(null, f);
    return b
  }, parse:function(b) {
    return b
  }, clone:function() {
    return new this.constructor(this.models)
  }, _reset:function() {
    this.length = 0;
    this.models = [];
    this._byId = {}
  }, _prepareModel:function(b, f) {
    if(b instanceof B) {
      if(!b.collection) {
        b.collection = this
      }
      return b
    }
    f || (f = {});
    f.collection = this;
    var j = new this.model(b, f);
    return!j._validate(b, f) ? (this.trigger("invalid", this, b, f), !1) : j
  }, _removeReference:function(b) {
    this === b.collection && delete b.collection;
    b.off("all", this._onModelEvent, this)
  }, _onModelEvent:function(b, f, j, d) {
    (b === "add" || b === "remove") && j !== this || (b === "destroy" && this.remove(f, d), f && b === "change:" + f.idAttribute && (delete this._byId[f.previous(f.idAttribute)], f.id != null && (this._byId[f.id] = f)), this.trigger.apply(this, arguments))
  }});
  m.each("forEach,each,map,collect,reduce,foldl,inject,reduceRight,foldr,find,detect,filter,select,reject,every,all,some,any,include,contains,invoke,max,min,toArray,size,first,head,take,initial,rest,tail,drop,last,without,indexOf,shuffle,lastIndexOf,isEmpty,chain".split(","), function(b) {
    R.prototype[b] = function() {
      var f = v.call(arguments);
      f.unshift(this.models);
      return m[b].apply(m, f)
    }
  });
  m.each(["groupBy", "countBy", "sortBy"], function(b) {
    R.prototype[b] = function(f, j) {
      var d = m.isFunction(f) ? f : function(b) {
        return b.get(f)
      };
      return m[b](this.models, d, j)
    }
  });
  var E = r.View = function(b) {
    this.cid = m.uniqueId("view");
    this._configure(b || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents()
  }, S = /^(\S+)\s*(.*)$/, ca = "model,collection,el,id,attributes,className,tagName,events".split(",");
  m.extend(E.prototype, x, {tagName:"div", $:function(b) {
    return this.$el.find(b)
  }, initialize:function() {
  }, render:function() {
    return this
  }, remove:function() {
    this.$el.remove();
    this.stopListening();
    return this
  }, setElement:function(b, f) {
    this.$el && this.undelegateEvents();
    this.$el = b instanceof r.$ ? b : r.$(b);
    this.el = this.$el[0];
    f !== !1 && this.delegateEvents();
    return this
  }, delegateEvents:function(b) {
    if(!b && !(b = m.result(this, "events"))) {
      return this
    }
    this.undelegateEvents();
    for(var f in b) {
      var j = b[f];
      m.isFunction(j) || (j = this[b[f]]);
      if(j) {
        var d = f.match(S), i = d[1], d = d[2], j = m.bind(j, this);
        i += ".delegateEvents" + this.cid;
        if(d === "") {
          this.$el.on(i, j)
        }else {
          this.$el.on(i, d, j)
        }
      }
    }
    return this
  }, undelegateEvents:function() {
    this.$el.unbind(".delegateEvents" + this.cid);
    return this
  }, _configure:function(b) {
    this.options && (b = m.extend({}, m.result(this, "options"), b));
    m.extend(this, m.pick(b, ca));
    this.options = b
  }, _ensureElement:function() {
    if(this.el) {
      this.setElement(m.result(this, "el"), !1)
    }else {
      var b = m.extend({}, m.result(this, "attributes"));
      if(this.id) {
        b.id = m.result(this, "id")
      }
      this.className && (b["class"] = m.result(this, "className"));
      this.setElement(r.$("<" + m.result(this, "tagName") + ">").attr(b), !1)
    }
  }});
  r.sync = function(b, f, j) {
    var d = da[b];
    m.defaults(j || (j = {}), {emulateHTTP:r.emulateHTTP, emulateJSON:r.emulateJSON});
    var i = {type:d, dataType:"json"};
    if(!j.url) {
      i.url = m.result(f, "url") || X()
    }
    if(j.data == null && f && (b === "create" || b === "update" || b === "patch")) {
      i.contentType = "application/json", i.data = JSON.stringify(j.attrs || f.toJSON(j))
    }
    if(j.emulateJSON) {
      i.contentType = "application/x-www-form-urlencoded", i.data = i.data ? {model:i.data} : {}
    }
    if(j.emulateHTTP && (d === "PUT" || d === "DELETE" || d === "PATCH")) {
      i.type = "POST";
      if(j.emulateJSON) {
        i.data._method = d
      }
      var g = j.beforeSend;
      j.beforeSend = function(b) {
        b.setRequestHeader("X-HTTP-Method-Override", d);
        if(g) {
          return g.apply(this, arguments)
        }
      }
    }
    if(i.type !== "GET" && !j.emulateJSON) {
      i.processData = !1
    }
    if(i.type === "PATCH" && window.ActiveXObject && (!window.external || !window.external.msActiveXFilteringEnabled)) {
      i.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP")
      }
    }
    b = j.xhr = r.ajax(m.extend(i, j));
    f.trigger("request", f, b, j);
    return b
  };
  var da = {create:"POST", update:"PUT", patch:"PATCH", "delete":"DELETE", read:"GET"};
  r.ajax = function() {
    return r.$.ajax.apply(r.$, arguments)
  };
  var T = r.Router = function(b) {
    b || (b = {});
    if(b.routes) {
      this.routes = b.routes
    }
    this._bindRoutes();
    this.initialize.apply(this, arguments)
  }, l = /\((.*?)\)/g, z = /(\(\?)?:\w+/g, P = /\*\w+/g, ea = /[\-{}\[\]+?.,\\\^$|#\s]/g;
  m.extend(T.prototype, x, {initialize:function() {
  }, route:function(b, f, j) {
    m.isRegExp(b) || (b = this._routeToRegExp(b));
    m.isFunction(f) && (j = f, f = "");
    j || (j = this[f]);
    var d = this;
    r.history.route(b, function(i) {
      i = d._extractParameters(b, i);
      j && j.apply(d, i);
      d.trigger.apply(d, ["route:" + f].concat(i));
      d.trigger("route", f, i);
      r.history.trigger("route", d, f, i)
    });
    return this
  }, navigate:function(b, f) {
    r.history.navigate(b, f);
    return this
  }, _bindRoutes:function() {
    if(this.routes) {
      this.routes = m.result(this, "routes");
      for(var b, f = m.keys(this.routes);(b = f.pop()) != null;) {
        this.route(b, this.routes[b])
      }
    }
  }, _routeToRegExp:function(b) {
    b = b.replace(ea, "\\$&").replace(l, "(?:$1)?").replace(z, function(b, e) {
      return e ? b : "([^/]+)"
    }).replace(P, "(.*?)");
    return RegExp("^" + b + "$")
  }, _extractParameters:function(b, f) {
    var j = b.exec(f).slice(1);
    return m.map(j, function(b) {
      return b ? decodeURIComponent(b) : null
    })
  }});
  var K = r.History = function() {
    this.handlers = [];
    m.bindAll(this, "checkUrl");
    if(typeof window !== "undefined") {
      this.location = window.location, this.history = window.history
    }
  }, n = /^[#\/]|\s+$/g, U = /^\/+|\/+$/g, fa = /msie [\w.]+/, b = /\/$/;
  K.started = !1;
  m.extend(K.prototype, x, {interval:50, getHash:function(b) {
    return(b = (b || this).location.href.match(/#(.*)$/)) ? b[1] : ""
  }, getFragment:function(e, f) {
    if(e == null) {
      if(this._hasPushState || !this._wantsHashChange || f) {
        var e = this.location.pathname, j = this.root.replace(b, "");
        e.indexOf(j) || (e = e.substr(j.length))
      }else {
        e = this.getHash()
      }
    }
    return e.replace(n, "")
  }, start:function(b) {
    function f() {
      if(this._hasPushState) {
        r.$(window).on("popstate", this.checkUrl)
      }else {
        if(this._wantsHashChange && "onhashchange" in window && !d) {
          r.$(window).on("hashchange", this.checkUrl)
        }else {
          if(this._wantsHashChange) {
            this._checkUrlInterval = setInterval(this.checkUrl, this.interval)
          }
        }
      }
      this.fragment = j;
      var b = this.location, e = b.pathname.replace(/[^\/]$/, "$&/") === this.root;
      if(this._wantsHashChange && this._wantsPushState && !this._hasPushState && !e) {
        return this.fragment = this.getFragment(null, !0), this.location.replace(this.root + this.location.search + "#" + this.fragment), !0
      }else {
        if(this._wantsPushState && this._hasPushState && e && b.hash) {
          this.fragment = this.getHash().replace(n, ""), this.history.replaceState({}, document.title, this.root + this.fragment + b.search)
        }
      }
      if(!i.options.silent) {
        return i.loadUrl()
      }
    }
    if(K.started) {
      throw Error("Backbone.history has already been started");
    }
    K.started = !0;
    this.options = m.extend({}, {root:"/"}, this.options, b);
    this.root = this.options.root;
    this._wantsHashChange = this.options.hashChange !== !1;
    this._wantsPushState = !!this.options.pushState;
    this._hasPushState = !(!this.options.pushState || !this.history || !this.history.pushState);
    var j = this.getFragment(), b = document.documentMode, d = fa.exec(navigator.userAgent.toLowerCase()) && (!b || b <= 7);
    this.root = ("/" + this.root + "/").replace(U, "/");
    var i = this;
    if(d && this._wantsHashChange) {
      if(i.options.iframesrc) {
        var g = r.$('<iframe src="' + i.options.iframesrc + '" tabindex="-1" />').hide().appendTo("body")[0], l = setInterval(function() {
          try {
            var b = g.contentWindow, e = b.document;
            if(Boolean(e.readyState && e.readyState == "complete" && document.domain == e.domain && b.location.href.indexOf("http") > -1)) {
              clearInterval(l), i.iframe = g.contentWindow, f()
            }
          }catch(d) {
          }
        }, this.interval);
        return
      }
      this.iframe = r.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow;
      this.navigate(j)
    }
    f()
  }, stop:function() {
    r.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl);
    clearInterval(this._checkUrlInterval);
    K.started = !1
  }, route:function(b, f) {
    this.handlers.unshift({route:b, callback:f})
  }, checkUrl:function() {
    var b = this.getFragment();
    b === this.fragment && this.iframe && (b = this.getFragment(this.getHash(this.iframe)));
    if(b === this.fragment) {
      return!1
    }
    this.iframe && this.navigate(b);
    this.loadUrl() || this.loadUrl(this.getHash())
  }, loadUrl:function(b) {
    var f = this.fragment = this.getFragment(b);
    return m.any(this.handlers, function(b) {
      if(b.route.test(f)) {
        return b.callback(f), !0
      }
    })
  }, navigate:function(b, f) {
    if(!K.started) {
      return!1
    }
    if(!f || f === !0) {
      f = {trigger:f}
    }
    b = this.getFragment(b || "");
    if(this.fragment !== b) {
      this.fragment = b;
      var j = this.root + b;
      if(this._hasPushState) {
        this.history[f.replace ? "replaceState" : "pushState"]({}, document.title, j)
      }else {
        if(this._wantsHashChange) {
          this._updateHash(this.location, b, f.replace), this.iframe && b !== this.getFragment(this.getHash(this.iframe)) && (f.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, b, f.replace))
        }else {
          return this.location.assign(j)
        }
      }
      f.trigger && this.loadUrl(b)
    }
  }, _updateHash:function(b, f, j) {
    j ? (j = b.href.replace(/(javascript:|#).*$/, ""), b.replace(j + "#" + f)) : b.hash = "#" + f
  }});
  r.history = new K;
  B.extend = R.extend = T.extend = E.extend = K.extend = function(b, f) {
    var j = this, d;
    d = b && m.has(b, "constructor") ? b.constructor : function() {
      return j.apply(this, arguments)
    };
    m.extend(d, j, f);
    var i = function() {
      this.constructor = d
    };
    i.prototype = j.prototype;
    d.prototype = new i;
    b && m.extend(d.prototype, b);
    d.__super__ = j.prototype;
    return d
  };
  var X = function() {
    throw Error('A "url" property or function must be specified');
  }, M = function(b, f) {
    var j = f.error;
    f.error = function(d) {
      j && j(b, d, f);
      b.trigger("error", b, d, f)
    }
  }
}).call(this);

