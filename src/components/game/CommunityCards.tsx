import React from 'react';
import type { Card } from '@/types/poker';

interface CommunityCardsProps {
  cards: Card[];
}

export const CommunityCards: React.FC<CommunityCardsProps> = ({ cards }) => {
  return (
    <div className="flex justify-center space-x-2 my-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="w-16 h-24 bg-white rounded-lg flex items-center justify-center text-2xl text-black"
        >
          {`${card.rank}${card.suit.charAt(0)}`}
        </div>
      ))}
      {/* Empty placeholders for missing cards */}
      {Array.from({ length: 5 - cards.length }).map((_, index) => (
        <div
          key={`empty-${index}`}
          className="w-16 h-24 bg-gray-700 rounded-lg border-2 border-gray-600"
        />
      ))}
    </div>
  );
};