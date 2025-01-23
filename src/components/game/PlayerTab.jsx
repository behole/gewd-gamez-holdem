import React, { useState } from 'react';
import { BarChart2 } from 'lucide-react';
import { AdvancedPlayerStats } from '../analytics';

const PlayerTab = ({ 
  player,
  isActive,
  showAdvancedStats = false
}) => {
  const [showStats, setShowStats] = useState(false);
  
  return (
    <div className="mb-1">
      <div 
        className={`flex items-center justify-between p-2 ${
          isActive ? 'bg-slate-800' : 'bg-slate-900'
        } rounded-lg cursor-pointer hover:bg-slate-800 transition-colors`}
        onClick={() => setShowStats(!showStats)}
      >
        <div className="flex items-center space-x-3">
          {player.position && (
            <span className="flex items-center justify-center w-6 h-6 text-xs font-medium text-slate-200 bg-slate-700 rounded-full">
              {player.position}
            </span>
          )}
          <span className="text-slate-200 text-sm">${player.stack.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          {player.currentBet > 0 && (
            <span className="text-slate-400 text-sm">
              Bet: ${player.currentBet}
            </span>
          )}
          {player.lastAction && (
            <span className={`px-2 py-1 text-xs rounded ${
              player.lastAction === 'Fold' ? 'bg-red-900/50 text-red-200' :
              player.lastAction === 'Call' ? 'bg-blue-900/50 text-blue-200' :
              'bg-green-900/50 text-green-200'
            }`}>
              {player.lastAction}
            </span>
          )}
          <BarChart2 
            className={`w-4 h-4 ${showStats ? 'text-blue-400' : 'text-slate-500'}`}
          />
        </div>
      </div>
      
      {showStats && showAdvancedStats && <AdvancedPlayerStats stats={player.stats} />}
    </div>
  );
};

export default PlayerTab;