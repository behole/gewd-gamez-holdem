// src/types/poker.ts

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
}

export interface Player {
  id: string;
  name: string;
  stack: number;
  position: number;
  holeCards: Card[];
  isActive: boolean;
  isBetting: boolean;
  betAmount: number;
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
  isAI?: boolean;
  aiLevel?: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  aiStyle?: 'tight' | 'loose' | 'aggressive' | 'passive';
}

export type BettingRound = 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';

export interface GameState {
  players: Player[];
  communityCards: Card[];
  pot: number;
  activePlayerIndex: number;
  currentBettingRound: BettingRound;
  minBet: number;
  currentBet: number;
  deck: Card[];
  isTrainingMode: boolean;
  lastAction?: string;
  bigBlind: number;
  smallBlind: number;
}

export type PlayerAction = 'fold' | 'check' | 'call' | 'raise' | 'allin';

export interface GameAction {
  type: PlayerAction;
  playerId: string;
  amount?: number;
}