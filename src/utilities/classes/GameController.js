import { CardDeck, Player } from './';
import { GAME_STATUSES } from '../constants/general';

export default class GameController {
  constructor() {
    this._cardDeck = new CardDeck();
    this._gameStatus = GAME_STATUSES[GAME_STATUSES.indexOf('waiting')];
    this._boardCards = [];
    this._winner = false;
    this._dealerPlayerIndex = 0;
    this._players = this.createPlayers(2);
  }

  get cardDeck() {
    return this._cardDeck;
  }

  get players() {
    return this._players.sort(({ seatNumber: a }, { seatNumber: b }) => a - b);
  }

  get gameStatus() {
    return this._gameStatus;
  }

  set gameStatus(gameStatus) {
    this._gameStatus = gameStatus;
  }

  get boardCards() {
    return this._boardCards;
  }

  get dealerPlayerIndex() {
    return this._dealerPlayerIndex;
  }

  get smallBlindPlayerIndex() {
    let smallBlindIndex = this.dealerPlayerIndex + 1;
    if (smallBlindIndex >= this.players.length) smallBlindIndex = 0;
    return smallBlindIndex;
  }

  get bigBlindPlayerIndex() {
    let bigBlindIndex = this.smallBlindPlayerIndex + 1;
    if (bigBlindIndex >= this.players.length) bigBlindIndex = 0;
    return bigBlindIndex;
  }

  get winner() { return this._winner; }

  startNewHand() {
    this._cardDeck = new CardDeck();
    this._gameStatus = GAME_STATUSES[GAME_STATUSES.indexOf('waiting')];
    this._boardCards = [];
    this._winner = false;
    this.incrementDealer();

    this.players.forEach(player => player.clearHand());

    return this;
  }

  createPlayers(playerCount) {
    const players = [];
    for (let i = 1; i <= playerCount; i++) {
      players.push(new Player(i));
    }
    players.sort(({ seatNumber: a }, { seatNumber: b }) => a - b);
    return players;
  }

  addPlayer(newSeatNumber) {
    const { players } = this;
    let unavailableSeats = players.map(({ seatNumber }) => seatNumber);
    const isWithinRange = newSeatNumber > 0 && newSeatNumber <= 8;
    let isSeatAvailable = isWithinRange && !unavailableSeats.includes(newSeatNumber);
    let seatNumber = isSeatAvailable ? newSeatNumber : 1;
    let attemptsCount = 0;

    while (!isSeatAvailable && attemptsCount > 10) {
      attemptsCount += 1;
      isSeatAvailable = !unavailableSeats.includes(seatNumber);

      if (!isSeatAvailable) {
        seatNumber += 1;
        if (seatNumber > 8) seatNumber = 1;
      }
    }

    players.push(new Player(seatNumber));
    players.sort(({ seatNumber: a }, { seatNumber: b }) => a - b);
    this._players = players;
  }

  removePlayer(seatNumber) {
    let { players } = this;
    players = players.filter(player => player.seatNumber !== seatNumber);
    players.sort(({ seatNumber: a }, { seatNumber: b }) => a - b);
    this._players = players;
  }

  incrementDealer() {
    const { dealerPlayerIndex, players } = this;
    let nextDealerIndex = dealerPlayerIndex + 1;
    if (nextDealerIndex >= players.length) nextDealerIndex = 0;
    this._dealerPlayerIndex = nextDealerIndex;
  }

  progressGame() {
    let nextStatusIndex = GAME_STATUSES.indexOf(this.gameStatus) + 1;
    if (nextStatusIndex >= GAME_STATUSES.length) nextStatusIndex = 0;
    this.gameStatus = GAME_STATUSES[nextStatusIndex];

    let { gameStatus } = this;

    const isCommunityDeal = (
      gameStatus === 'flop' ||
      gameStatus === 'turn' ||
      gameStatus === 'river'
    );

    let progressFunction = () => null;
    if (isCommunityDeal) {
      progressFunction = this.dealCommunityCards;
    } else if (gameStatus === 'opening') {
      progressFunction = this.dealHoleCards;
    } else if (gameStatus === 'showdown') {
      progressFunction = () => {
        this.getPlayersHandResults();
        this.getWinner();
      };
    }

    progressFunction = progressFunction.bind(this);
    progressFunction();
    return this;
  }

  dealHoleCards() {
    const {
      cardDeck, players, smallBlindPlayerIndex,
    } = this;

    cardDeck.shuffleCards();

    let dealToIndex = smallBlindPlayerIndex;
    let cardDealCount = 0;

    while (cardDealCount < players.length * 2) {
      const cardToDeal = cardDeck.cards.splice(0, 1)[0];
      players[dealToIndex].holeCards.push(cardToDeal);
      cardDealCount += 1;
      dealToIndex += 1;
      if (dealToIndex >= players.length) dealToIndex = 0;
    }

    players.forEach(player => player.calculateHandResult(this.boardCards));

    this.progressGame();
  }

  dealCommunityCards() {
    const { cardDeck, gameStatus, players } = this;

    cardDeck.cards.splice(0, 1);

    const dealCount = gameStatus === 'flop' ? 3 : 1;
    for (let i = 0; i < dealCount; i++) {
      const card = cardDeck.cards.splice(0, 1)[0];
      card.isShown = true;
      this._boardCards.push(card);
    }

    players.forEach(player => player.calculateHandResult(this.boardCards));

    this.progressGame();
  }

  getPlayersHandResults() {
    this.players.forEach(player => {
      player.calculateHandResult(this.boardCards);
    });
  }

  getWinner() {
    const handRanks = [
      'Royal Flush',
      'Straight Flush',
      'Four Of A Kind',
      'Full House',
      'Flush',
      'Straight',
      'Three Of A Kind',
      'Two Pair',
      'Pair',
      'High Card',
    ];

    const rankIndices = [];

    const playerHandResults = this.players.map(({ handResult }) => {
      const { rank } = handResult;
      rankIndices.push(handRanks.indexOf(rank));
      return handResult;
    });

    let winner = 'tie';
    const indexDifference = rankIndices[0] - rankIndices[1];
    if (indexDifference < 0) {
      winner = 'player one wins';
    } else if (indexDifference > 0) {
      winner = 'player two wins';
    } else {
      // const [{ rank: rankOne }, { rank: rankTwo }] = playerHandResults;
      // const rankDifference = rankOne - rankTwo;
      // if (rankDifference > 0) winner = 'player one wins';
      // if (rankDifference < 0) winner = 'player two wins';
    }

    this._winner = winner;

    return winner;
  }
};