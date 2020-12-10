import firebase from 'react-native-firebase'

export const selectUser = (id) => {
    return new Promise((resolve, reject) => {
        try {
            firebase.database().ref('users/' + id).once('value', snapshot => {
                if (snapshot.exists()) {
                    const user = snapshot.val();
                    resolve(user);
                } else {
                    resolve(null);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export const selectUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        try {
            firebase.database().ref('users/').orderByChild('email').equalTo(email).once('value', snapshot => {
                if (snapshot.exists()) {
                    let user = null
                    snapshot.forEach(snap => {
                        user = snap.val();
                    })
                    resolve(user);
                } else {
                    resolve(null);
                }
            });
        } catch (error) {
            resolve(null)
        }
    });
}

export const isExistEmail = (email) => {
    return new Promise((resolve, reject) => {
        try {
            firebase.database().ref('users').orderByChild('email').equalTo(email).once('value', (snapshot) => {
                if (snapshot.exists()){
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export const changePassword = (oldPassword, newPassword) => {
	return new Promise((resolve, reject) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);

        user.reauthenticateWithCredential(cred).then(() => {
            var user = firebase.auth().currentUser;
            user.updatePassword(newPassword).then(() => {
                resolve(true);
            }).catch((error) => {
                reject(error);
            });
        }).catch((error) => {
            reject(error);
        });
	});
}

const searchByUserName = (search, currentUserId) => {
    return new Promise(async (resolve, reject) => {

        if (search.search('\n') >= 0) {
            reject("Invalid search keyword");
        } else {
            
            try {
                firebase.database().ref('users').orderByChild('fullName').startAt(search).endAt(search + "\uf8ff").once('value', snapshot => {
                    if (snapshot.exists()) {
                        let res = [];
                        snapshot.forEach(snap => {
                            if(snap.key !== currentUserId){
                                const user = snap.val();
                                res.push(user);
                            }
                        })
                        resolve(res)
                    } else {
                        resolve([])
                    }
                })
            } catch(error) {
                resolve([])
            }
        }
    });
}

const searchByEmail = (search, currentUserId) => {
    return new Promise(async (resolve, reject) => {

        if (search.search('\n') >= 0) {
            reject("Invalid search keyword");
        } else {
            
            try {
                firebase.database().ref('users').orderByChild('email').startAt(search).endAt(search + "\uf8ff").once('value', snapshot => {
                    if (snapshot.exists()) {
                        let res = [];
                        snapshot.forEach(snap => {
                            if(snap.key !== currentUserId){
                                const user = snap.val();
                                res.push(user);
                            }
                        })
                        resolve(res)
                    } else {
                        resolve([])
                    }
                })
            } catch(error) {
                resolve([])
            }
        }
    });
}

export const searchUsers = (search, currentUserId) => {
    return new Promise(async (resolve, reject) => {

        if (search.search('\n') >= 0) {
            reject("Invalid search keyword");
        } else {
            
            try {
                var user1 = await searchByUserName(search, currentUserId);
                var user2 = await searchByEmail(search, currentUserId);

                var users = user1.concat(user2);
                users.sort((a, b) => {
                    if (a.fullName > b.fullName)    return 1;
                    else                            return -1;
                })

                const map = new Map();
                const uResult = [];

                for (const item of users) {
                    if(!map.has(item.userId)){
                        map.set(item.userId, true);    // set any value to Map
                        uResult.push(item);
                    }
                }
                resolve(uResult);
            } catch(error) {
                reject(error);
            }
        }
    });
}