"use strict";
var filter_descriptor_interface_1 = require('../filtering/filter-descriptor.interface');
var utils_1 = require('../utils');
var accessor_1 = require('../accessor');
var funcs_1 = require('../funcs');
var filter_serialization_common_1 = require('../filter-serialization.common');
var prefixWith = function (key) { return function (value) { return (key + "=" + value); }; };
var empty = function () { return ""; };
var isNotEmptyArray = function (value) { return utils_1.isPresent(value) && utils_1.isArray(value) && value.length > 0; };
var has = function (accessor) { return function (value) { return utils_1.isPresent(accessor(value)); }; };
var isNotEmpty = function (accessor) { return function (value) { return isNotEmptyArray(accessor(value)); }; };
var runOrEmpty = function (predicate, fn) { return funcs_1.either(predicate, fn, empty); };
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
var take = accessor_1.getter("take");
var aggregates = accessor_1.getter("aggregates");
var skip = accessor_1.getter("skip");
var group = accessor_1.getter("group");
var sort = accessor_1.getter("sort", true);
var formatSort = formatDescriptors(sort, directionFormatter);
var formatGroup = formatDescriptors(group, directionFormatter);
var formatAggregates = formatDescriptors(aggregates, aggregateFormatter);
var removeAfter = function (what) { return function (str) { return str.slice(0, str.indexOf(what)); }; };
var replace = function (patterns) {
    return funcs_1.compose.apply(void 0, patterns.map(function (_a) {
        var left = _a[0], right = _a[1];
        return function (s) { return s.replace(new RegExp(left, "g"), right); };
    }));
};
var sanitizeDateLiterals = replace([["\"", ""], [":", "-"]]);
var removeAfterDot = removeAfter(".");
var formatDate = function (_a) {
    var field = _a.field, value = _a.value, ignoreCase = _a.ignoreCase, operator = _a.operator;
    return ({
        value: removeAfterDot(sanitizeDateLiterals(JSON.stringify(filter_serialization_common_1.toUTC(value)))),
        field: field,
        ignoreCase: ignoreCase,
        operator: operator
    });
};
var normalizeSort = function (state) { return Object.assign({}, state, {
    sort: (sort(state) || []).filter(function (_a) {
        var dir = _a.dir;
        return utils_1.isNotNullOrEmptyString(dir);
    })
}); };
var transformSkip = funcs_1.compose(prefixWith('page'), calcPage);
var transformTake = funcs_1.compose(prefixWith('pageSize'), take);
var transformGroup = funcs_1.compose(prefixWith('group'), formatGroup);
var transformSort = funcs_1.compose(prefixWith('sort'), formatSort);
var transformAggregates = funcs_1.compose(prefixWith('aggregate'), formatAggregates);
var serializePage = runOrEmpty(has(skip), transformSkip);
var serializePageSize = runOrEmpty(has(take), transformTake);
var serializeGroup = runOrEmpty(isNotEmpty(group), transformGroup);
var serializeAggregates = runOrEmpty(has(aggregates), transformAggregates);
var serializeSort = funcs_1.compose(runOrEmpty(isNotEmpty(sort), transformSort), normalizeSort);
var hasField = function (_a) {
    var field = _a.field;
    return utils_1.isNotNullOrEmptyString(field);
};
var filterFormatter = function (_a) {
    var field = _a.field, operator = _a.operator, value = _a.value;
    return (field + "~" + operator + "~" + value);
};
var dateFormatter = funcs_1.either(filter_serialization_common_1.isDateValue, funcs_1.compose(filterFormatter, formatDate), filterFormatter);
var typedFormatter = runOrEmpty(hasField, funcs_1.either(filter_serialization_common_1.isStringValue, funcs_1.compose(filterFormatter, filter_serialization_common_1.quote), dateFormatter));
var join = function (_a) {
    var logic = _a.logic;
    return ("~" + logic + "~");
};
var serialize = filter_serialization_common_1.serializeFilters(function (filter) { return funcs_1.either(filter_descriptor_interface_1.isCompositeFilterDescriptor, serialize, typedFormatter)(filter); }, join);
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
exports.toDataSourceRequestString = function (state) { return (Object.keys(state)
    .map(rules(state))
    .filter(utils_1.isNotNullOrEmptyString)
    .join('&')); };
