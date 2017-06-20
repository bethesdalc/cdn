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
var core_1 = require("@angular/core");
var expand_state_service_1 = require("../expand-state.service");
/**
 * @hidden
 */
var GroupsService = (function (_super) {
    __extends(GroupsService, _super);
    function GroupsService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupsService.prototype.isInExpandedGroup = function (groupIndex, skipSelf) {
        if (skipSelf === void 0) { skipSelf = true; }
        if (skipSelf) {
            groupIndex = groupIndex.slice(0, groupIndex.lastIndexOf("_"));
        }
        var expanded = true;
        while (groupIndex && expanded) {
            expanded = this.isExpanded(groupIndex);
            groupIndex = groupIndex.slice(0, groupIndex.lastIndexOf("_"));
        }
        return expanded;
    };
    GroupsService.prototype.isExpanded = function (index) {
        return !_super.prototype.isExpanded.call(this, index);
    };
    return GroupsService;
}(expand_state_service_1.ExpandStateService));
GroupsService.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
GroupsService.ctorParameters = function () { return []; };
exports.GroupsService = GroupsService;
