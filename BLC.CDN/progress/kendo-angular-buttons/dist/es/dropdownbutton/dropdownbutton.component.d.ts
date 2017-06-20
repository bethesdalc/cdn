import { TemplateRef, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { Align, PopupService, PopupRef } from '@progress/kendo-angular-popup';
import { PopupSettings } from '../listbutton/popup-settings';
import { ButtonItemTemplateDirective } from '../listbutton/button-item-template.directive';
import { Direction } from '../direction';
import { ListButton } from '../listbutton/list-button';
import { ListComponent } from '../listbutton/list.component';
import { FocusService } from '../focusable/focus.service';
import { NavigationService } from '../navigation/navigation.service';
import { PreventableEvent } from '../preventable-event';
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
export declare class DropDownButtonComponent extends ListButton {
    private popupService;
    /**
     * Defines the name of an existing icon in the Kendo UI theme.
     */
    icon: string;
    /**
     * Defines the list of CSS classes used for styling the Button with custom icons.
     */
    iconClass: string;
    /**
     * Defines a URL for styling the button with a custom image.
     */
    imageUrl: string;
    /**
     * Configures the popup of the DropDownButton.
     *
     * The available options are:
     * - `animate`&mdash;Enables or disables the popup animation.
     * - `popupClass`&mdash;Specifies the list of CSS classes used for styling the popup.
     */
    popupSettings: PopupSettings;
    /**
     * Sets the data item field that represents the item text.
     * If the data contains only primitive values, do not define it.
     */
    textField: string;
    /**
     * Sets the disabled state of the DropDownButton.
     */
    disabled: boolean;
    /**
     * Sets or gets the data of the DropDownButton.
     *
     * > The data has to be provided in an array-like list.
     */
    data: any;
    /**
     * @hidden
     */
    /**
     * @hidden
     */
    openState: boolean;
    /**
     * @hidden
     */
    readonly componentTabIndex: number;
    /**
     * Specifies the [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of the component.
     */
    tabIndex: number;
    /**
     * Fires each time the user clicks on a drop-down list item. The event data contains the data item bound to the clicked list item.
     */
    itemClick: EventEmitter<any>;
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
     * Fires each time the user focuses the DropDownButton component.
     */
    onFocus: EventEmitter<any>;
    /**
     * Fires each time the DropDownButton component gets blurred.
     */
    onBlur: EventEmitter<any>;
    readonly focused: boolean;
    readonly widgetClasses: boolean;
    readonly dir: Direction;
    /**
     * @hidden
     */
    readonly active: boolean;
    itemTemplate: ButtonItemTemplateDirective;
    button: ElementRef;
    buttonList: ListComponent;
    popupTemplate: TemplateRef<any>;
    popupRef: PopupRef;
    listId: string;
    private direction;
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
    mousedown(event: any): void;
    /**
     * @hidden
     */
    openPopup(): void;
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
    /**
     * @hidden
     */
    handleFocus(): void;
    /**
     * @hidden
     */
    wrapperContains(element: any): boolean;
    protected subscribeNavigationEvents(): void;
    private onNavigationEnterPress();
    private onNavigationEnterUp();
    private onNavigationOpen();
    private onNavigationClose();
    private onArrowKeyNavigate(index);
    private _toggle(open);
}
