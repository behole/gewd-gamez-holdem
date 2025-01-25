import { useState, useCallback } from 'react';
import type {
  GameState,
  Card,
  Player,
  BettingRoundState,
  HandState,
  PlayerAction,
  BettingAction,
  BettingRound
} from '@/types/poker';

const DEFAULT_PLAYERS: Player[] = [
  {
    id: 'human1',
    name: 'You',
    stack: 1000,
    position: 0,
    holeCards: [],
    isActive: true,
    hasActed: false,
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
    hasActed: false,
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
    hasActed: false,
    betAmount: 0,
    isDealer: false,
    isSmallBlind: false,
    isBigBlind: true,
    isAI: true,
    aiLevel: 'intermediate',
    aiStyle: 'aggressive'
  }
];

const createInitialBettingRoundState = (firstPlayer: Player, players: Player[]): BettingRoundState => ({
  roundComplete: false,
  actionsThisRound: [],
  roundStartPlayer: firstPlayer.id,
  currentPlayer: firstPlayer.id,
  playersActed: new Set<string>(),
  minRaise: 20, // Default to big blind
  lastRaiseAmount: 0,
  actionsNeeded: new Set(
    players
      .filter(p => p.isActive && p.id !== firstPlayer.id)
      .map(p => p.id)
  ),
  lastRaisePlayerId: undefined
});

const createInitialHandState = (): HandState => ({
  handInProgress: false,
  blindsPosted: false,
  minRaiseAmount: 20, // Default to big blind
  dealerPosition: 0,
  smallBlindPosition: 1,
  bigBlindPosition: 2
});

