!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("@angular/core"),require("@angular/animations"),require("@progress/kendo-angular-l10n"),require("@angular/common"),require("rxjs/add/operator/map"),require("rxjs/add/operator/take"),require("rxjs/add/observable/merge"),require("rxjs/Observable"),require("rxjs/Subject")):"function"==typeof define&&define.amd?define(["@angular/core","@angular/animations","@progress/kendo-angular-l10n","@angular/common","rxjs/add/operator/map","rxjs/add/operator/take","rxjs/add/observable/merge","rxjs/Observable","rxjs/Subject"],t):"object"==typeof exports?exports.KendoAngularDialog=t(require("@angular/core"),require("@angular/animations"),require("@progress/kendo-angular-l10n"),require("@angular/common"),require("rxjs/add/operator/map"),require("rxjs/add/operator/take"),require("rxjs/add/observable/merge"),require("rxjs/Observable"),require("rxjs/Subject")):e.KendoAngularDialog=t(e["@angular/core"],e["@angular/animations"],e["@progress/kendo-angular-l10n"],e["@angular/common"],e["rxjs/add/operator/map"],e["rxjs/add/operator/take"],e["rxjs/add/observable/merge"],e["rxjs/Observable"],e["rxjs/Subject"])}(this,function(e,t,n,o,r,i,a,c,l){return function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={exports:{},id:o,loaded:!1};return e[o].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(1);t.DialogComponent=o.DialogComponent;var r=n(6);t.DialogTitleBarComponent=r.DialogTitleBarComponent;var i=n(5);t.DialogActionsComponent=i.DialogActionsComponent;var a=n(7);t.DialogModule=a.DialogModule;var c=n(9);t.DialogService=c.DialogService;var l=n(16);t.DialogCloseResult=l.DialogCloseResult,t.DialogRef=l.DialogRef,t.DialogSettings=l.DialogSettings,t.DialogAction=l.DialogAction},function(e,t,n){"use strict";var o=this&&this.__decorate||function(e,t,n,o){var r,i=arguments.length,a=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(a=(i<3?r(a):i>3?r(t,n,a):r(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},r=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},i=this&&this.__param||function(e,t){return function(n,o){t(n,o,e)}};Object.defineProperty(t,"__esModule",{value:!0});var a=n(2),c=n(3),l=n(4),s=n(5),p=n(6),u=function(){function e(e,t,n){this._elRef=e,this._renderer=t,this.action=new a.EventEmitter,this.close=new a.EventEmitter,this.direction=n?"rtl":"ltr"}return Object.defineProperty(e.prototype,"dir",{get:function(){return this.direction},enumerable:!0,configurable:!0}),e.prototype.ngAfterContentInit=function(){this.bubble("close",this.titlebarContent)},e.prototype.ngAfterViewInit=function(){this.bubble("close",this.titlebarView),this.bubble("action",this.actionsView)},e.prototype.ngOnInit=function(){this._renderer.setAttribute(this._elRef.nativeElement,"title",null)},Object.defineProperty(e.prototype,"wrapperClass",{get:function(){return!0},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"styles",{get:function(){var e={};return this.width&&(e.width=this.width+"px"),this.height&&(e.height=this.height+"px"),e},enumerable:!0,configurable:!0}),e.prototype.bubble=function(e,t){var n=this;t&&t[e].subscribe(function(t){return n[e].emit(t)})},e}();o([a.Input(),r("design:type",String)],u.prototype,"title",void 0),o([a.Input(),r("design:type",String)],u.prototype,"actions",void 0),o([a.Input(),r("design:type",Number)],u.prototype,"width",void 0),o([a.Input(),r("design:type",Number)],u.prototype,"height",void 0),o([a.Output(),r("design:type",a.EventEmitter)],u.prototype,"action",void 0),o([a.Output(),r("design:type",a.EventEmitter)],u.prototype,"close",void 0),o([a.HostBinding("attr.dir"),r("design:type",String),r("design:paramtypes",[])],u.prototype,"dir",null),o([a.ContentChild(p.DialogTitleBarComponent),r("design:type",p.DialogTitleBarComponent)],u.prototype,"titlebarContent",void 0),o([a.ViewChild(p.DialogTitleBarComponent),r("design:type",p.DialogTitleBarComponent)],u.prototype,"titlebarView",void 0),o([a.ViewChild(s.DialogActionsComponent),r("design:type",s.DialogActionsComponent)],u.prototype,"actionsView",void 0),o([a.HostBinding("class.k-dialog-wrapper"),r("design:type",Boolean),r("design:paramtypes",[])],u.prototype,"wrapperClass",null),u=o([a.Component({animations:[c.trigger("overlayAppear",[c.state("in",c.style({opacity:1})),c.transition("void => *",[c.style({opacity:.1}),c.animate(".3s cubic-bezier(.2, .6, .4, 1)")])]),c.trigger("dialogSlideInAppear",[c.state("in",c.style({transform:"translate(0, 0)"})),c.transition("void => *",[c.style({transform:"translate(0, -10%)"}),c.animate(".3s cubic-bezier(.2, 1, .2, 1)")])])],exportAs:"kendoDialog",selector:"kendo-dialog",template:'\n    <div class="k-overlay" @overlayAppear></div>\n\n    <div class="k-widget k-window k-dialog" [ngStyle]="styles" @dialogSlideInAppear>\n\n      <kendo-dialog-titlebar *ngIf="title">{{title}}</kendo-dialog-titlebar>\n      <ng-content select="kendo-dialog-titlebar" *ngIf="!title"></ng-content>\n\n      <div class="k-content k-window-content k-dialog-content">\n        <ng-content *ngIf="!contentTemplate"></ng-content>\n        <ng-template [ngTemplateOutlet]="contentTemplate" *ngIf="contentTemplate"></ng-template>\n      </div>\n\n      <ng-content select="kendo-dialog-actions" *ngIf="!actions"></ng-content>\n      <kendo-dialog-actions [actions]="actions" *ngIf="actions"></kendo-dialog-actions>\n\n    </div>\n  '}),i(2,a.Optional()),i(2,a.Inject(l.RTL)),r("design:paramtypes",[a.ElementRef,a.Renderer2,Boolean])],u),t.DialogComponent=u},function(t,n){t.exports=e},function(e,n){e.exports=t},function(e,t){e.exports=n},function(e,t,n){"use strict";var o=this&&this.__decorate||function(e,t,n,o){var r,i=arguments.length,a=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(a=(i<3?r(a):i>3?r(t,n,a):r(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},r=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(t,"__esModule",{value:!0});var i=n(2),a=function(){function e(){this.action=new i.EventEmitter}return Object.defineProperty(e.prototype,"className",{get:function(){return!0},enumerable:!0,configurable:!0}),e.prototype.actionTemplate=function(){return this.actions instanceof i.TemplateRef},e.prototype.onButtonClick=function(e){this.action.emit(e)},e.prototype.buttonClass=function(e){var t=["k-button"];return e.primary&&t.push("k-primary"),t.join(" ")},e}();o([i.Input(),r("design:type",Object)],a.prototype,"actions",void 0),o([i.Output(),r("design:type",i.EventEmitter)],a.prototype,"action",void 0),o([i.HostBinding("class.k-button-group"),i.HostBinding("class.k-dialog-buttongroup"),i.HostBinding("class.k-dialog-button-layout-stretched"),r("design:type",Boolean),r("design:paramtypes",[])],a.prototype,"className",null),a=o([i.Component({selector:"kendo-dialog-actions",template:'\n    <ng-content *ngIf="!actions"></ng-content>\n    <ng-container *ngIf="!actionTemplate()">\n      <button\n        [ngClass]="buttonClass(action)"\n        (click)="onButtonClick(action)"\n        *ngFor="let action of actions">\n        {{ action.text }}\n      </button>\n    </ng-container>\n    <ng-template [ngTemplateOutlet]="actions" *ngIf="actionTemplate()"></ng-template>\n  '})],a),t.DialogActionsComponent=a},function(e,t,n){"use strict";var o=this&&this.__decorate||function(e,t,n,o){var r,i=arguments.length,a=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(a=(i<3?r(a):i>3?r(t,n,a):r(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},r=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(t,"__esModule",{value:!0});var i=n(2),a=function(){function e(){this.close=new i.EventEmitter}return Object.defineProperty(e.prototype,"className",{get:function(){return!0},enumerable:!0,configurable:!0}),e.prototype.onCloseClick=function(e){e.preventDefault(),this.close.emit()},e}();o([i.Output(),r("design:type",i.EventEmitter)],a.prototype,"close",void 0),o([i.HostBinding("class.k-window-titlebar"),i.HostBinding("class.k-dialog-titlebar"),i.HostBinding("class.k-header"),r("design:type",Boolean),r("design:paramtypes",[])],a.prototype,"className",null),a=o([i.Component({selector:"kendo-dialog-titlebar",template:'\n    <div class="k-window-title k-dialog-title">\n      <ng-content></ng-content>\n    </div>\n    <div class="k-window-actions k-dialog-actions">\n      <a href="#" role="button"\n         aria-label="Close"\n         class="k-button k-bare k-button-icon k-window-action k-dialog-action k-dialog-close"\n         (click)="onCloseClick($event)">\n        <span class="k-icon k-i-x"></span>\n      </a>\n    </div>\n  '})],a),t.DialogTitleBarComponent=a},function(e,t,n){"use strict";var o=this&&this.__decorate||function(e,t,n,o){var r,i=arguments.length,a=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(a=(i<3?r(a):i>3?r(t,n,a):r(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a};Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),i=n(8),a=n(1),c=n(6),l=n(5),s=n(9),p=n(17),u=n(15);t.DIALOG_DIRECTIVES=[a.DialogComponent,c.DialogTitleBarComponent,l.DialogActionsComponent];var d=function(){function e(){}return e}();d=o([r.NgModule({declarations:[t.DIALOG_DIRECTIVES,p.DialogContainerDirective],entryComponents:[t.DIALOG_DIRECTIVES],exports:[t.DIALOG_DIRECTIVES,p.DialogContainerDirective],imports:[i.CommonModule],providers:[u.DialogContainerService,s.DialogService]})],d),t.DialogModule=d},function(e,t){e.exports=o},function(e,t,n){"use strict";var o=this&&this.__decorate||function(e,t,n,o){var r,i=arguments.length,a=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(a=(i<3?r(a):i>3?r(t,n,a):r(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},r=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(t,"__esModule",{value:!0}),n(10),n(11),n(12);var i=n(13),a=n(14),c=n(2),l=n(1),s=n(15),p=n(16),u=function(){function e(e,t){this.resolver=e,this.containerService=t}return e.prototype.open=function(e){this.containerService.validate();var t=this.resolver.resolveComponentFactory(l.DialogComponent),n=this.containerService.container,o=this.contentFrom(e.content),r=n.createComponent(t,void 0,void 0,o.nodes);this.applyOptions(r.instance,e);var c=new a.Subject,s=function(e){c.next(e||new p.DialogCloseResult),o.componentRef&&o.componentRef.destroy(),r.destroy()},u=i.Observable.merge(c,r.instance.close,r.instance.action).take(1);return u.subscribe(s),{result:u,dialog:r,content:o.componentRef||null,close:s}},e.prototype.applyOptions=function(e,t){e.title=t.title,e.actions=t.actions,t.content instanceof c.TemplateRef&&(e.contentTemplate=t.content)},e.prototype.contentFrom=function(e){var t=[],n=null;if("string"==typeof e)t=[this.containerService.renderer.createText(e)];else if(e&&!(e instanceof c.TemplateRef)){var o=this.resolver.resolveComponentFactory(e);n=this.containerService.container.createComponent(o),t=[n.location.nativeElement]}return{componentRef:n,nodes:[[],t,[]]}},e}();u=o([c.Injectable(),r("design:paramtypes",[c.ComponentFactoryResolver,s.DialogContainerService])],u),t.DialogService=u},function(e,t){e.exports=r},function(e,t){e.exports=i},function(e,t){e.exports=a},function(e,t){e.exports=c},function(e,t){e.exports=l},function(e,t,n){"use strict";var o=this&&this.__decorate||function(e,t,n,o){var r,i=arguments.length,a=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(a=(i<3?r(a):i>3?r(t,n,a):r(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a};Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),i=a=function(){function e(){}return Object.defineProperty(e.prototype,"container",{get:function(){return a.container},set:function(e){a.container=e},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"renderer",{get:function(){return a.renderer},set:function(e){a.renderer=e},enumerable:!0,configurable:!0}),e.prototype.validate=function(){var e=a.container&&a.renderer;if(!e)throw new Error("\n  Cannot attach dialog to the page.\n  Verify that there is an element that uses the kendoDialogContainer directive.\n  See http://www.telerik.com/kendo-angular-ui/components/dialog/api/DialogContainerDirective/ .\n      ");return!!e},e}();i=a=o([r.Injectable()],i),t.DialogContainerService=i;var a},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){}return e}();t.DialogAction=n;var o=function(){function e(){}return e}();t.DialogCloseResult=o;var r=function(){function e(){}return e}();t.DialogSettings=r;var i=function(){function e(){}return e}();t.DialogRef=i},function(e,t,n){"use strict";var o=this&&this.__decorate||function(e,t,n,o){var r,i=arguments.length,a=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(a=(i<3?r(a):i>3?r(t,n,a):r(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},r=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(t,"__esModule",{value:!0});var i=n(2),a=n(15),c=function(){function e(e,t,n){n.container=e,n.renderer=t}return e}();c=o([i.Directive({selector:"[kendoDialogContainer]"}),r("design:paramtypes",[i.ViewContainerRef,i.Renderer2,a.DialogContainerService])],c),t.DialogContainerDirective=c}])});