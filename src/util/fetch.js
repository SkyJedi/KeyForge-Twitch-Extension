import 'babel-polyfill';
import axios from 'axios';
import {get, toUpper} from 'lodash-es';
import {default as all_cards} from './all_cards.json';
import * as keys from './keys.json';

export const fetchDeck = async (name) => {
	console.log('Fetching deck');

	return new Promise(resolve => {
		if (name.length <= 0) resolve();
		axios.get(encodeURI(`${keys.proxy}${keys.deckSearchAPI}?search=${name}`))
			.then(async response => {
				if (get(response, 'data.count') > 0) {
					console.log('Deck has been fetched');
					const {cards: cardList, ...deck} = get(response, 'data.data[0]', false),
						cards = cardList.map(card => all_cards.find(o => o.id === card)),
						cardStats = getCardStats(cards),
						ADHD = fetchDeckADHD(deck.id),
						dok = fetchDoK(deck.id);
					Promise.all([cardStats, ADHD, dok]).then(([cardStats, ADHD, dok]) => resolve({deck, cardStats, ADHD, dok}));
				} else resolve(false);
			}).catch(console.error);
	});
};

const fetchDeckADHD = (deckID) => {
	return new Promise(resolve => {
		console.log('Fetching ADHD');
		axios.get(`${keys.proxy}${keys.kfcAPI}decks/${deckID}.json`, keys.KFCAuth)
			.then(response => {
				if (response.data) {
					console.log('ADHD has been fetched');
					resolve(`${Object.keys(keys.aveADHD).sort().map(type => `${toUpper(type.slice(0, 1))}:${response.data[type].toFixed(1)}(${(response.data[type] - keys.aveADHD[type]).toFixed(1)})`).join(' • ')}`);
				} else resolve(`ADHD unavailable, register https://keyforge-compendium.com/decks/${deckID}?powered_by=KeyForgeEmporium`);
			}).catch(() => resolve(`ADHD not Found! KFC is non-responsive`));
	});
};

const fetchDoK = (deckID) => {
	console.log('Fetching DoK');
	return new Promise(resolve => {
		axios.get(`${keys.proxy}${keys.dokAPI}${deckID}`)
			.then(response => {
				if (response.data) {
					console.log('DoK has been Fetched ADHD');
					const {amberControl: A, expectedAmber: E, artifactControl: R, creatureControl: C, sasRating, cardsRating, synergyRating, antisynergyRating} = response.data.deck,
						SAS = `${sasRating} SAS = ${cardsRating} + ${synergyRating} - ${antisynergyRating}`,
						AERC = `A:${A}(${A - keys.aveAERC.a_rating}) • E:${E}(${E - keys.aveAERC.e_rating}) • R:${R}(${R - keys.aveAERC.r_rating}) • C:${C}(${C - keys.aveAERC.c_rating})`;
					resolve({SAS, AERC});
				} else resolve(['Unable to Retrieve SAS', 'Unable to Retrieve AERC']);
			}).catch(() => resolve(['Unable to Retrieve SAS, DoK non-responsive', 'Unable to Retrieve AERC, DoK non-responsive']));
	});
};

const getCardStats = (cards) => {
	return {
		card_type: cards.reduce((acc, card) => ({...acc, [card.card_type]: acc[card.card_type] + 1}),
			{Action: 0, Artifact: 0, Creature: 0, Upgrade: 0}
		),
		rarity: cards.reduce((acc, card) => ({...acc, [card.rarity]: acc[card.rarity] + 1}),
			{Common: 0, Uncommon: 0, Rare: 0, Special: 0}
		),
		is_maverick: cards.filter(card => card.is_maverick).length,
	};
};