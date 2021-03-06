/* tslint:disable:no-null-keyword */
/* tslint:disable:max-line-length */
import { Component, forwardRef, ElementRef, Input, Output, EventEmitter, ContentChild, ViewChild, HostBinding, Optional, Inject, isDevMode } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SearchBarComponent } from './searchbar.component';
import { ItemTemplateDirective } from './templates/item-template.directive';
import { HeaderTemplateDirective } from './templates/header-template.directive';
import { FooterTemplateDirective } from './templates/footer-template.directive';
import { SelectionService } from './selection.service';
import { NavigationService } from './navigation.service';
import { Observable } from 'rxjs/Observable';
import { isPresent, guid, isDocumentAvailable, getter } from './util';
import { NavigationAction } from './navigation-action';
import { NoDataTemplateDirective } from './templates/no-data-template.directive';
import { Keys } from './common/keys';
import { PreventableEvent } from './common/preventable-event';
import { RTL } from '@progress/kendo-angular-l10n';
import { PopupService } from '@progress/kendo-angular-popup';
/**
 * @hidden
 */
export var AUTOCOMPLETE_VALUE_ACCESSOR = {
    multi: true,
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return AutoCompleteComponent; })
};
/**
 * Represents the Kendo UI AutoComplete component for Angular.
 *
 * @example
 * ```ts
 * @@Component({
 * selector: 'my-app',
 * template: `
 *  <kendo-autocomplete
 *      [data]="listItems"
 *      [placeholder]="placeholder"
 *  >
 * `
 * })
 * class AppComponent {
 *   public placeholder: string = 'Type "it" for suggestions';
 *   public listItems: Array<string> = ["Item 1", "Item 2", "Item 3", "Item 4"];
 * }
 * ```
 */
