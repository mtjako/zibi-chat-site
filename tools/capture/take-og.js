async page => {
  // Renders tools/capture/og.html (served from the site root on port 8765) into assets/og-image.png.
  const browser = page.context().browser();
  if (!browser) throw new Error('take-og needs a non-persistent playwright-cli session (context has no browser).');
  const context = await browser.newContext({viewport: {width: 1200, height: 630}, deviceScaleFactor: 1});
  try {
    const ogPage = await context.newPage();
    await ogPage.goto('http://127.0.0.1:8765/tools/capture/og.html');
    await ogPage.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); });
    await ogPage.screenshot({path: 'assets/og-image.png'});
  } finally {
    await context.close();
  }
  return 'Captured assets/og-image.png (1200×630)';
}
