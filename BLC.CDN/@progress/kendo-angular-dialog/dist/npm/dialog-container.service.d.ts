import { Renderer2, ViewContainerRef } from '@angular/core';
/**
 * @hidden
 */
export declare class DialogContainerService {
    private static container;
    private static renderer;
    container: ViewContainerRef;
    renderer: Renderer2;
    validate(): boolean;
}
