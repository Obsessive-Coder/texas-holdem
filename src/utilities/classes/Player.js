import { HAND_RANK_HELPER } from '../helpers';

export default class Player {
  constructor(seatNumber) {
    this.seatNumber = seatNumber;
    this.holeCards = [];
    this._handResult = false;
    this._resultCards = false;
    this._chipTotal = 1500;
    this._currentBet = 0;
    this._isAllIn = false;
  }

  get handResult() { return this._handResult; }
  get resultCards() { return this._resultCards; }

  get chipTotal() { return this._chipTotal; }
  set chipTotal(chipTotal) { this._chipTotal = chipTotal; }

  get currentBet() { return this._currentBet; }
  set currentBet(currentBet) { this._currentBet = currentBet; }

  get isAllIn() { return this._isAllIn; }
  set isAllIn(isAllIn) { this._isAllIn = isAllIn; }

  clearHand() {
    this.holeCards = [];
    this._handResult = false;
    this._resultCards = false;
    this._currentBet = 0;
    this._isAllIn = false;
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
    this._resultCards = handRankHelper.resultCards;

    return this.resultCards;
  }
}