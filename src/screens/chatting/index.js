import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Keyboard, Platform, RefreshControl, Alert } from 'react-native'
import styles from './styles'
import ic_back from '../../assets/ic_back.png'
import ic_search from '../../assets/ic_search.png'
import ic_short_logo from '../../assets/short_logo.png'
import { WordsMatter, Avatar, DateLine, FiksalContact } from '../../components'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { connect } from 'react-redux';
import HTML from 'react-native-render-html';
import Spinner from 'react-native-loading-spinner-overlay';
import { selectUser } from '../../utils/user'
import { 
    generateChatRoom, 
    isExistContact, 
    sendMessage, 
    getMessages,
    getVocabularyColor,
    sendFileMessage
} from '../../utils/chat'
import { getDateString, getTimeString, getHour } from '../../utils/time'
import firebase from 'react-native-firebase'
import { checkMessagetoHatebase } from '../../utils/hatebase'
import Toast from 'react-native-simple-toast'
import uuid from "uuid"
import * as Progress from 'react-native-progress';
import FileViewer from 'react-native-file-viewer';
import RNBackgroundDownloader from 'react-native-background-downloader';
import DocumentPicker from 'react-native-document-picker';

class ChattingScreen extends Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            isError: false,
            isNewContact: false,
            contactId: null,
            chatRoomId: null,

            newMessages: [],
            mainMessages: [],
            oldMessages: [],
            fileMessagesOnWorking: [],
            newTextMessages: [],

            message: '',
            inputHeight: 0,
            contact: null,
            hatebase: null,

            htmlContent: '',
            badWords: [],
            keyboardOffset: 0,
            refreshing: false,
            isScrollToEnd: true,
        }

        this.prevDate = null
        this.prevTime = null
        this.preMsgSide = null
        this.prevHour = null
        this.pagesize = 20;
        this.endAt = null
        this.oldHeight = 0;
    }

    componentDidMount = async () => {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

        const contactId = this.props.navigation.getParam('contactId', 'No-Contact')
        const chatRoomId = this.props.navigation.getParam('chatRoomId', 'No-ChatRoom')

        if (contactId === 'No-Contact') {
            this.setState({isError: true});
            return ;
        }

        // getting a chatting partner.
        let contact = this.props.usermap[contactId];
        if (!contact) {
            contact = await selectUser(contactId);
            if (!contact) {
                this.setState({isError: true});
                return ;
            }
        }
        this.setState({contact});

        // getting a chatting room
        if (chatRoomId === 'No-ChatRoom') {
            const isExist = await isExistContact(this.props.signin.signin_user_info.userId, contactId);
            if(!isExist) {
                this.setState({isNewContact: true});
            }

        } else {
            const messages = await getMessages(chatRoomId, this.pagesize);
            this.setState({mainMessages: messages});
            if (this.state.isScrollToEnd) {
                setTimeout(
                    () => {
                        this.msgScrollView.scrollToEnd()
                        this.setState({loading: false})
                    }, 100
                )
            }

            //set for getting old message in load more action
            this.endAt = messages[0].msgTime - 1;

            // getting new messages
            const startAt = messages[messages.length - 1].msgTime + 1;
            firebase.database().ref('messages/' + chatRoomId).orderByChild('msgTime').startAt(startAt).on('value', snapshot => {
                this.onReceivedMessage(snapshot);
            });
        }
        this.setState({contactId, chatRoomId, loading: false})
    }

    onReceivedMessage = (snapshot) => {
        if (snapshot.exists()) {
            let res = [];
            snapshot.forEach(snap => {
                res.push(snap.val());
            })
            this.setState({newTextMessages: res})

            this.updateAllNewMessages();
        }
    }

    updateAllNewMessages() {
        let messages = [...this.state.newTextMessages, ...this.state.fileMessagesOnWorking];
        messages.sort((a, b) => {
            if (a.msgTime > b.mgsTime)  return -1;
            else                        return 1;
        })
        
        this.setState({newMessages: messages})
        if (this.state.isScrollToEnd) {
            setTimeout(() => {
                if (this.msgScrollView) this.msgScrollView.scrollToEnd()
            }, 100);
        }
    }

    onRefresh() {
        this.setState({refreshing: true})
        firebase.database().ref(`messages/${this.state.chatRoomId}`).orderByChild('msgTime').endAt(this.endAt).limitToLast(this.pagesize).once('value', snapshot => {
            if (snapshot.exists()) {
                let res = [];
                snapshot.forEach(snap => {
                    res.push(snap.val());
                })
                let mainMessages = [...this.state.mainMessages];
                let oldMessages = [...this.state.oldMessages]
                mainMessages = oldMessages.concat(mainMessages)
                oldMessages = [...res];
                this.setState({mainMessages, oldMessages})
                this.endAt = res[0].msgTime - 1;
            } else {
                this.setState({refreshing: false})
            }
        });
    }

    isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = (event) => {
        if (Platform.OS === 'ios'){
            this.setState({
                keyboardOffset: event.endCoordinates.height,
            })
        }
    }

    _keyboardDidHide = () => {
        if (Platform.OS === 'ios'){
            this.setState({
                keyboardOffset: 0,
            })
        }
    }

    async onSendMessage() {
        if (this.state.message.trim() === '') {
            return ;
        }

        if (this.state.chatRoomId === 'No-ChatRoom') {
            this.endAt = new Date().getTime();
            const chatRoomId = await generateChatRoom(this.props.signin.signin_user_info.userId, this.state.contactId);
            await sendMessage(this.state.message, this.props.signin.signin_user_info.userId, this.state.contactId, chatRoomId);
            this.setState({chatRoomId, badWords: [], isScrollToEnd: true});

            firebase.database().ref('messages/' + chatRoomId).orderByChild('msgTime').on('value', snapshot => {
                this.onReceivedMessage(snapshot);
            });
        } else {
            await sendMessage(this.state.message, this.props.signin.signin_user_info.userId, this.state.contactId, this.state.chatRoomId);
            this.setState({badWords: [], isScrollToEnd: true})
        }
        this.setState({message: '', htmlContent: ''});
    }

    async sayHI() {
        await this.setState({message: 'Hi.'});
        this.onSendMessage();
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

    onWordsMatterView() {
        this.props.navigation.navigate('wordsmatter', {
            badWords: this.state.badWords
        });
    }

    uploadFile(uuid, path, name) {
        try {
            const ext = path.split('.').pop(); // Extract image extension
            const filename = `${uuid}.${ext}`; // Generate unique name
            firebase.storage().ref(`files/${filename}`).putFile(path).on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // Calculate progress percentage
                    let status = "uploading"
                    
                    if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                        status = "finished"
                        this.updateFileMessage(uuid, progress, status, name, snapshot.downloadURL);
                    } else {
                        this.updateFileMessage(uuid, progress, status);
                    }
                },
                error => {
                    console.log('WWW-error', error);
                    Toast.show(error.toString());
                }
            );
        } catch (error) {
            console.log('WWW-uploadFile', error)
        }
    }

    updateFileMessage = (uuid, progress, status, name, url) => {
        try {
            let fileMsgs = [...this.state.fileMessagesOnWorking]
            fileMsgs.forEach(async (item, index) => {
                if (item.uuid === uuid) {
    
                    if (status === 'finished') {
                        fileMsgs.splice(index, 1)
                        this.setState({fileMessagesOnWorking: fileMsgs});
                        if (this.state.chatRoomId === 'No-ChatRoom') {
                            const chatRoomId = await generateChatRoom(this.props.signin.signin_user_info.userId, this.state.contactId);
                            await sendFileMessage(url, name, this.props.signin.signin_user_info.userId, this.state.contactId, chatRoomId);
                            this.setState({chatRoomId, isScrollToEnd: true});
    
                            firebase.database().ref('messages/' + chatRoomId).orderByChild('msgTime').on('value', snapshot => {
                                this.onReceivedMessage(snapshot);
                            });
                        } else {
                            await sendFileMessage(url, name, this.props.signin.signin_user_info.userId, this.state.contactId, this.state.chatRoomId);
                            this.setState({isScrollToEnd: true})
                        }
                    } else {
                        item.progress = progress;
                        item.status = status;
                        fileMsgs[index] = item;
                        this.setState({fileMessagesOnWorking: fileMsgs});
                    }
                }
            });
        } catch (error) {
            console.log('WWW-updateFileMessage', error)
        }
    }

    async onSendFile() {
        try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.allFiles],
            });
            let path = res.uri;
            const filename = res.name;
            const fileItem = {
                uuid: uuid(),
                path: path,
                fileName: filename,
                type: 'file',
                status: "uploading",
                progress: 0,
                msgTime: new Date().getTime(),
                senderId: this.props.signin.signin_user_info.userId
            };
            let fileMsgs = [...this.state.fileMessagesOnWorking]
            fileMsgs.push(fileItem);
            this.setState({fileMessagesOnWorking: fileMsgs})
            this.updateAllNewMessages();
            this.uploadFile(fileItem.uuid, path, filename)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                console.log('WWW-error', err)
            }
        }
    }

    downloadFile(downloadURL, fileName, isOpened, message) {
        let ext = fileName.split('.').pop(); // Extract image extension
        ext = ext.toLowerCase();
        const acceptedFileTypes = ['pdf', 'png', 'jpeg', 'bmp', 'jpg'];
        const dest = `${RNBackgroundDownloader.directories.documents}/${fileName}`;
        if (!isOpened){
            Alert.alert(
                'Accept File?',
                `Accept files only from people you trust. Do you want to accept the file "${fileName}".`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Accept', 
                        onPress: () => {
                            let task = RNBackgroundDownloader.download({
                                id: uuid(),
                                url: downloadURL,
                                destination: dest
                            }).begin((expectedBytes) => {
                                Toast.show('Downloading...');
                            }).progress((percent) => {
                                Toast.show('Downloading...');
                            }).done(async () => {
                                if (message.senderId === this.props.signin.signin_user_info.userId) {
                                    firebase.database().ref(`messages/${this.state.chatRoomId}/${message.messageId}`).update({
                                        senderOpen: true
                                    });
                                } else {
                                    firebase.database().ref(`messages/${this.state.chatRoomId}/${message.messageId}`).update({
                                        receiverOpen: true
                                    });
                                }
                
                                if (acceptedFileTypes.indexOf(ext) < 0) {
                                    Toast.show(`${fileName} is downloaded successfully, but this file can't be opened on this device.`);
                                } else {
                                    FileViewer.open(dest, {
                                        onDismiss: () => {
                                            this.setState({loading: false});
                                        }
                                    }).then(() => {
                                    }).catch(error => {
                                        this.setState({loading: false});
                                        console.log('WWW-fileviewer-error', error);
                                    })
                                }
                            }).error((error) => {
                                this.setState({loading: false});
                                console.log('WWW-error', 'Download canceled due to error: ', error);
                            });
                        }
                    },
                ],
                {cancelable: true},
            );
        } else {
            if (acceptedFileTypes.indexOf(ext) < 0) {
                Toast.show(`${fileName} can't be opened on this device.`);
            } else {
                FileViewer.open(dest, {
                    onDismiss: () => {
                        this.setState({loading: false});
                    }
                }).then(() => {
                }).catch(error => {
                    this.setState({loading: false});
                    console.log('WWW-fileviewer-error', error);
                })
            }
        }
    }

    renderMessage(message, index) {
        const msgDate = getDateString(new Date(message.msgTime))
        const msgTime = getTimeString(new Date(message.msgTime))
        const msgHour = getHour(new Date(message.msgTime))
        const isNewDate = msgDate !== this.prevDate
        const prevMsgSide = this.preMsgSide
        const isNewTime = isNewDate ? true : (prevMsgSide !== message.senderId ? true : (msgHour === this.prevHour ? false : true))

        // previous data setting
        this.prevDate = msgDate
        this.prevTime = msgTime
        this.preMsgSide = message.senderId
        this.prevHour = msgHour

        if (message.senderId === this.props.signin.signin_user_info.userId){
            if (message.type === 'file') {
                return (
                    <View key={index} style={{paddingHorizontal: 15}}>
                        { isNewDate && (<DateLine date={msgDate} />) }
                        <View style={{alignItems: 'flex-end', width: '100%'}}>
                            <TouchableOpacity onPress={() => {
                                if (message.status !== 'uploading') {
                                    this.downloadFile(message.downloadUrl, message.fileName, message.senderOpen, message);
                                }
                            }}>
                                <View style={[{width: 200, position: 'relative'}, styles.msgPan]}>
                                    <Text numberOfLines={1} style={styles.msg}>{message.fileName}</Text>
                                    <View style={{flexDirection: 'row', paddingVertical: 10}}>
                                        <AntDesignIcon name="file1" size={25} color="gray"/>
                                        <Text style={{paddingLeft: 10}}>File</Text>
                                    </View>
                                    <View style={{height: 1, backgroundColor: 'gray'}}></View>
                                    <View style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 6}}>
                                        <Text>{message.senderOpen ? "Open": "Download"}</Text>
                                    </View>
                                    {
                                        message.status === 'uploading' && (
                                            <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center'}}>
                                                <Progress.Pie progress={message.progress/100} size={30} />
                                            </View>
                                        )
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }

            return (
                <View style={{paddingHorizontal: 15}} key={index}>
                    { isNewDate && (<DateLine date={msgDate} />) }
                    <View style={{alignItems: 'flex-end', width: '100%'}}>
                        <View style={{maxWidth: '70%'}}>
                            {
                                isNewTime ? (
                                    <View style={{alignItems: 'flex-end'}}><Text style={styles.msgTime}>{msgTime}</Text></View>
                                ) : (null)
                            }
                            <View style={styles.msgPan}><Text style={styles.msg}>{message.msg}</Text></View>
                        </View>
                    </View>
                </View>
            )
        } else {

            if (message.type === 'file') {
                return (
                    <View style={{paddingHorizontal: 15}} key={index}>
                        { isNewDate && (<DateLine date={msgDate} />) }
                        <View style={{width: '100%', flexDirection: 'row'}}>
                            {
                                (isNewDate || (prevMsgSide === null && message.senderId !== this.props.signin.signin_user_info.userId) || prevMsgSide !== message.senderId) ? (
                                <FiksalContact contact={this.state.contact} size={50} avatar={{size: 40, fsize: 20}} />
                                ) : (
                                    <View style={{width: 50}} />
                                )
                            }
                            <View style={{maxWidth: '70%'}}>
                                {
                                    isNewTime ? (
                                        <View><Text style={styles.msgTime}>{msgTime}</Text></View>
                                    ) : (null)
                                }
                                <TouchableOpacity onPress={() => this.downloadFile(message.downloadUrl, message.fileName, message.receiverOpen, message)}>
                                    <View style={[{width: 200, position: 'relative'}, styles.msgPan]}>
                                        <Text numberOfLines={1} style={styles.msg}>{message.fileName}</Text>
                                        <View style={{flexDirection: 'row', paddingVertical: 10}}>
                                            <AntDesignIcon name="file1" size={25} color="gray"/>
                                            <Text style={{paddingLeft: 10}}>File</Text>
                                        </View>
                                        <View style={{height: 1, backgroundColor: 'gray'}}></View>
                                        <View style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 6}}>
                                            <Text>{message.receiverOpen ? "Open" : "Download"}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
            }

            return (
                <View style={{paddingHorizontal: 15}} key={index}>
                    { isNewDate && (<DateLine date={msgDate} />) }
                    <View style={{width: '100%', flexDirection: 'row'}}>
                        {
                            (isNewDate || (prevMsgSide === null && message.senderId !== this.props.signin.signin_user_info.userId) || prevMsgSide !== message.senderId) ? (
                                <FiksalContact contact={this.state.contact} size={50} avatar={{size: 40, fsize: 20}} />
                            ) : (
                                <View style={{width: 50}}></View>
                            )
                        }
                        <View style={{maxWidth: '70%'}}>
                            {
                                isNewTime ? (
                                    <View><Text style={styles.msgTime}>{msgTime}</Text></View>
                                ) : (null)
                            }
                            <View style={styles.msgPan}><Text style={styles.msg}>{message.msg}</Text></View>
                        </View>
                    </View>
                </View>
            )
        }
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

        if (this.state.isError) {
            return (
                <View>
                    <Text>Error is occured.</Text>
                </View>
            )
        }

        this.prevDate = null
        this.prevTime = null
        this.preMsgSide = null
        this.prevHour = null

        return (
            <View style={[styles.container, {paddingBottom: this.state.keyboardOffset > 0 ? this.state.keyboardOffset : 0}]}>
                <Spinner visible={this.state.loading} textContent={'Loading...'} textStyle={{color: '#FFF'}} />
                <View style={{paddingHorizontal: 15, height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={ic_back} style={{width: 42, height: 37}} />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: 24}}>{this.state.contact ? this.state.contact.firstName + ' ' + this.state.contact.lastName : ''}</Text>
                    </View>
                    <TouchableOpacity>
                        <Image source={ic_search} style={{width: 36, height: 36}} />
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                //refresh control used for the Pull to Refresh
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.onRefresh()}
                            />
                        }
                        onScroll={({nativeEvent}) => {
                            if (this.isCloseToBottom(nativeEvent)) {
                                this.setState({isScrollToEnd: true})
                            } else {
                                this.setState({isScrollToEnd: false})
                            }
                        }}
                        ref={ref => this.msgScrollView = ref} 
                        style={{marginVertical: 10}} >
                        {
                            this.state.isNewContact && this.state.contact && (
                                <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginVertical: 30}}>
                                    {
                                        this.state.contact.avatar === '' ? (
                                            <Avatar 
                                                firstName={this.state.contact.firstName}
                                                lastName={this.state.contact.lastName}
                                                size={100}
                                                fsize={50}
                                            />
                                        ) : (
                                            <Image source={{uri: this.state.contact.avatar}} style={{width: 100, height: 100, borderColor: 'gray', borderRadius: 50}} />
                                        )
                                    }
                                    <View style={{paddingVertical: 10, justifyContent: 'center',}}>
                                        <Text style={{fontSize: 18}}>{this.state.contact.fullName}</Text>
                                    </View>
                                    <View style={{paddingVertical: 10, alignItems: 'center'}}>
                                        <Text style={{fontSize: 18}}>Say hi to {this.state.contact.fullName}</Text>
                                        <TouchableOpacity onPress={() => this.sayHI()}>
                                            <View style={{marginVertical: 10, width: 150, paddingVertical: 10, backgroundColor: '#0078d4', borderRadius: 20, alignItems: 'center'}}>
                                                <Text style={{color: 'white', fontSize: 16}}>Say hi</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{width: '100%', height: 1, backgroundColor: 'lightgray'}}></View>
                                </View>
                            )
                        }
                        <View style={{width: '100%'}} id="old_messages" onLayout={(event) => {
                            if (this.state.refreshing){
                                const scrollPos = (event.nativeEvent.layout.height - 40) > 0 ? (event.nativeEvent.layout.height - 40) : 0
                                this.msgScrollView.scrollTo({x: 0, y: scrollPos, animated: true})
                                this.setState({refreshing: false})
                            }
                        }}>
                        {
                            this.state.oldMessages && this.state.oldMessages.map((message, index) => this.renderMessage(message, index))
                        }
                        </View>
                        <View style={{width: '100%'}} id="messages">
                        {
                            this.state.mainMessages && this.state.mainMessages.map((message, index) => this.renderMessage(message, index))
                        }
                        </View>
                        <View style={{width: '100%'}} id="messages">
                        {
                            this.state.newMessages && this.state.newMessages.map((message, index) => this.renderMessage(message, index))
                        }
                        </View>
                    </ScrollView>
                </View>
                <View style={{width: '100%', paddingBottom: 2}}>
                    <TouchableOpacity onPress={() => this.onWordsMatterView()}>
                        <View style={{paddingHorizontal: 5, paddingVertical: 5, flexDirection: 'row', backgroundColor: '#1a4b9a'}}>
                            <Image source={ic_short_logo} style={{width: 35, height: 35, borderRadius: 18, backgroundColor: 'white'}} />
                            {
                                this.state.badWords.map((item, index) => this.renderBadWords(item, index))
                            }
                        </View>
                    </TouchableOpacity>
                    <View style={{paddingVertical: 3, alignItems: 'center', flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => this.onSendFile()}>
                            <View style={{marginHorizontal: 5, padding: 3, borderRadius: 30, backgroundColor: '#eb6b14'}}>
                                <Icon1 name="attachment" size={25} color="white" />
                            </View>
                        </TouchableOpacity>
                        <ScrollView style={{flex: 1, position: 'relative', height: Math.min(120, Math.max(29, this.state.inputHeight + 20)), }}>
                            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, paddingHorizontal: 5, paddingVertical: 10}} pointerEvents="none">
                                <HTML html={htmlContent} />
                            </View>

                            <View style={{paddingVertical: 9.5, paddingHorizontal: 5, borderRadius: 5, borderColor: '#d5d5d5', borderWidth: 0.5}}>
                                <TextInput 
                                    value={this.state.message}
                                    onChangeText={(message) => this.onChangeMessage(message)}
                                    onContentSizeChange={(event) => 
                                        this.setState({inputHeight: event.nativeEvent.contentSize.height})
                                    }
                                    style={{
                                        height: this.state.inputHeight,
                                        color: 'transparent',
                                        fontSize: 14,
                                        textAlign: 'left',
                                        textAlignVertical: 'center',
                                        overflow: 'hidden',
                                        flexWrap: 'wrap',
                                        padding: 0,
                                        backgroundColor: 'transparent'}} 
                                    multiline={true}
                                    autoCapitalize="sentences"
                                />
                            </View>
                            
                        </ScrollView>
                        <TouchableOpacity onPress={() => this.onSendMessage()}>
                            <View style={{paddingHorizontal: 8}}>
                                <Icon name="send" size={25} color={this.state.message ? "#0c89d6" : "gray"} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return state
}

export default connect(mapStateToProps, null)(ChattingScreen)