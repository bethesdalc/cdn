import { Injectable, EventEmitter } from '@angular/core';
import { isPresent } from './util';
import { Keys } from './common/keys';
import { NavigationAction } from './navigation-action';
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
export { NavigationEvent };
/**
 * @hidden
 */
var NavigationService = (function () {
    function NavigationService() {
        this.open = new EventEmitter();
        this.close = new EventEmitter();
        this.enter = new EventEmitter();
        this.tab = new EventEmitter();
        this.esc = new EventEmitter();
        this.up = new EventEmitter();
        this.right = new EventEmitter();
        this.down = new EventEmitter();
        this.left = new EventEmitter();
        this.delete = new EventEmitter();
        this.backspace = new EventEmitter();
        this.home = new EventEmitter();
        this.end = new EventEmitter();
    }
    NavigationService.prototype.process = function (args) {
        var keyCode = args.originalEvent.keyCode;
        var altKey = args.originalEvent.altKey;
        var index;
        var action = NavigationAction.Undefined;
        if (altKey && keyCode === Keys.down) {
            action = NavigationAction.Open;
        }
        else if (altKey && keyCode === Keys.up) {
            action = NavigationAction.Close;
        }
        else if (keyCode === Keys.enter) {
            action = NavigationAction.Enter;
        }
        else if (keyCode === Keys.esc) {
            action = NavigationAction.Esc;
        }
        else if (keyCode === Keys.tab) {
            action = NavigationAction.Tab;
        }
        else if (keyCode === Keys.up) {
            index = this.next({ current: args.current, start: args.max, end: args.min, step: -1 });
            action = NavigationAction.Up;
        }
        else if (keyCode === Keys.left) {
            index = this.next({ current: args.current, start: args.max, end: args.min, step: -1 });
            action = NavigationAction.Left;
        }
        else if (keyCode === Keys.down) {
            index = this.next({ current: args.current, start: args.min, end: args.max, step: 1 });
            action = NavigationAction.Down;
        }
        else if (keyCode === Keys.right) {
            index = this.next({ current: args.current, start: args.min, end: args.max, step: 1 });
            action = NavigationAction.Right;
        }
        else if (keyCode === Keys.home) {
            index = MIN_INDEX;
            action = NavigationAction.Home;
        }
        else if (keyCode === Keys.end) {
            index = args.max;
            action = NavigationAction.End;
        }
        else if (keyCode === Keys.delete) {
            action = NavigationAction.Delete;
        }
        else if (keyCode === Keys.backspace) {
            action = NavigationAction.Backspace;
        }
        var eventData = new NavigationEvent(index, args.originalEvent);
        if (action !== NavigationAction.Undefined) {
            this[NavigationAction[action].toLowerCase()].emit(eventData);
        }
        return action;
    };
    NavigationService.prototype.next = function (args) {
        if (!isPresent(args.current)) {
            return args.start;
        }
        else {
            return args.current !== args.end ? args.current + args.step : args.end;
        }
    };
    return NavigationService;
}());
export { NavigationService };
NavigationService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
NavigationService.ctorParameters = function () { return []; };
