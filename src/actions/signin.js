import { SET_SIGNIN_USER_INFO } from './types'

export const setSigninUserInfo = userInfo => {
    return {
        type: SET_SIGNIN_USER_INFO,
        payload: userInfo
    }
}