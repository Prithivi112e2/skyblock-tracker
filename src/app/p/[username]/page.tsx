import { redirect } from 'next/navigation';
import { resolvePlayerUuid, fetchHypixelProfiles, getHypixelApiKey } from '@/lib/hypixel';

export default async function PlayerPage({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username.trim();

  // If looking for Prithivi102, default immediately to Strawberry
  if (username.toLowerCase() === 'prithivi102') {
    redirect('/p/Prithivi102/Strawberry');
  }

  try {
    const apiKey = await getHypixelApiKey();
    const resolved = await resolvePlayerUuid(username);
    if (resolved && apiKey) {
      const profiles = await fetchHypixelProfiles(resolved.uuid, apiKey);
      if (profiles && profiles.length > 0) {
        const selected = profiles.find((p: any) => p.selected) || profiles[0];
        const profileName = selected.cute_name || 'Strawberry';
        redirect(`/p/${encodeURIComponent(resolved.username || username)}/${encodeURIComponent(profileName)}`);
      }
    }
  } catch (err) {
    console.error('PlayerPage redirect error:', err);
  }

  // Fallback
  redirect(`/p/${encodeURIComponent(username)}/Strawberry`);
}
