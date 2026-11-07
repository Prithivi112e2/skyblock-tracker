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
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
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
