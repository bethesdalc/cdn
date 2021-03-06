"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
/**
 * Represents a component which is to accommodate the filter operators.
 */
var FilterCellOperatorsComponent = (function () {
    function FilterCellOperatorsComponent() {
        /**
         * @hidden
         */
        /**
         * The filter operators that will be shown.
         */
        this.operators = [];
        /**
         * Determines if the operators list will be shown.
         * @type {boolean}
         */
        this.showOperators = true;
        /**
         * Fires when the operator is selected.
         * @type {EventEmitter<string>}
         */
        this.valueChange = new core_1.EventEmitter();
        /**
         * Fires when the **Clear** button is clicked.
         * @type {EventEmitter<{}>}
         */
        this.clear = new core_1.EventEmitter();
    }
    Object.defineProperty(FilterCellOperatorsComponent.prototype, "hostClasses", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    FilterCellOperatorsComponent.prototype.onChange = function (dataItem) {
        this.valueChange.emit(dataItem);
    };
    /**
     * @hidden
     */
    FilterCellOperatorsComponent.prototype.clearClick = function () {
        this.clear.emit();
    };
    return FilterCellOperatorsComponent;
}());
FilterCellOperatorsComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'kendo-grid-filter-cell-operators',
                template: "\n        <kendo-dropdownlist\n            *ngIf=\"showOperators\"\n            [data]=\"operators\"\n            class=\"k-dropdown-operator\"\n            (valueChange)=\"onChange($event)\"\n            [value]=\"value\"\n            [iconClass]=\"'k-i-filter'\"\n            [valuePrimitive]=\"true\"\n            [textField]=\"'text'\"\n            [popupSettings]=\"{ width: 'auto' }\"\n            [valueField]=\"'value'\">\n        </kendo-dropdownlist>\n        <button *ngIf=\"showButton\"\n            type=\"button\"\n            class=\"k-button k-button-icon\"\n            title=\"Clear\"\n            (click)=\"clearClick()\">\n                <span class=\"k-icon k-i-filter-clear\"></span>\n        </button>\n    "
            },] },
];
/** @nocollapse */
FilterCellOperatorsComponent.ctorParameters = function () { return []; };
FilterCellOperatorsComponent.propDecorators = {
    'hostClasses': [{ type: core_1.HostBinding, args: ['class.k-filtercell-operator',] },],
    'operators': [{ type: core_1.Input },],
    'showButton': [{ type: core_1.Input },],
    'showOperators': [{ type: core_1.Input },],
    'value': [{ type: core_1.Input },],
    'valueChange': [{ type: core_1.Output },],
    'clear': [{ type: core_1.Output },],
};
exports.FilterCellOperatorsComponent = FilterCellOperatorsComponent;
