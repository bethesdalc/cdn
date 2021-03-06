"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:component-selector-name  component-selector-type */
var core_1 = require("@angular/core");
var dom_service_1 = require("./services/dom.service");
var row_height_service_1 = require("./services/row-height.service");
var scroller_service_1 = require("./services/scroller.service");
var util_1 = require("../util");
var Rx_1 = require("rxjs/Rx");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/observable/fromEvent");
require("rxjs/add/observable/interval");
require("rxjs/add/observable/empty");
require("rxjs/add/operator/combineLatest");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/map");
require("rxjs/add/operator/scan");
require("rxjs/add/operator/takeWhile");
/**
 * @hidden
 */
exports.SCROLLER_FACTORY_TOKEN = new core_1.OpaqueToken('calendar-scroll-service-factory');
/**
 * @hidden
 */
function DEFAULT_SCROLLER_FACTORY(observable) {
    return new scroller_service_1.ScrollerService(observable);
}
exports.DEFAULT_SCROLLER_FACTORY = DEFAULT_SCROLLER_FACTORY;
;
/**
 * @hidden
 */
var ScrollDirection;
(function (ScrollDirection) {
    ScrollDirection[ScrollDirection["Up"] = 0] = "Up";
    ScrollDirection[ScrollDirection["Down"] = 1] = "Down";
})(ScrollDirection = exports.ScrollDirection || (exports.ScrollDirection = {}));
;
var FRAME_DURATION = 17;
var scrollModifiers = (_a = {},
    _a[ScrollDirection.Down] = function (step) { return function (value) { return value + step; }; },
    _a[ScrollDirection.Up] = function (step) { return function (value) { return value - step; }; },
    _a);
var scrollNormalizers = (_b = {},
    _b[ScrollDirection.Down] = function (end) { return function (value) { return Math.min(value, end); }; },
    _b[ScrollDirection.Up] = function (end) { return function (value) { return Math.max(value, end); }; },
    _b);
var scrollValidators = (_c = {},
    _c[ScrollDirection.Down] = function (end) { return function (start) { return start < end; }; },
    _c[ScrollDirection.Up] = function (end) { return function (start) { return start > end; }; },
    _c);
var differenceToScroll = function (scrollTop, staticOffset, maxScrollDifference) {
    return Math.min(Math.abs(staticOffset - scrollTop), maxScrollDifference);
};
/**
 * @hidden
 */
