import { FACE_CARD_RANKS } from '../constants/general';

export default class Card {
  constructor (rank, suit) {
    this._rank = rank;
    this._suit = suit;
    this._isShown = false;
    this._image = this.image;
  }

  get rank() { return this._rank; }
  get suit() { return this._suit; }

  get displayText() {
    let truncatedRank = this.rank;

    if (truncatedRank > 10) {
      truncatedRank = FACE_CARD_RANKS[truncatedRank - 11][0].toUpperCase();
    }

    const truncatedSuit = this.suit.toString()[0].toUpperCase();
    return `${truncatedRank}${truncatedSuit}`
  };

  get isShown() { return this._isShown; }
  set isShown(isShown) {
    this._isShown = isShown;
    this._image = this.image;
  }

  get image() {
    let deckImagePath = 'Gray_back';
    return require(`../../cards/${this._isShown ? this.displayText : deckImagePath}.jpg`);
  }
};
