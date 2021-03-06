"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var kendo_angular_l10n_1 = require("@progress/kendo-angular-l10n");
var masking_service_1 = require("./masking.service");
var resolvedPromise = Promise.resolve(null);
/**
 * @hidden
 */
exports.isChanged = function (propertyName, changes, skipFirstChange) {
    if (skipFirstChange === void 0) { skipFirstChange = true; }
    return (changes[propertyName] && (!changes[propertyName].isFirstChange() || !skipFirstChange) &&
        changes[propertyName].previousValue !== changes[propertyName].currentValue);
};
/**
 * @hidden
 */
exports.anyChanged = function (propertyNames, changes, skipFirstChange) {
    if (skipFirstChange === void 0) { skipFirstChange = true; }
    return propertyNames.some(function (name) { return exports.isChanged(name, changes, skipFirstChange); });
};
/**
 * Represents the Kendo UI MaskedTextBox component for Angular.
 *
 * @example
 * ```ts-preview
 *
 * @@Component({
 *     selector: 'my-app',
 *     template: `
 *      <kendo-maskedtextbox
 *          [mask]="mask1"
 *          [value]="value2">
 *      </kendo-maskedtextbox>
 *     `
 * })
 *
 * class AppComponent {
 *  public value1: number = 9580128055807792;
 *  public mask1: string = "0000-0000-0000-0000";
 * }
 * ```
 */
