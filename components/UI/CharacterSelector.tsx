/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { X, Lock, Check } from 'lucide-react';
import { useStore } from '../../store';
import { CHARACTERS, CharacterId } from '../../types';

interface CharacterSelectorProps {
  onClose: () => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ onClose }) => {
  const { selectedCharacter, unlockedCharacters, selectCharacter, score } = useStore();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Glass Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#1a1b2e] border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-shrink-0">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-1">Select Runner</h2>
            <p className="text-white/50 text-sm font-medium">Choose your sparkle champion</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors border border-white/5"
          >
            <X size={24} />
          </button>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-4 scrollbar-hide">
          {Object.values(CHARACTERS).map((char) => {
            const isUnlocked = unlockedCharacters.includes(char.id);
            const isSelected = selectedCharacter === char.id;

            return (
              <div
                key={char.id}
                onClick={() => isUnlocked && selectCharacter(char.id)}
                className={`group relative overflow-hidden rounded-3xl transition-all duration-300 border
                  ${isSelected
                    ? 'bg-white/10 border-pink-500/50 ring-2 ring-pink-500 ring-offset-2 ring-offset-[#1a1b2e]'
                    : isUnlocked
                      ? 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10 cursor-pointer'
                      : 'bg-black/40 border-white/5 opacity-60 cursor-not-allowed'
                  }
                `}
              >
                {/* Character Preview Gradient */}
                <div
                  className={`h-32 w-full relative transition-transform duration-500 ${isUnlocked && 'group-hover:scale-105'}`}
                  style={{
                    background: isUnlocked
                      ? `linear-gradient(135deg, ${char.primaryColor}, ${char.secondaryColor})`
                      : '#1a1a1a'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b2e] to-transparent opacity-90"></div>

                  {/* Status Icon */}
                  <div className="absolute top-4 right-4">
                    {isSelected ? (
                      <div className="bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                        <Check size={16} strokeWidth={4} />
                      </div>
                    ) : !isUnlocked ? (
                      <div className="bg-black/50 text-white/50 p-2 rounded-full backdrop-blur-sm">
                        <Lock size={16} />
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-5 relative -mt-12">
                   <h3 className="text-2xl font-black text-white mb-1">{char.name}</h3>
                   <p className="text-white/60 text-xs font-medium leading-relaxed mb-4 min-h-[40px]">
                     {char.description}
                   </p>

                   {/* Stats / Unlock Info */}
                   {!isUnlocked ? (
                     <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                        <p className="text-xs text-white/40 uppercase font-bold mb-1">Unlock Requirement</p>
                        <p className="text-pink-400 font-bold text-sm">{char.unlockCondition}</p>
                     </div>
                   ) : (
                     <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-white/40 uppercase">Speed</span>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`w-8 h-1.5 rounded-full ${i < 4 ? 'bg-white' : 'bg-white/20'}`}></div>
                                ))}
                            </div>
                        </div>
                        {isSelected ? (
                            <div className="w-full py-3 bg-white text-black text-center font-black rounded-xl text-sm uppercase tracking-wide">
                                Selected
                            </div>
                        ) : (
                            <button className="w-full py-3 bg-white/10 hover:bg-white text-white hover:text-black text-center font-bold rounded-xl text-sm uppercase tracking-wide transition-all border border-white/10">
                                Select
                            </button>
                        )}
                     </div>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
