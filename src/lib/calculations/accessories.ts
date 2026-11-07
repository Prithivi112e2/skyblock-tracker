import { DecodedItem, ItemRarity, AccessoryData } from '../types';

export const RARITY_MAGICAL_POWER: Record<ItemRarity, number> = {
  COMMON: 3,
  UNCOMMON: 5,
  RARE: 8,
  EPIC: 12,
  LEGENDARY: 16,
  MYTHIC: 22,
  DIVINE: 22,
  SPECIAL: 3,
  VERY_SPECIAL: 5,
};

// Groups of accessories where only the highest tier counts for Magical Power
export const ACCESSORY_FAMILIES: Record<string, string[]> = {
  RING_OF_LOVE: ['CAMPFIRE_TALISMAN_1', 'CAMPFIRE_TALISMAN_2', 'CAMPFIRE_TALISMAN_3', 'CAMPFIRE_TALISMAN_4', 'CAMPFIRE_TALISMAN_5'],
  SPEED_TALISMAN: ['SPEED_TALISMAN', 'SPEED_RING', 'SPEED_ARTIFACT'],
  FEATHER_TALISMAN: ['FEATHER_TALISMAN', 'FEATHER_RING', 'FEATHER_ARTIFACT'],
  PIGGY_BANK: ['PIGGY_BANK', 'CRACKED_PIGGY_BANK', 'BROKEN_PIGGY_BANK'],
  POTION_AFFINITY: ['POTION_AFFINITY_TALISMAN', 'RING_POTION_AFFINITY', 'ARTIFACT_POTION_AFFINITY'],
  HEALING_TALISMAN: ['HEALING_TALISMAN', 'HEALING_RING'],
  SEA_CREATURE_TALISMAN: ['SEA_CREATURE_TALISMAN', 'SEA_CREATURE_RING', 'SEA_CREATURE_ARTIFACT'],
  ZOMBIE_TALISMAN: ['ZOMBIE_TALISMAN', 'ZOMBIE_RING', 'ZOMBIE_ARTIFACT'],
  SKELETON_TALISMAN: ['SKELETON_TALISMAN'],
  VILLAGE_AFFINITY: ['VILLAGE_AFFINITY_TALISMAN'],
  MINE_AFFINITY: ['MINE_AFFINITY_TALISMAN'],
  INTIMIDATION: ['INTIMIDATION_TALISMAN', 'INTIMIDATION_RING', 'INTIMIDATION_ARTIFACT', 'INTIMIDATION_RELIC'],
  BAT_TALISMAN: ['BAT_TALISMAN', 'BAT_RING', 'BAT_ARTIFACT'],
  RED_CLAW: ['RED_CLAW_TALISMAN', 'RED_CLAW_RING', 'RED_CLAW_ARTIFACT'],
  DEVOUR_RING: ['DEVOUR_RING'],
  SURVIVOR_CUBE: ['SURVIVOR_CUBE'],
  TARANTULA_TALISMAN: ['TARANTULA_TALISMAN'],
  SPIDER_TALISMAN: ['SPIDER_TALISMAN', 'SPIDER_RING', 'SPIDER_ARTIFACT'],
  EXPERIENCE_ARTIFACT: ['EXPERIENCE_ARTIFACT'],
  WOLF_TALISMAN: ['WOLF_TALISMAN', 'WOLF_RING'],
};