var VirtualizationComponent = (function () {
    function VirtualizationComponent(scrollerFactory, container, dom, renderer, zone) {
        this.container = container;
        this.dom = dom;
        this.renderer = renderer;
        this.zone = zone;
        this.itemHeight = 1;
        this.topOffset = 0;
        this.bottomOffset = 0;
        this.scrollOffsetHeight = 0;
        this.scrollDuration = 150;
        this.activeIndexChange = new core_1.EventEmitter();
        this.pageChange = new core_1.EventEmitter();
        this.scrollChange = new core_1.EventEmitter();
        this.dispatcher = new Subject_1.Subject();
        this.scroller = scrollerFactory(this.dispatcher);
    }
    VirtualizationComponent.prototype.wrapperClasses = function () {
        return true;
    };
    VirtualizationComponent.prototype.ngOnChanges = function (changes) {
        if (changes.take || changes.total) {
            this.initServices();
            this.totalHeight = this.getTotalHeight();
        }
    };
    VirtualizationComponent.prototype.ngOnInit = function () {
        if (!this.rowHeightService) {
            this.rowHeightService = this.createRowHeightService();
        }
    };
    VirtualizationComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.zone.runOutsideAngular(function () {
            _this.containerScrollSubscription = _this.scroll$()
                .map(function (event) { return event.target; })
                .subscribe(function (t) {
                _this.dispatcher.next(t);
                _this.zone.run(function () { return _this.emitActiveIndex(t); });
            });
        });
    };
    VirtualizationComponent.prototype.ngOnDestroy = function () {
        if (this.containerScrollSubscription) {
            this.containerScrollSubscription.unsubscribe();
        }
        if (this.scrollSubscription) {
            this.scrollSubscription.unsubscribe();
        }
    };
    VirtualizationComponent.prototype.isIndexVisible = function (index) {
        if (!this.rowHeightService) {
            return false;
        }
        var currentScrollTop = this.container.nativeElement.scrollTop;
        var top = this.rowHeightService.offset(index);
        var bottom = top + this.rowHeightService.height(index);
        return currentScrollTop >= top && currentScrollTop <= bottom;
    };
    VirtualizationComponent.prototype.scrollTo = function (value) {
        this.renderer.setProperty(this.container.nativeElement, 'scrollTop', value);
    };
    VirtualizationComponent.prototype.scrollToIndex = function (index) {
        this.scrollTo(this.rowHeightService.offset(index));
    };
    VirtualizationComponent.prototype.scrollToBottom = function () {
        this.scrollTo(this.totalHeight);
    };
    VirtualizationComponent.prototype.animateToIndex = function (index) {
        var _this = this;
        if (this.animationSubscription) {
            this.animationSubscription.unsubscribe();
        }
        var indexOffset = this.rowHeightService.offset(index);
        var direction = this.getScrollDirection(indexOffset);
        var _a = this.scrollRange(indexOffset, direction), start = _a.start, end = _a.end;
        var step = this.scrollStep(start, end);
        if (start === end) {
            return;
        }
        var modifyScroll = scrollModifiers[direction](step);
        var normalizeScroll = scrollNormalizers[direction](end);
        var isScrollValid = scrollValidators[direction](modifyScroll(end));
        var animationFrame$ = Observable_1.Observable.interval(0, Rx_1.Scheduler.animationFrame);
        this.animationSubscription = Observable_1.Observable.of(start)
            .combineLatest(animationFrame$)
            .map(function (stream) { return stream[0]; })
            .scan(modifyScroll)
            .takeWhile(isScrollValid)
            .map(normalizeScroll)
            .subscribe(function (x) { return _this.scrollTo(x); });
    };
    VirtualizationComponent.prototype.scrollRange = function (indexOffset, direction) {
        var containerElement = this.container.nativeElement;
        var sign = direction === ScrollDirection.Up ? 1 : -1;
        var max = this.containerMaxScroll();
        var difference = differenceToScroll(containerElement.scrollTop, indexOffset, this.dom.monthViewHeight());
        var end = Math.min(indexOffset, max);
        var start = Math.min(Math.max(end + (sign * difference), 0), max);
        return { start: start, end: end };
    };
    VirtualizationComponent.prototype.scrollStep = function (start, end) {
        return Math.abs(end - start) / (this.scrollDuration / FRAME_DURATION);
    };
    VirtualizationComponent.prototype.scroll$ = function () {
        return util_1.isDocumentAvailable() ? Observable_1.Observable.fromEvent(this.container.nativeElement, 'scroll') : Observable_1.Observable.empty();
    };
    ;
    VirtualizationComponent.prototype.initServices = function () {
        var _this = this;
        this.rowHeightService = this.createRowHeightService();
        if (this.scrollSubscription) {
            this.scrollSubscription.unsubscribe();
        }
        this.scrollSubscription = this.scroller
            .create(this.rowHeightService, this.skip, this.take, this.total, this.topOffset, this.scrollOffsetHeight)
            .subscribe(function (x) { return _this.zone.run(function () {
            if (x instanceof scroller_service_1.PageAction) {
                _this.pageChange.emit(x);
            }
            else {
                _this.scrollChange.emit(x);
            }
        }); });
    };
    VirtualizationComponent.prototype.createRowHeightService = function () {
        return new row_height_service_1.RowHeightService(this.total, this.itemHeight, 0);
    };
    VirtualizationComponent.prototype.getTotalHeight = function () {
        return this.rowHeightService.totalHeight() + this.bottomOffset;
    };
    VirtualizationComponent.prototype.emitActiveIndex = function (_a) {
        var scrollTop = _a.scrollTop;
        var index = this.rowHeightService.index(scrollTop - this.topOffset);
        if (this.lastActiveIndex !== index) {
            this.lastActiveIndex = index;
            this.activeIndexChange.emit(index);
        }
    };
    VirtualizationComponent.prototype.getScrollDirection = function (indexOffset) {
        return indexOffset < this.container.nativeElement.scrollTop ? ScrollDirection.Up : ScrollDirection.Down;
    };
    VirtualizationComponent.prototype.containerMaxScroll = function () {
        var containerElement = this.container.nativeElement;
        return containerElement.scrollHeight - containerElement.offsetHeight;
    };
    return VirtualizationComponent;
}());
VirtualizationComponent.decorators = [
    { type: core_1.Component, args: [{
                changeDetection: core_1.ChangeDetectionStrategy.OnPush,
                providers: [{
                        provide: exports.SCROLLER_FACTORY_TOKEN,
                        useValue: DEFAULT_SCROLLER_FACTORY
                    }],
                selector: 'kendo-calendar-virtualization',
                template: "\n    <ng-content></ng-content>\n    <div\n        class=\"k-scrollable-placeholder\"\n        [style.height.px]=\"totalHeight\"\n    ></div>\n  "
            },] },
];
/** @nocollapse */
VirtualizationComponent.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core_1.Inject, args: [exports.SCROLLER_FACTORY_TOKEN,] },] },
    { type: core_1.ElementRef, },
    { type: dom_service_1.DOMService, },
    { type: core_1.Renderer2, },
    { type: core_1.NgZone, },
]; };
VirtualizationComponent.propDecorators = {
    'itemHeight': [{ type: core_1.Input },],
    'topOffset': [{ type: core_1.Input },],
    'bottomOffset': [{ type: core_1.Input },],
    'scrollOffsetHeight': [{ type: core_1.Input },],
    'scrollDuration': [{ type: core_1.Input },],
    'skip': [{ type: core_1.Input },],
    'take': [{ type: core_1.Input },],
    'total': [{ type: core_1.Input },],
    'activeIndexChange': [{ type: core_1.Output },],
    'pageChange': [{ type: core_1.Output },],
    'scrollChange': [{ type: core_1.Output },],
    'wrapperClasses': [{ type: core_1.HostBinding, args: ['class.k-content',] }, { type: core_1.HostBinding, args: ['class.k-scrollable',] },],
};
exports.VirtualizationComponent = VirtualizationComponent;
var _a, _b, _c;
