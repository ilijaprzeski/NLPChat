import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, Switch, ScrollView } from 'react-native'
import styles from './styles'
import ic_back from '../../assets/ic_back.png'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CustomDropDown } from '../../components'
import AsyncStorage from '@react-native-community/async-storage';
import { setAppState } from '../../utils/setting'
import { connect } from 'react-redux';
import { setSigninUserInfo } from '../../actions/signin'

const appStates = [
    {icon: 'checkcircle', color: '#4ed95a', title: 'Active', iconSize: 25},
    {icon: 'clockcircle', color: '#f9b90e', title: 'Away', iconSize: 25},
    {icon: 'minuscircle', color: '#f84336', title: 'Do not disturb', iconSize: 24},
    {icon: 'eye', color: '#8d8c91', title: 'Invisible', iconSize: 27}
]

class SettingScreen extends Component {
    constructor() {
        super()
        this.state = {
            notification: false,
            sound: false,
            appActiveState: appStates[0]
        }
    }

    componentDidMount = async () => {
        var appState = await AsyncStorage.getItem('fiksal_app_state');
        if(!appState) {
            appState = 'Active'
            await AsyncStorage.setItem('fiksal_app_state', appState);
        }

        for (var i = 0; i < appStates.length; i++){
            if (appStates[i].title === appState) {
                this.setState({appActiveState: appStates[i]});
            }
        }

        const notification = this.props.signin.signin_user_info.setting ? this.props.signin.signin_user_info.setting.notification.state : false
        const sound = this.props.signin.signin_user_info.setting ? this.props.signin.signin_user_info.setting.sound.state : false

        this.setState({notification, sound})
    }

    onChangeState = async (item) => {
        this.setState({appActiveState: item})
        await AsyncStorage.setItem('fiksal_app_state', item.title);
        setAppState(this.props.signin.signin_user_info.userId, "appState", item.title, "foreground")

        var user = this.props.signin.signin_user_info
        if (!user.setting) {
            user.setting = {};
        }

        if (!user.setting.appState) {
            user.setting.appState = {}
        }
        user.setting.appState.state = item.title
        this.props.setSigninUserInfo(user);
    }

    onChangeSetting = (name, st) => {
        this.setState({[name]: st})
        setAppState(this.props.signin.signin_user_info.userId, name, st)

        var user = this.props.signin.signin_user_info
        if (!user.setting) {
            user.setting = {};
        }

        if (!user.setting[name]) {
            user.setting[name] = {}
        }
        user.setting[name].state = st
        this.props.setSigninUserInfo(user);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{paddingHorizontal: 15, height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={ic_back} style={{width: 42, height: 37}} />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: 24}}>Settings</Text>
                    </View>
                    <Icon name="settings" size={30} color="white" />
                </View>
                <ScrollView style={{flex: 1, paddingVertical: 5}}>
                    
                    <CustomDropDown
                        states={appStates}
                        active={this.state.appActiveState}
                        onChangeActive={(item) => this.onChangeState(item)}
                    />
                    <View style={{paddingBottom: 10}}>
                        <Text style={{backgroundColor: 'lightgray', paddingHorizontal: 10, paddingVertical: 2, fontSize: 16}}>Device</Text>
                        <View style={{flexDirection: 'row', paddingVertical: 10, paddingRight: 10, justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Icon name={this.state.notification ? "notifications" : "notifications-off"} color='black' size={25} style={{marginHorizontal: 20}} />
                            <Text style={{fontSize: 16}}>Notifications</Text>
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <Switch 
                                    value={this.state.notification}  
                                    onValueChange ={(st) => this.onChangeSetting('notification', st)}/>  
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', paddingVertical: 10, paddingRight: 10, justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Icon name={this.state.sound ? "volume-up" : "volume-off"} color='black' size={25} style={{marginHorizontal: 20}} />
                            <Text style={{fontSize: 16}}>Sound</Text>
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <Switch 
                                    value={this.state.sound}
                                    onValueChange ={(st) => this.onChangeSetting('sound', st)}/>  
                            </View>
                        </View>
                    </View>
                    <View style={{paddingBottom: 10}}>
                        <Text style={{backgroundColor: 'lightgray', paddingHorizontal: 10, paddingVertical: 2, fontSize: 16}}>Payment</Text>
                        <TouchableOpacity>
                            <View style={{flexDirection: 'row', paddingVertical: 10, justifyContent: 'flex-start', alignItems: 'center'}}>
                                <Icon name="payment" color='black' size={25} style={{marginHorizontal: 20}} />
                                <Text style={{fontSize: 16}}>Payment</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
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
        setSigninUserInfo: (user) => { dispatch(setSigninUserInfo(user)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen)