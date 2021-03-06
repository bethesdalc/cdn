"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-access-missing-member
var core_1 = require("@angular/core");
var pager_context_service_1 = require("./pager-context.service");
var kendo_angular_l10n_1 = require("@progress/kendo-angular-l10n");
var pager_element_component_1 = require("./pager-element.component");
/**
 * Displays numeric buttons to enable navigation between the pages.
 */
var PagerNumericButtonsComponent = (function (_super) {
    __extends(PagerNumericButtonsComponent, _super);
    function PagerNumericButtonsComponent(localization, cd, pagerContext) {
        var _this = _super.call(this, localization, pagerContext) || this;
        _this.cd = cd;
        _this.pagerContext = pagerContext;
        return _this;
    }
    Object.defineProperty(PagerNumericButtonsComponent.prototype, "buttons", {
        /**
         * @hidden
         *
         * @readonly
         * @type {number[]}
         * @memberOf PagerNumericButtonsComponent
         */
        get: function () {
            var result = [];
            for (var idx = this.start; idx <= this.end; idx++) {
                result.push(idx);
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagerNumericButtonsComponent.prototype, "end", {
        /**
         * @hidden
         */
        get: function () {
            return Math.min((this.start + this.buttonCount) - 1, this.totalPages);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagerNumericButtonsComponent.prototype, "start", {
        /**
         * @hidden
         */
        get: function () {
            var page = this.currentPage;
            var buttonCount = this.buttonCount;
            if (page > buttonCount) {
                var reminder = (page % buttonCount);
                return (reminder === 0) ? (page - buttonCount) + 1 : (page - reminder) + 1;
            }
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    PagerNumericButtonsComponent.prototype.onChanges = function (_a) {
        var total = _a.total, skip = _a.skip, pageSize = _a.pageSize;
        this.total = total;
        this.skip = skip;
        this.pageSize = pageSize;
        this.cd.markForCheck();
    };
    return PagerNumericButtonsComponent;
}(pager_element_component_1.PagerElementComponent));
PagerNumericButtonsComponent.decorators = [
    { type: core_1.Component, args: [{
                changeDetection: core_1.ChangeDetectionStrategy.OnPush,
                selector: 'kendo-pager-numeric-buttons',
                template: "\n       <ul [ngClass]=\"{'k-pager-numbers': true, 'k-reset': true}\">\n            <li *ngIf=\"start > 1\"><a class=\"k-link\" href=\"#\" (click)=\"changePage(start - 2)\">...</a></li>\n            <li *ngFor=\"let num of buttons\">\n                <a href=\"#\"\n                    [ngClass]=\"{'k-link': true, 'k-state-selected':currentPage == num}\"\n                    (click)=\"changePage(num - 1)\">\n                    {{num}}\n                </a>\n            </li>\n            <li *ngIf=\"end < totalPages\"><a class=\"k-link\" href=\"#\" (click)=\"changePage(end)\">...</a></li>\n        </ul>\n    "
            },] },
];
/** @nocollapse */
PagerNumericButtonsComponent.ctorParameters = function () { return [
    { type: kendo_angular_l10n_1.LocalizationService, },
    { type: core_1.ChangeDetectorRef, },
    { type: pager_context_service_1.PagerContextService, },
]; };
PagerNumericButtonsComponent.propDecorators = {
    'buttonCount': [{ type: core_1.Input },],
};
exports.PagerNumericButtonsComponent = PagerNumericButtonsComponent;
