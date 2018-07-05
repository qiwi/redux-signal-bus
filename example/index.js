import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import FooComponent from './components/FooComponent'
import BarComponent from './components/BarComponent'

const App = () => (
  <Provider store={store}>
    <FooComponent/>
    <BarComponent/>
  </Provider>
)

ReactDOM.render(<App />, document.getElementById('root'));