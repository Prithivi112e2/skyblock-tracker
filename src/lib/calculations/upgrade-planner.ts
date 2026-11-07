import { FullSkyBlockProfile, UpgradeRecommendation } from '../types';
import { COMMON_CHEAP_ACCESSORIES } from './accessories';

export type PlannerGoal = 'combat' | 'slayers' | 'dungeons' | 'mining' | 'farming';

export const GOAL_LABELS: Record<PlannerGoal, string> = {
  combat: 'Early/Mid Game Combat',
  slayers: 'Slayer Boss Progression',
  dungeons: 'Catacombs & Dungeons',
  mining: 'Mining & Heart of the Mountain',
  farming: 'Farming & Garden Progression',
};

export function generateUpgradePlan(
  profile: FullSkyBlockProfile,
  goal: PlannerGoal,
  budget: number
): {
  recommendations: UpgradeRecommendation[];
  totalCost: number;
  remainingBudget: number;
  projectedStats: Record<string, number | string>;
} {
  // Collect all owned item IDs
  const ownedItemIds = new Set<string>();

  // From inventories
  const allContainers = [
    ...profile.equipment.armor,
    ...profile.equipment.equipment,
    profile.equipment.weapon,
    ...profile.inventories.main,
    ...profile.inventories.enderChest,
    ...profile.inventories.accessoryBag,
    ...profile.inventories.personalVault,
    ...profile.inventories.wardrobe,
  ].filter(Boolean);

  for (const item of allContainers) {
    if (item?.id) ownedItemIds.add(item.id.toUpperCase());
    if (item?.internalId) ownedItemIds.add(item.internalId.toUpperCase());
  }

  // From pets
  for (const pet of profile.pets.list) {
    ownedItemIds.add(`PET_${pet.type.toUpperCase()}`);
  }

  const recs: UpgradeRecommendation[] = [];

  // 1. Missing cheap accessories (Best MP per coin in the entire game)
  for (const acc of COMMON_CHEAP_ACCESSORIES) {
    if (!ownedItemIds.has(acc.id)) {
      recs.push({
        id: `ACC_${acc.id}`,
        category: 'ACCESSORY',
        title: acc.name,
        description: `Unclaimed ${acc.rarity.toLowerCase()} accessory providing +${acc.mp} Magical Power.`,
        cost: acc.cost,
        priority: acc.cost < 50000 ? 'CRITICAL' : 'HIGH',
        statGains: {
          'Magical Power': `+${acc.mp}`,
          'Cost per MP': `${Math.round(acc.cost / acc.mp).toLocaleString()} coins`,
        },
      });
    }
  }

  // 2. Goal-specific gear & upgrades
  if (goal === 'combat') {
    if (!ownedItemIds.has('ASPECT_OF_THE_END')) {
      recs.push({
        id: 'WEAPON_AOTE',
        category: 'WEAPON',
        title: 'Aspect of the End (AOTE)',
        description: 'Crucial utility weapon allowing instant 8-block teleportation and mobility.',
        cost: 250000,
        priority: 'CRITICAL',
        statGains: { Damage: '+100', Strength: '+100', Utility: 'Instant Transmission' },
      });
    }

    if (!ownedItemIds.has('ASPECT_OF_THE_DRAGONS')) {
      recs.push({
        id: 'WEAPON_AOTD',
        category: 'WEAPON',
        title: 'Aspect of the Dragons (AOTD)',
        description: 'Primary high-damage sword for early-to-mid combat, slayer, and End Island.',
        cost: 1100000,
        priority: 'CRITICAL',
        statGains: { Damage: '+225', Strength: '+100', Ability: 'Dragon Rage' },
      });
    }

    if (!ownedItemIds.has('STRONG_DRAGON_CHESTPLATE') && !ownedItemIds.has('SHADOW_ASSASSIN_CHESTPLATE')) {
      recs.push({
        id: 'ARMOR_STRONG_DRAGON',
        category: 'ARMOR',
        title: 'Full Strong Dragon Armor Set',
        description: 'Massive early-game strength boost (+75 strength full set bonus and great defense).',
        cost: 6400000,
        priority: 'HIGH',
        statGains: { Health: '+490', Defense: '+630', Strength: '+100' },
      });
    }

    if (!ownedItemIds.has('PET_TIGER') && !ownedItemIds.has('PET_LION')) {
      recs.push({
        id: 'PET_LION',
        category: 'PET',
        title: 'Legendary Lion Pet',
        description: 'Multiplies first-strike damage and increases raw strength for combat & slayers.',
        cost: 8500000,
        priority: 'HIGH',
        statGains: { Strength: '+50', 'Damage Boost': '+150% on first hit' },
      });
    }

    recs.push({
      id: 'CONSUMABLE_GOD_POTION',
      category: 'PROGRESSION',
      title: 'Booster Cookie + God Potion',
      description: 'Instant 24-hour duration boost with max potion effects, +100 Speed, +20% Crit Chance.',
      cost: 12500000,
      priority: 'HIGH',
      statGains: { Speed: '+100', 'Crit Chance': '+25%', Strength: '+75' },
    });
  } else if (goal === 'slayers') {
    if (!ownedItemIds.has('REAPER_FALCHION')) {
      recs.push({
        id: 'WEAPON_REAPER_FALCHION',
        category: 'WEAPON',
        title: 'Reaper Falchion',
        description: 'Deals +200% damage to Zombies and heals 10 HP per hit against Revenant Horror.',
        cost: 4500000,
        priority: 'CRITICAL',
        statGains: { 'Zombie Damage': '+200%', Healing: '+10 HP/hit' },
      });
    }

    if (!ownedItemIds.has('MANA_FLUX_POWER_ORB')) {
      recs.push({
        id: 'PROGRESSION_MANA_FLUX',
        category: 'PROGRESSION',
        title: 'Mana Flux Power Orb',
        description: 'Deploys an orb healing 2% max HP/s and +50% mana regen to all allies.',
        cost: 9500000,
        priority: 'CRITICAL',
        statGains: { 'HP Regen': '+2%/s', 'Mana Regen': '+50%' },
      });
    }

    if (!ownedItemIds.has('WAND_OF_RESTORATION')) {
      recs.push({
        id: 'PROGRESSION_WAND_OF_RESTORATION',
        category: 'PROGRESSION',
        title: 'Wand of Restoration',
        description: 'Active healing wand restoring 120 HP/s for 7 seconds during boss fights.',
        cost: 1800000,
        priority: 'HIGH',
        statGains: { 'Active Healing': '+840 HP over 7s' },
      });
    }
  } else if (goal === 'dungeons') {
    if (!ownedItemIds.has('SHADOW_ASSASSIN_CHESTPLATE')) {
      recs.push({
        id: 'ARMOR_SHADOW_ASSASSIN',
        category: 'ARMOR',
        title: '3/4 Shadow Assassin + Zombie Knight Chestplate',
        description: 'The standard entry kit for Catacombs Floor 5-7. High crit damage and speed.',
        cost: 14000000,
        priority: 'CRITICAL',
        statGains: { 'Crit Damage': '+180%', Speed: '+45', Defense: '+420' },
      });
    }

    if (!ownedItemIds.has('LIVID_DAGGER')) {
      recs.push({
        id: 'WEAPON_LIVID_DAGGER',
        category: 'WEAPON',
        title: 'Livid Dagger (5-Star)',
        description: 'Grants guaranteed 100% bonus attack speed and 100% crit chance + double backstab damage.',
        cost: 8500000,
        priority: 'HIGH',
        statGains: { 'Attack Speed': '+100%', 'Crit Chance': '+100%' },
      });
    }

    if (!ownedItemIds.has('PET_BABY_YETI')) {
      recs.push({
        id: 'PET_BABY_YETI',
        category: 'PET',
        title: 'Epic Baby Yeti Pet',
        description: 'Converts 75% of your Strength into raw Defense for survivability in Dungeons.',
        cost: 16000000,
        priority: 'HIGH',
        statGains: { Defense: '+300-600 in Dungeons' },
      });
    }
  } else if (goal === 'mining') {
    if (!ownedItemIds.has('SORROW_CHESTPLATE')) {
      recs.push({
        id: 'ARMOR_SORROW',
        category: 'ARMOR',
        title: 'Sorrow Armor Set',
        description: 'Premier mining set granting massive Mining Fortune, True Defense, and Magic Find.',
        cost: 32000000,
        priority: 'HIGH',
        statGains: { 'Mining Fortune': '+180', 'True Defense': '+120' },
      });
    }

    if (!ownedItemIds.has('RUBY_DRILL_TX15')) {
      recs.push({
        id: 'TOOL_RUBY_DRILL',
        category: 'WEAPON',
        title: 'Ruby Drill TX-15',
        description: 'Essential drill capable of breaking Gemstones in the Crystal Hollows.',
        cost: 7200000,
        priority: 'CRITICAL',
        statGains: { 'Mining Speed': '+600', 'Mining Fortune': '+80' },
      });
    }

    if (!ownedItemIds.has('PET_ARMADILLO')) {
      recs.push({
        id: 'PET_ARMADILLO',
        category: 'PET',
        title: 'Legendary Armadillo Pet',
        description: 'Allows riding and instamining gemstone veins in the Crystal Hollows.',
        cost: 3500000,
        priority: 'HIGH',
        statGains: { 'Mining Speed': '+120', 'Defense': '+100' },
      });
    }
  } else if (goal === 'farming') {
    if (!ownedItemIds.has('LOTUS_BRACELET')) {
      recs.push({
        id: 'EQUIP_LOTUS',
        category: 'ARMOR',
        title: 'Full Lotus Equipment Set (4/4)',
        description: 'Grants scaling Farming Fortune based on Garden visitors served.',
        cost: 4500000,
        priority: 'CRITICAL',
        statGains: { 'Farming Fortune': '+60' },
      });
    }

    if (!ownedItemIds.has('PET_ELEPHANT')) {
      recs.push({
        id: 'PET_ELEPHANT',
        category: 'PET',
        title: 'Legendary Elephant Pet',
        description: 'Provides +180 Farming Fortune and doubles crop drop rate in the Garden.',
        cost: 18000000,
        priority: 'HIGH',
        statGains: { 'Farming Fortune': '+180' },
      });
    }
  }

  // General enchantments / upgrades
  recs.push({
    id: 'ENCHANT_HOT_POTATO',
    category: 'ENCHANT',
    title: '10x Hot Potato Books for Armor & Weapon',
    description: 'Permanently adds +20 Damage, +20 Strength to weapon and +40 HP, +20 Def per armor piece.',
    cost: 4800000,
    priority: 'HIGH',
    statGains: { Health: '+160', Defense: '+80', Damage: '+20', Strength: '+20' },
  });

  // Calculate costs and budget filtering
  let totalCost = 0;
  for (const r of recs) {
    totalCost += r.cost;
  }

  const remainingBudget = Math.max(0, budget - totalCost);

  // Projected stats calculation
  let projectedMp = profile.accessories.magicalPower;
  let projectedHealth = profile.stats.health;
  let projectedDefense = profile.stats.defense;
  let projectedStrength = profile.stats.strength;
  let projectedCritDamage = profile.stats.critDamage;

  for (const r of recs) {
    if (r.statGains['Magical Power']) {
      const match = String(r.statGains['Magical Power']).match(/\+(\d+)/);
      if (match) projectedMp += parseInt(match[1], 10);
    }
    if (r.statGains['Health']) {
      const match = String(r.statGains['Health']).match(/\+(\d+)/);
      if (match) projectedHealth += parseInt(match[1], 10);
    }
    if (r.statGains['Defense']) {
      const match = String(r.statGains['Defense']).match(/\+(\d+)/);
      if (match) projectedDefense += parseInt(match[1], 10);
    }
    if (r.statGains['Strength']) {
      const match = String(r.statGains['Strength']).match(/\+(\d+)/);
      if (match) projectedStrength += parseInt(match[1], 10);
    }
  }

  return {
    recommendations: recs,
    totalCost,
    remainingBudget,
    projectedStats: {
      'Magical Power': `${profile.accessories.magicalPower} → ${projectedMp}`,
      Health: `${profile.stats.health} → ${projectedHealth}`,
      Defense: `${profile.stats.defense} → ${projectedDefense}`,
      Strength: `${profile.stats.strength} → ${projectedStrength}`,
    },
  };
}
