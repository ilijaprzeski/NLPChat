import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import styles from './styles'
import ic_back from '../../assets/ic_back.png'

const teamUsers = [
    {
        name: "Krista Andersen",
        role: "Co-Owner",
        description: [
            "Krista has a passion for mediation.  Her education began with a Bachelor’s of Science from Utah Valley University in Business Management.  Next she obtained a Master’s of Sciences from Creighton University in Negotiation and Conflict Resolution.  Currenly she is a Doctor of Education Candidate at Creighton University.",
            "Her focus has not only been on education and research.  Krista is a Certified Mediator with experience in business, elder care, property, and civil mediation.  She is also a Certified Domestic Mediatior with experience with family and domestic issues.  Krista has 20 years experience with co-parent coaching and communication.",
            "Krista’s experience has taken her through many disciplines.  She was formerly a Registered Investment Advisor and managed client money, handled investments, retirement planning, and insurance.  She also has experience in business and marketing consulting and in healthcare administration and management engineering (through Intermountain Health Care).",
            "Krista lives in Orem, Utah with her husband Scott.  They are a blended family with 8 children."
        ]
    }, {
        name: "Carl Seaver",
        role: "Co-Owner",
        description: [
            "Carl is currently a Product Manager with Lenovo Software. Prior Carl served as CEO of Controlpad and focused on bring an already successful company to the next level.",
            "Carl is well acquainted with Lenovo Software where, prior to his role as CEO of Controlpad, he served as CTO and a cofounder of Lenovo Software, formerly Stoneware Inc., where he was committed to meeting customer needs in today’s evolving world. With over 30 years of research, product development, consulting, and strategy experience, he worked to understand clients’ current and future business challenges while envisioning emerging technology solutions.",
            "During his tenure with Stoneware, Inc. Carl held positions in support, consulting, and product management. In 2012, he assumed the CTO role where he focuses on ensuring Lenovo Software’s diverse portfolio of products create happier, more productive users while improving business and classroom efficiency.",
            "Carl’s career in IT began with DHI Computing, a mainframe service bureau, as the Operations and Change Control Manager, a developer, and a computer operator. He then spent 11 years with Novell, first as a developer and finally as the Director of Consulting for the Northeastern US and previously, occupied the role of Director of Asia/Pacific Consulting based in Sydney, Australia.",
            "Carl lives in Orem, Utah with his wife Karry.  They have 4 children and lots of grandchildren spread across the United States. "
        ]
    }
]

const visions = [
    "FIKSAL, LLC is a startup software company that aims to pioneer conflict management by targeting electronic communications as a method to help users engage in conflict in healthy and productive ways. The target market for FIKSAL includes any person or organization that uses any form of electronic communication (e-mail, text, instant messaging). FIKSAL will transform the way that people communicate.",
    "Filtering electronic communications to eliminate inflammatory or derogatory language has the capacity to reduce conflict, improve relationships, and mitigate legal trouble. Using software that identifies and removes words, phrases, and language that are likely to offend, parties to a communication may send emails that build bridges, rather than tear them down. Upon identifying negative language from electronic correspondence, the sender will receive a listing of the removed language, along with an explanation of why it was removed. Using this as an educational tool, the sender can learn how to communicate more effectively in future correspondence."
]

class AboutUsScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={{paddingHorizontal: 15, height: 75, alignItems: 'center', backgroundColor: '#1a4b9a', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={ic_back} style={{width: 42, height: 37}} />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
                        <Text style={{color: 'white', fontSize: 24}}>About us</Text>
                    </View>
                </View>
                <ScrollView style={{flex: 1, width: '100%'}}>
                    <View style={{paddingVertical: 20, paddingHorizontal: 10}}>
                        <View style={{width: '100%'}}>
                            <Text style={styles.titleText}>OUR TEAM</Text>
                            <Text style={styles.contentText}>Fiksal, LLC is based out of Orem, Utah.</Text>
                            {
                                teamUsers.map((user, index) => (
                                    <View key={index}>
                                        <Text style={styles.titleText}>{user.name + ", " + user.role}</Text>
                                        {
                                            user.description.map((desc, i) => (
                                                <Text style={styles.contentText} key={i}>{desc}</Text>
                                            ))
                                        }
                                    </View>
                                ))
                            }
                        </View>
                        <View style={{width: '100%'}}>
                            <Text style={styles.titleText}>OUR VISION</Text>
                            {
                                visions.map((item, ii) => (
                                    <Text key={ii} style={styles.contentText}>{item}</Text>
                                ))
                            }
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default AboutUsScreen