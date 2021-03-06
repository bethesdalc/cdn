/**
 * @hidden
 */
export declare const either: (predicate: any, right: any, left: any) => (value: any) => any;
/**
 * @hidden
 * Performs the right-to-left function composition. Functions should have a unary.
 */
export declare const compose: (...args: any[]) => (data: any) => any;
