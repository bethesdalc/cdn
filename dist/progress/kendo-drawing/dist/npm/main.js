'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ObserversMixin = {
    extend: function(proto) {
        var this$1 = this;

        for (var method in this) {
            if (method !== "extend") {
                proto[method] = this$1[method];
            }
        }
    },

    observers: function() {
        this._observers = this._observers || [];
        return this._observers;
    },

    addObserver: function(element) {
        if (!this._observers) {
            this._observers = [ element ];
        } else {
            this._observers.push(element);
        }
        return this;
    },

    removeObserver: function(element) {
        var observers = this.observers();
        var index = observers.indexOf(element);
        if (index !== -1) {
            observers.splice(index, 1);
        }
        return this;
    },

    trigger: function(methodName, event) {
        var observers = this._observers;

        if (observers && !this._suspended) {
            for (var idx = 0; idx < observers.length; idx++) {
                var observer = observers[idx];
                if (observer[methodName]) {
                    observer[methodName](event);
                }
            }
        }
        return this;
    },

    optionsChange: function(e) {
        if ( e === void 0 ) e = {};

        e.element = this;
        this.trigger("optionsChange", e);
    },

    geometryChange: function() {
        this.trigger("geometryChange", {
            element: this
        });
    },

    suspend: function() {
        this._suspended = (this._suspended || 0) + 1;
        return this;
    },

    resume: function() {
        this._suspended = Math.max((this._suspended || 0) - 1, 0);
        return this;
    },

    _observerField: function(field, value) {
        if (this[field]) {
            this[field].removeObserver(this);
        }
        this[field] = value;
        value.addObserver(this);
    }
};

var wnd = typeof window !== "undefined" ? window : {};

var animationFrame = wnd.requestAnimationFrame ||
                    wnd.webkitRequestAnimationFrame ||
                    wnd.mozRequestAnimationFrame ||
                    wnd.oRequestAnimationFrame ||
                    wnd.msRequestAnimationFrame ||
                    function(callback) { setTimeout(callback, 1000 / 60); };

function animationFrameProxy(callback) {
    animationFrame.call(wnd, callback);
}

var Class = function Class () {};

var ampRegExp = /&/g;
var ltRegExp = /</g;
var quoteRegExp = /"/g;
var aposRegExp = /'/g;
var gtRegExp = />/g;

function htmlEncode(value) {
    return String(value).replace(ampRegExp, "&amp;").replace(ltRegExp, "&lt;").replace(gtRegExp, "&gt;").replace(quoteRegExp, "&quot;").replace(aposRegExp, "&#39;");
}

/* eslint-disable no-console */

function logToConsole(message) {
    var console = window.console;

    if (typeof(console) != "undefined" && console.log) {
        console.log(message);
    }
}

var Observable = (function (Class$$1) {
    function Observable() {
        Class$$1.call(this);

        this._events = {};
    }

    if ( Class$$1 ) Observable.__proto__ = Class$$1;
    Observable.prototype = Object.create( Class$$1 && Class$$1.prototype );
    Observable.prototype.constructor = Observable;

    Observable.prototype.bind = function bind (eventName, handlers, one) {
        var arguments$1 = arguments;
        var this$1 = this;

        var eventNames = getArray(eventName);
        var handlersIsFunction = isFunction(handlers);
        var length = eventNames.length;

        if (handlers === undefined) {
            for (var field in eventName) {
                this$1.bind(field, eventName[field]);
            }
            return this;
        }

        var loop = function ( idx ) {
            var eventName$1 = eventNames[idx];

            var handler = handlersIsFunction ? handlers : handlers[eventName$1];

            if (handler) {
                if (one) {
                    var original = handler;
                    handler = function () { // eslint-disable-line no-loop-func
                        this$1.unbind(eventName$1, handler);
                        original.apply(this$1, arguments$1);
                    };
                    handler.original = original;
                }
                var events = this$1._events[eventName$1] = this$1._events[eventName$1] || [];
                events.push(handler);
            }
        };

        for (var idx = 0; idx < length; idx++) loop( idx );

        return this;
    };

    Observable.prototype.one = function one (eventNames, handlers) {
        return this.bind(eventNames, handlers, true);
    };

    Observable.prototype.first = function first (eventName, handlers) {
        var this$1 = this;

        var eventNames = getArray(eventName);
        var handlersIsFunction = isFunction(handlers);

        for (var idx = 0, length = eventNames.length; idx < length; idx++) {
            var eventName$1 = eventNames[idx];

            var handler = handlersIsFunction ? handlers : handlers[eventName$1];

            if (handler) {
                var events = this$1._events[eventName$1] = this$1._events[eventName$1] || [];
                events.unshift(handler);
            }
        }

        return this;
    };

    Observable.prototype.trigger = function trigger (eventName, e) {
        var this$1 = this;
        if ( e === void 0 ) e = {};

        var events = this._events[eventName];

        if (events) {
            var length = events.length;

            e.sender = this;
            e._defaultPrevented = false;
            e.preventDefault = preventDefault;
            e.isDefaultPrevented = isDefaultPrevented;

            events = events.slice();

            for (var idx = 0; idx < length; idx++) {
                events[idx].call(this$1, e);
            }

            return e._defaultPrevented === true;
        }

        return false;
    };

    Observable.prototype.unbind = function unbind (eventName, handler) {
        var events = this._events[eventName];

        if (eventName === undefined) {
            this._events = {};
        } else if (events) {
            if (handler) {
                for (var idx = events.length - 1; idx >= 0; idx--) {
                    if (events[idx] === handler || events[idx].original === handler) {
                        events.splice(idx, 1);
                    }
                }
            } else {
                this._events[eventName] = [];
            }
        }

        return this;
    };

    return Observable;
}(Class));

function isFunction(value) {
    return typeof value === "function";
}

function getArray(value) {
    return typeof value === "string" ? [ value ] : value;
}

function preventDefault() {
    this._defaultPrevented = true;
}

function isDefaultPrevented() {
    return this._defaultPrevented === true;
}

// XXX: the following will not work with IE9 (requires server proxy).
function saveAs(options) {
    var dataURI = options.dataURI;
    var fileName = options.fileName;
    var data = dataURI;

    if (typeof data == "string" && window.Blob) {
        var parts = data.split(";base64,");
        var contentType = parts[0];
        var base64 = atob(parts[1]);
        var array = new Uint8Array(base64.length);
        for (var idx = 0; idx < base64.length; idx++) {
            array[idx] = base64.charCodeAt(idx);
        }
        data = new Blob([ array.buffer ], { type: contentType });
    }
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(data, fileName);
    } else {
        var link = document.createElement("a");
        link.download = fileName;
        data = link.href = URL.createObjectURL(data);
        var e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, false, window,
                         0, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(e);
        setTimeout(function() {
            URL.revokeObjectURL(data);
        });
    }
}

var support = {};

if (typeof window !== 'undefined') {
    support.browser = (function(userAgent) {
        var browserRxs = {
            edge: /(edge)[ \/]([\w.]+)/i,
            webkit: /(chrome)[ \/]([\w.]+)/i,
            safari: /(webkit)[ \/]([\w.]+)/i,
            opera: /(opera)(?:.*version|)[ \/]([\w.]+)/i,
            msie: /(msie\s|trident.*? rv:)([\w.]+)/i,
            mozilla: /(mozilla)(?:.*? rv:([\w.]+)|)/i
        };

        var browser;

        for (var agent in browserRxs) {
            if (browserRxs.hasOwnProperty(agent)) {
                var match = userAgent.match(browserRxs[agent]);
                if (match) {
                    browser = {};
                    browser[agent] = true;
                    browser[match[1].toLowerCase().split(" ")[0].split("/")[0]] = true;
                    browser.version = parseInt(document.documentMode || match[2], 10);

                    break;
                }
            }
        }

        return browser;

    })(window.navigator.userAgent);
}

function template$1() {
    // XXX: no template engine for now
    throw new Error("String template not yet supported.  Pass a function and use your preferred template engine.");
}

function now() {
    return new Date().getTime();
}

function throttle(fn, delay) {
    var lastExecTime = 0;
    var timeout;

    if (!delay || delay <= 0) {
        return fn;
    }

    var throttled = function() {
        var elapsed = now() - lastExecTime;
        var args = arguments;

        var exec = function() {
            fn.apply(null, args);
            lastExecTime = now();
        };

        // first execution
        if (!lastExecTime) {
            return exec();
        }

        if (timeout) {
            clearTimeout(timeout);
        }

        if (elapsed > delay) {
            exec();
        } else {
            timeout = setTimeout(exec, delay - elapsed);
        }
    };

    throttled.cancel = function() {
        clearTimeout(timeout);
    };

    return throttled;
}

var namedColors = {
    aliceblue: "f0f8ff", antiquewhite: "faebd7", aqua: "00ffff",
    aquamarine: "7fffd4", azure: "f0ffff", beige: "f5f5dc",
    bisque: "ffe4c4", black: "000000", blanchedalmond: "ffebcd",
    blue: "0000ff", blueviolet: "8a2be2", brown: "a52a2a",
    burlywood: "deb887", cadetblue: "5f9ea0", chartreuse: "7fff00",
    chocolate: "d2691e", coral: "ff7f50", cornflowerblue: "6495ed",
    cornsilk: "fff8dc", crimson: "dc143c", cyan: "00ffff",
    darkblue: "00008b", darkcyan: "008b8b", darkgoldenrod: "b8860b",
    darkgray: "a9a9a9", darkgrey: "a9a9a9", darkgreen: "006400",
    darkkhaki: "bdb76b", darkmagenta: "8b008b", darkolivegreen: "556b2f",
    darkorange: "ff8c00", darkorchid: "9932cc", darkred: "8b0000",
    darksalmon: "e9967a", darkseagreen: "8fbc8f", darkslateblue: "483d8b",
    darkslategray: "2f4f4f", darkslategrey: "2f4f4f", darkturquoise: "00ced1",
    darkviolet: "9400d3", deeppink: "ff1493", deepskyblue: "00bfff",
    dimgray: "696969", dimgrey: "696969", dodgerblue: "1e90ff",
    firebrick: "b22222", floralwhite: "fffaf0", forestgreen: "228b22",
    fuchsia: "ff00ff", gainsboro: "dcdcdc", ghostwhite: "f8f8ff",
    gold: "ffd700", goldenrod: "daa520", gray: "808080",
    grey: "808080", green: "008000", greenyellow: "adff2f",
    honeydew: "f0fff0", hotpink: "ff69b4", indianred: "cd5c5c",
    indigo: "4b0082", ivory: "fffff0", khaki: "f0e68c",
    lavender: "e6e6fa", lavenderblush: "fff0f5", lawngreen: "7cfc00",
    lemonchiffon: "fffacd", lightblue: "add8e6", lightcoral: "f08080",
    lightcyan: "e0ffff", lightgoldenrodyellow: "fafad2", lightgray: "d3d3d3",
    lightgrey: "d3d3d3", lightgreen: "90ee90", lightpink: "ffb6c1",
    lightsalmon: "ffa07a", lightseagreen: "20b2aa", lightskyblue: "87cefa",
    lightslategray: "778899", lightslategrey: "778899", lightsteelblue: "b0c4de",
    lightyellow: "ffffe0", lime: "00ff00", limegreen: "32cd32",
    linen: "faf0e6", magenta: "ff00ff", maroon: "800000",
    mediumaquamarine: "66cdaa", mediumblue: "0000cd", mediumorchid: "ba55d3",
    mediumpurple: "9370d8", mediumseagreen: "3cb371", mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a", mediumturquoise: "48d1cc", mediumvioletred: "c71585",
    midnightblue: "191970", mintcream: "f5fffa", mistyrose: "ffe4e1",
    moccasin: "ffe4b5", navajowhite: "ffdead", navy: "000080",
    oldlace: "fdf5e6", olive: "808000", olivedrab: "6b8e23",
    orange: "ffa500", orangered: "ff4500", orchid: "da70d6",
    palegoldenrod: "eee8aa", palegreen: "98fb98", paleturquoise: "afeeee",
    palevioletred: "d87093", papayawhip: "ffefd5", peachpuff: "ffdab9",
    peru: "cd853f", pink: "ffc0cb", plum: "dda0dd",
    powderblue: "b0e0e6", purple: "800080", red: "ff0000",
    rosybrown: "bc8f8f", royalblue: "4169e1", saddlebrown: "8b4513",
    salmon: "fa8072", sandybrown: "f4a460", seagreen: "2e8b57",
    seashell: "fff5ee", sienna: "a0522d", silver: "c0c0c0",
    skyblue: "87ceeb", slateblue: "6a5acd", slategray: "708090",
    slategrey: "708090", snow: "fffafa", springgreen: "00ff7f",
    steelblue: "4682b4", tan: "d2b48c", teal: "008080",
    thistle: "d8bfd8", tomato: "ff6347", turquoise: "40e0d0",
    violet: "ee82ee", wheat: "f5deb3", white: "ffffff",
    whitesmoke: "f5f5f5", yellow: "ffff00", yellowgreen: "9acd32"
};

var browser = support.browser;

var matchNamedColor = function (color) {
    var colorNames = Object.keys(namedColors);
    colorNames.push("transparent");

    var regexp = new RegExp("^(" + colorNames.join("|") + ")(\\W|$)", "i");
    matchNamedColor = function (color) { return regexp.exec(color); };

    return regexp.exec(color);
};

var BaseColor = (function (Class$$1) {
    function BaseColor() { Class$$1.call(this); }

    if ( Class$$1 ) BaseColor.__proto__ = Class$$1;
    BaseColor.prototype = Object.create( Class$$1 && Class$$1.prototype );
    BaseColor.prototype.constructor = BaseColor;
    BaseColor.prototype.toHSV = function toHSV () { return this; };

    BaseColor.prototype.toRGB = function toRGB () { return this; };

    BaseColor.prototype.toHex = function toHex () { return this.toBytes().toHex(); };

    BaseColor.prototype.toBytes = function toBytes () { return this; };

    BaseColor.prototype.toCss = function toCss () { return "#" + this.toHex(); };

    BaseColor.prototype.toCssRgba = function toCssRgba () {
        var rgb = this.toBytes();
        return ("rgba(" + (rgb.r) + ", " + (rgb.g) + ", " + (rgb.b) + ", " + (parseFloat((Number(this.a)).toFixed(3))) + ")");
    };

    BaseColor.prototype.toDisplay = function toDisplay () {
        if (browser.msie && browser.version < 9) {
            return this.toCss(); // no RGBA support; does it support any opacity in colors?
        }
        return this.toCssRgba();
    };

    BaseColor.prototype.equals = function equals (c) {
        return c === this || c !== null && this.toCssRgba() === parseColor(c).toCssRgba();
    };

    BaseColor.prototype.diff = function diff (other) {
        if (other === null) {
            return NaN;
        }

        var c1 = this.toBytes();
        var c2 = other.toBytes();

        return Math.sqrt(Math.pow((c1.r - c2.r) * 0.30, 2) +
                         Math.pow((c1.g - c2.g) * 0.59, 2) +
                         Math.pow((c1.b - c2.b) * 0.11, 2));
    };

    BaseColor.prototype.clone = function clone () {
        var c = this.toBytes();
        if (c === this) {
            c = new Bytes(c.r, c.g, c.b, c.a);
        }

        return c;
    };

    return BaseColor;
}(Class));

var RGB = (function (BaseColor) {
    function RGB(r, g, b, a) {
        BaseColor.call(this);

        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    if ( BaseColor ) RGB.__proto__ = BaseColor;
    RGB.prototype = Object.create( BaseColor && BaseColor.prototype );
    RGB.prototype.constructor = RGB;

    RGB.prototype.toHSV = function toHSV () {
        var ref = this;
        var r = ref.r;
        var g = ref.g;
        var b = ref.b;
        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);
        var delta = max - min;
        var v = max;
        var h, s;

        if (delta === 0) {
            return new HSV(0, 0, v, this.a);
        }

        if (max !== 0) {
            s = delta / max;
            if (r === max) {
                h = (g - b) / delta;
            } else if (g === max) {
                h = 2 + (b - r) / delta;
            } else {
                h = 4 + (r - g) / delta;
            }

            h *= 60;
            if (h < 0) {
                h += 360;
            }
        } else {
            s = 0;
            h = -1;
        }

        return new HSV(h, s, v, this.a);
    };

    RGB.prototype.toHSL = function toHSL () {
        var ref = this;
        var r = ref.r;
        var g = ref.g;
        var b = ref.b;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
                default: break;
            }

            h *= 60;
            s *= 100;
            l *= 100;
        }

        return new HSL(h, s, l, this.a);
    };

    RGB.prototype.toBytes = function toBytes () {
        return new Bytes(this.r * 255, this.g * 255, this.b * 255, this.a);
    };

    return RGB;
}(BaseColor));

var Bytes = (function (RGB) {
    function Bytes(r, g, b, a) {
        RGB.call(this, Math.round(r), Math.round(g), Math.round(b), a);
    }

    if ( RGB ) Bytes.__proto__ = RGB;
    Bytes.prototype = Object.create( RGB && RGB.prototype );
    Bytes.prototype.constructor = Bytes;

    Bytes.prototype.toRGB = function toRGB () {
        return new RGB(this.r / 255, this.g / 255, this.b / 255, this.a);
    };

    Bytes.prototype.toHSV = function toHSV () {
        return this.toRGB().toHSV();
    };

    Bytes.prototype.toHSL = function toHSL () {
        return this.toRGB().toHSL();
    };

    Bytes.prototype.toHex = function toHex () {
        return hex(this.r, 2) + hex(this.g, 2) + hex(this.b, 2);
    };

    Bytes.prototype.toBytes = function toBytes () {
        return this;
    };

    return Bytes;
}(RGB));

function hex(n, width, pad) {
    if ( pad === void 0 ) pad = "0";

    var result = n.toString(16);
    while (width > result.length) {
        result = pad + result;
    }

    return result;
}

var HSV = (function (BaseColor) {
    function HSV(h, s, v, a) {
        BaseColor.call(this);

        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
    }

    if ( BaseColor ) HSV.__proto__ = BaseColor;
    HSV.prototype = Object.create( BaseColor && BaseColor.prototype );
    HSV.prototype.constructor = HSV;

    HSV.prototype.toRGB = function toRGB () {
        var ref = this;
        var h = ref.h;
        var s = ref.s;
        var v = ref.v;
        var r, g, b;

        if (s === 0) {
            r = g = b = v;
        } else {
            h /= 60;

            var i = Math.floor(h);
            var f = h - i;
            var p = v * (1 - s);
            var q = v * (1 - s * f);
            var t = v * (1 - s * (1 - f));

            switch (i) {
                case 0: r = v; g = t; b = p; break;
                case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break;
                default: r = v; g = p; b = q; break;
            }
        }

        return new RGB(r, g, b, this.a);
    };

    HSV.prototype.toHSL = function toHSL () {
        return this.toRGB().toHSL();
    };

    HSV.prototype.toBytes = function toBytes () {
        return this.toRGB().toBytes();
    };

    return HSV;
}(BaseColor));

var HSL = (function (BaseColor) {
    function HSL(h, s, l, a) {
        BaseColor.call(this);

        this.h = h;
        this.s = s;
        this.l = l;
        this.a = a;
    }

    if ( BaseColor ) HSL.__proto__ = BaseColor;
    HSL.prototype = Object.create( BaseColor && BaseColor.prototype );
    HSL.prototype.constructor = HSL;

    HSL.prototype.toRGB = function toRGB () {
        var ref = this;
        var h = ref.h;
        var s = ref.s;
        var l = ref.l;
        var r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            h /= 360;
            s /= 100;
            l /= 100;

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return new RGB(r, g, b, this.a);
    };

    HSL.prototype.toHSV = function toHSV () {
        return this.toRGB().toHSV();
    };

    HSL.prototype.toBytes = function toBytes () {
        return this.toRGB().toBytes();
    };

    return HSL;
}(BaseColor));

function hue2rgb(p, q, s) {
    var t = s;

    if (t < 0) {
        t += 1;
    }

    if (t > 1) {
        t -= 1;
    }

    if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
    }

    if (t < 1 / 2) {
        return q;
    }

    if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
    }

    return p;
}

function parseColor(value, safe) {
    var m, ret;

    if (value == null || value === "none") {
        return null;
    }

    if (value instanceof BaseColor) {
        return value;
    }

    var color = value.toLowerCase();
    if ((m = matchNamedColor(color))) {
        if (m[1] === "transparent") {
            color = new RGB(1, 1, 1, 0);
        } else {
            color = parseColor(namedColors[m[1]], safe);
        }
        color.match = [ m[1] ];
        return color;
    }
    if ((m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})\b/i.exec(color))) {
        ret = new Bytes(parseInt(m[1], 16),
                        parseInt(m[2], 16),
                        parseInt(m[3], 16), 1);
    } else if ((m = /^#?([0-9a-f])([0-9a-f])([0-9a-f])\b/i.exec(color))) {
        ret = new Bytes(parseInt(m[1] + m[1], 16),
                        parseInt(m[2] + m[2], 16),
                        parseInt(m[3] + m[3], 16), 1);
    } else if ((m = /^rgb\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/.exec(color))) {
        ret = new Bytes(parseInt(m[1], 10),
                        parseInt(m[2], 10),
                        parseInt(m[3], 10), 1);
    } else if ((m = /^rgba\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9.]+)\s*\)/.exec(color))) {
        ret = new Bytes(parseInt(m[1], 10),
                        parseInt(m[2], 10),
                        parseInt(m[3], 10), parseFloat(m[4]));
    } else if ((m = /^rgb\(\s*([0-9]*\.?[0-9]+)%\s*,\s*([0-9]*\.?[0-9]+)%\s*,\s*([0-9]*\.?[0-9]+)%\s*\)/.exec(color))) {
        ret = new RGB(parseFloat(m[1]) / 100,
                      parseFloat(m[2]) / 100,
                      parseFloat(m[3]) / 100, 1);
    } else if ((m = /^rgba\(\s*([0-9]*\.?[0-9]+)%\s*,\s*([0-9]*\.?[0-9]+)%\s*,\s*([0-9]*\.?[0-9]+)%\s*,\s*([0-9.]+)\s*\)/.exec(color))) {
        ret = new RGB(parseFloat(m[1]) / 100,
                      parseFloat(m[2]) / 100,
                      parseFloat(m[3]) / 100, parseFloat(m[4]));
    }

    if (ret) {
        ret.match = m;
    } else if (!safe) {
        throw new Error("Cannot parse color: " + color);
    }

    return ret;
}

var Color = (function (Class$$1) {
    function Color(value) {
        var this$1 = this;

        Class$$1.call(this);

        if (arguments.length === 1) {
            var formats = Color.formats;
            var resolvedColor = this.resolveColor(value);

            for (var idx = 0; idx < formats.length; idx++) {
                var formatRegex = formats[idx].re;
                var processor = formats[idx].process;
                var parts = formatRegex.exec(resolvedColor);

                if (parts) {
                    var channels = processor(parts);
                    this$1.r = channels[0];
                    this$1.g = channels[1];
                    this$1.b = channels[2];
                }
            }
        } else {
            this.r = arguments[0];
            this.g = arguments[1];
            this.b = arguments[2];
        }

        this.r = this.normalizeByte(this.r);
        this.g = this.normalizeByte(this.g);
        this.b = this.normalizeByte(this.b);
    }

    if ( Class$$1 ) Color.__proto__ = Class$$1;
    Color.prototype = Object.create( Class$$1 && Class$$1.prototype );
    Color.prototype.constructor = Color;

    Color.prototype.toHex = function toHex () {
        var pad = this.padDigit;
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);

        return "#" + pad(r) + pad(g) + pad(b);
    };

    Color.prototype.resolveColor = function resolveColor (value) {
        var color = value || "black";

        if (color.charAt(0) === "#") {
            color = color.substr(1, 6);
        }

        color = color.replace(/ /g, "");
        color = color.toLowerCase();
        color = Color.namedColors[color] || color;

        return color;
    };

    Color.prototype.normalizeByte = function normalizeByte (value) {
        if (value < 0 || isNaN(value)) {
            return 0;
        }

        return value > 255 ? 255 : value;
    };

    Color.prototype.padDigit = function padDigit (value) {
        return (value.length === 1) ? "0" + value : value;
    };

    Color.prototype.brightness = function brightness (value) {
        var round = Math.round;

        this.r = round(this.normalizeByte(this.r * value));
        this.g = round(this.normalizeByte(this.g * value));
        this.b = round(this.normalizeByte(this.b * value));

        return this;
    };

    Color.prototype.percBrightness = function percBrightness () {
        return Math.sqrt(0.241 * this.r * this.r + 0.691 * this.g * this.g + 0.068 * this.b * this.b);
    };

    Color.fromBytes = function fromBytes (r, g, b, a) {
        return new Bytes(r, g, b, a != null ? a : 1);
    };

    Color.fromRGB = function fromRGB (r, g, b, a) {
        return new RGB(r, g, b, a != null ? a : 1);
    };

    Color.fromHSV = function fromHSV (h, s, v, a) {
        return new HSV(h, s, v, a != null ? a : 1);
    };

    Color.fromHSL = function fromHSL (h, s, l, a) {
        return new HSL(h, s, l, a != null ? a : 1);
    };

    return Color;
}(Class));

Color.formats = [ {
    re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
    process: function(parts) {
        return [
            parseInt(parts[1], 10), parseInt(parts[2], 10), parseInt(parts[3], 10)
        ];
    }
}, {
    re: /^(\w{2})(\w{2})(\w{2})$/,
    process: function(parts) {
        return [
            parseInt(parts[1], 16), parseInt(parts[2], 16), parseInt(parts[3], 16)
        ];
    }
}, {
    re: /^(\w{1})(\w{1})(\w{1})$/,
    process: function(parts) {
        return [
            parseInt(parts[1] + parts[1], 16),
            parseInt(parts[2] + parts[2], 16),
            parseInt(parts[3] + parts[3], 16)
        ];
    }
} ];

Color.namedColors = namedColors;

function append$1$1(first, second) {
    first.push.apply(first, second);
    return first;
}

/* eslint-disable key-spacing,no-multi-spaces,no-param-reassign */

var literals = {
    1    : "i",       10   : "x",       100  : "c",
    2    : "ii",      20   : "xx",      200  : "cc",
    3    : "iii",     30   : "xxx",     300  : "ccc",
    4    : "iv",      40   : "xl",      400  : "cd",
    5    : "v",       50   : "l",       500  : "d",
    6    : "vi",      60   : "lx",      600  : "dc",
    7    : "vii",     70   : "lxx",     700  : "dcc",
    8    : "viii",    80   : "lxxx",    800  : "dccc",
    9    : "ix",      90   : "xc",      900  : "cm",
    1000 : "m"
};

function arabicToRoman(n) {
    var values = [ 1000,
                   900 , 800, 700, 600, 500, 400, 300, 200, 100,
                   90  , 80 , 70 , 60 , 50 , 40 , 30 , 20 , 10 ,
                   9   , 8  , 7  , 6  , 5  , 4  , 3  , 2  , 1 ];

    var roman = "";
    while (n > 0) {
        if (n < values[0]) {
            values.shift();
        } else {
            roman += literals[values[0]];
            n -= values[0];
        }
    }
    return roman;
}

function createPromise() {
    var resolveFn, rejectFn;
    var promise = new Promise(function (resolve, reject) {
        resolveFn = function (data) {
            promise._state = "resolved";
            resolve(data);
            return promise;
        };
        rejectFn = function (data) {
            promise._state = "rejected";
            reject(data);

            return promise;
        };
    });
    promise._state = "pending";
    promise.resolve = resolveFn;
    promise.reject = rejectFn;
    promise.state = function () { return promise._state; };

    return promise;
}

var UNDEFINED = "undefined";

function defined(value) {
    return typeof value !== UNDEFINED;
}

var defId = 1;

function definitionId() {
    return "kdef" + defId++;
}

var DEG_TO_RAD = Math.PI / 180;
var MAX_NUM = Number.MAX_VALUE;
var MIN_NUM = -Number.MAX_VALUE;

function deg(radians) {
    return radians / DEG_TO_RAD;
}

var KEY_STR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var fromCharCode = String.fromCharCode;

function encodeUTF8(input) {
    var output = "";

    for (var i = 0; i < input.length; i++) {
        var c = input.charCodeAt(i);

        if (c < 0x80) {
            // One byte
            output += fromCharCode(c);
        } else if (c < 0x800) {
            // Two bytes
            output += fromCharCode(0xC0 | (c >>> 6));
            output += fromCharCode(0x80 | (c & 0x3f));
        } else if (c < 0x10000) {
            // Three bytes
            output += fromCharCode(0xE0 | (c >>> 12));
            output += fromCharCode(0x80 | (c >>> 6 & 0x3f));
            output += fromCharCode(0x80 | (c & 0x3f));
        }
    }

    return output;
}

function encodeBase64(input) {
    var output = "";
    var i = 0;

    var utfInput = encodeUTF8(input);

    while (i < utfInput.length) {
        var chr1 = utfInput.charCodeAt(i++);
        var chr2 = utfInput.charCodeAt(i++);
        var chr3 = utfInput.charCodeAt(i++);

        var enc1 = chr1 >> 2;
        var enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        var enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        var enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
            KEY_STR.charAt(enc1) + KEY_STR.charAt(enc2) +
            KEY_STR.charAt(enc3) + KEY_STR.charAt(enc4);
    }

    return output;
}

function eventCoordinates(e) {
    if (defined((e.x || {}).location)) {
        return {
            x: e.x.location,
            y: e.y.location
        };
    }

    return {
        x: e.pageX || e.clientX || 0,
        y: e.pageY || e.clientY || 0
    };
}

function eventElement(e) {
    if ( e === void 0 ) e = {};

    return e.touch ? e.touch.initialTouch : e.target;
}

function isTransparent(color) {
    return color === "" || color === null || color === "none" || color === "transparent" || !defined(color);
}

function last(array) {
    if (array) {
        return array[array.length - 1];
    }
}

function limitValue(value, min, max) {
    return Math.max(Math.min(value, max), min);
}

/* eslint-disable no-multi-spaces, key-spacing, indent, camelcase, space-before-blocks, eqeqeq, brace-style */
/* eslint-disable space-infix-ops, space-before-function-paren, array-bracket-spacing, object-curly-spacing */
/* eslint-disable no-nested-ternary, max-params, default-case, no-else-return, no-empty */
/* eslint-disable no-param-reassign, no-var, block-scoped-var */

// mergeSort is stable.
function mergeSort(a, cmp) {
    if (a.length < 2) {
        return a.slice();
    }
    function merge(a, b) {
        var r = [], ai = 0, bi = 0, i = 0;
        while (ai < a.length && bi < b.length) {
            if (cmp(a[ai], b[bi]) <= 0) {
                r[i++] = a[ai++];
            } else {
                r[i++] = b[bi++];
            }
        }
        if (ai < a.length) {
            r.push.apply(r, a.slice(ai));
        }
        if (bi < b.length) {
            r.push.apply(r, b.slice(bi));
        }
        return r;
    }
    return (function sort(a) {
        if (a.length <= 1) {
            return a;
        }
        var m = Math.floor(a.length / 2);
        var left = a.slice(0, m);
        var right = a.slice(m);
        left = sort(left);
        right = sort(right);
        return merge(left, right);
    })(a);
}

function promiseAll(promises) {
    return Promise.all(promises);
}

function rad(degrees) {
    return degrees * DEG_TO_RAD;
}

function pow(p) {
    if (p) {
        return Math.pow(10, p);
    }

    return 1;
}

function round(value, precision) {
    var power = pow(precision);
    return Math.round(value * power) / power;
}

function valueOrDefault(value, defaultValue) {
    return defined(value) ? value : defaultValue;
}

function bindEvents(element, events) {
    for (var eventName in events) {
        var eventNames = eventName.trim().split(" ");
        for (var idx = 0; idx < eventNames.length; idx++) {
            element.addEventListener(eventNames[idx], events[eventName], false);
        }
    }
}

function elementOffset(element) {
    var box = element.getBoundingClientRect();

    var documentElement = document.documentElement;

    return {
        top: box.top + (window.pageYOffset || documentElement.scrollTop) - (documentElement.clientTop || 0),
        left: box.left + (window.pageXOffset || documentElement.scrollLeft) - (documentElement.clientLeft || 0)
    };
}

function elementStyles(element, styles) {
    var result = {};
    var style = window.getComputedStyle(element);
    var stylesArray = Array.isArray(styles) ? styles : [ styles ];

    for (var idx = 0; idx < stylesArray.length; idx++) {
        var field = stylesArray[idx];
        result[field] = style[field];
    }

    return result;
}

function getPixels(value) {
    if (isNaN(value)) {
        return value;
    }
    return value + "px";
}

function elementSize(element, size) {
    if (size) {
        var width = size.width;
        var height = size.height;

        if (defined(width)) {
            element.style.width = getPixels(width);
        }

        if (defined(height)) {
            element.style.height = getPixels(height);
        }

    } else {
        var size$1 = elementStyles(element, [ 'width', 'height' ]);

        return {
            width: parseInt(size$1.width, 10),
            height: parseInt(size$1.height, 10)
        };
    }
}

function unbindEvents(element, events) {
    if ( events === void 0 ) events = {};

    for (var name in events) {
        var eventNames = name.trim().split(" ");
        for (var idx = 0; idx < eventNames.length; idx++) {
            element.removeEventListener(eventNames[idx], events[name], false);
        }
    }
}

var LRUCache = (function (Class$$1) {
    function LRUCache(size) {
        Class$$1.call(this);

        this._size = size;
        this._length = 0;
        this._map = {};
    }

    if ( Class$$1 ) LRUCache.__proto__ = Class$$1;
    LRUCache.prototype = Object.create( Class$$1 && Class$$1.prototype );
    LRUCache.prototype.constructor = LRUCache;

    LRUCache.prototype.put = function put (key, value) {
        var map = this._map;
        var entry = { key: key, value: value };

        map[key] = entry;

        if (!this._head) {
            this._head = this._tail = entry;
        } else {
            this._tail.newer = entry;
            entry.older = this._tail;
            this._tail = entry;
        }

        if (this._length >= this._size) {
            map[this._head.key] = null;
            this._head = this._head.newer;
            this._head.older = null;
        } else {
            this._length++;
        }
    };

    LRUCache.prototype.get = function get (key) {
        var entry = this._map[key];

        if (entry) {
            if (entry === this._head && entry !== this._tail) {
                this._head = entry.newer;
                this._head.older = null;
            }

            if (entry !== this._tail) {
                if (entry.older) {
                    entry.older.newer = entry.newer;
                    entry.newer.older = entry.older;
                }

                entry.older = this._tail;
                entry.newer = null;

                this._tail.newer = entry;
                this._tail = entry;
            }

            return entry.value;
        }
    };

    return LRUCache;
}(Class));

function objectKey(object) {
    var parts = [];
    for (var key in object) {
        parts.push(key + object[key]);
    }

    return parts.sort().join("");
}

// Computes FNV-1 hash
// See http://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function
function hashKey(str) {
    // 32-bit FNV-1 offset basis
    // See http://isthe.com/chongo/tech/comp/fnv/#FNV-param
    var hash = 0x811C9DC5;

    for (var i = 0; i < str.length; ++i) {
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        hash ^= str.charCodeAt(i);
    }

    return hash >>> 0;
}

function zeroSize() {
    return { width: 0, height: 0, baseline: 0 };
}

var DEFAULT_OPTIONS = {
    baselineMarkerSize: 1
};

var defaultMeasureBox;

if (typeof document !== "undefined") {
    defaultMeasureBox = document.createElement("div");
    defaultMeasureBox.style.cssText = "position: absolute !important; top: -4000px !important; width: auto !important; height: auto !important;" +
              "padding: 0 !important; margin: 0 !important; border: 0 !important;" +
              "line-height: normal !important; visibility: hidden !important; white-space: nowrap!important;";
}

var TextMetrics = (function (Class$$1) {
    function TextMetrics(options) {
        Class$$1.call(this);

        this._cache = new LRUCache(1000);
        this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    }

    if ( Class$$1 ) TextMetrics.__proto__ = Class$$1;
    TextMetrics.prototype = Object.create( Class$$1 && Class$$1.prototype );
    TextMetrics.prototype.constructor = TextMetrics;

    TextMetrics.prototype.measure = function measure (text, style, box) {
        if (!text) {
            return zeroSize();
        }

        var styleKey = objectKey(style);
        var cacheKey = hashKey(text + styleKey);
        var cachedResult = this._cache.get(cacheKey);

        if (cachedResult) {
            return cachedResult;
        }

        var size = zeroSize();
        var measureBox = box || defaultMeasureBox;
        var baselineMarker = this._baselineMarker().cloneNode(false);

        for (var key in style) {
            var value = style[key];
            if (typeof value !== "undefined") {
                measureBox.style[key] = value;
            }
        }

        measureBox.textContent = text;
        measureBox.appendChild(baselineMarker);
        document.body.appendChild(measureBox);

        if (String(text).length) {
            size.width = measureBox.offsetWidth - this.options.baselineMarkerSize;
            size.height = measureBox.offsetHeight;
            size.baseline = baselineMarker.offsetTop + this.options.baselineMarkerSize;
        }

        if (size.width > 0 && size.height > 0) {
            this._cache.put(cacheKey, size);
        }

        measureBox.parentNode.removeChild(measureBox);

        return size;
    };

    TextMetrics.prototype._baselineMarker = function _baselineMarker () {
        var marker = document.createElement("div");
        marker.style.cssText = "display: inline-block; vertical-align: baseline;width: " +
            this.options.baselineMarkerSize + "px; height: " + this.options.baselineMarkerSize + "px;overflow: hidden;";

        return marker;
    };

    return TextMetrics;
}(Class));

TextMetrics.current = new TextMetrics();

function measureText(text, style, measureBox) {
    return TextMetrics.current.measure(text, style, measureBox);
}



var util = Object.freeze({
	append: append$1$1,
	arabicToRoman: arabicToRoman,
	createPromise: createPromise,
	defined: defined,
	definitionId: definitionId,
	deg: deg,
	encodeBase64: encodeBase64,
	eventCoordinates: eventCoordinates,
	eventElement: eventElement,
	isTransparent: isTransparent,
	last: last,
	limitValue: limitValue,
	mergeSort: mergeSort,
	promiseAll: promiseAll,
	rad: rad,
	round: round,
	valueOrDefault: valueOrDefault,
	bindEvents: bindEvents,
	elementOffset: elementOffset,
	elementSize: elementSize,
	elementStyles: elementStyles,
	unbindEvents: unbindEvents,
	DEG_TO_RAD: DEG_TO_RAD,
	MAX_NUM: MAX_NUM,
	MIN_NUM: MIN_NUM,
	LRUCache: LRUCache,
	TextMetrics: TextMetrics,
	measureText: measureText,
	objectKey: objectKey,
	hashKey: hashKey
});

var toString$1 = {}.toString;

var OptionsStore = (function (Class$$1) {
    function OptionsStore(options, prefix) {
        var this$1 = this;
        if ( prefix === void 0 ) prefix = "";

        Class$$1.call(this);

        this.prefix = prefix;

        for (var field in options) {
            var member = options[field];
            member = this$1._wrap(member, field);
            this$1[field] = member;
        }
    }

    if ( Class$$1 ) OptionsStore.__proto__ = Class$$1;
    OptionsStore.prototype = Object.create( Class$$1 && Class$$1.prototype );
    OptionsStore.prototype.constructor = OptionsStore;

    OptionsStore.prototype.get = function get (field) {
        var parts = field.split(".");
        var result = this;

        while (parts.length && result) {
            var part = parts.shift();
            result = result[part];
        }

        return result;
    };

    OptionsStore.prototype.set = function set (field, value) {
        var current = this.get(field);

        if (current !== value) {
            this._set(field, this._wrap(value, field));
            this.optionsChange({
                field: this.prefix + field,
                value: value
            });
        }
    };

    OptionsStore.prototype._set = function _set (field, value) {
        var this$1 = this;

        var composite = field.indexOf(".") >= 0;
        var parentObj = this;
        var fieldName = field;

        if (composite) {
            var parts = fieldName.split(".");
            var prefix = this.prefix;

            while (parts.length > 1) {
                fieldName = parts.shift();
                prefix += fieldName + ".";

                var obj = parentObj[fieldName];

                if (!obj) {
                    obj = new OptionsStore({}, prefix);
                    obj.addObserver(this$1);
                    parentObj[fieldName] = obj;
                }
                parentObj = obj;
            }
            fieldName = parts[0];
        }

        parentObj._clear(fieldName);
        parentObj[fieldName] = value;
    };

    OptionsStore.prototype._clear = function _clear (field) {
        var current = this[field];
        if (current && current.removeObserver) {
            current.removeObserver(this);
        }
    };

    OptionsStore.prototype._wrap = function _wrap (object, field) {
        var type = toString$1.call(object);
        var wrapped = object;

        if (wrapped !== null && defined(wrapped) && type === "[object Object]") {
            if (!(object instanceof OptionsStore) && !(object instanceof Class$$1)) {
                wrapped = new OptionsStore(wrapped, this.prefix + field + ".");
            }

            wrapped.addObserver(this);
        }

        return wrapped;
    };

    return OptionsStore;
}(Class));

ObserversMixin.extend(OptionsStore.prototype);

function setAccessor(field) {
    return function(value) {
        if (this[field] !== value) {
            this[field] = value;
            this.geometryChange();
        }

        return this;
    };
}

function getAccessor(field) {
    return function() {
        return this[field];
    };
}

function defineAccessors(fn, fields) {
    for (var i = 0; i < fields.length; i++) {
        var name = fields[i];
        var capitalized = name.charAt(0).toUpperCase() +
                          name.substring(1, name.length);

        fn["set" + capitalized] = setAccessor(name);
        fn["get" + capitalized] = getAccessor(name);
    }
}

var Matrix = (function (Class$$1) {
    function Matrix(a, b, c, d, e, f) {
        if ( a === void 0 ) a = 0;
        if ( b === void 0 ) b = 0;
        if ( c === void 0 ) c = 0;
        if ( d === void 0 ) d = 0;
        if ( e === void 0 ) e = 0;
        if ( f === void 0 ) f = 0;

        Class$$1.call(this);

        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }

    if ( Class$$1 ) Matrix.__proto__ = Class$$1;
    Matrix.prototype = Object.create( Class$$1 && Class$$1.prototype );
    Matrix.prototype.constructor = Matrix;

    Matrix.prototype.multiplyCopy = function multiplyCopy (matrix) {
        return new Matrix(
            this.a * matrix.a + this.c * matrix.b,
            this.b * matrix.a + this.d * matrix.b,
            this.a * matrix.c + this.c * matrix.d,
            this.b * matrix.c + this.d * matrix.d,
            this.a * matrix.e + this.c * matrix.f + this.e,
            this.b * matrix.e + this.d * matrix.f + this.f
        );
    };

    Matrix.prototype.invert = function invert () {
        var ref = this;
        var a = ref.a;
        var b = ref.b;
        var d = ref.c;
        var e = ref.d;
        var g = ref.e;
        var h = ref.f;
        var det = a * e - b * d;

        if (det === 0) {
            return null;
        }

        return new Matrix(e / det, -b / det, -d / det, a / det,
                          (d * h - e * g) / det, (b * g - a * h) / det);
    };

    Matrix.prototype.clone = function clone () {
        return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
    };

    Matrix.prototype.equals = function equals (other) {
        if (!other) {
            return false;
        }

        return this.a === other.a && this.b === other.b &&
               this.c === other.c && this.d === other.d &&
               this.e === other.e && this.f === other.f;
    };

    Matrix.prototype.round = function round$1 (precision) {
        this.a = round(this.a, precision);
        this.b = round(this.b, precision);
        this.c = round(this.c, precision);
        this.d = round(this.d, precision);
        this.e = round(this.e, precision);
        this.f = round(this.f, precision);

        return this;
    };

    Matrix.prototype.toArray = function toArray (precision) {
        var result = [ this.a, this.b, this.c, this.d, this.e, this.f ];

        if (defined(precision)) {
            for (var i = 0; i < result.length; i++) {
                result[i] = round(result[i], precision);
            }
        }

        return result;
    };

    Matrix.prototype.toString = function toString (precision, separator) {
        if ( separator === void 0 ) separator = ",";

        return this.toArray(precision).join(separator);
    };

    Matrix.translate = function translate (x, y) {
        return new Matrix(1, 0, 0, 1, x, y);
    };

    Matrix.unit = function unit () {
        return new Matrix(1, 0, 0, 1, 0, 0);
    };

    Matrix.rotate = function rotate (angle, x, y) {
        var matrix = new Matrix();
        matrix.a = Math.cos(rad(angle));
        matrix.b = Math.sin(rad(angle));
        matrix.c = -matrix.b;
        matrix.d = matrix.a;
        matrix.e = (x - x * matrix.a + y * matrix.b) || 0;
        matrix.f = (y - y * matrix.a - x * matrix.b) || 0;

        return matrix;
    };

    Matrix.scale = function scale (scaleX, scaleY) {
        return new Matrix(scaleX, 0, 0, scaleY, 0, 0);
    };

    return Matrix;
}(Class));

Matrix.IDENTITY = Matrix.unit();

function toMatrix(transformation) {
    if (transformation && typeof transformation.matrix === "function") {
        return transformation.matrix();
    }

    return transformation;
}

var Point = (function (Class$$1) {
    function Point(x, y) {
        Class$$1.call(this);

        this.x = x || 0;
        this.y = y || 0;
    }

    if ( Class$$1 ) Point.__proto__ = Class$$1;
    Point.prototype = Object.create( Class$$1 && Class$$1.prototype );
    Point.prototype.constructor = Point;

    var staticAccessors = { ZERO: {} };

    Point.prototype.equals = function equals (other) {
        return other && other.x === this.x && other.y === this.y;
    };

    Point.prototype.clone = function clone () {
        return new Point(this.x, this.y);
    };

    Point.prototype.rotate = function rotate (angle, origin) {
        var originPoint = Point.create(origin) || Point.ZERO;

        return this.transform(Matrix.rotate(angle, originPoint.x, originPoint.y));
    };

    Point.prototype.translate = function translate (x, y) {
        this.x += x;
        this.y += y;

        this.geometryChange();

        return this;
    };

    Point.prototype.translateWith = function translateWith (point) {
        return this.translate(point.x, point.y);
    };

    Point.prototype.move = function move (x, y) {
        this.x = this.y = 0;
        return this.translate(x, y);
    };

    Point.prototype.scale = function scale (scaleX, scaleY) {
        if ( scaleY === void 0 ) scaleY = scaleX;

        this.x *= scaleX;
        this.y *= scaleY;

        this.geometryChange();

        return this;
    };

    Point.prototype.scaleCopy = function scaleCopy (scaleX, scaleY) {
        return this.clone().scale(scaleX, scaleY);
    };

    Point.prototype.transform = function transform (transformation) {
        var matrix = toMatrix(transformation);
        var ref = this;
        var x = ref.x;
        var y = ref.y;

        this.x = matrix.a * x + matrix.c * y + matrix.e;
        this.y = matrix.b * x + matrix.d * y + matrix.f;

        this.geometryChange();

        return this;
    };

    Point.prototype.transformCopy = function transformCopy (transformation) {
        var point = this.clone();

        if (transformation) {
            point.transform(transformation);
        }

        return point;
    };

    Point.prototype.distanceTo = function distanceTo (point) {
        var dx = this.x - point.x;
        var dy = this.y - point.y;

        return Math.sqrt(dx * dx + dy * dy);
    };

    Point.prototype.round = function round$1 (digits) {
        this.x = round(this.x, digits);
        this.y = round(this.y, digits);

        this.geometryChange();

        return this;
    };

    Point.prototype.toArray = function toArray (digits) {
        var doRound = defined(digits);
        var x = doRound ? round(this.x, digits) : this.x;
        var y = doRound ? round(this.y, digits) : this.y;

        return [ x, y ];
    };

    Point.prototype.toString = function toString (digits, separator) {
        if ( separator === void 0 ) separator = " ";

        var ref = this;
        var x = ref.x;
        var y = ref.y;

        if (defined(digits)) {
            x = round(x, digits);
            y = round(y, digits);
        }

        return x + separator + y;
    };

    Point.create = function create (arg0, arg1) {
        if (defined(arg0)) {
            if (arg0 instanceof Point) {
                return arg0;
            } else if (arguments.length === 1 && arg0.length === 2) {
                return new Point(arg0[0], arg0[1]);
            }

            return new Point(arg0, arg1);
        }
    };

    Point.min = function min () {
        var arguments$1 = arguments;

        var minX = MAX_NUM;
        var minY = MAX_NUM;

        for (var i = 0; i < arguments.length; i++) {
            var point = arguments$1[i];
            minX = Math.min(point.x, minX);
            minY = Math.min(point.y, minY);
        }

        return new Point(minX, minY);
    };

    Point.max = function max () {
        var arguments$1 = arguments;

        var maxX = MIN_NUM;
        var maxY = MIN_NUM;

        for (var i = 0; i < arguments.length; i++) {
            var point = arguments$1[i];
            maxX = Math.max(point.x, maxX);
            maxY = Math.max(point.y, maxY);
        }

        return new Point(maxX, maxY);
    };

    Point.minPoint = function minPoint () {
        return new Point(MIN_NUM, MIN_NUM);
    };

    Point.maxPoint = function maxPoint () {
        return new Point(MAX_NUM, MAX_NUM);
    };

    staticAccessors.ZERO.get = function () {
        return new Point(0, 0);
    };

    Object.defineProperties( Point, staticAccessors );

    return Point;
}(Class));

defineAccessors(Point.prototype, [ "x", "y" ]);
ObserversMixin.extend(Point.prototype);

var Size = (function (Class$$1) {
    function Size(width, height) {
        Class$$1.call(this);

        this.width = width || 0;
        this.height = height || 0;
    }

    if ( Class$$1 ) Size.__proto__ = Class$$1;
    Size.prototype = Object.create( Class$$1 && Class$$1.prototype );
    Size.prototype.constructor = Size;

    var staticAccessors = { ZERO: {} };

    Size.prototype.equals = function equals (other) {
        return other && other.width === this.width && other.height === this.height;
    };

    Size.prototype.clone = function clone () {
        return new Size(this.width, this.height);
    };

    Size.prototype.toArray = function toArray (digits) {
        var doRound = defined(digits);
        var width = doRound ? round(this.width, digits) : this.width;
        var height = doRound ? round(this.height, digits) : this.height;

        return [ width, height ];
    };

    Size.create = function create (arg0, arg1) {
        if (defined(arg0)) {
            if (arg0 instanceof Size) {
                return arg0;
            } else if (arguments.length === 1 && arg0.length === 2) {
                return new Size(arg0[0], arg0[1]);
            }

            return new Size(arg0, arg1);
        }
    };

    staticAccessors.ZERO.get = function () {
        return new Size(0, 0);
    };

    Object.defineProperties( Size, staticAccessors );

    return Size;
}(Class));

defineAccessors(Size.prototype, [ "width", "height" ]);
ObserversMixin.extend(Size.prototype);

var Rect = (function (Class$$1) {
    function Rect(origin, size) {
        if ( origin === void 0 ) origin = new Point();
        if ( size === void 0 ) size = new Size();

        Class$$1.call(this);

        this.setOrigin(origin);
        this.setSize(size);
    }

    if ( Class$$1 ) Rect.__proto__ = Class$$1;
    Rect.prototype = Object.create( Class$$1 && Class$$1.prototype );
    Rect.prototype.constructor = Rect;

    Rect.prototype.clone = function clone () {
        return new Rect(
            this.origin.clone(),
            this.size.clone()
        );
    };

    Rect.prototype.equals = function equals (other) {
        return other &&
               other.origin.equals(this.origin) &&
               other.size.equals(this.size);
    };

    Rect.prototype.setOrigin = function setOrigin (value) {
        this._observerField("origin", Point.create(value));
        this.geometryChange();
        return this;
    };

    Rect.prototype.getOrigin = function getOrigin () {
        return this.origin;
    };

    Rect.prototype.setSize = function setSize (value) {
        this._observerField("size", Size.create(value));
        this.geometryChange();
        return this;
    };

    Rect.prototype.getSize = function getSize () {
        return this.size;
    };

    Rect.prototype.width = function width () {
        return this.size.width;
    };

    Rect.prototype.height = function height () {
        return this.size.height;
    };

    Rect.prototype.topLeft = function topLeft () {
        return this.origin.clone();
    };

    Rect.prototype.bottomRight = function bottomRight () {
        return this.origin.clone().translate(this.width(), this.height());
    };

    Rect.prototype.topRight = function topRight () {
        return this.origin.clone().translate(this.width(), 0);
    };

    Rect.prototype.bottomLeft = function bottomLeft () {
        return this.origin.clone().translate(0, this.height());
    };

    Rect.prototype.center = function center () {
        return this.origin.clone().translate(this.width() / 2, this.height() / 2);
    };

    Rect.prototype.bbox = function bbox (matrix) {
        var tl = this.topLeft().transformCopy(matrix);
        var tr = this.topRight().transformCopy(matrix);
        var br = this.bottomRight().transformCopy(matrix);
        var bl = this.bottomLeft().transformCopy(matrix);

        return Rect.fromPoints(tl, tr, br, bl);
    };

    Rect.prototype.transformCopy = function transformCopy (m) {
        return Rect.fromPoints(
            this.topLeft().transform(m),
            this.bottomRight().transform(m)
        );
    };

    Rect.prototype.expand = function expand (x, y) {
        if ( y === void 0 ) y = x;


        this.size.width += 2 * x;
        this.size.height += 2 * y;

        this.origin.translate(-x, -y);

        return this;
    };

    Rect.prototype.expandCopy = function expandCopy (x, y) {
        return this.clone().expand(x, y);
    };

    Rect.prototype.containsPoint = function containsPoint (point) {
        var origin = this.origin;
        var bottomRight = this.bottomRight();
        return !(point.x < origin.x || point.y < origin.y || bottomRight.x < point.x || bottomRight.y < point.y);
    };

    Rect.prototype._isOnPath = function _isOnPath (point, width) {
        var rectOuter = this.expandCopy(width, width);
        var rectInner = this.expandCopy(-width, -width);

        return rectOuter.containsPoint(point) && !rectInner.containsPoint(point);
    };

    Rect.fromPoints = function fromPoints () {
        var topLeft = Point.min.apply(null, arguments);
        var bottomRight = Point.max.apply(null, arguments);
        var size = new Size(
            bottomRight.x - topLeft.x,
            bottomRight.y - topLeft.y
        );

        return new Rect(topLeft, size);
    };

    Rect.union = function union (a, b) {
        return Rect.fromPoints(
            Point.min(a.topLeft(), b.topLeft()),
            Point.max(a.bottomRight(), b.bottomRight())
        );
    };

    Rect.intersect = function intersect (a, b) {
        var rect1 = {
            left: a.topLeft().x,
            top: a.topLeft().y,
            right: a.bottomRight().x,
            bottom: a.bottomRight().y
        };

        var rect2 = {
            left: b.topLeft().x,
            top: b.topLeft().y,
            right: b.bottomRight().x,
            bottom: b.bottomRight().y
        };

        if (rect1.left <= rect2.right &&
            rect2.left <= rect1.right &&
            rect1.top <= rect2.bottom &&
            rect2.top <= rect1.bottom) {
            return Rect.fromPoints(
                new Point(Math.max(rect1.left, rect2.left), Math.max(rect1.top, rect2.top)),
                new Point(Math.min(rect1.right, rect2.right), Math.min(rect1.bottom, rect2.bottom))
            );
        }
    };

    return Rect;
}(Class));

ObserversMixin.extend(Rect.prototype);

var Transformation = (function (Class$$1) {
    function Transformation(matrix) {
        if ( matrix === void 0 ) matrix = Matrix.unit();

        Class$$1.call(this);

        this._matrix = matrix;
    }

    if ( Class$$1 ) Transformation.__proto__ = Class$$1;
    Transformation.prototype = Object.create( Class$$1 && Class$$1.prototype );
    Transformation.prototype.constructor = Transformation;

    Transformation.prototype.clone = function clone () {
        return new Transformation(
            this._matrix.clone()
        );
    };

    Transformation.prototype.equals = function equals (other) {
        return other &&
               other._matrix.equals(this._matrix);
    };

    Transformation.prototype.translate = function translate (x, y) {
        this._matrix = this._matrix.multiplyCopy(Matrix.translate(x, y));

        this._optionsChange();
        return this;
    };

    Transformation.prototype.scale = function scale (scaleX, scaleY, origin) {
        if ( scaleY === void 0 ) scaleY = scaleX;
        if ( origin === void 0 ) origin = null;

        var originPoint = origin;

        if (originPoint) {
            originPoint = Point.create(originPoint);
            this._matrix = this._matrix.multiplyCopy(Matrix.translate(originPoint.x, originPoint.y));
        }

        this._matrix = this._matrix.multiplyCopy(Matrix.scale(scaleX, scaleY));

        if (originPoint) {
            this._matrix = this._matrix.multiplyCopy(Matrix.translate(-originPoint.x, -originPoint.y));
        }

        this._optionsChange();
        return this;
    };

    Transformation.prototype.rotate = function rotate (angle, origin) {
        var originPoint = Point.create(origin) || Point.ZERO;

        this._matrix = this._matrix.multiplyCopy(Matrix.rotate(angle, originPoint.x, originPoint.y));

        this._optionsChange();
        return this;
    };

    Transformation.prototype.multiply = function multiply (transformation) {
        var matrix = toMatrix(transformation);

        this._matrix = this._matrix.multiplyCopy(matrix);

        this._optionsChange();
        return this;
    };

    Transformation.prototype.matrix = function matrix (value) {
        if (value) {
            this._matrix = value;
            this._optionsChange();
            return this;
        }

        return this._matrix;
    };

    Transformation.prototype._optionsChange = function _optionsChange () {
        this.optionsChange({
            field: "transform",
            value: this
        });
    };

    return Transformation;
}(Class));

ObserversMixin.extend(Transformation.prototype);

function transform$1(matrix) {
    if (matrix === null) {
        return null;
    }

    if (matrix instanceof Transformation) {
        return matrix;
    }

    return new Transformation(matrix);
}

var Element$1 = (function (Class$$1) {
    function Element(options) {
        Class$$1.call(this);

        this._initOptions(options);
    }

    if ( Class$$1 ) Element.__proto__ = Class$$1;
    Element.prototype = Object.create( Class$$1 && Class$$1.prototype );
    Element.prototype.constructor = Element;

    Element.prototype._initOptions = function _initOptions (options) {
        if ( options === void 0 ) options = {};

        var clip = options.clip;
        var transform = options.transform;

        if (transform) {
            options.transform = transform$1(transform);
        }

        if (clip && !clip.id) {
            clip.id = definitionId();
        }

        this.options = new OptionsStore(options);
        this.options.addObserver(this);
    };

    Element.prototype.transform = function transform (value) {
        if (defined(value)) {
            this.options.set("transform", transform$1(value));
        } else {
            return this.options.get("transform");
        }
    };

    Element.prototype.parentTransform = function parentTransform () {
        var element = this;
        var parentMatrix;

        while (element.parent) {
            element = element.parent;
            var transformation = element.transform();
            if (transformation) {
                parentMatrix = transformation.matrix().multiplyCopy(parentMatrix || Matrix.unit());
            }
        }

        if (parentMatrix) {
            return transform$1(parentMatrix);
        }
    };

    Element.prototype.currentTransform = function currentTransform (parentTransform) {
        if ( parentTransform === void 0 ) parentTransform = this.parentTransform();

        var elementTransform = this.transform();
        var elementMatrix = toMatrix(elementTransform);

        var parentMatrix = toMatrix(parentTransform);
        var combinedMatrix;

        if (elementMatrix && parentMatrix) {
            combinedMatrix = parentMatrix.multiplyCopy(elementMatrix);
        } else {
            combinedMatrix = elementMatrix || parentMatrix;
        }

        if (combinedMatrix) {
            return transform$1(combinedMatrix);
        }
    };

    Element.prototype.visible = function visible (value) {
        if (defined(value)) {
            this.options.set("visible", value);
            return this;
        }

        return this.options.get("visible") !== false;
    };

    Element.prototype.clip = function clip (value) {
        var options = this.options;
        if (defined(value)) {
            if (value && !value.id) {
                value.id = definitionId();
            }
            options.set("clip", value);
            return this;
        }

        return options.get("clip");
    };

    Element.prototype.opacity = function opacity (value) {
        if (defined(value)) {
            this.options.set("opacity", value);
            return this;
        }

        return valueOrDefault(this.options.get("opacity"), 1);
    };

    Element.prototype.clippedBBox = function clippedBBox (transformation) {
        var bbox = this._clippedBBox(transformation);
        if (bbox) {
            var clip = this.clip();
            return clip ? Rect.intersect(bbox, clip.bbox(transformation)) : bbox;
        }
    };

    Element.prototype.containsPoint = function containsPoint (point, parentTransform) {
        if (this.visible()) {
            var transform = this.currentTransform(parentTransform);
            var transformedPoint = point;
            if (transform) {
                transformedPoint = point.transformCopy(transform.matrix().invert());
            }
            return (this._hasFill() && this._containsPoint(transformedPoint)) || (this._isOnPath && this._hasStroke() && this._isOnPath(transformedPoint));
        }
        return false;
    };

    Element.prototype._hasFill = function _hasFill () {
        var fill = this.options.fill;
        return fill && !isTransparent(fill.color);
    };

    Element.prototype._hasStroke = function _hasStroke () {
        var stroke = this.options.stroke;
        return stroke && stroke.width > 0 && !isTransparent(stroke.color);
    };

    Element.prototype._clippedBBox = function _clippedBBox (transformation) {
        return this.bbox(transformation);
    };

    return Element;
}(Class));

Element$1.prototype.nodeType = "Element";

ObserversMixin.extend(Element$1.prototype);

function ellipseExtremeAngles(center, rx, ry, matrix) {
    var extremeX = 0;
    var extremeY = 0;

    if (matrix) {
        extremeX = Math.atan2(matrix.c * ry, matrix.a * rx);
        if (matrix.b !== 0) {
            extremeY = Math.atan2(matrix.d * ry, matrix.b * rx);
        }
    }

    return {
        x: extremeX,
        y: extremeY
    };
}

var PI_DIV_2 = Math.PI / 2;

var Circle$2 = (function (Class$$1) {
    function Circle(center, radius) {
        if ( center === void 0 ) center = new Point();
        if ( radius === void 0 ) radius = 0;

        Class$$1.call(this);

        this.setCenter(center);
        this.setRadius(radius);
    }

    if ( Class$$1 ) Circle.__proto__ = Class$$1;
    Circle.prototype = Object.create( Class$$1 && Class$$1.prototype );
    Circle.prototype.constructor = Circle;

    Circle.prototype.setCenter = function setCenter (value) {
        this._observerField("center", Point.create(value));
        this.geometryChange();
        return this;
    };

    Circle.prototype.getCenter = function getCenter () {
        return this.center;
    };

    Circle.prototype.equals = function equals (other) {
        return other &&
               other.center.equals(this.center) &&
               other.radius === this.radius;
    };

    Circle.prototype.clone = function clone () {
        return new Circle(this.center.clone(), this.radius);
    };

    Circle.prototype.pointAt = function pointAt (angle) {
        return this._pointAt(rad(angle));
    };

    Circle.prototype.bbox = function bbox (matrix) {
        var this$1 = this;

        var extremeAngles = ellipseExtremeAngles(this.center, this.radius, this.radius, matrix);
        var minPoint = Point.maxPoint();
        var maxPoint = Point.minPoint();

        for (var i = 0; i < 4; i++) {
            var currentPointX = this$1._pointAt(extremeAngles.x + i * PI_DIV_2).transformCopy(matrix);
            var currentPointY = this$1._pointAt(extremeAngles.y + i * PI_DIV_2).transformCopy(matrix);
            var currentPoint = new Point(currentPointX.x, currentPointY.y);

            minPoint = Point.min(minPoint, currentPoint);
            maxPoint = Point.max(maxPoint, currentPoint);
        }

        return Rect.fromPoints(minPoint, maxPoint);
    };

    Circle.prototype._pointAt = function _pointAt (angle) {
        var ref = this;
        var center = ref.center;
        var radius = ref.radius;

        return new Point(
            center.x + radius * Math.cos(angle),
            center.y + radius * Math.sin(angle)
        );
    };

    Circle.prototype.containsPoint = function containsPoint (point) {
        var ref = this;
        var center = ref.center;
        var radius = ref.radius;
        var inCircle = Math.pow(point.x - center.x, 2) +
            Math.pow(point.y - center.y, 2) <= Math.pow(radius, 2);
        return inCircle;
    };

    Circle.prototype._isOnPath = function _isOnPath (point, width) {
        var ref = this;
        var center = ref.center;
        var radius = ref.radius;
        var pointDistance = center.distanceTo(point);

        return radius - width <= pointDistance && pointDistance <= radius + width;
    };

    return Circle;
}(Class));

defineAccessors(Circle$2.prototype, [ "radius" ]);
ObserversMixin.extend(Circle$2.prototype);

var GRADIENT = "Gradient";

var Paintable = {
    extend: function(proto) {
        proto.fill = this.fill;
        proto.stroke = this.stroke;
    },

    fill: function(color, opacity) {
        var options = this.options;

        if (defined(color)) {
            if (color && color.nodeType !== GRADIENT) {
                var newFill = {
                    color: color
                };
                if (defined(opacity)) {
                    newFill.opacity = opacity;
                }
                options.set("fill", newFill);
            } else {
                options.set("fill", color);
            }

            return this;
        }

        return options.get("fill");
    },

    stroke: function(color, width, opacity) {
        if (defined(color)) {
            this.options.set("stroke.color", color);

            if (defined(width)) {
                this.options.set("stroke.width", width);
            }

            if (defined(opacity)) {
                this.options.set("stroke.opacity", opacity);
            }

            return this;
        }

        return this.options.get("stroke");
    }
};

var IDENTITY_MATRIX_HASH = Matrix.IDENTITY.toString();

var Measurable = {
    extend: function(proto) {
        proto.bbox = this.bbox;
        proto.geometryChange = this.geometryChange;
    },

    bbox: function(transformation) {
        var combinedMatrix = toMatrix(this.currentTransform(transformation));
        var matrixHash = combinedMatrix ? combinedMatrix.toString() : IDENTITY_MATRIX_HASH;
        var bbox;

        if (this._bboxCache && this._matrixHash === matrixHash) {
            bbox = this._bboxCache.clone();
        } else {
            bbox = this._bbox(combinedMatrix);
            this._bboxCache = bbox ? bbox.clone() : null;
            this._matrixHash = matrixHash;
        }

        var strokeWidth = this.options.get("stroke.width");
        if (strokeWidth && bbox) {
            bbox.expand(strokeWidth / 2);
        }

        return bbox;
    },

    geometryChange: function() {
        delete this._bboxCache;
        this.trigger("geometryChange", {
            element: this
        });
    }
};

function geometryAccessor(name) {
    var fieldName = "_" + name;
    return function(value) {
        if (defined(value)) {
            this._observerField(fieldName, value);
            this.geometryChange();
            return this;
        }

        return this[fieldName];
    };
}

function defineGeometryAccessors(fn, names) {
    for (var i = 0; i < names.length; i++) {
        fn[names[i]] = geometryAccessor(names[i]);
    }
}

var DEFAULT_STROKE = "#000";

var Circle = (function (Element) {
    function Circle(geometry, options) {
        if ( geometry === void 0 ) geometry = new Circle$2();
        if ( options === void 0 ) options = {};

        Element.call(this, options);
        this.geometry(geometry);

        if (!defined(this.options.stroke)) {
            this.stroke(DEFAULT_STROKE);
        }
    }

    if ( Element ) Circle.__proto__ = Element;
    Circle.prototype = Object.create( Element && Element.prototype );
    Circle.prototype.constructor = Circle;

    Circle.prototype.rawBBox = function rawBBox () {
        return this._geometry.bbox();
    };

    Circle.prototype._bbox = function _bbox (matrix) {
        return this._geometry.bbox(matrix);
    };

    Circle.prototype._containsPoint = function _containsPoint (point) {
        return this.geometry().containsPoint(point);
    };

    Circle.prototype._isOnPath = function _isOnPath (point) {
        return this.geometry()._isOnPath(point, this.options.stroke.width / 2);
    };

    return Circle;
}(Element$1));

Circle.prototype.nodeType = "Circle";

Paintable.extend(Circle.prototype);
Measurable.extend(Circle.prototype);
defineGeometryAccessors(Circle.prototype, [ "geometry" ]);

var PRECISION = 10;

function close$1(a, b, tolerance) {
    if ( tolerance === void 0 ) tolerance = PRECISION;

    return round(Math.abs(a - b), tolerance) === 0;
}

function closeOrLess(a, b, tolerance) {
    return a < b || close$1(a, b, tolerance);
}

function lineIntersection(p0, p1, p2, p3) {
    var s1x = p1.x - p0.x;
    var s2x = p3.x - p2.x;
    var s1y = p1.y - p0.y;
    var s2y = p3.y - p2.y;
    var nx = p0.x - p2.x;
    var ny = p0.y - p2.y;
    var d = s1x * s2y - s2x * s1y;
    var s = (s1x * ny - s1y * nx) / d;
    var t = (s2x * ny - s2y * nx) / d;

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        return new Point(p0.x + t * s1x, p0.y + t * s1y);
    }
}

var MAX_INTERVAL = 45;
var pow$1 = Math.pow;

var Arc$2 = (function (Class$$1) {
    function Arc(center, options) {
        if ( center === void 0 ) center = new Point();
        if ( options === void 0 ) options = {};

        Class$$1.call(this);

        this.setCenter(center);

        this.radiusX = options.radiusX;
        this.radiusY = options.radiusY || options.radiusX;
        this.startAngle = options.startAngle;
        this.endAngle = options.endAngle;
        this.anticlockwise = options.anticlockwise || false;
        this.xRotation = options.xRotation;
    }

    if ( Class$$1 ) Arc.__proto__ = Class$$1;
    Arc.prototype = Object.create( Class$$1 && Class$$1.prototype );
    Arc.prototype.constructor = Arc;

    Arc.prototype.clone = function clone () {
        return new Arc(this.center, {
            radiusX: this.radiusX,
            radiusY: this.radiusY,
            startAngle: this.startAngle,
            endAngle: this.endAngle,
            anticlockwise: this.anticlockwise
        });
    };

    Arc.prototype.setCenter = function setCenter (value) {
        this._observerField("center", Point.create(value));
        this.geometryChange();
        return this;
    };

    Arc.prototype.getCenter = function getCenter () {
        return this.center;
    };

    Arc.prototype.pointAt = function pointAt (angle) {
        var center = this.center;
        var radian = rad(angle);

        return new Point(
            center.x + this.radiusX * Math.cos(radian),
            center.y + this.radiusY * Math.sin(radian)
        );
    };

    Arc.prototype.curvePoints = function curvePoints () {
        var this$1 = this;

        var startAngle = this.startAngle;
        var dir = this.anticlockwise ? -1 : 1;
        var curvePoints = [ this.pointAt(startAngle) ];
        var interval = this._arcInterval();
        var intervalAngle = interval.endAngle - interval.startAngle;
        var subIntervalsCount = Math.ceil(intervalAngle / MAX_INTERVAL);
        var subIntervalAngle = intervalAngle / subIntervalsCount;
        var currentAngle = startAngle;
        var transformation;
        if (this.xRotation) {
            transformation = transform$1().rotate(this.xRotation, this.center);
        }

        for (var i = 1; i <= subIntervalsCount; i++) {
            var nextAngle = currentAngle + dir * subIntervalAngle;
            var points = this$1._intervalCurvePoints(currentAngle, nextAngle, transformation);

            curvePoints.push(points.cp1, points.cp2, points.p2);
            currentAngle = nextAngle;
        }

        return curvePoints;
    };

    Arc.prototype.bbox = function bbox (matrix) {
        var this$1 = this;

        var interval = this._arcInterval();
        var startAngle = interval.startAngle;
        var endAngle = interval.endAngle;
        var extremeAngles = ellipseExtremeAngles(this.center, this.radiusX, this.radiusY, matrix);
        var extremeX = deg(extremeAngles.x);
        var extremeY = deg(extremeAngles.y);
        var endPoint = this.pointAt(endAngle).transformCopy(matrix);
        var currentAngleX = bboxStartAngle(extremeX, startAngle);
        var currentAngleY = bboxStartAngle(extremeY, startAngle);
        var currentPoint = this.pointAt(startAngle).transformCopy(matrix);
        var minPoint = Point.min(currentPoint, endPoint);
        var maxPoint = Point.max(currentPoint, endPoint);

        while (currentAngleX < endAngle || currentAngleY < endAngle) {
            var currentPointX = (void 0);
            if (currentAngleX < endAngle) {
                currentPointX = this$1.pointAt(currentAngleX).transformCopy(matrix);
                currentAngleX += 90;
            }

            var currentPointY = (void 0);
            if (currentAngleY < endAngle) {
                currentPointY = this$1.pointAt(currentAngleY).transformCopy(matrix);
                currentAngleY += 90;
            }

            currentPoint = new Point(currentPointX.x, currentPointY.y);
            minPoint = Point.min(minPoint, currentPoint);
            maxPoint = Point.max(maxPoint, currentPoint);
        }

        return Rect.fromPoints(minPoint, maxPoint);
    };

    Arc.prototype._arcInterval = function _arcInterval () {
        var ref = this;
        var startAngle = ref.startAngle;
        var endAngle = ref.endAngle;
        var anticlockwise = ref.anticlockwise;

        if (anticlockwise) {
            var oldStart = startAngle;
            startAngle = endAngle;
            endAngle = oldStart;
        }

        if (startAngle > endAngle || (anticlockwise && startAngle === endAngle)) {
            endAngle += 360;
        }

        return {
            startAngle: startAngle,
            endAngle: endAngle
        };
    };

    Arc.prototype._intervalCurvePoints = function _intervalCurvePoints (startAngle, endAngle, transformation) {
        var p1 = this.pointAt(startAngle);
        var p2 = this.pointAt(endAngle);
        var p1Derivative = this._derivativeAt(startAngle);
        var p2Derivative = this._derivativeAt(endAngle);
        var t = (rad(endAngle) - rad(startAngle)) / 3;
        var cp1 = new Point(p1.x + t * p1Derivative.x, p1.y + t * p1Derivative.y);
        var cp2 = new Point(p2.x - t * p2Derivative.x, p2.y - t * p2Derivative.y);
        if (transformation) {
            p1.transform(transformation);
            p2.transform(transformation);
            cp1.transform(transformation);
            cp2.transform(transformation);
        }

        return {
            p1: p1,
            cp1: cp1,
            cp2: cp2,
            p2: p2
        };
    };

    Arc.prototype._derivativeAt = function _derivativeAt (angle) {
        var radian = rad(angle);

        return new Point(-this.radiusX * Math.sin(radian), this.radiusY * Math.cos(radian));
    };

    Arc.prototype.containsPoint = function containsPoint (point) {
        var interval = this._arcInterval();
        var intervalAngle = interval.endAngle - interval.startAngle;
        var ref = this;
        var center = ref.center;
        var radiusX = ref.radiusX;
        var radiusY = ref.radiusY;
        var distance = center.distanceTo(point);
        var angleRad = Math.atan2(point.y - center.y, point.x - center.x);
        var pointRadius = (radiusX * radiusY) /
            Math.sqrt(pow$1(radiusX, 2) * pow$1(Math.sin(angleRad), 2) + pow$1(radiusY, 2) * pow$1(Math.cos(angleRad), 2));
        var startPoint = this.pointAt(this.startAngle).round(PRECISION);
        var endPoint = this.pointAt(this.endAngle).round(PRECISION);
        var intersection = lineIntersection(center, point.round(PRECISION), startPoint, endPoint);
        var containsPoint;

        if (intervalAngle < 180) {
            containsPoint = intersection && closeOrLess(center.distanceTo(intersection), distance) && closeOrLess(distance, pointRadius);
        } else {
            var angle = calculateAngle(center.x, center.y, radiusX, radiusY, point.x, point.y);
            if (angle !== 360) {
                angle = (360 + angle) % 360;
            }

            var inAngleRange = interval.startAngle <= angle && angle <= interval.endAngle;
            containsPoint = (inAngleRange && closeOrLess(distance, pointRadius)) || (!inAngleRange && (!intersection || intersection.equals(point)));
        }
        return containsPoint;
    };

    Arc.prototype._isOnPath = function _isOnPath (point, width) {
        var interval = this._arcInterval();
        var center = this.center;
        var angle = calculateAngle(center.x, center.y, this.radiusX, this.radiusY, point.x, point.y);
        if (angle !== 360) {
            angle = (360 + angle) % 360;
        }

        var inAngleRange = interval.startAngle <= angle && angle <= interval.endAngle;

        return inAngleRange && this.pointAt(angle).distanceTo(point) <= width;
    };

    Arc.fromPoints = function fromPoints (start, end, rx, ry, largeArc, swipe, rotation) {// eslint-disable-line max-params
        var arcParameters = normalizeArcParameters({
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y,
            rx: rx,
            ry: ry,
            largeArc: largeArc,
            swipe: swipe,
            rotation: rotation
        });

        return new Arc(arcParameters.center, {
            startAngle: arcParameters.startAngle,
            endAngle: arcParameters.endAngle,
            radiusX: arcParameters.radiusX,
            radiusY: arcParameters.radiusY,
            xRotation: arcParameters.xRotation,
            anticlockwise: swipe === 0
        });
    };

    return Arc;
}(Class));

defineAccessors(Arc$2.prototype, [ "radiusX", "radiusY", "startAngle", "endAngle", "anticlockwise" ]);
ObserversMixin.extend(Arc$2.prototype);

function calculateAngle(cx, cy, rx, ry, x, y) {
    var cos = round((x - cx) / rx, 3);
    var sin = round((y - cy) / ry, 3);

    return round(deg(Math.atan2(sin, cos)));
}

function normalizeArcParameters(parameters) {
    var x1 = parameters.x1;
    var y1 = parameters.y1;
    var x2 = parameters.x2;
    var y2 = parameters.y2;
    var rx = parameters.rx;
    var ry = parameters.ry;
    var largeArc = parameters.largeArc;
    var swipe = parameters.swipe;
    var rotation = parameters.rotation; if ( rotation === void 0 ) rotation = 0;

    var radians = rad(rotation);
    var cosine = Math.cos(radians);
    var sine = Math.sin(radians);

    var xT = cosine * (x1 - x2) / 2 + sine * (y1 - y2) / 2;
    var yT = -sine * (x1 - x2) / 2 + cosine * (y1 - y2) / 2;

    var sign = largeArc !== swipe ? 1 : -1;

    var xt2 = Math.pow(xT, 2);
    var yt2 = Math.pow(yT, 2);
    var rx2 = Math.pow(rx, 2);
    var ry2 = Math.pow(ry, 2);

    var delta = xt2 / rx2 + yt2 / ry2;

    if (delta > 1) {
        delta = Math.sqrt(xt2 / rx2 + yt2 / ry2);
        rx = delta * rx;
        rx2 = Math.pow(rx, 2);

        ry = delta * ry;
        ry2 = Math.pow(ry, 2);
    }

    var constT = sign * Math.sqrt((rx2 * ry2 - rx2 * yt2 - ry2 * xt2) / (rx2 * yt2 + ry2 * xt2));
    // due to rounding errors the value could become NaN even after radii correction
    if (isNaN(constT)) {
        constT = 0;
    }

    var cxT = constT * (rx * yT) / ry;
    var cyT = - constT * (ry * xT) / rx;

    var cx = cosine * cxT - sine * cyT + (x1 + x2) / 2;
    var cy = sine * cxT + cosine * cyT + (y1 + y2) / 2;


    var uX = (xT - cxT) / rx;
    var uY = (yT - cyT) / ry;
    var vX = -(xT + cxT) / rx;
    var vY = -(yT + cyT) / ry;

    var startAngle = (uY >= 0 ? 1 : -1) * deg(Math.acos(uX / Math.sqrt(uX * uX + uY * uY)));

    var angleCosine = round((uX * vX + uY * vY) / (Math.sqrt(uX * uX + uY * uY) * Math.sqrt(vX * vX + vY * vY)), 10);
    var angle = (uX * vY - uY * vX >= 0 ? 1 : -1) * deg(Math.acos(angleCosine));

    if (!swipe && angle > 0) {
        angle -= 360;
    }

    if (swipe && angle < 0) {
        angle += 360;
    }
    var endAngle = startAngle + angle;
    var signEndAngle = endAngle >= 0 ? 1 : -1;
    endAngle = (Math.abs(endAngle) % 360) * signEndAngle;

    return {
        center: new Point(cx, cy),
        startAngle: startAngle,
        endAngle: endAngle,
        radiusX: rx,
        radiusY: ry,
        xRotation: rotation
    };
}

function bboxStartAngle(angle, start) {
    var startAngle = angle;

    while (startAngle < start) {
        startAngle += 90;
    }

    return startAngle;
}

var push = [].push;
var pop = [].pop;
var splice = [].splice;
var shift = [].shift;
var slice = [].slice;
var unshift = [].unshift;

var ElementsArray = (function (Class$$1) {
    function ElementsArray(array) {
        if ( array === void 0 ) array = [];

        Class$$1.call(this);

        this.length = 0;
        this._splice(0, array.length, array);
    }

    if ( Class$$1 ) ElementsArray.__proto__ = Class$$1;
    ElementsArray.prototype = Object.create( Class$$1 && Class$$1.prototype );
    ElementsArray.prototype.constructor = ElementsArray;

    ElementsArray.prototype.elements = function elements (value) {
        if (value) {
            this._splice(0, this.length, value);

            this._change();
            return this;
        }

        return this.slice(0);
    };

    ElementsArray.prototype.push = function push$1 () {
        var elements = arguments;
        var result = push.apply(this, elements);

        this._add(elements);

        return result;
    };

    ElementsArray.prototype.slice = function slice$1 () {
        return slice.call(this);
    };

    ElementsArray.prototype.pop = function pop$1 () {
        var length = this.length;
        var result = pop.apply(this);

        if (length) {
            this._remove([ result ]);
        }

        return result;
    };

    ElementsArray.prototype.splice = function splice$1 (index, howMany) {
        var elements = slice.call(arguments, 2);
        var result = this._splice(index, howMany, elements);

        this._change();

        return result;
    };

    ElementsArray.prototype.shift = function shift$1 () {
        var length = this.length;
        var result = shift.apply(this);

        if (length) {
            this._remove([ result ]);
        }

        return result;
    };

    ElementsArray.prototype.unshift = function unshift$1 () {
        var elements = arguments;
        var result = unshift.apply(this, elements);

        this._add(elements);

        return result;
    };

    ElementsArray.prototype.indexOf = function indexOf (element) {
        var this$1 = this;

        var length = this.length;

        for (var idx = 0; idx < length; idx++) {
            if (this$1[idx] === element) {
                return idx;
            }
        }
        return -1;
    };

    ElementsArray.prototype._splice = function _splice (index, howMany, elements) {
        var result = splice.apply(this, [ index, howMany ].concat(elements));

        this._clearObserver(result);
        this._setObserver(elements);

        return result;
    };

    ElementsArray.prototype._add = function _add (elements) {
        this._setObserver(elements);
        this._change();
    };

    ElementsArray.prototype._remove = function _remove (elements) {
        this._clearObserver(elements);
        this._change();
    };

    ElementsArray.prototype._setObserver = function _setObserver (elements) {
        var this$1 = this;

        for (var idx = 0; idx < elements.length; idx++) {
            elements[idx].addObserver(this$1);
        }
    };

    ElementsArray.prototype._clearObserver = function _clearObserver (elements) {
        var this$1 = this;

        for (var idx = 0; idx < elements.length; idx++) {
            elements[idx].removeObserver(this$1);
        }
    };

    ElementsArray.prototype._change = function _change () {};

    return ElementsArray;
}(Class));

ObserversMixin.extend(ElementsArray.prototype);

var GeometryElementsArray = (function (ElementsArray$$1) {
    function GeometryElementsArray () {
        ElementsArray$$1.apply(this, arguments);
    }

    if ( ElementsArray$$1 ) GeometryElementsArray.__proto__ = ElementsArray$$1;
    GeometryElementsArray.prototype = Object.create( ElementsArray$$1 && ElementsArray$$1.prototype );
    GeometryElementsArray.prototype.constructor = GeometryElementsArray;

    GeometryElementsArray.prototype._change = function _change () {
        this.geometryChange();
    };

    return GeometryElementsArray;
}(ElementsArray));

function pointAccessor(name) {
    var fieldName = "_" + name;
    return function(value) {
        if (defined(value)) {
            this._observerField(fieldName, Point.create(value));
            this.geometryChange();
            return this;
        }

        return this[fieldName];
    };
}

function definePointAccessors(fn, names) {
    for (var i = 0; i < names.length; i++) {
        fn[names[i]] = pointAccessor(names[i]);
    }
}

function isOutOfEndPoint(endPoint, controlPoint, point) {
    var angle = deg(Math.atan2(controlPoint.y - endPoint.y, controlPoint.x - endPoint.x));
    var rotatedPoint = point.transformCopy(transform$1().rotate(-angle, endPoint));

    return rotatedPoint.x < endPoint.x;
}

function calculateCurveAt(t, field, points) {
    var t1 = 1 - t;
    return Math.pow(t1, 3) * points[0][field] +
        3 * Math.pow(t1, 2) * t * points[1][field] +
        3 * Math.pow(t, 2) * t1 * points[2][field] +
        Math.pow(t, 3) * points[3][field];
}

function toCubicPolynomial(points, field) {
    return [ -points[0][field] + 3 * points[1][field] - 3 * points[2][field] + points[3][field],
        3 * (points[0][field] - 2 * points[1][field] + points[2][field]),
        3 * (-points[0][field] + points[1][field]),
        points[0][field]
    ];
}

var ComplexNumber = (function (Class$$1) {
    function ComplexNumber(real, img) {
        if ( real === void 0 ) real = 0;
        if ( img === void 0 ) img = 0;

        Class$$1.call(this);

        this.real = real;
        this.img = img;
    }

    if ( Class$$1 ) ComplexNumber.__proto__ = Class$$1;
    ComplexNumber.prototype = Object.create( Class$$1 && Class$$1.prototype );
    ComplexNumber.prototype.constructor = ComplexNumber;

    ComplexNumber.prototype.add = function add (cNumber) {
        return new ComplexNumber(round(this.real + cNumber.real, PRECISION), round(this.img + cNumber.img, PRECISION));
    };

    ComplexNumber.prototype.addConstant = function addConstant (value) {
        return new ComplexNumber(this.real + value, this.img);
    };

    ComplexNumber.prototype.negate = function negate () {
        return new ComplexNumber(-this.real, -this.img);
    };

    ComplexNumber.prototype.multiply = function multiply (cNumber) {
        return new ComplexNumber(this.real * cNumber.real - this.img * cNumber.img,
            this.real * cNumber.img + this.img * cNumber.real);
    };

    ComplexNumber.prototype.multiplyConstant = function multiplyConstant (value) {
        return new ComplexNumber(this.real * value, this.img * value);
    };

    ComplexNumber.prototype.nthRoot = function nthRoot (n) {
        var rad$$1 = Math.atan2(this.img, this.real);
        var r = Math.sqrt(Math.pow(this.img, 2) + Math.pow(this.real, 2));
        var nthR = Math.pow(r, 1 / n);

        return new ComplexNumber(nthR * Math.cos(rad$$1 / n), nthR * Math.sin(rad$$1 / n)); //Moivre's formula
    };

    ComplexNumber.prototype.equals = function equals (cNumber) {
        return this.real === cNumber.real && this.img === cNumber.img;
    };

    ComplexNumber.prototype.isReal = function isReal () {
        return this.img === 0;
    };

    return ComplexNumber;
}(Class));

function numberSign(x) {
    return x < 0 ? -1 : 1;
}

function solveQuadraticEquation(a, b, c) {
    var squareRoot = Math.sqrt(Math.pow(b, 2) - 4 * a * c);
    return [
        (-b + squareRoot) / (2 * a),
        (-b - squareRoot) / (2 * a)
    ];
}

//Cardano's formula
function solveCubicEquation(a, b, c, d) {
    if (a === 0) {
        return solveQuadraticEquation(b, c, d);
    }

    var p = (3 * a * c - Math.pow(b, 2)) / (3 * Math.pow(a, 2));
    var q = (2 * Math.pow(b, 3) - 9 * a * b * c + 27 * Math.pow(a, 2) * d) / (27 * Math.pow(a, 3));
    var Q = Math.pow(p / 3, 3) + Math.pow(q / 2, 2);
    var i = new ComplexNumber(0,1);
    var b3a = -b / (3 * a);
    var x1, x2, y1, y2, y3, z1, z2;

    if (Q < 0) {
        x1 = new ComplexNumber(-q / 2, Math.sqrt(-Q)).nthRoot(3);
        x2 = new ComplexNumber(-q / 2, - Math.sqrt(-Q)).nthRoot(3);
    } else {
        x1 = -q / 2 + Math.sqrt(Q);
        x1 = new ComplexNumber(numberSign(x1) * Math.pow(Math.abs(x1), 1 / 3));
        x2 = -q / 2 - Math.sqrt(Q);
        x2 = new ComplexNumber(numberSign(x2) * Math.pow(Math.abs(x2), 1 / 3));
    }

    y1 = x1.add(x2);

    z1 = x1.add(x2).multiplyConstant(-1 / 2);
    z2 = x1.add(x2.negate()).multiplyConstant(Math.sqrt(3) / 2);

    y2 = z1.add(i.multiply(z2));
    y3 = z1.add(i.negate().multiply(z2));

    var result = [];

    if (y1.isReal()) {
        result.push(round(y1.real + b3a, PRECISION));
    }
    if (y2.isReal()) {
        result.push(round(y2.real + b3a, PRECISION));
    }
    if (y3.isReal()) {
        result.push(round(y3.real + b3a, PRECISION));
    }

    return result;
}

function hasRootsInRange(points, point, field, rootField, range) {
    var polynomial = toCubicPolynomial(points, rootField);
    var roots = solveCubicEquation(polynomial[0], polynomial[1], polynomial[2], polynomial[3] - point[rootField]);
    var intersection;

    for (var idx = 0; idx < roots.length; idx++) {
        if (0 <= roots[idx] && roots[idx] <= 1) {
            intersection = calculateCurveAt(roots[idx], field, points);
            if (Math.abs(intersection - point[field]) <= range) {
                return true;
            }
        }
    }
}

function curveIntersectionsCount(points, point, bbox) {
    var polynomial = toCubicPolynomial(points, "x");
    var roots = solveCubicEquation(polynomial[0], polynomial[1], polynomial[2], polynomial[3] - point.x);
    var rayIntersection, intersectsRay;
    var count = 0;
    for (var i = 0; i < roots.length; i++) {
        rayIntersection = calculateCurveAt(roots[i], "y", points);
        intersectsRay = close$1(rayIntersection, point.y) || rayIntersection > point.y;
        if (intersectsRay && (((roots[i] === 0 || roots[i] === 1) && bbox.bottomRight().x > point.x) || (0 < roots[i] && roots[i] < 1))) {
            count++;
        }
    }

    return count;
}

function lineIntersectionsCount(a, b, point) {
    var intersects;
    if (a.x !== b.x) {
        var minX = Math.min(a.x, b.x);
        var maxX = Math.max(a.x, b.x);
        var minY = Math.min(a.y, b.y);
        var maxY = Math.max(a.y, b.y);
        var inRange = minX <= point.x && point.x < maxX;

        if (minY === maxY) {
            intersects = point.y <= minY && inRange;
        } else {
            intersects = inRange && (((maxY - minY) * ((a.x - b.x) * (a.y - b.y) > 0 ? point.x - minX : maxX - point.x)) / (maxX - minX) + minY - point.y) >= 0;
        }
    }

    return intersects ? 1 : 0;
}

var Segment = (function (Class$$1) {
    function Segment(anchor, controlIn, controlOut) {
        Class$$1.call(this);

        this.anchor(anchor || new Point());
        this.controlIn(controlIn);
        this.controlOut(controlOut);
    }

    if ( Class$$1 ) Segment.__proto__ = Class$$1;
    Segment.prototype = Object.create( Class$$1 && Class$$1.prototype );
    Segment.prototype.constructor = Segment;

    Segment.prototype.bboxTo = function bboxTo (toSegment, matrix) {
        var segmentAnchor = this.anchor().transformCopy(matrix);
        var toSegmentAnchor = toSegment.anchor().transformCopy(matrix);
        var rect;

        if (this.controlOut() && toSegment.controlIn()) {
            rect = this._curveBoundingBox(
                segmentAnchor, this.controlOut().transformCopy(matrix),
                toSegment.controlIn().transformCopy(matrix), toSegmentAnchor
            );
        } else {
            rect = this._lineBoundingBox(segmentAnchor, toSegmentAnchor);
        }

        return rect;
    };

    Segment.prototype._lineBoundingBox = function _lineBoundingBox (p1, p2) {
        return Rect.fromPoints(p1, p2);
    };

    Segment.prototype._curveBoundingBox = function _curveBoundingBox (p1, cp1, cp2, p2) {
        var points = [ p1, cp1, cp2, p2 ];
        var extremesX = this._curveExtremesFor(points, "x");
        var extremesY = this._curveExtremesFor(points, "y");
        var xLimits = arrayLimits([ extremesX.min, extremesX.max, p1.x, p2.x ]);
        var yLimits = arrayLimits([ extremesY.min, extremesY.max, p1.y, p2.y ]);

        return Rect.fromPoints(new Point(xLimits.min, yLimits.min), new Point(xLimits.max, yLimits.max));
    };

    Segment.prototype._curveExtremesFor = function _curveExtremesFor (points, field) {
        var extremes = this._curveExtremes(
            points[0][field], points[1][field],
            points[2][field], points[3][field]
        );

        return {
            min: calculateCurveAt(extremes.min, field, points),
            max: calculateCurveAt(extremes.max, field, points)
        };
    };

    Segment.prototype._curveExtremes = function _curveExtremes (x1, x2, x3, x4) {
        var a = x1 - 3 * x2 + 3 * x3 - x4;
        var b = - 2 * (x1 - 2 * x2 + x3);
        var c = x1 - x2;
        var sqrt = Math.sqrt(b * b - 4 * a * c);
        var t1 = 0;
        var t2 = 1;

        if (a === 0) {
            if (b !== 0) {
                t1 = t2 = -c / b;
            }
        } else if (!isNaN(sqrt)) {
            t1 = (- b + sqrt) / (2 * a);
            t2 = (- b - sqrt) / (2 * a);
        }

        var min = Math.max(Math.min(t1, t2), 0);
        if (min < 0 || min > 1) {
            min = 0;
        }

        var max = Math.min(Math.max(t1, t2), 1);
        if (max > 1 || max < 0) {
            max = 1;
        }

        return {
            min: min,
            max: max
        };
    };

    Segment.prototype._intersectionsTo = function _intersectionsTo (segment, point) {
        var intersectionsCount;
        if (this.controlOut() && segment.controlIn()) {
            intersectionsCount = curveIntersectionsCount([ this.anchor(), this.controlOut(), segment.controlIn(), segment.anchor() ], point, this.bboxTo(segment));
        } else {
            intersectionsCount = lineIntersectionsCount(this.anchor(), segment.anchor(), point);
        }
        return intersectionsCount;
    };

    Segment.prototype._isOnCurveTo = function _isOnCurveTo (segment, point, width, endSegment) {
        var bbox = this.bboxTo(segment).expand(width, width);
        if (bbox.containsPoint(point)) {
            var p1 = this.anchor();
            var p2 = this.controlOut();
            var p3 = segment.controlIn();
            var p4 = segment.anchor();

            if (endSegment === "start" && p1.distanceTo(point) <= width) {
                return !isOutOfEndPoint(p1, p2, point);
            } else if (endSegment === "end" && p4.distanceTo(point) <= width) {
                return !isOutOfEndPoint(p4, p3, point);
            }

            //the approach is not entirely correct but is close and the alternatives are solving a 6th degree polynomial or testing the segment points
            var points = [ p1, p2, p3, p4 ];
            if (hasRootsInRange(points, point, "x", "y", width) || hasRootsInRange(points, point, "y", "x", width)) {
                return true;
            }
            var rotation = transform$1().rotate(45, point);
            var rotatedPoints = [ p1.transformCopy(rotation), p2.transformCopy(rotation), p3.transformCopy(rotation), p4.transformCopy(rotation) ];
            return hasRootsInRange(rotatedPoints, point, "x", "y", width) || hasRootsInRange(rotatedPoints, point, "y", "x", width);
        }
    };

    Segment.prototype._isOnLineTo = function _isOnLineTo (segment, point, width) {
        var p1 = this.anchor();
        var p2 = segment.anchor();
        var angle = deg(Math.atan2(p2.y - p1.y, p2.x - p1.x));
        var rect = new Rect([ p1.x, p1.y - width / 2 ], [ p1.distanceTo(p2), width ]);
        return rect.containsPoint(point.transformCopy(transform$1().rotate(-angle, p1)));
    };

    Segment.prototype._isOnPathTo = function _isOnPathTo (segment, point, width, endSegment) {
        var isOnPath;
        if (this.controlOut() && segment.controlIn()) {
            isOnPath = this._isOnCurveTo(segment, point, width / 2, endSegment);
        } else {
            isOnPath = this._isOnLineTo(segment, point, width);
        }
        return isOnPath;
    };

    return Segment;
}(Class));

definePointAccessors(Segment.prototype, [ "anchor", "controlIn", "controlOut" ]);
ObserversMixin.extend(Segment.prototype);

function arrayLimits(arr) {
    var length = arr.length;
    var min = MAX_NUM;
    var max = MIN_NUM;

    for (var i = 0; i < length; i ++) {
        max = Math.max(max, arr[i]);
        min = Math.min(min, arr[i]);
    }

    return {
        min: min,
        max: max
    };
}

var Path = (function (Element) {
    function Path(options) {
        Element.call(this, options);
        this.segments = new GeometryElementsArray();
        this.segments.addObserver(this);

        if (!defined(this.options.stroke)) {
            this.stroke("#000");

            if (!defined(this.options.stroke.lineJoin)) {
                this.options.set("stroke.lineJoin", "miter");
            }
        }
    }

    if ( Element ) Path.__proto__ = Element;
    Path.prototype = Object.create( Element && Element.prototype );
    Path.prototype.constructor = Path;

    Path.prototype.moveTo = function moveTo (x, y) {
        this.suspend();
        this.segments.elements([]);
        this.resume();

        this.lineTo(x, y);

        return this;
    };

    Path.prototype.lineTo = function lineTo (x, y) {
        var point = defined(y) ? new Point(x, y) : x;
        var segment = new Segment(point);

        this.segments.push(segment);

        return this;
    };

    Path.prototype.curveTo = function curveTo (controlOut, controlIn, point) {
        if (this.segments.length > 0) {
            var lastSegment = last(this.segments);
            var segment = new Segment(point, controlIn);
            this.suspend();
            lastSegment.controlOut(controlOut);
            this.resume();

            this.segments.push(segment);
        }

        return this;
    };

    Path.prototype.arc = function arc (startAngle, endAngle, radiusX, radiusY, anticlockwise) {
        if (this.segments.length > 0) {
            var lastSegment = last(this.segments);
            var anchor = lastSegment.anchor();
            var start = rad(startAngle);
            var center = new Point(anchor.x - radiusX * Math.cos(start),
                anchor.y - radiusY * Math.sin(start));
            var arc = new Arc$2(center, {
                startAngle: startAngle,
                endAngle: endAngle,
                radiusX: radiusX,
                radiusY: radiusY,
                anticlockwise: anticlockwise
            });

            this._addArcSegments(arc);
        }

        return this;
    };

    Path.prototype.arcTo = function arcTo (end, rx, ry, largeArc, swipe, rotation) {
        if (this.segments.length > 0) {
            var lastSegment = last(this.segments);
            var anchor = lastSegment.anchor();
            var arc = Arc$2.fromPoints(anchor, end, rx, ry, largeArc, swipe, rotation);

            this._addArcSegments(arc);
        }
        return this;
    };

    Path.prototype._addArcSegments = function _addArcSegments (arc) {
        var this$1 = this;

        this.suspend();

        var curvePoints = arc.curvePoints();

        for (var i = 1; i < curvePoints.length; i += 3) {
            this$1.curveTo(curvePoints[i], curvePoints[i + 1], curvePoints[i + 2]);
        }

        this.resume();
        this.geometryChange();
    };

    Path.prototype.close = function close () {
        this.options.closed = true;
        this.geometryChange();

        return this;
    };

    Path.prototype.rawBBox = function rawBBox () {
        return this._bbox();
    };

    Path.prototype._containsPoint = function _containsPoint (point) {
        var segments = this.segments;
        var length = segments.length;
        var intersectionsCount = 0;
        var previous, current;

        for (var idx = 1; idx < length; idx++) {
            previous = segments[idx - 1];
            current = segments[idx];
            intersectionsCount += previous._intersectionsTo(current, point);
        }

        if (this.options.closed || !segments[0].anchor().equals(segments[length - 1].anchor())) {
            intersectionsCount += lineIntersectionsCount(segments[0].anchor(), segments[length - 1].anchor(), point);
        }

        return intersectionsCount % 2 !== 0;
    };

    Path.prototype._isOnPath = function _isOnPath (point, width) {
        var segments = this.segments;
        var length = segments.length;
        var pathWidth = width || this.options.stroke.width;

        if (length > 1) {
            if (segments[0]._isOnPathTo(segments[1], point, pathWidth, "start")) {
                return true;
            }

            for (var idx = 2; idx <= length - 2; idx++) {
                if (segments[idx - 1]._isOnPathTo(segments[idx], point, pathWidth)) {
                    return true;
                }
            }

            if (segments[length - 2]._isOnPathTo(segments[length - 1], point, pathWidth, "end")) {
                return true;
            }
        }
        return false;
    };

    Path.prototype._bbox = function _bbox (matrix) {
        var segments = this.segments;
        var length = segments.length;
        var boundingBox;

        if (length === 1) {
            var anchor = segments[0].anchor().transformCopy(matrix);
            boundingBox = new Rect(anchor, Size.ZERO);
        } else if (length > 0) {
            for (var i = 1; i < length; i++) {
                var segmentBox = segments[i - 1].bboxTo(segments[i], matrix);
                if (boundingBox) {
                    boundingBox = Rect.union(boundingBox, segmentBox);
                } else {
                    boundingBox = segmentBox;
                }
            }
        }

        return boundingBox;
    };

    Path.fromRect = function fromRect (rect, options) {
        return new Path(options)
            .moveTo(rect.topLeft())
            .lineTo(rect.topRight())
            .lineTo(rect.bottomRight())
            .lineTo(rect.bottomLeft())
            .close();
    };

    Path.fromPoints = function fromPoints (points, options) {
        if (points) {
            var path = new Path(options);

            for (var i = 0; i < points.length; i++) {
                var point = Point.create(points[i]);
                if (point) {
                    if (i === 0) {
                        path.moveTo(point);
                    } else {
                        path.lineTo(point);
                    }
                }
            }

            return path;
        }
    };

    Path.fromArc = function fromArc (arc, options) {
        var path = new Path(options);
        var startAngle = arc.startAngle;
        var start = arc.pointAt(startAngle);
        path.moveTo(start.x, start.y);
        path.arc(startAngle, arc.endAngle, arc.radiusX, arc.radiusY, arc.anticlockwise);
        return path;
    };

    return Path;
}(Element$1));

Path.prototype.nodeType = "Path";

Paintable.extend(Path.prototype);
Measurable.extend(Path.prototype);

var DEFAULT_STROKE$1 = "#000";

var Arc = (function (Element) {
    function Arc(geometry, options) {
        if ( geometry === void 0 ) geometry = new Arc$2();
        if ( options === void 0 ) options = {};

        Element.call(this, options);

        this.geometry(geometry);

        if (!defined(this.options.stroke)) {
            this.stroke(DEFAULT_STROKE$1);
        }
    }

    if ( Element ) Arc.__proto__ = Element;
    Arc.prototype = Object.create( Element && Element.prototype );
    Arc.prototype.constructor = Arc;

    Arc.prototype._bbox = function _bbox (matrix) {
        return this._geometry.bbox(matrix);
    };

    Arc.prototype.rawBBox = function rawBBox () {
        return this.geometry().bbox();
    };

    Arc.prototype.toPath = function toPath () {
        var path = new Path();
        var curvePoints = this.geometry().curvePoints();

        if (curvePoints.length > 0) {
            path.moveTo(curvePoints[0].x, curvePoints[0].y);

            for (var i = 1; i < curvePoints.length; i += 3) {
                path.curveTo(curvePoints[i], curvePoints[i + 1], curvePoints[i + 2]);
            }
        }

        return path;
    };

    Arc.prototype._containsPoint = function _containsPoint (point) {
        return this.geometry().containsPoint(point);
    };

    Arc.prototype._isOnPath = function _isOnPath (point) {
        return this.geometry()._isOnPath(point, this.options.stroke.width / 2);
    };

    return Arc;
}(Element$1));

Arc.prototype.nodeType = "Arc";

Paintable.extend(Arc.prototype);
Measurable.extend(Arc.prototype);
defineGeometryAccessors(Arc.prototype, [ "geometry" ]);

function elementsBoundingBox(elements, applyTransform, transformation) {
    var boundingBox;

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.visible()) {
            var elementBoundingBox = applyTransform ? element.bbox(transformation) : element.rawBBox();
            if (elementBoundingBox) {
                if (boundingBox) {
                    boundingBox = Rect.union(boundingBox, elementBoundingBox);
                } else {
                    boundingBox = elementBoundingBox;
                }
            }
        }
    }

    return boundingBox;
}

function elementsClippedBoundingBox(elements, transformation) {
    var boundingBox;

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.visible()) {
            var elementBoundingBox = element.clippedBBox(transformation);
            if (elementBoundingBox) {
                if (boundingBox) {
                    boundingBox = Rect.union(boundingBox, elementBoundingBox);
                } else {
                    boundingBox = elementBoundingBox;
                }
            }
        }
    }

    return boundingBox;
}

var MultiPath = (function (Element) {
    function MultiPath(options) {
        Element.call(this, options);
        this.paths = new GeometryElementsArray();
        this.paths.addObserver(this);

        if (!defined(this.options.stroke)) {
            this.stroke("#000");
        }
    }

    if ( Element ) MultiPath.__proto__ = Element;
    MultiPath.prototype = Object.create( Element && Element.prototype );
    MultiPath.prototype.constructor = MultiPath;

    MultiPath.prototype.moveTo = function moveTo (x, y) {
        var path = new Path();
        path.moveTo(x, y);

        this.paths.push(path);

        return this;
    };

    MultiPath.prototype.lineTo = function lineTo (x, y) {
        if (this.paths.length > 0) {
            last(this.paths).lineTo(x, y);
        }

        return this;
    };

    MultiPath.prototype.curveTo = function curveTo (controlOut, controlIn, point) {
        if (this.paths.length > 0) {
            last(this.paths).curveTo(controlOut, controlIn, point);
        }

        return this;
    };

    MultiPath.prototype.arc = function arc (startAngle, endAngle, radiusX, radiusY, anticlockwise) {
        if (this.paths.length > 0) {
            last(this.paths).arc(startAngle, endAngle, radiusX, radiusY, anticlockwise);
        }

        return this;
    };

    MultiPath.prototype.arcTo = function arcTo (end, rx, ry, largeArc, swipe, rotation) {
        if (this.paths.length > 0) {
            last(this.paths).arcTo(end, rx, ry, largeArc, swipe, rotation);
        }

        return this;
    };

    MultiPath.prototype.close = function close () {
        if (this.paths.length > 0) {
            last(this.paths).close();
        }

        return this;
    };

    MultiPath.prototype._bbox = function _bbox (matrix) {
        return elementsBoundingBox(this.paths, true, matrix);
    };

    MultiPath.prototype.rawBBox = function rawBBox () {
        return elementsBoundingBox(this.paths, false);
    };

    MultiPath.prototype._containsPoint = function _containsPoint (point) {
        var paths = this.paths;

        for (var idx = 0; idx < paths.length; idx++) {
            if (paths[idx]._containsPoint(point)) {
                return true;
            }
        }
        return false;
    };

    MultiPath.prototype._isOnPath = function _isOnPath (point) {
        var paths = this.paths;
        var width = this.options.stroke.width;

        for (var idx = 0; idx < paths.length; idx++) {
            if (paths[idx]._isOnPath(point, width)) {
                return true;
            }
        }
        return false;
    };

    MultiPath.prototype._clippedBBox = function _clippedBBox (transformation) {
        return elementsClippedBoundingBox(this.paths, this.currentTransform(transformation));
    };

    return MultiPath;
}(Element$1));

MultiPath.prototype.nodeType = "MultiPath";

Paintable.extend(MultiPath.prototype);
Measurable.extend(MultiPath.prototype);

var DEFAULT_FONT = "12px sans-serif";
var DEFAULT_FILL = "#000";

var Text = (function (Element) {
    function Text(content, position, options) {
        if ( position === void 0 ) position = new Point();
        if ( options === void 0 ) options = {};

        Element.call(this, options);

        this.content(content);
        this.position(position);

        if (!this.options.font) {
            this.options.font = DEFAULT_FONT;
        }

        if (!defined(this.options.fill)) {
            this.fill(DEFAULT_FILL);
        }
    }

    if ( Element ) Text.__proto__ = Element;
    Text.prototype = Object.create( Element && Element.prototype );
    Text.prototype.constructor = Text;

    Text.prototype.content = function content (value) {
        if (defined(value)) {
            this.options.set("content", value);
            return this;
        }

        return this.options.get("content");
    };

    Text.prototype.measure = function measure () {
        var metrics = measureText(this.content(), {
            font: this.options.get("font")
        });

        return metrics;
    };

    Text.prototype.rect = function rect () {
        var size = this.measure();
        var pos = this.position().clone();
        return new Rect(pos, [ size.width, size.height ]);
    };

    Text.prototype.bbox = function bbox (transformation) {
        var combinedMatrix = toMatrix(this.currentTransform(transformation));
        return this.rect().bbox(combinedMatrix);
    };

    Text.prototype.rawBBox = function rawBBox () {
        return this.rect().bbox();
    };

    Text.prototype._containsPoint = function _containsPoint (point) {
        return this.rect().containsPoint(point);
    };

    return Text;
}(Element$1));

Text.prototype.nodeType = "Text";

Paintable.extend(Text.prototype);

definePointAccessors(Text.prototype, [ "position" ]);

var Image$1 = (function (Element) {
    function Image(src, rect, options) {
        if ( rect === void 0 ) rect = new Rect();
        if ( options === void 0 ) options = {};

        Element.call(this, options);

        this.src(src);
        this.rect(rect);
    }

    if ( Element ) Image.__proto__ = Element;
    Image.prototype = Object.create( Element && Element.prototype );
    Image.prototype.constructor = Image;

    Image.prototype.src = function src (value) {
        if (defined(value)) {
            this.options.set("src", value);
            return this;
        }

        return this.options.get("src");
    };

    Image.prototype.bbox = function bbox (transformation) {
        var combinedMatrix = toMatrix(this.currentTransform(transformation));
        return this._rect.bbox(combinedMatrix);
    };

    Image.prototype.rawBBox = function rawBBox () {
        return this._rect.bbox();
    };

    Image.prototype._containsPoint = function _containsPoint (point) {
        return this._rect.containsPoint(point);
    };

    Image.prototype._hasFill = function _hasFill () {
        return this.src();
    };

    return Image;
}(Element$1));

Image$1.prototype.nodeType = "Image";

defineGeometryAccessors(Image$1.prototype, [ "rect" ]);

var Traversable = {
    extend: function(proto, childrenField) {
        proto.traverse = function(callback) {
            var children = this[childrenField];

            for (var i = 0; i < children.length; i++) {
                var child = children[i];

                if (child.traverse) {
                    child.traverse(callback);
                } else {
                    callback(child);
                }
            }

            return this;
        };
    }
};

var Group = (function (Element) {
    function Group(options) {
        Element.call(this, options);
        this.children = [];
    }

    if ( Element ) Group.__proto__ = Element;
    Group.prototype = Object.create( Element && Element.prototype );
    Group.prototype.constructor = Group;

    Group.prototype.childrenChange = function childrenChange (action, items, index) {
        this.trigger("childrenChange",{
            action: action,
            items: items,
            index: index
        });
    };

    Group.prototype.append = function append$1 () {
        append$1$1(this.children, arguments);
        this._reparent(arguments, this);

        this.childrenChange("add", arguments);

        return this;
    };

    Group.prototype.insert = function insert (index, element) {
        this.children.splice(index, 0, element);
        element.parent = this;

        this.childrenChange("add", [ element ], index);

        return this;
    };

    Group.prototype.insertAt = function insertAt (element, index) {
        return this.insert(index, element);
    };

    Group.prototype.remove = function remove (element) {
        var index = this.children.indexOf(element);
        if (index >= 0) {
            this.children.splice(index, 1);
            element.parent = null;
            this.childrenChange("remove", [ element ], index);
        }

        return this;
    };

    Group.prototype.removeAt = function removeAt (index) {
        if (0 <= index && index < this.children.length) {
            var element = this.children[index];
            this.children.splice(index, 1);
            element.parent = null;
            this.childrenChange("remove", [ element ], index);
        }

        return this;
    };

    Group.prototype.clear = function clear () {
        var items = this.children;
        this.children = [];
        this._reparent(items, null);

        this.childrenChange("remove", items, 0);

        return this;
    };

    Group.prototype.bbox = function bbox (transformation) {
        return elementsBoundingBox(this.children, true, this.currentTransform(transformation));
    };

    Group.prototype.rawBBox = function rawBBox () {
        return elementsBoundingBox(this.children, false);
    };

    Group.prototype._clippedBBox = function _clippedBBox (transformation) {
        return elementsClippedBoundingBox(this.children, this.currentTransform(transformation));
    };

    Group.prototype.currentTransform = function currentTransform (transformation) {
        return Element.prototype.currentTransform.call(this, transformation) || null;
    };

    Group.prototype.containsPoint = function containsPoint (point, parentTransform) {
        if (this.visible()) {
            var children = this.children;
            var transform = this.currentTransform(parentTransform);
            for (var idx = 0; idx < children.length; idx++) {
                if (children[idx].containsPoint(point, transform)) {
                    return true;
                }
            }
        }
        return false;
    };

    Group.prototype._reparent = function _reparent (elements, newParent) {
        var this$1 = this;

        for (var i = 0; i < elements.length; i++) {
            var child = elements[i];
            var parent = child.parent;
            if (parent && parent !== this$1 && parent.remove) {
                parent.remove(child);
            }

            child.parent = newParent;
        }
    };

    return Group;
}(Element$1));

Group.prototype.nodeType = "Group";

Traversable.extend(Group.prototype, "children");

function translateToPoint(point, bbox, element) {
    var transofrm = element.transform() || transform$1();
    var matrix = transofrm.matrix();
    matrix.e += point.x - bbox.origin.x;
    matrix.f += point.y - bbox.origin.y;

    transofrm.matrix(matrix);
    element.transform(transofrm);
}

function alignStart(size, rect, align, axis, sizeField) {
    var start;
    if (align === "start") {
        start = rect.origin[axis];
    } else if (align === "end") {
        start = rect.origin[axis] + rect.size[sizeField] - size;
    } else {
        start = rect.origin[axis] + (rect.size[sizeField] - size) / 2;
    }

    return start;
}

function alignStartReverse(size, rect, align, axis, sizeField) {
    var start;
    if (align === "start") {
        start = rect.origin[axis] + rect.size[sizeField] - size;
    } else if (align === "end") {
        start = rect.origin[axis];
    } else {
        start = rect.origin[axis] + (rect.size[sizeField] - size) / 2;
    }

    return start;
}

var DEFAULT_OPTIONS$1 = {
    alignContent: "start",
    justifyContent: "start",
    alignItems: "start",
    spacing: 0,
    orientation: "horizontal",
    lineSpacing: 0,
    wrap: true,
    revers: false
};

var forEach = function (elements, callback) {
    elements.forEach(callback);
};

var forEachReverse = function (elements, callback) {
    var length = elements.length;

    for (var idx = length - 1; idx >= 0; idx--) {
        callback(elements[idx], idx);
    }
};

var Layout = (function (Group$$1) {
    function Layout(rect, options) {
        Group$$1.call(this, Object.assign({}, DEFAULT_OPTIONS$1, options));
        this._rect = rect;
        this._fieldMap = {};
    }

    if ( Group$$1 ) Layout.__proto__ = Group$$1;
    Layout.prototype = Object.create( Group$$1 && Group$$1.prototype );
    Layout.prototype.constructor = Layout;

    Layout.prototype.rect = function rect (value) {
        if (value) {
            this._rect = value;
            return this;
        }

        return this._rect;
    };

    Layout.prototype._initMap = function _initMap () {
        var options = this.options;
        var fieldMap = this._fieldMap;
        if (options.orientation === "horizontal") {
            fieldMap.sizeField = "width";
            fieldMap.groupsSizeField = "height";
            fieldMap.groupAxis = "x";
            fieldMap.groupsAxis = "y";
        } else {
            fieldMap.sizeField = "height";
            fieldMap.groupsSizeField = "width";
            fieldMap.groupAxis = "y";
            fieldMap.groupsAxis = "x";
        }

        if (options.reverse) {
            this.forEach = forEachReverse;
            this.justifyAlign = alignStartReverse;
        } else {
            this.forEach = forEach;
            this.justifyAlign = alignStart;
        }
    };

    Layout.prototype.reflow = function reflow () {
        var this$1 = this;

        if (!this._rect || this.children.length === 0) {
            return;
        }
        this._initMap();

        if (this.options.transform) {
            this.transform(null);
        }

        var options = this.options;
        var rect = this._rect;
        var ref = this._initGroups();
        var groups = ref.groups;
        var groupsSize = ref.groupsSize;
        var ref$1 = this._fieldMap;
        var sizeField = ref$1.sizeField;
        var groupsSizeField = ref$1.groupsSizeField;
        var groupAxis = ref$1.groupAxis;
        var groupsAxis = ref$1.groupsAxis;
        var groupOrigin = new Point();
        var elementOrigin = new Point();
        var size = new Size();
        var groupStart = alignStart(groupsSize, rect, options.alignContent, groupsAxis, groupsSizeField);
        var elementStart, group, groupBox;

        var arrangeElements = function (bbox, idx) {
            var element = group.elements[idx];

            elementOrigin[groupAxis] = elementStart;
            elementOrigin[groupsAxis] = alignStart(bbox.size[groupsSizeField], groupBox, options.alignItems, groupsAxis, groupsSizeField);
            translateToPoint(elementOrigin, bbox, element);
            elementStart += bbox.size[sizeField] + options.spacing;
        };

        for (var groupIdx = 0; groupIdx < groups.length; groupIdx++) {
            group = groups[groupIdx];
            groupOrigin[groupAxis] = elementStart = this$1.justifyAlign(group.size, rect, options.justifyContent, groupAxis, sizeField);
            groupOrigin[groupsAxis] = groupStart;
            size[sizeField] = group.size;
            size[groupsSizeField] = group.lineSize;
            groupBox = new Rect(groupOrigin, size);
            this$1.forEach(group.bboxes, arrangeElements);

            groupStart += group.lineSize + options.lineSpacing;
        }

        if (!options.wrap && group.size > rect.size[sizeField]) {
            var scale = rect.size[sizeField] / groupBox.size[sizeField];
            var scaledStart = groupBox.topLeft().scale(scale, scale);
            var scaledSize = groupBox.size[groupsSizeField] * scale;
            var newStart = alignStart(scaledSize, rect, options.alignContent, groupsAxis, groupsSizeField);
            var transform = transform$1();
            if (groupAxis === "x") {
                transform.translate(rect.origin.x - scaledStart.x, newStart - scaledStart.y);
            } else {
                transform.translate(newStart - scaledStart.x, rect.origin.y - scaledStart.y);
            }
            transform.scale(scale, scale);

            this.transform(transform);
        }
    };

    Layout.prototype._initGroups = function _initGroups () {
        var this$1 = this;

        var ref = this;
        var options = ref.options;
        var children = ref.children;
        var lineSpacing = options.lineSpacing;
        var wrap = options.wrap;
        var spacing = options.spacing;
        var sizeField = this._fieldMap.sizeField;
        var group = this._newGroup();
        var groups = [];
        var addGroup = function() {
            groups.push(group);
            groupsSize += group.lineSize + lineSpacing;
        };
        var groupsSize = -lineSpacing;

        for (var idx = 0; idx < children.length; idx++) {
            var element = children[idx];
            var bbox = children[idx].clippedBBox();
            if (element.visible() && bbox) {
                if (wrap && group.size + bbox.size[sizeField] + spacing > this$1._rect.size[sizeField]) {
                    if (group.bboxes.length === 0) {
                        this$1._addToGroup(group, bbox, element);
                        addGroup();
                        group = this$1._newGroup();
                    } else {
                        addGroup();
                        group = this$1._newGroup();
                        this$1._addToGroup(group, bbox, element);
                    }
                } else {
                    this$1._addToGroup(group, bbox, element);
                }
            }
        }

        if (group.bboxes.length) {
            addGroup();
        }

        return {
            groups: groups,
            groupsSize: groupsSize
        };
    };

    Layout.prototype._addToGroup = function _addToGroup (group, bbox, element) {
        group.size += bbox.size[this._fieldMap.sizeField] + this.options.spacing;
        group.lineSize = Math.max(bbox.size[this._fieldMap.groupsSizeField], group.lineSize);
        group.bboxes.push(bbox);
        group.elements.push(element);
    };

    Layout.prototype._newGroup = function _newGroup () {
        return {
            lineSize: 0,
            size: -this.options.spacing,
            bboxes: [],
            elements: []
        };
    };

    return Layout;
}(Group));

var Rect$2 = (function (Element) {
    function Rect$$1(geometry, options) {
        if ( geometry === void 0 ) geometry = new Rect();
        if ( options === void 0 ) options = {};

        Element.call(this, options);
        this.geometry(geometry);

        if (!defined(this.options.stroke)) {
            this.stroke("#000");
        }
    }

    if ( Element ) Rect$$1.__proto__ = Element;
    Rect$$1.prototype = Object.create( Element && Element.prototype );
    Rect$$1.prototype.constructor = Rect$$1;

    Rect$$1.prototype._bbox = function _bbox (matrix) {
        return this._geometry.bbox(matrix);
    };

    Rect$$1.prototype.rawBBox = function rawBBox () {
        return this._geometry.bbox();
    };

    Rect$$1.prototype._containsPoint = function _containsPoint (point) {
        return this._geometry.containsPoint(point);
    };

    Rect$$1.prototype._isOnPath = function _isOnPath (point) {
        return this.geometry()._isOnPath(point, this.options.stroke.width / 2);
    };

    return Rect$$1;
}(Element$1));

Rect$2.prototype.nodeType = "Rect";

Paintable.extend(Rect$2.prototype);
Measurable.extend(Rect$2.prototype);
defineGeometryAccessors(Rect$2.prototype, [ "geometry" ]);

function alignElements(elements, rect, alignment, axis, sizeField) {
    for (var idx = 0; idx < elements.length; idx++) {
        var bbox = elements[idx].clippedBBox();
        if (bbox) {
            var point = bbox.origin.clone();
            point[axis] = alignStart(bbox.size[sizeField], rect, alignment || "start", axis, sizeField);
            translateToPoint(point, bbox, elements[idx]);
        }
    }
}

function align(elements, rect, alignment) {
    alignElements(elements, rect, alignment, "x", "width");
}

function vAlign(elements, rect, alignment) {
    alignElements(elements, rect, alignment, "y", "height");
}

function stackElements(elements, stackAxis, otherAxis, sizeField) {
    if (elements.length > 1) {
        var origin = new Point();
        var previousBBox = elements[0].bbox;

        for (var idx = 1; idx < elements.length; idx++) {
            var element = elements[idx].element;
            var bbox = elements[idx].bbox;
            origin[stackAxis] = previousBBox.origin[stackAxis] + previousBBox.size[sizeField];
            origin[otherAxis] = bbox.origin[otherAxis];
            translateToPoint(origin, bbox, element);
            bbox.origin[stackAxis] = origin[stackAxis];
            previousBBox = bbox;
        }
    }
}

function createStackElements(elements) {
    var stackElements = [];

    for (var idx = 0; idx < elements.length; idx++) {
        var element = elements[idx];
        var bbox = element.clippedBBox();
        if (bbox) {
            stackElements.push({
                element: element,
                bbox: bbox
            });
        }
    }

    return stackElements;
}

function stack(elements) {
    stackElements(createStackElements(elements), "x", "y", "width");
}

function vStack(elements) {
    stackElements(createStackElements(elements), "y", "x", "height");
}

function getStacks(elements, rect, sizeField) {
    var maxSize = rect.size[sizeField];
    var stacks = [];
    var stack = [];
    var stackSize = 0;
    var element, bbox;

    var addElementToStack = function() {
        stack.push({
            element: element,
            bbox: bbox
        });
    };

    for (var idx = 0; idx < elements.length; idx++) {
        element = elements[idx];

        bbox = element.clippedBBox();
        if (bbox) {
            var size = bbox.size[sizeField];
            if (stackSize + size > maxSize) {
                if (stack.length) {
                    stacks.push(stack);
                    stack = [];
                    addElementToStack();
                    stackSize = size;
                } else {
                    addElementToStack();
                    stacks.push(stack);
                    stack = [];
                    stackSize = 0;
                }
            } else {
                addElementToStack();
                stackSize += size;
            }
        }
    }

    if (stack.length) {
        stacks.push(stack);
    }

    return stacks;
}

function wrapElements(elements, rect, axis, otherAxis, sizeField) {
    var stacks = getStacks(elements, rect, sizeField);
    var origin = rect.origin.clone();
    var result = [];

    for (var idx = 0; idx < stacks.length; idx++) {
        var stack = stacks[idx];
        var startElement = stack[0];
        origin[otherAxis] = startElement.bbox.origin[otherAxis];
        translateToPoint(origin, startElement.bbox, startElement.element);
        startElement.bbox.origin[axis] = origin[axis];
        stackElements(stack, axis, otherAxis, sizeField);
        result.push([]);
        for (var elementIdx = 0; elementIdx < stack.length; elementIdx++) {
            result[idx].push(stack[elementIdx].element);
        }
    }
    return result;
}

function wrap(elements, rect) {
    return wrapElements(elements, rect, "x", "y", "width");
}

function vWrap(elements, rect) {
    return wrapElements(elements, rect, "y", "x", "height");
}

function fit(element, rect) {
    var bbox = element.clippedBBox();
    if (bbox) {
        var elementSize = bbox.size;
        var rectSize = rect.size;
        if (rectSize.width < elementSize.width || rectSize.height < elementSize.height) {
            var scale = Math.min(rectSize.width / elementSize.width, rectSize.height / elementSize.height);
            var transform = element.transform() || transform$1();
            transform.scale(scale, scale);
            element.transform(transform);
        }
    }
}

var StopsArray = (function (ElementsArray$$1) {
    function StopsArray () {
        ElementsArray$$1.apply(this, arguments);
    }

    if ( ElementsArray$$1 ) StopsArray.__proto__ = ElementsArray$$1;
    StopsArray.prototype = Object.create( ElementsArray$$1 && ElementsArray$$1.prototype );
    StopsArray.prototype.constructor = StopsArray;

    StopsArray.prototype._change = function _change () {
        this.optionsChange({
            field: "stops"
        });
    };

    return StopsArray;
}(ElementsArray));

function optionsAccessor(name) {
    return function(value) {
        if (defined(value)) {
            this.options.set(name, value);
            return this;
        }

        return this.options.get(name);
    };
}

function defineOptionsAccessors(fn, names) {
    for (var i = 0; i < names.length; i++) {
        fn[names[i]] = optionsAccessor(names[i]);
    }
}

var GradientStop = (function (Class$$1) {
    function GradientStop(offset, color, opacity) {
        Class$$1.call(this);

        this.options = new OptionsStore({
            offset: offset,
            color: color,
            opacity: defined(opacity) ? opacity : 1
        });
        this.options.addObserver(this);
    }

    if ( Class$$1 ) GradientStop.__proto__ = Class$$1;
    GradientStop.prototype = Object.create( Class$$1 && Class$$1.prototype );
    GradientStop.prototype.constructor = GradientStop;

    GradientStop.create = function create (arg) {
        if (defined(arg)) {
            var stop;
            if (arg instanceof GradientStop) {
                stop = arg;
            } else if (arg.length > 1) {
                stop = new GradientStop(arg[0], arg[1], arg[2]);
            } else {
                stop = new GradientStop(arg.offset, arg.color, arg.opacity);
            }

            return stop;
        }
    };

    return GradientStop;
}(Class));

defineOptionsAccessors(GradientStop.prototype, [ "offset", "color", "opacity" ]);
ObserversMixin.extend(GradientStop.prototype);

var Gradient = (function (Class$$1) {
    function Gradient(options) {
        if ( options === void 0 ) options = {};

        Class$$1.call(this);

        this.stops = new StopsArray(this._createStops(options.stops));
        this.stops.addObserver(this);
        this._userSpace = options.userSpace;
        this.id = definitionId();
    }

    if ( Class$$1 ) Gradient.__proto__ = Class$$1;
    Gradient.prototype = Object.create( Class$$1 && Class$$1.prototype );
    Gradient.prototype.constructor = Gradient;

    Gradient.prototype.userSpace = function userSpace (value) {
        if (defined(value)) {
            this._userSpace = value;
            this.optionsChange();
            return this;
        }

        return this._userSpace;
    };

    Gradient.prototype._createStops = function _createStops (stops) {
        if ( stops === void 0 ) stops = [];

        var result = [];
        for (var idx = 0; idx < stops.length; idx++) {
            result.push(GradientStop.create(stops[idx]));
        }

        return result;
    };

    Gradient.prototype.addStop = function addStop (offset, color, opacity) {
        this.stops.push(new GradientStop(offset, color, opacity));
    };

    Gradient.prototype.removeStop = function removeStop (stop) {
        var index = this.stops.indexOf(stop);
        if (index >= 0) {
            this.stops.splice(index, 1);
        }
    };

    return Gradient;
}(Class));

Gradient.prototype.nodeType = "Gradient";

ObserversMixin.extend(Gradient.prototype);

Object.assign(Gradient.prototype, {
    optionsChange: function(e) {
        this.trigger("optionsChange", {
            field: "gradient" + (e ? "." + e.field : ""),
            value: this
        });
    },

    geometryChange: function() {
        this.optionsChange();
    }
});

var LinearGradient = (function (Gradient$$1) {
    function LinearGradient(options) {
        if ( options === void 0 ) options = {};

        Gradient$$1.call(this, options);

        this.start(options.start || new Point());

        this.end(options.end || new Point(1, 0));
    }

    if ( Gradient$$1 ) LinearGradient.__proto__ = Gradient$$1;
    LinearGradient.prototype = Object.create( Gradient$$1 && Gradient$$1.prototype );
    LinearGradient.prototype.constructor = LinearGradient;

    return LinearGradient;
}(Gradient));

definePointAccessors(LinearGradient.prototype, [ "start", "end" ]);

var RadialGradient = (function (Gradient$$1) {
    function RadialGradient(options) {
        if ( options === void 0 ) options = {};

        Gradient$$1.call(this, options);

        this.center(options.center || new Point());
        this._radius = defined(options.radius) ? options.radius : 1;
        this._fallbackFill = options.fallbackFill;
    }

    if ( Gradient$$1 ) RadialGradient.__proto__ = Gradient$$1;
    RadialGradient.prototype = Object.create( Gradient$$1 && Gradient$$1.prototype );
    RadialGradient.prototype.constructor = RadialGradient;

    RadialGradient.prototype.radius = function radius (value) {
        if (defined(value)) {
            this._radius = value;
            this.geometryChange();
            return this;
        }

        return this._radius;
    };

    RadialGradient.prototype.fallbackFill = function fallbackFill (value) {
        if (defined(value)) {
            this._fallbackFill = value;
            this.optionsChange();
            return this;
        }

        return this._fallbackFill;
    };

    return RadialGradient;
}(Gradient));

definePointAccessors(RadialGradient.prototype, [ "center" ]);

function swing(position) {
    return 0.5 - Math.cos(position * Math.PI) / 2;
}

function linear(position) {
    return position;
}

function easeOutElastic(position, time, start, diff) {
    var s = 1.70158,
        p = 0,
        a = diff;

    if (position === 0) {
        return start;
    }

    if (position === 1) {
        return start + diff;
    }

    if (!p) {
        p = 0.5;
    }

    if (a < Math.abs(diff)) {
        a = diff;
        s = p / 4;
    } else {
        s = p / (2 * Math.PI) * Math.asin(diff / a);
    }

    return a * Math.pow(2, -10 * position) *
           Math.sin((Number(position) - s) * (1.1 * Math.PI) / p) + diff + start;
}


var easingFunctions = Object.freeze({
	swing: swing,
	linear: linear,
	easeOutElastic: easeOutElastic
});

var now$1 = Date.now || function() {
    return new Date().getTime();
};

var Animation = (function (Class$$1) {
    function Animation(element, options) {
        Class$$1.call(this);

        this.options = Object.assign({}, this.options, options);
        this.element = element;
    }

    if ( Class$$1 ) Animation.__proto__ = Class$$1;
    Animation.prototype = Object.create( Class$$1 && Class$$1.prototype );
    Animation.prototype.constructor = Animation;

    Animation.prototype.setup = function setup () {};
    Animation.prototype.step = function step () {};

    Animation.prototype.play = function play () {
        var this$1 = this;

        var options = this.options;
        var duration = options.duration;
        var delay = options.delay; if ( delay === void 0 ) delay = 0;
        var easing = easingFunctions[options.easing];
        var start = now$1() + delay;
        var finish = start + duration;

        if (duration === 0) {
            this.step(1);
            this.abort();
        } else {
            setTimeout(function () {
                var loop = function () {
                    if (this$1._stopped) {
                        return;
                    }

                    var wallTime = now$1();

                    var time = limitValue(wallTime - start, 0, duration);
                    var position = time / duration;
                    var easingPosition = easing(position, time, 0, 1, duration);

                    this$1.step(easingPosition);

                    if (wallTime < finish) {
                        animationFrameProxy(loop);
                    } else {
                        this$1.abort();
                    }
                };

                loop();
            }, delay);
        }
    };

    Animation.prototype.abort = function abort () {
        this._stopped = true;
    };

    Animation.prototype.destroy = function destroy () {
        this.abort();
    };

    return Animation;
}(Class));

Animation.prototype.options = {
    duration: 500,
    easing: "swing"
};

var AnimationFactory = (function (Class$$1) {
    function AnimationFactory() {
        Class$$1.call(this);

        this._items = [];
    }

    if ( Class$$1 ) AnimationFactory.__proto__ = Class$$1;
    AnimationFactory.prototype = Object.create( Class$$1 && Class$$1.prototype );
    AnimationFactory.prototype.constructor = AnimationFactory;

    AnimationFactory.prototype.register = function register (name, type) {
        this._items.push({
            name: name,
            type: type
        });
    };

    AnimationFactory.prototype.create = function create (element, options) {
        var items = this._items;
        var match;

        if (options && options.type) {
            var type = options.type.toLowerCase();
            for (var i = 0; i < items.length; i++) {
                if (items[i].name.toLowerCase() === type) {
                    match = items[i];
                    break;
                }
            }
        }

        if (match) {
            return new match.type(element, options);
        }
    };

    return AnimationFactory;
}(Class));

AnimationFactory.current = new AnimationFactory();

Animation.create = function(type, element, options) {
    return AnimationFactory.current.create(type, element, options);
};

var ShapeMap = {
    l: function(path, options) {
        var parameters = options.parameters;
        var position = options.position;

        for (var i = 0; i < parameters.length; i += 2) {
            var point = new Point(parameters[i], parameters[i + 1]);

            if (options.isRelative) {
                point.translateWith(position);
            }

            path.lineTo(point.x, point.y);

            position.x = point.x;
            position.y = point.y;
        }
    },

    c: function(path, options) {
        var parameters = options.parameters;
        var position = options.position;

        for (var i = 0; i < parameters.length; i += 6) {
            var controlOut = new Point(parameters[i], parameters[i + 1]);
            var controlIn = new Point(parameters[i + 2], parameters[i + 3]);
            var point = new Point(parameters[i + 4], parameters[i + 5]);
            if (options.isRelative) {
                controlIn.translateWith(position);
                controlOut.translateWith(position);
                point.translateWith(position);
            }

            path.curveTo(controlOut, controlIn, point);

            position.x = point.x;
            position.y = point.y;
        }
    },

    v: function(path, options) {
        var value = options.isRelative ? 0 : options.position.x;

        toLineParamaters(options.parameters, true, value);
        this.l(path, options);
    },

    h: function(path, options) {
        var value = options.isRelative ? 0 : options.position.y;

        toLineParamaters(options.parameters, false, value);
        this.l(path, options);
    },

    a: function(path, options) {
        var parameters = options.parameters;
        var position = options.position;

        for (var i = 0; i < parameters.length; i += 7) {
            var radiusX = parameters[i];
            var radiusY = parameters[i + 1];
            var rotation = parameters[i + 2];
            var largeArc = parameters[i + 3];
            var swipe = parameters[i + 4];
            var endPoint = new Point(parameters[i + 5], parameters[i + 6]);

            if (options.isRelative) {
                endPoint.translateWith(position);
            }
            if (position.x !== endPoint.x || position.y !== endPoint.y) {
                path.arcTo(endPoint, radiusX, radiusY, largeArc, swipe, rotation);

                position.x = endPoint.x;
                position.y = endPoint.y;
            }
        }
    },

    s: function(path, options) {
        var parameters = options.parameters;
        var position = options.position;
        var previousCommand = options.previousCommand;
        var lastControlIn;

        if (previousCommand === "s" || previousCommand === "c") {
            lastControlIn = last(last(path.paths).segments).controlIn();
        }

        for (var i = 0; i < parameters.length; i += 4) {
            var controlIn = new Point(parameters[i], parameters[i + 1]);
            var endPoint = new Point(parameters[i + 2], parameters[i + 3]);
            var controlOut = (void 0);

            if (options.isRelative) {
                controlIn.translateWith(position);
                endPoint.translateWith(position);
            }

            if (lastControlIn) {
                controlOut = reflectionPoint(lastControlIn, position);
            } else {
                controlOut = position.clone();
            }

            lastControlIn = controlIn;

            path.curveTo(controlOut, controlIn, endPoint);

            position.x = endPoint.x;
            position.y = endPoint.y;
        }
    },

    q: function(path, options) {
        var parameters = options.parameters;
        var position = options.position;

        for (var i = 0; i < parameters.length; i += 4) {
            var controlPoint = new Point(parameters[i], parameters[i + 1]);
            var endPoint = new Point(parameters[i + 2], parameters[i + 3]);

            if (options.isRelative) {
                controlPoint.translateWith(position);
                endPoint.translateWith(position);
            }

            var cubicControlPoints = quadraticToCubicControlPoints(position, controlPoint, endPoint);

            path.curveTo(cubicControlPoints.controlOut, cubicControlPoints.controlIn, endPoint);

            position.x = endPoint.x;
            position.y = endPoint.y;
        }
    },

    t: function(path, options) {
        var parameters = options.parameters;
        var position = options.position;
        var previousCommand = options.previousCommand;
        var controlPoint;

        if (previousCommand === "q" || previousCommand === "t") {
            var lastSegment = last(last(path.paths).segments);
            controlPoint = lastSegment.controlIn().clone()
                .translateWith(position.scaleCopy(-1 / 3))
                .scale(3 / 2);
        }

        for (var i = 0; i < parameters.length; i += 2) {
            var endPoint = new Point(parameters[i], parameters[i + 1]);
            if (options.isRelative) {
                endPoint.translateWith(position);
            }

            if (controlPoint) {
                controlPoint = reflectionPoint(controlPoint, position);
            } else {
                controlPoint = position.clone();
            }

            var cubicControlPoints = quadraticToCubicControlPoints(position, controlPoint, endPoint);

            path.curveTo(cubicControlPoints.controlOut, cubicControlPoints.controlIn, endPoint);

            position.x = endPoint.x;
            position.y = endPoint.y;
        }
    }
};

function toLineParamaters(parameters, isVertical, value) {
    var insertPosition = isVertical ? 0 : 1;

    for (var i = 0; i < parameters.length; i += 2) {
        parameters.splice(i + insertPosition, 0, value);
    }
}

function reflectionPoint(point, center) {
    if (point && center) {
        return center.scaleCopy(2).translate(-point.x, -point.y);
    }
}

var third = 1 / 3;

function quadraticToCubicControlPoints(position, controlPoint, endPoint) {
    var scaledPoint = controlPoint.clone().scale(2 / 3);
    return {
        controlOut: scaledPoint.clone().translateWith(position.scaleCopy(third)),
        controlIn: scaledPoint.translateWith(endPoint.scaleCopy(third))
    };
}

var SEGMENT_REGEX = /([a-df-z]{1})([^a-df-z]*)(z)?/gi;
var SPLIT_REGEX = /[,\s]?([+\-]?(?:\d*\.\d+|\d+)(?:[eE][+\-]?\d+)?)/g;
var MOVE = "m";
var CLOSE = "z";

function parseParameters(str) {
    var parameters = [];
    str.replace(SPLIT_REGEX, function(match, number) {
        parameters.push(parseFloat(number));
    });
    return parameters;
}

var PathParser = (function (Class$$1) {
    function PathParser () {
        Class$$1.apply(this, arguments);
    }

    if ( Class$$1 ) PathParser.__proto__ = Class$$1;
    PathParser.prototype = Object.create( Class$$1 && Class$$1.prototype );
    PathParser.prototype.constructor = PathParser;

    PathParser.prototype.parse = function parse (str, options) {
        var multiPath = new MultiPath(options);
        var position = new Point();
        var previousCommand;

        str.replace(SEGMENT_REGEX, function (match, element, params, closePath) {
            var command = element.toLowerCase();
            var isRelative = command === element;
            var parameters = parseParameters(params.trim());

            if (command === MOVE) {
                if (isRelative) {
                    position.x += parameters[0];
                    position.y += parameters[1];
                } else {
                    position.x = parameters[0];
                    position.y = parameters[1];
                }

                multiPath.moveTo(position.x, position.y);

                if (parameters.length > 2) {
                    command = "l";
                    parameters.splice(0, 2);
                }
            }

            if (ShapeMap[command]) {
                ShapeMap[command](
                    multiPath, {
                        parameters: parameters,
                        position: position,
                        isRelative: isRelative,
                        previousCommand: previousCommand
                    }
                );

                if (closePath && closePath.toLowerCase() === CLOSE) {
                    multiPath.close();
                }
            } else if (command !== MOVE) {
                throw new Error("Error while parsing SVG path. Unsupported command: " + command);
            }

            previousCommand = command;
        });

        return multiPath;
    };

    return PathParser;
}(Class));

PathParser.current = new PathParser();

Path.parse = function(str, options) {
    return PathParser.current.parse(str, options);
};

var SurfaceFactory = (function (Class$$1) {
    function SurfaceFactory() {
        Class$$1.call(this);

        this._items = [];
    }

    if ( Class$$1 ) SurfaceFactory.__proto__ = Class$$1;
    SurfaceFactory.prototype = Object.create( Class$$1 && Class$$1.prototype );
    SurfaceFactory.prototype.constructor = SurfaceFactory;

    SurfaceFactory.prototype.register = function register (name, type, order) {
        var items = this._items;
        var first = items[0];
        var entry = {
            name: name,
            type: type,
            order: order
        };

        if (!first || order < first.order) {
            items.unshift(entry);
        } else {
            items.push(entry);
        }
    };

    SurfaceFactory.prototype.create = function create (element, options) {
        var items = this._items;
        var match = items[0];

        if (options && options.type) {
            var preferred = options.type.toLowerCase();
            for (var i = 0; i < items.length; i++) {
                if (items[i].name === preferred) {
                    match = items[i];
                    break;
                }
            }
        }

        if (match) {
            return new match.type(element, options);
        }

        logToConsole(
            "Warning: Unable to create Kendo UI Drawing Surface. Possible causes:\n" +
            "- The browser does not support SVG and Canvas. User agent: " + (navigator.userAgent));
    };

    return SurfaceFactory;
}(Class));

SurfaceFactory.current = new SurfaceFactory();

var events = [
    "click",
    "mouseenter",
    "mouseleave",
    "mousemove",
    "resize",
    "tooltipOpen",
    "tooltipClose"
];

var Surface = (function (Observable$$1) {
    function Surface(element, options) {
        Observable$$1.call(this);

        this.options = Object.assign({}, options);
        this.element = element;

        this._click = this._handler("click");
        this._mouseenter = this._handler("mouseenter");
        this._mouseleave = this._handler("mouseleave");
        this._mousemove = this._handler("mousemove");

        this._visual = new Group();

        elementSize(element, this.options);

        this.bind(events, this.options);

        this._enableTracking();
    }

    if ( Observable$$1 ) Surface.__proto__ = Observable$$1;
    Surface.prototype = Object.create( Observable$$1 && Observable$$1.prototype );
    Surface.prototype.constructor = Surface;

    Surface.prototype.draw = function draw (element) {
        this._visual.children.push(element);
    };

    Surface.prototype.clear = function clear () {
        this._visual.children = [];
    };

    Surface.prototype.destroy = function destroy () {
        this._visual = null;
        this.unbind();
    };

    Surface.prototype.eventTarget = function eventTarget (e) {
        var this$1 = this;

        var domNode = eventElement(e);
        var node;

        while (!node && domNode) {
            node = domNode._kendoNode;
            if (domNode === this$1.element) {
                break;
            }

            domNode = domNode.parentElement;
        }

        if (node) {
            return node.srcElement;
        }
    };

    Surface.prototype.exportVisual = function exportVisual () {
        return this._visual;
    };

    Surface.prototype.getSize = function getSize () {
        return elementSize(this.element);
    };

    Surface.prototype.currentSize = function currentSize (size) {
        if (size) {
            this._size = size;
        } else {
            return this._size;
        }
    };

    Surface.prototype.setSize = function setSize (size) {
        elementSize(this.element, size);

        this.currentSize(size);
        this._resize();
    };

    Surface.prototype.resize = function resize (force) {
        var size = this.getSize();
        var currentSize = this.currentSize();

        if (force || (size.width > 0 || size.height > 0) && (!currentSize || size.width !== currentSize.width || size.height !== currentSize.height)) {
            this.currentSize(size);
            this._resize(size, force);
            this.trigger("resize", size);
        }
    };

    Surface.prototype.size = function size (value) {
        if (!value) {
            return this.getSize();
        }

        this.setSize(value);
    };

    Surface.prototype.suspendTracking = function suspendTracking () {
        this._suspendedTracking = true;
    };

    Surface.prototype.resumeTracking = function resumeTracking () {
        this._suspendedTracking = false;
    };

    Surface.prototype._enableTracking = function _enableTracking () {};

    Surface.prototype._resize = function _resize () {};

    Surface.prototype._handler = function _handler (eventName) {
        var this$1 = this;

        return function (e) {
            var node = this$1.eventTarget(e);
            if (node && !this$1._suspendedTracking) {
                this$1.trigger(eventName, {
                    element: node,
                    originalEvent: e,
                    type: eventName
                });
            }
        };
    };

    Surface.prototype._elementOffset = function _elementOffset () {
        var element = this.element;
        var ref = elementStyles(element, [ "paddingLeft", "paddingTop" ]);
        var paddingLeft = ref.paddingLeft;
        var paddingTop = ref.paddingTop;
        var ref$1 = elementOffset(element);
        var left = ref$1.left;
        var top = ref$1.top;

        return {
            left: left + parseInt(paddingLeft, 10),
            top: top + parseInt(paddingTop, 10)
        };
    };

    Surface.prototype._surfacePoint = function _surfacePoint (e) {
        var offset = this._elementOffset();
        var coord = eventCoordinates(e);
        var x = coord.x - offset.left;
        var y = coord.y - offset.top;

        return new Point(x, y);
    };

    return Surface;
}(Observable));

Surface.create = function(element, options) {
    return SurfaceFactory.current.create(element, options);
};

Surface.support = {};

var BaseNode = (function (Class$$1) {
    function BaseNode(srcElement) {
        Class$$1.call(this);

        this.childNodes = [];
        this.parent = null;

        if (srcElement) {
            this.srcElement = srcElement;
            this.observe();
        }
    }

    if ( Class$$1 ) BaseNode.__proto__ = Class$$1;
    BaseNode.prototype = Object.create( Class$$1 && Class$$1.prototype );
    BaseNode.prototype.constructor = BaseNode;

    BaseNode.prototype.destroy = function destroy () {
        var this$1 = this;

        if (this.srcElement) {
            this.srcElement.removeObserver(this);
        }

        var children = this.childNodes;
        for (var i = 0; i < children.length; i++) {
            this$1.childNodes[i].destroy();
        }

        this.parent = null;
    };

    BaseNode.prototype.load = function load () {};

    BaseNode.prototype.observe = function observe () {
        if (this.srcElement) {
            this.srcElement.addObserver(this);
        }
    };

    BaseNode.prototype.append = function append (node) {
        this.childNodes.push(node);
        node.parent = this;
    };

    BaseNode.prototype.insertAt = function insertAt (node, pos) {
        this.childNodes.splice(pos, 0, node);
        node.parent = this;
    };

    BaseNode.prototype.remove = function remove (index, count) {
        var this$1 = this;

        var end = index + count;
        for (var i = index; i < end; i++) {
            this$1.childNodes[i].removeSelf();
        }
        this.childNodes.splice(index, count);
    };

    BaseNode.prototype.removeSelf = function removeSelf () {
        this.clear();
        this.destroy();
    };

    BaseNode.prototype.clear = function clear () {
        this.remove(0, this.childNodes.length);
    };

    BaseNode.prototype.invalidate = function invalidate () {
        if (this.parent) {
            this.parent.invalidate();
        }
    };

    BaseNode.prototype.geometryChange = function geometryChange () {
        this.invalidate();
    };

    BaseNode.prototype.optionsChange = function optionsChange () {
        this.invalidate();
    };

    BaseNode.prototype.childrenChange = function childrenChange (e) {
        if (e.action === "add") {
            this.load(e.items, e.index);
        } else if (e.action === "remove") {
            this.remove(e.index, e.items.length);
        }

        this.invalidate();
    };

    return BaseNode;
}(Class));

function renderAttr(name, value) {
    return (defined(value) && value !== null) ? (" " + name + "='" + value + "' ") : "";
}

function renderAllAttr(attrs) {
    var output = "";
    for (var i = 0; i < attrs.length; i++) {
        output += renderAttr(attrs[i][0], attrs[i][1]);
    }

    return output;
}

function renderStyle(attrs) {
    var output = "";
    for (var i = 0; i < attrs.length; i++) {
        var value = attrs[i][1];
        if (defined(value)) {
            output += attrs[i][0] + ":" + value + ";";
        }
    }

    if (output !== "") {
        return output;
    }
}

var NODE_MAP = {};

var SVG_NS = "http://www.w3.org/2000/svg";
var NONE = "none";

var renderSVG = function(container, svg) {
    container.innerHTML = svg;
};

if (typeof document !== "undefined") {
    var testFragment = "<svg xmlns='" + SVG_NS + "'></svg>";
    var testContainer = document.createElement("div");
    var hasParser = typeof DOMParser !== "undefined";

    testContainer.innerHTML = testFragment;

    if (hasParser && testContainer.firstChild.namespaceURI !== SVG_NS) {
        renderSVG = function(container, svg) {
            var parser = new DOMParser();
            var chartDoc = parser.parseFromString(svg, "text/xml");
            var importedDoc = document.adoptNode(chartDoc.documentElement);

            container.innerHTML = "";
            container.appendChild(importedDoc);
        };
    }
}

var renderSVG$1 = renderSVG;

var TRANSFORM = "transform";
var DefinitionMap = {
    clip: "clip-path",
    fill: "fill"
};

function isDefinition(type, value) {
    return type === "clip" || (type === "fill" && (!value || value.nodeType === "Gradient"));
}

function baseUrl() {
    var base = document.getElementsByTagName("base")[0];
    var href = document.location.href;
    var hashIndex = href.indexOf("#");
    var url = "";

    if (base && !support.browser.msie) {
        if (hashIndex !== -1) {
            href = href.substring(0, hashIndex);
        }

        url = href;
    }

    return url;
}

function refUrl(id, skipBaseHref) {
    var base = skipBaseHref ? '' : baseUrl();
    return ("url(" + base + "#" + id + ")");
}

var Node = (function (BaseNode$$1) {
    function Node(srcElement, options) {
        BaseNode$$1.call(this, srcElement);
        this.definitions = {};

        this.options = options;
    }

    if ( BaseNode$$1 ) Node.__proto__ = BaseNode$$1;
    Node.prototype = Object.create( BaseNode$$1 && BaseNode$$1.prototype );
    Node.prototype.constructor = Node;

    Node.prototype.destroy = function destroy () {
        if (this.element) {
            this.element._kendoNode = null;
            this.element = null;
        }

        this.clearDefinitions();
        BaseNode$$1.prototype.destroy.call(this);
    };

    Node.prototype.load = function load (elements, pos) {
        var this$1 = this;

        for (var i = 0; i < elements.length; i++) {
            var srcElement = elements[i];
            var children = srcElement.children;

            var childNode = new NODE_MAP[srcElement.nodeType](srcElement, this$1.options);

            if (defined(pos)) {
                this$1.insertAt(childNode, pos);
            } else {
                this$1.append(childNode);
            }

            childNode.createDefinitions();

            if (children && children.length > 0) {
                childNode.load(children);
            }

            var element = this$1.element;
            if (element) {
                childNode.attachTo(element, pos);
            }
        }
    };

    Node.prototype.root = function root () {
        var root = this;

        while (root.parent) {
            root = root.parent;
        }

        return root;
    };

    Node.prototype.attachTo = function attachTo (domElement, pos) {
        var container = document.createElement("div");
        renderSVG$1(container,
            "<svg xmlns='" + SVG_NS + "' version='1.1'>" +
                this.render() +
            "</svg>"
        );

        var element = container.firstChild.firstChild;
        if (element) {
            if (defined(pos)) {
                domElement.insertBefore(element, domElement.childNodes[pos] || null);
            } else {
                domElement.appendChild(element);
            }
            this.setElement(element);
        }
    };

    Node.prototype.setElement = function setElement (element) {
        if (this.element) {
            this.element._kendoNode = null;
        }

        this.element = element;
        this.element._kendoNode = this;

        var nodes = this.childNodes;
        for (var i = 0; i < nodes.length; i++) {
            var childElement = element.childNodes[i];
            nodes[i].setElement(childElement);
        }
    };

    Node.prototype.clear = function clear () {
        this.clearDefinitions();

        if (this.element) {
            this.element.innerHTML = "";
        }

        var children = this.childNodes;
        for (var i = 0; i < children.length; i++) {
            children[i].destroy();
        }

        this.childNodes = [];
    };

    Node.prototype.removeSelf = function removeSelf () {
        if (this.element) {
            var parentNode = this.element.parentNode;
            if (parentNode) {
                parentNode.removeChild(this.element);
            }
            this.element = null;
        }

        BaseNode$$1.prototype.removeSelf.call(this);
    };

    Node.prototype.template = function template () {
        return this.renderChildren();
    };

    Node.prototype.render = function render () {
        return this.template();
    };

    Node.prototype.renderChildren = function renderChildren () {
        var nodes = this.childNodes;
        var output = "";

        for (var i = 0; i < nodes.length; i++) {
            output += nodes[i].render();
        }

        return output;
    };

    Node.prototype.optionsChange = function optionsChange (e) {
        var field = e.field;
        var value = e.value;

        if (field === "visible") {
            this.css("display", value ? "" : NONE);
        } else if (DefinitionMap[field] && isDefinition(field, value)) {
            this.updateDefinition(field, value);
        } else if (field === "opacity") {
            this.attr("opacity", value);
        } else if (field === "cursor") {
            this.css("cursor", value);
        }

        BaseNode$$1.prototype.optionsChange.call(this, e);
    };

    Node.prototype.attr = function attr (name, value) {
        if (this.element) {
            this.element.setAttribute(name, value);
        }
    };

    Node.prototype.allAttr = function allAttr (attrs) {
        var this$1 = this;

        for (var i = 0; i < attrs.length; i++) {
            this$1.attr(attrs[i][0], attrs[i][1]);
        }
    };

    Node.prototype.css = function css (name, value) {
        if (this.element) {
            this.element.style[name] = value;
        }
    };

    Node.prototype.allCss = function allCss (styles) {
        var this$1 = this;

        for (var i = 0; i < styles.length; i++) {
            this$1.css(styles[i][0], styles[i][1]);
        }
    };

    Node.prototype.removeAttr = function removeAttr (name) {
        if (this.element) {
            this.element.removeAttribute(name);
        }
    };

    Node.prototype.mapTransform = function mapTransform (transform) {
        var attrs = [];
        if (transform) {
            attrs.push([
                TRANSFORM,
                "matrix(" + transform.matrix().toString(6) + ")"
            ]);
        }

        return attrs;
    };

    Node.prototype.renderTransform = function renderTransform () {
        return renderAllAttr(
            this.mapTransform(this.srcElement.transform())
        );
    };

    Node.prototype.transformChange = function transformChange (value) {
        if (value) {
            this.allAttr(this.mapTransform(value));
        } else {
            this.removeAttr(TRANSFORM);
        }
    };

    Node.prototype.mapStyle = function mapStyle () {
        var options = this.srcElement.options;
        var style = [ [ "cursor", options.cursor ] ];

        if (options.visible === false) {
            style.push([ "display", NONE ]);
        }

        return style;
    };

    Node.prototype.renderStyle = function renderStyle$1 () {
        return renderAttr("style", renderStyle(this.mapStyle(true)));
    };

    Node.prototype.renderOpacity = function renderOpacity () {
        return renderAttr("opacity", this.srcElement.options.opacity);
    };

    Node.prototype.createDefinitions = function createDefinitions () {
        var srcElement = this.srcElement;
        var definitions = this.definitions;
        if (srcElement) {
            var options = srcElement.options;
            var hasDefinitions;

            for (var field in DefinitionMap) {
                var definition = options.get(field);
                if (definition && isDefinition(field, definition)) {
                    definitions[field] = definition;
                    hasDefinitions = true;
                }
            }
            if (hasDefinitions) {
                this.definitionChange({
                    action: "add",
                    definitions: definitions
                });
            }
        }
    };

    Node.prototype.definitionChange = function definitionChange (e) {
        if (this.parent) {
            this.parent.definitionChange(e);
        }
    };

    Node.prototype.updateDefinition = function updateDefinition (type, value) {
        var definitions = this.definitions;
        var current = definitions[type];
        var attr = DefinitionMap[type];
        var definition = {};
        if (current) {
            definition[type] = current;
            this.definitionChange({
                action: "remove",
                definitions: definition
            });
            delete definitions[type];
        }

        if (!value) {
            if (current) {
                this.removeAttr(attr);
            }
        } else {
            definition[type] = value;
            this.definitionChange({
                action: "add",
                definitions: definition
            });
            definitions[type] = value;
            this.attr(attr, this.refUrl(value.id));
        }
    };

    Node.prototype.clearDefinitions = function clearDefinitions () {
        var definitions = this.definitions;

        this.definitionChange({
            action: "remove",
            definitions: definitions
        });
        this.definitions = {};
    };

    Node.prototype.renderDefinitions = function renderDefinitions () {
        return renderAllAttr(this.mapDefinitions());
    };

    Node.prototype.mapDefinitions = function mapDefinitions () {
        var this$1 = this;

        var definitions = this.definitions;
        var attrs = [];

        for (var field in definitions) {
            attrs.push([ DefinitionMap[field], this$1.refUrl(definitions[field].id) ]);
        }

        return attrs;
    };

    Node.prototype.refUrl = function refUrl$1 (id) {
        var skipBaseHref = (this.options || {}).skipBaseHref;
        return refUrl(id, skipBaseHref);
    };

    return Node;
}(BaseNode));

var GradientStopNode = (function (Node$$1) {
    function GradientStopNode () {
        Node$$1.apply(this, arguments);
    }

    if ( Node$$1 ) GradientStopNode.__proto__ = Node$$1;
    GradientStopNode.prototype = Object.create( Node$$1 && Node$$1.prototype );
    GradientStopNode.prototype.constructor = GradientStopNode;

    GradientStopNode.prototype.template = function template () {
        return ("<stop " + (this.renderOffset()) + " " + (this.renderStyle()) + " />");
    };

    GradientStopNode.prototype.renderOffset = function renderOffset () {
        return renderAttr("offset", this.srcElement.offset());
    };

    GradientStopNode.prototype.mapStyle = function mapStyle () {
        var srcElement = this.srcElement;
        return [
            [ "stop-color", srcElement.color() ],
            [ "stop-opacity", srcElement.opacity() ]
        ];
    };

    GradientStopNode.prototype.optionsChange = function optionsChange (e) {
        if (e.field === "offset") {
            this.attr(e.field, e.value);
        } else if (e.field === "color" || e.field === "opacity") {
            this.css("stop-" + e.field, e.value);
        }
    };

    return GradientStopNode;
}(Node));

var GradientNode = (function (Node$$1) {
    function GradientNode(srcElement) {
        Node$$1.call(this, srcElement);

        this.id = srcElement.id;

        this.loadStops();
    }

    if ( Node$$1 ) GradientNode.__proto__ = Node$$1;
    GradientNode.prototype = Object.create( Node$$1 && Node$$1.prototype );
    GradientNode.prototype.constructor = GradientNode;

    GradientNode.prototype.loadStops = function loadStops () {
        var this$1 = this;

        var stops = this.srcElement.stops;
        var element = this.element;

        for (var idx = 0; idx < stops.length; idx++) {
            var stopNode = new GradientStopNode(stops[idx]);
            this$1.append(stopNode);
            if (element) {
                stopNode.attachTo(element);
            }
        }
    };

    GradientNode.prototype.optionsChange = function optionsChange (e) {
        if (e.field === "gradient.stops") {
            BaseNode.prototype.clear.call(this);
            this.loadStops();
        } else if (e.field === "gradient") {
            this.allAttr(this.mapCoordinates());
        }
    };

    GradientNode.prototype.renderCoordinates = function renderCoordinates () {
        return renderAllAttr(this.mapCoordinates());
    };

    GradientNode.prototype.mapSpace = function mapSpace () {
        return [ "gradientUnits", this.srcElement.userSpace() ? "userSpaceOnUse" : "objectBoundingBox" ];
    };

    return GradientNode;
}(Node));

var LinearGradientNode = (function (GradientNode$$1) {
    function LinearGradientNode () {
        GradientNode$$1.apply(this, arguments);
    }

    if ( GradientNode$$1 ) LinearGradientNode.__proto__ = GradientNode$$1;
    LinearGradientNode.prototype = Object.create( GradientNode$$1 && GradientNode$$1.prototype );
    LinearGradientNode.prototype.constructor = LinearGradientNode;

    LinearGradientNode.prototype.template = function template () {
        return ("<linearGradient id='" + (this.id) + "' " + (this.renderCoordinates()) + ">" + (this.renderChildren()) + "</linearGradient>");
    };

    LinearGradientNode.prototype.mapCoordinates = function mapCoordinates () {
        var srcElement = this.srcElement;
        var start = srcElement.start();
        var end = srcElement.end();
        var attrs = [
            [ "x1", start.x ],
            [ "y1", start.y ],
            [ "x2", end.x ],
            [ "y2", end.y ],
            this.mapSpace()
        ];

        return attrs;
    };

    return LinearGradientNode;
}(GradientNode));

var RadialGradientNode = (function (GradientNode$$1) {
    function RadialGradientNode () {
        GradientNode$$1.apply(this, arguments);
    }

    if ( GradientNode$$1 ) RadialGradientNode.__proto__ = GradientNode$$1;
    RadialGradientNode.prototype = Object.create( GradientNode$$1 && GradientNode$$1.prototype );
    RadialGradientNode.prototype.constructor = RadialGradientNode;

    RadialGradientNode.prototype.template = function template () {
        return ("<radialGradient id='" + (this.id) + "' " + (this.renderCoordinates()) + ">" + (this.renderChildren()) + "</radialGradient>");
    };

    RadialGradientNode.prototype.mapCoordinates = function mapCoordinates () {
        var srcElement = this.srcElement;
        var center = srcElement.center();
        var radius = srcElement.radius();
        var attrs = [
            [ "cx", center.x ],
            [ "cy", center.y ],
            [ "r", radius ],
            this.mapSpace()
        ];
        return attrs;
    };

    return RadialGradientNode;
}(GradientNode));

var ClipNode = (function (Node$$1) {
    function ClipNode(srcElement) {
        Node$$1.call(this);

        this.srcElement = srcElement;
        this.id = srcElement.id;

        this.load([ srcElement ]);
    }

    if ( Node$$1 ) ClipNode.__proto__ = Node$$1;
    ClipNode.prototype = Object.create( Node$$1 && Node$$1.prototype );
    ClipNode.prototype.constructor = ClipNode;

    ClipNode.prototype.template = function template () {
        return ("<clipPath id='" + (this.id) + "'>" + (this.renderChildren()) + "</clipPath>");
    };

    return ClipNode;
}(Node));

var DefinitionNode = (function (Node$$1) {
    function DefinitionNode() {
        Node$$1.call(this);
        this.definitionMap = {};
    }

    if ( Node$$1 ) DefinitionNode.__proto__ = Node$$1;
    DefinitionNode.prototype = Object.create( Node$$1 && Node$$1.prototype );
    DefinitionNode.prototype.constructor = DefinitionNode;

    DefinitionNode.prototype.attachTo = function attachTo (domElement) {
        this.element = domElement;
    };

    DefinitionNode.prototype.template = function template () {
        return ("<defs>" + (this.renderChildren()) + "</defs>");
    };

    DefinitionNode.prototype.definitionChange = function definitionChange (e) {
        var definitions = e.definitions;
        var action = e.action;

        if (action === "add") {
            this.addDefinitions(definitions);
        } else if (action === "remove") {
            this.removeDefinitions(definitions);
        }
    };

    DefinitionNode.prototype.createDefinition = function createDefinition (type, item) {
        var nodeType;
        if (type === "clip") {
            nodeType = ClipNode;
        } else if (type === "fill") {
            if (item instanceof LinearGradient) {
                nodeType = LinearGradientNode;
            } else if (item instanceof RadialGradient) {
                nodeType = RadialGradientNode;
            }
        }
        return new nodeType(item);
    };

    DefinitionNode.prototype.addDefinitions = function addDefinitions (definitions) {
        var this$1 = this;

        for (var field in definitions) {
            this$1.addDefinition(field, definitions[field]);
        }
    };

    DefinitionNode.prototype.addDefinition = function addDefinition (type, srcElement) {
        var ref = this;
        var element = ref.element;
        var definitionMap = ref.definitionMap;
        var id = srcElement.id;
        var mapItem = definitionMap[id];
        if (!mapItem) {
            var node = this.createDefinition(type, srcElement);
            definitionMap[id] = {
                element: node,
                count: 1
            };
            this.append(node);
            if (element) {
                node.attachTo(this.element);
            }
        } else {
            mapItem.count++;
        }
    };

    DefinitionNode.prototype.removeDefinitions = function removeDefinitions (definitions) {
        var this$1 = this;

        for (var field in definitions) {
            this$1.removeDefinition(definitions[field]);
        }
    };

    DefinitionNode.prototype.removeDefinition = function removeDefinition (srcElement) {
        var definitionMap = this.definitionMap;
        var id = srcElement.id;
        var mapItem = definitionMap[id];

        if (mapItem) {
            mapItem.count--;
            if (mapItem.count === 0) {
                this.remove(this.childNodes.indexOf(mapItem.element), 1);
                delete definitionMap[id];
            }
        }
    };

    return DefinitionNode;
}(Node));

var RootNode = (function (Node$$1) {
    function RootNode(options) {
        Node$$1.call(this);
        this.options = options;
        this.defs = new DefinitionNode();
    }

    if ( Node$$1 ) RootNode.__proto__ = Node$$1;
    RootNode.prototype = Object.create( Node$$1 && Node$$1.prototype );
    RootNode.prototype.constructor = RootNode;

    RootNode.prototype.attachTo = function attachTo (domElement) {
        this.element = domElement;
        this.defs.attachTo(domElement.firstElementChild);
    };

    RootNode.prototype.clear = function clear () {
        BaseNode.prototype.clear.call(this);
    };

    RootNode.prototype.template = function template () {
        return this.defs.render() + this.renderChildren();
    };

    RootNode.prototype.definitionChange = function definitionChange (e) {
        this.defs.definitionChange(e);
    };

    return RootNode;
}(Node));

var RTL = 'rtl';

function alignToScreen(element) {
    var ctm;

    try {
        ctm = element.getScreenCTM ? element.getScreenCTM() : null;
    } catch (e) { } // eslint-disable-line no-empty

    if (ctm) {
        var left = - ctm.e % 1;
        var top = - ctm.f % 1;
        var style = element.style;

        if (left !== 0 || top !== 0) {
            style.left = left + "px";
            style.top = top + "px";
        }
    }
}

var Surface$1 = (function (BaseSurface) {
    function Surface$$1(element, options) {
        BaseSurface.call(this, element, options);

        this._root = new RootNode(Object.assign({
            rtl: elementStyles(element, 'direction').direction === RTL
        }, this.options));

        renderSVG$1(this.element, this._template());

        this._rootElement = this.element.firstElementChild;

        alignToScreen(this._rootElement);

        this._root.attachTo(this._rootElement);

        bindEvents(this.element, {
            click: this._click,
            mouseover: this._mouseenter,
            mouseout: this._mouseleave,
            mousemove: this._mousemove
        });

        this.resize();
    }

    if ( BaseSurface ) Surface$$1.__proto__ = BaseSurface;
    Surface$$1.prototype = Object.create( BaseSurface && BaseSurface.prototype );
    Surface$$1.prototype.constructor = Surface$$1;

    Surface$$1.prototype.destroy = function destroy () {
        if (this._root) {
            this._root.destroy();
            this._root = null;
            this._rootElement = null;
            unbindEvents(this.element, {
                click: this._click,
                mouseover: this._mouseenter,
                mouseout: this._mouseleave,
                mousemove: this._mousemove
            });
        }

        BaseSurface.prototype.destroy.call(this);
    };

    Surface$$1.prototype.translate = function translate (offset) {
        var viewBox = (Math.round(offset.x)) + " " + (Math.round(offset.y)) + " " + (this._size.width) + " " + (this._size.height);

        this._offset = offset;
        this._rootElement.setAttribute("viewBox", viewBox);
    };

    Surface$$1.prototype.draw = function draw (element) {
        BaseSurface.prototype.draw.call(this, element);
        this._root.load([ element ]);
    };

    Surface$$1.prototype.clear = function clear () {
        BaseSurface.prototype.clear.call(this);
        this._root.clear();
    };

    Surface$$1.prototype.svg = function svg () {
        return "<?xml version='1.0' ?>" + this._template();
    };

    Surface$$1.prototype.exportVisual = function exportVisual () {
        var ref = this;
        var visual = ref._visual;
        var offset = ref._offset;

        if (offset) {
            var wrap = new Group();
            wrap.children.push(visual);

            wrap.transform(
                transform$1().translate(-offset.x, -offset.y)
            );

            visual = wrap;
        }

        return visual;
    };

    Surface$$1.prototype._resize = function _resize () {
        if (this._offset) {
            this.translate(this._offset);
        }
    };

    Surface$$1.prototype._template = function _template () {
        return ("<svg style='width: 100%; height: 100%; overflow: hidden;' xmlns='" + SVG_NS + "' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1'>" + (this._root.render()) + "</svg>");
    };

    return Surface$$1;
}(Surface));

Surface$1.prototype.type = "svg";

if (typeof document !== "undefined" && document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")) {
    Surface.support.svg = true;
    SurfaceFactory.current.register("svg", Surface$1, 10);
}

var GroupNode = (function (Node$$1) {
    function GroupNode () {
        Node$$1.apply(this, arguments);
    }

    if ( Node$$1 ) GroupNode.__proto__ = Node$$1;
    GroupNode.prototype = Object.create( Node$$1 && Node$$1.prototype );
    GroupNode.prototype.constructor = GroupNode;

    GroupNode.prototype.template = function template () {
        return ("<g" + (this.renderTransform() + this.renderStyle() + this.renderOpacity() + this.renderDefinitions()) + ">" + (this.renderChildren()) + "</g>");
    };

    GroupNode.prototype.optionsChange = function optionsChange (e) {
        if (e.field === "transform") {
            this.transformChange(e.value);
        }

        Node$$1.prototype.optionsChange.call(this, e);
    };

    return GroupNode;
}(Node));

NODE_MAP.Group = GroupNode;

var DASH_ARRAYS = {
    dot: [ 1.5, 3.5 ],
    dash: [ 4, 3.5 ],
    longdash: [ 8, 3.5 ],
    dashdot: [ 3.5, 3.5, 1.5, 3.5 ],
    longdashdot: [ 8, 3.5, 1.5, 3.5 ],
    longdashdotdot: [ 8, 3.5, 1.5, 3.5, 1.5, 3.5 ]
};

var SOLID = "solid";
var BUTT = "butt";

var ATTRIBUTE_MAP = {
    "fill.opacity": "fill-opacity",
    "stroke.color": "stroke",
    "stroke.width": "stroke-width",
    "stroke.opacity": "stroke-opacity"
};
var SPACE = " ";

var PathNode = (function (Node$$1) {
    function PathNode () {
        Node$$1.apply(this, arguments);
    }

    if ( Node$$1 ) PathNode.__proto__ = Node$$1;
    PathNode.prototype = Object.create( Node$$1 && Node$$1.prototype );
    PathNode.prototype.constructor = PathNode;

    PathNode.prototype.geometryChange = function geometryChange () {
        this.attr("d", this.renderData());
        this.invalidate();
    };

    PathNode.prototype.optionsChange = function optionsChange (e) {
        switch (e.field) {
            case "fill":
                if (e.value) {
                    this.allAttr(this.mapFill(e.value));
                } else {
                    this.removeAttr("fill");
                }
                break;

            case "fill.color":
                this.allAttr(this.mapFill({ color: e.value }));
                break;

            case "stroke":
                if (e.value) {
                    this.allAttr(this.mapStroke(e.value));
                } else {
                    this.removeAttr("stroke");
                }
                break;

            case "transform":
                this.transformChange(e.value);
                break;

            default:
                var name = ATTRIBUTE_MAP[e.field];
                if (name) {
                    this.attr(name, e.value);
                }
                break;
        }

        Node$$1.prototype.optionsChange.call(this, e);
    };

    PathNode.prototype.content = function content () {
        if (this.element) {
            this.element.textContent = this.srcElement.content();
        }
    };

    PathNode.prototype.renderData = function renderData () {
        return this.printPath(this.srcElement);
    };

    PathNode.prototype.printPath = function printPath (path) {
        var this$1 = this;

        var segments = path.segments;
        var length = segments.length;
        if (length > 0) {
            var parts = [];
            var output, currentType;

            for (var i = 1; i < length; i++) {
                var segmentType = this$1.segmentType(segments[i - 1], segments[i]);
                if (segmentType !== currentType) {
                    currentType = segmentType;
                    parts.push(segmentType);
                }

                if (segmentType === "L") {
                    parts.push(this$1.printPoints(segments[i].anchor()));
                } else {
                    parts.push(this$1.printPoints(segments[i - 1].controlOut(), segments[i].controlIn(), segments[i].anchor()));
                }
            }

            output = "M" + this.printPoints(segments[0].anchor()) + SPACE + parts.join(SPACE);
            if (path.options.closed) {
                output += "Z";
            }

            return output;
        }
    };

    PathNode.prototype.printPoints = function printPoints () {
        var points = arguments;
        var length = points.length;
        var result = [];

        for (var i = 0; i < length; i++) {
            result.push(points[i].toString(3));
        }

        return result.join(" ");
    };

    PathNode.prototype.segmentType = function segmentType (segmentStart, segmentEnd) {
        return segmentStart.controlOut() && segmentEnd.controlIn() ? "C" : "L";
    };

    PathNode.prototype.mapStroke = function mapStroke (stroke) {
        var attrs = [];

        if (stroke && !isTransparent(stroke.color)) {
            attrs.push([ "stroke", stroke.color ]);
            attrs.push([ "stroke-width", stroke.width ]);
            attrs.push([ "stroke-linecap", this.renderLinecap(stroke) ]);
            attrs.push([ "stroke-linejoin", stroke.lineJoin ]);

            if (defined(stroke.opacity)) {
                attrs.push([ "stroke-opacity", stroke.opacity ]);
            }

            if (defined(stroke.dashType)) {
                attrs.push([ "stroke-dasharray", this.renderDashType(stroke) ]);
            }
        } else {
            attrs.push([ "stroke", NONE ]);
        }

        return attrs;
    };

    PathNode.prototype.renderStroke = function renderStroke () {
        return renderAllAttr(
            this.mapStroke(this.srcElement.options.stroke)
        );
    };

    PathNode.prototype.renderDashType = function renderDashType (stroke) {
        var dashType = stroke.dashType;
        var width = stroke.width; if ( width === void 0 ) width = 1;

        if (dashType && dashType !== SOLID) {
            var dashArray = DASH_ARRAYS[dashType.toLowerCase()];
            var result = [];

            for (var i = 0; i < dashArray.length; i++) {
                result.push(dashArray[i] * width);
            }

            return result.join(" ");
        }
    };

    PathNode.prototype.renderLinecap = function renderLinecap (stroke) {
        var dashType = stroke.dashType;
        var lineCap = stroke.lineCap;

        return (dashType && dashType !== "solid") ? BUTT : lineCap;
    };

    PathNode.prototype.mapFill = function mapFill (fill) {
        var attrs = [];
        if (!(fill && fill.nodeType === "Gradient")) {
            if (fill && !isTransparent(fill.color)) {
                attrs.push([ "fill", fill.color ]);

                if (defined(fill.opacity)) {
                    attrs.push([ "fill-opacity", fill.opacity ]);
                }
            } else {
                attrs.push([ "fill", NONE ]);
            }
        }

        return attrs;
    };

    PathNode.prototype.renderFill = function renderFill () {
        return renderAllAttr(
            this.mapFill(this.srcElement.options.fill)
        );
    };

    PathNode.prototype.template = function template () {
        return "<path " + (this.renderStyle()) + " " + (this.renderOpacity()) + " " + (renderAttr('d', this.renderData())) +
                    "" + (this.renderStroke()) + (this.renderFill()) + (this.renderDefinitions()) + (this.renderTransform()) + "></path>";
    };

    return PathNode;
}(Node));

NODE_MAP.Path = PathNode;

var ArcNode = (function (PathNode$$1) {
    function ArcNode () {
        PathNode$$1.apply(this, arguments);
    }

    if ( PathNode$$1 ) ArcNode.__proto__ = PathNode$$1;
    ArcNode.prototype = Object.create( PathNode$$1 && PathNode$$1.prototype );
    ArcNode.prototype.constructor = ArcNode;

    ArcNode.prototype.renderData = function renderData () {
        return this.printPath(this.srcElement.toPath());
    };

    return ArcNode;
}(PathNode));

NODE_MAP.Arc = ArcNode;

var CircleNode = (function (PathNode$$1) {
    function CircleNode () {
        PathNode$$1.apply(this, arguments);
    }

    if ( PathNode$$1 ) CircleNode.__proto__ = PathNode$$1;
    CircleNode.prototype = Object.create( PathNode$$1 && PathNode$$1.prototype );
    CircleNode.prototype.constructor = CircleNode;

    CircleNode.prototype.geometryChange = function geometryChange () {
        var center = this.center();
        this.attr("cx", center.x);
        this.attr("cy", center.y);
        this.attr("r", this.radius());
        this.invalidate();
    };

    CircleNode.prototype.center = function center () {
        return this.srcElement.geometry().center;
    };

    CircleNode.prototype.radius = function radius () {
        return this.srcElement.geometry().radius;
    };

    CircleNode.prototype.template = function template () {
        return "<circle " + (this.renderStyle()) + " " + (this.renderOpacity()) +
                    "cx='" + (this.center().x) + "' cy='" + (this.center().y) + "' r='" + (this.radius()) + "'" +
                    (this.renderStroke()) + " " + (this.renderFill()) + " " + (this.renderDefinitions()) +
                    (this.renderTransform()) + " ></circle>";
    };

    return CircleNode;
}(PathNode));

NODE_MAP.Circle = CircleNode;

var RectNode = (function (PathNode$$1) {
    function RectNode () {
        PathNode$$1.apply(this, arguments);
    }

    if ( PathNode$$1 ) RectNode.__proto__ = PathNode$$1;
    RectNode.prototype = Object.create( PathNode$$1 && PathNode$$1.prototype );
    RectNode.prototype.constructor = RectNode;

    RectNode.prototype.geometryChange = function geometryChange () {
        var geometry = this.srcElement.geometry();
        this.attr("x", geometry.origin.x);
        this.attr("y", geometry.origin.y);
        this.attr("width", geometry.size.width);
        this.attr("height", geometry.size.height);
        this.invalidate();
    };

    RectNode.prototype.size = function size () {
        return this.srcElement.geometry().size;
    };

    RectNode.prototype.origin = function origin () {
        return this.srcElement.geometry().origin;
    };

    RectNode.prototype.template = function template () {
        return "<rect " + (this.renderStyle()) + " " + (this.renderOpacity()) + " x='" + (this.origin().x) + "' y='" + (this.origin().y) + "' " +
                    "width='" + (this.size().width) + "' height='" + (this.size().height) + "' " + (this.renderStroke()) + " " +
                    (this.renderFill()) + " " + (this.renderDefinitions()) + " " + (this.renderTransform()) + " />";
    };

    return RectNode;
}(PathNode));

NODE_MAP.Rect = RectNode;

var ImageNode = (function (PathNode$$1) {
    function ImageNode () {
        PathNode$$1.apply(this, arguments);
    }

    if ( PathNode$$1 ) ImageNode.__proto__ = PathNode$$1;
    ImageNode.prototype = Object.create( PathNode$$1 && PathNode$$1.prototype );
    ImageNode.prototype.constructor = ImageNode;

    ImageNode.prototype.geometryChange = function geometryChange () {
        this.allAttr(this.mapPosition());
        this.invalidate();
    };

    ImageNode.prototype.optionsChange = function optionsChange (e) {
        if (e.field === "src") {
            this.allAttr(this.mapSource());
        }

        PathNode$$1.prototype.optionsChange.call(this, e);
    };

    ImageNode.prototype.mapPosition = function mapPosition () {
        var rect = this.srcElement.rect();
        var tl = rect.topLeft();

        return [
            [ "x", tl.x ],
            [ "y", tl.y ],
            [ "width", rect.width() + "px" ],
            [ "height", rect.height() + "px" ]
        ];
    };

    ImageNode.prototype.renderPosition = function renderPosition () {
        return renderAllAttr(this.mapPosition());
    };

    ImageNode.prototype.mapSource = function mapSource (encode) {
        var src = this.srcElement.src();

        if (encode) {
            src = htmlEncode(src);
        }

        return [ [ "xlink:href", src ] ];
    };

    ImageNode.prototype.renderSource = function renderSource () {
        return renderAllAttr(this.mapSource(true));
    };

    ImageNode.prototype.template = function template () {
        return "<image preserveAspectRatio='none' " + (this.renderStyle()) + " " + (this.renderTransform()) + " " + (this.renderOpacity()) +
               (this.renderPosition()) + " " + (this.renderSource()) + " " + (this.renderDefinitions()) + ">" +
               "</image>";
    };

    return ImageNode;
}(PathNode));

NODE_MAP.Image = ImageNode;

function decodeEntities(text) {
    if (!text || !text.indexOf || text.indexOf("&") < 0) {
        return text;
    }

    var element = decodeEntities._element;
    element.innerHTML = text;
    return element.textContent || element.innerText;
}

if (typeof document !== "undefined") {
    decodeEntities._element = document.createElement("span");
}

var TextNode = (function (PathNode$$1) {
    function TextNode () {
        PathNode$$1.apply(this, arguments);
    }

    if ( PathNode$$1 ) TextNode.__proto__ = PathNode$$1;
    TextNode.prototype = Object.create( PathNode$$1 && PathNode$$1.prototype );
    TextNode.prototype.constructor = TextNode;

    TextNode.prototype.geometryChange = function geometryChange () {
        var pos = this.pos();
        this.attr("x", pos.x);
        this.attr("y", pos.y);
        this.invalidate();
    };

    TextNode.prototype.optionsChange = function optionsChange (e) {
        if (e.field === "font") {
            this.attr("style", renderStyle(this.mapStyle()));
            this.geometryChange();
        } else if (e.field === "content") {
            PathNode$$1.prototype.content.call(this, this.srcElement.content());
        }

        PathNode$$1.prototype.optionsChange.call(this, e);
    };

    TextNode.prototype.mapStyle = function mapStyle (encode) {
        var style = PathNode$$1.prototype.mapStyle.call(this, encode);
        var font = this.srcElement.options.font;

        if (encode) {
            font = htmlEncode(font);
        }

        style.push([ "font", font ]);

        return style;
    };

    TextNode.prototype.pos = function pos () {
        var pos = this.srcElement.position();
        var size = this.srcElement.measure();
        return pos.clone().setY(pos.y + size.baseline);
    };

    TextNode.prototype.renderContent = function renderContent () {
        var content = this.srcElement.content();
        content = decodeEntities(content);
        content = htmlEncode(content);

        return content;
    };

    TextNode.prototype.renderTextAnchor = function renderTextAnchor () {
        var anchor;

        if ((this.options || {}).rtl) {
            anchor = 'end';
        }

        return renderAttr("text-anchor", anchor);
    };

    TextNode.prototype.template = function template () {
        return "<text " + (this.renderTextAnchor()) + " " + (this.renderStyle()) + " " + (this.renderOpacity()) + " x='" + (this.pos().x) + "' y='" + (this.pos().y) + "'" +
                    (this.renderStroke()) + " " + (this.renderTransform()) + " " + (this.renderDefinitions()) +
                    (this.renderFill()) + ">" + (this.renderContent()) + "</text>";
    };

    return TextNode;
}(PathNode));

NODE_MAP.Text = TextNode;

var MultiPathNode = (function (PathNode$$1) {
    function MultiPathNode () {
        PathNode$$1.apply(this, arguments);
    }

    if ( PathNode$$1 ) MultiPathNode.__proto__ = PathNode$$1;
    MultiPathNode.prototype = Object.create( PathNode$$1 && PathNode$$1.prototype );
    MultiPathNode.prototype.constructor = MultiPathNode;

    MultiPathNode.prototype.renderData = function renderData () {
        var this$1 = this;

        var paths = this.srcElement.paths;

        if (paths.length > 0) {
            var result = [];

            for (var i = 0; i < paths.length; i++) {
                result.push(this$1.printPath(paths[i]));
            }

            return result.join(" ");
        }
    };

    return MultiPathNode;
}(PathNode));

NODE_MAP.MultiPath = MultiPathNode;



var geometry = Object.freeze({
	Circle: Circle$2,
	Arc: Arc$2,
	Rect: Rect,
	Point: Point,
	Segment: Segment,
	Matrix: Matrix,
	Size: Size,
	toMatrix: toMatrix,
	Transformation: Transformation,
	transform: transform$1
});

function exportGroup(group) {
    var root = new RootNode({
        skipBaseHref: true
    });
    var bbox = group.clippedBBox();
    var rootGroup = group;

    if (bbox) {
        var origin = bbox.getOrigin();
        var exportRoot = new Group();
        exportRoot.transform(transform$1().translate(-origin.x, -origin.y));
        exportRoot.children.push(group);
        rootGroup = exportRoot;
    }

    root.load([ rootGroup ]);

    var svg = "<?xml version='1.0' ?><svg xmlns='" + SVG_NS + "' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1'>" + (root.render()) + "</svg>";

    root.destroy();

    return svg;
}



var svg$1 = Object.freeze({
	Surface: Surface$1,
	RootNode: RootNode,
	Node: Node,
	GroupNode: GroupNode,
	ArcNode: ArcNode,
	CircleNode: CircleNode,
	RectNode: RectNode,
	ImageNode: ImageNode,
	TextNode: TextNode,
	PathNode: PathNode,
	MultiPathNode: MultiPathNode,
	DefinitionNode: DefinitionNode,
	ClipNode: ClipNode,
	GradientStopNode: GradientStopNode,
	LinearGradientNode: LinearGradientNode,
	RadialGradientNode: RadialGradientNode,
	exportGroup: exportGroup
});

var NODE_MAP$2 = {};

function renderPath(ctx, path) {
    var segments = path.segments;

    if (segments.length === 0) {
        return;
    }

    var segment = segments[0];
    var anchor = segment.anchor();
    ctx.moveTo(anchor.x, anchor.y);

    for (var i = 1; i < segments.length; i++) {
        segment = segments[i];
        anchor = segment.anchor();

        var prevSeg = segments[i - 1];
        var prevOut = prevSeg.controlOut();
        var controlIn = segment.controlIn();

        if (prevOut && controlIn) {
            ctx.bezierCurveTo(prevOut.x, prevOut.y,
                              controlIn.x, controlIn.y,
                              anchor.x, anchor.y);
        } else {
            ctx.lineTo(anchor.x, anchor.y);
        }
    }

    if (path.options.closed) {
        ctx.closePath();
    }
}

var Node$2 = (function (BaseNode$$1) {
    function Node(srcElement) {
        BaseNode$$1.call(this, srcElement);
        if (srcElement) {
            this.initClip();
        }
    }

    if ( BaseNode$$1 ) Node.__proto__ = BaseNode$$1;
    Node.prototype = Object.create( BaseNode$$1 && BaseNode$$1.prototype );
    Node.prototype.constructor = Node;

    Node.prototype.initClip = function initClip () {
        var clip = this.srcElement.clip();
        if (clip) {
            this.clip = clip;
            clip.addObserver(this);
        }
    };

    Node.prototype.clear = function clear () {
        if (this.srcElement) {
            this.srcElement.removeObserver(this);
        }

        this.clearClip();

        BaseNode$$1.prototype.clear.call(this);
    };

    Node.prototype.clearClip = function clearClip () {
        if (this.clip) {
            this.clip.removeObserver(this);
            delete this.clip;
        }
    };

    Node.prototype.setClip = function setClip (ctx) {
        if (this.clip) {
            ctx.beginPath();
            renderPath(ctx, this.clip);
            ctx.clip();
        }
    };

    Node.prototype.optionsChange = function optionsChange (e) {
        if (e.field === "clip") {
            this.clearClip();
            this.initClip();
        }

        BaseNode$$1.prototype.optionsChange.call(this, e);
    };

    Node.prototype.setTransform = function setTransform (ctx) {
        if (this.srcElement) {
            var transform = this.srcElement.transform();
            if (transform) {
                ctx.transform.apply(ctx, transform.matrix().toArray(6));
            }
        }
    };

    Node.prototype.loadElements = function loadElements (elements, pos, cors) {
        var this$1 = this;

        for (var i = 0; i < elements.length; i++) {
            var srcElement = elements[i];
            var children = srcElement.children;

            var childNode = new NODE_MAP$2[srcElement.nodeType](srcElement, cors);

            if (children && children.length > 0) {
                childNode.load(children, pos, cors);
            }

            if (defined(pos)) {
                this$1.insertAt(childNode, pos);
            } else {
                this$1.append(childNode);
            }
        }
    };

    Node.prototype.load = function load (elements, pos, cors) {
        this.loadElements(elements, pos, cors);

        this.invalidate();
    };

    Node.prototype.setOpacity = function setOpacity (ctx) {
        if (this.srcElement) {
            var opacity = this.srcElement.opacity();
            if (defined(opacity)) {
                this.globalAlpha(ctx, opacity);
            }
        }
    };

    Node.prototype.globalAlpha = function globalAlpha (ctx, value) {
        var opactity = value;
        if (opactity && ctx.globalAlpha) {
            opactity *= ctx.globalAlpha;
        }
        ctx.globalAlpha = opactity;
    };

    Node.prototype.visible = function visible () {
        var src = this.srcElement;
        return !src || (src && src.options.visible !== false);
    };

    return Node;
}(BaseNode));

var GroupNode$2 = (function (Node) {
    function GroupNode () {
        Node.apply(this, arguments);
    }

    if ( Node ) GroupNode.__proto__ = Node;
    GroupNode.prototype = Object.create( Node && Node.prototype );
    GroupNode.prototype.constructor = GroupNode;

    GroupNode.prototype.renderTo = function renderTo (ctx) {
        if (!this.visible()) {
            return;
        }

        ctx.save();

        this.setTransform(ctx);
        this.setClip(ctx);
        this.setOpacity(ctx);

        var childNodes = this.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            var child = childNodes[i];
            if (child.visible()) {
                child.renderTo(ctx);
            }
        }

        ctx.restore();
    };

    return GroupNode;
}(Node$2));

Traversable.extend(GroupNode$2.prototype, "childNodes");

NODE_MAP$2.Group = GroupNode$2;

var FRAME_DELAY = 1000 / 60;

var RootNode$2 = (function (GroupNode) {
    function RootNode(canvas) {
        GroupNode.call(this);

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        var invalidateHandler = this._invalidate.bind(this);
        this.invalidate = throttle(function () {
            animationFrameProxy(invalidateHandler);
        }, FRAME_DELAY);
    }

    if ( GroupNode ) RootNode.__proto__ = GroupNode;
    RootNode.prototype = Object.create( GroupNode && GroupNode.prototype );
    RootNode.prototype.constructor = RootNode;

    RootNode.prototype.destroy = function destroy () {
        GroupNode.prototype.destroy.call(this);
        this.canvas = null;
        this.ctx = null;
    };

    RootNode.prototype.load = function load (elements, pos, cors) {
        this.loadElements(elements, pos, cors);
        this._invalidate();
    };

    RootNode.prototype._invalidate = function _invalidate () {
        if (!this.ctx) {
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderTo(this.ctx);
    };

    return RootNode;
}(GroupNode$2));

Traversable.extend(RootNode$2.prototype, "childNodes");

var QuadRoot = (function (Class$$1) {
    function QuadRoot() {
        Class$$1.call(this);

        this.shapes = [];
    }

    if ( Class$$1 ) QuadRoot.__proto__ = Class$$1;
    QuadRoot.prototype = Object.create( Class$$1 && Class$$1.prototype );
    QuadRoot.prototype.constructor = QuadRoot;

    QuadRoot.prototype._add = function _add (shape, bbox) {
        this.shapes.push({
            bbox: bbox,
            shape: shape
        });
        shape._quadNode = this;
    };

    QuadRoot.prototype.pointShapes = function pointShapes (point) {
        var shapes = this.shapes;
        var length = shapes.length;
        var result = [];
        for (var idx = 0; idx < length; idx++) {
            if (shapes[idx].bbox.containsPoint(point)) {
                result.push(shapes[idx].shape);
            }
        }
        return result;
    };

    QuadRoot.prototype.insert = function insert (shape, bbox) {
        this._add(shape, bbox);
    };

    QuadRoot.prototype.remove = function remove (shape) {
        var shapes = this.shapes;
        var length = shapes.length;

        for (var idx = 0; idx < length; idx++) {
            if (shapes[idx].shape === shape) {
                shapes.splice(idx, 1);
                break;
            }
        }
    };

    return QuadRoot;
}(Class));

var QuadNode = (function (QuadRoot$$1) {
    function QuadNode(rect) {
        QuadRoot$$1.call(this);
        this.children = [];
        this.rect = rect;
    }

    if ( QuadRoot$$1 ) QuadNode.__proto__ = QuadRoot$$1;
    QuadNode.prototype = Object.create( QuadRoot$$1 && QuadRoot$$1.prototype );
    QuadNode.prototype.constructor = QuadNode;

    QuadNode.prototype.inBounds = function inBounds (rect) {
        var nodeRect = this.rect;
        var nodeBottomRight = nodeRect.bottomRight();
        var bottomRight = rect.bottomRight();
        var inBounds = nodeRect.origin.x <= rect.origin.x && nodeRect.origin.y <= rect.origin.y && bottomRight.x <= nodeBottomRight.x &&
            bottomRight.y <= nodeBottomRight.y;
        return inBounds;
    };

    QuadNode.prototype.pointShapes = function pointShapes (point) {
        var children = this.children;
        var length = children.length;
        var result = QuadRoot$$1.prototype.pointShapes.call(this, point);
        for (var idx = 0; idx < length; idx++) {
            append$1$1(result, children[idx].pointShapes(point));
        }
        return result;
    };

    QuadNode.prototype.insert = function insert (shape, bbox) {
        var children = this.children;
        var inserted = false;

        if (this.inBounds(bbox)) {
            if (this.shapes.length < 4) {
                this._add(shape, bbox);
            } else {
                if (!children.length) {
                    this._initChildren();
                }

                for (var idx = 0; idx < children.length; idx++) {
                    if (children[idx].insert(shape, bbox)) {
                        inserted = true;
                        break;
                    }
                }

                if (!inserted) {
                    this._add(shape, bbox);
                }
            }
            inserted = true;
        }

        return inserted;
    };

    QuadNode.prototype._initChildren = function _initChildren () {
        var ref = this;
        var rect = ref.rect;
        var children = ref.children;
        var center = rect.center();
        var halfWidth = rect.width() / 2;
        var halfHeight = rect.height() / 2;

        children.push(
            new QuadNode(new Rect([ rect.origin.x, rect.origin.y ], [ halfWidth, halfHeight ])),
            new QuadNode(new Rect([ center.x, rect.origin.y ], [ halfWidth, halfHeight ])),
            new QuadNode(new Rect([ rect.origin.x, center.y ], [ halfWidth, halfHeight ])),
            new QuadNode(new Rect([ center.x, center.y ], [ halfWidth, halfHeight ]))
        );
    };

    return QuadNode;
}(QuadRoot));

var ROOT_SIZE = 3000;
var LEVEL_STEP = 10000;
var MAX_LEVEL = 75;

var ShapesQuadTree = (function (Class$$1) {
    function ShapesQuadTree() {
        Class$$1.call(this);

        this.initRoots();
    }

    if ( Class$$1 ) ShapesQuadTree.__proto__ = Class$$1;
    ShapesQuadTree.prototype = Object.create( Class$$1 && Class$$1.prototype );
    ShapesQuadTree.prototype.constructor = ShapesQuadTree;

    ShapesQuadTree.prototype.initRoots = function initRoots () {
        this.rootMap = {};
        this.root = new QuadRoot();
        this.rootElements = [];
    };

    ShapesQuadTree.prototype.clear = function clear () {
        var this$1 = this;

        var rootElements = this.rootElements;
        for (var idx = 0; idx < rootElements.length; idx++) {
            this$1.remove(rootElements[idx]);
        }
        this.initRoots();
    };

    ShapesQuadTree.prototype.pointShape = function pointShape (point) {
        var sectorRoot = ( this.rootMap[ Math.floor( point.x / ROOT_SIZE ) ] || {} )[ Math.floor( point.y / ROOT_SIZE ) ];
        var result = this.root.pointShapes(point);

        if (sectorRoot) {
            result = result.concat(sectorRoot.pointShapes(point));
        }

        this.assignZindex(result);

        result.sort(zIndexComparer);
        for (var idx = 0; idx < result.length; idx++) {
            if (result[idx].containsPoint(point)) {
                return result[idx];
            }
        }
    };

    ShapesQuadTree.prototype.assignZindex = function assignZindex (elements) {
        var this$1 = this;

        for (var idx = 0; idx < elements.length; idx++) {
            var element = elements[idx];
            var zIndex = 0;
            var levelWeight = Math.pow(LEVEL_STEP, MAX_LEVEL);
            var parents = [];

            while (element) {
                parents.push(element);
                element = element.parent;
            }

            while (parents.length) {
                element = parents.pop();
                zIndex += ((element.parent ? element.parent.children : this$1.rootElements).indexOf(element) + 1) * levelWeight;
                levelWeight /= LEVEL_STEP;
            }

            elements[idx]._zIndex = zIndex;
        }
    };

    ShapesQuadTree.prototype.optionsChange = function optionsChange (e) {
        if (e.field === "transform" || e.field === "stroke.width") {
            this.bboxChange(e.element);
        }
    };

    ShapesQuadTree.prototype.geometryChange = function geometryChange (e) {
        this.bboxChange(e.element);
    };

    ShapesQuadTree.prototype.bboxChange = function bboxChange (element) {
        var this$1 = this;

        if (element.nodeType === "Group") {
            for (var idx = 0; idx < element.children.length; idx++) {
                this$1.bboxChange(element.children[idx]);
            }
        } else {
            if (element._quadNode) {
                element._quadNode.remove(element);
            }
            this._insertShape(element);
        }
    };

    ShapesQuadTree.prototype.add = function add (elements) {
        var elementsArray = Array.isArray(elements) ? elements.slice(0) : [ elements ];

        append$1$1(this.rootElements, elementsArray);
        this._insert(elementsArray);
    };

    ShapesQuadTree.prototype.childrenChange = function childrenChange (e) {
        var this$1 = this;

        if (e.action === "remove") {
            for (var idx = 0; idx < e.items.length; idx++) {
                this$1.remove(e.items[idx]);
            }
        } else {
            this._insert(Array.prototype.slice.call(e.items, 0));
        }
    };

    ShapesQuadTree.prototype._insert = function _insert (elements) {
        var this$1 = this;

        var element;

        while (elements.length > 0) {
            element = elements.pop();
            element.addObserver(this$1);
            if (element.nodeType === "Group") {
                append$1$1(elements, element.children);
            } else {
                this$1._insertShape(element);
            }
        }
    };

    ShapesQuadTree.prototype._insertShape = function _insertShape (shape) {
        var bbox = shape.bbox();
        if (bbox) {
            var sectors = this.getSectors(bbox);
            var x = sectors[0][0];
            var y = sectors[1][0];

            if (this.inRoot(sectors)) {
                this.root.insert(shape, bbox);
            } else {
                var rootMap = this.rootMap;
                if (!rootMap[x]) {
                    rootMap[x] = {};
                }

                if (!rootMap[x][y]) {
                    rootMap[x][y] = new QuadNode(
                        new Rect([ x * ROOT_SIZE, y * ROOT_SIZE ], [ ROOT_SIZE, ROOT_SIZE ])
                    );
                }

                rootMap[x][y].insert(shape, bbox);
            }
        }
    };

    ShapesQuadTree.prototype.remove = function remove (element) {
        var this$1 = this;

        element.removeObserver(this);

        if (element.nodeType === "Group") {
            var children = element.children;
            for (var idx = 0; idx < children.length; idx++) {
                this$1.remove(children[idx]);
            }
        } else if (element._quadNode) {
            element._quadNode.remove(element);
            delete element._quadNode;
        }
    };

    ShapesQuadTree.prototype.inRoot = function inRoot (sectors) {
        return sectors[0].length > 1 || sectors[1].length > 1;
    };

    ShapesQuadTree.prototype.getSectors = function getSectors (rect) {
        var bottomRight = rect.bottomRight();
        var bottomX = Math.floor(bottomRight.x / ROOT_SIZE);
        var bottomY = Math.floor(bottomRight.y / ROOT_SIZE);
        var sectors = [ [], [] ];
        for (var x = Math.floor(rect.origin.x / ROOT_SIZE); x <= bottomX; x++) {
            sectors[0].push(x);
        }
        for (var y = Math.floor(rect.origin.y / ROOT_SIZE); y <= bottomY; y++) {
            sectors[1].push(y);
        }
        return sectors;
    };

    return ShapesQuadTree;
}(Class));

function zIndexComparer(x1, x2) {
    if (x1._zIndex < x2._zIndex) {
        return 1;
    }
    if (x1._zIndex > x2._zIndex) {
        return -1;
    }

    return 0;
}

var SurfaceCursor = function SurfaceCursor(surface) {
    surface.bind("mouseenter", this._mouseenter.bind(this));
    surface.bind("mouseleave", this._mouseleave.bind(this));

    this.element = surface.element;
};

SurfaceCursor.prototype.clear = function clear () {
    this._resetCursor();
};

SurfaceCursor.prototype.destroy = function destroy () {
    this._resetCursor();
    delete this.element;
};

SurfaceCursor.prototype._mouseenter = function _mouseenter (e) {
    var cursor = this._shapeCursor(e);

    if (!cursor) {
        this._resetCursor();
    } else {
        if (!this._current) {
            this._defaultCursor = this._getCursor();
        }

        this._setCursor(cursor);
    }
};

SurfaceCursor.prototype._mouseleave = function _mouseleave () {
    this._resetCursor();
};

SurfaceCursor.prototype._shapeCursor = function _shapeCursor (e) {
    var shape = e.element;

    while (shape && !defined(shape.options.cursor)) {
        shape = shape.parent;
    }

    if (shape) {
        return shape.options.cursor;
    }
};

SurfaceCursor.prototype._getCursor = function _getCursor () {
    if (this.element) {
        return this.element.style.cursor;
    }
};

SurfaceCursor.prototype._setCursor = function _setCursor (cursor) {
    if (this.element) {
        this.element.style.cursor = cursor;
        this._current = cursor;
    }
};

SurfaceCursor.prototype._resetCursor = function _resetCursor () {
    if (this._current) {
        this._setCursor(this._defaultCursor || "");
        delete this._current;
    }
};

var Surface$3 = (function (BaseSurface) {
    function Surface$$1(element, options) {
        BaseSurface.call(this, element, options);

        this.element.innerHTML = this._template(this);

        var canvas = this.element.firstElementChild;
        var size = elementSize(element);

        canvas.width = size.width;
        canvas.height = size.height;

        this._rootElement = canvas;

        this._root = new RootNode$2(canvas);

        this._mouseTrackHandler = this._trackMouse.bind(this);

        bindEvents(this.element, {
            click: this._mouseTrackHandler,
            mousemove: this._mouseTrackHandler
        });
    }

    if ( BaseSurface ) Surface$$1.__proto__ = BaseSurface;
    Surface$$1.prototype = Object.create( BaseSurface && BaseSurface.prototype );
    Surface$$1.prototype.constructor = Surface$$1;

    Surface$$1.prototype.destroy = function destroy () {
        BaseSurface.prototype.destroy.call(this);

        if (this._root) {
            this._root.destroy();
            this._root = null;
        }

        if (this._searchTree) {
            this._searchTree.clear();
            delete this._searchTree;
        }

        if (this._cursor) {
            this._cursor.destroy();
            delete this._cursor;
        }

        unbindEvents(this.element, {
            click: this._mouseTrackHandler,
            mousemove: this._mouseTrackHandler
        });
    };

    Surface$$1.prototype.draw = function draw (element) {
        BaseSurface.prototype.draw.call(this, element);
        this._root.load([ element ], undefined, this.options.cors);

        if (this._searchTree) {
            this._searchTree.add([ element ]);
        }
    };

    Surface$$1.prototype.clear = function clear () {
        BaseSurface.prototype.clear.call(this);
        this._root.clear();

        if (this._searchTree) {
            this._searchTree.clear();
        }

        if (this._cursor) {
            this._cursor.clear();
        }
    };

    Surface$$1.prototype.eventTarget = function eventTarget (e) {
        if (this._searchTree) {
            var point = this._surfacePoint(e);
            var shape = this._searchTree.pointShape(point);
            return shape;
        }
    };

    Surface$$1.prototype.image = function image () {
        var ref = this;
        var root = ref._root;
        var rootElement = ref._rootElement;
        var loadingStates = [];

        root.traverse(function (childNode) {
            if (childNode.loading) {
                loadingStates.push(childNode.loading);
            }
        });

        var promise = createPromise();
        var resolveDataURL = function () {
            root._invalidate();

            try {
                var data = rootElement.toDataURL();
                promise.resolve(data);
            } catch (e) {
                promise.reject(e);
            }
        };

        promiseAll(loadingStates).then(resolveDataURL, resolveDataURL);

        return promise;
    };

    Surface$$1.prototype.suspendTracking = function suspendTracking () {
        BaseSurface.prototype.suspendTracking.call(this);
        if (this._searchTree) {
            this._searchTree.clear();
            delete this._searchTree;
        }
    };

    Surface$$1.prototype.resumeTracking = function resumeTracking () {
        BaseSurface.prototype.resumeTracking.call(this);
        if (!this._searchTree) {
            this._searchTree = new ShapesQuadTree();

            var childNodes = this._root.childNodes;
            var rootElements = [];
            for (var idx = 0; idx < childNodes.length; idx++) {
                rootElements.push(childNodes[idx].srcElement);
            }
            this._searchTree.add(rootElements);
        }
    };

    Surface$$1.prototype._resize = function _resize () {
        this._rootElement.width = this._size.width;
        this._rootElement.height = this._size.height;

        this._root.invalidate();
    };

    Surface$$1.prototype._template = function _template () {
        return "<canvas style='width: 100%; height: 100%;'></canvas>";
    };

    Surface$$1.prototype._enableTracking = function _enableTracking () {
        this._searchTree = new ShapesQuadTree();
        this._cursor = new SurfaceCursor(this);

        BaseSurface.prototype._enableTracking.call(this);
    };

    Surface$$1.prototype._trackMouse = function _trackMouse (e) {
        if (this._suspendedTracking) {
            return;
        }

        var shape = this.eventTarget(e);

        if (e.type !== "click") {
            var currentShape = this._currentShape;
            if (currentShape && currentShape !== shape) {
                this.trigger("mouseleave", {
                    element: currentShape,
                    originalEvent: e,
                    type: "mouseleave"
                });
            }

            if (shape && currentShape !== shape) {
                this.trigger("mouseenter", {
                    element: shape,
                    originalEvent: e,
                    type: "mouseenter"
                });
            }

            this.trigger("mousemove", {
                element: shape,
                originalEvent: e,
                type: "mousemove"
            });

            this._currentShape = shape;
        } else if (shape) {
            this.trigger("click", {
                element: shape,
                originalEvent: e,
                type: "click"
            });
        }
    };

    return Surface$$1;
}(Surface));

Surface$3.prototype.type = "canvas";

if (typeof document !== "undefined" && document.createElement("canvas").getContext) {
    Surface.support.canvas = true;
    SurfaceFactory.current.register("canvas", Surface$3, 20);
}

function addGradientStops(gradient, stops) {
    for (var idx = 0; idx < stops.length; idx++) {
        var stop = stops[idx];
        var color = parseColor(stop.color());

        color.a *= stop.opacity();

        gradient.addColorStop(stop.offset(), color.toCssRgba());
    }
}

var PathNode$2 = (function (Node) {
    function PathNode () {
        Node.apply(this, arguments);
    }

    if ( Node ) PathNode.__proto__ = Node;
    PathNode.prototype = Object.create( Node && Node.prototype );
    PathNode.prototype.constructor = PathNode;

    PathNode.prototype.renderTo = function renderTo (ctx) {
        ctx.save();

        this.setTransform(ctx);
        this.setClip(ctx);
        this.setOpacity(ctx);

        ctx.beginPath();

        this.renderPoints(ctx, this.srcElement);

        this.setLineDash(ctx);
        this.setLineCap(ctx);
        this.setLineJoin(ctx);

        this.setFill(ctx);
        this.setStroke(ctx);

        ctx.restore();
    };

    PathNode.prototype.setFill = function setFill (ctx) {
        var fill = this.srcElement.options.fill;
        var hasFill = false;

        if (fill) {
            if (fill.nodeType === "Gradient") {
                this.setGradientFill(ctx, fill);
                hasFill = true;
            } else if (!isTransparent(fill.color)) {
                ctx.fillStyle = fill.color;

                ctx.save();
                this.globalAlpha(ctx, fill.opacity);
                ctx.fill();
                ctx.restore();

                hasFill = true;
            }
        }

        return hasFill;
    };

    PathNode.prototype.setGradientFill = function setGradientFill (ctx, fill) {
        var bbox = this.srcElement.rawBBox();
        var gradient;

        if (fill instanceof LinearGradient) {
            var start = fill.start();
            var end = fill.end();
            gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
        } else if (fill instanceof RadialGradient) {
            var center = fill.center();
            gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, fill.radius());
        }

        addGradientStops(gradient, fill.stops);

        ctx.save();

        if (!fill.userSpace()) {
            ctx.transform(bbox.width(), 0, 0, bbox.height(), bbox.origin.x, bbox.origin.y);
        }
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.restore();
    };

    PathNode.prototype.setStroke = function setStroke (ctx) {
        var stroke = this.srcElement.options.stroke;
        if (stroke && !isTransparent(stroke.color) && stroke.width > 0) {
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = valueOrDefault(stroke.width, 1);

            ctx.save();
            this.globalAlpha(ctx, stroke.opacity);
            ctx.stroke();
            ctx.restore();

            return true;
        }
    };

    PathNode.prototype.dashType = function dashType () {
        var stroke = this.srcElement.options.stroke;
        if (stroke && stroke.dashType) {
            return stroke.dashType.toLowerCase();
        }
    };

    PathNode.prototype.setLineDash = function setLineDash (ctx) {
        var dashType = this.dashType();
        if (dashType && dashType !== SOLID) {
            var dashArray = DASH_ARRAYS[dashType];
            if (ctx.setLineDash) {
                ctx.setLineDash(dashArray);
            } else {
                ctx.mozDash = dashArray;
                ctx.webkitLineDash = dashArray;
            }
        }
    };

    PathNode.prototype.setLineCap = function setLineCap (ctx) {
        var dashType = this.dashType();
        var stroke = this.srcElement.options.stroke;
        if (dashType && dashType !== SOLID) {
            ctx.lineCap = BUTT;
        } else if (stroke && stroke.lineCap) {
            ctx.lineCap = stroke.lineCap;
        }
    };

    PathNode.prototype.setLineJoin = function setLineJoin (ctx) {
        var stroke = this.srcElement.options.stroke;
        if (stroke && stroke.lineJoin) {
            ctx.lineJoin = stroke.lineJoin;
        }
    };

    PathNode.prototype.renderPoints = function renderPoints (ctx, path) {
        renderPath(ctx, path);
    };

    return PathNode;
}(Node$2));

NODE_MAP$2.Path = PathNode$2;

var ArcNode$2 = (function (PathNode) {
    function ArcNode () {
        PathNode.apply(this, arguments);
    }

    if ( PathNode ) ArcNode.__proto__ = PathNode;
    ArcNode.prototype = Object.create( PathNode && PathNode.prototype );
    ArcNode.prototype.constructor = ArcNode;

    ArcNode.prototype.renderPoints = function renderPoints (ctx) {
        var path = this.srcElement.toPath();
        renderPath(ctx, path);
    };

    return ArcNode;
}(PathNode$2));

NODE_MAP$2.Arc = ArcNode$2;

var CircleNode$2 = (function (PathNode) {
    function CircleNode () {
        PathNode.apply(this, arguments);
    }

    if ( PathNode ) CircleNode.__proto__ = PathNode;
    CircleNode.prototype = Object.create( PathNode && PathNode.prototype );
    CircleNode.prototype.constructor = CircleNode;

    CircleNode.prototype.renderPoints = function renderPoints (ctx) {
        var ref = this.srcElement.geometry();
        var center = ref.center;
        var radius = ref.radius;

        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    };

    return CircleNode;
}(PathNode$2));

NODE_MAP$2.Circle = CircleNode$2;

var RectNode$2 = (function (PathNode) {
    function RectNode () {
        PathNode.apply(this, arguments);
    }

    if ( PathNode ) RectNode.__proto__ = PathNode;
    RectNode.prototype = Object.create( PathNode && PathNode.prototype );
    RectNode.prototype.constructor = RectNode;

    RectNode.prototype.renderPoints = function renderPoints (ctx) {
        var ref = this.srcElement.geometry();
        var origin = ref.origin;
        var size = ref.size;

        ctx.rect(origin.x, origin.y, size.width, size.height);
    };

    return RectNode;
}(PathNode$2));

NODE_MAP$2.Rect = RectNode$2;

var ImageNode$2 = (function (PathNode) {
    function ImageNode(srcElement, cors) {
        PathNode.call(this, srcElement);

        this.onLoad = this.onLoad.bind(this);
        this.onError = this.onError.bind(this);

        this.loading = createPromise();

        var img = this.img = new Image();

        if (cors && !(/^data:/i.test(srcElement.src()))) {
            img.crossOrigin = cors;
        }

        img.src = srcElement.src();

        if (img.complete) {
            this.onLoad();
        } else {
            img.onload = this.onLoad;
            img.onerror = this.onError;
        }
    }

    if ( PathNode ) ImageNode.__proto__ = PathNode;
    ImageNode.prototype = Object.create( PathNode && PathNode.prototype );
    ImageNode.prototype.constructor = ImageNode;

    ImageNode.prototype.renderTo = function renderTo (ctx) {
        if (this.loading.state() === "resolved") {
            ctx.save();

            this.setTransform(ctx);
            this.setClip(ctx);

            this.drawImage(ctx);

            ctx.restore();
        }
    };

    ImageNode.prototype.optionsChange = function optionsChange (e) {
        if (e.field === "src") {
            this.loading = createPromise();
            this.img.src = this.srcElement.src();
        } else {
            PathNode.prototype.optionsChange.call(this, e);
        }
    };

    ImageNode.prototype.onLoad = function onLoad () {
        this.loading.resolve();
        this.invalidate();
    };

    ImageNode.prototype.onError = function onError () {
        this.loading.reject(new Error(
            "Unable to load image '" + this.img.src +
            "'. Check for connectivity and verify CORS headers."
        ));
    };

    ImageNode.prototype.drawImage = function drawImage (ctx) {
        var rect = this.srcElement.rect();
        var topLeft = rect.topLeft();

        ctx.drawImage(
            this.img, topLeft.x, topLeft.y, rect.width(), rect.height()
        );
    };

    return ImageNode;
}(PathNode$2));

NODE_MAP$2.Image = ImageNode$2;

var TextNode$2 = (function (PathNode) {
    function TextNode () {
        PathNode.apply(this, arguments);
    }

    if ( PathNode ) TextNode.__proto__ = PathNode;
    TextNode.prototype = Object.create( PathNode && PathNode.prototype );
    TextNode.prototype.constructor = TextNode;

    TextNode.prototype.renderTo = function renderTo (ctx) {
        var text = this.srcElement;
        var pos = text.position();
        var size = text.measure();

        ctx.save();

        this.setTransform(ctx);
        this.setClip(ctx);
        this.setOpacity(ctx);

        ctx.beginPath();

        ctx.font = text.options.font;
        ctx.textAlign = 'left';

        if (this.setFill(ctx)) {
            ctx.fillText(text.content(), pos.x, pos.y + size.baseline);
        }

        if (this.setStroke(ctx)) {
            this.setLineDash(ctx);
            ctx.strokeText(text.content(), pos.x, pos.y + size.baseline);
        }

        ctx.restore();
    };

    return TextNode;
}(PathNode$2));


NODE_MAP$2.Text = TextNode$2;

var MultiPathNode$2 = (function (PathNode) {
    function MultiPathNode () {
        PathNode.apply(this, arguments);
    }

    if ( PathNode ) MultiPathNode.__proto__ = PathNode;
    MultiPathNode.prototype = Object.create( PathNode && PathNode.prototype );
    MultiPathNode.prototype.constructor = MultiPathNode;

    MultiPathNode.prototype.renderPoints = function renderPoints (ctx) {
        var paths = this.srcElement.paths;
        for (var i = 0; i < paths.length; i++) {
            renderPath(ctx, paths[i]);
        }
    };

    return MultiPathNode;
}(PathNode$2));

NODE_MAP$2.MultiPath = MultiPathNode$2;



var canvas = Object.freeze({
	Surface: Surface$3,
	RootNode: RootNode$2,
	Node: Node$2,
	GroupNode: GroupNode$2,
	ArcNode: ArcNode$2,
	CircleNode: CircleNode$2,
	RectNode: RectNode$2,
	ImageNode: ImageNode$2,
	TextNode: TextNode$2,
	PathNode: PathNode$2,
	MultiPathNode: MultiPathNode$2
});

function exportImage(group, options) {
    var defaults = {
        width: "800px", height: "600px",
        cors: "Anonymous"
    };

    var exportRoot = group;
    var bbox = group.clippedBBox();


    if (bbox) {
        var origin = bbox.getOrigin();
        exportRoot = new Group();
        exportRoot.transform(transform$1().translate(-origin.x, -origin.y));
        exportRoot.children.push(group);

        var size = bbox.getSize();
        defaults.width = size.width + "px";
        defaults.height = size.height + "px";
    }

    var surfaceOptions = Object.assign(defaults, options);

    var container = document.createElement("div");
    var style = container.style;

    style.display = "none";
    style.width = surfaceOptions.width;
    style.height = surfaceOptions.height;
    document.body.appendChild(container);

    var surface = new Surface$3(container, surfaceOptions);
    surface.suspendTracking();
    surface.draw(exportRoot);

    var promise = surface.image();
    var destroy = function () {
        surface.destroy();
        document.body.removeChild(container);
    };
    promise.then(destroy, destroy);

    return promise;
}

function exportSVG(group, options) {
    var svg = exportGroup(group);

    if (!options || !options.raw) {
        svg = "data:image/svg+xml;base64," + encodeBase64(svg);
    }

    return createPromise().resolve(svg);
}



var drawing = Object.freeze({
	svg: svg$1,
	canvas: canvas,
	util: util,
	PathParser: PathParser,
	Surface: Surface,
	BaseNode: BaseNode,
	SurfaceFactory: SurfaceFactory,
	OptionsStore: OptionsStore,
	exportImage: exportImage,
	exportSVG: exportSVG,
	QuadNode: QuadNode,
	ShapesQuadTree: ShapesQuadTree,
	ObserversMixin: ObserversMixin,
	Element: Element$1,
	Circle: Circle,
	Arc: Arc,
	Path: Path,
	MultiPath: MultiPath,
	Text: Text,
	Image: Image$1,
	Group: Group,
	Layout: Layout,
	Rect: Rect$2,
	align: align,
	vAlign: vAlign,
	stack: stack,
	vStack: vStack,
	wrap: wrap,
	vWrap: vWrap,
	fit: fit,
	LinearGradient: LinearGradient,
	RadialGradient: RadialGradient,
	GradientStop: GradientStop,
	Gradient: Gradient,
	Animation: Animation,
	AnimationFactory: AnimationFactory
});

/* eslint-disable no-multi-spaces, key-spacing, indent, camelcase, space-before-blocks, eqeqeq, brace-style */
/* eslint-disable space-infix-ops, space-before-function-paren, array-bracket-spacing, object-curly-spacing */
/* eslint-disable no-nested-ternary, max-params, default-case, no-else-return, no-empty */
/* eslint-disable no-param-reassign, no-var, block-scoped-var */

// XXX: remove this junk (assume `true`) when we no longer have to support IE < 10
var HAS_TYPED_ARRAYS$1 = typeof Uint8Array !== 'undefined';

var BASE64 = (function(){
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    return {
        decode: function(str) {
            var input = str.replace(/[^A-Za-z0-9\+\/\=]/g, ""), i = 0, n = input.length, output = [];

            while (i < n) {
                var enc1 = keyStr.indexOf(input.charAt(i++));
                var enc2 = keyStr.indexOf(input.charAt(i++));
                var enc3 = keyStr.indexOf(input.charAt(i++));
                var enc4 = keyStr.indexOf(input.charAt(i++));

                var chr1 = (enc1 << 2) | (enc2 >>> 4);
                var chr2 = ((enc2 & 15) << 4) | (enc3 >>> 2);
                var chr3 = ((enc3 & 3) << 6) | enc4;

                output.push(chr1);
                if (enc3 != 64) {
                    output.push(chr2);
                }
                if (enc4 != 64) {
                    output.push(chr3);
                }
            }

            return output;
        },
        encode: function(bytes) {
            var i = 0, n = bytes.length;
            var output = "";

            while (i < n) {
                var chr1 = bytes[i++];
                var chr2 = bytes[i++];
                var chr3 = bytes[i++];

                var enc1 = chr1 >>> 2;
                var enc2 = ((chr1 & 3) << 4) | (chr2 >>> 4);
                var enc3 = ((chr2 & 15) << 2) | (chr3 >>> 6);
                var enc4 = chr3 & 63;

                if (i - n == 2) {
                    enc3 = enc4 = 64;
                } else if (i - n == 1) {
                    enc4 = 64;
                }

                output += keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
            }
            return output;
        }
    };
}());

function BinaryStream(data) {
    var offset = 0, length = 0;
    if (data == null) {
        data = HAS_TYPED_ARRAYS$1 ? new Uint8Array(256) : [];
    } else {
        length = data.length;
    }

    var ensure = HAS_TYPED_ARRAYS$1 ? function(len) {
        if (len >= data.length) {
            var tmp = new Uint8Array(Math.max(len + 256, data.length * 2));
            tmp.set(data, 0);
            data = tmp;
        }
    } : function() {};

    var get = HAS_TYPED_ARRAYS$1 ? function() {
        return new Uint8Array(data.buffer, 0, length);
    } : function() {
        return data;
    };

    var write = HAS_TYPED_ARRAYS$1 ? function(bytes) {
        if (typeof bytes == "string") {
            return writeString(bytes);
        }
        var len = bytes.length;
        ensure(offset + len);
        data.set(bytes, offset);
        offset += len;
        if (offset > length) {
            length = offset;
        }
    } : function(bytes) {
        if (typeof bytes == "string") {
            return writeString(bytes);
        }
        for (var i = 0; i < bytes.length; ++i) {
            writeByte(bytes[i]);
        }
    };

    var slice = HAS_TYPED_ARRAYS$1 ? function(start, length) {
        if (data.buffer.slice) {
            return new Uint8Array(data.buffer.slice(start, start + length));
        } else {
            // IE10
            var x = new Uint8Array(length);
            x.set(new Uint8Array(data.buffer, start, length));
            return x;
        }
    } : function(start, length) {
        return data.slice(start, start + length);
    };

    function eof() {
        return offset >= length;
    }
    function readByte() {
        return offset < length ? data[offset++] : 0;
    }
    function writeByte(b) {
        ensure(offset);
        data[offset++] = b & 0xFF;
        if (offset > length) {
            length = offset;
        }
    }
    function readShort() {
        return (readByte() << 8) | readByte();
    }
    function writeShort(w) {
        writeByte(w >> 8);
        writeByte(w);
    }
    function readShort_() {
        var w = readShort();
        return w >= 0x8000 ? w - 0x10000 : w;
    }
    function writeShort_(w) {
        writeShort(w < 0 ? w + 0x10000 : w);
    }
    function readLong() {
        return (readShort() * 0x10000) + readShort();
    }
    function writeLong(w) {
        writeShort((w >>> 16) & 0xFFFF);
        writeShort(w & 0xFFFF);
    }
    function readLong_() {
        var w = readLong();
        return w >= 0x80000000 ? w - 0x100000000 : w;
    }
    function writeLong_(w) {
        writeLong(w < 0 ? w + 0x100000000 : w);
    }
    function readFixed() {
        return readLong() / 0x10000;
    }
    function writeFixed(f) {
        writeLong(Math.round(f * 0x10000));
    }
    function readFixed_() {
        return readLong_() / 0x10000;
    }
    function writeFixed_(f) {
        writeLong_(Math.round(f * 0x10000));
    }
    function read(len) {
        return times(len, readByte);
    }
    function readString(len) {
        return String.fromCharCode.apply(String, read(len));
    }
    function writeString(str) {
        for (var i = 0; i < str.length; ++i) {
            writeByte(str.charCodeAt(i));
        }
    }
    function times(n, reader) {
        for (var ret = new Array(n), i = 0; i < n; ++i) {
            ret[i] = reader();
        }
        return ret;
    }

    var stream = {
        eof         : eof,
        readByte    : readByte,
        writeByte   : writeByte,
        readShort   : readShort,
        writeShort  : writeShort,
        readLong    : readLong,
        writeLong   : writeLong,
        readFixed   : readFixed,
        writeFixed  : writeFixed,

        // signed numbers.
        readShort_  : readShort_,
        writeShort_ : writeShort_,
        readLong_   : readLong_,
        writeLong_  : writeLong_,
        readFixed_  : readFixed_,
        writeFixed_ : writeFixed_,

        read        : read,
        write       : write,
        readString  : readString,
        writeString : writeString,

        times       : times,
        get         : get,
        slice       : slice,

        offset: function(pos) {
            if (pos != null) {
                offset = pos;
                return stream;
            }
            return offset;
        },

        skip: function(nbytes) {
            offset += nbytes;
        },

        toString: function() {
            throw new Error("FIX CALLER.  BinaryStream is no longer convertible to string!");
        },

        length: function() { return length; },

        saveExcursion: function(f) {
            var pos = offset;
            try {
                return f();
            } finally {
                offset = pos;
            }
        },

        writeBase64: function(base64) {
            if (window.atob) {
                writeString(window.atob(base64));
            } else {
                write(BASE64.decode(base64));
            }
        },
        base64: function() {
            return BASE64.encode(get());
        }
    };

    return stream;
}

function ucs2decode(string) {
    var output = [],
        counter = 0,
        length = string.length,
        value,
        extra;
    while (counter < length) {
        value = string.charCodeAt(counter++);
        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
            // high surrogate, and there is a next character
            extra = string.charCodeAt(counter++);
            if ((extra & 0xFC00) == 0xDC00) { // low surrogate
                output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
            } else {
                // unmatched surrogate; only append this code unit, in case the next
                // code unit is the high surrogate of a surrogate pair
                output.push(value);
                counter--;
            }
        } else {
            output.push(value);
        }
    }
    return output;
}

function ucs2encode(array) {
    return array.map(function(value){
        var output = "";
        if (value > 0xFFFF) {
            value -= 0x10000;
            output += String.fromCharCode(value >>> 10 & 0x3FF | 0xD800);
            value = 0xDC00 | value & 0x3FF;
        }
        output += String.fromCharCode(value);
        return output;
    }).join("");
}

/* eslint-disable no-multi-spaces, key-spacing, indent, camelcase, space-before-blocks, eqeqeq, brace-style */
/* eslint-disable space-infix-ops, space-before-function-paren, array-bracket-spacing, object-curly-spacing */
/* eslint-disable no-nested-ternary, max-params, default-case, no-else-return, no-empty */
/* eslint-disable no-param-reassign, no-var, block-scoped-var */

/*****************************************************************************\
 *
 * The code in this file, although written from scratch, is influenced by the
 * TrueType parser/encoder in PDFKit -- http://pdfkit.org/ (a CoffeeScript
 * library for producing PDF files).
 *
 * PDFKit is (c) Devon Govett 2014 and released under the MIT License.
 *
\*****************************************************************************/

function hasOwnProperty$1(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

function sortedKeys(obj) {
    return Object.keys(obj).sort(function(a, b){ return a - b; }).map(parseFloat);
}

///

function Directory(data) {
    this.raw = data;
    this.scalerType = data.readLong();
    this.tableCount = data.readShort();
    this.searchRange = data.readShort();
    this.entrySelector = data.readShort();
    this.rangeShift = data.readShort();

    var tables = this.tables = {};
    for (var i = 0; i < this.tableCount; ++i) {
        var entry = {
            tag      : data.readString(4),
            checksum : data.readLong(),
            offset   : data.readLong(),
            length   : data.readLong()
        };
        tables[entry.tag] = entry;
    }
}

Directory.prototype = {

    readTable: function(name, Ctor) {
        var def = this.tables[name];
        if (!def) {
            throw new Error("Table " + name + " not found in directory");
        }
        return (this[name] = def.table = new Ctor(this, def));
    },

    render: function(tables) {
        var this$1 = this;

        var tableCount = Object.keys(tables).length;

        var maxpow2 = Math.pow(2, Math.floor(Math.log(tableCount) / Math.LN2));
        var searchRange = maxpow2 * 16;
        var entrySelector = Math.floor(Math.log(maxpow2) / Math.LN2);
        var rangeShift = tableCount * 16 - searchRange;

        var out = BinaryStream();
        out.writeLong(this.scalerType);
        out.writeShort(tableCount);
        out.writeShort(searchRange);
        out.writeShort(entrySelector);
        out.writeShort(rangeShift);

        var directoryLength = tableCount * 16;
        var offset = out.offset() + directoryLength;
        var headOffset = null;
        var tableData = BinaryStream();

        for (var tag in tables) {
            if (hasOwnProperty$1(tables, tag)) {
                var table = tables[tag];

                out.writeString(tag);
                out.writeLong(this$1.checksum(table));
                out.writeLong(offset);
                out.writeLong(table.length);

                tableData.write(table);
                if (tag == "head") {
                    headOffset = offset;
                }
                offset += table.length;

                while (offset % 4) {
                    tableData.writeByte(0);
                    offset++;
                }
            }
        }

        out.write(tableData.get());
        var sum = this.checksum(out.get());
        var adjustment = 0xB1B0AFBA - sum;

        out.offset(headOffset + 8);
        out.writeLong(adjustment);
        return out.get();
    },

    checksum: function(data) {
        data = BinaryStream(data);
        var sum = 0;
        while (!data.eof()) {
            sum += data.readLong();
        }
        return sum & 0xFFFFFFFF;
    }
};

function deftable(methods) {
    function Ctor(file, def) {
        this.definition = def;
        this.length = def.length;
        this.offset = def.offset;
        this.file = file;
        this.rawData = file.raw;
        this.parse(file.raw);
    }
    Ctor.prototype.raw = function() {
        return this.rawData.slice(this.offset, this.length);
    };
    for (var i in methods) {
        if (hasOwnProperty$1(methods, i)) {
            Ctor[i] = Ctor.prototype[i] = methods[i];
        }
    }
    return Ctor;
}

var HeadTable = deftable({
    parse: function(data) {
        data.offset(this.offset);
        this.version             = data.readLong();
        this.revision            = data.readLong();
        this.checkSumAdjustment  = data.readLong();
        this.magicNumber         = data.readLong();
        this.flags               = data.readShort();
        this.unitsPerEm          = data.readShort();
        this.created             = data.read(8);
        this.modified            = data.read(8);

        this.xMin = data.readShort_();
        this.yMin = data.readShort_();
        this.xMax = data.readShort_();
        this.yMax = data.readShort_();

        this.macStyle           = data.readShort();
        this.lowestRecPPEM      = data.readShort();
        this.fontDirectionHint  = data.readShort_();
        this.indexToLocFormat   = data.readShort_();
        this.glyphDataFormat    = data.readShort_();
    },
    render: function(indexToLocFormat) {
        var out = BinaryStream();
        out.writeLong(this.version);
        out.writeLong(this.revision);
        out.writeLong(0);       // checksum adjustment; shall be computed later
        out.writeLong(this.magicNumber);
        out.writeShort(this.flags);
        out.writeShort(this.unitsPerEm);
        out.write(this.created);
        out.write(this.modified);
        out.writeShort_(this.xMin);
        out.writeShort_(this.yMin);
        out.writeShort_(this.xMax);
        out.writeShort_(this.yMax);
        out.writeShort(this.macStyle);
        out.writeShort(this.lowestRecPPEM);
        out.writeShort_(this.fontDirectionHint);
        out.writeShort_(indexToLocFormat); // this will depend on the `loca` table
        out.writeShort_(this.glyphDataFormat);
        return out.get();
    }
});

var LocaTable = deftable({
    parse: function(data) {
        data.offset(this.offset);
        var format = this.file.head.indexToLocFormat;
        if (format === 0) {
            this.offsets = data.times(this.length / 2, function(){
                return 2 * data.readShort();
            });
        } else {
            this.offsets = data.times(this.length / 4, data.readLong);
        }
    },
    offsetOf: function(id) {
        return this.offsets[id];
    },
    lengthOf: function(id) {
        return this.offsets[id + 1] - this.offsets[id];
    },
    render: function(offsets) {
        var out = BinaryStream();
        var needsLongFormat = offsets[offsets.length - 1] > 0xFFFF;
        for (var i = 0; i < offsets.length; ++i) {
            if (needsLongFormat) {
                out.writeLong(offsets[i]);
            } else {
                out.writeShort(offsets[i] / 2);
            }
        }
        return {
            format: needsLongFormat ? 1 : 0,
            table: out.get()
        };
    }
});

var HheaTable = deftable({
    parse: function(data) {
        data.offset(this.offset);

        this.version              = data.readLong();
        this.ascent               = data.readShort_();
        this.descent              = data.readShort_();
        this.lineGap              = data.readShort_();
        this.advanceWidthMax      = data.readShort();
        this.minLeftSideBearing   = data.readShort_();
        this.minRightSideBearing  = data.readShort_();
        this.xMaxExtent           = data.readShort_();
        this.caretSlopeRise       = data.readShort_();
        this.caretSlopeRun        = data.readShort_();
        this.caretOffset          = data.readShort_();

        data.skip(4 * 2);       // reserved

        this.metricDataFormat     = data.readShort_();
        this.numOfLongHorMetrics  = data.readShort();
    },
    render: function(ids) {
        var out = BinaryStream();
        out.writeLong(this.version);
        out.writeShort_(this.ascent);
        out.writeShort_(this.descent);
        out.writeShort_(this.lineGap);
        out.writeShort(this.advanceWidthMax);
        out.writeShort_(this.minLeftSideBearing);
        out.writeShort_(this.minRightSideBearing);
        out.writeShort_(this.xMaxExtent);
        out.writeShort_(this.caretSlopeRise);
        out.writeShort_(this.caretSlopeRun);
        out.writeShort_(this.caretOffset);

        out.write([ 0, 0, 0, 0, 0, 0, 0, 0 ]); // reserved bytes

        out.writeShort_(this.metricDataFormat);
        out.writeShort(ids.length);
        return out.get();
    }
});

var MaxpTable = deftable({
    parse: function(data) {
        data.offset(this.offset);
        this.version = data.readLong();
        this.numGlyphs = data.readShort();
        this.maxPoints = data.readShort();
        this.maxContours = data.readShort();
        this.maxComponentPoints = data.readShort();
        this.maxComponentContours = data.readShort();
        this.maxZones = data.readShort();
        this.maxTwilightPoints = data.readShort();
        this.maxStorage = data.readShort();
        this.maxFunctionDefs = data.readShort();
        this.maxInstructionDefs = data.readShort();
        this.maxStackElements = data.readShort();
        this.maxSizeOfInstructions = data.readShort();
        this.maxComponentElements = data.readShort();
        this.maxComponentDepth = data.readShort();
    },
    render: function(glyphIds) {
        var out = BinaryStream();
        out.writeLong(this.version);
        out.writeShort(glyphIds.length);
        out.writeShort(this.maxPoints);
        out.writeShort(this.maxContours);
        out.writeShort(this.maxComponentPoints);
        out.writeShort(this.maxComponentContours);
        out.writeShort(this.maxZones);
        out.writeShort(this.maxTwilightPoints);
        out.writeShort(this.maxStorage);
        out.writeShort(this.maxFunctionDefs);
        out.writeShort(this.maxInstructionDefs);
        out.writeShort(this.maxStackElements);
        out.writeShort(this.maxSizeOfInstructions);
        out.writeShort(this.maxComponentElements);
        out.writeShort(this.maxComponentDepth);
        return out.get();
    }
});

var HmtxTable = deftable({
    parse: function(data) {
        data.offset(this.offset);
        var dir = this.file, hhea = dir.hhea;
        this.metrics = data.times(hhea.numOfLongHorMetrics, function(){
            return {
                advance: data.readShort(),
                lsb: data.readShort_()
            };
        });
        var lsbCount = dir.maxp.numGlyphs - dir.hhea.numOfLongHorMetrics;
        this.leftSideBearings = data.times(lsbCount, data.readShort_);
    },
    forGlyph: function(id) {
        var metrics = this.metrics;
        var n = metrics.length;
        if (id < n) {
            return metrics[id];
        }
        return {
            advance: metrics[n - 1].advance,
            lsb: this.leftSideBearings[id - n]
        };
    },
    render: function(glyphIds) {
        var this$1 = this;

        var out = BinaryStream();
        for (var i = 0; i < glyphIds.length; ++i) {
            var m = this$1.forGlyph(glyphIds[i]);
            out.writeShort(m.advance);
            out.writeShort_(m.lsb);
        }
        return out.get();
    }
});

var GlyfTable = (function(){

    function SimpleGlyph(raw) {
        this.raw = raw;
    }
    SimpleGlyph.prototype = {
        compound: false,
        render: function() {
            return this.raw.get();
        }
    };

    var ARG_1_AND_2_ARE_WORDS     = 0x0001;
    var WE_HAVE_A_SCALE           = 0x0008;
    var MORE_COMPONENTS           = 0x0020;
    var WE_HAVE_AN_X_AND_Y_SCALE  = 0x0040;
    var WE_HAVE_A_TWO_BY_TWO      = 0x0080;
    //var WE_HAVE_INSTRUCTIONS      = 0x0100;

    function CompoundGlyph(data) {
        this.raw = data;
        var ids = this.glyphIds = [];
        var offsets = this.idOffsets = [];
        while (true) {          // eslint-disable-line no-constant-condition
            var flags = data.readShort();
            offsets.push(data.offset());
            ids.push(data.readShort());

            if (!(flags & MORE_COMPONENTS)) {
                break;
            }

            data.skip(flags & ARG_1_AND_2_ARE_WORDS ? 4 : 2);

            if (flags & WE_HAVE_A_TWO_BY_TWO) {
                data.skip(8);
            } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
                data.skip(4);
            } else if (flags & WE_HAVE_A_SCALE) {
                data.skip(2);
            }
        }
    }

    CompoundGlyph.prototype = {
        compound: true,
        render: function(old2new) {
            var this$1 = this;

            var out = BinaryStream(this.raw.get());
            for (var i = 0; i < this.glyphIds.length; ++i) {
                var id = this$1.glyphIds[i];
                out.offset(this$1.idOffsets[i]);
                out.writeShort(old2new[id]);
            }
            return out.get();
        }
    };

    return deftable({
        parse: function() {
            this.cache = {};
        },
        glyphFor: function(id) {
            var cache = this.cache;
            if (hasOwnProperty$1(cache, id)) {
                return cache[id];
            }

            var loca = this.file.loca;
            var length = loca.lengthOf(id);

            if (length === 0) {
                return (cache[id] = null);
            }

            var data = this.rawData;
            var offset = this.offset + loca.offsetOf(id);
            var raw = BinaryStream(data.slice(offset, length));

            var numberOfContours = raw.readShort_();
            var xMin = raw.readShort_();
            var yMin = raw.readShort_();
            var xMax = raw.readShort_();
            var yMax = raw.readShort_();

            var glyph = cache[id] = numberOfContours == -1 ? new CompoundGlyph(raw) : new SimpleGlyph(raw);

            glyph.numberOfContours = numberOfContours;
            glyph.xMin = xMin;
            glyph.yMin = yMin;
            glyph.xMax = xMax;
            glyph.yMax = yMax;

            return glyph;
        },
        render: function(glyphs, oldIds, old2new) {
            var out = BinaryStream(), offsets = [];
            for (var i = 0; i < oldIds.length; ++i) {
                var id = oldIds[i];
                var glyph = glyphs[id];
                offsets.push(out.offset());
                if (glyph) {
                    out.write(glyph.render(old2new));
                }
            }
            offsets.push(out.offset());
            return {
                table: out.get(),
                offsets: offsets
            };
        }
    });

}());

var NameTable = (function(){

    function NameEntry(text, entry) {
        this.text = text;
        this.length = text.length;
        this.platformID = entry.platformID;
        this.platformSpecificID = entry.platformSpecificID;
        this.languageID = entry.languageID;
        this.nameID = entry.nameID;
    }

    return deftable({
        parse: function(data) {
            data.offset(this.offset);
            data.readShort();   // format
            var count = data.readShort();
            var stringOffset = this.offset + data.readShort();
            var nameRecords = data.times(count, function(){
                return {
                    platformID         : data.readShort(),
                    platformSpecificID : data.readShort(),
                    languageID         : data.readShort(),
                    nameID             : data.readShort(),
                    length             : data.readShort(),
                    offset             : data.readShort() + stringOffset
                };
            });
            var strings = this.strings = {};
            for (var i = 0; i < nameRecords.length; ++i) {
                var rec = nameRecords[i];
                data.offset(rec.offset);
                var text = data.readString(rec.length);
                if (!strings[rec.nameID]) {
                    strings[rec.nameID] = [];
                }
                strings[rec.nameID].push(new NameEntry(text, rec));
            }
            this.postscriptEntry = strings[6][0];
            this.postscriptName = this.postscriptEntry.text.replace(/[^\x20-\x7F]/g, "");
        },

        render: function(psName) {
            var this$1 = this;

            var strings = this.strings;
            var strCount = 0;
            for (var i in strings) {
                if (hasOwnProperty$1(strings, i)) {
                    strCount += strings[i].length;
                }
            }
            var out = BinaryStream();
            var strTable = BinaryStream();

            out.writeShort(0);  // format
            out.writeShort(strCount);
            out.writeShort(6 + 12 * strCount); // stringOffset

            for (i in strings) {
                if (hasOwnProperty$1(strings, i)) {
                    var list = i == 6 ? [
                        new NameEntry(psName, this$1.postscriptEntry)
                    ] : strings[i];
                    for (var j = 0; j < list.length; ++j) {
                        var str = list[j];
                        out.writeShort(str.platformID);
                        out.writeShort(str.platformSpecificID);
                        out.writeShort(str.languageID);
                        out.writeShort(str.nameID);
                        out.writeShort(str.length);
                        out.writeShort(strTable.offset());

                        strTable.writeString(str.text);
                    }
                }
            }

            out.write(strTable.get());

            return out.get();
        }
    });

})();

var PostTable = (function(){

    var POSTSCRIPT_GLYPHS = ".notdef .null nonmarkingreturn space exclam quotedbl numbersign dollar percent ampersand quotesingle parenleft parenright asterisk plus comma hyphen period slash zero one two three four five six seven eight nine colon semicolon less equal greater question at A B C D E F G H I J K L M N O P Q R S T U V W X Y Z bracketleft backslash bracketright asciicircum underscore grave a b c d e f g h i j k l m n o p q r s t u v w x y z braceleft bar braceright asciitilde Adieresis Aring Ccedilla Eacute Ntilde Odieresis Udieresis aacute agrave acircumflex adieresis atilde aring ccedilla eacute egrave ecircumflex edieresis iacute igrave icircumflex idieresis ntilde oacute ograve ocircumflex odieresis otilde uacute ugrave ucircumflex udieresis dagger degree cent sterling section bullet paragraph germandbls registered copyright trademark acute dieresis notequal AE Oslash infinity plusminus lessequal greaterequal yen mu partialdiff summation product pi integral ordfeminine ordmasculine Omega ae oslash questiondown exclamdown logicalnot radical florin approxequal Delta guillemotleft guillemotright ellipsis nonbreakingspace Agrave Atilde Otilde OE oe endash emdash quotedblleft quotedblright quoteleft quoteright divide lozenge ydieresis Ydieresis fraction currency guilsinglleft guilsinglright fi fl daggerdbl periodcentered quotesinglbase quotedblbase perthousand Acircumflex Ecircumflex Aacute Edieresis Egrave Iacute Icircumflex Idieresis Igrave Oacute Ocircumflex apple Ograve Uacute Ucircumflex Ugrave dotlessi circumflex tilde macron breve dotaccent ring cedilla hungarumlaut ogonek caron Lslash lslash Scaron scaron Zcaron zcaron brokenbar Eth eth Yacute yacute Thorn thorn minus multiply onesuperior twosuperior threesuperior onehalf onequarter threequarters franc Gbreve gbreve Idotaccent Scedilla scedilla Cacute cacute Ccaron ccaron dcroat".split(/\s+/g);

    return deftable({
        parse: function(data) {
            var this$1 = this;

            data.offset(this.offset);

            this.format = data.readLong();
            this.italicAngle = data.readFixed_();
            this.underlinePosition = data.readShort_();
            this.underlineThickness = data.readShort_();
            this.isFixedPitch = data.readLong();
            this.minMemType42 = data.readLong();
            this.maxMemType42 = data.readLong();
            this.minMemType1 = data.readLong();
            this.maxMemType1 = data.readLong();

            var numberOfGlyphs;

            switch (this.format) {
              case 0x00010000:
              case 0x00030000:
                break;

              case 0x00020000:
                numberOfGlyphs = data.readShort();
                this.glyphNameIndex = data.times(numberOfGlyphs, data.readShort);
                this.names = [];
                var limit = this.offset + this.length;
                while (data.offset() < limit) {
                    this$1.names.push(data.readString(data.readByte()));
                }
                break;

              case 0x00025000:
                numberOfGlyphs = data.readShort();
                this.offsets = data.read(numberOfGlyphs);
                break;

              case 0x00040000:
                this.map = data.times(this.file.maxp.numGlyphs, data.readShort);
                break;
            }
        },
        glyphFor: function(code) {
            switch (this.format) {
              case 0x00010000:
                return POSTSCRIPT_GLYPHS[code] || ".notdef";

              case 0x00020000:
                var index = this.glyphNameIndex[code];
                if (index < POSTSCRIPT_GLYPHS.length) {
                    return POSTSCRIPT_GLYPHS[index];
                }
                return this.names[index - POSTSCRIPT_GLYPHS.length] || ".notdef";

              case 0x00025000:

              case 0x00030000:
                return ".notdef";

              case 0x00040000:
                return this.map[code] || 0xFFFF;
            }
        },
        render: function(mapping) {
            var this$1 = this;

            if (this.format == 0x00030000) {
                return this.raw();
            }

            // keep original header, but set format to 2.0
            var out = BinaryStream(this.rawData.slice(this.offset, 32));
            out.writeLong(0x00020000);
            out.offset(32);

            var indexes = [];
            var strings = [];

            for (var i = 0; i < mapping.length; ++i) {
                var id = mapping[i];
                var post = this$1.glyphFor(id);
                var index = POSTSCRIPT_GLYPHS.indexOf(post);
                if (index >= 0) {
                    indexes.push(index);
                } else {
                    indexes.push(POSTSCRIPT_GLYPHS.length + strings.length);
                    strings.push(post);
                }
            }

            out.writeShort(mapping.length);

            for (i = 0; i < indexes.length; ++i) {
                out.writeShort(indexes[i]);
            }

            for (i = 0; i < strings.length; ++i) {
                out.writeByte(strings[i].length);
                out.writeString(strings[i]);
            }

            return out.get();
        }
    });
})();

var CmapTable = (function(){

    function CmapEntry(data, offset, codeMap) {
        var self = this;
        self.platformID = data.readShort();
        self.platformSpecificID = data.readShort();
        self.offset = offset + data.readLong();

        data.saveExcursion(function(){
            var code;
            data.offset(self.offset);
            self.format = data.readShort();

            switch (self.format) {
              case 0:
                self.length = data.readShort();
                self.language = data.readShort();
                for (var i = 0; i < 256; ++i) {
                    codeMap[i] = data.readByte();
                }
                break;

              case 4:
                self.length = data.readShort();
                self.language = data.readShort();
                var segCount = data.readShort() / 2;

                data.skip(6);       // searchRange, entrySelector, rangeShift
                var endCode = data.times(segCount, data.readShort);
                data.skip(2);       // reserved pad
                var startCode = data.times(segCount, data.readShort);
                var idDelta = data.times(segCount, data.readShort_);
                var idRangeOffset = data.times(segCount, data.readShort);

                var count = (self.length + self.offset - data.offset()) / 2;
                var glyphIds = data.times(count, data.readShort);

                for (i = 0; i < segCount; ++i) {
                    var start = startCode[i], end = endCode[i];
                    for (code = start; code <= end; ++code) {
                        var glyphId;
                        if (idRangeOffset[i] === 0) {
                            glyphId = code + idDelta[i];
                        } else {
                            ///
                            // When non-zero, idRangeOffset contains for each segment the byte offset of the Glyph ID
                            // into the glyphIds table, from the *current* `i` cell of idRangeOffset.  In other words,
                            // this offset spans from the first into the second array.  This works, because the arrays
                            // are consecutive in the TTF file:
                            //
                            //     [ ...idRangeOffset... ][ ...glyphIds... ]
                            //       ...... 48 ......       .... ID ....
                            //              ^----- 48 bytes -----^
                            //
                            // (but I can't stop wondering why is it not just a plain index, possibly incremented by 1
                            // so that we can have that special `zero` value.)
                            //
                            // The elements of idRangeOffset are even numbers, because both arrays contain 16-bit words,
                            // yet the offset is in bytes.  That is why we divide it by 2.  Then we subtract the
                            // remaining segments (segCount-i), and add the code-start offset, to which we need to add
                            // the corresponding delta to get the actual glyph ID.
                            ///
                            var index = idRangeOffset[i] / 2 - (segCount - i) + (code - start);
                            glyphId = glyphIds[index] || 0;
                            if (glyphId !== 0) {
                                glyphId += idDelta[i];
                            }
                        }
                        codeMap[code] = glyphId & 0xFFFF;
                    }
                }
                break;

              case 6:
                self.length = data.readShort();
                self.language = data.readShort();
                code = data.readShort();
                var length = data.readShort();
                while (length-- > 0) {
                    codeMap[code++] = data.readShort();
                }
                break;

              case 12:
                data.readShort(); // reserved
                self.length = data.readLong();
                self.language = data.readLong();
                var ngroups = data.readLong();
                while (ngroups-- > 0) {
                    code = data.readLong();
                    var endCharCode = data.readLong();
                    var glyphCode = data.readLong();
                    while (code <= endCharCode) {
                        codeMap[code++] = glyphCode++;
                    }
                }
                break;

              default:
                if (window.console) {
                    window.console.error("Unhandled CMAP format: " + self.format);
                }
            }
        });
    }

    function renderCharmap(ncid2ogid, ogid2ngid) {
        var codes = sortedKeys(ncid2ogid);
        var startCodes = [];
        var endCodes = [];
        var last = null;
        var diff = null;

        function new_gid(charcode) {
            return ogid2ngid[ncid2ogid[charcode]];
        }

        for (var i = 0; i < codes.length; ++i) {
            var code = codes[i];
            var gid = new_gid(code);
            var delta = gid - code;
            if (last == null || delta !== diff) {
                if (last) {
                    endCodes.push(last);
                }
                startCodes.push(code);
                diff = delta;
            }
            last = code;
        }

        if (last) {
            endCodes.push(last);
        }
        endCodes.push(0xFFFF);
        startCodes.push(0xFFFF);

        var segCount = startCodes.length;
        var segCountX2 = segCount * 2;
        var searchRange = 2 * Math.pow(2, Math.floor(Math.log(segCount) / Math.LN2));
        var entrySelector = Math.log(searchRange / 2) / Math.LN2;
        var rangeShift = segCountX2 - searchRange;

        var deltas = [];
        var rangeOffsets = [];
        var glyphIds = [];

        for (i = 0; i < segCount; ++i) {
            var startCode = startCodes[i];
            var endCode = endCodes[i];
            if (startCode == 0xFFFF) {
                deltas.push(0);
                rangeOffsets.push(0);
                break;
            }
            var startGlyph = new_gid(startCode);
            if (startCode - startGlyph >= 0x8000) {
                deltas.push(0);
                rangeOffsets.push(2 * (glyphIds.length + segCount - i));
                for (var j = startCode; j <= endCode; ++j) {
                    glyphIds.push(new_gid(j));
                }
            } else {
                deltas.push(startGlyph - startCode);
                rangeOffsets.push(0);
            }
        }

        var out = BinaryStream();

        out.writeShort(3);      // platformID
        out.writeShort(1);      // platformSpecificID
        out.writeLong(12);      // offset
        out.writeShort(4);      // format
        out.writeShort(16 + segCount * 8 + glyphIds.length * 2); // length
        out.writeShort(0);      // language
        out.writeShort(segCountX2);
        out.writeShort(searchRange);
        out.writeShort(entrySelector);
        out.writeShort(rangeShift);

        endCodes.forEach(out.writeShort);
        out.writeShort(0);      // reserved pad
        startCodes.forEach(out.writeShort);
        deltas.forEach(out.writeShort_);
        rangeOffsets.forEach(out.writeShort);
        glyphIds.forEach(out.writeShort);

        return out.get();
    }

    return deftable({
        parse: function(data) {
            var self = this;
            var offset = self.offset;
            data.offset(offset);
            self.codeMap = {};
            self.version = data.readShort();
            var tableCount = data.readShort();
            self.tables = data.times(tableCount, function(){
                return new CmapEntry(data, offset, self.codeMap);
            });
        },
        render: function(ncid2ogid, ogid2ngid) {
            var out = BinaryStream();
            out.writeShort(0);  // version
            out.writeShort(1);  // tableCount
            out.write(renderCharmap(ncid2ogid, ogid2ngid));
            return out.get();
        }
    });

})();

var OS2Table = deftable({
    parse: function(data) {
        data.offset(this.offset);
        this.version = data.readShort();
        this.averageCharWidth = data.readShort_();
        this.weightClass = data.readShort();
        this.widthClass = data.readShort();
        this.type = data.readShort();
        this.ySubscriptXSize = data.readShort_();
        this.ySubscriptYSize = data.readShort_();
        this.ySubscriptXOffset = data.readShort_();
        this.ySubscriptYOffset = data.readShort_();
        this.ySuperscriptXSize = data.readShort_();
        this.ySuperscriptYSize = data.readShort_();
        this.ySuperscriptXOffset = data.readShort_();
        this.ySuperscriptYOffset = data.readShort_();
        this.yStrikeoutSize = data.readShort_();
        this.yStrikeoutPosition = data.readShort_();
        this.familyClass = data.readShort_();

        this.panose = data.times(10, data.readByte);
        this.charRange = data.times(4, data.readLong);

        this.vendorID = data.readString(4);
        this.selection = data.readShort();
        this.firstCharIndex = data.readShort();
        this.lastCharIndex = data.readShort();

        if (this.version > 0) {
            this.ascent = data.readShort_();
            this.descent = data.readShort_();
            this.lineGap = data.readShort_();
            this.winAscent = data.readShort();
            this.winDescent = data.readShort();
            this.codePageRange = data.times(2, data.readLong);

            if (this.version > 1) {
                this.xHeight = data.readShort();
                this.capHeight = data.readShort();
                this.defaultChar = data.readShort();
                this.breakChar = data.readShort();
                this.maxContext = data.readShort();
            }
        }
    },
    render: function() {
        return this.raw();
    }
});

var subsetTag = 100000;

function nextSubsetTag() {
    var ret = "", n = String(subsetTag);
    for (var i = 0; i < n.length; ++i) {
        ret += String.fromCharCode(n.charCodeAt(i) - 48 + 65);
    }
    ++subsetTag;
    return ret;
}

function Subfont(font) {
    this.font = font;
    this.subset = {};
    this.unicodes = {};
    this.ogid2ngid = { 0: 0 };
    this.ngid2ogid = { 0: 0 };
    this.ncid2ogid = {};
    this.next = this.firstChar = 1;
    this.nextGid = 1;
    this.psName = nextSubsetTag() + "+" + this.font.psName;
}

Subfont.prototype = {
    use: function(ch) {
        var self = this;
        if (typeof ch == "string") {
            return ucs2decode(ch).reduce(function(ret, code){
                return ret + String.fromCharCode(self.use(code));
            }, "");
        }
        var code = self.unicodes[ch];
        if (!code) {
            code = self.next++;
            self.subset[code] = ch;
            self.unicodes[ch] = code;

            // generate new GID (glyph ID) and maintain newGID ->
            // oldGID and back mappings
            var old_gid = self.font.cmap.codeMap[ch];
            if (old_gid) {
                self.ncid2ogid[code] = old_gid;
                if (self.ogid2ngid[old_gid] == null) {
                    var new_gid = self.nextGid++;
                    self.ogid2ngid[old_gid] = new_gid;
                    self.ngid2ogid[new_gid] = old_gid;
                }
            }
        }
        return code;
    },
    encodeText: function(text) {
        return this.use(text);
    },
    glyphIds: function() {
        return sortedKeys(this.ogid2ngid);
    },
    glyphsFor: function(glyphIds, result) {
        var this$1 = this;

        if (!result) {
            result = {};
        }
        for (var i = 0; i < glyphIds.length; ++i) {
            var id = glyphIds[i];
            if (!result[id]) {
                var glyph = result[id] = this$1.font.glyf.glyphFor(id);
                if (glyph && glyph.compound) {
                    this$1.glyphsFor(glyph.glyphIds, result);
                }
            }
        }
        return result;
    },
    render: function() {
        var this$1 = this;

        var glyphs = this.glyphsFor(this.glyphIds());

        // add missing sub-glyphs
        for (var old_gid in glyphs) {
            if (hasOwnProperty$1(glyphs, old_gid)) {
                old_gid = parseInt(old_gid, 10);
                if (this$1.ogid2ngid[old_gid] == null) {
                    var new_gid = this$1.nextGid++;
                    this$1.ogid2ngid[old_gid] = new_gid;
                    this$1.ngid2ogid[new_gid] = old_gid;
                }
            }
        }

        // must obtain old_gid_ids in an order matching sorted
        // new_gid_ids
        var new_gid_ids = sortedKeys(this.ngid2ogid);
        var old_gid_ids = new_gid_ids.map(function(id){
            return this.ngid2ogid[id];
        }, this);

        var font = this.font;
        var glyf = font.glyf.render(glyphs, old_gid_ids, this.ogid2ngid);
        var loca = font.loca.render(glyf.offsets);

        this.lastChar = this.next - 1;

        var tables = {
            "cmap" : CmapTable.render(this.ncid2ogid, this.ogid2ngid),
            "glyf" : glyf.table,
            "loca" : loca.table,
            "hmtx" : font.hmtx.render(old_gid_ids),
            "hhea" : font.hhea.render(old_gid_ids),
            "maxp" : font.maxp.render(old_gid_ids),
            "post" : font.post.render(old_gid_ids),
            "name" : font.name.render(this.psName),
            "head" : font.head.render(loca.format),
            "OS/2" : font.os2.render()
        };

        return this.font.directory.render(tables);
    },
    cidToGidMap: function() {
        var this$1 = this;

        var out = BinaryStream(), len = 0;
        for (var cid = this.firstChar; cid < this.next; ++cid) {
            while (len < cid) {
                out.writeShort(0);
                len++;
            }
            var old_gid = this$1.ncid2ogid[cid];
            if (old_gid) {
                var new_gid = this$1.ogid2ngid[old_gid];
                out.writeShort(new_gid);
            } else {
                out.writeShort(0);
            }
            len++;
        }
        return out.get();
    }
};

function TTFFont(rawData, name) {
    var self = this;
    var data = self.contents = BinaryStream(rawData);
    if (data.readString(4) == "ttcf") {
        var offset;
        var parse = function() {
            data.offset(offset);
            self.parse();
        };
        if (!name) {
            throw new Error("Must specify a name for TTC files");
        }
        data.readLong();        // version
        var numFonts = data.readLong();
        for (var i = 0; i < numFonts; ++i) {
            offset = data.readLong();
            data.saveExcursion(parse);
            if (self.psName == name) {
                return;
            }
        }
        throw new Error("Font " + name + " not found in collection");
    } else {
        data.offset(0);
        self.parse();
    }
}

TTFFont.prototype = {
    parse: function() {
        var dir = this.directory = new Directory(this.contents);

        this.head = dir.readTable("head", HeadTable);
        this.loca = dir.readTable("loca", LocaTable);
        this.hhea = dir.readTable("hhea", HheaTable);
        this.maxp = dir.readTable("maxp", MaxpTable);
        this.hmtx = dir.readTable("hmtx", HmtxTable);
        this.glyf = dir.readTable("glyf", GlyfTable);
        this.name = dir.readTable("name", NameTable);
        this.post = dir.readTable("post", PostTable);
        this.cmap = dir.readTable("cmap", CmapTable);
        this.os2  = dir.readTable("OS/2", OS2Table);

        this.psName = this.name.postscriptName;
        this.ascent = this.os2.ascent || this.hhea.ascent;
        this.descent = this.os2.descent || this.hhea.descent;
        this.lineGap = this.os2.lineGap || this.hhea.lineGap;
        this.scale = 1000 / this.head.unitsPerEm;
    },
    widthOfGlyph: function(glyph) {
        return this.hmtx.forGlyph(glyph).advance * this.scale;
    },
    makeSubset: function() {
        return new Subfont(this);
    }
};

/* eslint-disable no-multi-spaces, key-spacing, indent, camelcase, space-before-blocks, eqeqeq, brace-style */
/* eslint-disable space-infix-ops, space-before-function-paren, array-bracket-spacing, object-curly-spacing */
/* eslint-disable no-nested-ternary, max-params, default-case, no-else-return, no-empty */
/* eslint-disable no-param-reassign, no-var, block-scoped-var */

var browser$1 = support.browser;
// XXX: remove this junk (assume `true`) when we no longer have to support IE < 10
var HAS_TYPED_ARRAYS = typeof Uint8Array !== 'undefined';

var NL = "\n";

var RESOURCE_COUNTER = 0;

var PAPER_SIZE = {
    a0        : [ 2383.94 , 3370.39 ],
    a1        : [ 1683.78 , 2383.94 ],
    a2        : [ 1190.55 , 1683.78 ],
    a3        : [ 841.89  , 1190.55 ],
    a4        : [ 595.28  , 841.89  ],
    a5        : [ 419.53  , 595.28  ],
    a6        : [ 297.64  , 419.53  ],
    a7        : [ 209.76  , 297.64  ],
    a8        : [ 147.40  , 209.76  ],
    a9        : [ 104.88  , 147.40  ],
    a10       : [ 73.70   , 104.88  ],
    b0        : [ 2834.65 , 4008.19 ],
    b1        : [ 2004.09 , 2834.65 ],
    b2        : [ 1417.32 , 2004.09 ],
    b3        : [ 1000.63 , 1417.32 ],
    b4        : [ 708.66  , 1000.63 ],
    b5        : [ 498.90  , 708.66  ],
    b6        : [ 354.33  , 498.90  ],
    b7        : [ 249.45  , 354.33  ],
    b8        : [ 175.75  , 249.45  ],
    b9        : [ 124.72  , 175.75  ],
    b10       : [ 87.87   , 124.72  ],
    c0        : [ 2599.37 , 3676.54 ],
    c1        : [ 1836.85 , 2599.37 ],
    c2        : [ 1298.27 , 1836.85 ],
    c3        : [ 918.43  , 1298.27 ],
    c4        : [ 649.13  , 918.43  ],
    c5        : [ 459.21  , 649.13  ],
    c6        : [ 323.15  , 459.21  ],
    c7        : [ 229.61  , 323.15  ],
    c8        : [ 161.57  , 229.61  ],
    c9        : [ 113.39  , 161.57  ],
    c10       : [ 79.37   , 113.39  ],
    executive : [ 521.86  , 756.00  ],
    folio     : [ 612.00  , 936.00  ],
    legal     : [ 612.00  , 1008.00 ],
    letter    : [ 612.00  , 792.00  ],
    tabloid   : [ 792.00  , 1224.00 ]
};

function makeOutput() {
    var indentLevel = 0, output = BinaryStream();
    function out() {
        var arguments$1 = arguments;

        for (var i = 0; i < arguments.length; ++i) {
            var x = arguments$1[i];
            if (x === undefined) {
                throw new Error("Cannot output undefined to PDF");
            }
            else if (x instanceof PDFValue) {
                x.beforeRender(out);
                x.render(out);
            }
            else if (isArray(x)) {
                renderArray(x, out);
            }
            else if (isDate(x)) {
                renderDate(x, out);
            }
            else if (typeof x == "number") {
                if (isNaN(x)) {
                    throw new Error("Cannot output NaN to PDF");
                }
                // make sure it doesn't end up in exponent notation
                var num = x.toFixed(7);
                if (num.indexOf(".") >= 0) {
                    num = num.replace(/\.?0+$/, "");
                }
                if (num == "-0") {
                    num = "0";
                }
                output.writeString(num);
            }
            else if (/string|boolean/.test(typeof x)) {
                output.writeString(String(x));
            }
            else if (typeof x.get == "function") {
                output.write(x.get());
            }
            else if (typeof x == "object") {
                if (!x) {
                    output.writeString("null");
                } else {
                    out(new PDFDictionary(x));
                }
            }
        }
    }
    out.writeData = function(data) {
        output.write(data);
    };
    out.withIndent = function(f) {
        ++indentLevel;
        f(out);
        --indentLevel;
    };
    out.indent = function() {
        out(NL, pad("", indentLevel * 2, "  "));
        out.apply(null, arguments);
    };
    out.offset = function() {
        return output.offset();
    };
    out.toString = function() {
        throw new Error("FIX CALLER");
    };
    out.get = function() {
        return output.get();
    };
    out.stream = function() {
        return output;
    };
    return out;
}

function wrapObject(value, id) {
    var beforeRender = value.beforeRender;
    var renderValue = value.render;

    value.beforeRender = function(){};

    value.render = function(out) {
        out(id, " 0 R");
    };

    value.renderFull = function(out) {
        value._offset = out.offset();
        out(id, " 0 obj ");
        beforeRender.call(value, out);
        renderValue.call(value, out);
        out(" endobj");
    };
}

function getPaperOptions(getOption) {
    if (typeof getOption != "function") {
        var options = getOption;
        getOption = function(key, def) {
            return key in options ? options[key] : def;
        };
    }
    var paperSize = getOption("paperSize", PAPER_SIZE.a4);
    if (!paperSize) {
        return {};
    }
    if (typeof paperSize == "string") {
        paperSize = PAPER_SIZE[paperSize.toLowerCase()];
        if (paperSize == null) {
            throw new Error("Unknown paper size");
        }
    }

    paperSize[0] = unitsToPoints(paperSize[0]);
    paperSize[1] = unitsToPoints(paperSize[1]);

    if (getOption("landscape", false)) {
        paperSize = [
            Math.max(paperSize[0], paperSize[1]),
            Math.min(paperSize[0], paperSize[1])
        ];
    }

    var margin = getOption("margin");
    if (margin) {
        if (typeof margin == "string" || typeof margin == "number") {
            margin = unitsToPoints(margin, 0);
            margin = { left: margin, top: margin, right: margin, bottom: margin };
        } else {
            margin = {
                left   : unitsToPoints(margin.left, 0),
                top    : unitsToPoints(margin.top, 0),
                right  : unitsToPoints(margin.right, 0),
                bottom : unitsToPoints(margin.bottom, 0)
            };
        }
        if (getOption("addMargin")) {
            paperSize[0] += margin.left + margin.right;
            paperSize[1] += margin.top + margin.bottom;
        }
    }
    return { paperSize: paperSize, margin: margin };
}

function PDFDocument(options) {
    var self = this;
    var out = makeOutput();
    var objcount = 0;
    var objects = [];

    function getOption(name, defval) {
        return (options && options[name] != null) ? options[name] : defval;
    }

    self.getOption = getOption;

    self.attach = function(value) {
        if (objects.indexOf(value) < 0) {
            wrapObject(value, ++objcount);
            objects.push(value);
        }
        return value;
    };

    self.pages = [];

    self.FONTS = {};
    self.IMAGES = {};
    self.GRAD_COL_FUNCTIONS = {}; // cache for color gradient functions
    self.GRAD_OPC_FUNCTIONS = {}; // cache for opacity gradient functions
    self.GRAD_COL = {};     // cache for whole color gradient objects
    self.GRAD_OPC = {};     // cache for whole opacity gradient objects

    var catalog = self.attach(new PDFCatalog());
    var pageTree = self.attach(new PDFPageTree());
    catalog.setPages(pageTree);

    self.addPage = function(options) {
        var paperOptions  = getPaperOptions(function(name, defval){
            return (options && options[name] != null) ? options[name] : defval;
        });
        var paperSize     = paperOptions.paperSize;
        var margin        = paperOptions.margin;
        var contentWidth  = paperSize[0];
        var contentHeight = paperSize[1];
        if (margin) {
            contentWidth -= margin.left + margin.right;
            contentHeight -= margin.top + margin.bottom;
        }
        var content = new PDFStream(makeOutput(), null, true);
        var props = {
            Contents : self.attach(content),
            Parent   : pageTree,
            MediaBox : [ 0, 0, paperSize[0], paperSize[1] ]
        };
        var page = new PDFPage(self, props);
        page._content = content;
        pageTree.addPage(self.attach(page));

        // canvas-like coord. system.  (0,0) is upper-left.
        // text must be vertically mirorred before drawing.
        page.transform(1, 0, 0, -1, 0, paperSize[1]);

        if (margin) {
            page.translate(margin.left, margin.top);
            // XXX: clip to right/bottom margin.  Make this optional?
            page.rect(0, 0, contentWidth, contentHeight);
            page.clip();
        }

        self.pages.push(page);
        return page;
    };

    self.render = function() {
        var i;
        /// file header
        out("%PDF-1.4", NL, "%\xc2\xc1\xda\xcf\xce", NL, NL);

        /// file body
        for (i = 0; i < objects.length; ++i) {
            objects[i].renderFull(out);
            out(NL, NL);
        }

        /// cross-reference table
        var xrefOffset = out.offset();
        out("xref", NL, 0, " ", objects.length + 1, NL);
        out("0000000000 65535 f ", NL);
        for (i = 0; i < objects.length; ++i) {
            out(zeropad(objects[i]._offset, 10), " 00000 n ", NL);
        }
        out(NL);

        /// trailer
        out("trailer", NL);
        out(new PDFDictionary({
            Size: objects.length + 1,
            Root: catalog,
            Info: new PDFDictionary({
                Producer     : new PDFString(getOption("producer", "Kendo UI PDF Generator")), // XXX: kendo.version?
                Title        : new PDFString(getOption("title", "")),
                Author       : new PDFString(getOption("author", "")),
                Subject      : new PDFString(getOption("subject", "")),
                Keywords     : new PDFString(getOption("keywords", "")),
                Creator      : new PDFString(getOption("creator", "Kendo UI PDF Generator")),
                CreationDate : getOption("date", new Date())
            })
        }), NL, NL);

        /// end
        out("startxref", NL, xrefOffset, NL);
        out("%%EOF", NL);

        return out.stream().offset(0);
    };
}

var FONT_CACHE = {
    "Times-Roman"           : true,
    "Times-Bold"            : true,
    "Times-Italic"          : true,
    "Times-BoldItalic"      : true,
    "Helvetica"             : true,
    "Helvetica-Bold"        : true,
    "Helvetica-Oblique"     : true,
    "Helvetica-BoldOblique" : true,
    "Courier"               : true,
    "Courier-Bold"          : true,
    "Courier-Oblique"       : true,
    "Courier-BoldOblique"   : true,
    "Symbol"                : true,
    "ZapfDingbats"          : true
};

function loadBinary(url, cont) {
    function error() {
        if (window.console) {
            if (window.console.error) {
                window.console.error("Cannot load URL: %s", url);
            } else {
                window.console.log("Cannot load URL: %s", url);
            }
        }
        cont(null);
    }
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    if (HAS_TYPED_ARRAYS) {
        req.responseType = "arraybuffer";
    }
    req.onload = function() {
        if (req.status == 200 || req.status == 304) {
            if (HAS_TYPED_ARRAYS) {
                cont(new Uint8Array(req.response));
            } else {
                cont(new window.VBArray(req.responseBody).toArray()); // IE9 only
            }
        } else {
            error();
        }
    };
    req.onerror = error;
    req.send(null);
}

function loadFont(url, cont) {
    var font = FONT_CACHE[url];
    if (font) {
        cont(font);
    } else {
        loadBinary(url, function(data){
            if (data == null) {
                throw new Error("Cannot load font from " + url);
            } else {
                var font = new TTFFont(data);
                FONT_CACHE[url] = font;
                cont(font);
            }
        });
    }
}

var IMAGE_CACHE = {};

function loadImage(url, cont) {
    var img = IMAGE_CACHE[url], bloburl, blob;
    if (img) {
        cont(img);
    } else {
        img = new Image();
        if (!(/^data:/i.test(url))) {
            img.crossOrigin = "Anonymous";
        }
        if (HAS_TYPED_ARRAYS && !(/^data:/i.test(url))) {
            // IE10 fails to load images from another domain even when the server sends the
            // proper CORS headers.  a XHR, however, will be able to load the data.
            // http://stackoverflow.com/a/19734516/154985
            //
            // On the other hand, it's worth doing it this way for all browsers which support
            // responseType = "blob" (HAS_TYPED_ARRAYS will be true), because we can inspect the
            // mime type and if it's a JPEG (very common case) we can save a lot of time in
            // _load below.
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                blob = xhr.response;
                bloburl = URL.createObjectURL(blob);
                _load(bloburl);
            };
            xhr.onerror = _onerror;
            xhr.open("GET", url, true);
            xhr.responseType = "blob";
            xhr.send();
        } else {
            _load(url);
        }
    }

    function _load(url) {
        img.src = url;
        if (img.complete && !browser$1.msie) {
            // IE, bless it's little heart, says img.complete == true even though the image is
            // not loaded (width=0), therefore we must go the onload route (ticket 929635).
            _onload();
        } else {
            img.onload = _onload;
            img.onerror = _onerror;
        }
    }

    function _onerror() {
        cont(IMAGE_CACHE[url] = "TAINTED");
    }

    function _onload() {
        if (blob && /^image\/jpe?g$/i.test(blob.type)) {
            // If we know we got a JPEG, we can skip the process of rendering it to a
            // canvas, getting the pixel data, searching for transparency we know we won't
            // find, getting back a data URI and then decoding the BASE64 to finally get the
            // binary we already have.  Also, we avoid downgrading the image quality, with
            // the possible drawback of making a bigger PDF; still, seems legit.
            //
            // Besides saving a lot of work, this also reuses the buffer memory
            // (BinaryStream does not create a copy), potentially saving some GC cycles.
            var reader = new FileReader();
            reader.onload = function() {
                img = new PDFJpegImage(BinaryStream(new Uint8Array(this.result)));
                URL.revokeObjectURL(bloburl);
                cont(IMAGE_CACHE[url] = img);
            };
            reader.readAsArrayBuffer(blob);
            return;
        }

        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0);

        var imgdata;
        try {
            imgdata = ctx.getImageData(0, 0, img.width, img.height);
        } catch (ex) {
            // it tainted the canvas -- can't draw it.
            _onerror();
            return;
        } finally {
            if (bloburl) {
                URL.revokeObjectURL(bloburl);
            }
        }

        // in case it contains transparency, we must separate rgb data from the alpha
        // channel and create a PDFRawImage image with opacity.  otherwise we can use a
        // PDFJpegImage.
        //
        // to do this in one step, we create the rgb and alpha streams anyway, even if
        // we might end up not using them if hasAlpha remains false.

        var hasAlpha = false, rgb = BinaryStream(), alpha = BinaryStream();
        var rawbytes = imgdata.data;
        var i = 0;
        while (i < rawbytes.length) {
            rgb.writeByte(rawbytes[i++]);
            rgb.writeByte(rawbytes[i++]);
            rgb.writeByte(rawbytes[i++]);
            var a = rawbytes[i++];
            if (a < 255) {
                hasAlpha = true;
            }
            alpha.writeByte(a);
        }

        if (hasAlpha) {
            img = new PDFRawImage(img.width, img.height, rgb, alpha);
        } else {
            // no transparency, encode as JPEG.
            var data = canvas.toDataURL("image/jpeg");
            data = data.substr(data.indexOf(";base64,") + 8);

            var stream = BinaryStream();
            stream.writeBase64(data);
            img = new PDFJpegImage(stream);
        }

        cont(IMAGE_CACHE[url] = img);
    }
}

function manyLoader(loadOne) {
    return function(urls, callback) {
        var n = urls.length, i = n;
        if (n === 0) {
            return callback();
        }
        function next() {
            if (--n === 0) {
                callback();
            }
        }
        while (i-- > 0) {
            loadOne(urls[i], next);
        }
    };
}

var loadFonts = manyLoader(loadFont);
var loadImages = manyLoader(loadImage);

PDFDocument.prototype = {
    loadFonts: loadFonts,
    loadImages: loadImages,

    getFont: function(url) {
        var font = this.FONTS[url];
        if (!font) {
            font = FONT_CACHE[url];
            if (!font) {
                throw new Error("Font " + url + " has not been loaded");
            }
            if (font === true) {
                font = this.attach(new PDFStandardFont(url));
            } else {
                font = this.attach(new PDFFont(this, font));
            }
            this.FONTS[url] = font;
        }
        return font;
    },

    getImage: function(url) {
        var img = this.IMAGES[url];
        if (!img) {
            img = IMAGE_CACHE[url];
            if (!img) {
                throw new Error("Image " + url + " has not been loaded");
            }
            if (img === "TAINTED") {
                return null;
            }
            img = this.IMAGES[url] = this.attach(img.asStream(this));
        }
        return img;
    },

    getOpacityGS: function(opacity, forStroke) {
        var id = parseFloat(opacity).toFixed(3);
        opacity = parseFloat(id);
        id += forStroke ? "S" : "F";
        var cache = this._opacityGSCache || (this._opacityGSCache = {});
        var gs = cache[id];
        if (!gs) {
            var props = {
                Type: _("ExtGState")
            };
            if (forStroke) {
                props.CA = opacity;
            } else {
                props.ca = opacity;
            }
            gs = this.attach(new PDFDictionary(props));
            gs._resourceName = _("GS" + (++RESOURCE_COUNTER));
            cache[id] = gs;
        }
        return gs;
    },

    dict: function(props) {
        return new PDFDictionary(props);
    },

    name: function(str) {
        return _(str);
    },

    stream: function(props, content) {
        return new PDFStream(content, props);
    }
};

/* -----[ utils ]----- */

function pad(str, len, ch) {
    while (str.length < len) {
        str = ch + str;
    }
    return str;
}

function zeropad(n, len) {
    return pad(String(n), len, "0");
}

function hasOwnProperty(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

var isArray = Array.isArray || function(obj) {
    return obj instanceof Array;
};

function isDate(obj) {
    return obj instanceof Date;
}

function renderArray(a, out) {
    out("[");
    if (a.length > 0) {
        out.withIndent(function(){
            for (var i = 0; i < a.length; ++i) {
                if (i > 0 && i % 8 === 0) {
                    out.indent(a[i]);
                } else {
                    out(" ", a[i]);
                }
            }
        });
        //out.indent();
    }
    out(" ]");
}

function renderDate(date, out) {
    out("(D:",
        zeropad(date.getUTCFullYear(), 4),
        zeropad(date.getUTCMonth() + 1, 2),
        zeropad(date.getUTCDate(), 2),
        zeropad(date.getUTCHours(), 2),
        zeropad(date.getUTCMinutes(), 2),
        zeropad(date.getUTCSeconds(), 2),
        "Z)");
}

function mm2pt(mm) {
    return mm * (72/25.4);
}

function cm2pt(cm) {
    return mm2pt(cm * 10);
}

function in2pt(inch)  {
    return inch * 72;
}


function unitsToPoints(x, def) {
    if (typeof x == "number") {
        return x;
    }
    if (typeof x == "string") {
        var m;
        m = /^\s*([0-9.]+)\s*(mm|cm|in|pt)\s*$/.exec(x);
        if (m) {
            var num = parseFloat(m[1]);
            if (!isNaN(num)) {
                if (m[2] == "pt") {
                    return num;
                }
                return {
                    "mm": mm2pt,
                    "cm": cm2pt,
                    "in": in2pt
                }[m[2]](num);
            }
        }
    }
    if (def != null) {
        return def;
    }
    throw new Error("Can't parse unit: " + x);
}

/* -----[ PDF basic objects ]----- */

function PDFValue(){}

PDFValue.prototype.beforeRender = function(){};

function defclass(Ctor, proto, Base) {
    if (!Base) {
        Base = PDFValue;
    }
    Ctor.prototype = new Base();
    for (var i in proto) {
        if (hasOwnProperty(proto, i)) {
            Ctor.prototype[i] = proto[i];
        }
    }
    return Ctor;
}

/// strings

var PDFString = defclass(function PDFString(value){
    this.value = value;
}, {
    render: function(out) {
        var txt = "", val = this.value;
        for (var i = 0; i < val.length; ++i) {
            txt += String.fromCharCode(val.charCodeAt(i) & 0xFF);
        }
        out("(", txt.replace(/([\(\)\\])/g, "\\$1"), ")");
    },
    toString: function() {
        return this.value;
    }
});

var PDFHexString = defclass(function PDFHexString(value){
    this.value = value;
}, {
    render: function(out) {
        var this$1 = this;

        out("<");
        for (var i = 0; i < this.value.length; ++i) {
            out(zeropad(this$1.value.charCodeAt(i).toString(16), 4));
        }
        out(">");
    }
}, PDFString);

/// names

var PDFName = defclass(function PDFName(name) {
    this.name = name;
}, {
    render: function(out) {
        out("/" + this.escape());
    },
    escape: function() {
        return this.name.replace(/[^\x21-\x7E]/g, function(c){
            return "#" + zeropad(c.charCodeAt(0).toString(16), 2);
        });
    },
    toString: function() {
        return this.name;
    }
});

var PDFName_cache = {};
PDFName.get = _;

function _(name) {
    if (hasOwnProperty(PDFName_cache, name)) {
        return PDFName_cache[name];
    }
    return (PDFName_cache[name] = new PDFName(name));
}

/// dictionary

var PDFDictionary = defclass(function PDFDictionary(props) {
    this.props = props;
}, {
    render: function(out) {
        var props = this.props, empty = true;
        out("<<");
        out.withIndent(function(){
            for (var i in props) {
                if (hasOwnProperty(props, i) && !/^_/.test(i)) {
                    empty = false;
                    out.indent(_(i), " ", props[i]);
                }
            }
        });
        if (!empty) {
            out.indent();
        }
        out(">>");
    }
});

/// streams

var PDFStream = defclass(function PDFStream(data, props, compress) {
    if (typeof data == "string") {
        var tmp = BinaryStream();
        tmp.write(data);
        data = tmp;
    }
    this.data = data;
    this.props = props || {};
    this.compress = compress;
}, {
    render: function(out) {
        var data = this.data.get(), props = this.props;
        if (this.compress && window.pako && typeof window.pako.deflate == "function") {
            if (!props.Filter) {
                props.Filter = [];
            } else if (!(props.Filter instanceof Array)) {
                props.Filter = [ props.Filter ];
            }
            props.Filter.unshift(_("FlateDecode"));
            data = window.pako.deflate(data);
        }
        props.Length = data.length;
        out(new PDFDictionary(props), " stream", NL);
        out.writeData(data);
        out(NL, "endstream");
    }
});

/// catalog

var PDFCatalog = defclass(function PDFCatalog(props){
    props = this.props = props || {};
    props.Type = _("Catalog");
}, {
    setPages: function(pagesObj) {
        this.props.Pages = pagesObj;
    }
}, PDFDictionary);

/// page tree

var PDFPageTree = defclass(function PDFPageTree(){
    this.props = {
        Type  : _("Pages"),
        Kids  : [],
        Count : 0
    };
}, {
    addPage: function(pageObj) {
        this.props.Kids.push(pageObj);
        this.props.Count++;
    }
}, PDFDictionary);

/// images

// JPEG

var SOF_CODES = [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf];

function PDFJpegImage(data) {
    // we must determine the correct color space.  we'll parse a bit
    // of the JPEG stream for this, it's still better than going
    // through the canvas.
    // https://github.com/telerik/kendo-ui-core/issues/2845
    data.offset(0);
    var width, height, colorSpace, bitsPerComponent;
    var soi = data.readShort();
    if (soi != 0xFFD8) {
        // XXX: do we have some better options here?
        throw new Error("Invalid JPEG image");
    }
    while (!data.eof()) {
        var ff = data.readByte();
        if (ff != 0xFF) {
            throw new Error("Invalid JPEG image");
        }
        var marker = data.readByte();
        var length = data.readShort();
        if (SOF_CODES.indexOf(marker) >= 0) {
            // "start of frame" marker
            bitsPerComponent = data.readByte();
            height = data.readShort();
            width = data.readShort();
            colorSpace = data.readByte();
            break;
        }
        data.skip(length - 2);
    }

    if (colorSpace == null) {
        throw new Error("Invalid JPEG image");
    }

    var props = {
        Type             : _("XObject"),
        Subtype          : _("Image"),
        Width            : width,
        Height           : height,
        BitsPerComponent : bitsPerComponent,
        Filter           : _("DCTDecode")
    };

    switch (colorSpace) {
      case 1:
        props.ColorSpace = _("DeviceGray");
        break;
      case 3:
        props.ColorSpace = _("DeviceRGB");
        break;
      case 4:
        props.ColorSpace = _("DeviceCMYK");
        props.Decode = [ 1, 0, 1, 0, 1, 0, 1, 0 ]; // invert colors
        break;
    }

    this.asStream = function() {
        data.offset(0);
        var stream = new PDFStream(data, props);
        stream._resourceName = _("I" + (++RESOURCE_COUNTER));
        return stream;
    };
}

// PDFRawImage will be used for images with transparency (PNG)

function PDFRawImage(width, height, rgb, alpha) {
    this.asStream = function(pdf) {
        var mask = new PDFStream(alpha, {
            Type             : _("XObject"),
            Subtype          : _("Image"),
            Width            : width,
            Height           : height,
            BitsPerComponent : 8,
            ColorSpace       : _("DeviceGray")
        }, true);
        var stream = new PDFStream(rgb, {
            Type             : _("XObject"),
            Subtype          : _("Image"),
            Width            : width,
            Height           : height,
            BitsPerComponent : 8,
            ColorSpace       : _("DeviceRGB"),
            SMask            : pdf.attach(mask)
        }, true);
        stream._resourceName = _("I" + (++RESOURCE_COUNTER));
        return stream;
    };
}

/// standard fonts

var PDFStandardFont = defclass(function PDFStandardFont(name){
    this.props = {
        Type     : _("Font"),
        Subtype  : _("Type1"),
        BaseFont : _(name)
    };
    this._resourceName = _("F" + (++RESOURCE_COUNTER));
}, {
    encodeText: function(str) {
        return new PDFString(String(str));
    }
}, PDFDictionary);

/// TTF fonts

var PDFFont = defclass(function PDFFont(pdf, font, props){
    props = this.props = props || {};
    props.Type = _("Font");
    props.Subtype = _("Type0");
    props.Encoding = _("Identity-H");

    this._pdf = pdf;
    this._font = font;
    this._sub = font.makeSubset();
    this._resourceName = _("F" + (++RESOURCE_COUNTER));

    var head = font.head;

    this.name = font.psName;
    var scale = this.scale = font.scale;
    this.bbox = [
        head.xMin * scale,
        head.yMin * scale,
        head.xMax * scale,
        head.yMax * scale
    ];

    this.italicAngle = font.post.italicAngle;
    this.ascent = font.ascent * scale;
    this.descent = font.descent * scale;
    this.lineGap = font.lineGap * scale;
    this.capHeight = font.os2.capHeight || this.ascent;
    this.xHeight = font.os2.xHeight || 0;
    this.stemV = 0;

    this.familyClass = (font.os2.familyClass || 0) >> 8;
    this.isSerif = this.familyClass >= 1 && this.familyClass <= 7;
    this.isScript = this.familyClass == 10;

    this.flags = ((font.post.isFixedPitch ? 1 : 0) |
                  (this.isSerif ? 1 << 1 : 0) |
                  (this.isScript ? 1 << 3 : 0) |
                  (this.italicAngle !== 0 ? 1 << 6 : 0) |
                  (1 << 5));
}, {
    encodeText: function(text) {
        return new PDFHexString(this._sub.encodeText(String(text)));
    },
    getTextWidth: function(fontSize, text) {
        var this$1 = this;

        var width = 0, codeMap = this._font.cmap.codeMap;
        for (var i = 0; i < text.length; ++i) {
            var glyphId = codeMap[text.charCodeAt(i)];
            width += this$1._font.widthOfGlyph(glyphId || 0);
        }
        return width * fontSize / 1000;
    },
    beforeRender: function() {
        var self = this;
        var sub = self._sub;

        // write the TTF data
        var data = sub.render();
        var fontStream = new PDFStream(BinaryStream(data), {
            Length1: data.length
        }, true);

        var descriptor = self._pdf.attach(new PDFDictionary({
            Type         : _("FontDescriptor"),
            FontName     : _(self._sub.psName),
            FontBBox     : self.bbox,
            Flags        : self.flags,
            StemV        : self.stemV,
            ItalicAngle  : self.italicAngle,
            Ascent       : self.ascent,
            Descent      : self.descent,
            CapHeight    : self.capHeight,
            XHeight      : self.xHeight,
            FontFile2    : self._pdf.attach(fontStream)
        }));

        var cmap = sub.ncid2ogid;
        var firstChar = sub.firstChar;
        var lastChar = sub.lastChar;
        var charWidths = [];
        (function loop(i, chunk){
            if (i <= lastChar) {
                var gid = cmap[i];
                if (gid == null) {
                    loop(i + 1);
                } else {
                    if (!chunk) {
                        charWidths.push(i, chunk = []);
                    }
                    chunk.push(self._font.widthOfGlyph(gid));
                    loop(i + 1, chunk);
                }
            }
        })(firstChar);

        // As if two dictionaries weren't enough, we need another
        // one, the "descendant font".  Only that one can be of
        // Subtype CIDFontType2.  PDF is the X11 of document
        // formats: portable but full of legacy that nobody cares
        // about anymore.

        var descendant = new PDFDictionary({
            Type: _("Font"),
            Subtype: _("CIDFontType2"),
            BaseFont: _(self._sub.psName),
            CIDSystemInfo: new PDFDictionary({
                Registry   : new PDFString("Adobe"),
                Ordering   : new PDFString("Identity"),
                Supplement : 0
            }),
            FontDescriptor: descriptor,
            FirstChar: firstChar,
            LastChar: lastChar,
            DW: Math.round(self._font.widthOfGlyph(0)),
            W: charWidths,
            CIDToGIDMap: self._pdf.attach(self._makeCidToGidMap())
        });

        var dict = self.props;
        dict.BaseFont = _(self._sub.psName);
        dict.DescendantFonts = [ self._pdf.attach(descendant) ];

        // Compute the ToUnicode map so that apps can extract
        // meaningful text from the PDF.
        var unimap = new PDFToUnicodeCmap(firstChar, lastChar, sub.subset);
        var unimapStream = new PDFStream(makeOutput(), null, true);
        unimapStream.data(unimap);
        dict.ToUnicode = self._pdf.attach(unimapStream);
    },
    _makeCidToGidMap: function() {
        return new PDFStream(BinaryStream(this._sub.cidToGidMap()), null, true);
    }
}, PDFDictionary);

var PDFToUnicodeCmap = defclass(function PDFUnicodeCMap(firstChar, lastChar, map){
    this.firstChar = firstChar;
    this.lastChar = lastChar;
    this.map = map;
}, {
    render: function(out) {
        out.indent("/CIDInit /ProcSet findresource begin");
        out.indent("12 dict begin");
        out.indent("begincmap");
        out.indent("/CIDSystemInfo <<");
        out.indent("  /Registry (Adobe)");
        out.indent("  /Ordering (UCS)");
        out.indent("  /Supplement 0");
        out.indent(">> def");
        out.indent("/CMapName /Adobe-Identity-UCS def");
        out.indent("/CMapType 2 def");
        out.indent("1 begincodespacerange");
        out.indent("  <0000><ffff>");
        out.indent("endcodespacerange");

        var self = this;
        out.indent(self.lastChar - self.firstChar + 1, " beginbfchar");
        out.withIndent(function(){
            for (var code = self.firstChar; code <= self.lastChar; ++code) {
                var unicode = self.map[code];
                var str = ucs2encode([ unicode ]);
                out.indent("<", zeropad(code.toString(16), 4), ">", "<");
                for (var i = 0; i < str.length; ++i) {
                    out(zeropad(str.charCodeAt(i).toString(16), 4));
                }
                out(">");
            }
        });
        out.indent("endbfchar");

        out.indent("endcmap");
        out.indent("CMapName currentdict /CMap defineresource pop");
        out.indent("end");
        out.indent("end");
    }
});

/// gradients

function makeHash(a) {
    return a.map(function(x){
        return isArray(x) ? makeHash(x)
            : typeof x == "number" ? (Math.round(x * 1000) / 1000).toFixed(3)
            : x;
    }).join(" ");
}

function cacheColorGradientFunction(pdf, r1, g1, b1, r2, g2, b2) {
    var hash = makeHash([ r1, g1, b1, r2, g2, b2 ]);
    var func = pdf.GRAD_COL_FUNCTIONS[hash];
    if (!func) {
        func = pdf.GRAD_COL_FUNCTIONS[hash] = pdf.attach(new PDFDictionary({
            FunctionType: 2,
            Domain: [ 0, 1 ],
            Range: [ 0, 1, 0, 1, 0, 1 ],
            N: 1,
            C0: [ r1 , g1 , b1 ],
            C1: [ r2 , g2 , b2 ]
        }));
    }
    return func;
}

function cacheOpacityGradientFunction(pdf, a1, a2) {
    var hash = makeHash([ a1, a2 ]);
    var func = pdf.GRAD_OPC_FUNCTIONS[hash];
    if (!func) {
        func = pdf.GRAD_OPC_FUNCTIONS[hash] = pdf.attach(new PDFDictionary({
            FunctionType: 2,
            Domain: [ 0, 1 ],
            Range: [ 0, 1 ],
            N: 1,
            C0: [ a1 ],
            C1: [ a2 ]
        }));
    }
    return func;
}

function makeGradientFunctions(pdf, stops) {
    var hasAlpha = false;
    var opacities = [];
    var colors = [];
    var offsets = [];
    var encode = [];
    var i, prev, cur, prevColor, curColor;
    for (i = 1; i < stops.length; ++i) {
        prev = stops[i - 1];
        cur = stops[i];
        prevColor = prev.color;
        curColor = cur.color;
        colors.push(cacheColorGradientFunction(
            pdf,
            prevColor.r, prevColor.g, prevColor.b,
            curColor.r,  curColor.g,  curColor.b
        ));
        if (prevColor.a < 1 || curColor.a < 1) {
            hasAlpha = true;
        }
        offsets.push(cur.offset);
        encode.push(0, 1);
    }
    if (hasAlpha) {
        for (i = 1; i < stops.length; ++i) {
            prev = stops[i - 1];
            cur = stops[i];
            prevColor = prev.color;
            curColor = cur.color;
            opacities.push(cacheOpacityGradientFunction(
                pdf, prevColor.a, curColor.a
            ));
        }
    }
    offsets.pop();
    return {
        hasAlpha  : hasAlpha,
        colors    : assemble(colors),
        opacities : hasAlpha ? assemble(opacities) : null
    };
    function assemble(funcs) {
        if (funcs.length == 1) {
            return funcs[0];
        }
        return {
            FunctionType: 3,
            Functions: funcs,
            Domain: [ 0, 1 ],
            Bounds: offsets,
            Encode: encode
        };
    }
}

function cacheColorGradient(pdf, isRadial, stops, coords, funcs, box) {
    var shading, hash;
    // if box is given then we have user-space coordinates, which
    // means the gradient is designed for a certain position/size
    // on page.  caching won't do any good.
    if (!box) {
        var a = [ isRadial ].concat(coords);
        stops.forEach(function(x){
            a.push(x.offset, x.color.r, x.color.g, x.color.b);
        });
        hash = makeHash(a);
        shading = pdf.GRAD_COL[hash];
    }
    if (!shading) {
        shading = new PDFDictionary({
            Type: _("Shading"),
            ShadingType: isRadial ? 3 : 2,
            ColorSpace: _("DeviceRGB"),
            Coords: coords,
            Domain: [ 0, 1 ],
            Function: funcs,
            Extend: [ true, true ]
        });
        pdf.attach(shading);
        shading._resourceName = "S" + (++RESOURCE_COUNTER);
        if (hash) {
            pdf.GRAD_COL[hash] = shading;
        }
    }
    return shading;
}

function cacheOpacityGradient(pdf, isRadial, stops, coords, funcs, box) {
    var opacity, hash;
    // if box is given then we have user-space coordinates, which
    // means the gradient is designed for a certain position/size
    // on page.  caching won't do any good.
    if (!box) {
        var a = [ isRadial ].concat(coords);
        stops.forEach(function(x){
            a.push(x.offset, x.color.a);
        });
        hash = makeHash(a);
        opacity = pdf.GRAD_OPC[hash];
    }
    if (!opacity) {
        opacity = new PDFDictionary({
            Type: _("ExtGState"),
            AIS: false,
            CA: 1,
            ca: 1,
            SMask: {
                Type: _("Mask"),
                S: _("Luminosity"),
                G: pdf.attach(new PDFStream("/a0 gs /s0 sh", {
                    Type: _("XObject"),
                    Subtype: _("Form"),
                    FormType: 1,
                    BBox: (box ? [
                        box.left, box.top + box.height, box.left + box.width, box.top
                    ] : [ 0, 1, 1, 0 ]),
                    Group: {
                        Type: _("Group"),
                        S: _("Transparency"),
                        CS: _("DeviceGray"),
                        I: true
                    },
                    Resources: {
                        ExtGState: {
                            a0: { CA: 1, ca: 1 }
                        },
                        Shading: {
                            s0: {
                                ColorSpace: _("DeviceGray"),
                                Coords: coords,
                                Domain: [ 0, 1 ],
                                ShadingType: isRadial ? 3 : 2,
                                Function: funcs,
                                Extend: [ true, true ]
                            }
                        }
                    }
                }))
            }
        });
        pdf.attach(opacity);
        opacity._resourceName = "O" + (++RESOURCE_COUNTER);
        if (hash) {
            pdf.GRAD_OPC[hash] = opacity;
        }
    }
    return opacity;
}

function cacheGradient(pdf, gradient, box) {
    var isRadial = gradient.type == "radial";
    var funcs = makeGradientFunctions(pdf, gradient.stops);
    var coords = isRadial ? [
        gradient.start.x , gradient.start.y , gradient.start.r,
        gradient.end.x   , gradient.end.y   , gradient.end.r
    ] : [
        gradient.start.x , gradient.start.y,
        gradient.end.x   , gradient.end.y
    ];
    var shading = cacheColorGradient(
        pdf, isRadial, gradient.stops, coords, funcs.colors, gradient.userSpace && box
    );
    var opacity = funcs.hasAlpha ? cacheOpacityGradient(
        pdf, isRadial, gradient.stops, coords, funcs.opacities, gradient.userSpace && box
    ) : null;
    return {
        hasAlpha: funcs.hasAlpha,
        shading: shading,
        opacity: opacity
    };
}

/// page object

var PDFPage = defclass(function PDFPage(pdf, props){
    this._pdf = pdf;
    this._rcount = 0;
    this._textMode = false;
    this._fontResources = {};
    this._gsResources = {};
    this._xResources = {};
    this._patResources = {};
    this._shResources = {};
    this._opacity = 1;
    this._matrix = [ 1, 0, 0, 1, 0, 0 ];
    this._annotations = [];

    this._font = null;
    this._fontSize = null;

    this._contextStack = [];

    props = this.props = props || {};
    props.Type = _("Page");
    props.ProcSet = [
        _("PDF"),
        _("Text"),
        _("ImageB"),
        _("ImageC"),
        _("ImageI")
    ];
    props.Resources = new PDFDictionary({
        Font      : new PDFDictionary(this._fontResources),
        ExtGState : new PDFDictionary(this._gsResources),
        XObject   : new PDFDictionary(this._xResources),
        Pattern   : new PDFDictionary(this._patResources),
        Shading   : new PDFDictionary(this._shResources)
    });
    props.Annots = this._annotations;
}, {
    _out: function() {
        this._content.data.apply(null, arguments);
    },
    transform: function(a, b, c, d, e, f) {
        if (!isIdentityMatrix(arguments)) {
            this._matrix = mmul(arguments, this._matrix);
            this._out(a, " ", b, " ", c, " ", d, " ", e, " ", f, " cm");
            // XXX: debug
            // this._out(" % current matrix: ", this._matrix);
            this._out(NL);
        }
    },
    translate: function(dx, dy) {
        this.transform(1, 0, 0, 1, dx, dy);
    },
    scale: function(sx, sy) {
        this.transform(sx, 0, 0, sy, 0, 0);
    },
    rotate: function(angle) {
        var cos = Math.cos(angle), sin = Math.sin(angle);
        this.transform(cos, sin, -sin, cos, 0, 0);
    },
    beginText: function() {
        this._textMode = true;
        this._out("BT", NL);
    },
    endText: function() {
        this._textMode = false;
        this._out("ET", NL);
    },
    _requireTextMode: function() {
        if (!this._textMode) {
            throw new Error("Text mode required; call page.beginText() first");
        }
    },
    _requireFont: function() {
        if (!this._font) {
            throw new Error("No font selected; call page.setFont() first");
        }
    },
    setFont: function(font, size) {
        this._requireTextMode();
        if (font == null) {
            font = this._font;
        } else if (!(font instanceof PDFFont)) {
            font = this._pdf.getFont(font);
        }
        if (size == null) {
            size = this._fontSize;
        }
        this._fontResources[font._resourceName] = font;
        this._font = font;
        this._fontSize = size;
        this._out(font._resourceName, " ", size, " Tf", NL);
    },
    setTextLeading: function(size) {
        this._requireTextMode();
        this._out(size, " TL", NL);
    },
    setTextRenderingMode: function(mode) {
        this._requireTextMode();
        this._out(mode, " Tr", NL);
    },
    showText: function(text, requestedWidth) {
        this._requireFont();
        if (text.length > 1 && requestedWidth && this._font instanceof PDFFont) {
            var outputWidth = this._font.getTextWidth(this._fontSize, text);
            var scale = requestedWidth / outputWidth * 100;
            this._out(scale, " Tz ");
        }
        this._out(this._font.encodeText(text), " Tj", NL);
    },
    showTextNL: function(text) {
        this._requireFont();
        this._out(this._font.encodeText(text), " '", NL);
    },
    addLink: function(uri, box) {
        var ll = this._toPage({ x: box.left, y: box.bottom });
        var ur = this._toPage({ x: box.right, y: box.top });
        this._annotations.push(new PDFDictionary({
            Type    : _("Annot"),
            Subtype : _("Link"),
            Rect    : [ ll.x, ll.y, ur.x, ur.y ],
            Border  : [ 0, 0, 0 ],
            A       : new PDFDictionary({
                Type : _("Action"),
                S    : _("URI"),
                URI  : new PDFString(uri)
            })
        }));
    },
    setStrokeColor: function(r, g, b) {
        this._out(r, " ", g, " ", b, " RG", NL);
    },
    setOpacity: function(opacity) {
        this.setFillOpacity(opacity);
        this.setStrokeOpacity(opacity);
        this._opacity *= opacity;
    },
    setStrokeOpacity: function(opacity) {
        if (opacity < 1) {
            var gs = this._pdf.getOpacityGS(this._opacity * opacity, true);
            this._gsResources[gs._resourceName] = gs;
            this._out(gs._resourceName, " gs", NL);
        }
    },
    setFillColor: function(r, g, b) {
        this._out(r, " ", g, " ", b, " rg", NL);
    },
    setFillOpacity: function(opacity) {
        if (opacity < 1) {
            var gs = this._pdf.getOpacityGS(this._opacity * opacity, false);
            this._gsResources[gs._resourceName] = gs;
            this._out(gs._resourceName, " gs", NL);
        }
    },
    gradient: function(gradient, box) {
        this.save();
        this.rect(box.left, box.top, box.width, box.height);
        this.clip();
        if (!gradient.userSpace) {
            this.transform(box.width, 0, 0, box.height, box.left, box.top);
        }
        var g = cacheGradient(this._pdf, gradient, box);
        var sname = g.shading._resourceName, oname;
        this._shResources[sname] = g.shading;
        if (g.hasAlpha) {
            oname = g.opacity._resourceName;
            this._gsResources[oname] = g.opacity;
            this._out("/" + oname + " gs ");
        }
        this._out("/" + sname + " sh", NL);
        this.restore();
    },
    setDashPattern: function(dashArray, dashPhase) {
        this._out(dashArray, " ", dashPhase, " d", NL);
    },
    setLineWidth: function(width) {
        this._out(width, " w", NL);
    },
    setLineCap: function(lineCap) {
        this._out(lineCap, " J", NL);
    },
    setLineJoin: function(lineJoin) {
        this._out(lineJoin, " j", NL);
    },
    setMitterLimit: function(mitterLimit) {
        this._out(mitterLimit, " M", NL);
    },
    save: function() {
        this._contextStack.push(this._context());
        this._out("q", NL);
    },
    restore: function() {
        this._out("Q", NL);
        this._context(this._contextStack.pop());
    },

    // paths
    moveTo: function(x, y) {
        this._out(x, " ", y, " m", NL);
    },
    lineTo: function(x, y) {
        this._out(x, " ", y, " l", NL);
    },
    bezier: function(x1, y1, x2, y2, x3, y3) {
        this._out(x1, " ", y1, " ", x2, " ", y2, " ", x3, " ", y3, " c", NL);
    },
    bezier1: function(x1, y1, x3, y3) {
        this._out(x1, " ", y1, " ", x3, " ", y3, " y", NL);
    },
    bezier2: function(x2, y2, x3, y3) {
        this._out(x2, " ", y2, " ", x3, " ", y3, " v", NL);
    },
    close: function() {
        this._out("h", NL);
    },
    rect: function(x, y, w, h) {
        this._out(x, " ", y, " ", w, " ", h, " re", NL);
    },
    ellipse: function(x, y, rx, ry) {
        function _X(v) { return x + v; }
        function _Y(v) { return y + v; }

        // how to get to the "magic number" is explained here:
        // http://www.whizkidtech.redprince.net/bezier/circle/kappa/
        var k = 0.5522847498307936;

        this.moveTo(_X(0), _Y(ry));
        this.bezier(
            _X(rx * k) , _Y(ry),
            _X(rx)     , _Y(ry * k),
            _X(rx)     , _Y(0)
        );
        this.bezier(
            _X(rx)     , _Y(-ry * k),
            _X(rx * k) , _Y(-ry),
            _X(0)      , _Y(-ry)
        );
        this.bezier(
            _X(-rx * k) , _Y(-ry),
            _X(-rx)     , _Y(-ry * k),
            _X(-rx)     , _Y(0)
        );
        this.bezier(
            _X(-rx)     , _Y(ry * k),
            _X(-rx * k) , _Y(ry),
            _X(0)       , _Y(ry)
        );
    },
    circle: function(x, y, r) {
        this.ellipse(x, y, r, r);
    },
    stroke: function() {
        this._out("S", NL);
    },
    nop: function() {
        this._out("n", NL);
    },
    clip: function() {
        this._out("W n", NL);
    },
    clipStroke: function() {
        this._out("W S", NL);
    },
    closeStroke: function() {
        this._out("s", NL);
    },
    fill: function() {
        this._out("f", NL);
    },
    fillStroke: function() {
        this._out("B", NL);
    },
    drawImage: function(url) {
        var img = this._pdf.getImage(url);
        if (img) { // the result can be null for a cross-domain image
            this._xResources[img._resourceName] = img;
            this._out(img._resourceName, " Do", NL);
        }
    },
    comment: function(txt) {
        var self = this;
        txt.split(/\r?\n/g).forEach(function(line){
            self._out("% ", line, NL);
        });
    },

    // internal
    _context: function(val) {
        if (val != null) {
            this._opacity = val.opacity;
            this._matrix = val.matrix;
        } else {
            return {
                opacity: this._opacity,
                matrix: this._matrix
            };
        }
    },

    _toPage: function(p) {
        var m = this._matrix;
        var a = m[0], b = m[1], c = m[2], d = m[3], e = m[4], f = m[5];
        return {
            x: a*p.x + c*p.y + e,
            y: b*p.x + d*p.y + f
        };
    }
}, PDFDictionary);

function unquote(str) {
    return str.replace(/^\s*(['"])(.*)\1\s*$/, "$2");
}

function parseFontDef(fontdef) {
    // XXX: this is very crude for now and buggy.  Proper parsing is quite involved.
    var rx = /^\s*((normal|italic)\s+)?((normal|small-caps)\s+)?((normal|bold|\d+)\s+)?(([0-9.]+)(px|pt))(\/(([0-9.]+)(px|pt)|normal))?\s+(.*?)\s*$/i;
    var m = rx.exec(fontdef);
    if (!m) {
        return { fontSize: 12, fontFamily: "sans-serif" };
    }
    var fontSize = m[8] ? parseInt(m[8], 10) : 12;
    return {
        italic     : m[2] && m[2].toLowerCase() == "italic",
        variant    : m[4],
        bold       : m[6] && /bold|700/i.test(m[6]),
        fontSize   : fontSize,
        lineHeight : m[12] ? m[12] == "normal" ? fontSize : parseInt(m[12], 10) : null,
        fontFamily : m[14].split(/\s*,\s*/g).map(unquote)
    };
}

function getFontURL(style) {
    function mkFamily(name) {
        if (style.bold) {
            name += "|bold";
        }
        if (style.italic) {
            name += "|italic";
        }
        return name.toLowerCase();
    }
    var fontFamily = style.fontFamily;
    var name, url;
    if (fontFamily instanceof Array) {
        for (var i = 0; i < fontFamily.length; ++i) {
            name = mkFamily(fontFamily[i]);
            url = FONT_MAPPINGS[name];
            if (url) {
                break;
            }
        }
    } else {
        url = FONT_MAPPINGS[fontFamily.toLowerCase()];
    }
    while (typeof url == "function") {
        url = url();
    }
    if (!url) {
        url = "Times-Roman";
    }
    return url;
}

var FONT_MAPPINGS = {
    "serif"                    : "Times-Roman",
    "serif|bold"               : "Times-Bold",
    "serif|italic"             : "Times-Italic",
    "serif|bold|italic"        : "Times-BoldItalic",
    "sans-serif"               : "Helvetica",
    "sans-serif|bold"          : "Helvetica-Bold",
    "sans-serif|italic"        : "Helvetica-Oblique",
    "sans-serif|bold|italic"   : "Helvetica-BoldOblique",
    "monospace"                : "Courier",
    "monospace|bold"           : "Courier-Bold",
    "monospace|italic"         : "Courier-Oblique",
    "monospace|bold|italic"    : "Courier-BoldOblique",
    "zapfdingbats"             : "ZapfDingbats",
    "zapfdingbats|bold"        : "ZapfDingbats",
    "zapfdingbats|italic"      : "ZapfDingbats",
    "zapfdingbats|bold|italic" : "ZapfDingbats"
};

function fontAlias(alias, name) {
    alias = alias.toLowerCase();
    FONT_MAPPINGS[alias] = function() {
        return FONT_MAPPINGS[name];
    };
    FONT_MAPPINGS[alias + "|bold"] = function() {
        return FONT_MAPPINGS[name + "|bold"];
    };
    FONT_MAPPINGS[alias + "|italic"] = function() {
        return FONT_MAPPINGS[name + "|italic"];
    };
    FONT_MAPPINGS[alias + "|bold|italic"] = function() {
        return FONT_MAPPINGS[name + "|bold|italic"];
    };
}

// Let's define some common names to an appropriate replacement.
// These are overridable via pdf.defineFont, should the user want to
// include the proper versions.

fontAlias("Times New Roman" , "serif");
fontAlias("Courier New"     , "monospace");
fontAlias("Arial"           , "sans-serif");
fontAlias("Helvetica"       , "sans-serif");
fontAlias("Verdana"         , "sans-serif");
fontAlias("Tahoma"          , "sans-serif");
fontAlias("Georgia"         , "sans-serif");
fontAlias("Monaco"          , "monospace");
fontAlias("Andale Mono"     , "monospace");

function defineFont(name, url) {
    if (arguments.length == 1) {
        for (var i in name) {
            if (hasOwnProperty(name, i)) {
                defineFont(i, name[i]);
            }
        }
    } else {
        name = name.toLowerCase();
        FONT_MAPPINGS[name] = url;

        // special handling for DejaVu fonts: if they get defined,
        // let them also replace the default families, for good
        // Unicode support out of the box.
        switch (name) {
          case "dejavu sans"               : FONT_MAPPINGS["sans-serif"]              = url; break;
          case "dejavu sans|bold"          : FONT_MAPPINGS["sans-serif|bold"]         = url; break;
          case "dejavu sans|italic"        : FONT_MAPPINGS["sans-serif|italic"]       = url; break;
          case "dejavu sans|bold|italic"   : FONT_MAPPINGS["sans-serif|bold|italic"]  = url; break;
          case "dejavu serif"              : FONT_MAPPINGS["serif"]                   = url; break;
          case "dejavu serif|bold"         : FONT_MAPPINGS["serif|bold"]              = url; break;
          case "dejavu serif|italic"       : FONT_MAPPINGS["serif|italic"]            = url; break;
          case "dejavu serif|bold|italic"  : FONT_MAPPINGS["serif|bold|italic"]       = url; break;
          case "dejavu mono"               : FONT_MAPPINGS["monospace"]               = url; break;
          case "dejavu mono|bold"          : FONT_MAPPINGS["monospace|bold"]          = url; break;
          case "dejavu mono|italic"        : FONT_MAPPINGS["monospace|italic"]        = url; break;
          case "dejavu mono|bold|italic"   : FONT_MAPPINGS["monospace|bold|italic"]   = url; break;
        }
    }
}

function mmul(a, b) {
    var a1 = a[0], b1 = a[1], c1 = a[2], d1 = a[3], e1 = a[4], f1 = a[5];
    var a2 = b[0], b2 = b[1], c2 = b[2], d2 = b[3], e2 = b[4], f2 = b[5];
    return [
        a1*a2 + b1*c2,          a1*b2 + b1*d2,
        c1*a2 + d1*c2,          c1*b2 + d1*d2,
        e1*a2 + f1*c2 + e2,     e1*b2 + f1*d2 + f2
    ];
}

function isIdentityMatrix(m) {
    return m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0;
}

var TEXT_RENDERING_MODE = {
    fill           : 0,
    stroke         : 1,
    fillAndStroke  : 2,
    invisible      : 3,
    fillAndClip    : 4,
    strokeAndClip  : 5,
    fillStrokeClip : 6,
    clip           : 7
};

/* eslint-disable no-multi-spaces, key-spacing, indent, camelcase, space-before-blocks, eqeqeq, brace-style */
/* eslint-disable space-infix-ops, space-before-function-paren, array-bracket-spacing, object-curly-spacing */
/* eslint-disable no-nested-ternary, max-params, default-case, no-else-return, no-empty */
/* eslint-disable no-param-reassign, no-var, block-scoped-var */

var TEXT_RENDERING_MODE$1 = TEXT_RENDERING_MODE;

var DASH_PATTERNS = {
    dash           : [ 4 ],
    dashDot        : [ 4, 2, 1, 2 ],
    dot            : [ 1, 2 ],
    longDash       : [ 8, 2 ],
    longDashDot    : [ 8, 2, 1, 2 ],
    longDashDotDot : [ 8, 2, 1, 2, 1, 2 ],
    solid          : []
};

var LINE_CAP = {
    butt   : 0,
    round  : 1,
    square : 2
};

var LINE_JOIN = {
    miter : 0,
    round : 1,
    bevel : 2
};

function render$1(group, callback) {
    var fonts = [], images = [], options = group.options;

    function getOption(name, defval, hash) {
        if (!hash) {
            hash = options;
        }
        if (hash.pdf && hash.pdf[name] != null) {
            return hash.pdf[name];
        }
        return defval;
    }

    var multiPage = getOption("multiPage");

    group.traverse(function(element){
        dispatch({
            Image: function(element) {
                if (images.indexOf(element.src()) < 0) {
                    images.push(element.src());
                }
            },
            Text: function(element) {
                var style = parseFontDef(element.options.font);
                var url = getFontURL(style);
                if (fonts.indexOf(url) < 0) {
                    fonts.push(url);
                }
            }
        }, element);
    });

    function doIt() {
        if (--count > 0) {
            return;
        }

        var pdf = new (PDFDocument)({
            producer  : getOption("producer"),
            title     : getOption("title"),
            author    : getOption("author"),
            subject   : getOption("subject"),
            keywords  : getOption("keywords"),
            creator   : getOption("creator"),
            date      : getOption("date")
        });

        function drawPage(group) {
            var options = group.options;

            var tmp = optimize(group);
            var bbox = tmp.bbox;
            group = tmp.root;
            // var tmp, bbox;

            var paperSize = getOption("paperSize", getOption("paperSize", "auto"), options), addMargin = false;
            if (paperSize == "auto") {
                if (bbox) {
                    var size = bbox.getSize();
                    paperSize = [ size.width, size.height ];
                    addMargin = true;
                    var origin = bbox.getOrigin();
                    tmp = new Group();
                    tmp.transform(new Matrix(1, 0, 0, 1, -origin.x, -origin.y));
                    tmp.append(group);
                    group = tmp;
                }
                else {
                    paperSize = "A4";
                }
            }

            var page;
            page = pdf.addPage({
                paperSize : paperSize,
                margin    : getOption("margin", getOption("margin"), options),
                addMargin : addMargin,
                landscape : getOption("landscape", getOption("landscape", false), options)
            });
            drawElement(group, page, pdf);
        }

        if (multiPage) {
            group.children.forEach(drawPage);
        } else {
            drawPage(group);
        }

        callback(pdf.render(), pdf);
    }

    var count = 2;
    loadFonts(fonts, doIt);
    loadImages(images, doIt);
}

function toDataURL(group, callback) {
    render$1(group, function(data){
        callback("data:application/pdf;base64," + data.base64());
    });
}

function toBlob(group, callback) {
    render$1(group, function(data){
        callback(new window.Blob([ data.get() ], { type: "application/pdf" }));
    });
}

function saveAs$1(group, filename, proxy, callback) {
    // XXX: Safari has Blob, but does not support the download attribute
    //      so we'd end up converting to dataURL and using the proxy anyway.
    if (window.Blob && !support.browser.safari) {
        toBlob(group, function(blob){
            saveAs({ dataURI: blob, fileName: filename });
            if (callback) {
                callback(blob);
            }
        });
    } else {
        toDataURL(group, function(dataURL){
            saveAs({ dataURI: dataURL, fileName: filename, proxyURL: proxy });
            if (callback) {
                callback(dataURL);
            }
        });
    }
}

function dispatch(handlers, element) {
    var handler = handlers[element.nodeType];
    if (handler) {
        return handler.call.apply(handler, arguments);
    }
    return element;
}

function drawElement(element, page, pdf) {
    if (element.options._pdfDebug) {
        page.comment("BEGIN: " + element.options._pdfDebug);
    }

    var transform$$1 = element.transform();
    var opacity = element.opacity();

    page.save();

    if (opacity != null && opacity < 1) {
        page.setOpacity(opacity);
    }

    setStrokeOptions(element, page, pdf);
    setFillOptions(element, page, pdf);

    if (transform$$1) {
        var m = transform$$1.matrix();
        page.transform(m.a, m.b, m.c, m.d, m.e, m.f);
    }

    setClipping(element, page, pdf);

    dispatch({
        Path      : drawPath,
        MultiPath : drawMultiPath,
        Circle    : drawCircle,
        Arc       : drawArc,
        Text      : drawText,
        Image     : drawImage$1,
        Group     : drawGroup,
        Rect      : drawRect
    }, element, page, pdf);

    page.restore();

    if (element.options._pdfDebug) {
        page.comment("END: " + element.options._pdfDebug);
    }
}

function setStrokeOptions(element, page) {
    var stroke = element.stroke && element.stroke();
    if (!stroke) {
        return;
    }

    var color = stroke.color;
    if (color) {
        color = parseColor$1(color);
        if (color == null) {
            return; // no stroke
        }
        page.setStrokeColor(color.r, color.g, color.b);
        if (color.a != 1) {
            page.setStrokeOpacity(color.a);
        }
    }

    var width = stroke.width;
    if (width != null) {
        if (width === 0) {
            return; // no stroke
        }
        page.setLineWidth(width);
    }

    var dashType = stroke.dashType;
    if (dashType) {
        page.setDashPattern(DASH_PATTERNS[dashType], 0);
    }

    var lineCap = stroke.lineCap;
    if (lineCap) {
        page.setLineCap(LINE_CAP[lineCap]);
    }

    var lineJoin = stroke.lineJoin;
    if (lineJoin) {
        page.setLineJoin(LINE_JOIN[lineJoin]);
    }

    var opacity = stroke.opacity;
    if (opacity != null) {
        page.setStrokeOpacity(opacity);
    }
}

function setFillOptions(element, page) {
    var fill = element.fill && element.fill();
    if (!fill) {
        return;
    }

    if (fill instanceof Gradient) {
        return;
    }

    var color = fill.color;
    if (color) {
        color = parseColor$1(color);
        if (color == null) {
            return; // no fill
        }
        page.setFillColor(color.r, color.g, color.b);
        if (color.a != 1) {
            page.setFillOpacity(color.a);
        }
    }

    var opacity = fill.opacity;
    if (opacity != null) {
        page.setFillOpacity(opacity);
    }
}

function setClipping(element, page, pdf) {
    // XXX: only Path supported at the moment.
    var clip = element.clip();
    if (clip) {
        _drawPath(clip, page, pdf);
        page.clip();
        // page.setStrokeColor(Math.random(), Math.random(), Math.random());
        // page.setLineWidth(1);
        // page.stroke();
    }
}

function shouldDraw(thing) {
    return (thing &&
            (thing instanceof Gradient ||
             (thing.color && !/^(none|transparent)$/i.test(thing.color) &&
              (thing.width == null || thing.width > 0) &&
              (thing.opacity == null || thing.opacity > 0))));
}

function maybeGradient(element, page, pdf, stroke) {
    var fill = element.fill();
    if (fill instanceof Gradient) {
        if (stroke) {
            page.clipStroke();
        } else {
            page.clip();
        }
        var isRadial = fill instanceof RadialGradient;
        var start, end;
        if (isRadial) {
            start = { x: fill.center().x , y: fill.center().y , r: 0 };
            end   = { x: fill.center().x , y: fill.center().y , r: fill.radius() };
        } else {
            start = { x: fill.start().x , y: fill.start().y };
            end   = { x: fill.end().x   , y: fill.end().y   };
        }

        var stops = fill.stops.elements().map(function(stop){
            var offset = stop.offset();
            if (/%$/.test(offset)) {
                offset = parseFloat(offset) / 100;
            } else {
                offset = parseFloat(offset);
            }
            var color = parseColor$1(stop.color());
            color.a *= stop.opacity();
            return {
                offset: offset,
                color: color
            };
        });

        // Duplicats first and last stop to fix
        // https://github.com/telerik/kendo-ui-core/issues/1782
        stops.unshift(stops[0]);
        stops.push(stops[stops.length - 1]);

        var gradient = {
            userSpace : fill.userSpace(),
            type      : isRadial ? "radial" : "linear",
            start     : start,
            end       : end,
            stops     : stops
        };
        var box = element.rawBBox();
        var tl = box.topLeft(), size = box.getSize();
        box = {
            left   : tl.x,
            top    : tl.y,
            width  : size.width,
            height : size.height
        };
        page.gradient(gradient, box);
        return true;
    }
}

function maybeFillStroke(element, page, pdf) {
    if (shouldDraw(element.fill()) && shouldDraw(element.stroke())) {
        if (!maybeGradient(element, page, pdf, true)) {
            page.fillStroke();
        }
    } else if (shouldDraw(element.fill())) {
        if (!maybeGradient(element, page, pdf, false)) {
            page.fill();
        }
    } else if (shouldDraw(element.stroke())) {
        page.stroke();
    } else {
        // we should not get here; the path should have been
        // optimized away.  but let's be prepared.
        page.nop();
    }
}

function maybeDrawRect(path, page) {
    var segments = path.segments;
    if (segments.length == 4 && path.options.closed) {
        // detect if this path looks like a rectangle parallel to the axis
        var a = [];
        for (var i = 0; i < segments.length; ++i) {
            if (segments[i].controlIn()) { // has curve?
                return false;
            }
            a[i] = segments[i].anchor();
        }
        // it's a rectangle if the y/x/y/x or x/y/x/y coords of
        // consecutive points are the same.
        var isRect = (
            a[0].y == a[1].y && a[1].x == a[2].x && a[2].y == a[3].y && a[3].x == a[0].x
        ) || (
            a[0].x == a[1].x && a[1].y == a[2].y && a[2].x == a[3].x && a[3].y == a[0].y
        );
        if (isRect) {
            // this saves a bunch of instructions in PDF:
            // moveTo, lineTo, lineTo, lineTo, close -> rect.
            page.rect(a[0].x, a[0].y,
                      a[2].x - a[0].x /*width*/,
                      a[2].y - a[0].y /*height*/);
            return true;
        }
    }
}

function _drawPath(element, page, pdf) {
    var segments = element.segments;
    if (segments.length === 0) {
        return;
    }
    if (!maybeDrawRect(element, page, pdf)) {
        for (var prev, i = 0; i < segments.length; ++i) {
            var seg = segments[i];
            var anchor = seg.anchor();
            if (!prev) {
                page.moveTo(anchor.x, anchor.y);
            } else {
                var prevOut = prev.controlOut();
                var controlIn = seg.controlIn();
                if (prevOut && controlIn) {
                    page.bezier(
                        prevOut.x   , prevOut.y,
                        controlIn.x , controlIn.y,
                        anchor.x    , anchor.y
                    );
                } else {
                    page.lineTo(anchor.x, anchor.y);
                }
            }
            prev = seg;
        }
        if (element.options.closed) {
            page.close();
        }
    }
}

function drawPath(element, page, pdf) {
    _drawPath(element, page, pdf);
    maybeFillStroke(element, page, pdf);
}

function drawMultiPath(element, page, pdf) {
    var paths = element.paths;
    for (var i = 0; i < paths.length; ++i) {
        _drawPath(paths[i], page, pdf);
    }
    maybeFillStroke(element, page, pdf);
}

function drawCircle(element, page, pdf) {
    var g = element.geometry();
    page.circle(g.center.x, g.center.y, g.radius);
    maybeFillStroke(element, page, pdf);
}

function drawArc(element, page, pdf) {
    var points = element.geometry().curvePoints();
    page.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length;) {
        page.bezier(
            points[i].x, points[i++].y,
            points[i].x, points[i++].y,
            points[i].x, points[i++].y
        );
    }
    maybeFillStroke(element, page, pdf);
}

function drawText(element, page) {
    var style = parseFontDef(element.options.font);
    var pos = element._position;
    var mode;
    if (element.fill() && element.stroke()) {
        mode = TEXT_RENDERING_MODE$1.fillAndStroke;
    } else if (element.fill()) {
        mode = TEXT_RENDERING_MODE$1.fill;
    } else if (element.stroke()) {
        mode = TEXT_RENDERING_MODE$1.stroke;
    }

    page.transform(1, 0, 0, -1, pos.x, pos.y + style.fontSize);
    page.beginText();
    page.setFont(getFontURL(style), style.fontSize);
    page.setTextRenderingMode(mode);
    page.showText(element.content(), element._pdfRect ? element._pdfRect.width() : null);
    page.endText();
}

function drawGroup(element, page, pdf) {
    if (element._pdfLink) {
        page.addLink(element._pdfLink.url, element._pdfLink);
    }
    var children = element.children;
    for (var i = 0; i < children.length; ++i) {
        drawElement(children[i], page, pdf);
    }
}

function drawImage$1(element, page) {
    var url = element.src();
    if (!url) {
        return;
    }

    var rect = element.rect();
    var tl = rect.getOrigin();
    var sz = rect.getSize();
    page.transform(sz.width, 0, 0, -sz.height, tl.x, tl.y + sz.height);
    page.drawImage(url);
}

function drawRect(element, page, pdf) {
    var geometry = element.geometry();
    page.rect(geometry.origin.x, geometry.origin.y, geometry.size.width, geometry.size.height);
    maybeFillStroke(element, page, pdf);
}

function parseColor$1(value) {
    var color = parseColor(value, true);
    return color ? color.toRGB() : null;
}

function optimize(root) {
    var clipbox = false;
    var matrix = Matrix.unit();
    var currentBox = null;
    var changed;
    do {
        changed = false;
        root = opt(root);
    } while (root && changed);
    return { root: root, bbox: currentBox };

    function change(newShape) {
        changed = true;
        return newShape;
    }

    function visible(shape) {
        return (shape.visible() && shape.opacity() > 0 &&
                ( shouldDraw(shape.fill()) ||
                  shouldDraw(shape.stroke()) ));
    }

    function optArray(a) {
        var b = [];
        for (var i = 0; i < a.length; ++i) {
            var el = opt(a[i]);
            if (el != null) {
                b.push(el);
            }
        }
        return b;
    }

    function withClipping(shape, f) {
        var saveclipbox = clipbox;
        var savematrix = matrix;

        if (shape.transform()) {
            matrix = matrix.multiplyCopy(shape.transform().matrix());
        }

        var clip = shape.clip();
        if (clip) {
            clip = clip.bbox();
            if (clip) {
                clip = clip.bbox(matrix);
                clipbox = clipbox ? Rect.intersect(clipbox, clip) : clip;
            }
        }

        try {
            return f();
        }
        finally {
            clipbox = saveclipbox;
            matrix = savematrix;
        }
    }

    function inClipbox(shape) {
        if (clipbox == null) {
            return false;
        }
        var box = shape.rawBBox().bbox(matrix);
        if (clipbox && box) {
            box = Rect.intersect(box, clipbox);
        }
        return box;
    }

    function opt(shape) {
        return withClipping(shape, function(){
            if (!(shape instanceof Group || shape instanceof MultiPath)) {
                var box = inClipbox(shape);
                if (!box) {
                    return change(null);
                }
                currentBox = currentBox ? Rect.union(currentBox, box) : box;
            }
            return dispatch({
                Path: function(shape) {
                    if (shape.segments.length === 0 || !visible(shape)) {
                        return change(null);
                    }
                    return shape;
                },
                MultiPath: function(shape) {
                    if (!visible(shape)) {
                        return change(null);
                    }
                    var el = new MultiPath(shape.options);
                    el.paths = optArray(shape.paths);
                    if (el.paths.length === 0) {
                        return change(null);
                    }
                    return el;
                },
                Circle: function(shape) {
                    if (!visible(shape)) {
                        return change(null);
                    }
                    return shape;
                },
                Arc: function(shape) {
                    if (!visible(shape)) {
                        return change(null);
                    }
                    return shape;
                },
                Text: function(shape) {
                    if (!/\S/.test(shape.content()) || !visible(shape)) {
                        return change(null);
                    }
                    return shape;
                },
                Image: function(shape) {
                    if (!(shape.visible() && shape.opacity() > 0)) {
                        return change(null);
                    }
                    return shape;
                },
                Group: function(shape) {
                    var el = new Group(shape.options);
                    el.children = optArray(shape.children);
                    el._pdfLink = shape._pdfLink;
                    if (shape !== root && el.children.length === 0 && !shape._pdfLink) {
                        return change(null);
                    }
                    return el;
                },
                Rect: function(shape) {
                    if (!visible(shape)) {
                        return change(null);
                    }
                    return shape;
                }
            }, shape);
        });
    }
}

function exportPDF(group, options) {
    var promise = createPromise();

    for (var i in options) {
        if (i == "margin" && group.options.pdf && group.options.pdf._ignoreMargin) {
            // This hackish option is set by the page breaking code in drawDOM.  The idea is
            // that margin is already taken into account there (that's required to do proper
            // page breaking) and we don't want to set it again here, as it would double the
            // top-left margin, and truncate the content on bottom/right.
            continue;
        }
        group.options.set("pdf." + i, options[i]);
    }

    toDataURL(group, promise.resolve);

    return promise;
}



var pdf = Object.freeze({
	Document: PDFDocument,
	BinaryStream: BinaryStream,
	defineFont: defineFont,
	parseFontDef: parseFontDef,
	getFontURL: getFontURL,
	loadFonts: loadFonts,
	loadImages: loadImages,
	getPaperOptions: getPaperOptions,
	TEXT_RENDERING_MODE: TEXT_RENDERING_MODE,
	exportPDF: exportPDF,
	saveAs: saveAs$1,
	toDataURL: toDataURL,
	toBlob: toBlob,
	render: render$1
});

/* eslint-disable no-multi-spaces, key-spacing, indent, camelcase, space-before-blocks, eqeqeq, brace-style */
/* eslint-disable space-infix-ops, space-before-function-paren, array-bracket-spacing, object-curly-spacing */
/* eslint-disable no-nested-ternary, max-params, default-case, no-else-return, no-empty, yoda */
/* eslint-disable no-param-reassign, no-var, block-scoped-var */

var browser$2 = support.browser;
/*

  XXX: to test:

  - cloneNodes function:
    - drawing document containing canvas with page breaking
    - drawing document with named radio <input>-s (should not clear selection)
    - IE9/IE10 don't support el.dataset; do they copy user data?

  - repeating table headers/footers on page breaking

  - forceBreak, keepTogether

  - avoidLinks

 */

/* -----[ local vars ]----- */

function slice$1$1(thing) {
    return Array.prototype.slice.call(thing);
}

var KENDO_PSEUDO_ELEMENT = "KENDO-PSEUDO-ELEMENT";

var IMAGE_CACHE$1 = {};

var nodeInfo = {};
nodeInfo._root = nodeInfo;

/* -----[ Custom Text node to speed up rendering in PDF ]----- */

var TextRect = (function (Text$$1) {
  function TextRect(str, rect, options) {
        Text$$1.call(this, str, rect.getOrigin(), options);
        this._pdfRect = rect;
    }

  if ( Text$$1 ) TextRect.__proto__ = Text$$1;
  TextRect.prototype = Object.create( Text$$1 && Text$$1.prototype );
  TextRect.prototype.constructor = TextRect;
    TextRect.prototype.rect = function rect () {
        // this is the crux of it: we can avoid a call to
        // measure(), which is what the base class does, since we
        // already know the rect.  measure() is s-l-o-w.
        return this._pdfRect;
    };
    TextRect.prototype.rawBBox = function rawBBox () {
        // also let's avoid creating a new rectangle.
        return this._pdfRect;
    };

  return TextRect;
}(Text));

function addClass(el, cls) {
    if (el.classList) {
        el.classList.add(cls);
    } else {
        el.className += " " + cls;
    }
}

function removeClass(el, cls) {
    if (el.classList) {
        el.classList.remove(cls);
    } else {
        el.className = el.className.split(/\s+/).reduce(function(a, word){
            if (word != cls) {
                a.push(word);
            }
            return a;
        }, []).join(" ");
    }
}

function setCSS(el, styles) {
    Object.keys(styles).forEach(function(key){
        el.style[key] = styles[key];
    });
}

var matches = typeof Element !== "undefined" && Element.prototype && (function(p){
    if (p.matches) {
        return function(el, selector) { return el.matches(selector); };
    }
    if (p.webkitMatchesSelector) {
        return function(el, selector) { return el.webkitMatchesSelector(selector); };
    }
    if (p.mozMatchesSelector) {
        return function(el, selector) { return el.mozMatchesSelector(selector); };
    }
    if (p.msMatchesSelector) {
        return function(el, selector) { return el.msMatchesSelector(selector); };
    }
    return function(s) {
	return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
    };
})(Element.prototype);

function closest(el, selector) {
    if (el.closest) {
        return el.closest(selector);
    }
    // IE: stringifying rather than simply comparing with `document`,
    // which is not iframe-proof and fails in editor export —
    // https://github.com/telerik/kendo/issues/6721
    while (el && !/^\[object (?:HTML)?Document\]$/.test(String(el))) {
        if (matches(el, selector)) {
            return el;
        }
        el = el.parentNode;
    }
}

// clone nodes ourselves, so that we redraw <canvas> (DOM or
// jQuery clone will not)
var cloneNodes = (function($){
    if ($) {
        // if we have Kendo and jQuery, use this version as it will
        // maintain proper links between cloned element and Kendo
        // widgets (i.e. it clones jQuery data(), which isn't the same
        // as element's data attributes).
        // https://github.com/telerik/kendo-ui-core/issues/2750
        return function cloneNodes(el) {
            var clone = el.cloneNode(false);
            if (el.nodeType == 1 /* Element */) {
                var $el = $(el), $clone = $(clone), i;
                var data = $el.data();
                for (i in data) {
                    $clone.data(i, data[i]);
                }
                if (/^canvas$/i.test(el.tagName)) {
                    clone.getContext("2d").drawImage(el, 0, 0);
                } else if (/^(?:input|select|textarea|option)$/i.test(el.tagName)) {
                    // drop the name attributes so that we don't affect the selection of the
                    // original nodes (i.e. checked status of radio buttons) when we insert our copy
                    // into the DOM.  https://github.com/telerik/kendo/issues/5409
                    clone.removeAttribute("id");
                    clone.removeAttribute("name");
                    clone.value = el.value;
                    clone.checked = el.checked;
                    clone.selected = el.selected;
                }
                for (i = el.firstChild; i; i = i.nextSibling) {
                    clone.appendChild(cloneNodes(i));
                }
            }
            return clone;
        };
    } else {
        // the no-jQuery version
        return function cloneNodes(el) {
            var clone = el.cloneNode(true);

            // re-draw canvases - https://github.com/telerik/kendo/issues/4872
            var canvases = el.querySelectorAll("canvas");
            if (canvases.length) {
                slice$1$1(clone.querySelectorAll("canvas")).forEach(function(canvas$$1, i){
                    canvas$$1.getContext("2d").drawImage(canvases[i], 0, 0);
                });
            }

            // remove "name" attributes from <input> elements -
            // https://github.com/telerik/kendo/issues/5409
            var orig = el.querySelectorAll("input, select, textarea, option");
            slice$1$1(clone.querySelectorAll("input, select, textarea, option")).forEach(function(el, i){
                el.removeAttribute("id");
                el.removeAttribute("name");
                el.value = orig[i].value;
                el.checked = orig[i].checked;
                el.selected = orig[i].selected;
            });

            return clone;
        };
    }
})(typeof window !== "undefined" && window.kendo && window.kendo.jQuery);

function getXY(thing) {
    if (typeof thing == "number") {
        return { x: thing, y: thing };
    }
    if (Array.isArray(thing)) {
        return { x: thing[0], y: thing[1] };
    }
    return { x: thing.x, y: thing.y };
}

function drawDOM(element, options) {
    if (!options) {
        options = {};
    }
    var promise = createPromise();

    if (!element) {
        return promise.reject("No element to export");
    }

    if (typeof window.getComputedStyle != "function") {
        throw new Error("window.getComputedStyle is missing.  You are using an unsupported browser, or running in IE8 compatibility mode.  Drawing HTML is supported in Chrome, Firefox, Safari and IE9+.");
    }

    defineFont(getFontFaces(element.ownerDocument));

    var scale = getXY(options.scale || 1);

    function doOne(element) {
        var group = new Group();

        // translate to start of page
        var pos = element.getBoundingClientRect();
        setTransform$1(group, [
            scale.x,
            0,
            0,
            scale.y,
            (-pos.left * scale.x),
            (-pos.top * scale.y)
        ]);

        nodeInfo._clipbox = false;
        nodeInfo._matrix = Matrix.unit();
        nodeInfo._stackingContext = {
            element: element,
            group: group
        };

        if (options.avoidLinks === true) {
            nodeInfo._avoidLinks = "a";
        } else {
            nodeInfo._avoidLinks = options.avoidLinks;
        }

        addClass(element, "k-pdf-export");
        renderElement(element, group);
        removeClass(element, "k-pdf-export");

        return group;
    }

    cacheImages(element, function(){
        var forceBreak = options && options.forcePageBreak;
        var hasPaperSize = options && options.paperSize && options.paperSize != "auto";
        var paperOptions = getPaperOptions(function(key, def){
            if (key == "paperSize") {
                // PDF.getPaperOptions croaks on "auto", just pass dummy A4 as we might
                // still be interested in margins.
                return hasPaperSize ? options[key] : "A4";
            }
            return key in options ? options[key] : def;
        });
        var pageWidth = hasPaperSize && paperOptions.paperSize[0];
        var pageHeight = hasPaperSize && paperOptions.paperSize[1];
        var margin = options.margin && paperOptions.margin;
        var hasMargin = Boolean(margin);
        if (forceBreak || pageHeight) {
            if (!margin) {
                margin = { left: 0, top: 0, right: 0, bottom: 0 };
            }

            // we want paper size and margin to be unaffected by
            // scaling in the output, so we have to reverse-scale
            // before our calculations begin.
            if (pageWidth)  { pageWidth  /= scale.x; }
            if (pageHeight) { pageHeight /= scale.y; }
            margin.left   /= scale.x;
            margin.right  /= scale.x;
            margin.top    /= scale.y;
            margin.bottom /= scale.y;

            var group = new Group({
                pdf: {
                    multiPage     : true,
                    paperSize     : hasPaperSize ? paperOptions.paperSize : "auto",
                    _ignoreMargin : hasMargin // HACK!  see exportPDF in pdf/drawing.js
                }
            });
            handlePageBreaks(
                function(x) {
                    if (options.progress) {
                        var canceled = false, pageNum = 0;
                        (function next(){
                            if (pageNum < x.pages.length) {
                                var page = doOne(x.pages[pageNum]);
                                group.append(page);
                                options.progress({
                                    page: page,
                                    pageNum: ++pageNum,
                                    totalPages: x.pages.length,
                                    cancel: function() {
                                        canceled = true;
                                    }
                                });
                                if (!canceled) {
                                    setTimeout(next);
                                } else {
                                    // XXX: should we also fail() the deferred object?
                                    x.container.parentNode.removeChild(x.container);
                                }
                            } else {
                                x.container.parentNode.removeChild(x.container);
                                promise.resolve(group);
                            }
                        })();
                    } else {
                        x.pages.forEach(function(page){
                            group.append(doOne(page));
                        });
                        x.container.parentNode.removeChild(x.container);
                        promise.resolve(group);
                    }
                },
                element,
                forceBreak,
                pageWidth ? pageWidth - margin.left - margin.right : null,
                pageHeight ? pageHeight - margin.top - margin.bottom : null,
                margin,
                options
            );
        } else {
            promise.resolve(doOne(element));
        }
    });

    function makeTemplate(template$$1) {
        if (template$$1 != null) {
            if (typeof template$$1 == "string") {
                template$$1 = template$1(template$$1.replace(/^\s+|\s+$/g, ""));
            }
            if (typeof template$$1 == "function") {
                return function(data) {
                    var el = template$$1(data);
                    if (el && typeof el == "string") {
                        var div = document.createElement("div");
                        div.innerHTML = el;
                        el = div.firstElementChild;
                    }
                    return el;
                };
            }
            // assumed DOM element
            return function() {
                return template$$1.cloneNode(true);
            };
        }
    }

    function handlePageBreaks(callback, element, forceBreak, pageWidth, pageHeight, margin, options) {
        var template$$1 = makeTemplate(options.template);
        var doc = element.ownerDocument;
        var pages = [];
        var copy = options._destructive ? element : cloneNodes(element);
        var container = doc.createElement("KENDO-PDF-DOCUMENT");
        var adjust = 0;

        // make sure <tfoot> elements are at the end (Grid widget
        // places TFOOT before TBODY, tricking our algorithm to
        // insert a page break right after the header).
        // https://github.com/telerik/kendo/issues/4699
        slice$1$1(copy.querySelectorAll("tfoot")).forEach(function(tfoot){
            tfoot.parentNode.appendChild(tfoot);
        });

        // remember the index of each LI from an ordered list.
        // we'll use it to reconstruct the proper numbering.
        slice$1$1(copy.querySelectorAll("ol")).forEach(function(ol){
            slice$1$1(ol.children).forEach(function(li, index){
                li.setAttribute("kendo-split-index", index);
            });
        });

        setCSS(container, {
            display   : "block",
            position  : "absolute",
            boxSizing : "content-box",
            left      : "-10000px",
            top       : "-10000px"
        });

        if (pageWidth) {
            // subtle: if we don't set the width *and* margins here, the layout in this
            // container will be different from the one in our final page elements, and we'll
            // split at the wrong places.
            setCSS(container, {
                width        : pageWidth + "px",
                paddingLeft  : margin.left + "px",
                paddingRight : margin.right + "px"
            });

            // when the first element has a margin-top (i.e. a <h1>) the page will be
            // inadvertently enlarged by that number (the browser will report the container's
            // bounding box top to start at the element's top, rather than including its
            // margin).  Adding overflow: hidden seems to fix it.
            //
            // to understand the difference, try the following snippets in your browser:
            //
            // 1. <div style="background: yellow">
            //      <h1 style="margin: 3em">Foo</h1>
            //    </div>
            //
            // 2. <div style="background: yellow; overflow: hidden">
            //      <h1 style="margin: 3em">Foo</h1>
            //    </div>
            //
            // this detail is not important when automatic page breaking is not requested, hence
            // doing it only if pageWidth is defined.
            setCSS(copy, { overflow: "hidden" });
        }

        element.parentNode.insertBefore(container, element);
        container.appendChild(copy);

        // we need the timeouts here, so that images dimensions are
        // properly computed in DOM when we start our thing.
        if (options.beforePageBreak) {
            setTimeout(function(){
                options.beforePageBreak(container, doPageBreak);
            }, 15);
        } else {
            setTimeout(doPageBreak, 15);
        }

        function doPageBreak() {
            if (forceBreak != "-" || pageHeight) {
                splitElement(copy);
            }

            // XXX: can contain only text nodes.  better risk producing
            // an empty page than truncating the content.
            // if (!(pages.length > 0 && copy.children.length === 0)) {
            var page = makePage();
            copy.parentNode.insertBefore(page, copy);
            page.appendChild(copy);
            // }

            if (template$$1) {
                var count = pages.length;
                pages.forEach(function(page, i){
                    var el = template$$1({
                        element    : page,
                        pageNum    : i + 1,
                        totalPages : pages.length
                    });
                    if (el) {
                        page.appendChild(el);
                        cacheImages(el, function(){
                            if (--count === 0) {
                                next();
                            }
                        });
                    }
                });
            } else {
                next();
            }

            function next() {
                // Even though we already cached images, they simply won't be available
                // immediately in the newly created DOM.  Previously we'd allow a 10ms timeout,
                // but that's arbitrary and clearly not working in all cases
                // (https://github.com/telerik/kendo/issues/5399), so this function will wait
                // for their .complete attribute.
                whenImagesAreActuallyLoaded(pages, function(){
                    callback({ pages: pages, container: container });
                });
            }
        }

        function keepTogether(el) {
            if (options.keepTogether && matches(el, options.keepTogether) && el.offsetHeight <= pageHeight - adjust) {
                return true;
            }

            var tag = el.tagName;
            if (/^h[1-6]$/i.test(tag) && el.offsetHeight >= pageHeight - adjust) {
                return false;
            }

            return (el.getAttribute("data-kendo-chart") ||
                    /^(?:img|tr|thead|th|tfoot|iframe|svg|object|canvas|input|textarea|select|video|h[1-6])/i.test(el.tagName));
        }

        function splitElement(element) {
            if (element.tagName == "TABLE") {
                setCSS(element, { tableLayout: "fixed" });
            }
            var style = getComputedStyle(element);
            var bottomPadding = parseFloat(getPropertyValue(style, "padding-bottom"));
            var bottomBorder = parseFloat(getPropertyValue(style, "border-bottom-width"));
            var saveAdjust = adjust;
            adjust += bottomPadding + bottomBorder;
            var isFirst = true;
            for (var el = element.firstChild; el; el = el.nextSibling) {
                if (el.nodeType == 1 /* Element */) {
                    isFirst = false;
                    if (matches(el, forceBreak)) {
                        breakAtElement(el);
                        continue;
                    }
                    if (!pageHeight) {
                        // we're in "manual breaks mode"
                        splitElement(el);
                        continue;
                    }
                    if (!/^(?:static|relative)$/.test(getPropertyValue(getComputedStyle(el), "position"))) {
                        continue;
                    }
                    var fall = fallsOnMargin(el);
                    if (fall == 1) {
                        // element starts on next page, break before anyway.
                        breakAtElement(el);
                    }
                    else if (fall) {
                        // elements ends up on next page, or possibly doesn't fit on a page at
                        // all.  break before it anyway if it's an <img> or <tr>, otherwise
                        // attempt to split.
                        if (keepTogether(el)) {
                            breakAtElement(el);
                        } else {
                            splitElement(el);
                        }
                    }
                    else {
                        splitElement(el);
                    }
                }
                else if (el.nodeType == 3 /* Text */ && pageHeight) {
                    splitText(el, isFirst);
                    isFirst = false;
                }
            }
            adjust = saveAdjust;
        }

        function firstInParent(el) {
            var p = el.parentNode, first = p.firstChild;
            if (el === first) {
                return true;
            }
            if (el === p.children[0]) {
                if (first.nodeType == 7 /* comment */ ||
                    first.nodeType == 8 /* processing instruction */) {
                    return true;
                }
                if (first.nodeType == 3 /* text */) {
                    // if whitespace only we can probably consider it's first
                    return !/\S/.test(first.data);
                }
            }
            return false;
        }

        function breakAtElement(el) {
            if (el.nodeType == 1 && el !== copy && firstInParent(el)) {
                return breakAtElement(el.parentNode);
            }
            var table, colgroup, thead, grid, gridHead;
            table = closest(el, "table");
            colgroup = table && table.querySelector("colgroup");
            if (options.repeatHeaders) {
                thead = table && table.querySelector("thead");

                // If we break page in a Kendo Grid, repeat its header.  This ugly hack is
                // necessary because a scrollable grid will keep the header in a separate
                // <table> element from its content.
                //
                // XXX: This is likely to break as soon as the widget HTML is modified.
                grid = closest(el, ".k-grid.k-widget");
                if (grid && grid.querySelector(".k-auto-scrollable")) {
                    gridHead = grid.querySelector(".k-grid-header");
                }
            }
            var page = makePage();
            var range = doc.createRange();
            range.setStartBefore(copy);
            range.setEndBefore(el);
            page.appendChild(range.extractContents());
            copy.parentNode.insertBefore(page, copy);
            preventBulletOnListItem(el.parentNode);
            if (table) {
                table = closest(el, "table"); // that's the <table> on next page!
                if (options.repeatHeaders && thead) {
                    table.insertBefore(thead.cloneNode(true), table.firstChild);
                }
                if (colgroup) {
                    table.insertBefore(colgroup.cloneNode(true), table.firstChild);
                }
            }
            if (options.repeatHeaders && gridHead) {
                grid = closest(el, ".k-grid.k-widget");
                grid.insertBefore(gridHead.cloneNode(true), grid.firstChild);
            }
        }

        function makePage() {
            var page = doc.createElement("KENDO-PDF-PAGE");
            setCSS(page, {
                display  : "block",
                boxSizing: "content-box",
                width    : pageWidth ? (pageWidth + "px") : "auto",
                padding  : (margin.top + "px " +
                            margin.right + "px " +
                            margin.bottom + "px " +
                            margin.left + "px"),

                // allow absolutely positioned elements to be relative to current page
                position : "relative",

                // without the following we might affect layout of subsequent pages
                height   : pageHeight ? (pageHeight + "px") : "auto",
                overflow : pageHeight || pageWidth ? "hidden" : "visible",
                clear    : "both"
            });

            // debug
            // $("<div>").css({
            //     position  : "absolute",
            //     left      : margin.left,
            //     top       : margin.top,
            //     width     : pageWidth,
            //     height    : pageHeight,
            //     boxSizing : "border-box",
            //     background: "rgba(255, 255, 0, 0.5)"
            //     //border    : "1px solid red"
            // }).appendTo(page);

            if (options && options.pageClassName) {
                page.className = options.pageClassName;
            }
            pages.push(page);
            return page;
        }

        function fallsOnMargin(thing) {
            var box = thing.getBoundingClientRect();
            if (box.width === 0 || box.height === 0) {
                // I'd say an element with dimensions zero fits on current page.
                return 0;
            }
            var top = copy.getBoundingClientRect().top;
            var available = pageHeight - adjust;
            return (box.height > available) ? 3
                : (box.top - top > available) ? 1
                : (box.bottom - top > available) ? 2
                : 0;
        }

        function splitText(node, isFirst) {
            if (!/\S/.test(node.data)) {
                return;
            }

            var len = node.data.length;
            var range = doc.createRange();
            range.selectNodeContents(node);
            var fall = fallsOnMargin(range);
            if (!fall) {
                return;     // the whole text fits on current page
            }

            var nextnode = node;
            if (fall == 1) {
                // starts on next page, break before anyway.
                if (isFirst) {
                    // avoid leaving an empty <p>, <li>, etc. on previous page.
                    breakAtElement(node.parentNode);
                } else {
                    breakAtElement(node);
                }
            }
            else {
                (function findEOP(min, pos, max) {
                    range.setEnd(node, pos);
                    if (min == pos || pos == max) {
                        return pos;
                    }
                    if (fallsOnMargin(range)) {
                        return findEOP(min, (min + pos) >> 1, pos);
                    } else {
                        return findEOP(pos, (pos + max) >> 1, max);
                    }
                })(0, len >> 1, len);

                if (!/\S/.test(range.toString()) && isFirst) {
                    // avoid leaving an empty <p>, <li>, etc. on previous page.
                    breakAtElement(node.parentNode);
                } else {
                    // This is only needed for IE, but it feels cleaner to do it anyway.  Without
                    // it, IE will truncate a very long text (playground/pdf-long-text-2.html).
                    nextnode = node.splitText(range.endOffset);

                    var page = makePage();
                    range.setStartBefore(copy);
                    page.appendChild(range.extractContents());
                    copy.parentNode.insertBefore(page, copy);
                    preventBulletOnListItem(nextnode.parentNode);
                }
            }

            splitText(nextnode);
        }

        function preventBulletOnListItem(el) {
            // set a hint on continued LI elements, to tell the
            // renderer not to draw the bullet again.
            // https://github.com/telerik/kendo-ui-core/issues/2732
            var li = closest(el, "li");
            if (li) {
                li.setAttribute("kendo-no-bullet", "1");
                preventBulletOnListItem(li.parentNode);
            }
        }
    }

    return promise;
}

drawDOM.getFontFaces = getFontFaces;

// This is needed for the Spreadsheet print functionality.  Since
// there we only need to draw text, this cuts through the ceremony
// of drawDOM/renderElement and renders the text node directly.
drawDOM.drawText = function(element) {
    var group = new Group();
    nodeInfo._clipbox = false;
    nodeInfo._matrix = Matrix.unit();
    nodeInfo._stackingContext = {
        element: element,
        group: group
    };
    pushNodeInfo(element, getComputedStyle(element), group);
    if (element.firstChild.nodeType == 3 /* Text */) {
        // avoid the penalty of renderElement
        renderText(element, element.firstChild, group);
    } else {
        _renderElement(element, group);
    }
    popNodeInfo();
    return group;
};

var parseBackgroundImage = (function(){
    var tok_linear_gradient  = /^((-webkit-|-moz-|-o-|-ms-)?linear-gradient\s*)\(/;
    //var tok_radial_gradient  = /^((-webkit-|-moz-|-o-|-ms-)?radial-gradient\s*)\(/;
    var tok_percent          = /^([-0-9.]+%)/;
    var tok_length           = /^([-0-9.]+px)/;
    var tok_keyword          = /^(left|right|top|bottom|to|center)\W/;
    var tok_angle            = /^([-0-9.]+(deg|grad|rad|turn))/;
    var tok_whitespace       = /^(\s+)/;
    var tok_popen            = /^(\()/;
    var tok_pclose           = /^(\))/;
    var tok_comma            = /^(,)/;
    var tok_url              = /^(url)\(/;
    var tok_content          = /^(.*?)\)/;

    var cache1 = {}, cache2 = {};

    function parse(input) {
        var orig = input;
        if (hasOwnProperty$2(cache1, orig)) {
            return cache1[orig];
        }
        function skip_ws() {
            var m = tok_whitespace.exec(input);
            if (m) {
                input = input.substr(m[1].length);
            }
        }
        function read(token) {
            skip_ws();
            var m = token.exec(input);
            if (m) {
                input = input.substr(m[1].length);
                return m[1];
            }
        }

        function read_stop() {
            var color = parseColor(input, true);
            var length, percent;
            if (color) {
                var match =
                    /^#[0-9a-f]+/i.exec(input) ||
                    /^rgba?\(.*?\)/i.exec(input) ||
                    /^..*?\b/.exec(input); // maybe named color
                input = input.substr(match[0].length);
                color = color.toRGB();
                if (!(length = read(tok_length))) {
                    percent = read(tok_percent);
                }
                return { color: color, length: length, percent: percent };
            }
        }

        function read_linear_gradient(propName) {
            var angle;
            var to1, to2;
            var stops = [];
            var reverse = false;

            if (read(tok_popen)) {
                // 1. [ <angle> || to <side-or-corner>, ]?
                angle = read(tok_angle);
                if (angle) {
                    angle = parseAngle(angle);
                    read(tok_comma);
                }
                else {
                    to1 = read(tok_keyword);
                    if (to1 == "to") {
                        to1 = read(tok_keyword);
                    } else if (to1 && /^-/.test(propName)) {
                        reverse = true;
                    }
                    to2 = read(tok_keyword);
                    read(tok_comma);
                }

                if (/-moz-/.test(propName) && angle == null && to1 == null) {
                    var x = read(tok_percent), y = read(tok_percent);
                    reverse = true;
                    if (x == "0%") {
                        to1 = "left";
                    } else if (x == "100%") {
                        to1 = "right";
                    }
                    if (y == "0%") {
                        to2 = "top";
                    } else if (y == "100%") {
                        to2 = "bottom";
                    }
                    read(tok_comma);
                }

                // 2. color stops
                while (input && !read(tok_pclose)) {
                    var stop = read_stop();
                    if (!stop) {
                        break;
                    }
                    stops.push(stop);
                    read(tok_comma);
                }

                return {
                    type    : "linear",
                    angle   : angle,
                    to      : to1 && to2 ? to1 + " " + to2 : to1 ? to1 : to2 ? to2 : null,
                    stops   : stops,
                    reverse : reverse
                };
            }
        }

        function read_url() {
            if (read(tok_popen)) {
                var url = read(tok_content);
                url = url.replace(/^['"]+|["']+$/g, "");
                read(tok_pclose);
                return { type: "url", url: url };
            }
        }

        var tok;

        if ((tok = read(tok_linear_gradient))) {
            tok = read_linear_gradient(tok);
        }
        else if ((tok = read(tok_url))) {
            tok = read_url();
        }

        return (cache1[orig] = tok || { type: "none" });
    }

    return function(input) {
        if (hasOwnProperty$2(cache2, input)) {
            return cache2[input];
        }
        return (cache2[input] = splitProperty(input).map(parse));
    };
})();

var splitProperty = (function(){
    var cache = {};
    return function(input, separator) {
        if (!separator) {
            separator = /^\s*,\s*/;
        }

        var cacheKey = input + separator;

        if (hasOwnProperty$2(cache, cacheKey)) {
            return cache[cacheKey];
        }

        var ret = [];
        var last$$1 = 0, pos = 0;
        var in_paren = 0;
        var in_string = false;
        var m;

        function looking_at(rx) {
            return (m = rx.exec(input.substr(pos)));
        }

        function trim(str) {
            return str.replace(/^\s+|\s+$/g, "");
        }

        while (pos < input.length) {
            if (!in_string && looking_at(/^[\(\[\{]/)) {
                in_paren++;
                pos++;
            }
            else if (!in_string && looking_at(/^[\)\]\}]/)) {
                in_paren--;
                pos++;
            }
            else if (!in_string && looking_at(/^[\"\']/)) {
                in_string = m[0];
                pos++;
            }
            else if (in_string == "'" && looking_at(/^\\\'/)) {
                pos += 2;
            }
            else if (in_string == '"' && looking_at(/^\\\"/)) {
                pos += 2;
            }
            else if (in_string == "'" && looking_at(/^\'/)) {
                in_string = false;
                pos++;
            }
            else if (in_string == '"' && looking_at(/^\"/)) {
                in_string = false;
                pos++;
            }
            else if (looking_at(separator)) {
                if (!in_string && !in_paren && pos > last$$1) {
                    ret.push(trim(input.substring(last$$1, pos)));
                    last$$1 = pos + m[0].length;
                }
                pos += m[0].length;
            }
            else {
                pos++;
            }
        }
        if (last$$1 < pos) {
            ret.push(trim(input.substring(last$$1, pos)));
        }
        return (cache[cacheKey] = ret);
    };
})();

var getFontURL$1 = (function(cache){
    return function(el){
        // XXX: for IE we get here the whole cssText of the rule,
        // because the computedStyle.src is empty.  Next time we need
        // to fix these regexps we better write a CSS parser. :-\
        var url = cache[el];
        if (!url) {
            var m;
            if ((m = /url\((['"]?)([^'")]*?)\1\)\s+format\((['"]?)truetype\3\)/.exec(el))) {
                url = cache[el] = m[2];
            } else if ((m = /url\((['"]?)([^'")]*?\.ttf)\1\)/.exec(el))) {
                url = cache[el] = m[2];
            }
        }
        return url;
    };
})(Object.create(null));

var getFontHeight = (function(cache){
    return function(font) {
        var height = cache[font];
        if (height == null) {
            height = cache[font] = measureText("Mapq", { font: font }).height;
        }
        return height;
    };
})(Object.create(null));

function getFontFaces(doc) {
    if (doc == null) {
        doc = document;
    }
    var result = {};
    for (var i = 0; i < doc.styleSheets.length; ++i) {
        doStylesheet(doc.styleSheets[i]);
    }
    return result;
    function doStylesheet(ss) {
        if (ss) {
            var rules = null;
            try {
                rules = ss.cssRules;
            } catch (ex) {}
            if (rules) {
                addRules(ss, rules);
            }
        }
    }
    function findFonts(rule) {
        var src = getPropertyValue(rule.style, "src");
        if (src) {
            return splitProperty(src).reduce(function(a, el){
                var font = getFontURL$1(el);
                if (font) {
                    a.push(font);
                }
                return a;
            }, []);
        } else {
            // Internet Explorer
            // XXX: this is gross.  should work though for valid CSS.
            var font = getFontURL$1(rule.cssText);
            return font ? [ font ] : [];
        }
    }
    function addRules(styleSheet, rules) {
        for (var i = 0; i < rules.length; ++i) {
            var r = rules[i];
            switch (r.type) {
              case 3:       // CSSImportRule
                doStylesheet(r.styleSheet);
                break;
              case 5:       // CSSFontFaceRule
                var style  = r.style;
                var family = splitProperty(getPropertyValue(style, "font-family"));
                var bold   = /^([56789]00|bold)$/i.test(getPropertyValue(style, "font-weight"));
                var italic = "italic" == getPropertyValue(style, "font-style");
                var src    = findFonts(r);
                if (src.length > 0) {
                    addRule(styleSheet, family, bold, italic, src[0]);
                }
            }
        }
    }
    function addRule(styleSheet, names, bold, italic, url) {
        // We get full resolved absolute URLs in Chrome, but sadly
        // not in Firefox.
        if (!(/^data:/i.test(url))) {
            if (!(/^[^\/:]+:\/\//.test(url) || /^\//.test(url))) {
                url = String(styleSheet.href).replace(/[^\/]*$/, "") + url;
            }
        }
        names.forEach(function(name){
            name = name.replace(/^(['"]?)(.*?)\1$/, "$2"); // it's quoted
            if (bold) {
                name += "|bold";
            }
            if (italic) {
                name += "|italic";
            }
            result[name] = url;
        });
    }
}

function hasOwnProperty$2(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

function getCounter(name) {
    name = "_counter_" + name;
    return nodeInfo[name];
}

function getAllCounters(name) {
    var values = [], p = nodeInfo;
    name = "_counter_" + name;
    while (p) {
        if (hasOwnProperty$2(p, name)) {
            values.push(p[name]);
        }
        p = Object.getPrototypeOf(p);
    }
    return values.reverse();
}

function incCounter(name, inc) {
    var p = nodeInfo;
    name = "_counter_" + name;
    while (p && !hasOwnProperty$2(p, name)) {
        p = Object.getPrototypeOf(p);
    }
    if (!p) {
        p = nodeInfo._root;
    }
    p[name] = (p[name] || 0) + (inc == null ? 1 : inc);
}

function resetCounter(name, val) {
    name = "_counter_" + name;
    nodeInfo[name] = val == null ? 0 : val;
}

function doCounters(a, f, def) {
    for (var i = 0; i < a.length;) {
        var name = a[i++];
        var val = parseFloat(a[i]);
        if (isNaN(val)) {
            f(name, def);
        } else {
            f(name, val);
            ++i;
        }
    }
}

function updateCounters(style) {
    var counterReset = getPropertyValue(style, "counter-reset");
    if (counterReset) {
        doCounters(splitProperty(counterReset, /^\s+/), resetCounter, 0);
    }
    var counterIncrement = getPropertyValue(style, "counter-increment");
    if (counterIncrement) {
        doCounters(splitProperty(counterIncrement, /^\s+/), incCounter, 1);
    }
}

function parseColor$2(str, css) {
    var color = parseColor(str, true);
    if (color) {
        color = color.toRGB();
        if (css) {
            color = color.toCssRgba();
        } else if (color.a === 0) {
            color = null;
        }
    }
    return color;
}

function whenImagesAreActuallyLoaded(elements, callback) {
    var pending = 0;
    elements.forEach(function(el){
        var images = el.querySelectorAll("img");
        for (var i = 0; i < images.length; ++i) {
            var img = images[i];
            if (!img.complete) {
                pending++;
                img.onload = img.onerror = next;
            }
        }
    });
    if (!pending) {
        next();
    }
    function next() {
        if (--pending <= 0) {
            callback();
        }
    }
}

function cacheImages(element, callback) {
    var urls = [];
    function add(url) {
        if (!IMAGE_CACHE$1[url]) {
            IMAGE_CACHE$1[url] = true;
            urls.push(url);
        }
    }
    (function dive(element){
        if (/^img$/i.test(element.tagName)) {
            add(element.src);
        }
        parseBackgroundImage(
            getPropertyValue(
                getComputedStyle(element), "background-image"
            )
        ).forEach(function(bg){
            if (bg.type == "url") {
                add(bg.url);
            }
        });

        if (element.children) {
            slice$1$1(element.children).forEach(dive);
        }
    })(element);
    var count = urls.length;
    function next() {
        if (--count <= 0) {
            callback();
        }
    }
    if (count === 0) {
        next();
    }
    urls.forEach(function(url){
        var img = IMAGE_CACHE$1[url] = new window.Image();
        if (!(/^data:/i.test(url))) {
            img.crossOrigin = "Anonymous";
        }
        img.src = url;
        if (img.complete) {
            next();
        } else {
            img.onload = next;
            img.onerror = function() {
                IMAGE_CACHE$1[url] = null;
                next();
            };
        }
    });
}

function alphaNumeral(n) {
    var result = "";
    do {
        var r = n % 26;
        result = String.fromCharCode(97 + r) + result;
        n = Math.floor(n / 26);
    } while (n > 0);
    return result;
}

function pushNodeInfo(element, style, group) {
    nodeInfo = Object.create(nodeInfo);
    nodeInfo[element.tagName.toLowerCase()] = {
        element: element,
        style: style
    };
    var decoration = getPropertyValue(style, "text-decoration");
    if (decoration && decoration != "none") {
        var color = getPropertyValue(style, "color");
        decoration.split(/\s+/g).forEach(function(name){
            if (!nodeInfo[name]) {
                nodeInfo[name] = color;
            }
        });
    }

    if (createsStackingContext(style)) {
        nodeInfo._stackingContext = {
            element: element,
            group: group
        };
    }
}

function popNodeInfo() {
    nodeInfo = Object.getPrototypeOf(nodeInfo);
}

function updateClipbox(path) {
    if (nodeInfo._clipbox != null) {
        var box = path.bbox(nodeInfo._matrix);
        if (nodeInfo._clipbox) {
            nodeInfo._clipbox = Rect.intersect(nodeInfo._clipbox, box);
        } else {
            nodeInfo._clipbox = box;
        }
    }
}

function emptyClipbox() {
    var cb = nodeInfo._clipbox;
    if (cb == null) {
        return true;
    }
    if (cb) {
        return cb.width() === 0 || cb.height() === 0;
    }
}

function createsStackingContext(style) {
    function prop(name) { return getPropertyValue(style, name); }
    if (prop("transform") != "none" ||
        prop("position") != "static" ||
        prop("z-index") != "auto" ||
        prop("opacity") < 1) {
        return true;
    }
}

function getComputedStyle(element, pseudoElt) {
    return window.getComputedStyle(element, pseudoElt || null);
}

function getPropertyValue(style, prop, defa) {
    var val = style.getPropertyValue(prop);
    if (val == null || val === "") {
        if (browser$2.webkit) {
            val = style.getPropertyValue("-webkit-" + prop );
        } else if (browser$2.mozilla) {
            val = style.getPropertyValue("-moz-" + prop );
        } else if (browser$2.opera) {
            val = style.getPropertyValue("-o-" + prop);
        } else if (browser$2.msie) {
            val = style.getPropertyValue("-ms-" + prop);
        }
    }
    if (arguments.length > 2 && (val == null || val === "")) {
        return defa;
    } else {
        return val;
    }
}

function pleaseSetPropertyValue(style, prop, value, important) {
    style.setProperty(prop, value, important);
    if (browser$2.webkit) {
        style.setProperty("-webkit-" + prop, value, important);
    } else if (browser$2.mozilla) {
        style.setProperty("-moz-" + prop, value, important);
    } else if (browser$2.opera) {
        style.setProperty("-o-" + prop, value, important);
    } else if (browser$2.msie) {
        style.setProperty("-ms-" + prop, value, important);
        prop = "ms" + prop.replace(/(^|-)([a-z])/g, function(s, p1, p2){
            return p1 + p2.toUpperCase();
        });
        style[prop] = value;
    }
}

function getBorder(style, side) {
    side = "border-" + side;
    return {
        width: parseFloat(getPropertyValue(style, side + "-width")),
        style: getPropertyValue(style, side + "-style"),
        color: parseColor$2(getPropertyValue(style, side + "-color"), true)
    };
}

function saveStyle(element, func) {
    var prev = element.style.cssText;
    var result = func();
    element.style.cssText = prev;
    return result;
}

function getBorderRadius(style, side) {
    var r = getPropertyValue(style, "border-" + side + "-radius").split(/\s+/g).map(parseFloat);
    if (r.length == 1) {
        r.push(r[0]);
    }
    return sanitizeRadius({ x: r[0], y: r[1] });
}

function getContentBox(element) {
    var box = element.getBoundingClientRect();
    box = innerBox(box, "border-*-width", element);
    box = innerBox(box, "padding-*", element);
    return box;
}

function innerBox(box, prop, element) {
    var style, wt, wr, wb, wl;
    if (typeof prop == "string") {
        style = getComputedStyle(element);
        wt = parseFloat(getPropertyValue(style, prop.replace("*", "top")));
        wr = parseFloat(getPropertyValue(style, prop.replace("*", "right")));
        wb = parseFloat(getPropertyValue(style, prop.replace("*", "bottom")));
        wl = parseFloat(getPropertyValue(style, prop.replace("*", "left")));
    }
    else if (typeof prop == "number") {
        wt = wr = wb = wl = prop;
    }
    return {
        top    : box.top + wt,
        right  : box.right - wr,
        bottom : box.bottom - wb,
        left   : box.left + wl,
        width  : box.right - box.left - wr - wl,
        height : box.bottom - box.top - wb - wt
    };
}

function getTransform(style) {
    var transform$$1 = getPropertyValue(style, "transform");
    if (transform$$1 == "none") {
        return null;
    }
    var matrix = /^\s*matrix\(\s*(.*?)\s*\)\s*$/.exec(transform$$1);
    if (matrix) {
        var origin = getPropertyValue(style, "transform-origin");
        matrix = matrix[1].split(/\s*,\s*/g).map(parseFloat);
        origin = origin.split(/\s+/g).map(parseFloat);
        return {
            matrix: matrix,
            origin: origin
        };
    }
}

function radiansToDegrees(radians) {
    return ((180 * radians) / Math.PI) % 360;
}

function parseAngle(angle) {
    var num = parseFloat(angle);
    if (/grad$/.test(angle)) {
        return Math.PI * num / 200;
    }
    else if (/rad$/.test(angle)) {
        return num;
    }
    else if (/turn$/.test(angle)) {
        return Math.PI * num * 2;
    }
    else if (/deg$/.test(angle)) {
        return Math.PI * num / 180;
    }
}

function setTransform$1(shape, m) {
    m = new Matrix(m[0], m[1], m[2], m[3], m[4], m[5]);
    shape.transform(m);
    return m;
}

function setClipping$1(shape, clipPath) {
    shape.clip(clipPath);
}

function addArcToPath(path, x, y, options) {
    var points = new Arc$2([ x, y ], options).curvePoints(), i = 1;
    while (i < points.length) {
        path.curveTo(points[i++], points[i++], points[i++]);
    }
}

function sanitizeRadius(r) {
    if (r.x <= 0 || r.y <= 0) {
        r.x = r.y = 0;
    }
    return r;
}

function adjustBorderRadiusForBox(box, rTL, rTR, rBR, rBL) {
    // adjust border radiuses such that the sum of adjacent
    // radiuses is not bigger than the length of the side.
    // seems the correct algorithm is variant (3) from here:
    // http://www.w3.org/Style/CSS/Tracker/issues/29?changelog
    var tl_x = Math.max(0, rTL.x), tl_y = Math.max(0, rTL.y);
    var tr_x = Math.max(0, rTR.x), tr_y = Math.max(0, rTR.y);
    var br_x = Math.max(0, rBR.x), br_y = Math.max(0, rBR.y);
    var bl_x = Math.max(0, rBL.x), bl_y = Math.max(0, rBL.y);

    var f = Math.min(
        box.width / (tl_x + tr_x),
        box.height / (tr_y + br_y),
        box.width / (br_x + bl_x),
        box.height / (bl_y + tl_y)
    );

    if (f < 1) {
        tl_x *= f; tl_y *= f;
        tr_x *= f; tr_y *= f;
        br_x *= f; br_y *= f;
        bl_x *= f; bl_y *= f;
    }

    return {
        tl: { x: tl_x, y: tl_y },
        tr: { x: tr_x, y: tr_y },
        br: { x: br_x, y: br_y },
        bl: { x: bl_x, y: bl_y }
    };
}

function elementRoundBox(element, box, type) {
    var style = getComputedStyle(element);

    var rTL = getBorderRadius(style, "top-left");
    var rTR = getBorderRadius(style, "top-right");
    var rBL = getBorderRadius(style, "bottom-left");
    var rBR = getBorderRadius(style, "bottom-right");

    if (type == "padding" || type == "content") {
        var bt = getBorder(style, "top");
        var br = getBorder(style, "right");
        var bb = getBorder(style, "bottom");
        var bl = getBorder(style, "left");
        rTL.x -= bl.width; rTL.y -= bt.width;
        rTR.x -= br.width; rTR.y -= bt.width;
        rBR.x -= br.width; rBR.y -= bb.width;
        rBL.x -= bl.width; rBL.y -= bb.width;
        if (type == "content") {
            var pt = parseFloat(getPropertyValue(style, "padding-top"));
            var pr = parseFloat(getPropertyValue(style, "padding-right"));
            var pb = parseFloat(getPropertyValue(style, "padding-bottom"));
            var pl = parseFloat(getPropertyValue(style, "padding-left"));
            rTL.x -= pl; rTL.y -= pt;
            rTR.x -= pr; rTR.y -= pt;
            rBR.x -= pr; rBR.y -= pb;
            rBL.x -= pl; rBL.y -= pb;
        }
    }

    if (typeof type == "number") {
        rTL.x -= type; rTL.y -= type;
        rTR.x -= type; rTR.y -= type;
        rBR.x -= type; rBR.y -= type;
        rBL.x -= type; rBL.y -= type;
    }

    return roundBox(box, rTL, rTR, rBR, rBL);
}

// Create a drawing.Path for a rounded rectangle.  Receives the
// bounding box and the border-radiuses in CSS order (top-left,
// top-right, bottom-right, bottom-left).  The radiuses must be
// objects containing x (horiz. radius) and y (vertical radius).
function roundBox(box, rTL0, rTR0, rBR0, rBL0) {
    var tmp = adjustBorderRadiusForBox(box, rTL0, rTR0, rBR0, rBL0);
    var rTL = tmp.tl;
    var rTR = tmp.tr;
    var rBR = tmp.br;
    var rBL = tmp.bl;
    var path = new Path({ fill: null, stroke: null });
    path.moveTo(box.left, box.top + rTL.y);
    if (rTL.x) {
        addArcToPath(path, box.left + rTL.x, box.top + rTL.y, {
            startAngle: -180,
            endAngle: -90,
            radiusX: rTL.x,
            radiusY: rTL.y
        });
    }
    path.lineTo(box.right - rTR.x, box.top);
    if (rTR.x) {
        addArcToPath(path, box.right - rTR.x, box.top + rTR.y, {
            startAngle: -90,
            endAngle: 0,
            radiusX: rTR.x,
            radiusY: rTR.y
        });
    }
    path.lineTo(box.right, box.bottom - rBR.y);
    if (rBR.x) {
        addArcToPath(path, box.right - rBR.x, box.bottom - rBR.y, {
            startAngle: 0,
            endAngle: 90,
            radiusX: rBR.x,
            radiusY: rBR.y
        });
    }
    path.lineTo(box.left + rBL.x, box.bottom);
    if (rBL.x) {
        addArcToPath(path, box.left + rBL.x, box.bottom - rBL.y, {
            startAngle: 90,
            endAngle: 180,
            radiusX: rBL.x,
            radiusY: rBL.y
        });
    }
    return path.close();
}

function formatCounter(val, style) {
    var str = String(parseFloat(val));
    switch (style) {
      case "decimal-leading-zero":
        if (str.length < 2) {
            str = "0" + str;
        }
        return str;
      case "lower-roman":
        return arabicToRoman(val).toLowerCase();
      case "upper-roman":
        return arabicToRoman(val).toUpperCase();
      case "lower-latin":
      case "lower-alpha":
        return alphaNumeral(val - 1);
      case "upper-latin":
      case "upper-alpha":
        return alphaNumeral(val - 1).toUpperCase();
      default:
        return str;
    }
}

function evalPseudoElementContent(element, content) {
    function displayCounter(name, style, separator) {
        if (!separator) {
            return formatCounter(getCounter(name) || 0, style);
        }
        separator = separator.replace(/^\s*(["'])(.*)\1\s*$/, "$2");
        return getAllCounters(name).map(function(val){
            return formatCounter(val, style);
        }).join(separator);
    }
    var a = splitProperty(content, /^\s+/);
    var result = [], m;
    a.forEach(function(el){
        var tmp;
        if ((m = /^\s*(["'])(.*)\1\s*$/.exec(el))) {
            result.push(m[2].replace(/\\([0-9a-f]{4})/gi, function(s, p){
                return String.fromCharCode(parseInt(p, 16));
            }));
        }
        else if ((m = /^\s*counter\((.*?)\)\s*$/.exec(el))) {
            tmp = splitProperty(m[1]);
            result.push(displayCounter(tmp[0], tmp[1]));
        }
        else if ((m = /^\s*counters\((.*?)\)\s*$/.exec(el))) {
            tmp = splitProperty(m[1]);
            result.push(displayCounter(tmp[0], tmp[2], tmp[1]));
        }
        else if ((m = /^\s*attr\((.*?)\)\s*$/.exec(el))) {
            result.push(element.getAttribute(m[1]) || "");
        }
        else {
            result.push(el);
        }
    });
    return result.join("");
}

function getCssText(style) {
    if (style.cssText) {
        return style.cssText;
    }
    // Status: NEW.  Report year: 2002.  Current year: 2014.
    // Nice played, Mozillians.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=137687
    var result = [];
    for (var i = 0; i < style.length; ++i) {
        result.push(style[i] + ": " + getPropertyValue(style, style[i]));
    }
    return result.join(";\n");
}

function _renderWithPseudoElements(element, group) {
    if (element.tagName == KENDO_PSEUDO_ELEMENT) {
        _renderElement(element, group);
        return;
    }
    var fake = [];
    function pseudo(kind, place) {
        var style = getComputedStyle(element, kind);
        updateCounters(style);
        if (style.content && style.content != "normal" && style.content != "none" && style.width != "0px") {
            var psel = element.ownerDocument.createElement(KENDO_PSEUDO_ELEMENT);
            psel.style.cssText = getCssText(style);
            psel.textContent = evalPseudoElementContent(element, style.content);
            element.insertBefore(psel, place);
            fake.push(psel);
        }
    }
    pseudo(":before", element.firstChild);
    pseudo(":after", null);
    var saveClass = element.className;
    element.className += " kendo-pdf-hide-pseudo-elements";
    _renderElement(element, group);
    element.className = saveClass;
    fake.forEach(function(el){ element.removeChild(el); });
}

function _renderElement(element, group) {
    var style = getComputedStyle(element);

    var top = getBorder(style, "top");
    var right = getBorder(style, "right");
    var bottom = getBorder(style, "bottom");
    var left = getBorder(style, "left");

    var rTL0 = getBorderRadius(style, "top-left");
    var rTR0 = getBorderRadius(style, "top-right");
    var rBL0 = getBorderRadius(style, "bottom-left");
    var rBR0 = getBorderRadius(style, "bottom-right");

    var dir = getPropertyValue(style, "direction");

    var backgroundColor = getPropertyValue(style, "background-color");
    backgroundColor = parseColor$2(backgroundColor);

    var backgroundImage = parseBackgroundImage( getPropertyValue(style, "background-image") );
    var backgroundRepeat = splitProperty( getPropertyValue(style, "background-repeat") );
    var backgroundPosition = splitProperty( getPropertyValue(style, "background-position") );
    var backgroundOrigin = splitProperty( getPropertyValue(style, "background-origin") );
    var backgroundSize = splitProperty( getPropertyValue(style, "background-size") );

    if (browser$2.msie && browser$2.version < 10) {
        // IE9 hacks.  getPropertyValue won't return the correct
        // value.  Sucks that we have to do it here, I'd prefer to
        // move it in getPropertyValue, but we don't have the
        // element.
        backgroundPosition = splitProperty(element.currentStyle.backgroundPosition);
    }

    var innerbox = innerBox(element.getBoundingClientRect(), "border-*-width", element);

    // CSS "clip" property - if present, replace the group with a
    // new one which is clipped.  This must happen before drawing
    // the borders and background.
    (function(){
        var clip = getPropertyValue(style, "clip");
        var m = /^\s*rect\((.*)\)\s*$/.exec(clip);
        if (m) {
            var a = m[1].split(/[ ,]+/g);
            var top = a[0] == "auto" ? innerbox.top : parseFloat(a[0]) + innerbox.top;
            var right = a[1] == "auto" ? innerbox.right : parseFloat(a[1]) + innerbox.left;
            var bottom = a[2] == "auto" ? innerbox.bottom : parseFloat(a[2]) + innerbox.top;
            var left = a[3] == "auto" ? innerbox.left : parseFloat(a[3]) + innerbox.left;
            var tmp = new Group();
            var clipPath = new Path()
                .moveTo(left, top)
                .lineTo(right, top)
                .lineTo(right, bottom)
                .lineTo(left, bottom)
                .close();
            setClipping$1(tmp, clipPath);
            group.append(tmp);
            group = tmp;
            updateClipbox(clipPath);
        }
    })();

    var boxes, i, cells;
    var display = getPropertyValue(style, "display");

    if (display == "table-row") {
        // because of rowspan/colspan, we shouldn't draw background of table row elements on the
        // box given by its getBoundingClientRect, because if we do we risk overwritting a
        // previously rendered cell.  https://github.com/telerik/kendo/issues/4881
        boxes = [];
        for (i = 0, cells = element.children; i < cells.length; ++i) {
            boxes.push(cells[i].getBoundingClientRect());
        }
    } else {
        boxes = element.getClientRects();
        if (boxes.length == 1) {
            // Workaround the missing borders in Chrome!  getClientRects() boxes contains values
            // rounded to integer.  getBoundingClientRect() appears to work fine.  We still need
            // getClientRects() to support cases where there are more boxes (continued inline
            // elements that might have border/background).
            boxes = [ element.getBoundingClientRect() ];
        }
    }

    // This function workarounds another Chrome bug, where boxes returned for a table with
    // border-collapse: collapse will overlap the table border.  Our rendering is not perfect in
    // such case anyway, but with this is better than without it.
    boxes = adjustBoxes(boxes);

    for (i = 0; i < boxes.length; ++i) {
        drawOneBox(boxes[i], i === 0, i == boxes.length - 1);
    }

    if (boxes.length > 0 && display == "list-item" && !element.getAttribute("kendo-no-bullet")) {
        drawBullet(boxes[0]);
    }

    // overflow: hidden/auto - if present, replace the group with
    // a new one clipped by the inner box.
    (function(){
        function clipit() {
            var clipPath = elementRoundBox(element, innerbox, "padding");
            var tmp = new Group();
            setClipping$1(tmp, clipPath);
            group.append(tmp);
            group = tmp;
            updateClipbox(clipPath);
        }
        if (isFormField(element)) {
            clipit();
        } else if (/^(hidden|auto|scroll)/.test(getPropertyValue(style, "overflow"))) {
            clipit();
        } else if (/^(hidden|auto|scroll)/.test(getPropertyValue(style, "overflow-x"))) {
            clipit();
        } else if (/^(hidden|auto|scroll)/.test(getPropertyValue(style, "overflow-y"))) {
            clipit();
        }
    })();

    if (!maybeRenderWidget(element, group)) {
        renderContents(element, group);
    }

    return group; // only utility functions after this line.

    function adjustBoxes(boxes) {
        if (/^td$/i.test(element.tagName)) {
            var table = nodeInfo.table;
            if (table && getPropertyValue(table.style, "border-collapse") == "collapse") {
                var tableBorderLeft = getBorder(table.style, "left").width;
                var tableBorderTop = getBorder(table.style, "top").width;
                // check if we need to adjust
                if (tableBorderLeft === 0 && tableBorderTop === 0) {
                    return boxes; // nope
                }
                var tableBox = table.element.getBoundingClientRect();
                var firstCell = table.element.rows[0].cells[0];
                var firstCellBox = firstCell.getBoundingClientRect();
                if (firstCellBox.top == tableBox.top || firstCellBox.left == tableBox.left) {
                    return slice$1$1(boxes).map(function(box){
                        return {
                            left   : box.left + tableBorderLeft,
                            top    : box.top + tableBorderTop,
                            right  : box.right + tableBorderLeft,
                            bottom : box.bottom + tableBorderTop,
                            height : box.height,
                            width  : box.width
                        };
                    });
                }
            }
        }
        return boxes;
    }

    // this function will be called to draw each border.  it
    // draws starting at origin and the resulted path must be
    // translated/rotated to be placed in the proper position.
    //
    // arguments are named as if it draws the top border:
    //
    //    - `len` the length of the edge
    //    - `Wtop` the width of the edge (i.e. border-top-width)
    //    - `Wleft` the width of the left edge (border-left-width)
    //    - `Wright` the width of the right edge
    //    - `rl` and `rl` -- the border radius on the left and right
    //      (objects containing x and y, for horiz/vertical radius)
    //    - `transform` -- transformation to apply
    //
    function drawEdge(color, len, Wtop, Wleft, Wright, rl, rr, transform$$1) {
        if (Wtop <= 0) {
            return;
        }

        var path, edge = new Group();
        setTransform$1(edge, transform$$1);
        group.append(edge);

        sanitizeRadius(rl);
        sanitizeRadius(rr);

        // draw main border.  this is the area without the rounded corners
        path = new Path({
            fill: { color: color },
            stroke: null
        });
        edge.append(path);
        path.moveTo(rl.x ? Math.max(rl.x, Wleft) : 0, 0)
            .lineTo(len - (rr.x ? Math.max(rr.x, Wright) : 0), 0)
            .lineTo(len - Math.max(rr.x, Wright), Wtop)
            .lineTo(Math.max(rl.x, Wleft), Wtop)
            .close();

        if (rl.x) {
            drawRoundCorner(Wleft, rl, [ -1, 0, 0, 1, rl.x, 0 ]);
        }

        if (rr.x) {
            drawRoundCorner(Wright, rr, [ 1, 0, 0, 1, len - rr.x, 0 ]);
        }

        // draws one round corner, starting at origin (needs to be
        // translated/rotated to be placed properly).
        function drawRoundCorner(Wright, r, transform$$1) {
            var angle = Math.PI/2 * Wright / (Wright + Wtop);

            // not sanitizing this one, because negative values
            // are useful to fill the box correctly.
            var ri = {
                x: r.x - Wright,
                y: r.y - Wtop
            };

            var path = new Path({
                fill: { color: color },
                stroke: null
            }).moveTo(0, 0);

            setTransform$1(path, transform$$1);

            addArcToPath(path, 0, r.y, {
                startAngle: -90,
                endAngle: -radiansToDegrees(angle),
                radiusX: r.x,
                radiusY: r.y
            });

            if (ri.x > 0 && ri.y > 0) {
                path.lineTo(ri.x * Math.cos(angle), r.y - ri.y * Math.sin(angle));
                addArcToPath(path, 0, r.y, {
                    startAngle: -radiansToDegrees(angle),
                    endAngle: -90,
                    radiusX: ri.x,
                    radiusY: ri.y,
                    anticlockwise: true
                });
            }
            else if (ri.x > 0) {
                path.lineTo(ri.x, Wtop)
                    .lineTo(0, Wtop);
            }
            else {
                path.lineTo(ri.x, Wtop)
                    .lineTo(ri.x, 0);
            }

            edge.append(path.close());
        }
    }

    function drawBackground(box) {
        var background = new Group();
        setClipping$1(background, roundBox(box, rTL0, rTR0, rBR0, rBL0));
        group.append(background);

        if (element.tagName == "A" && element.href && !/^#?$/.test(element.getAttribute("href"))) {
            if (!nodeInfo._avoidLinks || !matches(element, nodeInfo._avoidLinks)) {
                background._pdfLink = {
                    url    : element.href,
                    top    : box.top,
                    right  : box.right,
                    bottom : box.bottom,
                    left   : box.left
                };
            }
        }

        if (backgroundColor) {
            var path = new Path({
                fill: { color: backgroundColor.toCssRgba() },
                stroke: null
            });
            path.moveTo(box.left, box.top)
                .lineTo(box.right, box.top)
                .lineTo(box.right, box.bottom)
                .lineTo(box.left, box.bottom)
                .close();
            background.append(path);
        }

        for (var i = backgroundImage.length; --i >= 0;) {
            drawOneBackground(
                background, box,
                backgroundImage[i],
                backgroundRepeat[i % backgroundRepeat.length],
                backgroundPosition[i % backgroundPosition.length],
                backgroundOrigin[i % backgroundOrigin.length],
                backgroundSize[i % backgroundSize.length]
            );
        }
    }

    function drawOneBackground(group, box, background, backgroundRepeat, backgroundPosition, backgroundOrigin, backgroundSize) {
        if (!background || (background == "none")) {
            return;
        }

        if (background.type == "url") {
            // SVG taints the canvas, can't draw it.
            if (/^url\(\"data:image\/svg/i.test(background.url)) {
                return;
            }
            var img = IMAGE_CACHE$1[background.url];
            if (img && img.width > 0 && img.height > 0) {
                drawBackgroundImage(group, box, img.width, img.height, function(group, rect){
                    group.append(new Image$1(background.url, rect));
                });
            }
        } else if (background.type == "linear") {
            drawBackgroundImage(group, box, box.width, box.height, gradientRenderer(background));
        } else {
            return;
        }

        function drawBackgroundImage(group, box, img_width, img_height, renderBG) {
            var aspect_ratio = img_width / img_height, f;

            // for background-origin: border-box the box is already appropriate
            var orgBox = box;
            if (backgroundOrigin == "content-box") {
                orgBox = innerBox(orgBox, "border-*-width", element);
                orgBox = innerBox(orgBox, "padding-*", element);
            } else if (backgroundOrigin == "padding-box") {
                orgBox = innerBox(orgBox, "border-*-width", element);
            }

            if (!/^\s*auto(\s+auto)?\s*$/.test(backgroundSize)) {
                if (backgroundSize == "contain") {
                    f = Math.min(orgBox.width / img_width,
                                 orgBox.height / img_height);
                    img_width *= f;
                    img_height *= f;
                }
                else if (backgroundSize == "cover") {
                    f = Math.max(orgBox.width / img_width,
                                 orgBox.height / img_height);
                    img_width *= f;
                    img_height *= f;
                }
                else {
                    var size = backgroundSize.split(/\s+/g);
                    // compute width
                    if (/%$/.test(size[0])) {
                        img_width = orgBox.width * parseFloat(size[0]) / 100;
                    } else {
                        img_width = parseFloat(size[0]);
                    }
                    // compute height
                    if (size.length == 1 || size[1] == "auto") {
                        img_height = img_width / aspect_ratio;
                    } else if (/%$/.test(size[1])) {
                        img_height = orgBox.height * parseFloat(size[1]) / 100;
                    } else {
                        img_height = parseFloat(size[1]);
                    }
                }
            }

            var pos = String(backgroundPosition);

            // IE sometimes reports single-word positions
            // https://github.com/telerik/kendo-ui-core/issues/2786
            //
            // it seems to switch to percentages when the horizontal
            // position is not "center", therefore we don't handle
            // multi-word cases here.  All other browsers return
            // percentages or pixels instead of keywords.  At least
            // for now...
            switch (pos) {
              case "bottom" : pos = "50% 100%"; break;
              case "top"    : pos = "50% 0"; break;
              case "left"   : pos = "0 50%"; break;
              case "right"  : pos = "100% 50%"; break;
              case "center" : pos = "50% 50%"; break;
            }

            pos = pos.split(/\s+/);
            if (pos.length == 1) {
                pos[1] = "50%";
            }

            if (/%$/.test(pos[0])) {
                pos[0] = parseFloat(pos[0]) / 100 * (orgBox.width - img_width);
            } else {
                pos[0] = parseFloat(pos[0]);
            }
            if (/%$/.test(pos[1])) {
                pos[1] = parseFloat(pos[1]) / 100 * (orgBox.height - img_height);
            } else {
                pos[1] = parseFloat(pos[1]);
            }

            var rect = new Rect([ orgBox.left + pos[0], orgBox.top + pos[1] ], [ img_width, img_height ]);

            // XXX: background-repeat could be implemented more
            //      efficiently as a fill pattern (at least for PDF
            //      output, probably SVG too).

            function rewX() {
                while (rect.origin.x > box.left) {
                    rect.origin.x -= img_width;
                }
            }

            function rewY() {
                while (rect.origin.y > box.top) {
                    rect.origin.y -= img_height;
                }
            }

            function repeatX() {
                while (rect.origin.x < box.right) {
                    renderBG(group, rect.clone());
                    rect.origin.x += img_width;
                }
            }

            if (backgroundRepeat == "no-repeat") {
                renderBG(group, rect);
            }
            else if (backgroundRepeat == "repeat-x") {
                rewX();
                repeatX();
            }
            else if (backgroundRepeat == "repeat-y") {
                rewY();
                while (rect.origin.y < box.bottom) {
                    renderBG(group, rect.clone());
                    rect.origin.y += img_height;
                }
            }
            else if (backgroundRepeat == "repeat") {
                rewX();
                rewY();
                var origin = rect.origin.clone();
                while (rect.origin.y < box.bottom) {
                    rect.origin.x = origin.x;
                    repeatX();
                    rect.origin.y += img_height;
                }
            }
        }
    }

    function drawBullet() {
        var listStyleType = getPropertyValue(style, "list-style-type");
        if (listStyleType == "none") {
            return;
        }
        var listStylePosition = getPropertyValue(style, "list-style-position");

        function _drawBullet(f) {
            saveStyle(element, function(){
                element.style.position = "relative";
                var bullet = element.ownerDocument.createElement(KENDO_PSEUDO_ELEMENT);
                bullet.style.position = "absolute";
                bullet.style.boxSizing = "border-box";
                if (listStylePosition == "outside") {
                    bullet.style.width = "6em";
                    bullet.style.left = "-6.8em";
                    bullet.style.textAlign = "right";
                } else {
                    bullet.style.left = "0px";
                }
                f(bullet);
                element.insertBefore(bullet, element.firstChild);
                renderElement(bullet, group);
                element.removeChild(bullet);
            });
        }

        function elementIndex(f) {
            var a = element.parentNode.children;
            var k = element.getAttribute("kendo-split-index");
            if (k != null) {
                return f(k|0, a.length);
            }
            for (var i = 0; i < a.length; ++i) {
                if (a[i] === element) {
                    return f(i, a.length);
                }
            }
        }

        switch (listStyleType) {
          case "circle":
          case "disc":
          case "square":
            _drawBullet(function(bullet){
                // XXX: the science behind these values is called "trial and error".
                bullet.style.fontSize = "60%";
                bullet.style.lineHeight = "200%";
                bullet.style.paddingRight = "0.5em";
                bullet.style.fontFamily = "DejaVu Serif";
                bullet.innerHTML = {
                    "disc"   : "\u25cf",
                    "circle" : "\u25ef",
                    "square" : "\u25a0"
                }[listStyleType];
            });
            break;

          case "decimal":
          case "decimal-leading-zero":
            _drawBullet(function(bullet){
                elementIndex(function(idx){
                    ++idx;
                    if (listStyleType == "decimal-leading-zero" && idx < 10) {
                        idx = "0" + idx;
                    }
                    bullet.innerHTML = idx + ".";
                });
            });
            break;

          case "lower-roman":
          case "upper-roman":
            _drawBullet(function(bullet){
                elementIndex(function(idx){
                    idx = arabicToRoman(idx + 1);
                    if (listStyleType == "upper-roman") {
                        idx = idx.toUpperCase();
                    }
                    bullet.innerHTML = idx + ".";
                });
            });
            break;

          case "lower-latin":
          case "lower-alpha":
          case "upper-latin":
          case "upper-alpha":
            _drawBullet(function(bullet){
                elementIndex(function(idx){
                    idx = alphaNumeral(idx);
                    if (/^upper/i.test(listStyleType)) {
                        idx = idx.toUpperCase();
                    }
                    bullet.innerHTML = idx + ".";
                });
            });
            break;
        }
    }

    // draws a single border box
    function drawOneBox(box, isFirst, isLast) {
        if (box.width === 0 || box.height === 0) {
            return;
        }

        drawBackground(box);

        var shouldDrawLeft = (left.width > 0 && ((isFirst && dir == "ltr") || (isLast && dir == "rtl")));
        var shouldDrawRight = (right.width > 0 && ((isLast && dir == "ltr") || (isFirst && dir == "rtl")));

        // The most general case is that the 4 borders have different widths and border
        // radiuses.  The way that is handled is by drawing 3 Paths for each border: the
        // straight line, and two round corners which represent half of the entire rounded
        // corner.  To simplify code those shapes are drawed at origin (by the drawEdge
        // function), then translated/rotated into the right position.
        //
        // However, this leads to poor results due to rounding in the simpler cases where
        // borders are straight lines.  Therefore we handle a few such cases separately with
        // straight lines. C^wC^wC^w -- nope, scratch that.  poor rendering was because of a bug
        // in Chrome (getClientRects() returns rounded integer values rather than exact floats.
        // web dev is still a ghetto.)

        // first, just in case there is no border...
        if (top.width === 0 && left.width === 0 && right.width === 0 && bottom.width === 0) {
            return;
        }

        // START paint borders
        // if all borders have equal colors...
        if (top.color == right.color && top.color == bottom.color && top.color == left.color) {

            // if same widths too, we can draw the whole border by stroking a single path.
            if (top.width == right.width && top.width == bottom.width && top.width == left.width)
            {
                if (shouldDrawLeft && shouldDrawRight) {
                    // reduce box by half the border width, so we can draw it by stroking.
                    box = innerBox(box, top.width/2);

                    // adjust the border radiuses, again by top.width/2, and make the path element.
                    var path = elementRoundBox(element, box, top.width/2);
                    path.options.stroke = {
                        color: top.color,
                        width: top.width
                    };
                    group.append(path);
                    return;
                }
            }
        }

        // if border radiuses are zero and widths are at most one pixel, we can again use simple
        // paths.
        if (rTL0.x === 0 && rTR0.x === 0 && rBR0.x === 0 && rBL0.x === 0) {
            // alright, 1.9px will do as well.  the difference in color blending should not be
            // noticeable.
            if (top.width < 2 && left.width < 2 && right.width < 2 && bottom.width < 2) {
                // top border
                if (top.width > 0) {
                    group.append(
                        new Path({
                            stroke: { width: top.width, color: top.color }
                        })
                            .moveTo(box.left, box.top + top.width/2)
                            .lineTo(box.right, box.top + top.width/2)
                    );
                }

                // bottom border
                if (bottom.width > 0) {
                    group.append(
                        new Path({
                            stroke: { width: bottom.width, color: bottom.color }
                        })
                            .moveTo(box.left, box.bottom - bottom.width/2)
                            .lineTo(box.right, box.bottom - bottom.width/2)
                    );
                }

                // left border
                if (shouldDrawLeft) {
                    group.append(
                        new Path({
                            stroke: { width: left.width, color: left.color }
                        })
                            .moveTo(box.left + left.width/2, box.top)
                            .lineTo(box.left + left.width/2, box.bottom)
                    );
                }

                // right border
                if (shouldDrawRight) {
                    group.append(
                        new Path({
                            stroke: { width: right.width, color: right.color }
                        })
                            .moveTo(box.right - right.width/2, box.top)
                            .lineTo(box.right - right.width/2, box.bottom)
                    );
                }

                return;
            }
        }
        // END paint borders

        var tmp = adjustBorderRadiusForBox(box, rTL0, rTR0, rBR0, rBL0);
        var rTL = tmp.tl;
        var rTR = tmp.tr;
        var rBR = tmp.br;
        var rBL = tmp.bl;

        // top border
        drawEdge(top.color,
                 box.width, top.width, left.width, right.width,
                 rTL, rTR,
                 [ 1, 0, 0, 1, box.left, box.top ]);

        // bottom border
        drawEdge(bottom.color,
                 box.width, bottom.width, right.width, left.width,
                 rBR, rBL,
                 [ -1, 0, 0, -1, box.right, box.bottom ]);

        // for left/right borders we need to invert the border-radiuses
        function inv(p) {
            return { x: p.y, y: p.x };
        }

        // left border
        drawEdge(left.color,
                 box.height, left.width, bottom.width, top.width,
                 inv(rBL), inv(rTL),
                 [ 0, -1, 1, 0, box.left, box.bottom ]);

        // right border
        drawEdge(right.color,
                 box.height, right.width, top.width, bottom.width,
                 inv(rTR), inv(rBR),
                 [ 0, 1, -1, 0, box.right, box.top ]);
    }
}

function gradientRenderer(gradient) {
    return function(group, rect) {
        var width = rect.width(), height = rect.height();

        switch (gradient.type) {
          case "linear":

            // figure out the angle.
            var angle = gradient.angle != null ? gradient.angle : Math.PI;
            switch (gradient.to) {
              case "top":
                angle = 0;
                break;
              case "left":
                angle = -Math.PI / 2;
                break;
              case "bottom":
                angle = Math.PI;
                break;
              case "right":
                angle = Math.PI / 2;
                break;
              case "top left": case "left top":
                angle = -Math.atan2(height, width);
                break;
              case "top right": case "right top":
                angle = Math.atan2(height, width);
                break;
              case "bottom left": case "left bottom":
                angle = Math.PI + Math.atan2(height, width);
                break;
              case "bottom right": case "right bottom":
                angle = Math.PI - Math.atan2(height, width);
                break;
            }

            if (gradient.reverse) {
                angle -= Math.PI;
            }

            // limit the angle between 0..2PI
            angle %= 2 * Math.PI;
            if (angle < 0) {
                angle += 2 * Math.PI;
            }

            // compute gradient's start/end points.  here len is the length of the gradient line
            // and x,y is the end point relative to the center of the rectangle in conventional
            // (math) axis direction.

            // this is the original (unscaled) length of the gradient line.  needed to deal with
            // absolutely positioned color stops.  formula from the CSS spec:
            // http://dev.w3.org/csswg/css-images-3/#linear-gradient-syntax
            var pxlen = Math.abs(width * Math.sin(angle)) + Math.abs(height * Math.cos(angle));

            // The math below is pretty simple, but it took a while to figure out.  We compute x
            // and y, the *end* of the gradient line.  However, we want to transform them into
            // element-based coordinates (SVG's gradientUnits="objectBoundingBox").  That means,
            // x=0 is the left edge, x=1 is the right edge, y=0 is the top edge and y=1 is the
            // bottom edge.
            //
            // A naive approach would use the original angle for these calculations.  Say we'd
            // like to draw a gradient angled at 45deg in a 100x400 box.  When we use
            // objectBoundingBox, the renderer will draw it in a 1x1 *square* box, and then
            // scale that to the desired dimensions.  The 45deg angle will look more like 70deg
            // after scaling.  SVG (http://www.w3.org/TR/SVG/pservers.html#LinearGradients) says
            // the following:
            //
            //     When gradientUnits="objectBoundingBox" and 'gradientTransform' is the
            //     identity matrix, the normal of the linear gradient is perpendicular to the
            //     gradient vector in object bounding box space (i.e., the abstract coordinate
            //     system where (0,0) is at the top/left of the object bounding box and (1,1) is
            //     at the bottom/right of the object bounding box). When the object's bounding
            //     box is not square, the gradient normal which is initially perpendicular to
            //     the gradient vector within object bounding box space may render
            //     non-perpendicular relative to the gradient vector in user space. If the
            //     gradient vector is parallel to one of the axes of the bounding box, the
            //     gradient normal will remain perpendicular. This transformation is due to
            //     application of the non-uniform scaling transformation from bounding box space
            //     to user space.
            //
            // which is an extremely long and confusing way to tell what I just said above.
            //
            // For this reason we need to apply the reverse scaling to the original angle, so
            // that when it'll finally be rendered it'll actually be at the desired slope.  Now
            // I'll let you figure out the math yourself.

            var scaledAngle = Math.atan(width * Math.tan(angle) / height);
            var sin = Math.sin(scaledAngle), cos = Math.cos(scaledAngle);
            var len = Math.abs(sin) + Math.abs(cos);
            var x = len/2 * sin;
            var y = len/2 * cos;

            // Because of the arctangent, our scaledAngle ends up between -PI/2..PI/2, possibly
            // losing the intended direction of the gradient.  The following fixes it.
            if (angle > Math.PI/2 && angle <= 3*Math.PI/2) {
                x = -x;
                y = -y;
            }

            // compute the color stops.
            var implicit = [], right = 0;
            var stops = gradient.stops.map(function(s, i){
                var offset = s.percent;
                if (offset) {
                    offset = parseFloat(offset) / 100;
                } else if (s.length) {
                    offset = parseFloat(s.length) / pxlen;
                } else if (i === 0) {
                    offset = 0;
                } else if (i == gradient.stops.length - 1) {
                    offset = 1;
                }
                var stop = {
                    color: s.color.toCssRgba(),
                    offset: offset
                };
                if (offset != null) {
                    right = offset;
                    // fix implicit offsets
                    implicit.forEach(function(s, i){
                        var stop = s.stop;
                        stop.offset = s.left + (right - s.left) * (i + 1) / (implicit.length + 1);
                    });
                    implicit = [];
                } else {
                    implicit.push({ left: right, stop: stop });
                }
                return stop;
            });

            var start = [ 0.5 - x, 0.5 + y ];
            var end = [ 0.5 + x, 0.5 - y ];

            // finally, draw it.
            group.append(
                Path.fromRect(rect)
                    .stroke(null)
                    .fill(new LinearGradient({
                        start     : start,
                        end       : end,
                        stops     : stops,
                        userSpace : false
                    }))
            );
            break;
          case "radial":
            // XXX:
            if (window.console && window.console.log) {
                window.console.log("Radial gradients are not yet supported in HTML renderer");
            }
            break;
        }
    };
}

function maybeRenderWidget(element, group) {
    var visual;

    if (element._kendoExportVisual) {
        visual = element._kendoExportVisual();
    } else if (window.kendo && window.kendo.jQuery && element.getAttribute(window.kendo.attr("role"))) {
        var widget = window.kendo.widgetInstance(window.kendo.jQuery(element));
        if (widget && (widget.exportDOMVisual || widget.exportVisual)) {
            if (widget.exportDOMVisual) {
                visual = widget.exportDOMVisual();
            } else {
                visual = widget.exportVisual();
            }
        }
    }

    if (!visual) {
        return false;
    }

    var wrap$$1 = new Group();
    wrap$$1.children.push(visual);

    var bbox = element.getBoundingClientRect();
    wrap$$1.transform(transform$1().translate(bbox.left, bbox.top));

    group.append(wrap$$1);

    return true;
}

function renderImage(element, url, group) {
    var box = getContentBox(element);
    var rect = new Rect([ box.left, box.top ], [ box.width, box.height ]);
    var image = new Image$1(url, rect);
    setClipping$1(image, elementRoundBox(element, box, "content"));
    group.append(image);
}

function zIndexSort(a, b) {
    var sa = getComputedStyle(a);
    var sb = getComputedStyle(b);
    var za = parseFloat(getPropertyValue(sa, "z-index"));
    var zb = parseFloat(getPropertyValue(sb, "z-index"));
    var pa = getPropertyValue(sa, "position");
    var pb = getPropertyValue(sb, "position");
    if (isNaN(za) && isNaN(zb)) {
        if ((/static|absolute/.test(pa)) && (/static|absolute/.test(pb))) {
            return 0;
        }
        if (pa == "static") {
            return -1;
        }
        if (pb == "static") {
            return 1;
        }
        return 0;
    }
    if (isNaN(za)) {
        return zb === 0 ? 0 : zb > 0 ? -1 : 1;
    }
    if (isNaN(zb)) {
        return za === 0 ? 0 : za > 0 ? 1 : -1;
    }
    return parseFloat(za) - parseFloat(zb);
}

function isFormField(element) {
    return /^(?:textarea|select|input)$/i.test(element.tagName);
}

function getSelectedOption(element) {
    if (element.selectedOptions && element.selectedOptions.length > 0) {
        return element.selectedOptions[0];
    }
    return element.options[element.selectedIndex];
}

function renderCheckbox(element, group) {
    var style = getComputedStyle(element);
    var color = getPropertyValue(style, "color");
    var box = element.getBoundingClientRect();
    if (element.type == "checkbox") {
        group.append(
            Path.fromRect(
                new Rect([ box.left+1, box.top+1 ],
                             [ box.width-2, box.height-2 ])
            ).stroke(color, 1)
        );
        if (element.checked) {
            // fill a rectangle inside?  looks kinda ugly.
            // group.append(
            //     Path.fromRect(
            //         new geo.Rect([ box.left+4, box.top+4 ],
            //                      [ box.width-8, box.height-8])
            //     ).fill(color).stroke(null)
            // );

            // let's draw a checkmark instead.  artistic, eh?
            group.append(
                new Path()
                    .stroke(color, 1.2)
                    .moveTo(box.left + 0.22 * box.width,
                            box.top + 0.55 * box.height)
                    .lineTo(box.left + 0.45 * box.width,
                            box.top + 0.75 * box.height)
                    .lineTo(box.left + 0.78 * box.width,
                            box.top + 0.22 * box.width)
            );
        }
    } else {
        group.append(
            new Circle(
                new Circle$2([
                    (box.left + box.right) / 2,
                    (box.top + box.bottom) / 2
                ], Math.min(box.width-2, box.height-2) / 2)
            ).stroke(color, 1)
        );
        if (element.checked) {
            group.append(
                new Circle(
                    new Circle$2([
                        (box.left + box.right) / 2,
                        (box.top + box.bottom) / 2
                    ], Math.min(box.width-8, box.height-8) / 2)
                ).fill(color).stroke(null)
            );
        }
    }
}

function renderFormField(element, group) {
    var tag = element.tagName.toLowerCase();
    if (tag == "input" && (element.type == "checkbox" || element.type == "radio")) {
        return renderCheckbox(element, group);
    }
    var p = element.parentNode;
    var doc = element.ownerDocument;
    var el = doc.createElement(KENDO_PSEUDO_ELEMENT);
    var option;
    el.style.cssText = getCssText(getComputedStyle(element));
    if (tag == "input") {
        el.style.whiteSpace = "pre";
    }
    if (tag == "select" || tag == "textarea") {
        el.style.overflow = "auto";
    }
    if (tag == "select") {
        if (element.multiple) {
            for (var i = 0; i < element.options.length; ++i) {
                option = doc.createElement(KENDO_PSEUDO_ELEMENT);
                option.style.cssText = getCssText(getComputedStyle(element.options[i]));
                option.style.display = "block"; // IE9 messes up without this
                option.textContent = element.options[i].textContent;
                el.appendChild(option);
            }
        } else {
            option = getSelectedOption(element);
            if (option) {
                el.textContent = option.textContent;
            }
        }
    } else {
        el.textContent = element.value;
    }
    p.insertBefore(el, element);
    el.scrollLeft = element.scrollLeft;
    el.scrollTop = element.scrollTop;

    // must temporarily hide the original element, otherwise it
    // may affect layout of the fake element we want to render.
    element.style.display = "none";

    renderContents(el, group);
    element.style.display = "";
    p.removeChild(el);
}

function renderContents(element, group) {
    if (nodeInfo._stackingContext.element === element) {
        // the group that was set in pushNodeInfo might have
        // changed due to clipping/transforms, update it here.
        nodeInfo._stackingContext.group = group;
    }
    switch (element.tagName.toLowerCase()) {
      case "img":
        renderImage(element, element.src, group);
        break;

      case "canvas":
        try {
            renderImage(element, element.toDataURL("image/png"), group);
        } catch (ex) {
            // tainted; can't draw it, ignore.
        }
        break;

      case "textarea":
      case "input":
      case "select":
        renderFormField(element, group);
        break;

      default:
        var children = [], floats = [], positioned = [];
        for (var i = element.firstChild; i; i = i.nextSibling) {
            switch (i.nodeType) {
              case 3:         // Text
                if (/\S/.test(i.data)) {
                    renderText(element, i, group);
                }
                break;
              case 1:         // Element
                var style = getComputedStyle(i);
                var floating = getPropertyValue(style, "float");
                var position = getPropertyValue(style, "position");
                if (position != "static") {
                    positioned.push(i);
                }
                else if (floating != "none") {
                    floats.push(i);
                } else {
                    children.push(i);
                }
                break;
            }
        }

        mergeSort(children, zIndexSort).forEach(function(el){ renderElement(el, group); });
        mergeSort(floats, zIndexSort).forEach(function(el){ renderElement(el, group); });
        mergeSort(positioned, zIndexSort).forEach(function(el){ renderElement(el, group); });
    }
}

function renderText(element, node, group) {
    if (emptyClipbox()) {
        return;
    }
    var style = getComputedStyle(element);

    if (parseFloat(getPropertyValue(style, "text-indent")) < -500) {
        // assume it should not be displayed.  the slider's
        // draggable handle displays a Drag text for some reason,
        // having text-indent: -3333px.
        return;
    }

    var text = node.data;
    var start = 0;
    var end = text.search(/\S\s*$/) + 1;

    if (!end) {
        return; // whitespace-only node
    }

    var fontSize = getPropertyValue(style, "font-size");
    var lineHeight = getPropertyValue(style, "line-height");

    // simply getPropertyValue("font") doesn't work in Firefox :-\
    var font = [
        getPropertyValue(style, "font-style"),
        getPropertyValue(style, "font-variant"),
        getPropertyValue(style, "font-weight"),
        fontSize, // no need for line height here; it breaks layout in FF
        getPropertyValue(style, "font-family")
    ].join(" ");

    fontSize = parseFloat(fontSize);
    lineHeight = parseFloat(lineHeight);

    if (fontSize === 0) {
        return;
    }

    var color = getPropertyValue(style, "color");
    var range = element.ownerDocument.createRange();
    var align$$1 = getPropertyValue(style, "text-align");
    var isJustified = align$$1 == "justify";
    var columnCount = getPropertyValue(style, "column-count", 1);
    var whiteSpace = getPropertyValue(style, "white-space");

    // IE shrinks the text with text-overflow: ellipsis,
    // apparently because the returned bounding box for the range
    // is limited to the visible area minus space for the dots,
    // instead of being the full width of the text.
    //
    // https://github.com/telerik/kendo/issues/5232
    var textOverflow, saveTextOverflow;
    if (browser$2.msie) {
        textOverflow = style.textOverflow;             // computed style
        if (textOverflow == "ellipsis") {
            saveTextOverflow = element.style.textOverflow; // own style.
            element.style.textOverflow = "clip";
        }
    }

    // A line of 500px, with a font of 12px, contains an average of 80 characters, but since we
    // err, we'd like to guess a bigger number rather than a smaller one.  Multiplying by 5
    // seems to be a good option.
    var estimateLineLength = element.getBoundingClientRect().width / fontSize * 5;
    if (estimateLineLength === 0) {
        estimateLineLength = 500;
    }

    // we'll maintain this so we can workaround bugs in Chrome's Range.getClientRects
    // https://github.com/telerik/kendo/issues/5740
    var prevLineBottom = null;

    var underline = nodeInfo["underline"];
    var lineThrough = nodeInfo["line-through"];
    var overline = nodeInfo["overline"];
    var hasDecoration = underline || lineThrough || overline;

    // doChunk returns true when all text has been rendered
    while (!doChunk()) {}

    if (browser$2.msie && textOverflow == "ellipsis") {
        element.style.textOverflow = saveTextOverflow;
    }

    if (hasDecoration) {
        range.selectNode(node);
        slice$1$1(range.getClientRects()).forEach(decorate);
    }

    return;                 // only function declarations after this line

    function actuallyGetRangeBoundingRect(range) {
        // XXX: to be revised when this Chrome bug is fixed:
        // https://bugs.chromium.org/p/chromium/issues/detail?id=612459
        if (browser$2.msie || browser$2.chrome) {
            // Workaround browser bugs: IE and Chrome would sometimes
            // return 0 or 1-width rectangles before or after the main
            // one.  https://github.com/telerik/kendo/issues/4674

            // Actually Chrome 50 got worse, since the rectangles can now have the width of a
            // full character, making it hard to tell whether it's a bogus rectangle or valid
            // selection location.  The workaround is to ignore rectangles that fall on the
            // previous line.  https://github.com/telerik/kendo/issues/5740
            var rectangles = range.getClientRects(), box = {
                top    :  Infinity,
                right  : -Infinity,
                bottom : -Infinity,
                left   :  Infinity
            };
            for (var i = 0; i < rectangles.length; ++i) {
                var b = rectangles[i];
                if (b.width <= 1 || b.bottom === prevLineBottom) {
                    continue;   // bogus rectangle
                }
                box.left   = Math.min(b.left   , box.left);
                box.top    = Math.min(b.top    , box.top);
                box.right  = Math.max(b.right  , box.right);
                box.bottom = Math.max(b.bottom , box.bottom);
            }
            box.width = box.right - box.left;
            box.height = box.bottom - box.top;
            return box;
        }
        return range.getBoundingClientRect();
    }

    // Render a chunk of text, typically one line (but for justified text we render each word as
    // a separate Text object, because spacing is variable).  Returns true when it finished the
    // current node.  After each chunk it updates `start` to just after the last rendered
    // character.
    function doChunk() {
        var origStart = start;
        var box, pos = text.substr(start).search(/\S/);
        start += pos;
        if (pos < 0 || start >= end) {
            return true;
        }

        // Select a single character to determine the height of a line of text.  The box.bottom
        // will be essential for us to figure out where the next line begins.
        range.setStart(node, start);
        range.setEnd(node, start + 1);
        box = actuallyGetRangeBoundingRect(range);

        // for justified text we must split at each space, because space has variable width.
        var found = false;
        if (isJustified || columnCount > 1) {
            pos = text.substr(start).search(/\s/);
            if (pos >= 0) {
                // we can only split there if it's on the same line, otherwise we'll fall back
                // to the default mechanism (see findEOL below).
                range.setEnd(node, start + pos);
                var r = actuallyGetRangeBoundingRect(range);
                if (r.bottom == box.bottom) {
                    box = r;
                    found = true;
                    start += pos;
                }
            }
        }

        if (!found) {
            // This code does three things: (1) it selects one line of text in `range`, (2) it
            // leaves the bounding rect of that line in `box` and (3) it returns the position
            // just after the EOL.  We know where the line starts (`start`) but we don't know
            // where it ends.  To figure this out, we select a piece of text and look at the
            // bottom of the bounding box.  If it changes, we have more than one line selected
            // and should retry with a smaller selection.
            //
            // To speed things up, we first try to select all text in the node (`start` ->
            // `end`).  If there's more than one line there, then select only half of it.  And
            // so on.  When we find a value for `end` that fits in one line, we try increasing
            // it (also in halves) until we get to the next line.  The algorithm stops when the
            // right side of the bounding box does not change.
            //
            // One more thing to note is that everything happens in a single Text DOM node.
            // There's no other tags inside it, therefore the left/top coordinates of the
            // bounding box will not change.
            pos = (function findEOL(min, eol, max){
                range.setEnd(node, eol);
                var r = actuallyGetRangeBoundingRect(range);
                if (r.bottom != box.bottom && min < eol) {
                    return findEOL(min, (min + eol) >> 1, eol);
                } else if (r.right != box.right) {
                    box = r;
                    if (eol < max) {
                        return findEOL(eol, (eol + max) >> 1, max);
                    } else {
                        return eol;
                    }
                } else {
                    return eol;
                }
            })(start, Math.min(end, start + estimateLineLength), end);

            if (pos == start) {
                // if EOL is at the start, then no more text fits on this line.  Skip the
                // remainder of this node entirely to avoid a stack overflow.
                return true;
            }
            start = pos;

            pos = range.toString().search(/\s+$/);
            if (pos === 0) {
                return false; // whitespace only; we should not get here.
            }
            if (pos > 0) {
                // eliminate trailing whitespace
                range.setEnd(node, range.startOffset + pos);
                box = actuallyGetRangeBoundingRect(range);
            }
        }

        // another workaround for IE: if we rely on getBoundingClientRect() we'll overlap with the bullet for LI
        // elements.  Calling getClientRects() and using the *first* rect appears to give us the correct location.
        // Note: not to be used in Chrome as it randomly returns a zero-width rectangle from the previous line.
        if (browser$2.msie) {
            box = range.getClientRects()[0];
        }

        var str = range.toString();
        if (!/^(?:pre|pre-wrap)$/i.test(whiteSpace)) {
            // node with non-significant space -- collapse whitespace.
            str = str.replace(/\s+/g, " ");
        }
        else if (/\t/.test(str)) {
            // with significant whitespace we need to do something about literal TAB characters.
            // There's no TAB glyph in a font so they would be rendered in PDF as an empty box,
            // and the whole text will stretch to fill the original width.  The core PDF lib
            // does not have sufficient context to deal with it.

            // calculate the starting column here, since we initially discarded any whitespace.
            var cc = 0;
            for (pos = origStart; pos < range.startOffset; ++pos) {
                var code = text.charCodeAt(pos);
                if (code == 9) {
                    // when we meet a TAB we must round up to the next tab stop.
                    // in all browsers TABs seem to be 8 characters.
                    cc += 8 - cc % 8;
                } else if (code == 10 || code == 13) {
                    // just in case we meet a newline we must restart.
                    cc = 0;
                } else {
                    // ordinary character --> advance one column
                    cc++;
                }
            }

            // based on starting column, replace any TAB characters in the string we actually
            // have to display with spaces so that they align to columns multiple of 8.
            while ((pos = str.search("\t")) >= 0) {
                var indent = "        ".substr(0, 8 - (cc + pos) % 8);
                str = str.substr(0, pos) + indent + str.substr(pos + 1);
            }
        }

        if (!found) {
            prevLineBottom = box.bottom;
        }
        drawText(str, box);
    }

    function drawText(str, box) {
        // In IE the box height will be approximately lineHeight, while in
        // other browsers it'll (correctly) be the height of the bounding
        // box for the current text/font.  Which is to say, IE sucks again.
        // The only good solution I can think of is to measure the text
        // ourselves and center the bounding box.
        if (browser$2.msie && !isNaN(lineHeight)) {
            var height = getFontHeight(font);
            var top = (box.top + box.bottom - height) / 2;
            box = {
                top    : top,
                right  : box.right,
                bottom : top + height,
                left   : box.left,
                height : height,
                width  : box.right - box.left
            };
        }

        // var path = new Path({ stroke: { color: "red" }});
        // path.moveTo(box.left, box.top)
        //     .lineTo(box.right, box.top)
        //     .lineTo(box.right, box.bottom)
        //     .lineTo(box.left, box.bottom)
        //     .close();
        // group.append(path);

        var text = new TextRect(
            str, new Rect([ box.left, box.top ],
                              [ box.width, box.height ]),
            {
                font: font,
                fill: { color: color }
            }
        );
        group.append(text);
    }

    function decorate(box) {
        line(underline, box.bottom);
        line(lineThrough, box.bottom - box.height / 2.7);
        line(overline, box.top);
        function line(color, ypos) {
            if (color) {
                var width = fontSize / 12;
                var path = new Path({ stroke: {
                    width: width,
                    color: color
                }});

                ypos -= width;
                path.moveTo(box.left, ypos)
                    .lineTo(box.right, ypos);
                group.append(path);
            }
        }
    }
}

function groupInStackingContext(element, group, zIndex) {
    var main;
    if (zIndex != "auto") {
        // use the current stacking context
        main = nodeInfo._stackingContext.group;
        zIndex = parseFloat(zIndex);
    } else {
        // normal flow — use given container.  we still have to
        // figure out where should we insert this element with the
        // assumption that its z-index is zero, as the group might
        // already contain elements with higher z-index.
        main = group;
        zIndex = 0;
    }
    var a = main.children;
    for (var i = 0; i < a.length; ++i) {
        if (a[i]._dom_zIndex != null && a[i]._dom_zIndex > zIndex) {
            break;
        }
    }

    var tmp = new Group();
    main.insert(i, tmp);
    tmp._dom_zIndex = zIndex;

    if (main !== group) {
        // console.log("Placing", element, "in", nodeInfo._stackingContext.element, "at position", i, " / ", a.length);
        // console.log(a.slice(i+1));

        // if (nodeInfo._matrix) {
        //     tmp.transform(nodeInfo._matrix);
        // }
        if (nodeInfo._clipbox) {
            var m = nodeInfo._matrix.invert();
            var r = nodeInfo._clipbox.transformCopy(m);
            setClipping$1(tmp, Path.fromRect(r));
            // console.log(r);
            // tmp.append(Path.fromRect(r));
            // tmp.append(new Text(element.className || element.id, r.topLeft()));
        }
    }

    return tmp;
}

function renderElement(element, container) {
    var style = getComputedStyle(element);

    updateCounters(style);

    if (/^(style|script|link|meta|iframe|svg|col|colgroup)$/i.test(element.tagName)) {
        return;
    }

    if (nodeInfo._clipbox == null) {
        return;
    }

    var opacity = parseFloat(getPropertyValue(style, "opacity"));
    var visibility = getPropertyValue(style, "visibility");
    var display = getPropertyValue(style, "display");

    if (opacity === 0 || visibility == "hidden" || display == "none") {
        return;
    }

    var tr = getTransform(style);
    var group;

    var zIndex = getPropertyValue(style, "z-index");
    if ((tr || opacity < 1) && zIndex == "auto") {
        zIndex = 0;
    }
    group = groupInStackingContext(element, container, zIndex);

    // XXX: remove at some point
    // group._pdfElement = element;
    // group.options._pdfDebug = "";
    // if (element.id) {
    //     group.options._pdfDebug = "#" + element.id;
    // }
    // if (element.className) {
    //     group.options._pdfDebug += "." + element.className.split(" ").join(".");
    // }

    if (opacity < 1) {
        group.opacity(opacity * group.opacity());
    }

    pushNodeInfo(element, style, group);

    if (!tr) {
        _renderWithPseudoElements(element, group);
    }
    else {
        saveStyle(element, function(){
            // must clear transform, so getBoundingClientRect returns correct values.
            pleaseSetPropertyValue(element.style, "transform", "none", "important");

            // must also clear transitions, so correct values are returned *immediately*
            pleaseSetPropertyValue(element.style, "transition", "none", "important");

            // the presence of any transform makes it behave like it had position: relative,
            // because why not.
            // http://meyerweb.com/eric/thoughts/2011/09/12/un-fixing-fixed-elements-with-css-transforms/
            if (getPropertyValue(style, "position") == "static") {
                // but only if it's not already positioned. :-/
                pleaseSetPropertyValue(element.style, "position", "relative", "important");
            }

            // must translate to origin before applying the CSS
            // transformation, then translate back.
            var bbox = element.getBoundingClientRect();
            var x = bbox.left + tr.origin[0];
            var y = bbox.top + tr.origin[1];
            var m = [ 1, 0, 0, 1, -x, -y ];
            m = mmul$1(m, tr.matrix);
            m = mmul$1(m, [ 1, 0, 0, 1, x, y ]);
            m = setTransform$1(group, m);

            nodeInfo._matrix = nodeInfo._matrix.multiplyCopy(m);

            _renderWithPseudoElements(element, group);
        });
    }

    popNodeInfo();

    //drawDebugBox(element.getBoundingClientRect(), container);
}

// function drawDebugBox(box, group, color) {
//     var path = Path.fromRect(new geo.Rect([ box.left, box.top ], [ box.width, box.height ]));
//     if (color) {
//         path.stroke(color);
//     }
//     group.append(path);
// }

// function dumpTextNode(node) {
//     var txt = node.data.replace(/^\s+/, "");
//     if (txt.length < 100) {
//         console.log(node.data.length + ": |" + txt);
//     } else {
//         console.log(node.data.length + ": |" + txt.substr(0, 50) + "|...|" + txt.substr(-50));
//     }
// }

function mmul$1(a, b) {
    var a1 = a[0], b1 = a[1], c1 = a[2], d1 = a[3], e1 = a[4], f1 = a[5];
    var a2 = b[0], b2 = b[1], c2 = b[2], d2 = b[3], e2 = b[4], f2 = b[5];
    return [
        a1*a2 + b1*c2,          a1*b2 + b1*d2,
        c1*a2 + d1*c2,          c1*b2 + d1*d2,
        e1*a2 + f1*c2 + e2,     e1*b2 + f1*d2 + f2
    ];
}

exports.drawing = drawing;
exports.geometry = geometry;
exports.pdf = pdf;
exports.drawDOM = drawDOM;
exports.exportPDF = exportPDF;
exports.exportImage = exportImage;
exports.exportSVG = exportSVG;
exports.animationFrame = animationFrameProxy;
exports.Class = Class;
exports.Color = Color;
exports.htmlEncode = htmlEncode;
exports.logToConsole = logToConsole;
exports.Observable = Observable;
exports.saveAs = saveAs;
exports.support = support;
exports.template = template$1;
exports.throttle = throttle;
exports.Animation = Animation;
exports.AnimationFactory = AnimationFactory;
exports.Arc = Arc;
exports.BaseNode = BaseNode;
exports.Circle = Circle;
exports.Element = Element$1;
exports.Gradient = Gradient;
exports.GradientStop = GradientStop;
exports.Group = Group;
exports.Image = Image$1;
exports.Layout = Layout;
exports.LinearGradient = LinearGradient;
exports.MultiPath = MultiPath;
exports.ObserversMixin = ObserversMixin;
exports.OptionsStore = OptionsStore;
exports.Path = Path;
exports.PathParser = PathParser;
exports.QuadNode = QuadNode;
exports.RadialGradient = RadialGradient;
exports.Rect = Rect$2;
exports.ShapesQuadTree = ShapesQuadTree;
exports.Surface = Surface;
exports.SurfaceFactory = SurfaceFactory;
exports.Text = Text;
exports.align = align;
exports.fit = fit;
exports.stack = stack;
exports.vAlign = vAlign;
exports.vStack = vStack;
exports.vWrap = vWrap;
exports.wrap = wrap;

//# sourceMappingURL=main.js.map
