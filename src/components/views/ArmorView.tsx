'use client';

import React from 'react';
import { FullSkyBlockProfile } from '@/lib/types';
import { useProfile } from '@/context/ProfileContext';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { ItemCard } from '@/components/ItemCard';
import { Shield, Sparkles, Swords } from 'lucide-react';

export function ArmorView({ initialProfile }: { initialProfile: FullSkyBlockProfile }) {
  const { profile: liveProfile } = useProfile();
  const profile = liveProfile || initialProfile;

  const armor = profile.equipment.armor;
  const equipment = profile.equipment.equipment;
  const weapon = profile.equipment.weapon;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            Armor & Equipment
          </h2>
          <p className="text-xs text-neutral-400">
            Equipped battle armor, Crimson Isle equipment, and primary weapons.
          </p>
        </div>
        <DataSourceBadge transparency={profile.transparency} />
      </div>

      {/* Equipped Armor */}
      <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Active Armor Set
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ItemCard slotLabel="Helmet" item={armor[0]} />
          <ItemCard slotLabel="Chestplate" item={armor[1]} />
          <ItemCard slotLabel="Leggings" item={armor[2]} />
          <ItemCard slotLabel="Boots" item={armor[3]} />
        </div>
      </div>

      {/* Equipment (Necklace, Cloak, Belt, Gloves) */}
      <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Equipment Slots (4/4)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ItemCard slotLabel="Necklace" item={equipment[0]} />
          <ItemCard slotLabel="Cloak" item={equipment[1]} />
          <ItemCard slotLabel="Belt" item={equipment[2]} />
          <ItemCard slotLabel="Gloves" item={equipment[3]} />
        </div>
      </div>

      {/* Primary Weapon */}
      <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Swords className="w-4 h-4 text-red-400" />
          Primary Weapon
        </h3>
        <div className="max-w-md">
          <ItemCard slotLabel="Equipped Weapon" item={weapon} />
        </div>
      </div>
    </div>
  );
}
