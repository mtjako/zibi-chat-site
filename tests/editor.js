async (page) => {
  const check = (value, message) => { if (!value) throw new Error(message); };
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const lang of ['pl', 'en']) {
    await page.goto(`http://127.0.0.1:3001/${lang}/`);
    const tabs = page.locator('.editor-tiles [role="tab"]');
    const image = page.locator('#editor-preview img[data-shot]');
    await tabs.first().waitFor();
    await page.waitForFunction(() => Boolean(window.sitePreferences?.setShot));
    check(await tabs.count() === 3, 'Three clickable tiles');
    for (const [index, shot] of ['editor', 'editor-git', 'editor-api'].entries()) {
      await tabs.nth(index).click();
      await page.waitForFunction(({lang, shot}) => document.querySelector('#editor-preview img[data-shot]').src.includes(`${shot}-${lang}-`), {lang, shot});
      await image.evaluate(img => img.decode());
      check(await tabs.nth(index).getAttribute('aria-selected') === 'true', 'Selected tile');
      check(await page.locator('.editor-tiles [aria-selected="true"]').count() === 1, 'Single active tile');
    }
    await tabs.last().focus();
    await page.keyboard.press('ArrowRight');
    check(await tabs.first().getAttribute('aria-selected') === 'true', 'Arrow wraps to first');
    await page.keyboard.press('End');
    check(await tabs.last().getAttribute('aria-selected') === 'true', 'End selects API');
    await page.keyboard.press('Home');
    check(await tabs.first().getAttribute('aria-selected') === 'true', 'Home selects editor');
    for (const theme of ['dark', 'light']) {
      await page.locator(`label:has(input[name="theme"][value="${theme}"])`).click();
      await tabs.nth(1).click(); await tabs.nth(2).click(); await tabs.last().click();
      await page.waitForFunction(({lang, theme}) => document.querySelector('#editor-preview img[data-shot]').src.includes(`editor-api-${lang}-${theme}`), {lang, theme});
      await image.evaluate(img => img.decode());
      await page.waitForFunction(() => !document.querySelector('#editor-preview .shot-transition'));
      check((await image.getAttribute('alt')).length > 20, 'Descriptive image alt');
    }
    for (const width of [360, 390, 768, 1440]) {
      await page.setViewportSize({width, height:900});
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No overflow '+width);
    }
    await page.emulateMedia({reducedMotion:'reduce'});
    await tabs.nth(2).click();
    check(await page.locator('#editor-preview .shot-transition').count() === 0, 'Reduced motion has no transition');
    await page.emulateMedia({reducedMotion:'no-preference'});
  }
  const context = await page.context().browser().newContext({javaScriptEnabled:false});
  const plain = await context.newPage();
  await plain.goto('http://127.0.0.1:3001/en/');
  const fallback = plain.locator('#edytor noscript img');
  await fallback.scrollIntoViewIfNeeded(); await fallback.evaluate(img=>img.decode());
  check(await fallback.isVisible(), 'Screenshot without JavaScript');
  check(await plain.locator('.editor-tiles').isHidden(), 'No inactive controls without JavaScript');
  await context.close();
  check(!errors.length, errors.join('; '));
  return {checks:'passed', languages:2, views:3, themes:2, widths:[360,390,768,1440], keyboard:'passed', reducedMotion:'passed', noJS:'passed', errors};
}
