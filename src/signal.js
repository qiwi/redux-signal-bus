// @flow

import type {ISignal, ISignalOpts} from './interface'

export const DEFAULT_TTL = 5000

export default class Signal implements ISignal{
  name: string
  data: any
  ttl: number
  expiresAt: number

  constructor({name, data, ttl = DEFAULT_TTL}: ISignalOpts): ISignal {
    this.name = name
    this.ttl = ttl
    this.expiresAt = Date.now() + ttl
    this.data = data

    return this
  }
}