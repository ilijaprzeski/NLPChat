import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import styles from './styles'
import ic_back from '../../assets/ic_back.png'

const privacyPolicy = [
    {
        subTitle: "What this Privacy Policy Covers",
        content: [
            "This Privacy Policy covers Fiksal’s treatment of the personally identifiable information Fiksal collects when you use the Fiksal website. This policy also covers Fiksal’s treatment of any personally identifiable information that Fiksal’s business partners share with Fiksal.",
            "This policy does not apply to the practices of companies that Fiksal does not own or control, or to people that Fiksal does not employ or manage."
        ]
    }, {
        subTitle: "Information Collection and Use",
        content: [
            "The Fiksal website collects personally identifiable information when you register for a website account, when you use certain website products or services, when you visit website pages, and when you enter promotions or sweepstakes.",
            "The Fiksal website is designed to facilitate the management of your family’s life through features which include but are not limited to Calendaring and the management of information such as Addresses, Babysitters, Child Care Providers, Doctors, Activities, Emergency Contacts, Religious Information, Health Details, Immunizations, School Information, Vital Statistics, and Financial Information. While the information within these classifications may be required for the use of specific services or features of the website, you are not required to use all of the services and features. Once you register with the Fiksal website and register for our services, you are not anonymous to us.",
            "The Fiksal website also receives and records information on our server logs from your browser including your IP address, Fiksal cookie information and the page you requested.",
            "The Fiksal website uses information to customize the content you see, to fulfill your requests for certain products and services, to provide electronic notification services for events in your calendar and to provide billing information to the Fiksal Accounts Receivable department."
        ]
    }, {
        subTitle: "Information Sharing and Disclosure",
        content: [
            "The Fiksal website will not sell or rent your personally identifiable information to anyone.",
            "The Fiksal website will send personally identifiable information about you to other companies or people when (1) we have to respond to subpoenas, court orders or legal process, (2) we find that your actions on our web site violate the Fiksal website Terms of Use, (3) we have your consent to share the information, (4) we need to share your information to provide the product or service you have requested, or (5) we need to send the information to companies who work on behalf of Fiksal to provide a product or service to you. Unless we tell you differently, these companies do not have any right to use the identifiable information we provide to them beyond what is necessary or in conformance with your request."
        ]
    }, {
        subTitle: "Cookies",
        content: [
            "The Fiksal website may set and access Fiksal website cookies on your computer. The Fiksal website allows other companies that are presenting advertisements on some of our pages to set and access their cookies in your computer. Other companies’ use of cookies is subject to their own privacy policies, not this one. Advertisers and other companies do not have access to Fiksal website cookies."
        ]
    }, {
        subTitle: "Your Ability to Edit and Delete Your Account Information and Preferences",
        content: [
            "The Fiksal website gives you the ability to edit your Fiksal website account information and preferences at any time, including whether you want Fiksal to contact you about special promotions and new products."
        ]
    }, {
        subTitle: "Security",
        content: [
            "Your Fiksal website Account Information is password protected for your privacy and security.",
            "Because of the sensitivity of information stored on the Fiksal website, Fiksal uses not only industry standard SSL encryption to protect data transmissions, but also uses Transparent Data Encryption and Redaction to protect data during storage and access inside of our database."
        ]
    }, {
        subTitle: "Changes to this Privacy Policy",
        content: [
            "The Fiksal website may amend this policy from time to time. If we make any substantial changes in the way we use your personal information, we will notify you by posting a prominent announcement on our pages."
        ]
    }

]

class PrivacyPolicyScreen extends Component {
    render(){

        return (
            <View style={styles.container}>
                <View style={{paddingHorizontal: 15, height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={ic_back} style={{width: 42, height: 37}} />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
                        <Text style={{color: 'white', fontSize: 24}}>Privacy policy</Text>
                    </View>
                </View>
                <ScrollView style={{width: '100%', flex: 1}}>
                    <View style={{paddingVertical: 20, paddingHorizontal: 10}}>
                    {
                        privacyPolicy.map((item, index) => (
                            <View style={{width: '100%'}} key={index}>
                                <Text style={styles.titleText}>{item.subTitle}</Text>
                                {
                                    item.content.map((subItem, i) => (
                                        <Text key={i} style={styles.contentText}>{subItem}</Text>
                                    ))
                                }
                            </View>
                        ))
                    }
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default PrivacyPolicyScreen