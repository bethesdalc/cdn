"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var dialog_component_1 = require("./dialog.component");
var dialog_titlebar_component_1 = require("./dialog-titlebar.component");
var dialog_actions_component_1 = require("./dialog-actions.component");
var dialog_service_1 = require("./dialog.service");
var dialog_container_directive_1 = require("./dialog-container.directive");
var dialog_container_service_1 = require("./dialog-container.service");
/**
 * @hidden
 */
exports.DIALOG_DIRECTIVES = [
    dialog_component_1.DialogComponent,
    dialog_titlebar_component_1.DialogTitleBarComponent,
    dialog_actions_component_1.DialogActionsComponent
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
DialogModule.decorators = [
    { type: core_1.NgModule, args: [{
                declarations: [exports.DIALOG_DIRECTIVES, dialog_container_directive_1.DialogContainerDirective],
                entryComponents: [exports.DIALOG_DIRECTIVES],
                exports: [exports.DIALOG_DIRECTIVES, dialog_container_directive_1.DialogContainerDirective],
                imports: [common_1.CommonModule],
                providers: [dialog_container_service_1.DialogContainerService, dialog_service_1.DialogService]
            },] },
];
/** @nocollapse */
DialogModule.ctorParameters = function () { return []; };
exports.DialogModule = DialogModule;
