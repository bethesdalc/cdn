import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './popup.component';
import { PopupService } from './popup.service';
var POPUP_DIRECTIVES = [PopupComponent];
/**
 * Represents the [NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html)
 * definition for the Popup component.
 *
 * @example
 *
 * ```ts-no-run
 * // Import the Popup module
 * import { PopupModule } from '@progress/kendo-angular-popup';
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
 *     imports:      [BrowserModule, PopupModule], // import Popup module
 *     bootstrap:    [AppComponent]
 * })
 * export class AppModule {}
 *
 * // Compile and launch the module
 * platformBrowserDynamic().bootstrapModule(AppModule);
 *
 * ```
 */
var PopupModule = (function () {
    function PopupModule() {
    }
    return PopupModule;
}());
export { PopupModule };
PopupModule.decorators = [
    { type: NgModule, args: [{
                declarations: [POPUP_DIRECTIVES],
                entryComponents: [POPUP_DIRECTIVES],
                exports: [POPUP_DIRECTIVES],
                imports: [CommonModule],
                providers: [PopupService]
            },] },
];
/** @nocollapse */
PopupModule.ctorParameters = function () { return []; };
