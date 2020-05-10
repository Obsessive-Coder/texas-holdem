import { HAND_RANK_HELPER } from '../helpers';

export default class Player {
  constructor(seatNumber) {
    this.seatNumber = seatNumber;
    this.holeCards = [];
    this._handResult = false;
  }

  get handResult() { return this._handResult; }

  clearHand() {
    this.holeCards = [];
    this._handResult = false;
  }

  calculateHandResult(boardCards) {
    const handRankFunctions = [
      'getRoyalFlush',
      'getStraightFlush',
      'getFourOfAKind',
      'getFullHouse',
      'getFlush',
      'getStraight',
      'getThreeOfAKind',
      'getTwoPair',
      'getPair',
      'getHighCard',
    ];

    const handRankHelper = new HAND_RANK_HELPER(this.holeCards.concat(boardCards));

    const handResult = {
      rank: '',
      cards: false,
    };

    let index = 0;
    while (!handResult.cards) {
      const currentFunction = handRankFunctions[index];

      handResult.rank = currentFunction.replace('get', '').split(/(?=[A-Z])/).join(' ');
      handResult.cards = handRankHelper[currentFunction]();

      index += 1;
    }

    this._handResult = handResult;

    return handResult;
  }
}