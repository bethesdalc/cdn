import { Component, EventEmitter, HostBinding, TemplateRef, Input, Output } from '@angular/core';
/**
 * Specifies the action buttons for the `DialogComponent`.
 */
var DialogActionsComponent = (function () {
    function DialogActionsComponent() {
        /**
         * Fires when the user clicks on actions specified by the actions.
         */
        this.action = new EventEmitter();
    }
    Object.defineProperty(DialogActionsComponent.prototype, "className", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    DialogActionsComponent.prototype.actionTemplate = function () {
        return this.actions instanceof TemplateRef;
    };
    /**
     * @hidden
     */
    DialogActionsComponent.prototype.onButtonClick = function (action) {
        this.action.emit(action);
    };
    /**
     * @hidden
     */
    DialogActionsComponent.prototype.buttonClass = function (action) {
        var classes = ["k-button"];
        if (action.primary) {
            classes.push("k-primary");
        }
        return classes.join(" ");
    };
    return DialogActionsComponent;
}());
export { DialogActionsComponent };
DialogActionsComponent.decorators = [
    { type: Component, args: [{
                selector: 'kendo-dialog-actions',
                template: "\n    <ng-content *ngIf=\"!actions\"></ng-content>\n    <ng-container *ngIf=\"!actionTemplate()\">\n      <button\n        [ngClass]=\"buttonClass(action)\"\n        (click)=\"onButtonClick(action)\"\n        *ngFor=\"let action of actions\">\n        {{ action.text }}\n      </button>\n    </ng-container>\n    <ng-template [ngTemplateOutlet]=\"actions\" *ngIf=\"actionTemplate()\"></ng-template>\n  "
            },] },
];
/** @nocollapse */
DialogActionsComponent.ctorParameters = function () { return []; };
DialogActionsComponent.propDecorators = {
    'actions': [{ type: Input },],
    'action': [{ type: Output },],
    'className': [{ type: HostBinding, args: ['class.k-button-group',] }, { type: HostBinding, args: ['class.k-dialog-buttongroup',] }, { type: HostBinding, args: ['class.k-dialog-button-layout-stretched',] },],
};
