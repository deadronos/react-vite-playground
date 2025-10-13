# Technical Context

## Technologies

- React 19 + TypeScript
- Vite (development & build)
- React Three Fiber (`@react-three/fiber`) + `three` for 3D examples
- Vitest for unit tests and coverage
- Playwright for browser/e2e (when added)
- ESLint + Prettier for linting and formatting

## Development setup

Commands (from project root):

- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Run unit tests: `npm test`
- Run tests with coverage: `npm run coverage`
- Build: `npm run build`

## Constraints & notes

- This repository is intentionally lightweight; avoid adding heavy infra or
  production-only services here. Keep examples small and focused.
