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
    trophy: 'bg-yellow-400',
    star: 'bg-purple-400',
    zap: 'bg-blue-400',
    award: 'bg-emerald-400'
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
    <div className="absolute top-24 md:top-32 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[300] animate-bounce-in">
      <div className={`${achievement.color} text-black px-6 py-4 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black flex items-center space-x-3`}>
        <div className="bg-white p-2 rounded-full border-2 border-black">
          <Icon className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Achievement Unlocked!</div>
          <div className="text-lg md:text-xl font-black uppercase tracking-tight">{achievement.title}</div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: translate(-50%, -100px) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, 10px) scale(1.1);
          }
          100% {
            transform: translate(-50%, 0) scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
};
