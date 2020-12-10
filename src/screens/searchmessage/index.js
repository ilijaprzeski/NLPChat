import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import styles from './styles';
import ic_back from '../../assets/ic_back.png';
import ic_search from '../../assets/ic_search.png';
import Spinner from 'react-native-loading-spinner-overlay';
import { Avatar } from '../../components'
import { getDateString } from '../../utils/time'
import { connect } from 'react-redux'
import { addUserInfo } from '../../actions/userinfo'
import { addContactInfo } from '../../actions/contactinfo'
import { searchChatRooms } from '../../utils/chat'
import { searchSms } from '../../utils/sms'
import { selectUser } from '../../utils/user'
import { getContactFromPhone } from '../../utils/contact'
import Toast from 'react-native-simple-toast'

class SearchMessageScreen extends Component {
    constructor() {
        super()
        this.state = {
            searching: false,
            search: '',
            chatRooms: [],
            smslist: [],
            total: []
        }
    }

    componentDidMount = async () => {

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

    getContact = (smsItem) => {
        return new Promise(async (resolve, reject) => {
            if (this.props.contactmap[smsItem.phoneNumber]) {
                smsItem.contact = this.props.contactmap[smsItem.phoneNumber]
                resolve(smsItem);
            } else {
                const contact = await getContactFromPhone(smsItem.phoneNumber)
                if (contact){
                    this.props.addContactInfo(smsItem.phoneNumber, contact)
                    smsItem.contact = contact;
                } else {
                    smsItem.contact = {
                        firstName: 'unknown',
                        lastName: 'number'
                    };
                }
                resolve(smsItem)
            }
        })
    }

    onSearch = async () => {
        if (!this.state.search) {
            this.setState({ chatRooms: [] })
            return
        }

        const search = this.state.search.trim()
        this.setState({ searching: true })
        try {
            const chatRooms = await searchChatRooms(search, this.props.signin.signin_user_info.userId)

            let newChatRooms = [];
            newChatRooms = await Promise.all(chatRooms.map(item => this.getChatRoom(item)))
            this.setState({ chatRooms: newChatRooms });
        } catch (error) {
            this.setState({ chatRooms: [], searching: false })
            Toast.show(error.toString());
            return ;
        }

        try {
            const sl = await searchSms(search, this.props.signin.signin_user_info.userId)

            let smslist = [];
            smslist = await Promise.all(sl.map(item => this.getContact(item)))
            this.setState({ searching: false, smslist });
        } catch (error) {
            this.setState({ smslist: [], searching: false })
            Toast.show(error.toString());
            return ;
        }

        const { chatRooms, smslist } = this.state;
        let total = chatRooms.concat(smslist);
        total.sort((a, b) => {
            if (a.msgTime > b.msgTime)  return -1;
            else                        return 1;
        })
        this.setState({total});
    }

    getContactName(contact) {
        if (contact.firstName) {
            return contact.firstName + ' ' + contact.lastName
        } else if (contact.givenName) {
            return contact.givenName + ' ' + contact.familyName
        }
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
                        <View style={{width: 45, height: 20, backgroundColor: '#009de5', borderRadius: 5, marginTop: 5, justifyContent: 'center'}}>
                            <Text style={{textAlign: 'center', fontSize: 12, color: 'white'}}>Text</Text>
                        </View>
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

    renderSMS(sms, index) {
        return (
            <TouchableOpacity key={index} onPress={() => this.onViewSMS(sms)}>
                <View style={{paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: '#36c513', flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{paddingHorizontal: 10}}>
                        {
                            (sms.contact && sms.contact.thumbnailPath) ? (
                                <Image source={{uri: sms.contact.thumbnailPath}} style={{width: 45, height: 45, borderColor: 'gray', borderRadius: 23}} />
                            ) : (
                                <Avatar 
                                    firstName={sms.contact.firstName ? sms.contact.firstName : sms.contact.givenName}
                                    lastName={sms.contact.lastName ? sms.contact.lastName : sms.contact.familyName }
                                    size={45}
                                    fsize={22}
                                />
                            )
                        }
                        <View style={{width: 45, height: 20, backgroundColor: '#e09f00', borderRadius: 5, marginTop: 5, justifyContent: 'center'}}>
                            <Text style={{textAlign: 'center', fontSize: 12, color: 'white'}}>Sms</Text>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                        <View style={{flexDirection: 'row', paddingRight: 10, paddingBottom: 10}}>
                            <View style={{flex: 1, alignItems: 'flex-start'}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20, flex: 1}} numberOfLines={1}>{sms.contact.phoneNumbers ? this.getContactName(sms.contact) : sms.phoneNumber}</Text>
                            </View>
                            <Text style={{color: '#36c513', fontSize: 16}}>{getDateString(new Date(sms.msgTime))}</Text>
                        </View>
                        {
                            sms.contact.phoneNumbers && (<Text style={{fontSize: 14}}>{sms.phoneNumber}</Text>)
                        }
                        <Text style={{fontSize: 14}} numberOfLines={1}>{sms.message}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    onViewSMS(sms) {
        Toast.show(sms.message);
    }

    render() {

        return (
            <View style={styles.container}>
                <Spinner visible={this.state.searching} textContent={'Searching...'} textStyle={{ color: '#FFF' }} />
                <View style={{ paddingHorizontal: 15, height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={ic_back} style={{ width: 42, height: 37 }} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 }}>
                        <TextInput
                            value={this.state.search}
                            onChangeText={(search) => this.setState({ search })}
                            style={{ width: '100%', fontSize: 17, color: 'white' }} placeholder="Search Messages" placeholderTextColor="lightgray"
                            returnKeyType={"search"}
                            onSubmitEditing={() => this.onSearch()}
                            blurOnSubmit={false}
                        />
                    </View>
                    <TouchableOpacity onPress={() => this.onSearch()}>
                        <Image source={ic_search} style={{ width: 36, height: 36 }} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ flex: 1, width: '100%' }} scrollsToTop={false} >
                {
                    this.state.total.map((msgItem, index) => msgItem.type === 'chat' ? ( 
                        this.renderChatRoom(msgItem, index)
                    ) : (
                        this.renderSMS(msgItem, index)
                    ))
                }
                </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchMessageScreen)