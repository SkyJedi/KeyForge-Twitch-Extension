import React from 'react';
import Authentication from '../../util/Authentication/Authentication';
import DeckCard from './DeckCard';
import './App.css'

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.Authentication = new Authentication();
		//if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
		this.twitch = window.Twitch ? window.Twitch.ext : null;
		this.state = {
			finishedLoading: false,
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

	componentWillMount() {
		if (this.twitch) {
			this.twitch.onAuthorized(auth => {
				this.Authentication.setToken(auth.token, auth.userId);
				if (!this.state.finishedLoading) this.setState({finishedLoading: true});
			});

			this.twitch.listen('broadcast', (target, contentType, body) => {
				const data = JSON.parse(body);
				this.setState({data});
			});

			this.twitch.onVisibilityChanged((isVisible) => this.visibilityChanged(isVisible));

			this.twitch.onContext((context, delta) => this.contextUpdate(context, delta));

			this.twitch.configuration.onChanged(() => {
				const config = this.twitch.configuration.broadcaster;
				const data = JSON.parse(config.content);
				this.setState({data});
			})
		}
	}

	componentWillUnmount() {
		if (this.twitch) {
			this.twitch.unlisten('broadcast', () => console.log('successfully unlistened'))
		}
	}

	render() {
		if (this.state.finishedLoading && this.state.isVisible) {
			return (
				<div className="App">
					<div className={this.state.theme === 'light' ? 'App-light' : 'App-dark'}>
						<DeckCard data={this.state.data}/>
					</div>
				</div>
			)
		} else {
			return (
				<div className="App">
				</div>
			)
		}

	}
}