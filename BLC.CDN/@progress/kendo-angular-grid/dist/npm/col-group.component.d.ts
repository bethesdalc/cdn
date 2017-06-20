import { GroupDescriptor } from '@progress/kendo-data-query';
import { ColumnComponent } from './column.component';
import { DetailTemplateDirective } from './detail-template.directive';
/**
 * @hidden
 */
export declare class ColGroupComponent {
    columns: Array<ColumnComponent>;
    groups: Array<GroupDescriptor>;
    detailTemplate: DetailTemplateDirective;
}
