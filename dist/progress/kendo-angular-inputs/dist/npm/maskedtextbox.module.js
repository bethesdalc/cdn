"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var maskedtextbox_component_1 = require("./maskedtextbox/maskedtextbox.component");
var common_1 = require("@angular/common");
var kendo_angular_intl_1 = require("@progress/kendo-angular-intl");
/**
 * Represents the [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html)
 * definition for the MaskedTextBox component.
 *
 * @example
 *
 * ```ts-no-run
 * // Import the MaskedTextBox module
 * import { MaskedTextBoxModule } from '@progress/kendo-angular-inputs';
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
 *     imports:      [BrowserModule, MaskedTextBoxModule], // import MaskedTextBox module
 *     bootstrap:    [AppComponent]
 * })
 * export class AppModule {}
 *
 * // Compile and launch the module
 * platformBrowserDynamic().bootstrapModule(AppModule);
 *
 * ```
 */
var MaskedTextBoxModule = (function () {
    function MaskedTextBoxModule() {
    }
    return MaskedTextBoxModule;
}());
MaskedTextBoxModule.decorators = [
    { type: core_1.NgModule, args: [{
                declarations: [maskedtextbox_component_1.MaskedTextBoxComponent],
                exports: [maskedtextbox_component_1.MaskedTextBoxComponent],
                imports: [common_1.CommonModule],
                providers: [
                    { provide: kendo_angular_intl_1.IntlService, useClass: kendo_angular_intl_1.CldrIntlService }
                ]
            },] },
];
/** @nocollapse */
MaskedTextBoxModule.ctorParameters = function () { return []; };
exports.MaskedTextBoxModule = MaskedTextBoxModule;
