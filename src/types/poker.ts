// src/types/poker.ts

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  visibleTo?: string[]; // Array of player IDs who can see this card
}

export type PlayerAction = 'fold' | 'check' | 'call' | 'raise' | 'allin';

export interface BettingAction {
  type: PlayerAction;
  playerId: string;
  amount?: number;
}

export interface BettingRoundState {
  roundComplete: boolean;
  actionsThisRound: BettingAction[];
  lastAction?: BettingAction;
  roundStartPlayer: string;  // Player who starts the betting round
  currentPlayer: string;     // Current player to act
  playersActed: Set<string>;
  lastRaisePlayerId?: string;
  lastRaiseAmount: number;
  actionsNeeded: Set<string>; // Players who still need to act after last raise
  minRaise: number;
}

export interface HandState {
  handInProgress: boolean;
  blindsPosted: boolean;
  currentBettor?: string;
  lastRaiser?: string;
  minRaiseAmount: number;
  dealerPosition: number;
  smallBlindPosition: number;
  bigBlindPosition: number;
}

export interface AIPlayer extends Player {
  isAI: true;
  aiLevel: 'beginner' | 'intermediate' | 'advanced';
  aiStyle: 'tight' | 'loose' | 'aggressive' | 'passive';
}

export interface Player {
  id: string;
  name: string;
  stack: number;
  position: number;
  holeCards: Card[];
  isActive: boolean;         // Still in the hand (hasn't folded)
  hasActed: boolean;        // Has acted in current betting round
  betAmount: number;
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
  isAI?: boolean;
  aiLevel?: 'beginner' | 'intermediate' | 'advanced';
  aiStyle?: 'tight' | 'loose' | 'aggressive' | 'passive';
}

export type BettingRound = 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';

export interface GameState {
  players: Player[];
  communityCards: Card[];
  pot: number;
  activePlayerIndex: number;
  currentBettingRound: BettingRound;
  bettingRoundState: BettingRoundState;
  handState: HandState;
  minBet: number;
  currentBet: number;
  deck: Card[];
  isTrainingMode: boolean;
  lastAction?: string;
  bigBlind: number;
  smallBlind: number;
  showdown: boolean;
}

export interface ActionValidation {
  isValid: boolean;
  reason?: string;
  allowedActions: PlayerAction[];
  minBet?: number;
  maxBet?: number;
}