import React from 'react';

const HandStrengthMeter = ({ 
  handStrength,
  potentialStrength,
  outs,
  equity
}) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-slate-200 text-sm">Current Hand Strength</span>
        <span className="text-slate-200 font-medium">{handStrength}%</span>
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full">
        <div 
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${handStrength}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-slate-200 text-sm">Potential Strength</span>
        <span className="text-slate-200 font-medium">{potentialStrength}%</span>
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full">
        <div 
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${potentialStrength}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <span className="text-slate-400 text-sm">Outs</span>
          <div className="text-slate-200 font-medium">{outs}</div>
        </div>
        <div>
          <span className="text-slate-400 text-sm">Equity</span>
          <div className="text-slate-200 font-medium">{equity}%</div>
        </div>
      </div>
    </div>
  );
};

export default HandStrengthMeter;