import React from 'react';
import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile-service';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { Boxes, Package } from 'lucide-react';

export default async function CollectionsPage({
  params,
}: {
  params: { username: string; profile: string };
}) {
  const profile = await getProfileData(params.username, params.profile);
  if (!profile) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-amber-400" />
            Item Collections
          </h2>
          <p className="text-xs text-neutral-400">
            Unlocked: <strong className="text-white font-mono">{profile.collections.unlockedCount} / {profile.collections.totalCount}</strong> collections across SkyBlock disciplines.
          </p>
        </div>
        <DataSourceBadge transparency={profile.transparency} />
      </div>

      {profile.collections.items.length === 0 ? (
        <div className="p-8 rounded-xl bg-neutral-900/40 border border-neutral-800 text-center text-xs text-neutral-400 space-y-2">
          <Package className="w-8 h-8 text-neutral-600 mx-auto" />
          <p className="font-semibold text-neutral-300">Collections Data Not Available</p>
          <p>
            {profile.transparency.missingDataReasons?.collections ||
              'The player might have disabled Collections in their Hypixel Privacy Settings.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {profile.collections.items.map((coll) => (
            <div
              key={coll.name}
              className="p-3.5 rounded-lg bg-neutral-900/70 border border-neutral-800 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-sm text-neutral-200">{coll.name}</h4>
                  <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">
                    {coll.category}
                  </span>
                </div>
                <span className="text-xs font-bold text-neutral-300 px-2 py-0.5 rounded bg-neutral-800">
                  Tier {coll.level}
                </span>
              </div>
              <div className="text-xs font-mono text-emerald-400">
                {coll.amount.toLocaleString()} items collected
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
