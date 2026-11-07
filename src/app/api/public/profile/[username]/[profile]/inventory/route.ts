import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string; profile: string } }
) {
  const { username, profile } = params;

  try {
    const snapshot = await prisma.profileSnapshot.findFirst({
      where: {
        username: { equals: username },
        profileName: { equals: profile },
      },
    });

    if (!snapshot) {
      return NextResponse.json(
        { success: false, error: 'PROFILE_NOT_FOUND', message: 'Profile not found' },
        { status: 404 }
      );
    }

    const parsed = JSON.parse(snapshot.parsedData);

    return NextResponse.json(
      {
        success: true,
        schemaVersion: '2.0.0',
        player: parsed.identity,
        profile: parsed.profile,
        equipment: parsed.equipment,
        inventories: parsed.inventories,
        transparency: parsed.transparency,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
