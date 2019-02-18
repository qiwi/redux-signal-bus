// @flow

import type { ISignal, ISignalOpts } from './interface'

export const DEFAULT_TTL = 5000

/**
 * @class Signal
 */
export default class Signal implements ISignal {
  name: string
  data: ?any
  ttl: number
  expiresAt: number

  /**
   *
   * @param {string} name
   * @param {*} data
   * @param {number} ttl
   * @returns {Signal}
   */
  constructor ({ name, data, ttl }: ISignalOpts): ISignal {
    this.name = name
    this.ttl = ttl || DEFAULT_TTL
    this.expiresAt = Date.now() + ttl
    this.data = data

    return this
  }
}
