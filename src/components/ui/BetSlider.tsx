import React, { useCallback } from 'react';

interface BetSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}

export const BetSlider: React.FC<BetSliderProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
}) => {
  const handleQuickBet = useCallback(
    (percentage: number) => {
      const newValue = Math.floor((max - min) * (percentage / 100) + min);
      onChange(newValue);
    },
    [max, min, onChange]
  );

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-gray-400">
        <span>${min}</span>
        <span>${max}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #10B981 0%, #10B981 ${percentage}%, #374151 ${percentage}%, #374151 100%)`,
        }}
      />
      <div className="flex justify-between space-x-2">
        {[25, 50, 75, 100].map((percent) => (
          <button
            key={percent}
            onClick={() => handleQuickBet(percent)}
            className="flex-1 px-2 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            {percent}%
          </button>
        ))}
      </div>
      <div className="text-center text-lg">
        Current bet: ${value.toLocaleString()}
      </div>
    </div>
  );
};