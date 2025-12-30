/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect } from 'react';
import { Heart, Zap, Trophy, MapPin, Diamond, ArrowUpCircle, Shield, Activity, PlusCircle, Play } from 'lucide-react';
import { useStore } from '../../store';
import { GameStatus, SPARKLE_COLORS, ShopItem, RUN_SPEED_BASE } from '../../types';
import { audio } from '../System/Audio';
import { bgm } from '../System/BGM';
import { FloatingTextDisplay } from './FloatingText';
import { AchievementPopup } from './AchievementPopup';
import { ShareScore } from './ShareScore';
import { VolumeControl } from './VolumeControl';
import { leaderboard } from '../System/Leaderboard';
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
        <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-auto backdrop-blur-xl bg-black/40">
             <div className="w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto p-4 md:p-8 flex flex-col items-center">
                 <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter text-center drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">
                    SPARKLE SHOP
                 </h2>

                 <div className="flex items-center gap-2 bg-black/40 px-6 py-2 rounded-full border border-white/20 mb-8 backdrop-blur-md">
                     <span className="text-pink-300 text-lg">💎</span>
                     <span className="text-2xl font-black text-white">{score.toLocaleString()}</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
                     {items.map(item => {
                         const Icon = item.icon;
                         const canAfford = score >= item.cost;
                         return (
                             <div key={item.id} className="group relative bg-white/10 border border-white/20 p-6 rounded-3xl flex flex-col items-center text-center hover:bg-white/20 hover:border-white/40 transition-all hover:-translate-y-2 duration-300">
                                 <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform ring-1 ring-white/20">
                                     <Icon className="w-8 h-8 text-white" />
                                 </div>
                                 <h3 className="text-xl font-black mb-2 text-white tracking-wide">{item.name}</h3>
                                 <p className="text-white/60 text-sm mb-6 h-10 flex items-center justify-center font-medium leading-tight">{item.description}</p>
                                 <button
                                    onClick={() => buyItem(item.id as any, item.cost)}
                                    disabled={!canAfford}
                                    className={`px-6 py-3 rounded-xl font-bold w-full text-sm uppercase tracking-wider transition-all
                                        ${canAfford
                                            ? 'bg-white text-black hover:bg-pink-500 hover:text-white shadow-lg'
                                            : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'}`}
                                 >
                                     {item.cost} Sparkles
                                 </button>
                             </div>
                         );
                     })}
                 </div>

                 <button
                    onClick={closeShop}
                    className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(236,72,153,0.4)]"
                 >
                     CONTINUE RUNNING <Play size={24} fill="currentColor" />
                 </button>
             </div>
        </div>
    );
};

