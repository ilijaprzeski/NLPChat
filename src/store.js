import { createStore, combineReducers } from 'redux'
import signinReducer from './reducers/signinReducer'
import userInfoReducer from './reducers/userInfoReducer'
import contactInfoReducer from './reducers/contactInfoReducer'

const rootReducer = combineReducers({
    signin: signinReducer,
    usermap: userInfoReducer,
    contactmap: contactInfoReducer
})

const configureStore = () => {
    return createStore(rootReducer)
}

export default configureStore