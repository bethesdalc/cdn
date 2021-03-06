import { NgModule } from '@angular/core';
import { SliderModule } from './slider.module';
import { SwitchModule } from './switch.module';
import { NumericTextBoxModule } from './numerictextbox.module';
import { MaskedTextBoxModule } from './maskedtextbox.module';
import { CommonModule } from '@angular/common';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
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
export { InputsModule };
InputsModule.decorators = [
    { type: NgModule, args: [{
                exports: [SliderModule, SwitchModule, NumericTextBoxModule, MaskedTextBoxModule],
                imports: [CommonModule],
                providers: [
                    { provide: IntlService, useClass: CldrIntlService }
                ]
            },] },
];
/** @nocollapse */
InputsModule.ctorParameters = function () { return []; };
