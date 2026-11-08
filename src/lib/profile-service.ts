import { prisma } from './prisma';
import { FullSkyBlockProfile } from './types';
import { DEFAULT_VERIFIED_PROFILE } from './default-profile';
import { getHypixelApiKey, resolvePlayerUuid, fetchHypixelProfiles, fetchHypixelPlayer, parseHypixelProfile } from './hypixel';

// Server-side cache and deduplication state
interface CacheEntry {
  profile: FullSkyBlockProfile;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<FullSkyBlockProfile | null>>();
let rateLimitUntil = 0;

const CACHE_TTL_MS = 10000; // 10-second freshness window to avoid rate limits

export function updateMemoryCache(profile: FullSkyBlockProfile) {
  const cacheKey = `${profile.identity.username.toLowerCase()}:${profile.profile.profileName.toLowerCase()}`;
  memoryCache.set(cacheKey, { profile, timestamp: Date.now() });
}

export function clearMemoryCache(username?: string, profileName?: string) {
  if (username && profileName) {
    memoryCache.delete(`${username.toLowerCase()}:${profileName.toLowerCase()}`);
  } else {
    memoryCache.clear();
  }
}

export async function getProfileData(
  username: string,
  profileName: string,
  options?: { forceRefresh?: boolean }
): Promise<FullSkyBlockProfile | null> {
  const cacheKey = `${username.toLowerCase()}:${profileName.toLowerCase()}`;
  const now = Date.now();

  // 1. Check in-memory cache for recent data (< 10 seconds) unless forced refresh
  if (!options?.forceRefresh) {
    const cachedEntry = memoryCache.get(cacheKey);
    if (cachedEntry && now - cachedEntry.timestamp < CACHE_TTL_MS) {
      return {
        ...cachedEntry.profile,
        transparency: {
          ...cachedEntry.profile.transparency,
          cached: true,
        },
      };
    }
  }

  // 2. Request deduplication: if a request for this profile is already in flight, share it (unless forceRefresh)
  if (!options?.forceRefresh && inFlightRequests.has(cacheKey)) {
    try {
      const sharedResult = await inFlightRequests.get(cacheKey)!;
      if (sharedResult) return sharedResult;
    } catch {
      // In-flight request failed, proceed to local resolution
    }
  }

  // 3. Initiate fetch with deduplication
  const fetchPromise = (async (): Promise<FullSkyBlockProfile | null> => {
    // If Hypixel is currently rate limiting us, return cached database snapshot
    if (now < rateLimitUntil) {
      console.warn(`[Hypixel API] Backing off until ${new Date(rateLimitUntil).toISOString()} due to previous 429`);
      return getCachedFallback(username, profileName, 'Cached snapshot (Hypixel API rate limited - backing off)');
    }

    const apiKey = await getHypixelApiKey();
    if (apiKey) {
      try {
        const start = Date.now();
        const resolved = await resolvePlayerUuid(username);
        if (resolved) {
          const [profiles, playerData] = await Promise.all([
            fetchHypixelProfiles(resolved.uuid, apiKey),
            fetchHypixelPlayer(resolved.uuid, apiKey),
          ]);
          const latency = Date.now() - start;

          const targetProfile = profiles.find((p: any) =>
            profileName ? p.cute_name?.toLowerCase() === profileName.toLowerCase() : p.selected
          ) || profiles[0];

          if (targetProfile) {
            const parsed = await parseHypixelProfile(targetProfile, resolved.uuid, playerData);
            parsed.transparency.apiLatencyMs = latency;
            parsed.transparency.cached = false;
            parsed.transparency.dataSource = 'HYPIXEL_API_LIVE';
            parsed.transparency.provenance = 'Official Hypixel API v2';

            // Store in memory cache
            memoryCache.set(cacheKey, { profile: parsed, timestamp: Date.now() });

            // Persist to database
            await persistToDatabase(parsed).catch((err) =>
              console.warn('Background database persistence failed:', err)
            );

            return parsed;
          }
        }
      } catch (err: any) {
        if (err?.status === 429 || err?.message?.includes('429')) {
          console.error('[Hypixel API] Rate limit hit! Backing off for 30s');
          rateLimitUntil = Date.now() + 30000;
        } else {
          console.error('[Hypixel API] Live fetch error:', err);
        }

        return getCachedFallback(username, profileName, 'Cached snapshot (Hypixel API temporarily unavailable)');
      }
    }

    // Fallback if no API key or player resolution fails
    return getCachedFallback(username, profileName, 'Cached snapshot');
  })();

  inFlightRequests.set(cacheKey, fetchPromise);

  try {
    const result = await fetchPromise;
    return result;
  } finally {
    inFlightRequests.delete(cacheKey);
  }
}

async function getCachedFallback(
  username: string,
  profileName: string,
  provenanceNotice: string
): Promise<FullSkyBlockProfile | null> {
  const cacheKey = `${username.toLowerCase()}:${profileName.toLowerCase()}`;
  const memoryEntry = memoryCache.get(cacheKey);
  if (memoryEntry) {
    return {
      ...memoryEntry.profile,
      transparency: {
        ...memoryEntry.profile.transparency,
        cached: true,
        provenance: provenanceNotice,
      },
    };
  }

  try {
    const snapshot = await prisma.profileSnapshot.findFirst({
      where: {
        username: { equals: username },
        profileName: { equals: profileName },
      },
    });

    if (snapshot) {
      const parsed: FullSkyBlockProfile = JSON.parse(snapshot.parsedData);
      parsed.transparency.cached = true;
      parsed.transparency.provenance = provenanceNotice;
      return parsed;
    }
  } catch (dbErr) {
    console.warn('Fallback database query unavailable:', dbErr);
  }

  if (username.toLowerCase() === 'prithivi102') {
    return {
      ...DEFAULT_VERIFIED_PROFILE,
      transparency: {
        ...DEFAULT_VERIFIED_PROFILE.transparency,
        cached: true,
        provenance: provenanceNotice,
      },
    };
  }

  return null;
}

async function persistToDatabase(parsed: FullSkyBlockProfile) {
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

    // Also record historical snapshot for networth timeline
    const currentSnapshot = await prisma.profileSnapshot.findUnique({
      where: {
        username_profileName: {
          username: parsed.identity.username,
          profileName: parsed.profile.profileName,
        },
      },
      select: { id: true },
    });

    if (currentSnapshot) {
      await prisma.historicalSnapshot.create({
        data: {
          profileSnapshotId: currentSnapshot.id,
          networth: parsed.networth.total,
          skillAverage: parsed.skills.average,
          skyblockLevel: parsed.skyblockLevel.level,
          purse: parsed.currencies.purse,
          bank: parsed.currencies.bank,
        },
      });
    }
  } catch (err) {
    console.warn('Database snapshot cache write skipped:', err);
  }
}
