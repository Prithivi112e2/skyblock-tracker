import React from 'react';
import { SettingsClient } from '@/components/SettingsClient';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            Profile & API Settings
          </h2>
          <p className="text-xs text-neutral-400">
            Configure server-side Hypixel API credentials, cache controls, and data transparency settings.
          </p>
        </div>
      </div>

      <SettingsClient />
    </div>
  );
}
