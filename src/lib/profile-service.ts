import { prisma } from './prisma';
import { FullSkyBlockProfile } from './types';
import { getHypixelApiKey, resolvePlayerUuid, fetchHypixelProfiles, fetchHypixelPlayer, parseHypixelProfile } from './hypixel';

export async function getProfileData(
  username: string,
  profileName: string
): Promise<FullSkyBlockProfile | null> {
  // 1. Check local SQLite database
  const snapshot = await prisma.profileSnapshot.findFirst({
    where: {
      username: { equals: username },
      profileName: { equals: profileName },
    },
  });

  if (snapshot) {
    try {
      const parsed: FullSkyBlockProfile = JSON.parse(snapshot.parsedData);
      return parsed;
    } catch (e) {
      console.error('Failed to parse cached profile snapshot JSON:', e);
    }
  }

  // 2. If not found in DB and an API key is configured, attempt live fetch from Hypixel
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

          return parsed;
        }
      }
    } catch (err) {
      console.error('Live fetch fallback failed:', err);
    }
  }

  return null;
}
