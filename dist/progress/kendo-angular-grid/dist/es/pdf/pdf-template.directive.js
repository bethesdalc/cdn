import { Directive, TemplateRef, Optional } from '@angular/core';
/**
 * Represents the PDF page template of the Kendo UI Grid that helps to customize the PDF pages.
 *
 * To define a page template, nest a `<ng-template>` tag with the `kendoGridPDFTemplate` directive inside `<kendo-grid-pdf>`.
 * The template context provides the following fields:
 * - `pageNumber`&mdash;Defines PDF page number.
 * - `totalPages`&mdash;Defines the total number of PDF pages.
 *
 * @example
 * ```ts-preview
 *
 * @@Component({
 *     selector: 'my-app',
 *     template: `
 *         <kendo-grid [data]="gridData">
 *             <ng-template kendoGridToolbarTemplate>
 *                 <button kendoGridPDFCommand><span class='k-icon k-i-file-pdf'></span>Export to PDF</button>
 *             </ng-template>
 *             <kendo-grid-column field="ProductName">
 *             </kendo-grid-column>
 *              <kendo-grid-column field="UnitPrice">
 *             </kendo-grid-column>
 *             <kendo-grid-pdf fileName="Products.pdf" paperSize="A4" [margin]="{ top: '1cm', left: '1cm', right: '1cm', bottom: '1cm' }">
 *                 <ng-template kendoGridPDFTemplate let-pageNum="pageNum" let-totalPages="totalPages">
 *                     <div style="position: absolute;top: 5px; left: 5px;">
 *                         Page {{ pageNum }} of {{ totalPages }}
 *                     </div>
 *                 </ng-template>
 *             </kendo-grid-pdf>
 *         </kendo-grid>
 *     `
 * })
 *
 * class AppComponent {
 *     public gridData = [{
 *         "ProductID": 1,
 *         "ProductName": "Chai",
 *         "UnitPrice": 18.0000
 *       }, {
 *         "ProductID": 2,
 *         "ProductName": "Chang",
 *         "UnitPrice": 19.0000
 *       }
 *     ];
 * }
 *
 * ```
 */
var PDFTemplateDirective = (function () {
    function PDFTemplateDirective(templateRef) {
        this.templateRef = templateRef;
    }
    return PDFTemplateDirective;
}());
export { PDFTemplateDirective };
PDFTemplateDirective.decorators = [
    { type: Directive, args: [{
                selector: '[kendoGridPDFTemplate]'
            },] },
];
/** @nocollapse */
PDFTemplateDirective.ctorParameters = function () { return [
    { type: TemplateRef, decorators: [{ type: Optional },] },
]; };
