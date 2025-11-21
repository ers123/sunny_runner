/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * Local Leaderboard System
 * Stores top 10 scores in localStorage (no database needed!)
 */

export interface LeaderboardEntry {
  score: number;
  level: number;
  maxCombo: number;
  characterId: string;
  timestamp: number;
}

const LEADERBOARD_KEY = 'sparkle_runner_leaderboard';
const MAX_ENTRIES = 10;

class LeaderboardSystem {
  getLeaderboard(): LeaderboardEntry[] {
    try {
      const stored = localStorage.getItem(LEADERBOARD_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      return [];
    }
  }

  addScore(entry: Omit<LeaderboardEntry, 'timestamp'>): boolean {
    const leaderboard = this.getLeaderboard();
    const newEntry: LeaderboardEntry = {
      ...entry,
      timestamp: Date.now()
    };

    // Check if score makes the top 10
    if (leaderboard.length >= MAX_ENTRIES && entry.score <= leaderboard[leaderboard.length - 1].score) {
      return false; // Not good enough for leaderboard
    }

    // Add new entry
    leaderboard.push(newEntry);

    // Sort by score (highest first)
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep only top 10
    const top10 = leaderboard.slice(0, MAX_ENTRIES);

    // Save to localStorage
    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top10));
      return true; // New high score!
    } catch (error) {
      console.error('Failed to save leaderboard:', error);
      return false;
    }
  }

  getPersonalBest(): number {
    const leaderboard = this.getLeaderboard();
    if (leaderboard.length === 0) return 0;
    return leaderboard[0].score;
  }

  isNewHighScore(score: number): boolean {
    const personalBest = this.getPersonalBest();
    return score > personalBest;
  }

  getRank(score: number): number {
    const leaderboard = this.getLeaderboard();
    const rank = leaderboard.findIndex(entry => score > entry.score);
    return rank === -1 ? leaderboard.length + 1 : rank + 1;
  }

  clearLeaderboard() {
    localStorage.removeItem(LEADERBOARD_KEY);
  }
}

export const leaderboard = new LeaderboardSystem();
