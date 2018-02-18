// @flow
import { connect } from 'react-redux'
import {negate} from './base'
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
  IAction
} from './interface'

export const EMIT_SIGNAL = 'EMIT_SIGNAL'
export const CAPTURE_SIGNAL = 'CAPTURE_SIGNAL'
export const LISTEN_SIGNAL = 'LISTEN_SIGNAL'
export const ERASE_SIGNAL = 'ERASE_SIGNAL'

export default class Bus implements IBus {
  scope: string
  store: IStore
  dispatcher: IDispatcher
  //compact: Function

  constructor() {
    this.scope = `__signal_bus__${Math.random()}`
    this.dispatcher = new Dispatcher(this.dispatch.bind(this))

    this.dispatcher
      .on(EMIT_SIGNAL, ({state, signal}) => state.concat(signal))
      .on(ERASE_SIGNAL, ({state, filter}) => {
        const filtered = state.filter(negate(filter.fn))

        return filtered.length !== state.length
          ? filtered
          : state
      })
  }


  configure({store}: IBusOpts) {
    this.store = store
  }

  /**
   * Dispatches redux action to store
   * @param {IAction} action
   */
  dispatch(action: IAction) {
    if (this.store) {
      return this.store.dispatch(action)
    }
  }

  /**
   * Emits new bus event.
   * @param {string} event
   * @param {Mixed} [data]
   * @param {number} [ttl]
   */
  emit(event: string, data?: ?any, ttl?: ?number) {
    this.assertStore()

    this.dispatcher.emit(
      EMIT_SIGNAL,
      new Signal({name: event, data, ttl})
    )
  }

  /**
   * Fetches events from bus stream by predicate.
   * @param {string/RegExp/Function<T>} filter
   * @returns {T[]}
   */
  listen(filter: IFilterValue) {
    this.assertStore()
    const scope = this.getScope()
    const signals: ISignalStack = (this.store.getState() || {})[scope] || []

    //const signals: ISignalStack = this.dispatcher.emit(LISTEN_SIGNAL)

    //console.log('!!!listen', signals)
    //return [];
    return signals.filter(new Filter(filter).fn)
  }

  /**
   * Removes events from store.
   * @param  {string/RegExp/Function<T>} filter
   * @returns {*}
   */
  erase(filter: IFilterValue) {
    this.assertStore()

    return this.dispatcher.emit(
      ERASE_SIGNAL,
      null,
      new Filter(filter)
    )
  }

  /**
   * Fetches and removes events from bus.
   * @param {string/RegExp/Function<T>} filter
   * @returns {T[]}
   */
  capture(filter: IFilterValue) {
    this.assertStore()
    this.compact()

    const signals = this.listen(filter);

    if (signals.length) {
      this.erase(filter)
    }

    return signals
  }

  compact() {
    const now = Date.now()
    const filter = ({expiresAt}) => now >= expiresAt

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
  connect(component: IReactComponent) {
    const scope = this.getScope()

    return connect(state => ({[scope]: state[scope]}))(component)
  }

  /**
   * Returns bus reducer to integrate with store.
   * @returns {*}
   */
  getReducer() {
    return this.dispatcher.reducer.bind(this.dispatcher)
  }

  /**
   * Returns bus scope id.
   * @returns {*}
   */
  getScope(): string {
    return this.scope
  }

  assertStore() {
    if (!this.store) {
      throw new Error('store is required')
    }
  }
}