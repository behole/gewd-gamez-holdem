import React from 'react';
import type { Card } from '@/types/poker';

interface CommunityCardsProps {
  cards: Card[];
}

export const CommunityCards: React.FC<CommunityCardsProps> = ({ cards }) => {
  const getSuitColor = (suit: Card['suit']): string => {
    switch (suit) {
      case 'hearts':
      case 'diamonds':
        return 'text-red-500';
      case 'clubs':
      case 'spades':
        return 'text-gray-900';
      default:
        return 'text-gray-900';
    }
  };

  const getSuitSymbol = (suit: Card['suit']): string => {
    switch (suit) {
      case 'hearts':
        return '♥';
      case 'diamonds':
        return '♦';
      case 'clubs':
        return '♣';
      case 'spades':
        return '♠';
      default:
        return '?';
    }
  };

  const renderCard = (card: Card) => (
    <div className="w-16 h-24 bg-white rounded-lg flex flex-col items-center justify-center">
      <span className={`text-xl font-bold ${getSuitColor(card.suit)}`}>
        {card.rank}
      </span>
      <span className={`text-2xl ${getSuitColor(card.suit)}`}>
        {getSuitSymbol(card.suit)}
      </span>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <h3 className="text-lg font-medium">Community Cards</h3>
      <div className="flex space-x-2">
        {cards.map((card, index) => (
          <div key={`${card.rank}-${card.suit}-${index}`}>
            {renderCard(card)}
          </div>
        ))}
        {/* Render empty card placeholders */}
        {Array.from({ length: 5 - cards.length }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="w-16 h-24 bg-gray-700 rounded-lg flex items-center justify-center"
          >
            <span className="text-gray-600 text-2xl">?</span>
          </div>
        ))}
      </div>
    </div>
  );
};