import React, { Component } from 'react'
import { SafeAreaView, Text } from 'react-native'
import AppContainer from './src/routers'

export default class App extends Component {
    async componentDidMount() {
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;       
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
                <AppContainer />
            </SafeAreaView>
        );
    }
}
