// One observer, six cards and a terminal; no scroll listeners, animation frames or typing timers.
(() => {
  if (!("IntersectionObserver" in window)) return;
  const preference = matchMedia("(prefers-reduced-motion: no-preference)");
  const targets = [...document.querySelectorAll("[data-motion]")];
  const played = new WeakSet();
  let observer;
  const setup = () => {
    observer?.disconnect();
    if (!preference.matches) {
      targets.forEach((target) => target.removeAttribute("data-motion-state"));
      return;
    }
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.dataset.motionState = "entered";
          played.add(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -24px 0px" },
    );
    targets.forEach((target) => {
      if (played.has(target)) return;
      target.dataset.motionState = "pending";
      observer.observe(target);
    });
  };
  setup();
  preference.addEventListener("change", setup);
})();
