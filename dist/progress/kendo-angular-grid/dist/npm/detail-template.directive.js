"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
/**
 * Represents the detail template of the Grid.
 * Provides additional details about a particular data row by expanding or collapsing its content.
 * The detail template does not work with locked columns and requires you to set the `detailRowHeight` option for virtual scrolling.
 *
 * To define the detail template, nest an `<ng-template>` tag with the `kendoGridDetailTemplate` directive inside a `<kendo-grid>` tag.
 * The template context is set to the current data item and the following additional fields are passed:
 * - `dataItem`&mdash;Defines the current data item.
 * - `rowIndex`&mdash;Defines the current row index.
 *
 * &nbsp;
 *
 * @example
 * ```ts-preview
 *
 * @@Component({
 *   selector: 'my-app',
 *   template: `
 *       <kendo-grid
 *         [data]="data"
 *         selectable="true"
 *         style="height: 160px"
 *         >
 *         <kendo-grid-column field="ProductID"></kendo-grid-column>
 *         <kendo-grid-column field="ProductName"></kendo-grid-column>
 *         <kendo-grid-column field="UnitPrice"></kendo-grid-column>
 *         <ng-template kendoGridDetailTemplate let-dataItem>
 *           <div *ngIf="dataItem.Category">
 *             <header>{{dataItem.Category?.CategoryName}}</header>
 *             <span>{{dataItem.Category?.Description}}</span>
 *           </div>
 *         </ng-template>
 *       </kendo-grid>
 *   `
 * })
 *
 * class AppComponent {
 *     public data = [{
 *         "ProductID": 1,
 *         "ProductName": "Chai",
 *         "UnitPrice": 18.0000,
 *         "Discontinued": false,
 *         "Category": {
 *             "CategoryID": 1,
 *             "CategoryName": "Beverages",
 *             "Description": "Soft drinks, coffees, teas, beers, and ales"
 *         }
 *       }, {
 *         "ProductID": 2,
 *         "ProductName": "Chang",
 *         "UnitPrice": 19.0000,
 *         "Discontinued": false,
 *         "Category": {
 *             "CategoryID": 1,
 *             "CategoryName": "Beverages",
 *             "Description": "Soft drinks, coffees, teas, beers, and ales"
 *         }
 *       }, {
 *         "ProductID": 3,
 *         "ProductName": "Aniseed Syrup",
 *         "UnitPrice": 10.0000,
 *         "Discontinued": false,
 *         "Category": {
 *             "CategoryID": 2,
 *             "CategoryName": "Condiments",
 *             "Description": "Sweet and savory sauces, relishes, spreads, and seasonings"
 *         }
 *     }];
 *
 * }
 *
 * ```
 *
 * &nbsp;
 *
 * To indicate if a detail row should be displayed, specify the
 * [`DetailTemplateShowIfFn`]({% slug api_grid_detailtemplateshowiffn_kendouiforangular %}) setting.
 *
 * ```ts-no-run
 *    <div *kendoGridDetailTemplate="let dataItem, let rowIndex = rowIndex; showIf: myCondition">
 *       <category-details [category]="dataItem"></category-details>
 *    </div>
 * ```
 *
 * The following example demonstrates how to use `DetailTemplateShowIfFn` with the `<ng-template>` element.
 *
 * ```ts-no-run
 *    <ng-template kendoGridDetailTemplate let-dataItem let-rowIndex="rowIndex"
 *       [kendoGridDetailTemplateShowIf]="myCondition">
 *        <category-details [category]="dataItem"></category-details>
 *    </ng-template>
 * ```
 * &nbsp;
 *
 * @example
 * ```ts
 *
 * @@Component({
 *   selector: 'my-app',
 *   template: `
 *       <kendo-grid
 *         [data]="data"
 *         selectable="true"
 *         style="height: 160px"
 *         >
 *         <kendo-grid-column field="ProductID"></kendo-grid-column>
 *         <kendo-grid-column field="ProductName"></kendo-grid-column>
 *         <kendo-grid-column field="UnitPrice"></kendo-grid-column>
 *         <ng-template kendoGridDetailTemplate let-dataItem
 *              [kendoGridDetailTemplateShowIf]="showOnlyBeveragesDetails">
 *           <div *ngIf="dataItem.Category">
 *             <header>{{dataItem.Category?.CategoryName}}</header>
 *             <span>{{dataItem.Category?.Description}}</span>
 *           </div>
 *         </ng-template>
 *       </kendo-grid>
 *   `
 * })
 * class AppComponent {
 *     public data = [{
 *         "ProductID": 1,
 *         "ProductName": "Chai",
 *         "UnitPrice": 18.0000,
 *         "Discontinued": false,
 *         "Category": {
 *             "CategoryID": 1,
 *             "CategoryName": "Beverages",
 *             "Description": "Soft drinks, coffees, teas, beers, and ales"
 *         }
 *       }, {
 *         "ProductID": 2,
 *         "ProductName": "Chang",
 *         "UnitPrice": 19.0000,
 *         "Discontinued": false,
 *         "Category": {
 *             "CategoryID": 1,
 *             "CategoryName": "Beverages",
 *             "Description": "Soft drinks, coffees, teas, beers, and ales"
 *         }
 *       }, {
 *         "ProductID": 3,
 *         "ProductName": "Aniseed Syrup",
 *         "UnitPrice": 10.0000,
 *         "Discontinued": false,
 *         "Category": {
 *             "CategoryID": 2,
 *             "CategoryName": "Condiments",
 *             "Description": "Sweet and savory sauces, relishes, spreads, and seasonings"
 *         }
 *     }];
 *
 *     public showOnlyBeveragesDetails(dataItem: any, index: number): boolean {
 *        return dataItem.Category.CategoryID === 1;
 *     }
 * }
 *
 * ```
 *
 */
var DetailTemplateDirective = (function () {
    function DetailTemplateDirective(templateRef) {
        this.templateRef = templateRef;
        this._condition = function () { return true; };
    }
    Object.defineProperty(DetailTemplateDirective.prototype, "showIf", {
        get: function () {
            return this._condition;
        },
        /**
         * Defines the function that indicates if a given detail row and the associated **Expand** or **Collapse** button will be shown.
         */
        set: function (fn) {
            if (typeof fn !== 'function') {
                throw new Error("showIf must be a function, but received " + JSON.stringify(fn) + ".");
            }
            this._condition = fn;
        },
        enumerable: true,
        configurable: true
    });
    return DetailTemplateDirective;
}());
DetailTemplateDirective.decorators = [
    { type: core_1.Directive, args: [{
                selector: '[kendoGridDetailTemplate]'
            },] },
];
/** @nocollapse */
DetailTemplateDirective.ctorParameters = function () { return [
    { type: core_1.TemplateRef, decorators: [{ type: core_1.Optional },] },
]; };
DetailTemplateDirective.propDecorators = {
    'showIf': [{ type: core_1.Input, args: ["kendoGridDetailTemplateShowIf",] },],
};
exports.DetailTemplateDirective = DetailTemplateDirective;
