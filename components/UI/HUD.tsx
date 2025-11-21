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
  const { score, lives, maxLives, collectedLetters, status, level, restartGame, startGame, gemsCollected, distance, isImmortalityActive, speed, combo, maxCombo, streak } = useStore();
  const target = ['S', 'P', 'A', 'R', 'K', 'L', 'E'];

  // Common container style
  const containerClass = "absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-8 z-50";

  // BGM Control - Start music when playing, stop when game over
  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      bgm.start(); // Randomly selects a track
    } else if (status === GameStatus.GAME_OVER || status === GameStatus.MENU) {
      bgm.stop();
    }
  }, [status]);

  if (status === GameStatus.SHOP) {
      return <ShopScreen />;
  }

  if (status === GameStatus.MENU) {
      return (
          <div className="absolute inset-0 flex items-center justify-center z-[100] bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-4 pointer-events-auto">
              {/* Card Container */}
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 animate-in zoom-in-95 duration-500">

                {/* Colorful Background */}
                <div className="relative w-full bg-gradient-to-b from-pink-300 via-purple-300 to-blue-300 p-8">
                     {/* Title */}
                     <div className="text-center mb-6">
                         <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg mb-2">
                             ✨ RAINBOW
                         </h1>
                         <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg">
                             SPARKLE ✨
                         </h1>
                         <h2 className="text-2xl md:text-3xl font-bold text-pink-100 drop-shadow-md mt-2">
                             RUNNER
                         </h2>
                     </div>

                     {/* Content */}
                     <div className="flex flex-col items-center text-center z-10">
                        <div className="mb-6 text-white text-lg font-semibold">
                            🌟 Collect letters to spell SPARKLE! 🌟
                        </div>

                        <button
                          onClick={() => { audio.init(); startGame(); }}
                          className="w-full group relative px-6 py-4 bg-white text-pink-600 font-black text-xl rounded-full hover:bg-pink-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <span className="relative z-10 flex items-center justify-center">
                                ✨ START ADVENTURE! <Play className="ml-2 w-5 h-5 fill-pink-600" />
                            </span>
                        </button>

                        <p className="text-white/80 text-xs md:text-sm mt-4 font-semibold">
                            🎮 Use Arrows or Swipe to Move 🎮
                        </p>
                     </div>
                </div>
              </div>
          </div>
      );
  }

  if (status === GameStatus.GAME_OVER) {
      return (
          <div className="absolute inset-0 bg-gradient-to-b from-purple-300 to-pink-200 z-[100] text-purple-900 pointer-events-auto backdrop-blur-sm overflow-y-auto">
              <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                <h1 className="text-4xl md:text-6xl font-black text-pink-600 mb-6 drop-shadow-lg text-center">💔 Oh No! 💔</h1>
                
                <div className="grid grid-cols-1 gap-3 md:gap-4 text-center mb-8 w-full max-w-md">
                    <div className="bg-white/80 p-3 md:p-4 rounded-2xl border-2 border-purple-300 flex items-center justify-between">
                        <div className="flex items-center text-purple-600 text-sm md:text-base"><Trophy className="mr-2 w-4 h-4 md:w-5 md:h-5"/> Level</div>
                        <div className="text-xl md:text-2xl font-bold">{level} / 3</div>
                    </div>
                    <div className="bg-white/80 p-3 md:p-4 rounded-2xl border-2 border-purple-300 flex items-center justify-between">
                        <div className="flex items-center text-pink-600 text-sm md:text-base"><Diamond className="mr-2 w-4 h-4 md:w-5 md:h-5"/> Stars Collected</div>
                        <div className="text-xl md:text-2xl font-bold">{gemsCollected}</div>
                    </div>
                    <div className="bg-white/80 p-3 md:p-4 rounded-2xl border-2 border-purple-300 flex items-center justify-between">
                        <div className="flex items-center text-blue-600 text-sm md:text-base"><MapPin className="mr-2 w-4 h-4 md:w-5 md:h-5"/> Distance</div>
                        <div className="text-xl md:text-2xl font-bold">{Math.floor(distance)}m</div>
                    </div>
                     <div className="bg-gradient-to-r from-pink-200 to-purple-200 p-3 md:p-4 rounded-2xl flex items-center justify-between mt-2 border-2 border-pink-400">
                        <div className="flex items-center text-purple-700 text-sm md:text-base font-bold">✨ Total Sparkles</div>
                        <div className="text-2xl md:text-3xl font-bold text-pink-600">{score.toLocaleString()}</div>
                    </div>
                </div>

                <div className="text-center mb-6 text-purple-700 font-semibold">
                    💪 Don't give up! Try again! 💪
                </div>

                <button
                  onClick={() => { audio.init(); restartGame(); }}
                  className="px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-lg md:text-xl rounded-full hover:scale-105 transition-all shadow-xl"
                >
                    🌟 Try Again!
                </button>
              </div>
          </div>
      );
  }

  if (status === GameStatus.VICTORY) {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-200 via-pink-200 to-purple-200 z-[100] text-purple-900 pointer-events-auto backdrop-blur-md overflow-y-auto">
            <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                <div className="text-6xl md:text-8xl mb-4 animate-bounce">🎉</div>
                <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-2 drop-shadow-lg text-center leading-tight">
                    YOU DID IT!
                </h1>
                <p className="text-pink-600 text-lg md:text-2xl font-bold mb-8 text-center">
                    ✨ You collected all the SPARKLE letters! ✨
                </p>
                
                <div className="grid grid-cols-1 gap-4 text-center mb-8 w-full max-w-md">
                    <div className="bg-white/80 p-6 rounded-3xl border-4 border-pink-300 shadow-xl">
                        <div className="text-xs md:text-sm text-purple-600 mb-1 tracking-wider font-bold">🌟 FINAL SPARKLES 🌟</div>
                        <div className="text-3xl md:text-4xl font-bold text-pink-600">{score.toLocaleString()}</div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/80 p-4 rounded-2xl border-2 border-pink-300">
                            <div className="text-xs text-purple-600 font-semibold">⭐ Stars</div>
                            <div className="text-xl md:text-2xl font-bold text-pink-600">{gemsCollected}</div>
                        </div>
                        <div className="bg-white/80 p-4 rounded-2xl border-2 border-purple-300">
                             <div className="text-xs text-purple-600 font-semibold">🏃‍♀️ Distance</div>
                            <div className="text-xl md:text-2xl font-bold text-purple-600">{Math.floor(distance)}m</div>
                        </div>
                     </div>
                </div>

                <div className="text-center mb-6 text-purple-700 text-lg font-bold">
                    🎊 Amazing job, superstar! 🎊
                </div>

                <button
                  onClick={() => { audio.init(); restartGame(); }}
                  className="px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-black text-lg md:text-xl rounded-full hover:scale-105 transition-all shadow-2xl"
                >
                    ✨ Play Again! ✨
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className={containerClass}>
        {/* Top Bar */}
        <div className="flex justify-between items-start w-full">
            <div className="flex flex-col">
                <div className="text-3xl md:text-5xl font-bold text-pink-500 drop-shadow-lg bg-white/80 px-4 py-2 rounded-2xl border-2 border-pink-300">
                    ✨ {score.toLocaleString()}
                </div>
            </div>

            <div className="flex space-x-1 md:space-x-2">
                {[...Array(maxLives)].map((_, i) => (
                    <Heart
                        key={i}
                        className={`w-6 h-6 md:w-8 md:h-8 ${i < lives ? 'text-pink-400 fill-pink-400 drop-shadow-lg' : 'text-gray-300 fill-gray-300'}`}
                    />
                ))}
            </div>
        </div>

        {/* Level Indicator */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-sm md:text-lg text-purple-700 font-bold tracking-wider bg-white/80 px-4 py-1 rounded-full border-2 border-purple-300 backdrop-blur-sm z-50">
            🌟 Level {level} <span className="text-purple-500 text-xs md:text-sm">/ 3</span>
        </div>

        {/* Active Skill Indicator */}
        {isImmortalityActive && (
             <div className="absolute top-24 left-1/2 transform -translate-x-1/2 text-purple-700 font-bold text-xl md:text-2xl animate-pulse flex items-center bg-white/90 px-4 py-2 rounded-full border-2 border-purple-400 shadow-xl">
                 <Shield className="mr-2 fill-purple-500" /> 🌈 PROTECTED! 🌈
             </div>
        )}

        {/* SPARKLE Collection Status - Just below Top Bar */}
        <div className="absolute top-20 md:top-28 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-2">
            {target.map((char, idx) => {
                const isCollected = collectedLetters.includes(idx);
                const color = SPARKLE_COLORS[idx];

                return (
                    <div
                        key={idx}
                        style={{
                            borderColor: isCollected ? color : '#E5E7EB',
                            color: isCollected ? '#FFFFFF' : '#9CA3AF',
                            boxShadow: isCollected ? `0 0 15px ${color}` : 'none',
                            backgroundColor: isCollected ? color : 'rgba(255, 255, 255, 0.7)'
                        }}
                        className={`w-7 h-9 md:w-9 md:h-11 flex items-center justify-center border-3 font-black text-base md:text-lg rounded-xl transform transition-all duration-300 ${isCollected ? 'scale-110' : 'scale-100'}`}
                    >
                        {char}
                    </div>
                );
            })}
        </div>

        {/* Combo/Streak Display - NEW! */}
        {combo > 0 && (
             <div className="absolute top-40 md:top-48 left-1/2 transform -translate-x-1/2">
                 <div className={`bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full font-black text-lg md:text-xl border-4 border-white shadow-2xl ${combo >= 5 ? 'animate-pulse' : ''}`}>
                     🔥 {combo}x COMBO!
                 </div>
             </div>
        )}

        {/* Streak Display for Letters - NEW! */}
        {streak > 0 && (
             <div className="absolute bottom-32 md:bottom-40 left-1/2 transform -translate-x-1/2">
                 <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full font-bold text-sm md:text-base border-2 border-white shadow-lg">
                     ⭐ {streak} Letter Streak!
                 </div>
             </div>
        )}

        {/* Bottom Overlay */}
        <div className="w-full flex justify-between items-end">
             {/* Left: Combo Count */}
             {maxCombo > 0 && (
                 <div className="bg-white/80 px-3 py-1 rounded-full border-2 border-yellow-400">
                     <span className="text-yellow-600 font-bold text-xs md:text-sm">Best Combo: {maxCombo}x</span>
                 </div>
             )}
             {/* Right: Speed */}
             <div className="flex items-center space-x-2 bg-white/80 px-3 py-1 rounded-full border-2 border-purple-300">
                 <Zap className="w-4 h-4 md:w-6 md:h-6 text-purple-500 animate-pulse" />
                 <span className="text-purple-700 font-bold text-sm md:text-lg">Speed {Math.round((speed / RUN_SPEED_BASE) * 100)}%</span>
             </div>
        </div>

        {/* Floating score text overlay */}
        <FloatingTextDisplay />

        {/* Achievement notifications */}
        <AchievementPopup />
    </div>
  );
};
