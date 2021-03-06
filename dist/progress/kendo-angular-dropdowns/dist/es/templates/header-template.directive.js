/* tslint:disable:max-line-length */
import { Directive, TemplateRef } from '@angular/core';
/**
 * Used for rendering the list header content.
 *
 * To define the header template, nest a `<ng-template>` tag with the `kendo<ComponentName>HeaderTemplate` directive inside the component tag.
 *
 * Use:
 * - The `kendoAutoCompleteHeaderTemplate` directive for the AutoComplete.
 * - The `kendoComboBoxHeaderTemplate` directive for the ComboBox.
 * - The `kendoDropDownListHeaderTemplate` directive for the DropDownList.
 * - The `kendoMultiSelectHeaderTemplate` directive for the MultiSelect.
 *
 * @example
 * ```ts
 * @@Component({
 * selector: 'my-app',
 * template: `
 *  <kendo-combobox [data]="listItems">
 *    <ng-template kendoComboBoxHeaderTemplate>
 *      <h4>Header template</h4>
 *    </ng-template>
 *  </kendo-combobox>
 * `
 * })
 * class AppComponent {
 *   public listItems: Array<string> = ["Item 1", "Item 2", "Item 3", "Item 4"];
 * }
 * ```
 * For more examples, refer to the article on [templates]({% slug overview_ddl_kendouiforangular %}#toc-templates).
 */
var HeaderTemplateDirective = (function () {
    function HeaderTemplateDirective(templateRef) {
        this.templateRef = templateRef;
    }
    return HeaderTemplateDirective;
}());
export { HeaderTemplateDirective };
HeaderTemplateDirective.decorators = [
    { type: Directive, args: [{
                selector: '[kendoDropDownListHeaderTemplate],[kendoComboBoxHeaderTemplate],[kendoAutoCompleteHeaderTemplate],[kendoMultiSelectHeaderTemplate]'
            },] },
];
/** @nocollapse */
HeaderTemplateDirective.ctorParameters = function () { return [
    { type: TemplateRef, },
]; };