var AutoCompleteComponent = (function () {
    function AutoCompleteComponent(rtl, popupService, selectionService, navigationService, wrapper) {
        this.popupService = popupService;
        this.selectionService = selectionService;
        this.navigationService = navigationService;
        /**
         * The hint displayed when the component is empty.
         *
         */
        this.placeholder = "";
        /**
         * @hidden
         *
         * Unless this options is set to `false`, a button will appear when hovering over the component. Clicking that button resets the component value to undefined and triggers the `change` event.
         */
        this.clearButton = true;
        /**
         * Sets the disabled state of the component.
         */
        this.disabled = false;
        /**
         * Specifies the [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of the component.
         */
        this.tabIndex = 0;
        /**
         * Enables the filter functionality. If set to `true`, the component emits the `filterChange` event.
         */
        this.filterable = false;
        /**
         * Fires each time the value is changed.
         *
         * For more details, refer to the section on the [`valueChange`]({% slug overview_autocomplete_kendouiforangular %}#toc-on-value-change) event.
         */
        this.valueChange = new EventEmitter();
        /**
         * Fires each time the user types in the input. You can filter the source based on the passed filtration value.
         *
         * For more details, refer to the section on the [`filterChange`]({% slug overview_autocomplete_kendouiforangular %}#toc-on-filter-change) event.
         */
        this.filterChange = new EventEmitter();
        /**
         * Fires each time the popup is about to open.
         * This event is preventable. If you cancel the event, the popup will remain closed.
         */
        this.open = new EventEmitter();
        /**
         * Fires each time the popup is about to close.
         * This event is preventable. If you cancel the event, the popup will remain opened.
         */
        this.close = new EventEmitter();
        /**
         * Fires each time the user focuses the AutoComplete component.
         */
        this.onFocus = new EventEmitter(); //tslint:disable-line:no-output-rename
        /**
         * Fires each time the AutoComplete component gets blurred.
         */
        this.onBlur = new EventEmitter(); //tslint:disable-line:no-output-rename
        this.listBoxId = guid();
        this.optionPrefix = guid();
        this.onChangeCallback = function (_value) { };
        this.onTouchedCallback = function (_) { };
        this.popupMouseDownHandler = function (event) { return event.preventDefault(); };
        this._popupSettings = { height: 200, animate: true };
        this._open = false;
        this._value = "";
        this._isFocused = false;
        this.direction = rtl ? 'rtl' : 'ltr';
        this.wrapper = wrapper.nativeElement;
        this.data = [];
        this.subscribeEvents();
        this.selectionService.resetSelection([-1]);
    }
    Object.defineProperty(AutoCompleteComponent.prototype, "width", {
        get: function () {
            var wrapperOffsetWidth = 0;
            if (isDocumentAvailable()) {
                wrapperOffsetWidth = this.wrapper.offsetWidth;
            }
            var width = this.popupSettings.width || wrapperOffsetWidth;
            var minWidth = isNaN(wrapperOffsetWidth) ? wrapperOffsetWidth : wrapperOffsetWidth + "px";
            var maxWidth = isNaN(width) ? width : width + "px";
            return { min: minWidth, max: maxWidth };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteComponent.prototype, "height", {
        get: function () {
            return this.popupSettings.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteComponent.prototype, "listContainerClasses", {
        get: function () {
            var containerClasses = ['k-list-container', 'k-reset'];
            if (this.popupSettings.popupClass) {
                containerClasses.push(this.popupSettings.popupClass);
            }
            return containerClasses;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteComponent.prototype, "suggestion", {
        get: function () {
            if (!this.value || !this.suggestedText) {
                this.suggestedText = undefined;
                return;
            }
            var hasMatch = this.suggestedText.toLowerCase().startsWith(this.value.toLowerCase());
            var shouldSuggest = this.suggest && !this.backspacePressed;
            if (shouldSuggest && hasMatch) {
                return this.suggestedText;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteComponent.prototype, "popupOpen", {
        get: function () {
            return this._open;
        },
        set: function (open) {
            if (this.disabled || this.popupOpen === open) {
                return;
            }
            var eventArgs = new PreventableEvent();
            if (open && !this.popupOpen) {
                this.open.emit(eventArgs);
            }
            if (!open && this.popupOpen) {
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
    Object.defineProperty(AutoCompleteComponent.prototype, "activeDescendant", {
        get: function () {
            return this.optionPrefix + "-" + this.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteComponent.prototype, "data", {
        get: function () {
            return this._data;
        },
        /**
         * Sets the data of the AutoComplete.
         *
         * > The data has to be provided in an array-like list.
         */
        set: function (data) {
            this._data = data || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteComponent.prototype, "value", {
        get: function () {
            return this._value;
        },
        /**
         * Sets the value of the AutoComplete.
         *
         */
        set: function (newValue) {
            this.verifySettings(newValue);
            this._value = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteComponent.prototype, "popupSettings", {
        get: function () {
            return this._popupSettings;
        },
        /**
         * Configures the popup of the AutoComplete.
         *
         * The available options are:
         * - `animation: Boolean`&mdash;Controls the popup animation. By default, the open and close animations are enabled.
         * - `width: Number | String`&mdash;Sets the width of the popup container. By default, the width of the host element is used  If set to `auto`, the component automatically adjusts the width of the popup, so no item labels are wrapped.
         * - `height: Number`&mdash;Sets the height of the popup container. By default, the height is 200px.
         * - `popupClass: String`&mdash;Specifies a list of CSS classes that are used to style the popup.
         */
        set: function (settings) {
            this._popupSettings = Object.assign({ height: 200, animate: true }, settings);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteComponent.prototype, "widgetClasses", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteComponent.prototype, "isFocused", {
        get: function () {
            return this._isFocused;
        },
        set: function (isFocused) {
            this._isFocused = isFocused;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteComponent.prototype, "isDisabled", {
        get: function () {
            return this.disabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteComponent.prototype, "widgetHeight", {
        get: function () {
            return this.popupSettings.height + "px";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteComponent.prototype, "dir", {
        get: function () {
            return this.direction;
        },
        enumerable: true,
        configurable: true
    });
    AutoCompleteComponent.prototype.ngOnDestroy = function () {
        this._toggle(false);
        this.unsubscribeEvents();
    };
    AutoCompleteComponent.prototype.ngOnChanges = function (_changes) {
        var shouldSuggest = this.suggest && this.data && this.data.length && this.value;
        if (shouldSuggest) {
            this.suggestedText = getter(this.data[0], this.valueField);
        }
    };
    /**
     * Toggles the visibility of the popup. If you use the `toggle` method to open or close the popup, the `open` and `close` events will not be fired.
     *
     * @param open - The state of the popup.
     */
    AutoCompleteComponent.prototype.toggle = function (open) {
        var _this = this;
        Promise.resolve(null).then(function () {
            _this._toggle((open === undefined) ? !_this._open : open);
        });
    };
    Object.defineProperty(AutoCompleteComponent.prototype, "isOpen", {
        /**
         * Returns the current open state of the popup.
         */
        get: function () {
            return this.popupOpen;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    AutoCompleteComponent.prototype.clearValue = function (event) {
        event.stopImmediatePropagation();
        if (this.filterable) {
            this.filterChange.emit("");
        }
        if (this._previousValue !== undefined) {
            this._previousValue = this.value;
        }
        this.change(undefined);
        this.selectionService.resetSelection([]);
    };
    /**
     * @hidden
     */
    AutoCompleteComponent.prototype.writeValue = function (value) {
        this._previousValue = this.value;
        this.value = value;
    };
    /**
     * @hidden
     */
    AutoCompleteComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    /**
     * @hidden
     */
    AutoCompleteComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    /**
     * @hidden
     */
    AutoCompleteComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    /**
     * @hidden
     */
    AutoCompleteComponent.prototype.popupOpened = function () {
        this.popupWidth = this.width.max;
        this.popupMinWidth = this.width.min;
    };
    /**
     * Focuses the AutoComplete component.
     */
    AutoCompleteComponent.prototype.focus = function () {
        if (!this.disabled) {
            this.searchbar.focus();
        }
    };
    /**
     * Blurs the AutoComplete component.
     */
    AutoCompleteComponent.prototype.blur = function () {
        if (!this.disabled) {
            this.searchbar.blur();
        }
    };
    AutoCompleteComponent.prototype.verifySettings = function (newValue) {
        if (!isDevMode()) {
            return;
        }
        if (isPresent(newValue) && typeof newValue !== "string") {
            throw new Error("Expected value of type string. See http://www.telerik.com/kendo-angular-ui/components/dropdowns/autocomplete/#toc-value");
        }
    };
    AutoCompleteComponent.prototype.search = function (text) {
        var _this = this;
        var index = this.data.findIndex(function (item) {
            var itemText = getter(item, _this.valueField);
            itemText = itemText === undefined ? "" : itemText.toString().toLowerCase();
            return itemText.startsWith(text.toLowerCase());
        });
        this.selectionService.focus(index);
        if (this.suggest) {
            this.suggestedText = getter(this.data[index], this.valueField);
        }
    };
    AutoCompleteComponent.prototype.navigate = function (index) {
        if (!this.popupOpen) {
            return;
        }
        if (index < 0 || index > this.data.length) {
            index = 0;
        }
        this.selectionService.focus(index);
    };
    /**
     * @hidden
     */
    AutoCompleteComponent.prototype.handleNavigate = function (event) {
        var focused = isNaN(this.selectionService.focused) ? 0 : this.selectionService.focused;
        var hasFocused = isPresent(focused);
        var offset = 0;
        if (this.disabled) {
            return;
        }
        if (!hasFocused) {
            if (event.keyCode === Keys.down) {
                offset = -1;
            }
            else if (event.keyCode === Keys.up) {
                offset = 1;
            }
        }
        var action = this.navigationService.process({
            current: focused + offset,
            max: this.data.length - 1,
            min: 0,
            originalEvent: event
        });
        if (action !== NavigationAction.Undefined &&
            action !== NavigationAction.Backspace &&
            action !== NavigationAction.Delete &&
            action !== NavigationAction.Home &&
            action !== NavigationAction.End &&
            action !== NavigationAction.Left &&
            action !== NavigationAction.Right &&
            ((action === NavigationAction.Enter && this.popupOpen) || action !== NavigationAction.Enter)) {
            event.preventDefault();
        }
    };
    AutoCompleteComponent.prototype.handleEnter = function (event) {
        var focused = this.selectionService.focused;
        var value;
        if (this.popupOpen) {
            event.originalEvent.preventDefault();
        }
        if (focused >= 0) {
            value = getter(this.data[focused], this.valueField);
        }
        else {
            var match = this.suggest && this.suggestedText && this.data.length &&
                getter(this.data[0], this.valueField, true).toLowerCase() === this.searchbar.value.toLowerCase();
            if (this.popupOpen && match) {
                value = this.suggestedText;
            }
            else {
                value = this.searchbar.value;
            }
        }
        this.change(value);
    };
    /**
     * @hidden
     */
    AutoCompleteComponent.prototype.searchBarChange = function (text) {
        var currentTextLength = this.value ? this.value.length : 0;
        this.backspacePressed = (text.length < currentTextLength) ? true : false;
        this.value = text;
        this.popupOpen = text.length > 0;
        if (this.filterable) {
            this.selectionService.focused = -1;
            this.filterChange.emit(text);
        }
        else {
            this.search(text);
        }
    };
    /**
     * @hidden
     */
    AutoCompleteComponent.prototype.handleFocus = function () {
        this._previousValue = this.value;
        this.isFocused = true;
        this.onFocus.emit();
    };
    /**
     * @hidden
     */
    AutoCompleteComponent.prototype.handleBlur = function () {
        if (this.value === undefined) {
            this.popupOpen = false;
            this.isFocused = false;
            this.onBlur.emit();
            this.onTouchedCallback();
            return;
        }
        var focused = this.selectionService.focused;
        var dataItem;
        var text;
        var value = this.value;
        if (focused !== -1) {
            dataItem = this.data[focused];
            text = getter(dataItem, this.valueField) || "";
        }
        else {
            text = this.searchbar.value;
        }
        if (text === this.searchbar.value) {
            value = text;
        }
        else if (text && text.toLowerCase() === this.searchbar.value.toLowerCase()) {
            this.selectionService.resetSelection([]);
            value = this.searchbar.value;
        }
        this.change(value);
        this.popupOpen = false;
        this.isFocused = false;
        this.onBlur.emit();
        this.onTouchedCallback();
    };
    AutoCompleteComponent.prototype.change = function (candidate) {
        this.popupOpen = false;
        if (candidate === this._previousValue) {
            this.value = candidate;
            return;
        }
        this.value = candidate;
        this._previousValue = this.value;
        this.onChangeCallback(this.value);
        this.valueChange.emit(this.value);
    };
    AutoCompleteComponent.prototype.subscribeEvents = function () {
        var _this = this;
        if (!isDocumentAvailable()) {
            return;
        }
        this.changeSubscribtion = this.selectionService.onChange.subscribe(this.handleItemChange.bind(this));
        this.focusSubscribtion = this.selectionService.onFocus.subscribe(this.handleItemFocus.bind(this));
        this.navigationSubscribtion = Observable.merge(this.navigationService.up, this.navigationService.down).subscribe(function (event) { return _this.navigate(event.index); });
        this.closeSubscription = this.navigationService.close.subscribe(function () { return _this.popupOpen = false; });
        this.enterSubscription = this.navigationService.enter.subscribe(this.handleEnter.bind(this));
        this.escSubscription = this.navigationService.esc.subscribe(this.handleBlur.bind(this));
    };
    AutoCompleteComponent.prototype.unsubscribeEvents = function () {
        if (!isDocumentAvailable()) {
            return;
        }
        this.changeSubscribtion.unsubscribe();
        this.navigationSubscribtion.unsubscribe();
        this.closeSubscription.unsubscribe();
        this.enterSubscription.unsubscribe();
        this.escSubscription.unsubscribe();
    };
    AutoCompleteComponent.prototype.handleItemChange = function (event) {
        var index = event.indices.length ? event.indices[0] : undefined;
        this.selectionService.resetSelection([-1]);
        if (!isPresent(index)) {
            return;
        }
        var text = getter(this.data[index], this.valueField);
        this.change(text);
    };
    AutoCompleteComponent.prototype.handleItemFocus = function (_event) {
        var focused = this.selectionService.focused;
        var shouldSuggest = Boolean(this.suggest && this.data && this.data.length && focused >= 0);
        if (shouldSuggest) {
            this.suggestedText = getter(this.data[focused], this.valueField);
        }
    };
    AutoCompleteComponent.prototype._toggle = function (open) {
        var _this = this;
        this._open = open;
        if (this.popupRef) {
            this.popupRef.popupElement
                .removeEventListener('mousedown', this.popupMouseDownHandler);
            this.popupRef.close();
            this.popupRef = null;
        }
        if (this._open) {
            this.popupRef = this.popupService.open({
                anchor: this.wrapper,
                animate: this.popupSettings.animate,
                content: this.popupTemplate,
                popupClass: this.listContainerClasses
            });
            var popupWrapper = this.popupRef.popupElement;
            var _a = this.width, min = _a.min, max = _a.max;
            popupWrapper.addEventListener('mousedown', this.popupMouseDownHandler);
            popupWrapper.style.minWidth = min;
            popupWrapper.style.width = max;
            this.popupRef.popupAnchorViewportLeave.subscribe(function () { return _this.popupOpen = false; });
        }
    };
    return AutoCompleteComponent;
}());
export { AutoCompleteComponent };
AutoCompleteComponent.decorators = [
    { type: Component, args: [{
                exportAs: 'kendoAutoComplete',
                providers: [AUTOCOMPLETE_VALUE_ACCESSOR, SelectionService, NavigationService],
                selector: 'kendo-autocomplete',
                template: "\n        <kendo-searchbar #searchbar\n            [role]=\"'textbox'\"\n            [id]=\"listBoxId\"\n            [activeDescendant]=\"activeDescendant\"\n            [userInput]=\"value\"\n            [suggestedText]=\"suggestion\"\n            [disabled]=\"disabled\"\n            [tabIndex]=\"tabIndex\"\n            [popupOpen]=\"popupOpen\"\n            [placeholder]=\"placeholder\"\n            (onNavigate)=\"handleNavigate($event)\"\n            (valueChange)=\"searchBarChange($event)\"\n            (onBlur)=\"handleBlur()\"\n            (onFocus)=\"handleFocus()\"\n        ></kendo-searchbar>\n        <span *ngIf=\"!loading && (clearButton && value?.length)\" class=\"k-icon k-clear-value k-i-close\" title=\"clear\" role=\"button\" tabindex=\"-1\" (click)=\"clearValue($event)\" (mousedown)=\"$event.preventDefault()\">\n</span>\n        <span *ngIf=\"loading\" class=\"k-icon k-i-loading\"></span>\n        <ng-template #popupTemplate>\n            <!--header template-->\n            <ng-template *ngIf=\"headerTemplate\"\n                [templateContext]=\"{\n                    templateRef: headerTemplate.templateRef\n                }\">\n            </ng-template>\n            <!--list-->\n            <kendo-list\n                [id]=\"listBoxId\"\n                [optionPrefix]=\"optionPrefix\"\n                [data]=\"data\"\n                [textField]=\"valueField\"\n                [valueField]=\"valueField\"\n                [template]=\"template\"\n                [height]=\"height\"\n                [show]=\"popupOpen\"\n            >\n            </kendo-list>\n            <!--no-data template-->\n            <div class=\"k-nodata\" *ngIf=\"data.length === 0\">\n                <ng-template [ngIf]=\"noDataTemplate\"\n                    [templateContext]=\"{\n                        templateRef: noDataTemplate?.templateRef\n                    }\">\n                </ng-template>\n                <ng-template [ngIf]=\"!noDataTemplate\">\n                    <div>NO DATA FOUND.</div>\n                </ng-template>\n            </div>\n            <!--footer template-->\n            <ng-template *ngIf=\"footerTemplate\"\n                [templateContext]=\"{\n                    templateRef: footerTemplate.templateRef\n                }\">\n            </ng-template>\n        </ng-template>\n  "
            },] },
];
/** @nocollapse */
AutoCompleteComponent.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [RTL,] },] },
    { type: PopupService, },
    { type: SelectionService, },
    { type: NavigationService, },
    { type: ElementRef, },
]; };
AutoCompleteComponent.propDecorators = {
    'data': [{ type: Input },],
    'value': [{ type: Input },],
    'valueField': [{ type: Input },],
    'placeholder': [{ type: Input },],
    'popupSettings': [{ type: Input },],
    'loading': [{ type: Input },],
    'clearButton': [{ type: Input },],
    'suggest': [{ type: Input },],
    'disabled': [{ type: Input },],
    'tabIndex': [{ type: Input },],
    'filterable': [{ type: Input },],
    'valueChange': [{ type: Output },],
    'filterChange': [{ type: Output },],
    'open': [{ type: Output },],
    'close': [{ type: Output },],
    'onFocus': [{ type: Output, args: ['focus',] },],
    'onBlur': [{ type: Output, args: ['blur',] },],
    'template': [{ type: ContentChild, args: [ItemTemplateDirective,] },],
    'headerTemplate': [{ type: ContentChild, args: [HeaderTemplateDirective,] },],
    'footerTemplate': [{ type: ContentChild, args: [FooterTemplateDirective,] },],
    'noDataTemplate': [{ type: ContentChild, args: [NoDataTemplateDirective,] },],
    'popupTemplate': [{ type: ViewChild, args: ['popupTemplate',] },],
    'searchbar': [{ type: ViewChild, args: [SearchBarComponent,] },],
    'widgetClasses': [{ type: HostBinding, args: ['class.k-widget',] }, { type: HostBinding, args: ['class.k-autocomplete',] }, { type: HostBinding, args: ['class.k-header',] },],
    'isFocused': [{ type: HostBinding, args: ['class.k-state-focused',] },],
    'isDisabled': [{ type: HostBinding, args: ['class.k-state-disabled',] },],
    'widgetHeight': [{ type: HostBinding, args: ['style.max-height',] },],
    'dir': [{ type: HostBinding, args: ['attr.dir',] },],
};
