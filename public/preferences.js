// Runs before styles and React. The LCP image must not wait for hydration.
(() => {
  const { language, basePath } = window.zibiPage;
  const read = (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };
  const query = new URLSearchParams(location.search).get("lang");
  const rootPath =
    location.pathname === `${basePath}/` || location.pathname === basePath;
  const preferred = ["pl", "en"].includes(query)
    ? query
    : rootPath
      ? read("zibi-site-language") ||
        (navigator.language.toLowerCase().startsWith("pl") ? "pl" : "en")
      : language;
  if (["pl", "en"].includes(preferred) && preferred !== language) {
    location.replace(
      `${basePath}/${preferred}/${location.search}${location.hash}`,
    );
    return;
  }
  const storedTheme = read("zibi-site-theme");
  let theme = ["light", "dark", "system"].includes(storedTheme)
    ? storedTheme
    : "system";
  const media = matchMedia("(prefers-color-scheme: dark)");
  const root = document.documentElement;
  const sizes =
    "(max-width: 360px) calc(100vw - 36px), (max-width: 1064px) calc(100vw - 48px), 1000px";
  const srcset = (shot) =>
    [480, 720, 800, 1100, 1600, 2200]
      .map(
        (width) =>
          `${basePath}/assets/${shot}-${language}-${root.dataset.theme}-${width}.webp ${width}w`,
      )
      .join(", ");
  const assignShot = (image) => {
    image.sizes = sizes;
    image.srcset = srcset(image.dataset.shot);
    // Set the fallback after srcset so browsers fetch only the selected candidate.
    image.src = `${basePath}/assets/${image.dataset.shot}-${language}-${root.dataset.theme}-1100.webp`;
  };
  const motion = matchMedia("(prefers-reduced-motion: no-preference)");
  const requests = new WeakMap();
  const overlays = new WeakMap();
  const fill = (image, animate = false) => {
    const token = {};
    requests.set(image, token);
    const previous = overlays.get(image);
    if (previous) {
      previous.getAnimations().forEach((animation) => animation.cancel());
      previous.remove();
      overlays.delete(image);
    }
    if (
      !animate ||
      !image.complete ||
      !image.naturalWidth ||
      !image.currentSrc ||
      !image.animate
    ) {
      assignShot(image);
      return;
    }
    const targetTheme = root.dataset.theme;
    const targetShot = image.dataset.shot;
    const oldSource = image.currentSrc;
    const candidate = new Image();
    candidate.decoding = "async";
    candidate.sizes = sizes;
    candidate.srcset = srcset(image.dataset.shot);
    candidate.src = `${basePath}/assets/${image.dataset.shot}-${language}-${targetTheme}-1100.webp`;
    candidate
      .decode()
      .then(() => {
        if (
          requests.get(image) !== token ||
          root.dataset.theme !== targetTheme ||
          image.dataset.shot !== targetShot ||
          !image.isConnected
        )
          return;
        if (!motion.matches) {
          assignShot(image);
          return;
        }
        const overlay = image.cloneNode(false);
        overlay.removeAttribute("data-shot");
        overlay.removeAttribute("data-language");
        overlay.removeAttribute("srcset");
        overlay.removeAttribute("sizes");
        overlay.removeAttribute("fetchpriority");
        overlay.src = oldSource;
        overlay.alt = "";
        overlay.setAttribute("aria-hidden", "true");
        overlay.classList.add("shot-transition");
        image.parentElement.append(overlay);
        overlays.set(image, overlay);
        assignShot(image);
        const animation = overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 240,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
          fill: "forwards",
        });
        const cleanup = () => {
          overlay.remove();
          if (overlays.get(image) === overlay) overlays.delete(image);
        };
        animation.finished.then(cleanup, cleanup);
      })
      .catch(() => {
        if (requests.get(image) === token) assignShot(image);
      });
  };
  motion.addEventListener("change", () => {
    if (motion.matches) return;
    document.querySelectorAll(".shot-transition").forEach((overlay) => {
      overlay.getAnimations().forEach((animation) => animation.cancel());
      overlay.remove();
    });
  });
  const apply = () => {
    const previousTheme = root.dataset.theme;
    root.dataset.theme =
      theme === "dark" || (theme === "system" && media.matches)
        ? "dark"
        : "light";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        root.dataset.theme === "dark" ? "#1e1e1e" : "#ffffff",
      );
    const animate = Boolean(
      previousTheme && previousTheme !== root.dataset.theme && motion.matches,
    );
    document
      .querySelectorAll("img[data-shot]")
      .forEach((image) => fill(image, animate));
  };
  root.classList.add("js");
  apply();
  const preload = document.createElement("link");
  preload.rel = "preload";
  preload.as = "image";
  preload.setAttribute("imagesrcset", srcset("session"));
  preload.setAttribute("imagesizes", sizes);
  preload.setAttribute("fetchpriority", "high");
  document.head.append(preload);
  const observer = new MutationObserver((records) => {
    for (const record of records)
      for (const node of record.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches("img[data-shot]")) fill(node);
        node.querySelectorAll("img[data-shot]").forEach((image) => fill(image));
      }
  });
  observer.observe(root, { childList: true, subtree: true });
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      observer.disconnect();
      document
        .querySelectorAll("img[data-shot]:not([srcset])")
        .forEach((image) => fill(image));
    },
    { once: true },
  );
  media.addEventListener("change", () => {
    if (theme === "system") apply();
  });
  window.sitePreferences = {
    language,
    get theme() {
      return theme;
    },
    setShot(image, shot) {
      image.dataset.shot = shot;
      fill(image, motion.matches);
    },
    setTheme(value) {
      theme = value;
      apply();
    },
  };
})();
