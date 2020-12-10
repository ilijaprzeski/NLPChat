import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import styles from './styles'
import ic_back from '../../assets/ic_back.png'
import ic_short_logo from '../../assets/short_logo.png'
import { WordsMatter } from '../../components'
import { getVocabularyColor, getVocabularyLevel } from '../../utils/chat'

class WordsMatterScreen extends Component {
    constructor() {
        super()
        this.state = {
            badWords: []
        }
    }

    componentDidMount() {
        const badWords = this.props.navigation.getParam('badWords');
        this.setState({badWords});
    }

    titlebar(badWord) {
        return (
            <View style={{width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', paddingRight: 16, backgroundColor: getVocabularyColor(badWord.vocabulary)}}>
                <WordsMatter type="stop" width={22} marginH={10} />
                <Text style={{fontWeight: 'bold', fontSize: 22}}>{badWord.vocabulary.term}</Text>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text style={{fontSize: 14}}>Offensiveness: {getVocabularyLevel(badWord.vocabulary)}</Text>
                </View>
            </View>
        )
    }

    hasTargets(badWord) {
        if (badWord.vocabulary.is_about_nationality)            return true;
        if (badWord.vocabulary.is_about_ethnicity)              return true;
        if (badWord.vocabulary.is_about_religion)               return true;
        if (badWord.vocabulary.is_about_gender)                 return true;
        if (badWord.vocabulary.is_about_sexual_orientation)     return true;
        if (badWord.vocabulary.is_about_disability)             return true;
        if (badWord.vocabulary.is_about_class)                  return true;
        return false;
    }

    renderTargets(badWord) {
        return (
            <View>
                { badWord.vocabulary.is_about_nationality && (
                    <View style={{paddingTop: 5, paddingLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                        <WordsMatter type="nationality" width={25} marginH={6} />
                        <Text style={{fontSize: 16}}>Nationality</Text>
                    </View>
                ) }
                { badWord.vocabulary.is_about_ethnicity && (
                    <View style={{paddingTop: 5, paddingLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                        <WordsMatter type="ethnicity" width={25} marginH={6} />
                        <Text style={{fontSize: 16}}>Ethnicity</Text>
                    </View>
                ) }
                { badWord.vocabulary.is_about_religion && (
                    <View style={{paddingTop: 5, paddingLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                        <WordsMatter type="religion" width={25} marginH={6} />
                        <Text style={{fontSize: 16}}>Religion</Text>
                    </View>
                ) }
                { badWord.vocabulary.is_about_gender && (
                    <View style={{paddingTop: 5, paddingLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                        <WordsMatter type="gender" width={25} marginH={6} />
                        <Text style={{fontSize: 16}}>Gender</Text>
                    </View>
                ) }
                { badWord.vocabulary.is_about_sexual_orientation && (
                    <View style={{paddingTop: 5, paddingLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                        <WordsMatter type="sexual_orientation" width={25} marginH={6} />
                        <Text style={{fontSize: 16}}>Sexual Orientation</Text>
                    </View>
                ) }
                { badWord.vocabulary.is_about_disability && (
                    <View style={{paddingTop: 5, paddingLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                        <WordsMatter type="disability" width={25} marginH={6} />
                        <Text style={{fontSize: 16}}>Disability</Text>
                    </View>
                ) }
                { badWord.vocabulary.is_about_class && (
                    <View style={{paddingTop: 5, paddingLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                        <WordsMatter type="class" width={25} marginH={6} />
                        <Text style={{fontSize: 16}}>Class</Text>
                    </View>
                ) }
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{paddingHorizontal: 15, height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={ic_back} style={{width: 42, height: 37}} />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: 24}}>words matter</Text>
                    </View>
                    <View style={{width: 65, height: 65, borderRadius: 35, backgroundColor: 'white'}}>
                        <Image source={ic_short_logo} style={{width: 60, height: 60}} />
                    </View>
                </View>
                <ScrollView style={{flex: 1, paddingVertical: 10}}>
                {
                    this.state.badWords.map((wordsmatter, index) => (
                        <View key={index}>
                            {this.titlebar(wordsmatter)}
                            <View style={{paddingHorizontal: 20, paddingVertical: 12}}>
                                <Text style={{fontSize: 16}}><Text style={{fontWeight: 'bold'}}>Hate Speech Definition: </Text>{wordsmatter.vocabulary.hateful_meaning}</Text>
                                {
                                    this.hasTargets(wordsmatter) && (
                                        <View style={{paddingVertical: 10}}>
                                            <Text style={{fontWeight: 'bold'}}>Targets:</Text>
                                            { this.renderTargets(wordsmatter) }
                                        </View>
                                    )
                                }
                            </View>
                        </View>
                    ))
                }
                </ScrollView>
            </View>
        )
    }
}

export default WordsMatterScreen