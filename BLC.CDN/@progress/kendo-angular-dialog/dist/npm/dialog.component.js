"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var animations_1 = require("@angular/animations");
var kendo_angular_l10n_1 = require("@progress/kendo-angular-l10n");
var dialog_actions_component_1 = require("./dialog-actions.component");
var dialog_titlebar_component_1 = require("./dialog-titlebar.component");
/**
 * Represents the Kendo UI Dialog component for Angular.
 */
var DialogComponent = (function () {
    function DialogComponent(_elRef, _renderer, rtl) {
        this._elRef = _elRef;
        this._renderer = _renderer;
        /**
         * Fires when the user clicks on the **Close** button of the Dialog.
         */
        this.action = new core_1.EventEmitter();
        /**
         * Fires when the user clicks on the **Close** button of the Dialog.
         */
        this.close = new core_1.EventEmitter();
        this.direction = rtl ? 'rtl' : 'ltr';
    }
    Object.defineProperty(DialogComponent.prototype, "dir", {
        get: function () {
            return this.direction;
        },
        enumerable: true,
        configurable: true
    });
    DialogComponent.prototype.ngAfterContentInit = function () {
        this.bubble('close', this.titlebarContent);
    };
    DialogComponent.prototype.ngAfterViewInit = function () {
        this.bubble('close', this.titlebarView);
        this.bubble('action', this.actionsView);
    };
    DialogComponent.prototype.ngOnInit = function () {
        this._renderer.setAttribute(this._elRef.nativeElement, 'title', null);
    };
    Object.defineProperty(DialogComponent.prototype, "wrapperClass", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogComponent.prototype, "styles", {
        get: function () {
            var styles = {};
            if (this.width) {
                styles.width = this.width + 'px';
            }
            if (this.height) {
                styles.height = this.height + 'px';
            }
            return styles;
        },
        enumerable: true,
        configurable: true
    });
    DialogComponent.prototype.bubble = function (eventName, component) {
        var _this = this;
        if (component) {
            component[eventName].subscribe(function (e) { return _this[eventName].emit(e); });
        }
    };
    return DialogComponent;
}());
DialogComponent.decorators = [
    { type: core_1.Component, args: [{
                animations: [
                    animations_1.trigger('overlayAppear', [
                        animations_1.state('in', animations_1.style({ opacity: 1 })),
                        animations_1.transition('void => *', [
                            animations_1.style({ opacity: .1 }),
                            animations_1.animate('.3s cubic-bezier(.2, .6, .4, 1)')
                        ])
                    ]),
                    animations_1.trigger('dialogSlideInAppear', [
                        animations_1.state('in', animations_1.style({ transform: 'translate(0, 0)' })),
                        animations_1.transition('void => *', [
                            animations_1.style({ transform: 'translate(0, -10%)' }),
                            animations_1.animate('.3s cubic-bezier(.2, 1, .2, 1)')
                        ])
                    ])
                ],
                exportAs: 'kendoDialog',
                selector: 'kendo-dialog',
                template: "\n    <div class=\"k-overlay\" @overlayAppear></div>\n\n    <div class=\"k-widget k-window k-dialog\" [ngStyle]=\"styles\" @dialogSlideInAppear>\n\n      <kendo-dialog-titlebar *ngIf=\"title\">{{title}}</kendo-dialog-titlebar>\n      <ng-content select=\"kendo-dialog-titlebar\" *ngIf=\"!title\"></ng-content>\n\n      <div class=\"k-content k-window-content k-dialog-content\">\n        <ng-content *ngIf=\"!contentTemplate\"></ng-content>\n        <ng-template [ngTemplateOutlet]=\"contentTemplate\" *ngIf=\"contentTemplate\"></ng-template>\n      </div>\n\n      <ng-content select=\"kendo-dialog-actions\" *ngIf=\"!actions\"></ng-content>\n      <kendo-dialog-actions [actions]=\"actions\" *ngIf=\"actions\"></kendo-dialog-actions>\n\n    </div>\n  "
            },] },
];
/** @nocollapse */
DialogComponent.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: core_1.Renderer2, },
    { type: undefined, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [kendo_angular_l10n_1.RTL,] },] },
]; };
DialogComponent.propDecorators = {
    'title': [{ type: core_1.Input },],
    'actions': [{ type: core_1.Input },],
    'width': [{ type: core_1.Input },],
    'height': [{ type: core_1.Input },],
    'action': [{ type: core_1.Output },],
    'close': [{ type: core_1.Output },],
    'dir': [{ type: core_1.HostBinding, args: ['attr.dir',] },],
    'titlebarContent': [{ type: core_1.ContentChild, args: [dialog_titlebar_component_1.DialogTitleBarComponent,] },],
    'titlebarView': [{ type: core_1.ViewChild, args: [dialog_titlebar_component_1.DialogTitleBarComponent,] },],
    'actionsView': [{ type: core_1.ViewChild, args: [dialog_actions_component_1.DialogActionsComponent,] },],
    'wrapperClass': [{ type: core_1.HostBinding, args: ['class.k-dialog-wrapper',] },],
};
exports.DialogComponent = DialogComponent;
