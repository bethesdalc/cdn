import { ColumnComponent } from './column.component';
import { DetailTemplateDirective } from './detail-template.directive';
import { GroupDescriptor } from '@progress/kendo-data-query';
/**
 * @hidden
 */
export declare class FooterComponent {
    columns: Array<ColumnComponent>;
    groups: Array<GroupDescriptor>;
    detailTemplate: DetailTemplateDirective;
    scrollable: boolean;
    lockedColumnsCount: number;
    readonly footerClass: boolean;
}
