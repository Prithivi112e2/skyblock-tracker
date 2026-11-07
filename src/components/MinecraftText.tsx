import React from 'react';

const COLOR_MAP: Record<string, string> = {
  '0': 'text-black',
  '1': 'text-blue-800',
  '2': 'text-emerald-700',
  '3': 'text-cyan-700',
  '4': 'text-red-800',
  '5': 'text-purple-700',
  '6': 'text-amber-500',
  '7': 'text-neutral-400',
  '8': 'text-neutral-600',
  '9': 'text-blue-400',
  'a': 'text-green-400',
  'b': 'text-cyan-300',
  'c': 'text-red-400',
  'd': 'text-pink-400',
  'e': 'text-yellow-300',
  'f': 'text-white',
};

export function MinecraftText({ text, className = '' }: { text: string; className?: string }) {
  if (!text) return null;

  // Split by § code
  const parts = text.split(/(§[0-9a-fk-or])/gi);
  let currentColor = 'text-neutral-200';
  let isBold = false;
  let isItalic = false;

  const elements: React.ReactNode[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith('§')) {
      const code = part.charAt(1).toLowerCase();
      if (COLOR_MAP[code]) {
        currentColor = COLOR_MAP[code];
        isBold = false;
        isItalic = false;
      } else if (code === 'l') {
        isBold = true;
      } else if (code === 'o') {
        isItalic = true;
      } else if (code === 'r') {
        currentColor = 'text-neutral-200';
        isBold = false;
        isItalic = false;
      }
    } else if (part) {
      elements.push(
        <span
          key={i}
          className={`${currentColor} ${isBold ? 'font-bold' : 'font-normal'} ${isItalic ? 'italic' : ''}`}
        >
          {part}
        </span>
      );
    }
  }

  return <span className={`font-mono text-sm inline-block ${className}`}>{elements}</span>;
}
