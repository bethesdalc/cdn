/**
 * Represents the Kendo UI DropDownButton and SplitButton items model. These are the interface fields that the items use.
 *
 * @example
 * ```ts
 * @@Component({
 * selector: 'my-app',
 * template: `
 *  <kendo-splitbutton [data]="listItems">SplitButton</kendo-splitbutton>
 * `
 * })
 * class AppComponent {
 *   public listItems: Array<any> = [{
 *      text: 'item1',
 *      icon: 'refresh',
 *      click: (dataItem: any) => {
 *          //action
 *      }
 *  }, {
 *      text: 'item2',
 *      iconClass: 'test icon class',
 *      click: (dataItem: any) => {
 *          //action
 *      }
 *  }, {
 *      text: 'item3',
 *      imageUrl: 'http://demos.telerik.com/kendo-ui/content/web/toolbar/upload.png',
 *      click: (dataItem: any) => {
 *          //action
 *      }
 *  }, {
 *      text: 'item4',
 *      disabled: true,
 *      click: (dataItem: any) => {
 *          //action
 *      }
 *  }]
 * }
 * ```
 */
export interface ListItemModel {
    /**
     * Sets the text of the item.
     */
    text?: string;
    /**
     * Defines an icon to be rendered next to the title.
     */
    icon?: string;
    /**
     * Defines an icon with a custom CSS class to be rendered next to the title.
     */
    iconClass?: string;
    /**
     * Defines the location of an image to be displayed next to the title.
     */
    imageUrl?: string;
    /**
     * Disables a button list item when set to `true`.
     */
    disabled?: boolean;
    /**
     * Event handler emitted when an item is clicked.
     */
    click?: (dataItem?: any) => void;
}
