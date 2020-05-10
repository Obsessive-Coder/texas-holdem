import { Card } from './';
import { CARD_SUITS } from '../constants/general';

export default class CardDeck {
  constructor() {
    this.cards = this.generateCards();
    this.shuffleCards();
  }

  generateCards(x) {
    const cards = [];
    for (let j = 0; j < CARD_SUITS.length; j++) {
      const suit = CARD_SUITS[j];
      for (let k = 2; k <= 14; k++) {
        cards.push(new Card(k, suit));
      }
    }
    return cards;
  }

  shuffleCards() {
    const { cards } = this;

    let shuffleCount = 0;
    while (shuffleCount < 1000) {
      for(let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = cards[i];
        cards[i] = cards[j];
        cards[j] = temp;
      }
      shuffleCount += 1;
    }
  }
}