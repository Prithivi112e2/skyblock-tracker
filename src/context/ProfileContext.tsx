'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FullSkyBlockProfile } from '@/lib/types';

export type SyncStatus = 'live' | 'updating' | 'stale' | 'error';

interface ProfileContextType {
  profile: FullSkyBlockProfile;
  setProfile: React.Dispatch<React.SetStateAction<FullSkyBlockProfile>>;
  isRefreshing: boolean;
  lastUpdated: Date;
  secondsAgo: number;
  syncStatus: SyncStatus;
  statusMessage: { text: string; error?: boolean } | null;
  refreshNow: (force?: boolean) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({
  initialProfile,
  children,
}: {
  initialProfile: FullSkyBlockProfile;
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<FullSkyBlockProfile>(initialProfile);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('live');
  const [statusMessage, setStatusMessage] = useState<{ text: string; error?: boolean } | null>(null);

  // Keep initialProfile in sync if server props change
  useEffect(() => {
    if (initialProfile) {
      setProfile((prev) => {
        // If server profile is newer than or different from prev, update it
        if (!prev || initialProfile.transparency.lastUpdated !== prev.transparency.lastUpdated) {
          return initialProfile;
        }
        return prev;
      });
    }
  }, [initialProfile]);

  // Live timer for seconds ago
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  // Refresh function
  const refreshNow = useCallback(
    async (force: boolean = false) => {
      if (isRefreshing) return;
      setIsRefreshing(true);
      setSyncStatus('updating');
      setStatusMessage(null);

      try {
        const res = await fetch('/api/profile/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: profile.identity.username,
            profileName: profile.profile.profileName,
            forceRefresh: force,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setSyncStatus('error');
          setStatusMessage({
            text: data.message || 'Failed to refresh from Hypixel API.',
            error: true,
          });
        } else if (data.data) {
          setProfile(data.data);
          setLastUpdated(new Date());
          setSecondsAgo(0);
          setSyncStatus('live');
          setStatusMessage({
            text: `Synced with official Hypixel API (${data.data.transparency.apiLatencyMs || 0}ms)`,
          });
        }
      } catch (err: any) {
        setSyncStatus('error');
        setStatusMessage({
          text: err.message || 'Network error communicating with refresh server',
          error: true,
        });
      } finally {
        setIsRefreshing(false);
        setTimeout(() => setStatusMessage(null), 5000);
      }
    },
    [profile.identity.username, profile.profile.profileName, isRefreshing]
  );

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
            setProfile(data.data);
            setLastUpdated(new Date());
            setSecondsAgo(0);
            setSyncStatus('live');
          }
        } else {
          if (isMounted) setSyncStatus('stale');
        }
      } catch (e) {
        if (isMounted) setSyncStatus('stale');
      }
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [profile.identity.username, profile.profile.profileName]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        isRefreshing,
        lastUpdated,
        secondsAgo,
        syncStatus,
        statusMessage,
        refreshNow,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextType {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
