import firebase from 'react-native-firebase'

export const searchVocabulary = (search) => {
    return new Promise((resolve, reject) => {
        firebase.database().ref('vocabularies').orderByChild('term').startAt(search).endAt(search + "\uf8ff").once('value', async snapshot => {
            if (snapshot.exists()) {
                var res = []
                await snapshot.forEach(snap => {
                    const w = snap.val();
                    if (w.hateful_meaning)
                        res.push(w)
                })

                res.sort((a, b) => {
                    if(a.term > b.term) return 1;
                    return -1;
                });

                resolve(res);
            } else {
                resolve(null)
            }
        });
    });
};

export const getFullVocabulary = (word) => {
    return new Promise((resolve, reject) => {
        if (word.vocabulary.average_offensiveness) {
            console.log('WWW-there is no need1.')
            resolve(word)
        } else if (!word.vocabulary.average_offensiveness && !word.vocabulary.plural_of) {
            console.log(`WWW-there is no need2, ${word.vocabulary.plural_of}, ${word.vocabulary.term}`)
            resolve(word)
        } else {
            firebase.database().ref(`vocabularies/${word.vocabulary.plural_of}`).once('value', snapshot => {
                if (snapshot.exists()){
                    const sword = snapshot.val();
                    console.log('WWW-word-full', word)
                    word.vocabulary.average_offensiveness = sword.average_offensiveness
                    resolve(word)
                } else {
                    resolve(word)
                }
            })
        }
    })
}

export const getVocabulary = (word) => {
    return new Promise((resolve, reject) => {
        firebase.database().ref('vocabularies/' + word).once('value', async snapshot => {
            if (snapshot.exists()) {
                resolve(snapshot.val())
            } else {
                resolve(null)
            }
        });
    });
}

const getVocabulary1 = (keyword) => {
    return new Promise((resolve, reject) => {
        firebase.database().ref('vocabularies').orderByChild('term').startAt(keyword).endAt(keyword + '\uf8ff').once('value', async snapshot=> {
            if(snapshot.exists()) {
                var res = [];
                await snapshot.forEach(snap => {
                    const item = snap.val();
                    res.push(item);
                });
                resolve(res);
            } else {
                resolve([]);
            }
        });
    });
}

export const checkMessagetoHatebase = async message => {
    const lmessage = message.toLowerCase();
    return new Promise(async (resolve, reject) => {

        const onlyUnique = (value, index, self) => {
            return self.indexOf(value) === index;
        }

        const notContain = (word) => {
            return (word.indexOf('.') >= 0 || word.indexOf('#') >= 0 || word.indexOf('$') >= 0 || word.indexOf('[') >= 0 || word.indexOf(']') >= 0)
        }

        try {
            let words = message.match(/\w+|\s+|[^\s\w]+/g);
            let lwords = lmessage.match(/\w+|\s+|[^\s\w]+/g);
            if (!words) words = [];
            if (!lwords) lwords = [];
            words = words.concat(lwords);
            words = words.filter(onlyUnique);

            let realWords = [];
            words.forEach(word => {
                if (word.trim() !== '' && !notContain(word) && word.length > 1) {
                    realWords.push(word.trim());
                }
            });

            var availiableWords = [];
            Promise.all(
                realWords.map(item => getVocabulary1(item))
            ).then(res => {
                res.forEach(iRes => {
                    availiableWords = availiableWords.concat(iRes)
                })

                var patterns = [];
                availiableWords.forEach(word => {
                    const lterm = word.term.toLowerCase()
                    var regex = new RegExp(lterm, "gi");
                    while (match = regex.exec(lmessage)) {
                        patterns.push({
                            pos: match.index,
                            vocabulary: word
                        });
                    }
                })

                patterns.sort((a, b) => {
                    if (a.pos > b.pos) return 1;
                    else if (a.pos === b.pos) {
                        if (a.vocabulary.term.length > b.vocabulary.term.length)    return 1;
                        else    return -1;
                    } else return -1;
                });

                var i = 0;
                while(i < patterns.length - 1) {
                    if (patterns[i].pos === patterns[i + 1].pos) {
                        patterns.splice(i, 1);
                    } else {
                        i = i + 1;
                    }
                }

                Promise.all(
                    patterns.map(item => getFullVocabulary(item))
                ).then(res => {
                    resolve(res)
                })
            });
        } catch (error) {
            reject(error);
        }
    });
}
