// @flow

import type {IFilterPredicate, ISignal} from './interface'

export default class Filter {
  value: any
  fn: IFilterPredicate

  constructor(value: any) {
    this.fn = this.constructor.parseValue(value)
    this.value = value
  }

  static parseValue(value: any): IFilterPredicate {
    switch (true) {
      case value instanceof RegExp:
        return ({name}: ISignal) => value.test(name)

      case typeof value === 'string':
        return ({name}: ISignal) => name === value

      case typeof value === 'function':
        return value

      default:
        return () => {}
    }
  }
}