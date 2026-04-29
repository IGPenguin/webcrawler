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
  if (RUN_DIR) fs.appendFileSync(`${RUN_DIR}/encounters-run.log`, msg + '\n');
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
  // encounters.csv loads async — wait for it before injecting
  await page.waitForFunction(
    () => typeof linesGenerator !== 'undefined' && linesGenerator.length > 0,
    { timeout: 10_000 }
  );
}

test('one random encounter per type loads and displays without errors', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await bootGame(page);
  log('[encounters] game started');
  await shot(page, '00-game-start');

  // Collect one random row index per distinct type.
  // Generator* rows auto-advance without displaying — skip them.
  const typeEntries = await page.evaluate(() => {
    var typeMap = {};
    linesGenerator.forEach(function (row, idx) {
      var rawType = String(row[3].split(':').slice(1).join(':'));
      if (rawType.startsWith('Generator')) return;
      if (!typeMap[rawType]) typeMap[rawType] = [];
      typeMap[rawType].push(idx);
    });
    return Object.keys(typeMap).sort().map(function (type) {
      var indices = typeMap[type];
      return { type: type, index: indices[Math.floor(Math.random() * indices.length)] };
    });
  });

  log(`[encounters] ${typeEntries.length} distinct types found`);

  for (const { type, index } of typeEntries) {
    await page.evaluate(({ idx }) => {
      encounterRenew();
      loadEncounter(idx, linesGenerator);
      redraw();
    }, { idx: index });

    await page.waitForTimeout(300);

    await expect(page.locator('#id_game')).toBeVisible({ timeout: 3_000 });
    const name = await page.locator('#id_name').textContent().catch(() => '?');
    log(`[encounters] type="${type}" → "${name.trim().replace(/\s+/g, ' ')}"`);

    const safe = type.replace(/[^a-zA-Z0-9-]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
    await shot(page, `type_${safe}`);
  }

  expect(errors, `JS errors during encounter test:\n${errors.join('\n')}`).toHaveLength(0);
  if (RUN_DIR) log(`[encounters] artifacts → ${RUN_DIR}/`);
});
