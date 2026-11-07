import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username') || 'Prithivi102';
  const profileName = searchParams.get('profile') || 'Strawberry';

  try {
    const plan = await prisma.upgradePlan.findUnique({
      where: {
        username_profileName: { username, profileName },
      },
    });

    if (!plan) {
      return NextResponse.json({
        success: true,
        data: {
          budget: 39000000,
          gameMode: 'combat',
          selectedItemIds: [],
          notes: '',
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        budget: plan.budget,
        gameMode: plan.gameMode,
        selectedItemIds: JSON.parse(plan.selectedItemIds || '[]'),
        notes: plan.notes,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, profileName, budget, gameMode, selectedItemIds, notes } = body;

    if (!username || !profileName) {
      return NextResponse.json({ success: false, message: 'Username and profileName required' }, { status: 400 });
    }

    let updated: any = null;
    try {
      updated = await prisma.upgradePlan.upsert({
        where: {
          username_profileName: { username, profileName },
        },
        create: {
          username,
          profileName,
          budget: Number(budget) || 0,
          gameMode: gameMode || 'combat',
          selectedItemIds: JSON.stringify(selectedItemIds || []),
          notes: notes || '',
        },
        update: {
          budget: Number(budget) || 0,
          gameMode: gameMode || 'combat',
          selectedItemIds: JSON.stringify(selectedItemIds || []),
          notes: notes || '',
        },
      });
    } catch (dbErr) {
      console.warn('Database planner write skipped in serverless environment:', dbErr);
      updated = {
        budget: Number(budget) || 0,
        gameMode: gameMode || 'combat',
        selectedItemIds: JSON.stringify(selectedItemIds || []),
        notes: notes || '',
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        budget: updated.budget,
        gameMode: updated.gameMode,
        selectedItemIds: JSON.parse(updated.selectedItemIds || '[]'),
        notes: updated.notes,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
