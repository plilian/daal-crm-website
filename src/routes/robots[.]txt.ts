import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

const PRIVATE_PATHS = ["/api/"] as const;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = getRequestOrigin(request);
        const disallowRules = PRIVATE_PATHS.map((path) => `Disallow: ${path}`).join("\n");

        return new Response(
          `User-agent: *
Allow: /
${disallowRules}

Sitemap: ${origin}/sitemap.xml
`,
          {
            headers: {
              "cache-control": "public, max-age=3600",
              "content-type": "text/plain; charset=utf-8",
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
