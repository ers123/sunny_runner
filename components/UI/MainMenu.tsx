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
    <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient-xy">
          {/* Animated Orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

          {/* Sparkle Overlay */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                <Sparkles className="text-white" size={10 + Math.random() * 20} />
              </div>
            ))}
          </div>
      </div>

      {/* Glassmorphism Main Card */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex flex-col items-center gap-8">

        {/* Title Section */}
        <div className="text-center relative">
          <h1 className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] tracking-tighter leading-[0.9]">
            RAINBOW
            <br />
            <span className="text-4xl sm:text-5xl tracking-normal text-pink-300 bg-clip-text">RUNNER</span>
          </h1>
          <div className="mt-4 inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            <Sparkles size={14} className="text-yellow-300" />
            <span className="text-white/90 text-xs font-bold uppercase tracking-widest">Season 1: Sparkle</span>
            <Sparkles size={14} className="text-yellow-300" />
          </div>
        </div>

        {/* Character Quick View */}
        <div
            onClick={() => setShowCharacterSelect(true)}
            className="w-full bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 p-4 rounded-3xl border border-white/10 transition-all cursor-pointer group flex items-center gap-4"
        >
            <div
                className="w-16 h-16 rounded-2xl shadow-lg border-2 border-white/30 group-hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${currentCharacter.primaryColor}, ${currentCharacter.secondaryColor})` }}
            />
            <div className="flex-1">
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-0.5">Ready to run</p>
                <p className="text-white font-bold text-xl">{currentCharacter.name}</p>
            </div>
            <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
                <User className="text-white" size={20} />
            </div>
        </div>

        {/* Main Action Buttons */}
        <div className="w-full space-y-4">
            {/* Play Button */}
            <button
                onClick={startGame}
                className="w-full group relative h-20"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-tilt"></div>
                <div className="relative h-full bg-white rounded-3xl flex items-center justify-center gap-4 border border-white/50 shadow-xl transform group-hover:-translate-y-1 transition-all duration-200">
                    <Play className="fill-purple-600 text-purple-600" size={32} />
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 tracking-wider">START GAME</span>
                </div>
            </button>

            {/* Grid Menu */}
            <div className="grid grid-cols-3 gap-3">
                <MenuButton
                    icon={<Flame size={24} />}
                    label="Daily"
                    color="text-orange-400"
                    onClick={() => setShowDailyChallenge(true)}
                />
                <MenuButton
                    icon={<Trophy size={24} />}
                    label="Ranks"
                    color="text-yellow-400"
                    onClick={() => setShowLeaderboard(true)}
                />
                <MenuButton
                    icon={<User size={24} />}
                    label="Hero"
                    color="text-blue-400"
                    onClick={() => setShowCharacterSelect(true)}
                />
            </div>
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
    color: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, label, onClick, color }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-2 bg-black/20 hover:bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/5 transition-all active:scale-95 group"
    >
        <div className={`transform group-hover:scale-110 transition-transform ${color} drop-shadow-lg`}>
            {icon}
        </div>
        <span className="text-white/90 text-xs font-bold uppercase tracking-wide">{label}</span>
    </button>
);
