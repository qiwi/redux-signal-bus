import {createStore} from 'redux'
import {combineReducers} from 'react-redux'
import reducers from './reducers'
import bus from './bus'

const store = createStore(combineReducers({[bus.getScope()]: bus.getReducer(), ...reducers}))
bus.configure({store})

export default store
