import { ContentChildren, QueryList, HostBinding } from '@angular/core';
import { isCompositeFilterDescriptor } from '@progress/kendo-data-query';
import { isPresent, observe } from '../utils';
import { FilterOperatorBase, toJSON } from './operators/filter-operator.base';
var flatten = function (filter) {
    if (isPresent(filter.filters)) {
        return filter.filters.reduce(function (acc, curr) {
            return acc.concat(isCompositeFilterDescriptor(curr) ? flatten(curr) : [curr]);
        }, []);
    }
    return [];
};
var trimFilterByField = function (filter, field) {
    if (isPresent(filter) && isPresent(filter.filters)) {
        filter.filters = filter.filters.filter(function (x) {
            if (isCompositeFilterDescriptor(x)) {
                trimFilterByField(x, field);
                return x.filters.length;
            }
            else {
                return x.field !== field;
            }
        });
    }
};
/**
 * @hidden
 */
export var localizeOperators = function (operators) { return function (localization) { return Object.keys(operators).map(function (key) { return ({
    text: localization.get(key),
    value: operators[key]
}); }); }; };
/**
 * An abstract base class for the filter-cell component.
 */
var BaseFilterCellComponent = (function () {
    function BaseFilterCellComponent(filterService) {
        this.filterService = filterService;
        this.operatorList = new QueryList();
    }
    Object.defineProperty(BaseFilterCellComponent.prototype, "hostClasses", {
        /**
         * @hidden
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFilterCellComponent.prototype, "operators", {
        get: function () {
            return this._operators.length ? this._operators : this.defaultOperators;
        },
        set: function (values) {
            this._operators = values;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    BaseFilterCellComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.operationListSubscription = observe(this.operatorList)
            .map(toJSON)
            .subscribe(function (x) {
            _this.operators = x;
        });
    };
    BaseFilterCellComponent.prototype.ngOnDestroy = function () {
        if (this.operationListSubscription) {
            this.operationListSubscription.unsubscribe();
        }
    };
    BaseFilterCellComponent.prototype.filterByField = function (field) {
        var currentFilter = this.filtersByField(field)[0];
        return currentFilter;
    };
    BaseFilterCellComponent.prototype.filtersByField = function (field) {
        return flatten(this.filter || {}).filter(function (x) { return x.field === field; });
    };
    BaseFilterCellComponent.prototype.removeFilter = function (field) {
        trimFilterByField(this.filter, field);
        return this.filter;
    };
    BaseFilterCellComponent.prototype.updateFilter = function (filter) {
        var root = this.filter || {
            filters: [],
            logic: "and"
        };
        var currentFilter = flatten(root).filter(function (x) { return x.field === filter.field; })[0];
        if (!isPresent(currentFilter)) {
            root.filters.push(filter);
        }
        else {
            Object.assign(currentFilter, filter);
        }
        return root;
    };
    BaseFilterCellComponent.prototype.applyFilter = function (filter) {
        this.filterService.filter(filter);
    };
    return BaseFilterCellComponent;
}());
export { BaseFilterCellComponent };
BaseFilterCellComponent.propDecorators = {
    'hostClasses': [{ type: HostBinding, args: ['class.k-filtercell',] },],
    'operatorList': [{ type: ContentChildren, args: [FilterOperatorBase,] },],
};
