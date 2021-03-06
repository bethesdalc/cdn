import { EventEmitter } from '@angular/core';
import { NavigationAction } from './navigation-action';
/**
 * @hidden
 */
export declare class NavigationEvent {
    index: number;
    originalEvent: KeyboardEvent;
    /**
     * The index of the item to which was navigated.
     */
    constructor(index: number, originalEvent: KeyboardEvent);
}
/**
 * @hidden
 */
export declare class NavigationService {
    open: EventEmitter<NavigationEvent>;
    close: EventEmitter<NavigationEvent>;
    enter: EventEmitter<NavigationEvent>;
    tab: EventEmitter<NavigationEvent>;
    esc: EventEmitter<NavigationEvent>;
    up: EventEmitter<NavigationEvent>;
    right: EventEmitter<NavigationEvent>;
    down: EventEmitter<NavigationEvent>;
    left: EventEmitter<NavigationEvent>;
    delete: EventEmitter<NavigationEvent>;
    backspace: EventEmitter<NavigationEvent>;
    home: EventEmitter<NavigationEvent>;
    end: EventEmitter<NavigationEvent>;
    process(args: any): NavigationAction;
    private next(args);
}
