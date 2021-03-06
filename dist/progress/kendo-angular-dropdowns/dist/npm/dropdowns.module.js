"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var autocomplete_module_1 = require("./autocomplete.module");
var combobox_module_1 = require("./combobox.module");
var dropdownlist_module_1 = require("./dropdownlist.module");
var multiselect_module_1 = require("./multiselect.module");
/**
 * Represents the [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html)
 * definition for the DropDowns components.
 *
 * @example
 *
 * ```ts-no-run
 * // Import the DropDowns module
 * import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
 *
 * // The browser platform with a compiler
 * import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
 *
 * import { NgModule } from '@angular/core';
 *
 * // Import the app component
 * import { AppComponent } from './app.component';
 *
 * // Define the app module
 * @@NgModule({
 *     declarations: [AppComponent], // declare app component
 *     imports:      [BrowserModule, DropDownsModule], // import DropDowns module
 *     bootstrap:    [AppComponent]
 * })
 * export class AppModule {}
 *
 * // Compile and launch the module
 * platformBrowserDynamic().bootstrapModule(AppModule);
 *
 * ```
 */
var DropDownsModule = (function () {
    function DropDownsModule() {
    }
    return DropDownsModule;
}());
DropDownsModule.decorators = [
    { type: core_1.NgModule, args: [{
                exports: [autocomplete_module_1.AutoCompleteModule, combobox_module_1.ComboBoxModule, dropdownlist_module_1.DropDownListModule, multiselect_module_1.MultiSelectModule]
            },] },
];
/** @nocollapse */
DropDownsModule.ctorParameters = function () { return []; };
exports.DropDownsModule = DropDownsModule;
