import { SlayerProgress } from '../types';

export const SLAYER_XP_TABLE: Record<string, number[]> = {
  zombie: [0, 5, 15, 200, 1000, 5000, 20000, 100000, 400000, 1000000],
  spider: [0, 5, 25, 200, 1000, 5000, 20000, 100000, 400000, 1000000],
  wolf: [0, 10, 30, 250, 1500, 5000, 20000, 100000, 400000, 1000000],
  enderman: [0, 10, 30, 250, 1500, 5000, 20000, 100000, 400000, 1000000],
  blaze: [0, 10, 30, 250, 1500, 5000, 20000, 100000, 400000, 1000000],
  vampire: [0, 20, 75, 240, 840, 2400],
};

export const SLAYER_NAMES: Record<string, { name: string; bossName: string }> = {
  zombie: { name: 'Revenant Horror', bossName: 'Zombie' },
  spider: { name: 'Tarantula Broodfather', bossName: 'Spider' },
  wolf: { name: 'Sven Packmaster', bossName: 'Wolf' },
  enderman: { name: 'Voidgloom Seraph', bossName: 'Enderman' },
  blaze: { name: 'Inferno Demonlord', bossName: 'Blaze' },
  vampire: { name: 'Riftstalker Bloodfiend', bossName: 'Vampire' },
};

export function calculateSlayerProgress(type: string, xp: number): SlayerProgress {
  const meta = SLAYER_NAMES[type.toLowerCase()] || { name: type, bossName: type };
  const table = SLAYER_XP_TABLE[type.toLowerCase()] || SLAYER_XP_TABLE.zombie;
  const maxLevel = table.length - 1;

  let level = 0;
  let nextLevelXp = table[1] || 10;

  for (let lvl = 1; lvl <= maxLevel; lvl++) {
    if (xp >= table[lvl]) {
      level = lvl;
      nextLevelXp = table[lvl + 1] || 0;
    } else {
      nextLevelXp = table[lvl];
      break;
    }
  }

  return {
    name: meta.name,
    bossName: meta.bossName,
    level,
    maxLevel,
    xp,
    nextLevelXp,
  };
}
