// @flow
import {connect} from 'react-redux'
import {negate, filter as _filter, get} from './base'
import Dispatcher from './dispatcher'
import Signal from './signal'
import Filter from './filter'

import type {
  IBus,
  IBusOpts,
  IStore,
  IDispatcher,
  IReactComponent,
  IFilterValue,
  ISignalStack,
  IAction,
  IHandlerArgs,
  IEntireState,
  ISignal,
  ISignalState,
  ISilent
} from './interface'

export const HASH_UPDATE = 'HASH_UPDATE'
export const EMIT_SIGNAL = 'EMIT_SIGNAL'
export const CAPTURE_SIGNAL = 'CAPTURE_SIGNAL'
export const LISTEN_SIGNAL = 'LISTEN_SIGNAL'
export const ERASE_SIGNAL = 'ERASE_SIGNAL'

export default class Bus implements IBus {
  scope: string
  store: IStore
  dispatcher: IDispatcher

  constructor (): IBus {
    this.scope = `@@signal_bus_${Math.random()}`
    this.dispatcher = new Dispatcher(this.dispatch.bind(this))

    this.dispatcher
      .on(`${this.scope}${HASH_UPDATE}`, ({state: {stack}}: IHandlerArgs) => ({hash: Math.random(), stack}))
      .on(`${this.scope}${EMIT_SIGNAL}`, ({state: {stack, hash}, signal}: IHandlerArgs) => ({hash, stack: signal ? stack.concat(signal): stack}))
      .on(`${this.scope}${ERASE_SIGNAL}`, ({state: {stack, hash}, filter}: IHandlerArgs) => {
        if (!filter) {
          return {stack, hash}
        }

        const filtered: ISignalStack = _filter(stack, negate(filter.fn))

        const nextStack = filtered.length !== stack.length
          ? filtered
          : stack

        return {stack: nextStack, hash}
      })

    return this
  }

  /**
   * Configures bus instance.
   * @param {IStore} store
   * @returns {Bus}
   */
  configure ({store}: IBusOpts): IBus {
    this.store = store

    return this
  }

  /**
   * Dispatches redux action to store
   * @param {IAction} action
   */
  dispatch (action: IAction): IAction {
    return this.store.dispatch(action)
  }

  /**
   * Emits new bus event.
   * @param {string} event
   * @param {Mixed} [data]
   * @param {number} [ttl]
   * @param {boolean} [silent]
   */
  emit (event: string, data: ?any, ttl: ?number, silent: ?ISilent): void {
    this.assertStore()

    this.dispatcher.emit(
      `${this.scope}${EMIT_SIGNAL}`,
      new Signal({name: event, data, ttl})
    )

    if (!silent) {
      this.hashUpdate()
    }
  }

  /**
   * Fetches events from bus stream by predicate.
   * @param {string/RegExp/Function<T>} filter
   * @param {boolean} [silent]
   * @param {boolean} [skipCompact]
   * @returns {T[]}
   */
  listen (filter: IFilterValue, silent: ?ISilent, skipCompact: ?boolean): ISignalStack {
    this.assertStore()

    if (!skipCompact) {
      this.compact(silent)
    }

    const scope = this.getScope()
    const state: IEntireState = this.store.getState() || {}
    const signalState: ISignalState = state[scope] || {stack: [], hash: 0}
    const signals: ISignalStack = signalState.stack

    return _filter(signals, new Filter(filter).fn)
  }

  /**
   * Removes events from bus.
   * @param  {string/RegExp/Function<T>} filter
   * @param {boolean} [silent]
   * @returns {ISignalStack}
   */
  erase (filter: IFilterValue, silent: ?ISilent): ISignalStack {
    this.assertStore()
    const signals = this.listen(filter, silent, true)

    if (signals.length > 0) {
      this.dispatcher.emit(
        `${this.scope}${ERASE_SIGNAL}`,
        null,
        new Filter(filter)
      )

      if (!silent) {
        this.hashUpdate()
      }
    }

    return signals
  }

  /**
   * Fetches and removes events from bus.
   * @param {string/RegExp/Function<T>} filter
   * @param {boolean} [silent]
   * @returns {T[]}
   */
  capture (filter: IFilterValue, silent: ?ISilent): ISignalStack {
    return this.erase(filter, silent)
  }

  /**
   * Removes expired signals.
   * @param {boolean} [silent]
   */
  compact (silent: ?ISilent): void {
    const now = Date.now()
    const filter = ({expiresAt}: ISignal) => now >= expiresAt

    this.erase(filter, silent)
  }

  /**
   * Erases expired events from bus store.
   * @return {undefined}
   * @method compact
   */

  /**
   * Connects bus to target react component.
   * @param {React.Component} component
   * @returns {React.Component}
   */
  connect (component: IReactComponent): IReactComponent {
    const scope = this.getScope()
    const bus = {
      listen: this.listen.bind(this),
      emit: this.emit.bind(this),
      capture: this.capture.bind(this),
      erase: this.erase.bind(this)
    }

    return connect(state => ({bus, [scope]: get(state, `${scope}.hash`)}))(component)
  }

  /**
   * Returns bus reducer to integrate with store.
   * @returns {*}
   */
  getReducer (): Function {
    return this.dispatcher.reducer.bind(this.dispatcher)
  }

  /**
   * Returns bus scope id.
   * @returns {*}
   */
  getScope (): string {
    return this.scope
  }

  assertStore (): void {
    if (!this.store) {
      throw new Error('store is required')
    }
  }

  hashUpdate(): void {
    this.assertStore()

    this.dispatcher.emit(`${this.scope}${HASH_UPDATE}`)
  }
}
