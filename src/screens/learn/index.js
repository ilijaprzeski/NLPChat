import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Keyboard } from 'react-native'
import styles from './styles'
import ic_back from '../../assets/ic_back.png'
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import { HatebaseItem } from '../../components'
import { searchVocabulary } from '../../utils/hatebase';

class LearnScreen extends Component {
    constructor() {
        super()
        this.state = {
            word: '',
            searching: false,
            vocabs: []
        }
    }

    async search() {
        if(this.state.word.trim() === '')
            return 

        Keyboard.dismiss()
        this.setState({searching: true, vocabs: []})
        const realVocabs = await searchVocabulary(this.state.word);

        this.setState({searching: false, vocabs: realVocabs})
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={{paddingHorizontal: 15, height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={ic_back} style={{width: 42, height: 37}} />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: 24}}>Learn</Text>
                    </View>
                    <Icon name="book-open" size={30} color="white" />
                </View>
                <View style={{marginHorizontal: 5, marginVertical: 2, flexDirection: 'row', borderWidth: 1, borderColor: 'lightgray', borderRadius: 4, alignItems: 'center'}}>
                    <TextInput
                        style={{padding: 5, fontSize: 16, flex: 1}} 
                        placeholder="Please type your word." 
                        returnKeyType={"search"} 
                        onSubmitEditing={() => this.search()} 
                        blurOnSubmit={false} 
                        onChangeText={(text) => this.setState({word: text})}
                    />
                    <TouchableOpacity onPress={() => this.search()}>
                        <Icon1 name="search" size={30} color="gray" />
                    </TouchableOpacity>
                </View>
                <ScrollView style={{flex: 1, backgroundColor: '#EEEEEE', padding: 10}}>
                    {
                        this.state.searching ? (
                            <Text>Searching...</Text>
                        ) : (
                            (this.state.vocabs && this.state.vocabs.length > 0) ? this.state.vocabs.map((item, i) => (
                                <HatebaseItem key={i} hatebaseItem={item} />
                            )) : (
                                <Text style={{fontSize: 16}}>There is no results</Text>
                            )
                        )
                    }
                </ScrollView>
            </View>
        )
    }
}

export default LearnScreen