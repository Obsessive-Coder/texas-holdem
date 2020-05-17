export default class HAND_RANK_MANAGER {
  constructor(cards) {
    this._cards = cards;
    this._resultCards = [];
    this.sortCards();
  }

  get cards() { return [].concat(this._cards); }

  get resultCards() { return [].concat(this._resultCards); }

  sortCards(isAscending = false) {
    return this._cards.sort(({ rank: aRank }, { rank: bRank}) => (
      isAscending ? aRank - bRank : bRank - aRank
    ));
  };

  getResultCards(cards) {
    let otherCards = [];
    this.cards.forEach(card => {
      let isPairCard = false;

      cards.forEach(({ rank, suit }) => {
        if (isPairCard) return;
        isPairCard = (rank === card.rank) && (suit === card.suit);
      });

      if (!isPairCard) otherCards.push(card);
    });

    otherCards.sort(({ rank: aRank }, { rank: bRank }) => bRank - aRank);
    otherCards = cards.concat(otherCards);
    this._resultCards = otherCards.slice(0, 5);
  }

  getRoyalFlush() {
    const royalFlushCards = this.getStraightFlush();
    if (!royalFlushCards) return false;

    const highCard = this.getHighCard()[0];
    const { rank } = highCard;

    const isRoyalFlush = rank === 14;
    if (isRoyalFlush) this.getResultCards(royalFlushCards);

    console.log(isRoyalFlush);

    return isRoyalFlush ? royalFlushCards : false;
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

    if (isStraightFlush) this.getResultCards(straightFlushCards);

    return isStraightFlush ? straightFlushCards : false;
  };

  getFourOfAKind() {
    this.sortCards();

    let isFourOfAKind = false;
    let fourOfAKindCards = [];
    this.cards.forEach((firstCard, firstIndex) => {
      if (isFourOfAKind) return;
      const { rank: firstRank } = firstCard;
      fourOfAKindCards = [firstCard];
      this.cards.forEach((secondCard, secondIndex) => {
        if (isFourOfAKind || firstIndex === secondIndex) return;
        const { rank: secondRank } = secondCard;
        if (firstRank === secondRank) {
          fourOfAKindCards.push(secondCard);
          isFourOfAKind = fourOfAKindCards.length === 4;
        }
      });
    });

    if (isFourOfAKind) this.getResultCards(fourOfAKindCards);

    return isFourOfAKind ? fourOfAKindCards : false;
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

    const fullHouseCards = threeOfAKindCards.concat(pairCards);
    this.getResultCards(fullHouseCards);
    return fullHouseCards;
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

    if (isFlush) this.getResultCards(suitedCards);

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

    if (isStraight) this.getResultCards(straightCards);

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

    if (isThreeOfAKind) this.getResultCards(threeOfAKindCards);

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

    const pairCards = firstPairCards.concat(secondPairCards);
    this.getResultCards(pairCards);

    return pairCards;
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

    if (isPair) this.getResultCards(pairCards);

    return isPair ? pairCards : false;
  };

  getHighCard() {
    this.sortCards();
    const highCards = [this.cards[0]];
    this.getResultCards(highCards);
    return highCards;
  };
};

