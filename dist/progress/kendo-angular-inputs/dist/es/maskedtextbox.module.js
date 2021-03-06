import { NgModule } from '@angular/core';
import { MaskedTextBoxComponent } from './maskedtextbox/maskedtextbox.component';
import { CommonModule } from '@angular/common';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
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
export { MaskedTextBoxModule };
MaskedTextBoxModule.decorators = [
    { type: NgModule, args: [{
                declarations: [MaskedTextBoxComponent],
                exports: [MaskedTextBoxComponent],
                imports: [CommonModule],
                providers: [
                    { provide: IntlService, useClass: CldrIntlService }
                ]
            },] },
];
/** @nocollapse */
MaskedTextBoxModule.ctorParameters = function () { return []; };
