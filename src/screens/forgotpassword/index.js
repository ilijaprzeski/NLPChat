import React, { Component } from 'react'
import { View, Text, Image, TextInput, Dimensions } from 'react-native'
import { FiksalButton } from '../../components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import logo from '../../assets/logo.png'
import firebase from 'react-native-firebase'
import * as EmailValidator from 'email-validator';
import { selectUserByEmail } from '../../utils/user'
import Toast from 'react-native-simple-toast'
import Spinner from 'react-native-loading-spinner-overlay'
import { fiksalAlert } from '../../utils/alerts'
import styles from './styles'

class ForgotPasswordScreen extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            loading: false,
        }
    }

    componentDidMount() {

    }

    async submit() {
        if(!this.state.email) {
            fiksalAlert("Please type your email and password.", null)
            return ;
        }

        if (!EmailValidator.validate(this.state.email)) {
            fiksalAlert("Invalid email.", null)
            return ;
        }

        this.setState({loading: true})
        const user = await selectUserByEmail(this.state.email)
        if (user === null) {
            fiksalAlert("Such user with the email is no exist.", () => {
                this.setState({loading: false})
            })
            return ;
        }

        firebase.auth().sendPasswordResetEmail(this.state.email).then(() => {
            fiksalAlert("Email sent. Please check your email.", () => {
                this.setState({loading: false})
            })
        });
    }

    render() {
        const logoContainerHeight = Dimensions.get('window').height * 0.40 - 50
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
                        placeholder="Email" 
                        returnKeyType={"done"} 
                        onChangeText={(email) => this.setState({email})}
                        onSubmitEditing={() => this.submit()} 
                        keyboardType="email-address"
                        blurOnSubmit={false} />

                    <View style={{height: 50}}></View>
                    <FiksalButton btnColor="#1a4b9a" title="submit" onClick={() => this.submit()} />

                </View>
            </KeyboardAwareScrollView>
        )
    }
}

export default ForgotPasswordScreen