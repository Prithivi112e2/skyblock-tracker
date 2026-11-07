import React from 'react';
import { TransparencyMetadata } from '@/lib/types';
import { Radio, Database, Upload, AlertCircle, Clock } from 'lucide-react';

export function DataSourceBadge({
  transparency,
  className = '',
}: {
  transparency?: TransparencyMetadata;
  className?: string;
}) {
  if (!transparency) return null;

  const isLive = transparency.dataSource === 'HYPIXEL_API_LIVE';
  const isImported = transparency.dataSource === 'USER_IMPORT';
  const isSnapshot = transparency.dataSource === 'VERIFIED_SNAPSHOT';

  const formattedDate = transparency.lastUpdated
    ? new Date(transparency.lastUpdated).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown';

  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs ${className}`}>
      {isLive && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Official Hypixel API v2
        </span>
      )}

      {isSnapshot && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-400 font-medium">
          <Database className="w-3 h-3" />
          Verified Hypixel Snapshot
        </span>
      )}

      {isImported && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-400 font-medium">
          <Upload className="w-3 h-3" />
          Imported JSON Snapshot
        </span>
      )}

      <span className="inline-flex items-center gap-1 text-neutral-400 bg-neutral-900/60 border border-neutral-800 px-2 py-0.5 rounded">
        <Clock className="w-3 h-3 text-neutral-500" />
        {formattedDate}
      </span>

      {transparency.apiLatencyMs !== undefined && (
        <span className="text-neutral-500 font-mono text-[11px]">
          ({transparency.apiLatencyMs}ms)
        </span>
      )}

      {/* Missing data disclosures if any */}
      {transparency.missingDataReasons && Object.keys(transparency.missingDataReasons).length > 0 && (
        <div className="w-full mt-1 flex items-start gap-1.5 p-2 rounded bg-amber-950/30 border border-amber-800/40 text-amber-300/90 text-[11px]">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400" />
          <div className="space-y-0.5">
            {Object.entries(transparency.missingDataReasons).map(([key, reason]) => (
              <div key={key}>
                <strong className="capitalize">{key}:</strong> {reason}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
