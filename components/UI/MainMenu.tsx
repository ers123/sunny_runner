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
    <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-gradient-to-b from-pink-300 via-pink-200 to-blue-300">

      {/* Main Container Card */}
      <div className="relative w-full max-w-4xl mx-4 bg-white/20 backdrop-blur-sm border-2 border-black rounded-[2rem] shadow-xl overflow-hidden flex flex-col">

        {/* Top Section: Season Badge */}
        <div className="flex justify-center py-6 border-b-2 border-black">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-black bg-white/20">
            <Sparkles size={16} className="text-black" />
            <span className="text-black text-sm font-bold uppercase tracking-widest">SEASON 1: SPARKLE</span>
            <Sparkles size={16} className="text-black" />
          </div>
        </div>

        {/* Character Info Section */}
        <div className="flex justify-between items-center px-8 py-8 border-b-2 border-black bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setShowCharacterSelect(true)}>
            <div className="flex flex-col gap-1">
                <span className="text-black text-sm font-medium uppercase tracking-wider opacity-80">READY TO RUN</span>
                <div className="flex items-center gap-2">
                    <span className="text-yellow-500 text-lg">✨</span>
                    <span className="text-black text-2xl font-bold">{currentCharacter.name}</span>
                </div>
            </div>

            <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center bg-white/30 hover:scale-105 transition-transform">
                <User size={24} className="text-black" />
            </div>
        </div>

        {/* Play Button - Full Width Bar */}
        <button
            onClick={startGame}
            className="w-full py-6 bg-white/40 hover:bg-white/60 active:bg-white/80 transition-all border-b-2 border-black flex items-center justify-center group"
        >
            <Play size={48} className="text-black fill-transparent stroke-[1.5] group-hover:scale-110 transition-transform" />
        </button>

        {/* Bottom Navigation Grid */}
        <div className="grid grid-cols-3 divide-x-2 divide-black">
            <MenuButton
                icon={<Flame size={24} />}
                label="DAILY"
                onClick={() => setShowDailyChallenge(true)}
            />
            <MenuButton
                icon={<Trophy size={24} />}
                label="RANKS"
                onClick={() => setShowLeaderboard(true)}
            />
            <MenuButton
                icon={<User size={24} />}
                label="HERO"
                onClick={() => setShowCharacterSelect(true)}
            />
        </div>

      </div>

      {/* Modals */}
      {showDailyChallenge && <DailyChallengeUI onClose={() => setShowDailyChallenge(false)} />}
      {showCharacterSelect && <CharacterSelector onClose={() => setShowCharacterSelect(false)} />}
      {showLeaderboard && <LeaderboardView onClose={() => setShowLeaderboard(false)} />}
    </div>
  );
};

interface MenuButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-2 py-6 hover:bg-white/20 active:bg-white/40 transition-colors group"
    >
        <div className="text-black group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <span className="text-black text-xs font-bold uppercase tracking-widest">{label}</span>
    </button>
);
