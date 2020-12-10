import firebase from 'react-native-firebase';

export const getContacts = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            firebase.database().ref('contacts/' + userId).once('value', snapshot => {
                if (snapshot.exists()) {
                    let res = [];
                    snapshot.forEach(snap => {
                        const contact = {
                            userId: snap.key
                        }

                        res.push(contact);
                    })
                    resolve(res);
                } else {
                    resolve(null);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export const isExistContact = (userId1, userId2) => {  // whether user2 is exist in user1's contact
    return new Promise((resolve, rejcet) => {
        firebase.database().ref().child('contacts/' + userId1 + '/' + userId2).once('value', snapshot => {
            if (snapshot.exists()) {
                resolve(true)
            } else {
                resolve(false)
            }
        });
    })
}

export const addContact = (userId1, userId2) => {  // add user2 to user1's contacts
    return new Promise((resolve, reject) => {
        firebase.database().ref('contacts/' + userId1 + '/' + userId2).set({
            status: true
        });
        resolve(true)
    })
}

export const generateChatRoom = (userId1, userId2) => {
    return new Promise(async (resolve, reject) => {
        try {
            const st1 = await isExistContact(userId1, userId2)
            if (!st1) {
                await addContact(userId1, userId2);
            }

            const st2 = await isExistContact(userId2, userId1)
            if (!st2) {
                await addContact(userId2, userId1);
            }

            const chatRoomRef = firebase.database().ref().child('chatRooms').push()
            chatRoomRef.set({
                chatRoomId: chatRoomRef.key,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            })

            const userChatRef1 = firebase.database().ref().child('userChats').push()
            userChatRef1.set({
                chatRoomId: chatRoomRef.key,
                userId: userId1,
                userChatId: userChatRef1.key,
                partnerId: userId2,
                keyIndex: userId1 + '-' + userId2
            })

            const userChatRef2 = firebase.database().ref().child('userChats').push()
            userChatRef2.set({
                chatRoomId: chatRoomRef.key,
                userId: userId2,
                userChatId: userChatRef2.key,
                partnerId: userId1,
                keyIndex: userId2 + '-' + userId1
            })

            resolve(chatRoomRef.key)
        } catch (error) {
            reject(error)
        }
    });
}

export const sendMessage = (msg, senderId, receiverId, chatRoomId) => {
    return new Promise((resolve, reject) => {
        firebase.database().ref('userChats').orderByChild('chatRoomId').equalTo(chatRoomId).once('value', snapshot => {
            if (snapshot.exists()) {
                snapshot.forEach(snap => {
                    firebase.database().ref('userChats/' + snap.key).update({
                        lastMsg: msg,
                        msgTime: firebase.database.ServerValue.TIMESTAMP,
                        senderId
                    });
                })
                const msgRef = firebase.database().ref('messages/' + chatRoomId).push()
                msgRef.set({
                    msg: msg,
                    msgTime: firebase.database.ServerValue.TIMESTAMP,
                    chatRoomId: chatRoomId,
                    senderId,
                    receiverId,
                    messageId: msgRef.key
                })
            }
            resolve()
        })
    });
}

export const sendFileMessage = (downloadUrl, fileName, senderId, receiverId, chatRoomId) => {
    return new Promise((resolve, reject) => {
        firebase.database().ref('userChats').orderByChild('chatRoomId').equalTo(chatRoomId).once('value', snapshot => {
            if (snapshot.exists()) {
                snapshot.forEach(snap => {
                    firebase.database().ref('userChats/' + snap.key).update({
                        lastMsg: 'File',
                        msgTime: firebase.database.ServerValue.TIMESTAMP,
                        senderId
                    });
                })

                const msgRef = firebase.database().ref('messages/' + chatRoomId).push()
                msgRef.set({
                    type: 'file',
                    downloadUrl,
                    fileName,
                    status: 'finished',
                    msgTime: firebase.database.ServerValue.TIMESTAMP,
                    chatRoomId: chatRoomId,
                    senderId,
                    receiverId,
                    senderOpen: false,
                    receiverOpen: false,
                    messageId: msgRef.key
                })
            }
            resolve()
        })
    })
}

export const getChatRooms = (userId) => {
    return new Promise((resolve, reject) => {
        firebase.database().ref('userChats').orderByChild('userId').equalTo(userId).once('value', snapshot => {
            if (snapshot.exists()) {
                let res = []
                snapshot.forEach(snap => {
                    let chatRoom = snap.val();
                    chatRoom.type = 'chat';
                    res.push(chatRoom);
                });
                resolve(res);
            } else {
                resolve()
            }
        });
    });
}

export const getMessages = (chatRoomId, limit) => {
    return new Promise((resolve, reject) => {
        firebase.database().ref('messages/' + chatRoomId).orderByChild('msgTime').limitToLast(limit).once('value', snapshot => {
            if (snapshot.exists()) {
                let res = [];
                snapshot.forEach(snap => {
                    res.push(snap.val());
                })
                resolve(res)
            } else {
                resolve()
            }
        });
    });
}

export const getRemainMessages = (chatRoomId, offset, limit) => {
    return new Promise((resolve, reject) => {
        firebase.database().ref('messages/' + chatRoomId).orderByChild('msgTime').endAt(offset).limitToLast(limit).once('value', snapshot => {
            if (snapshot.exists()) {
                let res = [];
                snapshot.forEach(snap => {
                    res.push(snap.val());
                })
                resolve(res)
            } else {
                resolve()
            }
        });
    });
}

export const getVocabularyColor = (word) => {
    if (word.average_offensiveness === undefined) {
        return '#ffff06';
    } else if (word.average_offensiveness < 34) {
        return '#ffff06';
    } else if (word.average_offensiveness < 67) {
        return '#ffc000';
    } else {
        return '#fe0002';
    }
}

export const getVocabularyLevel = (word) => {
    if (word.average_offensiveness === undefined) {
        return 'Low';
    } else if (word.average_offensiveness < 34) {
        return 'Low';
    } else if (word.average_offensiveness < 67) {
        return 'Medium';
    } else {
        return 'High';
    }
}

export const searchChatRooms = (search, userId) => {
    return new Promise((resolve, reject) => {
        if (search.search('\n') >= 0) {
            reject("Invalid search keyword");
        } else {

            try {
                firebase.database().ref('userChats').orderByChild('userId').equalTo(userId).once('value', snapshot => {
                    if (snapshot.exists()) {
                        var res = [];
                        snapshot.forEach(snap => {
                            const userChat = snap.val()
                            if (userChat.chatName.search(search) >= 0 || userChat.lastMsg.search(search) >= 0) {
                                userChat.type = 'chat';
                                res.push(userChat);
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
