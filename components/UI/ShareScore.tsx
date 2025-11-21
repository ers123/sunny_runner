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
    gradient.addColorStop(0, '#FFB6C1'); // Pink
    gradient.addColorStop(0.5, '#DDA0DD'); // Purple
    gradient.addColorStop(1, '#87CEEB'); // Blue
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add sparkle decorations
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 4 + 2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Title - Use system fonts for reliability
    ctx.font = 'bold 70px Arial, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 8;
    ctx.textAlign = 'center';
    ctx.strokeText('RAINBOW SPARKLE RUNNER', canvas.width / 2, 100);
    ctx.fillText('RAINBOW SPARKLE RUNNER', canvas.width / 2, 100);

    // Character badge
    const badgeX = canvas.width / 2;
    const badgeY = 200;
    const badgeRadius = 80;

    // Character circle background
    const charGradient = ctx.createLinearGradient(
      badgeX - badgeRadius,
      badgeY - badgeRadius,
      badgeX + badgeRadius,
      badgeY + badgeRadius
    );
    charGradient.addColorStop(0, character.primaryColor);
    charGradient.addColorStop(1, character.secondaryColor);
    ctx.fillStyle = charGradient;
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
    ctx.fill();

    // Character name
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = character.primaryColor;
    ctx.lineWidth = 4;
    ctx.strokeText(character.name, badgeX, badgeY + badgeRadius + 50);
    ctx.fillText(character.name, badgeX, badgeY + badgeRadius + 50);

    // Stats container
    const statsY = 350;

    // Score (biggest)
    ctx.font = 'bold 80px Arial, sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#FF6B9D';
    ctx.lineWidth = 6;
    ctx.strokeText(`${score.toLocaleString()} POINTS`, canvas.width / 2, statsY);
    ctx.fillText(`${score.toLocaleString()} POINTS`, canvas.width / 2, statsY);

    // Level and Combo
    ctx.font = 'bold 45px Arial, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#9370DB';
    ctx.lineWidth = 4;

    const leftX = canvas.width / 4;
    const rightX = (canvas.width / 4) * 3;

    ctx.strokeText(`Level ${level}`, leftX, statsY + 80);
    ctx.fillText(`Level ${level}`, leftX, statsY + 80);

    ctx.strokeText(`${maxCombo}x Max Combo`, rightX, statsY + 80);
    ctx.fillText(`${maxCombo}x Max Combo`, rightX, statsY + 80);

    // Gems collected
    ctx.font = 'bold 35px Arial, sans-serif';
    ctx.fillStyle = '#FFE4E1';
    ctx.strokeStyle = '#9370DB';
    ctx.lineWidth = 3;
    ctx.strokeText(`${gemsCollected} Gems Collected`, canvas.width / 2, statsY + 140);
    ctx.fillText(`${gemsCollected} Gems Collected`, canvas.width / 2, statsY + 140);

    // Call to action
    ctx.font = 'bold 30px Arial, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 3;
    ctx.strokeText('sparklerunner.vercel.app', canvas.width / 2, canvas.height - 50);
    ctx.fillText('sparklerunner.vercel.app', canvas.width / 2, canvas.height - 50);
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
    generateShareImage();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[300] p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Share Your Score!
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <p className="text-gray-600 mb-4 text-center">
          Show off your amazing run on social media! 🌟
        </p>

        {/* Canvas Preview */}
        <div className="mb-6 border-4 border-purple-300 rounded-2xl overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-auto"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={shareImage}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg rounded-full hover:scale-105 transition-all shadow-lg"
          >
            <Share2 className="w-5 h-5" />
            <span>Share Image</span>
          </button>

          <button
            onClick={downloadImage}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg rounded-full hover:scale-105 transition-all shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span>Download Image</span>
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Tip: Share on social media to inspire your friends to play! 🚀
        </p>
      </div>
    </div>
  );
};
