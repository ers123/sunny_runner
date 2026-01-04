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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">

      {/* Main Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border-4 border-black rounded-[2.5rem] p-6 sm:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col animate-in zoom-in duration-300">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-shrink-0 border-b-4 border-black pb-4">
          <div>
            <h2 className="text-4xl font-black text-black tracking-tight mb-1 uppercase">Select Runner</h2>
            <p className="text-black/50 text-sm font-bold uppercase tracking-wide">Choose your sparkle champion</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white hover:bg-gray-100 rounded-full text-black transition-colors border-2 border-black active:translate-y-[2px]"
          >
            <X size={24} />
          </button>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 pb-4 scrollbar-hide">
          {Object.values(CHARACTERS).map((char) => {
            const isUnlocked = unlockedCharacters.includes(char.id);
            const isSelected = selectedCharacter === char.id;

            return (
              <div
                key={char.id}
                onClick={() => isUnlocked && selectCharacter(char.id)}
                className={`group relative overflow-hidden rounded-[2rem] transition-all duration-300 border-4
                  ${isSelected
                    ? 'bg-white border-black ring-4 ring-pink-300 ring-offset-4'
                    : isUnlocked
                      ? 'bg-white border-black hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer'
                      : 'bg-gray-100 border-gray-300 opacity-80 cursor-not-allowed'
                  }
                `}
              >
                {/* Character Preview Gradient */}
                <div
                  className={`h-32 w-full relative transition-transform duration-500 border-b-4 border-black`}
                  style={{
                    background: isUnlocked
                      ? `linear-gradient(135deg, ${char.primaryColor}, ${char.secondaryColor})`
                      : '#e5e5e5'
                  }}
                >

                  {/* Status Icon */}
                  <div className="absolute top-4 right-4">
                    {isSelected ? (
                      <div className="bg-emerald-400 text-white p-2 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Check size={20} strokeWidth={4} />
                      </div>
                    ) : !isUnlocked ? (
                      <div className="bg-black/20 text-black/50 p-2 rounded-full backdrop-blur-sm border-2 border-black/10">
                        <Lock size={20} />
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-5 relative">
                   <h3 className="text-2xl font-black text-black mb-1 uppercase tracking-tight">{char.name}</h3>
                   <p className="text-black/60 text-xs font-bold leading-relaxed mb-4 min-h-[40px] uppercase tracking-wide">
                     {char.description}
                   </p>

                   {/* Stats / Unlock Info */}
                   {!isUnlocked ? (
                     <div className="bg-gray-100 rounded-xl p-3 border-2 border-gray-300">
                        <p className="text-xs text-black/40 uppercase font-black mb-1">Unlock Requirement</p>
                        <p className="text-pink-600 font-black text-sm uppercase">{char.unlockCondition}</p>
                     </div>
                   ) : (
                     <div className="space-y-2">
                        {isSelected ? (
                            <div className="w-full py-3 bg-black text-white text-center font-black rounded-xl text-sm uppercase tracking-wider shadow-md border-2 border-black">
                                Selected
                            </div>
                        ) : (
                            <button className="w-full py-3 bg-white hover:bg-black hover:text-white text-black text-center font-black rounded-xl text-sm uppercase tracking-wider transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none">
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
