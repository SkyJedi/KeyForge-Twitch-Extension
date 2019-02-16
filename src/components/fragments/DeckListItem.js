import React from 'react';
import {get, toLower} from 'lodash-es';
import {connect} from 'react-redux';
import * as images from '../../images/index';
import {ListGroupItem, Collapse} from 'reactstrap'

class DeckListItem extends React.Component {
	state = {isOpen: false};

	render() {
		const {data, theme, type} = this.props;
		const {isOpen} = this.state;

		if (0 >= data.length) return <div style={{textAlign: 'center'}}>No Archons to Display</div>;

		return <React.Fragment>
			<ListGroupItem tag='button' className='p-1 text-center font-weight-bold' action onClick={() => this.setState({isOpen: !isOpen})}
						   color={theme}>
				{get(data, 'deck.name', 'Deck Not Found')}
			</ListGroupItem>
			<Collapse isOpen={isOpen}>
				<React.Fragment>
					<ListGroupItem className='p-1' color={theme}>
						{get(data, 'deck._links.houses', [])
							.map(house => <img key={house} alt='' className='token' src={images[toLower(house)]}/>)}
						<b>&nbsp;•&nbsp;</b>
						{get(data, 'deck.power_level', 0)}<img alt='' className='token' src={images.power}/>
						<b>&nbsp;•&nbsp;</b>
						{get(data, 'deck.chains', 0)}<img alt='' className='token' src={images.chains}/>
						<b>&nbsp;•&nbsp;</b>
						{get(data, 'deck.wins', 0)}W/{get(data, 'deck.losses', 0)}L

					</ListGroupItem>
					<ListGroupItem className='p-1' color={theme}>
						{Object.keys(get(data, 'cardStats.rarity', [])).map(type =>
							<React.Fragment key={type}>
								{get(data, `cardStats.rarity[${type}]`, 0)}
								<img className='token' alt='' src={images[toLower(type)]}/><b>&nbsp;•&nbsp;</b>
							</React.Fragment>)}
						{get(data, 'cardStats.is_maverick', 0)}<img className='token' alt='' src={images.maverick}/>
					</ListGroupItem>
					<ListGroupItem className='p-1' color={theme}>
						{`${Object.keys(get(data, 'cardStats.card_type', {}))
							.map(type => `${type}: ${get(data, `cardStats.card_type[${type}]`)}`)
							.join(' • ')} • ${get(data, 'dok.SAS', 'SAS Not Found')}`
						}
					</ListGroupItem>
					<ListGroupItem className='p-1' color={theme}>
						{get(data, 'ADHD', 'ADHD Not Found')}
					</ListGroupItem>
					<ListGroupItem className='p-1' color={theme}>
						{get(data, 'dok.AERC', 'AERC Not Found')}
					</ListGroupItem>
					{type === 'panel' &&
					<ListGroupItem className='p-1' color={theme}>
						<a href={`https://www.keyforgegame.com/deck-details/${data.deck.id}?powered_by=KeyForgeEmporium`}
						   target="_blank" rel="noopener noreferrer" className='link'>
							[Official]
						</a>
						&nbsp;
						<a href={`https://keyforge-compendium.com/decks/${data.deck.id}?powered_by=KeyForgeEmporium`}
						   target="_blank" rel="noopener noreferrer" className='link'>
							[KFC]
						</a>
						&nbsp;
						<a href={`https://burgertokens.com/pages/keyforge-deck-analyzer?deck=${data.deck.id}&powered_by=KeyForgeEmporium`}
						   target="_blank" rel="noopener noreferrer" className='link'>
							[BT]
						</a>
						&nbsp;
						<a href={`https://decksofkeyforge.com/decks/${data.deck.id}?powered_by=KeyForgeEmporium`}
						   target="_blank" rel="noopener noreferrer" className='link'>
							[DoK]
						</a>
					</ListGroupItem>
					}
				</React.Fragment>
			</Collapse>
		</React.Fragment>;
	}
}

const mapStateToProps = state => {
	return {
		theme: state.theme,
	};
};

export default connect(mapStateToProps)(DeckListItem);