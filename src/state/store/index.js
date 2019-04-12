import {createStore, applyMiddleware} from 'redux'
import promiseMiddleware from 'redux-promise'
import reducer from '../reducers'

var createStoreWithMiddleware = applyMiddleware(
    promiseMiddleware
)(createStore)

var store = createStoreWithMiddleware(reducer)

export default store
