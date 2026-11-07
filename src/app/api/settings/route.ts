import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const envKey = process.env.HYPIXEL_API_KEY;
  let hasDbKey = false;

  try {
    const config = await prisma.appConfig.findUnique({
      where: { key: 'HYPIXEL_API_KEY' },
    });
    hasDbKey = Boolean(config?.value && config.value.trim() !== '');
  } catch (e) {
    // ignore
  }

  const isConfigured = Boolean((envKey && envKey.trim() !== '') || hasDbKey);
  const source = envKey && envKey.trim() !== '' ? 'ENVIRONMENT_VARIABLE' : hasDbKey ? 'LOCAL_DATABASE' : 'NOT_SET';

  return NextResponse.json({
    success: true,
    isConfigured,
    source,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiKey = body.apiKey?.trim();

    if (!apiKey) {
      // Remove key
      await prisma.appConfig.deleteMany({
        where: { key: 'HYPIXEL_API_KEY' },
      });
      return NextResponse.json({
        success: true,
        message: 'Hypixel API Key removed.',
        isConfigured: false,
      });
    }

    // Validate Hypixel API key format (usually a 36-char UUID or 32-char hex)
    if (apiKey.length < 30) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid Hypixel API Key format. A valid Hypixel API Key is a 36-character UUID from developer.hypixel.net.',
        },
        { status: 400 }
      );
    }

    await prisma.appConfig.upsert({
      where: { key: 'HYPIXEL_API_KEY' },
      create: {
        key: 'HYPIXEL_API_KEY',
        value: apiKey,
      },
      update: {
        value: apiKey,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Hypixel API Key saved securely in local database configuration.',
      isConfigured: true,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
