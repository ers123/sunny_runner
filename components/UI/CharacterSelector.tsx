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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
      <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-white/50 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Choose Your Runner!
          </h2>
          <p className="text-gray-600 mt-2">Unlock new characters by completing challenges</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(CHARACTERS).map((char) => {
            const isUnlocked = unlockedCharacters.includes(char.id);
            const isSelected = selectedCharacter === char.id;

            return (
              <button
                key={char.id}
                onClick={() => handleSelect(char.id)}
                disabled={!isUnlocked}
                className={`relative p-4 rounded-2xl border-4 transition-all ${
                  isSelected
                    ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 scale-105'
                    : isUnlocked
                    ? 'border-purple-300 bg-white hover:scale-105 hover:border-purple-400'
                    : 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-white rounded-full p-1">
                    <Check className="w-5 h-5" />
                  </div>
                )}

                {/* Lock Icon */}
                {!isUnlocked && (
                  <div className="absolute top-2 right-2 bg-gray-400 text-white rounded-full p-1">
                    <Lock className="w-5 h-5" />
                  </div>
                )}

                {/* Character Preview */}
                <div className="flex items-center space-x-3 mb-2">
                  <div
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${char.primaryColor}, ${char.secondaryColor})`,
                    }}
                  />
                  <div className="flex-1 text-left">
                    <h3 className="font-black text-lg">{char.name}</h3>
                    <p className="text-sm text-gray-600">{char.description}</p>
                  </div>
                </div>

                {/* Color Preview */}
                <div className="flex space-x-2 mb-2">
                  <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: char.primaryColor }} />
                  <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: char.secondaryColor }} />
                  <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: char.trailColor }} />
                </div>

                {/* Unlock Condition */}
                <div className="text-xs text-gray-500 font-semibold">
                  {isUnlocked ? '✅ Unlocked!' : `🔒 ${char.unlockCondition}`}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black text-xl rounded-full hover:scale-105 transition-all shadow-lg"
        >
          Start Playing!
        </button>
      </div>
    </div>
  );
};
