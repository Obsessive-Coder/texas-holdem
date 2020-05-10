export default class HAND_RANK_MANAGER {
  constructor(cards) {
    this._cards = cards;
    this.sortCards();
  }

  get cards() { return [].concat(this._cards); }

  sortCards(isAscending = false) {
    return this._cards.sort(({ rank: aRank }, { rank: bRank}) => (
      isAscending ? aRank - bRank : bRank - aRank
    ));
  };

  getRoyalFlush() {
    const royalFlushCards = this.getStraightFlush();
    if (!royalFlushCards) return false;

    const highCard = this.getHighCard()[0];
    const { rank } = highCard;

    return rank === 14 ? royalFlushCards : false;
  };

  getStraightFlush() {
    this.sortCards();

    let straightFlushCards = [];
    let isStraightFlush = false;

    for (let i = 0; i < this.cards.length; i++) {
      let { rank: currentRank, suit: currentSuit } = this.cards[i];

      straightFlushCards = (this.cards.filter((card, index) => {
        const { rank, suit } = card;

        if (index === i) {
          currentRank = rank;
          return true;
        }

        const isNextCard = Math.abs(currentRank - rank) === 1
        if (isNextCard) currentRank = rank;
        return isNextCard && suit === currentSuit;
      }));

      if (straightFlushCards.length >= 5) {
        isStraightFlush = true;
        break;
      }
    }

    straightFlushCards.sort(({ rank: aRank }, { rank: bRank }) => bRank - aRank);
    if (straightFlushCards.length > 5) straightFlushCards = straightFlushCards.splice(0, 5);

    return isStraightFlush ? straightFlushCards : false;
  };

  getFourOfAKind() {
    const threeOfAKindCards = this.getThreeOfAKind();
    if (!threeOfAKindCards) return false;

    let fourOfAKindCards = this.cards.filter(({ rank }) => (
      rank === threeOfAKindCards[0].rank
    ));

    const cardsLength = fourOfAKindCards.length;
    if (cardsLength < 4) return false;

    return fourOfAKindCards;
  };

  getFullHouse() {
    this.sortCards();

    const threeOfAKindCards = this.getThreeOfAKind();
    if (!threeOfAKindCards) return false;

    const tempCards = this.cards;

    this._cards = tempCards.filter(({ rank }) => (
      rank !== threeOfAKindCards[0].rank
    ));

    const pairCards = this.getPair();
    this._cards = tempCards;
    if (!pairCards) return false;

    return threeOfAKindCards.concat(pairCards);
  };

  getFlush() {
    this.sortCards();

    let isFlush = false;
    let suitedCards = [];

    for (let i = 0; i < this.cards.length; i++) {
      if (isFlush) break;
      const firstCard = this.cards[i];
      const { suit: firstSuit } = firstCard;
      suitedCards = [firstCard];
      for (let j = 0; j < this.cards.length; j++) {
        if (isFlush) break;
        if (j !== i) {
          const secondCard = this.cards[j];
          const { suit: secondSuit } = secondCard;

          if (secondSuit === firstSuit) {
            suitedCards.push(secondCard);
            isFlush = suitedCards.length === 5;
          }
        }
      }
    }

    return isFlush ? suitedCards : false;
  };

  getStraight() {
    this.sortCards();

    let straightCards = [];
    let isStraight = false;

    for (let i = 0; i < this.cards.length; i++) {
      let currentRank = this.cards[i].rank;
      straightCards = this.cards.filter((card, index) => {
        const { rank } = card;

        if (index === i) {
          currentRank = rank;
          return true;
        }

        const isNextCard = Math.abs(currentRank - rank) === 1;
        if (isNextCard) currentRank = rank;
        return isNextCard;
      });

      if (straightCards.length >= 5) {
        isStraight = true;
        break;
      }
    }

    straightCards.sort(({ rank: aRank }, { rank: bRank }) => bRank - aRank);
    if (straightCards.length > 5) straightCards = straightCards.splice(0, 5);

    return isStraight ? straightCards : false;
  };

  getThreeOfAKind() {
    this.sortCards();

    let isThreeOfAKind = false;
    let threeOfAKindCards = [];
    this.cards.forEach((firstCard, firstIndex) => {
      if (isThreeOfAKind) return;
      const { rank: firstRank } = firstCard;
      threeOfAKindCards = [firstCard];
      this.cards.forEach((secondCard, secondIndex) => {
        if (isThreeOfAKind || firstIndex === secondIndex) return;
        const { rank: secondRank } = secondCard;
        if (firstRank === secondRank) {
          threeOfAKindCards.push(secondCard);
          isThreeOfAKind = threeOfAKindCards.length === 3;
        }
      });
    });

    return isThreeOfAKind ? threeOfAKindCards : false;
  };

  getTwoPair() {
    this.sortCards();

    const firstPairCards = this.getPair();
    if (!firstPairCards) return false;

    const tempCards = this.cards;

    this._cards = tempCards.filter(({ rank }) => (
      rank !== firstPairCards[0].rank
    ));

    const secondPairCards = this.getPair();
    this._cards = tempCards;
    if (!secondPairCards) return false;

    return firstPairCards.concat(secondPairCards);
  };

  getPair() {
    this.sortCards();

    let isPair = false;
    let pairCards = [];
    this.cards.forEach((firstCard, firstIndex) => {
      if (isPair) return;
      const { rank: firstRank } = firstCard;
      pairCards = [firstCard];
      this.cards.forEach((secondCard, secondIndex) => {
        if (isPair || firstIndex === secondIndex) return;
        const { rank: secondRank } = secondCard;
        if (firstRank === secondRank) {
          pairCards.push(secondCard);
          isPair = true;
        }
      });
    });

    return isPair ? pairCards : false;
  };

  getHighCard() {
    this.sortCards();
    return [this.cards[0]];
  };
};

