"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var calendar_module_1 = require("./calendar/calendar.module");
var dateinput_module_1 = require("./dateinput/dateinput.module");
var datepicker_module_1 = require("./datepicker/datepicker.module");
var kendo_angular_intl_1 = require("@progress/kendo-angular-intl");
var COMPONENT_MODULES = [
    calendar_module_1.CalendarModule,
    dateinput_module_1.DateInputModule,
    datepicker_module_1.DatePickerModule
];
/**
 * Represents the [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html)
 * definition for the DateInputs components.
 *
 * @example
 *
 * ```ts-no-run
 * // Import the DateInputs module.
 * import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
 *
 * // The browser platform with a compiler.
 * import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
 *
 * import { NgModule } from '@angular/core';
 *
 * // Import the app component.
 * import { AppComponent } from './app.component';
 *
 * // Define the app module.
 * @@NgModule({
 *     declarations: [AppComponent], // declare app component
 *     imports:      [BrowserModule, DateInputsModule], // import DateInputs module
 *     bootstrap:    [AppComponent]
 * })
 * export class AppModule {}
 *
 * // Compile and launch the module.
 * platformBrowserDynamic().bootstrapModule(AppModule);
 *
 * ```
 */
var DateInputsModule = (function () {
    function DateInputsModule() {
    }
    return DateInputsModule;
}());
DateInputsModule.decorators = [
    { type: core_1.NgModule, args: [{
                exports: COMPONENT_MODULES,
                imports: COMPONENT_MODULES,
                providers: [
                    { provide: kendo_angular_intl_1.IntlService, useClass: kendo_angular_intl_1.CldrIntlService }
                ]
            },] },
];
/** @nocollapse */
DateInputsModule.ctorParameters = function () { return []; };
exports.DateInputsModule = DateInputsModule;
