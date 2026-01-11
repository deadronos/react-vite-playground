console.log('[offscreen-worker] module loaded');

import { render } from '@react-three/offscreen';
import Scene from './Scene';

// Defensive: wrap render in try/catch and log so we can see runtime errors in worker console
try {
  render(<Scene />);
  console.log('[offscreen-worker] render() invoked successfully');
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('[offscreen-worker] render() failed:', err);
}
