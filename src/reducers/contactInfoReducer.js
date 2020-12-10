import { ADD_CONTACTINFO } from '../actions/types'

const initialState = {}

const contactInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_CONTACTINFO:
            return {
                ...state,
                [action.phonenumber]: action.payload
            }
        default:
            return state
    }
}

export default contactInfoReducer