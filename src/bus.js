// @flow

import negate from './base';
import Dispatcher from './dispatcher'
import Signal from './signal'
import Filter from './filter'

import type {
  IBus,
  IStore,
  IDispatcher,
  IReactComponent,
  IFilterFn,
  IFilterValue, ISignalStack
} from './interface'
import {eraseSignal, listenSignal} from "./action"

export const EMIT_SIGNAL = 'EMIT_SIGNAL'
export const CAPTURE_SIGNAL = 'CAPTURE_SIGNAL'
export const LISTEN_SIGNAL = 'LISTEN_SIGNAL'
export const ERASE_SIGNAL = 'ERASE_SIGNAL'

export default class Bus implements IBus {
  scope: string
  store: IStore
  dispatcher: IDispatcher

  constructor(store: IStore) {
    this.scope = `__signal_bus__${Math.random()}`
    this.store = store
    this.dispatcher = new Dispatcher(this.store.dispatch)


    this.dispatcher
      .on(ERASE_SIGNAL, ({state, filter}) => {
        const filtered = state.filter(negate(filter.fn));

        return filtered.length !== state.length?
          filtered :
          state;
      })

    this.dispatcher
      .on(EMIT_SIGNAL, ({state, signal}) => state.concat(signal))
  }

  emit(event: string, data?: ?any, ttl?: ?number) {
    this.dispatcher.emit(
      EMIT_SIGNAL,
      new Signal({event, data, ttl})
    )
  }

  listen(filter: IFilterValue) {
    const scope = this.getScope()
    const signals: ISignalStack = (this.store.getState() || {})[scope] || []

    return signals.filter(new Filter(filter))
  }

  erase(filter: IFilterValue) {
    return this.dispatcher.emit(
      ERASE_SIGNAL,
      null,
      new Filter(filter)
    )
  }

  capture(filter: IFilterValue) {
    this.compact()

    const signals = this.listen(filter);

    if (signals.length) {
      eraseSignal(filter)
    }

    return signals;
  }

  compact() {
    const now = Date.now()
    const filter = ({expiresAt}) => expiresAt >= now

    this.erase(filter)
  }

  connect(component: IReactComponent) {

  }

  reduce() {

  }

  getScope(): string {
    return this.scope
  }
}