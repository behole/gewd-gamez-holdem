# Poker Game Flow - Round 2 Fixes

## Current Issues

1. Card Visibility
- Other players' hole cards still visible despite visibleTo property
- PlayerTab component may not be properly checking card visibility

2. Action Amounts
- Call action has undefined amount
- Fold action has undefined amount
- Only raise action has proper amount

3. Game Progression
- Game not advancing after actions
- Betting round completion not triggering
- Player turns may not be advancing properly

## Required Changes

### 1. Fix Card Visibility

```typescript
// In PlayerTab.tsx
interface PlayerTabProps {
  player: Player;
  position: string;
  isActive: boolean;
  currentPlayerId: string; // Add this to know who's viewing
}

// Card visibility check
const canSeeCard = (card: Card): boolean => {
  return card.visibleTo?.includes(currentPlayerId) || 
         gameState.showdown;
};

// Card rendering
{player.holeCards.map((card, index) => (
  <div key={index} className="card">
    {canSeeCard(card) ? 
      `${card.rank}${card.suit.charAt(0)}` : 
      '?'
    }
  </div>
))}
```

### 2. Fix Action Amounts

```typescript
// In PokerTable.tsx
const handlePlayerAction = (action: PlayerAction, amount?: number) => {
  const currentPlayer = gameState.players[gameState.activePlayerIndex];
  let actionAmount: number;

  switch (action) {
    case 'fold':
      actionAmount = 0;
      break;
    case 'call':
      actionAmount = gameState.currentBet;
      break;
    case 'check':
      actionAmount = currentPlayer.betAmount; // Keep same bet
      break;
    case 'raise':
      actionAmount = amount || 0;
      break;
    default:
      actionAmount = 0;
  }

  updatePlayerBet(gameState.activePlayerIndex, actionAmount);
};
```

### 3. Fix Game Progression

```typescript
// In useGameState.ts
interface BettingRoundState {
  roundComplete: boolean;
  actionsThisRound: BettingAction[];
  lastAction?: BettingAction;
  roundStartPlayer: string;
  currentPlayer: string;
  playersActed: Set<string>;
  lastRaisePlayerId?: string;
  minRaise: number;
  lastRaise: number;
}

const isBettingRoundComplete = (state: GameState): boolean => {
  const activePlayers = state.players.filter(p => p.isActive);
  const allPlayersActed = activePlayers.every(p => 
    state.bettingRoundState.playersActed.has(p.id)
  );
  const allBetsMatched = activePlayers.every(p => 
    !p.isActive || p.betAmount === state.currentBet
  );
  const noMoreRaises = state.bettingRoundState.lastRaisePlayerId === undefined ||
    state.bettingRoundState.playersActed.has(state.bettingRoundState.lastRaisePlayerId);

  return allPlayersActed && allBetsMatched && noMoreRaises;
};
```

## Implementation Steps

1. Update PlayerTab:
   - Add currentPlayerId prop
   - Fix card visibility logic
   - Pass current player ID from PokerTable

2. Fix Action Handling:
   - Add handlePlayerAction function
   - Properly set action amounts
   - Update action logging

3. Improve Game Progression:
   - Enhance betting round completion check
   - Ensure player turns advance properly
   - Add debug logging for game state

4. Add State Validation:
   - Log state changes
   - Add invariant checks
   - Validate betting round completion

## Testing Scenarios

1. Card Visibility:
   - Verify own cards visible
   - Verify other players' cards hidden
   - Verify all cards visible in showdown

2. Action Flow:
   - Test fold action
   - Test call action
   - Test check action
   - Test raise action
   - Verify proper amounts for each

3. Game Progression:
   - Verify betting round completion
   - Verify street progression
   - Verify showdown reached properly

## Migration Strategy

1. Update PlayerTab first
2. Fix action handling
3. Improve game progression
4. Add validation and logging
5. Test complete game flow

This will ensure proper Texas Hold'em rules are followed while maintaining clean separation of concerns and type safety.