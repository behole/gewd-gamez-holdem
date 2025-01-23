import React from 'react';
import { PokerTable } from './components/game/PokerTable';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-8">
        <PokerTable isTrainingMode={true} />
      </main>
    </div>
  );
};

export default App;
