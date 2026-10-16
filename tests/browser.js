async (page) => {
  const check = (value, message) => {
    if (!value) throw new Error(message);
  };
  await page.route("**/*", (route) => route.continue());
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("http://127.0.0.1:3001/pl/");
  await page
    .locator('input[name="theme"][value="light"]')
    .locator("..")
    .click();
  await page.waitForFunction(() =>
    document.querySelector("#download-status").textContent.includes("Wybierz"),
  );
  await page
    .locator(".product-shot")
    .first()
    .evaluate((img) => img.decode());
  await page
    .locator('input[name="language"][value="en"]')
    .locator("..")
    .click();
  await page.waitForURL("**/en/");
  check(
    (await page.locator("html").getAttribute("lang")) === "en",
    "English HTML language",
  );
  check(
    (await page.locator("h1").innerText()).includes("You create."),
    "Static English content",
  );
  check((await page.title()).includes("Your AI harnesses"), "English metadata");
  await page.locator('input[name="theme"][value="dark"]').locator("..").click();
  await page.waitForFunction(() =>
    document.querySelector("img[data-shot]").src.includes("en-dark"),
  );
  await page.reload();
  await page.waitForFunction(
    () => document.documentElement.dataset.theme === "dark",
  );
  check(
    await page.locator('input[name="theme"][value="dark"]').isChecked(),
    "Stored theme",
  );
  await page
    .locator('input[name="theme"][value="system"]')
    .locator("..")
    .click();
  await page.emulateMedia({ colorScheme: "light" });
  await page.waitForFunction(
    () => document.documentElement.dataset.theme === "light",
  );
  await page.emulateMedia({ colorScheme: "dark" });
  await page.waitForFunction(() =>
    document.querySelector("img[data-shot]").src.includes("en-dark"),
  );
  await page.locator("[data-linux-toggle]").click();
  await page.locator("#linux-menu").waitFor({ state: "visible" });
  check(
    (await page.locator("#linux-menu a[href]").count()) === 6,
    "Linux packages",
  );
  await page.keyboard.press("ArrowDown");
  check(
    (await page.evaluate(() => document.activeElement.dataset.linuxFile)) ===
      "linux-x86_64-deb",
    "Keyboard menu navigation",
  );
  await page.keyboard.press("Escape");
  check(
    (await page
      .locator("[data-linux-toggle]")
      .getAttribute("aria-expanded")) === "false",
    "Escape",
  );
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    check(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `No overflow at ${width}`,
    );
  }
  const faq = page.locator("#faq details").first();
  await faq.locator("summary").click();
  check((await faq.getAttribute("open")) === null, "FAQ");
  await page.goto("http://127.0.0.1:3001/?lang=pl");
  check(
    (await page.locator("h1").innerText()).includes("Ty tworzysz."),
    "Legacy Polish query",
  );
  await page.goto("http://127.0.0.1:3001/?lang=en");
  await page.waitForURL("**/en/?lang=en");
  check(
    (await page.locator("h1").innerText()).includes("You create."),
    "Legacy English query",
  );

  // Cold dark visit: no light screenshot is downloaded, even with delayed React.
  const browser = page.context().browser();
  const cold = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "light",
  });
  await cold.addInitScript(() =>
    localStorage.setItem("zibi-site-theme", "dark"),
  );
  const coldPage = await cold.newPage();
  const shots = [];
  coldPage.on("request", (request) => {
    if (/\/assets\/session-/.test(request.url())) shots.push(request.url());
  });
  await coldPage.route("**/_next/**/*.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1800));
    await route.continue();
  });
  await coldPage.goto("http://127.0.0.1:3001/pl/", {
    waitUntil: "domcontentloaded",
  });
  await coldPage
    .locator("img[data-shot]")
    .first()
    .evaluate((img) => img.decode());
  check(
    shots.length === 1 && shots[0].includes("pl-dark-"),
    "Exactly one correct hero image before hydration: " + JSON.stringify(shots),
  );
  await cold.close();

  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await nojs.newPage();
  await staticPage.goto("http://127.0.0.1:3001/en/");
  check(
    (await staticPage.locator("h1").innerText()).includes("You create."),
    "English without JavaScript",
  );
  check(
    await staticPage
      .locator("noscript img")
      .first()
      .evaluate((img) => img.complete && img.naturalWidth > 0),
    "Image without JavaScript",
  );
  await nojs.close();
  const blocked = await browser.newContext();
  await blocked.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Blocked");
      },
    }),
  );
  const blockedPage = await blocked.newPage();
  await blockedPage.goto("http://127.0.0.1:3001/pl/");
  await blockedPage
    .locator('input[name="theme"][value="dark"]')
    .locator("..")
    .click();
  await blockedPage.waitForFunction(
    () => document.documentElement.dataset.theme === "dark",
  );
  await blocked.close();
  await page.route("**/updates/downloads.json", (route) =>
    route.fulfill({ status: 404, body: "" }),
  );
  await page.reload();
  await page.locator('[data-platform="macos"]').last().click({ force: true });
  check(
    (await page.locator("#download-status").innerText()).includes(
      "not available",
    ),
    "Missing manifest fallback",
  );
  await page.unroute("**/updates/downloads.json");
  const actual = errors.filter((error) => !error.includes("404"));
  check(!actual.length, "Browser errors: " + actual.join("\n"));
  return { checks: "passed", coldHeroRequests: shots, errors: actual };
}
