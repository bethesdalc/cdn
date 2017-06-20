"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-access-missing-member */
var core_1 = require("@angular/core");
var kendo_angular_l10n_1 = require("@progress/kendo-angular-l10n");
var kendo_angular_popup_1 = require("@progress/kendo-angular-popup");
var button_item_template_directive_1 = require("../listbutton/button-item-template.directive");
var util_1 = require("../util");
var list_button_1 = require("../listbutton/list-button");
var focus_service_1 = require("../focusable/focus.service");
var navigation_service_1 = require("../navigation/navigation.service");
var navigation_config_1 = require("../navigation/navigation-config");
var preventable_event_1 = require("../preventable-event");
var NAVIGATION_SETTINGS = {
    useLeftRightArrows: true
};
var NAVIGATION_SETTINGS_PROVIDER = {
    provide: navigation_config_1.NAVIGATION_CONFIG,
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
        _this.itemClick = new core_1.EventEmitter();
        /**
         * Fires each time the popup is about to open.
         * This event is preventable. If you cancel the event, the popup will remain closed.
         */
        _this.open = new core_1.EventEmitter();
        /**
         * Fires each time the popup is about to close.
         * This event is preventable. If you cancel the event, the popup will remain opened.
         */
        _this.close = new core_1.EventEmitter();
        /**
         * Fires each time the user focuses the DropDownButton component.
         */
        _this.onFocus = new core_1.EventEmitter(); //tslint:disable-line:no-output-rename
        /**
         * Fires each time the DropDownButton component gets blurred.
         */
        _this.onBlur = new core_1.EventEmitter(); //tslint:disable-line:no-output-rename
        _this.listId = util_1.guid();
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
            var eventArgs = new preventable_event_1.PreventableEvent();
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
        if (util_1.isDocumentAvailable()) {
            this.button.nativeElement.focus();
        }
    };
    /**
     * Blurs the DropDownButton component.
     */
    DropDownButtonComponent.prototype.blur = function () {
        if (util_1.isDocumentAvailable()) {
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
        util_1.tick(function () { return (_this._toggle((open === undefined) ? !_this._open : open)); });
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
            if (util_1.isPresent(focused) && focused !== -1) {
                this.emitItemClickHandler(focused);
            }
        }
        this.togglePopupVisibility();
        if (!this.openState && util_1.isDocumentAvailable()) {
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
            if (util_1.isDocumentAvailable()) {
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
}(list_button_1.ListButton));
DropDownButtonComponent.decorators = [
    { type: core_1.Component, args: [{
                exportAs: 'kendoDropDownButton',
                providers: [focus_service_1.FocusService, navigation_service_1.NavigationService, NAVIGATION_SETTINGS_PROVIDER],
                selector: 'kendo-dropdownbutton',
                template: "\n        <button kendoButton #button\n            role=\"menu\"\n            type=\"button\"\n            [tabindex]=\"componentTabIndex\"\n            [class.k-state-active]=\"active\"\n            [disabled]=\"disabled\"\n            [icon]=\"icon\"\n            [iconClass]=\"iconClass\"\n            [imageUrl]=\"imageUrl\"\n            (click)=\"openPopup()\"\n            (focus)=\"handleFocus()\"\n            [attr.aria-disabled]=\"disabled\"\n            [attr.aria-expanded]=\"openState\"\n            [attr.aria-haspopup]=\"true\"\n            [attr.aria-owns]=\"listId\"\n            >\n            <ng-content></ng-content>\n        </button>\n        <ng-template #popupTemplate>\n            <kendo-button-list\n                #buttonList\n                [id]=\"listId\"\n                [data]=\"data\"\n                [textField]=\"textField\"\n                [itemTemplate]=\"itemTemplate\"\n                (onItemClick)=\"onItemClick($event)\"\n                (keydown)=\"keyDownHandler($event)\"\n                (keypress)=\"keyPressHandler($event)\"\n                (keyup)=\"keyUpHandler($event)\"\n            >\n            </kendo-button-list>\n        </ng-template>\n    "
            },] },
];
/** @nocollapse */
DropDownButtonComponent.ctorParameters = function () { return [
    { type: focus_service_1.FocusService, },
    { type: navigation_service_1.NavigationService, },
    { type: core_1.ElementRef, },
    { type: core_1.NgZone, },
    { type: kendo_angular_popup_1.PopupService, },
    { type: undefined, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [kendo_angular_l10n_1.RTL,] },] },
]; };
DropDownButtonComponent.propDecorators = {
    'icon': [{ type: core_1.Input },],
    'iconClass': [{ type: core_1.Input },],
    'imageUrl': [{ type: core_1.Input },],
    'popupSettings': [{ type: core_1.Input },],
    'textField': [{ type: core_1.Input },],
    'disabled': [{ type: core_1.Input },],
    'data': [{ type: core_1.Input },],
    'tabIndex': [{ type: core_1.Input },],
    'itemClick': [{ type: core_1.Output },],
    'open': [{ type: core_1.Output },],
    'close': [{ type: core_1.Output },],
    'onFocus': [{ type: core_1.Output, args: ['focus',] },],
    'onBlur': [{ type: core_1.Output, args: ['blur',] },],
    'focused': [{ type: core_1.HostBinding, args: ['class.k-state-focused',] },],
    'widgetClasses': [{ type: core_1.HostBinding, args: ['class.k-widget',] }, { type: core_1.HostBinding, args: ['class.k-dropdown-button',] },],
    'dir': [{ type: core_1.HostBinding, args: ['attr.dir',] },],
    'itemTemplate': [{ type: core_1.ContentChild, args: [button_item_template_directive_1.ButtonItemTemplateDirective,] },],
    'button': [{ type: core_1.ViewChild, args: ['button',] },],
    'buttonList': [{ type: core_1.ViewChild, args: ['buttonList',] },],
    'popupTemplate': [{ type: core_1.ViewChild, args: ['popupTemplate',] },],
    'keydown': [{ type: core_1.HostListener, args: ['keydown', ['$event'],] },],
    'keypress': [{ type: core_1.HostListener, args: ['keypress', ['$event'],] },],
    'keyup': [{ type: core_1.HostListener, args: ['keyup', ['$event'],] },],
    'mousedown': [{ type: core_1.HostListener, args: ['mousedown', ['$event'],] },],
};
exports.DropDownButtonComponent = DropDownButtonComponent;
