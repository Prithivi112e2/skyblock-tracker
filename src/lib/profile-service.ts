import { prisma } from './prisma';
import { FullSkyBlockProfile } from './types';
import { DEFAULT_VERIFIED_PROFILE } from './default-profile';
import { getHypixelApiKey, resolvePlayerUuid, fetchHypixelProfiles, fetchHypixelPlayer, parseHypixelProfile } from './hypixel';

export async function getProfileData(
  username: string,
  profileName: string
): Promise<FullSkyBlockProfile | null> {
  // 1. Check local SQLite database (wrapped in safe try/catch for serverless environments)
  try {
    const snapshot = await prisma.profileSnapshot.findFirst({
      where: {
        username: { equals: username },
        profileName: { equals: profileName },
      },
    });

    if (snapshot) {
      const parsed: FullSkyBlockProfile = JSON.parse(snapshot.parsedData);
      return parsed;
    }
  } catch (dbErr) {
    console.warn('Database query skipped or unavailable in serverless environment:', dbErr);
  }

  // 2. If an API key is configured in environment, fetch live from official Hypixel API
  const apiKey = await getHypixelApiKey();
  if (apiKey) {
    try {
      const resolved = await resolvePlayerUuid(username);
      if (resolved) {
        const [profiles, playerData] = await Promise.all([
          fetchHypixelProfiles(resolved.uuid, apiKey),
          fetchHypixelPlayer(resolved.uuid, apiKey),
        ]);

        const targetProfile = profiles.find((p: any) =>
          profileName ? p.cute_name?.toLowerCase() === profileName.toLowerCase() : p.selected
        ) || profiles[0];

        if (targetProfile) {
          const parsed = await parseHypixelProfile(targetProfile, resolved.uuid, playerData);
          const serialized = JSON.stringify(parsed);

          // Attempt database cache update (safe if serverless filesystem is read-only)
          try {
            await prisma.profileSnapshot.upsert({
              where: {
                username_profileName: { username: parsed.identity.username, profileName: parsed.profile.profileName },
              },
              create: {
                username: parsed.identity.username,
                uuid: parsed.identity.uuid,
                profileId: parsed.profile.profileId,
                profileName: parsed.profile.profileName,
                selected: parsed.profile.selected,
                gameMode: parsed.profile.gameMode || 'normal',
                source: 'HYPIXEL_API_LIVE',
                sourceDetails: 'Official Hypixel API v2',
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
          } catch (writeErr) {
            console.warn('Read-only database cache write skipped:', writeErr);
          }

          return parsed;
        }
      }
    } catch (err) {
      console.error('Live Hypixel API fetch error:', err);
    }
  }

  // 3. Resilient fallback for seeded profile Prithivi102 / Strawberry
  if (username.toLowerCase() === 'prithivi102') {
    return DEFAULT_VERIFIED_PROFILE;
  }

  return null;
}
