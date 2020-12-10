import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, Linking } from 'react-native'
import styles from './styles'
import ic_back from '../../assets/ic_back.png'
import Icon from 'react-native-vector-icons/Zocial';

class SocialLinkScreen extends Component {
    openURL(url) {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + url);
            }
        });
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={{paddingHorizontal: 15, height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={ic_back} style={{width: 42, height: 37}} />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
                        <Text style={{color: 'white', fontSize: 24}}>Social media links</Text>
                    </View>
                </View>
                <View style={{width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{paddingBottom: 100}}>
                        <TouchableOpacity onPress={() => this.openURL('https://www.facebook.com/FiksalOfficial')} style={{marginBottom: 20}}>
                            <Icon name="facebook" size={30} color="#1a4c9b" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.openURL('https://www.instagram.com/fiksalofficial')} style={{marginTop: 20}}>
                            <Icon name="instagram" size={30} color="#1a4c9b" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

export default SocialLinkScreen