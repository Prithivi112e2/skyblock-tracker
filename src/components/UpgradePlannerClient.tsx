'use client';

import React, { useState, useEffect } from 'react';
import { FullSkyBlockProfile, UpgradeRecommendation } from '@/lib/types';
import { generateUpgradePlan, PlannerGoal, GOAL_LABELS } from '@/lib/calculations/upgrade-planner';
import { formatCoins } from './ItemCard';
import {
  Calculator,
  Coins,
  CheckCircle2,
  Circle,
  Sparkles,
  TrendingUp,
  Save,
  HelpCircle,
  Shield,
  Swords,
  Layers,
} from 'lucide-react';

export function UpgradePlannerClient({
  profile,
  initialBudget = 39000000,
  initialGoal = 'combat',
  initialSelected = [],
}: {
  profile: FullSkyBlockProfile;
  initialBudget?: number;
  initialGoal?: PlannerGoal;
  initialSelected?: string[];
}) {
  const [budget, setBudget] = useState<number>(initialBudget);
  const [goal, setGoal] = useState<PlannerGoal>(initialGoal);
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set(initialSelected));
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Load existing plan from API on mount
  useEffect(() => {
    fetch(`/api/planner?username=${encodeURIComponent(profile.identity.username)}&profile=${encodeURIComponent(profile.profile.profileName)}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.budget) setBudget(res.data.budget);
          if (res.data.gameMode) setGoal(res.data.gameMode);
          if (Array.isArray(res.data.selectedItemIds)) {
            setPurchasedIds(new Set(res.data.selectedItemIds));
          }
        }
      })
      .catch((err) => console.error('Failed to load upgrade plan:', err));
  }, [profile.identity.username, profile.profile.profileName]);

  const { recommendations, totalCost, remainingBudget, projectedStats } = generateUpgradePlan(
    profile,
    goal,
    budget
  );

  const togglePurchased = (id: string) => {
    const next = new Set(purchasedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setPurchasedIds(next);
  };

  const handleSavePlan = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: profile.identity.username,
          profileName: profile.profile.profileName,
          budget,
          gameMode: goal,
          selectedItemIds: Array.from(purchasedIds),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage('Upgrade plan saved successfully!');
      } else {
        setSaveMessage('Failed to save plan: ' + data.message);
      }
    } catch (e: any) {
      setSaveMessage('Error saving plan: ' + e.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  // Spending on selected/purchased upgrades
  const purchasedCost = recommendations
    .filter((r) => purchasedIds.has(r.id))
    .reduce((sum, r) => sum + r.cost, 0);

  const unpurchasedRecs = recommendations.filter((r) => !purchasedIds.has(r.id));
  const purchasedRecs = recommendations.filter((r) => purchasedIds.has(r.id));

  return (
    <div className="space-y-6">
      {/* Configuration Bar: Budget & Goal */}
      <div className="p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              Interactive Upgrade Optimizer
            </h3>
            <p className="text-xs text-neutral-400">
              Personalized recommendations based on currently owned gear, MP, and your coin budget.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSavePlan}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Plan'}</span>
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
            {saveMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-neutral-800/80">
          {/* Budget Input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Available Coin Budget
            </label>
            <div className="relative">
              <Coins className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Math.max(0, Number(e.target.value) || 0))}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setBudget(profile.currencies.purse)}
                className="text-[11px] px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              >
                Use Current Purse ({formatCoins(profile.currencies.purse)})
              </button>
              <button
                onClick={() => setBudget(50000000)}
                className="text-[11px] px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              >
                50M
              </button>
            </div>
          </div>

          {/* Goal Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Progression Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as PlannerGoal)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-xs font-medium text-white focus:outline-none focus:border-amber-500"
            >
              {Object.entries(GOAL_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-neutral-500 mt-1">
              Curates gear and utility tailored to this game mode.
            </p>
          </div>

          {/* Financial Summary */}
          <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Total Plan Cost:</span>
              <span className="font-mono font-bold text-amber-400">{formatCoins(totalCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Marked as Purchased:</span>
              <span className="font-mono text-emerald-400">{formatCoins(purchasedCost)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-neutral-800">
              <span className="text-neutral-400 font-semibold">Remaining Budget:</span>
              <span
                className={`font-mono font-bold ${
                  remainingBudget > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {formatCoins(remainingBudget)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Projected Stats Comparison */}
      <div className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Projected Player Improvements
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(projectedStats).map(([stat, val]) => (
            <div key={stat} className="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80">
              <div className="text-[11px] text-neutral-400">{stat}</div>
              <div className="text-sm font-bold font-mono text-emerald-300 mt-0.5">{String(val)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Upgrades List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">
            Recommended Action Items ({unpurchasedRecs.length} Pending)
          </h3>
          <span className="text-xs text-neutral-500">
            Click checkbox to mark item as purchased
          </span>
        </div>

        <div className="space-y-2.5">
          {unpurchasedRecs.map((rec) => (
            <div
              key={rec.id}
              onClick={() => togglePurchased(rec.id)}
              className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="mt-0.5 text-neutral-500 hover:text-amber-400 transition-colors"
                >
                  <Circle className="w-5 h-5" />
                </button>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-neutral-100">{rec.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        rec.priority === 'CRITICAL'
                          ? 'bg-red-950 text-red-400 border border-red-800/40'
                          : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                      }`}
                    >
                      {rec.priority}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                      {rec.category}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">{rec.description}</p>
                  <div className="flex items-center gap-3 text-xs text-emerald-400 pt-0.5 font-mono">
                    {Object.entries(rec.statGains).map(([k, v]) => (
                      <span key={k}>
                        {k}: <strong>{String(v)}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right sm:shrink-0 self-end sm:self-center">
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {formatCoins(rec.cost)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Already Purchased / Completed Upgrades */}
      {purchasedRecs.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-neutral-800/80">
          <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400">
            Marked as Purchased ({purchasedRecs.length})
          </h4>
          <div className="space-y-2 opacity-60">
            {purchasedRecs.map((rec) => (
              <div
                key={rec.id}
                onClick={() => togglePurchased(rec.id)}
                className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:opacity-100 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-xs line-through text-neutral-300">
                    {rec.title}
                  </span>
                </div>
                <span className="font-mono text-xs text-neutral-400">{formatCoins(rec.cost)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
