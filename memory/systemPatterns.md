# System Patterns

## Architecture

- Vite development server hosting a TypeScript React application.
- Application root renders `App` which composes UI and feature components
  (including r3f stage in `src/components/r3fview.tsx`).
- Testing: Vitest for unit tests, Playwright for end-to-end when needed.

## Key technical decisions

- Use Vite for fast HMR and small dev feedback loops.
- Prefer composition over inheritance for UI components.
- Keep r3f components isolated to a small set of well-documented hooks and
  containers to minimize coupling.

## Patterns in use

- Error Boundary pattern (`ErrorBoundary.tsx`) to guard example scenes.
- Small, focused components with clear props and plain JS/TS logic for
  testability.
- Memory Bank for recording decisions, requirements, and tasks.

## Component relationships

- `main.tsx` -> `App` -> feature components (template, r3f view, error
  boundary) -> examples and playground sections.
