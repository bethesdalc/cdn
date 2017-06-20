import { ButtonDirective } from '../button/button.directive';
import { Component, Input, ContentChildren, HostBinding, HostListener, isDevMode, Optional, Inject } from '@angular/core';
import { RTL } from '@progress/kendo-angular-l10n';
import { KendoButtonService } from '../button/button.service';
import { Keys } from '../navigation/keys';
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
                if (event.keyCode === Keys.right && selectedIndex_1 < lastIndex) {
                    this.deactivate(this.buttons.filter(function (current) { return current.selected; }));
                    this.activate(this.buttons.filter(function (_current, index) {
                        return index === selectedIndex_1 + 1;
                    }));
                }
                if (event.keyCode === Keys.left && selectedIndex_1 > firstIndex) {
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
        if (isDevMode()) {
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
export { ButtonGroupComponent };
ButtonGroupComponent.decorators = [
    { type: Component, args: [{
                exportAs: 'kendoButtonGroup',
                providers: [KendoButtonService],
                selector: 'kendo-buttongroup',
                template: "\n        <ng-content select=\"[kendoButton]\"></ng-content>\n    "
            },] },
];
/** @nocollapse */
ButtonGroupComponent.ctorParameters = function () { return [
    { type: KendoButtonService, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [RTL,] },] },
]; };
ButtonGroupComponent.propDecorators = {
    'disabled': [{ type: Input, args: ['disabled',] },],
    'selection': [{ type: Input, args: ['selection',] },],
    'width': [{ type: Input, args: ['width',] },],
    'buttons': [{ type: ContentChildren, args: [ButtonDirective,] },],
    'wrapperClass': [{ type: HostBinding, args: ['class.k-button-group',] },],
    'stretchedClass': [{ type: HostBinding, args: ['class.k-button-group-stretched',] },],
    'getRole': [{ type: HostBinding, args: ['attr.role',] },],
    'dir': [{ type: HostBinding, args: ['attr.dir',] },],
    'wrapperWidth': [{ type: HostBinding, args: ['style.width',] },],
    'keydown': [{ type: HostListener, args: ['keydown', ['$event'],] },],
};
