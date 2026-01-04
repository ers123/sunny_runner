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
    <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-gradient-to-b from-sparkle-pink via-sparkle-purple to-sparkle-blue">

      {/* Main Container Card */}
      <div className="relative w-full max-w-md mx-4 bg-white border-4 border-black rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col animate-in zoom-in duration-300">

        {/* Top Section: Season Badge */}
        <div className="flex justify-center py-6 border-b-4 border-black bg-white">
          <div className="flex items-center gap-2 px-6 py-2 rounded-full border-2 border-black bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:scale-105 transition-transform">
            <Sparkles size={16} className="text-black fill-white" />
            <span className="text-black text-xs font-black uppercase tracking-widest">SEASON 1: SPARKLE</span>
            <Sparkles size={16} className="text-black fill-white" />
          </div>
        </div>

        {/* Character Info Section */}
        <div
            className="flex justify-between items-center px-8 py-6 border-b-4 border-black bg-pink-50 hover:bg-pink-100 transition-colors cursor-pointer group"
            onClick={() => setShowCharacterSelect(true)}
        >
            <div className="flex flex-col gap-1">
                <span className="text-black/60 text-xs font-black uppercase tracking-widest group-hover:text-pink-600 transition-colors">READY TO RUN</span>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-black">{currentCharacter.name}</span>
                </div>
            </div>

            <div className="w-14 h-14 rounded-full border-2 border-black flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 transition-transform">
                <User size={28} className="text-black" />
            </div>
        </div>

        {/* Play Button - Full Width Bar */}
        <button
            onClick={startGame}
            className="w-full py-10 bg-emerald-300 hover:bg-emerald-400 active:bg-emerald-500 transition-all border-b-4 border-black flex items-center justify-center group relative overflow-hidden"
        >
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150 group-hover:scale-125 transition-transform duration-700"></div>

            <div className="relative flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-200">
                <Play size={64} className="text-black fill-white stroke-[2px] drop-shadow-md" />
                <span className="text-black font-black uppercase tracking-widest text-lg">TAP TO START</span>
            </div>
        </button>

        {/* Bottom Navigation Grid */}
        <div className="grid grid-cols-3 divide-x-4 divide-black bg-white">
            <MenuButton
                icon={<Flame size={28} className="text-orange-500 fill-orange-200" />}
                label="DAILY"
                onClick={() => setShowDailyChallenge(true)}
            />
            <MenuButton
                icon={<Trophy size={28} className="text-yellow-500 fill-yellow-200" />}
                label="RANKS"
                onClick={() => setShowLeaderboard(true)}
            />
            <MenuButton
                icon={<User size={28} className="text-purple-500 fill-purple-200" />}
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
        className="flex flex-col items-center justify-center gap-2 py-6 hover:bg-gray-50 active:bg-gray-100 transition-colors group"
    >
        <div className="group-hover:scale-110 group-active:scale-95 transition-transform duration-200 filter drop-shadow-sm">
            {icon}
        </div>
        <span className="text-black text-xs font-black uppercase tracking-widest">{label}</span>
    </button>
);
