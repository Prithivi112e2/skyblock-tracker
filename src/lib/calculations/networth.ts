import { DecodedItem, NetworthBreakdownItem, PetData } from '../types';

// Standard baseline price estimations for SkyBlock items when Bazaar/Auction data is offline
export const BASE_ITEM_PRICES: Record<string, number> = {
  // Armor
  GLACITE_HELMET: 12000,
  GLACITE_CHESTPLATE: 18000,
  GLACITE_LEGGINGS: 15000,
  GLACITE_BOOTS: 10000,
  STRONG_DRAGON_HELMET: 1200000,
  STRONG_DRAGON_CHESTPLATE: 2500000,
  STRONG_DRAGON_LEGGINGS: 1800000,
  STRONG_DRAGON_BOOTS: 900000,
  SHADOW_ASSASSIN_HELMET: 3500000,
  SHADOW_ASSASSIN_CHESTPLATE: 24000000,
  SHADOW_ASSASSIN_LEGGINGS: 7000000,
  SHADOW_ASSASSIN_BOOTS: 2500000,
  NECRON_HELMET: 15000000,
  NECRON_CHESTPLATE: 42000000,
  NECRON_LEGGINGS: 38000000,
  NECRON_BOOTS: 14000000,

  // Weapons
  ASPECT_OF_THE_END: 250000,
  ASPECT_OF_THE_DRAGONS: 1100000,
  LIVID_DAGGER: 7500000,
  SHADOW_FURY: 48000000,
  JUJU_SHORTBOW: 35000000,
  HYPERION: 1850000000,
  TERMINATOR: 750000000,

  // Power Stones & Accessories
  RECOMBOBULATOR_3000: 9500000,
  HOT_POTATO_BOOK: 120000,
  FUMING_POTATO_BOOK: 1400000,
  GOD_POTION: 1200000,
  BOOSTER_COOKIE: 11500000,
};

export function estimateItemValue(
  item: DecodedItem, 
  priceCache?: Record<string, number>
): number {
  const id = item.internalId || item.id;
  let basePrice = 0;

  if (priceCache && priceCache[id]) {
    basePrice = priceCache[id];
  } else if (BASE_ITEM_PRICES[id]) {
    basePrice = BASE_ITEM_PRICES[id];
  } else {
    // Estimate baseline by rarity
    switch (item.rarity) {
      case 'COMMON': basePrice = 2500; break;
      case 'UNCOMMON': basePrice = 25000; break;
      case 'RARE': basePrice = 150000; break;
      case 'EPIC': basePrice = 850000; break;
      case 'LEGENDARY': basePrice = 4500000; break;
      case 'MYTHIC': basePrice = 25000000; break;
      case 'DIVINE': basePrice = 50000000; break;
      case 'SPECIAL': basePrice = 1000000; break;
      case 'VERY_SPECIAL': basePrice = 10000000; break;
      default: basePrice = 1000;
    }
  }

  let totalValue = basePrice * (item.count || 1);

  // Recombobulator value
  if (item.recombobulated) {
    totalValue += (priceCache?.['RECOMBOBULATOR_3000'] || 9500000) * 0.8;
  }

  // Hot potato books
  if (item.hotPotatoCount) {
    totalValue += item.hotPotatoCount * 100000;
  }

  // Stars
  if (item.stars) {
    totalValue += Math.pow(item.stars, 2) * 50000;
  }

  return Math.round(totalValue);
}

export function estimatePetValue(pet: PetData): number {
  let base = 50000;
  switch (pet.rarity) {
    case 'COMMON': base = 25000; break;
    case 'UNCOMMON': base = 75000; break;
    case 'RARE': base = 350000; break;
    case 'EPIC': base = 1500000; break;
    case 'LEGENDARY': base = 12000000; break;
    case 'MYTHIC': base = 45000000; break;
  }

  // Level factor
  const levelMultiplier = 1 + (pet.level / 100) * 0.8;
  return Math.round(base * levelMultiplier);
}

