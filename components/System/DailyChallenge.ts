/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * Daily Challenge & Streak System
 * Provides daily challenges and tracks play streaks
 */

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  reward: number;
  emoji: string;
  type: 'gems' | 'level' | 'combo' | 'distance';
}

export interface StreakData {
  currentStreak: number;
  lastPlayDate: number;
  totalDaysPlayed: number;
  longestStreak: number;
}

const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'gems-100',
    title: 'Gem Collector',
    description: 'Collect 100 gems in one run',
    target: 100,
    reward: 500,
    emoji: '💎',
    type: 'gems'
  },
  {
    id: 'level-5',
    title: 'Level Master',
    description: 'Reach level 5 or higher',
    target: 5,
    reward: 750,
    emoji: '⭐',
    type: 'level'
  },
  {
    id: 'combo-25',
    title: 'Combo King',
    description: 'Get a 25x combo in one run',
    target: 25,
    reward: 600,
    emoji: '🔥',
    type: 'combo'
  },
  {
    id: 'distance-500',
    title: 'Distance Runner',
    description: 'Run 500 meters or more',
    target: 500,
    reward: 400,
    emoji: '🏃',
    type: 'distance'
  }
];

const STREAK_KEY = 'sparkle_runner_streak';
const CHALLENGE_KEY = 'sparkle_runner_challenge';

class DailyChallengeSystem {
  private getTodayKey(): string {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  }

  getDailyChallenge(): DailyChallenge {
    try {
      const stored = localStorage.getItem(CHALLENGE_KEY);
      const data = stored ? JSON.parse(stored) : { date: '', challengeIndex: 0 };
      const todayKey = this.getTodayKey();

      // If it's a new day, pick a new challenge
      if (data.date !== todayKey) {
        const challengeIndex = Math.floor(Math.random() * DAILY_CHALLENGES.length);
        localStorage.setItem(CHALLENGE_KEY, JSON.stringify({
          date: todayKey,
          challengeIndex
        }));
        return DAILY_CHALLENGES[challengeIndex];
      }

      return DAILY_CHALLENGES[data.challengeIndex];
    } catch (error) {
      console.error('Failed to get daily challenge:', error);
      return DAILY_CHALLENGES[0];
    }
  }

  checkChallengeCompletion(stats: {
    gemsCollected: number;
    level: number;
    maxCombo: number;
    distance: number;
  }): DailyChallenge | null {
    const challenge = this.getDailyChallenge();

    let isCompleted = false;
    switch (challenge.type) {
      case 'gems':
        isCompleted = stats.gemsCollected >= challenge.target;
        break;
      case 'level':
        isCompleted = stats.level >= challenge.target;
        break;
      case 'combo':
        isCompleted = stats.maxCombo >= challenge.target;
        break;
      case 'distance':
        isCompleted = stats.distance >= challenge.target;
        break;
    }

    return isCompleted ? challenge : null;
  }

  getStreakData(): StreakData {
    try {
      const stored = localStorage.getItem(STREAK_KEY);
      if (!stored) {
        return {
          currentStreak: 0,
          lastPlayDate: 0,
          totalDaysPlayed: 0,
          longestStreak: 0
        };
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to get streak data:', error);
      return {
        currentStreak: 0,
        lastPlayDate: 0,
        totalDaysPlayed: 0,
        longestStreak: 0
      };
    }
  }

  updateStreak(): StreakData {
    const streak = this.getStreakData();
    const today = new Date();
    const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    // Check if player already played today
    const lastPlayDate = new Date(streak.lastPlayDate);
    const lastPlayDay = new Date(lastPlayDate.getFullYear(), lastPlayDate.getMonth(), lastPlayDate.getDate()).getTime();

    if (lastPlayDay === todayTime) {
      // Already played today, don't update streak
      return streak;
    }

    // Check if it's a consecutive day
    const yesterday = todayTime - (24 * 60 * 60 * 1000);
    if (lastPlayDay === yesterday) {
      // Consecutive day - continue streak
      streak.currentStreak += 1;
    } else {
      // Streak broken - start new
      streak.currentStreak = 1;
    }

    // Update tracking
    streak.lastPlayDate = Date.now();
    streak.totalDaysPlayed += 1;
    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);

    try {
      localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
    } catch (error) {
      console.error('Failed to save streak:', error);
    }

    return streak;
  }

  getStreakReward(): { bonus: number; message: string } {
    const streak = this.getStreakData();

    if (streak.currentStreak >= 7) {
      return { bonus: 500, message: '🔥 7-Day Streak! +500 Bonus Gems! 🔥' };
    } else if (streak.currentStreak >= 3) {
      return { bonus: 200, message: '⭐ 3-Day Streak! +200 Bonus Gems! ⭐' };
    } else if (streak.currentStreak >= 1) {
      return { bonus: 50, message: '✨ Day 1 Streak! +50 Bonus Gems! ✨' };
    }

    return { bonus: 0, message: '' };
  }

  resetStreak() {
    localStorage.removeItem(STREAK_KEY);
  }

  clearChallenge() {
    localStorage.removeItem(CHALLENGE_KEY);
  }
}

export const dailyChallenge = new DailyChallengeSystem();
