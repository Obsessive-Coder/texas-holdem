import React, { Component, Fragment } from 'react';
import { HAND_RANK_HELPER } from '../utilities/helpers';
import { GameController } from '../utilities/classes/';

// Components.
import Button from 'react-bootstrap/Button';
import { BoardCards, PlayerCards } from './';

export default class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameController: new GameController(),
    };
  }

  startNewHand = () => {
    const { gameController: { startNewHand } } = this.state;
    const gameController = startNewHand();
    this.setState(() => ({ gameController }));
  }

  startGame = () => {
    let { gameController } = this.state;
    gameController = gameController.progressGame();
    this.setState(() => ({ gameController }));
  };

  progressGame = () => {
    let { gameController } = this.state;
    const { gameStatus } = gameController;

    if (gameStatus === 'showdown') {
      gameController = gameController.startNewHand();
    }

    gameController = gameController.progressGame();

    this.setState(() => ({ gameController }));
  }

  render() {
    const { gameController } = this.state;
    const { boardCards, gameStatus, players, winner } = gameController;

    const bettingButtons = [{
      labelText: 'Call',
    }, {
      labelText: 'Raise',
    }, {
      labelText: 'Fold',
    }];

    return (
      <div className="vh-100">
        {gameStatus === 'waiting' ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Button
              variant="outline-primary"
              size="lg"
              onClick={this.startGame}
              className="w-75 p-5"
            >
              Start
            </Button>
          </div>
        ) : (
          <div className="d-flex flex-column h-100">
            {gameStatus}
            <BoardCards
              key={boardCards.length}
              cards={boardCards}
              winner={winner}
            />

            <div className="d-flex justify-content-around">
              {players.map(({
                handResult, holeCards, seatNumber,
              }, index) => (
                <Fragment key={`player-${seatNumber}-cards-${holeCards.length}`}>
                  <PlayerCards
                    cards={holeCards}
                    handRank={handResult ? handResult.rank : false}
                  />

                  {index === 0 && (
                    <Button
                      variant="outline-primary"
                      size="lg"
                      onClick={this.progressGame}
                      className="align-self-center"
                    >
                      Next
                    </Button>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
