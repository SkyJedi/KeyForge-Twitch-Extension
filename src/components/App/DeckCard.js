import React from 'react';
import {get, toLower} from 'lodash-es';
import * as images from '../../images';
import {withStyles} from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const styles = theme => ({
	root: {
		color: 'black',
		width: '300px',
		backgroundColor: theme.palette.background.paper,
	},
	component: {
		maxHeight: 300,
		overflow: 'auto',
	},
	nested: {
		paddingLeft: theme.spacing.unit * 1.5,
	},
	token: {
		height: '0.9em',
		marginRight: '0.1em',
		marginLeft: '0.1em',
		verticalAlign: 'text-top'
	}
});

class DeckCard extends React.Component {
	state = {};

	render() {
		const {classes, data, type} = this.props;

		return (
			<List dense={true} className={`${classes.root} ${classes[type]}`}>
				{data.map((data, index) =>
					<div key={index}>
						<ListItem button onClick={() => this.setState({[index]: !this.state[index]})}>
							<ListItemText primary={get(data, 'deck.name', 'Deck Not Found')}
										  secondary={
											  <React.Fragment>
												  {get(data, 'deck._links.houses', [])
													  .map(house => <img key={house} className={classes.token} src={images[toLower(house)]}/>)}
												  <b>&nbsp;•&nbsp;</b>
												  {get(data, 'deck.power_level', 0)}<img className={classes.token} src={images.power}/>
												  <b>&nbsp;•&nbsp;</b>
												  {get(data, 'deck.chains', 0)}<img className={classes.token} src={images.chains}/>
												  <b>&nbsp;•&nbsp;</b>
												  {get(data, 'deck.wins', 0)}W/{get(data, 'deck.loses', 0)}L
											  </React.Fragment>
										  }/>
							{this.state[index] ? <ExpandLess/> : <ExpandMore/>}
						</ListItem>
						<Collapse in={this.state[index]} timeout="auto" unmountOnExit>
							<List dense={true} component="div" disablePadding>
								<ListItem className={classes.nested}>
									<ListItemText
										primary={
											<React.Fragment>
												{Object.keys(get(data, 'cardStats.rarity', [])).map(type =>
													<React.Fragment key={type}>
														{get(data, `cardStats.rarity[${type}]`, 0)}
														<img className={classes.token}
															 src={images[toLower(type)]}/>
														<b>&nbsp;•&nbsp;</b>
													</React.Fragment>)}
												{get(data, 'cardStats.is_maverick', 0)}
												<img className={classes.token}
													 src={images.maverick}/>
											</React.Fragment>
										}
										secondary={
											<React.Fragment>
												{Object.keys(get(data, 'cardStats.card_type', {})).map(type => `${type}:${get(data, `cardStats.card_type[${type}]`)}`).join(' • ')}
											</React.Fragment>
										}/>
								</ListItem>
								<ListItem className={classes.nested}>
									<ListItemText primary='ADHD' secondary={get(data, 'ADHD', 'ADHD Not Found')}/>
								</ListItem>
								<ListItem className={classes.nested}>
									<ListItemText primary='SAS' secondary={get(data, 'dok.SAS', 'SAS Not Found')}/>
								</ListItem>
								<ListItem className={classes.nested}>
									<ListItemText primary='AERC' secondary={get(data, 'dok.AERC', 'AERC Not Found')}/>
								</ListItem>
								{this.props.type === 'panel' &&
								<ListItem className={classes.nested}>
									<ListItemText primary='Links'
												  secondary={
													  <React.Fragment>
														  <Link
															  href={`https://www.keyforgegame.com/deck-details/${data.deck.id}?powered_by=KeyForgeEmporium`}
															  className={classes.link}>
															  [Official]
														  </Link>&nbsp;
														  <Link
															  href={`https://keyforge-compendium.com/decks/${data.deck.id}?powered_by=KeyForgeEmporium`}
															  className={classes.link}>
															  [KFC]
														  </Link>&nbsp;
														  <Link
															  href={`https://burgertokens.com/pages/keyforge-deck-analyzer?deck=${data.deck.id}&powered_by=KeyForgeEmporium`}
															  className={classes.link}>
															  [BT]
														  </Link>&nbsp;
														  <Link href={`https://decksofkeyforge.com/decks/${data.deck.id}?powered_by=KeyForgeEmporium`}
																className={classes.link}>
															  [DoK]
														  </Link>
													  </React.Fragment>
												  }/>
								</ListItem>
								}
							</List>
						</Collapse>
					</div>)
				}
			</List>
		);
	}
}

export default withStyles(styles)(DeckCard);