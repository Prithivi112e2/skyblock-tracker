import React from 'react';
import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile-service';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { Bot, Layers, Sparkles } from 'lucide-react';

export default async function MinionsPage({
  params,
}: {
  params: { username: string; profile: string };
}) {
  const profile = await getProfileData(params.username, params.profile);
  if (!profile) notFound();

  const m = profile.minions || { slots: 12, unlockedMinions: 48 };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-amber-400" />
            Minions & Crafting Automation
          </h2>
          <p className="text-xs text-neutral-400">
            Available Minion Slots: <strong className="text-amber-300 font-mono text-sm">{m.slots}</strong> • Unlocked Unique Minions:{' '}
            <strong className="text-white font-mono">{m.unlockedMinions}</strong>
          </p>
        </div>
        <DataSourceBadge transparency={profile.transparency} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-neutral-400">Minion Slots Unlocked</span>
            <span className="text-xs font-mono font-semibold text-neutral-400">{m.slots} / 31 max</span>
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">{m.slots} Slots</div>
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full"
              style={{ width: `${(m.slots / 31) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-neutral-400">Unique Minion Tiers Crafted</span>
            <span className="text-xs font-mono font-semibold text-neutral-400">{m.unlockedMinions} crafts</span>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{m.unlockedMinions} Unlocked</div>
          <p className="text-xs text-neutral-500">
            Craft more unique minion tiers to unlock your next minion slot.
          </p>
        </div>
      </div>
    </div>
  );
}
