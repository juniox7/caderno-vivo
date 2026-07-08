import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { DEFAULT_STATS, UserStats } from '@/lib/gamificacao';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  
  const stats = (user.privateMetadata?.gamificacao as UserStats) || DEFAULT_STATS;
  return NextResponse.json(stats);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats: UserStats = await req.json();
    const client = await clerkClient();
    
    // We only update the gamificacao key inside privateMetadata to avoid overwriting quota
    const user = await client.users.getUser(userId);
    
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        gamificacao: stats
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
