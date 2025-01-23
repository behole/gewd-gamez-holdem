import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PlayerTab } from './PlayerTab';
import type { Player } from '@/types/poker';

describe('PlayerTab', () => {
  const mockPlayer: Player = {
    id: '1',
    name: 'Test Player',
    stack: 1000,
    holeCards: [
      { suit: 'hearts', rank: 'A' },
      { suit: 'diamonds', rank: 'K' },
    ],
    position: 0,
    isActive: true,
    isBetting: false,
    betAmount: 0,
    isDealer: false,
    isSmallBlind: false,
    isBigBlind: false,
  };

  it('renders player name correctly', () => {
    render(<PlayerTab player={mockPlayer} position="BTN" isActive={false} />);
    expect(screen.getByText('Test Player')).toBeInTheDocument();
  });

  it('displays stack size correctly', () => {
    render(<PlayerTab player={mockPlayer} position="BTN" isActive={false} />);
    expect(screen.getByText('$1,000')).toBeInTheDocument();
  });

  it('shows position indicator', () => {
    render(<PlayerTab player={mockPlayer} position="BTN" isActive={false} />);
    expect(screen.getByText('BTN')).toBeInTheDocument();
  });

  it('displays hole cards when player is active', () => {
    const activePlayer: Player = {
      ...mockPlayer,
      isActive: true,
    };
    render(<PlayerTab player={activePlayer} position="BTN" isActive={true} />);
    expect(screen.getByText('A♥')).toBeInTheDocument();
    expect(screen.getByText('K♦')).toBeInTheDocument();
  });

  it('hides hole cards with "?" when player is not active', () => {
    const inactivePlayer: Player = {
      ...mockPlayer,
      isActive: false,
    };
    render(<PlayerTab player={inactivePlayer} position="BTN" isActive={false} />);
    const questionMarks = screen.getAllByText('?');
    expect(questionMarks).toHaveLength(2);
  });

  it('shows bet amount when player has bet', () => {
    const bettingPlayer: Player = {
      ...mockPlayer,
      betAmount: 100,
    };
    render(<PlayerTab player={bettingPlayer} position="BTN" isActive={false} />);
    expect(screen.getByText('Bet: $100')).toBeInTheDocument();
  });

  it('displays correct status indicator color when player is active', () => {
    render(<PlayerTab player={mockPlayer} position="BTN" isActive={true} />);
    const statusIndicator = screen.getByTestId('status-indicator');
    expect(statusIndicator).toHaveClass('bg-green-500');
  });

  it('displays correct position color for different positions', () => {
    // Test BTN position
    render(<PlayerTab player={mockPlayer} position="BTN" isActive={false} />);
    expect(screen.getByText('BTN')).toHaveClass('bg-purple-600');

    // Rerender with SB position
    const { rerender } = render(
      <PlayerTab player={mockPlayer} position="SB" isActive={false} />
    );
    expect(screen.getByText('SB')).toHaveClass('bg-blue-600');

    // Rerender with BB position
    rerender(<PlayerTab player={mockPlayer} position="BB" isActive={false} />);
    expect(screen.getByText('BB')).toHaveClass('bg-red-600');
  });

  it('displays correct style when player is folded', () => {
    const foldedPlayer: Player = {
      ...mockPlayer,
      isActive: false,
    };
    render(<PlayerTab player={foldedPlayer} position="BTN" isActive={false} />);
    const statusIndicator = screen.getByTestId('status-indicator');
    expect(statusIndicator).toHaveClass('bg-red-500');
  });

  it('displays correct style when player is betting', () => {
    const bettingPlayer: Player = {
      ...mockPlayer,
      isBetting: true,
    };
    render(<PlayerTab player={bettingPlayer} position="BTN" isActive={false} />);
    const statusIndicator = screen.getByTestId('status-indicator');
    expect(statusIndicator).toHaveClass('bg-yellow-500');
  });
});