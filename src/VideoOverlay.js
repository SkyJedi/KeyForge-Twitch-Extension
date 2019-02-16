import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {App} from './components/index';
import allReducers from './redux/reducers';

export const store = createStore(allReducers, {}, applyMiddleware(thunk));

ReactDOM.render(
	<Provider store={store}>
		<App style={{textAlign: 'right'}} type='video_overlay'/>
	</Provider>,
	document.getElementById('root')
);
