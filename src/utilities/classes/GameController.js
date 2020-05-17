import { CardDeck, Player } from './';
import { GAME_STATUSES } from '../constants/general';

export default class GameController {
  constructor() {
    this.isAutoProgress = false;
    this._cardDeck = new CardDeck();
    this._gameStatus = GAME_STATUSES[GAME_STATUSES.indexOf('waiting')];
    this._boardCards = [];
    this._winnerPlayer = false;
    this._dealerPlayerIndex = 0;
    this._players = this.createPlayers(2);
    this._bigBlindAmount = 20;
    this._potTotal = 0;
    this._currentBet = 0;
    this._actionPlayerIndex = this.smallBlindPlayerIndex;
    this._firstActionPlayerIndex = this._actionPlayerIndex;
    this._currentBettingPlayerIndex = false;
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

  get bigBlindAmount() { return this._bigBlindAmount; }
  get smallBlindAmount() { return this._bigBlindAmount / 2; }
  get potTotal() { return this._potTotal; };
  set potTotal(potTotal) { this._potTotal = potTotal; }
  get currentBet() { return this._currentBet; };
  set currentBet(currentBet) { this._currentBet = currentBet; }
  get actionPlayerIndex() { return this._actionPlayerIndex; }
  set actionPlayerIndex(actionPlayerIndex) { this._actionPlayerIndex = actionPlayerIndex; }
  get currentBettingPlayerIndex() { return this._currentBettingPlayerIndex; }

  get dealerPlayerIndex() {
    return this._dealerPlayerIndex;
  }

  get smallBlindPlayerIndex() {
    let smallBlindIndex = this.dealerPlayerIndex + 1;
    if (smallBlindIndex >= this.players.length) smallBlindIndex = 0;
    if (this.players.length === 2) smallBlindIndex = this.dealerPlayerIndex;
    return smallBlindIndex;
  }

  get bigBlindPlayerIndex() {
    let bigBlindIndex = this.smallBlindPlayerIndex + 1;
    if (bigBlindIndex >= this.players.length) bigBlindIndex = 0;
    if (this.players.length === 2) bigBlindIndex = this.dealerPlayerIndex + 1;
    if (bigBlindIndex >= this.players.length) bigBlindIndex = 0;
    return bigBlindIndex;
  }

  get winnerPlayer() { return this._winnerPlayer; }

  startNewHand(isNewGame = false) {
    this._cardDeck = new CardDeck();
    this._gameStatus = GAME_STATUSES[GAME_STATUSES.indexOf('waiting')];
    this._boardCards = [];
    this._winnerPlayer = false;
    this._potTotal = 0;
    this._currentBet = 0;
    this.isAutoProgress = false;
    this.incrementDealer();

    this.players.forEach(player => {
      player.clearHand();
      if (isNewGame) player.chipTotal = 1500;
    });

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

  incrementActionPlayer() {
    const { actionPlayerIndex, players } = this;
    let nextIndex = actionPlayerIndex + 1;
    if (nextIndex >= players.length) nextIndex = 0;
    this._actionPlayerIndex = nextIndex;
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
      this.players.forEach(player => player.currentBet = 0);
      progressFunction = this.dealCommunityCards;
      let nextActionPlayerIndex = this.actionPlayerIndex;
      if (nextActionPlayerIndex >= this.players.length) {
        nextActionPlayerIndex = 0;
      }
      this.actionPlayerIndex = nextActionPlayerIndex;
      this._firstActionPlayerIndex = this.actionPlayerIndex;

      this._currentBettingPlayerIndex = false;
    } else if (gameStatus === 'opening') {
      for (let i = 0; i < this.players.length; i++) {
        const player = this.players[i];
        const isBigBlind = i === this.bigBlindPlayerIndex;
        const isSmallBlind = i === this.smallBlindPlayerIndex;
        let blindAmount = 0;
        if (isBigBlind) blindAmount = this.bigBlindAmount;
        else if (isSmallBlind) blindAmount = this.smallBlindAmount;
        player.chipTotal -= blindAmount
        player.currentBet = blindAmount;
        this.potTotal += blindAmount;
      }

      this.currentBet = this.bigBlindAmount;
      this.actionPlayerIndex = this.smallBlindPlayerIndex;
      this._firstActionPlayerIndex = this.actionPlayerIndex;
      this._currentBettingPlayerIndex = this.bigBlindPlayerIndex;
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

    this.currentBet = 0;

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

    const playersResultCards = this.players.map(({ resultCards, handResult }) => {
      const { rank } = handResult;
      rankIndices.push(handRanks.indexOf(rank));
      return resultCards;
    });

    let winnerIndex = -1;
    const indexDifference = rankIndices[0] - rankIndices[1];
    if (indexDifference < 0) {
      winnerIndex = 0;
    } else if (indexDifference > 0) {
      winnerIndex = 1;
    } else {
      const [oneCards, twoCards ] = playersResultCards;

      for (let i = 0; i < oneCards.length; i++) {
        const { rank: oneCardRank } = oneCards[i];
        const { rank: twoCardRank } = twoCards[i];

        const rankDifference = oneCardRank - twoCardRank;
        if (rankDifference !== 0) {
          winnerIndex = rankDifference > 0 ? 0 : 1;
          break;
        }
      }
    }

    const winnerPlayer = this.players[winnerIndex] || false;

    if (winnerPlayer) {
      winnerPlayer.chipTotal += this.potTotal;
    } else {
      let potHalf = parseFloat((this.potTotal / 2).toFixed(2));
      this.players.forEach(player => player.chipTotal += potHalf);
    }

    this._winnerPlayer = winnerPlayer;

    return winnerPlayer;
  }

  makeBet(amount, isRaise = false) {
    const actionPlayer = this.players[this.actionPlayerIndex];
    let betAmount = isRaise ? this.currentBet + amount : amount;
    let totalAmount = betAmount - actionPlayer.currentBet;
    const chipDifference = actionPlayer.chipTotal - totalAmount;

    if (chipDifference <= 0) {
      actionPlayer.isAllIn = true;
      const absChipDifference = Math.abs(chipDifference);
      totalAmount -= absChipDifference;
      betAmount -= absChipDifference;
      const otherPlayerIndex = this.actionPlayerIndex === 0 ? 1 : 0;
      this.players[otherPlayerIndex].chipTotal += absChipDifference;
    }

    actionPlayer.chipTotal -= totalAmount;
    actionPlayer.currentBet += totalAmount;
    this.currentBet = betAmount;
    this._firstActionPlayerIndex = this.actionPlayerIndex;
    this.potTotal += totalAmount;
  }

  callBet() {
    const actionPlayer = this.players[this.actionPlayerIndex];
    let callAmount = this.currentBet - actionPlayer.currentBet;
    const chipDifference = actionPlayer.chipTotal - callAmount;
    const otherPlayerIndex = this.actionPlayerIndex === 0 ? 1 : 0;
    const otherPlayer = this.players[otherPlayerIndex];

    if (chipDifference <= 0) {
      actionPlayer.isAllIn = true;
      const absChipDifference = Math.abs(chipDifference);
      callAmount -= absChipDifference;
      otherPlayer.chipTotal += absChipDifference;
    }

    actionPlayer.chipTotal -= callAmount;
    actionPlayer.currentBet += callAmount;

    if (otherPlayer.chipTotal === 0) {
      this.isAutoProgress = true;
    }

    this.potTotal += callAmount;
  }

  goAllIn() {
    const actionPlayer = this.players[this.actionPlayerIndex];
    actionPlayer.isAllIn = true;
    const isRaise = this.currentBet > 0;
    this.makeBet(actionPlayer.chipTotal - this.currentBet + actionPlayer.currentBet, isRaise);
  }

  foldHand() {
    const otherPlayerIndex = this.actionPlayerIndex === 0 ? 1 : 0;
    const otherPlayer = this.players[otherPlayerIndex];
    otherPlayer.chipTotal += this.potTotal;
    this.gameStatus = 'showdown';
    return this;
  }
};