/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { useStore } from '../../store';
import { CHARACTERS } from '../../types';
import { Lock, Check } from 'lucide-react';

export const CharacterSelect: React.FC = () => {
  const { selectedCharacter, unlockedCharacters, selectCharacter, level, gemsCollected, maxCombo } = useStore();

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Choose Your Sparkle Style! ✨</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(CHARACTERS).map(([id, character]) => {
          const isUnlocked = unlockedCharacters.includes(id);
          const isSelected = selectedCharacter === id;

          return (
            <button
              key={id}
              onClick={() => selectCharacter(id)}
              disabled={!isUnlocked}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-white bg-white/10 scale-105'
                  : isUnlocked
                  ? 'border-gray-400 bg-gray-800 hover:border-white hover:scale-102'
                  : 'border-gray-600 bg-gray-900 opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Character Preview */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg text-white mb-1">{character.name}</h3>
                  <p className="text-sm text-gray-300">{character.description}</p>
                </div>

                {/* Status Icon */}
                <div className="ml-4">
                  {isSelected ? (
                    <Check className="w-6 h-6 text-green-400" />
                  ) : isUnlocked ? (
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-400"
                      style={{ backgroundColor: character.primaryColor }}
                    />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Color Preview */}
              <div className="flex gap-2 mb-3">
                <div
                  className="flex-1 h-8 rounded"
                  style={{ backgroundColor: character.primaryColor }}
                  title="Primary Color"
                />
                <div
                  className="flex-1 h-8 rounded"
                  style={{ backgroundColor: character.trailColor }}
                  title="Trail Color"
                />
              </div>

              {/* Unlock Condition */}
              {!isUnlocked && (
                <div className="text-xs text-gray-400 mt-2">
                  🔒 {character.unlockCondition}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Display */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h3 className="font-bold text-white mb-3">Unlock Progress:</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div>📊 Level: {level}/10 (Galaxy at Lvl 3)</div>
          <div>💎 Gems: {gemsCollected}/500 (Rainbow at 500)</div>
          <div>⭐ Max Combo: {maxCombo}/20 (Golden at 20)</div>
          <div>🏆 Complete Level 10 (Mystic)</div>
        </div>
      </div>
    </div>
  );
};
