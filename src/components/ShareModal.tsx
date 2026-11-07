'use client';

import React, { useState } from 'react';
import { FullSkyBlockProfile } from '@/lib/types';
import { Copy, Check, ExternalLink, Globe, Code, X } from 'lucide-react';

export function ShareModal({
  profile,
  onClose,
}: {
  profile: FullSkyBlockProfile;
  onClose: () => void;
}) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedApi, setCopiedApi] = useState<string | null>(null);

  const username = profile.identity.username;
  const profileName = profile.profile.profileName;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const shareUrl = `${origin}/share/${encodeURIComponent(username)}/${encodeURIComponent(profileName)}`;

  const endpoints = [
    { label: 'Full Profile Data', path: `/api/public/profile/${username}/${profileName}` },
    { label: 'Inventory & Armor', path: `/api/public/profile/${username}/${profileName}/inventory` },
    { label: 'Skills & Averages', path: `/api/public/profile/${username}/${profileName}/skills` },
    { label: 'Slayer Progression', path: `/api/public/profile/${username}/${profileName}/slayers` },
    { label: 'Accessories & MP', path: `/api/public/profile/${username}/${profileName}/accessories` },
  ];

  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyEndpoint = (fullPath: string) => {
    navigator.clipboard.writeText(`${origin}${fullPath}`);
    setCopiedApi(fullPath);
    setTimeout(() => setCopiedApi(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-6 text-neutral-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-lg text-white">Share Profile & Public API</h3>
        </div>

        <p className="text-xs text-neutral-400 mb-4">
          This profile is publicly accessible without login, cookies, or account sessions. Anyone or any external tool can inspect it.
        </p>

        {/* Public Share URL Box */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Public Profile URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs font-mono rounded-lg bg-neutral-950 border border-neutral-700 text-neutral-300 select-all focus:outline-none"
            />
            <button
              onClick={handleCopyShareUrl}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400 transition-colors shrink-0"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Machine-Readable JSON Endpoints */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Machine-Readable Public Endpoints (ChatGPT & External Tools)
            </h4>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {endpoints.map((ep) => (
              <div
                key={ep.path}
                className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950/80 border border-neutral-800/80 text-xs"
              >
                <div className="min-w-0 flex-1 mr-2">
                  <div className="font-medium text-neutral-300">{ep.label}</div>
                  <div className="font-mono text-[11px] text-neutral-500 truncate">{ep.path}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={ep.path}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleCopyEndpoint(ep.path)}
                    className="p-1.5 text-neutral-400 hover:text-amber-400 rounded hover:bg-neutral-800"
                    title="Copy URL"
                  >
                    {copiedApi === ep.path ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-neutral-800 text-[11px] text-neutral-500">
          No private API keys or database credentials are exposed via public endpoints.
        </div>
      </div>
    </div>
  );
}
