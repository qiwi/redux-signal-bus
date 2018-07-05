// @flow

export type IFilterValue = | string | RegExp | Function | any

export type ISignalOpts = {
  name: string;
  data: ?any;
  ttl: ?number;
}
export interface ISignal {
  constructor(opts: ISignalOpts): ISignal;
  name: string;
  data: any;
  ttl: number;
  expiresAt: number;
}
export type ISignalStack = Array<ISignal>

export interface IFilterPredicate {
  (signal: ISignal): boolean
}

export interface IFilter {
  constructor(value: IFilterValue): IFilter;
  value: IFilterValue;
  fn: IFilterPredicate;
}

export type IAction = {
  type: string;
  signal: ?ISignal;
  filter: ?IFilter;
}

export type ISignalState = {
  stack: ISignalStack;
  hash: number;
}

export type IDispatch = {
  (action: IAction): IAction
}

export type IState = any

export interface IStore {
  dispatch: IDispatch;
  getState(): IState
}

export type IEntireState = {
  [key: string]: any;
}
export type IReactComponent = any
export type ISilent = boolean

export type IBusOpts = {
  store: IStore
}
export type IHandlerArgs = {
  state: ISignalState;
  event: string;
  signal: ?ISignal;
  filter: ?IFilter;
}
export interface IHandler {
  (input: IHandlerArgs): ISignalState
}
export type IHandlerMap = {
  [key: string]: IHandler
}
export interface IDispatcher {
  dispatch: IDispatch;
  handlers: IHandlerMap;
  constructor(dispatch: IDispatch): IDispatcher;
  on(event: string, handler: IHandler): IDispatcher;
  emit(event: string, signal: ?ISignal, filter: ?IFilter): IAction;
  remove(event: string): void;
  reducer(state: IState, action: IAction): IState;
}

export interface IReducer {
  reduce(state: any): any
}

export interface IBus {
  scope: string;
  store: IStore;
  dispatcher: IDispatcher;

  constructor(): IBus;
  configure(opts: IBusOpts): IBus;
  emit(name: string, data?: ?any, ttl?: ?number, silent: ?ISilent): void;
  listen(value: IFilterValue, silent: ?ISilent, skipCompact: ?boolean): ISignalStack;
  erase(value: IFilterValue, silent: ?ISilent): ISignalStack;
  capture(value: IFilterValue, silent: ?ISilent): ISignalStack;
  connect(component: IReactComponent): IReactComponent;
  getReducer(): IReducer;
  getScope(): string;
  hashUpdate(): void
}
