import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PokerTable } from './PokerTable';
import type { GameState, Card, Suit, Rank } from '@/types/poker';

describe('PokerTable', () => {
  const createCard = (suit: Suit, rank: Rank): Card => ({ suit, rank });

  const mockInitialState: Partial<GameState> = {
    players: [
      {
        id: '1',
        name: 'Player 1',
        stack: 1000,
        holeCards: [
          createCard('hearts', 'A'),
          createCard('diamonds', 'K'),
        ],
        position: 0,
        isActive: true,
        isBetting: false,
        betAmount: 0,
        isDealer: true,
        isSmallBlind: false,
        isBigBlind: false,
      },
      {
        id: '2',
        name: 'Player 2',
        stack: 1000,
        holeCards: [
          createCard('clubs', 'Q'),
          createCard('spades', 'J'),
        ],
        position: 1,
        isActive: true,
        isBetting: false,
        betAmount: 0,
        isDealer: false,
        isSmallBlind: true,
        isBigBlind: false,
      },
    ],
    communityCards: [],
    pot: 0,
    currentBettingRound: 'preflop',
    activePlayerIndex: 0,
    minBet: 10,
    currentBet: 0,
    deck: [],
    isTrainingMode: false,
  };

  it('renders the poker table with initial state', () => {
    render(<PokerTable initialState={mockInitialState} />);
    expect(screen.getByText('PREFLOP')).toBeInTheDocument();
    expect(screen.getByText('Pot: $0')).toBeInTheDocument();
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
  });

  it('displays training mode elements when enabled', () => {
    render(<PokerTable initialState={{ ...mockInitialState, isTrainingMode: true }} />);
    expect(screen.getByText('Training Mode')).toBeInTheDocument();
    expect(screen.getByText('Hand Strength')).toBeInTheDocument();
  });

  it('handles player actions correctly', async () => {
    render(<PokerTable initialState={mockInitialState} />);
    
    const betButton = screen.getByText('Bet');
    fireEvent.click(betButton);

    const slider = await screen.findByRole('slider');
    expect(slider).toBeInTheDocument();

    fireEvent.change(slider, { target: { value: '100' } });
    
    const confirmButton = screen.getByText('Confirm $100');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText('Pot: $100')).toBeInTheDocument();
    });
  });

  it('advances game phases correctly', async () => {
    render(<PokerTable initialState={mockInitialState} />);

    const checkButton = screen.getByText('Check');
    fireEvent.click(checkButton);

    await waitFor(() => {
      expect(screen.getByText('FLOP')).toBeInTheDocument();
    });
  });

  it('handles fold action and advances to next hand', async () => {
    render(<PokerTable initialState={mockInitialState} />);
    
    const foldButton = screen.getByText('Fold');
    fireEvent.click(foldButton);

    await waitFor(() => {
      expect(screen.getByText('PREFLOP')).toBeInTheDocument();
      expect(screen.getByText('Pot: $0')).toBeInTheDocument();
    });
  });
});