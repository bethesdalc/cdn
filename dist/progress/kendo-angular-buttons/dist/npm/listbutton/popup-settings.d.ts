/**
 * Used for configuring the popup settings.
 *
 * @example
 * ```ts
 * @@Component({
 * selector: 'my-app',
 * template: `
 * <kendo-splitbutton [data]="listItems" [popupSettings]="{ animate: animate, popupClass: popupClass }">
 *    SplitButton
 * </kendo-splitbutton>
 * `
 * })
 * class AppComponent {
 *   public animate: boolean = false;
 *   public popupClass: string = 'customClass';
 *   public listItems: Array<any> = [{
 *      text: 'item1'
 *  }, {
 *      text: 'item2'
 *  }]
 * }
 * ```
 */
export interface PopupSettings {
    /**
     * Controls the popup animation. By default, the open and close animation are enabled.
     */
    animate: boolean;
    /**
     * Specifies a list of CSS classes used for styling the popup.
     */
    popupClass?: string;
}
