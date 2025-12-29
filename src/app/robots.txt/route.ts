// app/robots.txt/route.ts
export async function GET() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://connectinfinity.app';
  
  const robotsTxt = `
User-agent: *
Allow: /

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml

# Disallow private pages
Disallow: /admin
Disallow: /onboarding
Disallow: /profile
  `.trim();

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}