async page => {
  // The site shows these at ~1000 CSS px, so Retina screens need 2× device pixels. Device scale is a
  // context option, so capture in a dedicated context; layout stays 1100×760 CSS px, images are 2× in each dimension.
  const DEVICE_SCALE_FACTOR = 2;
  const browser = page.context().browser();
  if (!browser) throw new Error('take-shots needs a non-persistent playwright-cli session (context has no browser).');
  const context = await browser.newContext({viewport:{width:1100,height:760}, deviceScaleFactor:DEVICE_SCALE_FACTOR});
  try {
    const shotPage = await context.newPage();
    for (const lang of ['pl','en']) for (const theme of ['light','dark']) {
      await shotPage.goto(`http://127.0.0.1:8089/?lang=${lang}&theme=${theme}`);
      await shotPage.locator('tbody tr').waitFor();
      await shotPage.evaluate(()=>document.fonts.ready);
      await shotPage.waitForFunction(()=>getComputedStyle(document.querySelector('aside')).display==='flex');
      await shotPage.evaluate(() => {
        const chrome = document.createElement('div');
        chrome.setAttribute('aria-hidden','true');
        chrome.style.cssText='position:fixed;left:16px;top:20px;display:flex;gap:8px;z-index:99';
        for (const color of ['#ff5f57','#febc2e','#28c840']) {
          const dot=document.createElement('span');
          dot.style.cssText=`width:12px;height:12px;border-radius:50%;background:${color};box-shadow:inset 0 0 0 .5px #0002`;
          chrome.append(dot);
        }
        document.body.append(chrome);
      });
      // The theme class lands after the first render and sidebar rows use transition-colors, so a
      // slower 2× render can catch rows mid-fade (light-grey selection). Wait for every transition.
      // Only finite animations: looping ones (e.g. harness mascots) never resolve `finished`.
      await shotPage.evaluate(() => Promise.all(document.getAnimations()
        .filter(animation => Number.isFinite(animation.effect?.getComputedTiming().iterations))
        .map(animation => animation.finished)));
      await shotPage.screenshot({path:`assets/session-${lang}-${theme}.png`});
    }
  } finally {
    await context.close();
  }
  return `Captured 4 full screenshots from app components at ${DEVICE_SCALE_FACTOR}×`;
}
