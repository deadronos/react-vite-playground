import { cleanup, screen } from '@testing-library/react';
import { act } from 'react';
import { beforeEach, afterEach, test, expect } from 'vitest';
// Add jest-dom matchers
import '@testing-library/jest-dom';

// Polyfill ResizeObserver for the test environment (jsdom doesn't include it)
if (typeof (globalThis as any).ResizeObserver === 'undefined') {
  class ResizeObserverPolyfill {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  ;(globalThis as any).ResizeObserver = ResizeObserverPolyfill
}

beforeEach(() => {
  const el = document.createElement('div');
  el.id = 'root';
  document.body.appendChild(el);
});

afterEach(() => {
  cleanup();
  const root = document.getElementById('root');
  root?.parentNode?.removeChild(root);
});

test('main mounts App into #root', async () => {
  await act(async () => {
    await import('./main');
  });

  // Use a resilient, case-insensitive findByText and assert presence
  const el = await screen.findByText(/Deadronos Collection/i);
  expect(el).toBeInTheDocument();
});
