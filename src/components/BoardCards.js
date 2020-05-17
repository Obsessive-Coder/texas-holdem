import React from 'react';
import PropTypes from 'prop-types';
import { Card as CardClass } from '../utilities/classes/';

// Components.
import { Card } from './';

export default function BoardCards({
  cards, winnerPlayer, potTotal, isGameOver,
}) {
  return (
    <div className="d-flex flex-column flex-fill">
      <div className="d-flex align-items-center flex-fill mx-auto community-cards">
        {cards.map(card => (
          <Card key={`${card.displayText}-${card.isShown}`} card={card} />
        ))}
      </div>

      <div className="h-25">
        <h2 className="text-center">
          <p>
            {winnerPlayer ? (
              `Player ${winnerPlayer.seatNumber} Wins!`
            ) : (
            `Pot: ${potTotal}`
            )}
          </p>

          {isGameOver && (
            <p>Game Over</p>
          )}
        </h2>
      </div>
    </div>
  )
}

BoardCards.defaultProps = {
  cards: [],
};

BoardCards.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.instanceOf(CardClass)),
};
