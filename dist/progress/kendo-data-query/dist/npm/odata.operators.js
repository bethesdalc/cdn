"use strict";
var utils_1 = require('./utils');
var odata_filtering_operators_1 = require('./odata-filtering.operators');
var serializeSort = function (orderby) {
    var str = orderby
        .filter(function (sort) { return utils_1.isPresent(sort.dir); })
        .map(function (sort) {
        var order = sort.field.replace(/\./g, "/");
        return sort.dir === "desc" ? order + " desc" : order;
    }).join(",");
    return str ? "$orderby=" + str : str;
};
var rules = function (key, state) { return ({
    "filter": odata_filtering_operators_1.serializeFilter(state.filter || {}),
    "skip": "$skip=" + state.skip,
    "sort": serializeSort(state.sort || []),
    "take": "$top=" + state.take
}[key]); };
/**
 * Converts a [`State`]({% slug api_kendo-data-query_state_kendouiforangular %}) into an OData v4 compatible string.
 *
 * @param {State} state - The state to be serialized.
 * @returns {string} - The serialized state.
 */
exports.toODataString = function (state) { return (Object.keys(state)
    .map(function (x) { return rules(x, state); })
    .filter(utils_1.isNotNullOrEmptyString)
    .join('&')); };
