// @flow
import type {
  IDispatcher,
  IHandlerMap,
  IHandler,
  IHandlerArgs,
  IDispatch,
  ISignal,
  IFilter,
  ISignalStack,
  IAction

} from './interface'

// NOTE NodeJs EventEmitter contract
export default class Dispatcher implements IDispatcher {
  handlers: IHandlerMap
  dispatch: IDispatch
  constructor (dispatch: IDispatch): IDispatcher {
    this.dispatch = dispatch
    this.handlers = {}

    return this
  }

  emit (event: string, signal: ?ISignal, filter: ?IFilter): IAction {
    return this.dispatch({
      type: event,
      signal,
      filter
    })
  }

  on (event: string, handler: IHandler): IDispatcher {
    this.handlers[event] = handler

    return this
  }

  remove (event: string): void {
    delete this.handlers[event]
  }

  reducer (state: ISignalStack = [], {type, filter, signal}: IAction): ISignalStack {
    const handler = this.handlers[type]

    if (!handler) {
      return state
    }

    const handlerArgs: IHandlerArgs = {state, event: type, filter, signal}

    return handler(handlerArgs)
  }
}
