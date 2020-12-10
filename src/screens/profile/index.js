import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import styles from './styles'
import ic_back from '../../assets/ic_back.png'
import Toast from 'react-native-simple-toast'
import { Avatar, FiksalButton } from '../../components'
import Spinner from 'react-native-loading-spinner-overlay'
import ImagePicker from "react-native-image-picker"
import firebase from 'react-native-firebase'
import { connect } from 'react-redux'
import { fiksalAlert } from '../../utils/alerts'
import { setSigninUserInfo } from '../../actions/signin'
import uuid from 'uuid'
import uploadImage from '../../utils/image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';

class ProfileScreen extends Component {
    constructor() {
        super()
        this.state = {
            loading: false,
            avatar: null,
            avatarFileName: '',
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: ''
        }
    }

    componentDidMount() {
        this.setState({
            firstName: this.props.signin.signin_user_info.firstName,
            lastName: this.props.signin.signin_user_info.lastName,
            email: this.props.signin.signin_user_info.email,
            avatar: this.props.signin.signin_user_info.avatar,
            phoneNumber: this.props.signin.signin_user_info.phoneNumber
        })
    }

    onChangeAvatar() {
        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        }

        ImagePicker.showImagePicker(options, (response) => {
            console.log('WWW-image-picker-response', response);
            if (response.didCancel){
                Toast.show('User cancelled image picker')
            } else if (response.error) {
                
            } else if (response.customButton) {
                
            } else {
                this.setState({avatar: response.uri, avatarFileName: response.fileName})
            }
        })
    }

    async saveProfile() {
        if (this.state.firstName === ''){
            fiksalAlert("Please enter your first name", () => {
                this.firstnameInput.focus();
            })
            return 
        }

        if (this.state.lastName === ''){
            fiksalAlert("Please enter your last name", () => {
                this.lastnameInput.focus();
            })
            return 
        }

        if (this.state.phoneNumber === ''){
            fiksalAlert('Please type your phone number.', () => {
                this.phoneInput.focus();
            });
            return ;
        }

        this.setState({loading: true})
        var updateData = {}

        if (this.state.avatarFileName !== '') {
            const avatarId = uuid()
            updateData.avatar = await uploadImage(avatarId, this.state.avatar, this.state.avatarFileName)
        }

        updateData.firstName = this.state.firstName
        updateData.lastName = this.state.lastName
        updateData.phoneNumber = this.state.phoneNumber
        updateData.searchStr = this.state.firstName + " " + this.state.lastName + "\n" + this.state.email;
        updateData.fullName = this.state.firstName + " " + this.state.lastName

        firebase.database().ref("users/" + this.props.signin.signin_user_info.userId).update(updateData).then(() => {
            firebase.database().ref("users/" + this.props.signin.signin_user_info.userId).once('value', snapshot => {
                const user = snapshot.val()
                this.props.setSigninUserInfo(user);
                this.setState({loading: false})
                Toast.show('Edit profile is done successfully.')
            })
        }).catch((error) => {
            this.setState({loading: false})
            Toast.show(error.toString())
        })
    }

    async signout() {
        firebase.auth().signOut()
        await AsyncStorage.setItem('fiksal_keep_login', 'false');
        this.props.navigation.navigate('sign')
    }

    render(){
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.loading} textContent={'Saving...'} textStyle={{color: '#FFF'}} />
                <View style={{paddingHorizontal: 15, height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={ic_back} style={{width: 42, height: 37}} />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: 24}}>Profile</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <Text onPress={() => this.signout()} style={{color: 'white'}}>Sign out</Text>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <KeyboardAwareScrollView>
                        <View style={{paddingHorizontal: 20}}>
                            <View style={{height: 200, justifyContent: 'center', alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => this.onChangeAvatar()}>
                                {
                                    this.state.avatar ? (
                                        <Image source={{uri: this.state.avatar}} style={styles.avatar} />
                                    ) : (
                                        <Avatar 
                                            firstName={this.state.firstName}
                                            lastName={this.state.lastName}
                                            size={150}
                                            fsize={60}
                                            marginLeft={10}
                                        />
                                    )
                                }
                                </TouchableOpacity>
                            </View>

                            <TextInput 
                                editable={false}
                                style={styles.fiksalInput} 
                                value={this.state.email} />

                            <TextInput 
                                style={styles.fiksalInput} 
                                placeholder="First Name" 
                                returnKeyType={"next"} 
                                ref={(input) => this.firstnameInput = input}
                                onChangeText={(firstName) => this.setState({firstName})}
                                onSubmitEditing={() => this.lastnameInput.focus()} 
                                value={this.state.firstName}
                                blurOnSubmit={false} />

                            <TextInput 
                                style={styles.fiksalInput} 
                                placeholder="Last Name" 
                                returnKeyType={"next"} 
                                ref={(input) => this.lastnameInput = input}
                                onSubmitEditing={() => this.phoneInput.focus()} 
                                value={this.state.lastName}
                                onChangeText={(lastName) => this.setState({lastName})}
                                blurOnSubmit={false} />

                            <TextInput 
                                style={styles.fiksalInput}
                                placeholder="Phone Number"
                                keyboardType="phone-pad"
                                ref={(input) => this.phoneInput = input}
                                value={this.state.phoneNumber}
                                onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                                blurOnSubmit={false} />
                            
                            <FiksalButton btnColor="#eb6b14" title="Save Profile" onClick={() => this.saveProfile()} />
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return state
}

const mapDispatchToProps = dispatch => {
    return {
        setSigninUserInfo: (user) => { dispatch(setSigninUserInfo(user)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)