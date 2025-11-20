/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';

interface FloatingTextItem {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

let floatingTexts: FloatingTextItem[] = [];
let listeners: Array<(texts: FloatingTextItem[]) => void> = [];

// Global function to add floating text
export const addFloatingText = (text: string, x: number, y: number, color: string = '#FFD700') => {
  const id = Math.random().toString(36).substr(2, 9);
  const newText: FloatingTextItem = { id, text, x, y, color };

  floatingTexts = [...floatingTexts, newText];
  listeners.forEach(listener => listener(floatingTexts));

  // Remove after animation
  setTimeout(() => {
    floatingTexts = floatingTexts.filter(t => t.id !== id);
    listeners.forEach(listener => listener(floatingTexts));
  }, 1500);
};

export const FloatingTextDisplay: React.FC = () => {
  const [texts, setTexts] = useState<FloatingTextItem[]>([]);

  useEffect(() => {
    const listener = (newTexts: FloatingTextItem[]) => setTexts(newTexts);
    listeners.push(listener);

    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-[200]">
      {texts.map(({ id, text, x, y, color }) => (
        <div
          key={id}
          className="absolute font-black text-2xl md:text-3xl animate-float-up"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            color,
            textShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
            animation: 'floatUp 1.5s ease-out forwards'
          }}
        >
          {text}
        </div>
      ))}

      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-30px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(0.8);
          }
        }
      `}</style>
    </div>
  );
};
