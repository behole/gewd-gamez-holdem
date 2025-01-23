import React from 'react';

interface PotOddsCalculatorProps {
  potSize: number;
  toCall: number;
}

export const PotOddsCalculator: React.FC<PotOddsCalculatorProps> = ({
  potSize,
  toCall,
}) => {
  // Calculate pot odds
  const potOdds = toCall / (potSize + toCall);
  const potOddsPercentage = Math.round(potOdds * 100);
  
  // Calculate implied odds
  const impliedOdds = Math.round((potSize / toCall) * 100) / 100;

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-3">Pot Odds Analysis</h3>
      
      <div className="space-y-4">
        {/* Pot Odds */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Pot Odds</span>
            <span>{potOddsPercentage}%</span>
          </div>
          <div className="relative h-2 bg-gray-600 rounded overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${potOddsPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            You need {potOddsPercentage}% equity to call
          </p>
        </div>

        {/* Implied Odds */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Implied Odds</span>
            <span>{impliedOdds}:1</span>
          </div>
          <p className="text-xs text-gray-400">
            Potential return for every $1 called
          </p>
        </div>

        {/* Quick Reference */}
        <div className="text-sm border-t border-gray-600 pt-2 mt-2">
          <h4 className="font-medium mb-1">Quick Reference</h4>
          <ul className="text-xs space-y-1 text-gray-400">
            <li>Flush Draw: ~35% equity</li>
            <li>Open-Ended Straight Draw: ~31% equity</li>
            <li>Top Pair: ~80% vs underpair</li>
            <li>Pocket Pair: ~80% vs overcards</li>
          </ul>
        </div>
      </div>
    </div>
  );
};