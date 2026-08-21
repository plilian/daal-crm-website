import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

const PUBLIC_PAGES = [{ path: "/", lastModified: "2026-08-21" }] as const;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = getRequestOrigin(request);
        const urls = PUBLIC_PAGES.map(
          ({ path, lastModified }) => `
    <url>
      <loc>${escapeXml(`${origin}${path}`)}</loc>
      <lastmod>${lastModified}</lastmod>
    </url>`,
        ).join("");

        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`,
          {
            headers: {
              "cache-control": "public, max-age=3600",
              "content-type": "application/xml; charset=utf-8",
            },
          },
        );
      },
    },
  },
});

function getRequestOrigin(request: Request) {
  if (SITE_URL) return SITE_URL;

  const requestUrl = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProto =
    request.headers.get("x-forwarded-proto") ?? requestUrl.protocol.slice(0, -1);

  return forwardedHost ? `${forwardedProto}://${forwardedHost}` : requestUrl.origin;
}

function escapeXml(value: string) {
  return value.replace(
    /[<>&'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[character] ?? character,
  );
}
