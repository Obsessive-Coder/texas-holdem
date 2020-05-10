import React from 'react';
import PropTypes from 'prop-types';
import { Card as CardClass } from '../utilities/classes/';

export default function Card({ card }) {
  const { image, rank, suit } = card;

  return (
    <div className="mx-2">
      <img
        src={image}
        alt={`${rank} of ${suit}`}
        className="playing-card-image"
      />
    </div>
  );
}

Card.defaultProps = {
  card: null,
};

Card.propTypes = {
  card: PropTypes.instanceOf(CardClass),
};


