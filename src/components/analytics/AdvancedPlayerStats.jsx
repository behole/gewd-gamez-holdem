import React from 'react';

const AdvancedPlayerStats = ({ stats }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-slate-400 text-sm">Aggression Factor</span>
          <div className="text-slate-200 font-medium">{stats.aggressionFactor}</div>
        </div>
        <div>
          <span className="text-slate-400 text-sm">Fold to 3-Bet</span>
          <div className="text-slate-200 font-medium">{stats.foldTo3Bet}%</div>
        </div>
        <div>
          <span className="text-slate-400 text-sm">Went to Showdown</span>
          <div className="text-slate-200 font-medium">{stats.wtsd}%</div>
        </div>
        <div>
          <span className="text-slate-400 text-sm">Won $ Without Showdown</span>
          <div className="text-slate-200 font-medium">{stats.wwsf}%</div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPlayerStats;