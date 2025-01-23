import React from 'react';
import { PlayerTab } from './PlayerTab';
import type { Player } from '@/types/poker';

interface PlayerListProps {
  players: Player[];
  activePlayerIndex: number;
}

export const PlayerList: React.FC<PlayerListProps> = ({ players, activePlayerIndex }) => {
  const getPlayerPosition = (index: number): string => {
    const positions = ['BTN', 'SB', 'BB', 'UTG', 'MP', 'CO'];
    return positions[index % positions.length];
  };

  return (
    <div className="grid grid-cols-3 gap-4 my-8">
      {players.map((player, index) => (
        <PlayerTab
          key={player.id}
          player={player}
          position={getPlayerPosition(index)}
          isActive={index === activePlayerIndex}
        />
      ))}
    </div>
  );
};