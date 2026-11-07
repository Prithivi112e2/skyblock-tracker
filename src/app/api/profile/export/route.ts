import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username') || 'Prithivi102';
  const profileName = searchParams.get('profile') || 'Strawberry';

  try {
    const snapshot = await prisma.profileSnapshot.findFirst({
      where: {
        username: { equals: username },
        profileName: { equals: profileName },
      },
    });

    if (!snapshot) {
      return NextResponse.json({ success: false, message: 'Profile not found' }, { status: 404 });
    }

    const plan = await prisma.upgradePlan.findUnique({
      where: {
        username_profileName: { username, profileName },
      },
    });

    const parsedProfile = JSON.parse(snapshot.parsedData);

    const exportData = {
      exportVersion: '2.0.0',
      exportedAt: new Date().toISOString(),
      source: snapshot.source,
      profile: parsedProfile,
      upgradePlan: plan ? {
        budget: plan.budget,
        gameMode: plan.gameMode,
        selectedItemIds: JSON.parse(plan.selectedItemIds || '[]'),
        notes: plan.notes,
      } : null,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${username}_${profileName}_backup.json"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
