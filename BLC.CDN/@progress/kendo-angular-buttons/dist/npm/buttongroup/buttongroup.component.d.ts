import { ButtonDirective } from '../button/button.directive';
import { QueryList, OnInit, OnDestroy, AfterContentChecked, AfterViewChecked, AfterContentInit } from '@angular/core';
import { ButtonGroupSelection } from '../button/selection-settings';
import { KendoButtonService } from '../button/button.service';
/**
 * Represents the Kendo UI ButtonGroup component for Angular.
 */
export declare class ButtonGroupComponent implements OnInit, OnDestroy, AfterContentChecked, AfterViewChecked, AfterContentInit {
    private service;
    /**
     * By default, the ButtonGroup is enabled.
     * To disable the underlying Buttons, use their own `disabled` attribute.
     *
     * For the API of the Button, refer to its
     * [configuration options article]({% slug api_buttons_buttondirective_kendouiforangular %}).
     */
    disabled: boolean;
    /**
     * By default, the ButtonGroup selection mode is set to `multiple`.
     */
    selection: ButtonGroupSelection;
    /**
     * Sets the width of the ButtonGroup.
     * If width of the group is set:
     * - buttons will resize automatically to fill the full width of the group wrapper
     * - each button will have the same width
     */
    width: string;
    buttons: QueryList<ButtonDirective>;
    private direction;
    private subscription;
    readonly wrapperClass: boolean;
    readonly stretchedClass: boolean;
    readonly getRole: string;
    readonly dir: string;
    readonly wrapperWidth: string;
    /**
     * @hidden
     */
    keydown(event: any): void;
    constructor(service: KendoButtonService, rtl: boolean);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    ngAfterContentChecked(): void;
    protected deactivate(buttons: Array<ButtonDirective>): void;
    protected activate(buttons: Array<ButtonDirective>): void;
    private verifySettings();
    private isSelectionSingle();
}
