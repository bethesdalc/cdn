import { ColumnComponent } from '../column.component';
import { FilterService } from './filter.service';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { BaseFilterCellComponent } from './base-filter-cell.component';
import { FilterComponent } from './filter-component.interface';
import { LocalizationService } from '@progress/kendo-angular-l10n';
/**
 * Represents a numeric filter cell.
 *
 * @example
 *  ```ts-no-run
 *      <kendo-grid-column field="ProductName" title="Product Name">
 *          <ng-template kendoGridFilterCellTemplate let-filter let-column="column">
 *          <kendo-grid-numeric-filter-cell
 *              [column]="column"
 *              [filter]="filter">
 *          </kendo-grid-numeric-filter-cell>
 *          </ng-template>
 *      </kendo-grid-column>
 *   ```
 */
export declare class NumericFilterCellComponent extends BaseFilterCellComponent implements FilterComponent {
    protected localization: LocalizationService;
    /**
     * Determines if the drop-down filter operators should be shown. The default value is `true`.
     * @type {boolean}
     */
    showOperators: boolean;
    /**
     * The column with which the filter is associated.
     * @type {ColumnComponent}
     */
    column: ColumnComponent;
    /**
     * The current root filter.
     * @type {CompositeFilterDescriptor}
     */
    filter: CompositeFilterDescriptor;
    /**
     * The default filter operator. Defaults to `eq`.
     * @type {string}
     */
    operator: string;
    /**
     * Specifies the value used to increment or decrement the component value.
     * @type {numeric}
     */
    step: number;
    /**
     * Specifies the smallest value that is valid.
     * @type {number}
     */
    min: number;
    /**
     * Specifies the greatest value that is valid.
     * @type {number}
     */
    max: number;
    /**
     * Specifies whether the **Up** and **Down** spin buttons should be rendered.
     * @type {boolean}
     */
    spinners: boolean;
    /**
     * Specifies the number precision applied to the component value when it is focused.
     * If the user enters a number with a greater precision than is currently configured, the component value is rounded.
     *
     * @type {number}
     */
    decimals: number;
    /**
     * Specifies the number format used when the component is not focused.
     * By default, the `column.format` value is used, if set.
     *
     * @readonly
     * @type {string}
     */
    /**
     * Specifies the number format used when the component is not focused.
     * By default, the `column.format` value is used, if set.
     */
    format: string;
    /**
     * The current filter for the associated column field.
     * @readonly
     * @type {FilterDescriptor}
     */
    readonly currentFilter: FilterDescriptor;
    /**
     * The current filter operator for the associated column field.
     * @readonly
     * @type {string}
     */
    readonly currentOperator: string;
    protected defaultOperators: Array<{
        text: string;
        value: string;
    }>;
    private readonly columnFormat;
    private _format;
    constructor(filterService: FilterService, localization: LocalizationService);
}
