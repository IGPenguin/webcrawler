const { test, expect } = require('@playwright/test');
const { RUN_DIR, log, shot, dismissChangelog } = require('./helpers');

test('menu renders and all screens navigate correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#menu_new_game')).toBeVisible({ timeout: 15_000 });
  await page.waitForLoadState('networkidle');
  await dismissChangelog(page);
  log('[nav] menu visible, CSV data loaded');
  await shot(page, '01-menu');

  const screens = [
    { btn: '#menu_challenges', screen: '#menu_memories_screen', back: '#menu_memories_back', name: 'memories'   },
    { btn: '#menu_history',    screen: '#menu_history_screen',  back: '#menu_history_back',  name: 'chronicles' },
    { btn: '#menu_credits',    screen: '#menu_credits_screen',  back: '#menu_credits_back',  name: 'credits'    },
  ];

  for (const { btn, screen, back, name } of screens) {
    log(`[nav] opening ${name}...`);
    await page.locator(btn).click();
    await expect(page.locator(screen)).toBeVisible({ timeout: 5_000 });
    log(`[nav] ${name} screen visible`);
    await shot(page, `nav-${name}`);

    await page.locator(back).click();
    await expect(page.locator('#menu_new_game')).toBeVisible({ timeout: 5_000 });
    log(`[nav] back to main from ${name}`);
  }
});

test('game starts and first encounter loads without JS errors', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('/');
  await expect(page.locator('#menu_new_game')).toBeVisible({ timeout: 15_000 });
  await page.waitForLoadState('networkidle');

  await dismissChangelog(page);
  log('[boot] clicking New Game...');
  await page.locator('#menu_new_game').click();

  await expect(page.locator('#id_game')).toBeVisible({ timeout: 10_000 });
  log('[boot] game screen visible');

  expect(errors, `JS errors on boot:\n${errors.join('\n')}`).toHaveLength(0);
  log('[boot] no JS errors');

  const nameEl = page.locator('#id_name');
  await expect(nameEl).not.toBeEmpty({ timeout: 5_000 });
  const emoji = await page.locator('#id_emoji').textContent();
  const name  = await nameEl.textContent();
  log(`[boot] first encounter: ${emoji} ${name}`);
  if (RUN_DIR) log(`[boot] artifacts → ${RUN_DIR}/`);
  await shot(page, '02-first-encounter');
});
