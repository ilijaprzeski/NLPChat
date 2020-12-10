import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, Dimensions, ActivityIndicator, Platform } from 'react-native'
import styles from './styles'
import ic_back from '../../assets/ic_back.png'
import { connect } from 'react-redux'
import { addUserInfo } from '../../actions/userinfo'
import { selectUser } from '../../utils/user'
import Spinner from 'react-native-loading-spinner-overlay'
import { FiksalContact } from '../../components';
import Icon from 'react-native-vector-icons/MaterialIcons'
import firebase from 'react-native-firebase'
import { addFiksalContact } from '../../utils/contact';
import Modal from "react-native-modal";
import * as EmailValidator from 'email-validator';
import { selectUserByEmail } from '../../utils/user';
import Toast from 'react-native-simple-toast';

class ContactsScreen extends Component {

    constructor() {
        super()
        this.state = {
            loading: true,
            search: '',
            fcontacts: [],
            pcontacts: [],
            pcollapsed: false,
            fcollapsed: true,
            addEmail: '',
            modalVisible: false,
            errorMsg: '',
            isSaving: false
        }
    }

    checkUserMap = (contact) => {
        return new Promise(async (resolve, reject) => {
            if (this.props.usermap[contact.userId] === undefined) {
                const user = await selectUser(contact.userId)
                if (user !== null){
                    this.props.addUserInfo(user.userId, user)
                    resolve(user)
                } else {
                    resolve(null)
                }
            } else {
                resolve(this.props.usermap[contact.userId]);
            }
        })
    }

    componentDidMount = async () => {
        firebase.database().ref(`contacts/${this.props.signin.signin_user_info.userId}`).on('value', async snapshot => {
            if (snapshot.exists()) {
                let fc = [];
                snapshot.forEach(snap => {
                    const contact = {
                        userId: snap.key
                    }

                    fc.push(contact);
                })

                var fcontacts = await Promise.all(fc.map(contact => this.checkUserMap(contact)));
                this.setState({fcontacts, loading: false});
            } else {
                this.setState({fcontacts: [], loading: false});
            }
        });
    }

    goChatRoom = (userId) => {
        this.props.navigation.navigate('chatting', {contactId: userId})
    }

    preAddFiksalContact = () => {
        this.setState({ modalVisible: true, addEmail: '', errorMsg: '', isSaving: false });
    }

    addFiksalContact = async () => {
        if(!this.state.addEmail) {
            this.setState({errorMsg: 'Please insert a email address.'})
            return ;
        }

        if (!EmailValidator.validate(this.state.addEmail)) {
            this.setState({errorMsg: 'Invalid email address'})
            return 
        }

        const email = this.state.addEmail.trim()
        if (this.props.signin.signin_user_info.email === email) {
            this.setState({errorMsg: 'It\'s your email address.'})
            return 
        }

        this.setState({isSaving: true});

        for(var i = 0; i < this.state.fcontacts.length; i++){
            if (this.state.fcontacts[i].email === email) {
                this.setState({isSaving: false, errorMsg: 'The email is already exist in your Fiksal contacts'})
                return ;
            }
        }

        try {
            const addUser = await selectUserByEmail(email);
            if (!addUser) {
                this.setState({isSaving: false, errorMsg: 'There is no such Fiksal user.'})
                return ;
            }

            addFiksalContact(this.props.signin.signin_user_info.userId, addUser.userId)
            this.setState({modalVisible: false})
            Toast.show('Adding fiksal contact is done successfully.')
        } catch(error) {
            this.setState({isSaving: false, errorMsg: error.toString()})
        }
    }

    toggleModal = () => {
        this.setState({ modalVisible: !this.state.modalVisible });
    };

