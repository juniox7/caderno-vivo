import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const pushState: any = user.privateMetadata?.pushState;

    if (pushState && pushState.consecutiveIgnores > 0) {
      // Zerando os ignores porque o usuário abriu o app
      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          pushState: {
            ...pushState,
            consecutiveIgnores: 0,
            frequencyReduced: false // restaura a frequência normal
          }
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
