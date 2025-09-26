
const URL = 'https://staxmap.com';

function generateSiteMap() {
  const routes = ['', '/radar', '/learn', '/sitemap'];
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
     ${routes
       .map((route) => {
         return `
       <url>
           <loc>${`${URL}${route}`}</loc>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}
 
export async function GET() {
    const body = generateSiteMap();

    return new Response(body, {
        status: 200,
        headers: {
            'Cache-control': 'public, s-maxage=86400, stale-while-revalidate',
            'content-type': 'application/xml',
        },
    });
}
