import { ADD_USERINFO } from './types'

export const addUserInfo = (userId, userInfo) => {
    return {
        type: ADD_USERINFO,
        payload: userInfo,
        userId: userId
    }
}