'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';
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
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const router = useRouter();
  const { profile, setProfile, isRefreshing, secondsAgo, syncStatus, statusMessage, refreshNow } = useProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showImportExportModal, setShowImportExportModal] = useState(false);

  const handleRefresh = async () => {
    await refreshNow(true);
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

            {/* Live 10s auto-refresh ticker badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-[11px] text-neutral-300">
              {syncStatus === 'updating' ? (
                <>
                  <RefreshCw className="w-2.5 h-2.5 text-amber-400 animate-spin" />
                  <span className="text-amber-300 font-medium">Updating...</span>
                </>
              ) : syncStatus === 'error' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-rose-400">Sync Error</span>
                </>
              ) : syncStatus === 'stale' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-amber-400">Cached</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-neutral-400">Live 10s Sync:</span>
                  <span className="text-amber-300 font-mono font-semibold">
                    {secondsAgo === 0 ? 'just now' : `${secondsAgo}s ago`}
                  </span>
                </>
              )}
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-xs font-medium text-neutral-200 transition-colors disabled:opacity-50"
              title="Force fresh refresh from official Hypixel API"
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
                ? 'bg-rose-950/60 border-rose-800 text-rose-200'
                : 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.error ? (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
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
          onImportSuccess={(newProf) => setProfile(newProf)}
        />
      )}
    </>
  );
}
