# redux-signal-bus
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
![buildStatus](https://travis-ci.org/qiwi/redux-signal-bus.svg?branch=master)
![coverage](https://coveralls.io/repos/qiwi/redux-signal-bus/badge.svg)
![deps](https://david-dm.org/qiwi/redux-signal-bus.svg)
![devDeps](https://david-dm.org/qiwi/redux-signal-bus/dev-status.svg)

We'll create our own notification bus with ttl, filters, blackjack and hookers over redux.

#####Inject to store
Since [store.getReducer](https://github.com/reactjs/redux/issues/350) was replaced from redux, there's no tricky way to inject reducer to chain.
So you need to wrap bus instance manually in accordance to your app architecture
```
    const bus = new Bus()
    const store = createStore({[bus.getScope()]: bus.getReducer(), ...})
    bus.configure({store})
```

#####Bind with component

```
    class Item extends Component {
      render (props) {
        return props.bus.listen('foo')
      }
    }
    export default bus.connect(Item)
```

Don't forget to wrap your app with redux provider
```
    <Provider store={store}><App/></Provider>
```
or just inject the store by hand 
```
    const ItemWithBus = bus.connect(Item)
    const component = new ItemWithBus({store})
```

#####Bus API

```
    export type IFilterValue = | string | RegExp | Function | any

    export interface IBus {
      scope: string;
      store: IStore;
      dispatcher: IDispatcher;
    
      constructor(): IBus;
      configure(opts: IBusOpts): IBus;
      emit(name: string, data?: ?any, ttl?: ?number): void;
      listen(value: IFilterValue): ISignalStack;
      erase(value: IFilterValue): void;
      capture(value: IFilterValue): ISignalStack;
      connect(component: IReactComponent): IReactComponent;
      getReducer(): IReducer;
      getScope(): string;
    }

```

#####Usage example

######bus.js

```
    import Bus from 'redux-signal-bus'
   
    // singleton 
    const bus = new Bus()
    
    export default bus
```

######store.js

```
    import {createStore} from 'redux'
    import {combineReducers} from 'react-redux'
    import bus from './bus'
    import reducers from './reducers'

    const store = createStore(combineReducers({[bus.getScope()]: bus.getReducer(), ...reducers}))
    bus.configure({store})

    export default store
```

######App.js
```
    import React from 'react'
    import {Provider} from 'react-redux'
    import {FirstComponent, SecondComponent} from './components'
    
    export default () => (
        <Provider store={store}>
            <FirstComponent/>
            <SecondComponent/>
        </Provider>
    )
```

######components/FirstComponent.js

```
import bus from './bus'
import React, {Component} from 'react'

class FirstComponent extends Component {
    doSomething() {
        this.props.bus.emit('foo', {bar: 'baz'})
        ...
    }
    render() {
        <div>
            <a onClick={this.doSomething.bind(this)}>click</a>
        </div>
    }
}

export default bus.connect(FirstComponent)
```


######components/SecondComponent.js

```
import bus from './bus'
import React, {Component} from 'react'

class SecondComponent extends Component {
    render(props) {
        return (<div>
            Signals from from the 'FirstComponent':
            {props.bus.listen('foo').map(({data}) => JSON.stringify(data)).join(', ')}
        </div>)
    }
}

export default bus.connect(SecondComponent)
```