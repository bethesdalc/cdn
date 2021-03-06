import { State } from '../state';
import { AggregateDescriptor } from '../grouping/aggregate.operators';
/**
 * Represents the operation descriptors to be send.
 */
export declare type DataSourceRequestState = State & {
    /**
     * The descriptors used for aggregation.
     * @type {Array<AggregateDescriptor>}
     */
    aggregates?: Array<AggregateDescriptor>;
};
/**
 * Converts a [`DataSourceRequestState`]({% slug api_kendo-data-query_datasourcerequeststate_kendouiforangular %}) into string
 * comparable with UI for ASP.NET MVC DataSourceRequest format.
 *
 * @param {DataRequestState} state The state to be serialized.
 * @returns {string} The serialized state.
 * @example
 * ```ts-no-run
 *  import {
 *      toDataSourceRequestString,
 *      translateDataSourceResultGroups,
 *      translateAggregateResults
 * } from '@progress/kendo-data-query';
 *
 * export class Service {
 *  private BASE_URL: string = '...';
 *
 *  constructor(private http: Http) { }
 *
 *  // omitted for brevity..
 *
 *  private fetch(state: DataSourceRequestState): Observable<DataResult> {
 *   const queryStr = `${toDataSourceRequestString(state)}`; //serialize the state
 *   const hasGroups = state.group && state.group.length;
 *
 *   return this.http
 *       .get(`${this.BASE_URL}?${queryStr}`) //send the state to the server
 *       .map(response => response.json())
 *       .map(({Data, Total, AggregateResults}) => // process the response
 *           (<GridDataResult>{
 *               //if there are groups convert them to compatible format
 *               data: hasGroups ? translateDataSourceResultGroups(Data) : Data,
 *               total: Total,
 *               // convert the aggregates if such exists
 *               aggregateResult: translateAggregateResults(AggregateResults)
 *           })
 *       );
 *  }
 * }
 * ```
 */
export declare const toDataSourceRequestString: (state: DataSourceRequestState) => string;
