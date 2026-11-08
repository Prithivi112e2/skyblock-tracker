import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProfileData } from '@/lib/profile-service';
import { formatCoins } from '@/lib/format';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { SharePageClientToolbar } from '@/components/SharePageClientToolbar';
import { 
  Shield, 
  Coins, 
  Wallet, 
  Sparkles, 
  GraduationCap, 
  Swords, 
  PawPrint,
  CheckCircle,
  ExternalLink 
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: { username: string; profile: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await getProfileData(params.username, params.profile);
  if (!profile) {
    return {
      title: `${params.username} - Hypixel SkyBlock Profile`,
    };
  }

  const title = `${profile.identity.username} [${profile.profile.profileName}] — SkyBlock Tracker`;
  const description = `Level ${profile.skyblockLevel.level} SkyBlock Player • Networth: ${formatCoins(profile.networth.total)} • Skill Average: ${profile.skills.average.toFixed(1)} • Purse: ${formatCoins(profile.currencies.purse)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: [profile.identity.avatarUrl],
    },
  };
}

export default async function PublicSharePage({ params }: Props) {
  const { username, profile: profileName } = params;
  const profile = await getProfileData(username, profileName);

  if (!profile) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `${profile.identity.username} SkyBlock Profile`,
    mainEntity: {
      '@type': 'Person',
      name: profile.identity.username,
      identifier: profile.identity.uuid,
      image: profile.identity.avatarUrl,
      description: `Hypixel SkyBlock player on profile ${profile.profile.profileName} with Level ${profile.skyblockLevel.level} and networth ${profile.networth.total} coins.`,
    },
    dateModified: profile.transparency.lastUpdated,
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between">
      {/* JSON-LD for AI search crawlers & ChatGPT */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Navigation Bar */}
      <nav className="border-b border-neutral-800 bg-neutral-950/90 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-black text-neutral-950 text-base shadow-md">
              SB
            </div>
            <div>
              <span className="font-bold text-sm text-white">Hypixel SkyBlock Public Profile</span>
              <span className="text-[11px] text-neutral-400 block">Verified Official Hypixel Data</span>
            </div>
          </div>

          <SharePageClientToolbar username={username} profileName={profileName} />
        </div>
      </nav>

      {/* Main SSR Content (Search engine & external tool crawlable) */}
      <main className="max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        {/* Profile Identity Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-900 shrink-0">
                <img
                  src={profile.identity.avatarUrl}
                  alt={profile.identity.username}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-white tracking-tight">
                    {profile.identity.username}
                  </h1>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 uppercase border border-neutral-700">
                    {profile.identity.rank}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
                    Level {profile.skyblockLevel.level}
                  </span>
                </div>
                <div className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                  <span>Profile: <strong className="text-amber-300">{profile.profile.profileName}</strong></span>
                  <span>•</span>
                  <span>Created: {profile.profile.createdDate || 'SkyBlock'}</span>
                </div>
              </div>
            </div>

            <DataSourceBadge transparency={profile.transparency} />
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-800/80">
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80">
              <div className="text-xs text-neutral-400">Total Networth</div>
              <div className="text-lg font-black font-mono text-amber-300">{formatCoins(profile.networth.total)}</div>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80">
              <div className="text-xs text-neutral-400">Purse Coins</div>
              <div className="text-lg font-black font-mono text-emerald-400">{formatCoins(profile.currencies.purse)}</div>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80">
              <div className="text-xs text-neutral-400">Skill Average</div>
              <div className="text-lg font-black font-mono text-purple-300">{profile.skills.average.toFixed(1)}</div>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80">
              <div className="text-xs text-neutral-400">Magical Power</div>
              <div className="text-lg font-black font-mono text-yellow-300">{profile.accessories.magicalPower} MP</div>
            </div>
          </div>
        </div>

        {/* Semantic Skills Table */}
        <section className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            Skill Levels & Experience Breakdown
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Skill</th>
                  <th className="py-2.5 px-3">Level</th>
                  <th className="py-2.5 px-3">Progress</th>
                  <th className="py-2.5 px-3 font-mono text-right">Current XP</th>
                  <th className="py-2.5 px-3 font-mono text-right">Next Level XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {profile.skills.list.map((s) => (
                  <tr key={s.name} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-white">{s.name}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-purple-300">Lv. {s.level}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full" style={{ width: `${s.progressPercent}%` }} />
                        </div>
                        <span className="text-neutral-400 text-[11px]">{s.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right text-neutral-300">{s.xp.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono text-right text-neutral-400">
                      {s.nextLevelXp > 0 ? s.nextLevelXp.toLocaleString() : 'MAX'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Equipped Armor & Primary Weapon */}
        <section className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            Equipped Armor & Combat Weapon
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {['Helmet', 'Chestplate', 'Leggings', 'Boots'].map((slot, i) => {
              const item = profile.equipment.armor[i];
              return (
                <div key={slot} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{slot}</div>
                  <div className="font-semibold text-xs text-white">
                    {item ? item.name : <span className="italic text-neutral-500">None</span>}
                  </div>
                  {item?.reforge && (
                    <div className="text-[11px] text-amber-400 font-mono">Reforge: {item.reforge}</div>
                  )}
                  {item?.price && (
                    <div className="text-[11px] text-emerald-400 font-mono">{formatCoins(item.price)}</div>
                  )}
                </div>
              );
            })}
          </div>

          {profile.equipment.weapon && (
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 max-w-sm space-y-1">
              <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Equipped Weapon</div>
              <div className="font-semibold text-xs text-white">{profile.equipment.weapon.name}</div>
              {profile.equipment.weapon.reforge && (
                <div className="text-[11px] text-amber-400 font-mono">Reforge: {profile.equipment.weapon.reforge}</div>
              )}
            </div>
          )}
        </section>

        {/* Slayer Progression */}
        <section className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Swords className="w-5 h-5 text-red-400" />
            Slayer Boss Progression
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {profile.slayers.list.map((slayer) => (
              <div key={slayer.name} className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="font-semibold text-xs text-white truncate">{slayer.bossName}</div>
                <div className="text-sm font-bold text-red-400 font-mono">Level {slayer.level}</div>
                <div className="text-[11px] text-neutral-400 font-mono">{slayer.xp.toLocaleString()} XP</div>
              </div>
            ))}
          </div>
        </section>

        {/* Public Machine-Readable API Endpoints for ChatGPT inspection */}
        <section className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-2 text-xs">
          <h3 className="font-bold text-neutral-300">Machine-Readable Public JSON API</h3>
          <p className="text-neutral-400">
            External tools, scripts, and ChatGPT can directly query this profile using ordinary HTTP GET requests:
          </p>
          <div className="space-y-1 font-mono text-[11px] text-emerald-400 bg-neutral-950 p-3 rounded-lg border border-neutral-800 overflow-x-auto">
            <div>GET /api/public/profile/{username}/{profileName}</div>
            <div>GET /api/public/profile/{username}/{profileName}/inventory</div>
            <div>GET /api/public/profile/{username}/{profileName}/skills</div>
            <div>GET /api/public/profile/{username}/{profileName}/slayers</div>
            <div>GET /api/public/profile/{username}/{profileName}/accessories</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 py-6 px-4 text-center text-xs text-neutral-500">
        <p>Hypixel SkyBlock Tracker • Real official Hypixel API integration & persistent SQLite storage</p>
      </footer>
    </div>
  );
}
