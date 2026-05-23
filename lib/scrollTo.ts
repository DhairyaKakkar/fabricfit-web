// Slow, cinematic scroll to an element by ID.
// duration in ms — 2400ms gives a premium, unhurried feel.
export function slowScrollTo(id: string, duration = 2400) {
  const el = document.getElementById(id);
  if (!el) return;

  const start = window.scrollY;
  const target = el.getBoundingClientRect().top + start;
  const startTime = performance.now();

  // Ease in-out cubic
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + (target - start) * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}
