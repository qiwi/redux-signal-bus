# redux-signal-bus
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![Greenkeeper badge](https://badges.greenkeeper.io/qiwi/redux-signal-bus.svg)](https://greenkeeper.io/)
![buildStatus](https://travis-ci.org/qiwi/redux-signal-bus.svg?branch=master)
![coverage](https://coveralls.io/repos/qiwi/redux-signal-bus/badge.svg)
![deps](https://david-dm.org/qiwi/redux-signal-bus.svg)
![devDeps](https://david-dm.org/qiwi/redux-signal-bus/dev-status.svg)

We'll create our own notification bus with ttl, filters, blackjack and hookers over redux.

##### Inject to store
Since [store.getReducer](https://github.com/reactjs/redux/issues/350) was replaced from redux, there's no tricky way to inject reducer to chain.
So you need to wrap bus instance manually in accordance to your app architecture

```javascript
    const bus = new Bus()
    const store = createStore({[bus.getScope()]: bus.getReducer(), ...})
    bus.configure({store})
```

##### Bind with component

```javascript
    class Item extends Component {
      render (props) {
        return props.bus.listen('foo')
      }
    }
    export default bus.connect(Item)
```

Don't forget to wrap your app with redux provider
```javascript
    <Provider store={store}><App/></Provider>
```
or just inject the store by hand 
```javascript
    const ItemWithBus = bus.connect(Item)
    const component = new ItemWithBus({store})
```

##### Bus API

```javascript
    export type IFilterValue = | string | RegExp | Function | any
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

```

Usage examples are placed in ./example dir. In general it looks like this:

```javascript
import bus from '../bus'
import React, {Component} from 'react'

class BarComponent extends Component {
  render(props) {
    return (<div>
      Signals from from the 'FooComponent':
      {props.bus.listen('foo').map(({data}) => JSON.stringify(data)).join(', ')}
    </div>)
  }
}

export default bus.connect(BarComponent)
```