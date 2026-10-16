async (page) => {
  const context = await page.context().browser().newContext({viewport:{width:1100,height:760},deviceScaleFactor:2});
  const output = 'public/assets';
  try {
    const shot = await context.newPage();
    for (const view of ['session','environments','editor','git','api']) for (const lang of ['pl','en']) for (const theme of ['light','dark']) {
      await shot.goto(`http://127.0.0.1:8090/?view=${view}&lang=${lang}&theme=${theme}`);
      if(view === 'editor') {
        await shot.getByRole('button',{name:'src',exact:true}).click();
        await shot.waitForFunction(() => document.querySelector('diffs-container')?.shadowRoot?.textContent?.includes('useState'));
      } else if(view === 'api') {
        await shot.getByRole('button',{name:'Workspace API',exact:true}).click();
        await shot.getByRole('button',{name:lang==='pl'?'Wyślij':'Send',exact:true}).click();
        await shot.getByText('200 OK',{exact:false}).first().waitFor();
      } else if(view === 'git') {
        await shot.waitForFunction(() => document.querySelector('diffs-container')?.shadowRoot?.textContent?.includes('Grok Build'));
      } else if(view === 'session') {
        await shot.getByText(lang === 'pl' ? 'Limity planu' : 'Plan limits').waitFor();
        await shot.getByText('Claude OK',{exact:false}).waitFor();
      } else if(view === 'environments') {
        await shot.getByText(lang === 'pl' ? 'Claude Code' : 'Claude Code',{exact:true}).first().waitFor();
        await shot.getByText(lang === 'pl' ? 'Antigravity' : 'Antigravity',{exact:true}).first().waitFor();
      }
      await shot.evaluate(() => {
        const chrome = document.createElement('div');
        chrome.setAttribute('aria-hidden', 'true');
        chrome.style.cssText = 'position:fixed;z-index:99999;left:16px;top:20px;display:flex;gap:8px;pointer-events:none';
        for (const color of ['#ff5f57', '#febc2e', '#28c840']) {
          const light = document.createElement('span');
          light.style.cssText = `display:block;width:12px;height:12px;border-radius:50%;background:${color};box-shadow:inset 0 0 0 .5px #0003`;
          chrome.append(light);
        }
        document.body.append(chrome);
      });
      await shot.evaluate(() => document.fonts.ready);
      await shot.evaluate(() => Promise.all(document.getAnimations().filter(a => Number.isFinite(a.effect?.getComputedTiming().iterations)).map(a => a.finished.catch(() => {}))));
      const name = view==='editor'?'editor':(view==='session'||view==='environments')?view:`editor-${view}`;
      await shot.screenshot({path:`${output}/${name}-${lang}-${theme}.png`});
    }
  } finally { await context.close(); }
  return 'Captured the session, environments and three editor views in PL/EN, light/dark at 2x';
}
