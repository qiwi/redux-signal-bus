// @flow
import type {
  IDispatcher,
  IHandlerMap,
  IHandler,
  IHandlerArgs,
  IDispatch,
  ISignal,
  IFilter,
  IAction,
  ISignalState

} from './interface'

// NOTE NodeJs EventEmitter contract
/**
 * Layer to produce redux actions and handle state mutations through reducer
 * @class Dispacher
 * @private
 */
export default class Dispatcher implements IDispatcher {
  handlers: IHandlerMap
  dispatch: IDispatch

  /**
   * Constructs dispatcher.
   * @param {Function} dispatch
   * @returns {Dispatcher}
   */
  constructor (dispatch: IDispatch): IDispatcher {
    this.dispatch = dispatch
    this.handlers = {}

    return this
  }

  /**
   * Emits new action.
   * @param {string} event
   * @param {Signal} signal
   * @param {Filter} filter
   * @returns {Action} regular redux action
   */
  emit (event: string, signal: ?ISignal, filter: ?IFilter): IAction {
    return this.dispatch({
      type: event,
      signal,
      filter
    })
  }

  /**
   * Creates a subscription for target event.
   * @param {string} event
   * @param {Function} handler
   * @returns {Dispatcher}
   */
  on (event: string, handler: IHandler): IDispatcher {
    this.handlers[event] = handler

    return this
  }

  /**
   * Destructs the subscription by name.
   * @param {string} event
   */
  remove (event: string): void {
    delete this.handlers[event]
  }

  /**
   * Redux reducer.
   * @param {*} state
   * @param {string} type
   * @param {Filter} filter
   * @param {Signal} signal
   * @returns {ISignalState}
   */
  reducer (state: ISignalState = { stack: [], hash: 0 }, { type, filter, signal }: IAction): ISignalState {
    const handler = this.handlers[type]

    if (!handler) {
      return state
    }

    const handlerArgs: IHandlerArgs = { state, event: type, filter, signal }

    return handler(handlerArgs)
  }
}
