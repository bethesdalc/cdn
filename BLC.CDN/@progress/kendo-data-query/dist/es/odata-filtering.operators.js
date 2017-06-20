import { isCompositeFilterDescriptor } from './filtering/filter-descriptor.interface';
import { compose, either } from './funcs';
import { formatDate, normalizeField, quote, toLower, isDateValue, isStringValue, serializeFilters } from './filter-serialization.common';
var fnFormatter = function (operator) { return function (_a) {
    var field = _a.field, value = _a.value;
    return (operator + "(" + field + "," + value + ")");
}; };
var singleOperatorFormatter = function (operator) { return function (_a) {
    var field = _a.field, value = _a.value;
    return (field + " " + operator + " " + value);
}; };
var stringFormat = function (formatter) { return compose(formatter, quote, toLower, normalizeField); };
var stringFnOperator = function (operator) { return stringFormat(fnFormatter(operator)); };
var stringOperator = function (operator) { return stringFormat(singleOperatorFormatter(operator)); };
var numericOperator = function (operator) { return compose(singleOperatorFormatter(operator), normalizeField); };
var dateOperator = function (operator) { return compose(singleOperatorFormatter(operator), normalizeField, formatDate); };
var ifDate = function (operator) { return either(isDateValue, dateOperator(operator), numericOperator(operator)); };
var typedOperator = function (operator) { return either(isStringValue, stringOperator(operator), ifDate(operator)); };
var appendEqual = function (str) { return (str + " eq -1"); };
var filterOperators = {
    contains: stringFnOperator("contains"),
    doesnotcontain: compose(appendEqual, stringFnOperator("indexof")),
    endswith: stringFnOperator("endswith"),
    eq: typedOperator("eq"),
    gt: typedOperator("gt"),
    gte: typedOperator("ge"),
    isempty: function (_a) {
        var field = _a.field;
        return (field + " eq ''");
    },
    isnotempty: function (_a) {
        var field = _a.field;
        return (field + " ne ''");
    },
    isnotnull: function (_a) {
        var field = _a.field;
        return (field + " ne null");
    },
    isnull: function (_a) {
        var field = _a.field;
        return (field + " eq null");
    },
    lt: typedOperator("lt"),
    lte: typedOperator("le"),
    neq: typedOperator("ne"),
    startswith: stringFnOperator("startswith")
};
var join = function (x) { return (" " + x.logic + " "); };
var serialize = function (x) { return filterOperators[x.operator](x); };
var serializeAll = serializeFilters(function (filter) { return either(isCompositeFilterDescriptor, serializeAll, serialize)(filter); }, join);
/**
 * @hidden
 */
export var serializeFilter = function (filter) {
    if (filter.filters && filter.filters.length) {
        return "$filter=" + serializeAll(filter);
    }
    return "";
};
