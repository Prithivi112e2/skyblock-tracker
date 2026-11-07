import React from 'react';
import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile-service';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { UpgradePlannerClient } from '@/components/UpgradePlannerClient';
import { Calculator } from 'lucide-react';

export default async function PlannerPage({
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
            <Calculator className="w-5 h-5 text-amber-400" />
            Hypixel SkyBlock Upgrade Planner
          </h2>
          <p className="text-xs text-neutral-400">
            Real gear recommendations calculated from your current stats, purse, and game progression goals.
          </p>
        </div>
        <DataSourceBadge transparency={profile.transparency} />
      </div>

      <UpgradePlannerClient
        profile={profile}
        initialBudget={profile.currencies.purse || 39000000}
        initialGoal="combat"
      />
    </div>
  );
}
