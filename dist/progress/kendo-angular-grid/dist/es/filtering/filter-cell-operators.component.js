import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
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
        this.valueChange = new EventEmitter();
        /**
         * Fires when the **Clear** button is clicked.
         * @type {EventEmitter<{}>}
         */
        this.clear = new EventEmitter();
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
export { FilterCellOperatorsComponent };
FilterCellOperatorsComponent.decorators = [
    { type: Component, args: [{
                selector: 'kendo-grid-filter-cell-operators',
                template: "\n        <kendo-dropdownlist\n            *ngIf=\"showOperators\"\n            [data]=\"operators\"\n            class=\"k-dropdown-operator\"\n            (valueChange)=\"onChange($event)\"\n            [value]=\"value\"\n            [iconClass]=\"'k-i-filter'\"\n            [valuePrimitive]=\"true\"\n            [textField]=\"'text'\"\n            [popupSettings]=\"{ width: 'auto' }\"\n            [valueField]=\"'value'\">\n        </kendo-dropdownlist>\n        <button *ngIf=\"showButton\"\n            type=\"button\"\n            class=\"k-button k-button-icon\"\n            title=\"Clear\"\n            (click)=\"clearClick()\">\n                <span class=\"k-icon k-i-filter-clear\"></span>\n        </button>\n    "
            },] },
];
/** @nocollapse */
FilterCellOperatorsComponent.ctorParameters = function () { return []; };
FilterCellOperatorsComponent.propDecorators = {
    'hostClasses': [{ type: HostBinding, args: ['class.k-filtercell-operator',] },],
    'operators': [{ type: Input },],
    'showButton': [{ type: Input },],
    'showOperators': [{ type: Input },],
    'value': [{ type: Input },],
    'valueChange': [{ type: Output },],
    'clear': [{ type: Output },],
};
