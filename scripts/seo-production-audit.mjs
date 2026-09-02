const origin = (process.argv[2] || "https://woodbay.vercel.app").replace(/\/$/, "");
const decode = (value = "") => value.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/<[^>]*>/g, "").trim();
const match = (html, expression) => decode(html.match(expression)?.[1]);
const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
const sitemapXml = await sitemapResponse.text();
const urls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((item) => decode(item[1]));
const uniqueUrls = [...new Set(urls)];

async function inspect(url) {
  try {
    const response = await fetch(url, { redirect: "manual" });
    const html = await response.text();
    const robots = match(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)/i);
    const canonical = match(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i);
    const description = match(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i);
    const title = match(html, /<title>(.*?)<\/title>/is);
    const h1s = [...html.matchAll(/<h1\b[^>]*>(.*?)<\/h1>/gis)].map((item) => decode(item[1]));
    const links = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)].map((item) => item[1]);
    const schemas = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis)].map((item) => {
      try { return JSON.parse(item[1]); } catch { return { invalid: true }; }
    });
    return { url, status: response.status, location: response.headers.get("location"), title, description, robots, canonical, h1s, links, schemas };
  } catch (error) {
    return { url, status: 0, error: String(error), title: "", description: "", robots: "", canonical: "", h1s: [], links: [], schemas: [] };
  }
}

const results = [];
for (let index = 0; index < uniqueUrls.length; index += 10) {
  results.push(...await Promise.all(uniqueUrls.slice(index, index + 10).map(inspect)));
}

const duplicateValues = (field) => Object.entries(Object.groupBy(results.filter((row) => row[field]), (row) => row[field])).filter(([, rows]) => rows.length > 1).map(([value, rows]) => ({ value, urls: rows.map((row) => row.url) }));
const pathname = (url) => new URL(url).pathname;
const counts = { static: 0, divisions: 0, categories: 0, products: 0, dealers: 0 };
for (const url of uniqueUrls) {
  const parts = pathname(url).split("/").filter(Boolean);
  if (parts[0] === "products" && parts.length === 2) counts.divisions++;
  else if (parts[0] === "products" && parts.length === 3) counts.categories++;
  else if (parts[0] === "products" && parts.length >= 4) counts.products++;
  else if (parts[0] === "dealers" && parts.length === 2 && parts[1] !== "become-a-dealer") counts.dealers++;
  else counts.static++;
}

const forbidden = uniqueUrls.filter((url) => !url.startsWith(origin) || /localhost|\.vercel\.app(?!(?:\/|$))|\/admin(?:\/|$)|\/cart(?:\/|$)|\/redeem(?:\/|$)|\/api(?:\/|$)|[?&](?:code|voucher)=/i.test(url.replace(origin, "")));
const failures = results.filter((row) => row.status !== 200 || /noindex/i.test(row.robots) || row.canonical !== row.url || row.h1s.length !== 1);
const invalidSchemas = results.flatMap((row) => row.schemas.filter((schema) => schema.invalid).map(() => row.url));
const schemaTypes = Object.fromEntries(results.map((row) => [row.url, row.schemas.map((schema) => schema["@type"]).filter(Boolean)]).filter(([, types]) => types.length));
const linkedUrls = new Set(results.flatMap((row) => row.links.flatMap((href) => {
  try {
    const url = new URL(href, row.url);
    if (url.origin !== origin) return [];
    url.hash = "";
    url.search = "";
    return [url.toString().replace(/\/$/, "") || origin];
  } catch { return []; }
})));
const productUrls = uniqueUrls.filter((url) => pathname(url).split("/").filter(Boolean).length >= 4 && pathname(url).startsWith("/products/"));
const orphanedProducts = productUrls.filter((url) => !linkedUrls.has(url));
const linkTargets = [...linkedUrls].filter((url) => !uniqueUrls.includes(url));
const linkChecks = [];
for (let index = 0; index < linkTargets.length; index += 10) linkChecks.push(...await Promise.all(linkTargets.slice(index, index + 10).map(inspect)));

const report = {
  auditedAt: new Date().toISOString(), origin,
  sitemap: { status: sitemapResponse.status, total: urls.length, unique: uniqueUrls.length, duplicateUrls: urls.length - uniqueUrls.length, counts, forbidden },
  consistency: { failures, missingTitles: results.filter((row) => !row.title).map((row) => row.url), missingDescriptions: results.filter((row) => !row.description).map((row) => row.url), duplicateTitles: duplicateValues("title"), duplicateDescriptions: duplicateValues("description"), invalidSchemas },
  links: { checked: linkChecks.length, broken: linkChecks.filter((row) => row.status >= 400 || row.status === 0).map((row) => ({ url: row.url, status: row.status })), redirected: linkChecks.filter((row) => row.status >= 300 && row.status < 400).map((row) => ({ url: row.url, status: row.status, location: row.location })), orphanedProducts },
  schemaTypes,
};
console.log(JSON.stringify(report, null, 2));
if (!sitemapResponse.ok || forbidden.length || failures.length || invalidSchemas.length || report.links.broken.length || orphanedProducts.length) process.exitCode = 1;
