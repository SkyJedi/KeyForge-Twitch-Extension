import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setProps, load} from '../redux/actions';
import {Viewer, Streamer} from './index';

class App extends React.Component {
	//if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
	twitch = window.Twitch ? window.Twitch.ext : true;
	state = {isVisible: true, isAuth: true};

	//changes the theme from light to dark
	contextUpdate = (context, delta) => {
		if (delta.includes('theme')) {
			this.props.setProps({theme: context.theme});
		}
	};

	componentDidMount() {
		if (this.twitch) {
			//Authorize the user
			this.twitch.onAuthorized(auth => {
				const token = auth.token, channel = auth.channelId;
				this.props.setProps({token, channel});
				this.setState({isAuth: token});
				this.props.load('decks', channel);
			});

			//hide extension when user changes visibility
			this.twitch.onVisibilityChanged((isVisible) => this.setState({isVisible}));

			//function to detect onContext changes, including theme changes
			this.twitch.onContext((context, delta) => this.contextUpdate(context, delta));
		}

	}

	componentWillUnmount() {
		if (this.twitch) {
			this.twitch.unlisten('broadcast', () => console.log('successfully unlistened'))
		}
	};

	render() {
		const {isAuth, isVisible} = this.state;
		const {type} = this.props;

		//show empty <div>when invisible
		if (!isVisible) return <div/>;

		//show loading when user is being authenticated
		if (!isAuth) return <div>Loading...</div>;

		switch (type) {
			case 'config':
			case 'live_config':
				return <Streamer type={type}/>;
			case 'panel':
			case 'mobile':
			case 'video_component':
			case 'video_overlay':
				return <Viewer type={type}/>
		}
	}
}

const mapStateToProps = state => {
	return {
		decks: state.decks,
		theme: state.theme,
		token: state.token,
	};
};

const matchDispatchToProps = dispatch => bindActionCreators({setProps, load}, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(App);