import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, Button } from 'react-native'
import styles from './styles'
import ic_back from '../../assets/ic_back.png'
import Icon from 'react-native-vector-icons/FontAwesome5';
import DatePicker from 'react-native-date-ranges';
import RNPickerSelect from 'react-native-picker-select';
import Spinner from 'react-native-loading-spinner-overlay'
import { getContacts } from '../../utils/chat'
import { selectUser } from '../../utils/user'
import { connect } from 'react-redux'
import { addUserInfo } from '../../actions/userinfo'
import Toast from 'react-native-simple-toast'
import { getPdfFileData, sendEmailwithPDF } from '../../utils/pdf';
import RNBackgroundDownloader from 'react-native-background-downloader';
import FileViewer from 'react-native-file-viewer';

class ReportScreen extends Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            loadintStr: 'Loading...',
            startDate: '',
            endDate: '',
            contacts: [],
            selectedUser: ''
        }
    }

    componentDidMount = async () => {

        var contacts = await getContacts(this.props.signin.signin_user_info.userId)
        if (contacts) {
            var newContacts = []

            newContacts = await Promise.all(contacts.map(contact => this.checkUserMap(contact)));

            // contacts.forEach(async contact => {

            //     // update usermap
            //     if (this.props.usermap[contact.userId] === undefined) {
            //         const user = await selectUser(contact.userId)
            //         if (user !== null){
            //             this.props.addUserInfo(user.userId, user)
            //             newContacts.push(user)
            //         }
            //     } else {
            //         newContacts.push(this.props.usermap[contact.userId])
            //     }
            //     this.setState({contacts: []})
            //     this.setState({contacts: newContacts})
            // })
            this.setState({loading: false, contacts: newContacts})
        } else {
            this.setState({loading: false})
        }
    }

    checkUserMap = (contact) => {
        return new Promise(async (resolve, reject) => {
            if (this.props.usermap[contact.userId] === undefined) {
                const user = await selectUser(contact.userId)
                if (user !== null){
                    this.props.addUserInfo(user.userId, user)
                    resolve(user)
                } else {
                    resolve(null)
                }
            } else {
                resolve(this.props.usermap[contact.userId]);
            }
        })
    }

    validAction() {
        if (!this.state.selectedUser)   return false;
        if (!this.state.startDate)      return false;
        if (!this.state.endDate)      return false;
        return true;
    }

    downloadPDF = async () => {
        if (!this.validAction()) {
            Toast.show('Invalid Info');
            return ;
        }

        try {
            this.setState({loading: true, loadintStr: 'Generating PDF'});
            const data = await getPdfFileData(this.props.signin.signin_user_info.userId, this.state.selectedUser, this.state.startDate, this.state.endDate);
            this.setState({loading: true, loadintStr: 'Downloading PDF'});
            const dest = `${RNBackgroundDownloader.directories.documents}/${data.pdfFileName}`;

            let task = RNBackgroundDownloader.download({
                id: data.pdfFileName,
                url: data.url,
                destination: dest
            }).begin((expectedBytes) => {
                console.log('WWW', `Going to download ${expectedBytes} bytes!`);
            }).progress((percent) => {
                console.log('WWW', `Downloaded: ${percent * 100}%`);
            }).done(async () => {
                // await this.setState({loading: true, loadintStr: ''});
                FileViewer.open(dest, {
                    onDismiss: () => {
                        this.setState({loading: false})
                    }
                }).then(() => {
                }).catch(error => {
                    this.setState({loading: false})
                    console.log('WWW-fileviewer-error', error)
                })
            }).error((error) => {
                this.setState({loading: false});
                console.log('WWW-error', 'Download canceled due to error: ', error);
            });
        } catch (error) {
            console.log('WWW-error', error)
            this.setState({loading: false});
        }
    }

    sendEmail = async () => {
        if (!this.validAction()) {
            Toast.show('Invalid Info');
            return ;
        }

        try {
            this.setState({loading: true, loadintStr: 'Sending Emails'});
            const data = await getPdfFileData(this.props.signin.signin_user_info.userId, this.state.selectedUser, this.state.startDate, this.state.endDate);
            
            const rrr = await sendEmailwithPDF(this.props.signin.signin_user_info.userId, data.url, data.pdfFileName);
            this.setState({loading: false});
            Toast.show('Email is sent successfully.');
        } catch (error) {
            console.log('WWW', error)
            this.setState({loading: false});
        }
    }

    confirmButton = (onConfirm) => (
        <Text onPress={onConfirm} style={{ fontSize: 20 }}>Confirm</Text>
    )

    render() {
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.loading} textContent={this.state.loadintStr} textStyle={{color: '#FFF'}} />
                <View style={{paddingHorizontal: 15, height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={ic_back} style={{width: 42, height: 37}} />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: 24}}>Report</Text>
                    </View>
                    <Icon name="file-pdf" size={30} color="white" />
                </View>
                <ScrollView style={{flex: 1}}>
                    <View style={{paddingVertical: 30, paddingHorizontal: 20}}>
                        <View style={{marginBottom: 20}}>
                            <Text style={{ fontSize: 16, marginBottom: 10 }}>Who: </Text>
                            <View>
                                <RNPickerSelect
                                    onValueChange={(userId) => this.setState({selectedUser: userId})}
                                    items={this.state.contacts.map(contact => ({label: contact.firstName + ' ' + contact.lastName, value: contact.userId}))}
                                />
                            </View>
                        </View>
                        <View style={{marginBottom: 20}}>
                            <Text style={{ fontSize: 16, marginBottom: 20 }}>Date Range: </Text>
                            <DatePicker
                                style={ { width: '100%', height: 45 } }
                                customStyles = { {
                                    placeholderText: { fontSize: 16 },  // placeHolder style
                                    headerStyle: { },			// title container style
                                    headerMarkTitle: { }, // title mark style 
                                    headerDateTitle: { }, // title Date style
                                    contentInput: {}, //content text container style
                                    contentText: { fontSize: 16 }, //after selected text Style
                                } } // optional 
                                centerAlign // optional text will align center or not
                                allowFontScaling = {false} // optional
                                placeholder={'Select Date Range'}
                                mode={'range'}
                                returnFormat={'YYYY-MM-DD'}
                                markText={'Select Date Range'}
                                customButton = {this.confirmButton}
                                onConfirm = {(range) => this.setState({startDate: range.startDate, endDate: range.endDate})}
                            />
                        </View>

                        <View style={{paddingTop: 30, width: '100%', alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => this.downloadPDF()}>
                                <View style={{backgroundColor: '#1a4b9a', width: 300, padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
                                    <Text style={{fontSize: 18, color: 'white'}}>Download PDF</Text>
                                </View>
                            </TouchableOpacity>
                            
                            <View style={{width: '100%', height: 20}}></View>

                            <TouchableOpacity onPress={() => this.sendEmail()}>
                                <View style={{backgroundColor: '#1a4b9a', width: 300, padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
                                    <Text style={{fontSize: 18, color: 'white'}}>Send Email</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return state
}

const mapDispatchToProps = dispatch => {
    return {
        addUserInfo: (userid, user) => { dispatch(addUserInfo(userid, user)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportScreen)