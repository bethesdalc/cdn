"use strict";
var filter_descriptor_interface_1 = require('./filtering/filter-descriptor.interface');
var funcs_1 = require('./funcs');
var filter_serialization_common_1 = require('./filter-serialization.common');
var fnFormatter = function (operator) { return function (_a) {
    var field = _a.field, value = _a.value;
    return (operator + "(" + field + "," + value + ")");
}; };
var singleOperatorFormatter = function (operator) { return function (_a) {
    var field = _a.field, value = _a.value;
    return (field + " " + operator + " " + value);
}; };
var stringFormat = function (formatter) { return funcs_1.compose(formatter, filter_serialization_common_1.quote, filter_serialization_common_1.toLower, filter_serialization_common_1.normalizeField); };
var stringFnOperator = function (operator) { return stringFormat(fnFormatter(operator)); };
var stringOperator = function (operator) { return stringFormat(singleOperatorFormatter(operator)); };
var numericOperator = function (operator) { return funcs_1.compose(singleOperatorFormatter(operator), filter_serialization_common_1.normalizeField); };
var dateOperator = function (operator) { return funcs_1.compose(singleOperatorFormatter(operator), filter_serialization_common_1.normalizeField, filter_serialization_common_1.formatDate); };
var ifDate = function (operator) { return funcs_1.either(filter_serialization_common_1.isDateValue, dateOperator(operator), numericOperator(operator)); };
var typedOperator = function (operator) { return funcs_1.either(filter_serialization_common_1.isStringValue, stringOperator(operator), ifDate(operator)); };
var appendEqual = function (str) { return (str + " eq -1"); };
var filterOperators = {
    contains: stringFnOperator("contains"),
    doesnotcontain: funcs_1.compose(appendEqual, stringFnOperator("indexof")),
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
var serializeAll = filter_serialization_common_1.serializeFilters(function (filter) { return funcs_1.either(filter_descriptor_interface_1.isCompositeFilterDescriptor, serializeAll, serialize)(filter); }, join);
/**
 * @hidden
 */
exports.serializeFilter = function (filter) {
    if (filter.filters && filter.filters.length) {
        return "$filter=" + serializeAll(filter);
    }
    return "";
};
