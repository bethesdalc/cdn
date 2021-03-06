"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
/**
 * Used for rendering the cell content of the Calendar.
 *
 * To define the cell template, nest a `<ng-template>` tag with the `kendoCalendarCellTemplate` directive inside the component tag.
 *
 * The template context is set to the current component. To get a reference to the current date, use the `let-date` directive.
 * To provide more details about the current cell, get a reference to the current `cellContext` by using the `let-cellContext` directive.
 *
 * @example
 * ```ts
 * @@Component({
 * selector: 'my-app',
 * styles: ['.custom { color: red; }'],
 * template: `
 *  <kendo-calendar>
 *    <ng-template kendoCalendarCellTemplate let-date>
 *      <span class="custom">{{date.getDate()}}</span>
 *    </ng-template>
 *  </kendo-calendar>
 * `
 * })
 * class AppComponent { }
 * ```
 *
 * For more examples, refer to the section on [templates]({% slug overview_calendar_kendouiforangular %}#toc-templates).
 */
var CellTemplateDirective = (function () {
    function CellTemplateDirective(templateRef) {
        this.templateRef = templateRef;
    }
    return CellTemplateDirective;
}());
CellTemplateDirective.decorators = [
    { type: core_1.Directive, args: [{
                selector: '[kendoCalendarCellTemplate]'
            },] },
];
/** @nocollapse */
CellTemplateDirective.ctorParameters = function () { return [
    { type: core_1.TemplateRef, },
]; };
exports.CellTemplateDirective = CellTemplateDirective;
