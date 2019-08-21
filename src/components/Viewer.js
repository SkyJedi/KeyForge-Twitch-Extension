import React from 'react';
import {connect} from 'react-redux';
import {DeckList} from './fragments/index';

class Viewer extends React.Component {

	render() {
		const {theme, decks, type} = this.props;
		return (
			<div className={`App App-${theme} ${type} ${theme === 'dark' ? 'text-light' : 'text-dark'} bg-transparent`}>
				<DeckList type={type} decks={decks}/>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		decks: state.decks,
		theme: state.theme,
	};
};

export default connect(mapStateToProps)(Viewer);
