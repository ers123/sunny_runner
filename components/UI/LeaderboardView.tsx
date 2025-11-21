/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Trophy, X, Medal, Award } from 'lucide-react';
import { leaderboard } from '../System/Leaderboard';
import { CHARACTERS } from '../../types';

export const LeaderboardView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const entries = leaderboard.getLeaderboard();

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />;
    return <div className="w-6 h-6 flex items-center justify-center font-bold text-purple-600">{rank}</div>;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-orange-400';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-red-400';
    return 'from-purple-300 to-pink-300';
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200] p-4">
      <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-white/50">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
              Top Scores
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-semibold">
              No scores yet!
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Play your first game to get on the leaderboard! 🌟
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => {
              const rank = index + 1;
              const character = CHARACTERS[entry.characterId] || CHARACTERS.sparkle;

              return (
                <div
                  key={index}
                  className={`relative p-4 rounded-2xl border-4 bg-gradient-to-r ${getRankColor(rank)} border-white shadow-lg ${
                    rank === 1 ? 'scale-105' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      {getMedalIcon(rank)}
                    </div>

                    {/* Character Icon */}
                    <div
                      className="w-12 h-12 rounded-full border-3 border-white shadow-md flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${character.primaryColor}, ${character.secondaryColor})`,
                      }}
                    />

                    {/* Stats */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline space-x-2">
                        <span className="font-black text-2xl text-white drop-shadow-lg">
                          {entry.score.toLocaleString()}
                        </span>
                        <span className="text-sm font-semibold text-white/80">pts</span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs font-semibold text-white/90 mt-1">
                        <span>Lv. {entry.level}</span>
                        <span>•</span>
                        <span>{entry.maxCombo}x</span>
                        <span>•</span>
                        <span>{character.name.split(' ')[0]}</span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-xs text-white/70 font-semibold hidden md:block">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Best Score Badge */}
                  {rank === 1 && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                      ⭐ BEST!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black text-xl rounded-full hover:scale-105 transition-all shadow-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};
