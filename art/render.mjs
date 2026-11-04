// Renders preview.png (1600x960 at 1.5x = 2400x1440) from art/preview.html.
// Needs playwright-core and Google Chrome. Run from the repo root:
//   npm i --no-save --prefix /tmp/cca-render playwright-core
//   NODE_PATH=/tmp/cca-render/node_modules node art/render.mjs
import { createRequire } from "node:module";
import { join, resolve } from "node:path";

const { chromium } = createRequire(join(process.env.NODE_PATH ?? ".", "x"))("playwright-core");
const root = resolve(import.meta.dirname, "..");
const chrome = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await chromium.launch({ executablePath: chrome });
const page = await browser.newPage({ viewport: { width: 1600, height: 960 }, deviceScaleFactor: 1.5 });
await page.goto("file://" + join(root, "art/preview.html"), { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await (await page.$("#win")).screenshot({ path: join(root, "preview.png") });
await browser.close();
console.log("preview.png written");
