"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dialog_container_service_1 = require("./dialog-container.service");
/**
 * The insertion point for the Dialogs created through the `DialogService`.
 *
 * @example
 * ```html-no-run
 * <div kendoDialogContainer></div>
 * ```
 *
 * Created Dialogs will be mounted after this element.
 *
 * For an example on sample usage, refer to the
 * [`DialogService.open`]({% slug api_dialog_dialogservice_kendouiforangular %}#toc-open) method.
 *
 */
var DialogContainerDirective = (function () {
    function DialogContainerDirective(container, renderer, service) {
        service.container = container;
        service.renderer = renderer;
    }
    return DialogContainerDirective;
}());
DialogContainerDirective.decorators = [
    { type: core_1.Directive, args: [{
                selector: '[kendoDialogContainer]'
            },] },
];
/** @nocollapse */
DialogContainerDirective.ctorParameters = function () { return [
    { type: core_1.ViewContainerRef, },
    { type: core_1.Renderer2, },
    { type: dialog_container_service_1.DialogContainerService, },
]; };
exports.DialogContainerDirective = DialogContainerDirective;
