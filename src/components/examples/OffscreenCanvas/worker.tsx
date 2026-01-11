// Emit an early log before heavy/dynamic imports so we can confirm the worker module runs
// Note: static imports are evaluated before top-level code, so we use dynamic imports here
// to avoid blocking the initial log when an import fails during module evaluation.
// eslint-disable-next-line no-console
console.log('[offscreen-worker] module loaded — awaiting dynamic imports');

(async () => {
  try {
    const offscreen = await import('@react-three/offscreen');
    // Dynamically import the scene so any TSX transformation happens in the worker's context
    const SceneModule = await import('./Scene');
    const Scene = SceneModule.default;

    // Defensive: wrap render so errors surface in the worker console
    try {
      offscreen.render(/* @__PURE__ */ (<Scene />));
      // eslint-disable-next-line no-console
      console.log('[offscreen-worker] render() invoked successfully');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[offscreen-worker] render() failed:', err);
      // Surface to main thread for Canvas fallback decision
      self.postMessage({ type: 'error', payload: String(err) });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[offscreen-worker] dynamic import failed:', err);
    self.postMessage({ type: 'error', payload: String(err) });
  }
})();
