'use client';

import React, { useState } from 'react';
import { FullSkyBlockProfile } from '@/lib/types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function ProfileLayoutClient({
  profile: initialProfile,
  children,
}: {
  profile: FullSkyBlockProfile;
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<FullSkyBlockProfile>(initialProfile);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <Sidebar
        username={profile.identity.username}
        profile={profile.profile.profileName}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col flex-1">
        <Header
          profile={profile}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onProfileUpdated={(updated) => setProfile(updated)}
        />
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
