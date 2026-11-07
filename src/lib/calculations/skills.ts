import { SkillProgress } from '../types';

export const SKILL_XP_TABLE = [
  0,
  50, 125, 200, 300, 500, 750, 1000, 1500, 2000, 3500, 5000, 7500, 10000, 15000, 20000,
  30000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000,
  1000000, 1100000, 1200000, 1300000, 1400000, 1500000, 1600000, 1700000, 1800000, 1900000, 2000000, 2100000, 2200000,
  2300000, 2400000, 2500000, 2600000, 2750000, 2900000, 3100000, 3400000, 3700000, 4000000,
  // 51 to 60
  5000000, 5500000, 6000000, 6500000, 7000000, 7500000, 8000000, 8500000, 9000000, 10000000
];

export const RUNECRAFTING_XP_TABLE = [
  0, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700,
  1800, 1900, 2000, 2100, 2200, 2300
];

export const SOCIAL_XP_TABLE = [
  0, 50, 100, 150, 250, 400, 600, 850, 1150, 1500, 2000, 2600, 3350, 4250, 5350, 6700, 8350, 10400, 12900, 16000,
  20000, 25000, 31500, 40000, 50000
];

export function getSkillMaxLevel(skillName: string): number {
  const name = skillName.toLowerCase();
  if (['farming', 'mining', 'combat', 'enchanting'].includes(name)) return 60;
  if (['foraging', 'fishing', 'alchemy', 'taming', 'carpentry'].includes(name)) return 50;
  if (name === 'runecrafting') return 25;
  if (name === 'social') return 25;
  return 50;
}

export function calculateSkillProgress(skillName: string, totalXp: number): SkillProgress {
  const name = skillName.toLowerCase();
  let table = SKILL_XP_TABLE;
  let maxLevel = getSkillMaxLevel(skillName);

  if (name === 'runecrafting') table = RUNECRAFTING_XP_TABLE;
  if (name === 'social') table = SOCIAL_XP_TABLE;

  let level = 0;
  let accumulatedXp = 0;
  let currentLevelXp = totalXp;
  let nextLevelReq = table[1] || 100;

  for (let lvl = 1; lvl <= maxLevel; lvl++) {
    const cost = table[lvl] || 10000000;
    if (totalXp >= accumulatedXp + cost) {
      accumulatedXp += cost;
      level = lvl;
    } else {
      currentLevelXp = totalXp - accumulatedXp;
      nextLevelReq = cost;
      break;
    }
  }

  // If max level reached
  if (level >= maxLevel) {
    currentLevelXp = totalXp - accumulatedXp;
    nextLevelReq = 0;
  }

  const progressPercent = nextLevelReq > 0 
    ? Math.min(100, Math.max(0, Math.floor((currentLevelXp / nextLevelReq) * 100))) 
    : 100;

  return {
    name: skillName.charAt(0).toUpperCase() + skillName.slice(1).toLowerCase(),
    level,
    maxLevel,
    xp: Math.round(currentLevelXp * 10) / 10,
    nextLevelXp: nextLevelReq,
    progressPercent,
  };
}

export function calculateSkillAverage(skills: SkillProgress[]): number {
  // Official SkyBlock skill average uses Farming, Mining, Combat, Foraging, Fishing, Enchanting, Alchemy, Taming
  const coreSkills = ['farming', 'mining', 'combat', 'foraging', 'fishing', 'enchanting', 'alchemy', 'taming'];
  const matching = skills.filter(s => coreSkills.includes(s.name.toLowerCase()));
  if (matching.length === 0) return 0;
  const sum = matching.reduce((acc, s) => acc + s.level, 0);
  return Math.round((sum / matching.length) * 100) / 100;
}
