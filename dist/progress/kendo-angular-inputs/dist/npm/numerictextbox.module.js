"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var numerictextbox_component_1 = require("./numerictextbox/numerictextbox.component");
var common_1 = require("@angular/common");
var kendo_angular_intl_1 = require("@progress/kendo-angular-intl");
var localized_messages_directive_1 = require("./numerictextbox/localization/localized-messages.directive");
var custom_messages_component_1 = require("./numerictextbox/localization/custom-messages.component");
var COMPONENT_DIRECTIVES = [
    numerictextbox_component_1.NumericTextBoxComponent,
    custom_messages_component_1.NumericTextBoxCustomMessagesComponent,
    localized_messages_directive_1.LocalizedMessagesDirective
];
/**
 * Represents the [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html)
 * definition for the NumericTextBox component.
 *
 * @example
 *
 * ```ts-no-run
 * // Import the NumericTextBox module
 * import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';
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
 *     imports:      [BrowserModule, NumericTextBoxModule], // import NumericTextBox module
 *     bootstrap:    [AppComponent]
 * })
 * export class AppModule {}
 *
 * // Compile and launch the module
 * platformBrowserDynamic().bootstrapModule(AppModule);
 *
 * ```
 */
var NumericTextBoxModule = (function () {
    function NumericTextBoxModule() {
    }
    return NumericTextBoxModule;
}());
NumericTextBoxModule.decorators = [
    { type: core_1.NgModule, args: [{
                declarations: [COMPONENT_DIRECTIVES],
                exports: [COMPONENT_DIRECTIVES],
                imports: [common_1.CommonModule],
                providers: [
                    { provide: kendo_angular_intl_1.IntlService, useClass: kendo_angular_intl_1.CldrIntlService }
                ]
            },] },
];
/** @nocollapse */
NumericTextBoxModule.ctorParameters = function () { return []; };
exports.NumericTextBoxModule = NumericTextBoxModule;
