import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { WordsMatter } from '../../components'
import { checkMessagetoHatebase } from '../../utils/hatebase'
import HTML from 'react-native-render-html';
import { getVocabularyColor } from '../../utils/chat'
import SendSMS from 'react-native-sms'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-simple-toast'
import { connect } from 'react-redux';
import { addSms } from '../../utils/sms';
import { getContactFromPhone, getContactName } from '../../utils/contact';

import styles from './styles';
import ic_short_logo from '../../assets/short_logo.png'
import ic_back from '../../assets/ic_back.png'

class NewSmsScreen extends Component {
    constructor() {
        super()
        this.state = {
            htmlContent: '',
            badWords: [],
            inputHeight: 0,
            message: '',
            loading: false,
            phoneNumber: '',
            contactName: ''
        }
    }

    async componentDidMount() {
        const phoneNumber = this.props.navigation.getParam('phone', '');

        this.setState({phoneNumber})
        const contact = await getContactFromPhone(phoneNumber);
        if (contact) {
            this.setState({contactName: getContactName(contact)})
        } else {
            this.setState({contactName: ''})
        }
    }

    async onChangePhoneNumber(phoneNumber) {
        this.setState({phoneNumber})
        const contact = await getContactFromPhone(phoneNumber);
        if (contact) {
            this.setState({contactName: getContactName(contact)})
        } else {
            this.setState({contactName: ''})
        }
    }

    generateHtmlMessage(badWords, message) {
        var htmlContent = message;
        var reverseBadWords = [...badWords];
        reverseBadWords.reverse()
        for (var i = 0; i < reverseBadWords.length; i++) {
            const badWord = reverseBadWords[i];
            htmlContent = htmlContent.slice(0, badWord.pos + badWord.vocabulary.term.length) + "</span>" + htmlContent.slice(badWord.pos + badWord.vocabulary.term.length);
            htmlContent = htmlContent.slice(0, badWord.pos) + "<span style='background-color: " + getVocabularyColor(badWord.vocabulary) + "'>" + htmlContent.slice(badWord.pos);
        }
        htmlContent = htmlContent.replace(new RegExp("\n", "g"), "<br/>")
        this.setState({htmlContent: htmlContent})
    }

    onChangeMessage(message) {
        this.setState({message})

        // generate html content
        this.generateHtmlMessage(this.state.badWords, message)
        ////////////////////////

        checkMessagetoHatebase(this.state.message).then(res => {
            if (res.length === 0) {
                this.setState({badWords: []});
                this.generateHtmlMessage([], this.state.message)
            } else {
                this.setState({badWords: res});
                this.generateHtmlMessage(res, this.state.message)
            }
        }).catch(error => {
            console.log('Error', error)
        })
    }

    sendSms() {
        if (this.state.phoneNumber === ''){
            Alert.alert(
                'Fiksal',
                'Please type phone number',
                [ {text: "OK", onPress: () => this.phoneRef.focus()} ],
                {cancelable: false}
            )
            return ;
        }

        // send message
        this.setState({loading: true})
        SendSMS.send({
            body: this.state.message,
            recipients: [this.state.phoneNumber],
            successTypes: ['sent', 'queued'],
            allowAndroidSendWithoutReadPermission: true
        }, (completed, cancelled, error) => {

            this.setState({loading: false})

            if (cancelled) {
                Toast.show('SMS sending is cancelled.');
                return ;
            } else if (error) {
                Toast.show(error);
                return ;
            } else {
                addSms(this.state.phoneNumber, this.state.message, this.props.signin.signin_user_info.userId);
                Toast.show('SMS is sent successfully.');
                this.props.navigation.goBack()
            }
        });
    }

    onWordsMatterView() {
        this.props.navigation.navigate('wordsmatter', {
            badWords: this.state.badWords
        });
    }

