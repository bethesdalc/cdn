import { NgZone } from '@angular/core';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/bufferCount';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { DOMService } from './dom.service';
import { Scrollable } from '../models/scrollable.interface';
/**
 * @hidden
 */
export declare class ScrollSyncService {
    dom: DOMService;
    zone: NgZone;
    private divideByMagnitude;
    private powerByMagnitude;
    private navSubscription;
    private viewSubscription;
    private navigator;
    private view;
    constructor(dom: DOMService, zone: NgZone);
    sync(navigator: Scrollable, view: Scrollable): void;
    scrollSiblingOf(scrolledElement: HTMLElement): void;
    siblingComponent(scrollableElement: HTMLElement): Scrollable;
    calculateScroll(component: Scrollable, scrollTop: number): number;
    destroy(): void;
    private unsubscribe();
}
