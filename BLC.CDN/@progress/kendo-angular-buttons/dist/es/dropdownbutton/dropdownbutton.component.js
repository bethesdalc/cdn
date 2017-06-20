var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* tslint:disable:no-access-missing-member */
import { Component, ContentChild, ViewChild, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, Optional, Inject, NgZone } from '@angular/core';
import { RTL } from '@progress/kendo-angular-l10n';
import { PopupService } from '@progress/kendo-angular-popup';
import { ButtonItemTemplateDirective } from '../listbutton/button-item-template.directive';
import { isDocumentAvailable, isPresent, guid, tick } from '../util';
import { ListButton } from '../listbutton/list-button';
import { FocusService } from '../focusable/focus.service';
import { NavigationService } from '../navigation/navigation.service';
import { NAVIGATION_CONFIG } from '../navigation/navigation-config';
import { PreventableEvent } from '../preventable-event';
var NAVIGATION_SETTINGS = {
    useLeftRightArrows: true
};
var NAVIGATION_SETTINGS_PROVIDER = {
    provide: NAVIGATION_CONFIG,
    useValue: NAVIGATION_SETTINGS
};
/**
 * Represents the Kendo UI DropDownButton component for Angular.
 *
 * @example
 * ```ts
 * @@Component({
 * selector: 'my-app',
 * template: `
 *  <kendo-dropdownbutton [data]="data">
 *    User Settings
 *  </kendo-dropdownbutton>
 * `
 * })
 * class AppComponent {
 *   public data: Array<any> = [{
 *       text: 'My Profile'
 *   }, {
 *       text: 'Friend Requests'
 *   }, {
 *       text: 'Account Settings'
 *   }, {
 *       text: 'Support'
 *   }, {
 *       text: 'Log Out'
 *   }];
 * }
 * ```
 */
