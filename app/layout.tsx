import type { Metadata } from "next";
import { Nunito, Baloo_2 } from "next/font/google";
import { ThemeProvider } from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { Toaster } from "sonner";
import CheckoutInterceptor from "@/components/CheckoutInterceptor";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CadernoVivo — Atividades Personalizadas por IA para seu filho",
  description:
    "Combata o excesso de telas! Gere cadernos de atividades educativas personalizados com inteligência artificial. Prontos para imprimir em casa. Feito para pais, mães e professores.",
  keywords: [
    "atividades infantis",
    "caderno de atividades",
    "educação infantil",
    "IA educacional",
    "impressão em casa",
    "redução de telas",
    "personalização",
  ],
  authors: [{ name: "CadernoVivo" }],
  openGraph: {
    title: "CadernoVivo — Menos tela. Mais diversão impressa.",
    description:
      "Gere atividades educativas personalizadas com IA para seu filho. Prontas para imprimir!",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR}>
      <html
        lang="pt-BR"
        className={`${nunito.variable} ${baloo.variable} h-full antialiased`}
      >
        <body
          className="min-h-full flex flex-col transition-colors duration-300"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <CheckoutInterceptor />
            {children}
            <Toaster position="top-right" richColors closeButton />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
