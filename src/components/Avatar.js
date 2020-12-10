import React, { Component } from 'react'
import { View, Text } from 'react-native'

class Avatar extends Component {
    constructor() {
        super()
        this.state = {
            firstLetter: '',
            lastLetter: '',
            avatarSize: 0,
            fontSize: 0,
            radius: 5, 
            marginleft: 10
        }
    }

    static getDerivedStateFromProps(props, state) {
        if ((props.firstName && props.firstName.toUpperCase()[0] !== state.firstLetter) || (props.lastName && props.lastName.toUpperCase()[0] !== state.lastLetter)) {
          return {
            firstLetter: props.firstName ? props.firstName.toUpperCase()[0] : '',
            lastLetter: props.lastName ? props.lastName.toUpperCase()[0] : '',
          };
        }
    
        // Return null if the state hasn't changed
        return null;
    }

    componentDidMount() {
        const radius = Math.floor(this.props.size / 2)
        this.setState({
            firstLetter: this.props.firstName ? this.props.firstName.toUpperCase()[0] : '',
            lastLetter: this.props.lastName ? this.props.lastName.toUpperCase()[0] : '',
            avatarSize: this.props.size,
            fontSize: this.props.fsize,
            radius,
            marginleft: this.props.marginLeft ? this.props.marginLeft : 0
        })
    }

    render() {
        return (
            <View style={{
                    width: this.state.avatarSize, 
                    height: this.state.avatarSize, 
                    borderRadius: this.state.radius, 
                    borderWidth: 1, 
                    borderColor: 'gray', 
                    marginRight: this.state.marginleft,
                    justifyContent: 'center', 
                    alignItems: 'center'}}>
                <Text 
                    style={{
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        fontSize: this.state.fontSize, 
                        fontWeight: 'bold'
                    }}>{this.state.firstLetter}.{this.state.lastLetter}</Text>
            </View>
        )
    }
}

export default Avatar