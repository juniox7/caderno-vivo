import { auth, clerkClient } from '@clerk/nextjs/server';

export const PLAN_LIMITS = {
  FREE: 5,
  BASIC: 30,
  PREMIUM: 100,
  TURBO: 999999, // Basicamente ilimitado
};

type PlanTier = keyof typeof PLAN_LIMITS;

export async function checkAndIncrementQuota() {
  const { userId } = await auth();

  if (!userId) {
    return { allowed: false, error: 'Unauthorized', status: 401 };
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  // Read plan from publicMetadata (set by webhook) or default to FREE
  const planTier = (user.publicMetadata?.plan_tier as PlanTier) || 'FREE';
  const limit = PLAN_LIMITS[planTier] || PLAN_LIMITS.FREE;

  // Read usage from privateMetadata
  let { generations_count = 0, last_generation_reset } = user.privateMetadata as {
    generations_count?: number;
    last_generation_reset?: string;
  };

  const now = new Date();
  
  // If no reset date or it's older than 30 days, reset the count
  if (!last_generation_reset) {
    generations_count = 0;
    last_generation_reset = now.toISOString();
  } else {
    const lastReset = new Date(last_generation_reset);
    const diffTime = Math.abs(now.getTime() - lastReset.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays >= 30) {
      generations_count = 0;
      last_generation_reset = now.toISOString();
    }
  }

  if (generations_count >= limit) {
    return { allowed: false, error: 'Payment Required', status: 403 };
  }

  // Increment usage
  const newCount = generations_count + 1;

  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      ...user.privateMetadata,
      generations_count: newCount,
      last_generation_reset,
    },
  });

  return { allowed: true };
}
