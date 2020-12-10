import firebase from 'react-native-firebase';
import axios from 'axios';

export const getPdfFileData = (userId, contactId, startDate, endDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await axios.post('https://us-central1-fiksal-7323b.cloudfunctions.net/downloadPDFOfChatMessages', {
                userId,
                contactId,
                startDate,
                endDate,
            });

            if (!res.data.success) {
                reject(res.data.error)
            } else {
                const pdfFileName = res.data.result;
                firebase.storage().ref('pdfs/' + pdfFileName).getDownloadURL().then(url => {
                    resolve({url, pdfFileName});
                }).catch(error => {
                    console.log('WWW-tmp1')
                    reject(error)
                })
            }
        } catch (error) {
            console.log('WWW-tmp2')
            reject(error);
        }
    });
};

export const sendEmailwithPDF = (userId, pdfUrl, filename) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await axios.post('https://us-central1-fiksal-7323b.cloudfunctions.net/sendMailWithPDFOfChatMessages', {
                userId,
                pdfUrl,
                filename,
            });

            if (!res.data.success) {
                reject(res.data.error);
            } else {
                resolve(true);
            }
        } catch (error) {
            reject(error);
        }
    })
}