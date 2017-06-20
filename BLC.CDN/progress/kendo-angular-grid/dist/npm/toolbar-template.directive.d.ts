import { TemplateRef } from '@angular/core';
/**
 * Represents the toolbar template of the Grid.
 *
 * @example
 * ```ts-preview
 *
 * @@Component({
 *     selector: 'my-app',
 *     template: `
 *       <div class="example-config">
 *         <input type="radio" id="top" name="position" class="k-radio" value="top" checked (click)="positionChange($event)"/>
 *         <label class="k-radio-label" for="top">Top</label><br/>
 *         <input type="radio" id="bottom" name="position" class="k-radio" value="bottom" (click)="positionChange($event)"/>
 *         <label class="k-radio-label" for="bottom">Bottom</label><br/>
 *         <input type="radio" id="both" name="position" value="both" class="k-radio" (click)="positionChange($event)"/>
 *         <label class="k-radio-label" for="both">Both</label><br/>
 *       </div>
 *       <kendo-grid [data]="gridData" style="height: 200px">
 *            <ng-template kendoGridToolbarTemplate [position]="position">
 *                <button (click)="onClick()" class="k-button">Custom action</button>
 *            </ng-template>
 *            <kendo-grid-column field="ProductName">
 *            </kendo-grid-column>
 *            <kendo-grid-column field="UnitPrice">
 *            </kendo-grid-column>
 *        </kendo-grid>
 *     `
 * })
 *
 * class AppComponent {
 *     public position: 'top' | 'bottom' | 'both' = 'top';
 *
 *     public gridData = [{
 *         "ProductID": 1,
 *         "ProductName": "Chai",
 *         "UnitPrice": 18.0000,
 *         "Discontinued": false
 *       }, {
 *         "ProductID": 2,
 *         "ProductName": "Chang",
 *         "UnitPrice": 19.0000,
 *         "Discontinued": true
 *       }
 *     ];
 *
 *     public onClick(): void {
 *         console.log("button was clicked");
 *     }
 *
 *     public positionChange({ target }): void {
 *        this.position = target.value;
 *     }
 * }
 *
 * ```
 */
export declare class ToolbarTemplateDirective {
    templateRef: TemplateRef<any>;
    _position: 'top' | 'bottom' | 'both';
    /**
     * The position of the toolbar.
     * The possible values are:
     * - `top`&mdash;Positions the toolbar above the group panel or header.
     * - `bottom`&mdash;Positions the toolbar below the pager.
     * - `both`&mdash;Displays two toolbar instances. Positions the first one above
     * the group panel or header and the second one below the pager.
     */
    position: 'top' | 'bottom' | 'both';
    constructor(templateRef: TemplateRef<any>);
}
