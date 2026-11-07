import { prisma } from './prisma';
import { decodeNbtBuffer } from './nbt';
import { calculateSkillProgress, calculateSkillAverage } from './calculations/skills';
import { calculateSlayerProgress } from './calculations/slayers';
import { processAccessories } from './calculations/accessories';
import { calculateNetworth } from './calculations/networth';
import { FullSkyBlockProfile, PlayerIdentity, ProfileMetadata, PetData, DecodedItem } from './types';

export interface HypixelApiError {
  error: string;
  message: string;
  status: number;
}

const DEFAULT_HYPIXEL_API_KEY = 'a93589d2-67f9-407b-9c96-6b4e35be483f';

export async function getHypixelApiKey(): Promise<string | null> {
  if (process.env.HYPIXEL_API_KEY && process.env.HYPIXEL_API_KEY.trim() !== '') {
    return process.env.HYPIXEL_API_KEY.trim();
  }

  try {
    const config = await prisma.appConfig.findUnique({
      where: { key: 'HYPIXEL_API_KEY' },
    });
    if (config?.value && config.value.trim() !== '') {
      return config.value.trim();
    }
  } catch (err) {
    // Database may be read-only in serverless mode
  }

  return DEFAULT_HYPIXEL_API_KEY;
}

export async function resolvePlayerUuid(usernameOrUuid: string): Promise<{ username: string; uuid: string } | null> {
  const clean = usernameOrUuid.replace(/-/g, '').trim();

  // If already a valid hex UUID
  if (/^[0-9a-fA-F]{32}$/.test(clean)) {
    return { username: usernameOrUuid, uuid: clean };
  }

  // Query PlayerDB
  try {
    const res = await fetch(`https://playerdb.co/api/player/minecraft/${encodeURIComponent(usernameOrUuid)}`, {
      headers: { 'User-Agent': 'SkyBlockTracker/1.0' },
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.player?.raw_id) {
        return {
          username: data.data.player.username,
          uuid: data.data.player.raw_id,
        };
      }
    }
  } catch (err) {
    console.warn('PlayerDB resolution failed, falling back to Mojang API:', err);
  }

  // Fallback Mojang API
  try {
    const res = await fetch(`https://api.mojang.com/users/by/username/${encodeURIComponent(usernameOrUuid)}`);
    if (res.ok) {
      const data = await res.json();
      if (data?.id) {
        return {
          username: data.name,
          uuid: data.id,
        };
      }
    }
  } catch (err) {
    console.error('Mojang API resolution failed:', err);
  }

  return null;
}

export async function fetchHypixelPlayer(uuid: string, apiKey: string) {
  const res = await fetch(`https://api.hypixel.net/v2/player?uuid=${uuid}`, {
    headers: { 'API-Key': apiKey },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw {
      error: 'HYPIXEL_PLAYER_FETCH_FAILED',
      message: errorBody.cause || `Hypixel Player API returned HTTP ${res.status}`,
      status: res.status,
    };
  }

  const data = await res.json();
  return data?.player || null;
}

export async function fetchHypixelProfiles(uuid: string, apiKey: string) {
  const res = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?uuid=${uuid}`, {
    headers: { 'API-Key': apiKey },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw {
      error: 'HYPIXEL_PROFILES_FETCH_FAILED',
      message: errorBody.cause || `Hypixel SkyBlock API returned HTTP ${res.status}`,
      status: res.status,
    };
  }

  const data = await res.json();
  return data?.profiles || [];
}

const PET_XP_TABLE = [
  100, 110, 120, 130, 145, 160, 175, 190, 210, 230, 250, 275, 300, 330, 360, 400, 440, 490, 540, 600,
  660, 730, 800, 880, 960, 1050, 1150, 1260, 1380, 1510, 1650, 1800, 1960, 2130, 2310, 2500, 2700,
  2920, 3160, 3420, 3700, 4000, 4350, 4750, 5200, 5700, 6300, 7000, 7800, 8700, 9700, 10800, 12000,
  13300, 14700, 16200, 17800, 19500, 21300, 23200, 25200, 27400, 29800, 32400, 35200, 38200, 41400,
  44800, 48400, 52200, 56200, 60400, 64800, 69400, 74200, 79200, 84400, 89800, 95500, 101400, 107500,
  113900, 120500, 127300, 134400, 141700, 149300, 157200, 165400, 173900, 182700, 191800, 201200,
  210900, 220900, 231200, 241800, 252700, 263900
];

const PET_RARITY_OFFSETS: Record<string, number> = {
  COMMON: 0,
  UNCOMMON: 6,
  RARE: 11,
  EPIC: 16,
  LEGENDARY: 20,
  MYTHIC: 20
};

export function calculatePetLevel(tier: string, totalXp: number): { level: number; currentLevelXp: number; xpForNext: number } {
  const offset = PET_RARITY_OFFSETS[tier?.toUpperCase()] || 0;
  let level = 1;
  let accumulated = 0;
  let xpForNext = PET_XP_TABLE[offset];

  for (let i = 0; i < 99; i++) {
    const cost = PET_XP_TABLE[offset + i] || 10000000;
    if (totalXp >= accumulated + cost) {
      accumulated += cost;
      level++;
    } else {
      xpForNext = cost;
      break;
    }
  }

  const currentLevelXp = Math.max(0, totalXp - accumulated);
  return { level, currentLevelXp, xpForNext };
}

export function computeHypixelRank(player: any): string {
  if (!player) return 'Non';
  if (player.prefix) return player.prefix.replace(/§[0-9a-fk-or]/gi, '');
  if (player.rank === 'ADMIN') return 'ADMIN';
  if (player.rank === 'YOUTUBER') return 'YOUTUBE';
  if (player.monthlyPackageRank === 'SUPERSTAR') return 'MVP++';
  if (player.newPackageRank === 'MVP_PLUS') return 'MVP+';
  if (player.newPackageRank === 'MVP') return 'MVP';
  if (player.newPackageRank === 'VIP_PLUS') return 'VIP+';
  if (player.newPackageRank === 'VIP') return 'VIP';
  if (player.packageRank === 'MVP_PLUS') return 'MVP+';
  if (player.packageRank === 'MVP') return 'MVP';
  if (player.packageRank === 'VIP_PLUS') return 'VIP+';
  if (player.packageRank === 'VIP') return 'VIP';
  return 'Default';
}

export function computeNetworkLevel(networkExp: number): number {
  if (!networkExp || networkExp < 0) return 1;
  const level = Math.floor((Math.sqrt(2 * networkExp + 306250) / 50) - 2.5);
  return Math.max(1, level);
}

export async function parseHypixelProfile(
  rawProfile: any,
  playerUuid: string,
  playerData: any
): Promise<FullSkyBlockProfile> {
  const cleanUuid = playerUuid.replace(/-/g, '').toLowerCase();
  const members = rawProfile.members || {};
  const member = members[cleanUuid] || members[playerUuid] || {};

  // Player identity
  const username = playerData?.displayname || 'Unknown';
  const rank = computeHypixelRank(playerData);
  const networkLevel = computeNetworkLevel(playerData?.networkExp || 0);
  const avatarUrl = `https://crafthead.net/avatar/${cleanUuid}`;

  const identity: PlayerIdentity = {
    username,
    uuid: cleanUuid,
    rank,
    networkLevel,
    firstLogin: playerData?.firstLogin,
    lastLogin: playerData?.lastLogin,
    avatarUrl,
  };

  const profileMeta: ProfileMetadata = {
    profileId: rawProfile.profile_id,
    profileName: rawProfile.cute_name || 'Unknown',
    selected: Boolean(rawProfile.selected),
    gameMode: rawProfile.game_mode || 'normal',
    members: Object.keys(members),
  };

  // Currencies
  const purse = member.currencies?.coin_purse ?? member.coin_purse ?? 0;
  const bank = rawProfile.banking?.balance ?? 0;
  const sacks = member.inventory?.sacks_counts || undefined;

  // Inventories & Equipment NBT Decoding
  const invData = member.inventory?.inv_contents?.data || member.inv_contents?.data;
  const armorData = member.inventory?.inv_armor?.data || member.inv_armor?.data;
  const equipData = member.inventory?.equipment_contents?.data;
  const ecData = member.inventory?.ender_chest_contents?.data || member.ender_chest_contents?.data;
  const accBagData = member.inventory?.bag_contents?.talisman_bag?.data || member.talisman_bag?.data;
  const vaultData = member.inventory?.personal_vault_contents?.data;
  const wardrobeData = member.inventory?.wardrobe_contents?.data;

  const [
    mainInv,
    rawArmor,
    rawEquip,
    enderChest,
    accessoryBag,
    personalVault,
    wardrobe,
  ] = await Promise.all([
    decodeNbtBuffer(invData),
    decodeNbtBuffer(armorData),
    decodeNbtBuffer(equipData),
    decodeNbtBuffer(ecData),
    decodeNbtBuffer(accBagData),
    decodeNbtBuffer(vaultData),
    decodeNbtBuffer(wardrobeData),
  ]);

  // Armor slots in Minecraft NBT are boots, leggings, chestplate, helmet (reversed)
  const armorList: (DecodedItem | null)[] = [
    rawArmor.find(i => i.slot === 3) || rawArmor[3] || null, // Helmet
    rawArmor.find(i => i.slot === 2) || rawArmor[2] || null, // Chestplate
    rawArmor.find(i => i.slot === 1) || rawArmor[1] || null, // Leggings
    rawArmor.find(i => i.slot === 0) || rawArmor[0] || null, // Boots
  ];

  const equipList: (DecodedItem | null)[] = [
    rawEquip.find(i => i.slot === 0) || null, // Necklace
    rawEquip.find(i => i.slot === 1) || null, // Cloak
    rawEquip.find(i => i.slot === 2) || null, // Belt
    rawEquip.find(i => i.slot === 3) || null, // Gloves
  ];

  // Primary held weapon from main inventory slot 0 or any weapon
  const weapon = mainInv.find(i => 
    i.lore?.some(l => l.toUpperCase().includes('SWORD') || l.toUpperCase().includes('BOW'))
  ) || null;

  // Skills
  const playerExp = member.player_data?.experience || {};
  const skillNames = [
    'farming', 'mining', 'combat', 'foraging', 'fishing', 
    'enchanting', 'alchemy', 'taming', 'carpentry', 'runecrafting', 'social'
  ];

  const skillProgressList = skillNames.map(name => {
    const xp = playerExp[`SKILL_${name.toUpperCase()}`] || member[`experience_skill_${name}`] || 0;
    return calculateSkillProgress(name, xp);
  });

  const skillAverage = calculateSkillAverage(skillProgressList);

  // Slayers
  const rawSlayers = member.slayer?.slayer_bosses || member.slayer_bosses || {};
  const slayerTypes = ['zombie', 'spider', 'wolf', 'enderman', 'blaze', 'vampire'];
  const slayerProgressList = slayerTypes.map(t => {
    const sData = rawSlayers[t] || {};
    return calculateSlayerProgress(t, sData.xp || 0);
  });
  const totalSlayerXp = slayerProgressList.reduce((acc, s) => acc + s.xp, 0);

  // Accessories & Magical Power
  const { accessories, totalMagicalPower, duplicateIds } = processAccessories(accessoryBag);

  // Pets (Hypixel v2 stores in member.pets_data.pets, fallback to member.pets)
  const rawPets = member.pets_data?.pets || member.pets || [];
  const petList: PetData[] = rawPets.map((p: any) => {
    const { level } = calculatePetLevel(p.tier || 'COMMON', p.exp || 0);
    return {
      uuid: p.uuid,
      type: p.type,
      name: p.type?.replace(/_/g, ' ') || 'Pet',
      rarity: p.tier || 'COMMON',
      level,
      exp: p.exp || 0,
      heldItem: p.heldItem,
      active: Boolean(p.active),
      candyUsed: p.candyUsed || 0,
      skin: p.skin,
    };
  });

  const activePet = petList.find(p => p.active) || null;
  const petScore = petList.length;

  // SkyBlock level
  const sbLevelXp = member.leveling?.experience || 0;
  const sbLevel = Math.floor(sbLevelXp / 100);

  // Missing data tracking (API privacy flags)
  const missingDataReasons: Record<string, string> = {};
  if (!invData) {
    missingDataReasons['inventory'] = 'Inventory API disabled in player Hypixel privacy settings.';
  }
  if (!accBagData && accessoryBag.length === 0) {
    missingDataReasons['accessories'] = 'Accessory Bag API is not accessible or empty.';
  }
  if (!member.collection) {
    missingDataReasons['collections'] = 'Collections API disabled in player Hypixel privacy settings.';
  }

  // Networth calculation
  const networth = calculateNetworth({
    purse,
    bank,
    armor: armorList,
    equipment: equipList,
    inventory: mainInv,
    enderChest,
    accessories: accessoryBag,
    pets: petList,
    vault: personalVault,
  });

  const fullProfile: FullSkyBlockProfile = {
    identity,
    profile: profileMeta,
    currencies: {
      purse,
      bank,
      totalLiquid: purse + bank,
    },
    skyblockLevel: {
      level: sbLevel,
      xp: sbLevelXp % 100,
      nextLevelXp: 100,
    },
    stats: {
      health: 100,
      defense: 0,
      trueDefense: 0,
      strength: 0,
      critChance: 30,
      critDamage: 50,
      speed: 100,
      intelligence: 0,
      magicFind: 0,
      ferocity: 0,
      abilityDamage: 0,
      miningFortune: 0,
      farmingFortune: 0,
      foragingFortune: 0,
      seaCreatureChance: 20,
      fairySouls: {
        collected: member.fairy_soul?.total_collected || member.fairy_souls_collected || 0,
        total: 289,
      },
    },
    skills: {
      average: skillAverage,
      list: skillProgressList,
    },
    slayers: {
      totalXp: totalSlayerXp,
      list: slayerProgressList,
    },
    collections: {
      unlockedCount: member.collection ? Object.keys(member.collection).length : 0,
      totalCount: 75,
      items: member.collection ? Object.entries(member.collection).map(([k, v]) => ({
        name: k.replace(/_/g, ' '),
        category: 'Mining',
        amount: Number(v) || 0,
        level: 1,
        maxLevel: 10,
      })) : [],
    },
    equipment: {
      armor: armorList,
      equipment: equipList,
      weapon,
    },
    inventories: {
      main: mainInv,
      enderChest,
      accessoryBag,
      personalVault,
      wardrobe,
      storage: [],
      sacks,
    },
    accessories: {
      magicalPower: totalMagicalPower,
      items: accessories,
      duplicates: duplicateIds,
      missingCount: Math.max(0, 100 - accessories.length),
    },
    pets: {
      list: petList,
      activePet,
      petScore,
    },
    dungeons: {
      catacombsLevel: member.dungeons?.dungeon_types?.catacombs?.level || 0,
      catacombsXp: member.dungeons?.dungeon_types?.catacombs?.experience || 0,
      classes: {},
      secretsFound: member.dungeons?.secrets || 0,
    },
    networth,
    transparency: {
      dataSource: 'HYPIXEL_API_LIVE',
      lastUpdated: new Date().toISOString(),
      cached: false,
      provenance: 'Hypixel Public API v2 (Official)',
      missingDataReasons,
    },
  };

  return fullProfile;
}
