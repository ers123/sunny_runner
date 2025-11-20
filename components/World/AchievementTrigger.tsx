/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { showAchievement } from '../UI/AchievementPopup';

// Tracks which achievements have been shown
const shown = new Set<string>();

export const AchievementTrigger: React.FC = () => {
  const { combo, maxCombo, streak, collectedLetters, score, speed, level } = useStore();
  const prevValues = useRef({ combo: 0, streak: 0, score: 0, speed: 0, letters: 0 });

  useEffect(() => {
    // First 10x Combo
    if (combo >= 10 && prevValues.current.combo < 10 && !shown.has('combo10')) {
      shown.add('combo10');
      showAchievement('First 10x Combo!', 'zap');
    }

    // Mega Combo (20x)
    if (combo >= 20 && prevValues.current.combo < 20 && !shown.has('combo20')) {
      shown.add('combo20');
      showAchievement('Mega Combo Master!', 'trophy');
    }

    // Perfect Streak (3 letters)
    if (streak >= 3 && prevValues.current.streak < 3 && !shown.has('streak3')) {
      shown.add('streak3');
      showAchievement('Letter Streak!', 'star');
    }

    // Speed Demon (150% speed)
    if (speed >= 33.75 && prevValues.current.speed < 33.75 && !shown.has('speed150')) {
      shown.add('speed150');
      showAchievement('Speed Demon!', 'zap');
    }

    // First 1000 points
    if (score >= 1000 && prevValues.current.score < 1000 && !shown.has('score1000')) {
      shown.add('score1000');
      showAchievement('First 1,000 Sparkles!', 'award');
    }

    // 5000 points
    if (score >= 5000 && prevValues.current.score < 5000 && !shown.has('score5000')) {
      shown.add('score5000');
      showAchievement('Sparkle Collector!', 'trophy');
    }

    // Level Up
    if (level > 1 && prevValues.current.letters === 7 && collectedLetters.length === 0 && !shown.has(`level${level}`)) {
      shown.add(`level${level}`);
      showAchievement(`Level ${level} Unlocked!`, 'star');
    }

    // Update previous values
    prevValues.current = { combo, streak, score, speed, letters: collectedLetters.length };
  }, [combo, streak, score, speed, level, collectedLetters]);

  return null;
};
