/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef } from 'react';
import { Download, Share2, X } from 'lucide-react';
import { useStore } from '../../store';
import { CHARACTERS } from '../../types';

export const ShareScore: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { score, level, maxCombo, selectedCharacter, gemsCollected } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const character = CHARACTERS[selectedCharacter];

  const generateShareImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 630; // Standard social media image size

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#FFB6C1'); // Sparkle Pink
    gradient.addColorStop(0.5, '#DDA0DD'); // Sparkle Purple
    gradient.addColorStop(1, '#87CEEB'); // Sparkle Blue
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Stars
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 60; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 6 + 2;
        ctx.beginPath();
        // Star shape approximation (or just circle for now to keep it simple but trendy)
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Main Container Box (White with Black Border)
    const padding = 40;
    const boxX = padding;
    const boxY = padding;
    const boxW = canvas.width - (padding * 2);
    const boxH = canvas.height - (padding * 2);
    const radius = 60;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 12;

    // Draw rounded rect
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, radius);
    ctx.fill();
    ctx.stroke();

    // Title
    ctx.font = '900 70px Quicksand, Arial, sans-serif';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText('RAINBOW SPARKLE RUNNER', canvas.width / 2, 160);

    // Divider
    ctx.beginPath();
    ctx.moveTo(boxX + 40, 200);
    ctx.lineTo(boxX + boxW - 40, 200);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Score Section
    ctx.font = '900 120px Quicksand, Arial, sans-serif';
    ctx.fillStyle = '#FFD700'; // Gold
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 8;
    const scoreText = `${score.toLocaleString()} POINTS`;
    ctx.strokeText(scoreText, canvas.width / 2, 350);
    ctx.fillText(scoreText, canvas.width / 2, 350);

    // Character Badge
    const badgeSize = 120;
    const badgeX = boxX + 120;
    const badgeY = 320;

    // Circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeSize/2, 0, Math.PI * 2);
    ctx.fillStyle = '#f0f0f0';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.stroke();
    // ctx.clip(); // Could draw character image here
    ctx.restore();

    // Character Initial
    ctx.font = '900 60px Quicksand, Arial, sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(character.name.substring(0, 1), badgeX, badgeY + 20);

    // Stats Row
    ctx.font = '700 40px Quicksand, Arial, sans-serif';
    ctx.fillStyle = '#000000';

    const statsY = 480;
    const gap = 300;

    ctx.fillText(`LEVEL ${level}`, canvas.width / 2 - gap, statsY);
    ctx.fillText(`${maxCombo}x COMBO`, canvas.width / 2, statsY);
    ctx.fillText(`${gemsCollected} GEMS`, canvas.width / 2 + gap, statsY);

    // Footer URL
    ctx.fillStyle = '#000000';
    ctx.font = '600 30px Quicksand, Arial, sans-serif';
    ctx.fillText('sparklerunner.vercel.app', canvas.width / 2, 560);
  };

  const downloadImage = () => {
    generateShareImage();
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sparkle-runner-score-${score}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const shareImage = async () => {
    generateShareImage();
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png');
      });

      const file = new File([blob], `sparkle-runner-${score}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: '✨ Rainbow Sparkle Runner ✨',
          text: `I scored ${score.toLocaleString()} points in Rainbow Sparkle Runner! 🌈✨`,
        });
      } else {
        // Fallback: download
        downloadImage();
      }
    } catch (error) {
      console.error('Share failed:', error);
      downloadImage(); // Fallback
    }
  };

  // Generate preview on mount
  React.useEffect(() => {
    // Small delay to ensure font loads if possible, though canvas uses system fallback
    const timer = setTimeout(() => generateShareImage(), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[300] p-4">
      <div className="bg-white rounded-[2.5rem] p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
          <h2 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tight">
            Share Score
          </h2>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors border-2 border-black active:translate-y-[2px]"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        <p className="text-black/60 font-bold mb-6 text-center uppercase tracking-wide">
          Show off your amazing run on social media! 🌟
        </p>

        {/* Canvas Preview */}
        <div className="mb-8 border-4 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gray-100">
          <canvas
            ref={canvasRef}
            className="w-full h-auto"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={shareImage}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-pink-400 text-black font-black text-lg rounded-xl hover:bg-pink-500 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black active:translate-y-[2px] active:shadow-none uppercase tracking-wide"
          >
            <Share2 className="w-6 h-6" />
            <span>Share</span>
          </button>

          <button
            onClick={downloadImage}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-sky-300 text-black font-black text-lg rounded-xl hover:bg-sky-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black active:translate-y-[2px] active:shadow-none uppercase tracking-wide"
          >
            <Download className="w-6 h-6" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
