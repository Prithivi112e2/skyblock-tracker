'use client';

import React from 'react';
import { FullSkyBlockProfile } from '@/lib/types';
import { useProfile } from '@/context/ProfileContext';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { ItemCard } from '@/components/ItemCard';
import { formatCoins } from '@/lib/format';
import { NetworthPieChart, HistoricalNetworthChart } from '@/components/NetworthChart';
import Link from 'next/link';
import {
  Wallet,
  Landmark,
  Coins,
  Sparkles,
  GraduationCap,
  Swords,
  Shield,
  PawPrint,
  Castle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

export function OverviewView({ initialProfile }: { initialProfile: FullSkyBlockProfile }) {
  const { profile: liveProfile } = useProfile();
  const profile = liveProfile || initialProfile;

  const combatSkill = profile.skills.list.find((s) => s.name.toLowerCase() === 'combat');
  const miningSkill = profile.skills.list.find((s) => s.name.toLowerCase() === 'mining');

  return (
    <div className="space-y-6">
      {/* Top Banner / Provenance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Profile Dashboard
            <span className="text-xs font-normal text-neutral-400">({profile.profile.createdDate || 'SkyBlock'})</span>
          </h2>
          <p className="text-xs text-neutral-400">
            Player statistics computed from official Hypixel SkyBlock data schemas.
          </p>
        </div>
        <DataSourceBadge transparency={profile.transparency} />
      </div>

      {/* Key Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Total Networth</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white font-mono">
            {formatCoins(profile.networth.total)}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            Liquid: {formatCoins(profile.currencies.totalLiquid)}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Purse Coins</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white font-mono">
            {formatCoins(profile.currencies.purse)}
          </div>
          <div className="text-[11px] text-neutral-500">
            Available on hand
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-blue-400" />
              <span>Bank Balance</span>
            </div>
            {profile.currencies.bankAvailable === false && (
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded" title="Hypixel API did not return bank data for this profile. Enable Banking API in Island Settings in-game.">
                API Disabled
              </span>
            )}
          </div>
          <div className="text-base sm:text-lg font-bold text-white font-mono">
            {profile.currencies.bankAvailable === false ? (
              <span className="text-neutral-400 font-sans text-sm">Not Public</span>
            ) : (
              formatCoins(profile.currencies.bank)
            )}
          </div>
          <div className="text-[11px] text-neutral-500">
            {profile.currencies.bankAvailable === false ? (
              <span className="text-neutral-500">Enable in Island Settings</span>
            ) : (
              'Bank / Co-op vault'
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
            <span>Skill Average</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white font-mono">
            {profile.skills.average.toFixed(1)}
          </div>
          <div className="text-[11px] text-neutral-500">
            Core skills level
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Swords className="w-3.5 h-3.5 text-red-400" />
            <span>Combat Level</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white font-mono">
            {combatSkill?.level ?? 0}
          </div>
          <div className="text-[11px] text-neutral-500">
            {combatSkill?.progressPercent ?? 0}% to next level
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Magical Power</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white font-mono">
            {profile.accessories.magicalPower} MP
          </div>
          <div className="text-[11px] text-neutral-500">
            {profile.accessories.items.length} accessories
          </div>
        </div>
      </div>

      {/* Main Grid: Equipped Gear & Networth Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Equipped Armor & Weapon */}
        <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Equipped Gear
            </h3>
            <Link
              href={`/p/${encodeURIComponent(profile.identity.username)}/${encodeURIComponent(profile.profile.profileName)}/armor`}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <ItemCard slotLabel="Helmet" item={profile.equipment.armor[0]} />
            <ItemCard slotLabel="Chestplate" item={profile.equipment.armor[1]} />
            <ItemCard slotLabel="Leggings" item={profile.equipment.armor[2]} />
            <ItemCard slotLabel="Boots" item={profile.equipment.armor[3]} />
          </div>

          <div className="pt-2 border-t border-neutral-800/80">
            <div className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">
              Primary Weapon
            </div>
            <ItemCard slotLabel="Weapon" item={profile.equipment.weapon} />
          </div>

          {/* Active Pet Card */}
          <div className="pt-2 border-t border-neutral-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <PawPrint className="w-3.5 h-3.5 text-amber-400" />
                Active Pet
              </span>
              <span className="text-xs text-neutral-500">Pet Score: {profile.pets.petScore}</span>
            </div>
            {profile.pets.activePet ? (
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-amber-300">
                    [Lvl {profile.pets.activePet.level}] {profile.pets.activePet.name}
                  </div>
                  <div className="text-xs text-neutral-400 capitalize">
                    {profile.pets.activePet.rarity.toLowerCase()} Pet
                  </div>
                </div>
                {profile.pets.activePet.heldItem && (
                  <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                    {profile.pets.activePet.heldItem}
                  </span>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-500 italic text-center">
                No pet currently summoned.
              </div>
            )}
          </div>
        </div>

        {/* Networth Breakdown Chart */}
        <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Networth Composition
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {formatCoins(profile.networth.total)}
            </span>
          </div>

          <NetworthPieChart breakdown={profile.networth.breakdown} />

          <div className="space-y-1.5 pt-2 border-t border-neutral-800/80 max-h-36 overflow-y-auto pr-1">
            {profile.networth.breakdown.map((item) => (
              <div key={item.name} className="flex justify-between text-xs py-0.5">
                <span className="text-neutral-400">{item.name}:</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-white font-medium">{formatCoins(item.value)}</span>
                  <span className="text-neutral-500 text-[10px]">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progression Highlights: Slayers & Dungeons */}
        <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Swords className="w-4 h-4 text-red-400" />
              Slayer Progression
            </h3>
            <Link
              href={`/p/${encodeURIComponent(profile.identity.username)}/${encodeURIComponent(profile.profile.profileName)}/slayers`}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {profile.slayers.list.slice(0, 4).map((slayer) => (
              <div key={slayer.name} className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-neutral-200">{slayer.name}</span>
                  <span className="font-bold text-amber-400">Lv. {slayer.level}</span>
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{
                      width: `${slayer.nextLevelXp > 0 ? Math.min(100, (slayer.xp / slayer.nextLevelXp) * 100) : 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-mono">
                  <span>{slayer.xp.toLocaleString()} XP</span>
                  {slayer.nextLevelXp > 0 && <span>Next: {slayer.nextLevelXp.toLocaleString()} XP</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Dungeons Summary */}
          <div className="pt-2 border-t border-neutral-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Castle className="w-3.5 h-3.5 text-blue-400" />
                Catacombs
              </span>
              <span className="text-xs font-bold text-blue-400">
                Lv. {profile.dungeons?.catacombsLevel ?? 0}
              </span>
            </div>
            <div className="text-xs text-neutral-400 flex justify-between">
              <span>Secrets Found:</span>
              <span className="font-mono text-white font-semibold">
                {profile.dungeons?.secretsFound ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Networth Progress */}
      {profile.networth.historicalSnapshots && profile.networth.historicalSnapshots.length > 0 && (
        <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Historical Networth Trend
            </h3>
            <span className="text-xs text-neutral-400">
              Snapshots tracked over time
            </span>
          </div>
          <HistoricalNetworthChart snapshots={profile.networth.historicalSnapshots} />
        </div>
      )}
    </div>
  );
}
