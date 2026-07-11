import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { subscription, timezone } = await req.json();
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Salva ou atualiza a inscrição e o estado
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        pushSubscription: subscription,
        pushTimezone: timezone || 'America/Sao_Paulo',
        pushState: {
          lastNotificationSentAt: null,
          consecutiveIgnores: 0,
          lastTextSent: null,
          frequencyReduced: false
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
