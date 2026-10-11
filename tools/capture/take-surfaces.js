async page => {
  // Environments view in the full main window from surfaces.html (vite.surfaces.config.mjs, port 8088), at 2×
  // device pixels for Retina. surfaces.html can also render the tray panel and the Dynamic Notch
  // (?surface=tray|notch); the site does not use them because both are not available on every platform.
  const DEVICE_SCALE_FACTOR = 2;
  const BASE = 'http://127.0.0.1:8088/surfaces.html';
  const browser = page.context().browser();
  if (!browser) throw new Error('take-surfaces needs a non-persistent playwright-cli session (context has no browser).');
  // reducedMotion: JS-driven motion (invisible to getAnimations) settles instantly.
  const context = await browser.newContext({viewport: {width: 1100, height: 760}, deviceScaleFactor: DEVICE_SCALE_FACTOR, reducedMotion: 'reduce'});

  // Waits for finite CSS animations, then for the element box to stop changing (guards JS-driven motion).
  async function settle(shotPage, locator) {
    await shotPage.evaluate(() => Promise.all(document.getAnimations()
      .filter(animation => Number.isFinite(animation.effect?.getComputedTiming().iterations))
      .map(animation => animation.finished)));
    let previous = null;
    for (let attempt = 0; attempt < 20; attempt++) {
      const box = await locator.boundingBox();
      if (!box) throw new Error('take-surfaces: element has no box');
      if (previous && JSON.stringify(previous) === JSON.stringify(box)) return box;
      previous = box;
      await shotPage.waitForTimeout(150);
    }
    throw new Error('take-surfaces: element size did not settle');
  }

  try {
    const shotPage = await context.newPage();
    for (const lang of ['pl', 'en']) {
      for (const theme of ['light', 'dark']) {
        // Environments view in the full main window, framed like the hero screenshot (take-shots.js).
        await shotPage.goto(`${BASE}?surface=window&route=/harness-updates&lang=${lang}&theme=${theme}`);
        await shotPage.getByText('0.162.0').waitFor();
        await shotPage.evaluate(() => document.fonts.ready);
        await shotPage.waitForFunction(() => getComputedStyle(document.querySelector('aside')).display === 'flex');
        await shotPage.evaluate(() => {
          const chrome = document.createElement('div');
          chrome.setAttribute('aria-hidden', 'true');
          chrome.style.cssText = 'position:fixed;left:16px;top:20px;display:flex;gap:8px;z-index:99';
          for (const color of ['#ff5f57', '#febc2e', '#28c840']) {
            const dot = document.createElement('span');
            dot.style.cssText = `width:12px;height:12px;border-radius:50%;background:${color};box-shadow:inset 0 0 0 .5px #0002`;
            chrome.append(dot);
          }
          document.body.append(chrome);
        });
        await settle(shotPage, shotPage.locator('aside'));
        await shotPage.screenshot({path: `assets/environments-${lang}-${theme}.png`});
      }
    }
  } finally {
    await context.close();
  }
  return `Captured 4 Environments windows at ${DEVICE_SCALE_FACTOR}×`;
}
