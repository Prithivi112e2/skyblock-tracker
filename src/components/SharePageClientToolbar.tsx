'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, ExternalLink, Code } from 'lucide-react';

export function SharePageClientToolbar({
  username,
  profileName,
}: {
  username: string;
  profileName: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-colors shadow-sm"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? 'Copied Link!' : 'Copy Share Link'}</span>
      </button>

      <Link
        href={`/api/public/profile/${encodeURIComponent(username)}/${encodeURIComponent(profileName)}`}
        target="_blank"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
      >
        <Code className="w-3.5 h-3.5 text-emerald-400" />
        <span>Inspect JSON</span>
      </Link>

      <Link
        href={`/p/${encodeURIComponent(username)}/${encodeURIComponent(profileName)}`}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
      >
        <span>Open Interactive Tracker</span>
        <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
      </Link>
    </div>
  );
}
