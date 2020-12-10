import React, { Component } from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity, BackHandler, Alert, Platform, AppState } from 'react-native'
import styles from './styles'
import logo from '../../assets/logo.png'
import ic_chat from '../../assets/ic_chat.png'
import ic_learn from '../../assets/ic_learn.png'
import ic_profile from '../../assets/ic_profile.png'
import ic_pdf from '../../assets/ic_pdf.png'
import ic_info from '../../assets/ic_info.png'
import ic_setting from '../../assets/ic_setting.png'
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import { setAppState } from '../../utils/setting'
import { setSigninUserInfo } from '../../actions/signin'

const DashboardItem = props => (
    <View style={{padding: 10, flex: 1}}>
        <TouchableOpacity style={{flex: 1}} onPress={() => props.onPress()}>
            <View style={{flex: 1, backgroundColor: '#1a4b9a', padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
                {props.children}
            </View>
        </TouchableOpacity>
    </View>
)

class HomeScreen extends Component {
    constructor() {
        super()
        this.state = {
            appState: AppState.currentState,
        }
    }

    async componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        AppState.addEventListener('change', this._handleAppStateChange);

        await this.checkPermission();
        this.createNotificationListeners(); //add this line

        // check current setting and set empty settings.
        let user = this.props.signin.signin_user_info
        if (!user.setting) {
            setAppState(user.userId, "appState", "Active", "foreground");
            setAppState(user.userId, "notification", false);
            setAppState(user.userId, "sound", false);
            user.setting = {
                appState: {
                    state: "Active"
                },
                notification: {
                    state: false
                },
                sound: {
                    state: false
                }
            }
            this.props.setSigninUserInfo(user)
            await AsyncStorage.setItem('fiksal_app_state', 'Active');
        } else if (!user.setting.appState) {
            setAppState(user.userId, "appState", "Active", "foreground");
            user.setting.appState = {
                state: "Active"
            }
            await AsyncStorage.setItem('fiksal_app_state', 'Active');
            this.props.setSigninUserInfo(user)
        } else if (!user.setting.notification) {
            setAppState(user.userId, "notification", false);
            user.setting.notification = {
                state: false
            }
            this.props.setSigninUserInfo(user)
        } else if (!user.setting.sound) {
            setAppState(user.userId, "sound", false);
            user.setting.sound = {
                state: false
            }
            this.props.setSigninUserInfo(user)
        }

        const state = await AsyncStorage.getItem('fiksal_app_state');
        setAppState(user.userId, "appState", state, "foreground");

        let stateInterval = setInterval(async () => {
            
            if (!AppState.currentState.match(/inactive|background/)){
                const state = await AsyncStorage.getItem('fiksal_app_state');
                setAppState(user.userId, "appState", state, "foreground");
            }
        }, 10000);
    }

    componentWillUnmount() {
        this.backHandler.remove()

        this.notificationListener();
        this.notificationOpenedListener();
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = async (nextAppState) => {
        if ( this.state.appState.match(/active/) && nextAppState.match(/inactive|background/) ) {
            const state = await AsyncStorage.getItem('fiksal_app_state');
            setAppState(this.props.signin.signin_user_info.userId, "appState", state, "background");
        }
        this.setState({appState: nextAppState});
    };

    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    isExistToken (token) {
        return new Promise((resolve, reject) => {
            try {
                firebase.database().ref('users/' + this.props.signin.signin_user_info.userId + '/tokens/' + token).once('value', snapshot => {
                    if (snapshot.exists()) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                });
            } catch (error) {
                resolve(false)
            }
        })
    }

    async getToken() {
        try {
            let fcmToken = await AsyncStorage.getItem('fcmToken');
            if (!fcmToken) {
                fcmToken = await firebase.messaging().getToken();
                if (fcmToken) {
                    // user has a device token
                    await AsyncStorage.setItem('fcmToken', fcmToken);
                }
            }
            const isExist = await this.isExistToken(fcmToken);
            if (isExist === false) {
                firebase.database().ref('users/' + this.props.signin.signin_user_info.userId + '/tokens/' + fcmToken).set({
                    platform: Platform.OS,
                    regTime: firebase.database.ServerValue.TIMESTAMP,
                    token: fcmToken
                });
            }
        } catch (error) {
            console.log('************************************************')
            console.log(error)
            console.log('************************************************')
        }
    }

    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }

    async createNotificationListeners() {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body, data } = notification;
            // console.log('WWW-onNotification', notification)
            // this.showAlert(title, body, data);
        });

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body, data } = notificationOpen.notification;
            // console.log('WWW-notificationOpen.notification', notificationOpen.notification)
            this.gotoChatting(title, body, data);
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body, data } = notificationOpen.notification;
            // console.log('WWW-getInitialNotification', notificationOpen.notification)
            this.gotoChatting(title, body, data);
        }

        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            //process data message
            console.log('WWW-999', JSON.stringify(message));
        });
    }

    gotoChatting(title, body, data) {
        const { contactId, chatRoomId } = data;
        if (contactId && chatRoomId) {
            this.props.navigation.navigate('chatting', { contactId, chatRoomId });
        }
    }
    
    handleBackPress = () => {
        Alert.alert(
            'Fiksal',
            'Will you exit this app?',
            [
                { text: 'OK', onPress: () => BackHandler.exitApp() },
                { text: 'Cancel', style: 'cancel' }
            ]
        )
        return true;
    }

    getSmallSide (a,b) {
        return a > b ? b : a
    }

    onChat = () => {
        this.backHandler.remove()
        this.props.navigation.navigate('chatroom')
    }

    onLearn = () => {
        this.backHandler.remove()
        this.props.navigation.navigate('learn')
    }

    onProfile = () => {
        this.backHandler.remove()
        this.props.navigation.navigate('profile')
    }

    onReport = () => {
        this.backHandler.remove()
        this.props.navigation.navigate('report')
    }

    onInfo = () => {
        this.backHandler.remove()
        this.props.navigation.navigate('info')
    }

    onSetting = () => {
        this.backHandler.remove()
        this.props.navigation.navigate('setting')
    }

    render() {
        const logoContainerHeight = Dimensions.get('window').height * 0.25
        const logoWidth = Dimensions.get('window').width * 0.84
        const logoHeight = logoWidth / 243 * 85
        const dashItemHeight = (Dimensions.get('window').height * 0.75 - 110) / 3 - 38
        const dashItemWidth = (Dimensions.get('window').width * 0.8 - 20) / 2 - 20
        const imgSize = this.getSmallSide(dashItemHeight, dashItemWidth) * 0.7
        return (
            <View style={styles.container}>
                <View style={{height: logoContainerHeight}}>
                    <View style={styles.subContainer}>
                        <Image source={logo}  style={{width: logoWidth, height: logoHeight}}/>
                    </View>
                </View>
                <View style={{paddingHorizontal: '8%'}}>
                    <Text style={{color: '#35c611', fontSize: 20, paddingHorizontal: 10}}>Welcome {this.props.signin.signin_user_info.firstName} {this.props.signin.signin_user_info.lastName}</Text>
                </View>
                <View style={{flex: 1, paddingVertical: 25, paddingHorizontal: '10%'}}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <DashboardItem onPress={() => this.onChat()}>
                            <Image source={ic_chat} style={{width: imgSize, height: imgSize}} />
                            <Text style={{color: 'white', fontSize: 18}}>Text</Text>
                        </DashboardItem>
                        <DashboardItem onPress={() => this.onLearn()}>
                            <Image source={ic_learn} style={{width: imgSize, height: imgSize}} />
                            <Text style={{color: 'white', fontSize: 18}}>Learn</Text>
                        </DashboardItem>
                    </View>
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <DashboardItem onPress={() => this.onProfile()}>
                            <Image source={ic_profile} style={{width: imgSize, height: imgSize}} />
                            <Text style={{color: 'white', fontSize: 18}}>Profile</Text>
                        </DashboardItem>
                        <DashboardItem onPress={() => this.onReport()}>
                            <Image source={ic_pdf} style={{width: imgSize, height: imgSize}} />
                            <Text style={{color: 'white', fontSize: 18}}>Reports</Text>
                        </DashboardItem>
                    </View>
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <DashboardItem onPress={() => this.onInfo()}>
                            <Image source={ic_info} style={{width: imgSize, height: imgSize}} />
                            <Text style={{color: 'white', fontSize: 18}}>Info</Text>
                        </DashboardItem>
                        <DashboardItem onPress={() => this.onSetting()}>
                            <Image source={ic_setting} style={{width: imgSize, height: imgSize}} />
                            <Text style={{color: 'white', fontSize: 18}}>Settings</Text>
                        </DashboardItem>
                    </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)