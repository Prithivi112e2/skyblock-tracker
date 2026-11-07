import React from 'react';
import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile-service';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { ItemCard } from '@/components/ItemCard';
import { Backpack, Box, Archive, Lock } from 'lucide-react';

export default async function InventoryPage({
  params,
}: {
  params: { username: string; profile: string };
}) {
  const profile = await getProfileData(params.username, params.profile);
  if (!profile) notFound();

  const mainInv = profile.inventories.main;
  const enderChest = profile.inventories.enderChest;
  const vault = profile.inventories.personalVault;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Backpack className="w-5 h-5 text-amber-400" />
            Inventory & Containers
          </h2>
          <p className="text-xs text-neutral-400">
            Decoded Minecraft NBT inventory data with enchantments, reforges, stars, and item lore.
          </p>
        </div>
        <DataSourceBadge transparency={profile.transparency} />
      </div>

      {/* Main Inventory Section */}
      <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Backpack className="w-4 h-4 text-emerald-400" />
          Main Inventory (36 Slots)
        </h3>

        {mainInv.length === 0 ? (
          <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-800 text-center text-xs text-neutral-400 space-y-1">
            <p className="font-semibold text-neutral-300">Inventory Contents Empty or API Hidden</p>
            <p>
              {profile.transparency.missingDataReasons?.inventory ||
                'No item data in main inventory. Enable Inventory API in Hypixel settings or refresh live.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
            {mainInv.map((item, i) => (
              <ItemCard key={`inv-${i}`} item={item} slotLabel={`Slot ${i + 1}`} compact />
            ))}
          </div>
        )}
      </div>

      {/* Ender Chest Section */}
      <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Box className="w-4 h-4 text-purple-400" />
          Ender Chest Storage
        </h3>

        {enderChest.length === 0 ? (
          <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-800 text-center text-xs text-neutral-400">
            Ender chest contents not found or empty.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
            {enderChest.map((item, i) => (
              <ItemCard key={`ec-${i}`} item={item} slotLabel={`EC ${i + 1}`} compact />
            ))}
          </div>
        )}
      </div>

      {/* Personal Vault */}
      {vault.length > 0 && (
        <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400" />
            Personal Vault
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
            {vault.map((item, i) => (
              <ItemCard key={`vault-${i}`} item={item} slotLabel={`Vault ${i + 1}`} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
