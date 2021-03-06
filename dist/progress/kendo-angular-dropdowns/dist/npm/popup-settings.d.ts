/**
 * Used for configuring the dimensions of the popup container.
 *
 * @example
 * ```ts
 * @@Component({
 * selector: 'my-app',
 * template: `
 *  <kendo-dropdownlist [data]="listItems" [popupSettings]="{ height: 300, width: 300 }">
 *  </kendo-dropdownlist>
 * `
 * })
 * class AppComponent {
 *   public listItems: Array<string> = ["Item 1", "Item 2", "Item 3", "Item 4"];
 * }
 * ```
 */
export interface PopupSettings {
    /**
     * Controls the popup animation. By default, the open and close animations are enabled.
     */
    animate?: boolean;
    /**
     * Specifies a list of CSS classes used for styling the popup.
     */
    popupClass?: string;
    /**
     * Sets the popup width. By default, it is equal to the width of the component.
     * If set to `auto`, the component automatically adjusts the width of the popup, so no item labels are wrapped.
     */
    width?: number | string;
    /**
     * Sets the maximum height of the popup.
     */
    height?: number;
}