const initialState: GameState = {
  players: DEFAULT_PLAYERS,
  communityCards: [],
  pot: 0,
  activePlayerIndex: 0,
  currentBettingRound: 'preflop',
  bettingRoundState: createInitialBettingRoundState(DEFAULT_PLAYERS[0], DEFAULT_PLAYERS),
  handState: createInitialHandState(),
  minBet: 10,
  currentBet: 0,
  deck: [],
  isTrainingMode: false,
  bigBlind: 20,
  smallBlind: 10,
  showdown: false
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
          ? {
              ...player,
              holeCards: cards.map(card => ({
                ...card,
                visibleTo: [player.id]
              }))
            }
          : player
      )
    }));
  }, []);

  const rotateDealer = useCallback(() => {
    setGameState((prev) => {
      const nextDealerIndex = (prev.players.findIndex(p => p.isDealer) + 1) % prev.players.length;
      const nextSmallBlindIndex = (nextDealerIndex + 1) % prev.players.length;
      const nextBigBlindIndex = (nextSmallBlindIndex + 1) % prev.players.length;

      // Find the player after the big blind to start the action
      const firstToActIndex = (nextBigBlindIndex + 1) % prev.players.length;
      const firstToAct = prev.players[firstToActIndex];

      return {
        ...prev,
        showdown: false,
        currentBet: 0,
        pot: 0,
        currentBettingRound: 'preflop',
        bettingRoundState: createInitialBettingRoundState(firstToAct, prev.players),
        handState: createInitialHandState(),
        players: prev.players.map((player, index) => ({
          ...player,
          isDealer: index === nextDealerIndex,
          isSmallBlind: index === nextSmallBlindIndex,
          isBigBlind: index === nextBigBlindIndex,
          isActive: true,
          hasActed: false,
          betAmount: 0,
          holeCards: []
        })),
      };
    });
  }, []);

  const isBettingRoundComplete = useCallback((state: GameState): boolean => {
    const activePlayers = state.players.filter(p => p.isActive);
    
    // In preflop, everyone after BB must act
    if (state.currentBettingRound === 'preflop') {
      const bbPos = state.handState.bigBlindPosition;
      const playersAfterBB = state.players
        .slice(bbPos + 1)
        .concat(state.players.slice(0, bbPos + 1))
        .filter(p => p.isActive);

      const allPlayersAfterBBActed = playersAfterBB.every(p =>
        state.bettingRoundState.playersActed.has(p.id)
      );

      const allBetsMatched = activePlayers.every(p =>
        !p.isActive || p.betAmount === state.currentBet
      );

      return allPlayersAfterBBActed && allBetsMatched;
    }

    // For other streets
    const allPlayersActed = activePlayers.every(p =>
      state.bettingRoundState.playersActed.has(p.id)
    );
    const allBetsMatched = activePlayers.every(p =>
      !p.isActive || p.betAmount === state.currentBet
    );
    const noMoreActions = state.bettingRoundState.actionsNeeded.size === 0;

    return allPlayersActed && allBetsMatched && noMoreActions;
  }, []);

  const dealCommunityCard = useCallback((card: Card) => {
    setGameState((prev) => ({
      ...prev,
      communityCards: [...prev.communityCards, {
        ...card,
        visibleTo: prev.players.map(p => p.id)
      }]
    }));
  }, []);

  const updatePlayerBet = useCallback((playerIndex: number, amount: number) => {
    setGameState((prev) => {
      const player = prev.players[playerIndex];
      const betDiff = amount - player.betAmount;
      const isRaise = amount > prev.currentBet;
      
      // Determine action type
      let actionType: PlayerAction;
      if (amount === 0) {
        actionType = 'fold';
      } else if (amount === prev.currentBet) {
        actionType = 'call';
      } else if (amount > prev.currentBet) {
        actionType = 'raise';
      } else {
        actionType = 'check';
      }

      // Create new action
      const action: BettingAction = {
        type: actionType,
        playerId: player.id,
        amount: amount
      };

      // Find next player to act
      let nextPlayerIndex = (playerIndex + 1) % prev.players.length;
      while (!prev.players[nextPlayerIndex].isActive) {
        nextPlayerIndex = (nextPlayerIndex + 1) % prev.players.length;
      }
      const nextPlayer = prev.players[nextPlayerIndex];
      
      // Update betting round state
      const newBettingRoundState = {
        ...prev.bettingRoundState,
        actionsThisRound: [...prev.bettingRoundState.actionsThisRound, action],
        lastAction: action,
        playersActed: new Set([...prev.bettingRoundState.playersActed, player.id]),
        currentPlayer: nextPlayer.id
      };

      // Handle raise
      if (isRaise) {
        newBettingRoundState.lastRaisePlayerId = player.id;
        newBettingRoundState.lastRaiseAmount = amount;
        // When someone raises, everyone else needs to act again
        newBettingRoundState.actionsNeeded = new Set(
          prev.players
            .filter(p => p.isActive && p.id !== player.id)
            .map(p => p.id)
        );
      } else {
        // Remove this player from actions needed
        newBettingRoundState.actionsNeeded.delete(player.id);
      }

      // Check if round is complete
      const isComplete = isBettingRoundComplete({
        ...prev,
        players: prev.players.map((p, index) =>
          index === playerIndex
            ? {
                ...p,
                betAmount: amount,
                stack: p.stack - betDiff,
                hasActed: true,
                isActive: actionType !== 'fold'
              }
            : p
        ),
        currentBet: Math.max(prev.currentBet, amount),
        bettingRoundState: newBettingRoundState
      });

      newBettingRoundState.roundComplete = isComplete;

      return {
        ...prev,
        currentBet: Math.max(prev.currentBet, amount),
        players: prev.players.map((p, index) =>
          index === playerIndex
            ? {
                ...p,
                betAmount: amount,
                stack: p.stack - betDiff,
                hasActed: true,
                isActive: actionType !== 'fold'
              }
            : p
        ),
        pot: prev.pot + betDiff,
        bettingRoundState: newBettingRoundState,
        handState: {
          ...prev.handState,
          currentBettor: nextPlayer.id,
          lastRaiser: isRaise ? player.id : prev.handState.lastRaiser
        }
      };
    });
  }, []);

  const nextPlayer = useCallback(() => {
    setGameState((prev) => {
      let nextIndex = (prev.activePlayerIndex + 1) % prev.players.length;
      
      // Skip folded players
      while (!prev.players[nextIndex].isActive) {
        nextIndex = (nextIndex + 1) % prev.players.length;
      }

      return {
        ...prev,
        activePlayerIndex: nextIndex
      };
    });
  }, []);

  const endRound = useCallback(() => {
    setGameState((prev) => {
      // Don't end round if betting isn't complete
      if (!isBettingRoundComplete(prev)) {
        return prev;
      }

      const rounds: Record<string, GameState['currentBettingRound']> = {
        'preflop': 'flop',
        'flop': 'turn',
        'turn': 'river',
        'river': 'showdown'
      };
      const nextRound = rounds[prev.currentBettingRound] || 'showdown';
      
      if (nextRound === 'showdown') {
        // Make all hole cards visible to everyone in showdown
        const allPlayerIds = prev.players.map(p => p.id);
        return {
          ...prev,
          currentBettingRound: nextRound,
          showdown: true,
          players: prev.players.map(player => ({
            ...player,
            betAmount: 0,
            hasActed: false,
            holeCards: player.holeCards.map(card => ({
              ...card,
              visibleTo: allPlayerIds
            }))
          }))
        };
      }

      // For non-showdown rounds, determine the first player to act (after small blind)
      const smallBlindIndex = prev.players.findIndex(p => p.isSmallBlind);
      const firstToActIndex = (smallBlindIndex + 1) % prev.players.length;
      const firstToAct = prev.players[firstToActIndex];

      return {
        ...prev,
        currentBettingRound: nextRound,
        players: prev.players.map(player => ({
          ...player,
          betAmount: 0,
          hasActed: false
        })),
        bettingRoundState: createInitialBettingRoundState(firstToAct, prev.players)
      };
    });
  }, [isBettingRoundComplete]);

  const postBlinds = useCallback((state: GameState): GameState => {
    const smallBlindPlayer = state.players.find(p => p.isSmallBlind);
    const bigBlindPlayer = state.players.find(p => p.isBigBlind);
    
    if (!smallBlindPlayer || !bigBlindPlayer) return state;

    const smallBlindIndex = state.players.indexOf(smallBlindPlayer);
    const bigBlindIndex = state.players.indexOf(bigBlindPlayer);

    // Post small blind
    const sbAction: BettingAction = {
      type: 'raise',
      playerId: smallBlindPlayer.id,
      amount: state.smallBlind
    };

    // Post big blind
    const bbAction: BettingAction = {
      type: 'raise',
      playerId: bigBlindPlayer.id,
      amount: state.bigBlind
    };

    // Find first player to act (after big blind)
    const firstToActIndex = (bigBlindIndex + 1) % state.players.length;
    const firstToAct = state.players[firstToActIndex];

    // Create set of players who need to act (everyone after BB)
    const actionsNeeded = new Set<string>();
    let currentIndex = firstToActIndex;
    while (currentIndex !== bigBlindIndex) {
      const player = state.players[currentIndex];
      if (player.isActive) {
        actionsNeeded.add(player.id);
      }
      currentIndex = (currentIndex + 1) % state.players.length;
    }

    return {
      ...state,
      currentBet: state.bigBlind,
      pot: state.smallBlind + state.bigBlind,
      players: state.players.map((p, i) => {
        if (i === smallBlindIndex) {
          return {
            ...p,
            betAmount: state.smallBlind,
            stack: p.stack - state.smallBlind,
            hasActed: true
          };
        }
        if (i === bigBlindIndex) {
          return {
            ...p,
            betAmount: state.bigBlind,
            stack: p.stack - state.bigBlind,
            hasActed: true
          };
        }
        return p;
      }),
      bettingRoundState: {
        ...state.bettingRoundState,
        actionsThisRound: [sbAction, bbAction],
        currentPlayer: firstToAct.id,
        playersActed: new Set([smallBlindPlayer.id, bigBlindPlayer.id]),
        actionsNeeded
      },
      handState: {
        ...state.handState,
        blindsPosted: true,
        currentBettor: firstToAct.id,
        lastRaiser: bigBlindPlayer.id
      }
    };
  }, []);

  const handleAIAction = useCallback(() => {
    setGameState((prev) => {
      const currentPlayer = prev.players[prev.activePlayerIndex];
      if (!currentPlayer.isAI) return prev;

      // Simple AI logic - just call any bet for now
      const callAmount = prev.currentBet;
      
      return {
        ...prev,
        players: prev.players.map((p, i) =>
          i === prev.activePlayerIndex
            ? {
                ...p,
                betAmount: callAmount,
                stack: p.stack - (callAmount - p.betAmount),
                hasActed: true
              }
            : p
        ),
        pot: prev.pot + (callAmount - currentPlayer.betAmount),
        bettingRoundState: {
          ...prev.bettingRoundState,
          actionsThisRound: [
            ...prev.bettingRoundState.actionsThisRound,
            { type: 'call', playerId: currentPlayer.id, amount: callAmount }
          ],
          playersActed: new Set([...prev.bettingRoundState.playersActed, currentPlayer.id])
        }
      };
    });
  }, []);

  const startNewHand = useCallback(() => {
    setGameState((prev) => {
      // Start with a fresh state
      let newState: GameState = {
        ...prev,
        communityCards: [] as Card[],
        pot: 0,
        currentBet: 0,
        currentBettingRound: 'preflop' as BettingRound,
        handState: {
          ...createInitialHandState(),
          handInProgress: true
        }
      };

      // Rotate dealer positions
      const nextDealerIndex = (prev.players.findIndex(p => p.isDealer) + 1) % prev.players.length;
      const nextSmallBlindIndex = (nextDealerIndex + 1) % prev.players.length;
      const nextBigBlindIndex = (nextSmallBlindIndex + 1) % prev.players.length;

      // Update player positions
      newState.players = prev.players.map((player, index) => ({
        ...player,
        isDealer: index === nextDealerIndex,
        isSmallBlind: index === nextSmallBlindIndex,
        isBigBlind: index === nextBigBlindIndex,
        isActive: true,
        hasActed: false,
        betAmount: 0,
        holeCards: []
      }));

      // Set up initial betting round state
      const firstToActIndex = (nextBigBlindIndex + 1) % prev.players.length;
      const firstToAct = newState.players[firstToActIndex];
      newState.bettingRoundState = createInitialBettingRoundState(firstToAct, newState.players);

      // Post blinds
      newState = postBlinds(newState);

      return newState;
    });
  }, [postBlinds]);

  return {
    gameState,
    dealCards,
    dealCommunityCard,
    updatePlayerBet,
    nextPlayer,
    endRound,
    startNewHand,
    handleAIAction,
    rotateDealer
  };
};