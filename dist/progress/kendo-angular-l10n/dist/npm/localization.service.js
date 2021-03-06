"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var message_service_1 = require("./message.service");
/**
 * Localization prefix for the component messages.
 *
 * For internal use.
 * @hidden
 */
exports.L10N_PREFIX = new core_1.OpaqueToken('Localization key prefix');
/**
 * Component localization service.
 *
 * For internal use.
 * @hidden
 */
var LocalizationService = (function () {
    function LocalizationService(prefix, messageService) {
        this.prefix = prefix;
        this.messageService = messageService;
        this.dictionary = {};
    }
    LocalizationService.prototype.get = function (shortKey) {
        var key = this.key(shortKey);
        return this.dictionary[key];
    };
    LocalizationService.prototype.register = function (shortKey, value, override) {
        if (override === void 0) { override = false; }
        var key = this.key(shortKey);
        var message = value;
        if (!override) {
            if (this.dictionary.hasOwnProperty(key)) {
                return;
            }
            message = this.defaultValue(key, value);
        }
        this.dictionary[key] = message;
    };
    LocalizationService.prototype.key = function (shortKey) {
        return this.prefix + '.' + shortKey;
    };
    LocalizationService.prototype.defaultValue = function (key, value) {
        if (!this.messageService) {
            return value;
        }
        var alt = this.messageService.get(key);
        return (alt === undefined) ? value : alt;
    };
    return LocalizationService;
}());
LocalizationService.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
LocalizationService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core_1.Inject, args: [exports.L10N_PREFIX,] },] },
    { type: message_service_1.MessageService, decorators: [{ type: core_1.Optional },] },
]; };
exports.LocalizationService = LocalizationService;
