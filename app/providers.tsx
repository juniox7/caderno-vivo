"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import { GamificacaoProvider } from "@/components/GamificacaoProvider";
import { PostHogProvider } from "@/components/PostHogProvider";
import { CrispChat } from "@/components/CrispChat";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <GamificacaoProvider>{children}</GamificacaoProvider>;
  }

  return (
    <PostHogProvider>
      <GamificacaoProvider>
        <CrispChat />
        <NextThemesProvider {...props}>{children}</NextThemesProvider>
      </GamificacaoProvider>
    </PostHogProvider>
  );
}
