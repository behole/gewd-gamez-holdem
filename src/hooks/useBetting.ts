import { useState, useCallback } from 'react';
import type { Player, PlayerAction } from '@/types/poker';

interface BettingState {
  pot: number;
  currentBet: number;
  minRaise: number;
  lastRaise: number;
  roundComplete: boolean;
}

interface BettingAction {
  playerId: string;
  action: PlayerAction;
  amount?: number;
}

export const useBetting = (players: Player[], smallBlind: number = 10) => {
  const [bettingState, setBettingState] = useState<BettingState>({
    pot: 0,
    currentBet: 0,
    minRaise: smallBlind * 2,
    lastRaise: 0,
    roundComplete: false
  });

  const handleAction = useCallback((action: BettingAction) => {
    setBettingState(prev => {
      const player = players.find(p => p.id === action.playerId);
      if (!player) return prev;

      let newState = { ...prev };
      let amount = 0;

      switch (action.action) {
        case 'fold':
          player.isActive = false;
          break;

        case 'check':
          if (prev.currentBet > player.betAmount) {
            console.error('Invalid check - must call or fold');
            return prev;
          }
          break;

        case 'call':
          amount = prev.currentBet - player.betAmount;
          if (amount > player.stack) {
            amount = player.stack;
          }
          player.stack -= amount;
          player.betAmount += amount;
          newState.pot += amount;
          break;

        case 'raise':
          if (!action.amount || action.amount < prev.currentBet * 2) {
            console.error('Invalid raise amount');
            return prev;
          }
          amount = action.amount - player.betAmount;
          if (amount > player.stack) {
            console.error('Not enough chips to raise');
            return prev;
          }
          player.stack -= amount;
          player.betAmount += amount;
          newState.currentBet = action.amount;
          newState.lastRaise = action.amount - prev.currentBet;
          newState.minRaise = prev.currentBet + newState.lastRaise;
          newState.pot += amount;
          break;

        case 'allin':
          amount = player.stack;
          player.betAmount += amount;
          player.stack = 0;
          if (player.betAmount > prev.currentBet) {
            newState.currentBet = player.betAmount;
            newState.lastRaise = player.betAmount - prev.currentBet;
            newState.minRaise = prev.currentBet + newState.lastRaise;
          }
          newState.pot += amount;
          break;
      }

      // Check if round is complete
      const activePlayers = players.filter(p => p.isActive);
      if (activePlayers.length === 1) {
        newState.roundComplete = true;
      } else {
        const allPlayersActed = activePlayers.every(p => 
          p.betAmount === newState.currentBet || p.stack === 0
        );
        if (allPlayersActed) {
          newState.roundComplete = true;
        }
      }

      return newState;
    });
  }, [players]);

  return {
    bettingState,
    handleAction
  };
};

export default useBetting;