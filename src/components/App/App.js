import {get} from 'lodash-es';
import React from 'react';
import DeckCard from './DeckCard';
import './App.css'

export default class App extends React.Component {
	constructor(props) {
		super(props);
		//if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
		this.twitch = window.Twitch ? window.Twitch.ext : null;
		this.state = {
			theme: 'light',
			isVisible: true,
			data: []
		}
	}

	contextUpdate(context, delta) {
		if (delta.includes('theme')) {
			this.setState({theme: context.theme})
		}
	}

	visibilityChanged(isVisible) {
		this.setState({isVisible})
	}

	componentDidMount() {
		if (this.twitch) {

			this.twitch.listen('broadcast', (target, contentType, body) => {
				const data = JSON.parse(body);
				this.setState({data});
			});

			this.twitch.onVisibilityChanged((isVisible) => this.visibilityChanged(isVisible));

			this.twitch.onContext((context, delta) => this.contextUpdate(context, delta));

			this.twitch.configuration.onChanged(() => {
				const content = get(this.twitch, 'configuration.broadcaster.content', '[]');
				const data = JSON.parse(content);
				this.setState({data});
			});
		} else console.log('Twitch helper not loading!');
	}

	componentWillUnmount() {
		if (this.twitch) {
			this.twitch.unlisten('broadcast', () => console.log('successfully unlistened'))
		}
	}

	render() {
		if (this.state.isVisible) {
			return (
				<div className="App" style={{zoom: `${this.props.type === 'component' ? 3 : 1}`}}>
					<div className={this.state.theme === 'light' ? 'App-light' : 'App-dark'}>
						<DeckCard type={this.props.type} data={this.state.data}/>
					</div>
				</div>
			)
		} else return <div className="App"/>
	}
}