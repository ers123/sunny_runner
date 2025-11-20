/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Award } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
}

let currentAchievement: Achievement | null = null;
let listeners: Array<(achievement: Achievement | null) => void> = [];

// Global function to show achievement
export const showAchievement = (title: string, iconType: 'trophy' | 'star' | 'zap' | 'award' = 'trophy') => {
  const icons = {
    trophy: Trophy,
    star: Star,
    zap: Zap,
    award: Award
  };

  const colors = {
    trophy: 'from-yellow-400 to-orange-400',
    star: 'from-purple-400 to-pink-400',
    zap: 'from-blue-400 to-cyan-400',
    award: 'from-green-400 to-emerald-400'
  };

  currentAchievement = {
    id: Math.random().toString(36),
    title,
    icon: icons[iconType],
    color: colors[iconType]
  };

  listeners.forEach(listener => listener(currentAchievement));

  // Hide after 3 seconds
  setTimeout(() => {
    currentAchievement = null;
    listeners.forEach(listener => listener(null));
  }, 3000);
};

export const AchievementPopup: React.FC = () => {
  const [achievement, setAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const listener = (ach: Achievement | null) => setAchievement(ach);
    listeners.push(listener);

    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  if (!achievement) return null;

  const Icon = achievement.icon;

  return (
    <div className="absolute top-24 md:top-32 left-1/2 transform -translate-x-1/2 z-[300] animate-bounce-in">
      <div className={`bg-gradient-to-r ${achievement.color} text-white px-6 py-4 rounded-2xl shadow-2xl border-4 border-white flex items-center space-x-3`}>
        <div className="bg-white/20 p-2 rounded-full">
          <Icon className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <div>
          <div className="text-xs font-semibold opacity-80">🎉 ACHIEVEMENT!</div>
          <div className="text-lg md:text-xl font-black">{achievement.title}</div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: translateY(-100px) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translateY(10px) scale(1.1);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
};
