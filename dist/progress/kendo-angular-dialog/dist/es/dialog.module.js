import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { DialogTitleBarComponent } from './dialog-titlebar.component';
import { DialogActionsComponent } from './dialog-actions.component';
import { DialogService } from './dialog.service';
import { DialogContainerDirective } from './dialog-container.directive';
import { DialogContainerService } from './dialog-container.service';
/**
 * @hidden
 */
export var DIALOG_DIRECTIVES = [
    DialogComponent,
    DialogTitleBarComponent,
    DialogActionsComponent
];
/**
 * A [module](https://angular.io/docs/ts/latest/guide/ngmodule.html) that includes all Dialog components and directives.
 *
 * Imports `DialogModule` into the [root module](https://angular.io/docs/ts/latest/guide/ngmodule.html#!#angular-modularity)
 * of your application or into any other sub-module that will use the Dialog component.
 *
 * @example
 * ```ts-no-run
 * import { NgModule } from '@angular/core';
 * import { BrowserModule } from '@angular/platform-browser';
 * import { DialogModule } from '@progress/kendo-angular-dialog';
 * import { AppComponent } from './app.component';
 *
 * @@NgModule({
 *     bootstrap:    [AppComponent],
 *     declarations: [AppComponent],
 *     imports:      [BrowserModule, DialogModule]
 * })
 * export class AppModule {
 * }
 * ```
 */
var DialogModule = (function () {
    function DialogModule() {
    }
    return DialogModule;
}());
export { DialogModule };
DialogModule.decorators = [
    { type: NgModule, args: [{
                declarations: [DIALOG_DIRECTIVES, DialogContainerDirective],
                entryComponents: [DIALOG_DIRECTIVES],
                exports: [DIALOG_DIRECTIVES, DialogContainerDirective],
                imports: [CommonModule],
                providers: [DialogContainerService, DialogService]
            },] },
];
/** @nocollapse */
DialogModule.ctorParameters = function () { return []; };
