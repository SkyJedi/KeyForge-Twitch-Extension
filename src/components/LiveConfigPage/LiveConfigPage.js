import 'babel-polyfill';
import {get} from 'lodash-es';
import React from 'react';
import {fetchDeck, fetchDeckADHD, fetchDoK} from '../../util/fetch';
import './LiveConfigPage.css';
import Authentication from '../../util/Authentication/Authentication'



export default class LiveConfigPage extends React.Component {
	constructor(props) {
		super(props);
		this.twitch = window.Twitch ? window.Twitch.ext : null;
		this.Authentication = new Authentication();
		this.state = {
			theme: 'light',
			isAuth: false
		}
	}

	contextUpdate(context, delta) {
		if (delta.includes('theme')) {
			this.setState({theme: context.theme})
		}
	}

	componentDidMount() {
		console.log(this.twitch);
		if (this.twitch) {
			console.log("calling stuff");
			this.twitch.onAuthorized(auth => {
				console.log(auth);
				this.Authentication.setToken(auth.token, auth.userId);
				this.setState({isAuth: true});
			});

			this.twitch.onContext((context, delta) => {
				this.contextUpdate(context, delta)
			});

			this.twitch.configuration.onChanged(() => {
				const content = get(this.twitch, 'configuration.broadcaster.content', '[]');
				const data = JSON.parse(content);
				data.forEach((deck, i) => this.setState({[+i]: get(deck, 'deck.name', '')}));
				this.twitch.send('broadcast', 'application/json', data);
			});

			this.twitch.onError((err) => console.error(err));
		} else console.log('Twitch helper not loading!');
	}

	async saveConfig(event) {
		event.preventDefault();
		this.getArchonList().forEach(i => this.setState({[+i]: 'updating...'}));
		const decks = await this.getArchonList().map(deck => fetchDeck(this.state[deck]));
		Promise.all(decks).then(decks => {
			console.log('All decks data fetched and will save now', decks);
			if (decks) {
				decks.forEach((data, i) => this.setState({[i]: get(data, 'deck.name', 'Error, deck not found')}));
				this.twitch.configuration.set('broadcaster', '', JSON.stringify(decks.filter(Boolean)));
				this.twitch.send('broadcast', 'application/json', decks.filter(Boolean));
			} else this.getArchonList().forEach(i => this.setState({[+i]: 'Error, deck not found'}));
		});

	}

	componentWillUnmount() {
		if (this.twitch) {
			this.twitch.unlisten('broadcast', () => console.log('successfully unlistened'))
		}
	}

	getArchonList() {
		return Object.keys(this.state).filter(name => name.match(/\d+/g) && this.state[name] !== undefined);
	}

	render() {
		if (!this.state.isAuth) return <div>Loading...</div>;
		return <div className="LiveConfigPage">
			<div className={this.state.theme === 'light' ? 'LiveConfigPage-light' : 'LiveConfigPage-dark'}>
				<form onSubmit={(e) => this.saveConfig(e)}>
					<fieldset>
						<legend>Display Archons</legend>
						{this.getArchonList().map(i =>
							<div key={+i}>
								<label htmlFor={+i}>Deck {+i + 1}&nbsp;</label>
								<input type='text' name={+i} value={this.state[+i]}
									   onChange={(event) => this.setState({[+i]: event.target.value})}/>
							</div>
						)}
					</fieldset>
					<br/>
					<input type="submit" value="Save"/>
				</form>
				<br/>
				<button onClick={() => this.setState({[this.getArchonList().length]: ''})}>Add Archon</button>
				<br/>
				<button onClick={() => this.setState({[this.getArchonList().length - 1]: undefined})}>Remove Archon</button>
			</div>
		</div>

	}
}