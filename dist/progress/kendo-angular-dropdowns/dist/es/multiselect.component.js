/* tslint:disable:max-line-length */
import { guid, isDocumentAvailable, isPresent, isArray, isObjectArray, resolveAllValues, selectedIndices, getter, isNumber } from './util';
import { SearchBarComponent } from './searchbar.component';
import { ViewChild, Component, HostBinding, Input, Optional, Inject, Output, EventEmitter, isDevMode, forwardRef, ContentChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectionService } from './selection.service';
import { NavigationService } from './navigation.service';
import { NavigationAction } from './navigation-action';
import { Keys } from './common/keys';
import { ItemTemplateDirective } from './templates/item-template.directive';
import { HeaderTemplateDirective } from './templates/header-template.directive';
import { FooterTemplateDirective } from './templates/footer-template.directive';
import { TagTemplateDirective } from './templates/tag-template.directive';
import { NoDataTemplateDirective } from './templates/no-data-template.directive';
import { MultiselectMessages } from './error-messages';
import { PreventableEvent } from './common/preventable-event';
import { RTL } from '@progress/kendo-angular-l10n';
import { PopupService } from '@progress/kendo-angular-popup';
var MULTISELECT_VALUE_ACCESSOR = {
    multi: true,
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MultiSelectComponent; })
};
/**
 * Represents the Kendo UI MultiSelect component for Angular.
 *
 * @example
 * ```ts
 * @@Component({
 * selector: 'my-app',
 * template: `
 *  <kendo-multiselect [data]="listItems">
 *  </kendo-multiselect>
 * `
 * })
 * class AppComponent {
 *   public listItems: Array<string> = ["Item 1", "Item 2", "Item 3", "Item 4"];
 * }
 * ```
 */
