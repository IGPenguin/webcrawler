const { expect } = require('@playwright/test');
const { execSync } = require('child_process');
const fs = require('fs');

const SCREENSHOTS = process.env.SCREENSHOTS !== '0' && !process.env.CI;

function makeRunDir() {
  const ts = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const gitInfo = execSync('git log -1 --format="%h %s"')
    .toString().trim()
    .replace(/[^a-zA-Z0-9 -]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 48);
  const dir = `test-results/${ts}_${gitInfo}`;
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

const RUN_DIR = SCREENSHOTS ? makeRunDir() : null;

function log(msg) {
  console.log(msg);
}

async function shot(page, name) {
  if (RUN_DIR) await page.screenshot({ path: `${RUN_DIR}/${name}.png` });
}

async function dismissChangelog(page) {
  const overlay = page.locator('#changelog_overlay');
  try {
    await overlay.waitFor({ state: 'visible', timeout: 3_000 });
    await page.locator('#changelog_dismiss').click();
    await overlay.waitFor({ state: 'hidden', timeout: 3_000 });
  } catch (_) { /* not shown — that's fine */ }
}

async function bootGame(page) {
  await page.goto('/');
  await expect(page.locator('#menu_new_game')).toBeVisible({ timeout: 15_000 });
  await page.waitForLoadState('networkidle');
  await dismissChangelog(page);
  await page.locator('#menu_new_game').click();
  await expect(page.locator('#id_game')).toBeVisible({ timeout: 10_000 });
  await page.waitForFunction(
    () => typeof linesGenerator !== 'undefined' && linesGenerator.length > 0,
    { timeout: 10_000 }
  );
}

module.exports = { RUN_DIR, log, shot, dismissChangelog, bootGame };
