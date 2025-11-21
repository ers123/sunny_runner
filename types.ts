/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  SHOP = 'SHOP',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export enum ObjectType {
  OBSTACLE = 'OBSTACLE',
  GEM = 'GEM',
  LETTER = 'LETTER',
  SHOP_PORTAL = 'SHOP_PORTAL',
  ALIEN = 'ALIEN',
  MISSILE = 'MISSILE'
}

export interface GameObject {
  id: string;
  type: ObjectType;
  position: [number, number, number]; // x, y, z
  active: boolean;
  value?: string; // For letters (G, E, M...)
  color?: string;
  targetIndex?: number; // Index in the GEMINI target word
  points?: number; // Score value for gems
  hasFired?: boolean; // For Aliens
}

export const LANE_WIDTH = 2.2;
export const JUMP_HEIGHT = 2.5;
export const JUMP_DURATION = 0.6; // seconds
export const RUN_SPEED_BASE = 22.5;
export const SPAWN_DISTANCE = 120;
export const REMOVE_DISTANCE = 20; // Behind player

// Magical Rainbow Pastel Colors for SPARKLE
export const SPARKLE_COLORS = [
    '#FF69B4', // S - Hot Pink
    '#DDA0DD', // P - Plum/Light Purple
    '#87CEEB', // A - Sky Blue
    '#FFB6C1', // R - Light Pink
    '#98FB98', // K - Pale Green
    '#E6E6FA', // L - Lavender
    '#FFE4E1', // E - Misty Rose
];

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    icon: any; // Lucide icon component
    oneTime?: boolean; // If true, remove from pool after buying
}

export interface Character {
    id: string;
    name: string;
    description: string;
    primaryColor: string; // Main character color
    secondaryColor: string; // Accent/glow color
    trailColor: string; // Particle trail color
    unlockCondition: string; // Description of how to unlock
    unlocked: boolean;
}

// Character definitions
export const CHARACTERS: Record<string, Omit<Character, 'unlocked'>> = {
    sparkle: {
        id: 'sparkle',
        name: '✨ Classic Sparkle',
        description: 'The original rainbow runner!',
        primaryColor: '#FF1493', // Deep Pink
        secondaryColor: '#FF69B4', // Hot Pink
        trailColor: '#FF69B4',
        unlockCondition: 'Default'
    },
    galaxy: {
        id: 'galaxy',
        name: '🌌 Galaxy Guardian',
        description: 'Cosmic power from the stars!',
        primaryColor: '#9370DB', // Medium Purple
        secondaryColor: '#7B68EE', // Medium Slate Blue
        trailColor: '#DDA0DD',
        unlockCondition: 'Reach Level 3'
    },
    rainbow: {
        id: 'rainbow',
        name: '🌈 Rainbow Warrior',
        description: 'All the colors of magic!',
        primaryColor: '#FF6B9D', // Pink-Red gradient start
        secondaryColor: '#C084FC', // Purple gradient
        trailColor: '#FFA500',
        unlockCondition: 'Collect 500 Gems'
    },
    golden: {
        id: 'golden',
        name: '⭐ Golden Champion',
        description: 'Shine bright like the sun!',
        primaryColor: '#FFD700', // Gold
        secondaryColor: '#FFA500', // Orange
        trailColor: '#FFFF00',
        unlockCondition: 'Get 20x Combo'
    },
    mystic: {
        id: 'mystic',
        name: '🌙 Mystic Moon',
        description: 'Grace of the moonlight!',
        primaryColor: '#E6E6FA', // Lavender
        secondaryColor: '#D8BFD8', // Thistle
        trailColor: '#FFFFFF',
        unlockCondition: 'Complete Level 10'
    }
};
