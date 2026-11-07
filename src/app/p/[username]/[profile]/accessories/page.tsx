import React from 'react';
import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile-service';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { ItemCard } from '@/components/ItemCard';
import { Sparkles, AlertCircle, PlusCircle, CheckCircle } from 'lucide-react';
import { COMMON_CHEAP_ACCESSORIES } from '@/lib/calculations/accessories';

export default async function AccessoriesPage({
  params,
}: {
  params: { username: string; profile: string };
}) {
  const profile = await getProfileData(params.username, params.profile);
  if (!profile) notFound();

  const accData = profile.accessories;
  const ownedIds = new Set(accData.items.map((a) => a.item.internalId || a.item.id));
  const missingCheap = COMMON_CHEAP_ACCESSORIES.filter((a) => !ownedIds.has(a.id)).slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Accessories & Magical Power
          </h2>
          <p className="text-xs text-neutral-400">
            Total Magical Power: <strong className="text-amber-300 font-mono text-sm">{accData.magicalPower} MP</strong> • Power Stone:{' '}
            <strong className="text-white">{accData.selectedPower || 'Warrior'}</strong>
          </p>
        </div>
        <DataSourceBadge transparency={profile.transparency} />
      </div>

      {/* Duplicate warning if any */}
      {accData.duplicates.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Duplicate Accessories Detected:</strong> Only the highest-tier accessory from each family grants Magical Power. Duplicates detected: {accData.duplicates.join(', ')}.
          </div>
        </div>
      )}

      {/* Recommended Missing Accessories (Cheapest MP per coin) */}
      {missingCheap.length > 0 && (
        <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Cheapest Missing Accessories (High MP Value)
            </h3>
            <span className="text-xs text-neutral-400">Best cost-per-MP ratio</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {missingCheap.map((acc) => (
              <div
                key={acc.id}
                className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-semibold text-xs text-white">{acc.name}</h4>
                  <span className="text-[10px] text-amber-400 font-bold">+{acc.mp} MP</span>
                </div>
                <div className="mt-2 pt-2 border-t border-neutral-800/80 flex justify-between text-xs">
                  <span className="text-neutral-500">Estimated:</span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    {acc.cost.toLocaleString()} coins
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Owned Accessories Bag */}
      <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Accessory Bag Contents ({accData.items.length} Accessories)
          </h3>
          <span className="text-xs font-mono text-neutral-400 font-medium">
            {accData.magicalPower} Total MP
          </span>
        </div>

        {accData.items.length === 0 ? (
          <div className="p-8 rounded-lg bg-neutral-950 border border-neutral-800 text-center text-xs text-neutral-400 space-y-1">
            <p className="font-semibold text-neutral-300">Accessory Bag Empty or API Hidden</p>
            <p>
              {profile.transparency.missingDataReasons?.accessories ||
                'No accessories loaded in the bag. Enable Talisman Bag API in Hypixel settings or refresh.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {accData.items.map((acc, i) => (
              <div key={`acc-${i}`} className="relative">
                <ItemCard item={acc.item} slotLabel={`+${acc.magicalPower} MP`} compact />
                {acc.isDuplicate && (
                  <span className="absolute top-1 right-1 text-[9px] font-bold px-1 rounded bg-red-950 text-red-400 border border-red-800/60">
                    DUP
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
