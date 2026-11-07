import React from 'react';
import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile-service';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { Swords, Skull, Trophy } from 'lucide-react';

export default async function SlayersPage({
  params,
}: {
  params: { username: string; profile: string };
}) {
  const profile = await getProfileData(params.username, params.profile);
  if (!profile) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Swords className="w-5 h-5 text-red-400" />
            Slayer Bosses
          </h2>
          <p className="text-xs text-neutral-400">
            Total Slayer Experience: <strong className="text-white font-mono">{profile.slayers.totalXp.toLocaleString()} XP</strong>
          </p>
        </div>
        <DataSourceBadge transparency={profile.transparency} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profile.slayers.list.map((slayer) => {
          const pct = slayer.nextLevelXp > 0 ? Math.min(100, Math.round((slayer.xp / slayer.nextLevelXp) * 100)) : 100;
          return (
            <div
              key={slayer.name}
              className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                    <Skull className="w-4 h-4 text-red-400" />
                    {slayer.name}
                  </h3>
                  <span className="text-xs text-neutral-400">{slayer.bossName} Category</span>
                </div>
                <div className="px-2.5 py-1 rounded bg-red-950/60 border border-red-800/40 text-red-300 font-bold text-xs">
                  Level {slayer.level}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Progress to Next Tier</span>
                  <span className="font-mono text-neutral-300">{pct}%</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-600 to-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-neutral-500 font-mono mt-1">
                  <span>Current: {slayer.xp.toLocaleString()} XP</span>
                  <span>{slayer.nextLevelXp > 0 ? `Target: ${slayer.nextLevelXp.toLocaleString()} XP` : 'Maxed'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
