/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Lock, Check } from 'lucide-react';
import { useStore } from '../../store';
import { CHARACTERS } from '../../types';

export const CharacterSelector: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { selectedCharacter, unlockedCharacters, selectCharacter } = useStore();

  const handleSelect = (characterId: string) => {
    if (unlockedCharacters.includes(characterId)) {
      selectCharacter(characterId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200] p-3 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl sm:rounded-4xl p-6 sm:p-10 max-w-3xl w-full border-6 border-white shadow-2xl my-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 mb-2">
            🎮 CHOOSE YOUR HERO! 🎮
          </h2>
          <p className="text-gray-700 mt-3 text-lg sm:text-xl font-bold">
            ✨ Unlock new characters by completing challenges! ✨
          </p>
        </div>

        {/* Character Grid - LARGER CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-8">
          {Object.values(CHARACTERS).map((char) => {
            const isUnlocked = unlockedCharacters.includes(char.id);
            const isSelected = selectedCharacter === char.id;

            return (
              <button
                key={char.id}
                onClick={() => handleSelect(char.id)}
                disabled={!isUnlocked}
                className={`group relative p-6 sm:p-8 rounded-3xl border-6 transition-all transform duration-200 ${
                  isSelected
                    ? 'border-yellow-400 bg-gradient-to-br from-yellow-100 to-orange-100 scale-110 shadow-2xl hover:scale-115'
                    : isUnlocked
                    ? 'border-purple-400 bg-white hover:scale-110 hover:border-purple-500 hover:shadow-2xl shadow-lg'
                    : 'border-gray-400 bg-gray-200 opacity-70 cursor-not-allowed'
                }`}
              >
                {/* Selected Badge - BIGGER */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 bg-yellow-400 text-white rounded-full p-3 shadow-xl">
                    <Check className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                )}

                {/* Lock Icon - BIGGER */}
                {!isUnlocked && (
                  <div className="absolute -top-3 -right-3 bg-gray-500 text-white rounded-full p-3 shadow-xl">
                    <Lock className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                )}

                {/* Character Preview - MUCH LARGER */}
                <div className="flex flex-col items-center justify-center mb-4">
                  <div
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-6 border-white shadow-xl mb-4 group-hover:animate-bounce"
                    style={{
                      background: `linear-gradient(135deg, ${char.primaryColor}, ${char.secondaryColor})`,
                    }}
                  />
                  <h3 className="font-black text-2xl sm:text-3xl text-gray-900 text-center leading-tight">
                    {char.name}
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base font-bold mt-2 text-center">
                    {char.description}
                  </p>
                </div>

                {/* Color Preview - MUCH BIGGER */}
                <div className="flex gap-3 mb-4">
                  <div
                    className="flex-1 h-5 sm:h-6 rounded-xl border-2 border-white shadow-md"
                    style={{ backgroundColor: char.primaryColor }}
                  />
                  <div
                    className="flex-1 h-5 sm:h-6 rounded-xl border-2 border-white shadow-md"
                    style={{ backgroundColor: char.secondaryColor }}
                  />
                  <div
                    className="flex-1 h-5 sm:h-6 rounded-xl border-2 border-white shadow-md"
                    style={{ backgroundColor: char.trailColor }}
                  />
                </div>

                {/* Unlock Condition - BIGGER TEXT */}
                <div className="text-sm sm:text-base font-bold text-center">
                  {isUnlocked ? (
                    <span className="text-green-600">✅ UNLOCKED! ✅</span>
                  ) : (
                    <span className="text-gray-600">🔒 {char.unlockCondition}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Start Playing Button - BIG AND BOLD */}
        <button
          onClick={onClose}
          className="group relative w-full py-6 sm:py-8 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white font-black text-2xl sm:text-3xl rounded-full hover:scale-110 active:scale-95 transition-all shadow-2xl hover:shadow-3xl border-4 border-white"
        >
          🎮 START PLAYING! 🎮
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10" />
        </button>
      </div>
    </div>
  );
};
