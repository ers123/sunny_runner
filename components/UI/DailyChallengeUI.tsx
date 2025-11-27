/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Flame, Award, Gift, X } from 'lucide-react';
import { dailyChallenge } from '../System/DailyChallenge';

interface DailyChallengeUIProps {
  onClose: () => void;
}

export const DailyChallengeUI: React.FC<DailyChallengeUIProps> = ({ onClose }) => {
  const challenge = dailyChallenge.getDailyChallenge();
  const streak = dailyChallenge.getStreakData();
  const reward = dailyChallenge.getStreakReward();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
      <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl border-4 border-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2">
            Daily Challenge
          </h2>
          <p className="text-gray-600 text-sm">Complete today's challenge for bonus gems!</p>
        </div>

        {/* Streak Tracker */}
        <div className="mb-6 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-4 border-3 border-orange-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Flame className="w-8 h-8 text-orange-500" />
              <div>
                <p className="font-bold text-orange-900">Current Streak</p>
                <p className="text-2xl font-black text-orange-600">{streak.currentStreak} Days</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-orange-700">Longest Streak</p>
              <p className="text-2xl font-black text-orange-600">{streak.longestStreak}</p>
            </div>
          </div>

          {/* Streak Bonus */}
          {reward.bonus > 0 && (
            <div className="mt-3 p-2 bg-orange-300 rounded-lg text-center">
              <p className="text-sm font-black text-white">{reward.message}</p>
            </div>
          )}
        </div>

        {/* Daily Challenge Card */}
        <div className="bg-white rounded-2xl p-6 border-3 border-purple-300 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-5xl">{challenge.emoji}</div>
            <div>
              <h3 className="text-2xl font-black text-purple-600">{challenge.title}</h3>
              <p className="text-sm text-gray-600">{challenge.description}</p>
            </div>
          </div>

          {/* Challenge Progress */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-600 font-semibold mb-1">Challenge Target</p>
            <p className="text-2xl font-black text-purple-600">{challenge.target}</p>
          </div>

          {/* Reward */}
          <div className="mt-4 flex items-center justify-center space-x-2 bg-yellow-100 rounded-xl p-3">
            <Gift className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-yellow-700">+{challenge.reward} Gems</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-lg p-3 border-2 border-pink-300 text-center">
            <p className="text-xs text-gray-600 font-semibold">Total Days Played</p>
            <p className="text-2xl font-black text-pink-600">{streak.totalDaysPlayed}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border-2 border-blue-300 text-center">
            <p className="text-xs text-gray-600 font-semibold">Rewards Earned</p>
            <p className="text-2xl font-black text-blue-600">{streak.totalDaysPlayed * 50}</p>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
          <p className="text-xs text-blue-800 font-semibold">
            💡 <strong>Tip:</strong> Play every day to build your streak and earn bonus gems! Streaks reset if you skip a day.
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black rounded-xl hover:scale-105 transition"
        >
          Let's Go! 🚀
        </button>
      </div>
    </div>
  );
};
