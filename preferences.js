// Runs before styles to avoid flashing the wrong theme. Storage is optional.
(() => {
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const query = new URLSearchParams(location.search).get('lang');
  const saved = read('zibi-site-language');
  const language = [query, saved].find(value => ['pl', 'en'].includes(value)) || (navigator.language.toLowerCase().startsWith('pl') ? 'pl' : 'en');
  const storedTheme = read('zibi-site-theme');
  const theme = ['light', 'dark', 'system'].includes(storedTheme) ? storedTheme : 'system';
  const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.lang = language;
  // Lets CSS tell the scripted page from the no-JS fallback (<noscript> screenshots).
  document.documentElement.classList.add('js');

  // Screenshots depend on language and theme, so their markup carries no URL (a static one would be
  // fetched first and then replaced). Widths match tools/capture/make-webp.sh; sizes match the 1000 px
  // screenshot frame inside .wrap (100% - 64px, or 100% - 36px up to 760px).
  const SHOT_WIDTHS = [800, 2200];
  const SHOT_SIZES = '(max-width: 760px) calc(100vw - 36px), (max-width: 1064px) calc(100vw - 64px), 1000px';
  const shotSrcset = shot => {
    const prefix = `assets/${shot}-${window.sitePreferences.language}-${document.documentElement.dataset.theme}`;
    return SHOT_WIDTHS.map(width => `${prefix}-${width}.webp ${width}w`).join(', ');
  };
  // Sets the sources for the current language and theme; script.js calls it again after a switch.
  const applyShot = image => {
    const shot = image.dataset.shot;
    if (!shot) return;
    image.sizes = SHOT_SIZES;
    image.srcset = shotSrcset(shot);
  };
  window.sitePreferences = { language, theme, applyShot };

  // The hero screenshot is the largest contentful paint: start it now, before the body is parsed.
  const preload = document.createElement('link');
  preload.rel = 'preload';
  preload.as = 'image';
  preload.setAttribute('imagesrcset', shotSrcset('session'));
  preload.setAttribute('imagesizes', SHOT_SIZES);
  preload.setAttribute('fetchpriority', 'high');
  document.head.append(preload);

  // Fill each screenshot as soon as the parser inserts it, so nothing waits for script.js.
  const fill = node => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches('img[data-shot]')) applyShot(node);
    node.querySelectorAll('img[data-shot]').forEach(applyShot);
  };
  const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(fill)));
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', () => {
    observer.disconnect();
    document.querySelectorAll('img[data-shot]:not([srcset])').forEach(applyShot);
  }, { once: true });
})();
