"use strict";
/**
 * @hidden
 */
exports.either = function (predicate, right, left) { return function (value) { return predicate(value) ? right(value) : left(value); }; };
/**
 * @hidden
 * Performs the right-to-left function composition. Functions should have a unary.
 */
exports.compose = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    return function (data) { return args.reduceRight(function (acc, curr) { return curr(acc); }, data); };
};
