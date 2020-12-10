import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'

export default FiksalButton = (props) => {
    return (
        <TouchableOpacity onPress={() => props.onClick()}>
            <View style={{width: '100%', backgroundColor: props.btnColor, borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingVertical: 10}}>
                <Text style={{color: 'white', fontSize: 20, textTransform: 'uppercase'}}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    )
}

