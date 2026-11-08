import { NextRequest, NextResponse } from 'next/server';
import { getProfileData } from '@/lib/profile-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string; profile: string } }
) {
  const { username, profile } = params;

  try {
    const data = await getProfileData(username, profile);

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'PROFILE_NOT_FOUND',
          message: `No profile snapshot found for ${username} with profile ${profile}.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        schemaVersion: '2.0.0',
        dataSource: data.transparency.dataSource,
        lastUpdated: data.transparency.lastUpdated,
        data,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: err.message },
      { status: 500 }
    );
  }
}
