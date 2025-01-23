import React, { useState } from 'react';
import { BetSlider } from '@/components/ui/BetSlider';
import type { PlayerAction } from '@/types/poker';

interface PlayerControlsProps {
  onAction: (action: PlayerAction, amount?: number) => void;
  currentBet: number;
  minBet: number;
  canCheck: boolean;
  playerStack: number;
  playerBet: number;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  onAction,
  currentBet,
  minBet,
  canCheck,
  playerStack,
  playerBet
}) => {
  const [showBetSlider, setShowBetSlider] = useState(false);
  const [betAmount, setBetAmount] = useState(minBet);

  const toCall = currentBet - playerBet;

  return (
    <div className="space-y-4">
      {showBetSlider ? (
        <div className="space-y-4">
          <BetSlider
            value={betAmount}
            onChange={setBetAmount}
            min={Math.max(minBet, toCall)}
            max={playerStack}
          />
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                onAction(toCall > 0 ? 'raise' : 'bet', betAmount);
                setShowBetSlider(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Confirm ${betAmount}
            </button>
            <button
              onClick={() => setShowBetSlider(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onAction('fold')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Fold
          </button>
          
          {canCheck ? (
            <button
              onClick={() => onAction('check')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Check
            </button>
          ) : (
            <button
              onClick={() => onAction('call')}
              disabled={playerStack < toCall}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Call ${toCall}
            </button>
          )}
          
          <button
            onClick={() => setShowBetSlider(true)}
            disabled={playerStack <= toCall}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {toCall > 0 ? 'Raise' : 'Bet'}
          </button>
        </div>
      )}
    </div>
  );
};