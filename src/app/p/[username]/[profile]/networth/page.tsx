import React from 'react';
import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile-service';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { ItemCard } from '@/components/ItemCard';
import { formatCoins } from '@/lib/format';
import { NetworthPieChart, HistoricalNetworthChart } from '@/components/NetworthChart';
import { Coins, Wallet, Landmark, TrendingUp, Gem } from 'lucide-react';

export default async function NetworthPage({
  params,
}: {
  params: { username: string; profile: string };
}) {
  const profile = await getProfileData(params.username, params.profile);
  if (!profile) notFound();

  const nw = profile.networth;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Networth & Economy Analysis
          </h2>
          <p className="text-xs text-neutral-400">
            Valuation calculated across live Bazaar commodities, lowest BIN auction prices, and item upgrades.
          </p>
        </div>
        <DataSourceBadge transparency={profile.transparency} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Total Profile Networth</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
            {formatCoins(nw.total)}
          </div>
          <p className="text-[11px] text-neutral-500">All liquid assets + all gear & inventory items</p>
        </div>

        <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Liquid Wealth</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {formatCoins(nw.liquid)}
          </div>
          <p className="text-[11px] text-neutral-500">Purse ({formatCoins(profile.currencies.purse)}) + Bank ({formatCoins(profile.currencies.bank)})</p>
        </div>

        <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <Gem className="w-3.5 h-3.5 text-purple-400" />
            <span>Items & Equipment Networth</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono">
            {formatCoins(Math.max(0, nw.total - nw.liquid))}
          </div>
          <p className="text-[11px] text-neutral-500">Armor, weapons, accessories, pets & bags</p>
        </div>
      </div>

      {/* Breakdown Chart & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Category Composition
          </h3>
          <NetworthPieChart breakdown={nw.breakdown} />
        </div>

        <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-3">
          <h3 className="font-bold text-sm text-white">Item Categories</h3>
          <div className="divide-y divide-neutral-800/80">
            {nw.breakdown.map((item) => (
              <div key={item.name} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-neutral-200">{item.name}</span>
                  <span className="text-neutral-500 text-[11px] ml-2">({item.percentage}%)</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">{formatCoins(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most Valuable Items */}
      {nw.mostValuableItems.length > 0 && (
        <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Gem className="w-4 h-4 text-amber-400" />
            Most Valuable Items Owned
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {nw.mostValuableItems.map((item, idx) => (
              <ItemCard key={`top-item-${idx}`} item={item} slotLabel={`#${idx + 1} Valuation`} />
            ))}
          </div>
        </div>
      )}

      {/* Historical Networth Chart */}
      {nw.historicalSnapshots && nw.historicalSnapshots.length > 0 && (
        <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Historical Networth Timeline
          </h3>
          <HistoricalNetworthChart snapshots={nw.historicalSnapshots} />
        </div>
      )}
    </div>
  );
}
