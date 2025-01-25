# Poker Game Flow Fixes

## Current Issues

1. Blind Posting and Initial Action
- Small and big blinds are not being posted at hand start
- Action incorrectly starts with button instead of after big blind
- No initial bet amounts for blinds

2. Action Flow Problems
- Action buttons immediately advance to next street
- No proper betting round completion check
- AI players are not taking actions
- No validation of action sequence

3. Card Visibility
- All hole cards are visible despite visibility property
- Need to verify card visibility implementation

## Required Changes

### 1. Hand Setup and Blinds

```typescript
interface HandState {
  // Track the state of the current hand
  handInProgress: boolean;
  blindsPosted: boolean;
  currentBettor?: string;  // ID of player who needs to act
  lastRaiser?: string;     // ID of last player who raised
  minRaiseAmount: number;
}

// Add to GameState
interface GameState {
  // ... existing properties
  handState: HandState;
}
```

#### Hand Start Sequence
1. Reset deck and shuffle
2. Post small blind automatically
3. Post big blind automatically
4. Deal cards
5. Start action after big blind

### 2. Betting Rounds

```typescript
interface BettingAction {
  type: 'fold' | 'check' | 'call' | 'raise';
  playerId: string;
  amount?: number;
}

interface BettingRoundState {
  // ... existing properties
  actionsThisRound: BettingAction[];
  lastAction?: BettingAction;
  roundStartPlayer: string;  // Player who starts the betting round
  currentPlayer: string;     // Current player to act
  roundComplete: boolean;    // Whether betting round is complete
}
```

#### Betting Round Flow
1. Start with player after big blind (preflop) or small blind (other rounds)
2. Track each player's action
3. Continue until:
   - All players have acted
   - All active players have either:
     * Called the current bet
     * Folded their hand
4. Only advance to next street when betting is complete

### 3. AI Player Actions

```typescript
interface AIPlayer extends Player {
  isAI: true;
  aiLevel: 'beginner' | 'intermediate' | 'advanced';
  aiStyle: 'tight' | 'loose' | 'aggressive' | 'passive';
}

interface AIDecision {
  action: PlayerAction;
  amount?: number;
}
```

#### AI Action Flow
1. When it's AI's turn:
   - Calculate pot odds
   - Evaluate hand strength
   - Consider position and previous actions
   - Make decision based on aiLevel and aiStyle
2. Execute AI action automatically
3. Continue to next player

### 4. Action Validation

```typescript
interface ActionValidation {
  isValid: boolean;
  reason?: string;
  allowedActions: PlayerAction[];
  minBet?: number;
  maxBet?: number;
}
```

#### Validation Rules
1. Player can only act on their turn
2. Actions must be valid for current state:
   - Can only check if no bets
   - Must at least call current bet
   - Raises must be at least min raise
3. Track betting round completion properly

## Implementation Steps

1. Update GameState:
```typescript
interface GameState {
  // ... existing
  handState: HandState;
  bettingRoundState: BettingRoundState;
}
```

2. Modify Hand Start Logic:
- Implement blind posting
- Set correct initial action position
- Deal cards with proper visibility

3. Update Betting Round Logic:
- Implement proper action validation
- Track betting round completion
- Only advance street when betting complete

4. Add AI Logic:
- Implement basic AI decision making
- Auto-execute AI actions
- Consider position and previous actions

5. Fix Card Visibility:
- Ensure PlayerTab respects card visibility
- Only show cards to proper players
- Handle showdown visibility

## Migration Strategy

1. Update type definitions
2. Implement hand setup sequence
3. Fix betting round progression
4. Add AI player logic
5. Update UI components
6. Test complete game flow

This architecture ensures proper Texas Hold'em rules are followed while maintaining clean separation of concerns and type safety.