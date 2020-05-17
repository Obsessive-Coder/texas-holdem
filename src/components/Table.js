import React, { Component, Fragment } from 'react';
import { GameController } from '../utilities/classes/';

// Components.
import Button from 'react-bootstrap/Button';
import { BoardCards, PlayerCards, BettingControls } from './';

export default class Table extends Component {
  constructor(props) {
    super(props);

    const gameController = new GameController();

    this.state = {
      gameController,
      actionBetAmount: gameController.bigBlindAmount,
    };
  }

  startNewHand = () => {
    const { gameController: { startNewHand } } = this.state;
    const gameController = startNewHand();
    this.setState(() => ({ gameController, actionBetAmount: gameController.bigBlindAmount }));
  }

  startGame = () => {
    let { gameController } = this.state;
    gameController = gameController.progressGame();
    this.setState(() => ({ gameController }));
  };

  progressGame = (isGameOver = false) => {
    let { gameController } = this.state;
    const { gameStatus } = gameController;

    if (gameStatus === 'showdown') {
      gameController = gameController.startNewHand(isGameOver);
    }

    gameController = gameController.progressGame();

    this.setState(() => ({ gameController, actionBetAmount: gameController.bigBlindAmount }));
  }

  handleActionButtonOnClick = ({ target: { name: action } }) => {
    let { gameController, actionBetAmount } = this.state;

    if (action === 'call') gameController.callBet();
    if (action === 'bet' || action === 'raise') {
      gameController.makeBet(actionBetAmount, action === 'raise');
    }

    if (action === 'all-in') gameController.goAllIn();

    if (action === 'fold') {
      gameController.foldHand();
      this.progressGame();
    };

    gameController.incrementActionPlayer();

    const {
      actionPlayerIndex, _firstActionPlayerIndex,
    } = gameController;

    if (action !== 'bet' && actionPlayerIndex === _firstActionPlayerIndex) {
      return this.progressGame();
    }

    this.setState(() => ({ gameController }));
  };

  handleBetChange = actionBetAmount => {
    this.setState(() => ({ actionBetAmount }))
  };

  render() {
    const { gameController, actionBetAmount, } = this.state;
    const {
      boardCards, gameStatus, players, winnerPlayer,
      dealerPlayerIndex, smallBlindPlayerIndex,
      bigBlindPlayerIndex, bigBlindAmount,
      potTotal, currentBet, actionPlayerIndex,
      isAutoProgress,
    } = gameController;

    if (gameStatus !== 'showdown' && isAutoProgress) {
      this.progressGame();
    }

    let isGameOver = false;
    for (let i = 0; i < players.length; i++) {
      const { chipTotal } = players[i];
      if (gameStatus === 'showdown' && chipTotal === 0) {
        isGameOver = true;
        break;
      }
    }

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
              potTotal={potTotal}
              winnerPlayer={winnerPlayer}
              isGameOver={isGameOver}
            />

            <div className="d-flex justify-content-around">
              {players.map(({
                handResult, holeCards, seatNumber, chipTotal,
              }, index) => (
                <Fragment key={`player-${seatNumber}-cards-${holeCards.length}`}>
                  <PlayerCards
                    playerIndex={index}
                    cards={holeCards}
                    handRank={handResult ? handResult.rank : false}
                    isDealer={index === dealerPlayerIndex}
                    isSmallBlind={index === smallBlindPlayerIndex}
                    isBigBlind={index === bigBlindPlayerIndex}
                    chipTotal={chipTotal}
                    actionPlayerIndex={actionPlayerIndex}
                  />

                  {index === 0 && gameStatus.includes('betting') && (
                    <BettingControls
                      currentBet={currentBet}
                      playerBet={players[actionPlayerIndex].currentBet}
                      isPlayerAllIn={players[actionPlayerIndex].isAllIn}
                      bigBlindAmount={bigBlindAmount}
                      actionBetAmount={actionBetAmount}
                      handleButtonOnClick={this.handleActionButtonOnClick}
                      handleBetChange={this.handleBetChange}
                    />
                  )}

                  {index === 0 && gameStatus === 'showdown' && (
                    <Button
                      variant="outline-primary"
                      size="lg"
                      onClick={() => this.progressGame(isGameOver)}
                      className="align-self-start"
                    >
                      {isGameOver ? 'New Game' : 'Next Hand'}
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
