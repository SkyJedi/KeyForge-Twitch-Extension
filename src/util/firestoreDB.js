import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
	apiKey: process.env.apiKey,
	authDomain: process.env.authDomain,
	databaseURL: process.env.databaseURL,
	projectId: process.env.projectId,
	storageBucket: process.env.storageBucket,
	messagingSenderId: process.env.messagingSenderId
};
firebase.initializeApp(config);
const firestore = firebase.firestore();
firestore.enablePersistence({experimentalTabSynchronization: true}).catch(console.error);

export const db = firebase.firestore();