var DropDownButtonComponent = (function (_super) {
    __extends(DropDownButtonComponent, _super);
    function DropDownButtonComponent(focusService, navigationService, wrapperRef, zone, popupService, rtl) {
        var _this = _super.call(this, focusService, navigationService, wrapperRef, zone) || this;
        _this.popupService = popupService;
        /**
         * Defines the name of an existing icon in the Kendo UI theme.
         */
        _this.icon = '';
        /**
         * Defines the list of CSS classes used for styling the Button with custom icons.
         */
        _this.iconClass = '';
        /**
         * Defines a URL for styling the button with a custom image.
         */
        _this.imageUrl = '';
        /**
         * Specifies the [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of the component.
         */
        _this.tabIndex = 0;
        /**
         * Fires each time the user clicks on a drop-down list item. The event data contains the data item bound to the clicked list item.
         */
        _this.itemClick = new EventEmitter();
        /**
         * Fires each time the popup is about to open.
         * This event is preventable. If you cancel the event, the popup will remain closed.
         */
        _this.open = new EventEmitter();
        /**
         * Fires each time the popup is about to close.
         * This event is preventable. If you cancel the event, the popup will remain opened.
         */
        _this.close = new EventEmitter();
        /**
         * Fires each time the user focuses the DropDownButton component.
         */
        _this.onFocus = new EventEmitter(); //tslint:disable-line:no-output-rename
        /**
         * Fires each time the DropDownButton component gets blurred.
         */
        _this.onBlur = new EventEmitter(); //tslint:disable-line:no-output-rename
        _this.listId = guid();
        _this.direction = rtl ? 'rtl' : 'ltr';
        _this._itemClick = _this.itemClick;
        _this._blur = _this.onBlur;
        return _this;
    }
    Object.defineProperty(DropDownButtonComponent.prototype, "popupSettings", {
        get: function () {
            return this._popupSettings;
        },
        /**
         * Configures the popup of the DropDownButton.
         *
         * The available options are:
         * - `animate`&mdash;Enables or disables the popup animation.
         * - `popupClass`&mdash;Specifies the list of CSS classes used for styling the popup.
         */
        set: function (settings) {
            this._popupSettings = Object.assign({ animate: true, popupClass: '' }, settings);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropDownButtonComponent.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        /**
         * Sets the disabled state of the DropDownButton.
         */
        set: function (value) {
            if (value && this.openState) {
                this.openState = false;
            }
            this._disabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropDownButtonComponent.prototype, "data", {
        get: function () {
            return this._data;
        },
        /**
         * Sets or gets the data of the DropDownButton.
         *
         * > The data has to be provided in an array-like list.
         */
        set: function (data) {
            this._data = data || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropDownButtonComponent.prototype, "openState", {
        /**
         * @hidden
         */
        get: function () {
            return this._open;
        },
        /**
         * @hidden
         */
        set: function (open) {
            if (this.disabled) {
                return;
            }
            var eventArgs = new PreventableEvent();
            if (open) {
                this.open.emit(eventArgs);
            }
            else {
                this.close.emit(eventArgs);
            }
            if (eventArgs.isDefaultPrevented()) {
                return;
            }
            this._toggle(open);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropDownButtonComponent.prototype, "componentTabIndex", {
        /**
         * @hidden
         */
        get: function () {
            return this.disabled ? (-1) : this.tabIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropDownButtonComponent.prototype, "focused", {
        get: function () {
            return this._isFocused && !this._disabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropDownButtonComponent.prototype, "widgetClasses", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropDownButtonComponent.prototype, "dir", {
        get: function () {
            return this.direction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropDownButtonComponent.prototype, "active", {
        /**
         * @hidden
         */
        get: function () {
            return this._active;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    DropDownButtonComponent.prototype.keydown = function (event) {
        this.keyDownHandler(event);
    };
    /**
     * @hidden
     */
    DropDownButtonComponent.prototype.keypress = function (event) {
        this.keyPressHandler(event);
    };
    /**
     * @hidden
     */
    DropDownButtonComponent.prototype.keyup = function (event) {
        this.keyUpHandler(event);
    };
    /**
     * @hidden
     */
    DropDownButtonComponent.prototype.mousedown = function (event) {
        if (this._disabled) {
            event.preventDefault();
        }
    };
    /**
     * @hidden
     */
    DropDownButtonComponent.prototype.openPopup = function () {
        this.togglePopupVisibility();
    };
    Object.defineProperty(DropDownButtonComponent.prototype, "anchorAlign", {
        /**
         * @hidden
         */
        get: function () {
            var align = { horizontal: 'left', vertical: 'bottom' };
            if (this.direction === 'rtl') {
                align.horizontal = 'right';
            }
            return align;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropDownButtonComponent.prototype, "popupAlign", {
        /**
         * @hidden
         */
        get: function () {
            var align = { horizontal: 'left', vertical: 'top' };
            if (this.direction === 'rtl') {
                align.horizontal = 'right';
            }
            return align;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Focuses the DropDownButton component.
     */
    DropDownButtonComponent.prototype.focus = function () {
        if (isDocumentAvailable()) {
            this.button.nativeElement.focus();
        }
    };
    /**
     * Blurs the DropDownButton component.
     */
    DropDownButtonComponent.prototype.blur = function () {
        if (isDocumentAvailable()) {
            this.button.nativeElement.blur();
        }
    };
    /**
     * Toggles the visibility of the popup.
     * If `toggle` method is used to open or close the popup, the `open` and `close` events will not be fired.
     *
     * @param open The state of the popup.
     */
    DropDownButtonComponent.prototype.toggle = function (open) {
        var _this = this;
        if (this.disabled) {
            return;
        }
        tick(function () { return (_this._toggle((open === undefined) ? !_this._open : open)); });
    };
    Object.defineProperty(DropDownButtonComponent.prototype, "isOpen", {
        /**
         * Returns the current open state of the popup.
         */
        get: function () {
            return this.openState;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    DropDownButtonComponent.prototype.handleFocus = function () {
        if (!this._disabled && !this._isFocused) {
            this._isFocused = true;
            this.onFocus.emit();
        }
    };
    /**
     * @hidden
     */
    DropDownButtonComponent.prototype.wrapperContains = function (element) {
        return this.wrapper === element
            || this.wrapper.contains(element)
            || (this.popupRef && this.popupRef.popupElement.contains(element));
    };
    DropDownButtonComponent.prototype.subscribeNavigationEvents = function () {
        this.navigationSubscription = this.navigationService.navigate
            .subscribe(this.onArrowKeyNavigate.bind(this));
        this.enterPressSubscription = this.navigationService.enterpress.subscribe(this.onNavigationEnterPress.bind(this));
        this.enterUpSubscription = this.navigationService.enterup.subscribe(this.onNavigationEnterUp.bind(this));
        this.openSubscription = this.navigationService.open.subscribe(this.onNavigationOpen.bind(this));
        this.closeSubscription = this.navigationService.close
            .merge(this.navigationService.esc)
            .subscribe(this.onNavigationClose.bind(this));
    };
    DropDownButtonComponent.prototype.onNavigationEnterPress = function () {
        if (!this._disabled && !this.openState) {
            this._active = true;
        }
    };
    DropDownButtonComponent.prototype.onNavigationEnterUp = function () {
        if (!this._disabled && !this.openState) {
            this._active = false;
        }
        if (this.openState) {
            var focused = this.focusService.focused;
            if (isPresent(focused) && focused !== -1) {
                this.emitItemClickHandler(focused);
            }
        }
        this.togglePopupVisibility();
        if (!this.openState && isDocumentAvailable()) {
            this.button.nativeElement.focus();
        }
    };
    DropDownButtonComponent.prototype.onNavigationOpen = function () {
        if (!this._disabled && !this.openState) {
            this.togglePopupVisibility();
        }
    };
    DropDownButtonComponent.prototype.onNavigationClose = function () {
        if (this.openState) {
            this.togglePopupVisibility();
            if (isDocumentAvailable()) {
                this.button.nativeElement.focus();
            }
        }
    };
    DropDownButtonComponent.prototype.onArrowKeyNavigate = function (index) {
        this.focusService.focus(index);
    };
    DropDownButtonComponent.prototype._toggle = function (open) {
        var _this = this;
        if (this._open === open) {
            return;
        }
        this._open = open;
        if (this.popupRef) {
            this.popupRef.close();
            this.popupRef = null;
        }
        if (this._open) {
            this.popupRef = this.popupService.open({
                anchor: this.button,
                anchorAlign: this.anchorAlign,
                animate: this.popupSettings.animate,
                content: this.popupTemplate,
                popupAlign: this.popupAlign,
                popupClass: this.popupClasses
            });
            this.popupRef.popupAnchorViewportLeave.subscribe(function () { return _this.openState = false; });
            this.popupRef.popupOpen.subscribe(this.focusFirstItem.bind(this));
        }
    };
    return DropDownButtonComponent;
}(ListButton));
export { DropDownButtonComponent };
DropDownButtonComponent.decorators = [
    { type: Component, args: [{
                exportAs: 'kendoDropDownButton',
                providers: [FocusService, NavigationService, NAVIGATION_SETTINGS_PROVIDER],
                selector: 'kendo-dropdownbutton',
                template: "\n        <button kendoButton #button\n            role=\"menu\"\n            type=\"button\"\n            [tabindex]=\"componentTabIndex\"\n            [class.k-state-active]=\"active\"\n            [disabled]=\"disabled\"\n            [icon]=\"icon\"\n            [iconClass]=\"iconClass\"\n            [imageUrl]=\"imageUrl\"\n            (click)=\"openPopup()\"\n            (focus)=\"handleFocus()\"\n            [attr.aria-disabled]=\"disabled\"\n            [attr.aria-expanded]=\"openState\"\n            [attr.aria-haspopup]=\"true\"\n            [attr.aria-owns]=\"listId\"\n            >\n            <ng-content></ng-content>\n        </button>\n        <ng-template #popupTemplate>\n            <kendo-button-list\n                #buttonList\n                [id]=\"listId\"\n                [data]=\"data\"\n                [textField]=\"textField\"\n                [itemTemplate]=\"itemTemplate\"\n                (onItemClick)=\"onItemClick($event)\"\n                (keydown)=\"keyDownHandler($event)\"\n                (keypress)=\"keyPressHandler($event)\"\n                (keyup)=\"keyUpHandler($event)\"\n            >\n            </kendo-button-list>\n        </ng-template>\n    "
            },] },
];
/** @nocollapse */
DropDownButtonComponent.ctorParameters = function () { return [
    { type: FocusService, },
    { type: NavigationService, },
    { type: ElementRef, },
    { type: NgZone, },
    { type: PopupService, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [RTL,] },] },
]; };
DropDownButtonComponent.propDecorators = {
    'icon': [{ type: Input },],
    'iconClass': [{ type: Input },],
    'imageUrl': [{ type: Input },],
    'popupSettings': [{ type: Input },],
    'textField': [{ type: Input },],
    'disabled': [{ type: Input },],
    'data': [{ type: Input },],
    'tabIndex': [{ type: Input },],
    'itemClick': [{ type: Output },],
    'open': [{ type: Output },],
    'close': [{ type: Output },],
    'onFocus': [{ type: Output, args: ['focus',] },],
    'onBlur': [{ type: Output, args: ['blur',] },],
    'focused': [{ type: HostBinding, args: ['class.k-state-focused',] },],
    'widgetClasses': [{ type: HostBinding, args: ['class.k-widget',] }, { type: HostBinding, args: ['class.k-dropdown-button',] },],
    'dir': [{ type: HostBinding, args: ['attr.dir',] },],
    'itemTemplate': [{ type: ContentChild, args: [ButtonItemTemplateDirective,] },],
    'button': [{ type: ViewChild, args: ['button',] },],
    'buttonList': [{ type: ViewChild, args: ['buttonList',] },],
    'popupTemplate': [{ type: ViewChild, args: ['popupTemplate',] },],
    'keydown': [{ type: HostListener, args: ['keydown', ['$event'],] },],
    'keypress': [{ type: HostListener, args: ['keypress', ['$event'],] },],
    'keyup': [{ type: HostListener, args: ['keyup', ['$event'],] },],
    'mousedown': [{ type: HostListener, args: ['mousedown', ['$event'],] },],
};
