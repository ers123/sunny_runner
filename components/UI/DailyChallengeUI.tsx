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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

        {/* Glass Card */}
        <div className="relative w-full max-w-lg bg-[#131326]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col gap-6 animate-in fade-in zoom-in duration-300 ring-1 ring-white/20">

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Daily Run</h2>
                    <p className="text-white/50 text-sm font-medium">Challenge yourself & earn rewards</p>
                </div>
                <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/5">
                    <X size={20} />
                </button>
            </div>

            {/* Streak Section */}
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-4 border border-orange-500/20 flex items-center justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-lg shadow-orange-500/20">
                        <Flame className="text-white fill-white" size={24} />
                    </div>
                    <div>
                        <p className="text-orange-200/80 text-xs font-bold uppercase tracking-wider mb-0.5">Current Streak</p>
                        <p className="text-2xl font-black text-white leading-none">{streak.currentStreak} <span className="text-base font-medium text-white/40">Days</span></p>
                    </div>
                </div>

                {reward.bonus > 0 && (
                    <div className="px-3 py-1 bg-orange-500/20 rounded-lg border border-orange-500/30">
                        <p className="text-xs font-bold text-orange-200">{reward.message}</p>
                    </div>
                )}
            </div>

            {/* Challenge Card */}
            <div className="bg-white/5 rounded-3xl p-8 border border-white/5 relative overflow-hidden group flex flex-col items-center">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-colors"></div>

                <div className="absolute top-0 right-0 p-3 bg-white/5 rounded-bl-2xl border-b border-l border-white/5">
                    <p className="text-[10px] font-black text-white/40 tracking-widest">TODAY'S GOAL</p>
                </div>

                <div className="flex flex-col items-center text-center gap-4 mt-2 relative z-10">
                     <div className="text-6xl filter drop-shadow-2xl grayscale-0 group-hover:scale-110 transition-transform duration-500 animate-bounce">{challenge.emoji}</div>
                     <div>
                        <h3 className="text-2xl font-black text-white mb-2">{challenge.title}</h3>
                        <p className="text-white/60 text-sm max-w-[240px] mx-auto leading-relaxed">{challenge.description}</p>
                     </div>

                     <div className="w-full min-w-[200px] mt-2 bg-black/20 rounded-full h-14 flex items-center justify-between px-6 relative overflow-hidden border border-white/10 backdrop-blur-md">
                        <span className="text-white/40 text-xs font-bold uppercase">Target</span>
                        <span className="text-white font-black text-xl tracking-wide">{challenge.target}</span>
                     </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                     <p className="text-[10px] text-white/40 font-bold uppercase mb-1">Total Plays</p>
                     <p className="text-lg font-black text-white">{streak.totalDaysPlayed}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                     <p className="text-[10px] text-white/40 font-bold uppercase mb-1">Rewards</p>
                     <p className="text-lg font-black text-emerald-400">{(streak.totalDaysPlayed * 50).toLocaleString()}</p>
                </div>
            </div>

            {/* Action Button */}
            <div className="space-y-3">
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-3">
                     <span className="text-emerald-200/80 font-bold text-xs uppercase tracking-wider">Completion Reward</span>
                     <div className="flex items-center gap-2">
                         <Gift size={16} className="text-emerald-400" />
                         <span className="text-white font-black">+{challenge.reward} Gems</span>
                     </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-4 bg-white text-black rounded-xl font-black text-lg hover:bg-gray-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-[0.98]"
                >
                    ACCEPT CHALLENGE
                </button>
            </div>
        </div>
    </div>
  );
};
