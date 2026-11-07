'use client';

import React, { useState } from 'react';
import { DecodedItem, ItemRarity } from '@/lib/types';
import { MinecraftText } from './MinecraftText';

import { RARITY_BORDER_COLORS, RARITY_BG_GLOW } from '@/lib/rarity';
export { RARITY_BORDER_COLORS, RARITY_BG_GLOW };

export { formatCoins } from '@/lib/format';
import { formatCoins } from '@/lib/format';

export function ItemCard({
  item,
  slotLabel,
  compact = false,
}: {
  item?: DecodedItem | null;
  slotLabel?: string;
  compact?: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-neutral-800/80 bg-neutral-900/40 min-h-[90px] text-center">
        {slotLabel && <span className="text-xs font-medium text-neutral-500 mb-1">{slotLabel}</span>}
        <span className="text-xs text-neutral-600 italic">Empty</span>
      </div>
    );
  }

  const borderClass = RARITY_BORDER_COLORS[item.rarity] || 'border-neutral-700 text-white';
  const bgClass = RARITY_BG_GLOW[item.rarity] || 'bg-neutral-900/60';

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`flex flex-col justify-between p-3 rounded-lg border ${borderClass} ${bgClass} transition-all duration-200 hover:scale-[1.02] shadow-sm`}
      >
        <div>
          {slotLabel && (
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                {slotLabel}
              </span>
              {item.count > 1 && (
                <span className="text-xs font-bold text-amber-300">x{item.count}</span>
              )}
            </div>
          )}

          <div className="flex items-start justify-between gap-1">
            <h4 className="font-semibold text-sm line-clamp-2">
              {item.reforge && (
                <span className="text-neutral-400 font-normal mr-1">{item.reforge}</span>
              )}
              {item.name}
              {item.stars && item.stars > 0 && (
                <span className="text-amber-400 ml-1">{'✪'.repeat(Math.min(5, item.stars))}</span>
              )}
            </h4>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs pt-1 border-t border-neutral-800/60">
          <span className="font-bold text-[10px] uppercase tracking-wide opacity-90">
            {item.rarity.replace('_', ' ')}
          </span>
          {item.price ? (
            <span className="text-emerald-400 font-mono text-[11px]">
              {formatCoins(item.price)}
            </span>
          ) : null}
        </div>
      </div>

      {/* Minecraft Item Lore Tooltip */}
      {showTooltip && item.lore && item.lore.length > 0 && (
        <div className="absolute z-50 left-0 bottom-full mb-2 w-72 sm:w-80 p-3 rounded bg-neutral-950/95 border-2 border-purple-900 shadow-2xl backdrop-blur-md pointer-events-none text-left">
          <div className="font-bold text-sm mb-1">
            <MinecraftText text={`§${item.rarity === 'LEGENDARY' ? '6' : item.rarity === 'EPIC' ? '5' : item.rarity === 'RARE' ? '9' : 'a'}${item.name}`} />
          </div>
          <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
            {item.lore.map((line, i) => (
              <div key={i} className="min-h-[16px]">
                <MinecraftText text={line} />
              </div>
            ))}
          </div>
          {item.price && (
            <div className="mt-2 pt-2 border-t border-neutral-800 flex justify-between text-xs">
              <span className="text-neutral-400">Estimated Value:</span>
              <span className="text-emerald-400 font-bold font-mono">
                {formatCoins(item.price)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
