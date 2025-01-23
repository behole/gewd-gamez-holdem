import React from 'react';

const CommunityCards = ({ cards }) => {
  return (
    <div className="flex justify-center space-x-2 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex items-center justify-center w-16 h-24 text-2xl bg-slate-800 text-slate-200 rounded-lg border border-slate-700"
        >
          {card}
        </div>
      ))}
    </div>
  );
};

export default CommunityCards;