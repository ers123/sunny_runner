/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect } from 'react';
import { Heart, Zap, Trophy, MapPin, Diamond, Rocket, ArrowUpCircle, Shield, Activity, PlusCircle, Play } from 'lucide-react';
import { useStore } from '../../store';
import { GameStatus, SPARKLE_COLORS, ShopItem, RUN_SPEED_BASE } from '../../types';
import { audio } from '../System/Audio';
import { bgm } from '../System/BGM';
import { FloatingTextDisplay } from './FloatingText';
import { AchievementPopup } from './AchievementPopup';
import { CharacterSelector } from './CharacterSelector';
import { ShareScore } from './ShareScore';
import { LeaderboardView } from './LeaderboardView';
import { VolumeControl } from './VolumeControl';
import { leaderboard } from '../System/Leaderboard';
import { DailyChallengeUI } from './DailyChallengeUI';
import { dailyChallenge } from '../System/DailyChallenge';

// Available Shop Items
const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'DOUBLE_JUMP',
        name: 'MAGICAL WINGS',
        description: 'Jump again in mid-air with magical fairy wings!',
        cost: 1000,
        icon: ArrowUpCircle,
        oneTime: true
    },
    {
        id: 'MAX_LIFE',
        name: 'EXTRA HEART',
        description: 'Adds a sparkly heart and heals you instantly!',
        cost: 1500,
        icon: Activity
    },
    {
        id: 'HEAL',
        name: 'HEALING POTION',
        description: 'Restores 1 heart with magical sparkles!',
        cost: 1000,
        icon: PlusCircle
    },
    {
        id: 'IMMORTAL',
        name: 'RAINBOW SHIELD',
        description: 'Press Space/Tap for 5 seconds of rainbow protection!',
        cost: 3000,
        icon: Shield,
        oneTime: true
    }
];

const ShopScreen: React.FC = () => {
    const { score, buyItem, closeShop, hasDoubleJump, hasImmortality } = useStore();
    const [items, setItems] = useState<ShopItem[]>([]);

    useEffect(() => {
        // Select 3 random items, filtering out one-time items already bought
        let pool = SHOP_ITEMS.filter(item => {
            if (item.id === 'DOUBLE_JUMP' && hasDoubleJump) return false;
            if (item.id === 'IMMORTAL' && hasImmortality) return false;
            return true;
        });

        // Shuffle and pick 3
        pool = pool.sort(() => 0.5 - Math.random());
        setItems(pool.slice(0, 3));
    }, []);

    return (
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100 to-purple-100 z-[100] text-purple-900 pointer-events-auto backdrop-blur-md overflow-y-auto">
             <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                 <h2 className="text-3xl md:text-4xl font-black text-pink-600 mb-2 tracking-widest text-center drop-shadow-lg">✨ SPARKLE SHOP ✨</h2>
                 <div className="flex items-center text-purple-700 mb-6 md:mb-8">
                     <span className="text-base md:text-lg mr-2">💎 Sparkles Available:</span>
                     <span className="text-xl md:text-2xl font-bold">{score.toLocaleString()}</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl w-full mb-8">
                     {items.map(item => {
                         const Icon = item.icon;
                         const canAfford = score >= item.cost;
                         return (
                             <div key={item.id} className="bg-white/90 border-4 border-pink-300 p-4 md:p-6 rounded-3xl flex flex-col items-center text-center hover:border-purple-400 hover:shadow-xl transition-all shadow-lg">
                                 <div className="bg-gradient-to-br from-pink-200 to-purple-200 p-3 md:p-4 rounded-full mb-3 md:mb-4">
                                     <Icon className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                                 </div>
                                 <h3 className="text-lg md:text-xl font-bold mb-2 text-pink-600">{item.name}</h3>
                                 <p className="text-purple-700 text-xs md:text-sm mb-4 h-10 md:h-12 flex items-center justify-center">{item.description}</p>
                                 <button
                                    onClick={() => buyItem(item.id as any, item.cost)}
                                    disabled={!canAfford}
                                    className={`px-4 md:px-6 py-2 rounded-full font-bold w-full text-sm md:text-base ${canAfford ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:brightness-110 hover:scale-105' : 'bg-gray-300 cursor-not-allowed opacity-50 text-gray-500'}`}
                                 >
                                     ✨ {item.cost} Sparkles
                                 </button>
                             </div>
                         );
                     })}
                 </div>

                 <button
                    onClick={closeShop}
                    className="flex items-center px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg md:text-xl rounded-full hover:scale-105 transition-all shadow-xl"
                 >
                     🌟 Continue Running! <Play className="ml-2 w-5 h-5" fill="white" />
                 </button>
             </div>
        </div>
    );
};

