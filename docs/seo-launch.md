# Woodbay SEO launch status

Last audited: 2 September 2026

## Current production

- Canonical origin: `https://woodbay.vercel.app`
- Sitemap: `https://woodbay.vercel.app/sitemap.xml`
- Sitemap inventory: 130 unique URLs — 10 static, 4 divisions, 40 categories/subcategories, 76 products
- Search Console property: deferred by Woodbay until the custom domain is purchased and connected
- Sitemap submission and URL inspection: not performed

## Priority search targets

- Kitchen accessories Kollam → `/products/kitchen-wardrobe-accessories`
- Wardrobe accessories Kollam → `/products/kitchen-wardrobe-accessories`
- Hardware fittings / aluminium profiles Kollam → `/products/hardware-fittings`
- Home decor, wallpaper, PU panels, pocket spring mattress, vertical garden and artificial grass Kollam → relevant `/products/home-decor/...` pages

## Production audit baseline

- All 76 published product URLs return indexable, self-canonical pages with unique titles and descriptions.
- Product pages contain Organization, Product and BreadcrumbList JSON-LD without price, Offer, rating, review or availability claims.
- Cart and voucher verification are `noindex`; admin routes are protected and `noindex`.
- Four legacy division paths use one-hop permanent redirects.
- Missing product routes are resolved before streaming so they return a true 404.
- Initial mobile Lighthouse: homepage 89/100 (LCP 3.3 s, CLS 0, TBT 150 ms); Home Decor 92/100 (2.8 s, 0, 160 ms); product 86/92 (2.9 s, 0, 190 ms); PU Panels 96/92 (2.6 s, 0, 100 ms); Wallpaper 95/92 (2.5 s, 0, 150 ms). Dynamic SEO scores reflected streamed metadata; metadata is now forced into initial HTML for deterministic crawler validation.

## Custom-domain gate

Do not change the canonical origin casually: printed voucher QR codes currently use `woodbay.vercel.app`. A custom-domain launch requires domain verification, one-hop redirects from the Vercel hostname where supported, canonical and sitemap updates, a Search Console property, sitemap submission, representative URL inspections, and an explicit QR compatibility plan.

## Client information still required

- Official business name
- Full public address
- Public phone
- WhatsApp number if different
- Public email
- Google Maps / Google Business Profile URL
- Opening hours
- Instagram URL
- Facebook URL
- YouTube URL, if applicable
- Confirmed service area

Until these facts are supplied and reconciled, keep Organization schema and do not publish speculative LocalBusiness data.
