import { EventEmitter, TemplateRef } from '@angular/core';
import { DialogAction } from './dialog-settings';
/**
 * Specifies the action buttons for the `DialogComponent`.
 */
export declare class DialogActionsComponent {
    /**
     * Allows actions to be specified declaratively.
     */
    actions?: DialogAction[] | TemplateRef<any>;
    /**
     * Fires when the user clicks on actions specified by the actions.
     */
    action: EventEmitter<any>;
    readonly className: boolean;
    /**
     * @hidden
     */
    actionTemplate(): boolean;
    /**
     * @hidden
     */
    onButtonClick(action: DialogAction): void;
    /**
     * @hidden
     */
    buttonClass(action: DialogAction): string;
}