export const COMMON_CHEAP_ACCESSORIES = [
  { id: 'VILLAGE_AFFINITY_TALISMAN', name: 'Village Affinity Talisman', rarity: 'COMMON', cost: 2500, mp: 3 },
  { id: 'MINE_AFFINITY_TALISMAN', name: 'Mine Affinity Talisman', rarity: 'COMMON', cost: 5000, mp: 3 },
  { id: 'SCAVENGER_TALISMAN', name: 'Scavenger Talisman', rarity: 'COMMON', cost: 10000, mp: 3 },
  { id: 'SPEED_TALISMAN', name: 'Speed Talisman', rarity: 'COMMON', cost: 12000, mp: 3 },
  { id: 'FEATHER_TALISMAN', name: 'Feather Talisman', rarity: 'COMMON', cost: 15000, mp: 3 },
  { id: 'ZOMBIE_TALISMAN', name: 'Zombie Talisman', rarity: 'COMMON', cost: 25000, mp: 3 },
  { id: 'SKELETON_TALISMAN', name: 'Skeleton Talisman', rarity: 'COMMON', cost: 30000, mp: 3 },
  { id: 'PIGGY_BANK', name: 'Piggy Bank', rarity: 'UNCOMMON', cost: 75000, mp: 5 },
  { id: 'POTION_AFFINITY_TALISMAN', name: 'Potion Affinity Talisman', rarity: 'COMMON', cost: 20000, mp: 3 },
  { id: 'FIRE_TALISMAN', name: 'Fire Talisman', rarity: 'UNCOMMON', cost: 120000, mp: 5 },
  { id: 'LAVA_TALISMAN', name: 'Lava Talisman', rarity: 'UNCOMMON', cost: 150000, mp: 5 },
  { id: 'NIGHT_VISION_CHARM', name: 'Night Vision Charm', rarity: 'COMMON', cost: 40000, mp: 3 },
  { id: 'HEALING_TALISMAN', name: 'Healing Talisman', rarity: 'COMMON', cost: 35000, mp: 3 },
  { id: 'FARMING_TALISMAN', name: 'Farming Talisman', rarity: 'COMMON', cost: 40000, mp: 3 },
  { id: 'WOOD_TALISMAN', name: 'Wood Affinity Talisman', rarity: 'UNCOMMON', cost: 160000, mp: 5 },
  { id: 'MAGNETIC_TALISMAN', name: 'Magnetic Talisman', rarity: 'UNCOMMON', cost: 180000, mp: 5 },
  { id: 'GRAVITY_TALISMAN', name: 'Gravity Talisman', rarity: 'UNCOMMON', cost: 200000, mp: 5 },
  { id: 'SPEED_RING', name: 'Speed Ring', rarity: 'UNCOMMON', cost: 250000, mp: 5 },
  { id: 'FEATHER_RING', name: 'Feather Ring', rarity: 'UNCOMMON', cost: 280000, mp: 5 },
  { id: 'HEALING_RING', name: 'Healing Ring', rarity: 'UNCOMMON', cost: 300000, mp: 5 },
  { id: 'ZOMBIE_RING', name: 'Zombie Ring', rarity: 'UNCOMMON', cost: 320000, mp: 5 },
  { id: 'SPIDER_TALISMAN', name: 'Spider Talisman', rarity: 'UNCOMMON', cost: 350000, mp: 5 },
  { id: 'SEA_CREATURE_TALISMAN', name: 'Sea Creature Talisman', rarity: 'COMMON', cost: 50000, mp: 3 },
  { id: 'CAT_TALISMAN', name: 'Cat Talisman', rarity: 'UNCOMMON', cost: 400000, mp: 5 },
  { id: 'CHEETAH_TALISMAN', name: 'Cheetah Talisman', rarity: 'EPIC', cost: 2500000, mp: 12 },
  { id: 'SHARK_TOOTH_NECKLACE', name: 'Shark Tooth Necklace', rarity: 'LEGENDARY', cost: 5500000, mp: 16 },
  { id: 'CANDY_RELIC', name: 'Candy Relic', rarity: 'LEGENDARY', cost: 6000000, mp: 16 },
];

export function processAccessories(items: DecodedItem[]): {
  accessories: AccessoryData[];
  totalMagicalPower: number;
  duplicateIds: string[];
} {
  const seenIds = new Set<string>();
  const duplicateIds: string[] = [];
  const processed: AccessoryData[] = [];
  let totalMagicalPower = 0;

  for (const item of items) {
    const id = item.internalId || item.id;
    const isDuplicate = seenIds.has(id);
    
    if (isDuplicate) {
      duplicateIds.push(item.name);
    } else {
      seenIds.add(id);
    }

    let mp = RARITY_MAGICAL_POWER[item.rarity] || 3;
    
    // Hegemony Artifact doubles its MP
    if (id.includes('HEGEMONY_ARTIFACT')) {
      mp *= 2;
    }

    if (!isDuplicate) {
      totalMagicalPower += mp;
    }

    processed.push({
      item,
      rarity: item.rarity,
      magicalPower: isDuplicate ? 0 : mp,
      isDuplicate,
    });
  }

  // Sort accessories by MP descending
  processed.sort((a, b) => b.magicalPower - a.magicalPower);

  return {
    accessories: processed,
    totalMagicalPower,
    duplicateIds,
  };
}
