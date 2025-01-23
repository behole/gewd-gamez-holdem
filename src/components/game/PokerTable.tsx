import React, { useState } from 'react';
import { PlayerList } from './PlayerList';
import { CommunityCards } from './CommunityCards';
import { PlayerControls } from './PlayerControls';
import { HandStrengthMeter } from '@/components/analytics/HandStrengthMeter';
import { PotOddsCalculator } from '@/components/analytics/PotOddsCalculator';
import { useGameState } from '@/hooks/useGameState';
import { useBetting } from '@/hooks/useBetting';
import { HandEvaluator } from '@/utils/handEvaluator';
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
  const {
    gameState,
    dealCards,
    dealCommunityCard,
    updatePlayerBet,
    nextPlayer,
    nextBettingRound
  } = useGameState(initialState);

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
          />
        </div>

        {/* Controls */}
        <div className="mt-4">
          <PlayerControls
            onAction={(action: PlayerAction, amount?: number) => {
              console.log('Player action:', action, amount);
            }}
            currentBet={gameState.currentBet || 0}
            minBet={gameState.minBet || 10}
            canCheck={!gameState.currentBet}
            playerStack={gameState.players?.[gameState.activePlayerIndex]?.stack || 1000}
            playerBet={gameState.players?.[gameState.activePlayerIndex]?.betAmount || 0}
          />
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