import React from 'react';

// Components.
import { FormControl } from 'react-bootstrap';

export default function BetInput({
  minValue, actionBetAmount, onChange,
}) {
  return (
    <div className="d-flex align-items-center">
      <FormControl
        custom
        type="range"
        min={minValue}
        step={10}
        value={actionBetAmount}
        onChange={({ target: { value } }) => onChange(parseInt(value))}
      />

      <FormControl
        custom
        type="number"
        value={actionBetAmount}
        onChange={({ target: { value } }) => onChange(parseInt(value))}
        className="w-25 ml-2"
      />
    </div>
  );
}
