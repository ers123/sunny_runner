/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { bgm } from '../System/BGM';

export const VolumeControl: React.FC = () => {
  const [volume, setVolume] = useState(30); // 30% default
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved volume from localStorage
    const savedVolume = localStorage.getItem('sparkle_runner_volume');
    const savedMuted = localStorage.getItem('sparkle_runner_muted');

    if (savedVolume) {
      const vol = parseInt(savedVolume);
      setVolume(vol);
      bgm.setVolume(vol / 100);
    }

    if (savedMuted === 'true') {
      setIsMuted(true);
      bgm.setVolume(0);
    }
  }, []);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(false);
    bgm.setVolume(newVolume / 100);
    localStorage.setItem('sparkle_runner_volume', newVolume.toString());
    localStorage.setItem('sparkle_runner_muted', 'false');
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    bgm.setVolume(newMuted ? 0 : volume / 100);
    localStorage.setItem('sparkle_runner_muted', newMuted.toString());
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeX;
    if (volume < 50) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  return (
    <div className="relative">
      {/* Volume Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 sm:p-3 bg-white/90 hover:bg-white rounded-full border-2 border-purple-300 shadow-lg transition-all hover:scale-110"
        title="Volume Control"
      >
        <VolumeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
      </button>

      {/* Volume Slider Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl border-3 border-purple-300 shadow-2xl p-4 z-[300] min-w-[200px]">
          <div className="flex flex-col gap-3">
            {/* Title */}
            <div className="font-bold text-purple-700 text-sm text-center">
              🎵 Music Volume
            </div>

            {/* Slider */}
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                style={{
                  background: `linear-gradient(to right, #9370DB ${volume}%, #E9D5FF ${volume}%)`
                }}
              />
              <span className="text-xs font-bold text-purple-600 min-w-[35px]">
                {volume}%
              </span>
            </div>

            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className={`w-full py-2 rounded-full font-bold text-sm transition-all ${
                isMuted
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              {isMuted ? '🔇 Unmute' : '🔊 Mute'}
            </button>

            {/* Preset Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[25, 50, 75].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleVolumeChange(preset)}
                  className="py-1 px-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-semibold transition-all"
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[299]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
