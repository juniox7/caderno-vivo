import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://caderno-vivo.vercel.app'; // Atualize para cadernovivo.com se usar domínio personalizado

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/amostra', '/instalar', '/privacidade', '/termos'],
      disallow: ['/dashboard', '/criar', '/perfil', '/api'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
