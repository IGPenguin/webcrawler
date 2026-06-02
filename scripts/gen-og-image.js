const path = require('path');

let chromium;
try {
  chromium = require('playwright').chromium;
} catch (_) {
  chromium = require('@playwright/test').chromium;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });

  const svgPath = path.resolve(__dirname, '../assets/img/og-preview.svg');
  await page.goto(`file://${svgPath}`);
  await page.waitForTimeout(500); // let font render

  const pngPath = path.resolve(__dirname, '../assets/img/og-preview.png');
  await page.screenshot({ path: pngPath, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await browser.close();
  console.log('✓  og-preview.png saved to assets/img/');
})().catch(e => { console.error(e); process.exit(1); });
