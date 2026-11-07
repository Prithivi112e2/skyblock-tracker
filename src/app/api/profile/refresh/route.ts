import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  getHypixelApiKey, 
  resolvePlayerUuid, 
  fetchHypixelProfiles, 
  fetchHypixelPlayer, 
  parseHypixelProfile 
} from '@/lib/hypixel';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, profileName } = body;

    if (!username) {
      return NextResponse.json({ success: false, message: 'Username is required' }, { status: 400 });
    }

    const apiKey = await getHypixelApiKey();
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_API_KEY',
          message: 'Hypixel API Key is not configured. Please add HYPIXEL_API_KEY in your .env file or save it on the Settings page.',
        },
        { status: 400 }
      );
    }

    // Resolve UUID
    const playerInfo = await resolvePlayerUuid(username);
    if (!playerInfo) {
      return NextResponse.json(
        { success: false, error: 'PLAYER_NOT_FOUND', message: `Could not resolve UUID for Minecraft user: ${username}` },
        { status: 404 }
      );
    }

    const start = Date.now();
    const [profiles, playerData] = await Promise.all([
      fetchHypixelProfiles(playerInfo.uuid, apiKey),
      fetchHypixelPlayer(playerInfo.uuid, apiKey),
    ]);
    const latency = Date.now() - start;

    if (!profiles || profiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'NO_PROFILES', message: `Player ${username} has no SkyBlock profiles.` },
        { status: 404 }
      );
    }

    // Find requested profile or active/first profile
    let targetProfile = profiles.find((p: any) => 
      profileName ? p.cute_name?.toLowerCase() === profileName.toLowerCase() : p.selected
    ) || profiles[0];

    const parsed = await parseHypixelProfile(targetProfile, playerInfo.uuid, playerData);
    parsed.transparency.apiLatencyMs = latency;

    // Save to database
    const serialized = JSON.stringify(parsed);
    try {
      await prisma.profileSnapshot.upsert({
        where: {
          username_profileName: {
            username: parsed.identity.username,
            profileName: parsed.profile.profileName,
          },
        },
        create: {
          username: parsed.identity.username,
          uuid: parsed.identity.uuid,
          profileId: parsed.profile.profileId,
          profileName: parsed.profile.profileName,
          selected: parsed.profile.selected,
          gameMode: parsed.profile.gameMode || 'normal',
          source: 'HYPIXEL_API_LIVE',
          sourceDetails: `Official Hypixel API v2 · ${new Date().toLocaleDateString('en-US')}`,
          rawData: serialized,
          parsedData: serialized,
          networth: parsed.networth.total,
          purse: parsed.currencies.purse,
          bank: parsed.currencies.bank,
          skillAverage: parsed.skills.average,
          skyblockLevel: parsed.skyblockLevel.level,
          magicalPower: parsed.accessories.magicalPower,
        },
        update: {
          source: 'HYPIXEL_API_LIVE',
          sourceDetails: `Official Hypixel API v2 · ${new Date().toLocaleDateString('en-US')}`,
          rawData: serialized,
          parsedData: serialized,
          networth: parsed.networth.total,
          purse: parsed.currencies.purse,
          bank: parsed.currencies.bank,
          skillAverage: parsed.skills.average,
          skyblockLevel: parsed.skyblockLevel.level,
          magicalPower: parsed.accessories.magicalPower,
          updatedAt: new Date(),
        },
      });
    } catch (dbErr) {
      console.warn('Database snapshot cache write skipped in serverless environment:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Profile refreshed from live Hypixel API v2',
      data: parsed,
    });
  } catch (err: any) {
    console.error('Refresh profile error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.error || 'HYPIXEL_FETCH_ERROR',
        message: err.message || 'Failed to fetch from Hypixel API',
      },
      { status: err.status || 500 }
    );
  }
}
