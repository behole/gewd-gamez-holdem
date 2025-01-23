import React from 'react';
import { PokerTable } from '@/components/game/PokerTable';

export const App: React.FC = () => {
  return (
    <div className="App">
      <PokerTable isTrainingMode={true} />
    </div>
  );
};

export default App;