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
    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
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
      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-12 w-full max-w-md sm:max-w-lg lg:max-w-2xl shadow-2xl border-4 border-white my-auto">
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="font-black text-4xl sm:text-5xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-2 sm:mb-4 animate-pulse leading-tight">
            ✨ RAINBOW
          </h1>
          <h1 className="font-black text-4xl sm:text-5xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-4 sm:mb-6 leading-tight">
            SPARKLE RUNNER ✨
          </h1>
          <p className="text-gray-700 text-base sm:text-lg font-semibold">
            Collect the letters, dodge obstacles, and reach Level 10!
          </p>
        </div>

        {/* Current Character Display */}
        <div className="mb-6 sm:mb-8 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl border-3 border-purple-300">
          <div className="flex items-center justify-center space-x-3">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-3 border-white shadow-lg flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${currentCharacter.primaryColor}, ${currentCharacter.secondaryColor})`,
              }}
            />
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 font-semibold">Playing as:</p>
              <p className="font-black text-base sm:text-lg text-gray-900">{currentCharacter.name}</p>
            </div>
          </div>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col space-y-4 sm:space-y-5">
          {/* Start Game Button - BIG AND PROMINENT */}
          <button
            onClick={startGame}
            className="group relative py-6 sm:py-8 px-8 sm:px-10 bg-gradient-to-br from-pink-500 via-pink-400 to-purple-500 text-white font-black text-3xl sm:text-4xl md:text-5xl rounded-full hover:scale-110 active:scale-95 transition-all shadow-2xl hover:shadow-3xl w-full animate-bounce"
          >
            <div className="flex items-center justify-center space-x-3 sm:space-x-4">
              <Play className="w-8 sm:w-10 h-8 sm:h-10 fill-white flex-shrink-0 animate-pulse" />
              <span className="truncate">START!</span>
            </div>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity -z-10" />
          </button>

          {/* Secondary Buttons - FULL WIDTH AND LARGER */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Daily Challenge Button */}
            <button
              onClick={() => setShowDailyChallenge(true)}
              className="group relative py-5 sm:py-6 px-4 sm:px-6 bg-gradient-to-br from-orange-400 via-red-400 to-red-500 text-white font-black text-lg sm:text-xl rounded-3xl hover:scale-110 active:scale-95 transition-all shadow-xl hover:shadow-2xl border-4 border-orange-300"
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <Flame className="w-7 sm:w-8 h-7 sm:h-8 animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="font-bold text-base sm:text-lg">🔥 CHALLENGE</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-red-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity -z-10" />
            </button>

            {/* Character Select Button */}
            <button
              onClick={() => setShowCharacterSelect(true)}
              className="group relative py-5 sm:py-6 px-4 sm:px-6 bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 text-white font-black text-lg sm:text-xl rounded-3xl hover:scale-110 active:scale-95 transition-all shadow-xl hover:shadow-2xl border-4 border-purple-300"
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <User className="w-7 sm:w-8 h-7 sm:h-8 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="font-bold text-base sm:text-lg">👥 CHARACTER</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-pink-300 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity -z-10" />
            </button>

            {/* Leaderboard Button */}
            <button
              onClick={() => setShowLeaderboard(true)}
              className="group relative py-5 sm:py-6 px-4 sm:px-6 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 text-white font-black text-lg sm:text-xl rounded-3xl hover:scale-110 active:scale-95 transition-all shadow-xl hover:shadow-2xl border-4 border-yellow-300"
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <Trophy className="w-7 sm:w-8 h-7 sm:h-8 animate-bounce" style={{ animationDelay: '0.4s' }} />
                <span className="font-bold text-base sm:text-lg">🏆 TOP SCORES</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity -z-10" />
            </button>
          </div>
        </div>

        {/* How to Play */}
        <div className="mt-6 sm:mt-8 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2 text-center text-sm sm:text-base">How to Play</h3>
          <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
            <li>⬅️ ➡️ <strong>Arrow Keys</strong> or <strong>A/D</strong> - Move</li>
            <li>⬆️ <strong>Spacebar</strong> or <strong>W</strong> - Jump</li>
            <li>✨ Collect <strong>S-P-A-R-K-L-E</strong> to level up</li>
            <li>💎 Grab gems for points</li>
            <li>❤️ Avoid obstacles</li>
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
