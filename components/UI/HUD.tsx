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
        <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-auto bg-white/30 backdrop-blur-md">
             <div className="w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto p-4 md:p-8 flex flex-col items-center">
                 <h2 className="text-4xl md:text-6xl font-black text-black mb-2 tracking-tighter text-center drop-shadow-sm uppercase">
                    Sparkle Shop
                 </h2>

                 <div className="flex items-center gap-2 bg-white px-6 py-2 rounded-full border-2 border-black mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                     <span className="text-pink-500 text-lg">💎</span>
                     <span className="text-2xl font-black text-black">{score.toLocaleString()}</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
                     {items.map(item => {
                         const Icon = item.icon;
                         const canAfford = score >= item.cost;
                         return (
                             <div key={item.id} className="group relative bg-white border-2 border-black p-6 rounded-[2rem] flex flex-col items-center text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                                 <div className="bg-pink-100 p-4 rounded-full mb-4 border-2 border-black group-hover:scale-110 transition-transform">
                                     <Icon className="w-8 h-8 text-black" />
                                 </div>
                                 <h3 className="text-xl font-black mb-2 text-black tracking-wide uppercase">{item.name}</h3>
                                 <p className="text-black/60 text-sm mb-6 h-10 flex items-center justify-center font-medium leading-tight">{item.description}</p>
                                 <button
                                    onClick={() => buyItem(item.id as any, item.cost)}
                                    disabled={!canAfford}
                                    className={`px-6 py-3 rounded-xl font-bold w-full text-sm uppercase tracking-wider transition-all border-2 border-black
                                        ${canAfford
                                            ? 'bg-black text-white hover:bg-neutral-800 shadow-md'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'}`}
                                 >
                                     {item.cost} Sparkles
                                 </button>
                             </div>
                         );
                     })}
                 </div>

                 <button
                    onClick={closeShop}
                    className="flex items-center gap-3 px-10 py-4 bg-black text-white font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] border-2 border-black active:translate-y-[2px] active:shadow-none"
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
              {/* Light Glass Backdrop */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md"></div>

              <div className="relative w-full max-w-md flex flex-col items-center gap-6 animate-in zoom-in duration-300">
                {/* Banners */}
                {isNewHighScore && (
                  <div className="px-6 py-2 bg-yellow-400 border-2 border-black text-black font-black text-sm uppercase tracking-widest rounded-full animate-bounce shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    🏆 New High Score!
                  </div>
                )}
                {challengeCompleted && (
                  <div className="px-6 py-2 bg-orange-500 border-2 border-black text-white font-black text-sm uppercase tracking-widest rounded-full animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    🔥 Daily Challenge Complete!
                  </div>
                )}

                {/* Main Card */}
                <div className="w-full bg-white border-2 border-black p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-6 relative overflow-hidden">

                    <div className="text-center">
                        <h1 className={`text-5xl font-black mb-2 text-black uppercase tracking-tight`}>
                            {title}
                        </h1>
                        <p className="text-black/50 text-sm font-medium uppercase tracking-wide">{subtitle}</p>
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
                            className="flex-1 py-4 bg-white hover:bg-gray-50 border-2 border-black rounded-xl font-bold text-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none"
                        >
                            SHARE
                        </button>
                        <button
                            onClick={() => { audio.init(); restartGame(); }}
                            className={`flex-[2] py-4 rounded-xl font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all text-white border-2 border-black
                                ${isVictory ? 'bg-emerald-500' : 'bg-pink-500'}`}
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
                    <div className="bg-white/80 backdrop-blur-md border-2 border-black rounded-2xl px-5 py-2 flex items-center gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 border border-black animate-pulse"></div>
                        <span className="font-black text-3xl text-black tracking-tight">{score.toLocaleString()}</span>
                    </div>
                </div>

                {/* Level Progress */}
                <div className="bg-white/80 backdrop-blur-md border-2 border-black rounded-xl px-4 py-2 flex flex-col gap-1 w-48 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-black/70">
                        <span>Level {level}</span>
                        <span>10</span>
                    </div>
                    <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden border border-black/10">
                        <div
                            className="h-full bg-pink-500 transition-all duration-500"
                            style={{ width: `${(level / 10) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Lives & Gems & Volume */}
            <div className="flex flex-col gap-3 items-end pointer-events-auto">
                <div className="flex gap-3">
                    <div className="bg-white/80 backdrop-blur-md border-2 border-black rounded-xl px-4 py-2 flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Heart className="text-red-500 fill-red-500 stroke-black" size={18} />
                        <span className="font-black text-xl text-black">{lives}/{maxLives}</span>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md border-2 border-black rounded-xl px-4 py-2 flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <span className="text-lg">💎</span>
                        <span className="font-black text-xl text-black">{gemsCollected}</span>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md border-2 border-black rounded-xl p-2 hover:bg-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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
                            className={`w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center rounded-xl border-2 font-black text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-300
                                ${isCollected
                                    ? 'bg-white border-black scale-110 -translate-y-1'
                                    : 'bg-black/10 border-black/20 text-black/20'}`}
                            style={isCollected ? { color: color } : {}}
                        >
                            {char}
                        </div>
                    );
                })}
            </div>

            {combo > 1 && (
                <div className="animate-bounce bg-orange-500 text-white px-6 py-1 rounded-full font-black text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black tracking-wider">
                    {combo}x COMBO
                </div>
            )}
        </div>

        {/* Bottom Status */}
        <div className="w-full flex justify-between items-end">
            <div className="flex gap-3">
                {isImmortalityActive && (
                    <div className="bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse border-2 border-black">
                        <Shield size={16} className="fill-white stroke-black" />
                        SHIELD ACTIVE
                    </div>
                )}
            </div>

            <div className="bg-white/80 backdrop-blur-md border-2 border-black rounded-xl px-4 py-2 flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                 <Zap className="text-yellow-400 fill-yellow-400 stroke-black" size={16} />
                 <span className="font-bold text-black text-sm">
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
    <div className="bg-gray-50 rounded-xl p-3 border-2 border-black flex flex-col items-center justify-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <span className="text-[10px] text-black/40 font-bold uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-1.5">
            <span className="text-sm opacity-100">{icon}</span>
            <span className="text-lg font-black text-black">{value}</span>
        </div>
    </div>
);
