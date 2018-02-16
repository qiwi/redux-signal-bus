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
export default class Dispatcher implements IDispatcher{
  handlers: IHandlerMap
  dispatch: IDispatch
  constructor(dispatch: IDispatch) {
    this.dispatch = dispatch
    this.handlers = {}
  }

  emit(event: string, signal?: ?ISignal, filter: IFilter) {
    return this.dispatch({
      type: event,
      signal,
      filter,
    })
  }

  on(event: string, handler: IHandler) {
    this.handlers[event] = handler
  }

  remove(event: string) {
    delete this.handlers[event]
  }

  reducer(state: ISignalStack = [], {event, filter, signal}: IAction): ISignalStack {
    const handler = this.handlers[event];

    if (!handler) {
      return state;
    }

    const handlerArgs: IHandlerArgs = {state, event, filter, signal}

    return handler(handlerArgs);
  }
}