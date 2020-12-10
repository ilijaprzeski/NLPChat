import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import styles from './styles';
import ic_back from '../../assets/ic_back.png';
import ic_search from '../../assets/ic_search.png';
import { connect } from 'react-redux';
import { addUserInfo } from '../../actions/userinfo';
import { searchUsers } from '../../utils/user';
import Spinner from 'react-native-loading-spinner-overlay';
import { Avatar } from '../../components';

class SearchContactScreen extends Component {

    constructor() {
        super()
        this.state = {
            searching: false,
            search: '',
            contacts: []
        }
    }

    componentDidMount = async () => {
        
    }

    onSearch = async () => {
        if(this.state.searh === '') {
            this.setState({contacts: []})
            return 
        }

        const search = this.state.search.trim()
        this.setState({searching: true})
        try {
            const contacts = await searchUsers(search, this.props.signin.signin_user_info.userId)
            if(contacts) {
                this.setState({contacts, searching: false})
            } else {
                this.setState({contacts: [], searching: false})
            }
        } catch(error) {
            this.setState({contacts: [], searching: false})
        }
    }

    goChatRoom = (userId) => {
        this.props.navigation.navigate('chatting', {contactId: userId})
    }

    render() {
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.searching} textContent={'Searching...'} textStyle={{color: '#FFF'}} />
                <View style={{paddingHorizontal: 15, height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={ic_back} style={{width: 42, height: 37}} />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10}}>
                        <TextInput 
                            value={this.state.search}
                            onChangeText={(search) => this.setState({search})}
                            style={{width: '100%', fontSize: 17, color: 'white'}} placeholder="Search" placeholderTextColor="lightgray" 
                            returnKeyType={"search"} 
                            onSubmitEditing={() => this.onSearch()} 
                            blurOnSubmit={false}
                        />
                    </View>
                    <TouchableOpacity onPress={() => this.onSearch()}>
                        <Image source={ic_search} style={{width: 36, height: 36}} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={{flex: 1, width: '100%'}} scrollsToTop={false} >
                {
                    this.state.contacts.map((contact, index) => (
                        <TouchableOpacity key={index} onPress={() => this.goChatRoom(contact.userId)}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', width: 65, height: 65}}>
                                {
                                    contact.avatar === '' ? (
                                        <Avatar 
                                            firstName={contact.firstName}
                                            lastName={contact.lastName}
                                            size={45}
                                            fsize={22}
                                        />
                                    ) : (
                                        <Image source={{uri: contact.avatar}} style={{width: 45, height: 45, borderColor: 'gray', borderRadius: 23}} />
                                    )
                                }
                                </View>
                                <View style={{flex: 1}}>
                                    <View style={{paddingVertical: 19}}>
                                        <View style={{flex: 1}}>
                                            <Text style={{fontSize: 18, color: 'black'}}>{contact.fullName}</Text>
                                        </View>
                                    </View>
                                    <View style={{width: '100%', height: 1, backgroundColor: 'lightgray'}}></View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchContactScreen)