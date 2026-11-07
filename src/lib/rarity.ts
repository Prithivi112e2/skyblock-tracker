import { ItemRarity } from './types';

export const RARITY_BORDER_COLORS: Record<ItemRarity, string> = {
  COMMON: 'border-neutral-500 text-white',
  UNCOMMON: 'border-green-500 text-green-400',
  RARE: 'border-blue-400 text-blue-400',
  EPIC: 'border-purple-500 text-purple-400',
  LEGENDARY: 'border-amber-500 text-amber-400',
  MYTHIC: 'border-pink-500 text-pink-400',
  DIVINE: 'border-cyan-400 text-cyan-300',
  SPECIAL: 'border-red-500 text-red-400',
  VERY_SPECIAL: 'border-red-600 text-red-500',
};

export const RARITY_BG_GLOW: Record<ItemRarity, string> = {
  COMMON: 'bg-neutral-800/40',
  UNCOMMON: 'bg-green-950/30',
  RARE: 'bg-blue-950/30',
  EPIC: 'bg-purple-950/30',
  LEGENDARY: 'bg-amber-950/30',
  MYTHIC: 'bg-pink-950/30',
  DIVINE: 'bg-cyan-950/30',
  SPECIAL: 'bg-red-950/30',
  VERY_SPECIAL: 'bg-red-950/40',
};
