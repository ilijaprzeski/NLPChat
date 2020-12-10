import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import styles from './styles'
import ic_back from '../../assets/ic_back.png'
import Icon from 'react-native-vector-icons/MaterialIcons'

class InfoScreen extends Component {
    render(){
        return (
            <View style={styles.container}>
                <View style={{paddingHorizontal: 15, height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={ic_back} style={{width: 42, height: 37}} />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: 24}}>Info</Text>
                    </View>
                    <Icon name="info-outline" size={30} color="white" />
                </View>
                <View style={{paddingTop: 40, alignItems: 'center'}}>
                    <Text style={styles.info_item} onPress={() => this.props.navigation.navigate('terms')}>Terms and Conditions</Text>
                    <Text style={styles.info_item} onPress={() => this.props.navigation.navigate('privacypolicy')}>Privacy policy</Text>
                    <Text style={styles.info_item} onPress={() => this.props.navigation.navigate('aboutus')}>About us</Text>
                    <Text style={styles.info_item} onPress={() => this.props.navigation.navigate('social')}>Social media links</Text>
                </View>
            </View>
        )
    }
}

export default InfoScreen