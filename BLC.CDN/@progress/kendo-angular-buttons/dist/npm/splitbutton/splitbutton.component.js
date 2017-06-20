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
var list_button_1 = require("./../listbutton/list-button");
var button_item_template_directive_1 = require("./../listbutton/button-item-template.directive");
var focus_service_1 = require("./../focusable/focus.service");
var navigation_service_1 = require("./../navigation/navigation.service");
var navigation_config_1 = require("./../navigation/navigation-config");
var util_1 = require("./../util");
var preventable_event_1 = require("../preventable-event");
var NAVIGATION_SETTINGS = {
    useLeftRightArrows: true
};
var NAVIGATION_SETTINGS_PROVIDER = {
    provide: navigation_config_1.NAVIGATION_CONFIG,
    useValue: NAVIGATION_SETTINGS
};
/**
 * Represents the Kendo UI SplitButton component for Angular.
 *
 * @example
 * ```ts
 * @@Component({
 * selector: 'my-app',
 * template: `
 *  <kendo-splitbutton [data]="data" [icon]="'paste'"
 *      (itemClick)="onSplitButtonItemClick($event)"
 *      (buttonClick)="onSplitButtonClick()">Paste</kendo-splitbutton>
 * `
 * })
 *
 * class AppComponent {
 *   public data: Array<any> = [{
 *       text: 'Keep Text Only',
 *       icon: 'paste-plain-text',
 *       click: () => { console.log('Keep Text Only click handler'); }
 *   }, {
 *       text: 'Paste as HTML',
 *       icon: 'paste-as-html'
 *   }, {
 *       text: 'Paste Markdown',
 *       icon: 'paste-markdown'
 *   }, {
 *       text: 'Set Default Paste'
 *   }];
 *
 *   public onSplitButtonClick(dataItem: any): void {
 *       console.log('Paste');
 *   }
 *
 *   public onSplitButtonItemClick(dataItem: any): void {
 *       if (dataItem) {
 *           console.log(dataItem.text);
 *       }
 *   }
 * }
 * ```
 */
