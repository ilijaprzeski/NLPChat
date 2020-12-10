import { ADD_CONTACTINFO } from './types'

export const addContactInfo = (phonenumber, contactInfo) => {
    return {
        type: ADD_CONTACTINFO,
        payload: contactInfo,
        phonenumber: phonenumber
    }
}