    renderBadWords(badWord, index) {
        var backColor = getVocabularyColor(badWord.vocabulary)
        
        return (
            <View style={{height: 35, marginLeft: 5, paddingHorizontal: 3, alignItems: 'center', backgroundColor: backColor, borderRadius: 5, flexDirection: 'row'}} key={index}>
                <WordsMatter type="stop" width={22} marginH={2} />

                { badWord.vocabulary.is_about_nationality && (<WordsMatter type="nationality" width={25} marginH={2} />) }
                { badWord.vocabulary.is_about_ethnicity && (<WordsMatter type="ethnicity" width={25} marginH={2} />) }
                { badWord.vocabulary.is_about_religion && (<WordsMatter type="religion" width={22} marginH={2} />) }
                { badWord.vocabulary.is_about_gender && (<WordsMatter type="gender" width={19} marginH={2} />) }
                { badWord.vocabulary.is_about_sexual_orientation && (<WordsMatter type="sexual_orientation" width={25} marginH={2} />) }
                { badWord.vocabulary.is_about_disability && (<WordsMatter type="disability" width={22} marginH={2} />) }
                { badWord.vocabulary.is_about_class && (<WordsMatter type="class" width={30} marginH={2} />) }
            </View>
        )
    }

    render() {
        const htmlContent = `<span>${this.state.htmlContent}</span>`;

        return (
            <View style={styles.container}>
                <Spinner visible={this.state.loading} textContent={'Sending...'} textStyle={{color: '#FFF'}} />
                <View style={{paddingHorizontal: 15, height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={ic_back} style={{width: 42, height: 37}} />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: 24}}>New SMS</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.sendSms()}>
                        <Text style={{color: 'white', fontSize: 20}}>Send</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, paddingTop: 10}}>
                    { this.state.contactName ? (<Text style={{paddingHorizontal: 10, fontSize: 20, color: 'gray', fontWeight: 'bold'}}>{this.state.contactName}</Text>) : null }
                    <TextInput
                        style={{height: 40, borderColor: 'lightgray', marginHorizontal: 10, marginTop: 5, marginBottom: 10, paddingHorizontal: 5, borderRadius: 5, borderColor: '#d5d5d5', borderWidth: 0.5}}
                        ref={ref => this.phoneRef = ref}
                        placeholder="Phone Number"
                        multiline={false} 
                        onChangeText={phoneNumber => this.onChangePhoneNumber(phoneNumber)}
                        value={this.state.phoneNumber}
                        keyboardType="phone-pad"
                    />
                    <View style={{width: '100%', flex: 1}}>
                        <TouchableOpacity onPress={() => this.onWordsMatterView()}>
                            <View style={{paddingHorizontal: 5, paddingVertical: 5, flexDirection: 'row', backgroundColor: '#1a4b9a'}}>
                                <Image source={ic_short_logo} style={{width: 35, height: 35, borderRadius: 18, backgroundColor: 'white'}} />
                                {
                                    this.state.badWords.map((item, index) => this.renderBadWords(item, index))
                                }
                            </View>
                        </TouchableOpacity>
                        <View style={{flex: 1, paddingTop: 5, paddingBottom: 10}}>
                            <View style={{flex: 1, position: 'relative', paddingHorizontal: 10, height: Math.min(120, Math.max(29, this.state.inputHeight + 20)), }}>
                                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, paddingHorizontal: 15, paddingVertical: 5, flex: 1}} pointerEvents="none">
                                    <HTML html={htmlContent} />
                                </View>

                                <View style={{paddingVertical: 4.5, paddingHorizontal: 5, borderRadius: 5, borderColor: '#d5d5d5', borderWidth: 0.5, flex: 1}}>
                                    <TextInput 
                                        value={this.state.message}
                                        onChangeText={(message) => this.onChangeMessage(message)}
                                        onContentSizeChange={(event) => 
                                            this.setState({inputHeight: event.nativeEvent.contentSize.height})
                                        }
                                        style={{
                                            flex: 1,
                                            color: 'transparent',
                                            fontSize: 14,
                                            textAlign: 'left',
                                            textAlignVertical: 'top',
                                            overflow: 'hidden',
                                            flexWrap: 'wrap',
                                            padding: 0,
                                            backgroundColor: 'transparent'}} 
                                        multiline={true}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return state
}

export default connect(mapStateToProps, null)(NewSmsScreen)