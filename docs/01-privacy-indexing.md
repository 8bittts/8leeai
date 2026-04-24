# Privacy And Indexing Policy

This site is intentionally public but non-indexable. It should be reachable by direct URL and blocked from search indexing, search snippets, crawler caches, image indexing, and compliant AI crawler collection.

## Required Controls

- `app/robots.ts` must disallow `/` for every user agent.
- `app/layout.tsx` must keep `robots.index` and `robots.follow` false and keep `noarchive`, `nosnippet`, `noimageindex`, and `nocache` enabled for generic robots and Googlebot.
- `proxy.ts` must set `X-Robots-Tag` on every response.
- `next.config.ts` must set the same `X-Robots-Tag` on the root route.
- The app must not emit sitemap routes, structured data, OpenGraph metadata, Twitter cards, keyword metadata, meta descriptions, or public resume/CV assets.

## Validation

Run these before shipping any indexing, metadata, routing, middleware, or deploy change:

```bash
bun run check:full
curl -I https://8lee.ai
curl https://8lee.ai/robots.txt
```

Expected response posture:

- `robots.txt` contains `User-agent: *` and `Disallow: /`.
- Every HTML response includes `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex, nocache`.
- The rendered HTML contains no OpenGraph, Twitter card, JSON-LD, sitemap, keyword metadata, or meta description.

## Limits

These controls are the strongest compliant-crawler posture available from the app. They cannot force non-compliant crawlers or third parties to delete content that they copied before seeing the current directives.
