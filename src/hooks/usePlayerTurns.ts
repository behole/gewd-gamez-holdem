import { useState, useCallback } from 'react';
import type { Player, GamePhase } from '@/types/poker';

interface UsePlayerTurnsReturn {
  activePlayerIndex: number;
  currentBettingRound: number;
  isRoundComplete: boolean;
  nextTurn: () => void;
  startNewRound: () => void;
  skipFoldedPlayers: () => void;
  getCurrentPlayer: () => Player | undefined;
  canCheck: (player: Player) => boolean;
}

export const usePlayerTurns = (
  players: Player[],
  currentPhase: GamePhase,
  dealerPosition: number
): UsePlayerTurnsReturn => {
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [currentBettingRound, setCurrentBettingRound] = useState<number>(0);
  const [isRoundComplete, setIsRoundComplete] = useState<boolean>(false);

  const getNextActivePlayerIndex = useCallback(
    (currentIndex: number): number => {
      let nextIndex = (currentIndex + 1) % players.length;
      while (
        nextIndex !== currentIndex &&
        (!players[nextIndex].isActive || players[nextIndex].stack === 0)
      ) {
        nextIndex = (nextIndex + 1) % players.length;
      }
      return nextIndex;
    },
    [players]
  );

  const nextTurn = useCallback(() => {
    const nextIndex = getNextActivePlayerIndex(activePlayerIndex);
    
    // If we've come full circle
    if (
      nextIndex === activePlayerIndex ||
      players.filter((p) => p.isActive && p.stack > 0).length <= 1
    ) {
      setIsRoundComplete(true);
      return;
    }

    setActivePlayerIndex(nextIndex);
  }, [activePlayerIndex, getNextActivePlayerIndex, players]);

  const startNewRound = useCallback(() => {
    // Determine starting position based on game phase
    let startingPosition: number;
    if (currentPhase === 'preflop') {
      // UTG position (3 spots after dealer)
      startingPosition = (dealerPosition + 3) % players.length;
    } else {
      // First active player after dealer
      startingPosition = (dealerPosition + 1) % players.length;
    }

    // Skip to first active player
    while (
      !players[startingPosition].isActive ||
      players[startingPosition].stack === 0
    ) {
      startingPosition = (startingPosition + 1) % players.length;
    }

    setActivePlayerIndex(startingPosition);
    setCurrentBettingRound((prev) => prev + 1);
    setIsRoundComplete(false);
  }, [currentPhase, dealerPosition, players]);

  const skipFoldedPlayers = useCallback(() => {
    let nextIndex = activePlayerIndex;
    while (!players[nextIndex].isActive || players[nextIndex].stack === 0) {
      nextIndex = (nextIndex + 1) % players.length;
      if (nextIndex === activePlayerIndex) {
        setIsRoundComplete(true);
        return;
      }
    }
    setActivePlayerIndex(nextIndex);
  }, [activePlayerIndex, players]);

  const getCurrentPlayer = useCallback(
    () => players[activePlayerIndex],
    [players, activePlayerIndex]
  );

  const canCheck = useCallback(
    (player: Player): boolean => {
      // Get the highest bet amount in the current round
      const highestBet = Math.max(...players.map((p) => p.betAmount));
      // Player can check if their bet equals the highest bet
      return player.betAmount === highestBet;
    },
    [players]
  );

  return {
    activePlayerIndex,
    currentBettingRound,
    isRoundComplete,
    nextTurn,
    startNewRound,
    skipFoldedPlayers,
    getCurrentPlayer,
    canCheck,
  };
};