import React from 'react';
import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile-service';
import { ProfileLayoutClient } from '@/components/ProfileLayoutClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string; profile: string };
}) {
  const { username, profile: profileName } = params;
  const profileData = await getProfileData(username, profileName);

  if (!profileData) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center text-neutral-200">
        <div className="max-w-md p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-white">Profile Not Loaded Yet</h2>
          <p className="text-xs text-neutral-400">
            No local snapshot was found for <strong className="text-neutral-200">{username}</strong> with profile <strong className="text-amber-300">{profileName}</strong>.
          </p>
          <div className="text-xs text-neutral-400 bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-left space-y-2">
            <div>1. Make sure the Minecraft username is spelled correctly.</div>
            <div>2. Ensure your server <code className="text-amber-300">HYPIXEL_API_KEY</code> is set in <code className="text-amber-300">.env</code> to fetch live profiles directly from the official Hypixel API.</div>
          </div>
          <div className="pt-2">
            <a
              href="/p/Prithivi102/Strawberry"
              className="inline-block px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-colors"
            >
              Go to Test Profile (Prithivi102)
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProfileLayoutClient profile={profileData}>
      {children}
    </ProfileLayoutClient>
  );
}
