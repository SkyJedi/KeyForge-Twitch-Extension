import React from 'react';
import Authentication from '../../util/Authentication/Authentication';

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
			deck1: '',
			deck2: ''
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
			this.twitch.onAuthorized(auth => {
				this.Authentication.setToken(auth.token, auth.userId);
				if (!this.state.finishedLoading) {
					// if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

					// now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
					this.setState({finishedLoading: true});
				}
			});

			this.twitch.listen('broadcast', (target, contentType, body) => {
				const data = JSON.parse(body);
				this.setState(data);
				this.twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
			});

			this.twitch.onVisibilityChanged((isVisible) => {
				this.visibilityChanged(isVisible)
			});

			this.twitch.onContext((context, delta) => {
				this.contextUpdate(context, delta)
			});

			this.twitch.configuration.onChanged(() => {
				const config = this.twitch.configuration.broadcaster;
				const data = JSON.parse(config.content);
				this.setState(data);
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
						<p>{this.state.deck1}</p>
						<p>{this.state.deck2}</p>
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