import { NgModule } from '@angular/core';
import { ButtonDirective } from './button.directive';
/**
 * Represents the [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html)
 * definition for the Button directive.
 *
 * @example
 *
 * ```ts-no-run
 * // Import the Buttons module
 * import { ButtonModule } from '@progress/kendo-angular-buttons';
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
 *     imports:      [BrowserModule, ButtonModule], // import Button module
 *     bootstrap:    [AppComponent]
 * })
 * export class AppModule {}
 *
 * // Compile and launch the module
 * platformBrowserDynamic().bootstrapModule(AppModule);
 *
 * ```
 */
var ButtonModule = (function () {
    function ButtonModule() {
    }
    return ButtonModule;
}());
export { ButtonModule };
ButtonModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ButtonDirective],
                exports: [ButtonDirective]
            },] },
];
/** @nocollapse */
ButtonModule.ctorParameters = function () { return []; };
