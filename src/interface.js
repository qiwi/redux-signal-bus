// @flow

export type IFilterValue = | string | RegExp | Function | any

export type IAction = {
  type: string;
  signal: ?ISignal;
  filter: ?IFilter;
}

export interface IFilterPredicate {
  (signal: ISignal): boolean
}

export interface IFilter {
  constructor(value: IFilterValue): IFilter;
  value: IFilterValue;
  fn: IFilterPredicate;
}

export type ISignalStack = Array<ISignal>

export interface ISignal {
  constructor(opts: ISignalOpts): ISignal;
  name: string;
  data: any;
  ttl: number;
  expiresAt: number;
}

export type ISignalOpts = {
  name: string;
  data: ?any;
  ttl: ?number;
}

export type ISignalState = {
  stack: ISignalStack;
  hash: number;
}

export interface IStore {
  dispatch: IDispatch;
  getState(): IState
}

export type IState = any

export type IEntireState = {
  [key: string]: any;
}

export type IDispatch = {
  (action: IAction): IAction
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

export type IBusOpts = {
  store: IStore
}

export type IReactComponent = any

export interface IDispatcher {
  dispatch: IDispatch;
  handlers: IHandlerMap;
  constructor(dispatch: IDispatch): IDispatcher;
  on(event: string, handler: IHandler): IDispatcher;
  emit(event: string, signal: ?ISignal, filter: ?IFilter): IAction;
  remove(event: string): void;
  reducer(state: IState, action: IAction): IState;
}

export interface IHandler {
  (input: IHandlerArgs): ISignalState
}

export type IHandlerMap = {
  [key: string]: IHandler
}

export type IHandlerArgs = {
  state: ISignalState;
  event: string;
  signal: ?ISignal;
  filter: ?IFilter;
}

export interface IReducer {
  reduce(state: any): any
}

export type ISilent = boolean

