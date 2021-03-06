"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var focus_service_1 = require("./focus.service");
var util_1 = require("./../util");
/**
 * @hidden
 */
var FocusableDirective = (function () {
    function FocusableDirective(focusService, elementRef) {
        this.focusService = focusService;
        this.element = elementRef.nativeElement;
        this.subscribeEvents();
    }
    Object.defineProperty(FocusableDirective.prototype, "focusedClassName", {
        get: function () {
            return this.focusService.isFocused(this.index);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    FocusableDirective.prototype.ngOnDestroy = function () {
        this.unsubscribeEvents();
    };
    FocusableDirective.prototype.subscribeEvents = function () {
        var _this = this;
        if (!util_1.isDocumentAvailable()) {
            return;
        }
        this.focusSubscription = this.focusService.onFocus.subscribe(function (index) {
            if (_this.index === index) {
                _this.element.focus();
            }
        });
    };
    FocusableDirective.prototype.unsubscribeEvents = function () {
        if (!util_1.isDocumentAvailable()) {
            return;
        }
        if (this.focusSubscription) {
            this.focusSubscription.unsubscribe();
        }
    };
    return FocusableDirective;
}());
FocusableDirective.decorators = [
    { type: core_1.Directive, args: [{
                selector: '[kendoButtonFocusable]'
            },] },
];
/** @nocollapse */
FocusableDirective.ctorParameters = function () { return [
    { type: focus_service_1.FocusService, },
    { type: core_1.ElementRef, },
]; };
FocusableDirective.propDecorators = {
    'index': [{ type: core_1.Input },],
    'focusedClassName': [{ type: core_1.HostBinding, args: ['class.k-state-focused',] },],
};
exports.FocusableDirective = FocusableDirective;