var MultiSelectComponent = (function () {
    function MultiSelectComponent(rtl, popupService, selectionService, navigationService) {
        this.popupService = popupService;
        this.selectionService = selectionService;
        this.navigationService = navigationService;
        this.activeId = guid();
        this.listBoxId = guid();
        this.focusedTagIndex = undefined;
        /**
         * Specifies the [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of the component.
         */
        this.tabIndex = 0;
        /**
         * Sets the disabled state of the component.
         */
        this.disabled = false;
        /**
         * Enables the [filtering]({% slug overview_multiselect_kendouiforangular %}#toc-filtering) functionality of the MultiSelect.
         */
        this.filterable = false;
        /**
         * Unless this options is set to `false`, a button will appear when hovering over the component. Clicking that button resets the component value to an empty array and triggers the `change` event.
         */
        this.clearButton = true;
        /**
         * Fires each time the user types in the filter input. You can filter the source based on the passed filtration value.
         */
        this.filterChange = new EventEmitter();
        /**
         * Fires each time the value is changed.
         *
         * For more details, refer to the section on the [`valueChange`]({% slug overview_multiselect_kendouiforangular %}#toc-on-value-change) event.
         */
        this.valueChange = new EventEmitter();
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
        this.onChangeCallback = function (_) { };
        this.onTouchedCallback = function (_) { };
        this._data = [];
        this._placeholder = '';
        this._open = false;
        this._value = [];
        this.selectedDataItems = [];
        this._popupSettings = { height: 200, animate: true };
        this.observableSubscriptions = new Subscription();
        this.changeSubscription = new Subscription();
        this.isFocused = false;
        this.wrapperBlurred = new EventEmitter();
        this.popupMouseDownHandler = this.onMouseDown.bind(this);
        this.direction = rtl ? 'rtl' : 'ltr';
        this.subscribeEvents();
    }
    Object.defineProperty(MultiSelectComponent.prototype, "popupOpen", {
        get: function () {
            return this._open;
        },
        set: function (open) {
            if (this.disabled || this.popupOpen === open) {
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
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.focusComponent = function () {
        if (!this.isFocused) {
            this.isFocused = true;
            this.onFocus.emit();
        }
    };
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.blurComponent = function () {
        if (this.isFocused) {
            this.closePopup();
            this.isFocused = false;
            this.onBlur.emit();
            this.onTouchedCallback();
        }
    };
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.wrapperMousedown = function (event) {
        event.preventDefault();
        this.searchbar.focus();
        this.popupOpen = !this.popupOpen;
    };
    Object.defineProperty(MultiSelectComponent.prototype, "data", {
        get: function () {
            return this._data;
        },
        /**
         * Sets the data of the MultiSelect.
         *
         * > The data has to be provided in an array of items.
         */
        set: function (data) {
            this._data = data || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiSelectComponent.prototype, "value", {
        get: function () {
            return this._value;
        },
        /**
         * Sets the value of the MultiSelect. It could be either of the primitive (string, numbers) or of the complex (objects) type. Use the `valuePrimitive` option to define the type.
         *
         * > Selected values that are not present in the source are ignored.
         */
        set: function (values) {
            this._value = values ? values : [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiSelectComponent.prototype, "placeholder", {
        get: function () {
            return this.selectedDataItems.length ? '' : this._placeholder;
        },
        /**
         * The hint displayed when the component is empty. Will not be displayed when values are selected.
         */
        set: function (text) {
            this._placeholder = text || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiSelectComponent.prototype, "popupSettings", {
        get: function () {
            return this._popupSettings;
        },
        /**
         * Configures the popup of the MultiSelect.
         *
         * The available options are:
         * - `animation: Boolean`&mdash;Controls the popup animation. By default, the open and close animations are enabled.
         * - `width: Number`&mdash;Sets the width of the popup container. By default, the width of the host element is used.
         * - `height: Number`&mdash;Sets the height of the popup container. By default, the height is 200px.
         * - `popupClass: String`&mdash;Specifies a list of CSS classes that are used to style the popup.
         */
        set: function (settings) {
            this._popupSettings = Object.assign({ height: 200, animate: true }, settings);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiSelectComponent.prototype, "widgetClasses", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiSelectComponent.prototype, "dir", {
        get: function () {
            return this.direction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiSelectComponent.prototype, "focusedClass", {
        get: function () {
            return this.isFocused;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiSelectComponent.prototype, "disabledClass", {
        get: function () {
            return this.disabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultiSelectComponent.prototype, "listContainerClasses", {
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
    Object.defineProperty(MultiSelectComponent.prototype, "width", {
        get: function () {
            var wrapperOffsetWidth = 0;
            if (isDocumentAvailable()) {
                wrapperOffsetWidth = this.wrapper.nativeElement.offsetWidth;
            }
            var width = this.popupSettings.width || wrapperOffsetWidth;
            var minWidth = isNaN(wrapperOffsetWidth) ? wrapperOffsetWidth : wrapperOffsetWidth + "px";
            var maxWidth = isNaN(width) ? width : width + "px";
            return { min: minWidth, max: maxWidth };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.popupOpened = function () {
        this.popupWidth = this.width.max;
        this.popupMinWidth = this.width.min;
    };
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.onMouseDown = function (event) {
        var tagName = event.target.tagName.toLowerCase();
        if (tagName !== "input") {
            event.preventDefault();
        }
    };
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.verifySettings = function () {
        var valueOrText = !isPresent(this.valueField) !== !isPresent(this.textField);
        if (!isDevMode() || this.value.length === 0) {
            return;
        }
        if (!isArray(this.value)) {
            throw new Error(MultiselectMessages.array);
        }
        if (this.valuePrimitive === true && isObjectArray(this.value)) {
            throw new Error(MultiselectMessages.primitive);
        }
        if (this.valuePrimitive === false && !isObjectArray(this.value)) {
            throw new Error(MultiselectMessages.object);
        }
        if (valueOrText) {
            throw new Error("Expected textField and valueField options to be set. See http://www.telerik.com/kendo-angular-ui/components/dropdowns/multiselect/#toc-bind-to-arrays-of-complex-data");
        }
    };
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.change = function (event) {
        var _this = this;
        if (isPresent(event.added)) {
            var dataItem = this.data[event.added];
            var newItem = (this.valuePrimitive && isPresent(dataItem[this.valueField])) ? dataItem[this.valueField] :
                dataItem;
            this.value = this.value.concat([newItem]);
        }
        if (isPresent(event.removed)) {
            var dataItem_1 = this.data[event.removed];
            if (this.valuePrimitive) {
                var index = this.value.indexOf(isPresent(dataItem_1[this.valueField]) ? dataItem_1[this.valueField] : dataItem_1);
                this.value.splice(index, 1);
            }
            else {
                this.value = this.value.filter(function (item) { return item[_this.valueField] !== dataItem_1[_this.valueField]; });
            }
        }
        this.emitValueChange();
    };
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.setState = function (value) {
        var objectArray = isObjectArray(value);
        var selection = selectedIndices(this.value, this.data, this.valueField);
        this.selectionService.resetSelection(selection);
        if (this.popupOpen && this.selectionService.focused === undefined && this.data.length) {
            this.selectionService.focused = 0;
        }
        if (this.selectedDataItems.length <= 0) {
            if (this.valuePrimitive && !this.valueField) {
                this.selectedDataItems = value.slice();
            }
            if (objectArray || this.valuePrimitive && this.valueField) {
                this.selectedDataItems = resolveAllValues(value, this.data, this.valueField);
            }
        }
        this.tags = this.selectedDataItems;
    };
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.handleBlur = function () {
        this.wrapperBlurred.emit();
        // this.closePopup();
    };
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.handleFilter = function (text) {
        this.text = text;
        this.searchbar.resizeInput(this.text.length);
        if (this.filterable) {
            this.filterChange.emit(text);
        }
        else {
            this.search(text);
        }
        this.openPopup();
    };
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.handleNavigate = function (event) {
        var navigateInput = this.text && event.keyCode !== Keys.down && event.keyCode !== Keys.up;
        var selectValue = this.text && event.keyCode === Keys.enter || event.keyCode === Keys.esc;
        var deleteTag = !this.text && event.keyCode === Keys.backspace && this.tags.length > 0;
        if (deleteTag) {
            this.handleBackspace();
            return;
        }
        if (this.disabled || navigateInput && !selectValue) {
            return;
        }
        var eventData = event;
        var focused = isNaN(this.selectionService.focused) ? -1 : this.selectionService.focused;
        var action = this.navigationService.process({
            current: focused,
            max: this.data.length - 1,
            min: 0,
            open: this.popupOpen,
            originalEvent: eventData
        });
        if (action !== NavigationAction.Undefined &&
            ((action === NavigationAction.Enter && this.popupOpen) || action !== NavigationAction.Enter)) {
            event.preventDefault();
        }
    };
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.removeTag = function (dataItem) {
        var _this = this;
        var index = selectedIndices([dataItem], this.data, this.valueField)[0];
        if (isNumber(index)) {
            this.selectionService.unselect(index);
            this.popupOpen = false;
        }
        else {
            var filter = function (item) { return item[_this.valueField] !== dataItem[_this.valueField]; };
            this.value = this.value.filter(filter);
            this.tags = this.selectedDataItems = this.selectedDataItems.filter(filter);
            this.emitValueChange();
        }
    };
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.clearAll = function (event) {
        event.stopImmediatePropagation();
        if (this.filterable) {
            this.filterChange.emit("");
        }
        this.value = [];
        this.selectedDataItems = [];
        this.emitValueChange();
        this.setState([]);
    };
    MultiSelectComponent.prototype.ngAfterContentChecked = function () {
        this.verifySettings();
    };
    MultiSelectComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (this.valuePrimitive === undefined) {
            this.valuePrimitive = !this.valueField;
        }
        if (changes.value && this.selectedDataItems.length > 0) {
            //peristed selected data items when list is filtered
            this.selectedDataItems = this.selectedDataItems.concat(this.data).filter(function (curr) {
                return changes.value.currentValue.find(function (item) { return item[_this.valueField] === curr; });
            }).filter(function (dataItem) { return !!dataItem; }); //filter undefined values
        }
        var STATE_PROPS = /(data|value|textField|valueField|valuePrimitive)/g;
        if (STATE_PROPS.test(Object.keys(changes).join())) {
            this.setState(this.value);
        }
    };
    MultiSelectComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.searchbar.resizeInput(Math.max(1, this.placeholder.length));
        this.observableSubscriptions.add(this.searchbar.onFocus.subscribe(function (event) {
            if (!_this.isFocused) {
                _this.isFocused = true;
                _this.onFocus.emit(event);
            }
        }));
        this.observableSubscriptions.add(this.searchbar.onBlur.subscribe(function (event) {
            if (_this.isFocused) {
                _this.isFocused = false;
                _this.onBlur.emit(event);
                _this.onTouchedCallback();
            }
        }));
    };
    MultiSelectComponent.prototype.ngOnDestroy = function () {
        this._toggle(false);
        this.unsubscribeEvents();
    };
    /**
     * Focuses the MultiSelect component.
     */
    MultiSelectComponent.prototype.focus = function () {
        if (!this.disabled) {
            this.searchbar.focus();
        }
    };
    /**
     * Blurs the MultiSelect component.
     */
    MultiSelectComponent.prototype.blur = function () {
        if (!this.disabled) {
            this.searchbar.blur();
        }
    };
    /**
     * Toggles the visibility of the popup. If you use the `toggle` method to open or close the popup, the `open` and `close` events will not be fired.
     *
     * @param open - The state of the popup.
     */
    MultiSelectComponent.prototype.toggle = function (open) {
        var _this = this;
        Promise.resolve(null).then(function () {
            _this._toggle((open === undefined) ? !_this._open : open);
        });
    };
    Object.defineProperty(MultiSelectComponent.prototype, "isOpen", {
        /**
         * Returns the current open state of the popup.
         */
        get: function () {
            return this.popupOpen;
        },
        enumerable: true,
        configurable: true
    });
    //NG MODEL BINDINGS
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.writeValue = function (value) {
        this.value = value || [];
        this.selectedDataItems = [];
        this.setState(this.value);
        this.verifySettings();
    };
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    /**
     * @hidden
     */
    MultiSelectComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    MultiSelectComponent.prototype.subscribeEvents = function () {
        var _this = this;
        if (!isDocumentAvailable()) {
            return;
        }
        this.observableSubscriptions = this.changeSubscription = this.selectionService.onChange.subscribe(this.handleItemChange.bind(this));
        var isOpen = function () { return _this.popupOpen; };
        var isClosed = function () { return !_this.popupOpen; };
        var isTagFocused = function () { return !_this.popupOpen && _this.focusedTagIndex !== undefined; };
        [
            this.navigationService.esc.subscribe(this.closePopup.bind(this)),
            this.navigationService.enter.filter(isOpen).subscribe(this.handleEnter.bind(this)),
            this.navigationService.open.subscribe(this.openPopup.bind(this)),
            this.navigationService.close.subscribe(this.handleClose.bind(this)),
            this.navigationService.up.filter(isOpen).subscribe(function (event) { return _this.handleUp(event.index); }),
            this.navigationService.home.filter(isClosed).subscribe(this.handleHome.bind(this)),
            this.navigationService.end.filter(isClosed).subscribe(this.handleEnd.bind(this)),
            this.navigationService.backspace.filter(isTagFocused).subscribe(this.handleBackspace.bind(this)),
            this.navigationService.delete.filter(isTagFocused).subscribe(this.handleDelete.bind(this)),
            this.navigationService.left.subscribe(this.handleLeftKey.bind(this)),
            this.navigationService.right.subscribe(this.handleRightKey.bind(this)),
            this.navigationService.down.subscribe(function (event) { return _this.handleDownKey(event.index); })
        ].forEach(function (s) { return _this.observableSubscriptions.add(s); });
    };
    MultiSelectComponent.prototype.unsubscribeEvents = function () {
        if (!isDocumentAvailable()) {
            return;
        }
        this.observableSubscriptions.unsubscribe();
    };
    MultiSelectComponent.prototype.handleItemChange = function (event) {
        if (isPresent(event.added)) {
            this.addItem(event.added);
        }
        else if (isPresent(event.removed)) {
            this.removeItem(event.removed);
        }
        this.change(event);
        this.popupOpen = false;
    };
    MultiSelectComponent.prototype.handleEnter = function (event) {
        var focusedIndex = this.selectionService.focused;
        if (this.popupOpen) {
            event.originalEvent.preventDefault();
        }
        if (focusedIndex === -1) {
            return;
        }
        if (this.selectionService.isSelected(focusedIndex)) {
            this.selectionService.unselect(focusedIndex);
        }
        else {
            this.selectionService.add(focusedIndex);
        }
        this.handleFilter('');
        this.popupOpen = false;
    };
    MultiSelectComponent.prototype.handleClose = function () {
        this.closePopup();
        this.searchbar.focus();
    };
    MultiSelectComponent.prototype.handleEnd = function () {
        this.focusedTagIndex = this.tags.length - 1;
    };
    MultiSelectComponent.prototype.handleHome = function () {
        this.focusedTagIndex = 0;
    };
    MultiSelectComponent.prototype.handleUp = function (index) {
        this.selectionService.focused = index;
    };
    MultiSelectComponent.prototype.handleBackspace = function () {
        if (this.focusedTagIndex !== undefined) {
            this.handleDelete();
            return;
        }
        this.focusedTagIndex = this.tags.length - 1;
        var dataItem = this.tags[this.focusedTagIndex];
        var tagIndex = selectedIndices([dataItem], this.data, this.valueField)[0];
        this.selectionService.unselect(tagIndex);
        this.focusedTagIndex = undefined;
        this.searchbar.focus();
    };
    MultiSelectComponent.prototype.handleDelete = function () {
        var dataItem = this.tags[this.focusedTagIndex];
        var tagIndex = selectedIndices([dataItem], this.data, this.valueField)[0];
        this.selectionService.unselect(tagIndex);
        if (this.focusedTagIndex === this.tags.length) {
            this.focusedTagIndex = undefined;
        }
    };
    MultiSelectComponent.prototype.handleLeftKey = function () {
        if (this.direction === 'rtl' && this.focusedTagIndex === 0) {
            this.focusedTagIndex = undefined;
            return;
        }
        if (this.direction === 'rtl' && this.focusedTagIndex === undefined) {
            return;
        }
        if (this.focusedTagIndex === undefined || this.focusedTagIndex < 0) {
            this.focusedTagIndex = this.tags.length - 1;
        }
        else if (this.focusedTagIndex !== 0) {
            this.focusedTagIndex--;
        }
    };
    MultiSelectComponent.prototype.handleDownKey = function (index) {
        if (this.popupOpen) {
            this.selectionService.focused = index || 0;
        }
        else {
            this.openPopup();
        }
    };
    MultiSelectComponent.prototype.handleRightKey = function () {
        var last = this.tags.length - 1;
        if (this.direction === 'rtl' && this.focusedTagIndex === undefined) {
            this.focusedTagIndex = 0;
            return;
        }
        if (this.direction === 'rtl' && this.focusedTagIndex === last) {
            return;
        }
        if (this.focusedTagIndex === last) {
            this.focusedTagIndex = undefined;
        }
        else if (this.focusedTagIndex < last) {
            this.focusedTagIndex++;
        }
    };
    MultiSelectComponent.prototype.addItem = function (index) {
        var dataItem = this.data[index];
        this.selectedDataItems.push(dataItem);
        this.handleFilter('');
    };
    MultiSelectComponent.prototype.removeItem = function (index) {
        var _this = this;
        var indexToRemove = this.selectedDataItems.findIndex(function (item) { return getter(_this.data[index], _this.valueField) === getter(item, _this.valueField); });
        this.selectedDataItems.splice(indexToRemove, 1);
    };
    MultiSelectComponent.prototype.search = function (text) {
        var _this = this;
        var index = this.data.findIndex(function (item) {
            var itemText = getter(item, _this.textField);
            itemText = itemText === undefined ? "" : itemText.toString().toLowerCase();
            return itemText.startsWith(text.toLowerCase());
        });
        this.selectionService.focused = index;
    };
    MultiSelectComponent.prototype.closePopup = function () {
        this.popupOpen = false;
        this.focusedTagIndex = undefined;
    };
    MultiSelectComponent.prototype.openPopup = function () {
        this.popupOpen = true;
        this.focusedTagIndex = undefined;
    };
    MultiSelectComponent.prototype.emitValueChange = function () {
        this.valueChange.emit(this.value);
        this.onChangeCallback(this.value);
    };
    MultiSelectComponent.prototype._toggle = function (open) {
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
            this.popupRef.popupOpen.subscribe(this.popupOpened.bind(this));
            this.popupRef.popupAnchorViewportLeave.subscribe(function () { return _this.popupOpen = false; });
        }
    };
    return MultiSelectComponent;
}());
export { MultiSelectComponent };
MultiSelectComponent.decorators = [
    { type: Component, args: [{
                exportAs: 'kendoMultiSelect',
                providers: [MULTISELECT_VALUE_ACCESSOR, SelectionService, NavigationService],
                selector: 'kendo-multiselect',
                template: "\n        <div class=\"k-multiselect-wrap k-floatwrap\"\n            #wrapper\n            (mousedown)=\"wrapperMousedown($event)\"\n        >\n            <kendo-taglist\n                [tags]=\"tags\"\n                [textField]=\"textField\"\n                [focused]=\"focusedTagIndex\"\n                [disabled]=\"disabled\"\n                [template]=\"tagTemplate\"\n                [activeId]=\"activeId\"\n                (removeTag)=\"removeTag($event)\"\n            >\n            </kendo-taglist>\n            <kendo-searchbar\n                #searchbar\n                [role]=\"'listbox'\"\n                [id]=\"listBoxId\"\n                [activeDescendant]=\"activeId\"\n                [userInput]=\"text\"\n                [disabled]=\"disabled\"\n                [tabIndex]=\"tabIndex\"\n                [popupOpen]=\"popupOpen\"\n                [placeholder]=\"placeholder\"\n                (onNavigate)=\"handleNavigate($event)\"\n                (valueChange)=\"handleFilter($event)\"\n                (onBlur)=\"blurComponent()\"\n                (onFocus)=\"focusComponent()\"\n            >\n            </kendo-searchbar>\n            <span *ngIf=\"!loading && clearButton && tags?.length\" class=\"k-icon k-clear-value k-i-close\" title=\"clear\" role=\"button\" tabindex=\"-1\" (click)=\"clearAll($event)\"></span>\n            <span *ngIf=\"loading\" class=\"k-icon k-i-loading\"></span>\n        </div>\n        <ng-template #popupTemplate>\n            <!--header template-->\n            <ng-template *ngIf=\"headerTemplate\"\n                [templateContext]=\"{\n                    templateRef: headerTemplate.templateRef\n                }\">\n            </ng-template>\n            <!--list-->\n            <kendo-list\n                [id]=\"listBoxId\"\n                [data]=\"data\"\n                [textField]=\"textField\"\n                [valueField]=\"valueField\"\n                [height]=\"popupSettings?.height\"\n                [template]=\"template\"\n                [show]=\"popupOpen\"\n                [multipleSelection]=\"true\"\n                >\n            </kendo-list>\n            <!--no data template-->\n            <div class=\"k-nodata\" *ngIf=\"data.length === 0\">\n                <ng-template [ngIf]=\"noDataTemplate\"\n                    [templateContext]=\"{\n                        templateRef: noDataTemplate ? noDataTemplate.templateRef : undefined\n                    }\">\n                </ng-template>\n                <ng-template [ngIf]=\"!noDataTemplate\">\n                    <div>NO DATA FOUND.</div>\n                </ng-template>\n            </div>\n            <!--footer template-->\n            <ng-template *ngIf=\"footerTemplate\"\n                [templateContext]=\"{\n                    templateRef: footerTemplate.templateRef\n                }\">\n            </ng-template>\n        </ng-template>\n  "
            },] },
];
/** @nocollapse */
MultiSelectComponent.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [RTL,] },] },
    { type: PopupService, },
    { type: SelectionService, },
    { type: NavigationService, },
]; };
MultiSelectComponent.propDecorators = {
    'loading': [{ type: Input },],
    'data': [{ type: Input },],
    'value': [{ type: Input },],
    'valueField': [{ type: Input },],
    'textField': [{ type: Input },],
    'tabIndex': [{ type: Input },],
    'placeholder': [{ type: Input },],
    'disabled': [{ type: Input },],
    'filterable': [{ type: Input },],
    'popupSettings': [{ type: Input },],
    'valuePrimitive': [{ type: Input },],
    'clearButton': [{ type: Input },],
    'filterChange': [{ type: Output },],
    'valueChange': [{ type: Output },],
    'open': [{ type: Output },],
    'close': [{ type: Output },],
    'onFocus': [{ type: Output, args: ['focus',] },],
    'onBlur': [{ type: Output, args: ['blur',] },],
    'searchbar': [{ type: ViewChild, args: [SearchBarComponent,] },],
    'popupTemplate': [{ type: ViewChild, args: ['popupTemplate',] },],
    'wrapper': [{ type: ViewChild, args: ['wrapper',] },],
    'template': [{ type: ContentChild, args: [ItemTemplateDirective,] },],
    'headerTemplate': [{ type: ContentChild, args: [HeaderTemplateDirective,] },],
    'footerTemplate': [{ type: ContentChild, args: [FooterTemplateDirective,] },],
    'tagTemplate': [{ type: ContentChild, args: [TagTemplateDirective,] },],
    'noDataTemplate': [{ type: ContentChild, args: [NoDataTemplateDirective,] },],
    'widgetClasses': [{ type: HostBinding, args: ['class.k-widget',] }, { type: HostBinding, args: ['class.k-multiselect',] }, { type: HostBinding, args: ['class.k-header',] },],
    'dir': [{ type: HostBinding, args: ['attr.dir',] },],
    'focusedClass': [{ type: HostBinding, args: ['class.k-state-focused',] },],
    'disabledClass': [{ type: HostBinding, args: ['class.k-state-disabled',] },],
};
