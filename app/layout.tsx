import type { Metadata } from "next";
import { Nunito, Baloo_2 } from "next/font/google";
import { ThemeProvider } from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { Toaster } from "sonner";
import Script from "next/script";
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
            {children}
            <Toaster position="top-right" richColors closeButton />
          </ThemeProvider>
          
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1489450116541113');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=1489450116541113&ev=PageView&noscript=1"
              alt=""
            />
          </noscript>
        </body>
      </html>
    </ClerkProvider>
  );
}
