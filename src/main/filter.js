// @flow

import type { IFilter, IFilterPredicate, IFilterValue, ISignal } from './interface'

/**
 * Filter constructor.
 * @class Filter
 */
export default class Filter implements IFilter {
  value: IFilterValue
  fn: IFilterPredicate

  /**
   *
   * @param {*} value
   * @returns {Filter}
   */
  constructor (value: IFilterValue): IFilter {
    this.value = value
    this.fn = this.constructor.parseValue(value)

    return this
  }

  /**
   * @static
   * @param {*} value
   * @returns {Function}
   */
  static parseValue (value: IFilterValue): IFilterPredicate {
    if (typeof value === 'function') { // Flow can not resolve it
      const fn: Function = value
      return (...args): boolean => !!fn(...args)
    }

    if (value instanceof RegExp) { // and this one too
      const regex: RegExp = value
      return ({ name }: ISignal): boolean => regex.test(name)
    }

    if (typeof value === 'string') {
      return ({ name }: ISignal): boolean => name === value
    }

    return () => false
  }
}
