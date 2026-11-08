import React from 'react';
import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile-service';
import { OverviewView } from '@/components/views/OverviewView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OverviewPage({
  params,
}: {
  params: { username: string; profile: string };
}) {
  const profile = await getProfileData(params.username, params.profile);
  if (!profile) notFound();

  return <OverviewView initialProfile={profile} />;
}
