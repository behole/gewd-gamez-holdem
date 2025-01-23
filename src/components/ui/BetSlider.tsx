import React from 'react';

interface BetSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

export const BetSlider: React.FC<BetSliderProps> = ({
  value,
  onChange,
  min,
  max
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  const quickBetOptions = [
    { label: '1/2 Pot', value: Math.floor(max / 4) },
    { label: 'Pot', value: Math.floor(max / 2) },
    { label: '2x Pot', value: max }
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Bet Amount</span>
        <span className="text-lg font-bold">${value}</span>
      </div>
      
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
      
      <div className="flex justify-between">
        <span className="text-sm text-gray-400">Min: ${min}</span>
        <span className="text-sm text-gray-400">Max: ${max}</span>
      </div>

      <div className="flex justify-between gap-2">
        {quickBetOptions.map((option) => (
          <button
            key={option.label}
            onClick={() => onChange(option.value)}
            className="flex-1 px-2 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};