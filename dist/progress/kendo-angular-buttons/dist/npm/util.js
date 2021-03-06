"use strict";
/* tslint:disable:no-null-keyword */
/* tslint:disable:no-bitwise */
Object.defineProperty(exports, "__esModule", { value: true });
var resolvedPromise = Promise.resolve(null);
/**
 * @hidden
 */
exports.isDocumentAvailable = function () {
    return typeof document !== 'undefined';
};
/**
 * @hidden
 */
exports.isPresent = function (value) { return value !== null && value !== undefined; };
/**
 * @hidden
 */
exports.guid = function () {
    var id = "";
    var i;
    var random;
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            id += "-";
        }
        id += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return id;
};
/**
 * @hidden
 */
exports.tick = function (f) { return (resolvedPromise.then(f)); };
