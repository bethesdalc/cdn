!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("@angular/core"),require("rxjs/Subject"),require("rxjs/add/operator/auditTime")):"function"==typeof define&&define.amd?define(["@angular/core","rxjs/Subject","rxjs/add/operator/auditTime"],t):"object"==typeof exports?exports.KendoAngularResizeSensor=t(require("@angular/core"),require("rxjs/Subject"),require("rxjs/add/operator/auditTime")):e.KendoAngularResizeSensor=t(e["@angular/core"],e["rxjs/Subject"],e["rxjs/add/operator/auditTime"])}(this,function(e,t,i){return function(e){function t(r){if(i[r])return i[r].exports;var o=i[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var i={};return t.m=e,t.c=i,t.p="",t(0)}([function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=i(1);t.ResizeSensorComponent=r.ResizeSensorComponent;var o=i(5);t.ResizeSensorModule=o.ResizeSensorModule},function(e,t,i){"use strict";var r=this&&this.__decorate||function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s},o=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(t,"__esModule",{value:!0});var n=i(2),s=i(3);i(4);var l=10,a=function(e,t){return getComputedStyle(e,null).getPropertyValue(t)},d="position: absolute; display: block; left: 0; top: 0; right: 0; bottom: 0; z-index: -1;overflow: hidden; visibility: hidden;",p="position: absolute; left: 0; top: 0; transition: 0s;",u=p+"width: 200%; height: 200%;",c=function(){function e(e){this.element=e,this.rateLimit=l,this.resize=new n.EventEmitter,this.source=new s.Subject,this.initialized=!1}return e.prototype.ngAfterViewChecked=function(){var e=this;if("undefined"!=typeof document){if(this.initialized)return void this.scroll();var t=1e3/(this.rateLimit||l);this.subscription=this.source.asObservable().auditTime(t).subscribe(function(){e.resize.emit()}),this.parentElement=this.element.nativeElement.parentElement,"static"===a(this.parentElement,"position")&&(this.parentElement.style.position="relative"),this.reset(),this.lastWidth=this.parentElement.offsetWidth,this.lastHeight=this.parentElement.offsetHeight,this.initialized=!0}},e.prototype.ngOnDestroy=function(){this.subscription&&this.subscription.unsubscribe()},e.prototype.scroll=function(){if(this.parentElement){var e=this.parentElement.offsetWidth,t=this.parentElement.offsetHeight,i=e===this.lastWidth&&t===this.lastHeight;i||(this.lastWidth=e,this.lastHeight=t,this.source.next(),this.reset())}},e.prototype.reset=function(){var e=this.expandChild.nativeElement;e.style.width=1e5+"px",e.style.height=1e5+"px";var t=this.expand.nativeElement;t.scrollLeft=1e5,t.scrollTop=1e5;var i=this.shrink.nativeElement;i.scrollLeft=1e5,i.scrollTop=1e5},e}();r([n.Input(),o("design:type",Number)],c.prototype,"rateLimit",void 0),r([n.Output(),o("design:type",n.EventEmitter)],c.prototype,"resize",void 0),r([n.ViewChild("expand"),o("design:type",n.ElementRef)],c.prototype,"expand",void 0),r([n.ViewChild("expandChild"),o("design:type",n.ElementRef)],c.prototype,"expandChild",void 0),r([n.ViewChild("shrink"),o("design:type",n.ElementRef)],c.prototype,"shrink",void 0),c=r([n.Component({selector:"kendo-resize-sensor",styles:[":host { "+d+" }"],template:'<div #expand style="'+d+'" (scroll)="scroll()">  <div #expandChild style="'+p+'"></div></div><div #shrink style="'+d+'" (scroll)="scroll()">  <div style="'+u+'"></div></div>'}),o("design:paramtypes",[n.ElementRef])],c),t.ResizeSensorComponent=c},function(t,i){t.exports=e},function(e,i){e.exports=t},function(e,t){e.exports=i},function(e,t,i){"use strict";var r=this&&this.__decorate||function(e,t,i,r){var o,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(n<3?o(s):n>3?o(t,i,s):o(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};Object.defineProperty(t,"__esModule",{value:!0});var o=i(2),n=i(1),s=[n.ResizeSensorComponent],l=function(){function e(){}return e}();l=r([o.NgModule({declarations:[s],exports:[s]})],l),t.ResizeSensorModule=l}])});