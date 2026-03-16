#!/usr/bin/env node
// Generates a static sitemap.xml from the vocabulary data.
// Run: node scripts/generate-sitemap.js
// Output: public/sitemap.xml

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Import data by evaluating the JS files (they use named exports)
// We'll parse the data directly instead
const categoriesFile = readFileSync(resolve(ROOT, "src/data/categories.js"), "utf-8");

// Extract category IDs from the categories file
const catIdRegex = /id:\s*"([^"]+)"/g;
const categoryIds = [];
let match;
while ((match = catIdRegex.exec(categoriesFile)) !== null) {
  categoryIds.push(match[1]);
}

const DOMAIN = "https://workplacevocab.com";
const today = new Date().toISOString().split("T")[0];

const staticPages = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.6", changefreq: "monthly" },
  { path: "/categories", priority: "0.9", changefreq: "weekly" },
];

let urls = staticPages.map(p => `  <url>
    <loc>${DOMAIN}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`);

// Category pages
for (const id of categoryIds) {
  urls.push(`  <url>
    <loc>${DOMAIN}/categories/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

mkdirSync(resolve(ROOT, "public"), { recursive: true });
writeFileSync(resolve(ROOT, "public/sitemap.xml"), sitemap);
console.log(`Sitemap generated: ${urls.length} URLs → public/sitemap.xml`);
