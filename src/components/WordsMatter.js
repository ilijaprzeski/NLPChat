import React, { Component } from 'react'
import { View, Image } from 'react-native'
import ic_stop from '../assets/ic_stop.png'
import ic_class from '../assets/ic_class.png'
import ic_disability from '../assets/ic_disability.png'
import ic_ethnicity from '../assets/ic_ethnicity.png'
import ic_gender from '../assets/ic_gender.png'
import ic_nationality from '../assets/ic_nationality.png'
import ic_sexual_orientation from '../assets/ic_sexual_orientation.png'
import ic_religion from '../assets/ic_religion.png'

const marks = {
    stop: { image: ic_stop, width: 100, height: 100, desc: '' },
    class: { image: ic_class, width: 158, height: 106, desc: '' },
    disability: { image: ic_disability, width: 126, height: 144, desc: '' },
    ethnicity: { image: ic_ethnicity, width: 150, height: 146, desc: '' },
    gender: { image: ic_gender, width: 108, height: 159, desc: '' },
    nationality: { image: ic_nationality, width: 120, height: 120, desc: '' },
    sexual_orientation: { image: ic_sexual_orientation, width: 145, height: 142, desc: '' },
    religion: { image: ic_religion, width: 123, height: 147, desc: '' }
}

class WordsMatter extends Component {
    render() {

        const mark = marks[this.props.type]
        if (mark) {
            return (
                <Image source={mark.image} style={{width: this.props.width, height: mark.height * this.props.width / mark.width, marginHorizontal: this.props.marginH}} />
            )
        } else {
            return (
                <View style={{backgroundColor: 'gray', borderRadius: this.props.width / 2, width: this.props.width, height: this.props.width, marginHorizontal: this.props.marginH}} />
            )
        }
    }
}

export default WordsMatter