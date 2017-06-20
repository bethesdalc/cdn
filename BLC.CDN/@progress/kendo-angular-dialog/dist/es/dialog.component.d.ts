import { AfterContentInit, AfterViewInit, EventEmitter, OnInit, ElementRef, TemplateRef, Renderer2 } from '@angular/core';
import { DialogActionsComponent } from './dialog-actions.component';
import { DialogTitleBarComponent } from './dialog-titlebar.component';
/**
 * Represents the Kendo UI Dialog component for Angular.
 */
export declare class DialogComponent implements AfterContentInit, AfterViewInit, OnInit {
    private _elRef;
    private _renderer;
    /**
     * Specifies the text rendered in the title bar.
     */
    title: string;
    /**
     * Specifies the action buttons that will be rendered.
     */
    actions: string;
    /**
     * Specifies the width of the dialog. The width should be set in pixels.
     */
    width: number;
    /**
     * Specifies the height of the dialog. The height should be set in pixels.
     */
    height: number;
    /**
     * @hidden
     */
    contentTemplate: TemplateRef<any>;
    /**
     * Fires when the user clicks on the **Close** button of the Dialog.
     */
    action: EventEmitter<any>;
    /**
     * Fires when the user clicks on the **Close** button of the Dialog.
     */
    close: EventEmitter<any>;
    readonly dir: string;
    titlebarContent: DialogTitleBarComponent;
    titlebarView: DialogTitleBarComponent;
    actionsView: DialogActionsComponent;
    private direction;
    constructor(_elRef: ElementRef, _renderer: Renderer2, rtl: boolean);
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnInit(): void;
    readonly wrapperClass: boolean;
    readonly styles: any;
    private bubble(eventName, component);
}
