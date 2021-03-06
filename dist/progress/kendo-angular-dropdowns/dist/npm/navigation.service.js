"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var util_1 = require("./util");
var keys_1 = require("./common/keys");
var navigation_action_1 = require("./navigation-action");
var MIN_INDEX = 0;
/**
 * @hidden
 */
var NavigationEvent = (function () {
    /**
     * The index of the item to which was navigated.
     */
    function NavigationEvent(index, originalEvent) {
        this.index = index;
        this.originalEvent = originalEvent;
    }
    return NavigationEvent;
}());
exports.NavigationEvent = NavigationEvent;
/**
 * @hidden
 */
var NavigationService = (function () {
    function NavigationService() {
        this.open = new core_1.EventEmitter();
        this.close = new core_1.EventEmitter();
        this.enter = new core_1.EventEmitter();
        this.tab = new core_1.EventEmitter();
        this.esc = new core_1.EventEmitter();
        this.up = new core_1.EventEmitter();
        this.right = new core_1.EventEmitter();
        this.down = new core_1.EventEmitter();
        this.left = new core_1.EventEmitter();
        this.delete = new core_1.EventEmitter();
        this.backspace = new core_1.EventEmitter();
        this.home = new core_1.EventEmitter();
        this.end = new core_1.EventEmitter();
    }
    NavigationService.prototype.process = function (args) {
        var keyCode = args.originalEvent.keyCode;
        var altKey = args.originalEvent.altKey;
        var index;
        var action = navigation_action_1.NavigationAction.Undefined;
        if (altKey && keyCode === keys_1.Keys.down) {
            action = navigation_action_1.NavigationAction.Open;
        }
        else if (altKey && keyCode === keys_1.Keys.up) {
            action = navigation_action_1.NavigationAction.Close;
        }
        else if (keyCode === keys_1.Keys.enter) {
            action = navigation_action_1.NavigationAction.Enter;
        }
        else if (keyCode === keys_1.Keys.esc) {
            action = navigation_action_1.NavigationAction.Esc;
        }
        else if (keyCode === keys_1.Keys.tab) {
            action = navigation_action_1.NavigationAction.Tab;
        }
        else if (keyCode === keys_1.Keys.up) {
            index = this.next({ current: args.current, start: args.max, end: args.min, step: -1 });
            action = navigation_action_1.NavigationAction.Up;
        }
        else if (keyCode === keys_1.Keys.left) {
            index = this.next({ current: args.current, start: args.max, end: args.min, step: -1 });
            action = navigation_action_1.NavigationAction.Left;
        }
        else if (keyCode === keys_1.Keys.down) {
            index = this.next({ current: args.current, start: args.min, end: args.max, step: 1 });
            action = navigation_action_1.NavigationAction.Down;
        }
        else if (keyCode === keys_1.Keys.right) {
            index = this.next({ current: args.current, start: args.min, end: args.max, step: 1 });
            action = navigation_action_1.NavigationAction.Right;
        }
        else if (keyCode === keys_1.Keys.home) {
            index = MIN_INDEX;
            action = navigation_action_1.NavigationAction.Home;
        }
        else if (keyCode === keys_1.Keys.end) {
            index = args.max;
            action = navigation_action_1.NavigationAction.End;
        }
        else if (keyCode === keys_1.Keys.delete) {
            action = navigation_action_1.NavigationAction.Delete;
        }
        else if (keyCode === keys_1.Keys.backspace) {
            action = navigation_action_1.NavigationAction.Backspace;
        }
        var eventData = new NavigationEvent(index, args.originalEvent);
        if (action !== navigation_action_1.NavigationAction.Undefined) {
            this[navigation_action_1.NavigationAction[action].toLowerCase()].emit(eventData);
        }
        return action;
    };
    NavigationService.prototype.next = function (args) {
        if (!util_1.isPresent(args.current)) {
            return args.start;
        }
        else {
            return args.current !== args.end ? args.current + args.step : args.end;
        }
    };
    return NavigationService;
}());
NavigationService.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
NavigationService.ctorParameters = function () { return []; };
exports.NavigationService = NavigationService;
