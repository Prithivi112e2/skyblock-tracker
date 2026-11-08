import { NextRequest, NextResponse } from 'next/server';
import { getProfileData, clearMemoryCache } from '@/lib/profile-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, profileName } = body;

    if (!username) {
      return NextResponse.json({ success: false, message: 'Username is required' }, { status: 400 });
    }

    // Force clear memory cache for this profile so fresh fetch is guaranteed
    clearMemoryCache(username, profileName);

    const freshProfile = await getProfileData(username, profileName, { forceRefresh: true });

    if (!freshProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'PROFILE_NOT_FOUND',
          message: `Unable to retrieve profile for ${username} (${profileName || 'active'}).`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Profile refreshed from live Hypixel API v2',
        data: freshProfile,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (err: any) {
    console.error('Refresh profile error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.error || 'HYPIXEL_FETCH_ERROR',
        message: err.message || 'Failed to fetch from Hypixel API',
      },
      { status: err.status || 500 }
    );
  }
}
