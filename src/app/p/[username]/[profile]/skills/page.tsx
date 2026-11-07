import React from 'react';
import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile-service';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { GraduationCap, Award, Zap } from 'lucide-react';

export default async function SkillsPage({
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
            <GraduationCap className="w-5 h-5 text-purple-400" />
            Skills Progression
          </h2>
          <p className="text-xs text-neutral-400">
            True Skill Average: <strong className="text-white font-mono text-sm">{profile.skills.average.toFixed(2)}</strong> across official core skill disciplines.
          </p>
        </div>
        <DataSourceBadge transparency={profile.transparency} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profile.skills.list.map((skill) => (
          <div
            key={skill.name}
            className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">{skill.name}</h3>
                <span className="text-[11px] text-neutral-400">Max Lv. {skill.maxLevel}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black font-mono text-purple-300">
                  Lv. {skill.level}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>Progress: {skill.progressPercent}%</span>
                <span className="font-mono">
                  {skill.xp.toLocaleString()} / {skill.nextLevelXp > 0 ? skill.nextLevelXp.toLocaleString() : 'MAX'} XP
                </span>
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${skill.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
