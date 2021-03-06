"use strict";
/* tslint:disable:no-null-keyword */
/* tslint:disable:no-bitwise */
/* tslint:disable:align */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 */
exports.isPresent = function (value) { return value !== null && value !== undefined; };
/**
 * @hidden
 */
exports.isNumber = function (value) { return !isNaN(value); };
/**
 * @hidden
 */
exports.isChanged = function (propertyName, changes) { return (changes[propertyName] && !changes[propertyName].isFirstChange() &&
    changes[propertyName].previousValue !== changes[propertyName].currentValue); };
/**
 * @hidden
 */
exports.guid = function () {
    var id = "";
    var i;
    var random;
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            id += "-";
        }
        id += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return id;
};
/**
 * @hidden
 */
exports.combineStr = function (begin, end) {
    return begin.concat(end.substr(end.toLowerCase().indexOf(begin.toLowerCase()) + begin.length));
};
/**
 * @hidden
 */
exports.isDocumentAvailable = function () { return typeof document !== 'undefined'; };
/**
 * @hidden
 */
exports.isArray = function (value) { return Array.isArray(value); };
/**
 * @hidden
 */
exports.isObject = function (value) { return typeof value === 'object'; };
/**
 * @hidden
 */
exports.resolveValuesInArray = function (values, data, valueField) {
    if (data === void 0) { data = []; }
    return data.filter(function (curr) {
        return values.some(function (item) { return item === curr[valueField]; });
    });
};
/**
 * @hidden
 */
exports.validateComplexValues = function (values, valueField) {
    return exports.isArray(values) && values.filter(function (item) {
        return exports.isObject(item) && item[valueField];
    });
};
/**
 * @hidden
 */
exports.resolveAllValues = function (value, data, valueField) {
    var customValues = exports.validateComplexValues(value, valueField) || [];
    var resolvedValues = exports.resolveValuesInArray(value, data, valueField) || [];
    return resolvedValues.concat(customValues);
};
/**
 * @hidden
 */
exports.isObjectArray = function (values) {
    return exports.isArray(values) && values.some(function (item) { return exports.isObject(item); });
};
/**
 * @hidden
 */
exports.selectedIndices = function (values, data, valueField) {
    var extractedValues = data.map(function (item) {
        return exports.isPresent(item[valueField]) ? item[valueField] : item;
    });
    return values.reduce(function (arr, item) {
        var value = exports.isPresent(item[valueField]) ? item[valueField] : item;
        var index = extractedValues.indexOf(value);
        if (index !== -1) {
            arr.push(index);
        }
        return arr;
    }, []);
};
/**
 * @hidden
 */
exports.getter = function (dataItem, field, usePrimitive) {
    if (usePrimitive === void 0) { usePrimitive = false; }
    if (exports.isPresent(dataItem)) {
        if (usePrimitive) {
            return field && exports.isPresent(dataItem[field]) ? dataItem[field] : dataItem;
        }
        else {
            return field ? dataItem[field] : dataItem;
        }
    }
};
/**
 * @hidden
 */
exports.resolveValue = function (args) {
    var dataItem;
    if (exports.isPresent(args.value)) {
        dataItem = args.data.find(function (element) { return exports.getter(element, args.valueField) === args.value; });
        return {
            dataItem: dataItem,
            focused: args.data.indexOf(dataItem),
            selected: args.data.indexOf(dataItem)
        };
    }
    else if (args.index) {
        dataItem = args.data[args.index];
        return {
            dataItem: args.data[args.index],
            focused: args.index,
            selected: args.index
        };
    }
    return {
        dataItem: args.defaultItem,
        focused: -1,
        selected: -1
    };
};
