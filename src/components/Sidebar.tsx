'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  Swords,
  Boxes,
  Backpack,
  Shield,
  Sparkles,
  PawPrint,
  Castle,
  Pickaxe,
  Sprout,
  Bot,
  Coins,
  Calculator,
  Settings,
  ExternalLink,
} from 'lucide-react';

export const NAV_ITEMS = [
  { name: 'Overview', path: '', icon: LayoutDashboard },
  { name: 'Skills', path: 'skills', icon: GraduationCap },
  { name: 'Slayers', path: 'slayers', icon: Swords },
  { name: 'Collections', path: 'collections', icon: Boxes },
  { name: 'Inventory', path: 'inventory', icon: Backpack },
  { name: 'Armor & Equipment', path: 'armor', icon: Shield },
  { name: 'Accessories', path: 'accessories', icon: Sparkles },
  { name: 'Pets', path: 'pets', icon: PawPrint },
  { name: 'Dungeons', path: 'dungeons', icon: Castle },
  { name: 'Mining', path: 'mining', icon: Pickaxe },
  { name: 'Garden', path: 'garden', icon: Sprout },
  { name: 'Minions', path: 'minions', icon: Bot },
  { name: 'Networth', path: 'networth', icon: Coins },
  { name: 'Upgrade Planner', path: 'planner', icon: Calculator },
  { name: 'Profile Settings', path: 'settings', icon: Settings },
];

export function Sidebar({
  username = 'Prithivi102',
  profile = 'Strawberry',
  isOpen,
  onClose,
}: {
  username?: string;
  profile?: string;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const basePath = `/p/${encodeURIComponent(username)}/${encodeURIComponent(profile)}`;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-neutral-950 border-r border-neutral-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-800/80 gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-black text-neutral-950 text-lg shadow-lg shadow-amber-500/20">
            SB
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-neutral-100 flex items-center gap-1.5">
              SkyBlock Tracker
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-medium">v2.0</span>
            </h1>
            <p className="text-[11px] text-neutral-400">Official Hypixel API</p>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const targetUrl = item.path === '' ? basePath : `${basePath}/${item.path}`;
            const isActive =
              item.path === ''
                ? pathname === basePath || pathname === `${basePath}/`
                : pathname?.startsWith(`${basePath}/${item.path}`);

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={targetUrl}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Public Share Link footer */}
        <div className="p-3 border-t border-neutral-800/80 bg-neutral-900/30">
          <Link
            href={`/share/${encodeURIComponent(username)}/${encodeURIComponent(profile)}`}
            className="flex items-center justify-between px-3 py-2 rounded bg-neutral-900 border border-neutral-700/60 text-xs text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
          >
            <span className="truncate">Public Profile URL</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-1" />
          </Link>
        </div>
      </aside>
    </>
  );
}
