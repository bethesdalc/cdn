"use strict";
var utils_1 = require('../utils');
var funcs_1 = require('../funcs');
var set = function (field, target, value) {
    target[field] = value;
    return target;
};
var convert = function (mapper) { return function (values) { return Object.keys(values).reduce(mapper.bind(null, values), {}); }; };
var translateAggregate = convert(function (source, acc, field) { return set(field.toLowerCase(), acc, source[field]); });
var translateAggregates = convert(function (source, acc, field) { return set(field, acc, translateAggregate(source[field])); });
var valueOrDefault = function (value, defaultValue) { return utils_1.isPresent(value) ? value : defaultValue; };
var normalizeGroup = function (group) { return ({
    aggregates: group.Aggregates || group.aggregates,
    field: group.Member || group.member || group.field,
    hasSubgroups: group.HasSubgroups || group.hasSubgroups || false,
    items: group.Items || group.items,
    value: valueOrDefault(group.Key, valueOrDefault(group.key, group.value))
}); };
var translateGroup = funcs_1.compose(function (_a) {
    var field = _a.field, hasSubgroups = _a.hasSubgroups, value = _a.value, aggregates = _a.aggregates, items = _a.items;
    return ({
        aggregates: translateAggregates(aggregates),
        field: field,
        items: hasSubgroups ? items.map(translateGroup) : items,
        value: value
    });
}, normalizeGroup);
/**
 * Converts the grouped result returned into the `Data` field of UI for ASP.NET MVC ToDataSourceResult method to comparable format.
 * @param data Value of the Data field of the response.
 * @returns {GroupResult[]} The converted result.
 */
exports.translateDataSourceResultGroups = function (data) { return data.map(translateGroup); };
/**
 * Converts the `AggregateResults` field content returned by the UI for ASP.NET MVC ToDataSourceResult method to comparable format.
 * @param data Value of the AggregateResults field of the response
 * @returns {AggregateResult} The converted result
 */
exports.translateAggregateResults = function (data) { return ((data || []).reduce(function (acc, x) { return set(x.Member, acc, set(x.AggregateMethodName.toLowerCase(), acc[x.Member] || {}, x.Value)); }, {})); };
