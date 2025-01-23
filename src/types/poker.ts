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
  holeCards: Card[];
  position: number;
  isActive: boolean;
  isBetting: boolean;
  betAmount: number;
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
}

export type HandRank =
  | 'High Card'
  | 'Pair'
  | 'Two Pair'
  | 'Three of a Kind'
  | 'Straight'
  | 'Flush'
  | 'Full House'
  | 'Four of a Kind'
  | 'Straight Flush'
  | 'Royal Flush';

export interface HandStrength {
  rank: HandRank;
  percentage: number;
  description: string;
}

export type GamePhase = 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';

export type PlayerAction = 'fold' | 'check' | 'call' | 'bet' | 'raise' | 'all-in';

export interface GameState {
  players: Player[];
  communityCards: Card[];
  pot: number;
  currentPhase: GamePhase;
  activePlayer: string | null;
  lastAction?: {
    playerId: string;
    action: PlayerAction;
    amount?: number;
  };
  bigBlind: number;
  smallBlind: number;
  minRaise: number;
  isTrainingMode: boolean;
}

export interface GameAction {
  type: string;
  payload: any;
}