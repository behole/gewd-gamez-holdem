import React from 'react';

const PotOddsCalculator = ({
  potSize,
  betToCall,
  impliedOdds,
  recommendedAction
}) => {
  const potOdds = (betToCall / (potSize + betToCall)) * 100;
  const breakEvenEquity = (betToCall / (potSize + betToCall)) * 100;

  return (
    <div className="bg-slate-800 rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-slate-400 text-sm">Pot Odds</span>
          <div className="text-slate-200 font-medium">{potOdds.toFixed(1)}%</div>
        </div>
        <div>
          <span className="text-slate-400 text-sm">Required Equity</span>
          <div className="text-slate-200 font-medium">{breakEvenEquity.toFixed(1)}%</div>
        </div>
        <div>
          <span className="text-slate-400 text-sm">Implied Odds</span>
          <div className="text-slate-200 font-medium">${impliedOdds}</div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="text-slate-400 text-sm mb-2">Recommended Action</div>
        <div className={`text-sm font-medium px-3 py-2 rounded ${
          recommendedAction === 'Call' ? 'bg-blue-900/50 text-blue-200' :
          recommendedAction === 'Fold' ? 'bg-red-900/50 text-red-200' :
          'bg-green-900/50 text-green-200'
        }`}>
          {recommendedAction}
        </div>
      </div>
    </div>
  );
};

export default PotOddsCalculator;