var SplitButtonComponent = (function (_super) {
    __extends(SplitButtonComponent, _super);
    function SplitButtonComponent(focusService, navigationService, wrapperRef, zone, popupService, rtl) {
        var _this = _super.call(this, focusService, navigationService, wrapperRef, zone) || this;
        _this.popupService = popupService;
        /**
         * Sets the text of the SplitButton.
         */
        _this.text = '';
        /**
         * Defines an icon to be rendered next to the button text.
         */
        _this.icon = '';
        /**
         * Defines an icon with a custom CSS class to be rendered next to the button text.
         */
        _this.iconClass = '';
        /**
         * Defines the location of an image to be displayed next to the button text.
         */
        _this.imageUrl = '';
        /**
         * Specifies the [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of the component.
         */
        _this.tabIndex = 0;
        /**
         * Fires each time the user clicks the main button.
         */
        _this.buttonClick = new core_1.EventEmitter();
        /**
         * Fires each time the user clicks on the drop-down list. The event data contains the data item bound to the clicked list item.
         */
        _this.itemClick = new core_1.EventEmitter();
        /**
         * Fires each time the user focuses the SplitButton component.
         */
        _this.onFocus = new core_1.EventEmitter(); //tslint:disable-line:no-output-rename
        /**
         * Fires each time the SplitButton component gets blurred.
         */
        _this.onBlur = new core_1.EventEmitter(); //tslint:disable-line:no-output-rename
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
        _this.listId = util_1.guid();
        _this.buttonText = '';
        _this.direction = rtl ? 'rtl' : 'ltr';
        _this._itemClick = _this.itemClick;
        _this._blur = _this.onBlur;
        return _this;
    }
    Object.defineProperty(SplitButtonComponent.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        /**
         * When set to `true`, disables a SplitButton item.
         */
        set: function (value) {
            this._disabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitButtonComponent.prototype, "popupSettings", {
        get: function () {
            if (!this._popupSettings) {
                this._popupSettings = { animate: true, popupClass: '' };
            }
            return this._popupSettings;
        },
        /**
         * Configures the popup of the SplitButton.
         *
         * The available options are:
         * - `animate`&mdash;Enables or disables the popup animation.
         * - `popupClass`&mdash;Specifies a list of CSS classes used for styling the popup.
         */
        set: function (value) {
            this._popupSettings = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitButtonComponent.prototype, "data", {
        get: function () {
            if (!this._data) {
                this.data = [];
            }
            return this._data;
        },
        /**
         * Sets the data of the SplitButton.
         *
         * > The data has to be provided in an array-like list.
         */
        set: function (data) {
            this._data = data || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitButtonComponent.prototype, "openState", {
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
    Object.defineProperty(SplitButtonComponent.prototype, "active", {
        /**
         * @hidden
         */
        get: function () {
            return this._active;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitButtonComponent.prototype, "componentTabIndex", {
        /**
         * @hidden
         */
        get: function () {
            return this.disabled ? (-1) : this.tabIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitButtonComponent.prototype, "isFocused", {
        get: function () {
            return this._isFocused && !this._disabled;
        },
        set: function (value) {
            this._isFocused = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitButtonComponent.prototype, "widgetClasses", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitButtonComponent.prototype, "dir", {
        get: function () {
            return this.direction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitButtonComponent.prototype, "ariaLabel", {
        /**
         * @hidden
         */
        get: function () {
            return this.buttonText + " splitbutton";
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    SplitButtonComponent.prototype.onButtonFocus = function () {
        if (!this.isFocused) {
            this._isFocused = true;
            this.onFocus.emit();
        }
    };
    /**
     * @hidden
     */
    SplitButtonComponent.prototype.onButtonClick = function () {
        this.buttonClick.emit();
    };
    /**
     * @hidden
     */
    SplitButtonComponent.prototype.keydown = function (event) {
        this.keyDownHandler(event);
    };
    /**
     * @hidden
     */
    SplitButtonComponent.prototype.keypress = function (event) {
        this.keyPressHandler(event);
    };
    /**
     * @hidden
     */
    SplitButtonComponent.prototype.keyup = function (event) {
        this.keyUpHandler(event);
    };
    /**
     * @hidden
     */
    SplitButtonComponent.prototype.ngAfterViewInit = function () {
        this.updateButtonText();
    };
    /**
     * @hidden
     */
    SplitButtonComponent.prototype.ngOnChanges = function (changes) {
        if (changes.hasOwnProperty('text')) {
            this.updateButtonText();
        }
    };
    /**
     * @hidden
     */
    SplitButtonComponent.prototype.togglePopupVisibility = function () {
        _super.prototype.togglePopupVisibility.call(this);
        //XXX: call local openState setter to open the popup
        this.openState = this._open;
        if (util_1.isDocumentAvailable()) {
            this.button.nativeElement.focus();
        }
    };
    /**
     * @hidden
     */
    SplitButtonComponent.prototype.wrapperContains = function (element) {
        return this.wrapper === element
            || this.wrapper.contains(element)
            || (this.popupRef && this.popupRef.popupElement.contains(element));
    };
    Object.defineProperty(SplitButtonComponent.prototype, "anchorAlign", {
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
    Object.defineProperty(SplitButtonComponent.prototype, "popupAlign", {
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
    SplitButtonComponent.prototype.focus = function () {
        if (util_1.isDocumentAvailable()) {
            this.button.nativeElement.focus();
        }
    };
    /**
     * Blurs the DropDownButton component.
     */
    SplitButtonComponent.prototype.blur = function () {
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
    SplitButtonComponent.prototype.toggle = function (open) {
        var _this = this;
        if (this.disabled) {
            return;
        }
        util_1.tick(function () { return (_this._toggle((open === undefined) ? !_this._open : open)); });
    };
    Object.defineProperty(SplitButtonComponent.prototype, "isOpen", {
        /**
         * Returns the current open state of the popup.
         */
        get: function () {
            return this.openState;
        },
        enumerable: true,
        configurable: true
    });
    SplitButtonComponent.prototype.enterHanlder = function () {
        if (this.disabled) {
            return;
        }
        if (this.openState) {
            var focused = this.focusService.focused;
            if (util_1.isPresent(focused) && focused !== -1) {
                this.emitItemClickHandler(focused);
            }
        }
        else {
            this.buttonClick.emit();
        }
    };
    SplitButtonComponent.prototype.updateButtonText = function () {
        var _this = this;
        if (util_1.isDocumentAvailable()) {
            var innerText_1 = this.wrapper.innerText.split('\n').join('').trim();
            //setTimout is needed because of `Expression has changed after it was checked.` error;
            setTimeout(function () { _this.buttonText = innerText_1; }, 0);
        }
    };
    SplitButtonComponent.prototype._toggle = function (open) {
        var _this = this;
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
    return SplitButtonComponent;
}(list_button_1.ListButton));
SplitButtonComponent.decorators = [
    { type: core_1.Component, args: [{
                exportAs: 'kendoSplitButton',
                providers: [focus_service_1.FocusService, navigation_service_1.NavigationService, NAVIGATION_SETTINGS_PROVIDER],
                selector: 'kendo-splitbutton',
                template: "\n        <button kendoButton\n            #button\n            role=\"listbox\"\n            [tabindex]=\"componentTabIndex\"\n            [disabled]=\"disabled\"\n            [icon]=\"icon\"\n            [class.k-state-active]=\"active\"\n            [iconClass]=\"iconClass\"\n            [imageUrl]=\"imageUrl\"\n            (focus)=\"onButtonFocus()\"\n            (click)=\"onButtonClick()\"\n            [attr.aria-disabled]=\"disabled\"\n            [attr.aria-expanded]=\"openState\"\n            [attr.aria-haspopup]=\"true\"\n            [attr.aria-owns]=\"listId\"\n            [attr.aria-label]=\"ariaLabel\"\n            >\n            {{text}}<ng-content></ng-content>\n        </button>\n        <button kendoButton\n            [disabled]=\"disabled\"\n            [icon]=\"'arrow-s'\"\n            [tabindex]=\"-1\"\n            (click)=\"togglePopupVisibility()\">\n        </button>\n        <ng-template #popupTemplate>\n            <kendo-button-list\n                [id]=\"listId\"\n                [data]=\"data\"\n                [textField]=\"textField\"\n                [itemTemplate]=\"itemTemplate\"\n                (onItemBlur)=\"blurHandler()\"\n                (onItemClick)=\"onItemClick($event)\"\n                (keydown)=\"keyDownHandler($event)\"\n                (keypress)=\"keyPressHandler($event)\"\n                (keyup)=\"keyUpHandler($event)\"\n            >\n            </kendo-button-list>\n        <ng-template>\n    "
            },] },
];
/** @nocollapse */
SplitButtonComponent.ctorParameters = function () { return [
    { type: focus_service_1.FocusService, },
    { type: navigation_service_1.NavigationService, },
    { type: core_1.ElementRef, },
    { type: core_1.NgZone, },
    { type: kendo_angular_popup_1.PopupService, },
    { type: undefined, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [kendo_angular_l10n_1.RTL,] },] },
]; };
SplitButtonComponent.propDecorators = {
    'text': [{ type: core_1.Input },],
    'icon': [{ type: core_1.Input },],
    'iconClass': [{ type: core_1.Input },],
    'imageUrl': [{ type: core_1.Input },],
    'disabled': [{ type: core_1.Input },],
    'popupSettings': [{ type: core_1.Input },],
    'tabIndex': [{ type: core_1.Input },],
    'textField': [{ type: core_1.Input },],
    'data': [{ type: core_1.Input },],
    'buttonClick': [{ type: core_1.Output },],
    'itemClick': [{ type: core_1.Output },],
    'onFocus': [{ type: core_1.Output, args: ['focus',] },],
    'onBlur': [{ type: core_1.Output, args: ['blur',] },],
    'open': [{ type: core_1.Output },],
    'close': [{ type: core_1.Output },],
    'itemTemplate': [{ type: core_1.ContentChild, args: [button_item_template_directive_1.ButtonItemTemplateDirective,] },],
    'button': [{ type: core_1.ViewChild, args: ['button',] },],
    'popupTemplate': [{ type: core_1.ViewChild, args: ['popupTemplate',] },],
    'isFocused': [{ type: core_1.HostBinding, args: ['class.k-state-focused',] },],
    'widgetClasses': [{ type: core_1.HostBinding, args: ['class.k-widget',] }, { type: core_1.HostBinding, args: ['class.k-split-button',] }, { type: core_1.HostBinding, args: ['class.k-button-group',] },],
    'dir': [{ type: core_1.HostBinding, args: ['attr.dir',] },],
    'keydown': [{ type: core_1.HostListener, args: ['keydown', ['$event'],] },],
    'keypress': [{ type: core_1.HostListener, args: ['keypress', ['$event'],] },],
    'keyup': [{ type: core_1.HostListener, args: ['keyup', ['$event'],] },],
};
exports.SplitButtonComponent = SplitButtonComponent;
