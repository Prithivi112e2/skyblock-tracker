'use client';

import React, { useState, useRef } from 'react';
import { FullSkyBlockProfile } from '@/lib/types';
import { Download, Upload, CheckCircle2, AlertTriangle, FileJson, X } from 'lucide-react';

export function ImportExportModal({
  profile,
  onClose,
  onImportSuccess,
}: {
  profile: FullSkyBlockProfile;
  onClose: () => void;
  onImportSuccess: (newProfile: FullSkyBlockProfile) => void;
}) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importJsonText, setImportJsonText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const username = profile.identity.username;
  const profileName = profile.profile.profileName;

  const handleDownloadBackup = () => {
    window.location.href = `/api/profile/export?username=${encodeURIComponent(username)}&profile=${encodeURIComponent(profileName)}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setImportJsonText(text);
        validateAndPreview(text);
      } catch (err: any) {
        setErrorMessage('Failed to read file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const validateAndPreview = (text: string) => {
    setErrorMessage(null);
    setParsedPreview(null);
    try {
      const parsed = JSON.parse(text);

      let targetUser = '';
      let targetProfile = '';
      let skillsCount = 0;
      let networth = 0;

      if (parsed.profile?.identity) {
        targetUser = parsed.profile.identity.username;
        targetProfile = parsed.profile.profile.profileName;
        skillsCount = parsed.profile.skills?.list?.length || 0;
        networth = parsed.profile.networth?.total || 0;
      } else if (parsed.username) {
        targetUser = parsed.username;
        targetProfile = parsed.profile || 'Strawberry';
        skillsCount = parsed.skills?.length || 0;
        networth = parsed.networth || parsed.purse || 0;
      } else {
        throw new Error('Missing player identity or profile information in JSON.');
      }

      setParsedPreview({
        username: targetUser,
        profile: targetProfile,
        skillsCount,
        networth,
        source: 'Imported JSON Snapshot',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid JSON format');
    }
  };

  const handleExecuteImport = async () => {
    if (!importJsonText.trim()) return;

    setIsImporting(true);
    setErrorMessage(null);

    try {
      const parsed = JSON.parse(importJsonText);
      const res = await fetch('/api/profile/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Import failed');
      }

      onImportSuccess(result.profile);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Import failed');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-6 text-neutral-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <FileJson className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-lg text-white">Import & Export Profile</h3>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 mb-5">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'export'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Export Backup
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'import'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Import JSON Backup
          </button>
        </div>

        {activeTab === 'export' ? (
          <div className="space-y-4">
            <p className="text-xs text-neutral-400">
              Download a complete JSON snapshot of {username} ({profileName}) including all skills, gear, inventories, networth, and upgrade planner progress.
            </p>

            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-400">Player:</span>
                <span className="font-semibold text-neutral-200">{username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Profile:</span>
                <span className="font-semibold text-amber-300">{profileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Networth:</span>
                <span className="font-semibold text-emerald-400 font-mono">
                  {(profile.networth.total / 1e6).toFixed(2)}M coins
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Data Origin:</span>
                <span className="font-semibold text-neutral-300">{profile.transparency.provenance}</span>
              </div>
            </div>

            <button
              onClick={handleDownloadBackup}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Complete Backup (.json)</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-neutral-400">
              Upload a previously exported tracker profile or paste JSON data below. Changes are previewed before saving.
            </p>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload JSON File</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={importJsonText}
              onChange={(e) => {
                setImportJsonText(e.target.value);
                validateAndPreview(e.target.value);
              }}
              placeholder="Or paste JSON payload here..."
              className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 focus:outline-none focus:border-amber-500"
            />

            {/* Error state */}
            {errorMessage && (
              <div className="p-2.5 rounded bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Preview State */}
            {parsedPreview && (
              <div className="p-3 rounded-lg bg-neutral-950 border border-emerald-500/40 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Valid Profile JSON Preview</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Target Username:</span>
                  <span className="font-semibold text-white">{parsedPreview.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Profile Name:</span>
                  <span className="font-semibold text-amber-300">{parsedPreview.profile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Skills Tracked:</span>
                  <span className="font-semibold text-neutral-200">{parsedPreview.skillsCount} skills</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Networth:</span>
                  <span className="font-semibold text-emerald-400 font-mono">
                    {(parsedPreview.networth / 1e6).toFixed(2)}M
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleExecuteImport}
              disabled={!parsedPreview || isImporting}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs transition-colors"
            >
              {isImporting ? 'Importing...' : 'Confirm & Import Profile'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
