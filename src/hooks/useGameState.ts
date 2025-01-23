import { useState, useCallback } from 'react';
import type { GameState, Card, Player } from '@/types/poker';

const DEFAULT_PLAYERS: Player[] = [
  {
    id: 'human1',
    name: 'You',
    stack: 1000,
    position: 0,
    holeCards: [],
    isActive: true,
    isBetting: false,
    betAmount: 0,
    isDealer: true,
    isSmallBlind: false,
    isBigBlind: false,
    isAI: false
  },
  {
    id: 'ai1',
    name: 'AI Bob',
    stack: 1000,
    position: 1,
    holeCards: [],
    isActive: true,
    isBetting: false,
    betAmount: 0,
    isDealer: false,
    isSmallBlind: true,
    isBigBlind: false,
    isAI: true,
    aiLevel: 'beginner',
    aiStyle: 'tight'
  },
  {
    id: 'ai2',
    name: 'AI Alice',
    stack: 1000,
    position: 2,
    holeCards: [],
    isActive: true,
    isBetting: false,
    betAmount: 0,
    isDealer: false,
    isSmallBlind: false,
    isBigBlind: true,
    isAI: true,
    aiLevel: 'intermediate',
    aiStyle: 'aggressive'
  }
];

const initialState: GameState = {
  players: DEFAULT_PLAYERS,
  communityCards: [],
  pot: 0,
  activePlayerIndex: 0,
  currentBettingRound: 'preflop',
  minBet: 10,
  currentBet: 0,
  deck: [],
  isTrainingMode: false,
  bigBlind: 20,
  smallBlind: 10
};

export const useGameState = (customInitialState: Partial<GameState> = {}) => {
  const [gameState, setGameState] = useState<GameState>({
    ...initialState,
    ...customInitialState,
    players: customInitialState.players || DEFAULT_PLAYERS
  });

  const dealCards = useCallback((playerIndex: number, cards: Card[]) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player, index) =>
        index === playerIndex
          ? { ...player, holeCards: cards }
          : player
      )
    }));
  }, []);

  const dealCommunityCard = useCallback((card: Card) => {
    setGameState((prev) => ({
      ...prev,
      communityCards: [...prev.communityCards, card]
    }));
  }, []);

  const updatePlayerBet = useCallback((playerIndex: number, amount: number) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player, index) =>
        index === playerIndex
          ? {
              ...player,
              betAmount: amount,
              stack: player.stack - (amount - player.betAmount)
            }
          : player
      ),
      pot: prev.pot + (amount - prev.players[playerIndex].betAmount)
    }));
  }, []);

  const nextPlayer = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      activePlayerIndex: (prev.activePlayerIndex + 1) % prev.players.length
    }));
  }, []);

  const nextBettingRound = useCallback(() => {
    setGameState((prev) => {
      const rounds: Record<string, GameState['currentBettingRound']> = {
        'preflop': 'flop',
        'flop': 'turn',
        'turn': 'river',
        'river': 'showdown'
      };
      
      return {
        ...prev,
        currentBettingRound: rounds[prev.currentBettingRound] || 'showdown',
        players: prev.players.map(player => ({
          ...player,
          betAmount: 0
        }))
      };
    });
  }, []);

  return {
    gameState,
    dealCards,
    dealCommunityCard,
    updatePlayerBet,
    nextPlayer,
    nextBettingRound
  };
};