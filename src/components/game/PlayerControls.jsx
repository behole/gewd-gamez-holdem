import React, { useState } from 'react';
import BetSlider from '../ui/BetSlider';

const PlayerControls = ({
  cards,
  stack,
  currentBet,
  minBet,
  maxBet,
}) => {
  const [showBetControls, setShowBetControls] = useState(false);
  const [betAmount, setBetAmount] = useState(currentBet);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-800">
      <div className="max-w-4xl mx-auto">
        {showBetControls && (
          <div className="mb-4">
            <BetSlider
              minBet={minBet}
              maxBet={maxBet}
              currentBet={betAmount}
              onChange={setBetAmount}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          {/* Player cards */}
          <div className="flex space-x-2">
            {cards.map((card, index) => (
              <div key={index} 
                className="flex items-center justify-center w-16 h-24 text-2xl bg-slate-800 text-slate-200 rounded-lg border border-slate-700">
                {card}
              </div>
            ))}
          </div>

          {/* Player stack */}
          <div className="px-4 py-2 text-sm bg-slate-800 text-slate-200 rounded-lg">
            Stack: ${stack}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            <button className="px-6 py-2 text-white bg-red-900 hover:bg-red-800 rounded-lg transition-colors">
              Fold
            </button>
            <button className="px-6 py-2 text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors">
              Call
            </button>
            <button 
              className="px-6 py-2 text-white bg-green-900 hover:bg-green-800 rounded-lg transition-colors"
              onClick={() => setShowBetControls(!showBetControls)}
            >
              Raise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;