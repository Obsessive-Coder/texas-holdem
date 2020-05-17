import React from 'react';

// Components.
import { Button } from 'react-bootstrap';
import { BetInput } from './';

export default function BettingControls({
  currentBet, playerBet, bigBlindAmount, actionBetAmount,
  isPlayerAllIn, handleButtonOnClick, handleBetChange,
}) {
  // if (isPlayerAllIn) handleButtonOnClick({ target: { name: '' } })

  const bettingButtons = [{
    action: 'call',
    isShown: currentBet > playerBet,
  }, {
    action: 'check',
    isShown: currentBet === playerBet,
  }, {
    action: 'bet',
    isShown: currentBet === 0,
  }, {
    action: 'raise',
    isShown: currentBet > 0,
  }, {
    action: 'all-in',
    isShown: true,
  }, {
    action: 'fold',
    isShown: true,
  }];

  return (
    <div>
      <div className="d-flex justify-content-around">
        {bettingButtons.map(({ action, isShown }) => (
          <Button
            key={action}
            disabled={isPlayerAllIn}
            variant="outline-primary"
            size="lg"
            name={action}
            onClick={handleButtonOnClick}
            className={`flex-fill text-capitalize ${isShown ? '' : 'd-none'}`}
          >
            {action.split('-').join(' ')}
          </Button>
        ))}
      </div>

      <BetInput
        actionBetAmount={actionBetAmount}
        minValue={bigBlindAmount}
        onChange={handleBetChange}
      />
    </div>

  );
}
