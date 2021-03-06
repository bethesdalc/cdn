import { EventEmitter, OnChanges, Renderer, SimpleChanges } from '@angular/core';
import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';
import { MaskingService } from './masking.service';
/**
 * @hidden
 */
export declare const isChanged: (propertyName: string, changes: any, skipFirstChange?: boolean) => boolean;
/**
 * @hidden
 */
export declare const anyChanged: (propertyNames: string[], changes: any, skipFirstChange?: boolean) => boolean;
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
export declare class MaskedTextBoxComponent implements ControlValueAccessor, OnChanges, Validator {
    private service;
    private renderer;
    /**
     * Determines whether the component is disabled.
     */
    disabled: boolean;
    /**
     * Sets the title of the input element.
     */
    title: string;
    direction: string;
    readonly hostClasses: boolean;
    readonly hostFocusedClass: boolean;
    readonly hostDisabledClass: boolean;
    /**
     * Represents the current mask. If no mask is set, the component behaves as a standard `type="text"` input.
     */
    mask: string;
    /**
     * Provides a value for the MaskedTextBox.
     */
    value: string;
    /**
     * Exposes the RegExp-based mask validation array.
     */
    rules: {
        [key: string]: RegExp;
    };
    /**
     * A prompt character for the masked value.
     * @default `_`
     */
    prompt: string;
    /**
     * A character representing an empty position in the raw value.
     * @default ' '
     */
    promptPlaceholder: string;
    /**
     * Indicates whether to include literals in the raw value.
     * @default false
     */
    includeLiterals: boolean;
    /**
     * Determines whether the built-in mask validator is enforced when validating a form.
     * @default true
     */
    maskValidation: boolean;
    /**
     * Sets or gets the `tabIndex` property of the DateInput.
     * .
     */
    tabIndex: number;
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
    onFocus: EventEmitter<any>;
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
    onBlur: EventEmitter<any>;
    /**
     * Fires each time the value changes.
     */
    valueChange: EventEmitter<string>;
    private input;
    private maskedValue;
    private focused;
    private defaultRules;
    private _rules;
    private isPasted;
    private selection;
    protected onChange: (_: any) => void;
    protected onTouched: () => void;
    constructor(service: MaskingService, renderer: Renderer, rtl: boolean);
    /**
     * @hidden
     */
    handleFocus(event: any): void;
    /**
     * @hidden
     */
    handleBlur(event: any): void;
    /**
     * @hidden
     */
    handleDragDrop(): boolean;
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
    focus(): void;
    /**
     * Blurs the MaskedTextBox component.
     */
    blur(): void;
    /**
     * @hidden
     */
    pasteHandler(e: any): void;
    /**
     * @hidden
     */
    inputHandler(e: any): void;
    /**
     * @hidden
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * @hidden
     * Writes a new value to the element.
     */
    writeValue(value: string): void;
    /**
     * @hidden
     * Sets the function that will be called when a `change` event is triggered.
     */
    registerOnChange(fn: (_: any) => void): void;
    /**
     * @hidden
     * Sets the function that will be called when a `touch` event is triggered.
     */
    registerOnTouched(fn: () => void): void;
    /**
     * @hidden
     * Called when the status of the component changes to or from `disabled`.
     * Depending on the value, it enables or disables the appropriate DOM element.
     *
     * @param isDisabled
     */
    setDisabledState(isDisabled: boolean): void;
    /**
     * @hidden
     */
    validate(_: AbstractControl): any;
    private updateValue(maskedValue);
    private updateInput(maskedValue?, selection?);
    private extractChanges(changes);
    private updateService(extra?);
}
