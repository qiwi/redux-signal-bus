# redux-signal-bus
[![buildStatus](https://api.travis-ci.com/qiwi/redux-signal-bus.svg?branch=master)](https://travis-ci.com/qiwi/redux-signal-bus)
[![dependencyStatus](https://img.shields.io/david/qiwi/redux-signal-bus.svg?maxAge=3600)](https://david-dm.org/qiwi/redux-signal-bus)
[![devDependencyStatus](https://img.shields.io/david/dev/qiwi/redux-signal-bus.svg?maxAge=3600)](https://david-dm.org/qiwi/redux-signal-bus)
[![Maintainability](https://api.codeclimate.com/v1/badges/3a306db9033bf8a25d73/maintainability)](https://codeclimate.com/github/qiwi/redux-signal-bus/maintainability)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![coverage](https://img.shields.io/coveralls/qiwi/redux-signal-bus.svg?maxAge=3600)](https://coveralls.io/github/qiwi/redux-signal-bus)

We'll create our own notification bus with ttl, filters, blackjack and hookers over redux.
## Install
```bash
    yarn add @qiwi/redux-signal-bus
    npm i @qiwi/redux-signal-bus
```

## Usage
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