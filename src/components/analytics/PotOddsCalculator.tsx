import React, { useMemo } from 'react';

interface PotOddsCalculatorProps {
  pot: number;
  toCall: number;
}

export const PotOddsCalculator: React.FC<PotOddsCalculatorProps> = ({
  pot,
  toCall,
}) => {
  const { potOdds, impliedOdds, recommendedAction } = useMemo(() => {
    // Calculate pot odds (cost to call / total pot after call)
    const potOdds = (toCall / (pot + toCall)) * 100;

    // Simplified implied odds calculation (just an example)
    const impliedOdds = (pot / toCall) * 100;

    // Basic recommendation logic
    const recommendedAction =
      impliedOdds > 20
        ? 'Call may be profitable with strong draws'
        : 'Fold unless you have a strong made hand';

    return {
      potOdds: Math.round(potOdds * 10) / 10,
      impliedOdds: Math.round(impliedOdds * 10) / 10,
      recommendedAction,
    };
  }, [pot, toCall]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-medium">Pot Odds Calculator</h3>

      {/* Current Situation */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-400">Pot Size:</div>
        <div>${pot.toLocaleString()}</div>
        <div className="text-gray-400">To Call:</div>
        <div>${toCall.toLocaleString()}</div>
      </div>

      {/* Odds Display */}
      <div className="space-y-2">
        <div>
          <div className="text-sm text-gray-400">Pot Odds</div>
          <div className="text-lg font-medium">{potOdds}%</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Implied Odds</div>
          <div className="text-lg font-medium">{impliedOdds}%</div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="space-y-1">
        <div className="text-sm text-gray-400">Recommendation</div>
        <div className="text-sm bg-gray-700 p-2 rounded">
          {recommendedAction}
        </div>
      </div>
    </div>
  );
};