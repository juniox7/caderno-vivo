"use client";

import { useEffect } from "react";

export const CrispChat = () => {
  useEffect(() => {
    // Evita carregar o chat multiplas vezes ou em ambientes onde a janela não existe
    if (typeof window === "undefined" || (window as any).$crisp) return;

    // Apenas carrega se tivermos o ID do Website
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
    if (!websiteId) return;

    // Configuração inicial do Crisp
    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = websiteId;

    (() => {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = true;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
  }, []);

  return null;
};
