import React, { Component } from 'react'
import { View, Image } from 'react-native'
import styles from './styles'
import logo from '../../assets/logo.png'
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase'
import { setSigninUserInfo } from '../../actions/signin'
import { connect } from 'react-redux'

class SplashScreen extends Component {
    performTimeConsumingTask = async() => {
        return new Promise((resolve)=>
            setTimeout(() => { resolve('result') }, 2000)
        )
    }

    async componentDidMount() {
        
        const data = await this.performTimeConsumingTask();

        if(data != null) {
            try {
                const keepLogin = await AsyncStorage.getItem('fiksal_keep_login');
                if(keepLogin && keepLogin === 'true') {
                    var unsubscribe = firebase.auth().onAuthStateChanged(user => {
                        if (user === null) {
                            this.props.navigation.navigate('sign')
                        } else {
                            firebase.database().ref('users/' + user.uid).once('value', (snapshot) => {
                                if(snapshot.exists()){
                                    loginuser = snapshot.val()
                                    this.props.setSigninUserInfo(loginuser);
                                    unsubscribe();
                                    this.props.navigation.navigate('home')
                                } else {
                                    unsubscribe();
                                    this.props.navigation.navigate('sign')
                                }
                            }).catch(error => {
                                Toast.show(error.toString())
                            })
                        }
                    })
                } else {
                    this.props.navigation.navigate('sign')
                }
            } catch(error) {
                this.props.navigation.navigate('sign')
            }
        } else {
            this.props.navigation.navigate('sign')
        }
    }

    render() {
        const viewStyles = [
            styles.container,
            {
                backgroundColor: 'white',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }
        ]

        return (
            <View style={viewStyles}>
                <Image source={logo} style={{width: 243, height: 85}} />
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

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen)