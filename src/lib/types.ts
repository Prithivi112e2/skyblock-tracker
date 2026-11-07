export type ItemRarity = 
  | 'COMMON' 
  | 'UNCOMMON' 
  | 'RARE' 
  | 'EPIC' 
  | 'LEGENDARY' 
  | 'MYTHIC' 
  | 'DIVINE' 
  | 'SPECIAL' 
  | 'VERY_SPECIAL';

export interface DecodedItem {
  slot?: number;
  id: string; // ExtraAttributes.id or minecraft id
  internalId?: string;
  name: string;
  count: number;
  rarity: ItemRarity;
  reforge?: string;
  enchantments?: Record<string, number>;
  stars?: number;
  gemstones?: Record<string, string>;
  attributes?: Record<string, number>;
  hotPotatoCount?: number;
  recombobulated?: boolean;
  lore: string[];
  price?: number;
  textureUrl?: string;
}

export interface PlayerIdentity {
  username: string;
  uuid: string;
  rank: string;
  networkLevel: number;
  firstLogin?: number;
  lastLogin?: number;
  avatarUrl: string;
}

export interface ProfileMetadata {
  profileId: string;
  profileName: string; // Cute name, e.g. "Strawberry"
  selected: boolean;
  gameMode?: string;
  createdDate?: string;
  members: string[]; // UUIDs of co-op members
}

export interface SkillProgress {
  name: string;
  level: number;
  maxLevel: number;
  xp: number;
  nextLevelXp: number;
  progressPercent: number;
}

export interface SlayerProgress {
  name: string;
  bossName: string;
  level: number;
  maxLevel: number;
  xp: number;
  nextLevelXp: number;
  kills?: number;
}

export interface CollectionItem {
  name: string;
  category: string;
  amount: number;
  level: number;
  maxLevel: number;
}

export interface PetData {
  uuid?: string;
  type: string;
  name: string;
  rarity: ItemRarity;
  level: number;
  exp: number;
  heldItem?: string;
  active: boolean;
  candyUsed: number;
  skin?: string;
}

export interface AccessoryData {
  item: DecodedItem;
  rarity: ItemRarity;
  magicalPower: number;
  isDuplicate: boolean;
}

export interface DungeonClassProgress {
  name: string;
  level: number;
  xp: number;
}

export interface DungeonProgress {
  catacombsLevel: number;
  catacombsXp: number;
  selectedClass?: string;
  classes: Record<string, DungeonClassProgress>;
  highestFloorCleared?: string;
  secretsFound: number;
}

export interface MiningProgress {
  hotmTier: number;
  mithrilPowder: number;
  gemstonePowder: number;
  glacitePowder: number;
}

export interface GardenProgress {
  gardenLevel: number;
  cropsComposted: number;
  visitorsAccepted: number;
  unlockedPlots: number;
}

export interface NetworthBreakdownItem {
  category: string;
  name: string;
  value: number;
  percentage: number;
  itemCount?: number;
}

export interface ProfileStats {
  health: number;
  defense: number;
  trueDefense: number;
  strength: number;
  critChance: number;
  critDamage: number;
  speed: number;
  intelligence: number;
  magicFind: number;
  ferocity: number;
  abilityDamage: number;
  miningFortune: number;
  farmingFortune: number;
  foragingFortune: number;
  seaCreatureChance: number;
  fairySouls: {
    collected: number;
    total: number;
  };
}

export interface UpgradeRecommendation {
  id: string;
  category: 'ACCESSORY' | 'WEAPON' | 'ARMOR' | 'PET' | 'ENCHANT' | 'PROGRESSION';
  title: string;
  description: string;
  cost: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'OPTIONAL';
  statGains: Record<string, number | string>;
  isPurchased?: boolean;
}

export interface TransparencyMetadata {
  dataSource: 'HYPIXEL_API_LIVE' | 'VERIFIED_SNAPSHOT' | 'USER_IMPORT';
  lastUpdated: string;
  cached: boolean;
  apiLatencyMs?: number;
  provenance: string;
  missingDataReasons?: Record<string, string>; // e.g. { "inventory": "Inventory API disabled in Hypixel privacy settings" }
}

export interface FullSkyBlockProfile {
  identity: PlayerIdentity;
  profile: ProfileMetadata;
  currencies: {
    purse: number;
    bank: number;
    totalLiquid: number;
  };
  skyblockLevel: {
    level: number;
    xp: number;
    nextLevelXp: number;
  };
  stats: ProfileStats;
  skills: {
    average: number;
    list: SkillProgress[];
  };
  slayers: {
    totalXp: number;
    list: SlayerProgress[];
  };
  collections: {
    unlockedCount: number;
    totalCount: number;
    items: CollectionItem[];
  };
  equipment: {
    armor: (DecodedItem | null)[]; // [helmet, chestplate, leggings, boots]
    equipment: (DecodedItem | null)[]; // [necklace, cloak, belt, gloves]
    weapon?: DecodedItem | null;
  };
  inventories: {
    main: DecodedItem[];
    enderChest: DecodedItem[];
    accessoryBag: DecodedItem[];
    personalVault: DecodedItem[];
    wardrobe: DecodedItem[];
    storage: DecodedItem[];
    sacks?: Record<string, number>;
  };
  accessories: {
    magicalPower: number;
    selectedPower?: string;
    items: AccessoryData[];
    duplicates: string[];
    missingCount: number;
  };
  pets: {
    list: PetData[];
    activePet?: PetData | null;
    petScore: number;
  };
  dungeons?: DungeonProgress;
  mining?: MiningProgress;
  garden?: GardenProgress;
  minions?: {
    slots: number;
    unlockedMinions: number;
  };
  networth: {
    total: number;
    liquid: number;
    breakdown: NetworthBreakdownItem[];
    mostValuableItems: DecodedItem[];
    historicalSnapshots?: { timestamp: string; networth: number; purse: number }[];
  };
  transparency: TransparencyMetadata;
}
