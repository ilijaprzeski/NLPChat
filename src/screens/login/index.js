import React, { Component } from 'react'
import { View, Text, Image, Dimensions, TextInput, Platform, Alert } from 'react-native'
import { FiksalButton } from '../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from 'react-native-check-box'
import styles from './styles'
import logo from '../../assets/logo.png'
import * as EmailValidator from 'email-validator';
import { fiksalAlert } from '../../utils/alerts'
import { setSigninUserInfo } from '../../actions/signin'
import { connect } from 'react-redux'
import firebase from 'react-native-firebase'
import Spinner from 'react-native-loading-spinner-overlay';

class LoginScreen extends Component {

    constructor() {
        super()
        this.state = {
            keepLogin: false,
            useFingerprint: false,
            email: '',
            password: '',
            loading: false
        }
    }

    async componentDidMount() {

        if (Platform.OS === 'ios') {
            try {
                const fingerprint = await AsyncStorage.getItem('fiksal_fingerprint_auth');
                if(!fingerprint) {
                    this.setState({useFingerprint: false})
                } else {
                    const f = fingerprint === 'true' ? true : false
                    this.setState({useFingerprint: f})
                }
            } catch(e){
                this.setState({useFingerprint: false})
            }
        }

        try {
            const keepLogin = await AsyncStorage.getItem('fiksal_keep_login');
            if(!keepLogin) {
                this.setState({keepLogin: false})
            } else {
                const f = keepLogin === 'true' ? true : false
                this.setState({keepLogin: f})
            }
        } catch(e){
            this.setState({keepLogin: false})
        }
    }

    noSuchUserAlert(){
        Alert.alert(
            "User Signin",
            "No exist such user. Create an account now?",
            [
                { text: "Not Now", onPress: () => this.setState({loading: false}) }, 
                { text: "Sign Up", onPress: () => { this.setState({loading: false}); this.props.navigation.navigate('signup'); } }
            ],
            { cancelable: false}
        );
    }

    async login() {
        if(!this.state.email || !this.state.password) {
            fiksalAlert("Please type your email and password.", null)
            return ;
        }

        if (!EmailValidator.validate(this.state.email)) {
            fiksalAlert("Invalid email.", null)
            return 
        }

        this.setState({loading: true})
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            firebase.database().ref('users/' + userCredential.user.uid).once('value', async (snapshot) => {
                if (snapshot.exists()){
                    user = snapshot.val()
    
                    // await registerFCMToken(userCredential.user.uid)
                    this.props.setSigninUserInfo(user);
                    this.props.navigation.navigate('main')
                    this.setState({loading: false})
                } else {
                    // this.setState({loading: false})
                    this.noSuchUserAlert()
                }
            })
        } catch(error) {
            
            // console.log('WWW', error)
            this.noSuchUserAlert();
            // this.setState({loading: false})
        }
        // this.props.navigation.navigate('main')
    }

    signup() {
        this.props.navigation.navigate('signup')
    }

    forgot() {
        this.props.navigation.navigate('forgotpassword')
    }

    changeFingerprintSetting = async (setting) => {
        this.setState({useFingerprint: setting})
        try {
            await AsyncStorage.setItem('fiksal_fingerprint_auth', setting.toString());
        } catch(e) {

        }
    }

    changeKeepLoginSetting = async (setting) => {
        this.setState({keepLogin: setting})
        try {
            await AsyncStorage.setItem('fiksal_keep_login', setting.toString());
        } catch(e) {
            console.log('WWW', e)
        }
    }

    render() {
        const logoContainerHeight = Dimensions.get('window').height * 0.40
        const logoWidth = Dimensions.get('window').width * 0.84
        const logoHeight = logoWidth / 243 * 85

        return (
            <KeyboardAwareScrollView style={styles.container}>
                <Spinner visible={this.state.loading} textContent={'Login...'} textStyle={{color: '#FFF'}} />
                <View style={{height: logoContainerHeight}}>
                    <View style={styles.logoContainer}>
                        <Image source={logo}  style={{width: logoWidth, height: logoHeight}}/>
                    </View>
                </View>
                <View style={styles.formContainer}>
                    <TextInput 
                        style={styles.fiksalInput} 
                        placeholder="Email" 
                        returnKeyType={"next"} 
                        onSubmitEditing={() => this.passwordInput.focus()} 
                        blurOnSubmit={false}
                        onChangeText={(email) => this.setState({email})}
                        keyboardType="email-address"/>
                    <TextInput 
                        style={styles.fiksalInput} 
                        ref={(input) => this.passwordInput = input} 
                        onChangeText={(password) => this.setState({password})}
                        placeholder="Password"
                        secureTextEntry/>

                    <FiksalButton btnColor="#1a4b9a" title="log in" onClick={() => this.login()} />

                    <View style={{width: '100%', justifyContent: 'center', paddingVertical: 15}}>
                        <Text onPress={() => this.forgot()} style={{color: '#8b8b8b', fontSize: 16}}>Forgot <Text style={{color: '#1a4b9a'}}>username</Text> or <Text style={{color: '#1a4b9a'}}>password</Text>?</Text>
                    </View>

                    <View style={{paddingBottom: 15}}>
                        <CheckBox 
                            style={{marginVertical: 8}}
                            onClick={() => this.changeKeepLoginSetting(!this.state.keepLogin)}
                            checkBoxColor={"#d8d8d8"}
                            checkedCheckBoxColor={"#3b3b3b"}
                            isChecked={this.state.keepLogin}
                            rightText={"Keep me logged in"}
                            rightTextStyle={{color: '#999999', fontSize: 16}}
                        />
                    </View>
                    <FiksalButton btnColor="#eb6b14" title="sign up" onClick={() => this.signup()} />
                </View>
            </KeyboardAwareScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)