var MaskedTextBoxComponent = (function () {
    function MaskedTextBoxComponent(service, renderer, rtl) {
        this.service = service;
        this.renderer = renderer;
        /**
         * Determines whether the component is disabled.
         */
        this.disabled = false;
        /**
         * A prompt character for the masked value.
         * @default `_`
         */
        this.prompt = '_';
        /**
         * A character representing an empty position in the raw value.
         * @default ' '
         */
        this.promptPlaceholder = ' ';
        /**
         * Indicates whether to include literals in the raw value.
         * @default false
         */
        this.includeLiterals = false;
        /**
         * Determines whether the built-in mask validator is enforced when validating a form.
         * @default true
         */
        this.maskValidation = true;
        /**
         * Sets or gets the `tabIndex` property of the DateInput.
         * .
         */
        this.tabIndex = 0;
        /**
         * Fires each time the user focuses the input element.
         *
         * @example
         * ```ts
         * @@Component({
         * selector: 'my-app',
         * template: `
         *  <kendo-maskedtextbox (focus)="handleFocus()"></kendo-maskedtextbox>
         * `
         * })
         * class AppComponent {
         *   public handleFocus(): void {
         *      console.log("Component is focused");
         *   }
         * }
         * ```
         *
         * > To wire the event programmatically, use the `onFocus` property.
         */
        this.onFocus = new core_1.EventEmitter(); //tslint:disable-line:no-output-rename
        /**
         * Fires each time the input element gets blurred.
         *
         * @example
         * ```ts
         * @@Component({
         * selector: 'my-app',
         * template: `
         *  <kendo-maskedtextbox (blur)="handleBlur()"></kendo-maskedtextbox>
         * `
         * })
         * class AppComponent {
         *   public handleBlur(): void {
         *      console.log("Component is blurred");
         *   }
         * }
         * ```
         *
         * > To wire the event programmatically, use the `onBlur` property.
         */
        this.onBlur = new core_1.EventEmitter(); //tslint:disable-line:no-output-rename
        /**
         * Fires each time the value changes.
         */
        this.valueChange = new core_1.EventEmitter();
        this.focused = false;
        this.defaultRules = {
            "#": /[\d\s\+\-]/,
            "&": /[\S]/,
            "0": /[\d]/,
            "9": /[\d\s]/,
            "?": /[a-zA-Z\s]/,
            "A": /[a-zA-Z0-9]/,
            "C": /./,
            "L": /[a-zA-Z]/,
            "a": /[a-zA-Z0-9\s]/
        };
        this.isPasted = false;
        this.selection = [0, 0];
        this.onChange = function (_) { };
        this.onTouched = function () { };
        this.direction = rtl ? 'rtl' : 'ltr';
        this.updateService();
    }
    Object.defineProperty(MaskedTextBoxComponent.prototype, "hostClasses", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MaskedTextBoxComponent.prototype, "hostFocusedClass", {
        get: function () {
            return this.focused;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MaskedTextBoxComponent.prototype, "hostDisabledClass", {
        get: function () {
            return this.disabled;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MaskedTextBoxComponent.prototype, "rules", {
        /**
         * Exposes the RegExp-based mask validation array.
         */
        get: function () {
            return this._rules || this.defaultRules;
        },
        set: function (value) {
            this._rules = Object.assign({}, this.defaultRules, value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    MaskedTextBoxComponent.prototype.handleFocus = function (event) {
        this.focused = true;
        this.onFocus.emit(event);
    };
    /**
     * @hidden
     */
    MaskedTextBoxComponent.prototype.handleBlur = function (event) {
        this.focused = false;
        this.onBlur.emit(event);
        this.onTouched();
    };
    /**
     * @hidden
     */
    MaskedTextBoxComponent.prototype.handleDragDrop = function () {
        return false;
    };
    /**
     * Focuses the MaskedTextBox component.
     *
     * @example
     * ```ts
     * @@Component({
     * selector: 'my-app',
     * template: `
     *  <button (click)="maskedinput.focus()">Focus the input</button>
     *  <kendo-maskedtextbox #maskedinput></kendo-maskedtextbox>
     * `
     * })
     * class AppComponent { }
     * ```
     */
    MaskedTextBoxComponent.prototype.focus = function () {
        if (!this.input) {
            return;
        }
        this.renderer.invokeElementMethod(this.input.nativeElement, "focus");
    };
    /**
     * Blurs the MaskedTextBox component.
     */
    MaskedTextBoxComponent.prototype.blur = function () {
        if (!this.input) {
            return;
        }
        this.renderer.invokeElementMethod(this.input.nativeElement, "blur");
    };
    /**
     * @hidden
     */
    MaskedTextBoxComponent.prototype.pasteHandler = function (e) {
        var _a = e.target, selectionStart = _a.selectionStart, selectionEnd = _a.selectionEnd;
        if (selectionEnd === selectionStart) {
            return;
        }
        this.isPasted = true;
        this.selection = [selectionStart, selectionEnd];
    };
    /**
     * @hidden
     */
    MaskedTextBoxComponent.prototype.inputHandler = function (e) {
        var value = e.target.value;
        var _a = this.selection, start = _a[0], end = _a[1];
        if (!this.mask) {
            this.updateValue(value);
            this.isPasted = false;
            return;
        }
        var result;
        if (this.isPasted) {
            this.isPasted = false;
            var rightPart = this.maskedValue.length - end;
            var to = value.length - rightPart;
            result = this.service.maskInRange(value.slice(start, to), this.maskedValue, start, end);
        }
        else {
            result = this.service.maskInput(value, this.maskedValue, e.target.selectionStart);
        }
        this.updateInput(result.value, result.selection);
        this.updateValue(result.value);
    };
    /**
     * @hidden
     */
    MaskedTextBoxComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (!this.mask) {
            this.updateInput(this.value);
            return;
        }
        var next = this.extractChanges(changes);
        this.updateService(next);
        if (exports.isChanged('value', changes)) {
            var maskedValue = this.service.maskRaw(this.value);
            if (maskedValue !== this.maskedValue) {
                this.updateInput(maskedValue);
            }
        }
        else if (exports.anyChanged(['promptPlaceholder', 'includeLiterals'], changes)) {
            resolvedPromise.then(function () {
                _this.updateValue(_this.maskedValue);
            });
        }
        else {
            this.updateInput(this.service.maskRaw(this.value));
        }
    };
    /**
     * @hidden
     * Writes a new value to the element.
     */
    MaskedTextBoxComponent.prototype.writeValue = function (value) {
        this.value = value === null ? '' : value;
        this.updateInput(this.service.maskRaw(this.value));
    };
    /**
     * @hidden
     * Sets the function that will be called when a `change` event is triggered.
     */
    MaskedTextBoxComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    /**
     * @hidden
     * Sets the function that will be called when a `touch` event is triggered.
     */
    MaskedTextBoxComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * @hidden
     * Called when the status of the component changes to or from `disabled`.
     * Depending on the value, it enables or disables the appropriate DOM element.
     *
     * @param isDisabled
     */
    MaskedTextBoxComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    /**
     * @hidden
     */
    MaskedTextBoxComponent.prototype.validate = function (_) {
        if (this.maskValidation === false || !this.mask) {
            return null;
        }
        if (!this.service.validationValue(this.maskedValue)) {
            return null;
        }
        if (this.maskedValue.indexOf(this.prompt) !== -1) {
            return {
                patternError: {
                    mask: this.mask,
                    maskedValue: this.maskedValue,
                    value: this.value
                }
            };
        }
        return null;
    };
    MaskedTextBoxComponent.prototype.updateValue = function (maskedValue) {
        if (this.mask && !this.service.validationValue(maskedValue)) {
            this.value = '';
        }
        else {
            this.value = this.service.rawValue(maskedValue);
        }
        this.valueChange.emit(this.value);
        this.onChange(this.value);
    };
    MaskedTextBoxComponent.prototype.updateInput = function (maskedValue, selection) {
        if (maskedValue === void 0) { maskedValue = ''; }
        this.maskedValue = maskedValue;
        this.renderer.setElementProperty(this.input.nativeElement, "value", maskedValue);
        if (selection !== undefined) {
            this.renderer.invokeElementMethod(this.input.nativeElement, "setSelectionRange", [selection, selection]);
        }
    };
    MaskedTextBoxComponent.prototype.extractChanges = function (changes) {
        return Object.keys(changes).filter(function (key) { return key !== 'rules'; }).reduce(function (obj, key) {
            obj[key] = changes[key].currentValue;
            return obj;
        }, {}); // tslint:disable-line:align
    };
    MaskedTextBoxComponent.prototype.updateService = function (extra) {
        var config = Object.assign({
            includeLiterals: this.includeLiterals,
            mask: this.mask,
            prompt: this.prompt,
            promptPlaceholder: this.promptPlaceholder,
            rules: this.rules
        }, extra); // tslint:disable-line:align
        this.service.update(config);
    };
    return MaskedTextBoxComponent;
}());
MaskedTextBoxComponent.decorators = [
    { type: core_1.Component, args: [{
                exportAs: 'kendoMaskedTextBox',
                providers: [
                    masking_service_1.MaskingService,
                    {
                        multi: true,
                        provide: forms_1.NG_VALUE_ACCESSOR,
                        useExisting: core_1.forwardRef(function () { return MaskedTextBoxComponent; }) /* tslint:disable-line */
                    },
                    {
                        multi: true,
                        provide: forms_1.NG_VALIDATORS,
                        useExisting: core_1.forwardRef(function () { return MaskedTextBoxComponent; }) /* tslint:disable-line */
                    }
                ],
                selector: 'kendo-maskedtextbox',
                template: "\n        <input type=\"text\"\n            #input\n            autocomplete=\"off\"\n            autocorrect=\"off\"\n            autocapitalize=\"off\"\n            spellcheck=\"false\"\n            class=\"k-textbox\"\n            [tabindex]=\"tabIndex\"\n            [attr.title]=\"title\"\n            [disabled]=\"disabled\"\n            (focus)=\"handleFocus($event)\"\n            (blur)=\"handleBlur($event)\"\n            (dragstart)=\"handleDragDrop()\"\n            (drop)=\"handleDragDrop()\"\n        />\n    "
            },] },
];
/** @nocollapse */
MaskedTextBoxComponent.ctorParameters = function () { return [
    { type: masking_service_1.MaskingService, },
    { type: core_1.Renderer, },
    { type: undefined, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [kendo_angular_l10n_1.RTL,] },] },
]; };
MaskedTextBoxComponent.propDecorators = {
    'disabled': [{ type: core_1.Input },],
    'title': [{ type: core_1.Input },],
    'direction': [{ type: core_1.HostBinding, args: ['attr.dir',] },],
    'hostClasses': [{ type: core_1.HostBinding, args: ['class.k-widget',] }, { type: core_1.HostBinding, args: ['class.k-maskedtextbox',] },],
    'hostFocusedClass': [{ type: core_1.HostBinding, args: ['class.k-state-focused',] },],
    'hostDisabledClass': [{ type: core_1.HostBinding, args: ['class.k-state-disabled',] },],
    'mask': [{ type: core_1.Input },],
    'value': [{ type: core_1.Input },],
    'rules': [{ type: core_1.Input },],
    'prompt': [{ type: core_1.Input },],
    'promptPlaceholder': [{ type: core_1.Input },],
    'includeLiterals': [{ type: core_1.Input },],
    'maskValidation': [{ type: core_1.Input },],
    'tabIndex': [{ type: core_1.Input },],
    'onFocus': [{ type: core_1.Output, args: ['focus',] },],
    'onBlur': [{ type: core_1.Output, args: ['blur',] },],
    'valueChange': [{ type: core_1.Output },],
    'input': [{ type: core_1.ViewChild, args: ['input',] },],
    'pasteHandler': [{ type: core_1.HostListener, args: ['paste', ['$event'],] },],
    'inputHandler': [{ type: core_1.HostListener, args: ['input', ['$event'],] },],
};
exports.MaskedTextBoxComponent = MaskedTextBoxComponent;
