import React from 'react';
import PlayerTab from './PlayerTab';

const PlayerList = ({ players, showAdvancedStats }) => {
  return (
    <div className="mb-6 bg-slate-900/50 rounded-lg p-2">
      {players.map((player, index) => (
        <PlayerTab 
          key={index} 
          player={player}
          isActive={player.isActive}
          showAdvancedStats={showAdvancedStats}
        />
      ))}
    </div>
  );
};

export default PlayerList;