import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useHandStrength } from './useHandStrength';
import type { Card } from '@/types/poker';

describe('useHandStrength', () => {
  it('should identify a royal flush', () => {
    const holeCards: Card[] = [
      { suit: 'hearts', rank: 'A' },
      { suit: 'hearts', rank: 'K' },
    ];
    const communityCards: Card[] = [
      { suit: 'hearts', rank: 'Q' },
      { suit: 'hearts', rank: 'J' },
      { suit: 'hearts', rank: '10' },
    ];

    const { result } = renderHook(() => useHandStrength(holeCards, communityCards));

    expect(result.current.rank).toBe('Royal Flush');
    expect(result.current.percentage).toBe(100);
  });

  it('should identify a straight flush', () => {
    const holeCards: Card[] = [
      { suit: 'clubs', rank: '8' },
      { suit: 'clubs', rank: '7' },
    ];
    const communityCards: Card[] = [
      { suit: 'clubs', rank: '6' },
      { suit: 'clubs', rank: '5' },
      { suit: 'clubs', rank: '4' },
    ];

    const { result } = renderHook(() => useHandStrength(holeCards, communityCards));

    expect(result.current.rank).toBe('Straight Flush');
    expect(result.current.percentage).toBe(95);
  });

  it('should identify four of a kind', () => {
    const holeCards: Card[] = [
      { suit: 'hearts', rank: 'A' },
      { suit: 'diamonds', rank: 'A' },
    ];
    const communityCards: Card[] = [
      { suit: 'clubs', rank: 'A' },
      { suit: 'spades', rank: 'A' },
      { suit: 'hearts', rank: 'K' },
    ];

    const { result } = renderHook(() => useHandStrength(holeCards, communityCards));

    expect(result.current.rank).toBe('Four of a Kind');
    expect(result.current.percentage).toBe(90);
  });

  it('should identify a full house', () => {
    const holeCards: Card[] = [
      { suit: 'hearts', rank: 'A' },
      { suit: 'diamonds', rank: 'A' },
    ];
    const communityCards: Card[] = [
      { suit: 'clubs', rank: 'A' },
      { suit: 'spades', rank: 'K' },
      { suit: 'hearts', rank: 'K' },
    ];

    const { result } = renderHook(() => useHandStrength(holeCards, communityCards));

    expect(result.current.rank).toBe('Full House');
    expect(result.current.percentage).toBe(85);
  });

  it('should return high card when no cards provided', () => {
    const holeCards: Card[] = [];
    const communityCards: Card[] = [];

    const { result } = renderHook(() => useHandStrength(holeCards, communityCards));

    expect(result.current.rank).toBe('High Card');
    expect(result.current.percentage).toBe(0);
    expect(result.current.description).toBe('Waiting for cards');
  });

  it('should identify a pair', () => {
    const holeCards: Card[] = [
      { suit: 'hearts', rank: 'A' },
      { suit: 'diamonds', rank: 'K' },
    ];
    const communityCards: Card[] = [
      { suit: 'clubs', rank: 'A' },
      { suit: 'spades', rank: '2' },
      { suit: 'hearts', rank: '3' },
    ];

    const { result } = renderHook(() => useHandStrength(holeCards, communityCards));

    expect(result.current.rank).toBe('Pair');
    expect(result.current.description).toBe('Pair of As');
  });
});