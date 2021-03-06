var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Component, forwardRef } from '@angular/core';
import { LocalizationService } from '@progress/kendo-angular-l10n';
import { Messages } from './messages';
/**
 * Custom component messages override default component messages.
 */
var NumericTextBoxCustomMessagesComponent = (function (_super) {
    __extends(NumericTextBoxCustomMessagesComponent, _super);
    function NumericTextBoxCustomMessagesComponent(service) {
        var _this = _super.call(this) || this;
        _this.service = service;
        return _this;
    }
    Object.defineProperty(NumericTextBoxCustomMessagesComponent.prototype, "override", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return NumericTextBoxCustomMessagesComponent;
}(Messages));
export { NumericTextBoxCustomMessagesComponent };
NumericTextBoxCustomMessagesComponent.decorators = [
    { type: Component, args: [{
                providers: [
                    {
                        provide: Messages,
                        useExisting: forwardRef(function () { return NumericTextBoxCustomMessagesComponent; }) // tslint:disable-line:no-forward-ref
                    }
                ],
                selector: 'kendo-numerictextbox-messages',
                template: ""
            },] },
];
/** @nocollapse */
NumericTextBoxCustomMessagesComponent.ctorParameters = function () { return [
    { type: LocalizationService, },
]; };
