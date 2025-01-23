import React, { useState } from 'react';
import { BetSlider } from '../ui/BetSlider';
import type { PlayerAction } from '@/types/poker';

interface PlayerControlsProps {
  onAction: (action: PlayerAction, amount?: number) => void;
  minBet: number;
  pot: number;
  isActive: boolean;
  toCall?: number;
  canCheck?: boolean;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  onAction,
  minBet,
  pot,
  isActive,
  toCall = 0,
  canCheck = true,
}) => {
  const [betAmount, setBetAmount] = useState<number>(minBet);
  const [showBetSlider, setShowBetSlider] = useState<boolean>(false);

  const handleAction = (action: PlayerAction) => {
    if (action === 'bet' || action === 'raise') {
      setShowBetSlider(true);
      return;
    }

    onAction(action);
    setShowBetSlider(false);
  };

  const handleBetConfirm = () => {
    onAction('bet', betAmount);
    setShowBetSlider(false);
  };

  const handleBetCancel = () => {
    setBetAmount(minBet);
    setShowBetSlider(false);
  };

  if (!isActive) {
    return (
      <div className="text-center text-gray-500 italic">
        Waiting for your turn...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showBetSlider ? (
        <div className="space-y-4">
          <BetSlider
            value={betAmount}
            onChange={setBetAmount}
            min={minBet}
            max={pot * 2}
          />
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleBetConfirm}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Confirm ${betAmount}
            </button>
            <button
              onClick={handleBetCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleAction('fold')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Fold
          </button>
          {canCheck ? (
            <button
              onClick={() => handleAction('check')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Check
            </button>
          ) : (
            <button
              onClick={() => handleAction('call')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Call ${toCall}
            </button>
          )}
          <button
            onClick={() => handleAction('bet')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {toCall > 0 ? 'Raise' : 'Bet'}
          </button>
        </div>
      )}
    </div>
  );
};