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
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500 stroke-black" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400 fill-gray-400 stroke-black" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600 fill-orange-600 stroke-black" />;
    return <div className="w-6 h-6 flex items-center justify-center font-black text-black">{rank}</div>;
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-[2rem] p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-black animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-black" />
            <h2 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tight">
              Top Scores
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors border-2 border-black"
          >
            <X className="w-6 h-6 text-black" />
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
                  className={`relative p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      {getMedalIcon(rank)}
                    </div>

                    {/* Character Icon */}
                    <div
                      className="w-12 h-12 rounded-full border-2 border-black shadow-sm flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${character.primaryColor}, ${character.secondaryColor})`,
                      }}
                    />

                    {/* Stats */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline space-x-2">
                        <span className="font-black text-2xl text-black">
                          {entry.score.toLocaleString()}
                        </span>
                        <span className="text-sm font-bold text-black/60">pts</span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs font-bold text-black/60 mt-1 uppercase tracking-wide">
                        <span>Lv. {entry.level}</span>
                        <span>•</span>
                        <span>{entry.maxCombo}x</span>
                        <span>•</span>
                        <span>{character.name.split(' ')[0]}</span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-xs text-black/40 font-bold hidden md:block">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Best Score Badge */}
                  {rank === 1 && (
                    <div className="absolute -top-3 -right-2 bg-yellow-400 text-black border-2 border-black px-3 py-1 rounded-full text-xs font-black shadow-sm">
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
          className="mt-6 w-full py-4 bg-black text-white font-black text-xl rounded-xl hover:bg-neutral-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[2px] active:shadow-none uppercase"
        >
          Close
        </button>
      </div>
    </div>
  );
};
