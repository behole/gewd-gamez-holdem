import { useState, useCallback } from 'react';
import type { Card, Suit, Rank } from '@/types/poker';

interface UseDeckReturn {
  deck: Card[];
  shuffleDeck: () => void;
  dealCard: () => Card | undefined;
  dealCards: (numCards: number) => Card[];
  resetDeck: () => void;
}

export const useDeck = (): UseDeckReturn => {
  const [deck, setDeck] = useState<Card[]>(() => createDeck());

  const shuffleDeck = useCallback(() => {
    setDeck((currentDeck) => {
      const newDeck = [...currentDeck];
      for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
      }
      return newDeck;
    });
  }, []);

  const dealCard = useCallback((): Card | undefined => {
    setDeck((currentDeck) => {
      if (currentDeck.length === 0) return currentDeck;
      return currentDeck.slice(0, -1);
    });
    return deck[deck.length - 1];
  }, [deck]);

  const dealCards = useCallback(
    (numCards: number): Card[] => {
      const cards: Card[] = [];
      for (let i = 0; i < numCards && deck.length > 0; i++) {
        const card = dealCard();
        if (card) cards.push(card);
      }
      return cards;
    },
    [dealCard, deck.length]
  );

  const resetDeck = useCallback(() => {
    setDeck(createDeck());
  }, []);

  return {
    deck,
    shuffleDeck,
    dealCard,
    dealCards,
    resetDeck,
  };
};

function createDeck(): Card[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Rank[] = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A',
  ];

  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}