/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import { create } from 'zustand';
import { GameStatus, RUN_SPEED_BASE } from './types';

interface GameState {
  status: GameStatus;
  score: number;
  lives: number;
  maxLives: number;
  speed: number;
  collectedLetters: number[];
  level: number;
  laneCount: number;
  gemsCollected: number;
  distance: number;

  // Inventory / Abilities
  hasDoubleJump: boolean;
  hasImmortality: boolean;
  isImmortalityActive: boolean;

  // NEW: Combo/Streak System for visual rewards
  combo: number;
  maxCombo: number;
  streak: number; // Letters collected in a row

  // Character System
  selectedCharacter: string;
  unlockedCharacters: string[];

  // Daily Challenge
  dailyChallengeCompleted: boolean;

  // Actions
  startGame: () => void;
  restartGame: () => void;
  takeDamage: () => void;
  addScore: (amount: number) => void;
  collectGem: (value: number) => void;
  collectLetter: (index: number) => void;
  setStatus: (status: GameStatus) => void;
  setDistance: (dist: number) => void;
  resetCombo: () => void;

  // Shop / Abilities
  buyItem: (type: 'DOUBLE_JUMP' | 'MAX_LIFE' | 'HEAL' | 'IMMORTAL', cost: number) => boolean;
  advanceLevel: () => void;
  openShop: () => void;
  closeShop: () => void;
  activateImmortality: () => void;

  // Character Actions
  selectCharacter: (characterId: string) => void;
  checkUnlocks: () => void;

  // Daily Challenge Actions
  checkDailyChallenge: () => void;
}

const SPARKLE_TARGET = ['S', 'P', 'A', 'R', 'K', 'L', 'E'];
const MAX_LEVEL = 10;

