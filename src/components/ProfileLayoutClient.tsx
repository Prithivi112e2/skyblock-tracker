'use client';

import React, { useState } from 'react';
import { FullSkyBlockProfile } from '@/lib/types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ProfileProvider, useProfile } from '@/context/ProfileContext';

function ProfileLayoutContent({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
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
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export function ProfileLayoutClient({
  profile,
  children,
}: {
  profile: FullSkyBlockProfile;
  children: React.ReactNode;
}) {
  return (
    <ProfileProvider initialProfile={profile}>
      <ProfileLayoutContent>{children}</ProfileLayoutContent>
    </ProfileProvider>
  );
}
