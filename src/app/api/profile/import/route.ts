import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FullSkyBlockProfile } from '@/lib/types';
import { calculateSkillAverage } from '@/lib/calculations/skills';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support both full export schema and legacy/starter schema
    let profileData: FullSkyBlockProfile;

    if (body.profile && typeof body.profile === 'object' && body.profile.identity) {
      // Full export package containing { profile: FullSkyBlockProfile, upgradePlan?: any }
      profileData = body.profile;
    } else if (body.identity && body.skills && body.currencies) {
      // Direct FullSkyBlockProfile object
      profileData = body as FullSkyBlockProfile;
    } else if (body.username && body.skills) {
      // Legacy or custom format
      const username = String(body.username);
      const profileName = String(body.profile || 'Strawberry');

      profileData = {
        identity: {
          username,
          uuid: body.uuid || 'unknown',
          rank: 'Default',
          networkLevel: 10,
          avatarUrl: `https://crafthead.net/avatar/${body.uuid || 'steve'}`,
        },
        profile: {
          profileId: `imported-${Date.now()}`,
          profileName,
          selected: true,
          members: [body.uuid || 'unknown'],
        },
        currencies: {
          purse: Number(body.purse) || 0,
          bank: Number(body.bank) || 0,
          totalLiquid: (Number(body.purse) || 0) + (Number(body.bank) || 0),
        },
        skyblockLevel: {
          level: Number(body.skyblockLevel) || 1,
          xp: 0,
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
          fairySouls: { collected: 0, total: 289 },
        },
        skills: {
          average: calculateSkillAverage(body.skills),
          list: body.skills.map((s: any) => ({
            name: s.name,
            level: Number(s.level) || 0,
            maxLevel: 60,
            xp: Number(s.xp) || 0,
            nextLevelXp: Number(s.next) || 1000,
            progressPercent: Number(s.pct) || 0,
          })),
        },
        slayers: { totalXp: 0, list: [] },
        collections: { unlockedCount: 0, totalCount: 75, items: [] },
        equipment: { armor: [null, null, null, null], equipment: [null, null, null, null], weapon: null },
        inventories: { main: [], enderChest: [], accessoryBag: [], personalVault: [], wardrobe: [], storage: [] },
        accessories: { magicalPower: 0, items: [], duplicates: [], missingCount: 100 },
        pets: { list: [], activePet: null, petScore: 0 },
        networth: {
          total: Number(body.networth) || Number(body.purse) || 0,
          liquid: Number(body.purse) || 0,
          breakdown: Array.isArray(body.networthBreakdown) ? body.networthBreakdown.map((b: any) => ({
            category: b.name,
            name: b.name,
            value: Number(b.value) || 0,
            percentage: 0,
          })) : [],
          mostValuableItems: [],
        },
        transparency: {
          dataSource: 'USER_IMPORT',
          lastUpdated: new Date().toISOString(),
          cached: false,
          provenance: 'User JSON File Import',
        },
      };
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_JSON_STRUCTURE',
          message: 'The imported JSON file does not contain a valid SkyBlock profile structure (missing username or skills).',
        },
        { status: 400 }
      );
    }

    // Mark provenance clearly as imported
    profileData.transparency = {
      dataSource: 'USER_IMPORT',
      lastUpdated: new Date().toISOString(),
      cached: false,
      provenance: `User JSON File Import · ${new Date().toLocaleDateString('en-US')}`,
    };

    const username = profileData.identity.username;
    const profileName = profileData.profile.profileName;
    const serialized = JSON.stringify(profileData);

    await prisma.profileSnapshot.upsert({
      where: {
        username_profileName: { username, profileName },
      },
      create: {
        username,
        uuid: profileData.identity.uuid,
        profileId: profileData.profile.profileId,
        profileName,
        selected: true,
        source: 'USER_IMPORT',
        sourceDetails: 'User JSON File Import',
        rawData: serialized,
        parsedData: serialized,
        networth: profileData.networth.total,
        purse: profileData.currencies.purse,
        bank: profileData.currencies.bank,
        skillAverage: profileData.skills.average,
        skyblockLevel: profileData.skyblockLevel.level,
        magicalPower: profileData.accessories.magicalPower,
      },
      update: {
        source: 'USER_IMPORT',
        sourceDetails: 'User JSON File Import',
        rawData: serialized,
        parsedData: serialized,
        networth: profileData.networth.total,
        purse: profileData.currencies.purse,
        bank: profileData.currencies.bank,
        skillAverage: profileData.skills.average,
        skyblockLevel: profileData.skyblockLevel.level,
        magicalPower: profileData.accessories.magicalPower,
        updatedAt: new Date(),
      },
    });

    // If an upgrade plan was also imported
    if (body.upgradePlan) {
      await prisma.upgradePlan.upsert({
        where: {
          username_profileName: { username, profileName },
        },
        create: {
          username,
          profileName,
          budget: Number(body.upgradePlan.budget) || 0,
          gameMode: body.upgradePlan.gameMode || 'combat',
          selectedItemIds: JSON.stringify(body.upgradePlan.selectedItemIds || []),
          notes: body.upgradePlan.notes || 'Imported Plan',
        },
        update: {
          budget: Number(body.upgradePlan.budget) || 0,
          gameMode: body.upgradePlan.gameMode || 'combat',
          selectedItemIds: JSON.stringify(body.upgradePlan.selectedItemIds || []),
          notes: body.upgradePlan.notes || 'Imported Plan',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Profile ${username}/${profileName} successfully imported.`,
      profile: profileData,
    });
  } catch (err: any) {
    console.error('Import error:', err);
    return NextResponse.json(
      { success: false, error: 'IMPORT_FAILED', message: err.message },
      { status: 500 }
    );
  }
}
