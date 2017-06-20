"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
/**
 * @hidden
 */
var DialogContainerService = (function () {
    function DialogContainerService() {
    }
    Object.defineProperty(DialogContainerService.prototype, "container", {
        get: function () {
            return DialogContainerService.container;
        },
        set: function (container) {
            DialogContainerService.container = container;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogContainerService.prototype, "renderer", {
        get: function () {
            return DialogContainerService.renderer;
        },
        set: function (renderer) {
            DialogContainerService.renderer = renderer;
        },
        enumerable: true,
        configurable: true
    });
    DialogContainerService.prototype.validate = function () {
        var valid = DialogContainerService.container && DialogContainerService.renderer;
        if (!valid) {
            throw new Error("\n  Cannot attach dialog to the page.\n  Verify that there is an element that uses the kendoDialogContainer directive.\n  See http://www.telerik.com/kendo-angular-ui/components/dialog/api/DialogContainerDirective/ .\n      ");
        }
        return !!valid;
    };
    return DialogContainerService;
}());
DialogContainerService.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
DialogContainerService.ctorParameters = function () { return []; };
exports.DialogContainerService = DialogContainerService;
