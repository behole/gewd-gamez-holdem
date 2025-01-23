import React, { useEffect } from 'react';
import { PlayerList } from './PlayerList';
import { CommunityCards } from './CommunityCards';
import { PlayerControls } from './PlayerControls';
import { HandStrengthMeter } from '../analytics/HandStrengthMeter';
import { PotOddsCalculator } from '../analytics/PotOddsCalculator';
import { useGameState } from '@/hooks/useGameState';
import { useHandStrength } from '@/hooks/useHandStrength';
import { usePotOdds } from '@/hooks/usePotOdds';
import { useDeck } from '@/hooks/useDeck';
import { usePlayerTurns } from '@/hooks/usePlayerTurns';
import type { GameState, PlayerAction } from '@/types/poker';

interface PokerTableProps {
  initialState?: Partial<GameState>;
  isTrainingMode?: boolean;
}

export const PokerTable: React.FC<PokerTableProps> = ({
  initialState = {},
  isTrainingMode = false,
}) => {
  const {
    gameState,
    startNewHand,
    dealCards,
    handlePlayerAction,
    advancePhase,
    toggleTrainingMode,
  } = useGameState();

  const { deck, shuffleDeck, dealCard, resetDeck } = useDeck();

  const {
    activePlayerIndex,
    currentBettingRound,
    isRoundComplete,
    nextTurn,
    startNewRound,
    getCurrentPlayer,
    canCheck,
  } = usePlayerTurns(
    gameState.players,
    gameState.currentPhase,
    gameState.players.findIndex((p) => p.isDealer)
  );

  const currentPlayer = getCurrentPlayer();

  // Calculate hand strength for the active player
  const handStrength = useHandStrength(
    currentPlayer?.holeCards || [],
    gameState.communityCards
  );

  // Calculate pot odds for the active player
  const potOdds = usePotOdds(
    gameState.pot,
    gameState.minRaise,
    currentPlayer?.holeCards || [],
    gameState.communityCards
  );

  // Start a new hand when the component mounts
  useEffect(() => {
    if (gameState.players.length === 0) {
      startNewHand();
    }
  }, [gameState.players.length, startNewHand]);

  // Handle round completion
  useEffect(() => {
    if (isRoundComplete) {
      if (gameState.players.filter((p) => p.isActive).length === 1) {
        // Only one player left - they win the pot
        handleWinner(gameState.players.find((p) => p.isActive)?.id);
      } else {
        // Move to next phase
        advancePhase();
        startNewRound();
      }
    }
  }, [isRoundComplete, gameState.players, advancePhase, startNewRound]);

  const handleAction = (action: PlayerAction, amount?: number) => {
    if (!currentPlayer) return;

    handlePlayerAction(currentPlayer.id, action, amount);
    nextTurn();
  };

  const handleWinner = (playerId?: string) => {
    // Handle pot distribution logic here
    if (playerId) {
      const winningPlayer = gameState.players.find((p) => p.id === playerId);
      if (winningPlayer) {
        // Update player stack
        winningPlayer.stack += gameState.pot;
        // Reset the game state for next hand
        startNewHand();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-6xl rounded-lg bg-gray-800 shadow-xl p-8">
        {/* Game Phase Indicator */}
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm font-medium px-3 py-1 bg-gray-700 rounded-full">
            {gameState.currentPhase.toUpperCase()}
          </div>
          {isTrainingMode && (
            <div className="text-sm bg-blue-500 px-3 py-1 rounded-full">
              Training Mode
            </div>
          )}
        </div>

        {/* Community Cards */}
        <CommunityCards cards={gameState.communityCards} />

        {/* Players */}
        <PlayerList
          players={gameState.players}
          activePlayer={currentPlayer?.id || null}
        />

        {/* Pot and Game Info */}
        <div className="text-center my-4">
          <span className="text-xl">
            Pot: ${gameState.pot.toLocaleString()}
          </span>
        </div>

        {/* Controls */}
        <PlayerControls
          onAction={handleAction}
          minBet={gameState.minRaise}
          pot={gameState.pot}
          isActive={!!currentPlayer}
          toCall={gameState.minRaise - (currentPlayer?.betAmount || 0)}
          canCheck={currentPlayer ? canCheck(currentPlayer) : false}
        />

        {/* Analytics (only shown in training mode) */}
        {isTrainingMode && currentPlayer && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <HandStrengthMeter
              holeCards={currentPlayer.holeCards}
              communityCards={gameState.communityCards}
            />
            <PotOddsCalculator
              pot={gameState.pot}
              toCall={gameState.minRaise - currentPlayer.betAmount}
            />
          </div>
        )}

        {/* Dev Controls - Remove in production */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => toggleTrainingMode()}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Toggle Training Mode
          </button>
          <button
            onClick={() => startNewHand()}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            New Hand
          </button>
        </div>
      </div>
    </div>
  );
};