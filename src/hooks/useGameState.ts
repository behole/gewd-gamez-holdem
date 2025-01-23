import { useState, useCallback } from 'react';
import type { GameState, Player, Card, PlayerAction } from '@/types/poker';

const INITIAL_STATE: GameState = {
  players: [],
  communityCards: [],
  pot: 0,
  currentPhase: 'preflop',
  activePlayer: null,
  bigBlind: 100,
  smallBlind: 50,
  minRaise: 200,
  isTrainingMode: false,
};

interface UseGameStateReturn {
  gameState: GameState;
  startNewHand: () => void;
  dealCards: () => void;
  handlePlayerAction: (playerId: string, action: PlayerAction, amount?: number) => void;
  advancePhase: () => void;
  toggleTrainingMode: () => void;
}

export const useGameState = (): UseGameStateReturn => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  const startNewHand = useCallback(() => {
    setGameState((prev) => ({
      ...INITIAL_STATE,
      isTrainingMode: prev.isTrainingMode,
      players: prev.players.map((player) => ({
        ...player,
        holeCards: [],
        isActive: true,
        isBetting: false,
        betAmount: 0,
      })),
    }));
  }, []);

  const dealCards = useCallback(() => {
    // TODO: Implement card dealing logic
    setGameState((prev) => {
      // This is a placeholder that will be replaced with proper dealing logic
      const updatedPlayers = prev.players.map((player) => ({
        ...player,
        holeCards: [
          { suit: 'hearts', rank: 'A' },
          { suit: 'spades', rank: 'K' },
        ],
      }));

      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  }, []);

  const handlePlayerAction = useCallback(
    (playerId: string, action: PlayerAction, amount?: number) => {
      setGameState((prev) => {
        const playerIndex = prev.players.findIndex((p) => p.id === playerId);
        if (playerIndex === -1) return prev;

        const updatedPlayers = [...prev.players];
        const player = updatedPlayers[playerIndex];

        switch (action) {
          case 'fold':
            player.isActive = false;
            break;
          case 'check':
            // No changes needed for check
            break;
          case 'call':
            if (amount) {
              player.betAmount = amount;
              prev.pot += amount;
            }
            break;
          case 'bet':
          case 'raise':
            if (amount) {
              player.betAmount = amount;
              prev.pot += amount;
              prev.minRaise = amount * 2;
            }
            break;
          case 'all-in':
            player.betAmount = player.stack;
            prev.pot += player.stack;
            player.stack = 0;
            break;
        }

        return {
          ...prev,
          players: updatedPlayers,
          lastAction: {
            playerId,
            action,
            amount,
          },
        };
      });
    },
    []
  );

  const advancePhase = useCallback(() => {
    setGameState((prev) => {
      let nextPhase: GameState['currentPhase'] = prev.currentPhase;
      
      switch (prev.currentPhase) {
        case 'preflop':
          nextPhase = 'flop';
          break;
        case 'flop':
          nextPhase = 'turn';
          break;
        case 'turn':
          nextPhase = 'river';
          break;
        case 'river':
          nextPhase = 'showdown';
          break;
        case 'showdown':
          // Reset to preflop for new hand
          return { ...INITIAL_STATE, isTrainingMode: prev.isTrainingMode };
      }

      return {
        ...prev,
        currentPhase: nextPhase,
      };
    });
  }, []);

  const toggleTrainingMode = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isTrainingMode: !prev.isTrainingMode,
    }));
  }, []);

  return {
    gameState,
    startNewHand,
    dealCards,
    handlePlayerAction,
    advancePhase,
    toggleTrainingMode,
  };
};