# Gewd Gamez Hold'em

A minimalist, analytics-focused poker trainer for Texas Hold'em.

## Early MVP - v0.1.0

Current features:
- Basic game state management
- Player positions (BTN, SB, BB)
- AI Players with different skill levels and playing styles
- Community cards display
- Betting controls
- Training mode with:
  - Hand strength meter
  - Pot odds calculator
- Debug mode for development

### Components
- PokerTable: Main game component
- PlayerList: Manages player displays
- CommunityCards: Shows community cards
- PlayerControls: Betting interface
- HandStrengthMeter: Training tool for hand evaluation
- PotOddsCalculator: Training tool for betting decisions

### Tech Stack
- React
- TypeScript
- Vite
- Tailwind CSS
- Vitest for testing

## Running the Project

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Run tests:
```bash
npm test
```

## Next Steps
- [ ] Implement card dealing animations
- [ ] Add hand evaluation logic
- [ ] Implement AI decision making
- [ ] Add game statistics tracking
- [ ] Improve UI/UX with proper card symbols
- [ ] Add hand history and replay functionality
- [ ] Implement advanced training features

## Development Guidelines
- Use TypeScript for all new components
- Write tests for new features
- Follow the existing component structure
- Use Tailwind CSS for styling
- Keep accessibility in mind

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.