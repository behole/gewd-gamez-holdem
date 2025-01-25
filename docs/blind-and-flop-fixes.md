# Blind Posting and Flop Trigger Fixes

## Current Issues

1. Blind Order Incorrect
- Blinds not posting in correct sequence
- Dealer position may be incorrect

2. Flop Not Triggering
- Betting round not completing properly
- Action sequence after blinds may be incorrect

## Required Changes

### 1. Correct Blind Posting Sequence

```typescript
interface HandState {
  handInProgress: boolean;
  blindsPosted: boolean;
  currentBettor?: string;
  lastRaiser?: string;
  minRaiseAmount: number;
  dealerPosition: number;    // Track dealer position
  smallBlindPosition: number; // Track SB position
  bigBlindPosition: number;   // Track BB position
}

const postBlinds = (state: GameState): GameState => {
  const { players, smallBlind, bigBlind } = state;
  const dealerPos = players.findIndex(p => p.isDealer);
  const sbPos = (dealerPos + 1) % players.length;
  const bbPos = (sbPos + 1) % players.length;

  // Post small blind first
  const withSmallBlind = updatePlayerBet(state, sbPos, smallBlind);
  
  // Then post big blind
  const withBigBlind = updatePlayerBet(withSmallBlind, bbPos, bigBlind);

  // Action starts after big blind
  const firstToActPos = (bbPos + 1) % players.length;

  return {
    ...withBigBlind,
    currentBet: bigBlind,
    activePlayerIndex: firstToActPos,
    handState: {
      ...withBigBlind.handState,
      blindsPosted: true,
      dealerPosition: dealerPos,
      smallBlindPosition: sbPos,
      bigBlindPosition: bbPos
    },
    bettingRoundState: {
      ...withBigBlind.bettingRoundState,
      currentPlayer: players[firstToActPos].id,
      // Everyone after BB needs to act
      actionsNeeded: new Set(
        players
          .slice(firstToActPos)
          .concat(players.slice(0, firstToActPos))
          .filter(p => p.isActive)
          .map(p => p.id)
      )
    }
  };
};
```

### 2. Betting Round Completion Check

```typescript
const isBettingRoundComplete = (state: GameState): boolean => {
  const { players, currentBet, bettingRoundState } = state;
  const activePlayers = players.filter(p => p.isActive);

  // In preflop, everyone after BB must act
  if (state.currentBettingRound === 'preflop') {
    const bbPos = state.handState.bigBlindPosition;
    const playersAfterBB = players
      .slice(bbPos + 1)
      .concat(players.slice(0, bbPos + 1))
      .filter(p => p.isActive);

    const allPlayersAfterBBActed = playersAfterBB.every(p => 
      bettingRoundState.playersActed.has(p.id)
    );

    const allBetsMatched = activePlayers.every(p => 
      !p.isActive || p.betAmount === currentBet
    );

    return allPlayersAfterBBActed && allBetsMatched;
  }

  // For other streets
  const allPlayersActed = activePlayers.every(p => 
    bettingRoundState.playersActed.has(p.id)
  );
  const allBetsMatched = activePlayers.every(p => 
    !p.isActive || p.betAmount === currentBet
  );
  const noMoreActions = bettingRoundState.actionsNeeded.size === 0;

  return allPlayersActed && allBetsMatched && noMoreActions;
};
```

### 3. Action Processing

```typescript
const processAction = (
  state: GameState,
  playerIndex: number,
  action: PlayerAction,
  amount: number
): GameState => {
  const player = state.players[playerIndex];
  const isPreflop = state.currentBettingRound === 'preflop';
  const isRaise = amount > state.currentBet;

  // Update betting round state
  const newBettingRoundState = {
    ...state.bettingRoundState,
    playersActed: new Set([...state.bettingRoundState.playersActed, player.id])
  };

  if (isRaise) {
    // On raise, everyone except raiser needs to act
    newBettingRoundState.lastRaisePlayerId = player.id;
    newBettingRoundState.lastRaiseAmount = amount;
    newBettingRoundState.actionsNeeded = new Set(
      state.players
        .filter(p => p.isActive && p.id !== player.id)
        .map(p => p.id)
    );
  } else {
    newBettingRoundState.actionsNeeded.delete(player.id);
  }

  // Check round completion
  const roundComplete = isBettingRoundComplete({
    ...state,
    bettingRoundState: newBettingRoundState
  });

  return {
    ...state,
    bettingRoundState: {
      ...newBettingRoundState,
      roundComplete
    }
  };
};
```

## Implementation Steps

1. Update HandState:
   - Add position tracking
   - Improve blind posting sequence

2. Fix Betting Round Logic:
   - Special handling for preflop
   - Track actions after big blind
   - Proper round completion check

3. Improve Action Processing:
   - Handle raises correctly
   - Update action tracking
   - Check round completion

## Testing Scenarios

1. Blind Posting:
   - Verify dealer button moves correctly
   - Small blind posts first
   - Big blind posts second
   - Action starts after big blind

2. Preflop Action:
   - Everyone after BB must act
   - Round completes when all have acted
   - Bets must be matched

3. Post-Flop Action:
   - Action starts with small blind
   - Round completes when all have acted
   - Bets must be matched

This architecture ensures proper blind posting order and betting round completion, particularly for the preflop round.