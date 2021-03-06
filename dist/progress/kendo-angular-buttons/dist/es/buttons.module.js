import { NgModule } from '@angular/core';
import { ButtonModule } from './button/button.module';
import { ButtonGroupModule } from './buttongroup/buttongroup.module';
import { SplitButtonModule } from './splitbutton/splitbutton.module';
import { DropDownButtonModule } from './dropdownbutton/dropdownbutton.module';
/**
 * Represents the [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html)
 * definition for the Buttons components.
 *
 * @example
 *
 * ```ts-no-run
 * // Import the Buttons module
 * import { ButtonsModule } from '@progress/kendo-angular-buttons';
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
 *     imports:      [BrowserModule, ButtonsModule], // import Buttons module
 *     bootstrap:    [AppComponent]
 * })
 * export class AppModule {}
 *
 * // Compile and launch the module
 * platformBrowserDynamic().bootstrapModule(AppModule);
 *
 * ```
 */
var ButtonsModule = (function () {
    function ButtonsModule() {
    }
    return ButtonsModule;
}());
export { ButtonsModule };
ButtonsModule.decorators = [
    { type: NgModule, args: [{
                exports: [ButtonGroupModule, ButtonModule, SplitButtonModule, DropDownButtonModule]
            },] },
];
/** @nocollapse */
ButtonsModule.ctorParameters = function () { return []; };
