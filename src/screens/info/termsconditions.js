import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import styles from './styles'
import ic_back from '../../assets/ic_back.png'

const terms = [
    {
        subTitle: "A. License Grant; Site Access; Disclaimer",
        content: [
            "Subject to the terms of this Agreement, we hereby grant, and you hereby accept, a limited, non-exclusive, non-transferable license to use the Site and the Content. You agree that you will not copy, modify, alter, revise, paraphrase, display, store, timeshare, sublicense, publish, transmit, sell, rent, lease or otherwise transfer or distribute the Site or the Content, or any portion thereof, or create derivative works thereof, except as specifically authorized herein. You further agree not to modify in any way, or delete, any warnings, notices, liability limitations, or other license provisions contained on the Site or in any Content. All information you provide to us through the Site must be current, accurate, and complete. If we at any time discover any error or omission in the information you provide to us, we may, at our option, terminate your right to access and use the Site.",
            "The Site is not a substitute for the professional judgement of an attorney, mediator or other professional. We do not give legal advice, nor do we provide legal services. You represent and warrant that you have all rights necessary to receive, use, transmit, and disclose all data that you use in any way with the Site, and you acknowledge that your reliance upon the Site and any Content is solely at your own risk."
        ]
    }, {
        subTitle: "B. User Fees",
        content: [
            "Your use of the Site is subject to your payment of a subscription fee. You may elect to pay a one year subscription fee of $99.00 or a two year subscription for $179.00. We will charge your credit card for the subscription fee immediately. You have thirty (30) days from the date of purchase to receive a full refund, no partial refunds will be granted after the initial 30 days have passed. Upon expiration of your subscription, you will receive two (2) grace logins to allow access pending your renewal. Thereafter, a renewal payment is required before further access to the site is granted."
        ]
    }, {
        subTitle: "C. Use and Ownership of Intellectual Property",
        content: [
            "The Site consists of copyrighted works proprietary to us or to third parties who have provided us with Content. You may download and print copies of the Content solely for your personal, non-commercial use. Any material you download or print (excluding information provided by you) may not be altered in any way, and must respect all copyright and proprietary rights and notices wherever contained in the Content. ANY UNAUTHORIZED OR UNAPPROVED USE OF THE SITE OR THE CONTENT CONSTITUTES COPYRIGHT INFRINGEMENT AND SUBJECTS YOU TO ALL CIVIL AND CRIMINAL PENALTIES PROVIDED FOR UNDER PATENT, COPYRIGHT AND OTHER APPLICABLE LAWS AND REGULATIONS.",
            "You agree that we and our third-party Content providers own all worldwide right, title and interest in and to the Site and the Content. All rights, regardless of whether they are expressly granted in this Agreement, are reserved to us. No other rights or licenses, whether express, implied, arising by estoppel, or otherwise are conveyed or intended by this Agreement."
        ]
    }, {
        subTitle: "D. Security",
        content: [
            "A password is required to access and use the site. You are solely responsible for (1) maintaining the strict confidentiality of the password assigned to you, (2) instructing any individual to whom you disclose your password not to allow another person to use your password to access the Site without your express permission, (3) any charges, damages, or losses that may be incurred or suffered as a result of your failure, or the failure of any individual using your password, to maintain the strict confidentiality of the password, and (4) promptly informing us in writing of any need to deactivate a password due to security concerns. We are not liable for any harm related to authorization, disclosure or theft of your password. You agree to immediately notify us of any unauthorized use of your password. You will be liable for any use of the Site through your password. Additionally, you are liable for any unauthorized use of the Site until you notify us of any security breach."
        ]
    }, {
        subTitle: "E. Feedback",
        content: [
            "You agree to reasonably cooperate with us in providing any comments and other feedback with respect to use of the Site, Content or any component thereof. By submitting information to us, you grant to us and our affiliates a royalty-free, perpetual, irrevocable, non-exclusive, worldwide license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, perform and display such information, subject to applicable laws and regulations, the terms of this Agreement, and our Privacy Policy."
        ]
    }, {
        subTitle: "F. Confidential Personal Information",
        content: [
            "The Site enables you to transmit, store, and receive confidential personal information regarding you, your family or other persons. This includes children under the age of 13. You represent and warrant that you will, at all times during the term of this Agreement and thereafter, comply with all laws directly or indirectly applicable to you that may now or hereafter govern the gathering, use, transmission, processing, receipt, reporting, disclosure, maintenance, and storage of the confidential personal information. You further represent and warrant that you will use your best efforts to cause all persons or entities under your direction or control to comply with such laws. You are, at all times during the term of this Agreement and thereafter, solely responsible for obtaining and maintaining all legally necessary consents or permissions, required or advisable, to disclose, process, retrieve, transmit, and view the confidential personal information you transmit, store, or receive in connection with the Site. You agree that we, our licensors, and all other persons or entities involved in the operation of the Site, have the right to monitor, retrieve, store and use confidential personal information in connection with the operation of the Site, and that we are acting on your behalf in transmitting confidential personal information. We agree to use commercially reasonable efforts to maintain the confidentiality of such information and prevent the disclosure of such information to third parties except in connection with the transmission, storage, retrieval, and disclosure of such information on your behalf and as may be required or permitted by law. WE CANNOT AND DO NOT ASSUME ANY RESPONSIBILITY FOR YOUR USE OR MISUSE OF CONFIDENTIAL PERSONAL INFORMATION OR OTHER INFORMATION TRANSMITTED, MONITORED, STORED OR RECEIVED WHILE USING THE SITE OR ANY SERVICES OFFERED THEREON."
        ]
    }, {
        subTitle: "G. Warranty Disclaimers",
        content: [
            "THE SITE IS PROVIDED TO YOU ON AN “AS IS, WITH ALL FAULTS” BASIS, AND YOUR USE IS AT YOUR OWN RISK. WE MAKE NO WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT AND ANY WARRANTIES ARISING BY COURSE OF DEALING, CUSTOM OR TRADE. WE MAKE NO REPRESENTATION OR WARRANTY THAT ANY CONTENT IS ACCURATE, COMPLETE, APPROPRIATE, RELIABLE, OR TIMELY. WE ALSO MAKE NO REPRESENTATIONS OR WARRANTIES THAT YOUR ACCESS TO AND USE OF THE SITE (1) WILL BE UNINTERRUPTED OR ERROR-FREE, (2) IS FREE OF VIRUSES, UNAUTHORIZED CODES, OR OTHER HARMFUL COMPONENTS, OR (3) IS SECURE. YOU ARE RESPONSIBLE FOR TAKING ALL PRECAUTIONS YOU BELIEVE NECESSARY OR ADVISABLE TO PROTECT YOURSELF AGAINST ANY CLAIM, DAMAGE, LOSS OR HAZARD THAT MAY ARISE BY VIRTUE OF YOUR USE OF THE SITE."
        ]
    }, {
        subTitle: "H. Limitation of Liability",
        content: [
            "UNDER NO CIRCUMSTANCES WILL WE, OR ANY OF OUR PROVIDERS BE RESPONSIBLE OR LIABLE TO YOU OR ANY OTHER INDIVIDUAL OR ENTITY FOR ANY DIRECT, COMPENSATORY, INDIRECT, INCIDENTAL, CONSEQUENTIAL (INCLUDING LOST PROFITS AND LOST BUSINESS OPPORTUNITIES), SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES THAT RESULT FROM OR RELATE IN ANY MANNER WHATSOEVER TO (1) USE OF THE SITE OR ANY SERVICES OFFERED THEREON, (2) RELIANCE ON THE CONTENT BY YOU OR ANYONE USING YOUR PASSWORD, OR (3) ERRORS, INACCURACIES, OMISSIONS, DEFECTS, UNTIMELINESS, SECURITY BREACHES, OR ANY OTHER FAILURE TO PERFORM BY US OR OUR CONTENT PROVIDERS. THE FOREGOING EXCLUSION SHALL APPLY REGARDLESS OF WHETHER WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
            "IF, NOTWITHSTANDING THE TERMS OF THIS AGREEMENT, WE SHOULD HAVE ANY LIABILITY TO YOU OR ANY THIRD PARTY FOR ANY LOSS, HARM OR DAMAGE, YOU AND WE AGREE THAT SUCH LIABILITY SHALL UNDER NO CIRCUMSTANCES EXCEED THE LESSER OF $1,000 OR THE FEES YOU PAID TO US DURING THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE DAY THE ACT OR OMISSION OCCURRED WHICH GAVE RISE TO YOUR CLAIM. YOU AND WE AGREE THAT THE FOREGOING LIMITATION OF LIABILITY IS AN AGREED UPON ALLOCATION OF RISK BETWEEN YOU AND US WHICH CONSIDERS THE FEES, IF ANY, WE CHARGE YOU TO USE THE SITE. YOU ACKNOWLEDGE THAT ABSENT YOUR AGREEMENT TO THIS LIMITATION OF LIABILITY, WE WOULD NOT PROVIDE THE SITE TO YOU."
        ]
    }, {
        subTitle: "I. Indemnity",
        content: [
            "You agree to defend, indemnify and hold us harmless from any claims, losses, expenses, costs or damages (including reasonable attorneys’ fees, expert fees; and other costs of litigation) arising from, incurred as a result of, or in any manner related to (1) your breach of the terms of this Agreement, (2) use of the Site and any services offered thereon by you or any other person using your password, and (3) the unauthorized or unlawful use of the Site by you or any other person using your password."
        ]
    }, {
        subTitle: "J. Termination of Agreement",
        content: [
            "Your right to access and use the Site immediately terminates without further notice upon your breach of this Agreement. We may terminate this Agreement and/or your right to use the Site at any time, with or without cause. Paragraphs A, F, G, H, I and J of this Agreement survive the expiration or termination of this Agreement for any reason whatsoever. We reserve the right to discontinue or make changes to the Site at any time."
        ]
    }, {
        subTitle: "K. Assignment/Waiver",
        content: [
            "We may assign this Agreement, in whole or in part, in our sole discretion. You may not assign your rights under this Agreement without our prior written permission. Any attempt by you to assign your rights under this Agreement without our permission shall be void. The waiver by us of a breach of any provision of this Agreement shall not operate or be construed as a waiver of any other or subsequent breach. If any provision of this Agreement is held by a court of competent jurisdiction to be contrary to law, the remaining provisions of this Agreement shall remain in full force and effect. This Agreement is governed by the laws of the State of Minnesota without giving effect to any principles of conflicts of law."
        ]
    }, {
        subTitle: "L. Entire Agreement",
        content: [
            "This Agreement contains the entire agreement between you and us relating to the subject matter hereof, and supersedes any other oral or written communications relating thereto. You agree that you have not relied on any other verbal or written statements, actions or representations by us, our employees, or agents in consenting to the terms of this Agreement. This Agreement may not be amended or supplemented by any document originated by you relating to the subject matter hereof, or any statements of any of our employees and agents. We reserve the right to make changes to this Agreement at any time without advance notice. We agree to put any amended forms of this Agreement on the Site. You must read and assent to the most current form of this Agreement before using the Site to ensure that you agree to the terms and conditions of any amendments made to this Agreement.",
            "Fiksal is a Utah Limited Liability Corporation, 847 S. 300 W. Orem, UT 84058. Fiksal’s Data Protection Officer (DPO) is Carl Seaver.",
            "If you have any questions, contact customer support or the DPO."
        ]
    }
]

class SocialLinkScreen extends Component {
    render(){
        return (
            <View style={styles.container}>
                <View style={{paddingHorizontal: 15, height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={ic_back} style={{width: 42, height: 37}} />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
                        <Text style={{color: 'white', fontSize: 24}}>Terms and Conditions</Text>
                    </View>
                </View>
                <ScrollView style={{width: '100%', flex: 1}}>
                    <View style={{paddingVertical: 20, paddingHorizontal: 10}}>
                    {
                        
                        terms.map((item, index) => (
                            <View style={{width: '100%'}} key={index}>
                                <Text  style={styles.titleText}>{item.subTitle}</Text>
                                {
                                    item.content.map((subItem, i) => (
                                        <Text key={i}  style={styles.contentText}>{subItem}</Text>
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

export default SocialLinkScreen