import { NgModule } from '@angular/core';
import { CalendarModule } from './calendar/calendar.module';
import { DateInputModule } from './dateinput/dateinput.module';
import { DatePickerModule } from './datepicker/datepicker.module';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
var COMPONENT_MODULES = [
    CalendarModule,
    DateInputModule,
    DatePickerModule
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
export { DateInputsModule };
DateInputsModule.decorators = [
    { type: NgModule, args: [{
                exports: COMPONENT_MODULES,
                imports: COMPONENT_MODULES,
                providers: [
                    { provide: IntlService, useClass: CldrIntlService }
                ]
            },] },
];
/** @nocollapse */
DateInputsModule.ctorParameters = function () { return []; };
