import { useMemo } from 'react';
import type { Card, HandRank, HandStrength } from '@/types/poker';

type CardGroup = { [key in string]: number };

export const useHandStrength = (
  holeCards: Card[],
  communityCards: Card[]
): HandStrength => {
  return useMemo(() => {
    const allCards = [...holeCards, ...communityCards];
    if (allCards.length < 2) return { rank: 'High Card', percentage: 0, description: 'Waiting for cards' };

    // Group cards by rank and suit
    const rankGroups: CardGroup = {};
    const suitGroups: CardGroup = {};
    
    allCards.forEach((card) => {
      rankGroups[card.rank] = (rankGroups[card.rank] || 0) + 1;
      suitGroups[card.suit] = (suitGroups[card.suit] || 0) + 1;
    });

    // Check for flush
    const hasFlush = Object.values(suitGroups).some((count) => count >= 5);

    // Check for straight
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const uniqueRanks = Object.keys(rankGroups).sort(
      (a, b) => ranks.indexOf(a) - ranks.indexOf(b)
    );
    let hasStraight = false;
    let straightHigh = '';

    for (let i = 0; i <= uniqueRanks.length - 5; i++) {
      const consecutive = uniqueRanks.slice(i, i + 5);
      if (
        consecutive.every(
          (rank, index) =>
            ranks.indexOf(rank) === ranks.indexOf(consecutive[0]) + index
        )
      ) {
        hasStraight = true;
        straightHigh = consecutive[consecutive.length - 1];
        break;
      }
    }

    // Determine hand rank
    const pairs = Object.values(rankGroups).filter((count) => count === 2).length;
    const hasTrips = Object.values(rankGroups).some((count) => count === 3);
    const hasQuads = Object.values(rankGroups).some((count) => count === 4);

    let handRank: HandRank;
    let description = '';
    let percentage = 0;

    if (hasStraight && hasFlush) {
      if (straightHigh === 'A') {
        handRank = 'Royal Flush';
        percentage = 100;
        description = 'Royal Flush';
      } else {
        handRank = 'Straight Flush';
        percentage = 95;
        description = `${straightHigh} High Straight Flush`;
      }
    } else if (hasQuads) {
      handRank = 'Four of a Kind';
      percentage = 90;
      const quadRank = Object.entries(rankGroups).find(([, count]) => count === 4)?.[0];
      description = `Four ${quadRank}s`;
    } else if (hasTrips && pairs > 0) {
      handRank = 'Full House';
      percentage = 85;
      const tripRank = Object.entries(rankGroups).find(([, count]) => count === 3)?.[0];
      description = `${tripRank}s Full`;
    } else if (hasFlush) {
      handRank = 'Flush';
      percentage = 80;
      description = 'Flush';
    } else if (hasStraight) {
      handRank = 'Straight';
      percentage = 75;
      description = `${straightHigh} High Straight`;
    } else if (hasTrips) {
      handRank = 'Three of a Kind';
      percentage = 70;
      const tripRank = Object.entries(rankGroups).find(([, count]) => count === 3)?.[0];
      description = `Three ${tripRank}s`;
    } else if (pairs === 2) {
      handRank = 'Two Pair';
      percentage = 60;
      description = 'Two Pair';
    } else if (pairs === 1) {
      handRank = 'Pair';
      percentage = 50;
      const pairRank = Object.entries(rankGroups).find(([, count]) => count === 2)?.[0];
      description = `Pair of ${pairRank}s`;
    } else {
      handRank = 'High Card';
      percentage = 30;
      const highCard = uniqueRanks[uniqueRanks.length - 1];
      description = `${highCard} High`;
    }

    return {
      rank: handRank,
      percentage,
      description,
    };
  }, [holeCards, communityCards]);
};