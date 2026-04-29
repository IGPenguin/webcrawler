const { test, expect } = require('@playwright/test');
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
  if (RUN_DIR) fs.appendFileSync(`${RUN_DIR}/rarity-run.log`, msg + '\n');
}

async function shot(page, name) {
  if (RUN_DIR) await page.screenshot({ path: `${RUN_DIR}/${name}.png` });
}

async function bootGame(page) {
  await page.goto('/');
  await expect(page.locator('#menu_new_game')).toBeVisible({ timeout: 15_000 });
  await page.waitForLoadState('networkidle');
  await page.locator('#menu_new_game').click();
  await expect(page.locator('#id_game')).toBeVisible({ timeout: 10_000 });
  await page.waitForFunction(
    () => typeof linesGenerator !== 'undefined' && linesGenerator.length > 0,
    { timeout: 10_000 }
  );
}

const TIER_ORDER = ['Cursed', 'Common', 'Uncommon', 'Rare', 'Legendary'];

test('one item per rarity tier loads and displays without errors', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await bootGame(page);
  log('[rarity] game started');

  // Use the game's own _rarityFromRow() to bucket Items and Consumables by tier.
  // First-found row per tier is used; order over linesGenerator is CSV order.
  const tierEntries = await page.evaluate((tiers) => {
    var found = {};
    linesGenerator.forEach(function (row, idx) {
      var type = String(row[3].split(':').slice(1).join(':'));
      if (type !== 'Item' && type !== 'Consumable') return;
      var tier = _rarityFromRow(row);
      if (!(tier in found)) found[tier] = { tier: tier, index: idx };
    });
    return tiers
      .map(function (t) { return found[t] || null; })
      .filter(function (e) { return e !== null; });
  }, TIER_ORDER);

  log(`[rarity] tiers found: ${tierEntries.map(e => e.tier).join(', ')}`);
  await shot(page, '00-game-start');

  for (const { tier, index } of tierEntries) {
    await page.evaluate(({ idx }) => {
      encounterRenew();
      loadEncounter(idx, linesGenerator);
      redraw();
    }, { idx: index });

    await page.waitForTimeout(300);

    await expect(page.locator('#id_game')).toBeVisible({ timeout: 3_000 });
    const name = await page.locator('#id_name').textContent().catch(() => '?');
    log(`[rarity] tier="${tier}" → "${name.trim().replace(/\s+/g, ' ')}"`);

    await shot(page, `rarity_${tier.toLowerCase()}`);
  }

  expect(errors, `JS errors during rarity test:\n${errors.join('\n')}`).toHaveLength(0);
  expect(tierEntries.length, 'Expected items for all 5 rarity tiers').toBe(5);
  if (RUN_DIR) log(`[rarity] artifacts → ${RUN_DIR}/`);
});
