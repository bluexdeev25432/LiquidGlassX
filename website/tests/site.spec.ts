import { expect, test } from '@playwright/test';
import { PNG } from 'pngjs';

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => console.error(`[browser pageerror] ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') console.error(`[browser console] ${message.text()}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) console.error(`[browser response ${response.status()}] ${response.url()}`);
  });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, get: () => 8 });
    Object.defineProperty(navigator, 'deviceMemory', { configurable: true, get: () => 8 });
  });
});

test('desktop demo controls and release details work', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Liquid Glass. Reimagined.' })).toBeVisible();
  const downloadLink = page.locator('.hero .primary-button');
  const downloadEnabled = (await downloadLink.getAttribute('aria-disabled')) === 'false';
  if (downloadEnabled) {
    await expect(downloadLink).toHaveAttribute('href', /^https:\/\/github\.com\/bluexdeev25432\/LiquidGlassX\/releases\/download\/.+\.deb$/);
  } else {
    await expect(downloadLink).toHaveAttribute('href', '#download');
  }
  await expect(page.locator('.download-panel')).toContainText('Verified');

  const blur = page.locator('.controls-panel input[type="range"]').nth(0);
  await blur.focus();
  await blur.press('ArrowRight');
  await expect(page.locator('.preview-panel')).toHaveCSS('--demo-blur', '25px');

  const wifi = page.getByRole('button', { name: 'Wi-Fi' });
  await expect(wifi).toHaveAttribute('aria-pressed', 'true');
  await wifi.click();
  await expect(wifi).toHaveAttribute('aria-pressed', 'false');

  await page.getByRole('button', { name: /Light/ }).click();
  await expect(page.locator('.status-demo')).toHaveClass(/light/);

  const comparison = page.getByRole('slider', { name: 'Preview comparison slider' });
  await comparison.focus();
  await comparison.press('ArrowRight');
  await expect(page.locator('.compare-image.glassed')).toHaveCSS('clip-path', 'inset(0px 49% 0px 0px)');
});

test('desktop 3D canvas renders non-empty pixels', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const canvas = page.locator('canvas.hero-scene');
  await expect(canvas).toHaveAttribute('data-loaded', 'true', { timeout: 15_000 });

  const image = PNG.sync.read(await canvas.screenshot());
  let visiblePixels = 0;
  let coloredPixels = 0;
  for (let offset = 0; offset < image.data.length; offset += 4) {
    const [red, green, blue, alpha] = image.data.subarray(offset, offset + 4);
    if (alpha > 8 && Math.max(red, green, blue) > 30) visiblePixels += 1;
    if (alpha > 8 && (green > red * 1.12 || red > green * 1.12)) coloredPixels += 1;
  }
  expect(visiblePixels).toBeGreaterThan(100);
  expect(coloredPixels).toBeGreaterThan(40);
});

test('iPhone viewport has no horizontal overflow and preserves install actions', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, get: () => 2 });
    Object.defineProperty(navigator, 'deviceMemory', { configurable: true, get: () => 2 });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Liquid Glass. Reimagined.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Install from a verified release' })).toBeVisible();
  await expect(page.getByText('APT source not published')).toBeVisible();
  await expect(page.getByRole('link', { name: 'View releases' })).toHaveAttribute('href', 'https://github.com/bluexdeev25432/LiquidGlassX/releases');

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport + 1);
  await page.screenshot({ path: 'test-results/iphone-390.png' });
});

test('compact iPhone viewport remains readable without overflow', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, get: () => 2 });
    Object.defineProperty(navigator, 'deviceMemory', { configurable: true, get: () => 2 });
  });
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Liquid Glass. Reimagined.' })).toBeVisible();
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport + 1);
  await page.screenshot({ path: 'test-results/iphone-320.png' });
});

test('reduced motion keeps content visible and does not request WebGL', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('#features')).toHaveCSS('opacity', '1');
  await expect(page.locator('canvas.hero-scene')).not.toHaveAttribute('data-loaded', 'true');
});