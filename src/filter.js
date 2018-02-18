// @flow

import type {IFilter, IFilterPredicate, IFilterValue, ISignal} from './interface'

export default class Filter implements IFilter{
  value: IFilterValue
  fn: IFilterPredicate

  constructor(value: IFilterValue): IFilter {
    this.fn = this.constructor.parseValue(value)
    this.value = value

    return this
  }

  static parseValue(value: IFilterValue): IFilterPredicate {
    switch (true) {
      case value instanceof RegExp:
        return ({name}: ISignal): boolean => value.test(name)

      case typeof value === 'string':
        return ({name}: ISignal): boolean => name === value

      case typeof value === 'function':
        return (...args) => !!value(...args)

      default:
        return () => false
    }
  }
}