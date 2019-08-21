import 'babel-polyfill';
import axios from 'axios';
import {get} from 'lodash-es';
import {default as all_cards} from './all_cards.json';
import * as keys from './keys.json';

export const fetchDeck = async (name) => {
	return new Promise(resolve => {
		if (name.length <= 0) resolve();
		axios.get(encodeURI(`${keys.proxy}${keys.deckSearchAPI}?search=${name}`))
			.then(async response => {
				if (get(response, 'data.count') > 0) {
					const deck = get(response, 'data.data[0]', false),
						cards = await buildCardList(get(deck, 'cards', []), get(deck, 'id', '')),
						dok = await fetchDoK(deck.id);
					Promise.all([cards, dok]).then(([cards, dok]) => resolve({deck, cardStats: getCardStats(cards, deck.expansion), dok}));
				} else resolve(false);
			}).catch(console.error);
	});
};

const fetchDoK = (deckID) => {
	return new Promise(resolve => {
		axios.get(`${keys.proxy}${keys.dokAPI}${deckID}`)
			.then(response => {
				if (response.data) {
					const {
							amberControl: A, expectedAmber: E,
							artifactControl: R, creatureControl: C,
							deckManipulation: D, effectivePower: P,
							sasRating
						} = response.data.deck,
						sas = `${sasRating} SAS • ${A + E + R + C + D + (P / 10)} AERC`,
						deckAERC = `A: ${A} • E: ${E} • R: ${R} • C: ${C} • D: ${D} • P: ${P}`;
					resolve({sas, deckAERC});
				} else resolve(['Unable to Retrieve SAS', 'Unable to Retrieve AERC']);
			}).catch(() => resolve(['Unable to Retrieve SAS, DoK non-responsive', 'Unable to Retrieve AERC, DoK non-responsive']));
	});
};

const buildCardList = (cardList, id) => {
	return new Promise(async resolve => {
		const cards = await cardList.map(async card => {
			const data = all_cards.find(o => o.id === card);
			return data ? data : await fetchUnknownCard(card, id).catch(console.error);
		});
		Promise.all(cards).then(cards => resolve(cards));
	});
};

const fetchUnknownCard = (cardId, deckId) => {
	return new Promise(async resolve => {
		console.log(`${cardId} not found, fetching from the man`);
		const fetchedCards = await axios.get(`http://www.keyforgegame.com/api/decks/${deckId}/?links=cards`);
		const card = fetchedCards.data._linked.cards.find(o => o.id === cardId);
		resolve(card);
	});
};


const getCardStats = (cards, expansion) => {
	return {
		amber: cards.reduce((acc, card) => acc + card.amber, 0),
		card_type: cards.reduce((acc, card) => ({...acc, [card.card_type]: acc[card.card_type] + 1}),
			{Action: 0, Artifact: 0, Creature: 0, Upgrade: 0}
		),
		rarity: cards.reduce((acc, card) =>
			({
				...acc,
				[rarityFix(card.rarity)]: acc[rarityFix(card.rarity)] ? acc[rarityFix(card.rarity)] + 1 : 1
			}), {}),
		is_maverick: cards.filter(card => card.is_maverick).length,
		legacy: cards.filter(card => !(card.expansion === expansion)).length
	};
};

const rarityFix = rarity => rarity === 'FIXED' || rarity === 'Variant' ? 'Special' : rarity;
