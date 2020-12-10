import { Alert } from 'react-native'

export const fiksalAlert = (msg, okFunc, cancelable) => {
    Alert.alert(
        'Fiksal', msg,
        [
            { text: 'OK', onPress: () => okFunc && okFunc() },
        ],
        {cancelable: cancelable ? cancelable : false},
    )
}