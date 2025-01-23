import { useMemo } from 'react';
import type { Card } from '@/types/poker';

interface PotOddsResult {
  potOdds: number;
  impliedOdds: number;
  recommendedAction: string;
  drawingOdds: {
    flush: number;
    straight: number;
    overPair: number;
  };
}

export const usePotOdds = (
  pot: number,
  toCall: number,
  holeCards: Card[],
  communityCards: Card[]
): PotOddsResult => {
  return useMemo(() => {
    // Calculate basic pot odds (cost to call / total pot after call)
    const potOdds = (toCall / (pot + toCall)) * 100;

    // Calculate implied odds (potential future bets)
    const impliedOdds = (pot / toCall) * 100;

    // Calculate drawing odds
    const drawingOdds = calculateDrawingOdds(holeCards, communityCards);

    // Generate recommendation based on odds
    const recommendedAction = generateRecommendation(
      potOdds,
      impliedOdds,
      drawingOdds
    );

    return {
      potOdds: Math.round(potOdds * 10) / 10,
      impliedOdds: Math.round(impliedOdds * 10) / 10,
      recommendedAction,
      drawingOdds,
    };
  }, [pot, toCall, holeCards, communityCards]);
};

function calculateDrawingOdds(
  holeCards: Card[],
  communityCards: Card[]
): { flush: number; straight: number; overPair: number } {
  const allCards = [...holeCards, ...communityCards];

  // Count suits for flush draws
  const suitCounts: { [key: string]: number } = {};
  allCards.forEach((card) => {
    suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
  });
  const flushDraw = Object.values(suitCounts).some((count) => count === 4)
    ? 19.1 // 9 outs twice
    : 0;

  // Check for straight draws
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const uniqueRanks = Array.from(new Set(allCards.map((card) => card.rank))).sort(
    (a, b) => ranks.indexOf(a) - ranks.indexOf(b)
  );
  
  let straightDraw = 0;
  for (let i = 0; i < uniqueRanks.length - 3; i++) {
    const consecutive = uniqueRanks.slice(i, i + 4);
    if (
      consecutive.every(
        (rank, index) =>
          ranks.indexOf(rank) === ranks.indexOf(consecutive[0]) + index
      )
    ) {
      straightDraw = 17; // 8 outs twice
      break;
    }
  }

  // Check for overpair potential
  const overPair = holeCards.every(
    (card) =>
      ranks.indexOf(card.rank) >
      Math.max(...communityCards.map((c) => ranks.indexOf(c.rank)))
  )
    ? 15
    : 0;

  return {
    flush: flushDraw,
    straight: straightDraw,
    overPair,
  };
}

function generateRecommendation(
  potOdds: number,
  impliedOdds: number,
  drawingOdds: { flush: number; straight: number; overPair: number }
): string {
  const maxDrawingOdds = Math.max(
    drawingOdds.flush,
    drawingOdds.straight,
    drawingOdds.overPair
  );

  if (maxDrawingOdds > potOdds) {
    if (drawingOdds.flush > potOdds) {
      return 'Call with flush draw - odds are favorable';
    }
    if (drawingOdds.straight > potOdds) {
      return 'Call with straight draw - odds are favorable';
    }
    if (drawingOdds.overPair > potOdds) {
      return 'Call with overpair - odds are favorable';
    }
  }

  if (impliedOdds > 40) {
    return 'Consider calling - good implied odds';
  }

  if (potOdds > 30) {
    return 'Fold unless you have a strong made hand';
  }

  return 'Call with pot odds favorable';
}