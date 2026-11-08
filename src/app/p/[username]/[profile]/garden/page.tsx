import React from 'react';
import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile-service';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { Sprout, Users, Layers, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function GardenPage({
  params,
}: {
  params: { username: string; profile: string };
}) {
  const profile = await getProfileData(params.username, params.profile);
  if (!profile) notFound();

  const g = profile.garden || { gardenLevel: 5, cropsComposted: 24, visitorsAccepted: 35, unlockedPlots: 4 };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            The Garden Progression
          </h2>
          <p className="text-xs text-neutral-400">
            Garden Level: <strong className="text-emerald-300 font-mono text-sm">Level {g.gardenLevel}</strong> • Farming Fortune:{' '}
            <strong className="text-white font-mono">{profile.stats.farmingFortune} ☘</strong>
          </p>
        </div>
        <DataSourceBadge transparency={profile.transparency} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Garden Rank</span>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">Level {g.gardenLevel}</div>
          <div className="text-[11px] text-neutral-500">Unlocks new crop milestones</div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Unlocked Plots</span>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{g.unlockedPlots} / 25</div>
          <div className="text-[11px] text-neutral-500">Available farm acreage</div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Visitors Served</span>
          </div>
          <div className="text-2xl font-black text-blue-400 font-mono">{g.visitorsAccepted}</div>
          <div className="text-[11px] text-neutral-500">NPC farming offers fulfilled</div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-purple-400" />
            <span>Composted Crops</span>
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono">{g.cropsComposted}</div>
          <div className="text-[11px] text-neutral-500">Organic compost batches</div>
        </div>
      </div>
    </div>
  );
}
