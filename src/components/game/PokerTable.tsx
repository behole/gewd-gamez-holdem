import React, { useState } from 'react';
import { PlayerList } from './PlayerList';
import { CommunityCards } from './CommunityCards';
import { PlayerControls } from './PlayerControls';
import { HandStrengthMeter } from '@/components/analytics/HandStrengthMeter';
import { PotOddsCalculator } from '@/components/analytics/PotOddsCalculator';
import { useGameState } from '@/hooks/useGameState';
import { useDeck } from '@/hooks/useDeck';
import type { GameState, PlayerAction } from '@/types/poker';

interface PokerTableProps {
  initialState?: Partial<GameState>;
  isTrainingMode?: boolean;
}

export const PokerTable: React.FC<PokerTableProps> = ({
  initialState = {},
  isTrainingMode = false,
}) => {
  const [showDebug, setShowDebug] = useState(false);
  const { dealCards: dealFromDeck, shuffleDeck, resetDeck } = useDeck();
  const {
    gameState,
    dealCards,
    dealCommunityCard,
    updatePlayerBet,
    nextPlayer,
    endRound,
    startNewHand: startNewGameHand,
    handleAIAction
  } = useGameState(initialState);

  const startNewHand = React.useCallback(() => {
    // Reset and shuffle the deck
    resetDeck();
    shuffleDeck();
    
    // Start new hand (posts blinds)
    startNewGameHand();
    
    // Deal cards to players
    gameState.players.forEach((_, index) => {
      const cards = dealFromDeck(2);
      dealCards(index, cards);
    });
  }, [dealCards, dealFromDeck, resetDeck, shuffleDeck, startNewGameHand, gameState.players]);

  // Handle AI actions
  React.useEffect(() => {
    const currentPlayer = gameState.players[gameState.activePlayerIndex];
    if (currentPlayer?.isAI && gameState.handState.handInProgress) {
      // Add small delay for AI actions
      const timeoutId = setTimeout(() => {
        handleAIAction();
        nextPlayer();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [gameState.activePlayerIndex, gameState.players, gameState.handState.handInProgress, handleAIAction, nextPlayer]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-6xl rounded-lg bg-gray-800 shadow-xl p-8">
        {/* Debug Panel */}
        {import.meta.env.DEV && (
          <div className="mb-4">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full mb-2"
            >
              {showDebug ? 'Hide Debug' : 'Show Debug'}
            </button>
            {showDebug && (
              <div className="p-2 bg-gray-700 rounded text-xs overflow-auto max-h-48">
                <pre>{JSON.stringify({ gameState, isTrainingMode }, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* Game Phase Indicator */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex space-x-4 items-center">
            <div className="text-sm font-medium px-3 py-1 bg-gray-700 rounded-full">
              {gameState.currentBettingRound?.toUpperCase()}
            </div>
            <div className="text-sm text-gray-400">
              Pot: ${gameState.pot?.toLocaleString() || 0}
            </div>
          </div>
          {isTrainingMode && (
            <div className="text-sm bg-blue-500 px-3 py-1 rounded-full">
              Training Mode
            </div>
          )}
        </div>

        {/* Community Cards */}
        <CommunityCards cards={gameState.communityCards || []} />

        {/* Players */}
        <div className="my-8">
          <PlayerList
            players={gameState.players || []}
            activePlayerIndex={gameState.activePlayerIndex}
            currentPlayerId={gameState.players[0].id} // First player is always the human player
          />
        </div>

        {/* Game Controls */}
        <div className="mt-4">
          {!gameState.handState.handInProgress ? (
            <button
              onClick={startNewHand}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-colors"
            >
              Deal New Hand
            </button>
          ) : (
            <PlayerControls
              onAction={(action: PlayerAction, amount?: number) => {
                console.log('Player action:', action, amount);
                
                // Handle player action
                const currentPlayer = gameState.players[gameState.activePlayerIndex];
                let actionAmount: number;

                switch (action) {
                  case 'fold':
                    actionAmount = 0;
                    break;
                  case 'call':
                    actionAmount = gameState.currentBet;
                    break;
                  case 'check':
                    actionAmount = currentPlayer.betAmount; // Keep current bet
                    break;
                  case 'raise':
                  case 'allin':
                    actionAmount = amount || gameState.currentBet;
                    break;
                  default:
                    actionAmount = 0;
                }

                // Update bet and advance to next player
                updatePlayerBet(gameState.activePlayerIndex, actionAmount);
                nextPlayer();

                // Check if betting round is complete after the action
                if (gameState.bettingRoundState.roundComplete) {
                  // Deal community cards based on the current round before ending it
                  const currentRound = gameState.currentBettingRound;
                  if (currentRound === 'preflop') {
                    // Deal flop (3 cards)
                    const flopCards = dealFromDeck(3);
                    flopCards.forEach(card => dealCommunityCard(card));
                  } else if (currentRound === 'flop' || currentRound === 'turn') {
                    // Deal turn or river (1 card)
                    const card = dealFromDeck(1)[0];
                    dealCommunityCard(card);
                  }
                  endRound();
                }
              }}
              currentBet={gameState.currentBet || 0}
              minBet={gameState.minBet || 10}
              canCheck={!gameState.currentBet}
              playerStack={gameState.players?.[gameState.activePlayerIndex]?.stack || 1000}
              playerBet={gameState.players?.[gameState.activePlayerIndex]?.betAmount || 0}
            />
          )}
        </div>

        {/* Analytics (only shown in training mode) */}
        {isTrainingMode && gameState.players?.[gameState.activePlayerIndex] && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <HandStrengthMeter
              strength={0.75} // Placeholder value
            />
            <PotOddsCalculator
              potSize={gameState.pot || 0}
              toCall={gameState.currentBet - (gameState.players[gameState.activePlayerIndex]?.betAmount || 0)}
            />
          </div>
        )}
      </div>
    </div>
  );
};