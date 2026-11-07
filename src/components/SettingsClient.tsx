'use client';

import React, { useState, useEffect } from 'react';
import { Key, Shield, ShieldCheck, AlertCircle, Save, Trash2, CheckCircle2 } from 'lucide-react';

export function SettingsClient() {
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [keySource, setKeySource] = useState('NOT_SET');
  const [statusMessage, setStatusMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setIsConfigured(res.isConfigured);
          setKeySource(res.source);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusMessage({ text: data.message || 'Failed to save key', error: true });
      } else {
        setStatusMessage({ text: data.message });
        setIsConfigured(data.isConfigured);
        setApiKey('');
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Network error', error: true });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveKey = async () => {
    if (!confirm('Are you sure you want to remove the configured Hypixel API key?')) return;
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: '' }),
      });
      const data = await res.json();
      setStatusMessage({ text: 'API key removed.' });
      setIsConfigured(false);
      setKeySource('NOT_SET');
    } catch (err: any) {
      setStatusMessage({ text: err.message, error: true });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Security Status Box */}
      <div className="p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isConfigured ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Hypixel Official API Authentication</h3>
              <p className="text-xs text-neutral-400">Server-side secure request credentials</p>
            </div>
          </div>

          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
            isConfigured ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' : 'bg-neutral-800 text-neutral-400 border-neutral-700'
          }`}>
            {isConfigured ? 'ACTIVE KEY CONFIGURED' : 'NO API KEY SET'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-neutral-400">Key Status:</span>
            <span className="font-semibold text-neutral-200">
              {isConfigured ? 'Available for Live Hypixel API Calls' : 'Missing (Live refresh unavailable)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Active Storage Location:</span>
            <span className="font-mono text-neutral-300">{keySource}</span>
          </div>
        </div>

        {statusMessage && (
          <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
            statusMessage.error ? 'bg-red-950/40 border border-red-800/60 text-red-300' : 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
          }`}>
            {statusMessage.error ? <AlertCircle className="w-4 h-4 text-red-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Set / Update API Key Form */}
        <form onSubmit={handleSaveKey} className="space-y-3 pt-2 border-t border-neutral-800">
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            {isConfigured ? 'Update Hypixel API Key' : 'Configure Hypixel API Key'}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste key (e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSaving || !apiKey.trim()}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Key'}</span>
            </button>
            {isConfigured && (
              <button
                type="button"
                onClick={handleRemoveKey}
                disabled={isSaving}
                className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-red-950/60 text-neutral-400 hover:text-red-300 border border-neutral-700 hover:border-red-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>
          <p className="text-[11px] text-neutral-500">
            You can obtain your personal developer API key from the official Hypixel Developer Dashboard at{' '}
            <a
              href="https://developer.hypixel.net/"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:underline"
            >
              developer.hypixel.net
            </a>
            . Your key is kept server-side only and is never exposed in browser bundles or public JSON responses.
          </p>
        </form>
      </div>

      {/* Security Architecture Guidelines */}
      <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Security Architecture & Protections
        </h4>
        <ul className="text-xs text-neutral-400 space-y-2 list-disc pl-5">
          <li>
            <strong>Environment Variable Precedence:</strong> When <code className="text-amber-300">HYPIXEL_API_KEY</code> is defined in server environment variables or <code className="text-amber-300">.env</code>, it takes priority.
          </li>
          <li>
            <strong>Public Isolation:</strong> Public profile endpoints (<code className="text-neutral-300">/share/...</code> and <code className="text-neutral-300">/api/public/...</code>) never return secrets or internal database credentials.
          </li>
          <li>
            <strong>Graceful Error Handling:</strong> If the official API is rate-limited or the key is invalid, the system displays honest errors without inventing placeholder or fake player stats.
          </li>
        </ul>
      </div>
    </div>
  );
}
