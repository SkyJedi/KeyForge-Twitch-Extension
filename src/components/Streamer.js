import 'babel-polyfill';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {get} from 'lodash-es';
import React from 'react';
import {setProps} from '../redux/actions';
import {fetchDeck} from '../util/fetch';
import {db} from '../util/firestoreDB';
import {ListGroup, ListGroupItem, InputGroup, InputGroupAddon, Input, Button, Row, Col} from 'reactstrap';
import {DeleteButton} from './fragments/index';

class Streamer extends React.Component {

	state = {archonName: ''};

	saveArchon = async (event) => {
		event.preventDefault();
		const {token, channel} = this.props,
			search = this.state.archonName,
			channelRef = db.collection(`${channel}`);
		this.setState({archonName: 'Updating...'});
		const deck = await fetchDeck(search);
		if (deck) {
			channelRef.add({...deck, user: token}).catch(console.error);
			this.setState({archonName: ''})
		}
		else this.setState({archonName: 'Error, deck not found'});
	};

	handleDelete = event => {
		db.doc(`${this.props.channel}/${event.target.name}/`).delete().catch(console.error);
		event.preventDefault();
	};

	render() {
		const {decks, theme} = this.props;
		const {archonName} = this.state;
		return <React.Fragment>
			<ListGroup>
				<ListGroupItem color={theme} className='text-center p-1 text-capitalize'>Archons</ListGroupItem>
				{Object.keys(decks).map(key =>
					<ListGroupItem className='listText p-1' color={theme} key={key}>
						<Row className='justify-content-between align-items-center'>
							<Col>
								{get(decks, `${key}.deck.name`, '')}
							</Col>
							<Col xs='auto'>
								<DeleteButton name={key} onClick={this.handleDelete}/>
							</Col>
						</Row>
					</ListGroupItem>
				)}
			</ListGroup>
			<br/>
			<InputGroup>
				<Input placeholder='Archon Name' name='archonName'
					   value={archonName} onChange={(event) => this.setState({archonName: event.target.value})}/>
				<InputGroupAddon addonType="append">
					<Button onClick={(event) => this.saveArchon(event)}>Add</Button>
				</InputGroupAddon>
			</InputGroup>
		</React.Fragment>
	}
}

const mapStateToProps = state => {
	return {
		decks: state.decks,
		theme: state.theme,
		token: state.token,
		channel: state.channel
	};
};

const matchDispatchToProps = dispatch => bindActionCreators({setProps}, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(Streamer);