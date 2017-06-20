import { ColumnComponent } from '../column.component';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
/**
 * @hidden
 */
export interface FilterComponent {
    column: ColumnComponent;
    filter: CompositeFilterDescriptor;
}
