import React from 'react';
import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile-service';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { PawPrint, Star, Award } from 'lucide-react';
import { RARITY_BORDER_COLORS, RARITY_BG_GLOW } from '@/lib/rarity';

export default async function PetsPage({
  params,
}: {
  params: { username: string; profile: string };
}) {
  const profile = await getProfileData(params.username, params.profile);
  if (!profile) notFound();

  const pets = profile.pets.list;
  const activePet = profile.pets.activePet;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <PawPrint className="w-5 h-5 text-amber-400" />
            Pets Collection
          </h2>
          <p className="text-xs text-neutral-400">
            Pet Score: <strong className="text-amber-300 font-mono">{profile.pets.petScore}</strong> • Total Pets: <strong className="text-white font-mono">{pets.length}</strong>
          </p>
        </div>
        <DataSourceBadge transparency={profile.transparency} />
      </div>

      {/* Active Pet Highlight */}
      {activePet ? (
        <div className="p-5 rounded-xl bg-gradient-to-r from-amber-950/30 to-neutral-900/70 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl font-bold">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  [Lvl {activePet.level}] {activePet.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-neutral-950 uppercase">
                  Active Pet
                </span>
              </div>
              <p className="text-xs text-neutral-400 capitalize">
                {activePet.rarity.toLowerCase()} Pet • {activePet.exp.toLocaleString()} XP
              </p>
            </div>
          </div>
          {activePet.heldItem && (
            <div className="text-xs bg-neutral-900 border border-neutral-700 px-3 py-1.5 rounded-lg text-neutral-300">
              Held Item: <strong className="text-amber-300">{activePet.heldItem}</strong>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 italic">
          No active pet currently equipped.
        </div>
      )}

      {/* Pet Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet, idx) => {
          const borderClass = RARITY_BORDER_COLORS[pet.rarity] || 'border-neutral-700 text-white';
          const bgClass = RARITY_BG_GLOW[pet.rarity] || 'bg-neutral-900/60';
          return (
            <div
              key={`${pet.type}-${idx}`}
              className={`p-4 rounded-xl border ${borderClass} ${bgClass} space-y-3 transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm">
                    [Lvl {pet.level}] {pet.name}
                  </h4>
                  <span className="text-[11px] opacity-80 uppercase font-semibold tracking-wider">
                    {pet.rarity}
                  </span>
                </div>
                {pet.active && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ACTIVE
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-neutral-800/80 text-xs text-neutral-400 flex justify-between">
                <span>Total XP:</span>
                <span className="font-mono text-neutral-200">{pet.exp.toLocaleString()}</span>
              </div>

              {pet.heldItem && (
                <div className="text-xs text-neutral-400 flex justify-between">
                  <span>Held Item:</span>
                  <span className="font-mono text-amber-300">{pet.heldItem}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
