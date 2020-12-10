import React, { Component } from "react"
import {View, Text } from 'react-native'

class DateLine extends Component {
    render() {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'lightgray'}}></View>
                <View style={{paddingVertical: 15, paddingHorizontal: 10}}><Text style={{color: 'lightgray'}}>{this.props.date}</Text></View>
                <View style={{flex: 1, height: 1, backgroundColor: 'lightgray'}}></View>
            </View>
        )
    }
}

export default DateLine