import React from 'react';
import Authentication from '../../util/Authentication/Authentication';
import './LiveConfigPage.css'

export default class LiveConfigPage extends React.Component {
	constructor(props) {
		super(props);
		this.Authentication = new Authentication();

		//if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
		this.twitch = window.Twitch ? window.Twitch.ext : null;
		this.state = {
			finishedLoading: false,
			theme: 'light',
			deck1: '',
			deck2: '',
		}
	}

	contextUpdate(context, delta) {
		if (delta.includes('theme')) {
			this.setState({theme: context.theme})
		}
	}

	componentDidMount() {
		// do config page setup as needed here
		if (this.twitch) {
			this.twitch.onAuthorized(auth => {
				this.Authentication.setToken(auth.token, auth.userId);
				if (!this.state.finishedLoading) {
					this.setState({finishedLoading: true})
				}
			});

			this.twitch.onContext((context, delta) => {
				this.contextUpdate(context, delta)
			});

			this.twitch.configuration.onChanged(() => {
				const config = this.twitch.configuration.broadcaster;
				const data = JSON.parse(config.content);
				console.log(data);
				this.setState({deck1: data.deck1, deck2: data.deck2});
			})
		}
	}

	saveConfig(event) {
		event.preventDefault();
		const data = {deck1: this.state.deck1, deck2: this.state.deck2};
		this.twitch.configuration.set('broadcaster', '', JSON.stringify(data));
		this.twitch.send('broadcast', 'application/json', data)
	}

	componentWillUnmount() {
		if (this.twitch) {
			this.twitch.unlisten('broadcast', () => console.log('successfully unlistened'))
		}
	}

	render() {
		if (this.state.finishedLoading) {
			return (
				<div className="LiveConfigPage">
					<div className={this.state.theme === 'light' ? 'LiveConfigPage-light' : 'LiveConfigPage-dark'}>
						<form onSubmit={(e) => this.saveConfig(e)}>
							<fieldset>
								<legend>Add decks</legend>
								<div>
									<label htmlFor="deck1">Deck 1</label>

									<input type='text' name='deck1' value={this.state.deck1}
										   onChange={(event) => this.setState({deck1: event.target.value})}/>
								</div>
								<div>
									<label htmlFor="deck2">Deck 2</label>
									<input type='text' name='deck2' value={this.state.deck2}
										   onChange={(event) => this.setState({deck2: event.target.value})}/>
								</div>
							</fieldset>
							<input type="submit" value="Save"/>
						</form>
					</div>
				</div>
			)
		} else {
			return (
				<div className="LiveConfigPage">
				</div>
			)
		}

	}
}