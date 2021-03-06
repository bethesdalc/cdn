"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:max-line-length */
var core_1 = require("@angular/core");
/**
 * Used for rendering the selected tag value. It can only be used with the MultiSelect component.
 *
 * The template context is set to the current MultiSelect. To get a reference to the current data item, use the `let-dataItem` directive.
 *
 * @example
 * ```ts
 * @@Component({
 * selector: 'my-app',
 * template: `
 *  <kendo-multiselect [data]="items">
 *    <ng-template kendoMultiSelectTagTemplate let-dataItem>
 *      <span>{{dataItem}} option</span>
 *    </ng-template>
 *  </kendo-multiselect>
 * `
 * })
 * class AppComponent {
 *   public items: Array<string> = ["Item 1", "Item 2", "Item 3", "Item 4"];
 * }
 * ```
 *
 * For more examples, refer to the article on [templates]({% slug overview_ddl_kendouiforangular %}#toc-templates).
 */
var TagTemplateDirective = (function () {
    function TagTemplateDirective(templateRef) {
        this.templateRef = templateRef;
    }
    return TagTemplateDirective;
}());
TagTemplateDirective.decorators = [
    { type: core_1.Directive, args: [{
                selector: '[kendoMultiSelectTagTemplate]'
            },] },
];
/** @nocollapse */
TagTemplateDirective.ctorParameters = function () { return [
    { type: core_1.TemplateRef, },
]; };
exports.TagTemplateDirective = TagTemplateDirective;
