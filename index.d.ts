import { DateCaster } from "./ts/primitives";

declare global {
  declare interface Date {
    change(unit: "year" | "month" | "day", quantity: number): Date;
    clone(): Date;
    getAbsMonth(type: "begin" | "end"): Date;
    diff(date: Date, unit: "year" | "day"): number;
    toISOString(): DateCaster<string>;
  }

  declare interface Console {
    bgRed: string;
    fgWhite: string;
    reset: string;
  }

  declare interface Array {
    /**
     * @description
     * Takes an Array<V>, and a grouping function,
     * and returns a Map of the array grouped by the grouping function.
     *
     * @param this An array of type V.
     * @param cb A Function that takes the the Array type V as an input, and returns a value of type K.
     *                  K is generally intended to be a property key of V.
     *
     * @returns Object of the array grouped by the grouping function.
     */
    groupBy<K, V>(this: Array<V>, cb: (input: V) => K): Record<K, Array<V>>;
  }
}
