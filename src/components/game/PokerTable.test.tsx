import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PokerTable } from './PokerTable';
import type { GameState } from '@/types/poker';

describe('PokerTable', () => {
  const mockInitialState: Partial<GameState> = {
    players: [
      {
        id: '1',
        name: 'Player 1',
        stack: 1000,
        holeCards: [
          { suit: 'hearts', rank: 'A' },
          { suit: 'diamonds', rank: 'K' },
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
          { suit: 'clubs', rank: 'Q' },
          { suit: 'spades', rank: 'J' },
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
    pot: 0,
    currentPhase: 'preflop',
    activePlayer: '1',
    bigBlind: 20,
    smallBlind: 10,
    minRaise: 40,
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
    render(<PokerTable initialState={mockInitialState} isTrainingMode={true} />);
    expect(screen.getByText('Training Mode')).toBeInTheDocument();
    expect(screen.getByText('Hand Strength')).toBeInTheDocument();
  });

  it('handles player actions correctly', async () => {
    render(<PokerTable initialState={mockInitialState} />);
    
    // Find and click bet button
    const betButton = screen.getByText('Bet');
    fireEvent.click(betButton);

    // Wait for bet slider to appear
    const slider = await screen.findByRole('slider');
    expect(slider).toBeInTheDocument();

    // Set bet amount
    fireEvent.change(slider, { target: { value: '100' } });
    
    // Confirm bet
    const confirmButton = screen.getByText('Confirm $100');
    fireEvent.click(confirmButton);

    // Check if pot was updated
    await waitFor(() => {
      expect(screen.getByText('Pot: $100')).toBeInTheDocument();
    });
  });

  it('advances game phases correctly', async () => {
    render(<PokerTable initialState={mockInitialState} />);

    // Complete preflop betting
    const checkButton = screen.getByText('Check');
    fireEvent.click(checkButton);

    // Should advance to flop
    await waitFor(() => {
      expect(screen.getByText('FLOP')).toBeInTheDocument();
    });
  });

  it('handles fold action and advances to next hand', async () => {
    render(<PokerTable initialState={mockInitialState} />);
    
    // Find and click fold button
    const foldButton = screen.getByText('Fold');
    fireEvent.click(foldButton);

    // Wait for game to reset for next hand
    await waitFor(() => {
      expect(screen.getByText('PREFLOP')).toBeInTheDocument();
      expect(screen.getByText('Pot: $0')).toBeInTheDocument();
    });
  });

  it('handles all-in scenarios correctly', async () => {
    const allInState = {
      ...mockInitialState,
      players: mockInitialState.players.map(player => ({
        ...player,
        stack: 100,
      })),
    };

    render(<PokerTable initialState={allInState} />);
    
    // Find and click bet button
    const betButton = screen.getByText('Bet');
    fireEvent.click(betButton);

    // Set max bet amount
    const slider = await screen.findByRole('slider');
    fireEvent.change(slider, { target: { value: '100' } });
    
    // Confirm all-in
    const confirmButton = screen.getByText('Confirm $100');
    fireEvent.click(confirmButton);

    // Check if player is marked as all-in
    await waitFor(() => {
      const playerStack = screen.getByText('$0');
      expect(playerStack).toBeInTheDocument();
    });
  });

  it('displays correct pot odds in training mode', () => {
    render(<PokerTable initialState={mockInitialState} isTrainingMode={true} />);
    
    // Make a bet to create pot odds scenario
    const betButton = screen.getByText('Bet');
    fireEvent.click(betButton);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '50' } });
    
    const confirmButton = screen.getByText('Confirm $50');
    fireEvent.click(confirmButton);

    // Check if pot odds are displayed
    expect(screen.getByText(/Pot Odds/)).toBeInTheDocument();
    expect(screen.getByText(/Implied Odds/)).toBeInTheDocument();
  });

  it('handles blinds posting at the start of each hand', async () => {
    render(<PokerTable initialState={mockInitialState} />);
    
    const newHandButton = screen.getByText('New Hand');
    fireEvent.click(newHandButton);

    await waitFor(() => {
      // Small blind should be posted
      expect(screen.getByText('Bet: $10')).toBeInTheDocument();
      // Big blind should be posted
      expect(screen.getByText('Bet: $20')).toBeInTheDocument();
    });
  });

  it('updates player positions after each hand', async () => {
    render(<PokerTable initialState={mockInitialState} />);
    
    // Complete a hand
    const foldButton = screen.getByText('Fold');
    fireEvent.click(foldButton);

    // Check if dealer button moved
    await waitFor(() => {
      const newDealerButton = screen.getByText('BTN');
      expect(newDealerButton).toBeInTheDocument();
      // Should be attached to Player 2 now
      expect(newDealerButton.closest('div')).toContainElement(screen.getByText('Player 2'));
    });
  });

  it('correctly manages betting rounds', async () => {
    render(<PokerTable initialState={mockInitialState} />);

    // Complete preflop betting
    const betButton = screen.getByText('Bet');
    fireEvent.click(betButton);

    const slider = await screen.findByRole('slider');
    fireEvent.change(slider, { target: { value: '40' } });
    
    const confirmButton = screen.getByText('Confirm $40');
    fireEvent.click(confirmButton);

    // Other player calls
    const callButton = await screen.findByText('Call $40');
    fireEvent.click(callButton);

    // Should advance to flop
    await waitFor(() => {
      expect(screen.getByText('FLOP')).toBeInTheDocument();
      // Pot should contain both bets
      expect(screen.getByText('Pot: $80')).toBeInTheDocument();
    });
  });
});