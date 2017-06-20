import { Day } from "./day.enum";
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
 * prevDayOfWeek(new Date(2016, 0, 1), Day.Wednesday); // 2015-12-30, Wednesday
 * ```
 */
export declare const prevDayOfWeek: (date: Date, weekDay: Day) => Date;
