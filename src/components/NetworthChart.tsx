'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { NetworthBreakdownItem } from '@/lib/types';
import { formatCoins } from './ItemCard';

const COLORS = [
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#64748b', // slate
  '#84cc16', // lime
];

export function NetworthPieChart({ breakdown }: { breakdown: NetworthBreakdownItem[] }) {
  if (!breakdown || breakdown.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-neutral-500 italic">
        No breakdown data available.
      </div>
    );
  }

  const data = breakdown.map((item) => ({
    name: item.name,
    value: item.value,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0];
                return (
                  <div className="p-2 rounded bg-neutral-950 border border-neutral-700 shadow-xl text-xs">
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-emerald-400 font-mono font-bold">
                      {formatCoins(item.value as number)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HistoricalNetworthChart({
  snapshots,
}: {
  snapshots?: { timestamp: string; networth: number; purse: number }[];
}) {
  if (!snapshots || snapshots.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-neutral-500 italic">
        No historical snapshots recorded yet.
      </div>
    );
  }

  const data = snapshots.map((s) => ({
    date: new Date(s.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Networth: s.networth,
    Purse: s.purse,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
          <XAxis dataKey="date" stroke="#737373" fontSize={11} tickLine={false} />
          <YAxis
            stroke="#737373"
            fontSize={11}
            tickLine={false}
            tickFormatter={(val) => `${(val / 1e6).toFixed(0)}M`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-700 text-xs space-y-1">
                    <p className="font-semibold text-neutral-300">{label}</p>
                    {payload.map((entry, idx) => (
                      <div key={idx} className="flex justify-between gap-4 font-mono">
                        <span style={{ color: entry.color }}>{entry.name}:</span>
                        <span className="font-bold text-white">
                          {formatCoins(entry.value as number)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="Networth"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: '#f59e0b', r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Purse"
            stroke="#10b981"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={{ fill: '#10b981', r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
