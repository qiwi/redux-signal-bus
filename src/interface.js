// @flow

export type IFilterValue = | string | RegExp | Function| IFilterFn

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

export type IFilterFn = {
  (state: ISignalStack): ISignalStack;
}

export type ISignalStack = Array<ISignal> | void

export interface ISignal {
  constructor(opts: ISignalOpts): ISignal;
  name: string;
  data: any;
  ttl: number;
  expiresAt: number;
}

export type ISignalOpts = {
  name: string;
  data: any;
  ttl: number;
}

export interface IStore {
  dispatch: IDispatch;
  getState(): IState
}

export type IState = any

export type IDispatch = {
  (action: IAction): void
}

export interface IBus {
  scope: string;
  store: IStore;
  dispatcher: IDispatcher;

  constructor (): IBus;
  configure(opts: IBusOpts): IBus;
  emit(name: string, data?: ?any, ttl?: ?number): void;
  listen(name: string): any;
  erase(): void;
  capture(): void;
  connect(component: IReactComponent): IReactComponent;
  reducer(): void;
  getScope(): string;
}

export type IBusOpts = {
  store: IStore
}

export type IReactComponent = any

export interface IDispatcher {
  dispatch: IDispatch;
  handlers: IHandlerMap;
  constructor(): IDispatcher;
  on(event: string, handler: IHandler): void;
  emit(event: string, signal: ISignal, IFilter): IAction;
  remove(event: string): void;
}

export interface IHandler {
  (input: IHandlerArgs): ISignalStack
}

export type IHandlerMap = {
  [key: string]: IHandler
}

export type IHandlerArgs = {
  state: any;
  event: string;
  signal?: ?ISignal;
  filter?: ?Function;
}

export interface IReducer {
  reduce(state: any): any
}

