async (page) => {
 const check=(value,message)=>{if(!value)throw new Error(message);};
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/*',route=>route.continue());
 let requests=0;page.on('request',request=>{if(request.url().includes('/updates/downloads.json'))requests++;});
 await page.goto('http://127.0.0.1:3001/pl/');
 await page.waitForFunction(()=>document.querySelector('[data-release-details]').getAttribute('aria-busy')==='false');
 check(requests===1,'Only one manifest request');
 check((await page.locator('[data-release-details]').innerText()).includes('0.9.8'),'Version from manifest');
 check(await page.locator('[data-release-details] time').getAttribute('datetime')==='2026-10-15T19:12:19.102Z','Publication date from manifest');
 check((await page.locator('[data-release-details] time').innerText()).includes('15 października 2026'),'Polish date');
 check(await page.locator('[data-release-details] a').count()===0,'Release details contain no links');
 check((await page.locator('.trust-notes').innerText()).includes('Bez telemetrii'),'Trust notes at hero');
 for(const width of [360,390,768,1440]) {await page.setViewportSize({width,height:900});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No overflow at '+width);}
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 await page.goto('http://127.0.0.1:3001/en/');
 await page.waitForFunction(()=>document.querySelector('[data-release-details]').getAttribute('aria-busy')==='false');
 check((await page.locator('[data-release-details]').innerText()).includes('Version 0.9.8'),'English version');
 check((await page.locator('[data-release-details] time').innerText()).includes('15 October 2026'),'English date');
 check((await page.locator('.trust-notes').innerText()).includes('No account'),'English trust notes');

 await page.route('**/updates/downloads.json',route=>route.fulfill({json:{version:'2.1.0',pub_date:'2027-02-04T12:00:00Z',release_url:'https://github.com/mtjako/zibi-chat-releases/releases/tag/v2.1.0',files:{}}}));
 await page.reload();await page.waitForFunction(()=>document.querySelector('[data-release-details]').textContent.includes('2.1.0'));
 check((await page.locator('[data-release-details] time').innerText()).includes('4 February 2027'),'Updated manifest changes release information');
 await page.route('**/updates/downloads.json',route=>route.fulfill({json:{version:'2.1.0',pub_date:'bad-date',release_url:'https://example.com/untrusted',files:{}}}));
 await page.reload();await page.waitForFunction(()=>document.querySelector('[data-release-details]').getAttribute('aria-busy')==='false');
 check(await page.locator('[data-release-details] a,[data-release-details] time').count()===0,'Invalid notes URL and date omitted');
 await page.route('**/updates/downloads.json',route=>route.fulfill({status:404,body:''}));
 await page.reload();await page.waitForFunction(()=>document.querySelector('[data-release-details]').getAttribute('aria-busy')==='false');
 check((await page.locator('[data-release-details]').innerText()).includes('currently unavailable'),'Missing manifest fallback');
 await page.unroute('**/updates/downloads.json');
 const nojs=await page.context().browser().newContext({javaScriptEnabled:false});
 const plain=await nojs.newPage();await plain.goto('http://127.0.0.1:3001/en/');
 check((await plain.locator('.trust-notes').innerText()).includes('Free'),'Trust notes without JavaScript');
 await nojs.close();
 check(!errors.length,'Browser errors: '+errors.join('\n'));
 return {checks:'passed',errors};
}
