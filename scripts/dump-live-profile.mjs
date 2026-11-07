import nbt from 'prismarine-nbt';
import zlib from 'zlib';
import fs from 'fs';

function stripColorCodes(text) {
  if (!text) return '';
  return text.replace(/§[0-9a-fk-or]/gi, '');
}

function extractRarityFromLore(lore) {
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

function extractStars(name, extraAttrs) {
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

async function decodeNbt(base64Data) {
  if (!base64Data) return [];
  const rawBuffer = Buffer.from(base64Data, 'base64');
  let decompressed;
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
  const items = [];

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
    const stars = extractStars(rawName, extraAttrs);

    items.push({
      slot: index,
      id: extraAttrs.id || `MC_${rawItem.id}`,
      internalId: extraAttrs.id,
      name: cleanName,
      count: rawItem.Count || 1,
      rarity,
      reforge: extraAttrs.modifier || undefined,
      enchantments: extraAttrs.enchantments || undefined,
      stars: stars > 0 ? stars : undefined,
      gemstones: extraAttrs.gems || undefined,
      recombobulated: extraAttrs.rarity_upgrades === 1,
      lore,
    });
  }
  return items;
}

async function run() {
  const apiKey = 'a93589d2-67f9-407b-9c96-6b4e35be483f';
  const uuid = '22da8f997e2b4edfa8f0ca75f479f289';
  const res = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?uuid=${uuid}`, {
    headers: { 'API-Key': apiKey }
  });
  const data = await res.json();
  const profile = data.profiles.find(p => p.profile_id === '8796e462-28be-47c3-b181-a14d23af337f');
  const member = profile.members[uuid];

  const mainInv = await decodeNbt(member.inventory?.inv_contents?.data);
  const enderChest = await decodeNbt(member.inventory?.ender_chest_contents?.data);
  const armor = await decodeNbt(member.inventory?.inv_armor?.data);
  const talismans = await decodeNbt(member.inventory?.bag_contents?.talisman_bag?.data);

  fs.writeFileSync('scripts/decoded_items.json', JSON.stringify({
    mainInv,
    enderChest,
    armor,
    talismans
  }, null, 2));

  console.log('Decoded items saved to scripts/decoded_items.json!');
  console.log(`Main: ${mainInv.length}, EnderChest: ${enderChest.length}, Armor: ${armor.length}, Talismans: ${talismans.length}`);
}

run().catch(console.error);
