import { ComponentRef, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogComponent } from './dialog.component';
/**
 * The settings for the Dialog actions when the Dialog is opened through `DialogService`.
 *
 * For an example on sample usage, refer to the
 * [`DialogService.open`]({% slug api_dialog_dialogservice_kendouiforangular %}#toc-open) method.
 */
export declare class DialogAction {
    /**
     * The text of the action button.
     */
    text: string;
    /**
     * Determines if the action button is styled as a primary button.
     */
    primary?: boolean;
}
/**
 * Indicates that the **Close** button is clicked.
 * Used when the results from the Dialogs that are opened through `DialogService` are filtered.
 *
 * For an example on sample usage, refer to the
 * [`DialogService.open`]({% slug api_dialog_dialogservice_kendouiforangular %}#toc-open) method.
 */
export declare class DialogCloseResult {
}
/**
 * Specifies the possible result types of the Dialog.
 * Instances of [`DialogCloseResult`]({% slug api_dialog_dialogcloseresult_kendouiforangular %})
 * indicate that the **Close** button of the Dialog has been clicked.
 * Otherwise, the value is the configuration of the action button that has been clicked.
 *
 * For an example on sample usage, refer to the
 * [`DialogService.open`]({% slug api_dialog_dialogservice_kendouiforangular %}#toc-open) method.
 */
export declare type DialogResult = DialogCloseResult | DialogAction;
/**
 * The settings that can be used when opening a Dialog through `DialogService`.
 *
 * For an example on sample usage, refer to the
 * [`DialogService.open`]({% slug api_dialog_dialogservice_kendouiforangular %}#toc-open) method.
 */
export declare class DialogSettings {
    /**
     * Sets the Dialog title. If the title is omitted, the Dialog will be rendered without a **Close** button.
     */
    title?: string;
    /**
     * Defines the content of the Dialog.
     */
    content?: string | TemplateRef<any> | Function;
    /**
     * Sets the action buttons of the Dialog.
     */
    actions?: DialogAction[] | any[] | TemplateRef<any>;
}
/**
 * Holds references to the Dialog object instance and published events.
 * Controls the Dialogs that have been opened through the `DialogService`.
 *
 * For an example on sample usage, refer to the
 * [`DialogService.open`]({% slug api_dialog_dialogservice_kendouiforangular %}#toc-open) method.
 */
export declare class DialogRef {
    /**
     * Emits events when the Dialog is closed either through the **Close** button of the title bar or through the action buttons.
     * If the **Close** button of the title bar is clicked, `DialogResult` is a `DialogCloseResult` instance.
     * If the Dialog is closed through the action buttons, `DialogResult` contains the object that was passed when the Dialog was opened.
     */
    result: Observable<DialogResult>;
    /**
     * A reference to the Dialog instance.
     */
    dialog: ComponentRef<DialogComponent>;
    /**
     * A reference to the child component of the Dialog.
     *
     * Available when the Dialog is opened with [component content]({% slug service_dialog_kendouiforangular %}#toc-use-components).
     */
    content: ComponentRef<any>;
    /**
     * Allows you to close the Dialog through code.
     */
    close: Function;
}
