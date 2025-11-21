/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * Daily Challenge and Streak System
 * Drives retention through daily engagement (Duolingo-style)
 */

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: string;
  type: 'gems' | 'score' | 'level' | 'combo' | 'letters';
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPlayDate: string; // ISO date string (YYYY-MM-DD)
  totalDaysPlayed: number;
}

const DAILY_CHALLENGE_KEY = 'sparkle_runner_daily_challenge';
const STREAK_KEY = 'sparkle_runner_streak';

class DailySystemManager {
  // Get today's date as string (YYYY-MM-DD)
  private getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Generate daily challenge (changes every day)
  generateDailyChallenge(): DailyChallenge {
    const today = this.getTodayString();
    const stored = localStorage.getItem(DAILY_CHALLENGE_KEY);

    if (stored) {
      try {
        const challenge = JSON.parse(stored);
        // Check if it's still today's challenge
        if (challenge.date === today) {
          return challenge;
        }
      } catch (error) {
        console.error('Failed to parse daily challenge:', error);
      }
    }

    // Generate new challenge for today
    const challenges = [
      {
        id: 'gems-100',
        title: '💎 Gem Hunter',
        description: 'Collect 100 gems in a single run',
        target: 100,
        type: 'gems' as const,
        reward: '50 bonus gems next run!'
      },
      {
        id: 'score-5000',
        title: '🌟 Score Master',
        description: 'Score 5,000 points in one game',
        target: 5000,
        type: 'score' as const,
        reward: 'Unlock hint for character!'
      },
      {
        id: 'level-5',
        title: '🎯 Level Champion',
        description: 'Reach level 5',
        target: 5,
        type: 'level' as const,
        reward: 'Extra life next game!'
      },
      {
        id: 'combo-15',
        title: '🔥 Combo King',
        description: 'Get a 15x combo',
        target: 15,
        type: 'combo' as const,
        reward: 'Double jump unlocked!'
      },
      {
        id: 'letters-full',
        title: '✨ Perfect Spelling',
        description: 'Spell SPARKLE twice in one game',
        target: 14, // 7 letters x 2
        type: 'letters' as const,
        reward: '100 gem bonus!'
      }
    ];

    // Use date as seed for consistent daily challenge
    const seed = parseInt(today.replace(/-/g, '')) % challenges.length;
    const newChallenge = {
      ...challenges[seed],
      progress: 0,
      date: today
    };

    this.saveDailyChallenge(newChallenge);
    return newChallenge;
  }

  private saveDailyChallenge(challenge: any) {
    try {
      localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(challenge));
    } catch (error) {
      console.error('Failed to save daily challenge:', error);
    }
  }

  updateChallengeProgress(type: DailyChallenge['type'], value: number) {
    const challenge = this.generateDailyChallenge();
    if (challenge.type === type && challenge.progress < challenge.target) {
      challenge.progress = Math.min(value, challenge.target);
      this.saveDailyChallenge(challenge);
    }
  }

  isChallengeComplete(): boolean {
    const challenge = this.generateDailyChallenge();
    return challenge.progress >= challenge.target;
  }

  // Streak System
  getStreakData(): StreakData {
    try {
      const stored = localStorage.getItem(STREAK_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load streak data:', error);
    }

    // Default streak data
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastPlayDate: '',
      totalDaysPlayed: 0
    };
  }

  recordPlay() {
    const today = this.getTodayString();
    const streak = this.getStreakData();

    // Already played today
    if (streak.lastPlayDate === today) {
      return streak;
    }

    // Calculate yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    // Check if streak continues
    if (streak.lastPlayDate === yesterdayString) {
      // Streak continues!
      streak.currentStreak++;
    } else if (streak.lastPlayDate === '') {
      // First play ever
      streak.currentStreak = 1;
    } else {
      // Streak broken, start new one
      streak.currentStreak = 1;
    }

    streak.lastPlayDate = today;
    streak.totalDaysPlayed++;
    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);

    this.saveStreakData(streak);
    return streak;
  }

  private saveStreakData(streak: StreakData) {
    try {
      localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
    } catch (error) {
      console.error('Failed to save streak data:', error);
    }
  }

  getStreakReward(streak: number): string | null {
    if (streak >= 7) return '🎁 7-Day Reward: 500 Gems!';
    if (streak >= 3) return '🌟 3-Day Reward: Special Character!';
    return null;
  }
}

export const dailySystem = new DailySystemManager();