export const HUD: React.FC = () => {
  const { score, lives, maxLives, collectedLetters, status, level, restartGame, gemsCollected, distance, isImmortalityActive, speed, combo, maxCombo, streak, checkUnlocks, selectedCharacter, checkDailyChallenge } = useStore();
  const target = ['S', 'P', 'A', 'R', 'K', 'L', 'E'];
  const [showShareScore, setShowShareScore] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  // Common container style
  const containerClass = "absolute inset-0 w-full h-full flex flex-col justify-between p-4 sm:p-6 z-50 pointer-events-none";

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

  // --- GAME OVER / VICTORY OVERLAYS ---
  if (status === GameStatus.GAME_OVER || status === GameStatus.VICTORY) {
      const isVictory = status === GameStatus.VICTORY;
      const title = isVictory ? "VICTORY!" : "GAME OVER";
      const subtitle = isVictory ? "You collected them all!" : "Don't give up, try again!";

      return (
          <div className="absolute inset-0 w-full h-full z-[100] pointer-events-auto flex items-center justify-center p-4">
              {/* Dark Glass Backdrop */}
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>

              <div className="relative w-full max-w-md flex flex-col items-center gap-6 animate-in zoom-in duration-300">
                {/* Banners */}
                {isNewHighScore && (
                  <div className="px-6 py-2 bg-yellow-400 text-black font-black text-sm uppercase tracking-widest rounded-full animate-bounce shadow-[0_0_20px_rgba(250,204,21,0.6)]">
                    🏆 New High Score!
                  </div>
                )}
                {challengeCompleted && (
                  <div className="px-6 py-2 bg-orange-500 text-white font-black text-sm uppercase tracking-widest rounded-full animate-pulse shadow-[0_0_20px_rgba(249,115,22,0.6)]">
                    🔥 Daily Challenge Complete!
                  </div>
                )}

                {/* Main Card */}
                <div className="w-full bg-[#1a1b2e] border border-white/10 p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-6 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${isVictory ? 'from-green-400 via-emerald-500 to-teal-500' : 'from-pink-500 via-red-500 to-purple-500'}`}></div>

                    <div className="text-center">
                        <h1 className={`text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b ${isVictory ? 'from-white to-emerald-200' : 'from-white to-pink-200'}`}>
                            {title}
                        </h1>
                        <p className="text-white/50 text-sm font-medium uppercase tracking-wide">{subtitle}</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 w-full gap-3">
                        <StatBox label="Score" value={score.toLocaleString()} icon="✨" />
                        <StatBox label="Level" value={`${level} / 10`} icon="🏆" />
                        <StatBox label="Distance" value={`${Math.floor(distance)}m`} icon="📍" />
                        <StatBox label="Gems" value={gemsCollected.toString()} icon="💎" />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 w-full mt-2">
                        <button
                            onClick={() => setShowShareScore(true)}
                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-white transition-colors"
                        >
                            SHARE
                        </button>
                        <button
                            onClick={() => { audio.init(); restartGame(); }}
                            className={`flex-[2] py-4 rounded-xl font-black text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all text-white
                                ${isVictory ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-pink-500 to-purple-600'}`}
                        >
                            PLAY AGAIN
                        </button>
                    </div>
                </div>
              </div>

              {showShareScore && <ShareScore onClose={() => setShowShareScore(false)} />}
          </div>
      );
  }

  // --- HUD UI ---
  return (
    <div className={containerClass}>
        {/* Top Bar */}
        <div className="flex justify-between items-start w-full">
            {/* Score & Level */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-2 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
                        <span className="font-black text-3xl text-white tracking-tight">{score.toLocaleString()}</span>
                    </div>
                </div>

                {/* Level Progress */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 flex flex-col gap-1 w-48">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/70">
                        <span>Level {level}</span>
                        <span>10</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${(level / 10) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Lives & Gems & Volume */}
            <div className="flex flex-col gap-3 items-end pointer-events-auto">
                <div className="flex gap-3">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                        <Heart className="text-red-500 fill-red-500" size={18} />
                        <span className="font-black text-xl text-white">{lives}/{maxLives}</span>
                    </div>

                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                        <span className="text-lg">💎</span>
                        <span className="font-black text-xl text-white">{gemsCollected}</span>
                    </div>
                </div>

                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-2 hover:bg-black/60 transition-colors">
                    <VolumeControl />
                </div>
            </div>
        </div>

        {/* Center: Sparkle Letters */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
            <div className="flex gap-1 sm:gap-2">
                {target.map((char, idx) => {
                    const isCollected = collectedLetters.includes(idx);
                    const color = SPARKLE_COLORS[idx];

                    return (
                        <div
                            key={idx}
                            className={`w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center rounded-xl border-2 font-black text-xl shadow-lg transition-all duration-300
                                ${isCollected
                                    ? 'bg-white border-white scale-110 -translate-y-1'
                                    : 'bg-black/30 border-white/10 text-white/20'}`}
                            style={isCollected ? { color: color, boxShadow: `0 0 20px ${color}` } : {}}
                        >
                            {char}
                        </div>
                    );
                })}
            </div>

            {combo > 1 && (
                <div className="animate-bounce bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-1 rounded-full font-black text-xl shadow-lg border border-white/20 tracking-wider">
                    {combo}x COMBO
                </div>
            )}
        </div>

        {/* Bottom Status */}
        <div className="w-full flex justify-between items-end">
            <div className="flex gap-3">
                {isImmortalityActive && (
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg animate-pulse border border-white/20">
                        <Shield size={16} className="fill-white" />
                        SHIELD ACTIVE
                    </div>
                )}
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                 <Zap className="text-yellow-400 fill-yellow-400" size={16} />
                 <span className="font-bold text-white text-sm">
                     {Math.round((speed / RUN_SPEED_BASE) * 100)}% SPEED
                 </span>
            </div>
        </div>

        {/* Overlays */}
        <FloatingTextDisplay />
        <AchievementPopup />
    </div>
  );
};

const StatBox = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
    <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center gap-1">
        <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-1.5">
            <span className="text-sm opacity-80">{icon}</span>
            <span className="text-lg font-black text-white">{value}</span>
        </div>
    </div>
);
