"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var button_directive_1 = require("../button/button.directive");
var core_1 = require("@angular/core");
var kendo_angular_l10n_1 = require("@progress/kendo-angular-l10n");
var button_service_1 = require("../button/button.service");
var keys_1 = require("../navigation/keys");
/**
 * @hidden
 */
var ariaChecked = 'aria-checked';
/**
 * @hidden
 */
var role = 'role';
/**
 * @hidden
 */
var tabindex = 'tabindex';
/**
 * Represents the Kendo UI ButtonGroup component for Angular.
 */
var ButtonGroupComponent = (function () {
    function ButtonGroupComponent(service, rtl) {
        this.service = service;
        /**
         * By default, the ButtonGroup selection mode is set to `multiple`.
         */
        this.selection = 'multiple';
        this.direction = rtl ? 'rtl' : 'ltr';
    }
    Object.defineProperty(ButtonGroupComponent.prototype, "wrapperClass", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonGroupComponent.prototype, "stretchedClass", {
        get: function () {
            return !!this.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonGroupComponent.prototype, "getRole", {
        get: function () {
            return this.isSelectionSingle() ? 'radiogroup' : 'group';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonGroupComponent.prototype, "dir", {
        get: function () {
            return this.direction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonGroupComponent.prototype, "wrapperWidth", {
        get: function () {
            return this.width;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    ButtonGroupComponent.prototype.keydown = function (event) {
        if (this.isSelectionSingle()) {
            var selectedIndex_1 = this.buttons.toArray().findIndex(function (current) { return current.selected; });
            var firstIndex = 0;
            var lastIndex = this.buttons.length - 1;
            if (selectedIndex_1 !== undefined) {
                if (event.keyCode === keys_1.Keys.right && selectedIndex_1 < lastIndex) {
                    this.deactivate(this.buttons.filter(function (current) { return current.selected; }));
                    this.activate(this.buttons.filter(function (_current, index) {
                        return index === selectedIndex_1 + 1;
                    }));
                }
                if (event.keyCode === keys_1.Keys.left && selectedIndex_1 > firstIndex) {
                    this.deactivate(this.buttons.filter(function (current) { return current.selected; }));
                    this.activate(this.buttons.filter(function (_current, index) {
                        return index === selectedIndex_1 - 1;
                    }));
                }
            }
        }
    };
    ButtonGroupComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.service.buttonClicked$.subscribe(function (button) {
            if (_this.isSelectionSingle()) {
                _this.deactivate(_this.buttons.filter(function (current) { return current !== button; }));
                button.selected = true;
            }
            else {
                button.selected = !button.selected;
            }
            button.setAttribute(ariaChecked, button.selected.toString());
            button.setAttribute(tabindex, button.tabIndex.toString());
        });
    };
    ButtonGroupComponent.prototype.ngAfterContentInit = function () {
        var isRadioGroup = this.isSelectionSingle();
        var buttonsRole = isRadioGroup ? 'radio' : 'checkbox';
        var anyChecked = false;
        this.buttons.forEach(function (button) {
            button.setAttribute(ariaChecked, button.selected.toString());
            button.setAttribute(role, buttonsRole);
            if (!isRadioGroup || button.selected) {
                button.setAttribute(tabindex, button.tabIndex.toString());
            }
            else if (isRadioGroup && !button.selected) {
                button.setAttribute(tabindex, "-1");
            }
            anyChecked = anyChecked || button.selected;
        });
        if (isRadioGroup && !anyChecked) {
            this.buttons.first.setAttribute(tabindex, this.buttons.first.tabIndex.toString());
            this.buttons.last.setAttribute(tabindex, this.buttons.last.tabIndex.toString());
        }
    };
    ButtonGroupComponent.prototype.ngAfterViewChecked = function () {
        if (this.buttons.length) {
            this.buttons.first.renderer.addClass(this.buttons.first.element, 'k-group-start');
            this.buttons.last.renderer.addClass(this.buttons.last.element, 'k-group-end');
        }
    };
    ButtonGroupComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    ButtonGroupComponent.prototype.ngAfterContentChecked = function () {
        this.verifySettings();
    };
    ButtonGroupComponent.prototype.deactivate = function (buttons) {
        buttons.forEach(function (button) {
            button.selected = false;
            button.setAttribute(ariaChecked, button.selected.toString());
            button.setAttribute(tabindex, "-1");
        });
    };
    ButtonGroupComponent.prototype.activate = function (buttons) {
        buttons.forEach(function (button) {
            button.selected = true;
            button.setAttribute(ariaChecked, button.selected.toString());
            button.setAttribute(tabindex, "0");
            button.focus();
        });
    };
    ButtonGroupComponent.prototype.verifySettings = function () {
        if (core_1.isDevMode()) {
            if (this.isSelectionSingle() && this.buttons.filter(function (button) { return button.selected; }).length > 1) {
                throw new Error('Having multiple selected buttons with single selection mode is not supported');
            }
        }
    };
    ButtonGroupComponent.prototype.isSelectionSingle = function () {
        return this.selection === 'single';
    };
    return ButtonGroupComponent;
}());
ButtonGroupComponent.decorators = [
    { type: core_1.Component, args: [{
                exportAs: 'kendoButtonGroup',
                providers: [button_service_1.KendoButtonService],
                selector: 'kendo-buttongroup',
                template: "\n        <ng-content select=\"[kendoButton]\"></ng-content>\n    "
            },] },
];
/** @nocollapse */
ButtonGroupComponent.ctorParameters = function () { return [
    { type: button_service_1.KendoButtonService, },
    { type: undefined, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [kendo_angular_l10n_1.RTL,] },] },
]; };
ButtonGroupComponent.propDecorators = {
    'disabled': [{ type: core_1.Input, args: ['disabled',] },],
    'selection': [{ type: core_1.Input, args: ['selection',] },],
    'width': [{ type: core_1.Input, args: ['width',] },],
    'buttons': [{ type: core_1.ContentChildren, args: [button_directive_1.ButtonDirective,] },],
    'wrapperClass': [{ type: core_1.HostBinding, args: ['class.k-button-group',] },],
    'stretchedClass': [{ type: core_1.HostBinding, args: ['class.k-button-group-stretched',] },],
    'getRole': [{ type: core_1.HostBinding, args: ['attr.role',] },],
    'dir': [{ type: core_1.HostBinding, args: ['attr.dir',] },],
    'wrapperWidth': [{ type: core_1.HostBinding, args: ['style.width',] },],
    'keydown': [{ type: core_1.HostListener, args: ['keydown', ['$event'],] },],
};
exports.ButtonGroupComponent = ButtonGroupComponent;
