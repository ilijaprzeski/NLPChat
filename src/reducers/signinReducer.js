import { SET_SIGNIN_USER_INFO } from '../actions/types'

const initialState = {
    signin_user_info: null
}

const signinReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SIGNIN_USER_INFO:
            return {
                ...state,
                signin_user_info: action.payload
            }
        default:
            return state
    }
}

export default signinReducer