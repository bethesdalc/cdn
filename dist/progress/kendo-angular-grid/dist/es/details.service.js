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
import { Injectable } from '@angular/core';
import { ExpandStateService } from './expand-state.service';
/**
 * @hidden
 */
var DetailsService = (function (_super) {
    __extends(DetailsService, _super);
    function DetailsService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DetailsService;
}(ExpandStateService));
export { DetailsService };
DetailsService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
DetailsService.ctorParameters = function () { return []; };
