import React from 'react';
import { PlayerTab } from './PlayerTab';
import type { Player } from '@/types/poker';

interface PlayerListProps {
  players: Player[];
  activePlayer: string | null;
}

export const PlayerList: React.FC<PlayerListProps> = ({ players, activePlayer }) => {
  const getPlayerPosition = (index: number): string => {
    const positions = ['SB', 'BB', 'UTG', 'MP', 'CO', 'BTN'];
    return positions[index % positions.length];
  };

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-4xl mx-auto">
      {players.map((player, index) => (
        <PlayerTab
          key={player.id}
          player={player}
          position={getPlayerPosition(index)}
          isActive={player.id === activePlayer}
        />
      ))}
    </div>
  );
};