import React, { Component } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import { Avatar } from '../../components'
import { getDateString } from '../../utils/time'
import styles from './styles'
import ic_back from '../../assets/ic_back.png'
import ic_search from '../../assets/ic_search.png'
import { connect } from 'react-redux'
import { addUserInfo } from '../../actions/userinfo'
import { addContactInfo } from '../../actions/contactinfo'
import { selectUser } from '../../utils/user'
import firebase from 'react-native-firebase'

class ChatRoomScreen extends Component {
    constructor() {
        super()
        this.state = {
            chatRooms: [],
            smslist: []
        }
    }

    getChatRoom = (chatRoom) => {
        return new Promise(async (resolve, reject) => {
            if (this.props.usermap[chatRoom.partnerId]) {
                chatRoom.partner = this.props.usermap[chatRoom.partnerId]
                resolve(chatRoom);
            } else {
                const user = await selectUser(chatRoom.partnerId)
                if (user !== null){
                    this.props.addUserInfo(user.partnerId, user)
                    chatRoom.partner = user;
                    resolve(chatRoom)
                } else {
                    resolve(null)
                }
            }
        })
    }

    async componentDidMount() {

        firebase.database().ref('userChats').orderByChild('userId').equalTo(this.props.signin.signin_user_info.userId).on('value', async snapshot => {
            if (snapshot.exists()) {
                let crs = [];
                snapshot.forEach(snap => {
                    let chatRoom = snap.val();
                    chatRoom.type = 'chat';
                    crs.push(chatRoom);
                })

                let chatRooms = await Promise.all(crs.map(item => this.getChatRoom(item)))
                this.setState({chatRooms});
            } else {
                this.setState({chatRooms: []});
            }
        });
    }

    onChatting(chatRoomId, contactId) {
        this.props.navigation.navigate('chatting', { contactId, chatRoomId })
    }

    renderChatRoom(chatRoom, index) {
        return (
            <TouchableOpacity key={index} onPress={() => this.onChatting(chatRoom.chatRoomId, chatRoom.partner.userId)}>
                <View style={{paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: '#36c513', flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{paddingHorizontal: 10}}>
                        {
                            chatRoom.partner.avatar === '' ? (
                                <Avatar 
                                    firstName={chatRoom.partner.firstName}
                                    lastName={chatRoom.partner.lastName}
                                    size={45}
                                    fsize={22}
                                />
                            ) : (
                                <Image source={{uri: chatRoom.partner.avatar}} style={{width: 45, height: 45, borderColor: 'gray', borderRadius: 23}} />
                            )
                        }
                    </View>
                    <View style={{flex: 1}}>
                        <View style={{flexDirection: 'row', paddingRight: 10, paddingBottom: 10}}>
                            <View style={{flex: 1, alignItems: 'flex-start'}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20, flex: 1}} numberOfLines={1}>{chatRoom.partner.fullName}</Text>
                            </View>
                            <Text style={{color: '#36c513', fontSize: 16}}>{getDateString(new Date(chatRoom.msgTime))}</Text>
                        </View>
                        <Text style={{fontSize: 14}} numberOfLines={1}>{(chatRoom.userId === chatRoom.senderId ? 'Me: ' : '') + chatRoom.lastMsg}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { chatRooms } = this.state;

        return (
            <View style={styles.container}>
                <View style={{paddingHorizontal: 15, height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={ic_back} style={{width: 42, height: 37}} />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: 24}}>Messages</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('searchmessage')}>
                        <Image source={ic_search} style={{width: 36, height: 36}} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={{flex: 1, width: '100%'}} scrollsToTop={false} >
                {
                    chatRooms.map((msgItem, index) => this.renderChatRoom(msgItem, index))
                }
                </ScrollView>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('addressbook')}>
                    <View style={{height: 75, alignItems: 'center', backgroundColor: '#36c511', flexDirection: 'row'}}>
                        <View style={{paddingHorizontal: 10}}>
                            <View style={{width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{color: 'black', fontSize: 30}}>+</Text>
                            </View>
                        </View>
                        <View style={{padding: 10, flex: 1}}>
                            <Text style={{color: 'white', fontSize: 24}}>Send new message</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return state
}

const mapDispatchToProps = dispatch => {
    return {
        addUserInfo: (userid, user) => { dispatch(addUserInfo(userid, user)) },
        addContactInfo: (phoneNumber, contact) => { dispatch(addContactInfo(phoneNumber, contact)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoomScreen)