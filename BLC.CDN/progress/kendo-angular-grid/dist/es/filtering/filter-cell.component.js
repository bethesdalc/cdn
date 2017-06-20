import { Component, Input } from '@angular/core';
import { isPresent, isNullOrEmptyString } from '../utils';
/**
 * @hidden
 */
var FilterCellComponent = (function () {
    function FilterCellComponent() {
        this._templateContext = {};
    }
    Object.defineProperty(FilterCellComponent.prototype, "templateContext", {
        get: function () {
            this._templateContext.column = this.column;
            this._templateContext.filter = this.filter;
            // tslint:disable-next-line:no-string-literal
            this._templateContext["$implicit"] = this.filter;
            return this._templateContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilterCellComponent.prototype, "hasTemplate", {
        get: function () {
            return isPresent(this.column.filterCellTemplateRef);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilterCellComponent.prototype, "isFilterable", {
        get: function () {
            return isPresent(this.column) && !isNullOrEmptyString(this.column.field) && this.column.filterable;
        },
        enumerable: true,
        configurable: true
    });
    return FilterCellComponent;
}());
export { FilterCellComponent };
FilterCellComponent.decorators = [
    { type: Component, args: [{
                selector: '[kendoGridFilterCell]',
                template: "\n        <ng-template [ngIf]=\"isFilterable\">\n            <ng-container [ngSwitch]=\"hasTemplate\">\n                <ng-container *ngSwitchCase=\"false\">\n                    <ng-container kendoFilterHost [column]=\"column\" [filter]=\"filter\"></ng-container>\n                </ng-container>\n                <ng-container *ngSwitchCase=\"true\">\n                    <ng-template\n                        *ngIf=\"column.filterCellTemplateRef\"\n                        [ngTemplateOutlet]=\"column.filterCellTemplateRef\"\n                        [ngOutletContext]=\"templateContext\">\n                    </ng-template>\n                </ng-container>\n            </ng-container>\n        </ng-template>\n    "
            },] },
];
/** @nocollapse */
FilterCellComponent.ctorParameters = function () { return []; };
FilterCellComponent.propDecorators = {
    'column': [{ type: Input },],
    'filter': [{ type: Input },],
};
