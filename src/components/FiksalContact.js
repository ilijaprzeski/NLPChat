import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Avatar from './Avatar'
import firebase from 'react-native-firebase'

const appStateColors = {
    'Active': '#4ed95a',
    'Away': '#f9b90e',
    'Do not disturb': '#f84336',
    'Invisible': '#8d8c91'
}

class FiksalContact extends Component {
    constructor() {
        super()
        this.state = {
            contact: null,
            stateColor: '#BBBBBB'
        }
    }

    componentDidMount() {
        let contact = this.props.contact

        this.setState({contact: contact});

        if (contact) {
            if (!contact.setting) {
                contact.setting = {}
            }

            firebase.database().ref(`/users/${contact.userId}/setting/appState`).on('value', snapshot => {
                if (snapshot.exists()) {
                    const appState = snapshot.val();
                    contact.setting.appState = appState;

                    const stateColor = appStateColors[appState.state];
                    this.setState({contact, stateColor})
                    if (appState.other === 'background') {
                        setTimeout(() => {
                            firebase.database().ref(`/users/${contact.userId}/setting/appState`).once('value', snap => {
                                contact.setting.appState = appState;

                                const stateColor = appStateColors[appState.state];
                                this.setState({contact, stateColor})
                            })
                        }, 61000) // 61s
                    }
                } else {
                    contact.setting.appState = null;
                    this.setState({contact, stateColor: '#8d8c91'})
                }
            });
        }
    }

    renderAppStateView() {
        const { contact, stateColor } = this.state;
        if (!(contact.setting && contact.setting.appState && contact.setting && contact.setting.appState.state != "Invisible"))
            return null

        const now = new Date().getTime();
        if (contact.setting.appState.state === 'Active'){
            if ((now - contact.setting.appState.updateTime) > 60 * 1000) {
                return null;
            } else if ( contact.setting.appState.other === 'background') {
                return (
                    <View style={{position: 'absolute', right: 10, bottom: 10, width: 12, height: 12, borderRadius: 6, backgroundColor: stateColor, justifyContent: 'center', alignItems: 'center'}} >
                        <View style={{width: 6, height: 6, backgroundColor: 'white', borderRadius: 3}}></View>
                    </View>
                )
            }
            else if ( contact.setting.appState.other === 'foreground') {
                return (
                    <View style={{position: 'absolute', right: 10, bottom: 10, width: 12, height: 12, borderRadius: 6, backgroundColor: stateColor}} />
                )
            }
        } else {
            return (
                <View style={{position: 'absolute', right: 10, bottom: 10, width: 12, height: 12, borderRadius: 6, backgroundColor: stateColor}} />
            )
        }
    }

    render() {
        const { contact, stateColor } = this.state;
        if (!contact)
            return (<View></View>)

        const styles = StyleSheet.create({
            center: {
                justifyContent: 'center', 
                alignItems: 'center'
            }
        });

        return (
            <View style={[{position: 'relative', width: this.props.size, height: this.props.size}, this.props.center ? styles.center : null]}>
                {
                    contact.avatar === '' ? (
                        <Avatar 
                            firstName={contact.firstName}
                            lastName={contact.lastName}
                            size={this.props.avatar.size}
                            fsize={this.props.avatar.fsize}
                        />
                    ) : (
                        <Image source={{uri: contact.avatar}} style={{width: this.props.avatar.size, height: this.props.avatar.size, borderColor: 'gray', borderRadius: this.props.avatar.size / 2}} />
                    )
                }
                { this.renderAppStateView() }
            </View>
        )
    }
}

export default FiksalContact;