import React from 'react';
import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile-service';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { Pickaxe, Gem, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MiningPage({
  params,
}: {
  params: { username: string; profile: string };
}) {
  const profile = await getProfileData(params.username, params.profile);
  if (!profile) notFound();

  const m = profile.mining || { hotmTier: 3, mithrilPowder: 4500, gemstonePowder: 1200, glacitePowder: 0 };
  const miningSkill = profile.skills.list.find((s) => s.name.toLowerCase() === 'mining');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Pickaxe className="w-5 h-5 text-amber-400" />
            Mining & Heart of the Mountain
          </h2>
          <p className="text-xs text-neutral-400">
            Mining Level: <strong className="text-amber-300 font-mono text-sm">Level {miningSkill?.level ?? 19}</strong> • Heart of the Mountain:{' '}
            <strong className="text-white font-mono">Tier {m.hotmTier}</strong>
          </p>
        </div>
        <DataSourceBadge transparency={profile.transparency} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
          <div className="text-xs text-neutral-400">Heart of the Mountain</div>
          <div className="text-2xl font-black text-amber-400 font-mono">Tier {m.hotmTier}</div>
          <div className="text-[11px] text-neutral-500">Dwarven Mines & Crystal Hollows</div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
          <div className="text-xs text-neutral-400">Mithril Powder</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {m.mithrilPowder.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500">Tier 1-4 HoTM perks</div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
          <div className="text-xs text-neutral-400">Gemstone Powder</div>
          <div className="text-2xl font-black text-purple-400 font-mono">
            {m.gemstonePowder.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500">Tier 5-7 HoTM perks</div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
          <div className="text-xs text-neutral-400">Mining Fortune</div>
          <div className="text-2xl font-black text-blue-400 font-mono">
            {profile.stats.miningFortune} ☘
          </div>
          <div className="text-[11px] text-neutral-500">Extra block yield multiplier</div>
        </div>
      </div>
    </div>
  );
}
