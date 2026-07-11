"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import { GamificacaoProvider } from "@/components/GamificacaoProvider";

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
    <GamificacaoProvider>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </GamificacaoProvider>
  );
}
