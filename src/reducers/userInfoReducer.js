import { ADD_USERINFO } from '../actions/types'

const initialState = {}

const userInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_USERINFO:
            return {
                ...state,
                [action.userId]: action.payload
            }
        default:
            return state
    }
}

export default userInfoReducer