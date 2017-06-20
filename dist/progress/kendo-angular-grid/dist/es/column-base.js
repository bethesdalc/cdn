import { Input, ContentChild, ContentChildren, QueryList } from '@angular/core';
import { HeaderTemplateDirective } from './header-template.directive';
import { FooterTemplateDirective } from './footer-template.directive';
/**
 * @hidden
 */
var ColumnBase = (function () {
    function ColumnBase(parent) {
        this.parent = parent;
        /**
         * @hidden
         */
        this.headerTemplates = new QueryList();
    }
    Object.defineProperty(ColumnBase.prototype, "width", {
        get: function () { return this._width; },
        /**
         * The width of the column in pixels.
         */
        set: function (value) {
            this._width = parseInt(value, 10);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnBase.prototype, "level", {
        /**
         * @hidden
         */
        get: function () {
            return this.parent ? this.parent.level + 1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnBase.prototype, "isLocked", {
        /**
         * @hidden
         */
        get: function () {
            return this.parent ? this.parent.isLocked : this.locked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnBase.prototype, "colspan", {
        /**
         * @hidden
         */
        get: function () {
            var _this = this;
            if (!this.children || this.children.length === 1) {
                return 1;
            }
            return this
                .children
                .filter(function (child) { return child !== _this; })
                .reduce(function (clsp, child) { return clsp + child.colspan; }, 0);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    ColumnBase.prototype.rowspan = function (totalColumnLevels) {
        return this.level < totalColumnLevels ? (totalColumnLevels - this.level) + 1 : 1;
    };
    Object.defineProperty(ColumnBase.prototype, "headerTemplateRef", {
        /**
         * @hidden
         */
        get: function () {
            var template = this.headerTemplates.first;
            return template ? template.templateRef : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnBase.prototype, "footerTemplateRef", {
        /**
         * @hidden
         */
        get: function () {
            return this.footerTemplate ? this.footerTemplate.templateRef : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnBase.prototype, "displayTitle", {
        get: function () {
            return this.title;
        },
        enumerable: true,
        configurable: true
    });
    return ColumnBase;
}());
export { ColumnBase };
ColumnBase.propDecorators = {
    'title': [{ type: Input },],
    'width': [{ type: Input },],
    'locked': [{ type: Input },],
    'hidden': [{ type: Input },],
    'media': [{ type: Input },],
    'style': [{ type: Input },],
    'headerStyle': [{ type: Input },],
    'footerStyle': [{ type: Input },],
    'cssClass': [{ type: Input, args: ['class',] },],
    'headerClass': [{ type: Input },],
    'footerClass': [{ type: Input },],
    'children': [{ type: ContentChildren, args: [ColumnBase,] },],
    'headerTemplates': [{ type: ContentChildren, args: [HeaderTemplateDirective, { descendants: false },] },],
    'footerTemplate': [{ type: ContentChild, args: [FooterTemplateDirective,] },],
};
