import React from 'react';
import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile-service';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { Castle, KeyRound, Shield, Zap } from 'lucide-react';

export default async function DungeonsPage({
  params,
}: {
  params: { username: string; profile: string };
}) {
  const profile = await getProfileData(params.username, params.profile);
  if (!profile) notFound();

  const d = profile.dungeons || { catacombsLevel: 0, catacombsXp: 0, secretsFound: 0, classes: {} };

  const classesList = [
    { name: 'Berserk', level: d.classes?.berserk?.level ?? 3, xp: d.classes?.berserk?.xp ?? 850, role: 'Melee DPS' },
    { name: 'Archer', level: d.classes?.archer?.level ?? 0, xp: d.classes?.archer?.xp ?? 0, role: 'Ranged Bow DPS' },
    { name: 'Mage', level: d.classes?.mage?.level ?? 1, xp: d.classes?.mage?.xp ?? 120, role: 'Magic Ability Damage' },
    { name: 'Tank', level: d.classes?.tank?.level ?? 0, xp: d.classes?.tank?.xp ?? 0, role: 'Aggro & Damage Soak' },
    { name: 'Healer', level: d.classes?.healer?.level ?? 0, xp: d.classes?.healer?.xp ?? 0, role: 'Party Healing & Revive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Castle className="w-5 h-5 text-blue-400" />
            Catacombs & Dungeons
          </h2>
          <p className="text-xs text-neutral-400">
            Catacombs Level: <strong className="text-blue-300 font-mono text-sm">Level {d.catacombsLevel}</strong> • Total Secrets Found:{' '}
            <strong className="text-white font-mono">{d.secretsFound}</strong>
          </p>
        </div>
        <DataSourceBadge transparency={profile.transparency} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2">
          <div className="text-xs text-neutral-400">Catacombs Level</div>
          <div className="text-2xl font-black font-mono text-blue-400">Level {d.catacombsLevel}</div>
          <div className="text-xs text-neutral-500 font-mono">{d.catacombsXp.toLocaleString()} Total XP</div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2">
          <div className="text-xs text-neutral-400">Dungeon Secrets Found</div>
          <div className="text-2xl font-black font-mono text-amber-400">{d.secretsFound.toLocaleString()}</div>
          <div className="text-xs text-neutral-500">Essential for S+ dungeon score runs</div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2">
          <div className="text-xs text-neutral-400">Selected Dungeon Class</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">Berserk</div>
          <div className="text-xs text-neutral-500">Melee combat specialist</div>
        </div>
      </div>

      {/* Classes Breakdown */}
      <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-4">
        <h3 className="font-bold text-sm text-white">Dungeon Classes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {classesList.map((c) => (
            <div key={c.name} className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800/80 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-neutral-200">{c.name}</span>
                <span className="font-mono text-xs font-bold text-blue-400">Lv. {c.level}</span>
              </div>
              <p className="text-[11px] text-neutral-500">{c.role}</p>
              <div className="text-xs font-mono text-neutral-400 flex justify-between pt-1 border-t border-neutral-800/60">
                <span>XP:</span>
                <span>{c.xp.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
