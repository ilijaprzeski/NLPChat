import firebase from 'react-native-firebase'

export const setAppState = (userId, stateName, st, other) => {
    return new Promise((resolve, reject) => {
        firebase.database().ref('users/' + userId + '/setting/' + stateName).update({
            'state': st,
            updateTime: firebase.database.ServerValue.TIMESTAMP,
            other: other ? other : null
        })
        resolve()
    })
}