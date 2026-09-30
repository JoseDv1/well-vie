/** Safari keeps layout viewport units tall while its keyboard covers the page. */
export function followVisibleViewport(panel: HTMLElement): () => void {
  const viewport = window.visualViewport;
  if (!viewport) return () => {};
  let frame = 0;
  const update = () => {
    frame = 0;
    // Keep pinch zoom available without repeatedly reflowing the zoomed page.
    if (Math.abs(viewport.scale - 1) > 0.05) return;
    const active = document.activeElement;
    const editing = active instanceof HTMLElement && panel.contains(active)
      && active.matches('input:not([type=checkbox]):not([type=radio]), textarea, [contenteditable=true]');
    const keyboard = editing && Math.max(window.innerHeight, document.documentElement.clientHeight) - viewport.height > 120;
    panel.style.setProperty('--visible-height', `${viewport.height}px`);
    panel.style.setProperty('--visible-top', `${viewport.offsetTop}px`);
    panel.dataset.keyboard = String(keyboard);
    if (keyboard && active instanceof HTMLElement) {
      const rect = active.getBoundingClientRect();
      if (rect.bottom > viewport.offsetTop + viewport.height - 80 || rect.top < viewport.offsetTop + 16) {
        active.scrollIntoView({block: 'center', inline: 'nearest', behavior: 'instant'});
      }
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  viewport.addEventListener('resize', schedule);
  viewport.addEventListener('scroll', schedule);
  window.addEventListener('resize', schedule);
  panel.addEventListener('focusin', schedule);
  panel.addEventListener('focusout', schedule);
  update();
  return () => {
    cancelAnimationFrame(frame);
    viewport.removeEventListener('resize', schedule);
    viewport.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    panel.removeEventListener('focusin', schedule);
    panel.removeEventListener('focusout', schedule);
  };
}