export const useStore = create<GameState>((set, get) => ({
  status: GameStatus.MENU,
  score: 0,
  lives: 3,
  maxLives: 3,
  speed: 0,
  collectedLetters: [],
  level: 1,
  laneCount: 3,
  gemsCollected: 0,
  distance: 0,

  hasDoubleJump: false,
  hasImmortality: false,
  isImmortalityActive: false,

  // Combo system
  combo: 0,
  maxCombo: 0,
  streak: 0,

  // Character system
  selectedCharacter: 'sparkle', // Default character
  unlockedCharacters: ['sparkle'], // Start with sparkle unlocked

  // Daily challenge
  dailyChallengeCompleted: false,

  startGame: () => set({
    status: GameStatus.PLAYING,
    score: 0,
    lives: 3,
    maxLives: 3,
    speed: RUN_SPEED_BASE,
    collectedLetters: [],
    level: 1,
    laneCount: 3,
    gemsCollected: 0,
    distance: 0,
    hasDoubleJump: false,
    hasImmortality: false,
    isImmortalityActive: false,
    combo: 0,
    maxCombo: 0,
    streak: 0
  }),

  restartGame: () => set({
    status: GameStatus.PLAYING,
    score: 0,
    lives: 3,
    maxLives: 3,
    speed: RUN_SPEED_BASE,
    collectedLetters: [],
    level: 1,
    laneCount: 3,
    gemsCollected: 0,
    distance: 0,
    hasDoubleJump: false,
    hasImmortality: false,
    isImmortalityActive: false,
    combo: 0,
    maxCombo: 0,
    streak: 0
  }),

  takeDamage: () => {
    const { lives, isImmortalityActive } = get();
    if (isImmortalityActive) return; // No damage if skill is active

    // Reset combo on damage - encourages careful play
    set({ combo: 0, streak: 0 });

    if (lives > 1) {
      set({ lives: lives - 1 });
    } else {
      set({ lives: 0, status: GameStatus.GAME_OVER, speed: 0 });
    }
  },

  addScore: (amount) => set((state) => ({ score: state.score + amount })),

  collectGem: (value) => set((state) => {
    const newCombo = state.combo + 1;
    const comboBonus = Math.floor(newCombo / 5) * 50; // +50 bonus every 5 gems!
    return {
      score: state.score + value + comboBonus,
      gemsCollected: state.gemsCollected + 1,
      combo: newCombo,
      maxCombo: Math.max(state.maxCombo, newCombo)
    };
  }),

  setDistance: (dist) => set({ distance: dist }),

  resetCombo: () => set({ combo: 0 }),

  collectLetter: (index) => {
    const { collectedLetters, level, speed, streak } = get();

    if (!collectedLetters.includes(index)) {
      const newLetters = [...collectedLetters, index];
      const newStreak = streak + 1;

      // LINEAR SPEED INCREASE: Add 10% of BASE speed per letter
      // This ensures 110% -> 120% -> 130% consistent steps
      const speedIncrease = RUN_SPEED_BASE * 0.10;
      const nextSpeed = speed + speedIncrease;

      // Streak bonus: 100 points per letter in streak!
      const streakBonus = newStreak * 100;

      set({
        collectedLetters: newLetters,
        speed: nextSpeed,
        streak: newStreak,
        score: get().score + streakBonus
      });

      // Check if full word collected
      if (newLetters.length === SPARKLE_TARGET.length) {
        if (level < MAX_LEVEL) {
            // Immediately advance level
            // The Shop Portal will be spawned by LevelManager at the start of the new level
            get().advanceLevel();
        } else {
            // Victory Condition
            set({
                status: GameStatus.VICTORY,
                score: get().score + 5000
            });
        }
      }
    }
  },

  advanceLevel: () => {
      const { level, laneCount, speed } = get();
      const nextLevel = level + 1;

      // LINEAR LEVEL INCREASE: Add 40% of BASE speed per level
      // Combined with the 7 letters (70%), this totals +110% speed per full level cycle
      const speedIncrease = RUN_SPEED_BASE * 0.40;
      const newSpeed = speed + speedIncrease;

      set({
          level: nextLevel,
          laneCount: Math.min(laneCount + 2, 9), // Expand lanes
          status: GameStatus.PLAYING, // Keep playing, user runs into shop
          speed: newSpeed,
          collectedLetters: [], // Reset letters
          streak: 0 // Reset streak for new level
      });
  },

  openShop: () => set({ status: GameStatus.SHOP }),

  closeShop: () => set({ status: GameStatus.PLAYING }),

  buyItem: (type, cost) => {
      const { score, maxLives, lives } = get();

      if (score >= cost) {
          set({ score: score - cost });

          switch (type) {
              case 'DOUBLE_JUMP':
                  set({ hasDoubleJump: true });
                  break;
              case 'MAX_LIFE':
                  set({ maxLives: maxLives + 1, lives: lives + 1 });
                  break;
              case 'HEAL':
                  set({ lives: Math.min(lives + 1, maxLives) });
                  break;
              case 'IMMORTAL':
                  set({ hasImmortality: true });
                  break;
          }
          return true;
      }
      return false;
  },

  activateImmortality: () => {
      const { hasImmortality, isImmortalityActive } = get();
      if (hasImmortality && !isImmortalityActive) {
          set({ isImmortalityActive: true });

          // Lasts 5 seconds
          setTimeout(() => {
              set({ isImmortalityActive: false });
          }, 5000);
      }
  },

  setStatus: (status) => set({ status }),
  increaseLevel: () => set((state) => ({ level: state.level + 1 })),

  // Character functions
  selectCharacter: (characterId: string) => {
      const { unlockedCharacters } = get();
      if (unlockedCharacters.includes(characterId)) {
          set({ selectedCharacter: characterId });
      }
  },

  checkUnlocks: () => {
      const { level, gemsCollected, maxCombo, unlockedCharacters } = get();
      const newUnlocks = [...unlockedCharacters];

      // Galaxy: Reach Level 3
      if (level >= 3 && !newUnlocks.includes('galaxy')) {
          newUnlocks.push('galaxy');
      }

      // Rainbow: Collect 500 Gems
      if (gemsCollected >= 500 && !newUnlocks.includes('rainbow')) {
          newUnlocks.push('rainbow');
      }

      // Golden: Get 20x Combo
      if (maxCombo >= 20 && !newUnlocks.includes('golden')) {
          newUnlocks.push('golden');
      }

      // Mystic: Complete Level 10
      if (level >= 10 && !newUnlocks.includes('mystic')) {
          newUnlocks.push('mystic');
      }

      // Update if changed
      if (newUnlocks.length !== unlockedCharacters.length) {
          set({ unlockedCharacters: newUnlocks });
      }
  },

  // Daily Challenge
  checkDailyChallenge: () => {
      const { level, gemsCollected, maxCombo, distance } = get();
      try {
          // Dynamically import to avoid circular dependencies
          const { dailyChallenge } = require('../components/System/DailyChallenge');
          const completedChallenge = dailyChallenge.checkChallengeCompletion({
              gemsCollected,
              level,
              maxCombo,
              distance
          });

          if (completedChallenge) {
              set({ dailyChallengeCompleted: true });
          }
      } catch (error) {
          console.error('Failed to check daily challenge:', error);
      }
  },
}));
