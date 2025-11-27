/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Play, Sparkles, Trophy, User, Flame } from 'lucide-react';
import { useStore } from '../../store';
import { CharacterSelector } from './CharacterSelector';
import { LeaderboardView } from './LeaderboardView';
import { DailyChallengeUI } from './DailyChallengeUI';
import { CHARACTERS } from '../../types';

export const MainMenu: React.FC = () => {
  const { startGame, selectedCharacter } = useStore();
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);

  const currentCharacter = CHARACTERS[selectedCharacter];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="text-white/30" size={20 + Math.random() * 30} />
          </div>
        ))}
      </div>

      {/* Main Menu Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 max-w-2xl w-full shadow-2xl border-4 border-white">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-black text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-4 animate-pulse">
            ✨ RAINBOW
          </h1>
          <h1 className="font-black text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-6">
            SPARKLE RUNNER ✨
          </h1>
          <p className="text-gray-700 text-lg font-semibold">
            Collect the letters, dodge obstacles, and reach Level 10!
          </p>
        </div>

        {/* Current Character Display */}
        <div className="mb-8 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl border-3 border-purple-300">
          <div className="flex items-center justify-center space-x-3">
            <div
              className="w-12 h-12 rounded-full border-3 border-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${currentCharacter.primaryColor}, ${currentCharacter.secondaryColor})`,
              }}
            />
            <div className="text-left">
              <p className="text-sm text-gray-600 font-semibold">Playing as:</p>
              <p className="font-black text-lg">{currentCharacter.name}</p>
            </div>
          </div>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col space-y-4">
          {/* Start Game Button */}
          <button
            onClick={startGame}
            className="group relative py-5 px-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black text-2xl rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-2xl"
          >
            <div className="flex items-center justify-center space-x-3">
              <Play className="w-8 h-8 fill-white" />
              <span>START GAME</span>
            </div>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10" />
          </button>

          {/* Secondary Buttons Grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* Daily Challenge Button */}
            <button
              onClick={() => setShowDailyChallenge(true)}
              className="py-3 px-4 bg-gradient-to-r from-red-400 to-orange-400 text-white font-bold text-sm rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="flex flex-col items-center justify-center space-y-1">
                <Flame className="w-5 h-5" />
                <span>Challenge</span>
              </div>
            </button>

            {/* Character Select Button */}
            <button
              onClick={() => setShowCharacterSelect(true)}
              className="py-3 px-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold text-sm rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="flex flex-col items-center justify-center space-y-1">
                <User className="w-5 h-5" />
                <span>Character</span>
              </div>
            </button>

            {/* Leaderboard Button */}
            <button
              onClick={() => setShowLeaderboard(true)}
              className="py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-sm rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="flex flex-col items-center justify-center space-y-1">
                <Trophy className="w-5 h-5" />
                <span>Leaderboard</span>
              </div>
            </button>
          </div>
        </div>

        {/* How to Play */}
        <div className="mt-8 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2 text-center">How to Play</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>⬅️ ➡️ <strong>Arrow Keys</strong> or <strong>A/D</strong> - Move left/right</li>
            <li>⬆️ <strong>Spacebar</strong> or <strong>W</strong> - Jump</li>
            <li>✨ Collect <strong>S-P-A-R-K-L-E</strong> letters to advance levels</li>
            <li>💎 Grab gems for points and combo bonuses</li>
            <li>❤️ Avoid obstacles or lose lives</li>
          </ul>
        </div>
      </div>

      {/* Daily Challenge Modal */}
      {showDailyChallenge && (
        <DailyChallengeUI onClose={() => setShowDailyChallenge(false)} />
      )}

      {/* Character Selector Modal */}
      {showCharacterSelect && (
        <CharacterSelector onClose={() => setShowCharacterSelect(false)} />
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardView onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
};
