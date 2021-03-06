import { AggregateDescriptor } from './aggregate.operators';
import { AggregateResult } from '../transducers';
/**
 * The group descriptor used by the `groupBy` method.
 *
 * It has the following properties:
 */
export interface GroupDescriptor {
    /**
     * The data item field to group by.
     */
    field: string;
    /**
     * The sort order of the group.
     */
    dir?: 'asc' | 'desc';
    /**
     * The aggregates which are calculated during grouping.
     */
    aggregates?: Array<AggregateDescriptor>;
}
/**
 * The result of the group operation.
 *
 * It has the following properties:
 */
export interface GroupResult {
    /**
     * Contains either the subgroups, or the data items.
     */
    items: Object[];
    /**
     * Aggregated values for the group. An [`AggregateResult`]({% slug api_kendo-data-query_aggregateresult_kendouiforangular %}) instance.
     */
    aggregates: AggregateResult;
    /**
     * The field by which the data items are grouped.
     */
    field: string;
    /**
     * The group key.
     */
    value: any;
}
