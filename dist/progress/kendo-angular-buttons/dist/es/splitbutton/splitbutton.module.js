import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupModule } from '@progress/kendo-angular-popup';
import { ButtonModule } from './../button/button.module';
import { ListModule } from './../listbutton/list.module';
import { SplitButtonComponent } from './splitbutton.component';
/**
 * @hidden
 *
 * The exported package module.
 *
 * The package exports:
 * - `SplitButtonComponent`&mdash;The SplitButtonComponent component class.
 */
var SplitButtonModule = (function () {
    function SplitButtonModule() {
    }
    return SplitButtonModule;
}());
export { SplitButtonModule };
SplitButtonModule.decorators = [
    { type: NgModule, args: [{
                declarations: [SplitButtonComponent],
                exports: [SplitButtonComponent, ListModule],
                imports: [CommonModule, PopupModule, ButtonModule, ListModule]
            },] },
];
/** @nocollapse */
SplitButtonModule.ctorParameters = function () { return []; };
