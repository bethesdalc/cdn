import { Component, Input, Output, EventEmitter, HostBinding, ViewChild, Inject, Optional, OpaqueToken, NgZone, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { RTL } from '@progress/kendo-angular-l10n';
import { RowHeightService } from './row-height.service';
import { ScrollerService, PageAction, ScrollAction } from './scroller.service';
import { isChanged, isPresent, isUniversal } from './utils';
import { DetailsService } from './details.service';
import { ColumnsContainer } from './columns-container';
import { ChangeNotificationService } from './change-notification.service';
import { syncRowsHeight } from './row-sync';
import { SuspendService } from './suspend.service';
import { GroupsService } from "./grouping/groups.service";
/**
 * @hidden
 */
export var SCROLLER_FACTORY_TOKEN = new OpaqueToken('grid-scroll-service-factory');
/**
 * @hidden
 */
export function DEFAULT_SCROLLER_FACTORY(observable) {
    return new ScrollerService(observable);
}
;
var wheelDeltaY = function (e) {
    var deltaY = e.wheelDeltaY;
    if (e.wheelDelta && (deltaY === undefined || deltaY)) {
        return e.wheelDelta;
    }
    else if (e.detail && e.axis === e.VERTICAL_AXIS) {
        return (-e.detail) * 10;
    }
    return 0;
};
var preventLockedScroll = function (el) { return function (event) {
    if (el.scrollHeight > el.offsetHeight + el.scrollTop && el.scrollTop > 0) {
        event.preventDefault();
    }
}; };
var translateY = function (renderer, value) { return function (el) { return renderer.setStyle(el, "transform", "translateY(" + value + "px)"); }; };
var firstChild = function (el) { return el ? el.nativeElement.children[0] : null; };
/**
 * @hidden
 */
var ListComponent = (function () {
    function ListComponent(scrollerFactory, detailsService, changeNotification, suspendService, rtl, groupsService, ngZone, renderer) {
        if (rtl === void 0) { rtl = false; }
        var _this = this;
        this.changeNotification = changeNotification;
        this.suspendService = suspendService;
        this.rtl = rtl;
        this.groupsService = groupsService;
        this.ngZone = ngZone;
        this.renderer = renderer;
        this.groups = [];
        this.skip = 0;
        this.columns = new ColumnsContainer(function () { return []; });
        this.groupable = false;
        this.pageChange = new EventEmitter();
        this.containerScroll = new EventEmitter();
        this.dispatcher = new Subject();
        this.scroller = scrollerFactory(this.dispatcher);
        this.subscriptions = detailsService.changes.subscribe(function (x) { return _this.detailExpand(x); });
    }
    Object.defineProperty(ListComponent.prototype, "hostClass", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListComponent.prototype, "showFooter", {
        get: function () {
            return this.groupable && this.groupable.showFooter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListComponent.prototype, "lockedLeafColumns", {
        get: function () {
            return this.columns.lockedLeafColumns;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListComponent.prototype, "nonLockedLeafColumns", {
        get: function () {
            return this.columns.nonLockedLeafColumns;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListComponent.prototype, "lockedWidth", {
        get: function () {
            var groupCellsWidth = this.groups.length * 30;
            return this.lockedLeafColumns.reduce(function (prev, curr) { return prev + (curr.width || 0); }, groupCellsWidth);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListComponent.prototype, "nonLockedWidth", {
        get: function () {
            if (this.lockedLeafColumns.length) {
                return this.nonLockedLeafColumns.reduce(function (prev, curr) { return prev + (curr.width || 0); }, 0);
            }
            if (this.rtl) {
                return this.nonLockedLeafColumns.reduce(function (prev, curr) { return prev + curr.width; }, 0) || "100%";
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListComponent.prototype, "isLocked", {
        get: function () {
            return this.lockedLeafColumns.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    ListComponent.prototype.ngOnInit = function () {
        this.init();
        this.handleRowSync();
    };
    ListComponent.prototype.ngOnChanges = function (changes) {
        if (isChanged("total", changes)) {
            this.init();
        }
    };
    ListComponent.prototype.ngAfterViewInit = function () {
        this.container.nativeElement.scrollTop = this.rowHeightService.offset(this.skip);
        this.attachContainerScroll();
    };
    ListComponent.prototype.syncRowsHeight = function () {
        if (this.lockedContainer) {
            syncRowsHeight(this.lockedContainer.nativeElement.children[0], this.container.nativeElement.children[0]);
        }
    };
    ListComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
        if (this.scroller) {
            this.scroller.destroy();
        }
    };
    ListComponent.prototype.init = function () {
        if (this.suspendService.scroll) {
            return;
        }
        this.rowHeightService = new RowHeightService(this.total, this.rowHeight, this.detailRowHeight);
        this.totalHeight = this.rowHeightService.totalHeight();
        this.ngZone.runOutsideAngular(this.createScroller.bind(this));
    };
    ListComponent.prototype.detailExpand = function (_a) {
        var index = _a.index, expand = _a.expand;
        if (expand) {
            this.rowHeightService.expandDetail(index);
        }
        else {
            this.rowHeightService.collapseDetail(index);
        }
        this.totalHeight = this.rowHeightService.totalHeight();
    };
    ListComponent.prototype.attachContainerScroll = function () {
        var _this = this;
        if (!isUniversal()) {
            this.ngZone.runOutsideAngular(function () {
                return _this.subscriptions.add(Observable.fromEvent(_this.container.nativeElement, 'scroll')
                    .map(function (event) { return event.target; })
                    .filter(function () { return !_this.suspendService.scroll; })
                    .do(_this.onContainerScroll.bind(_this))
                    .subscribe(_this.dispatcher));
            });
            if (this.lockedContainer) {
                this.subscriptions.add(Observable.fromEvent(this.lockedContainer.nativeElement, 'mousewheel')
                    .merge(Observable.fromEvent(this.lockedContainer.nativeElement, 'DOMMouseScroll'))
                    .filter(function (event) { return !event.ctrlKey; })
                    .do(preventLockedScroll(this.container.nativeElement))
                    .map(wheelDeltaY)
                    .subscribe(function (x) { return _this.container.nativeElement.scrollTop -= x; }));
                this.syncRowsHeight();
            }
        }
    };
    ListComponent.prototype.createScroller = function () {
        var _this = this;
        var observable = this.scroller
            .create(this.rowHeightService, this.skip, this.take, this.total);
        this.subscriptions.add(observable
            .filter(function (x) { return x instanceof PageAction; })
            .subscribe(function (x) { return _this.ngZone.run(function () { return _this.pageChange.emit(x); }); })
            .add(observable
            .filter(function (x) { return x instanceof ScrollAction; })
            .subscribe(this.scroll.bind(this))));
    };
    ListComponent.prototype.scroll = function (_a) {
        var offset = _a.offset;
        [
            firstChild(this.container),
            firstChild(this.lockedContainer)
        ].filter(isPresent).forEach(translateY(this.renderer, offset));
    };
    ListComponent.prototype.onContainerScroll = function (_a) {
        var scrollTop = _a.scrollTop, scrollLeft = _a.scrollLeft;
        if (this.lockedContainer) {
            this.lockedContainer.nativeElement.scrollTop = scrollTop;
        }
        this.containerScroll.emit({ scrollTop: scrollTop, scrollLeft: scrollLeft });
    };
    ListComponent.prototype.handleRowSync = function () {
        var _this = this;
        this.ngZone.runOutsideAngular(function () {
            return _this.subscriptions.add(_this.changeNotification.changes
                .merge(_this.groupsService.changes.switchMap(function () { return _this.ngZone.onStable.take(1); }))
                .filter(function () { return isPresent(_this.lockedContainer); })
                .subscribe(function () { return _this.syncRowsHeight(); }));
        });
    };
    return ListComponent;
}());
export { ListComponent };
ListComponent.decorators = [
    { type: Component, args: [{
                providers: [
                    {
                        provide: SCROLLER_FACTORY_TOKEN,
                        useValue: DEFAULT_SCROLLER_FACTORY
                    }
                ],
                selector: 'kendo-grid-list',
                template: "\n    <div #lockedContainer class=\"k-grid-content-locked\"\n        *ngIf=\"isLocked\" [style.width.px]=\"lockedWidth\">\n        <table>\n            <colgroup kendoGridColGroup\n                [groups]=\"groups\"\n                [columns]=\"lockedLeafColumns\"\n                [detailTemplate]=\"detailTemplate\">\n            </colgroup>\n            <tbody kendoGridTableBody\n                [groups]=\"groups\"\n                [data]=\"data\"\n                [noRecordsText]=\"''\"\n                [columns]=\"lockedLeafColumns\"\n                [detailTemplate]=\"detailTemplate\"\n                [showGroupFooters]=\"showFooter\"\n                [skip]=\"skip\"\n                [selectable]=\"selectable\"\n                [rowClass]=\"rowClass\">\n            </tbody>\n        </table>\n        <div class=\"k-height-container\">\n            <div [style.height.px]=\"totalHeight\"></div>\n        </div>\n    </div><div #container class=\"k-grid-content k-virtual-content\"\n        [kendoGridResizableContainer]=\"lockedLeafColumns.length\"\n        [lockedWidth]=\"lockedWidth + 1\">\n        <table [style.width.px]=\"nonLockedWidth\">\n            <colgroup kendoGridColGroup\n                [groups]=\"isLocked ? [] : groups\"\n                [columns]=\"nonLockedLeafColumns\"\n                [detailTemplate]=\"detailTemplate\">\n            </colgroup>\n            <tbody kendoGridTableBody\n                [skipGroupDecoration]=\"isLocked\"\n                [data]=\"data\"\n                [groups]=\"groups\"\n                [showGroupFooters]=\"showFooter\"\n                [columns]=\"nonLockedLeafColumns\"\n                [detailTemplate]=\"detailTemplate\"\n                [noRecordsTemplate]=\"noRecordsTemplate\"\n                [lockedColumnsCount]=\"lockedLeafColumns.length\"\n                [skip]=\"skip\"\n                [selectable]=\"selectable\"\n                [rowClass]=\"rowClass\">\n            </tbody>\n        </table>\n        <div class=\"k-height-container\">\n            <div [style.height.px]=\"totalHeight\"></div>\n        </div>\n    </div>"
            },] },
];
/** @nocollapse */
ListComponent.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [SCROLLER_FACTORY_TOKEN,] },] },
    { type: DetailsService, },
    { type: ChangeNotificationService, },
    { type: SuspendService, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [RTL,] },] },
    { type: GroupsService, },
    { type: NgZone, },
    { type: Renderer2, },
]; };
ListComponent.propDecorators = {
    'hostClass': [{ type: HostBinding, args: ["class.k-grid-container",] },],
    'data': [{ type: Input },],
    'groups': [{ type: Input },],
    'total': [{ type: Input },],
    'rowHeight': [{ type: Input },],
    'detailRowHeight': [{ type: Input },],
    'take': [{ type: Input },],
    'skip': [{ type: Input },],
    'columns': [{ type: Input },],
    'detailTemplate': [{ type: Input },],
    'noRecordsTemplate': [{ type: Input },],
    'selectable': [{ type: Input },],
    'groupable': [{ type: Input },],
    'rowClass': [{ type: Input },],
    'pageChange': [{ type: Output },],
    'containerScroll': [{ type: Output },],
    'container': [{ type: ViewChild, args: ["container",] },],
    'lockedContainer': [{ type: ViewChild, args: ["lockedContainer",] },],
};
