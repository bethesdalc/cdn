"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:max-line-length */
var core_1 = require("@angular/core");
/**
 * Used for rendering content when there is no data present.
 *
 * To define the no-data template, nest a `<ng-template>` tag with the `kendo<ComponentName>NoDataTemplate` directive inside the component tag.
 *
 * Use:
 * - The `kendoAutoCompleteItemTemplate` directive for the AutoComplete.
 * - The `kendoComboBoxItemTemplate` directive for the ComboBox.
 * - The `kendoDropDownListItemTemplate` directive for the DropDownList.
 * - The `kendoMultiSelectItemTemplate` directive for the MultiSelect.
 *
 *
 * @example
 * ```ts
 * @@Component({
 * selector: 'my-app',
 * template: `
 *  <kendo-combobox [data]="listItems">
 *    <ng-template kendoComboBoxNoDataTemplate>
 *      <h4>No data!</h4>
 *    </ng-template>
 *  </kendo-combobox>
 * `
 * })
 * class AppComponent {
 *   public listItems: Array<string> = [];
 * }
 * ```
 *
 * For more examples, refer to the article on [templates]({% slug overview_ddl_kendouiforangular %}#toc-templates).
 */
var NoDataTemplateDirective = (function () {
    function NoDataTemplateDirective(templateRef) {
        this.templateRef = templateRef;
    }
    return NoDataTemplateDirective;
}());
NoDataTemplateDirective.decorators = [
    { type: core_1.Directive, args: [{
                selector: '[kendoDropDownListNoDataTemplate],[kendoComboBoxNoDataTemplate],[kendoAutoCompleteNoDataTemplate],[kendoMultiSelectNoDataTemplate]'
            },] },
];
/** @nocollapse */
NoDataTemplateDirective.ctorParameters = function () { return [
    { type: core_1.TemplateRef, },
]; };
exports.NoDataTemplateDirective = NoDataTemplateDirective;
