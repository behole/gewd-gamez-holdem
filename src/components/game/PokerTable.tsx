import React, { useEffect, useState } from 'react';
import type { GameState, Player, Card } from '@/types/poker';
import { PlayerList } from './PlayerList';
import { CommunityCards } from './CommunityCards';
import { PlayerControls } from './PlayerControls';
import { HandStrengthMeter } from '../analytics/HandStrengthMeter';
import { PotOddsCalculator } from '../analytics/PotOddsCalculator';

interface PokerTableProps {
  initialState?: Partial<GameState>;
  isTrainingMode?: boolean;
}

export const PokerTable: React.FC<PokerTableProps> = ({
  initialState = {},
  isTrainingMode = false,
}) => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    communityCards: [],
    pot: 0,
    currentPhase: 'preflop',
    activePlayer: null,
    bigBlind: 100,
    smallBlind: 50,
    minRaise: 200,
    isTrainingMode,
    ...initialState,
  });

  const handlePlayerAction = (
    playerId: string,
    action: string,
    amount?: number
  ) => {
    // Implementation coming soon
    console.log('Player action:', { playerId, action, amount });
  };

  useEffect(() => {
    if (isTrainingMode) {
      // Training mode specific logic
    }
  }, [isTrainingMode]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-6xl rounded-lg bg-gray-800 shadow-xl p-8">
        {/* Training mode indicator */}
        {isTrainingMode && (
          <div className="mb-4 text-sm bg-blue-500 text-white px-3 py-1 rounded-full inline-block">
            Training Mode
          </div>
        )}

        {/* Game content */}
        <div className="space-y-8">
          {/* Community cards */}
          <CommunityCards cards={gameState.communityCards} />

          {/* Players */}
          <PlayerList
            players={gameState.players}
            activePlayer={gameState.activePlayer}
          />

          {/* Pot and game info */}
          <div className="text-center">
            <span className="text-xl">
              Pot: ${gameState.pot.toLocaleString()}
            </span>
          </div>

          {/* Controls */}
          <PlayerControls
            onAction={handlePlayerAction}
            minBet={gameState.bigBlind}
            pot={gameState.pot}
            isActive={!!gameState.activePlayer}
          />

          {/* Analytics (only shown in training mode) */}
          {isTrainingMode && (
            <div className="mt-6 grid grid-cols-2 gap-4">
              <HandStrengthMeter
                holeCards={
                  gameState.players.find(
                    (p) => p.id === gameState.activePlayer
                  )?.holeCards || []
                }
                communityCards={gameState.communityCards}
              />
              <PotOddsCalculator
                pot={gameState.pot}
                toCall={gameState.bigBlind}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};