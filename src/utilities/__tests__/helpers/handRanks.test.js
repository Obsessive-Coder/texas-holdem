import { Card, CardDeck } from '../../classes';
import { HAND_RANK_HELPER } from '../../helpers';

describe('Card Deck', () => {
  const cardDeck = new CardDeck();

  it('should be an instance of CardDeck', () => {
    expect(cardDeck).toBeInstanceOf(CardDeck);
  });

  it('should have 52 cards', () => {
    expect(cardDeck.cards).toHaveLength(52);
  });
});

describe('Hand Rank Helper', () => {
  const cardDeck = new CardDeck();

  describe('Get Royal Flush', () => {
    it('returns false if there is not a royal flush', () => {
      const cards = [
        new Card(12, 'hearts'), new Card(13, 'spades'),
        new Card(10, 'diamonds'), new Card(11, 'clubs'),
        new Card(14, 'clubs'), new Card(9, 'spades'),
        new Card(8, 'hearts'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const royalFlushCards = showdownCards.getRoyalFlush();
      expect(royalFlushCards).toEqual(false);
    });

    it('returns an array of 5 cards with sequential ranks of the same suit with A being the highest rank', () => {
      const cards = [
        new Card(12, 'spades'), new Card(13, 'spades'),
        new Card(10, 'spades'), new Card(11, 'spades'),
        new Card(14, 'spades'), new Card(9, 'spades'),
        new Card(8, 'spades'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const royalFlushCards = showdownCards.getRoyalFlush();
      expect(royalFlushCards).toHaveLength(5);

      const [ cardOne, cardTwo, cardThree, cardFour, cardFive ] = royalFlushCards;
      expect(cardOne).toBeInstanceOf(Card);
      expect(cardOne.rank).toEqual(cards[4].rank);
      expect(cardOne.suit).toEqual(cards[4].suit);
      expect(cardTwo).toBeInstanceOf(Card);
      expect(cardTwo.rank).toEqual(cards[1].rank);
      expect(cardTwo.suit).toEqual(cards[1].suit);
      expect(cardThree).toBeInstanceOf(Card);
      expect(cardThree.rank).toEqual(cards[0].rank);
      expect(cardThree.suit).toEqual(cards[0].suit);
      expect(cardFour).toBeInstanceOf(Card);
      expect(cardFour.rank).toEqual(cards[3].rank);
      expect(cardFour.suit).toEqual(cards[3].suit);
      expect(cardFive).toBeInstanceOf(Card);
      expect(cardFive.rank).toEqual(cards[2].rank);
      expect(cardFive.suit).toEqual(cards[2].suit);
    });
  });

  describe('Get Straight Flush', () => {
    it('returns an array of 5 cards with sequential ranks of the same suit', () => {
      const cards = [
        new Card(12, 'spades'), new Card(13, 'spades'),
        new Card(10, 'spades'), new Card(11, 'spades'),
        new Card(14, 'spades'), new Card(9, 'spades'),
        new Card(8, 'spades'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const straightFlushCards = showdownCards.getStraightFlush();
      expect(straightFlushCards).toHaveLength(5);

      const [ cardOne, cardTwo, cardThree, cardFour, cardFive ] = straightFlushCards;
      expect(cardOne).toBeInstanceOf(Card);
      expect(cardOne.rank).toEqual(cards[4].rank);
      expect(cardOne.suit).toEqual(cards[4].suit);
      expect(cardTwo).toBeInstanceOf(Card);
      expect(cardTwo.rank).toEqual(cards[1].rank);
      expect(cardTwo.suit).toEqual(cards[1].suit);
      expect(cardThree).toBeInstanceOf(Card);
      expect(cardThree.rank).toEqual(cards[0].rank);
      expect(cardThree.suit).toEqual(cards[0].suit);
      expect(cardFour).toBeInstanceOf(Card);
      expect(cardFour.rank).toEqual(cards[3].rank);
      expect(cardFour.suit).toEqual(cards[3].suit);
      expect(cardFive).toBeInstanceOf(Card);
      expect(cardFive.rank).toEqual(cards[2].rank);
      expect(cardFive.suit).toEqual(cards[2].suit);
    });

    it('returns false if there is not a straight flush', () => {
      const cards = [
        new Card(3, 'spades'), new Card(8, 'spades'), new Card(7, 'spades'),
        new Card(4, 'spades'), new Card(9, 'spades'), new Card(14, 'spades'),
        new Card(13, 'spades'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const straightFlushCards = showdownCards.getStraightFlush();
      expect(straightFlushCards).toEqual(false);
    });
  });

  describe('Get Four Of A Kind', () => {
    it('returns an array of 4 Cards with the same rank', () => {
      const cards = [
        new Card(13, 'clubs'), new Card(13, 'spades'), new Card(13, 'diamonds'),
        new Card(13, 'hearts'), new Card(8, 'spades'), new Card(6, 'spades'),
        new Card(7, 'spades'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const fourOfAKindCards = showdownCards.getFourOfAKind();
      expect(fourOfAKindCards).toHaveLength(4);
      const [ cardOne, cardTwo, cardThree, cardFour ] = fourOfAKindCards;
      expect(cardOne).toBeInstanceOf(Card);
      expect(cardOne.rank).toEqual(cards[0].rank);
      expect(cardTwo).toBeInstanceOf(Card);
      expect(cardTwo.rank).toEqual(cards[0].rank);
      expect(cardThree).toBeInstanceOf(Card);
      expect(cardThree.rank).toEqual(cards[0].rank);
      expect(cardFour).toBeInstanceOf(Card);
      expect(cardFour.rank).toEqual(cards[0].rank);
    });

    it('returns false if there is not four of a kind', () => {
      const cards = [
        new Card(2, 'clubs'), new Card(13, 'spades'), new Card(13, 'diamonds'), new Card(9, 'spades'),
        new Card(8, 'spades'), new Card(6, 'spades'), new Card(7, 'spades'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const fourOfAKindCards = showdownCards.getFourOfAKind();
      expect(fourOfAKindCards).toEqual(false);
    });
  });

  describe('Get Full House', () => {
    it('returns an array of 5 cards with a three of a kind and a pair', () => {
      const cards = [
        new Card(6, 'spades'), new Card(13, 'spades'), new Card(13, 'diamonds'),
        new Card(8, 'hearts'), new Card(8, 'spades'), new Card(8, 'clubs'),
        new Card(6, 'clubs'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const fullHouseCards = showdownCards.getFullHouse();
      expect(fullHouseCards).toHaveLength(5);

      const threeOfAKindCards = fullHouseCards.slice(0, 3);
      const [cardOne, cardTwo, cardThree] = threeOfAKindCards;
      expect(cardOne).toBeInstanceOf(Card);
      expect(cardOne.rank).toEqual(cards[3].rank);
      expect(cardTwo).toBeInstanceOf(Card);
      expect(cardTwo.rank).toEqual(cards[3].rank);
      expect(cardThree).toBeInstanceOf(Card);
      expect(cardThree.rank).toEqual(cards[3].rank);

      const pairCards = fullHouseCards.slice(-2);
      const [cardFour, cardFive] = pairCards;
      expect(cardFour).toBeInstanceOf(Card);
      expect(cardFour.rank).toEqual(cards[1].rank);
      expect(cardFive).toBeInstanceOf(Card);
      expect(cardFive.rank).toEqual(cards[1].rank);
    });

    it('return false if there is not a full house', () => {
      const cards = [
        new Card(2, 'clubs'), new Card(13, 'spades'), new Card(13, 'diamonds'), new Card(9, 'spades'),
        new Card(8, 'clubs'), new Card(6, 'spades'), new Card(7, 'spades'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const fullHouseCards = showdownCards.getFullHouse();
      expect(fullHouseCards).toEqual(false);
    });
  });

  describe('Get Flush', () => {
    it('returns an array of 5 cards with the same suit', () => {
      const cards = [
        new Card(3, 'spades'), new Card(13, 'spades'), new Card(13, 'diamonds'),
        new Card(13, 'hearts'), new Card(8, 'spades'), new Card(6, 'spades'),
        new Card(7, 'spades'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const flushCards = showdownCards.getFlush();
      expect(flushCards).toHaveLength(5);
      const [ cardOne, cardTwo, cardThree, cardFour, cardFive ] = flushCards;
      expect(cardOne).toBeInstanceOf(Card);
      expect(cardOne.suit).toEqual(cards[0].suit);
      expect(cardTwo).toBeInstanceOf(Card);
      expect(cardTwo.suit).toEqual(cards[0].suit);
      expect(cardThree).toBeInstanceOf(Card);
      expect(cardThree.suit).toEqual(cards[0].suit);
      expect(cardFour).toBeInstanceOf(Card);
      expect(cardFour.suit).toEqual(cards[0].suit);
      expect(cardFive).toBeInstanceOf(Card);
      expect(cardFive.suit).toEqual(cards[0].suit);
    });

    it('returns false if there is not a flush', () => {
      const cards = [
        new Card(2, 'clubs'), new Card(13, 'spades'), new Card(13, 'diamonds'), new Card(9, 'spades'),
        new Card(8, 'clubs'), new Card(6, 'spades'), new Card(7, 'spades'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const flushCards = showdownCards.getFlush();
      expect(flushCards).toEqual(false);
    });
  });

  describe('Get Straight', () => {
    it('returns an array of 5 cards with sequential ranks', () => {
      const cards = [
        new Card(12, 'spades'), new Card(9, 'spades'), new Card(11, 'diamonds'),
        new Card(10, 'hearts'), new Card(8, 'spades'), new Card(6, 'spades'),
        new Card(7, 'spades'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const straightCards = showdownCards.getStraight();
      expect(straightCards).toHaveLength(5);

      const [ cardOne, cardTwo, cardThree, cardFour, cardFive ] = straightCards;
      expect(cardOne).toBeInstanceOf(Card);
      expect(cardOne.rank).toEqual(cards[0].rank);
      expect(cardTwo).toBeInstanceOf(Card);
      expect(cardTwo.rank).toEqual(cards[2].rank);
      expect(cardThree).toBeInstanceOf(Card);
      expect(cardThree.rank).toEqual(cards[3].rank);
      expect(cardFour).toBeInstanceOf(Card);
      expect(cardFour.rank).toEqual(cards[1].rank);
      expect(cardFive).toBeInstanceOf(Card);
      expect(cardFive.rank).toEqual(cards[4].rank);
    });

    it('returns false if there is not a straight', () => {
      const cards = [
        new Card(3, 'spades'), new Card(8, 'spades'), new Card(7, 'diamonds'),
        new Card(4, 'hearts'), new Card(9, 'spades'), new Card(14, 'spades'),
        new Card(13, 'spades'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const straightCards = showdownCards.getStraight();
      expect(straightCards).toEqual(false);
    });
  })


  describe('Get Three Of A Kind', () => {
    it('returns and array of 3 Cards with the same rank', () => {
      const cards = [
        new Card(8, 'hearts'), new Card(13, 'spades'), new Card(13, 'diamonds'),
        new Card(6, 'spades'), new Card(8, 'spades'), new Card(8, 'clubs'),
        new Card(6, 'clubs'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const threeOfAKindCards = showdownCards.getThreeOfAKind();
      expect(threeOfAKindCards).toHaveLength(3);
      const [ cardOne, cardTwo, cardThree ] = threeOfAKindCards;
      expect(cardOne).toBeInstanceOf(Card);
      expect(cardOne.rank).toEqual(cards[0].rank);
      expect(cardTwo).toBeInstanceOf(Card);
      expect(cardTwo.rank).toEqual(cards[0].rank);
      expect(cardThree).toBeInstanceOf(Card);
      expect(cardThree.rank).toEqual(cards[0].rank);
    });

    it('returns false if there is not three of a kind', () => {
      const cards = [
        new Card(2, 'clubs'), new Card(13, 'spades'), new Card(13, 'diamonds'), new Card(9, 'spades'),
        new Card(8, 'spades'), new Card(6, 'spades'), new Card(7, 'spades'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const threeOfAKindCards = showdownCards.getThreeOfAKind();
      expect(threeOfAKindCards).toEqual(false);
    });
  });

  describe('Get Two Pair', () => {
    it('returns an array of 4 Cards', () => {
      const cards = [
        new Card(8, 'spades'), new Card(13, 'spades'), new Card(12, 'spades'), new Card(9, 'spades'),
        new Card(13, 'spades'), new Card(12, 'clubs'), new Card(7, 'spades'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const twoPairCards = showdownCards.getTwoPair();
      expect(twoPairCards).toHaveLength(4);
      expect(twoPairCards[0]).toBeInstanceOf(Card);
      expect(twoPairCards[1]).toBeInstanceOf(Card);
      expect(twoPairCards[2]).toBeInstanceOf(Card);
      expect(twoPairCards[3]).toBeInstanceOf(Card);
    });

    it('returns false if there is not two pairs', () => {
      const cards = [
        new Card(3, 'spades'), new Card(13, 'spades'), new Card(12, 'spades'), new Card(9, 'spades'),
        new Card(8, 'spades'), new Card(6, 'spades'), new Card(7, 'spades'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const twoPairCards = showdownCards.getTwoPair();
      expect(twoPairCards).toEqual(false);
    })
  });

  describe('Get Pair', () => {
    it('returns an array of 2 Cards', () => {
      const cards = [
        new Card(13, 'spades'), new Card(13, 'spades'), new Card(12, 'spades'), new Card(9, 'spades'),
        new Card(8, 'spades'), new Card(6, 'spades'), new Card(7, 'spades'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const pairCards = showdownCards.getPair();
      expect(pairCards).toHaveLength(2);
      expect(pairCards[0]).toBeInstanceOf(Card);
      expect(pairCards[1]).toBeInstanceOf(Card);
    });

    it('returns false if there is no pair', () => {
      const cards = [
        new Card(3, 'spades'), new Card(13, 'spades'), new Card(12, 'spades'), new Card(9, 'spades'),
        new Card(8, 'spades'), new Card(6, 'spades'), new Card(7, 'spades'),
      ];

      const showdownCards = new HAND_RANK_HELPER([].concat(cards));
      const pairCards = showdownCards.getPair();
      expect(pairCards).toEqual(false);
    })
  });

  describe('Get High Card', () => {
    const showdownCards = new HAND_RANK_HELPER(cardDeck.cards.slice(0, 7))
    const highCards = showdownCards.getHighCard();

    it('returns an array with a single instance of Card', () => {
      expect(highCards).toHaveLength(1);
    });

    it('returns the highest ranking Card', () => {
      showdownCards.sortCards(false);
      expect(highCards[0].rank).toEqual(showdownCards.cards[0].rank);
    });
  });
})

