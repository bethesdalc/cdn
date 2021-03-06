import { isCompositeFilterDescriptor } from '../filtering/filter-descriptor.interface';
import { isPresent, isNotNullOrEmptyString, isArray } from '../utils';
import { getter } from '../accessor';
import { compose, either } from '../funcs';
import { isStringValue, isDateValue, quote, serializeFilters, toUTC } from '../filter-serialization.common';
var prefixWith = function (key) { return function (value) { return (key + "=" + value); }; };
var empty = function () { return ""; };
var isNotEmptyArray = function (value) { return isPresent(value) && isArray(value) && value.length > 0; };
var has = function (accessor) { return function (value) { return isPresent(accessor(value)); }; };
var isNotEmpty = function (accessor) { return function (value) { return isNotEmptyArray(accessor(value)); }; };
var runOrEmpty = function (predicate, fn) { return either(predicate, fn, empty); };
var calcPage = function (_a) {
    var skip = _a.skip, take = _a.take;
    return Math.floor((skip || 0) / take) + 1;
};
var formatDescriptors = function (accessor, formatter) { return function (state) { return (accessor(state).map(formatter).join("~")); }; };
var directionFormatter = function (_a) {
    var field = _a.field, _b = _a.dir, dir = _b === void 0 ? "asc" : _b;
    return (field + "-" + dir);
};
var aggregateFormatter = function (_a) {
    var field = _a.field, aggregate = _a.aggregate;
    return (field + "-" + aggregate);
};
var take = getter("take");
var aggregates = getter("aggregates");
var skip = getter("skip");
var group = getter("group");
var sort = getter("sort", true);
var formatSort = formatDescriptors(sort, directionFormatter);
var formatGroup = formatDescriptors(group, directionFormatter);
var formatAggregates = formatDescriptors(aggregates, aggregateFormatter);
var removeAfter = function (what) { return function (str) { return str.slice(0, str.indexOf(what)); }; };
var replace = function (patterns) {
    return compose.apply(void 0, patterns.map(function (_a) {
        var left = _a[0], right = _a[1];
        return function (s) { return s.replace(new RegExp(left, "g"), right); };
    }));
};
var sanitizeDateLiterals = replace([["\"", ""], [":", "-"]]);
var removeAfterDot = removeAfter(".");
var formatDate = function (_a) {
    var field = _a.field, value = _a.value, ignoreCase = _a.ignoreCase, operator = _a.operator;
    return ({
        value: removeAfterDot(sanitizeDateLiterals(JSON.stringify(toUTC(value)))),
        field: field,
        ignoreCase: ignoreCase,
        operator: operator
    });
};
var normalizeSort = function (state) { return Object.assign({}, state, {
    sort: (sort(state) || []).filter(function (_a) {
        var dir = _a.dir;
        return isNotNullOrEmptyString(dir);
    })
}); };
var transformSkip = compose(prefixWith('page'), calcPage);
var transformTake = compose(prefixWith('pageSize'), take);
var transformGroup = compose(prefixWith('group'), formatGroup);
var transformSort = compose(prefixWith('sort'), formatSort);
var transformAggregates = compose(prefixWith('aggregate'), formatAggregates);
var serializePage = runOrEmpty(has(skip), transformSkip);
var serializePageSize = runOrEmpty(has(take), transformTake);
var serializeGroup = runOrEmpty(isNotEmpty(group), transformGroup);
var serializeAggregates = runOrEmpty(has(aggregates), transformAggregates);
var serializeSort = compose(runOrEmpty(isNotEmpty(sort), transformSort), normalizeSort);
var hasField = function (_a) {
    var field = _a.field;
    return isNotNullOrEmptyString(field);
};
var filterFormatter = function (_a) {
    var field = _a.field, operator = _a.operator, value = _a.value;
    return (field + "~" + operator + "~" + value);
};
var dateFormatter = either(isDateValue, compose(filterFormatter, formatDate), filterFormatter);
var typedFormatter = runOrEmpty(hasField, either(isStringValue, compose(filterFormatter, quote), dateFormatter));
var join = function (_a) {
    var logic = _a.logic;
    return ("~" + logic + "~");
};
var serialize = serializeFilters(function (filter) { return either(isCompositeFilterDescriptor, serialize, typedFormatter)(filter); }, join);
var serializeFilter = function (_a) {
    var filter = _a.filter;
    if (filter && filter.filters) {
        var filters = serialize(filter);
        if (filters.length) {
            return "filter=" + filters;
        }
    }
    return "";
};
var rules = function (state) { return function (key) { return ({
    "aggregates": serializeAggregates(state),
    "filter": serializeFilter(state),
    "group": serializeGroup(state),
    "skip": serializePage(state),
    "sort": serializeSort(state),
    "take": serializePageSize(state)
}[key]); }; };
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
export var toDataSourceRequestString = function (state) { return (Object.keys(state)
    .map(rules(state))
    .filter(isNotNullOrEmptyString)
    .join('&')); };
