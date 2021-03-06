import { ApplicationRef, ComponentFactoryResolver, ElementRef, InjectionToken, Injector } from '@angular/core';
import { PopupSettings } from './models/popup-settings';
import { PopupRef } from './models/popup-ref';
/**
 * An InjectionToken used to inject the popup container. If not provided the first root component of
 * the application will be used.
 *
 * @example
 *
 * ```ts-no-run
 * // Import the Popup module
 * import { PopupModule, POPUP_CONTAINER } from '@progress/kendo-angular-popup';
 *
 * // The browser platform with a compiler
 * import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
 *
 * import { NgModule } from '@angular/core';
 *
 * // Import the app component
 * import { AppComponent } from './app.component';
 *
 * // Define the app module
 * @@NgModule({
 *     declarations: [AppComponent], // declare app component
 *     imports:      [BrowserModule, PopupModule], // import Popup module
 *     bootstrap:    [AppComponent],
 *     providers: [{
 *       provide: POPUP_CONTAINER,
 *       useFactory: () => {
 *          //return the container ElementRef, where the popup will be injected
 *       }
 *     }]
 * })
 * export class AppModule {}
 *
 * // Compile and launch the module
 * platformBrowserDynamic().bootstrapModule(AppModule);
 * ```
 */
export declare const POPUP_CONTAINER: InjectionToken<ElementRef>;
/**
 * Service for opening Popup components dynamically.
 *
 * See the [service help topic]({% slug service_popup_kendouiforangular %}) for detailed information how to use this class.
 *
 * @export
 * @class PopupService
 */
export declare class PopupService {
    private applicationRef;
    private componentFactoryResolver;
    private injector;
    private container;
    /**
     * Gets the root view container to inject the component to.
     *
     * @returns {ComponentRef<any>}
     */
    private readonly rootViewContainer;
    /**
     * Sets or gets the root component container html element.
     *
     * @returns {HTMLElement}
     */
    readonly rootViewContainerNode: HTMLElement;
    constructor(applicationRef: ApplicationRef, componentFactoryResolver: ComponentFactoryResolver, injector: Injector, container: ElementRef);
    /**
     * Opens a Popup component.
     *
     * Created Popup will be mounted in the DOM directly in the root application component.
     *
     * @param {PopupSettings} options - The options that define the Popup.
     * @returns {ComponentRef<PopupComponent>} - A reference to the Popup object.
     *
     * @example
     *
     * ```ts-no-run
     * @@Component({
     *   selector: 'my-app',
     *   template: `
     *     <ng-template #template>
     *      Popup content
     *     </ng-template>
     *     <button #anchor kendoButton (click)="toggle(anchor, template)">Toggle</button>
     *   `
     * })
     * export class AppComponent {
     *     public popupRef: PopupRef;
     *
     *     constructor( private popupService: PopupService ) {}
     *
     *     public open(anchor: ElementRef, template: TemplateRef<any>): void {
     *         if (this.popupRef) {
     *              this.popupRef.close();
     *              this.popupRef = null;
     *              return;
     *         }
     *
     *         this.popupRef = this.popupService.open({
     *           anchor: anchor,
     *           content: template
     *         });
     *     }
     * }
     * ```
     */
    open(options?: PopupSettings): PopupRef;
    /**
     * Gets the html element for a component ref.
     *
     * @param {ComponentRef<any>} componentRef
     * @returns {HTMLElement}
     */
    private getComponentRootNode(componentRef);
    /**
     * Creates a component ref from Component type class
     *
     * @param {*} componentClass
     * @param {*} nodes
     * @returns {ComponentRef<any>}
     */
    private createComponent(componentClass, nodes?);
    /**
     * Projects the inputs onto the component
     *
     * @param {ComponentRef<any>} component
     * @param {*} options
     * @returns {ComponentRef<any>}
     */
    private projectComponentInputs(component, options);
    /**
     * Gets component and nodes to append from the content option
     *
     * @param {*} content
     * @returns {any}
     */
    private contentFrom(content?);
}
