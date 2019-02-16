import {toUpper} from 'lodash-es';
import {db} from '../util/firestoreDB';

export const setProps = (data) => {
	return (dispatch) => {
		Object.entries(data).forEach(([key, value]) => {
			dispatch({type: `${key}_CHANGED`, payload: value});
		});
	}
};

export const load = (type, channel) => {
	return dispatch => {
		db.collection(channel).onSnapshot(querySnapshot => {
			querySnapshot.docChanges().forEach(change => {
				switch (change.type) {
					case 'added':
					case 'modified':
						dispatch({type: `${type}_${toUpper(change.type)}`, payload: {...change.doc.data(), id: change.doc.id}});
						break;
					case 'removed':
						dispatch({type: `${type}_REMOVED`, payload: change.doc.id});
						break;
					default:
						break;
				}
			});
		}, console.error);

	};
};
