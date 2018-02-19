// @flow
import {connect} from 'react-redux'
import {negate, filter as _filter} from './base'
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
  ISignal
} from './interface'

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
      .on(`${this.scope}${EMIT_SIGNAL}`, ({state, signal}: IHandlerArgs) => state.concat(signal))
      .on(`${this.scope}${ERASE_SIGNAL}`, ({state, filter}: IHandlerArgs) => {
        if (!filter) {
          return state
        }

        const filtered: ISignalStack = _filter(state, negate(filter.fn))

        return filtered.length !== state.length
          ? filtered
          : state
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
   */
  emit (event: string, data: ?any, ttl: ?number): void {
    this.assertStore()

    this.dispatcher.emit(
      `${this.scope}${EMIT_SIGNAL}`,
      new Signal({name: event, data, ttl})
    )
  }

  /**
   * Fetches events from bus stream by predicate.
   * @param {string/RegExp/Function<T>} filter
   * @returns {T[]}
   */
  listen (filter: IFilterValue): ISignalStack {
    this.assertStore()
    const scope = this.getScope()
    const state: IEntireState = this.store.getState() || {}
    const signals: ISignalStack = state[scope] || []

    return _filter(signals, new Filter(filter).fn)
  }

  /**
   * Removes events from store.
   * @param  {string/RegExp/Function<T>} filter
   * @returns {*}
   */
  erase (filter: IFilterValue): void {
    this.assertStore()

    this.dispatcher.emit(
      `${this.scope}${ERASE_SIGNAL}`,
      null,
      new Filter(filter)
    )
  }

  /**
   * Fetches and removes events from bus.
   * @param {string/RegExp/Function<T>} filter
   * @returns {T[]}
   */
  capture (filter: IFilterValue): ISignalStack {
    this.assertStore()
    this.compact()

    const signals = this.listen(filter)

    if (signals.length) {
      this.erase(filter)
    }

    return signals
  }

  compact (): void {
    const now = Date.now()
    const filter = ({expiresAt}: ISignal) => now >= expiresAt

    this.erase(filter)
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

    return connect(state => ({bus, [scope]: state[scope]}))(component)
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
}
