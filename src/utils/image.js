import firebase from 'react-native-firebase'

export default uploadImage = (id, uri, filename, mime='application/octet-stream') => {
    return new Promise((resolve, reject) => {
        const imageRef = firebase.storage().ref().child('users/' + id + '/' + filename)

        imageRef.putFile(uri)
        .then(() => {
            return imageRef.getDownloadURL()
        })
        .then((url) => {
            resolve(url)
        })
        .catch((error) => {
            reject(error)
        })
    })
}