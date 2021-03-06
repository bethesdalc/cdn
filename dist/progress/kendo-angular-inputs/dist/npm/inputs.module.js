"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var slider_module_1 = require("./slider.module");
var switch_module_1 = require("./switch.module");
var numerictextbox_module_1 = require("./numerictextbox.module");
var maskedtextbox_module_1 = require("./maskedtextbox.module");
var common_1 = require("@angular/common");
var kendo_angular_intl_1 = require("@progress/kendo-angular-intl");
/**
 * Represents the [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html)
 * definition for the Inputs components.
 *
 * @example
 *
 * ```ts-no-run
 * // Import the Inputs module
 * import { InputsModule } from '@progress/kendo-angular-inputs';
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
 *     imports:      [BrowserModule, InputsModule], // import Inputs module
 *     bootstrap:    [AppComponent]
 * })
 * export class AppModule {}
 *
 * // Compile and launch the module
 * platformBrowserDynamic().bootstrapModule(AppModule);
 *
 * ```
 */
var InputsModule = (function () {
    function InputsModule() {
    }
    return InputsModule;
}());
InputsModule.decorators = [
    { type: core_1.NgModule, args: [{
                exports: [slider_module_1.SliderModule, switch_module_1.SwitchModule, numerictextbox_module_1.NumericTextBoxModule, maskedtextbox_module_1.MaskedTextBoxModule],
                imports: [common_1.CommonModule],
                providers: [
                    { provide: kendo_angular_intl_1.IntlService, useClass: kendo_angular_intl_1.CldrIntlService }
                ]
            },] },
];
/** @nocollapse */
InputsModule.ctorParameters = function () { return []; };
exports.InputsModule = InputsModule;
