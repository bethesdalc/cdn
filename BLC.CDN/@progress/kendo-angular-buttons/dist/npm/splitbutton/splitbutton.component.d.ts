import { ElementRef, TemplateRef, EventEmitter, AfterViewInit, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import { Align, PopupService, PopupRef } from '@progress/kendo-angular-popup';
import { ListButton } from './../listbutton/list-button';
import { PopupSettings } from './../listbutton/popup-settings';
import { ButtonItemTemplateDirective } from './../listbutton/button-item-template.directive';
import { FocusService } from './../focusable/focus.service';
import { NavigationService } from './../navigation/navigation.service';
import { PreventableEvent } from '../preventable-event';
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
export declare class SplitButtonComponent extends ListButton implements AfterViewInit, OnChanges {
    private popupService;
    /**
     * Sets the text of the SplitButton.
     */
    text: string;
    /**
     * Defines an icon to be rendered next to the button text.
     */
    icon: string;
    /**
     * Defines an icon with a custom CSS class to be rendered next to the button text.
     */
    iconClass: string;
    /**
     * Defines the location of an image to be displayed next to the button text.
     */
    imageUrl: string;
    /**
     * When set to `true`, disables a SplitButton item.
     */
    disabled: boolean;
    /**
     * Configures the popup of the SplitButton.
     *
     * The available options are:
     * - `animate`&mdash;Enables or disables the popup animation.
     * - `popupClass`&mdash;Specifies a list of CSS classes used for styling the popup.
     */
    popupSettings: PopupSettings;
    /**
     * Specifies the [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of the component.
     */
    tabIndex: number;
    /**
     * Configures the text field of the button-list popup.
     */
    textField: string;
    /**
     * Sets the data of the SplitButton.
     *
     * > The data has to be provided in an array-like list.
     */
    data: any;
    /**
     * Fires each time the user clicks the main button.
     */
    buttonClick: EventEmitter<any>;
    /**
     * Fires each time the user clicks on the drop-down list. The event data contains the data item bound to the clicked list item.
     */
    itemClick: EventEmitter<any>;
    /**
     * Fires each time the user focuses the SplitButton component.
     */
    onFocus: EventEmitter<any>;
    /**
     * Fires each time the SplitButton component gets blurred.
     */
    onBlur: EventEmitter<any>;
    /**
     * Fires each time the popup is about to open.
     * This event is preventable. If you cancel the event, the popup will remain closed.
     */
    open: EventEmitter<PreventableEvent>;
    /**
     * Fires each time the popup is about to close.
     * This event is preventable. If you cancel the event, the popup will remain opened.
     */
    close: EventEmitter<PreventableEvent>;
    /**
     * An item template that helps to customize the item content.
     */
    itemTemplate: ButtonItemTemplateDirective;
    button: ElementRef;
    popupTemplate: TemplateRef<any>;
    popupRef: PopupRef;
    /**
     * @hidden
     */
    /**
     * @hidden
     */
    openState: boolean;
    listId: string;
    /**
     * @hidden
     */
    readonly active: boolean;
    /**
     * @hidden
     */
    readonly componentTabIndex: number;
    private buttonText;
    private direction;
    isFocused: boolean;
    readonly widgetClasses: boolean;
    readonly dir: string;
    /**
     * @hidden
     */
    readonly ariaLabel: string;
    /**
     * @hidden
     */
    onButtonFocus(): void;
    /**
     * @hidden
     */
    onButtonClick(): void;
    /**
     * @hidden
     */
    keydown(event: any): void;
    /**
     * @hidden
     */
    keypress(event: any): void;
    /**
     * @hidden
     */
    keyup(event: any): void;
    /**
     * @hidden
     */
    ngAfterViewInit(): void;
    /**
     * @hidden
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * @hidden
     */
    togglePopupVisibility(): void;
    /**
     * @hidden
     */
    wrapperContains(element: any): boolean;
    /**
     * @hidden
     */
    readonly anchorAlign: Align;
    /**
     * @hidden
     */
    readonly popupAlign: Align;
    /**
     * Focuses the DropDownButton component.
     */
    focus(): void;
    /**
     * Blurs the DropDownButton component.
     */
    blur(): void;
    constructor(focusService: FocusService, navigationService: NavigationService, wrapperRef: ElementRef, zone: NgZone, popupService: PopupService, rtl: boolean);
    /**
     * Toggles the visibility of the popup.
     * If `toggle` method is used to open or close the popup, the `open` and `close` events will not be fired.
     *
     * @param open The state of the popup.
     */
    toggle(open: boolean): void;
    /**
     * Returns the current open state of the popup.
     */
    readonly isOpen: boolean;
    protected enterHanlder(): void;
    private updateButtonText();
    private _toggle(open);
}
