// Installer URLs come from updates/downloads.json, written by the app's
// `npm run publish-update` together with the update manifest. Empty values
// leave downloads unavailable (no release yet, or a file:// preview).
const DOWNLOAD_URLS = { macos: '', windows: '', linux: '' };
const DOWNLOADS_FILE = 'updates/downloads.json';
const RELEASES_PREFIX = 'https://github.com/mtjako/zibi-chat-releases/releases/download/';
const preferences = window.sitePreferences;
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
const LANGUAGES = ['pl', 'en'];
const THEMES = ['system', 'light', 'dark'];
const languageSwitch = document.querySelector('[data-language-switch]');
const themeSwitch = document.querySelector('[data-theme-switch]');
const checkSwitch = (group, value) => group.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = input.value === value; });
const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Preferences still work in memory. */ } };
const translate = text => preferences.language === 'en' ? (EN[text] ?? text) : text;

function detectDesktopPlatform(platform, userAgent, maxTouchPoints = 0) {
  // Mobile UAs can report macOS or Linux. Keep the platform chooser on mobile.
  if (/Android|iPhone|iPad|iPod/i.test(userAgent) || (/Mac/i.test(platform) && maxTouchPoints > 1)) return null;
  if (/Win/i.test(platform)) return 'windows';
  if (/Mac/i.test(platform)) return 'macos';
  if (/Linux|CrOS/i.test(platform)) return /CrOS/i.test(userAgent) ? null : 'linux';
  if (/Windows/i.test(userAgent)) return 'windows';
  if (/Macintosh|Mac OS X/i.test(userAgent)) return 'macos';
  if (/Linux/i.test(userAgent) && !/CrOS/i.test(userAgent)) return 'linux';
  return null;
}
const desktopPlatform = detectDesktopPlatform(navigator.userAgentData?.platform || navigator.platform || '', navigator.userAgent || '', navigator.maxTouchPoints || 0);
// Header and hero buttons share the detected platform icon, label and installer URL.
const platformDownloads = document.querySelectorAll('[data-platform-download]');
if (desktopPlatform) {
  const sourceIcon = document.querySelector(`[data-platform="${desktopPlatform}"] .platform-icon`);
  platformDownloads.forEach(button => {
    if (sourceIcon) button.querySelector('[data-platform-download-icon]').replaceWith(sourceIcon.cloneNode(true));
    button.dataset.platform = desktopPlatform;
  });
}
function updatePlatformDownloads() {
  const labels = { macos: 'Pobierz na macOS', windows: 'Pobierz na Windows', linux: 'Pobierz na Linux' };
  const label = translate(labels[desktopPlatform] || 'Pobierz Zibi Chat');
  platformDownloads.forEach(button => { button.querySelector('[data-platform-download-label]').textContent = label; });
}

