import { auth, clerkClient } from '@clerk/nextjs/server';

export type ActivityType = 'texto' | 'caca_palavras' | 'labirinto' | 'imagem' | 'forca' | 'memoria';

export const PLAN_LIMITS = {
  FREE: { texto: 5, caca_palavras: 2, labirinto: 2, forca: 2, memoria: 2, imagem: 0 },
  BASIC: { texto: 30, caca_palavras: 15, labirinto: 15, forca: 15, memoria: 15, imagem: 2 },
  PREMIUM: { texto: 100, caca_palavras: 50, labirinto: 50, forca: 50, memoria: 50, imagem: 999999 },
  TURBO: { texto: 999999, caca_palavras: 999999, labirinto: 999999, forca: 999999, memoria: 999999, imagem: 999999 },
};

type PlanTier = keyof typeof PLAN_LIMITS;

export async function checkAndIncrementQuota(type: ActivityType = 'texto') {
  const { userId } = await auth();

  if (!userId) {
    return { allowed: false, error: 'Unauthorized', status: 401 };
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  // Read plan from publicMetadata (set by webhook) or default to FREE
  const planTier = (user.publicMetadata?.plan_tier as PlanTier) || 'FREE';
  const limits = PLAN_LIMITS[planTier] || PLAN_LIMITS.FREE;
  const limitForType = limits[type];

  // Se o plano não permite nenhuma geração desse tipo
  if (limitForType === 0) {
    return { allowed: false, error: 'Payment Required', status: 403 };
  }

  // Read usage from privateMetadata
  let { usage_counts = { texto: 0, caca_palavras: 0, labirinto: 0, imagem: 0 }, last_generation_reset } = user.privateMetadata as {
    usage_counts?: Record<ActivityType, number>;
    last_generation_reset?: string;
  };

  const now = new Date();
  
  // If no reset date or it's older than 30 days, reset the count
  if (!last_generation_reset) {
    usage_counts = { texto: 0, caca_palavras: 0, labirinto: 0, imagem: 0 };
    last_generation_reset = now.toISOString();
  } else {
    const lastReset = new Date(last_generation_reset);
    const diffTime = Math.abs(now.getTime() - lastReset.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays >= 30) {
      usage_counts = { texto: 0, caca_palavras: 0, labirinto: 0, imagem: 0 };
      last_generation_reset = now.toISOString();
    }
  }

  const currentCount = usage_counts[type] || 0;

  if (currentCount >= limitForType) {
    return { allowed: false, error: 'Payment Required', status: 403 };
  }

  // Increment usage
  usage_counts[type] = currentCount + 1;

  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      ...user.privateMetadata,
      usage_counts,
      last_generation_reset,
    },
  });

  return { allowed: true };
}
