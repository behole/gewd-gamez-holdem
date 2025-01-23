import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import PlayerList from './PlayerList';
import CommunityCards from './CommunityCards';
import PlayerControls from './PlayerControls';
import { HandStrengthMeter, PotOddsCalculator } from '../analytics';

const PokerTable = () => {
  const [gameState, setGameState] = useState({
    pot: 1250,
    communityCards: ['♠A', '♣K', '♥Q'],
    playerCards: ['♦A', '♦K'],
    playerStack: 2500,
    currentBet: 200,
    minBet: 100,
    maxBet: 2500,
    phase: 'flop',
    trainingMode: false,
    handStrength: {
      handStrength: 65,
      potentialStrength: 78,
      outs: 9,
      equity: 54
    },
    potOdds: {
      potSize: 1250,
      betToCall: 200,
      impliedOdds: 800,
      recommendedAction: 'Call'
    },
    players: [
      // Player data...
    ]
  });

  const [showTrainingOverlay, setShowTrainingOverlay] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
      <div className="w-full max-w-4xl p-4">
        {/* Training mode overlay */}
        {showTrainingOverlay && (
          <div className="fixed right-4 top-20 w-80 space-y-4">
            <HandStrengthMeter {...gameState.handStrength} />
            <PotOddsCalculator {...gameState.potOdds} />
          </div>
        )}

        <PlayerList 
          players={gameState.players}
          showAdvancedStats={gameState.trainingMode}
        />

        {/* Game information */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-medium text-slate-200">
            Pot: ${gameState.pot}
          </div>
          <div className="px-4 py-2 bg-slate-800 rounded-lg text-slate-400 text-sm">
            Phase: {gameState.phase}
          </div>
        </div>

        <CommunityCards cards={gameState.communityCards} />

        <PlayerControls
          cards={gameState.playerCards}
          stack={gameState.playerStack}
          currentBet={gameState.currentBet}
          minBet={gameState.minBet}
          maxBet={gameState.maxBet}
        />

        {/* Training mode toggle */}
        <button 
          onClick={() => {
            setShowTrainingOverlay(!showTrainingOverlay);
            setGameState(prev => ({ ...prev, trainingMode: !prev.trainingMode }));
          }}
          className="fixed top-4 right-4 p-2 text-slate-400 hover:text-blue-400 flex items-center space-x-2"
        >
          {showTrainingOverlay ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
          <span className="text-sm">Training Mode</span>
        </button>
      </div>
    </div>
  );
};

export default PokerTable;