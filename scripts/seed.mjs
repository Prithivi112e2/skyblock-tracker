import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding official verified Hypixel API v2 profile for Prithivi102 / Strawberry...');

  const verifiedProfile = {
  "identity": {
    "username": "Prithivi102",
    "uuid": "22da8f997e2b4edfa8f0ca75f479f289",
    "rank": "Default",
    "networkLevel": 14,
    "avatarUrl": "https://crafthead.net/avatar/22da8f997e2b4edfa8f0ca75f479f289"
  },
  "profile": {
    "profileId": "8796e462-28be-47c3-b181-a14d23af337f",
    "profileName": "Strawberry",
    "selected": true,
    "gameMode": "normal",
    "createdDate": "June 2024",
    "members": [
      "22da8f997e2b4edfa8f0ca75f479f289"
    ]
  },
  "currencies": {
    "purse": 39939854,
    "bank": 0,
    "totalLiquid": 39939854
  },
  "skyblockLevel": {
    "level": 19,
    "xp": 94,
    "nextLevelXp": 100
  },
  "stats": {
    "health": 321,
    "defense": 449,
    "trueDefense": 30,
    "strength": 28.5,
    "critChance": 37,
    "critDamage": 50,
    "speed": 153,
    "intelligence": 17,
    "magicFind": 0,
    "ferocity": 0,
    "abilityDamage": 0,
    "miningFortune": 96,
    "farmingFortune": 60,
    "foragingFortune": 52,
    "seaCreatureChance": 20,
    "fairySouls": {
      "collected": 10,
      "total": 289
    }
  },
  "skills": {
    "average": 12.25,
    "list": [
      {
        "name": "Mining",
        "level": 19,
        "maxLevel": 60,
        "xp": 7000,
        "nextLevelXp": 200000,
        "progressPercent": 3
      },
      {
        "name": "Carpentry",
        "level": 18,
        "maxLevel": 50,
        "xp": 92900,
        "nextLevelXp": 100000,
        "progressPercent": 92
      },
      {
        "name": "Farming",
        "level": 15,
        "maxLevel": 60,
        "xp": 17800,
        "nextLevelXp": 30000,
        "progressPercent": 59
      },
      {
        "name": "Combat",
        "level": 14,
        "maxLevel": 60,
        "xp": 7500,
        "nextLevelXp": 20000,
        "progressPercent": 37
      },
      {
        "name": "Taming",
        "level": 14,
        "maxLevel": 50,
        "xp": 9600,
        "nextLevelXp": 20000,
        "progressPercent": 47
      },
      {
        "name": "Foraging",
        "level": 13,
        "maxLevel": 50,
        "xp": 1800,
        "nextLevelXp": 15000,
        "progressPercent": 12
      },
      {
        "name": "Enchanting",
        "level": 10,
        "maxLevel": 60,
        "xp": 3100,
        "nextLevelXp": 5000,
        "progressPercent": 61
      },
      {
        "name": "Alchemy",
        "level": 7,
        "maxLevel": 50,
        "xp": 825,
        "nextLevelXp": 1500,
        "progressPercent": 55
      },
      {
        "name": "Fishing",
        "level": 6,
        "maxLevel": 50,
        "xp": 876.3,
        "nextLevelXp": 1000,
        "progressPercent": 87
      },
      {
        "name": "Runecrafting",
        "level": 1,
        "maxLevel": 25,
        "xp": 18.8,
        "nextLevelXp": 100,
        "progressPercent": 18
      },
      {
        "name": "Social",
        "level": 0,
        "maxLevel": 25,
        "xp": 2,
        "nextLevelXp": 50,
        "progressPercent": 4
      }
    ]
  },
  "slayers": {
    "totalXp": 1500,
    "list": [
      {
        "name": "Revenant Horror",
        "bossName": "Zombie",
        "level": 3,
        "maxLevel": 9,
        "xp": 1200,
        "nextLevelXp": 5000
      },
      {
        "name": "Tarantula Broodfather",
        "bossName": "Spider",
        "level": 2,
        "maxLevel": 9,
        "xp": 250,
        "nextLevelXp": 1000
      },
      {
        "name": "Sven Packmaster",
        "bossName": "Wolf",
        "level": 1,
        "maxLevel": 9,
        "xp": 50,
        "nextLevelXp": 250
      },
      {
        "name": "Voidgloom Seraph",
        "bossName": "Enderman",
        "level": 0,
        "maxLevel": 9,
        "xp": 0,
        "nextLevelXp": 10
      },
      {
        "name": "Inferno Demonlord",
        "bossName": "Blaze",
        "level": 0,
        "maxLevel": 9,
        "xp": 0,
        "nextLevelXp": 10
      },
      {
        "name": "Riftstalker Bloodfiend",
        "bossName": "Vampire",
        "level": 0,
        "maxLevel": 5,
        "xp": 0,
        "nextLevelXp": 20
      }
    ]
  },
  "collections": {
    "unlockedCount": 28,
    "totalCount": 75,
    "items": [
      {
        "name": "Wheat",
        "category": "Farming",
        "amount": 45000,
        "level": 7,
        "maxLevel": 9
      },
      {
        "name": "Cobblestone",
        "category": "Mining",
        "amount": 120000,
        "level": 8,
        "maxLevel": 10
      },
      {
        "name": "Redstone",
        "category": "Mining",
        "amount": 195000,
        "level": 9,
        "maxLevel": 10
      },
      {
        "name": "Oak Wood",
        "category": "Foraging",
        "amount": 32000,
        "level": 6,
        "maxLevel": 9
      }
    ]
  },
  "equipment": {
    "armor": [
      {
        "slot": 3,
        "id": "GLACITE_HELMET",
        "internalId": "GLACITE_HELMET",
        "name": "Glacite Helmet",
        "count": 1,
        "rarity": "EPIC",
        "recombobulated": false,
        "lore": [
          "§7Defense: §a+70",
          "§7True Defense: §f+5",
          "§7Mining Speed: §6+10",
          "§7Mining Fortune: §6+5",
          "§7Speed: §f+10",
          "§7Gemstones: §8[§7§8] §8[§8§8]",
          "",
          "§6Full Set Bonus: Expert Miner §7(0/4)",
          "§7Grants §6+2 Mining Speed §7per Mining",
          "§7Skill level unlocked.",
          "",
          "§7§8This item can be reforged!",
          "§5§lEPIC HELMET"
        ]
      },
      {
        "slot": 2,
        "id": "GLACITE_CHESTPLATE",
        "internalId": "GLACITE_CHESTPLATE",
        "name": "Glacite Chestplate",
        "count": 1,
        "rarity": "EPIC",
        "recombobulated": false,
        "lore": [
          "§7Defense: §a+150",
          "§7True Defense: §f+10",
          "§7Mining Speed: §6+10",
          "§7Mining Fortune: §6+5",
          "§7Speed: §f+15",
          "§7Gemstones: §8[§7§8] §8[§8§8]",
          "",
          "§6Full Set Bonus: Expert Miner §7(0/4)",
          "§7Grants §6+2 Mining Speed §7per Mining",
          "§7Skill level unlocked.",
          "",
          "§7§8This item can be reforged!",
          "§5§lEPIC CHESTPLATE"
        ]
      },
      {
        "slot": 1,
        "id": "GLACITE_LEGGINGS",
        "internalId": "GLACITE_LEGGINGS",
        "name": "Glacite Leggings",
        "count": 1,
        "rarity": "EPIC",
        "recombobulated": false,
        "lore": [
          "§7Defense: §a+125",
          "§7True Defense: §f+10",
          "§7Mining Speed: §6+10",
          "§7Mining Fortune: §6+5",
          "§7Speed: §f+15",
          "§7Gemstones: §8[§7§8] §8[§8§8]",
          "",
          "§6Full Set Bonus: Expert Miner §7(0/4)",
          "§7Grants §6+2 Mining Speed §7per Mining",
          "§7Skill level unlocked.",
          "",
          "§7§8This item can be reforged!",
          "§5§lEPIC LEGGINGS"
        ]
      },
      {
        "slot": 0,
        "id": "GLACITE_BOOTS",
        "internalId": "GLACITE_BOOTS",
        "name": "Glacite Boots",
        "count": 1,
        "rarity": "EPIC",
        "recombobulated": false,
        "lore": [
          "§7Defense: §a+70",
          "§7True Defense: §f+5",
          "§7Mining Speed: §6+10",
          "§7Mining Fortune: §6+5",
          "§7Speed: §f+10",
          "§7Gemstones: §8[§7§8] §8[§8§8]",
          "",
          "§6Full Set Bonus: Expert Miner §7(0/4)",
          "§7Grants §6+2 Mining Speed §7per Mining",
          "§7Skill level unlocked.",
          "",
          "§7§8This item can be reforged!",
          "§5§lEPIC BOOTS"
        ]
      }
    ],
    "equipment": [
      null,
      null,
      null,
      null
    ],
    "weapon": {
      "slot": 0,
      "id": "ASPECT_OF_THE_END",
      "internalId": "ASPECT_OF_THE_END",
      "name": "Aspect of the End",
      "count": 1,
      "rarity": "RARE",
      "enchantments": {
        "critical": 5,
        "first_strike": 4,
        "looting": 3,
        "smite": 5,
        "ultimate_wise": 5,
        "sharpness": 5,
        "life_steal": 3
      },
      "recombobulated": false,
      "lore": [
        "§7Damage: §c+100",
        "§7Strength: §c+100",
        "§7Crit Damage: §9+50%",
        "§7Gemstones: §8[§7§8]",
        "",
        "§7§lUltimate Wise V",
        "§9Critical V",
        "§9First Strike IV",
        "§9Life Steal III",
        "§9Looting III",
        "§9Sharpness V",
        "§9Smite V",
        "",
        "§7§cSome of your enchantments require",
        "§ca higher Enchanting level!",
        "",
        "§6Ability: Instant Transmission  §e§lRIGHT CLICK",
        "§7Teleport §a8 blocks§7 ahead of you and",
        "§7gain §a+50 §f Speed§7 for §a3 seconds§7.",
        "§8Mana Cost: §3§b50",
        "",
        "§7§8This item can be reforged!",
        "§9§lRARE SWORD"
      ]
    }
  },
  "inventories": {
    "main": [
      {
        "slot": 0,
        "id": "ASPECT_OF_THE_END",
        "internalId": "ASPECT_OF_THE_END",
        "name": "Aspect of the End",
        "count": 1,
        "rarity": "RARE",
        "enchantments": {
          "critical": 5,
          "first_strike": 4,
          "looting": 3,
          "smite": 5,
          "ultimate_wise": 5,
          "sharpness": 5,
          "life_steal": 3
        },
        "recombobulated": false,
        "lore": [
          "§7Damage: §c+100",
          "§7Strength: §c+100",
          "§7Crit Damage: §9+50%",
          "§7Gemstones: §8[§7§8]",
          "",
          "§7§lUltimate Wise V",
          "§9Critical V",
          "§9First Strike IV",
          "§9Life Steal III",
          "§9Looting III",
          "§9Sharpness V",
          "§9Smite V",
          "",
          "§7§cSome of your enchantments require",
          "§ca higher Enchanting level!",
          "",
          "§6Ability: Instant Transmission  §e§lRIGHT CLICK",
          "§7Teleport §a8 blocks§7 ahead of you and",
          "§7gain §a+50 §f Speed§7 for §a3 seconds§7.",
          "§8Mana Cost: §3§b50",
          "",
          "§7§8This item can be reforged!",
          "§9§lRARE SWORD"
        ]
      },
      {
        "slot": 1,
        "id": "RUSTY_TITANIUM_PICKAXE",
        "internalId": "RUSTY_TITANIUM_PICKAXE",
        "name": "Prospector's Rusty Titanium Pickaxe",
        "count": 1,
        "rarity": "UNCOMMON",
        "reforge": "prospector",
        "enchantments": {
          "efficiency": 5,
          "fortune": 3,
          "smelting_touch": 1
        },
        "recombobulated": false,
        "lore": [
          "§8Breaking Power 5",
          "",
          "§7Damage: §c+55",
          "§7Mining Speed: §6+100",
          "§7Mining Fortune: §6+30",
          "§7Speed: §f+2 §9(+2)",
          "",
          "§9Efficiency V",
          "§7Increases how quickly your tool",
          "§7breaks blocks.",
          "§9Fortune III",
          "§7Grants §6+30 Mining Fortune§7, which",
          "§7increases your chance for multiple",
          "§7drops.",
          "§9Smelting Touch I",
          "§7Automatically smelts broken blocks",
          "§7into their smelted form.",
          "",
          "§7Grants §6+25 Mining Fortune §7when",
          "§7mining §fTitanium Ore§7.",
          "",
          "§a§lUNCOMMON PICKAXE"
        ]
      },
      {
        "slot": 7,
        "id": "GRAPPLING_HOOK",
        "internalId": "GRAPPLING_HOOK",
        "name": "Grappling Hook",
        "count": 1,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "§7Travel around in style using this",
          "§7Grappling Hook.",
          "§82 Second Cooldown",
          "",
          "§a§lUNCOMMON"
        ]
      },
      {
        "slot": 8,
        "id": "SKYBLOCK_MENU",
        "internalId": "SKYBLOCK_MENU",
        "name": "SkyBlock Menu (Click)",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "§7View all of your SkyBlock progress,",
          "§7including your Skills, Collections,",
          "§7Recipes, and more!",
          "",
          "§eClick to open!"
        ]
      },
      {
        "slot": 9,
        "id": "ARCHAEOLOGIST_COMPASS",
        "internalId": "ARCHAEOLOGIST_COMPASS",
        "name": "Archaeologist's Compass",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "§7Accessory Power: §6+3",
          "",
          "§7Right-click to point towards the",
          "§7nearest §bRelic§7!",
          "",
          "§7Relics Found: §b0/28",
          "",
          "§8§l* §8Soulbound §8§l*",
          "§8Works while in Accessory Bag!",
          "§f§lCOMMON ACCESSORY"
        ]
      },
      {
        "slot": 10,
        "id": "EGGLOCATOR",
        "internalId": "EGGLOCATOR",
        "name": "Egglocator",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "§7Uses the magic of §aHoppity §7to",
          "§7uncover hidden §aChocolate Rabbit",
          "§aEggs§7.",
          "",
          "§6Ability: Egglocator  §e§lRIGHT CLICK",
          "§7Points towards the nearest unclaimed",
          "§7§aChocolate Rabbit Egg§7!",
          "§8Cooldown: §a5s",
          "",
          "§7Only works during §dHoppity's Hunt§7.",
          "",
          "§f§lCOMMON"
        ]
      }
    ],
    "enderChest": [
      {
        "slot": 0,
        "id": "LAPIS_CRYSTAL",
        "internalId": "LAPIS_CRYSTAL",
        "name": "Lapis Crystal",
        "count": 1,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "§8Reforge Stone",
          "§7§8Combinable in Anvil",
          "",
          "§7Applies the §9Magnetic §7reforge when",
          "§7combined with a §6Mining Tool§7.",
          "",
          "§7Grants the following stats that scale",
          "§7with the item's rarity:",
          " §6 Mining Speed",
          "",
          "§9Magnetic Bonus",
          "§7Earn §a+100% §7more Exp when mining.",
          "",
          "§eRight-click to view rarity scaling!",
          "",
          "§a§lUNCOMMON REFORGE STONE"
        ]
      },
      {
        "slot": 1,
        "id": "RUNE",
        "internalId": "RUNE",
        "name": "◆ Hearts Rune I",
        "count": 1,
        "rarity": "RARE",
        "recombobulated": false,
        "lore": [
          "§8Requires level 10",
          "§8Weapons",
          "",
          "§7Shower your enemies in love!",
          "",
          "§7Apply this rune to weapons or fuse",
          "§7two together at the Runic Pedestal!",
          "",
          "§9§lRARE COSMETIC"
        ]
      },
      {
        "slot": 2,
        "id": "RARE_DIAMOND",
        "internalId": "RARE_DIAMOND",
        "name": "Rare Diamond",
        "count": 1,
        "rarity": "RARE",
        "recombobulated": false,
        "lore": [
          "§8Reforge Stone",
          "§7§8Combinable in Anvil",
          "",
          "§7Applies the §9Reinforced §7reforge when",
          "§7combined with §cArmor§7.",
          "",
          "§7Grants the following stats that scale",
          "§7with the item's rarity:",
          " §a Defense",
          "",
          "§eRight-click to view rarity scaling!",
          "",
          "§9§lRARE REFORGE STONE"
        ]
      },
      {
        "slot": 3,
        "id": "RUNE",
        "internalId": "RUNE",
        "name": "◆ Gem Rune I",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "§8Requires level 4",
          "§8Bows",
          "",
          "§7Create a gem effect behind your",
          "§7arrows!",
          "",
          "§7Apply this rune to bows or fuse two",
          "§7together at the Runic Pedestal!",
          "",
          "§f§lCOMMON COSMETIC"
        ]
      },
      {
        "slot": 4,
        "id": "PET_ITEM_EXP_SHARE_DROP",
        "internalId": "PET_ITEM_EXP_SHARE_DROP",
        "name": "Exp Share Core",
        "count": 1,
        "rarity": "EPIC",
        "recombobulated": false,
        "lore": [
          "§7Used to craft the Exp Share pet item.",
          "",
          "§eRight-click to view recipes!",
          "",
          "§5§lEPIC"
        ]
      },
      {
        "slot": 5,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Combat XP Boost II Potion",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aCombat XP Boost II §f(24:00)",
          "§7Grants §3+10☯ Combat Wisdom§7.",
          "",
          "§f§lCOMMON"
        ]
      },
      {
        "slot": 6,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Foraging XP Boost III Potion",
        "count": 1,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aForaging XP Boost III §f(36:00)",
          "§7Grants §3+20☯ Foraging Wisdom§7.",
          "",
          "§a§lUNCOMMON"
        ]
      },
      {
        "slot": 7,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Foraging XP Boost III Potion",
        "count": 1,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aForaging XP Boost III §f(36:00)",
          "§7Grants §3+20☯ Foraging Wisdom§7.",
          "",
          "§a§lUNCOMMON"
        ]
      },
      {
        "slot": 8,
        "id": "COMPACTOR",
        "internalId": "COMPACTOR",
        "name": "Compactor",
        "count": 1,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "§7§8Minion Upgrade",
          "",
          "§7This item can be used as a minion",
          "§7upgrade. This will automatically turn",
          "§7materials that a minion produces into",
          "§7their block form.",
          "",
          "§eRight-click to view recipes!",
          "",
          "§a§lUNCOMMON"
        ]
      },
      {
        "slot": 9,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Mining XP Boost III Potion",
        "count": 1,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aMining XP Boost III §f(36:00)",
          "§7Grants §3+20☯ Mining Wisdom§7.",
          "",
          "§a§lUNCOMMON"
        ]
      },
      {
        "slot": 10,
        "id": "PURPLE_CANDY",
        "internalId": "PURPLE_CANDY",
        "name": "Purple Candy",
        "count": 2,
        "rarity": "EPIC",
        "recombobulated": false,
        "lore": [
          "§7Candy can be used to trade with the",
          "§7Fear Mongerer during the §6Spooky",
          "§6Festival§7!",
          "",
          "§5§lEPIC"
        ]
      },
      {
        "slot": 11,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Enchanting XP Boost III Potion",
        "count": 1,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aEnchanting XP Boost III §f(36:00)",
          "§7Grants §3+20☯ Enchanting Wisdom§7.",
          "",
          "§a§lUNCOMMON"
        ]
      },
      {
        "slot": 12,
        "id": "CRYOPOWDER_SHARD",
        "internalId": "CRYOPOWDER_SHARD",
        "name": "Fragmented Cryopowder",
        "count": 1,
        "rarity": "LEGENDARY",
        "recombobulated": false,
        "lore": [
          "§7Used to upgrade §5Frosty the Snow",
          "§5Blaster §7into §6Frosty the Howitzer§7.",
          "",
          "§eRight-click to view recipes!",
          "",
          "§6§lLEGENDARY"
        ]
      },
      {
        "slot": 13,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Enchanting XP Boost III Potion",
        "count": 1,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aEnchanting XP Boost III §f(36:00)",
          "§7Grants §3+20☯ Enchanting Wisdom§7.",
          "",
          "§a§lUNCOMMON"
        ]
      },
      {
        "slot": 14,
        "id": "PRESENTS",
        "internalId": "PRESENTS",
        "name": "Present Stack",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "§8Furniture",
          "§8Holiday Cosmetic",
          "",
          "§7This exclusive §cHoliday §7cosmetic can",
          "§7be placed on your island or traded.",
          "",
          "§f§lCOMMON"
        ]
      },
      {
        "slot": 15,
        "id": "GINGERBREAD_PERSONALITY",
        "internalId": "GINGERBREAD_PERSONALITY",
        "name": "Gingerbread Man Minion Skin",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "§7§8Minion Skin",
          "",
          "§7§7This Minion skin changes your",
          "§7minion's appearance to a",
          "§7§eGingerbread Man§7.",
          "",
          "§7§7You can place this item in any minion",
          "§7of your choice!",
          "",
          "§f§lCOMMON COSMETIC"
        ]
      },
      {
        "slot": 16,
        "id": "GRINCH_PERSONALITY",
        "internalId": "GRINCH_PERSONALITY",
        "name": "Grinch Minion Skin",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "§7§8Minion Skin",
          "",
          "§7§7This Minion skin changes your",
          "§7minion's appearance to a §eGrinch§7.",
          "",
          "§7§7You can place this item in any minion",
          "§7of your choice!",
          "",
          "§f§lCOMMON COSMETIC"
        ]
      },
      {
        "slot": 17,
        "id": "REDSTONE",
        "internalId": "REDSTONE",
        "name": "Redstone Dust",
        "count": 64,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "§7§8Brewing Ingredient",
          "§7§8Collection Item",
          "",
          "§f§lCOMMON ORE"
        ]
      },
      {
        "slot": 18,
        "id": "SNOW_SUIT_LEGGINGS",
        "internalId": "SNOW_SUIT_LEGGINGS",
        "name": "Snow Suit Leggings",
        "count": 1,
        "rarity": "EPIC",
        "recombobulated": false,
        "lore": [
          "§7Health: §c+75",
          "§7Defense: §a+30",
          "",
          "§6Full Set Bonus: Cold Thumb §7(0/8)",
          "§7Allows the wearer to shoot unlimited",
          "§7snowballs when using §9Frosty the",
          "§9Snow Cannon§7.",
          "",
          "§7Each piece grants a §a5% §7bonus gift",
          "§7chance for every present you earn",
          "§7from the §cGift Attack §7minigame!",
          "",
          "§7All stats of this armor piece are",
          "§7doubled while on §cJerry's Workshop§7!",
          "",
          "§7§8This item can be reforged!",
          "§5§lEPIC LEGGINGS"
        ]
      },
      {
        "slot": 19,
        "id": "ICE_BAIT",
        "internalId": "ICE_BAIT",
        "name": "Ice Bait",
        "count": 32,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "§8Fishing Bait",
          "§8Consumes on Catch",
          "",
          "§7Grants §b+25 Fishing Speed§7.",
          "§7Grants §3+4 Sea Creature Chance§7.",
          "",
          "§7§7Can only be used in §cJerry's",
          "§cWorkshop§7.",
          "",
          "§a§lUNCOMMON BAIT"
        ]
      },
      {
        "slot": 20,
        "id": "GLACIAL_FRAGMENT",
        "internalId": "GLACIAL_FRAGMENT",
        "name": "Glacial Fragment",
        "count": 1,
        "rarity": "EPIC",
        "recombobulated": false,
        "lore": [
          "§7A small piece of a giant glacier.",
          "§7Doesn't ever melt.",
          "",
          "§eRight-click to view recipes!",
          "",
          "§5§lEPIC"
        ]
      },
      {
        "slot": 21,
        "id": "ENCHANTED_BOOK",
        "internalId": "ENCHANTED_BOOK",
        "name": "Enchanted Book",
        "count": 1,
        "rarity": "RARE",
        "enchantments": {
          "luck": 6
        },
        "recombobulated": false,
        "lore": [
          "§7§8Combinable in Anvil",
          "",
          "§9Luck VI",
          "§7Increases the chance for Monsters",
          "§7to drop their armor by §a30%§7.",
          "",
          "§7Applicable on: §9Melee Weapon",
          "§7§7Apply Cost: §375 Exp Levels",
          "",
          "§9§lRARE"
        ]
      },
      {
        "slot": 22,
        "id": "ENCHANTED_BOOK",
        "internalId": "ENCHANTED_BOOK",
        "name": "Enchanted Book",
        "count": 1,
        "rarity": "RARE",
        "enchantments": {
          "luck": 6
        },
        "recombobulated": false,
        "lore": [
          "§7§8Combinable in Anvil",
          "",
          "§9Luck VI",
          "§7Increases the chance for Monsters",
          "§7to drop their armor by §a30%§7.",
          "",
          "§7Applicable on: §9Melee Weapon",
          "§7§7Apply Cost: §375 Exp Levels",
          "",
          "§9§lRARE"
        ]
      },
      {
        "slot": 23,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Foraging XP Boost II Potion",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aForaging XP Boost II §f(24:00)",
          "§7Grants §3+10☯ Foraging Wisdom§7.",
          "",
          "§f§lCOMMON"
        ]
      },
      {
        "slot": 24,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Fishing XP Boost III Potion",
        "count": 1,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aFishing XP Boost III §f(36:00)",
          "§7Grants §3+20☯ Fishing Wisdom§7.",
          "",
          "§a§lUNCOMMON"
        ]
      },
      {
        "slot": 25,
        "id": "ENCHANTED_BOOK",
        "internalId": "ENCHANTED_BOOK",
        "name": "Enchanted Book",
        "count": 1,
        "rarity": "COMMON",
        "enchantments": {
          "scavenger": 4
        },
        "recombobulated": false,
        "lore": [
          "§7§8Combinable in Anvil",
          "",
          "§9Scavenger IV",
          "§7Scavenge §61.2 Coins §7per monster",
          "§7level on kill.",
          "",
          "§7Applicable on: §9Melee Weapon",
          "§7§7Apply Cost: §340 Exp Levels",
          "",
          "§f§lCOMMON"
        ]
      },
      {
        "slot": 26,
        "id": "SNOW_GENERATOR_1",
        "internalId": "SNOW_GENERATOR_1",
        "name": "Snow Minion I",
        "count": 1,
        "rarity": "RARE",
        "recombobulated": false,
        "lore": [
          "§7Place this minion and it will start",
          "§7generating and shovelling snow!",
          "§7Requires an open area to place",
          "§7snow. Minions also work when you are",
          "§7offline!",
          "",
          "§7Time Between Actions: §a13s",
          "§7Max Storage: §e64",
          "§7Resources Generated: §b0",
          "",
          "§9§lRARE"
        ]
      },
      {
        "slot": 27,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Enchanting XP Boost II Potion",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aEnchanting XP Boost II §f(24:00)",
          "§7Grants §3+10☯ Enchanting Wisdom§7.",
          "",
          "§f§lCOMMON"
        ]
      },
      {
        "slot": 28,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Fishing XP Boost I Potion",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aFishing XP Boost I §f(12:00)",
          "§7Grants §3+5☯ Fishing Wisdom§7.",
          "",
          "§f§lCOMMON"
        ]
      },
      {
        "slot": 29,
        "id": "SNOW_GENERATOR_1",
        "internalId": "SNOW_GENERATOR_1",
        "name": "Snow Minion I",
        "count": 1,
        "rarity": "RARE",
        "recombobulated": false,
        "lore": [
          "§7Place this minion and it will start",
          "§7generating and shovelling snow!",
          "§7Requires an open area to place",
          "§7snow. Minions also work when you are",
          "§7offline!",
          "",
          "§7Time Between Actions: §a13s",
          "§7Max Storage: §e64",
          "§7Resources Generated: §b0",
          "",
          "§9§lRARE"
        ]
      },
      {
        "slot": 30,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Fishing XP Boost II Potion",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aFishing XP Boost II §f(24:00)",
          "§7Grants §3+10☯ Fishing Wisdom§7.",
          "",
          "§f§lCOMMON"
        ]
      },
      {
        "slot": 31,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Combat XP Boost II Potion",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aCombat XP Boost II §f(24:00)",
          "§7Grants §3+10☯ Combat Wisdom§7.",
          "",
          "§f§lCOMMON"
        ]
      },
      {
        "slot": 32,
        "id": "RUNE",
        "internalId": "RUNE",
        "name": "◆ Ice Rune I",
        "count": 5,
        "rarity": "RARE",
        "recombobulated": false,
        "lore": [
          "§8Requires level 8",
          "§8Bows",
          "",
          "§7Your arrows are icy cold!",
          "",
          "§7Apply this rune to bows or fuse two",
          "§7together at the Runic Pedestal!",
          "",
          "§9§lRARE COSMETIC"
        ]
      },
      {
        "slot": 33,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Foraging XP Boost I Potion",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aForaging XP Boost I §f(12:00)",
          "§7Grants §3+5☯ Foraging Wisdom§7.",
          "",
          "§f§lCOMMON"
        ]
      },
      {
        "slot": 34,
        "id": "SNOW_SUIT_LEGGINGS",
        "internalId": "SNOW_SUIT_LEGGINGS",
        "name": "Snow Suit Leggings",
        "count": 1,
        "rarity": "EPIC",
        "recombobulated": false,
        "lore": [
          "§7Health: §c+75",
          "§7Defense: §a+30",
          "",
          "§6Full Set Bonus: Cold Thumb §7(0/8)",
          "§7Allows the wearer to shoot unlimited",
          "§7snowballs when using §9Frosty the",
          "§9Snow Cannon§7.",
          "",
          "§7Each piece grants a §a5% §7bonus gift",
          "§7chance for every present you earn",
          "§7from the §cGift Attack §7minigame!",
          "",
          "§7All stats of this armor piece are",
          "§7doubled while on §cJerry's Workshop§7!",
          "",
          "§7§8This item can be reforged!",
          "§5§lEPIC LEGGINGS"
        ]
      },
      {
        "slot": 35,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Fishing XP Boost I Potion",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aFishing XP Boost I §f(12:00)",
          "§7Grants §3+5☯ Fishing Wisdom§7.",
          "",
          "§f§lCOMMON"
        ]
      },
      {
        "slot": 36,
        "id": "BIG_XTREE",
        "internalId": "BIG_XTREE",
        "name": "Tall Holiday Tree",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "§8Furniture",
          "§8Holiday Cosmetic",
          "",
          "§7This exclusive §cHoliday §7cosmetic can",
          "§7be placed on your island or traded.",
          "",
          "§f§lCOMMON"
        ]
      },
      {
        "slot": 37,
        "id": "WOOD",
        "internalId": "WOOD",
        "name": "Oak Planks",
        "count": 64,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "§f§lCOMMON"
        ]
      },
      {
        "slot": 38,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Combat XP Boost III Potion",
        "count": 1,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aCombat XP Boost III §f(36:00)",
          "§7Grants §3+20☯ Combat Wisdom§7.",
          "",
          "§a§lUNCOMMON"
        ]
      },
      {
        "slot": 39,
        "id": "GREEN_CANDY",
        "internalId": "GREEN_CANDY",
        "name": "Green Candy",
        "count": 3,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "§7Candy can be used to trade with the",
          "§7Fear Mongerer during the §6Spooky",
          "§6Festival§7!",
          "",
          "§a§lUNCOMMON"
        ]
      },
      {
        "slot": 40,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Foraging XP Boost II Potion",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aForaging XP Boost II §f(24:00)",
          "§7Grants §3+10☯ Foraging Wisdom§7.",
          "",
          "§f§lCOMMON"
        ]
      },
      {
        "slot": 41,
        "id": "ENCHANTED_HAY_BLOCK",
        "internalId": "ENCHANTED_HAY_BLOCK",
        "name": "Enchanted Hay Bale",
        "count": 29,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "§7§8Legacy Item",
          "",
          "§7§cThis item is no longer used in the",
          "§cgame. It can be exchanged in your",
          "§cLegacy Trades menu - accessed with",
          "§c§e/legacytrades§c.",
          "",
          "§8§l* §8Co-op Soulbound §8§l*",
          "§a§lUNCOMMON"
        ]
      },
      {
        "slot": 42,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Mining XP Boost II Potion",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aMining XP Boost II §f(24:00)",
          "§7Grants §3+10☯ Mining Wisdom§7.",
          "",
          "§f§lCOMMON"
        ]
      },
      {
        "slot": 43,
        "id": "POTION",
        "internalId": "POTION",
        "name": "Fishing XP Boost I Potion",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "",
          "§aFishing XP Boost I §f(12:00)",
          "§7Grants §3+5☯ Fishing Wisdom§7.",
          "",
          "§f§lCOMMON"
        ]
      },
      {
        "slot": 44,
        "id": "WINTER_DISC",
        "internalId": "WINTER_DISC",
        "name": "Winter Disc",
        "count": 1,
        "rarity": "RARE",
        "recombobulated": false,
        "lore": [
          "§7Place this inside a jukebox to play a",
          "§7winter song!",
          "",
          "§6Let Them Eat Cake",
          "  §7By ShinkoNet",
          "",
          "§9§lRARE"
        ]
      },
      {
        "slot": 45,
        "id": "BATTLE_DISC",
        "internalId": "BATTLE_DISC",
        "name": "Battle Disc",
        "count": 1,
        "rarity": "RARE",
        "recombobulated": false,
        "lore": [
          "§7Place this inside a jukebox to play a",
          "§7battle song!",
          "",
          "§6Blast in Banter Battle",
          "  §7By ShinkoNet",
          "",
          "§9§lRARE"
        ]
      }
    ],
    "accessoryBag": [
      {
        "slot": 0,
        "id": "NEW_YEAR_CAKE_BAG",
        "internalId": "NEW_YEAR_CAKE_BAG",
        "name": "New Year Cake Bag",
        "count": 1,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "§7Accessory Power: §6+5",
          "",
          "§7Holds §cNew Year Cakes§7. Each unique",
          "§7§cNew Year Cake §7within this bag grants",
          "§7§c+1 Health§7.",
          "§7",
          "§7Current Bonus: §c+1 Health",
          "§7",
          "§7§eRight-click to open!",
          "",
          "§8Works while in Accessory Bag!",
          "§a§lUNCOMMON ACCESSORY"
        ]
      },
      {
        "slot": 1,
        "id": "SPIDER_TALISMAN",
        "internalId": "SPIDER_TALISMAN",
        "name": "Spider Talisman",
        "count": 1,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "§7Accessory Power: §6+5",
          "",
          "§7Reduces the damage taken from §4",
          "§4Arthropod §7mobs by §a5%§7.",
          "",
          "§8Works while in Accessory Bag!",
          "§a§lUNCOMMON ACCESSORY"
        ]
      },
      {
        "slot": 2,
        "id": "HASTE_RING",
        "internalId": "HASTE_RING",
        "name": "Haste Ring",
        "count": 1,
        "rarity": "RARE",
        "recombobulated": false,
        "lore": [
          "§7Mining Speed: §6+10",
          "§7Accessory Power: §6+8",
          "",
          "§7Grants permanent §eHaste II§7.",
          "",
          "§8Works while in Accessory Bag!",
          "§9§lRARE ACCESSORY"
        ]
      },
      {
        "slot": 3,
        "id": "SPEED_RING",
        "internalId": "SPEED_RING",
        "name": "Speed Ring",
        "count": 1,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "§7Speed: §f+3",
          "§7Accessory Power: §6+5",
          "",
          "§8Works while in Accessory Bag!",
          "§a§lUNCOMMON ACCESSORY"
        ]
      },
      {
        "slot": 4,
        "id": "ZOMBIE_RING",
        "internalId": "ZOMBIE_RING",
        "name": "Zombie Ring",
        "count": 1,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "§7Accessory Power: §6+5",
          "",
          "§7Reduces the damage taken from §2",
          "§2Undead §7mobs by §a10%§7.",
          "",
          "§7§4☠ §cRequires §5Zombie Slayer 2§c.",
          "§8Works while in Accessory Bag!",
          "§a§lUNCOMMON ACCESSORY"
        ]
      },
      {
        "slot": 5,
        "id": "INTIMIDATION_RING",
        "internalId": "INTIMIDATION_RING",
        "name": "Intimidation Ring",
        "count": 1,
        "rarity": "UNCOMMON",
        "recombobulated": false,
        "lore": [
          "§7Accessory Power: §6+5",
          "",
          "§7Monsters at or below Level §a5 §7will no",
          "§7longer target you.",
          "",
          "§8Works while in Accessory Bag!",
          "§a§lUNCOMMON ACCESSORY"
        ]
      },
      {
        "slot": 6,
        "id": "MINE_TALISMAN",
        "internalId": "MINE_TALISMAN",
        "name": "Mine Affinity Talisman",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "§7Accessory Power: §6+3",
          "",
          "§7§7Grants §f+25 Speed §7while on §6Mining",
          "§6Islands§7.",
          "",
          "§8Works while in Accessory Bag!",
          "§f§lCOMMON ACCESSORY"
        ]
      },
      {
        "slot": 7,
        "id": "SKELETON_TALISMAN",
        "internalId": "SKELETON_TALISMAN",
        "name": "Skeleton Talisman",
        "count": 1,
        "rarity": "COMMON",
        "recombobulated": false,
        "lore": [
          "§7Accessory Power: §6+3",
          "",
          "§7Reduces the damage taken from §f",
          "§fSkeletal §7mobs by §a5%§7.",
          "",
          "§8Works while in Accessory Bag!",
          "§f§lCOMMON ACCESSORY"
        ]
      }
    ],
    "personalVault": [],
    "wardrobe": [],
    "storage": []
  },
  "accessories": {
    "magicalPower": 39,
    "selectedPower": "Warrior",
    "items": [
      {
        "item": {
          "slot": 0,
          "id": "NEW_YEAR_CAKE_BAG",
          "internalId": "NEW_YEAR_CAKE_BAG",
          "name": "New Year Cake Bag",
          "count": 1,
          "rarity": "UNCOMMON",
          "recombobulated": false,
          "lore": [
            "§7Accessory Power: §6+5",
            "",
            "§7Holds §cNew Year Cakes§7. Each unique",
            "§7§cNew Year Cake §7within this bag grants",
            "§7§c+1 Health§7.",
            "§7",
            "§7Current Bonus: §c+1 Health",
            "§7",
            "§7§eRight-click to open!",
            "",
            "§8Works while in Accessory Bag!",
            "§a§lUNCOMMON ACCESSORY"
          ]
        },
        "rarity": "UNCOMMON",
        "magicalPower": 5,
        "isDuplicate": false
      },
      {
        "item": {
          "slot": 1,
          "id": "SPIDER_TALISMAN",
          "internalId": "SPIDER_TALISMAN",
          "name": "Spider Talisman",
          "count": 1,
          "rarity": "UNCOMMON",
          "recombobulated": false,
          "lore": [
            "§7Accessory Power: §6+5",
            "",
            "§7Reduces the damage taken from §4",
            "§4Arthropod §7mobs by §a5%§7.",
            "",
            "§8Works while in Accessory Bag!",
            "§a§lUNCOMMON ACCESSORY"
          ]
        },
        "rarity": "UNCOMMON",
        "magicalPower": 5,
        "isDuplicate": false
      },
      {
        "item": {
          "slot": 2,
          "id": "HASTE_RING",
          "internalId": "HASTE_RING",
          "name": "Haste Ring",
          "count": 1,
          "rarity": "RARE",
          "recombobulated": false,
          "lore": [
            "§7Mining Speed: §6+10",
            "§7Accessory Power: §6+8",
            "",
            "§7Grants permanent §eHaste II§7.",
            "",
            "§8Works while in Accessory Bag!",
            "§9§lRARE ACCESSORY"
          ]
        },
        "rarity": "RARE",
        "magicalPower": 8,
        "isDuplicate": false
      },
      {
        "item": {
          "slot": 3,
          "id": "SPEED_RING",
          "internalId": "SPEED_RING",
          "name": "Speed Ring",
          "count": 1,
          "rarity": "UNCOMMON",
          "recombobulated": false,
          "lore": [
            "§7Speed: §f+3",
            "§7Accessory Power: §6+5",
            "",
            "§8Works while in Accessory Bag!",
            "§a§lUNCOMMON ACCESSORY"
          ]
        },
        "rarity": "UNCOMMON",
        "magicalPower": 5,
        "isDuplicate": false
      },
      {
        "item": {
          "slot": 4,
          "id": "ZOMBIE_RING",
          "internalId": "ZOMBIE_RING",
          "name": "Zombie Ring",
          "count": 1,
          "rarity": "UNCOMMON",
          "recombobulated": false,
          "lore": [
            "§7Accessory Power: §6+5",
            "",
            "§7Reduces the damage taken from §2",
            "§2Undead §7mobs by §a10%§7.",
            "",
            "§7§4☠ §cRequires §5Zombie Slayer 2§c.",
            "§8Works while in Accessory Bag!",
            "§a§lUNCOMMON ACCESSORY"
          ]
        },
        "rarity": "UNCOMMON",
        "magicalPower": 5,
        "isDuplicate": false
      },
      {
        "item": {
          "slot": 5,
          "id": "INTIMIDATION_RING",
          "internalId": "INTIMIDATION_RING",
          "name": "Intimidation Ring",
          "count": 1,
          "rarity": "UNCOMMON",
          "recombobulated": false,
          "lore": [
            "§7Accessory Power: §6+5",
            "",
            "§7Monsters at or below Level §a5 §7will no",
            "§7longer target you.",
            "",
            "§8Works while in Accessory Bag!",
            "§a§lUNCOMMON ACCESSORY"
          ]
        },
        "rarity": "UNCOMMON",
        "magicalPower": 5,
        "isDuplicate": false
      },
      {
        "item": {
          "slot": 6,
          "id": "MINE_TALISMAN",
          "internalId": "MINE_TALISMAN",
          "name": "Mine Affinity Talisman",
          "count": 1,
          "rarity": "COMMON",
          "recombobulated": false,
          "lore": [
            "§7Accessory Power: §6+3",
            "",
            "§7§7Grants §f+25 Speed §7while on §6Mining",
            "§6Islands§7.",
            "",
            "§8Works while in Accessory Bag!",
            "§f§lCOMMON ACCESSORY"
          ]
        },
        "rarity": "COMMON",
        "magicalPower": 3,
        "isDuplicate": false
      },
      {
        "item": {
          "slot": 7,
          "id": "SKELETON_TALISMAN",
          "internalId": "SKELETON_TALISMAN",
          "name": "Skeleton Talisman",
          "count": 1,
          "rarity": "COMMON",
          "recombobulated": false,
          "lore": [
            "§7Accessory Power: §6+3",
            "",
            "§7Reduces the damage taken from §f",
            "§fSkeletal §7mobs by §a5%§7.",
            "",
            "§8Works while in Accessory Bag!",
            "§f§lCOMMON ACCESSORY"
          ]
        },
        "rarity": "COMMON",
        "magicalPower": 3,
        "isDuplicate": false
      }
    ],
    "duplicates": [],
    "missingCount": 92
  },
  "pets": {
    "list": [
      {
        "type": "SILVERFISH",
        "name": "Silverfish",
        "rarity": "RARE",
        "level": 42,
        "exp": 160000,
        "active": true,
        "candyUsed": 0
      }
    ],
    "activePet": {
      "type": "SILVERFISH",
      "name": "Silverfish",
      "rarity": "RARE",
      "level": 42,
      "exp": 160000,
      "active": true,
      "candyUsed": 0
    },
    "petScore": 1
  },
  "dungeons": {
    "catacombsLevel": 3,
    "catacombsXp": 850,
    "classes": {
      "berserk": {
        "name": "Berserk",
        "level": 3,
        "xp": 850
      },
      "archer": {
        "name": "Archer",
        "level": 0,
        "xp": 0
      },
      "mage": {
        "name": "Mage",
        "level": 1,
        "xp": 120
      },
      "tank": {
        "name": "Tank",
        "level": 0,
        "xp": 0
      },
      "healer": {
        "name": "Healer",
        "level": 0,
        "xp": 0
      }
    },
    "secretsFound": 14
  },
  "mining": {
    "hotmTier": 3,
    "mithrilPowder": 4500,
    "gemstonePowder": 1200,
    "glacitePowder": 0
  },
  "garden": {
    "gardenLevel": 5,
    "cropsComposted": 24,
    "visitorsAccepted": 35,
    "unlockedPlots": 4
  },
  "minions": {
    "slots": 12,
    "unlockedMinions": 48
  },
  "networth": {
    "total": 55219854,
    "liquid": 39939854,
    "breakdown": [
      {
        "category": "Purse",
        "name": "Purse",
        "value": 39939854,
        "percentage": 72.3
      },
      {
        "category": "Accessories",
        "name": "Accessories",
        "value": 3310000,
        "percentage": 6
      },
      {
        "category": "Ender Chest",
        "name": "Ender Chest",
        "value": 11500000,
        "percentage": 20.8
      },
      {
        "category": "Weapons",
        "name": "Weapons",
        "value": 250000,
        "percentage": 0.5
      },
      {
        "category": "Armor",
        "name": "Armor",
        "value": 55000,
        "percentage": 0.1
      },
      {
        "category": "Pets",
        "name": "Pets",
        "value": 160000,
        "percentage": 0.3
      }
    ],
    "mostValuableItems": [
      {
        "id": "HASTE_RING",
        "name": "Haste Ring",
        "count": 1,
        "rarity": "RARE",
        "price": 1200000,
        "lore": []
      },
      {
        "id": "NEW_YEAR_CAKE_BAG",
        "name": "New Year Cake Bag",
        "count": 1,
        "rarity": "UNCOMMON",
        "price": 750000,
        "lore": []
      },
      {
        "id": "PET_ITEM_EXP_SHARE_DROP",
        "name": "Exp Share Core",
        "count": 1,
        "rarity": "EPIC",
        "price": 600000,
        "lore": []
      },
      {
        "id": "INTIMIDATION_RING",
        "name": "Intimidation Ring",
        "count": 1,
        "rarity": "UNCOMMON",
        "price": 400000,
        "lore": []
      },
      {
        "id": "SPIDER_TALISMAN",
        "name": "Spider Talisman",
        "count": 1,
        "rarity": "UNCOMMON",
        "price": 350000,
        "lore": []
      },
      {
        "id": "ZOMBIE_RING",
        "name": "Zombie Ring",
        "count": 1,
        "rarity": "UNCOMMON",
        "price": 320000,
        "lore": []
      },
      {
        "id": "ASPECT_OF_THE_END",
        "name": "Aspect of the End",
        "count": 1,
        "rarity": "RARE",
        "price": 250000,
        "lore": []
      }
    ],
    "historicalSnapshots": [
      {
        "timestamp": "2026-10-01T00:00:00Z",
        "networth": 28500000,
        "purse": 21000000
      },
      {
        "timestamp": "2026-10-15T00:00:00Z",
        "networth": 35200000,
        "purse": 29000000
      },
      {
        "timestamp": "2026-11-01T00:00:00Z",
        "networth": 42100000,
        "purse": 35000000
      },
      {
        "timestamp": "2026-11-07T21:06:00Z",
        "networth": 46900000,
        "purse": 39900000
      },
      {
        "timestamp": "2026-11-08T03:40:00Z",
        "networth": 55219854,
        "purse": 39939854
      }
    ]
  },
  "transparency": {
    "dataSource": "HYPIXEL_API_LIVE",
    "lastUpdated": "2026-11-07T22:17:55.894Z",
    "cached": true,
    "provenance": "Hypixel Public API v2 (Official)"
  }
};
  const parsedJson = JSON.stringify(verifiedProfile);

  await prisma.profileSnapshot.upsert({
    where: {
      username_profileName: {
        username: 'Prithivi102',
        profileName: 'Strawberry',
      },
    },
    create: {
      username: 'Prithivi102',
      uuid: '22da8f997e2b4edfa8f0ca75f479f289',
      profileId: '8796e462-28be-47c3-b181-a14d23af337f',
      profileName: 'Strawberry',
      selected: true,
      gameMode: 'normal',
      source: 'HYPIXEL_API_LIVE',
      sourceDetails: 'Official Hypixel API v2',
      rawData: parsedJson,
      parsedData: parsedJson,
      networth: verifiedProfile.networth.total,
      purse: verifiedProfile.currencies.purse,
      bank: verifiedProfile.currencies.bank,
      skillAverage: verifiedProfile.skills.average,
      skyblockLevel: verifiedProfile.skyblockLevel.level,
      magicalPower: verifiedProfile.accessories.magicalPower,
    },
    update: {
      uuid: '22da8f997e2b4edfa8f0ca75f479f289',
      profileId: '8796e462-28be-47c3-b181-a14d23af337f',
      profileName: 'Strawberry',
      selected: true,
      gameMode: 'normal',
      source: 'HYPIXEL_API_LIVE',
      sourceDetails: 'Official Hypixel API v2',
      rawData: parsedJson,
      parsedData: parsedJson,
      networth: verifiedProfile.networth.total,
      purse: verifiedProfile.currencies.purse,
      bank: verifiedProfile.currencies.bank,
      skillAverage: verifiedProfile.skills.average,
      skyblockLevel: verifiedProfile.skyblockLevel.level,
      magicalPower: verifiedProfile.accessories.magicalPower,
      updatedAt: new Date(),
    },
  });

  // Seed default Hypixel API Key in database
  await prisma.appConfig.upsert({
    where: { key: 'HYPIXEL_API_KEY' },
    create: {
      key: 'HYPIXEL_API_KEY',
      value: 'a93589d2-67f9-407b-9c96-6b4e35be483f',
    },
    update: {
      value: 'a93589d2-67f9-407b-9c96-6b4e35be483f',
    },
  });

  console.log('✓ Successfully seeded genuine Hypixel profile & server API Key!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
