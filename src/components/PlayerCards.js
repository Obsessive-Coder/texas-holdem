import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card as CardClass } from '../utilities/classes/';

// Components.
import { Button } from 'react-bootstrap'
import { Card } from './';

export default function PlayerCards({
  playerIndex, cards, handRank, isDealer, isSmallBlind,
  isBigBlind, chipTotal, actionPlayerIndex,
}) {
  const [isCardsShown, setIsCardsShown] = useState(
    cards.filter(({ isShown }) => isShown).length > 0
  );

  const toggleIsCardsShown = cardIndex => {
    cards.forEach(card => card.isShown = !isCardsShown);
    setIsCardsShown(!isCardsShown);
  }

  return (
    <div className={`${playerIndex === actionPlayerIndex ? 'border border-primary' : ''}`}>
      <div className="d-flex justify-content-around align-items-center text-center">
        <p className="w-25 text-left">{chipTotal}</p>

        <p className="flex-fill">
          {handRank || 'unknown'}
        </p>
      </div>

      <div className="d-flex">
        <div className={`d-flex flex-column ${playerIndex === 0 ? 'order-1' : ''}`}>
          {isDealer && (
            <span className="mx-2">D</span>
          )}

          {isSmallBlind && (
            <span className="mx-2">SB</span>
          )}

          {isBigBlind && (
            <span className="mx-2">BB</span>
          )}
        </div>

        <div className="d-flex flex-fill">
          {cards.map(card => (
            <Card key={card.displayText} card={card} />
          ))}
        </div>
      </div>

      <Button
        block
        size="sm"
        variant="outline-danger"
        onClick={toggleIsCardsShown}
      >
        {isCardsShown ? 'Hide Cards' : 'Show Cards'}
      </Button>
    </div>
  );
}

PlayerCards.defaultProps = {
  cards: [],
};

PlayerCards.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.instanceOf(CardClass)),
};