export const HUD: React.FC = () => {
  const { score, lives, maxLives, collectedLetters, status, level, restartGame, startGame, gemsCollected, distance, isImmortalityActive, speed, combo, maxCombo, streak, checkUnlocks, selectedCharacter, checkDailyChallenge } = useStore();
  const target = ['S', 'P', 'A', 'R', 'K', 'L', 'E'];
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [showShareScore, setShowShareScore] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  // Common container style
  const containerClass = "absolute inset-0 w-full h-full flex flex-col justify-between p-4 md:p-8 z-50";

  // BGM Control - Start music when playing, stop when game over
  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      bgm.start(); // Randomly selects a track
    } else if (status === GameStatus.GAME_OVER || status === GameStatus.MENU) {
      bgm.stop();
    }
  }, [status]);

  // Check for character unlocks based on progress
  useEffect(() => {
    checkUnlocks();
  }, [level, gemsCollected, combo, checkUnlocks]);

  // Save score to leaderboard when game ends
  useEffect(() => {
    if (status === GameStatus.GAME_OVER || status === GameStatus.VICTORY) {
      const wasHighScore = leaderboard.addScore({
        score,
        level,
        maxCombo,
        characterId: selectedCharacter
      });
      setIsNewHighScore(wasHighScore);

      // Check daily challenge and update streak
      checkDailyChallenge();
      const challenge = dailyChallenge.getDailyChallenge();
      const completed = dailyChallenge.checkChallengeCompletion({
        gemsCollected,
        level,
        maxCombo,
        distance
      });
      setChallengeCompleted(!!completed);

      // Update streak
      dailyChallenge.updateStreak();
    }
  }, [status, score, level, maxCombo, selectedCharacter, gemsCollected, distance, checkDailyChallenge]);

  if (status === GameStatus.SHOP) {
      return <ShopScreen />;
  }

  if (status === GameStatus.GAME_OVER) {
      return (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-purple-300 to-pink-200 z-[100] text-purple-900 pointer-events-auto overflow-y-auto flex items-center justify-center p-4">
              <div className="flex flex-col items-center justify-center w-full max-w-md py-8">
                {/* New High Score Banner */}
                {isNewHighScore && (
                  <div className="mb-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-black text-lg sm:text-xl md:text-2xl rounded-full animate-bounce shadow-2xl">
                    🏆 NEW HIGH SCORE! 🏆
                  </div>
                )}

                {/* Daily Challenge Completed Banner */}
                {challengeCompleted && (
                  <div className="mb-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-400 to-orange-500 text-white font-black text-sm sm:text-lg md:text-xl rounded-full animate-bounce shadow-2xl">
                    🔥 DAILY CHALLENGE! 🔥
                  </div>
                )}

                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-pink-600 mb-6 drop-shadow-lg text-center">💔 Oh No! 💔</h1>

                <div className="space-y-2 sm:space-y-3 mb-8 w-full">
                    <div className="bg-white/80 p-3 sm:p-4 rounded-2xl border-2 border-purple-300 flex items-center justify-between">
                        <div className="flex items-center text-purple-600 text-xs sm:text-sm"><Trophy className="mr-2 w-4 h-4 sm:w-5 sm:h-5"/> Level</div>
                        <div className="text-lg sm:text-xl md:text-2xl font-bold">{level} / 10</div>
                    </div>
                    <div className="bg-white/80 p-3 sm:p-4 rounded-2xl border-2 border-purple-300 flex items-center justify-between">
                        <div className="flex items-center text-pink-600 text-xs sm:text-sm"><Diamond className="mr-2 w-4 h-4 sm:w-5 sm:h-5"/> Stars</div>
                        <div className="text-lg sm:text-xl md:text-2xl font-bold">{gemsCollected}</div>
                    </div>
                    <div className="bg-white/80 p-3 sm:p-4 rounded-2xl border-2 border-purple-300 flex items-center justify-between">
                        <div className="flex items-center text-blue-600 text-xs sm:text-sm"><MapPin className="mr-2 w-4 h-4 sm:w-5 sm:h-5"/> Distance</div>
                        <div className="text-lg sm:text-xl md:text-2xl font-bold">{Math.floor(distance)}m</div>
                    </div>
                     <div className="bg-gradient-to-r from-pink-200 to-purple-200 p-3 sm:p-4 rounded-2xl flex items-center justify-between border-2 border-pink-400">
                        <div className="flex items-center text-purple-700 text-xs sm:text-sm font-bold">✨ Sparkles</div>
                        <div className="text-lg sm:text-xl md:text-3xl font-bold text-pink-600">{score.toLocaleString()}</div>
                    </div>
                </div>

                <div className="text-center mb-6 text-purple-700 font-semibold text-sm sm:text-base">
                    💪 Don't give up! Try again! 💪
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <button
                    onClick={() => setShowShareScore(true)}
                    className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold text-sm sm:text-lg rounded-full hover:scale-105 transition-all shadow-xl"
                  >
                      📸 Share
                  </button>

                  <button
                    onClick={() => { audio.init(); restartGame(); }}
                    className="px-4 sm:px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-sm sm:text-lg rounded-full hover:scale-105 transition-all shadow-xl"
                  >
                      🌟 Retry
                  </button>
                </div>
              </div>

              {/* Share Score Modal */}
              {showShareScore && (
                <ShareScore onClose={() => setShowShareScore(false)} />
              )}
          </div>
      );
  }

  if (status === GameStatus.VICTORY) {
    return (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-yellow-200 via-pink-200 to-purple-200 z-[100] text-purple-900 pointer-events-auto overflow-y-auto flex items-center justify-center p-4">
            <div className="flex flex-col items-center justify-center w-full max-w-md py-8">
                {/* Daily Challenge Completed Banner */}
                {challengeCompleted && (
                  <div className="mb-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-400 to-orange-500 text-white font-black text-sm sm:text-lg md:text-xl rounded-full animate-bounce shadow-2xl">
                    🔥 DAILY CHALLENGE! 🔥
                  </div>
                )}

                <div className="text-5xl sm:text-6xl md:text-8xl mb-4 animate-bounce">🎉</div>
                <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-2 drop-shadow-lg text-center leading-tight">
                    YOU DID IT!
                </h1>
                <p className="text-pink-600 text-sm sm:text-lg md:text-2xl font-bold mb-8 text-center">
                    ✨ All SPARKLE letters! ✨
                </p>

                <div className="space-y-4 mb-8 w-full">
                    <div className="bg-white/80 p-4 sm:p-6 rounded-3xl border-4 border-pink-300 shadow-xl">
                        <div className="text-xs sm:text-sm text-purple-600 mb-1 tracking-wider font-bold">🌟 FINAL SPARKLES 🌟</div>
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-600">{score.toLocaleString()}</div>
                    </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/80 p-3 sm:p-4 rounded-2xl border-2 border-pink-300">
                            <div className="text-xs text-purple-600 font-semibold">⭐ Stars</div>
                            <div className="text-lg sm:text-xl md:text-2xl font-bold text-pink-600">{gemsCollected}</div>
                        </div>
                        <div className="bg-white/80 p-3 sm:p-4 rounded-2xl border-2 border-purple-300">
                             <div className="text-xs text-purple-600 font-semibold">📏 Distance</div>
                            <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">{Math.floor(distance)}m</div>
                        </div>
                     </div>
                </div>

                <div className="text-center mb-6 text-purple-700 text-sm sm:text-base md:text-lg font-bold">
                    🎊 Amazing job, superstar! 🎊
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <button
                    onClick={() => setShowShareScore(true)}
                    className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold text-sm sm:text-lg rounded-full hover:scale-105 transition-all shadow-xl"
                  >
                      📸 Share
                  </button>

                  <button
                    onClick={() => { audio.init(); restartGame(); }}
                    className="px-4 sm:px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-sm sm:text-lg rounded-full hover:scale-105 transition-all shadow-2xl"
                  >
                      ✨ Again! ✨
                  </button>
                </div>
            </div>

            {/* Share Score Modal */}
            {showShareScore && (
              <ShareScore onClose={() => setShowShareScore(false)} />
            )}
        </div>
    );
  }

  return (
    <div className={containerClass}>
        {/* ===== TOP SECTION - FULL WIDTH WITH LEFT/RIGHT SPLIT ===== */}
        <div className="flex justify-between items-start gap-3 sm:gap-4 w-full flex-shrink-0">
            {/* Left Side: Score & Level */}
            <div className="flex flex-col gap-2 sm:gap-3 flex-shrink-0">
                {/* BIG SCORE DISPLAY */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 rounded-3xl blur-lg opacity-60 animate-pulse"></div>
                    <div className="relative font-bubbly text-3xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-2xl bg-gradient-to-b from-yellow-400 to-orange-400 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-3xl border-4 border-white shadow-2xl transform hover:scale-105 transition-transform">
                        ✨ {score.toLocaleString()}
                    </div>
                </div>

                {/* Level Badge with Progress */}
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 px-3 sm:px-5 md:px-6 py-1 sm:py-2 md:py-3 rounded-full border-3 sm:border-4 border-white shadow-lg md:shadow-xl">
                    <div className="text-white font-black text-xs sm:text-sm md:text-base text-center">
                        🌟 Lvl {level}/10 🌟
                    </div>
                    {/* Progress Bar */}
                    <div className="w-32 sm:w-40 md:w-48 bg-white/30 rounded-full h-1.5 sm:h-2 mt-1 md:mt-2 overflow-hidden border border-white">
                        <div
                            className="bg-gradient-to-r from-yellow-300 to-orange-400 h-full transition-all duration-300"
                            style={{ width: `${(level / 10) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Right Side: Lives & Gems */}
            <div className="flex flex-col gap-2 sm:gap-3 items-end flex-shrink-0">
                {/* LIVES - BIG AND COLORFUL */}
                <div className="bg-gradient-to-r from-red-400 to-pink-400 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-2xl md:rounded-3xl border-3 sm:border-4 border-white shadow-lg md:shadow-2xl">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-white font-black text-xs sm:text-sm md:text-lg">❤️ {lives}/{maxLives}</span>
                    </div>
                </div>

                {/* GEMS - Big and Sparkly */}
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-2xl md:rounded-3xl border-3 sm:border-4 border-white shadow-lg md:shadow-2xl">
                    <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl md:text-3xl animate-bounce">💎</span>
                        <span className="text-white font-black text-sm sm:text-base md:text-lg">{gemsCollected}</span>
                    </div>
                </div>

                {/* Volume Control */}
                <div className="bg-white/90 p-1.5 sm:p-2 md:p-3 rounded-lg md:rounded-2xl border-2 sm:border-3 border-purple-300 shadow-md md:shadow-lg">
                    <VolumeControl />
                </div>
            </div>
        </div>

        {/* ===== CENTER SECTION - SPARKLE LETTERS & COMBO ===== */}
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-grow">
            <div className="text-center">
                <p className="text-white font-black text-xs sm:text-sm md:text-base drop-shadow-lg mb-2 md:mb-3">
                    ✨ COLLECT LETTERS TO SPELL ✨
                </p>
                <div className="flex gap-0.5 sm:gap-1 md:gap-2 justify-center flex-wrap px-2 sm:px-3 md:px-4">
                    {target.map((char, idx) => {
                        const isCollected = collectedLetters.includes(idx);
                        const color = SPARKLE_COLORS[idx];

                        return (
                            <div
                                key={idx}
                                style={{
                                    borderColor: isCollected ? color : '#E5E7EB',
                                    backgroundColor: isCollected ? color : 'rgba(255, 255, 255, 0.8)',
                                    boxShadow: isCollected
                                        ? `0 0 20px ${color}, 0 0 40px ${color}`
                                        : 'none'
                                }}
                                className={`w-7 h-9 sm:w-8 sm:h-10 md:w-10 md:h-12 flex items-center justify-center border-3 sm:border-4 font-black text-sm sm:text-base md:text-lg rounded-lg md:rounded-2xl transform transition-all duration-300 ${
                                    isCollected
                                        ? 'scale-125 animate-bounce'
                                        : 'scale-100'
                                }`}
                            >
                                <span
                                    style={{
                                        color: isCollected ? '#FFFFFF' : '#9CA3AF'
                                    }}
                                >
                                    {char}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Big Combo Display */}
            {combo > 0 && (
                <div className="animate-bounce">
                    <div className={`bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full font-black text-lg sm:text-2xl md:text-3xl border-3 sm:border-4 border-white shadow-lg md:shadow-2xl drop-shadow-lg ${
                        combo >= 5 ? 'animate-pulse' : ''
                    }`}>
                        🔥 {combo}x COMBO! 🔥
                    </div>
                </div>
            )}
        </div>

        {/* Active Skill Indicator */}
        {isImmortalityActive && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
                <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-white font-black text-sm sm:text-lg md:text-2xl animate-pulse px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full border-3 sm:border-4 border-white shadow-lg md:shadow-2xl drop-shadow-lg flex items-center justify-center gap-2">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 fill-white" />
                    🌈 IMMORTAL! 🌈
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 fill-white" />
                </div>
            </div>
        )}

        {/* ===== BOTTOM SECTION ===== */}
        <div className="w-full flex justify-between items-end gap-2 flex-shrink-0">
            {/* Left: Best Combo Stats */}
            <div className="flex flex-col gap-1 sm:gap-2 flex-shrink-0">
                {maxCombo > 0 && (
                    <div className="bg-gradient-to-r from-yellow-300 to-orange-400 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg md:rounded-2xl border-2 sm:border-3 border-white shadow-md md:shadow-lg">
                        <p className="text-yellow-900 font-black text-xs sm:text-sm">
                            Best: <span className="text-sm sm:text-base md:text-lg">{maxCombo}x</span>
                        </p>
                    </div>
                )}
                {streak > 0 && (
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg md:rounded-2xl border-2 sm:border-3 border-white shadow-md md:shadow-lg">
                        <p className="text-white font-black text-xs sm:text-sm">
                            ⭐ {streak}
                        </p>
                    </div>
                )}
            </div>

            {/* Right: Speed */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg md:rounded-2xl border-2 sm:border-3 border-white shadow-md md:shadow-lg flex-shrink-0">
                <div className="flex items-center gap-1 sm:gap-2">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-300 animate-pulse" />
                    <span className="text-white font-black text-xs sm:text-sm md:text-base">
                        {Math.round((speed / RUN_SPEED_BASE) * 100)}%
                    </span>
                </div>
            </div>
        </div>

        {/* Floating score text overlay */}
        <FloatingTextDisplay />

        {/* Achievement notifications */}
        <AchievementPopup />
    </div>
  );
};
