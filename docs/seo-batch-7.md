# Woodbay Batch 7 SEO map

Production origin: `https://woodbay.vercel.app`

## Audit priorities

- P0: remove the site-wide `noindex`; allow public crawling; publish a complete dynamic sitemap; align product canonicals with catalogue links.
- P1: unique local-intent titles/descriptions for the homepage, catalogue, four divisions, categories and products; Product, BreadcrumbList and Organization data; noindex utility/private routes; permanent redirects for superseded division URLs.
- P2: expand genuinely useful category guidance where product evidence supports it; add verified business contact/address/social fields when supplied; submit the sitemap and monitor coverage in Google Search Console after deployment.

## Keyword-to-page map

| Page | Primary intent | Supporting intent |
| --- | --- | --- |
| `/` | interior products in Kollam | Woodbay Kollam; kitchen, wardrobe and decor products |
| `/products` | furniture accessories in Kollam | interior product catalogue Kollam |
| `/products/kitchen-wardrobe-accessories` | kitchen accessories in Kollam | wardrobe accessories; pantry, pull-out and corner solutions |
| `/products/hardware-fittings` | hardware fittings in Kollam | cabinet hinges; aluminium profiles; furniture handles |
| `/products/smart-furniture` | smart furniture in Kollam | smart table; adaptable desk |
| `/products/home-decor` | home decor products in Kollam | wallpaper, PU panels, mattresses, vertical garden and artificial grass |
| Category pages | `{category} in Kollam` | Woodbay category products; product enquiry |
| Product pages | exact product/model name | product code, category, Woodbay and Kollam context inherited through navigation |
| `/dealers` | Woodbay dealers in Kerala | product availability and local assistance |
| `/contact` | contact Woodbay in Kollam | product, furniture, visit and dealer enquiries |

## Content rules

- Preserve exact catalogue names and codes; never invent specifications, price, stock, reviews, warranties or installation claims.
- Keep one canonical URL per product and exclude search, sort, cart, voucher and admin states from the sitemap.
- FAQs must be visible and useful. Do not add `FAQPage` rich-result markup because Woodbay is not an eligible government or health authority.
- Product data intentionally omits `Offer`, rating and review properties until verified commercial data exists. The schema describes the entity but does not claim rich-result eligibility.
