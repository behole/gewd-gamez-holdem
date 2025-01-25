import React from 'react';
import type { Player, Card } from '@/types/poker';

interface PlayerTabProps {
  player: Player;
  position: string;
  isActive: boolean;
  currentPlayerId: string;
}

export const PlayerTab: React.FC<PlayerTabProps> = ({
  player,
  position,
  isActive,
  currentPlayerId,
}) => {
  const getStatusIndicator = () => {
    if (!player.isActive) return 'bg-red-500'; // Folded
    if (isActive) return 'bg-green-500'; // Active turn
    if (player.hasActed) return 'bg-yellow-500'; // Has acted this round
    return 'bg-gray-500'; // Waiting to act
  };

  const getPositionClass = () => {
    switch (position) {
      case 'BTN':
        return 'bg-purple-600';
      case 'SB':
        return 'bg-blue-600';
      case 'BB':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const canSeeCard = (card: Card) => {
    return card.visibleTo?.includes(currentPlayerId) || false;
  };

  return (
    <div className={`relative rounded-lg p-4 ${isActive ? 'bg-gray-700 ring-2 ring-green-500' : 'bg-gray-800'}`}>
      {/* Status indicator */}
      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getStatusIndicator()}`} />

      {/* Player info */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">{player.name}</span>
          <span className={`text-xs px-2 py-1 rounded ${getPositionClass()} text-white`}>
            {position}
          </span>
        </div>

        {/* Stack size */}
        <div className="text-sm text-gray-300">
          ${player.stack.toLocaleString()}
        </div>

        {/* Hole cards */}
        <div className="flex space-x-2">
          {player.holeCards.map((card, index) => (
            <div
              key={index}
              className="w-8 h-12 bg-white rounded flex items-center justify-center text-black"
            >
              {canSeeCard(card) ? `${card.rank}${card.suit.charAt(0)}` : '?'}
            </div>
          ))}
        </div>

        {/* Current bet */}
        {player.betAmount > 0 && (
          <div className="text-sm text-yellow-400">
            Bet: ${player.betAmount.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};