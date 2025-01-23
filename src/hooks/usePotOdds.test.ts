import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePotOdds } from './usePotOdds';
import type { Card } from '@/types/poker';

describe('usePotOdds', () => {
  it('should calculate basic pot odds correctly', () => {
    const pot = 100;
    const toCall = 20;
    const holeCards: Card[] = [
      { suit: 'hearts', rank: 'A' },
      { suit: 'diamonds', rank: 'K' },
    ];
    const communityCards: Card[] = [];

    const { result } = renderHook(() =>
      usePotOdds(pot, toCall, holeCards, communityCards)
    );

    expect(result.current.potOdds).toBe(16.7); // (20 / (100 + 20)) * 100 ≈ 16.7
    expect(result.current.impliedOdds).toBe(500); // (100 / 20) * 100 = 500
  });

  it('should identify flush draw', () => {
    const holeCards: Card[] = [
      { suit: 'hearts', rank: 'A' },
      { suit: 'hearts', rank: 'K' },
    ];
    const communityCards: Card[] = [
      { suit: 'hearts', rank: '2' },
      { suit: 'hearts', rank: '7' },
      { suit: 'clubs', rank: '9' },
    ];

    const { result } = renderHook(() =>
      usePotOdds(100, 20, holeCards, communityCards)
    );

    expect(result.current.drawingOdds.flush).toBe(19.1); // 9 outs twice
  });

  it('should identify straight draw', () => {
    const holeCards: Card[] = [
      { suit: 'hearts', rank: '9' },
      { suit: 'diamonds', rank: '8' },
    ];
    const communityCards: Card[] = [
      { suit: 'clubs', rank: '7' },
      { suit: 'spades', rank: '6' },
      { suit: 'hearts', rank: '3' },
    ];

    const { result } = renderHook(() =>
      usePotOdds(100, 20, holeCards, communityCards)
    );

    expect(result.current.drawingOdds.straight).toBe(17); // 8 outs twice
  });

  it('should recommend folding with poor odds', () => {
    const holeCards: Card[] = [
      { suit: 'hearts', rank: '2' },
      { suit: 'diamonds', rank: '7' },
    ];
    const communityCards: Card[] = [
      { suit: 'clubs', rank: 'A' },
      { suit: 'spades', rank: 'K' },
      { suit: 'hearts', rank: 'Q' },
    ];

    const { result } = renderHook(() =>
      usePotOdds(100, 50, holeCards, communityCards)
    );

    expect(result.current.recommendedAction).toBe(
      'Fold unless you have a strong made hand'
    );
  });

  it('should identify favorable implied odds', () => {
    const pot = 1000;
    const toCall = 20;
    const holeCards: Card[] = [
      { suit: 'hearts', rank: 'A' },
      { suit: 'diamonds', rank: 'K' },
    ];
    const communityCards: Card[] = [];

    const { result } = renderHook(() =>
      usePotOdds(pot, toCall, holeCards, communityCards)
    );

    expect(result.current.recommendedAction).toBe(
      'Consider calling - good implied odds'
    );
  });

  it('should handle empty community cards', () => {
    const pot = 100;
    const toCall = 20;
    const holeCards: Card[] = [
      { suit: 'hearts', rank: 'A' },
      { suit: 'diamonds', rank: 'K' },
    ];
    const communityCards: Card[] = [];

    const { result } = renderHook(() =>
      usePotOdds(pot, toCall, holeCards, communityCards)
    );

    expect(result.current.drawingOdds.flush).toBe(0);
    expect(result.current.drawingOdds.straight).toBe(0);
  });
});