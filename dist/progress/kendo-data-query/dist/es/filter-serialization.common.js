import { isString, isDate } from './utils';
/**
 * @hidden
 * Creates a single arity function which based on the provided predicate wrapps the value
 * @example
 * ```
 * wrapIf(() => ignoreCase) `tolower(${field})`
 * //ignoreCase=true -> tolower(${field})`
 * //ignoreCase=false -> ${field}`
 * ```
 */
export var wrapIf = function (predicate) { return function (str) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return predicate() ? "" + str[0] + args[0] + str[1] : args[0];
}; };
/**
 * @hidden
 */
export var toUTC = function (date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
};
/**
 * @hidden
 */
export var quote = function (_a) {
    var field = _a.field, value = _a.value, ignoreCase = _a.ignoreCase, operator = _a.operator;
    return ({
        value: "'" + value.replace(/'/g, "''") + "'",
        field: field,
        ignoreCase: ignoreCase,
        operator: operator
    });
};
/**
 * @hidden
 */
export var formatDate = function (_a) {
    var field = _a.field, value = _a.value, ignoreCase = _a.ignoreCase, operator = _a.operator;
    return ({
        value: JSON.stringify(toUTC(value)).replace(/"/g, ""),
        field: field,
        ignoreCase: ignoreCase,
        operator: operator
    });
};
/**
 * @hidden
 */
export var toLower = function (_a) {
    var field = _a.field, value = _a.value, ignoreCase = _a.ignoreCase, operator = _a.operator;
    return ({
        field: (_b = ["tolower(", ")"], _b.raw = ["tolower(", ")"], wrapIf(function () { return ignoreCase; })(_b, field)),
        value: value,
        ignoreCase: ignoreCase,
        operator: operator
    });
    var _b;
};
/**
 * @hidden
 */
export var normalizeField = function (_a) {
    var field = _a.field, value = _a.value, ignoreCase = _a.ignoreCase, operator = _a.operator;
    return ({
        value: value,
        field: field.replace(/\./g, "/"),
        ignoreCase: ignoreCase,
        operator: operator
    });
};
/**
 * @hidden
 */
export var isStringValue = function (x) { return isString(x.value); };
/**
 * @hidden
 */
export var isDateValue = function (x) { return isDate(x.value); };
/**
 * @hidden
 */
export var serializeFilters = function (map, join) { return function (filter) {
    var brackets = wrapIf(function () { return filter.filters.length > 1; });
    return (_a = ["(", ")"], _a.raw = ["(", ")"], brackets(_a, filter.filters
        .map(map)
        .join(join(filter))));
    var _a;
}; };
