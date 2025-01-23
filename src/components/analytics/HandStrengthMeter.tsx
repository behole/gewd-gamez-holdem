import React, { useMemo } from 'react';
import type { Card, HandStrength } from '@/types/poker';

interface HandStrengthMeterProps {
  holeCards: Card[];
  communityCards: Card[];
}

export const HandStrengthMeter: React.FC<HandStrengthMeterProps> = ({
  holeCards,
  communityCards,
}) => {
  const handStrength: HandStrength = useMemo(() => {
    // TODO: Implement actual poker hand strength calculation
    // This is a placeholder that will be replaced with real calculations
    return {
      rank: 'High Card',
      percentage: 20,
      description: 'Ace High',
    };
  }, [holeCards, communityCards]);

  const getStrengthColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-green-400';
    if (percentage >= 40) return 'text-yellow-400';
    if (percentage >= 20) return 'text-red-400';
    return 'text-red-500';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-2">
      <h3 className="text-lg font-medium">Hand Strength</h3>
      
      {/* Current Hand */}
      <div className="space-y-1">
        <div className="text-sm text-gray-400">Current Hand</div>
        <div className="font-medium">{handStrength.rank}</div>
        <div className="text-sm">{handStrength.description}</div>
      </div>

      {/* Strength Meter */}
      <div className="space-y-1">
        <div className="text-sm text-gray-400">Win Probability</div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-full rounded-full ${getStrengthColor(
              handStrength.percentage
            )}`}
            style={{ width: `${handStrength.percentage}%` }}
          />
        </div>
        <div className={`text-sm ${getStrengthColor(handStrength.percentage)}`}>
          {handStrength.percentage}%
        </div>
      </div>

      {/* Possible Draws */}
      <div className="space-y-1">
        <div className="text-sm text-gray-400">Possible Draws</div>
        <div className="text-sm">
          {communityCards.length < 5
            ? 'Calculating possible draws...'
            : 'Final hand - no more draws possible'}
        </div>
      </div>
    </div>
  );
};