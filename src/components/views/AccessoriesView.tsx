'use client';

import React from 'react';
import { FullSkyBlockProfile } from '@/lib/types';
import { useProfile } from '@/context/ProfileContext';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { ItemCard } from '@/components/ItemCard';
import { Sparkles, AlertCircle, PlusCircle } from 'lucide-react';
import { COMMON_CHEAP_ACCESSORIES } from '@/lib/calculations/accessories';

export function AccessoriesView({ initialProfile }: { initialProfile: FullSkyBlockProfile }) {
  const { profile: liveProfile } = useProfile();
  const profile = liveProfile || initialProfile;

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
                  <h4 className="font-bold text-xs text-neutral-200">{acc.name}</h4>
                  <span className="text-[10px] text-amber-400 font-mono">+{acc.mp} MP</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 mt-2">
                  ~{(acc.cost / 1e3).toFixed(0)}k coins
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Owned Accessories Grid */}
      <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-4">
        <h3 className="font-bold text-sm text-white">
          Active Accessory Bag ({accData.items.length} items)
        </h3>
        {accData.items.length === 0 ? (
          <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-800 text-center text-xs text-neutral-400">
            No accessories found in accessory bag or API disabled.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
            {accData.items.map((acc, i) => (
              <ItemCard key={`acc-${i}`} item={acc.item} slotLabel={`+${acc.magicalPower} MP`} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
