import { EventEmitter } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/merge';
import { KeyEvents } from './../navigation/key-events';
import { NavigationAction } from './../navigation/navigation-action';
import { guid, isDocumentAvailable, isPresent } from './../util';
/**
 * @hidden
 */
var ListButton = (function () {
    function ListButton(focusService, navigationService, wrapperRef, _zone) {
        this.focusService = focusService;
        this.navigationService = navigationService;
        this.wrapperRef = wrapperRef;
        this._zone = _zone;
        this._open = false;
        this._disabled = false;
        this._active = false;
        this._popupSettings = { animate: true, popupClass: '' };
        this.listId = guid();
        this._isFocused = false;
        this.wrapperBlurred = new EventEmitter();
        this.focusService = focusService;
        this.navigationService = navigationService;
        this.wrapper = wrapperRef.nativeElement;
        this.subscribeEvents();
    }
    Object.defineProperty(ListButton.prototype, "popupClasses", {
        get: function () {
            var popupClasses = [
                'k-list-container',
                'k-reset',
                'k-group'
            ];
            if (this._popupSettings.popupClass) {
                popupClasses.push(this._popupSettings.popupClass);
            }
            return popupClasses.join(' ');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListButton.prototype, "openState", {
        get: function () {
            return this._open;
        },
        set: function (open) {
            this._open = open;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    ListButton.prototype.togglePopupVisibility = function () {
        if (this._disabled) {
            return;
        }
        this.openState = !this.openState;
        if (!this.openState) {
            this.focusService.focus(-1);
        }
    };
    /**
     * @hidden
     */
    ListButton.prototype.onItemClick = function (index) {
        var _this = this;
        this.emitItemClickHandler(index);
        setTimeout(function () { _this.focusWrapper(); }, 1);
    };
    ListButton.prototype.ngOnDestroy = function () {
        this.openState = false;
        this.unsubscribeEvents();
    };
    ListButton.prototype.subscribeEvents = function () {
        if (!isDocumentAvailable()) {
            return;
        }
        this.subscribeListItemFocusEvent();
        this.subscribeComponentBlurredEvent();
        this.subscribeNavigationEvents();
    };
    ListButton.prototype.subscribeListItemFocusEvent = function () {
        var _this = this;
        this.focusSubscription = this.focusService.onFocus.subscribe(function () {
            _this._isFocused = true;
        });
    };
    ListButton.prototype.subscribeComponentBlurredEvent = function () {
        var _this = this;
        this._zone.runOutsideAngular(function () {
            _this.documentClick = Observable
                .fromEvent(document, 'click')
                .filter(function (event) {
                return !_this.wrapperContains(event.target);
            });
            _this.componentBlurredSubscription = _this.wrapperBlurred
                .merge(_this.navigationService.tab, _this.documentClick)
                .filter(function () { return _this._isFocused; })
                .subscribe(function () { return _this._zone.run(function () {
                _this.blurWrapper();
            }); });
        });
    };
    ListButton.prototype.subscribeNavigationEvents = function () {
        var _this = this;
        this.navigationSubscription = this.navigationService.navigate
            .subscribe(this.focusService.focus.bind(this.focusService));
        this.enterPressSubscription = this.navigationService.enterpress.subscribe(function () {
            if (!_this._disabled && !_this._open) {
                _this._active = true;
            }
        });
        this.enterUpSubscription = this.navigationService.enterup.subscribe(function () {
            if (!_this._open) {
                _this._active = false;
            }
            _this.enterHanlder();
            _this.focusWrapper();
        });
        this.openSubscription = this.navigationService.open.subscribe(function () {
            if (!_this._open) {
                _this.togglePopupVisibility();
                _this.focusFirstItem();
            }
            else {
                _this.focusWrapper();
            }
        });
        this.closeSubscription = this.navigationService.close
            .merge(this.navigationService.esc)
            .subscribe(function () {
            _this.focusWrapper();
        });
    };
    ListButton.prototype.enterHanlder = function () { }; // tslint:disable-line
    ListButton.prototype.unsubscribeEvents = function () {
        if (!isDocumentAvailable()) {
            return;
        }
        this.unsubscribe(this.componentBlurredSubscription);
        this.unsubscribe(this.focusSubscription);
        this.unsubscribe(this.navigationSubscription);
        this.unsubscribe(this.enterPressSubscription);
        this.unsubscribe(this.enterUpSubscription);
        this.unsubscribe(this.openSubscription);
        this.unsubscribe(this.closeSubscription);
    };
    ListButton.prototype.unsubscribe = function (subscription) {
        if (subscription) {
            subscription.unsubscribe();
        }
    };
    ListButton.prototype.keyDownHandler = function (event) {
        this.keyHandler(event);
    };
    ListButton.prototype.keyPressHandler = function (event) {
        this.keyHandler(event, KeyEvents.keypress);
    };
    ListButton.prototype.keyUpHandler = function (event) {
        this.keyHandler(event, KeyEvents.keyup);
    };
    /**
     * @hidden
     */
    ListButton.prototype.keyHandler = function (event, keyEvent) {
        if (this._disabled) {
            return;
        }
        var focused = this.focusService.focused || 0;
        var eventData = event;
        var action = this.navigationService.process({
            altKey: eventData.altKey,
            current: focused,
            keyCode: eventData.keyCode,
            keyEvent: keyEvent,
            max: this._data ? this._data.length - 1 : 0,
            min: 0
        });
        if (action !== NavigationAction.Undefined &&
            action !== NavigationAction.Tab &&
            (action !== NavigationAction.Enter || (action === NavigationAction.Enter && this._open))) {
            eventData.preventDefault();
        }
    };
    ListButton.prototype.emitItemClickHandler = function (index) {
        var dataItem = this._data[index];
        if (this._itemClick) {
            this._itemClick.emit(dataItem);
        }
        if (dataItem && dataItem.click && !dataItem.disabled) {
            dataItem.click(dataItem);
        }
    };
    ListButton.prototype.focusFirstItem = function () {
        var _this = this;
        if (this._data && isPresent(this._data[0])) {
            setTimeout(function () { _this.focusService.focus(0); }, 1);
        }
    };
    ListButton.prototype.focusWrapper = function () {
        if (this._open) {
            this.togglePopupVisibility();
            if (this.button && isDocumentAvailable()) {
                this.button.nativeElement.focus();
            }
        }
    };
    /**
     * @hidden
     */
    ListButton.prototype.blurHandler = function () {
        var _this = this;
        if (!isDocumentAvailable()) {
            return;
        }
        setTimeout(function () {
            if (!_this.wrapperContains(document.activeElement)) {
                _this.blurWrapper();
            }
        });
    };
    ListButton.prototype.wrapperContains = function (element) {
        return this.wrapper === element || this.wrapper.contains(element);
    };
    ListButton.prototype.blurWrapper = function () {
        if (this._open) {
            this.togglePopupVisibility();
        }
        this._isFocused = false;
        this._blur.emit();
    };
    return ListButton;
}());
export { ListButton };
