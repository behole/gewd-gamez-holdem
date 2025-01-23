import React from 'react';

interface HandStrengthMeterProps {
  strength: number; // 0 to 1
}

export const HandStrengthMeter: React.FC<HandStrengthMeterProps> = ({ strength }) => {
  // Convert strength to percentage and color
  const percentage = Math.round(strength * 100);
  const getColor = (value: number): string => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-green-400';
    if (value >= 40) return 'bg-yellow-500';
    if (value >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-2">Hand Strength</h3>
      <div className="relative h-4 bg-gray-600 rounded overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-300 ${getColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-sm">
        <span>{percentage}%</span>
        <span className="text-gray-400">
          {percentage >= 80 ? 'Monster' :
           percentage >= 60 ? 'Strong' :
           percentage >= 40 ? 'Decent' :
           percentage >= 20 ? 'Weak' :
           'Very Weak'}
        </span>
      </div>
    </div>
  );
};