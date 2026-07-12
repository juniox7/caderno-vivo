import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Configura o Upstash Redis
// Fallback para mock caso falte credenciais no ambiente (evita quebra de build)
const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Cache the ratelimiters
const ratelimiters = new Map<string, Ratelimit>();

function getRatelimit(limit: number, windowSeconds: number): Ratelimit | null {
  if (!redis) return null; // Sem Redis configurado = sem rate limit

  const key = `${limit}_${windowSeconds}s`;
  if (!ratelimiters.has(key)) {
    ratelimiters.set(
      key,
      new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
        analytics: true,
      })
    );
  }
  return ratelimiters.get(key)!;
}

export async function checkRateLimit(ip: string, limit: number, windowMs: number) {
  const windowSeconds = Math.max(1, Math.floor(windowMs / 1000));
  const ratelimit = getRatelimit(limit, windowSeconds);
  
  if (!ratelimit) return true; // Fail open se não tiver Redis

  try {
    const { success } = await ratelimit.limit(`ratelimit_${ip}`);
    return success; // Permite se success for true
  } catch (error) {
    console.error("Erro no Rate Limit (Redis):", error);
    return true; // Fail open em caso de erro na conexão
  }
}

export async function applyRateLimit(ip: string, limit = 10, windowMs = 60000) {
  const allowed = await checkRateLimit(ip, limit, windowMs);
  
  if (!allowed) {
    return NextResponse.json(
      { error: "Você atingiu o limite de requisições. Por favor, aguarde alguns instantes e tente novamente." },
      { status: 429 }
    );
  }
  return null; // OK
}
