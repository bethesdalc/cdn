import { Component, Input, Output, EventEmitter, ViewChildren, ViewChild } from '@angular/core';
import { DropDownsUtil as Util } from '@telerik/kendo-dropdowns-common';
import { ListItemDirective } from './list-item.directive';
import { isPresent } from './util';
import { SelectionService } from './selection.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
/**
 * @hidden
 */
var ListComponent = (function () {
    function ListComponent(selectionService) {
        this.data = [];
        this.selected = [];
        this.focused = -1;
        this.multipleSelection = false;
        this.onClick = new EventEmitter();
        this.selectionService = selectionService;
        this.scrollSubscription = this.selectionService
            .onSelect
            .map(function (args) { return args.indices[0]; })
            .merge(this.selectionService.onFocus)
            .subscribe(this.scrollToItem.bind(this));
    }
    ListComponent.prototype.ngAfterViewInit = function () {
        if (this.show === true) {
            this.scrollToItem(this.selectionService.focused);
        }
    };
    ListComponent.prototype.ngOnDestroy = function () {
        this.scrollSubscription.unsubscribe();
    };
    ListComponent.prototype.setContainerClasses = function () {
        return {
            'k-list-scroller': true
        };
    };
    ListComponent.prototype.getHeight = function () {
        return this.height + "px";
    };
    ListComponent.prototype.getText = function (dataItem) {
        return Util.getter(dataItem, this.textField);
    };
    ListComponent.prototype.getValue = function (dataItem) {
        return Util.getter(dataItem, this.valueField);
    };
    ListComponent.prototype.scrollToItem = function (index) {
        var items = this.items.toArray();
        if (isPresent(items[index]) && index !== -1) {
            this.scroll(items[index].element);
        }
    };
    ListComponent.prototype.scroll = function (item) {
        if (!item) {
            return;
        }
        var nativeElement = item.nativeElement;
        var content = this.content.nativeElement, itemOffsetTop = nativeElement.offsetTop, itemOffsetHeight = nativeElement.offsetHeight, contentScrollTop = content.scrollTop, contentOffsetHeight = content.clientHeight, bottomDistance = itemOffsetTop + itemOffsetHeight;
        if (contentScrollTop > itemOffsetTop) {
            contentScrollTop = itemOffsetTop;
        }
        else if (bottomDistance > (contentScrollTop + contentOffsetHeight)) {
            contentScrollTop = (bottomDistance - contentOffsetHeight);
        }
        content.scrollTop = contentScrollTop;
    };
    return ListComponent;
}());
export { ListComponent };
ListComponent.decorators = [
    { type: Component, args: [{
                selector: 'kendo-list',
                template: "\n    <div #content [ngClass]=\"setContainerClasses()\" [style.maxHeight]=\"getHeight()\" unselectable=\"on\">\n    <ul role=\"listbox\" [attr.id]=\"id\" [attr.aria-hidden]=\"!show\" [ngClass]=\"{ 'k-list': true, 'k-reset': true }\">\n        <li role=\"option\"\n            *ngFor=\"let dataItem of data; let index = index\"\n            kendoDropDownsSelectable\n            [index]=\"index\"\n            [multipleSelection]=\"multipleSelection\"\n            [attr.id]=\"optionPrefix + '-' + getValue(dataItem)\"\n            [attr.tabIndex]=\"-1\"\n            [ngClass]=\"{'k-item': true}\">\n            <ng-template *ngIf=\"template\"\n                [templateContext]=\"{\n                    templateRef: template.templateRef,\n                    $implicit: dataItem\n                }\">\n            </ng-template>\n            <ng-template [ngIf]=\"!template\">{{ getText(dataItem) }}</ng-template>\n        </li>\n    </ul>\n    </div>\n  "
            },] },
];
/** @nocollapse */
ListComponent.ctorParameters = function () { return [
    { type: SelectionService, },
]; };
ListComponent.propDecorators = {
    'data': [{ type: Input },],
    'selected': [{ type: Input },],
    'focused': [{ type: Input },],
    'textField': [{ type: Input },],
    'valueField': [{ type: Input },],
    'height': [{ type: Input },],
    'template': [{ type: Input },],
    'show': [{ type: Input },],
    'id': [{ type: Input },],
    'optionPrefix': [{ type: Input },],
    'multipleSelection': [{ type: Input },],
    'onClick': [{ type: Output },],
    'items': [{ type: ViewChildren, args: [ListItemDirective,] },],
    'content': [{ type: ViewChild, args: ['content',] },],
};