    renderFiksalContact(contact, index) {
        const searchStr = this.state.search;

        if (contact.fullName.search(searchStr) < 0 && contact.email.search(searchStr) < 0) {
            return null;
        }

        return (
            <TouchableOpacity key={index} onPress={() => this.goChatRoom(contact.userId)}>
                <View>
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 5}}>
                        <FiksalContact contact={contact} size={65} center avatar={{size: 45, fsize: 22}}/>
                        <View style={{flex: 1, paddingRight: 10}}>
                            <Text style={{fontSize: 18, color: 'gray'}}>{contact.firstName + ' ' + contact.lastName}</Text>
                            <Text style={{fontSize: 16, color: 'gray'}}>{contact.email}</Text>
                        </View>
                    </View>
                    <View style={{paddingLeft: 65}}>
                        <View style={{height: 1, backgroundColor: 'lightgray'}} />
                    </View>
                </View> 
            </TouchableOpacity>
        )
    }

    render() {
        const deviceWidth = Dimensions.get("window").width;
        const deviceHeight = Platform.OS === "ios"
            ? Dimensions.get("window").height
            : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

        return (
            <View style={styles.container}>
                <Spinner visible={this.state.loading} textContent={'Loading...'} textStyle={{color: '#FFF'}} />
                <View style={{paddingHorizontal: 15, height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={ic_back} style={{width: 42, height: 37}} />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: 24}}>Select Recipient</Text>
                    </View>
                    <View style={{width: 30}} />
                </View>
                <ScrollView style={{flex: 1, width: '100%', paddingBottom: 20}} scrollsToTop={false} >
                    <View style={{flexDirection: 'row', margin: 20, borderWidth: 1, borderRadius: 20, borderColor: 'lightgray', height: 40, alignItems: 'center', paddingHorizontal: 5}}>
                        <Icon name="search" size={25} color="lightgray" />
                        <TextInput 
                            value={this.state.search}
                            onChangeText={(search) => this.setState({search})}
                            style={{flex: 1, fontSize: 16, color: 'gray'}} placeholder="Search" placeholderTextColor="lightgray" 
                        />
                    </View>
                    <View style={{paddingHorizontal: 15}}>
                    {
                        (this.state.fcontacts && this.state.fcontacts.length > 0) ? 
                        this.state.fcontacts.map((contact, index) => this.renderFiksalContact(contact, index)) : null
                    }
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={() => this.preAddFiksalContact()}>
                    <View style={{height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row'}}>
                        <View style={{paddingHorizontal: 10}}>
                            <View style={{width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{color: 'black', fontSize: 30}}>+</Text>
                            </View>
                        </View>
                        <View style={{padding: 10, flex: 1}}>
                            <Text style={{color: 'white', fontSize: 24}}>Add Fiksal Contact</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <Modal 
                    isVisible={this.state.modalVisible} 
                    deviceWidth={deviceWidth} 
                    deviceHeight={deviceHeight}
                    onBackdropPress={() => this.setState({ modalVisible: false })}>
                    <View style={{ backgroundColor: 'white' }}>
                        <View style={{paddingTop: 20, paddingHorizontal: 20, paddingBottom: 5}}>
                            <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}>Add Fiksal Contact</Text>
                        </View>
                        <View style={{marginHorizontal: 20, height: 1, backgroundColor: 'lightgray'}}></View>
                        <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
                            <Text>Please type a email address.</Text>
                            <TextInput
                                value={this.state.addEmail}
                                onChangeText={(addEmail) => this.setState({addEmail})}
                                keyboardType="email-address"
                                style={{marginVertical: 5, fontSize: 18, color: 'gray', borderWidth: 1, padding: 5, borderColor: 'lightgray', height: 40}} placeholder="Email address" placeholderTextColor="lightgray" 
                            />
                            {
                                this.state.errorMsg ? (
                                    <Text style={{fontSize: 14, color: 'red'}}>{this.state.errorMsg}</Text>
                                ) : null
                            }
                        </View>
                        <View style={{marginHorizontal: 20, height: 1, backgroundColor: 'lightgray'}}></View>
                        <View style={{paddingVertical: 10, paddingHorizontal: 20, alignItems: 'flex-end'}}>
                            <TouchableOpacity onPress={() => this.addFiksalContact()}>
                                <View style={{width: 100, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row', borderRadius: 5}}>
                                    {
                                        this.state.isSaving && ( <ActivityIndicator size="small" color="white" /> )
                                    }
                                    <Text style={{color: 'white', fontSize: 18}}> Save</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return state
}

const mapDispatchToProps = dispatch => {
    return {
        addUserInfo: (userid, user) => { dispatch(addUserInfo(userid, user)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactsScreen)