import { NextRequest, NextResponse } from 'next/server';
import { getProfileData } from '@/lib/profile-service';

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string; profile: string } }
) {
  const { username, profile } = params;

  try {
    const data = await getProfileData(username, profile);

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'PROFILE_NOT_FOUND', message: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        schemaVersion: '2.0.0',
        player: data.identity,
        profile: data.profile,
        equipment: data.equipment,
        inventories: data.inventories,
        transparency: data.transparency,
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
