import React from 'react';
import {connect} from 'react-redux';
import {ListGroup, ListGroupItem} from 'reactstrap';
import {DeckListItem} from './index';

class DeckList extends React.Component {
	render() {
		const {theme, decks, type} = this.props;

		if (0 >= Object.keys(decks).length) return <div className='text-center font-weight-bold'>No Archons to Display</div>;

		return (
			<ListGroup className={`type`}>
				<ListGroupItem color={theme} className='text-center font-weight-bold p-1'>OUR KEYFORGE ARCHONS</ListGroupItem>
				{Object.keys(decks).map(key => <DeckListItem data={decks[key]} type={type} key={key}/>)}
			</ListGroup>
		);
	}
}

const mapStateToProps = state => {
	return {
		decks: state.decks,
		theme: state.theme,
	};
};

export default connect(mapStateToProps)(DeckList);
