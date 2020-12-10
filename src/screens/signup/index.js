import React, { Component } from 'react'
import { View, Text, Image, Dimensions, TextInput, Alert } from 'react-native'
import { FiksalButton } from '../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from './styles'
import logo from '../../assets/logo.png'
import { connect } from 'react-redux'
import { setSigninUserInfo } from '../../actions/signin'
import Axios from "axios";
import Spinner from 'react-native-loading-spinner-overlay'
import firebase from 'react-native-firebase'
import { fiksalAlert } from '../../utils/alerts'
import * as EmailValidator from 'email-validator';

class SignupScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    }

    componentDidMount() {}

    async signup() {
        
        if (this.state.firstName === ''){
            fiksalAlert("Please enter your first name", () => {
                this.firstnameInput.focus()
            })
            return 
        }

        if (this.state.lastName === ''){
            fiksalAlert("Please enter your last name", () => {
                this.lastnameInput.focus()
            })
            return 
        }

        if (this.state.email === ''){
            fiksalAlert("Please enter your email", () => {
                this.emailInput.focus()
            })
            return 
        }

        if (!EmailValidator.validate(this.state.email)) {
            fiksalAlert("Invalid Email", () => {
                this.emailInput.focus()
            })
            return 
        }

        if (this.state.password === '') {
            fiksalAlert("Please type your password!", () => {
                this.passwordInput.focus()
            })
            return
        }

        if (this.state.password.length < 6) {
            fiksalAlert("Password must be at least 6 characters", () => {
                this.passwordInput.focus()
            })
            return
        }

        if (this.state.confirmPassword === '') {
            fiksalAlert("Please confirm password!", () => {
                this.confirmPasswordInput.focus()
            })
            return
        }

        if (this.state.password !== this.state.confirmPassword) {
            fiksalAlert("Invalid password!", () => {
                this.passwordInput.focus()
            })
            return
        }

        this.setState({loading: true})

        var photoUrl = ''

        const res = await Axios.post('https://us-central1-fiksal-7323b.cloudfunctions.net/signupUser', {
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phonenumber: '',
            photoUrl: photoUrl
        })

        if (res.data.success) {
            await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)

            // registerFCMToken(res.data.userInfo.userId)
            this.props.setSigninUserInfo(res.data.userInfo);
            this.props.navigation.navigate('main')
            this.setState({loading: false})
        } else {
            Alert.alert(
                "User Signup",
                res.data.error,
                [
                    { text: "OK", onPress: () => this.setState({loading: false}) }
                ],
                { cancelable: false}
            )
        }
    }

    render() {
        const logoContainerHeight = Dimensions.get('window').height * 0.40 - 60
        const logoWidth = Dimensions.get('window').width * 0.84
        const logoHeight = logoWidth / 243 * 85

        return (
            <KeyboardAwareScrollView style={styles.container}>
                <Spinner visible={this.state.loading} textContent={'Registering...'} textStyle={{color: '#FFF'}} />
                <View style={{justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 5}}>
                    <Text onPress={() => this.props.navigation.goBack()} style={{fontSize: 18, color: 'black'}}>Back</Text>
                </View>
                <View style={{height: logoContainerHeight}}>
                    <View style={styles.logoContainer}>
                        <Image source={logo}  style={{width: logoWidth, height: logoHeight}}/>
                    </View>
                </View>
                <View style={styles.formContainer}>
                    <TextInput 
                        style={styles.fiksalInput} 
                        placeholder="First Name" 
                        returnKeyType={"next"} 
                        ref={(input) => this.firstnameInput = input}
                        onChangeText={(firstName) => this.setState({firstName})}
                        onSubmitEditing={() => this.lastnameInput.focus()} 
                        blurOnSubmit={false} />

                    <TextInput 
                        style={styles.fiksalInput} 
                        placeholder="Last Name" 
                        returnKeyType={"next"} 
                        onChangeText={(lastName) => this.setState({lastName})}
                        ref={(input) => this.lastnameInput = input}
                        onSubmitEditing={() => this.emailInput.focus()} 
                        blurOnSubmit={false} />
                    
                    <TextInput 
                        style={styles.fiksalInput} 
                        placeholder="Email" 
                        returnKeyType={"next"} 
                        onChangeText={(email) => this.setState({email})}
                        ref={(input) => this.emailInput = input}
                        onSubmitEditing={() => this.passwordInput.focus()} 
                        keyboardType="email-address"
                        blurOnSubmit={false} />

                    <TextInput 
                        style={styles.fiksalInput} 
                        placeholder="Password" 
                        returnKeyType={"next"} 
                        onChangeText={(password) => this.setState({password})}
                        ref={(input) => this.passwordInput = input}
                        onSubmitEditing={() => this.confirmPasswordInput.focus()} 
                        secureTextEntry
                        blurOnSubmit={false} />

                    <TextInput 
                        style={styles.fiksalInput} 
                        onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                        ref={(input) => this.confirmPasswordInput = input} 
                        placeholder="Confirm Password"
                        secureTextEntry />

                    <FiksalButton btnColor="#eb6b14" title="sign up" onClick={() => this.signup()} />

                    <View style={{marginTop: 15, paddingHorizontal: 20}}>
                        <Text style={{color: '#919191', fontSize: 12, textAlign: 'center'}}>By creating an account you agree to our <Text onPress={() => {
                            this.props.navigation.navigate('termscondition')
                        }} style={{color: '#224982'}}>Terms of Service</Text> and <Text onPress={() => {
                            this.props.navigation.navigate('policy')
                        }} style={{color: '#224982'}}>Privacy Policy</Text>.</Text>
                    </View>
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
        setSigninUserInfo: (user) => {
            dispatch(setSigninUserInfo(user))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)