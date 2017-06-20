import { Renderer2, ViewContainerRef } from '@angular/core';
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
export declare class DialogContainerDirective {
    constructor(container: ViewContainerRef, renderer: Renderer2, service: DialogContainerService);
}
