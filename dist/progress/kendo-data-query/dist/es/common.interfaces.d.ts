/**
 * @hidden
 */
export declare type Combinator = <T, U>(acc: U, curr: T) => T;
/**
 * @hidden
 */
export declare type Reducer = (reduce: Combinator) => Transformer;
/**
 * @hidden
 */
export declare type TransformerResult<T> = {
    __value: T;
    reduced: boolean;
};
/**
 * @hidden
 */
export declare type Transformer = <T, U>(acc: U, curr: T, index: number) => U | TransformerResult<U>;
/**
 * A type representing a function that returns a Boolean value.
 *
 * @example
 * ```ts-no-run
 * const isGreaterThanTen: Predicate = (num: number) => num > 10;
 * isGreaterThanTen(2); // false
 * isGreaterThanTen(20); // true
 * ```
 */
export declare type Predicate = <T>(x: T) => boolean;
