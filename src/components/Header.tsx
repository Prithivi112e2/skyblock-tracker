'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FullSkyBlockProfile } from '@/lib/types';
import { 
  Menu, 
  RefreshCw, 
  Share2, 
  FileJson, 
  Search, 
  Key,
  ShieldCheck,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { ShareModal } from './ShareModal';
import { ImportExportModal } from './ImportExportModal';

export function Header({
  profile,
  onOpenSidebar,
  onProfileUpdated,
}: {
  profile: FullSkyBlockProfile;
  onOpenSidebar: () => void;
  onProfileUpdated?: (updated: FullSkyBlockProfile) => void;
}) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showImportExportModal, setShowImportExportModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);

  // Live timer for seconds ago
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  // Automatic 10-second background updates (Requirement 4)
  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/profile/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: profile.identity.username,
            profileName: profile.profile.profileName,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && isMounted) {
            setLastUpdated(new Date());
            setSecondsAgo(0);
            if (onProfileUpdated) {
              onProfileUpdated(data.data);
            }
            router.refresh();
          }
        }
      } catch (e) {
        // Background polling jitter silently handled
      }
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [profile.identity.username, profile.profile.profileName, onProfileUpdated, router]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/profile/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: profile.identity.username,
          profileName: profile.profile.profileName,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusMessage({
          text: data.message || 'Failed to refresh profile from Hypixel API.',
          error: true,
        });
      } else {
        setLastUpdated(new Date());
        setSecondsAgo(0);
        setStatusMessage({ text: 'Profile successfully refreshed from Hypixel API v2!' });
        if (onProfileUpdated && data.data) {
          onProfileUpdated(data.data);
        }
        router.refresh();
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Network error refreshing profile', error: true });
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setStatusMessage(null), 6000);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/p/${encodeURIComponent(searchQuery.trim())}`);
  };

  const rankBg = profile.identity.rank.includes('MVP')
    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
    : profile.identity.rank.includes('VIP')
    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
    : 'bg-neutral-800 text-neutral-300 border-neutral-700';

  return (
    <>
      <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left section: mobile toggle, avatar, player name, rank, profile selector */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSidebar}
              className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900 shrink-0">
              <img
                src={profile.identity.avatarUrl}
                alt={profile.identity.username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://crafthead.net/avatar/steve';
                }}
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-neutral-100 tracking-tight">
                  {profile.identity.username}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${rankBg}`}>
                  {profile.identity.rank}
                </span>
                <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  Lv. {profile.skyblockLevel.level}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                <span className="text-amber-300 font-semibold">{profile.profile.profileName}</span>
                <span>•</span>
                <span>Networth: {(profile.networth.total / 1e6).toFixed(1)}M</span>
              </div>
            </div>
          </div>

          {/* Right section: Search bar, Refresh button, Share, Import/Export */}
          <div className="flex items-center gap-2 flex-wrap">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search player..."
                className="w-36 sm:w-48 pl-8 pr-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </form>

            {/* Live 10s auto-refresh ticker badge (Requirement 4) */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-[11px] text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-neutral-400">Live 10s Sync:</span>
              <span className="text-amber-300 font-mono font-semibold">
                {secondsAgo === 0 ? 'just now' : `${secondsAgo}s ago`}
              </span>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-xs font-medium text-neutral-200 transition-colors disabled:opacity-50"
              title="Refresh profile from official Hypixel API"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : 'text-neutral-400'}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-xs font-semibold text-amber-300 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              onClick={() => setShowImportExportModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 transition-colors"
            >
              <FileJson className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Import/Export</span>
            </button>
          </div>
        </div>

        {/* Status notification banner if any */}
        {statusMessage && (
          <div
            className={`mt-2.5 px-3 py-2 rounded-lg text-xs flex items-center justify-between border ${
              statusMessage.error
                ? 'bg-red-950/40 border-red-800/60 text-red-300'
                : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.error ? (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-xs opacity-70 hover:opacity-100 ml-2 font-bold"
            >
              ×
            </button>
          </div>
        )}
      </header>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          profile={profile}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Import / Export Modal */}
      {showImportExportModal && (
        <ImportExportModal
          profile={profile}
          onClose={() => setShowImportExportModal(false)}
          onImportSuccess={(newProf) => {
            if (onProfileUpdated) onProfileUpdated(newProf);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
