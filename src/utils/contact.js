import firebase from 'react-native-firebase'

export const addFiksalContact = (yourId, addId) => {
    firebase.database().ref(`contacts/${yourId}/${addId}`).set({
        status: true
    });
}