import React from 'react';
import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile-service';
import { ArmorView } from '@/components/views/ArmorView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ArmorEquipmentPage({
  params,
}: {
  params: { username: string; profile: string };
}) {
  const profile = await getProfileData(params.username, params.profile);
  if (!profile) notFound();

  return <ArmorView initialProfile={profile} />;
}
