import firebase from 'react-native-firebase'

export const addSms = (phone, message, userId) => {
    new Promise((resolve, reject) => {
        const ref = firebase.database().ref(`/sms/${userId}`).push()
        ref.set({
            senderId: userId,
            phoneNumber: phone,
            message,
            smsId: ref.key,
            msgTime: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            resolve()
        }).catch(error => {
            reject(error)
        })
    })
}

export const searchSms = (search, userId) => {
    return new Promise((resolve, reject) => {
        if (search.search('\n') >= 0) {
            reject("Invalid search keyword");
        } else {

            try {
                firebase.database().ref(`sms/${userId}`).once('value', snapshot => {
                    if (snapshot.exists()) {
                        var res = [];
                        snapshot.forEach(snap => {
                            const sms = snap.val()
                            if (sms.message.search(search) >= 0) {
                                sms.type = 'sms';
                                res.push(sms);
                            }
                        })
                        resolve(res);
                    } else {
                        resolve([]);
                    }
                })
            } catch (error) {
                reject(error);
            }
        }
    });
}