// Retain source strings once so repeated switching never translates a translation.
const textNodes = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (walker.nextNode()) {
  const node = walker.currentNode;
  if (!['SCRIPT', 'STYLE'].includes(node.parentElement.tagName) && EN[node.textContent.trim()]) {
    textNodes.push({ node, source: node.textContent, key: node.textContent.trim() });
  }
}
const attributes = [];
document.querySelectorAll('[aria-label], [alt], [title], meta[content]').forEach(element => {
  for (const name of ['aria-label', 'alt', 'title', 'content']) {
    const source = element.getAttribute(name);
    if (source && EN[source]) attributes.push({ element, name, source });
  }
});
let downloadClicked = false;
function updateDownloadStatus() {
  const text = downloadClicked ? 'Ten instalator nie jest jeszcze dostępny. Zajrzyj ponownie wkrótce.' : Object.values(DOWNLOAD_URLS).some(Boolean) ? 'Wybierz instalator dla swojego systemu.' : 'Instalatory pojawią się wkrótce.';
  document.querySelector('#download-status').textContent = translate(text);
}
// Sources come from preferences.js (WebP srcset for the current language and theme).
function updateImages() {
  document.querySelectorAll('img[data-shot]').forEach(preferences.applyShot);
}
function applyLanguage() {
  document.documentElement.lang = preferences.language;
  checkSwitch(languageSwitch, preferences.language);
  textNodes.forEach(({ node, source, key }) => { node.textContent = source.replace(key, translate(key)); });
  attributes.forEach(({ element, name, source }) => element.setAttribute(name, translate(source)));
  document.title = translate('Zibi Chat — Twoje harnessy AI. Wszystko pod kontrolą.');
  document.querySelector('meta[property="og:locale"]').content = preferences.language === 'pl' ? 'pl_PL' : 'en_US';
  updateDownloadStatus();
  updatePlatformDownloads();
  updateImages();
}
function applyTheme() {
  const dark = preferences.theme === 'dark' || (preferences.theme === 'system' && systemTheme.matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#1e1e1e' : '#ffffff';
  checkSwitch(themeSwitch, preferences.theme);
  updateImages();
}
languageSwitch.addEventListener('change', event => {
  if (!LANGUAGES.includes(event.target.value)) return;
  preferences.language = event.target.value;
  save('zibi-site-language', preferences.language);
  const url = new URL(location.href);
  url.searchParams.set('lang', preferences.language);
  try { history.replaceState(null, '', url); } catch { /* file:// preview */ }
  applyLanguage();
});
themeSwitch.addEventListener('change', event => {
  if (!THEMES.includes(event.target.value)) return;
  preferences.theme = event.target.value;
  save('zibi-site-theme', preferences.theme);
  applyTheme();
});
systemTheme.addEventListener('change', () => { if (preferences.theme === 'system') applyTheme(); });
// Called again once downloads.json arrives, so links never wait for it to render.
function applyDownloadUrls() {
  document.querySelectorAll('.download-link').forEach(link => {
    const url = DOWNLOAD_URLS[link.dataset.platform];
    if (url) { link.href = url; link.removeAttribute('aria-disabled'); }
  });
  if (desktopPlatform && DOWNLOAD_URLS[desktopPlatform]) {
    platformDownloads.forEach(button => { button.href = DOWNLOAD_URLS[desktopPlatform]; });
  }
  updateDownloadStatus();
}
document.querySelectorAll('.download-link').forEach(link => {
  link.addEventListener('click', event => {
    if (DOWNLOAD_URLS[link.dataset.platform]) return;
    event.preventDefault(); downloadClicked = true; updateDownloadStatus();
  });
});
// Only installers from the releases repository: a bad or edited file must not
// turn the download buttons into links to anywhere else.
const releaseUrl = file => (typeof file?.url === 'string' && file.url.startsWith(RELEASES_PREFIX) ? file.url : '');
// Browsers do not report CPU architecture reliably; Chromium does through
// User-Agent Client Hints. Without it Linux gets the far more common x86_64.
async function linuxArchitecture() {
  try {
    const { architecture } = await navigator.userAgentData.getHighEntropyValues(['architecture']);
    return architecture === 'arm' ? 'aarch64' : 'x86_64';
  } catch { return 'x86_64'; }
}
async function loadDownloads() {
  try {
    const response = await fetch(DOWNLOADS_FILE, { cache: 'no-cache' });
    if (!response.ok) return;
    const { files = {} } = await response.json();
    DOWNLOAD_URLS.macos = releaseUrl(files['macos-aarch64']);
    DOWNLOAD_URLS.windows = releaseUrl(files['windows-x86_64']);
    DOWNLOAD_URLS.linux = releaseUrl(files[`linux-${await linuxArchitecture()}-appimage`]) || releaseUrl(files['linux-x86_64-appimage']);
    applyDownloadUrls();
  } catch { /* No release published yet, offline or a file:// preview: keep "coming soon". */ }
}
document.querySelector('#year').textContent = new Date().getFullYear();
// The demo chart covers 14 days; its X labels are day offsets within that window, so the
// window always ends on the visitor's today and the demo never looks stale.
const CHART_WINDOW_DAYS = 14;
const formatLocalIsoDate = date => [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  .map((part, index) => String(part).padStart(index === 0 ? 4 : 2, '0')).join('-');
function updateChartDates(today = new Date()) {
  document.querySelectorAll('[data-chart-day]').forEach(label => {
    const offset = Number(label.dataset.chartDay);
    if (!Number.isInteger(offset) || offset < 0 || offset >= CHART_WINDOW_DAYS) return;
    const daysBeforeToday = CHART_WINDOW_DAYS - 1 - offset;
    // Calendar arithmetic (not milliseconds) keeps DST changes from shifting the day.
    label.textContent = formatLocalIsoDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysBeforeToday));
  });
}
updateChartDates();
applyTheme();
applyLanguage();
loadDownloads();
