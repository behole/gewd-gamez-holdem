# Betting Round Completion Fixes

## Current Issues

1. Betting Round Not Completing
- Players can bet correctly
- AI players act in order
- Round doesn't advance after all players act

## Root Causes

1. Round Completion Detection
```typescript
// Current check might be too simple
const isBettingRoundComplete = (state: GameState): boolean => {
  const activePlayers = state.players.filter(p => p.isActive);
  const allPlayersActed = activePlayers.every(p => p.hasActed);
  const allBetsEqual = activePlayers.every(p => 
    !p.isActive || p.betAmount === state.currentBet
  );
  return allPlayersActed && allBetsEqual;
};
```

2. Missing Last Action Tracking
- Need to track who was last to raise
- Need to ensure everyone after the last raise has acted

## Required Changes

### 1. Enhanced Betting Round State

```typescript
interface BettingRoundState {
  roundComplete: boolean;
  actionsThisRound: BettingAction[];
  lastAction?: BettingAction;
  roundStartPlayer: string;  // Player who starts the betting round
  currentPlayer: string;     // Current player to act
  playersActed: Set<string>;
  lastRaisePlayerId?: string;
  lastRaiseAmount: number;
  actionsNeeded: Set<string>; // Players who still need to act after last raise
}
```

### 2. Improved Round Completion Check

```typescript
const isBettingRoundComplete = (state: GameState): boolean => {
  // If no raise has happened, everyone just needs to act once
  if (!state.bettingRoundState.lastRaisePlayerId) {
    return state.players
      .filter(p => p.isActive)
      .every(p => state.bettingRoundState.playersActed.has(p.id));
  }

  // If there was a raise, everyone after the raise needs to act
  return state.bettingRoundState.actionsNeeded.size === 0 &&
         state.players
           .filter(p => p.isActive)
           .every(p => p.betAmount === state.currentBet);
};
```

### 3. Action Processing Logic

```typescript
const processPlayerAction = (
  state: GameState,
  playerId: string,
  action: PlayerAction,
  amount: number
): GameState => {
  const isRaise = amount > state.currentBet;
  const newState = { ...state };

  if (isRaise) {
    // On raise, everyone except the raiser needs to act again
    newState.bettingRoundState.lastRaisePlayerId = playerId;
    newState.bettingRoundState.lastRaiseAmount = amount;
    newState.bettingRoundState.actionsNeeded = new Set(
      state.players
        .filter(p => p.isActive && p.id !== playerId)
        .map(p => p.id)
    );
  } else {
    // Remove this player from actions needed
    newState.bettingRoundState.actionsNeeded.delete(playerId);
  }

  // Record the action
  newState.bettingRoundState.playersActed.add(playerId);
  newState.bettingRoundState.actionsThisRound.push({
    type: action,
    playerId,
    amount
  });

  // Check if round is complete
  newState.bettingRoundState.roundComplete = isBettingRoundComplete(newState);

  return newState;
};
```

### 4. Round Start Logic

```typescript
const startBettingRound = (state: GameState): GameState => {
  const newState = { ...state };
  
  // Clear previous round state
  newState.bettingRoundState = {
    roundComplete: false,
    actionsThisRound: [],
    playersActed: new Set(),
    actionsNeeded: new Set(),
    roundStartPlayer: getFirstToAct(state).id,
    currentPlayer: getFirstToAct(state).id,
    lastRaiseAmount: state.currentBet
  };

  return newState;
};
```

## Implementation Steps

1. Update GameState Types:
   - Add new BettingRoundState properties
   - Update state initialization

2. Enhance Action Processing:
   - Track raises properly
   - Update actionsNeeded set
   - Check round completion

3. Fix Round Progression:
   - Clear state between rounds
   - Set proper starting positions
   - Handle blind posting

4. Add Debug Logging:
   - Log betting round state changes
   - Track player actions
   - Monitor round completion

## Testing Scenarios

1. Basic Betting Round:
   - All players call
   - Round should complete
   - Advance to next street

2. Raise Scenario:
   - Player raises
   - Everyone must act again
   - Round completes after all act

3. Multiple Raise Scenario:
   - Multiple raises
   - Track last raiser
   - Ensure all players after last raise act

This architecture ensures proper betting round completion while maintaining clean separation of concerns and type safety.