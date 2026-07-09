import { NextResponse } from "next/server";

// Mapa em memória para armazenar o histórico de requisições por IP
// Nota: Em Serverless (Vercel), esse mapa é resetado frequentemente, mas ainda assim
// previne surtos (bursts) repentinos de requisições maliciosas.
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  const windowStart = now - windowMs;

  const requestTimestamps = rateLimitMap.get(ip) || [];
  
  // Limpa requisições que já saíram da janela de tempo
  const recentRequests = requestTimestamps.filter((timestamp: number) => timestamp > windowStart);
  
  if (recentRequests.length >= limit) {
    return false; // Bloquear
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  
  return true; // Permitir
}

export function applyRateLimit(ip: string, limit = 10, windowMs = 60000) {
    if (!checkRateLimit(ip, limit, windowMs)) {
        return NextResponse.json(
          { error: "Você atingiu o limite de requisições. Por favor, aguarde alguns instantes e tente novamente." },
          { status: 429 }
        );
    }
    return null; // OK
}
