async (page) => {
  const check = (value, message) => { if (!value) throw new Error(message); };
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => route.continue());
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('http://127.0.0.1:3001/pl/');
  check(await page.locator('.marked path').evaluate(el=>getComputedStyle(el).animationName)==='underline-draw','Hero drawing animation');
  await page.waitForFunction(()=>document.querySelector('.bento-cli').dataset.motionState==='pending');
  const underlined = await page.locator('.marked path').evaluate(el=>{el.getAnimations().forEach(a=>a.finish());return getComputedStyle(el).strokeDashoffset;});
  check(underlined==='0px','Underline completes');
  await page.locator('.bento-limits').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));
  await page.waitForFunction(()=>document.querySelector('.bento-limits').dataset.motionState==='entered');
  const limits=await page.locator('.bento-limits').evaluate(el=>{
    const bar=el.querySelector('.app-limit-track i');
    const names=bar.getAnimations().map(a=>a.animationName);
    const timings=el.getAnimations({subtree:true}).filter(a=>['limit-fill','limit-pace-enter'].includes(a.animationName)).map(a=>a.effect.getTiming());
    el.getAnimations({subtree:true}).forEach(a=>a.finish());
    return {names,timings,pace:parseFloat(getComputedStyle(el.querySelector('.app-limit-pace')).insetInlineStart),percent:getComputedStyle(bar).getPropertyValue('--value'),width:bar.getBoundingClientRect().width,track:bar.parentElement.getBoundingClientRect().width};
  });
  check(limits.names.includes('limit-fill'),'Animated progress bars');
  check(limits.timings.length===4 && limits.timings.every(t=>t.duration===500 && t.delay===160),'Fill and pace match 500 ms app timing');
  check(Math.abs(limits.pace/limits.track-.323)<.01,'Correct pace-marker endpoint');
  check(Math.abs(limits.width/limits.track-.32)<.01,'Correct 32% bar width');
  await page.locator('.bento-analytics').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));
  await page.waitForFunction(()=>document.querySelector('.bento-analytics').dataset.motionState==='entered');
  check(await page.locator('.app-chart-line').evaluate(el=>getComputedStyle(el).animationName)==='chart-reveal','Chart reveal');
  await page.locator('.bento-terminal').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));
  await page.waitForFunction(()=>document.querySelector('.bento-terminal').dataset.motionState==='entered');
  await page.locator('.bento-cli').evaluate(el=>el.getAnimations().forEach(a=>a.finish()));
  const typing=await page.locator('.bento-terminal').evaluate(el=>{
    const rect=el.getBoundingClientRect();
    el.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=900;});
    const chars=[...el.querySelectorAll('.terminal-char')];
    return {shown:chars.filter(c=>getComputedStyle(c).opacity==='1').length,total:chars.length,output:getComputedStyle(el.querySelector('.terminal-output')).opacity,height:rect.height,width:rect.width};
  });
  check(typing.shown>0 && typing.shown<typing.total,'Command types progressively');
  check(typing.output==='0','Response waits for command');
  const complete=await page.locator('.bento-terminal').evaluate(el=>{
    el.getAnimations({subtree:true}).forEach(a=>a.finish());const r=el.getBoundingClientRect();
    return {height:r.height,width:r.width,output:getComputedStyle(el.querySelector('.terminal-output')).opacity,hidden:[...el.querySelectorAll('.terminal-char')].filter(c=>getComputedStyle(c).opacity!=='1').length,text:el.textContent};
  });
  check(complete.height===typing.height && complete.width===typing.width,'Typing causes no layout shift');
  check(complete.hidden===0,'Every command character remains visible');
  check(complete.output==='1' && complete.text.includes('"total_tokens": 124780'),'Full response appears');
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.locator('.bento-terminal').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));
  check(await page.locator('.bento-terminal').evaluate(el=>el.getAnimations({subtree:true}).every(a=>a.playState==='finished')),'Animations do not loop on reentry');
  await page.emulateMedia({reducedMotion:'reduce'});
  check(await page.locator('.marked path').evaluate(el=>getComputedStyle(el).animationName)==='none','No hero animation in reduced motion');
  check(await page.locator('.terminal-output').evaluate(el=>getComputedStyle(el).opacity)==='1','Full terminal in reduced motion');
  check(await page.locator('[data-motion-state="pending"]').count()===0,'Reduced motion reveals all cards');
  await page.goto('http://127.0.0.1:3001/en/');
  check(await page.locator('.terminal-char').first().evaluate(el=>getComputedStyle(el).opacity)==='1','English terminal fully visible in reduced motion');
  for(const width of [360,390,768,1440]) {
    await page.setViewportSize({width,height:900});
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No overflow at '+width);
  }
  const nojs=await page.context().browser().newContext({javaScriptEnabled:false});
  const plain=await nojs.newPage();await plain.goto('http://127.0.0.1:3001/pl/');
  check(await plain.locator('.bento-cli').evaluate(el=>getComputedStyle(el).opacity)==='1','Cards visible without JS');
  check(await plain.locator('.terminal-output').evaluate(el=>getComputedStyle(el).opacity)==='1','Terminal visible without JS');
  await nojs.close();
  check(!errors.length,'Browser errors: '+errors.join('\n'));
  return {checks:'passed',typing,limits,errors};
}
