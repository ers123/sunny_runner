/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Flame, Gift, X } from 'lucide-react';
import { dailyChallenge } from '../System/DailyChallenge';

interface DailyChallengeUIProps {
  onClose: () => void;
}

export const DailyChallengeUI: React.FC<DailyChallengeUIProps> = ({ onClose }) => {
  const challenge = dailyChallenge.getDailyChallenge();
  const streak = dailyChallenge.getStreakData();
  const reward = dailyChallenge.getStreakReward();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">

        {/* Main Card */}
        <div className="relative w-full max-w-lg bg-white/90 border-2 border-black rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">

            {/* Header */}
            <div className="flex justify-between items-start p-8 border-b-2 border-black bg-pink-100/50">
                <div>
                    <h2 className="text-3xl font-black text-black tracking-tight uppercase">Daily Run</h2>
                    <p className="text-black/60 text-sm font-medium">Challenge yourself & earn rewards</p>
                </div>
                <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-100 text-black border-2 border-black transition-transform hover:scale-110 active:scale-95">
                    <X size={20} />
                </button>
            </div>

            {/* Content Container */}
            <div className="p-8 flex flex-col gap-6">

                {/* Streak Section */}
                <div className="bg-orange-50 rounded-2xl p-4 border-2 border-black flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-500 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <Flame className="text-white fill-white" size={24} />
                        </div>
                        <div>
                            <p className="text-black/60 text-xs font-bold uppercase tracking-wider mb-0.5">Current Streak</p>
                            <p className="text-2xl font-black text-black leading-none">{streak.currentStreak} <span className="text-base font-medium text-black/40">Days</span></p>
                        </div>
                    </div>

                    {reward.bonus > 0 && (
                        <div className="px-3 py-1 bg-yellow-300 rounded-full border-2 border-black">
                            <p className="text-xs font-bold text-black">{reward.message}</p>
                        </div>
                    )}
                </div>

                {/* Challenge Details */}
                <div className="bg-blue-50/50 rounded-3xl p-6 border-2 border-black flex flex-col items-center text-center gap-4">
                     <div className="text-6xl filter drop-shadow-md animate-bounce">{challenge.emoji}</div>
                     <div>
                        <h3 className="text-2xl font-black text-black mb-1 uppercase">{challenge.title}</h3>
                        <p className="text-black/60 text-sm max-w-[240px] mx-auto leading-relaxed">{challenge.description}</p>
                     </div>

                     <div className="w-full bg-white rounded-xl h-14 flex items-center justify-between px-6 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                        <span className="text-black/40 text-xs font-bold uppercase">Target</span>
                        <span className="text-black font-black text-xl tracking-wide">{challenge.target}</span>
                     </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3 border-2 border-black text-center">
                         <p className="text-[10px] text-black/40 font-bold uppercase mb-1">Total Plays</p>
                         <p className="text-lg font-black text-black">{streak.totalDaysPlayed}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border-2 border-black text-center">
                         <p className="text-[10px] text-black/40 font-bold uppercase mb-1">Rewards</p>
                         <p className="text-lg font-black text-emerald-600">{(streak.totalDaysPlayed * 50).toLocaleString()}</p>
                    </div>
                </div>

                {/* Action Button */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between bg-emerald-100 border-2 border-emerald-500/30 rounded-2xl px-5 py-3">
                         <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider">Reward</span>
                         <div className="flex items-center gap-2">
                             <Gift size={16} className="text-emerald-600" />
                             <span className="text-emerald-900 font-black">+{challenge.reward} Gems</span>
                         </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-black text-white rounded-xl font-black text-lg hover:bg-neutral-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[4px] active:shadow-none"
                    >
                        ACCEPT CHALLENGE
                    </button>
                </div>

            </div>
        </div>
    </div>
  );
};
