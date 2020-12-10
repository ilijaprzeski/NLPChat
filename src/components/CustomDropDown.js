import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/MaterialIcons';

class CustomDropDown extends Component {
    constructor() {
        super()
        this.state = {
            states: [],
            active: null,
            collapsed: true,
            iconSize: 25
        }
    }

    componentDidMount() {
        this.setState({states: this.props.states})
        this.setState({active: this.props.active})
    }

    static getDerivedStateFromProps(props, state) {
        // console.log('WWW-props', props)
        // console.log('WWW-state', state)
        if (props.active !== state.active) {
          return {
            active: props.active
          };
        }

        // Return null if the state hasn't changed
        return null;
    }

    setActiveItem(item) {
        this.setState({collapsed: true})
        this.props.onChangeActive(item)
    }

    render() {

        if(!this.state.active) 
            return null

        if (this.state.collapsed) {
            return (
                <TouchableOpacity onPress={() => this.setState({collapsed: false})}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 10}}>
                        <Icon name={this.state.active.icon} color={this.state.active.color} size={this.state.active.iconSize} style={{marginHorizontal: 20}} />
                        <Text style={{fontSize: 16}}>{this.state.active.title}</Text>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                            <Icon1 name='expand-more' size={25} style={{marginHorizontal: 10}}/>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <View>
                {
                    this.state.states.map((item, i) => 
                        (
                            <TouchableOpacity key={i} onPress={() => this.setActiveItem(item)}>
                                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 10}}>
                                    <Icon name={item.icon} color={item.color} size={item.iconSize} style={{marginHorizontal: 20}} />
                                    <Text style={{fontSize: 16}}>{item.title}</Text>
                                    {
                                        this.state.active.title === item.title && (
                                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                                <Icon name='check' size={25} style={{marginHorizontal: 10}}/>
                                            </View>
                                        )
                                    }
                                </View>
                            </TouchableOpacity>
                        )
                    )
                }
                </View>
            )
        }
    }
}

export default CustomDropDown