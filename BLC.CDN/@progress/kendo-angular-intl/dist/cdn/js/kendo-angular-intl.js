!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(require("@angular/core")):"function"==typeof define&&define.amd?define(["@angular/core"],r):"object"==typeof exports?exports.KendoAngularIntl=r(require("@angular/core")):e.KendoAngularIntl=r(e["@angular/core"])}(this,function(e){return function(e){function r(n){if(t[n])return t[n].exports;var a=t[n]={exports:{},id:n,loaded:!1};return e[n].call(a.exports,a,a.exports,r),a.loaded=!0,a.exports}var t={};return r.m=e,r.c=t,r.p="",r(0)}([function(e,r,t){"use strict";function n(e){for(var t in e)r.hasOwnProperty(t)||(r[t]=e[t])}Object.defineProperty(r,"__esModule",{value:!0}),n(t(1)),n(t(3)),n(t(7)),n(t(8)),n(t(9)),n(t(4))},function(e,r,t){"use strict";var n=this&&this.__decorate||function(e,r,t,n){var a,i=arguments.length,o=i<3?r:null===n?n=Object.getOwnPropertyDescriptor(r,t):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,r,t,n);else for(var u=e.length-1;u>=0;u--)(a=e[u])&&(o=(i<3?a(o):i>3?a(r,t,o):a(r,t))||o);return i>3&&o&&Object.defineProperty(r,t,o),o};Object.defineProperty(r,"__esModule",{value:!0});var a=t(2),i=function(){function e(){}return e}();i=n([a.Injectable()],i),r.IntlService=i},function(r,t){r.exports=e},function(e,r,t){"use strict";var n=this&&this.__decorate||function(e,r,t,n){var a,i=arguments.length,o=i<3?r:null===n?n=Object.getOwnPropertyDescriptor(r,t):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,r,t,n);else for(var u=e.length-1;u>=0;u--)(a=e[u])&&(o=(i<3?a(o):i>3?a(r,t,o):a(r,t))||o);return i>3&&o&&Object.defineProperty(r,t,o),o},a=this&&this.__metadata||function(e,r){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,r)},i=this&&this.__param||function(e,r){return function(t,n){r(t,n,e)}};Object.defineProperty(r,"__esModule",{value:!0});var o=t(2),u=t(4),s=t(4),l=t(4),m=function(){function e(e){this.localeId=e.replace(/_/g,"-")}return e.prototype.format=function(e){for(var r=[],t=1;t<arguments.length;t++)r[t-1]=arguments[t];return u.format(e,r,this.localeId)},e.prototype.toString=function(e,r,t){return u.toString(e,r,t||this.localeId)},e.prototype.formatDate=function(e,r,t){return s.formatDate(e,r,t||this.localeId)},e.prototype.parseDate=function(e,r,t){return s.parseDate(e,r,t||this.localeId)},e.prototype.parseNumber=function(e,r,t){return l.parseNumber(e,t||this.localeId,r)},e.prototype.formatNumber=function(e,r,t){return l.formatNumber(e,r,t||this.localeId)},e.prototype.dateFieldName=function(e,r){return s.dateFieldName(e,r||this.localeId)},e.prototype.dateFormatNames=function(e,r){return s.dateFormatNames(r||this.localeId,e)},e.prototype.splitDateFormat=function(e,r){return s.splitDateFormat(e,r||this.localeId)},e.prototype.numberSymbols=function(e){return l.numberSymbols(e||this.localeId)},e.prototype.firstDay=function(e){return s.firstDay(e||this.localeId)},e}();m=n([o.Injectable(),i(0,o.Inject(o.LOCALE_ID)),a("design:paramtypes",[String])],m),r.CldrIntlService=m},function(e,r,t){"use strict";function n(e){var r=e.message,t=o.errorSolutions[Object.keys(o.errorSolutions).filter(function(e){return 0===r.indexOf(e)})[0]];return t?r+" "+t:r}function a(e){return function(){for(var r=[],t=0;t<arguments.length;t++)r[t]=arguments[t];try{return e.apply(null,r)}catch(e){throw e.message=n(e),e}}}Object.defineProperty(r,"__esModule",{value:!0});var i=t(5),o=t(6);r.dateFormatNames=a(i.dateFormatNames),r.dateFieldName=a(i.dateFieldName),r.firstDay=a(i.firstDay),r.format=a(i.format),r.formatDate=a(i.formatDate),r.formatNumber=a(i.formatNumber),r.load=a(i.load),r.numberSymbols=a(i.numberSymbols),r.parseDate=a(i.parseDate),r.parseNumber=a(i.parseNumber),r.splitDateFormat=a(i.splitDateFormat),r.toString=a(i.toString),r.setData=a(i.setData)},function(e,r){"use strict";function t(e,r){var t=e.split("-"),n=t[0],a=t[1],i=t[2];return ar[e]||r.indexOf(i)!==-1&&ar[n+"-"+i]||r.indexOf(a)!==-1&&ar[n+"-"+a]||ar[n]}function n(e,r){for(var t=ar.supplemental.likelySubtags,n=0;n<r.length;n++){var a=t[e+"-"+r[n]];if(a)return a}if(t[e])return t[e]}function a(e){var r;return r="string"==typeof e?i(e):e}function i(e){if(ar[e])return ar[e];var r=ar.supplemental.likelySubtags;if(r){var a=e.split("-"),i=a[0],o=a.slice(1),u=n(i,o),s=u?t(u,o):null;if(s)return s}throw nr.NoLocale.error(e)}function o(e){return mr.lastIndex=0,e.replace(cr,"$").replace(mr,"n").split(";")}function u(e){mr.lastIndex=0;var r=mr.exec(e.split(sr)[0])[0].split(lr),t=r[0],n=t.split(ur).slice(1).map(function(e){return e.length}).reverse();return n}function s(e,r){for(var t in r)t.startsWith("unitPattern")&&(e[t]=r[t].replace("{0}","n").replace("{1}","$"))}function l(e,r){var t=ar[e],n=t.numbers=t.numbers||{};n.symbols=n.symbols||{};for(var a in r)if(a===or)Object.assign(n.symbols,r[a]);else if(a.includes(ir)){var i=a.substr(0,a.indexOf(ir)),l=r[a].standard;n[i]={patterns:o(l)},"currency"===i?(n[i].groupSize=u((r["decimal"+ir]||r[a]).standard),s(n[i],r[a])):n[i].groupSize=u(l)}else"currencies"===a&&(n.currencies=r[a])}function m(e){for(var r=[],t=Object.getOwnPropertyNames(e),n=0;n<t.length;n++){var a=e[t[n]];r.push(a)}return r}function c(e,r){var t={};for(var n in e){var a=t[n]={};for(var i in e[n]){var o=e[n][i];a[i]=r?o:m(o)}}return t}function f(e){var r={},t=r.format={},n={eraAbbr:"abbreviated",eraNames:"wide",eraNarrow:"narrow"};for(var a in e){var i=n[a];t[i]=e[a]}return r}function d(e,r){var t=ar[e].calendar;t.days=c(r.days),t.months=c(r.months),t.quarters=c(r.quarters),t.dayPeriods=c(r.dayPeriods,!0),t.eras=f(r.eras)}function y(e,r){var t=ar[e].calendar,n={};for(var a in r){var i=a.split("-"),o=i[0],u=i[1];void 0===u&&(u="wide");var s=n[o]||{},l=r[a].displayName;l&&(s[u]=l,n[o]=s)}t.dateFields=n}function p(e,r){for(var t=[],n=0;n<e.length;n++){for(var a=e[n],i=r,o=0;o<a.length;o++)i=i[a[o]];t.push(i)}return t.join(" ")}function v(e,r){var t=ar[e].calendar,n=t.patterns={};for(var a in dr)n[a]=p(dr[a],r);for(var i in fr)n[i]=fr[i];var o=r.dateTimeFormats;t.dateTimeFormats={full:o.full,long:o.long,medium:o.medium,short:o.short,availableFormats:o.availableFormats},t.timeFormats=r.timeFormats,t.dateFormats=r.dateFormats}function g(e,r){var t=ar[e].calendar=ar[e].calendar||{};for(var n in r)"timeZoneNames"===n?(t.gmtFormat=r[n].gmtFormat,t.gmtZeroFormat=r[n].gmtZeroFormat):"calendars"===n&&r[n].gregorian?(v(e,r[n].gregorian),d(e,r[n].gregorian)):"fields"===n&&y(e,r.fields)}function h(e,r){var t=ar.supplemental.likelySubtags,n=e.split("-");if(t){var a=t[e]||t[n[0]];a&&(n=a.split("-"))}if(r)for(var i=n.length-1;i>=1;i--){var o=n[i];o!==r.variant&&o!==r.script||n.splice(i,1)}var u=n.length;if(u>1){var s=n[u-1];return s.toUpperCase()}}function M(e){if(e.territory)return e.territory;var r,t=e.name,n=e.identity;return r=n&&n.territory?n.territory:h(t,n),e.territory=r,r}function b(e,r){for(var t in r)"numbers"===t?l(e,r[t]):"dates"===t&&g(e,r[t])}function S(){for(var e=arguments,r=arguments.length,t=0;t<r;t++){var n=e[t];if(n.main){var a=Object.keys(n.main)[0],i=n.main[a],o=ar[a]=ar[a]||{};o.name=o.name||a,o.identity=o.identity||i.identity,M(o),b(a,i)}else n.supplemental&&(n.supplemental.weekData?ar.supplemental.weekData={firstDay:n.supplemental.weekData.firstDay}:Object.assign(ar.supplemental,n.supplemental))}}function w(e){var r=e.name,t=ar[r]=ar[r]||{};if(e.likelySubtags){var n=ar.supplemental=ar.supplemental||{};n.likelySubtags=Object.assign(n.likelySubtags||{},e.likelySubtags)}var a=t.numbers;Object.assign(t,e),a&&e.numbers&&(t.numbers=Object.assign({},a,e.numbers))}function F(e,r){void 0===r&&(r="en");var t=i(r),n=t.calendar.dateFields;if(!n)throw nr.NoDateFieldNames.error();var a=n[e.type]||{};return a[e.nameType]||a.wide}function D(e){for(var r=[],t=0;t<e.length;t++)r.push(e[t].toLowerCase());return r}function N(e){var r={};for(var t in e)r[t]=e[t].toLowerCase();return r}function x(e){var r=Array.isArray(e)?D(e):N(e);return r}function O(e,r){var t=r.type,n=r.nameType,i=r.standAlone,o=r.lower,u=a(e),s=i?"stand-alone":"format",l=(o?"lower-":"")+n,m=u.calendar[t][s],c=m[l];return!c&&o&&(c=m[l]=x(m[n])),c}function H(e){var r=e.split("-"),t=parseInt(r[0],10),n=parseInt(r[1],10)-1,a=parseInt(r[2],10);return new Date(t,n,a)}function I(e,r,t){var n=a(e),i=n.numbers.currencies;if(i){var o=i[r];if(o)return o;if(t)throw pr.error()}else if(t)throw yr.error()}function E(e,r){return r.length-e.length}function T(e){for(var r,t,n,a,i=0;i<e.length;i++){var o=e[i],u=Object.keys(o)[0],s=o[u];if(u!==Sr&&"false"!==s._tender&&s._from)if(s._to){if(!n){var l=H(s._from),m=H(s._to);(!t||t.to<m||t.from<l)&&(r=u,t={from:l,to:m})}}else{var c=H(s._from);(!a||a<c)&&(n=u,a=c)}}return n||r}function k(e,r,t){void 0===t&&(t=!0);var n=I(e,r,t);if(n){if(!n.displays){var a=[r];for(var i in n)a.push(n[i]);a.sort(E),n.displays=a}return n.displays}}function _(e,r){var t=r.value,n=r.currency,a=r.currencyDisplay;if(void 0===a&&(a=br),"code"===a)return n;var i,o=I(e,n,!0);return i=a===br?o["symbol-alt-narrow"]||o[br]:void 0===typeof t||1!==t?o["displayName-count-other"]:o["displayName-count-one"]}function P(e){var r=Mr,t=Mr,n=((ar.supplemental.currencyData||{}).fractions||{})[e];return n&&n._digits&&(t=r=parseInt(n._digits,10)),{minimumFractionDigits:r,maximumFractionDigits:t}}function j(e,r){if(void 0===r&&(r=!0),wr[e])return wr[e];var t=ar.supplemental.currencyData;if(t){var n=t.region[e];if(n){var a=T(n);return a}if(r)throw gr.error(e)}else if(r)throw vr.error()}function A(e,r){var t=a(e),n=t.numbers;if(!n.localeCurrency){var i=j(M(t),r);if(!i&&r)throw hr.error(t.name);n.localeCurrency=i}return n.localeCurrency}function C(e){var r=a(e);if(!isNaN(r.firstDay))return r.firstDay;var t=ar.supplemental.weekData;if(!t)throw Fr.error();var n=t.firstDay[M(r)]||t.firstDay[xr];if(!n)throw Dr.error();return r.firstDay=Nr.indexOf(n),r.firstDay}function z(e){var r=a(e);return r.numbers.symbols}function L(e,r){void 0===r&&(r={}),r.currency||(r.currency=A(e,!0));var t=_(e,r);return t}function R(e,r,t,n,a){var i=a.numbers.symbols,o=e.indexOf(i.decimal),u=n.groupSize.slice(),s=u.shift(),l=o!==-1?o:t+1,m=e.substring(r,l),c=e,f=m.length;if(f>=s){for(var d=f,y=[];d>-1;){var p=m.substring(d-s,d);p&&y.push(p),d-=s;var v=u.shift();if(s=void 0!==v?v:s,0===s){p=m.substring(0,d),p&&y.push(p);break}}m=y.reverse().join(i.group),c=e.substring(0,r)+m+e.substring(l)}return c}function G(e,r,t){void 0===r&&(r=2),void 0===t&&(t=!1);var n=r-String(e).length,a=e;if(n>0){var i=new Array(n+1).join("0");a=t?e+i:i+e}return a}function q(e,r){var t=e,n=r||0;return t=t.toString().split("e"),t=Math.round(Number(t[0]+"e"+(t[1]?Number(t[1])+n:n))),t=t.toString().split("e"),t=Number(t[0]+"e"+(t[1]?Number(t[1])-n:-n)),t.toFixed(Math.min(n,Or))}function Q(e){var r,t=e.minimumFractionDigits,n=e.maximumFractionDigits,a=e.style,i=a===kr;return i&&(r=P(e.currency)),void 0===t&&(t=i?r.minimumFractionDigits:0),void 0===n&&(n=a===_r?Math.max(t,Ir):i?Math.max(t,r.maximumFractionDigits):Math.max(t,Hr)),{minimumFractionDigits:t,maximumFractionDigits:n}}function X(e,r,t){for(var n=Pr,a=0,i=r.length;a<i;a++){var o=r.charAt(a);n+=o===Tr?e:"$"===o||"%"===o?t:o}return n}function Z(e,r){var t=e.numbers.currency,n=1!==r?t["unitPattern-count-other"]:t["unitPattern-count-one"];return r<0&&(n=n.replace("n","-n")),n}function U(e,r,t){var n=t.numbers.symbols,a=r.style;if("scientific"===a){var i=void 0!==r.minimumFractionDigits?e.toExponential(r.minimumFractionDigits):e.toExponential();return i.replace(jr,n.decimal)}var o,u=e;a===kr&&(r.value=u,o=L(t,r)),a===_r&&(u*=100,o=n.percentSign);var s=Q(r),l=s.minimumFractionDigits,m=s.maximumFractionDigits;u=q(u,m);var c=u<0,f=u.split("."),d=f[0],y=G(f[1]?f[1].replace(Er,Pr):Pr,l,!0);c&&(d=d.substring(1)),r.minimumIntegerDigits&&(d=G(d,r.minimumIntegerDigits));var p=r.useGrouping!==!1?R(d,0,d.length,r,t):d;y&&(p+=n.decimal+y);var v;if(a===kr&&"name"===r.currencyDisplay)v=Z(t,e);else{var g=r.patterns;v=c?g[1]||"-"+g[0]:g[0]}if(v===Tr&&!c)return p;var h=X(p,v,o);return h}function $(e){var r=e.format;if(r.indexOf("'")>-1||r.indexOf('"')>-1||r.indexOf("\\")>-1){var t=e.literals=[];e.format=r.replace(Ur,function(e){var r=e.charAt(0).replace("\\",""),n=e.slice(1).replace(r,"");return t.push(n),zr})}}function J(e,r){var t;return t=0===r?$r:new RegExp("(\\.[0-9]{"+r+"}[1-9]*)0+$","g"),e.replace(t,"$1").replace(Jr,"")}function W(e){var r=e.number,t=e.format,n=t.indexOf(Gr);if(n!==-1){var a=t.lastIndexOf(Xr)-n,i=t.lastIndexOf(Qr)-n,o=a>-1,u=i>-1,s=r.toString().split("e");s=s[1]?q(r,Math.abs(s[1])):s[0],s=s.split(Gr)[1]||Zr;var l=s.length,m=-1;o||u?o&&a>i?l=a:i>a&&(u&&l>i?l=i:o&&l<a&&(l=a),m=o?a:0):(e.format=t.substring(0,n)+t.substring(n+1),n=-1,l=0),l>-1&&(r=q(r,l),m>-1&&(r=J(r,m)))}else r=q(r);e.negative&&r*-1>=0&&(e.negative=!1),e.number=r,e.decimalIndex=n}function B(e){return e.indexOf(Qr)===-1&&e.indexOf(Xr)===-1}function Y(e){var r=e.number,t=e.format;if(t=t.split(";"),e.negative&&t[1])t=t[1],e.hasNegativeFormat=!0;else if(0===r){var n=t[2];t=n||t[0],n&&B(n)&&(e.constant=n)}else t=t[0];e.format=t}function V(e,r){var t=e.format;t.indexOf(Cr)!==-1&&(e.style=Rr,e.symbol=r.numbers.symbols.percentSign,e.number*=100),t.indexOf(Ar)!==-1&&(e.style=Lr,e.symbol=L(r))}function K(e){e.hasGroup=e.format.indexOf(qr)>-1,e.hasGroup&&(e.format=e.format.replace(Wr,Zr))}function ee(e,r,t){var n;return n=e===-1&&r!==-1?r:e!==-1&&r===-1?e:t?Math.min(e,r):Math.max(e,r)}function re(e){var r=e.format,t=r.indexOf(Qr),n=r.indexOf(Xr),a=ee(t,n,!0);t=r.lastIndexOf(Qr),n=r.lastIndexOf(Xr);var i=ee(t,n);a===r.length&&(i=a),e.start=a,e.end=i,e.lastZeroIndex=n}function te(e,r,t){var n=e;if(r===Lr||r===Rr){n=Zr;for(var a=0,i=e.length;a<i;a++){var o=e.charAt(a);n+=o===Ar||o===Cr?t:o}}return n}function ne(e,r){var t=e;if(r)for(var n=r.length,a=0;a<n;a++)t=t.replace(zr,r[a]);return t}function ae(e,r){var t=e.start,n=e.end,a=e.negative,i=e.format,o=e.decimalIndex,u=e.lastZeroIndex,s=e.hasNegativeFormat,l=e.hasGroup,m=e.number,c=m.toString().split(Gr),f=i.length,d=c[0],y=c[1]||Zr,p=d.length,v=Zr;m=i.substring(0,t),a&&!s&&(m+="-");for(var g=t;g<f;g++){var h=i.charAt(g);if(o===-1){if(n-g<p){m+=d;break}}else if(u!==-1&&u<g&&(v=Zr),o-g<=p&&o-g>-1&&(m+=d,g=o),o===g){m+=(y?r.numbers.symbols.decimal:Zr)+y,g+=n-o+1;continue}h===Xr?(m+=h,v=h):h===Qr&&(m+=v)}return l&&(m=R(m,t+(a&&!s?1:0),Math.max(n,p+t),r.numbers.decimal,r)),n>=t&&(m+=i.substring(n+1)),m}function ie(e,r){var t=e.number;return e.start!==-1&&(t=ae(e,r),t=te(t,e.style,e.symbol),t=ne(t,e.literals)),t}function oe(e,r,t){var n={negative:e<0,number:Math.abs(e),format:r};return Y(n),n.constant?n.constant:($(n),V(n,t),K(n),W(n),re(n),ie(n,t))}function ue(e){var r=Br.exec(e);if(r){var t={style:"decimal"},n=r[1].toLowerCase();return"c"===n&&(t.style="currency"),"p"===n&&(t.style="percent"),"e"===n&&(t.style="scientific"),r[2]&&(t.minimumFractionDigits=t.maximumFractionDigits=parseInt(r[2],10)),t}}function se(e){var r;return r="string"==typeof e?ue(e):e}function le(e,r,t){if(void 0===r&&(r="n"),void 0===t&&(t="en"),void 0===e||null===e)return"";if(!isFinite(e))return e;var n,a=i(t),o=se(r);if(o){var u=(o||{}).style||"decimal";n=U(e,Object.assign({},a.numbers[u],o),a)}else n=oe(e,r,a);return n}function me(e,r,t){var n,a="currency"===t.style,i=e,o=t.currency||A(r,a);if(o){var u=k(r,o,a);if(u)for(var s=0;s<u.length;s++){var l=u[s];if(i.includes(l)){i=i.replace(l,""),a=!0;break}}if(a){var m=r.numbers.currency.patterns;if(m.length>1){var c=(m[1]||"").replace("$","").split("n");i.indexOf(c[0])>-1&&i.indexOf(c[1])>-1&&(i=i.replace(c[0],"").replace(c[1],""),n=!0)}}}return{number:i,negative:n}}function ce(e,r,t){if(void 0===r&&(r="en"),void 0===t&&(t={}),!e&&0!==e)return null;if("number"==typeof e)return e;var n,a=i(r),o=a.numbers.symbols,u=e.toString();if(Yr.test(u))return u=parseFloat(u.replace(o.decimal,".")),isNaN(u)?null:u;var s=u.indexOf("-");if(s>0)return null;var l=s>-1,m=me(u,a,t),c=m.negative,f=m.number;return u=f,l=void 0!==c?c:l,("percent"===t.style||u.indexOf(o.percentSign)>-1)&&(u=u.replace(o.percentSign,""),n=!0),u=u.replace("-","").replace(Vr," ").split(o.group.replace(Vr," ")).join("").replace(o.decimal,"."),u=parseFloat(u),isNaN(u)?u=null:l&&(u*=-1),u&&n&&(u/=100),u}function fe(e){var r=arguments;return e.replace(Kr,function(e,t){var n=r[parseInt(t,10)+1];return n})}function de(e){return e.hour12?"h":"H"}function ye(e){return ct[e]||(ct[e]=new RegExp(e+"+")),ct[e]}function pe(e){for(var r=[],t=e.charAt(0),n=t,a=1;a<e.length;a++){var i=e.charAt(a);i===n?t+=i:(r.push(t),t=n=i)}return r.push(t),r}function ve(e,r){var t,n,a=e.length,i=-Number.MAX_VALUE;for(var o in r){for(var u=[],s=o.replace("v","z"),l=0,m=0;m<a;m++){var c=e[m],f=ye(c[0]),d=(f.exec(s)||[])[0];if(d){if(s=s.replace(d,""),d.length!==c.length){var y=Math.max(Math.min(tt[d.length]-tt[c.length],2),-2);l-=ut[y]}}else l-=et;if(u.push(d),l<i)break}s.length&&(l-=pe(s).length*rt),l>i&&(i=l,t=u,n=r[o])}n=n.replace("v","z");for(var p=0;p<a;p++)t[p]&&t[p]!==e[p]&&(n=n.replace(ye(t[p][0]),e[p]));return n}function ge(e,r,t){ft[t]||(ft[t]={}),ft[t][e]=r}function he(e,r){var t=r.calendar.dateTimeFormats.availableFormats;if(t[e])return t[e];if(ft[r.name]&&ft[r.name][e])return ft[r.name][e];var n,a=e.search(lt);if(a>0){var i=e.substr(0,a),o=e.substr(a);n=fe(r.calendar.dateTimeFormats.short,t[o]||ve(pe(o),t),t[i]||ve(pe(i),t))}else n=ve(pe(e),t);return ge(e,n,r.name),n}function Me(e){for(var r=[],t=0;t<mt.length;t++){var n=mt[t],a=n.key,i=e[a];if(i){var o=n.specifier||n.getSpecifier(e);r.push(o.repeat(st[i]))}}return r.join("")}function be(e,r){var t,n=r.calendar;if("string"==typeof e)t=n.patterns[e]?n.patterns[e]:e;else if(e){if(e.pattern)return e.pattern;var a=e.skeleton;a||(e.datetime?t=fe(n.dateTimeFormats[e.datetime],n.timeFormats[e.datetime],n.dateFormats[e.datetime]):e.date?t=n.dateFormats[e.date]:e.time?t=n.timeFormats[e.time]:a=Me(e)),a&&(t=he(a,r))}return t||(t=n.patterns.d),t}function Se(e){var r;return e<=3?r="abbreviated":4===e?r="wide":5===e?r="narrow":6===e&&(r="short"),r}function we(e,r,t,n,a){return O(e,{type:r,nameType:Se(t),standAlone:n,lower:a})}function Fe(e){return dt.call(e)===yt}function De(e,r,t){var n,a=C(t);return n=e<a?7-a+e:e-a,n+1}function Ne(e,r,t,n){return r<=2?G(e+1,r):we(t,"months",r,n)[e]}function xe(e,r,t,n){var a=Math.floor(e.getMonth()/3);return r<3?a+1:we(t,"quarters",r,n)[a]}function Oe(e,r,t){var n=t.shortHours,a=t.optionalMinutes,i=t.separator,o=t.localizedName,u=t.zZeroOffset,s=e.getTimezoneOffset()/60;if(0===s&&u)return"Z";var l=s<=0?"+":"-",m=Math.abs(s).toString().split("."),c=m[1]||0,f=l+(n?m[0]:G(m[0],2));if(!c&&a||(f+=(i?":":"")+G(c,2)),o){var d=0===s?r.calendar.gmtZeroFormat:r.calendar.gmtFormat;f=fe(d,f)}return f}function He(e,r,t,n){var a;return a=r<3?De(e.getDay(),r,t):we(t,"days",r,n)[e.getDay()]}function Ie(e,r,t){if(void 0===t&&(t="en"),!Fe(e))return void 0===e||null===e?"":e;var n=i(t),a=be(r,n);return a.replace(St,function(r){var t,a=r.length;return t=r.includes("'")||r.includes('"')?r.slice(1,a-1):wt[r[0]](e,a,n)})}function Ee(e,r,t){var n=e.getTimezoneOffset(),a=new Date(e.getTime()+6e4*(r-t)),i=a.getTimezoneOffset();return new Date(a.getTime()+6e4*(i-n))}function Te(e,r){r||23!==e.getHours()||e.setHours(e.getHours()+2)}function ke(e,r,t){return!(e>=r&&e<=t)}function _e(e,r){for(var t=r.format,n=r.idx,a=0;t[n]===e;)a++,n++;return a>0&&(n-=1),r.idx=n,a}function Pe(e,r){var t=e?xt[e]||new RegExp("^\\d{1,"+e+"}"):Ot,n=r.value.substr(r.valueIdx,e).match(t);return n?(n=n[0],r.valueIdx+=n.length,parseInt(n,10)):null}function je(e,r,t){for(var n,a,i,o=0,u=e.length,s=0,l=0;o<u;o++)n=e[o],a=n.length,i=r.value.substr(r.valueIdx,a),t&&(i=i.toLowerCase()),i===n&&a>s&&(s=a,l=o);return s?(r.valueIdx+=s,l+1):null}function Ae(e){var r=!1;return e.value.charAt(e.valueIdx)===e.format[e.idx]&&(e.valueIdx++,r=!0),r}function Ce(e){var r=e.gmtFormat,t=e.gmtZeroFormat;if(!r)throw nr.NoGMTInfo.error();return[r.replace(Ht,"").toLowerCase(),t.replace(Ht,"").toLowerCase()]}function ze(e,r,t){var n=t.shortHours,a=t.noSeparator,i=t.optionalMinutes,o=t.localizedName,u=t.zLiteral;if(e.UTC=!0,u&&"Z"===e.value.charAt(e.valueIdx))return e.valueIdx++,!1;if(o&&!je(Ce(r.calendar),e,!0))return!0;var s=Ft.exec(e.value.substr(e.valueIdx,6));if(!s)return!o;var l=s[1],m=s[3],c=parseInt(l,10),f=s[2],d=parseInt(m,10);return!!(isNaN(c)||!n&&3!==l.length||!i&&isNaN(d)||a&&f)||(isNaN(d)&&(d=null),!!(ke(c,-12,13)||d&&ke(d,0,59))||(e.valueIdx+=s[0].length,e.hoursOffset=c,void(e.minutesOffset=d)))}function Le(e,r,t){var n=_e(e,r),a=we(t,"months",n,"L"===e,!0),i=n<3?Pe(2,r):je(a,r,!0);return!(null!==i&&!ke(i,1,12))||void(r.month=i-1)}function Re(e,r,t){var n=_e(e,r),a=we(t,"days",n,"c"===e,!0),i=n<3?Pe(1,r):je(a,r,!0);if(!i&&0!==i||ke(i,1,7))return!0}function Ge(e){var r,t=e.year,n=e.month,a=e.day,i=e.hours,o=e.minutes,u=e.seconds,s=e.milliseconds,l=e.pmHour,m=e.UTC,c=e.hoursOffset,f=e.minutesOffset,d=null!==i||null!==o||u||null,y=new Date;return null===t&&null===n&&null===a&&d?(t=y.getFullYear(),n=y.getMonth(),a=y.getDate()):(null===t&&(t=y.getFullYear()),null===a&&(a=1)),l&&i<12&&(i+=12),m?(c&&(i+=-c),f&&(o+=-f*(c<0?-1:1)),r=new Date(Date.UTC(t,n,a,i,o,u,s))):(r=new Date(t,n,a,i,o,u,s),Te(r,i)),t<100&&r.setFullYear(t),r.getDate()!==a&&void 0===m?null:r}function qe(e,r,t){for(var n=be(r,t).split(""),a={format:n,idx:0,value:e,valueIdx:0,year:null,month:null,day:null,hours:null,minutes:null,seconds:null,milliseconds:null},i=n.length,o=!1;a.idx<i;a.idx++){var u=n[a.idx];if(o)"'"===u&&(o=!1),Ae(a);else if(kt[u]){var s=kt[u](a,t);if(s)return null}else if("'"===u)o=!0,Ae(a);else if(!Ae(a))return null}return a.valueIdx<e.length?null:Ge(a)||null}function Qe(e){var r="-"===e.substr(0,1)?-1:1,t=e.substring(1);return t=60*parseInt(t.substr(0,2),10)+parseInt(t.substring(2),10),r*t}function Xe(e){if(e&&0===e.indexOf("/D")){var r=Dt.exec(e);if(r){r=r[1];var t=Nt.exec(r.substring(1));return r=new Date(parseInt(r,10)),t&&(t=Qe(t[0]),r=Ee(r,r.getTimezoneOffset(),0),r=Ee(r,0,-1*t)),r}}}function Ze(e){for(var r=[],t=e.patterns,n=Et.length,a=0;a<n;a++)r.push(t[Et[a]]);return r.concat(It)}function Ue(e,r,t){if(void 0===t&&(t="en"),!e)return null;if(Fe(e))return e;var n=String(e).trim(),a=Xe(n);if(a)return a;var o=i(t),u=r||Ze(o.calendar);u=Array.isArray(u)?u:[u];for(var s=u.length,l=0;l<s;l++)if(a=qe(n,u[l],o))return a;return a}function $e(e,r){var t=e[e.length-1];t&&t.type===Pt?t.pattern+=r:e.push({type:Pt,pattern:r})}function Je(e,r){void 0===r&&(r="en");for(var t=i(r),n=be(e,t),a=[],o=St.lastIndex=0,u=St.exec(n);u;){var s=u[0];if(o<u.index&&$e(a,n.substring(o,u.index)),s.startsWith('"')||s.startsWith("'"))$e(a,s);else{var l=s[0],m=bt[l],c={type:m,pattern:s},f=_t[m];if(f){var d=typeof f.minLength===jt?f.minLength:f.minLength[l],y=s.length;y>=d&&(c.names={type:f.type,nameType:Se(y),standAlone:f.standAlone===l})}a.push(c)}o=St.lastIndex,u=St.exec(n)}return o<n.length&&$e(a,n.substring(o)),a}function We(e,r,t){if(r){if(Fe(e))return Ie(e,r,t);if("number"==typeof e)return le(e,r,t)}return void 0!==e&&null!==e?e:""}function Be(e,r,t){return e.replace(At,function(e,n,a){var i=r[parseInt(n,10)];return We(i,a?a.substring(1):"",t)})}Object.defineProperty(r,"__esModule",{value:!0});var Ye={en:{name:"en",identity:{version:{_number:"$Revision: 12418 $",_cldrVersion:"29"},language:"en"},territory:"US",numbers:{symbols:{decimal:".",group:",",list:";",percentSign:"%",plusSign:"+",minusSign:"-",exponential:"E",superscriptingExponent:"×",perMille:"‰",infinity:"∞",nan:"NaN",timeSeparator:":"},decimal:{patterns:["n"],groupSize:[3]},scientific:{patterns:["nEn"],groupSize:[]},percent:{patterns:["n%"],groupSize:[3]},currency:{patterns:["$n"],groupSize:[3],"unitPattern-count-one":"n $","unitPattern-count-other":"n $"},currencies:{BGN:{displayName:"Bulgarian Lev","displayName-count-one":"Bulgarian lev","displayName-count-other":"Bulgarian leva",symbol:"BGN"},EUR:{displayName:"Euro","displayName-count-one":"euro","displayName-count-other":"euros",symbol:"€","symbol-alt-narrow":"€"},USD:{displayName:"US Dollar","displayName-count-one":"US dollar","displayName-count-other":"US dollars",symbol:"$","symbol-alt-narrow":"$"}},localeCurrency:"USD"},calendar:{gmtFormat:"GMT{0}",gmtZeroFormat:"GMT",patterns:{d:"M/d/y",D:"EEEE, MMMM d, y",m:"MMM d",M:"MMMM d",y:"MMM y",Y:"MMMM y",F:"EEEE, MMMM d, y h:mm:ss a",g:"M/d/y h:mm a",G:"M/d/y h:mm:ss a",t:"h:mm a",T:"h:mm:ss a",s:"yyyy'-'MM'-'dd'T'HH':'mm':'ss",u:"yyyy'-'MM'-'dd HH':'mm':'ss'Z'"},dateTimeFormats:{full:"{1} 'at' {0}",long:"{1} 'at' {0}",medium:"{1}, {0}",short:"{1}, {0}",availableFormats:{d:"d",E:"ccc",Ed:"d E",Ehm:"E h:mm a",EHm:"E HH:mm",Ehms:"E h:mm:ss a",EHms:"E HH:mm:ss",Gy:"y G",GyMMM:"MMM y G",GyMMMd:"MMM d, y G",GyMMMEd:"E, MMM d, y G",h:"h a",H:"HH",hm:"h:mm a",Hm:"HH:mm",hms:"h:mm:ss a",Hms:"HH:mm:ss",hmsv:"h:mm:ss a v",Hmsv:"HH:mm:ss v",hmv:"h:mm a v",Hmv:"HH:mm v",M:"L",Md:"M/d",MEd:"E, M/d",MMM:"LLL",MMMd:"MMM d",MMMEd:"E, MMM d",MMMMd:"MMMM d","MMMMW-count-one":"'week' W 'of' MMMM","MMMMW-count-other":"'week' W 'of' MMMM",ms:"mm:ss",y:"y",yM:"M/y",yMd:"M/d/y",yMEd:"E, M/d/y",yMMM:"MMM y",yMMMd:"MMM d, y",yMMMEd:"E, MMM d, y",yMMMM:"MMMM y",yQQQ:"QQQ y",yQQQQ:"QQQQ y","yw-count-one":"'week' w 'of' y","yw-count-other":"'week' w 'of' y"}},timeFormats:{full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},dateFormats:{full:"EEEE, MMMM d, y",long:"MMMM d, y",medium:"MMM d, y",short:"M/d/yy"},days:{format:{abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},"stand-alone":{abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]}},months:{format:{abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},"stand-alone":{abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]}},quarters:{format:{abbreviated:["Q1","Q2","Q3","Q4"],narrow:["1","2","3","4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},"stand-alone":{abbreviated:["Q1","Q2","Q3","Q4"],narrow:["1","2","3","4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]}},dayPeriods:{format:{abbreviated:{midnight:"midnight",am:"AM","am-alt-variant":"am",noon:"noon",pm:"PM","pm-alt-variant":"pm",morning1:"in the morning",afternoon1:"in the afternoon",evening1:"in the evening",night1:"at night"},narrow:{midnight:"mi",am:"a","am-alt-variant":"am",noon:"n",pm:"p","pm-alt-variant":"pm",morning1:"in the morning",afternoon1:"in the afternoon",evening1:"in the evening",night1:"at night"},wide:{midnight:"midnight",am:"AM","am-alt-variant":"am",noon:"noon",pm:"PM","pm-alt-variant":"pm",morning1:"in the morning",afternoon1:"in the afternoon",evening1:"in the evening",night1:"at night"}},"stand-alone":{abbreviated:{midnight:"midnight",am:"AM","am-alt-variant":"am",noon:"noon",pm:"PM","pm-alt-variant":"pm",morning1:"morning",afternoon1:"afternoon",evening1:"evening",night1:"night"},narrow:{midnight:"midnight",am:"AM","am-alt-variant":"am",noon:"noon",pm:"PM","pm-alt-variant":"pm",morning1:"morning",afternoon1:"afternoon",evening1:"evening",night1:"night"},wide:{midnight:"midnight",am:"AM","am-alt-variant":"am",noon:"noon",pm:"PM","pm-alt-variant":"pm",morning1:"morning",afternoon1:"afternoon",evening1:"evening",night1:"night"}}},eras:{format:{wide:{0:"Before Christ",1:"Anno Domini","0-alt-variant":"Before Common Era","1-alt-variant":"Common Era"},abbreviated:{0:"BC",1:"AD","0-alt-variant":"BCE","1-alt-variant":"CE"},narrow:{0:"B",1:"A","0-alt-variant":"BCE","1-alt-variant":"CE"}}},dateFields:{era:{wide:"era"},year:{wide:"year",short:"yr.",narrow:"yr."},quarter:{wide:"quarter",short:"qtr.",narrow:"qtr."},month:{wide:"month",short:"mo.",narrow:"mo."},week:{wide:"week",short:"wk.",narrow:"wk."},day:{wide:"day",short:"day",narrow:"day"},weekday:{wide:"day of the week"},dayperiod:{wide:"AM/PM"},hour:{wide:"hour",short:"hr.",narrow:"hr."},minute:{wide:"minute",short:"min.",narrow:"min."},second:{wide:"second",short:"sec.",narrow:"sec."},zone:{wide:"time zone"}}}},supplemental:{likelySubtags:{en:"en-Latn-US"},currencyData:{region:{US:[{USD:{_from:"1792-01-01"}}]}},weekData:{firstDay:{US:"sun"}}}},Ve={NoLocale:"Missing locale info for '{0}'",NoCurrency:"Cannot determine currency information. Please load the locale currencies data.",NoSupplementalCurrency:"Cannot determine currency. Please load the supplemental currencyData.",NoCurrencyRegion:"No currency data for region '{0}'",NoCurrencyDisplay:"Cannot determine currency display information. Please load the locale currencies data. The default culture does not include the all currencies data.",NoGMTInfo:"Cannot determine locale GMT format. Please load the locale timeZoneNames data.",NoWeekData:"Cannot determine locale first day of week. Please load the supplemental weekData.",NoFirstDay:"Cannot determine locale first day of week. Please load the supplemental weekData. The default culture includes only the 'en-US' first day info.",NoValidCurrency:"Cannot determine a default currency for the {0} locale. Please specify explicitly the currency with the format options.",NoDateFieldNames:"Cannot determine the locale date field names. Please load the locale dateFields data."},Ke=/\{(\d+)}?\}/g,er=function(e){var r=e.name,t=e.message;if(!r||!t)throw new Error("{ name: string, message: string } object is required!");this.name=r,this.message=t};er.prototype.formatMessage=function(){for(var e=[],r=arguments.length;r--;)e[r]=arguments[r];var t=rr(e),n=this.message.replace(Ke,function(e,r){return t[parseInt(r,10)]});return this.name+": "+n},er.prototype.error=function(){for(var e=[],r=arguments.length;r--;)e[r]=arguments[r];return new Error(this.formatMessage(e))};var rr=function(e){return e.reduce(function(e,r){return e.concat(r)},[])},tr=function(e){var r=function(r,t){return r[t]=new er({name:t,message:e[t]}),r};return Object.keys(e).reduce(r,{})},nr=tr(Ve),ar=Ye,ir="Formats-numberSystem-latn",or="symbols-numberSystem-latn",ur=",",sr=";",lr=".",mr=/([ #,0. ]+)/g,cr=/¤/g,fr={s:"yyyy'-'MM'-'dd'T'HH':'mm':'ss",u:"yyyy'-'MM'-'dd HH':'mm':'ss'Z'"},dr={d:[["dateTimeFormats","availableFormats","yMd"]],D:[["dateFormats","full"]],m:[["dateTimeFormats","availableFormats","MMMd"]],M:[["dateTimeFormats","availableFormats","MMMMd"]],y:[["dateTimeFormats","availableFormats","yMMM"]],Y:[["dateTimeFormats","availableFormats","yMMMM"]],F:[["dateFormats","full"],["timeFormats","medium"]],g:[["dateTimeFormats","availableFormats","yMd"],["timeFormats","short"]],G:[["dateTimeFormats","availableFormats","yMd"],["timeFormats","medium"]],t:[["timeFormats","short"]],T:[["timeFormats","medium"]]},yr=nr.NoCurrency,pr=nr.NoCurrencyDisplay,vr=nr.NoSupplementalCurrency,gr=nr.NoCurrencyRegion,hr=nr.NoValidCurrency,Mr=2,br="symbol",Sr="XXX",wr={"001":"USD",150:"EUR"},Fr=nr.NoWeekData,Dr=nr.NoFirstDay,Nr=["sun","mon","tue","wed","thu","fri","sat"],xr="001",Or=20,Hr=3,Ir=0,Er=/0+$/,Tr="n",kr="currency",_r="percent",Pr="",jr=".",Ar="$",Cr="%",zr="__??__",Lr="currency",Rr="percent",Gr=".",qr=",",Qr="#",Xr="0",Zr="",Ur=/(\\.)|(['][^']*[']?)|(["][^"]*["]?)/g,$r=/(\.(?:[0-9]*[1-9])?)0+$/g,Jr=/\.$/,Wr=/\,/g,Br=/^(n|c|p|e)(\d*)$/i,Yr=/[eE][\-+]?[0-9]+/,Vr=/\u00A0/g,Kr=/\{(\d+)}/g,et=120,rt=20,tt=[2,1,5,3,4],nt=-2,at=-1,it=1,ot=2,ut={};ut[nt]=8,ut[at]=6,ut[ot]=6,ut[it]=3;var st={numeric:1,"2-digit":2,short:3,long:4,narrow:5},lt=/[hHmsSzZoOvVxX]/,mt=[{key:"era",specifier:"G"},{key:"year",specifier:"y"},{key:"month",specifier:"M"
},{key:"day",specifier:"d"},{key:"weekday",specifier:"E"},{key:"hour",getSpecifier:de},{key:"minute",specifier:"m"},{key:"second",specifier:"s"},{key:"timeZoneName",specifier:"z"}],ct={},ft={},dt={}.toString,yt="[object Date]",pt="month",vt="hour",gt="zone",ht="weekday",Mt="quarter",bt={G:"era",y:"year",q:Mt,Q:Mt,M:pt,L:pt,d:"day",E:ht,c:ht,e:ht,h:vt,H:vt,m:"minute",s:"second",a:"dayperiod",x:gt,X:gt,z:gt,Z:gt},St=/d{1,2}|E{1,6}|e{1,6}|c{3,6}|c{1}|M{1,5}|L{1,5}|y{1,4}|H{1,2}|h{1,2}|m{1,2}|a{1,5}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|x{1,5}|X{1,5}|G{1,5}|q{1,5}|Q{1,5}|"[^"]*"|'[^']*'/g,wt={};wt.d=function(e,r){return G(e.getDate(),r)},wt.E=function(e,r,t){return we(t,"days",r)[e.getDay()]},wt.M=function(e,r,t){return Ne(e.getMonth(),r,t,!1)},wt.L=function(e,r,t){return Ne(e.getMonth(),r,t,!0)},wt.y=function(e,r){var t=e.getFullYear();return 2===r&&(t%=100),G(t,r)},wt.h=function(e,r){var t=e.getHours()%12||12;return G(t,r)},wt.H=function(e,r){return G(e.getHours(),r)},wt.m=function(e,r){return G(e.getMinutes(),r)},wt.s=function(e,r){return G(e.getSeconds(),r)},wt.S=function(e,r){var t,n=e.getMilliseconds();return t=0!==n?String(e.getMilliseconds()/1e3).split(".")[1].substr(0,r):G("",r)},wt.a=function(e,r,t){return we(t,"dayPeriods",r)[e.getHours()<12?"am":"pm"]},wt.z=function(e,r,t){return Oe(e,t,{shortHours:r<4,optionalMinutes:r<4,separator:!0,localizedName:!0})},wt.Z=function(e,r,t){return Oe(e,t,{separator:r>3,localizedName:4===r,zZeroOffset:5===r})},wt.x=function(e,r,t){return Oe(e,t,{optionalMinutes:1===r,separator:3===r||5===r})},wt.X=function(e,r,t){return Oe(e,t,{optionalMinutes:1===r,separator:3===r||5===r,zZeroOffset:!0})},wt.G=function(e,r,t){var n=e.getFullYear()>=0?1:0;return we(t,"eras",r)[n]},wt.e=He,wt.c=function(e,r,t){return He(e,r,t,!0)},wt.q=function(e,r,t){return xe(e,r,t,!0)},wt.Q=xe;var Ft=/([+|\-]\d{1,2})(:?)(\d{2})?/,Dt=/^\/Date\((.*?)\)\/$/,Nt=/[+-]\d*/,xt={2:/^\d{1,2}/,3:/^\d{1,3}/,4:/^\d{4}/},Ot=/\d+/,Ht="{0}",It=["yyyy/MM/dd HH:mm:ss","yyyy/MM/dd HH:mm","yyyy/MM/dd","E MMM dd yyyy HH:mm:ss","yyyy-MM-ddTHH:mm:ss.SSSSSSSXXX","yyyy-MM-ddTHH:mm:ss.SSSXXX","yyyy-MM-ddTHH:mm:ssXXX","yyyy-MM-ddTHH:mm:ss.SSSSSSS","yyyy-MM-ddTHH:mm:ss.SSS","yyyy-MM-ddTHH:mmXXX","yyyy-MM-ddTHH:mmX","yyyy-MM-ddTHH:mm:ss","yyyy-MM-ddTHH:mm","yyyy-MM-dd HH:mm:ss","yyyy-MM-dd HH:mm","yyyy-MM-dd","HH:mm:ss","HH:mm"],Et=["G","g","F","Y","y","M","m","D","d","y","T","t"],Tt=2029,kt={};kt.d=function(e){_e("d",e);var r=Pe(2,e);return!(null!==r&&!ke(r,1,31))||void(null===e.day&&(e.day=r))},kt.E=function(e,r){var t=_e("E",e),n=je(we(r,"days",t,!1,!0),e,!0);if(null===n)return!0},kt.M=function(e,r){return Le("M",e,r)},kt.L=function(e,r){return Le("L",e,r)},kt.y=function(e){var r=_e("y",e),t=Pe(1===r?void 0:r,e);if(null===t)return!0;if(2===r){var n=(new Date).getFullYear();t=n-n%100+t,t>Tt&&(t-=100)}e.year=t},kt.h=function(e){_e("h",e);var r=Pe(2,e);return 12===r&&(r=0),!(null!==r&&!ke(r,0,11))||void(e.hours=r)},kt.a=function(e,r){var t=_e("a",e),n=we(r,"dayPeriods",t,!1,!0),a=je([n.pm],e,!0);return!a&&!je([n.am],e,!0)||void(e.pmHour=a)},kt.H=function(e){_e("H",e);var r=Pe(2,e);return!(null!==r&&!ke(r,0,23))||void(e.hours=r)},kt.m=function(e){_e("m",e);var r=Pe(2,e);return!(null!==r&&!ke(r,0,59))||void(e.minutes=r)},kt.s=function(e){_e("s",e);var r=Pe(2,e);return!(null!==r&&!ke(r,0,59))||void(e.seconds=r)},kt.S=function(e){var r=_e("S",e),t=e.value.substr(e.valueIdx,r),n=null;return isNaN(parseInt(t,10))||(n=parseFloat("0."+t,10),n=q(n,3),n*=1e3,e.valueIdx+=r),!(null!==n&&!ke(n,0,999))||void(e.milliseconds=n)},kt.z=function(e,r){var t=_e("z",e),n=t<4,a=ze(e,r,{shortHours:n,optionalMinutes:n,localizedName:!0});if(a)return a},kt.Z=function(e,r){var t=_e("Z",e),n=ze(e,r,{noSeparator:t<4,zLiteral:5===t,localizedName:4===t});if(n)return n},kt.x=function(e,r){var t=_e("x",e),n=ze(e,r,{noSeparator:3!==t&&5!==t,optionalMinutes:1===t});if(n)return n},kt.X=function(e,r){var t=_e("X",e),n=ze(e,r,{noSeparator:3!==t&&5!==t,optionalMinutes:1===t,zLiteral:!0});if(n)return n},kt.G=function(e,r){var t=_e("G",e),n=we(r,"eras",t,!1,!0),a=je([n[0],n[1]],e,!0);if(null===a)return!0},kt.e=function(e,r){return Re("e",e,r)},kt.c=function(e,r){return Re("c",e,r)};var _t={month:{type:"months",minLength:3,standAlone:"L"},quarter:{type:"quarters",minLength:3,standAlone:"q"},weekday:{type:"days",minLength:{E:0,c:3,e:3},standAlone:"c"},dayperiod:{type:"dayPeriods",minLength:0},era:{type:"eras",minLength:0}},Pt="literal",jt="number",At=/\{(\d+)(:[^\}]+)?\}/g;r.formatNumber=le,r.parseNumber=ce,r.formatDate=Ie,r.parseDate=Ue,r.splitDateFormat=Je,r.load=S,r.setData=w,r.dateFieldName=F,r.dateFormatNames=O,r.cldr=ar,r.localeInfo=i,r.currencyDisplays=k,r.currencyDisplay=_,r.currencyFractionOptions=P,r.territoryCurrencyCode=j,r.localeCurrency=A,r.firstDay=C,r.numberSymbols=z,r.toString=We,r.format=Be,r.errors=nr,r.IntlError=er,r.toIntlErrors=tr},function(e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t="http://www.telerik.com/kendo-angular-ui/components/internationalization/troubleshooting/";r.errorSolutions={NoCurrencyDisplay:"Solution: "+t+"#toc-insufficient-default-locale",NoLocale:"Solution: "+t+"#toc-missing-cldr-info"}},function(e,r,t){"use strict";var n=this&&this.__decorate||function(e,r,t,n){var a,i=arguments.length,o=i<3?r:null===n?n=Object.getOwnPropertyDescriptor(r,t):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,r,t,n);else for(var u=e.length-1;u>=0;u--)(a=e[u])&&(o=(i<3?a(o):i>3?a(r,t,o):a(r,t))||o);return i>3&&o&&Object.defineProperty(r,t,o),o},a=this&&this.__metadata||function(e,r){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,r)};Object.defineProperty(r,"__esModule",{value:!0});var i=t(2),o=t(1),u=function(e){return!isNaN(e-parseFloat(e))},s=function(){function e(e){this.intlService=e}return e.prototype.transform=function(e,r){return void 0===r&&(r=""),e=this.normalize(e),e?this.intlService.formatDate(e,r):e},e.prototype.normalize=function(e){return e&&"string"==typeof e?e=this.intlService.parseDate(e):e&&u(e)&&(e=new Date(parseFloat(e))),e},e}();s=n([i.Pipe({name:"kendoDate"}),a("design:paramtypes",[o.IntlService])],s),r.DatePipe=s},function(e,r,t){"use strict";var n=this&&this.__decorate||function(e,r,t,n){var a,i=arguments.length,o=i<3?r:null===n?n=Object.getOwnPropertyDescriptor(r,t):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,r,t,n);else for(var u=e.length-1;u>=0;u--)(a=e[u])&&(o=(i<3?a(o):i>3?a(r,t,o):a(r,t))||o);return i>3&&o&&Object.defineProperty(r,t,o),o},a=this&&this.__metadata||function(e,r){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,r)};Object.defineProperty(r,"__esModule",{value:!0});var i=t(2),o=t(1),u=function(){function e(e){this.intlService=e}return e.prototype.transform=function(e,r){return"string"==typeof e&&(e=this.intlService.parseNumber(e)),null!==e&&void 0!==e?this.intlService.formatNumber(e,r):e},e}();u=n([i.Pipe({name:"kendoNumber"}),a("design:paramtypes",[o.IntlService])],u),r.NumberPipe=u},function(e,r,t){"use strict";var n=this&&this.__decorate||function(e,r,t,n){var a,i=arguments.length,o=i<3?r:null===n?n=Object.getOwnPropertyDescriptor(r,t):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,r,t,n);else for(var u=e.length-1;u>=0;u--)(a=e[u])&&(o=(i<3?a(o):i>3?a(r,t,o):a(r,t))||o);return i>3&&o&&Object.defineProperty(r,t,o),o};Object.defineProperty(r,"__esModule",{value:!0});var a=t(2),i=t(7),o=t(8),u=t(1),s=t(3),l=[i.DatePipe,o.NumberPipe],m=function(){function e(){}return e}();m=n([a.NgModule({declarations:[l],exports:[l],providers:[{provide:u.IntlService,useClass:s.CldrIntlService}]})],m),r.IntlModule=m}])});