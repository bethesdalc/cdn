import { EventEmitter, ElementRef, OpaqueToken, OnChanges, OnDestroy, OnInit, AfterViewInit, Renderer2, NgZone } from '@angular/core';
import { Scrollable } from './models/scrollable.interface';
import { DOMService } from './services/dom.service';
import { ScrollerService, PageAction, ScrollAction } from './services/scroller.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/takeWhile';
/**
 * @hidden
 */
export declare const SCROLLER_FACTORY_TOKEN: OpaqueToken;
/**
 * @hidden
 */
export declare function DEFAULT_SCROLLER_FACTORY(observable: Observable<any>): ScrollerService;
/**
 * @hidden
 */
export declare enum ScrollDirection {
    Up = 0,
    Down = 1,
}
/**
 * @hidden
 */
export declare class VirtualizationComponent implements OnChanges, OnInit, OnDestroy, AfterViewInit, Scrollable {
    container: ElementRef;
    dom: DOMService;
    renderer: Renderer2;
    zone: NgZone;
    itemHeight: number;
    topOffset: number;
    bottomOffset: number;
    scrollOffsetHeight: number;
    scrollDuration: number;
    skip: number;
    take: number;
    total: number;
    activeIndexChange: EventEmitter<number>;
    pageChange: EventEmitter<PageAction>;
    scrollChange: EventEmitter<ScrollAction>;
    totalHeight: number;
    private lastActiveIndex;
    private scroller;
    private rowHeightService;
    private dispatcher;
    private scrollSubscription;
    private containerScrollSubscription;
    private animationSubscription;
    constructor(scrollerFactory: any, container: ElementRef, dom: DOMService, renderer: Renderer2, zone: NgZone);
    wrapperClasses(): boolean;
    ngOnChanges(changes: any): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    isIndexVisible(index: number): boolean;
    scrollTo(value: number): void;
    scrollToIndex(index: number): void;
    scrollToBottom(): void;
    animateToIndex(index: number): void;
    scrollRange(indexOffset: number, direction: ScrollDirection): any;
    scrollStep(start: number, end: number): number;
    scroll$(): Observable<any>;
    private initServices();
    private createRowHeightService();
    private getTotalHeight();
    private emitActiveIndex({scrollTop});
    private getScrollDirection(indexOffset);
    private containerMaxScroll();
}
