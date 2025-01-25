# Poker Game Architecture Changes

## Current Issues

1. Card Visibility
- All active players' hole cards are visible to everyone
- No proper tracking of card visibility per player
- Community cards and hole cards treated the same way

2. Betting Rounds
- No proper validation of betting round completion
- Actions immediately advance to next street
- Missing proper Texas Hold'em betting structure

3. Game Flow
- Incorrect progression through streets
- Missing proper action tracking
- No validation of betting completion

## Proposed Changes

### 1. Data Structure Updates

```typescript
// Add visibility tracking to cards
interface Card {
  suit: Suit;
  rank: Rank;
  visibleTo?: string[]; // Array of player IDs who can see this card
}

// Add betting round state tracking
interface BettingRoundState {
  roundComplete: boolean;
  playersActed: Set<string>;  // Set of player IDs who have acted this round
  lastRaisePlayerId?: string; // Player who last raised, to track betting round completion
  currentBettor?: string;     // Current player who needs to act
  minRaise: number;           // Minimum raise amount
  lastRaise: number;          // Amount of the last raise
}

// Update GameState to include betting round state
interface GameState {
  // ... existing properties ...
  bettingRoundState: BettingRoundState;
}
```

### 2. Game Flow Changes

#### Betting Round Logic
1. A betting round continues until:
   - All players have acted
   - All active players have either:
     * Called the current bet
     * Folded their hand
2. Only advance to next street when betting is complete
3. Track the last raiser to know when betting round is complete

#### Card Visibility Rules
1. Hole Cards:
   - Only visible to the owner
   - Visible to all during showdown
2. Community Cards:
   - Always visible to all players
3. Folded hands:
   - Should be hidden/removed

### 3. Component Updates Needed

1. PlayerTab Component:
   - Only show hole cards if player.id matches current player
   - Add showdown state handling

2. PokerTable Component:
   - Add proper betting round validation
   - Only advance to next street when betting is complete
   - Handle showdown visibility

3. Game State Management:
   - Add betting round state tracking
   - Validate betting actions
   - Track player actions within rounds

## Implementation Steps

1. Update type definitions
2. Modify game state management
3. Update player action handling
4. Implement proper betting round validation
5. Fix card visibility in components
6. Add showdown handling

## Migration Strategy

1. Create new interfaces/types
2. Update game state management
3. Modify components to use new structures
4. Add validation logic
5. Test each betting round
6. Verify card visibility
7. Test complete game flow

This architecture ensures proper Texas Hold'em rules are followed while maintaining clean separation of concerns and type safety.