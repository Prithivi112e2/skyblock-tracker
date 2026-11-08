import React from 'react';
import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile-service';
import { InventoryView } from '@/components/views/InventoryView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function InventoryPage({
  params,
}: {
  params: { username: string; profile: string };
}) {
  const profile = await getProfileData(params.username, params.profile);
  if (!profile) notFound();

  return <InventoryView initialProfile={profile} />;
}
