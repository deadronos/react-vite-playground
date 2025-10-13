# DESIGN001 - Initial Architecture

**Status:** Draft  
**Added:** 2025-10-13

## Summary

Minimal architecture for a developer-focused playground:

- Vite dev server for fast iteration.
- TypeScript + React for components and examples.
- React Three Fiber for 3D examples kept inside isolated components.

## Interfaces and data flow

- `main.tsx` mounts `App`.
- `App` routes between simple example sections and composes the r3f
  container with `ErrorBoundary`.

## Acceptance

- Developers can clone, install, run `npm run dev`, and open examples within
  60 seconds of setup.
