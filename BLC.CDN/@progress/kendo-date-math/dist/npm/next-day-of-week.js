"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var direction_enum_1 = require("./direction.enum");
var day_of_week_1 = require("./day-of-week");
/**
 * A function returning a date by a specific week name.
 * For example, `Day.Monday`.
 *
 * @param date - The date to calculate from.
 * @param weekDay - The `Day` enum specifying the desired week day.
 * @returns - A `Date` instance.
 *
 * @example
 * ```ts-no-run
 * nextDayOfWeek(new Date(2016, 0, 1), Day.Wednesday); // 2016-01-06, Wednesday
 * ```
 */
exports.nextDayOfWeek = function (date, weekDay) {
    return day_of_week_1.dayOfWeek(date, weekDay, direction_enum_1.Direction.Forward);
};
