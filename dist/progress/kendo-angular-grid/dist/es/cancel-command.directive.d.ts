import { EditService } from './edit.service';
import { CellContext } from './cell-context';
/**
 * Represents the `cancel` command of the Grid.
 *
 * You can apply this directive to any `button` element inside a
 * [`CommandColumnComponent`]({% slug api_grid_commandcolumncomponent_kendouiforangular %}).
 *
 * When an associated button with the directive is clicked, the
 * [`cancel`]({% slug api_grid_gridcomponent_kendouiforangular %}#toc-cancel) event
 * is triggered. For more information, refer to the [editing example]({% slug editing_grid_kendouiforangular %}).
 *
 * @example
 * ```ts-no-run
 * <kendo-grid>
 *   <kendo-grid-command-column title="command">
 *     <ng-template kendoGridCellTemplate>
 *       <button kendoGridCancelCommand>Cancel changes</button>
 *     </ng-template>
 *   </kendo-grid-command-column>
 * </kendo-grid>
 * ```
 * > When the row is not in the edit mode, the button with the `kendoGridCancelCommand` is automatically hidden.
 *
 * You can control the content of the button based on the state of the row.
 * @example
 * ```ts-no-run
 * <kendo-grid>
 *   <kendo-grid-command-column title="command">
 *     <ng-template kendoGridCellTemplate let-isNew="isNew">
 *       <button kendoGridCancelCommand>{{isNew ? 'Discard' : 'Cancel changes'}}</button>
 *     </ng-template>
 *   </kendo-grid-command-column>
 * </kendo-grid>
 * ```
 */
export declare class CancelCommandDirective {
    private editService;
    rowIndex: number;
    /**
     * @hidden
     */
    click(): void;
    /**
     * @hidden
     */
    readonly visible: string;
    /**
     * @hidden
     */
    readonly buttonClass: boolean;
    /**
     * @hidden
     */
    readonly commandClass: boolean;
    constructor(editService: EditService, cellContext: CellContext);
}
