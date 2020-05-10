import React from 'react';
import PropTypes from 'prop-types';
import { Card as CardClass } from '../utilities/classes/';

// Components.
import { Card } from './';

export default function PlayerCards({ cards, handRank }) {
  return (
    <div>
      <p className="text-center">
        {handRank || 'unknown'}
      </p>

      <div className="d-flex">
        {cards.map(card => (
          <Card key={card.displayText} card={card} />
        ))}
      </div>
    </div>
  );
}

PlayerCards.defaultProps = {
  cards: [],
};

PlayerCards.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.instanceOf(CardClass)),
};