import { Component, ContentChild, EventEmitter, HostBinding, Inject, Input, ViewChild, Optional, Output, ElementRef, Renderer2 } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RTL } from '@progress/kendo-angular-l10n';
import { DialogActionsComponent } from './dialog-actions.component';
import { DialogTitleBarComponent } from './dialog-titlebar.component';
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
        this.action = new EventEmitter();
        /**
         * Fires when the user clicks on the **Close** button of the Dialog.
         */
        this.close = new EventEmitter();
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
export { DialogComponent };
DialogComponent.decorators = [
    { type: Component, args: [{
                animations: [
                    trigger('overlayAppear', [
                        state('in', style({ opacity: 1 })),
                        transition('void => *', [
                            style({ opacity: .1 }),
                            animate('.3s cubic-bezier(.2, .6, .4, 1)')
                        ])
                    ]),
                    trigger('dialogSlideInAppear', [
                        state('in', style({ transform: 'translate(0, 0)' })),
                        transition('void => *', [
                            style({ transform: 'translate(0, -10%)' }),
                            animate('.3s cubic-bezier(.2, 1, .2, 1)')
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
    { type: ElementRef, },
    { type: Renderer2, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [RTL,] },] },
]; };
DialogComponent.propDecorators = {
    'title': [{ type: Input },],
    'actions': [{ type: Input },],
    'width': [{ type: Input },],
    'height': [{ type: Input },],
    'action': [{ type: Output },],
    'close': [{ type: Output },],
    'dir': [{ type: HostBinding, args: ['attr.dir',] },],
    'titlebarContent': [{ type: ContentChild, args: [DialogTitleBarComponent,] },],
    'titlebarView': [{ type: ViewChild, args: [DialogTitleBarComponent,] },],
    'actionsView': [{ type: ViewChild, args: [DialogActionsComponent,] },],
    'wrapperClass': [{ type: HostBinding, args: ['class.k-dialog-wrapper',] },],
};
