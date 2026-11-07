import nbt from 'prismarine-nbt';
import zlib from 'zlib';
import { DecodedItem, ItemRarity } from './types';

export function stripColorCodes(text: string): string {
  if (!text) return '';
  return text.replace(/§[0-9a-fk-or]/gi, '');
}

export function extractRarityFromLore(lore: string[]): ItemRarity {
  if (!lore || lore.length === 0) return 'COMMON';
  const cleanLore = lore.map(stripColorCodes).reverse();
  
  for (const line of cleanLore) {
    const upper = line.toUpperCase();
    if (upper.includes('VERY SPECIAL')) return 'VERY_SPECIAL';
    if (upper.includes('SPECIAL')) return 'SPECIAL';
    if (upper.includes('DIVINE')) return 'DIVINE';
    if (upper.includes('MYTHIC')) return 'MYTHIC';
    if (upper.includes('LEGENDARY')) return 'LEGENDARY';
    if (upper.includes('EPIC')) return 'EPIC';
    if (upper.includes('RARE')) return 'RARE';
    if (upper.includes('UNCOMMON')) return 'UNCOMMON';
    if (upper.includes('COMMON')) return 'COMMON';
  }
  return 'COMMON';
}

export function extractStars(name: string, lore: string[], extraAttrs: any): number {
  if (typeof extraAttrs?.dungeon_item_level === 'number') {
    return extraAttrs.dungeon_item_level;
  }
  if (typeof extraAttrs?.upgrade_level === 'number') {
    return extraAttrs.upgrade_level;
  }
  const cleanName = stripColorCodes(name);
  const starMatches = cleanName.match(/✪/g);
  return starMatches ? starMatches.length : 0;
}

export async function decodeNbtBuffer(base64Data: string): Promise<DecodedItem[]> {
  if (!base64Data || typeof base64Data !== 'string') {
    return [];
  }

  try {
    const rawBuffer = Buffer.from(base64Data, 'base64');
    let decompressed: Buffer;

    // Check if gzipped (magic bytes 0x1F 0x8B) or raw zlib
    if (rawBuffer[0] === 0x1f && rawBuffer[1] === 0x8b) {
      decompressed = zlib.gunzipSync(rawBuffer);
    } else {
      try {
        decompressed = zlib.inflateSync(rawBuffer);
      } catch {
        decompressed = rawBuffer;
      }
    }

    const parsedNbt = await nbt.parse(decompressed);
    const simplified = nbt.simplify(parsedNbt.parsed);
    const itemList = simplified?.i || [];

    const items: DecodedItem[] = [];

    for (let index = 0; index < itemList.length; index++) {
      const rawItem = itemList[index];
      if (!rawItem || rawItem.id === -1 || !rawItem.tag) {
        continue;
      }

      const tag = rawItem.tag;
      const display = tag.display || {};
      const extraAttrs = tag.ExtraAttributes || {};

      const rawName = display.Name || rawItem.name || 'Unknown Item';
      const cleanName = stripColorCodes(rawName);
      const lore = Array.isArray(display.Lore) ? display.Lore : [];
      const rarity = extractRarityFromLore(lore);
      const stars = extractStars(rawName, lore, extraAttrs);
      const recombobulated = extraAttrs.rarity_upgrades === 1;
      const reforge = extraAttrs.modifier;
      const enchantments = extraAttrs.enchantments || undefined;
      const gems = extraAttrs.gems || undefined;
      const attributes = extraAttrs.attributes || undefined;
      const hotPotatoCount = extraAttrs.hot_potato_count || 0;

      items.push({
        slot: index,
        id: extraAttrs.id || `MC_${rawItem.id}`,
        internalId: extraAttrs.id,
        name: cleanName,
        count: rawItem.Count || 1,
        rarity,
        reforge,
        enchantments,
        stars: stars > 0 ? stars : undefined,
        gemstones: gems,
        attributes,
        hotPotatoCount: hotPotatoCount > 0 ? hotPotatoCount : undefined,
        recombobulated,
        lore,
      });
    }

    return items;
  } catch (error) {
    console.error('Error decoding NBT data:', error);
    return [];
  }
}
