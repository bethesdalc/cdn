/* tslint:disable:no-null-keyword */
/* tslint:disable:no-bitwise */
/* tslint:disable:align */
/**
 * @hidden
 */
export var isPresent = function (value) { return value !== null && value !== undefined; };
/**
 * @hidden
 */
export var isNumber = function (value) { return !isNaN(value); };
/**
 * @hidden
 */
export var isChanged = function (propertyName, changes) { return (changes[propertyName] && !changes[propertyName].isFirstChange() &&
    changes[propertyName].previousValue !== changes[propertyName].currentValue); };
/**
 * @hidden
 */
export var guid = function () {
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
export var combineStr = function (begin, end) {
    return begin.concat(end.substr(end.toLowerCase().indexOf(begin.toLowerCase()) + begin.length));
};
/**
 * @hidden
 */
export var isDocumentAvailable = function () { return typeof document !== 'undefined'; };
/**
 * @hidden
 */
export var isArray = function (value) { return Array.isArray(value); };
/**
 * @hidden
 */
export var isObject = function (value) { return typeof value === 'object'; };
/**
 * @hidden
 */
export var resolveValuesInArray = function (values, data, valueField) {
    if (data === void 0) { data = []; }
    return data.filter(function (curr) {
        return values.some(function (item) { return item === curr[valueField]; });
    });
};
/**
 * @hidden
 */
export var validateComplexValues = function (values, valueField) {
    return isArray(values) && values.filter(function (item) {
        return isObject(item) && item[valueField];
    });
};
/**
 * @hidden
 */
export var resolveAllValues = function (value, data, valueField) {
    var customValues = validateComplexValues(value, valueField) || [];
    var resolvedValues = resolveValuesInArray(value, data, valueField) || [];
    return resolvedValues.concat(customValues);
};
/**
 * @hidden
 */
export var isObjectArray = function (values) {
    return isArray(values) && values.some(function (item) { return isObject(item); });
};
/**
 * @hidden
 */
export var selectedIndices = function (values, data, valueField) {
    var extractedValues = data.map(function (item) {
        return isPresent(item[valueField]) ? item[valueField] : item;
    });
    return values.reduce(function (arr, item) {
        var value = isPresent(item[valueField]) ? item[valueField] : item;
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
export var getter = function (dataItem, field, usePrimitive) {
    if (usePrimitive === void 0) { usePrimitive = false; }
    if (isPresent(dataItem)) {
        if (usePrimitive) {
            return field && isPresent(dataItem[field]) ? dataItem[field] : dataItem;
        }
        else {
            return field ? dataItem[field] : dataItem;
        }
    }
};
/**
 * @hidden
 */
export var resolveValue = function (args) {
    var dataItem;
    if (isPresent(args.value)) {
        dataItem = args.data.find(function (element) { return getter(element, args.valueField) === args.value; });
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
