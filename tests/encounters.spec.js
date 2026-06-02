const { test, expect } = require('@playwright/test');
const { RUN_DIR, log, shot, bootGame } = require('./helpers');

test('one random encounter per type loads and displays without errors', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await bootGame(page);
  // previousArea is undefined until nextEncounter() runs a second time (it captures the
  // *old* areaName before the first loadEncounter sets it). loadEncounter(idx, linesGenerator)
  // assigns areaName = previousArea, so we must seed it before the loop.
  await page.evaluate(() => { previousArea = areaName; });
  log('[encounters] game started');
  await shot(page, '00-game-start');

  // Collect one random row index per base encounter type.
  // Generator* rows auto-advance without displaying — skip them.
  // Variants (Boss-*, Trap-*, Container-*, Locked-Container-*, Friend*) are collapsed
  // to their base so we get one representative screenshot each, not one per subtype.
  const typeEntries = await page.evaluate(() => {
    function baseType(t) {
      if (t.startsWith('Boss-'))             return 'Boss';
      if (t.startsWith('Trap-'))             return 'Trap';
      if (t.startsWith('Container-'))        return 'Container';
      if (t.startsWith('Locked-Container-')) return 'Locked-Container';
      if (t.startsWith('Friend') && t !== 'Friend') return 'Friend';
      return t;
    }
    var typeMap = {};
    linesGenerator.forEach(function (row, idx) {
      var rawType = String(row[3].split(':').slice(1).join(':'));
      if (rawType.startsWith('Generator')) return;
      var base = baseType(rawType);
      if (!typeMap[base]) typeMap[base] = [];
      typeMap[base].push(idx);
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
