import React from 'react';

const BetSlider = ({ 
  minBet, 
  maxBet, 
  currentBet, 
  onChange 
}) => {
  const presets = [
    { label: '1/2 Pot', value: Math.floor(maxBet * 0.5) },
    { label: '2/3 Pot', value: Math.floor(maxBet * 0.667) },
    { label: 'Pot', value: maxBet },
    { label: 'All In', value: maxBet }
  ];

  return (
    <div className="w-full max-w-md bg-slate-800 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-slate-200">Bet Amount: ${currentBet}</span>
      </div>

      <input 
        type="range"
        min={minBet}
        max={maxBet}
        value={currentBet}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
      />

      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onChange(preset.value)}
            className="px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded text-slate-200"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BetSlider;