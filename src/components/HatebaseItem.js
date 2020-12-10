import React, { Component } from 'react'
import { View, Text, Animated, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getVocabularyColor, getVocabularyLevel } from '../utils/chat'
import { WordsMatter } from '../components'

export default class HatebaseItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            expanded: true,
            animation: new Animated.Value(1)
        }

        this.maxHeight = 0
        this.minHeight = 0
        this.expanded = true
    }

    doAnimation() {
        
        finalValue = this.expanded ? this.maxHeight + this.minHeight : this.minHeight;

        Animated.spring(     //Step 4
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();  //Step 5
    }

    toggle() {
        this.setState({
            expanded : !this.state.expanded  //Step 2
        });
        this.expanded = !this.expanded
        this.doAnimation()
    }

    _setMaxHeight(event){
        this.maxHeight = event.nativeEvent.layout.height
        this.doAnimation()
    }
    
    _setMinHeight(event){
        this.minHeight = event.nativeEvent.layout.height
        this.doAnimation()
    }

    renderTargets(badWord) {
        return (
            <View>
                { badWord.is_about_nationality && (
                    <View style={{paddingTop: 5, paddingLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                        <WordsMatter type="nationality" width={25} marginH={6} />
                        <Text style={{fontSize: 16}}>Nationality</Text>
                    </View>
                ) }
                { badWord.is_about_ethnicity && (
                    <View style={{paddingTop: 5, paddingLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                        <WordsMatter type="ethnicity" width={25} marginH={6} />
                        <Text style={{fontSize: 16}}>Ethnicity</Text>
                    </View>
                ) }
                { badWord.is_about_religion && (
                    <View style={{paddingTop: 5, paddingLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                        <WordsMatter type="religion" width={25} marginH={6} />
                        <Text style={{fontSize: 16}}>Religion</Text>
                    </View>
                ) }
                { badWord.is_about_gender && (
                    <View style={{paddingTop: 5, paddingLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                        <WordsMatter type="gender" width={25} marginH={6} />
                        <Text style={{fontSize: 16}}>Gender</Text>
                    </View>
                ) }
                { badWord.is_about_sexual_orientation && (
                    <View style={{paddingTop: 5, paddingLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                        <WordsMatter type="sexual_orientation" width={25} marginH={6} />
                        <Text style={{fontSize: 16}}>Sexual Orientation</Text>
                    </View>
                ) }
                { badWord.is_about_disability && (
                    <View style={{paddingTop: 5, paddingLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                        <WordsMatter type="disability" width={25} marginH={6} />
                        <Text style={{fontSize: 16}}>Disability</Text>
                    </View>
                ) }
                { badWord.is_about_class && (
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
            <Animated.View style={{height: this.state.animation, overflow: 'hidden', marginBottom: 15}}>
                <TouchableOpacity onPress={() => this.toggle()}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}} onLayout={(event) => this._setMinHeight(event)}>
                        <Text style={{flex: 1, color: '#41bf1e', fontSize: 18}}>{this.props.hatebaseItem.term}</Text>
                        <Icon name={this.state.expanded ? 'expand-less' : 'expand-more'} size={16} />
                    </View>
                </TouchableOpacity>
                <View style={{paddingLeft: 10}} onLayout={(event) => this._setMaxHeight(event)}>
                    <View style={{paddingTop: 5}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Hateful meaning: <Text style={{fontWeight: 'normal'}}>{this.props.hatebaseItem.hateful_meaning}</Text></Text>
                    </View>
                    <View style={{flexDirection: 'row', paddingTop: 5}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Offensiveness: <Text style={{fontWeight: 'normal', paddingVertical: 5, paddingHorizontal: 10, backgroundColor: getVocabularyColor(this.props.hatebaseItem)}}>{getVocabularyLevel(this.props.hatebaseItem)}</Text></Text>
                    </View>
                    <View style={{paddingTop: 5}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Targets:</Text>
                        { this.renderTargets(this.props.hatebaseItem) }
                    </View>
                </View>
            </Animated.View>
        )
    }
}