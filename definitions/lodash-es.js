
declare module 'lodash-es' {
  declare export function filter<V>(value?: ?V, fn: Function): V;
  declare export function negate(predicate: Function): Function;
  declare export function get(obj: any, path: ?string): any;
}