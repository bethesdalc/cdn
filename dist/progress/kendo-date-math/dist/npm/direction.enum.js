"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Enumeration representing the horizontal direction.
 * The `Forward` option moves forward.
 * The `Backward` option moves backward.
 */
var Direction;
(function (Direction) {
    /**
     * The `Forward` value with an underlying `1` number value.
     */
    Direction[Direction["Forward"] = 1] = "Forward";
    /**
     * The `Backward` value with an underlying `-1` (minus one) number value.
     */
    Direction[Direction["Backward"] = -1] = "Backward";
})(Direction = exports.Direction || (exports.Direction = {}));
;