export function calculateNetworth(params: {
  purse: number;
  bank: number;
  armor: (DecodedItem | null)[];
  equipment: (DecodedItem | null)[];
  inventory: DecodedItem[];
  enderChest: DecodedItem[];
  accessories: DecodedItem[];
  pets: PetData[];
  vault?: DecodedItem[];
  storage?: DecodedItem[];
  priceCache?: Record<string, number>;
  verifiedBreakdown?: NetworthBreakdownItem[];
}): {
  total: number;
  liquid: number;
  breakdown: NetworthBreakdownItem[];
  mostValuableItems: DecodedItem[];
} {
  const { purse, bank, armor, equipment, inventory, enderChest, accessories, pets, vault = [], storage = [], priceCache, verifiedBreakdown } = params;

  const liquid = Math.round((purse || 0) + (bank || 0));

  // If we already have a verified snapshot breakdown from an official import / PDF and no live item inventory is present:
  if (verifiedBreakdown && verifiedBreakdown.length > 0 && inventory.length === 0 && enderChest.length === 0) {
    const total = verifiedBreakdown.reduce((sum, b) => sum + b.value, 0);
    return {
      total,
      liquid,
      breakdown: verifiedBreakdown,
      mostValuableItems: armor.filter(Boolean) as DecodedItem[],
    };
  }

  // Calculate each container
  const armorItems = (armor.filter(Boolean) as DecodedItem[]).map(item => ({
    ...item,
    price: estimateItemValue(item, priceCache),
  }));

  const equipmentItems = (equipment.filter(Boolean) as DecodedItem[]).map(item => ({
    ...item,
    price: estimateItemValue(item, priceCache),
  }));

  const invItems = inventory.map(item => ({
    ...item,
    price: estimateItemValue(item, priceCache),
  }));

  const ecItems = enderChest.map(item => ({
    ...item,
    price: estimateItemValue(item, priceCache),
  }));

  const accItems = accessories.map(item => ({
    ...item,
    price: estimateItemValue(item, priceCache),
  }));

  const vaultItems = vault.map(item => ({
    ...item,
    price: estimateItemValue(item, priceCache),
  }));

  const storageItems = storage.map(item => ({
    ...item,
    price: estimateItemValue(item, priceCache),
  }));

  const petsVal = pets.reduce((sum, p) => sum + estimatePetValue(p), 0);
  const armorVal = armorItems.reduce((sum, i) => sum + (i.price || 0), 0);
  const equipVal = equipmentItems.reduce((sum, i) => sum + (i.price || 0), 0);
  const invVal = invItems.reduce((sum, i) => sum + (i.price || 0), 0);
  const ecVal = ecItems.reduce((sum, i) => sum + (i.price || 0), 0);
  const accVal = accItems.reduce((sum, i) => sum + (i.price || 0), 0);
  const vaultVal = vaultItems.reduce((sum, i) => sum + (i.price || 0), 0);
  const storageVal = storageItems.reduce((sum, i) => sum + (i.price || 0), 0);

  const total = Math.round(
    liquid + armorVal + equipVal + invVal + ecVal + accVal + petsVal + vaultVal + storageVal
  );

  const rawBreakdown = [
    { category: 'Purse', name: 'Purse', value: Math.round(purse || 0) },
    { category: 'Bank', name: 'Bank', value: Math.round(bank || 0) },
    { category: 'Accessories', name: 'Accessories', value: accVal },
    { category: 'Ender Chest', name: 'Ender Chest', value: ecVal },
    { category: 'Inventory', name: 'Inventory', value: invVal },
    { category: 'Armor', name: 'Armor & Equipment', value: armorVal + equipVal },
    { category: 'Pets', name: 'Pets', value: petsVal },
    { category: 'Personal Vault', name: 'Personal Vault', value: vaultVal },
    { category: 'Storage', name: 'Backpacks & Storage', value: storageVal },
  ].filter(b => b.value > 0);

  const breakdown: NetworthBreakdownItem[] = rawBreakdown.map(b => ({
    category: b.category,
    name: b.name,
    value: b.value,
    percentage: total > 0 ? Math.round((b.value / total) * 1000) / 10 : 0,
  }));

  // Sort all items to find the most valuable
  const allItems = [
    ...armorItems,
    ...equipmentItems,
    ...invItems,
    ...ecItems,
    ...accItems,
    ...vaultItems,
    ...storageItems,
  ].filter(i => (i.price || 0) > 0);

  allItems.sort((a, b) => (b.price || 0) - (a.price || 0));
  const mostValuableItems = allItems.slice(0, 15);

  return {
    total,
    liquid,
    breakdown,
    mostValuableItems,
  };
}
