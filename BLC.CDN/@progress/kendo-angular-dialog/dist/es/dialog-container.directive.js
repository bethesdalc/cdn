import { Directive, Renderer2, ViewContainerRef } from '@angular/core';
import { DialogContainerService } from './dialog-container.service';
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
export { DialogContainerDirective };
DialogContainerDirective.decorators = [
    { type: Directive, args: [{
                selector: '[kendoDialogContainer]'
            },] },
];
/** @nocollapse */
DialogContainerDirective.ctorParameters = function () { return [
    { type: ViewContainerRef, },
    { type: Renderer2, },
    { type: DialogContainerService, },
]; };
