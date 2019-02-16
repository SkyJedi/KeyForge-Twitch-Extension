import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import allReducers from './redux/reducers';
import {App} from './components/index';

export const store = createStore(allReducers, {}, applyMiddleware(thunk));

ReactDOM.render(
	<Provider store={store}>
		<App type='live_config'/>
	</Provider>,
	document.getElementById('root')
);
