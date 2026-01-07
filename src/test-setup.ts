import ResizeObserver from 'resize-observer-polyfill';
import '@testing-library/jest-dom/vitest';

global.ResizeObserver = ResizeObserver;
