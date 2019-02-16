import {combineReducers} from 'redux';
import {get, omit} from 'lodash-es';

const loadingReducer = (type, state, action) => {
	if (action.type === `${type}_CHANGED`) return action.payload;
	return state;
};

export const dataObjects = (type, state, action) => {
	const id = get(action, 'payload.id');
	switch (action.type) {
		case`${type}_ADDED`:
		case `${type}_MODIFIED`:
			return {...state, [id]: action.payload};
		case`${type}_REMOVED`:
			return omit(state, action.payload);
		default:
			return state;
	}
};

const allReducers = combineReducers({
	channel: (state = null, action) => loadingReducer('channel', state, action),
	decks: (state = {}, action) => dataObjects('decks', state, action),
	theme: (state = 'light', action) => loadingReducer('theme', state, action),
	token: (state = null, action) => loadingReducer('token', state, action),
});

export default allReducers;
