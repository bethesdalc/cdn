import { ElementRef, EventEmitter } from '@angular/core';
import { AfterViewChecked, OnDestroy } from '@angular/core';
import 'rxjs/add/operator/auditTime';
/**
 * Resize Sensor Component
 *
 * Triggers a "resize" event whenever the parent DOM element size changes.
 */
export declare class ResizeSensorComponent implements AfterViewChecked, OnDestroy {
    private element;
    /**
     * The maximum number of resize events to emit per second.
     *
     * Defaults to 10.
     */
    rateLimit: number;
    /**
     * Fires when the parent DOM element has been resized.
     */
    resize: EventEmitter<any>;
    /**
     * @hidden
     */
    expand: ElementRef;
    /**
     * @hidden
     */
    expandChild: ElementRef;
    /**
     * @hidden
     */
    shrink: ElementRef;
    private subscription;
    private source;
    private parentElement;
    private lastWidth;
    private lastHeight;
    private initialized;
    constructor(element: ElementRef);
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    scroll(): void;
    private reset();
}
